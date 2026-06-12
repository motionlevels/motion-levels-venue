package main

import (
	"bufio"
	"context"
	"flag"
	"log"
	"math"
	"net"
	"os"
	"time"

	"strings"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/audio"
	"github.com/lobis/motion-levels/game-engine/internal/games/parkour"
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
	TestAudio              bool
	ReplayRecordingPath    string
	ReplayKeyframeInterval time.Duration
	ReplayZstdPath         string
	DisplaySnapshotFPS     int
	PlatformURL            string
	PlatformToken          string
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
	flag.StringVar(&cfg.Game, "game", "animations", "game to run: animations, animation-random, ambient-comet, ambient-pulse, ambient-spark, whack-a-mole, lava, saltos, parkour, parkour2, plataformas, temporada1, temporada2, duel, memory, or patrones")
	flag.StringVar(&cfg.Difficulty, "difficulty", "easy", "difficulty for games that support it: easy, medium, hard, expert")
	flag.StringVar(&cfg.Level, "level", "starter", "level for games that support level selection")
	flag.IntVar(&cfg.PlayerCount, "players", 1, "number of players for focused games")
	flag.IntVar(&cfg.FPS, "fps", 50, "frames per second")
	flag.IntVar(&cfg.Brightness, "brightness", 80, "brightness percentage, 1-100")
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
	flag.Float64Var(&cfg.CueVolume, "cue-volume", 0.18, "cue volume, 0.0-1.0")
	flag.BoolVar(&cfg.TestAudio, "audio-test", false, "play configured start cue and music briefly, then exit")
	flag.StringVar(&cfg.ReplayRecordingPath, "record-replay", "game-recordings", "directory for unified .mlreplay.zst session recordings; empty disables replay recording")
	flag.DurationVar(&cfg.ReplayKeyframeInterval, "replay-keyframe-interval", 5*time.Second, "maximum time between full replay floor keyframes")
	flag.StringVar(&cfg.ReplayZstdPath, "replay-zstd-path", "zstd", "path to zstd executable for replay compression")
	flag.IntVar(&cfg.DisplaySnapshotFPS, "display-snapshot-fps", 4, "display snapshots per second to write into game session recordings")
	flag.StringVar(&cfg.PlatformURL, "platform-url", os.Getenv("MOTION_LEVELS_PLATFORM_URL"), "platform base URL for session ingest; empty disables")
	flag.StringVar(&cfg.PlatformToken, "platform-token", os.Getenv("MOTION_LEVELS_PLATFORM_TOKEN"), "platform bearer token for session ingest; can also use MOTION_LEVELS_PLATFORM_TOKEN")
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
	})
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := replayRecorder.Close(); err != nil {
			log.Printf("replay recorder close: %v", err)
		}
	}()

	runtime := newGameRuntime(cfg, audioPlayer, replayRecorder)
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
	if c.Game == "saltos" {
		c.Level = saltos.NormalizeLevel(c.Level)
		c.PlayerCount = 1
	} else if c.Game == "parkour" {
		c.Level = parkour.NormalizeLevel(c.Level)
		c.PlayerCount = 1
	} else if c.Game == "plataformas" || c.Game == "parkour2" {
		c.Level = plataformas.NormalizeLevel(c.Level)
		if c.Game == "parkour2" {
			c.PlayerCount = 1
		}
	} else if c.Game == "temporada1" {
		c.Level = temporada1.NormalizeLevel(c.Level)
	} else if c.Game == "temporada2" {
		c.Level = temporada2.NormalizeLevel(c.Level)
		c.Difficulty = string(temporada2.NormalizeDifficulty(c.Difficulty))
	} else if c.Game == "duel" {
		c.PlayerCount = clampInt(c.PlayerCount, 2, 4)
	} else if c.Game == "memory" {
		c.PlayerCount = clampInt(c.PlayerCount, 1, 4)
	} else if c.Game == "patrones" {
		c.Level = patrones.NormalizeLevel(c.Level)
		c.PlayerCount = clampInt(c.PlayerCount, 1, 6)
	} else {
		c.Level = ""
	}
	if c.PlayerCount < 1 {
		c.PlayerCount = 1
	}
	if c.PlayerCount > 6 {
		c.PlayerCount = 6
	}
	if c.FPS < 1 {
		c.FPS = 1
	}
	if c.DisplaySnapshotFPS < 1 {
		c.DisplaySnapshotFPS = 1
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
		if c.Game != "animations" && c.Game != "animation-random" {
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

	startedAt := time.Now()
	if runtime != nil && cfg.PressureAddr != "" {
		go pressureEventLoop(ctx, cfg, runtime, startedAt)
	}
	var sequence uint64
	for now := range ticker.C {
		sequence++
		frame := makeFrame(sequence, now, now.Sub(startedAt).Seconds(), runtime)
		if replayRecorder, ok := runtime.recorder.(interface {
			RecordFrame(*recordingpb.FrameRecord) error
		}); ok {
			if err := replayRecorder.RecordFrame(frame); err != nil {
				log.Printf("replay frame: %v", err)
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

func handlePressureEvent(cfg config, audioPlayer *audio.Player, game floorGame, startedAt time.Time, event *inputpb.PressureEvent) {
	if event == nil {
		return
	}
	now := time.Now()
	if event.UnixNanos > 0 {
		now = time.Unix(0, event.UnixNanos)
	}
	if game != nil {
		for _, gameEvent := range game.Press(whackamole.PressEvent{X: int(event.X), Y: int(event.Y), Pressed: event.Pressed}, now) {
			playCue(cfg, audioPlayer, gameEvent.Cue, cueRef(cfg, gameEvent.Cue))
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
	if strings.HasPrefix(value, "authored-") {
		return value
	}
	if strings.HasPrefix(value, "animation-") {
		return value
	}
	switch value {
	case "whack-a-mole", "whackamole", "mole":
		return "whack-a-mole"
	case "lava", "floor-is-lava", "el-suelo-es-lava":
		return "lava"
	case "saltos", "jump", "salta", "salto":
		return "saltos"
	case "parkour", "pk":
		return "parkour"
	case "parkour2", "parkour-2", "parkour-2.0", "parkour2.0", "parkour-20":
		return "parkour2"
	case "plataformas", "platforms", "cloud-platforms":
		return "plataformas"
	case "temporada1", "temporada-1", "season1", "season-1":
		return "temporada1"
	case "temporada2", "temporada-2", "season2", "season-2":
		return "temporada2"
	case "duel", "duelo", "versus-duel":
		return "duel"
	case "memory", "memory-challenge", "memoria", "reto-memoria":
		return "memory"
	case "patrones", "patterns", "pattern", "reto-patrones":
		return "patrones"
	case "animations", "loop", "animation-random", "ambient-random", "random-animation", "ambient-comet", "ambient-pulse", "ambient-spark":
		if value == "ambient-random" || value == "random-animation" {
			return "animation-random"
		}
		return value
	default:
		return "animations"
	}
}

func normalizeDifficulty(value string) string {
	switch value {
	case "medium", "hard", "expert":
		return value
	default:
		return "easy"
	}
}

func makeFrame(sequence uint64, now time.Time, seconds float64, runtime *gameRuntime) *recordingpb.FrameRecord {
	brightness := 80
	var gameColors []animation.RGB
	sessionID := ""
	venueSessionID := ""
	if runtime != nil {
		brightness, gameColors = runtime.Render(now)
		sessionID = runtime.SessionID()
		venueSessionID = runtime.VenueSessionID()
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
