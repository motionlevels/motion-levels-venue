package main

import (
	"bufio"
	"context"
	"flag"
	"log"
	"math"
	"net"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/audio"
	"github.com/lobis/motion-levels/game-engine/internal/games/authored"
	"github.com/lobis/motion-levels/game-engine/internal/games/patrones"
	"github.com/lobis/motion-levels/game-engine/internal/games/plataformas"
	"github.com/lobis/motion-levels/game-engine/internal/games/saltos"
	"github.com/lobis/motion-levels/game-engine/internal/games/temporada1"
	"github.com/lobis/motion-levels/game-engine/internal/games/temporada2"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/lobis/motion-levels/game-engine/internal/replay"
	"github.com/lobis/motion-levels/packages/contracts/inputpb"
	"github.com/lobis/motion-levels/packages/contracts/pbstream"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
)

type config struct {
	HTTPAddr               string
	ControllerAddr         string
	PressureAddr           string
	Game                   string
	VenueSessionID         string
	Difficulty             string
	Level                  string
	LevelMode              string
	DurationSeconds        int
	ChallengeElapsedMillis int64
	ChallengeAttemptCount  int
	PlayerCount            int
	TeamName               string
	Players                []playerConfig
	FPS                    int
	Brightness             int
	AudioEnabled           bool
	AudioAssetsDir         string
	AudioPlayer            string
	MusicRef               string
	MusicVolume            float64
	StartCueRef            string
	CueVolume              float64
	CoinCueRef             string
	DoubleCoinCueRef       string
	DamageCueRef           string
	WinCueRef              string
	DefeatCueRef           string
	PressureCueRef         string
	NarrationCueRef        string
	NarrationVolume        float64
	CountdownCueRef        string
	CountdownVolume        float64
	CountdownFloorOverlay  bool
	TestAudio              bool
	ReplayRecordingPath    string
	ReplayKeyframeInterval time.Duration
	ReplayZstdPath         string
	ReplayMaxLocalBytes    int64
	ReplayKeepLocal        bool
	DisplaySnapshotFPS     int
	CameraRecorderURL      string
	CameraRecorderTimeout  time.Duration
	AuthoredRuntime        string
	PlatformURL            string
	PlatformToken          string
	PlatformAssetCacheDir  string
	PlatformSyncInterval   time.Duration
	VenueIdleTimeout       time.Duration
	ControllerID           string
	ControllerIDFile       string
	ControllerLabel        string
	ControllerHostname     string
}

type floorGame interface {
	Render(now time.Time) []animation.RGB
	Press(event whackamole.PressEvent, now time.Time) []whackamole.Event
}

