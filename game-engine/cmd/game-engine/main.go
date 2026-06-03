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
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/lobis/motion-levels/packages/contracts/inputpb"
	"github.com/lobis/motion-levels/packages/contracts/pbstream"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
)

type config struct {
	ControllerAddr string
	PressureAddr   string
	Game           string
	PlayerCount    int
	FPS            int
	Brightness     int
	AudioEnabled   bool
	AudioAssetsDir string
	AudioPlayer    string
	MusicRef       string
	MusicVolume    float64
	StartCueRef    string
	CueVolume      float64
	CoinCueRef     string
	DamageCueRef   string
	WinCueRef      string
	TestAudio      bool
}

type floorGame interface {
	Render(now time.Time) []animation.RGB
	Press(event whackamole.PressEvent, now time.Time) []whackamole.Event
}

func main() {
	cfg := config{}
	flag.StringVar(&cfg.ControllerAddr, "controller", "127.0.0.1:9090", "floor-controller frame stream address")
	flag.StringVar(&cfg.PressureAddr, "pressure-events", "127.0.0.1:9091", "floor-controller pressure event stream address")
	flag.StringVar(&cfg.Game, "game", "loop", "game to run: loop or whack-a-mole")
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
	flag.Float64Var(&cfg.CueVolume, "cue-volume", 0.18, "cue volume, 0.0-1.0")
	flag.BoolVar(&cfg.TestAudio, "audio-test", false, "play configured start cue and music briefly, then exit")
	flag.Parse()

	cfg.normalize()

	audioPlayer, err := cfg.audioPlayer()
	if err != nil {
		log.Fatal(err)
	}
	if audioPlayer != nil {
		if err := audioPlayer.Preload(cfg.MusicRef, cfg.StartCueRef, cfg.CoinCueRef, cfg.DamageCueRef, cfg.WinCueRef); err != nil {
			log.Fatal(err)
		}
	}
	if cfg.TestAudio {
		if err := runAudioTest(audioPlayer, cfg); err != nil {
			log.Fatal(err)
		}
		return
	}

	for {
		if err := run(cfg, audioPlayer); err != nil {
			log.Printf("game-engine stream ended: %v", err)
			time.Sleep(time.Second)
		}
	}
}

func (c *config) normalize() {
	c.Game = normalizeGame(c.Game)
	if c.PlayerCount < 1 {
		c.PlayerCount = 1
	}
	if c.PlayerCount > 6 {
		c.PlayerCount = 6
	}
	if c.FPS < 1 {
		c.FPS = 1
	}
	if c.Brightness < 1 {
		c.Brightness = 1
	}
	if c.Brightness > 100 {
		c.Brightness = 100
	}
	c.MusicVolume = clamp01(c.MusicVolume)
	c.CueVolume = clamp01(c.CueVolume)
	if c.Game == "whack-a-mole" && c.MusicRef == "Motion/canciones/Background01.mp3" {
		c.MusicRef = whackamole.DefaultMusicRef
		c.MusicVolume = whackamole.DefaultMusicVolume
	}
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
	return nil
}

func run(cfg config, audioPlayer *audio.Player) error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	game := newGame(cfg)

	conn, err := net.Dial("tcp", cfg.ControllerAddr)
	if err != nil {
		return err
	}
	defer conn.Close()
	log.Printf("connected to floor-controller: %s", cfg.ControllerAddr)
	if audioPlayer != nil {
		if cfg.MusicRef != "" {
			if err := audioPlayer.StartLoop(cfg.MusicRef, cfg.MusicVolume); err != nil {
				log.Printf("background music: %v", err)
			}
		}
		if cfg.StartCueRef != "" {
			if err := audioPlayer.PlayCue(cfg.StartCueRef, cfg.CueVolume); err != nil {
				log.Printf("start cue: %v", err)
			}
		}
		defer audioPlayer.StopLoop()
	}

	writer := bufio.NewWriterSize(conn, 1<<20)
	ticker := time.NewTicker(time.Duration(float64(time.Second) / float64(cfg.FPS)))
	defer ticker.Stop()

	startedAt := time.Now()
	if (audioPlayer != nil || game != nil) && cfg.PressureAddr != "" {
		go pressureEventLoop(ctx, cfg, audioPlayer, game, startedAt)
	}
	var sequence uint64
	for now := range ticker.C {
		sequence++
		frame := makeFrame(sequence, now, now.Sub(startedAt).Seconds(), cfg.Brightness, game)
		if err := pbstream.Write(writer, frame); err != nil {
			return err
		}
		if err := writer.Flush(); err != nil {
			return err
		}
	}
	return nil
}

func pressureEventLoop(ctx context.Context, cfg config, audioPlayer *audio.Player, game floorGame, startedAt time.Time) {
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
			handlePressureEvent(cfg, audioPlayer, game, startedAt, &event)
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
	color := animation.LoopColor(x, y, seconds)
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

func newGame(cfg config) floorGame {
	switch cfg.Game {
	case "whack-a-mole":
		log.Printf("game: whack-a-mole players=%d", cfg.PlayerCount)
		return whackamole.New(cfg.PlayerCount, time.Now())
	default:
		log.Printf("game: loop")
		return nil
	}
}

func normalizeGame(value string) string {
	switch value {
	case "whack-a-mole", "whackamole", "mole":
		return "whack-a-mole"
	default:
		return "loop"
	}
}

func makeFrame(sequence uint64, now time.Time, seconds float64, brightness int, game floorGame) *recordingpb.FrameRecord {
	scale := float64(brightness) / 100
	frame := &recordingpb.FrameRecord{
		Sequence:  sequence,
		UnixNanos: now.UnixNano(),
		Width:     animation.GridWidth,
		Height:    animation.GridHeight,
		Tiles:     make([]*recordingpb.TileState, 0, animation.GridWidth*animation.GridHeight),
	}
	var gameColors []animation.RGB
	if game != nil {
		gameColors = game.Render(now)
	}
	for y := 0; y < animation.GridHeight; y++ {
		for x := 0; x < animation.GridWidth; x++ {
			color := animation.LoopColor(x, y, seconds)
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
