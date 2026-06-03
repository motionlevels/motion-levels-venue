package main

import (
	"log"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/audio"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/lobis/motion-levels/packages/contracts/inputpb"
)

const loopMusicRef = "Motion/canciones/Background01.mp3"

type gameRuntime struct {
	mu      sync.RWMutex
	base    config
	current config
	game    floorGame
	audio   *audio.Player
	started time.Time
}

type gameCatalogEntry struct {
	Game        string  `json:"game"`
	Label       string  `json:"label"`
	Description string  `json:"description"`
	Music       string  `json:"music"`
	Players     bool    `json:"players"`
	MinPlayers  int     `json:"minPlayers"`
	MaxPlayers  int     `json:"maxPlayers"`
	Volume      float64 `json:"volume"`
}

type runtimeStatus struct {
	CurrentGame  string             `json:"currentGame"`
	Label        string             `json:"label"`
	PlayerCount  int                `json:"playerCount"`
	Music        string             `json:"music"`
	MusicVolume  float64            `json:"musicVolume"`
	AudioEnabled bool               `json:"audioEnabled"`
	StartedUnix  int64              `json:"startedUnix"`
	Catalog      []gameCatalogEntry `json:"catalog"`
}

func newGameRuntime(cfg config, audioPlayer *audio.Player) *gameRuntime {
	runtime := &gameRuntime{
		base:  cfg,
		audio: audioPlayer,
	}
	runtime.applyLocked(cfg, true)
	return runtime
}

func (r *gameRuntime) SelectGame(game string, players int) {
	if r == nil {
		return
	}
	cfg := configForSelection(r.base, game, players)
	r.mu.Lock()
	defer r.mu.Unlock()
	r.applyLocked(cfg, true)
}

func (r *gameRuntime) Render(now time.Time) (int, []animation.RGB) {
	if r == nil {
		return 80, nil
	}
	r.mu.RLock()
	brightness := r.current.Brightness
	game := r.game
	r.mu.RUnlock()
	if game == nil {
		return brightness, nil
	}
	return brightness, game.Render(now)
}

func (r *gameRuntime) HandlePressure(event *inputpb.PressureEvent, fallbackStartedAt time.Time) {
	if r == nil || event == nil {
		return
	}
	now := time.Now()
	if event.UnixNanos > 0 {
		now = time.Unix(0, event.UnixNanos)
	}

	r.mu.RLock()
	cfg := r.current
	game := r.game
	audioPlayer := r.audio
	startedAt := r.started
	r.mu.RUnlock()
	if startedAt.IsZero() {
		startedAt = fallbackStartedAt
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

func (r *gameRuntime) Status() runtimeStatus {
	if r == nil {
		return runtimeStatus{Catalog: gameCatalog()}
	}
	r.mu.RLock()
	cfg := r.current
	started := r.started
	audioEnabled := r.audio != nil
	r.mu.RUnlock()
	return runtimeStatus{
		CurrentGame:  cfg.Game,
		Label:        gameLabel(cfg.Game),
		PlayerCount:  cfg.PlayerCount,
		Music:        cfg.MusicRef,
		MusicVolume:  cfg.MusicVolume,
		AudioEnabled: audioEnabled,
		StartedUnix:  started.Unix(),
		Catalog:      gameCatalog(),
	}
}

func (r *gameRuntime) applyLocked(cfg config, playAudio bool) {
	cfg.normalize()
	r.current = cfg
	r.game = makeGame(cfg)
	r.started = time.Now()
	if playAudio {
		r.startAudioLocked(cfg)
	}
}

func (r *gameRuntime) startAudioLocked(cfg config) {
	if r.audio == nil {
		return
	}
	if cfg.MusicRef != "" {
		if err := r.audio.StartLoop(cfg.MusicRef, cfg.MusicVolume); err != nil {
			log.Printf("background music: %v", err)
		}
	} else {
		r.audio.StopLoop()
	}
	if cfg.StartCueRef != "" {
		if err := r.audio.PlayCue(cfg.StartCueRef, cfg.CueVolume); err != nil {
			log.Printf("start cue: %v", err)
		}
	}
}

func makeGame(cfg config) floorGame {
	switch cfg.Game {
	case "whack-a-mole":
		log.Printf("game: whack-a-mole players=%d", cfg.PlayerCount)
		return whackamole.New(cfg.PlayerCount, time.Now())
	default:
		log.Printf("game: loop")
		return nil
	}
}

func configForSelection(base config, game string, players int) config {
	cfg := base
	cfg.Game = normalizeGame(game)
	cfg.PlayerCount = players
	switch cfg.Game {
	case "whack-a-mole":
		cfg.MusicRef = whackamole.DefaultMusicRef
		cfg.MusicVolume = whackamole.DefaultMusicVolume
	default:
		cfg.MusicRef = loopMusicRef
		cfg.MusicVolume = 0.10
	}
	cfg.normalize()
	return cfg
}

func gameCatalog() []gameCatalogEntry {
	return []gameCatalogEntry{
		{
			Game:        "whack-a-mole",
			Label:       "Whack-a-mole",
			Description: "Colored 2x2 targets with instant hit and miss sounds.",
			Music:       whackamole.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Volume:      whackamole.DefaultMusicVolume,
		},
		{
			Game:        "loop",
			Label:       "Animation loop",
			Description: "The simple full-floor looping color animation.",
			Music:       loopMusicRef,
			Players:     false,
			MinPlayers:  1,
			MaxPlayers:  1,
			Volume:      0.10,
		},
	}
}

func gameLabel(game string) string {
	for _, entry := range gameCatalog() {
		if entry.Game == game {
			return entry.Label
		}
	}
	return "Animation loop"
}

func preloadAudioRefs(cfg config) []string {
	refs := []string{
		loopMusicRef,
		whackamole.DefaultMusicRef,
		cfg.MusicRef,
		cfg.StartCueRef,
		cfg.CoinCueRef,
		cfg.DamageCueRef,
		cfg.WinCueRef,
	}
	seen := make(map[string]bool)
	out := make([]string, 0, len(refs))
	for _, ref := range refs {
		if ref == "" || seen[ref] {
			continue
		}
		seen[ref] = true
		out = append(out, ref)
	}
	return out
}
