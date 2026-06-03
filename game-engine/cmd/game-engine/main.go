package main

import (
	"bufio"
	"context"
	"flag"
	"log"
	"math"
	"net"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/audio"
	"github.com/lobis/motion-levels/game-engine/internal/games/lava"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/lobis/motion-levels/game-engine/internal/sessionrecording"
	"github.com/lobis/motion-levels/packages/contracts/inputpb"
	"github.com/lobis/motion-levels/packages/contracts/pbstream"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
)

type config struct {
	HTTPAddr                 string
	ControllerAddr           string
	PressureAddr             string
	Game                     string
	Difficulty               string
	PlayerCount              int
	FPS                      int
	Brightness               int
	AudioEnabled             bool
	AudioAssetsDir           string
	AudioPlayer              string
	MusicRef                 string
	MusicVolume              float64
	StartCueRef              string
	CueVolume                float64
	CoinCueRef               string
	DamageCueRef             string
	WinCueRef                string
	NarrationCueRef          string
	NarrationVolume          float64
	CountdownCueRef          string
	CountdownVolume          float64
	TestAudio                bool
	SessionRecordingPath     string
	SessionRecordingMaxBytes int64
	DisplaySnapshotFPS       int
}

type floorGame interface {
	Render(now time.Time) []animation.RGB
	Press(event whackamole.PressEvent, now time.Time) []whackamole.Event
}

func main() {
	cfg := config{}
	flag.StringVar(&cfg.HTTPAddr, "http", ":8082", "HTTP address for the game-engine API; empty disables")
	flag.StringVar(&cfg.ControllerAddr, "controller", "127.0.0.1:9090", "floor-controller frame stream address")
	flag.StringVar(&cfg.PressureAddr, "pressure-events", "127.0.0.1:9091", "floor-controller pressure event stream address")
	flag.StringVar(&cfg.Game, "game", "loop", "game to run: loop, ambient-comet, ambient-pulse, ambient-spark, whack-a-mole, or lava")
	flag.StringVar(&cfg.Difficulty, "difficulty", "easy", "difficulty for games that support it: easy, medium, hard, expert")
	flag.IntVar(&cfg.PlayerCount, "players", 1, "number of players for focused games")
	flag.IntVar(&cfg.FPS, "fps", 20, "frames per second")
	flag.IntVar(&cfg.Brightness, "brightness", 80, "brightness percentage, 1-100")
	flag.BoolVar(&cfg.AudioEnabled, "audio", false, "enable local audio playback through the OS default output")
	flag.StringVar(&cfg.AudioAssetsDir, "audio-assets", "content/audio", "directory containing audio assets")
	flag.StringVar(&cfg.AudioPlayer, "audio-player", "", "audio player executable; empty auto-detects afplay/mpv/ffplay/mpg123")
	flag.StringVar(&cfg.MusicRef, "music", "Motion/canciones/Background01.mp3", "background music asset ref, relative to audio-assets or absolute")
	flag.Float64Var(&cfg.MusicVolume, "music-volume", 0.10, "background music volume, 0.0-1.0")
	flag.StringVar(&cfg.StartCueRef, "start-cue", "Motion/sonidos/aparecer.mp3", "start cue asset ref, relative to audio-assets or absolute")
	flag.StringVar(&cfg.CoinCueRef, "coin-cue", "Motion/sonidos/coin.wav", "coin cue asset ref, preloaded for instant press feedback")
	flag.StringVar(&cfg.DamageCueRef, "damage-cue", "Motion/sonidos/fallo.mp3", "damage cue asset ref, preloaded for instant press feedback")
	flag.StringVar(&cfg.WinCueRef, "win-cue", "Motion/sonidos/victoria.mp3", "win cue asset ref, preloaded for game completion feedback")
	flag.StringVar(&cfg.NarrationCueRef, "narration-cue", "", "narration asset ref; empty uses the selected game's default narration")
	flag.Float64Var(&cfg.NarrationVolume, "narration-volume", 0.85, "narration volume, 0.0-1.0")
	flag.StringVar(&cfg.CountdownCueRef, "countdown-cue", "Motion/narraciones/countdown-tres-dos-uno-vamos.mp3", "countdown narration asset ref; empty disables countdown narration")
	flag.Float64Var(&cfg.CountdownVolume, "countdown-volume", 0.90, "countdown narration volume, 0.0-1.0")
	flag.Float64Var(&cfg.CueVolume, "cue-volume", 0.18, "cue volume, 0.0-1.0")
	flag.BoolVar(&cfg.TestAudio, "audio-test", false, "play configured start cue and music briefly, then exit")
	flag.StringVar(&cfg.SessionRecordingPath, "record-sessions", "game-recordings", "directory or .game.pbstream path for game session recordings; empty disables")
	flag.Int64Var(&cfg.SessionRecordingMaxBytes, "session-segment-bytes", 256<<20, "maximum bytes per game session recording segment")
	flag.IntVar(&cfg.DisplaySnapshotFPS, "display-snapshot-fps", 4, "display snapshots per second to write into game session recordings")
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

	sessionRecorder, err := sessionrecording.New(cfg.SessionRecordingPath, time.Now().UTC(), sessionrecording.Options{MaxSegmentBytes: cfg.SessionRecordingMaxBytes})
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := sessionRecorder.Close(); err != nil {
			log.Printf("session recorder close: %v", err)
		}
	}()

	runtime := newGameRuntime(cfg, audioPlayer, sessionRecorder)
	runtime.StartDisplaySnapshotRecording(displaySnapshotInterval(cfg.DisplaySnapshotFPS))
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
	if c.Game == "whack-a-mole" && c.MusicRef == "Motion/canciones/Background01.mp3" {
		c.MusicRef = whackamole.DefaultMusicRef
		c.MusicVolume = whackamole.DefaultMusicVolume
	}
	if c.Game == "lava" && c.MusicRef == "Motion/canciones/Background01.mp3" {
		c.MusicRef = lava.DefaultMusicRef
		c.MusicVolume = lava.DefaultMusicVolume
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
			playCue(cfg, audioPlayer, cueRef(cfg, gameEvent.Cue))
		}
		return
	}
	if audioPlayer == nil || !event.Pressed {
		return
	}
	seconds := now.Sub(startedAt).Seconds()
	playCue(cfg, audioPlayer, cueForPressure(cfg, int(event.X), int(event.Y), seconds))
}