func main() {
	cfg := config{}
	flag.StringVar(&cfg.HTTPAddr, "http", "127.0.0.1:4102", "HTTP address for the game-engine API; empty disables")
	flag.StringVar(&cfg.ControllerAddr, "controller", "127.0.0.1:4201", "floor-controller frame stream address")
	flag.StringVar(&cfg.PressureAddr, "pressure-events", "127.0.0.1:4202", "floor-controller pressure event stream address")
	flag.StringVar(&cfg.Game, "game", "salvapantallas", "game to run: salvapantallas, animations, ambient-comet, ambient-pulse, ambient-spark, whack-a-mole, lava, saltos, parkour, plataformas, temporada1-niveles, temporada1, temporada2, duel, memory, or patrones")
	flag.StringVar(&cfg.Difficulty, "difficulty", "easy", "difficulty for games that support it: easy, medium, hard, expert")
	flag.StringVar(&cfg.Level, "level", "starter", "level for games that support level selection")
	flag.IntVar(&cfg.PlayerCount, "players", 1, "number of players for focused games")
	flag.IntVar(&cfg.FPS, "fps", 50, "frames per second")
	flag.IntVar(&cfg.Brightness, "brightness", 100, "brightness percentage, 1-100")
	flag.BoolVar(&cfg.AudioEnabled, "audio", false, "enable local audio playback through the OS default output")
	flag.StringVar(&cfg.AudioAssetsDir, "audio-assets", "content/audio", "directory containing audio assets")
	flag.StringVar(&cfg.AudioPlayer, "audio-player", "", "audio player executable; empty auto-detects afplay/mpv/ffplay/mpg123")
	flag.StringVar(&cfg.MusicRef, "music", "Motion/canciones/Background01.mp3", "background music asset ref, relative to audio-assets or absolute")
	flag.Float64Var(&cfg.MusicVolume, "music-volume", 0.10, "background music volume, 0.0-1.0")
	flag.StringVar(&cfg.StartCueRef, "start-cue", "Motion/sonidos/aparecer.mp3", "start cue asset ref, relative to audio-assets or absolute")
	flag.StringVar(&cfg.CoinCueRef, "coin-cue", "Motion/sonidos/coin.wav", "coin cue asset ref, preloaded for instant press feedback")
	flag.StringVar(&cfg.DoubleCoinCueRef, "double-coin-cue", "", "double coin cue asset ref; empty reuses coin-cue twice for purple tile feedback")
	flag.StringVar(&cfg.DamageCueRef, "damage-cue", "Motion/sonidos/fallo.mp3", "damage cue asset ref, preloaded for instant press feedback")
	flag.StringVar(&cfg.WinCueRef, "win-cue", "Motion/sonidos/victoria.mp3", "win cue asset ref, preloaded for game completion feedback")
	flag.StringVar(&cfg.DefeatCueRef, "defeat-cue", "", "defeat cue asset ref; empty reuses damage-cue for failed level feedback")
	flag.StringVar(&cfg.PressureCueRef, "pressure-cue", "", "pressure cue asset ref for animation touch effects")
	flag.StringVar(&cfg.NarrationCueRef, "narration-cue", "", "narration asset ref; empty uses the selected game's default narration")
	flag.Float64Var(&cfg.NarrationVolume, "narration-volume", 0.85, "narration volume, 0.0-1.0")
	flag.StringVar(&cfg.CountdownCueRef, "countdown-cue", "Motion/narraciones/countdown-tres-dos-uno-vamos.mp3", "countdown narration asset ref; empty disables countdown narration")
	flag.Float64Var(&cfg.CountdownVolume, "countdown-volume", 0.90, "countdown narration volume, 0.0-1.0")
	flag.BoolVar(&cfg.CountdownFloorOverlay, "countdown-floor-overlay", false, "show a yellow 3-2-1 overlay on the floor during the game countdown")
	flag.Float64Var(&cfg.CueVolume, "cue-volume", 0.45, "cue volume, 0.0-1.0")
	flag.BoolVar(&cfg.TestAudio, "audio-test", false, "play configured start cue and music briefly, then exit")
	flag.StringVar(&cfg.ReplayRecordingPath, "record-replay", "game-recordings", "directory for unified .mlreplay.zst session recordings; empty disables replay recording")
	flag.DurationVar(&cfg.ReplayKeyframeInterval, "replay-keyframe-interval", 5*time.Second, "maximum time between full replay floor keyframes")
	flag.StringVar(&cfg.ReplayZstdPath, "replay-zstd-path", "zstd", "path to zstd executable for replay compression")
	flag.Int64Var(&cfg.ReplayMaxLocalBytes, "replay-max-local-bytes", int64Env("MOTION_LEVELS_REPLAY_MAX_LOCAL_BYTES", 512*1024*1024), "maximum bytes for one active local replay file before discarding it; 0 disables the cap")
	flag.BoolVar(&cfg.ReplayKeepLocal, "replay-keep-local", true, "keep replay files locally when platform upload is not configured")
	flag.IntVar(&cfg.DisplaySnapshotFPS, "display-snapshot-fps", 4, "display snapshots per second to write into game session recordings")
	flag.StringVar(&cfg.CameraRecorderURL, "camera-recorder-url", os.Getenv("MOTION_LEVELS_CAMERA_RECORDER_URL"), "local camera recorder API base URL; empty disables external video recording")
	flag.DurationVar(&cfg.CameraRecorderTimeout, "camera-recorder-timeout", durationEnv("MOTION_LEVELS_CAMERA_RECORDER_TIMEOUT", 2*time.Second), "HTTP timeout for camera recorder API calls")
	flag.StringVar(&cfg.AuthoredRuntime, "authored-runtime", "auto", "runtime for motion-go-v1 games: auto, native, or wasm")
	flag.StringVar(&cfg.PlatformURL, "platform-url", os.Getenv("MOTION_LEVELS_PLATFORM_URL"), "platform base URL for session ingest; empty disables")
	flag.StringVar(&cfg.PlatformToken, "platform-token", os.Getenv("MOTION_LEVELS_PLATFORM_TOKEN"), "platform bearer token for session ingest; can also use MOTION_LEVELS_PLATFORM_TOKEN")
	flag.StringVar(&cfg.PlatformAssetCacheDir, "platform-asset-cache", nonEmptyEnv("MOTION_LEVELS_PLATFORM_ASSET_CACHE_DIR", "/var/lib/motion-levels/platform-asset-cache"), "directory for cached platform preview assets")
	flag.DurationVar(&cfg.PlatformSyncInterval, "platform-sync-interval", time.Second, "how often to publish session state to the platform")
	flag.DurationVar(&cfg.VenueIdleTimeout, "venue-session-idle-timeout", defaultVenueIdleLimit, "end the venue session after this much inactivity; 0 keeps the built-in default")
	flag.StringVar(&cfg.ControllerID, "controller-id", "", "stable controller UUID to attach platform session records to")
	flag.StringVar(&cfg.ControllerIDFile, "controller-id-file", "", "file containing the stable controller UUID")
	flag.StringVar(&cfg.ControllerLabel, "controller-label", os.Getenv("MOTION_LEVELS_CONTROLLER_LABEL"), "human-readable room/venue name shown on the platform (e.g. \"Zaragoza Caracol 1\")")
	flag.StringVar(&cfg.ControllerHostname, "controller-hostname", os.Getenv("MOTION_LEVELS_CONTROLLER_HOSTNAME"), "tailnet hostname (e.g. motionlevels-1) used for platform gateway links; decoupled from the display label")
	flag.Parse()

	cfg.normalize()

	audioPlayer, err := cfg.audioPlayer()
	if err != nil {
		log.Fatal(err)
	}
	if audioPlayer != nil {
		if err := audioPlayer.Preload(preloadAudioRefs(cfg)...); err != nil {
			log.Fatal(err)
		}
	}
	if cfg.TestAudio {
		if err := runAudioTest(audioPlayer, cfg); err != nil {
			log.Fatal(err)
		}
		return
	}

	controllerID, err := resolveControllerID(cfg)
	if err != nil {
		log.Printf("replay controller id: %v", err)
	}
	replayRecorder, err := replay.New(cfg.ReplayRecordingPath, replay.Options{
		ControllerID:      controllerID,
		PlatformURL:       cfg.PlatformURL,
		PlatformToken:     cfg.PlatformToken,
		ZstdPath:          cfg.ReplayZstdPath,
		KeyframeInterval:  cfg.ReplayKeyframeInterval,
		UploadHTTPTimeout: 5 * time.Minute,
		MaxLocalBytes:     cfg.ReplayMaxLocalBytes,
		RemoveLocalOnly:   !cfg.ReplayKeepLocal,
	})
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := replayRecorder.Close(); err != nil {
			log.Printf("replay recorder close: %v", err)
		}
	}()

	cameraRecorder := newHTTPCameraRecorder(cfg.CameraRecorderURL, cfg.CameraRecorderTimeout)
	defer func() {
		if err := cameraRecorder.Close(); err != nil {
			log.Printf("camera recorder close: %v", err)
		}
	}()

	runtime := newGameRuntime(cfg, audioPlayer, replayRecorder)
	runtime.SetCameraRecorder(cameraRecorder)
	runtime.StartDisplaySnapshotRecording(displaySnapshotInterval(cfg.DisplaySnapshotFPS))
	startPlatformSync(runtime, cfg)
	go serveGameAPI(cfg.HTTPAddr, runtime)
	for {
		if err := run(cfg, runtime); err != nil {
			log.Printf("game-engine stream ended: %v", err)
			time.Sleep(time.Second)
		}
	}
}

func (c *config) normalize() {
	c.Game = normalizeGame(c.Game)
	c.Difficulty = normalizeDifficulty(c.Difficulty)
	if strings.HasPrefix(c.Game, "authored-") {
		normalizeAuthoredGameConfig(c)
	} else if isPlatformLevelGameID(c.Game) || c.Game == "plataformas" || c.Game == "parkour" || c.Game == "temporada1-niveles" {
		c.Level = plataformas.NormalizeLevel(c.Level)
		if c.Game == "parkour" {
			c.PlayerCount = 1
		}
	} else if c.Game == "temporada1" {
		c.Level = temporada1.NormalizeLevel(c.Level)
	} else if c.Game == "temporada2" {
		c.Level = temporada2.NormalizeLevel(c.Level)
		c.Difficulty = string(temporada2.NormalizeDifficulty(c.Difficulty))
	} else {
		c.Level = ""
	}
	if c.PlayerCount < 1 {
		c.PlayerCount = 1
	}
	if c.PlayerCount > maxConfigPlayers(c.Game) {
		c.PlayerCount = maxConfigPlayers(c.Game)
	}
	if c.FPS < 1 {
		c.FPS = 1
	}
	if c.DisplaySnapshotFPS < 1 {
		c.DisplaySnapshotFPS = 1
	}
	switch strings.ToLower(strings.TrimSpace(c.AuthoredRuntime)) {
	case "native", "wasm":
		c.AuthoredRuntime = strings.ToLower(strings.TrimSpace(c.AuthoredRuntime))
	default:
		c.AuthoredRuntime = "auto"
	}
	if c.DurationSeconds < 0 {
		c.DurationSeconds = 0
	}
	c.LevelMode = normalizeLevelMode(c.LevelMode)
	if c.ChallengeElapsedMillis < 0 {
		c.ChallengeElapsedMillis = 0
	}
	if c.ChallengeAttemptCount < 0 {
		c.ChallengeAttemptCount = 0
	}
	if c.ReplayKeyframeInterval <= 0 {
		c.ReplayKeyframeInterval = 5 * time.Second
	}
	if c.ReplayZstdPath == "" {
		c.ReplayZstdPath = "zstd"
	}
	if c.Brightness < 1 {
		c.Brightness = 1
	}
	if c.Brightness > 100 {
		c.Brightness = 100
	}
	c.MusicVolume = clamp01(c.MusicVolume)
	c.CueVolume = clamp01(c.CueVolume)
	c.NarrationVolume = clamp01(c.NarrationVolume)
	c.CountdownVolume = clamp01(c.CountdownVolume)
	if c.MusicRef == "" || c.MusicRef == loopMusicRef {
		musicRef, musicVolume := defaultMusicForGame(c.Game)
		c.MusicRef = musicRef
		if c.Game != "animations" && c.Game != "salvapantallas" {
			c.MusicVolume = musicVolume
		}
	}
	if c.DoubleCoinCueRef == "" {
		c.DoubleCoinCueRef = c.CoinCueRef
	}
	if c.DefeatCueRef == "" {
		c.DefeatCueRef = c.DamageCueRef
	}
	if c.NarrationCueRef == "" {
		c.NarrationCueRef = defaultNarrationRef(c.Game)
	}
}