func playCue(cfg config, audioPlayer *audio.Player, ref string) {
	if audioPlayer == nil {
		return
	}
	if ref == "" {
		return
	}
	if err := audioPlayer.PlayCue(ref, cfg.CueVolume); err != nil {
		log.Printf("pressure audio: %v", err)
	}
}

func cueRef(cfg config, cue string) string {
	switch cue {
	case whackamole.CueStart:
		return cfg.StartCueRef
	case whackamole.CueHit:
		return cfg.CoinCueRef
	case whackamole.CueMiss:
		return cfg.DamageCueRef
	case whackamole.CueWin:
		return cfg.WinCueRef
	default:
		return ""
	}
}

func cueForPressure(cfg config, x, y int, seconds float64) string {
	color := animation.Color(cfg.Game, x, y, seconds)
	r, g, b := int(color.R), int(color.G), int(color.B)
	if r > g+40 && r > b+40 {
		return cfg.DamageCueRef
	}
	return cfg.CoinCueRef
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
	switch value {
	case "whack-a-mole", "whackamole", "mole":
		return "whack-a-mole"
	case "lava", "floor-is-lava", "el-suelo-es-lava":
		return "lava"
	case "loop", "ambient-comet", "ambient-pulse", "ambient-spark":
		return value
	default:
		return "loop"
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
	if runtime != nil {
		brightness, gameColors = runtime.Render(now)
		sessionID = runtime.SessionID()
	}
	scale := float64(brightness) / 100
	frame := &recordingpb.FrameRecord{
		Sequence:          sequence,
		UnixNanos:         now.UnixNano(),
		Width:             animation.GridWidth,
		Height:            animation.GridHeight,
		SessionId:         sessionID,
		GameFrameSequence: sequence,
		GameUnixNanos:     now.UnixNano(),
		Tiles:             make([]*recordingpb.TileState, 0, animation.GridWidth*animation.GridHeight),
	}
	for y := 0; y < animation.GridHeight; y++ {
		for x := 0; x < animation.GridWidth; x++ {
			color := animation.Color("loop", x, y, seconds)
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