func displaySnapshotInterval(fps int) time.Duration {
	if fps < 1 {
		fps = 1
	}
	return time.Duration(float64(time.Second) / float64(fps))
}

func nonEmptyEnv(key string, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}

func int64Env(key string, fallback int64) int64 {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	parsed, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return fallback
	}
	return parsed
}

func durationEnv(key string, fallback time.Duration) time.Duration {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	parsed, err := time.ParseDuration(value)
	if err != nil {
		return fallback
	}
	return parsed
}

func (c config) audioPlayer() (*audio.Player, error) {
	if !c.AudioEnabled && !c.TestAudio {
		return nil, nil
	}
	return audio.NewSystemPlayer(c.AudioAssetsDir, c.AudioPlayer)
}

func runAudioTest(player *audio.Player, cfg config) error {
	if player == nil {
		return nil
	}
	if cfg.StartCueRef != "" {
		if err := player.PlayCue(cfg.StartCueRef, cfg.CueVolume); err != nil {
			return err
		}
	}
	for i := 0; i < 4; i++ {
		if cfg.CoinCueRef != "" {
			if err := player.PlayCue(cfg.CoinCueRef, cfg.CueVolume); err != nil {
				return err
			}
		}
		time.Sleep(70 * time.Millisecond)
		if cfg.DoubleCoinCueRef != "" {
			if err := player.PlayCue(cfg.DoubleCoinCueRef, cfg.CueVolume); err != nil {
				return err
			}
		}
		time.Sleep(120 * time.Millisecond)
		if cfg.DamageCueRef != "" {
			if err := player.PlayCue(cfg.DamageCueRef, cfg.CueVolume); err != nil {
				return err
			}
		}
		time.Sleep(120 * time.Millisecond)
	}
	if cfg.MusicRef != "" {
		if err := player.StartLoop(cfg.MusicRef, cfg.MusicVolume); err != nil {
			return err
		}
		time.Sleep(5 * time.Second)
		player.StopLoop()
	}
	if cfg.NarrationCueRef != "" {
		if err := player.PlayCue(cfg.NarrationCueRef, cfg.NarrationVolume); err != nil {
			return err
		}
		time.Sleep(3 * time.Second)
	}
	if cfg.CountdownCueRef != "" {
		if err := player.PlayCue(cfg.CountdownCueRef, cfg.CountdownVolume); err != nil {
			return err
		}
		time.Sleep(3 * time.Second)
	}
	return nil
}

func run(cfg config, runtime *gameRuntime) error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	conn, err := net.Dial("tcp", cfg.ControllerAddr)
	if err != nil {
		return err
	}
	defer conn.Close()
	log.Printf("connected to floor-controller: %s", cfg.ControllerAddr)

	writer := bufio.NewWriterSize(conn, 1<<20)
	ticker := time.NewTicker(time.Duration(float64(time.Second) / float64(cfg.FPS)))
	defer ticker.Stop()
	frameInterval := time.Duration(float64(time.Second) / float64(cfg.FPS))

	startedAt := time.Now()
	if runtime != nil && cfg.PressureAddr != "" {
		go pressureEventLoop(ctx, cfg, runtime, startedAt)
	}
	var sequence uint64
	var lastReplayFrame *recordingpb.FrameRecord
	for now := range ticker.C {
		sequence++
		frame := makeFrame(sequence, now, now.Sub(startedAt).Seconds(), runtime)
		if replayRecorder, ok := runtime.recorder.(interface {
			RecordFrame(*recordingpb.FrameRecord) error
		}); ok {
			for _, catchUpFrame := range replayCatchUpFrames(lastReplayFrame, frame, frameInterval) {
				if err := replayRecorder.RecordFrame(catchUpFrame); err != nil {
					log.Printf("replay catch-up frame: %v", err)
				}
				lastReplayFrame = catchUpFrame
			}
			sequence = frame.GetSequence()
			if err := replayRecorder.RecordFrame(frame); err != nil {
				log.Printf("replay frame: %v", err)
			}
			if strings.TrimSpace(frame.GetSessionId()) != "" {
				lastReplayFrame = cloneFrameRecord(frame)
			} else {
				lastReplayFrame = nil
			}
		}
		if err := pbstream.Write(writer, frame); err != nil {
			return err
		}
		if err := writer.Flush(); err != nil {
			return err
		}
	}
	return nil
}

func pressureEventLoop(ctx context.Context, cfg config, runtime *gameRuntime, startedAt time.Time) {
	for {
		if ctx.Err() != nil {
			return
		}
		conn, err := net.Dial("tcp", cfg.PressureAddr)
		if err != nil {
			log.Printf("pressure stream: %v", err)
			select {
			case <-ctx.Done():
				return
			case <-time.After(time.Second):
			}
			continue
		}
		log.Printf("connected to pressure events: %s", cfg.PressureAddr)
		reader := bufio.NewReader(conn)
		for {
			var event inputpb.PressureEvent
			if err := pbstream.Read(reader, &event); err != nil {
				_ = conn.Close()
				log.Printf("pressure stream ended: %v", err)
				break
			}
			if runtime != nil {
				runtime.HandlePressure(&event, startedAt)
			}
		}
	}
}

func playCue(cfg config, audioPlayer *audio.Player, cue string, ref string) {
	if audioPlayer == nil {
		return
	}
	if ref == "" {
		return
	}
	if err := audioPlayer.PlayCue(ref, cfg.CueVolume); err != nil {
		log.Printf("pressure audio: %v", err)
	}
	if cue == whackamole.CueDoubleCoin {
		go func() {
			time.Sleep(70 * time.Millisecond)
			if err := audioPlayer.PlayCue(ref, cfg.CueVolume); err != nil {
				log.Printf("pressure audio: %v", err)
			}
		}()
	}
}

func cueRef(cfg config, cue string) string {
	switch cue {
	case whackamole.CueStart:
		return cfg.StartCueRef
	case whackamole.CueHit, whackamole.CueCoin:
		return cfg.CoinCueRef
	case whackamole.CueDoubleCoin:
		return cfg.DoubleCoinCueRef
	case whackamole.CueMiss, whackamole.CueDamage:
		return cfg.DamageCueRef
	case whackamole.CueWin:
		return cfg.WinCueRef
	case whackamole.CueDefeat:
		return cfg.DefeatCueRef
	case whackamole.CuePressure:
		return cfg.PressureCueRef
	default:
		return ""
	}
}

func clamp01(value float64) float64 {
	if value < 0 {
		return 0
	}
	if value > 1 {
		return 1
	}
	return value
}

func normalizeGame(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	if strings.HasPrefix(value, "authored-") {
		return value
	}
	if strings.HasPrefix(value, "animation-") {
		return value
	}
	if isPlatformLevelGameID(value) {
		return strings.ToLower(value)
	}
	switch value {
	case "whack-a-mole", "whackamole", "mole":
		return "authored-whack-a-mole-go"
	case "lava", "floor-is-lava", "el-suelo-es-lava":
		return "authored-lava"
	case "saltos", "jump", "salta", "salto":
		return "authored-saltos"
	case "parkour", "pk", "parkour2", "parkour-2", "parkour-2.0", "parkour2.0", "parkour-20":
		return "parkour"
	case "plataformas", "platforms", "cloud-platforms":
		return "plataformas"
	case "temporada1-niveles", "temporada-1-niveles", "temporada1-levels", "season1-levels", "season-1-levels":
		return "temporada1-niveles"
	case "temporada1", "temporada-1", "season1", "season-1":
		return "temporada1"
	case "temporada2", "temporada-2", "season2", "season-2":
		return "temporada2"
	case "duel", "duelo", "versus-duel":
		return "authored-duel"
	case "memory", "memory-challenge", "memoria", "reto-memoria":
		return "authored-memory-challenge"
	case "patrones", "patterns", "pattern", "reto-patrones":
		return "authored-patrones"
	case "salvapantallas", "screensaver", "screen-saver":
		return "salvapantallas"
	case "animations", "ambient-comet", "ambient-pulse", "ambient-spark":
		return value
	default:
		return "salvapantallas"
	}
}

func normalizeAuthoredGameConfig(c *config) {
	switch c.Game {
	case "authored-patrones":
		c.Level = patrones.NormalizeLevel(c.Level)
	case "authored-saltos":
		c.Level = saltos.NormalizeLevel(c.Level)
	}
	minPlayers, maxPlayers := 1, maxAuthoredPlayers
	if entry, ok := authored.NativeCatalogEntry(c.Game); ok {
		minPlayers = clampInt(entry.MinPlayers, 1, maxAuthoredPlayers)
		maxPlayers = clampInt(entry.MaxPlayers, minPlayers, maxAuthoredPlayers)
	}
	c.PlayerCount = clampInt(c.PlayerCount, minPlayers, maxPlayers)
}

// maxAuthoredPlayers matches the motion-go start-pad limit; the floor fits
// eight 4x4 pads, so authored games may advertise up to eight players.
const maxAuthoredPlayers = 8

func maxConfigPlayers(game string) int {
	if strings.HasPrefix(game, "authored-") {
		return maxAuthoredPlayers
	}
	return 6
}

func isPlatformLevelGameID(value string) bool {
	return uuidPattern.MatchString(strings.TrimSpace(value))
}

func normalizeDifficulty(value string) string {
	switch value {
	case "medium", "hard", "expert":
		return value
	default:
		return "easy"
	}
}

func normalizeLevelMode(value string) string {
	switch strings.TrimSpace(strings.ToLower(value)) {
	case "challenge", "reto":
		return "challenge"
	case "free", "libre":
		return "free"
	default:
		return ""
	}
}

func makeFrame(sequence uint64, now time.Time, seconds float64, runtime *gameRuntime) *recordingpb.FrameRecord {
	brightness := 100
	var gameColors []animation.RGB
	sessionID := ""
	venueSessionID := ""
	if runtime != nil {
		brightness, gameColors = runtime.Render(now)
		sessionID = runtime.SessionID()
		venueSessionID = runtime.VenueSessionID()
		gameColors = runtime.ApplyCountdownOverlay(now, gameColors)
	}
	scale := float64(brightness) / 100
	frame := &recordingpb.FrameRecord{
		Sequence:          sequence,
		UnixNanos:         now.UnixNano(),
		Width:             animation.GridWidth,
		Height:            animation.GridHeight,
		SessionId:         sessionID,
		VenueSessionId:    venueSessionID,
		GameFrameSequence: sequence,
		GameUnixNanos:     now.UnixNano(),
		Tiles:             make([]*recordingpb.TileState, 0, animation.GridWidth*animation.GridHeight),
	}
	for y := 0; y < animation.GridHeight; y++ {
		for x := 0; x < animation.GridWidth; x++ {
			color := animation.Color("animations", x, y, seconds)
			if len(gameColors) == animation.GridWidth*animation.GridHeight {
				color = gameColors[y*animation.GridWidth+x]
			}
			frame.Tiles = append(frame.Tiles, &recordingpb.TileState{
				X: uint32(x),
				Y: uint32(y),
				R: uint32(math.Round(float64(color.R) * scale)),
				G: uint32(math.Round(float64(color.G) * scale)),
				B: uint32(math.Round(float64(color.B) * scale)),
			})
		}
	}
	return frame
}

const maxReplayCatchUpFrames = 600

func replayCatchUpFrames(previous *recordingpb.FrameRecord, current *recordingpb.FrameRecord, frameInterval time.Duration) []*recordingpb.FrameRecord {
	if previous == nil || current == nil || frameInterval <= 0 {
		return nil
	}
	if strings.TrimSpace(previous.GetSessionId()) == "" || previous.GetSessionId() != current.GetSessionId() {
		return nil
	}
	previousTime := time.Unix(0, previous.GetUnixNanos())
	currentTime := time.Unix(0, current.GetUnixNanos())
	if !currentTime.After(previousTime) {
		return nil
	}
	tolerance := frameInterval / 2
	if tolerance <= 0 {
		tolerance = frameInterval
	}
	nextSequence := current.GetSequence()
	frames := make([]*recordingpb.FrameRecord, 0)
	for expected := previousTime.Add(frameInterval); !expected.Add(tolerance).After(currentTime); expected = expected.Add(frameInterval) {
		catchUp := cloneFrameRecord(previous)
		setFrameRecordSequence(catchUp, nextSequence)
		catchUp.UnixNanos = expected.UnixNano()
		if catchUp.GetGameUnixNanos() != 0 {
			catchUp.GameUnixNanos = expected.UnixNano()
		}
		frames = append(frames, catchUp)
		nextSequence++
		if len(frames) >= maxReplayCatchUpFrames {
			break
		}
	}
	if len(frames) > 0 {
		setFrameRecordSequence(current, nextSequence)
	}
	return frames
}

func setFrameRecordSequence(frame *recordingpb.FrameRecord, sequence uint64) {
	if frame == nil {
		return
	}
	previousSequence := frame.GetSequence()
	frame.Sequence = sequence
	if frame.GetGameFrameSequence() == 0 || frame.GetGameFrameSequence() == previousSequence {
		frame.GameFrameSequence = sequence
	}
}

func cloneFrameRecord(frame *recordingpb.FrameRecord) *recordingpb.FrameRecord {
	if frame == nil {
		return nil
	}
	clone := *frame
	clone.Tiles = make([]*recordingpb.TileState, len(frame.GetTiles()))
	for i, tile := range frame.GetTiles() {
		if tile == nil {
			continue
		}
		tileClone := *tile
		clone.Tiles[i] = &tileClone
	}
	return &clone
}
