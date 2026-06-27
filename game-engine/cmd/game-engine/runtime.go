package main

import (
	crand "crypto/rand"
	"fmt"
	"log"
	"math"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/audio"
	"github.com/lobis/motion-levels/game-engine/internal/games/animations"
	"github.com/lobis/motion-levels/game-engine/internal/games/authored"
	"github.com/lobis/motion-levels/game-engine/internal/games/duel"
	"github.com/lobis/motion-levels/game-engine/internal/games/lava"
	"github.com/lobis/motion-levels/game-engine/internal/games/memorychallenge"
	"github.com/lobis/motion-levels/game-engine/internal/games/parkour"
	"github.com/lobis/motion-levels/game-engine/internal/games/patrones"
	"github.com/lobis/motion-levels/game-engine/internal/games/plataformas"
	"github.com/lobis/motion-levels/game-engine/internal/games/saltos"
	"github.com/lobis/motion-levels/game-engine/internal/games/temporada1"
	"github.com/lobis/motion-levels/game-engine/internal/games/temporada2"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/lobis/motion-levels/game-engine/internal/sessionrecording"
	"github.com/lobis/motion-levels/packages/contracts/gamepb"
	"github.com/lobis/motion-levels/packages/contracts/inputpb"
)

const (
	loopMusicRef        = "Motion/canciones/Background01.mp3"
	noPressureGameLimit = 5 * time.Minute
)

type gameRecordWriter interface {
	Record(*gamepb.GameSessionRecord) error
}

type gameRuntime struct {
	mu                sync.RWMutex
	base              config
	current           config
	game              floorGame
	audio             *audio.Player
	started           time.Time
	lastEvent         displayEvent
	recorder          gameRecordWriter
	cameraRecorder    levelAttemptCameraRecorder
	sessionID         string
	sessionSeq        uint64
	rngSeed           int64
	paused            bool
	pausedAt          time.Time
	pauseTotal        time.Duration
	lastPressure      time.Time
	lastPressureInput time.Time
	narrated          map[string]bool
	introUntil        time.Time
	audioMuted        bool
	ambientTouches    []ambientTouch
	levelAttempt      *levelAttemptTracker
	recentAttempts    []finishedLevelAttemptStatus
	bestAttemptMillis map[string]int64

	// Venue session (client visit) state; see venue.go.
	venueID           string
	venueTeamName     string
	venuePlayerLabels []string
	venuePlayerRoster []venuePlayerSnapshot
	venueKioskID      string
	venueStatus       string // "" | active | ended
	venueEndReason    string
	venueStartedAt    time.Time
	venueEndedAt      time.Time
	venueSeq          uint64
	venueLastActivity time.Time
	venueIdleTimeout  time.Duration
	venueOutbox       []venueOutboxEvent
	venueDropped      uint64

	menuStateSnapshot menuStateSnapshot
	menuStateVersion  uint64

	framePerf framePerf
}

type ambientTouch struct {
	x       int
	y       int
	started time.Time
}

type levelAttemptTracker struct {
	AttemptID                string
	Game                     string
	Level                    string
	LevelNumber              int
	Difficulty               string
	PlayerCount              int
	LivesStart               int
	ScoreStart               int
	ActiveTargetsStart       int
	StartedUnixNanos         int64
	GameplayStartedUnixNanos int64
}

type finishedLevelAttemptStatus struct {
	AttemptID      string `json:"attemptId"`
	Game           string `json:"game"`
	Level          string `json:"level"`
	LevelNumber    int    `json:"levelNumber"`
	Difficulty     string `json:"difficulty"`
	Result         string `json:"result"`
	Success        bool   `json:"success"`
	ElapsedMillis  int64  `json:"elapsedMillis"`
	EndedUnixNanos int64  `json:"endedUnixNanos"`
}

type framePerf struct {
	mu      sync.Mutex
	Game    string
	Runtime string
	Count   uint64
	Total   time.Duration
	Last    time.Duration
	Min     time.Duration
	Max     time.Duration
	Updated time.Time
}

type framePerfSnapshot struct {
	Game             string  `json:"game"`
	Runtime          string  `json:"runtime"`
	Count            uint64  `json:"count"`
	LastMicros       int64   `json:"lastMicros"`
	AverageMicros    float64 `json:"averageMicros"`
	MinMicros        int64   `json:"minMicros"`
	MaxMicros        int64   `json:"maxMicros"`
	UpdatedUnixNanos int64   `json:"updatedUnixNanos"`
}

type displayEvent struct {
	unixNanos int64
	cue       string
	message   string
}

type narrationMode int

const (
	narrationAuto narrationMode = iota
	narrationSkip
	narrationForce
)

type plataformasAudioProvider interface {
	AudioRefs() plataformas.AudioRefs
}

type gameCatalogEntry struct {
	Game        string           `json:"game"`
	Label       string           `json:"label"`
	Description string           `json:"description"`
	Music       string           `json:"music"`
	Players     bool             `json:"players"`
	MinPlayers  int              `json:"minPlayers"`
	MaxPlayers  int              `json:"maxPlayers"`
	Difficulty  bool             `json:"difficulty"`
	Volume      float64          `json:"volume"`
	Levels      []gameLevelEntry `json:"levels,omitempty"`
}

type gameLevelEntry struct {
	ID          string `json:"id"`
	Label       string `json:"label"`
	Description string `json:"description"`
}

type displayColor struct {
	R int `json:"r"`
	G int `json:"g"`
	B int `json:"b"`
}

type displayPlayer struct {
	Index int          `json:"index"`
	Label string       `json:"label"`
	Color displayColor `json:"color"`
	Score int          `json:"score"`
	Lives int          `json:"lives"`
}

type playerConfig struct {
	Index int
	Label string
	Color *displayColor
}

type displayStatus struct {
	CurrentGame              string          `json:"currentGame"`
	VenueSessionID           string          `json:"venueSessionId"`
	Label                    string          `json:"label"`
	Phase                    string          `json:"phase"`
	Difficulty               string          `json:"difficulty"`
	DifficultyConfigurable   bool            `json:"difficultyConfigurable"`
	Level                    string          `json:"level,omitempty"`
	LevelMode                string          `json:"levelMode,omitempty"`
	TeamName                 string          `json:"teamName"`
	PlayerCount              int             `json:"playerCount"`
	PlayerConfigurable       bool            `json:"playerConfigurable"`
	Players                  []displayPlayer `json:"players"`
	Score                    int             `json:"score"`
	Lives                    int             `json:"lives"`
	StartedUnix              int64           `json:"startedUnix"`
	SessionStartedUnix       int64           `json:"sessionStartedUnix"`
	EndsUnix                 int64           `json:"endsUnix"`
	SessionElapsedMillis     int64           `json:"sessionElapsedMillis"`
	ChallengeElapsedMillis   int64           `json:"challengeElapsedMillis,omitempty"`
	ChallengeAttemptCount    int             `json:"challengeAttemptCount,omitempty"`
	ElapsedMillis            int64           `json:"elapsedMillis"`
	RemainingMillis          int64           `json:"remainingMillis"`
	IntroRemainingMillis     int64           `json:"introRemainingMillis"`
	CountdownRemainingMillis int64           `json:"countdownRemainingMillis"`
	ActiveTargets            int             `json:"activeTargets"`
	Success                  bool            `json:"success"`
	AudioEnabled             bool            `json:"audioEnabled"`
	AudioMuted               bool            `json:"audioMuted"`
	LastEventUnixNanos       int64           `json:"lastEventUnixNanos"`
	LastEventCue             string          `json:"lastEventCue"`
	LastEventMessage         string          `json:"lastEventMessage"`
	LevelNumber              int             `json:"levelNumber,omitempty"`
	AttemptStartedUnixNanos  int64           `json:"attemptStartedUnixNanos,omitempty"`
	GameplayStartedUnixNanos int64           `json:"gameplayStartedUnixNanos,omitempty"`
	AttemptEndedUnixNanos    int64           `json:"attemptEndedUnixNanos,omitempty"`
	LivesStart               int             `json:"livesStart,omitempty"`
	AttemptCount             int             `json:"attemptCount,omitempty"`
	FailureCount             int             `json:"failureCount,omitempty"`
	BestElapsedMillis        int64           `json:"bestElapsedMillis,omitempty"`
	SessionBestElapsedMillis int64           `json:"sessionBestElapsedMillis,omitempty"`
}

type runtimeStatus struct {
	CurrentGame              string                       `json:"currentGame"`
	VenueSessionID           string                       `json:"venueSessionId"`
	Label                    string                       `json:"label"`
	Difficulty               string                       `json:"difficulty"`
	Level                    string                       `json:"level,omitempty"`
	LevelMode                string                       `json:"levelMode,omitempty"`
	TeamName                 string                       `json:"teamName"`
	PlayerCount              int                          `json:"playerCount"`
	Players                  []displayPlayer              `json:"players"`
	Music                    string                       `json:"music"`
	MusicVolume              float64                      `json:"musicVolume"`
	AudioEnabled             bool                         `json:"audioEnabled"`
	AudioMuted               bool                         `json:"audioMuted"`
	Paused                   bool                         `json:"paused"`
	Phase                    string                       `json:"phase"`
	IntroRemainingMillis     int64                        `json:"introRemainingMillis"`
	CountdownRemainingMillis int64                        `json:"countdownRemainingMillis"`
	StartedUnix              int64                        `json:"startedUnix"`
	SessionElapsedMillis     int64                        `json:"sessionElapsedMillis"`
	ElapsedMillis            int64                        `json:"elapsedMillis"`
	ChallengeElapsedMillis   int64                        `json:"challengeElapsedMillis,omitempty"`
	ChallengeAttemptCount    int                          `json:"challengeAttemptCount,omitempty"`
	Success                  bool                         `json:"success"`
	SessionID                string                       `json:"sessionId"`
	LastPressureUnix         int64                        `json:"lastPressureUnix"`
	RNGSeed                  int64                        `json:"rngSeed"`
	Recorder                 any                          `json:"recorder"`
	FinishedLevelAttempts    []finishedLevelAttemptStatus `json:"finishedLevelAttempts,omitempty"`
	Performance              framePerfSnapshot            `json:"performance"`
	Catalog                  []gameCatalogEntry           `json:"catalog"`
}

func unixOrZero(t time.Time) int64 {
	if t.IsZero() {
		return 0
	}
	return t.Unix()
}

func elapsedMillisSince(started time.Time, now time.Time) int64 {
	if started.IsZero() || now.Before(started) {
		return 0
	}
	return now.Sub(started).Milliseconds()
}

func newGameRuntime(cfg config, audioPlayer *audio.Player, recorder gameRecordWriter) *gameRuntime {
	runtime := &gameRuntime{
		base:              cfg,
		audio:             audioPlayer,
		recorder:          recorder,
		narrated:          map[string]bool{},
		bestAttemptMillis: map[string]int64{},
		venueIdleTimeout:  cfg.VenueIdleTimeout,
	}
	if runtime.venueIdleTimeout == 0 {
		runtime.venueIdleTimeout = defaultVenueIdleLimit
	}
	runtime.applyLocked(cfg, true)
	runtime.refreshCloudCatalogs()
	return runtime
}

func (r *gameRuntime) SetCameraRecorder(recorder levelAttemptCameraRecorder) {
	if r == nil {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.cameraRecorder = recorder
}

func (r *gameRuntime) refreshCloudCatalogs() {
	if r == nil || strings.TrimSpace(r.base.PlatformURL) == "" {
		return
	}
	platformURL := r.base.PlatformURL
	go func() {
		if _, err := authored.RefreshCatalog(platformURL); err != nil {
			log.Printf("authored catalog refresh failed: %v", err)
		}
	}()
	go func() {
		if _, err := animations.RefreshLevels(platformURL); err != nil {
			log.Printf("animation catalog refresh failed: %v", err)
		}
	}()
}

func (r *gameRuntime) SelectGame(game string, players int) {
	r.SelectGameWithDifficulty(game, players, "")
}

func (r *gameRuntime) SelectGameWithDifficulty(game string, players int, difficulty string) {
	r.SelectGameWithOptions(game, players, difficulty, nil)
}

func (r *gameRuntime) SelectGameWithOptions(game string, players int, difficulty string, narrationEnabled *bool) {
	r.SelectGameWithMetadata(game, players, difficulty, "", "", 0, 0, 0, narrationEnabled, false, "", "", "", nil)
}

func (r *gameRuntime) SelectGameWithMetadata(game string, players int, difficulty string, level string, levelMode string, durationSeconds int, challengeElapsedMillis int64, challengeAttemptCount int, narrationEnabled *bool, countdownFloorOverlay bool, teamName string, venueSessionID string, platformURL string, roster []playerConfig) {
	if r == nil {
		return
	}
	cfg := configForSelection(r.base, game, players)
	if shouldUseLaunchPlatformURL(r.base.PlatformURL, platformURL) {
		cfg.PlatformURL = platformURL
	}
	if difficulty != "" {
		cfg.Difficulty = normalizeDifficulty(difficulty)
	}
	if level != "" {
		cfg.Level = level
	}
	cfg.LevelMode = normalizeLevelMode(levelMode)
	if durationSeconds > 0 {
		cfg.DurationSeconds = durationSeconds
	}
	if challengeElapsedMillis > 0 {
		cfg.ChallengeElapsedMillis = challengeElapsedMillis
	}
	if challengeAttemptCount > 0 {
		cfg.ChallengeAttemptCount = challengeAttemptCount
	}
	cfg.CountdownFloorOverlay = countdownFloorOverlay
	cfg.TeamName = strings.TrimSpace(teamName)
	cfg.VenueSessionID = strings.TrimSpace(venueSessionID)
	cfg.Players = normalizePlayerRoster(roster, cfg.PlayerCount)
	mode := narrationAuto
	if narrationEnabled != nil {
		if *narrationEnabled {
			mode = narrationForce
		} else {
			mode = narrationSkip
		}
	}
	preparedIntroHold := r.preparedLaunchIntroHold(cfg, mode)
	r.mu.Lock()
	defer r.mu.Unlock()
	now := time.Now()
	if cfg.VenueSessionID != "" {
		// Adopt the menu's venue session if the engine restarted mid-visit.
		r.startVenueLocked(cfg.VenueSessionID, cfg.TeamName, "", now, true)
		r.venueLastActivity = now
	}
	r.applyLockedWithNarrationPrepared(cfg, true, mode, preparedIntroHold)
	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_MenuCommand{MenuCommand: &gamepb.MenuCommand{
			Command:     "select_game",
			Game:        cfg.Game,
			PlayerCount: uint32(cfg.PlayerCount),
			UnixNanos:   now.UnixNano(),
		}}
	})
}

func (r *gameRuntime) ControlGame(action string) {
	if r == nil {
		return
	}
	now := time.Now()
	r.mu.Lock()
	defer r.mu.Unlock()

	switch action {
	case "pause":
		if !r.paused {
			r.paused = true
			r.pausedAt = now
		}
	case "resume":
		if r.paused {
			r.pauseTotal += now.Sub(r.pausedAt)
			r.paused = false
			r.pausedAt = time.Time{}
		}
	case "restart":
		cfg := r.current
		if cfg.LevelMode == "challenge" {
			cfg.ChallengeElapsedMillis = 0
			cfg.ChallengeAttemptCount = 0
		}
		r.applyLocked(cfg, true)
	case "narration":
		r.playNarrationLocked(r.current, now, true)
	case "mute":
		r.setAudioMutedLocked(true, now)
	case "unmute":
		r.setAudioMutedLocked(false, now)
	case "toggle_mute":
		r.setAudioMutedLocked(!r.audioMuted, now)
	case "exit":
		r.exitActiveGameLocked("game exited")
	default:
		return
	}

	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_MenuCommand{MenuCommand: &gamepb.MenuCommand{
			Command:   action,
			Game:      r.current.Game,
			UnixNanos: now.UnixNano(),
		}}
	})
}

func (r *gameRuntime) exitActiveGameLocked(reason string) {
	cfg := configForSelection(r.base, "salvapantallas", 1)
	cfg.VenueSessionID = ""
	cfg.TeamName = ""
	r.applyLockedWithNarrationReason(cfg, true, narrationAuto, reason)
}

func (r *gameRuntime) Render(now time.Time) (int, []animation.RGB) {
	if r == nil {
		return 80, nil
	}
	r.enforceNoPressureTimeout(now)
	r.mu.RLock()
	brightness := r.current.Brightness
	gameID := r.current.Game
	game := r.game
	started := r.started
	gameNow := r.effectiveNowLocked(now)
	touches := copyActiveAmbientTouchesLocked(r.ambientTouches, gameNow)
	r.mu.RUnlock()
	if game == nil {
		if animation.IsAmbientMode(gameID) {
			begin := time.Now()
			frame := renderAmbient(gameID, gameNow, started, touches)
			r.framePerf.Observe(gameID, "ambient", time.Since(begin), time.Now())
			return brightness, frame
		}
		return brightness, nil
	}
	begin := time.Now()
	frame := game.Render(gameNow)
	r.framePerf.Observe(gameID, runtimeKind(game), time.Since(begin), time.Now())
	return brightness, frame
}

func (r *gameRuntime) ApplyCountdownOverlay(now time.Time, frame []animation.RGB) []animation.RGB {
	if r == nil || len(frame) != animation.GridWidth*animation.GridHeight {
		return frame
	}
	status := r.DisplayStatus(now)
	if !r.countdownFloorOverlayEnabled(status) {
		return frame
	}
	digit := countdownOverlayDigit(status.CountdownRemainingMillis)
	if digit == 0 {
		return frame
	}
	out := append([]animation.RGB(nil), frame...)
	drawCountdownDigit(out, digit)
	return out
}

func (r *gameRuntime) countdownFloorOverlayEnabled(status displayStatus) bool {
	if r == nil || status.CountdownRemainingMillis <= 0 || status.Phase != "countdown" {
		return false
	}
	r.mu.RLock()
	enabled := r.current.CountdownFloorOverlay
	r.mu.RUnlock()
	return enabled
}

func runtimeKind(game floorGame) string {
	if game == nil {
		return ""
	}
	if reporter, ok := game.(interface{ RuntimeKind() string }); ok {
		if kind := strings.TrimSpace(reporter.RuntimeKind()); kind != "" {
			return kind
		}
	}
	return "go"
}

func (p *framePerf) Observe(game string, runtime string, elapsed time.Duration, now time.Time) {
	if p == nil {
		return
	}
	p.mu.Lock()
	defer p.mu.Unlock()
	if game != p.Game || runtime != p.Runtime {
		p.Game = game
		p.Runtime = runtime
		p.Count = 0
		p.Total = 0
		p.Last = 0
		p.Min = 0
		p.Max = 0
	}
	p.Count++
	p.Total += elapsed
	p.Last = elapsed
	if p.Min == 0 || elapsed < p.Min {
		p.Min = elapsed
	}
	if elapsed > p.Max {
		p.Max = elapsed
	}
	p.Updated = now
}

func (p *framePerf) Snapshot() framePerfSnapshot {
	if p == nil {
		return framePerfSnapshot{}
	}
	p.mu.Lock()
	defer p.mu.Unlock()
	average := float64(0)
	if p.Count > 0 {
		average = float64(p.Total.Microseconds()) / float64(p.Count)
	}
	return framePerfSnapshot{
		Game:             p.Game,
		Runtime:          p.Runtime,
		Count:            p.Count,
		LastMicros:       p.Last.Microseconds(),
		AverageMicros:    average,
		MinMicros:        p.Min.Microseconds(),
		MaxMicros:        p.Max.Microseconds(),
		UpdatedUnixNanos: p.Updated.UnixNano(),
	}
}

func (r *gameRuntime) HandlePressure(event *inputpb.PressureEvent, fallbackStartedAt time.Time) {
	if r == nil || event == nil {
		return
	}
	now := time.Now()
	if event.UnixNanos > 0 {
		now = time.Unix(0, event.UnixNanos)
	}
	r.recordPressureActivity(now, event.Pressed)

	r.mu.RLock()
	cfg := r.current
	game := r.game
	audioPlayer := r.audio
	paused := r.paused
	gameNow := r.effectiveNowLocked(now)
	r.mu.RUnlock()
	r.recordPressureInput(event, now)
	if paused {
		return
	}

	if game != nil {
		for _, gameEvent := range game.Press(whackamole.PressEvent{X: int(event.X), Y: int(event.Y), Pressed: event.Pressed}, gameNow) {
			r.recordGameEvent(gameEvent.Cue, gameEvent.Message, gameNow)
			r.playCue(cfg, audioPlayer, gameEvent.Cue, cueRef(cfg, gameEvent.Cue), gameNow)
			if gameEvent.Cue == whackamole.CueStart && shouldPlayCountdownAfterReadyCue(cfg) {
				r.playCountdownCue(cfg, audioPlayer, gameNow)
			}
		}
		return
	}
	if event.Pressed && animation.IsAmbientMode(cfg.Game) {
		r.addAmbientTouch(int(event.X), int(event.Y), gameNow)
	}
}

func (r *gameRuntime) DisplayStatus(now time.Time) displayStatus {
	if r == nil {
		return displayStatus{
			CurrentGame:    "salvapantallas",
			VenueSessionID: "",
			Label:          gameLabel("salvapantallas"),
			Phase:          "idle",
			Lives:          -1,
		}
	}
	r.enforceNoPressureTimeout(now)
	r.mu.RLock()
	cfg := r.current
	game := r.game
	started := r.started
	audioEnabled := r.audio != nil
	audioMuted := r.audioMuted
	lastEvent := r.lastEvent
	paused := r.paused
	introUntil := r.introUntil
	gameNow := r.effectiveNowLocked(now)
	r.mu.RUnlock()

	status := displayStatus{
		CurrentGame:            cfg.Game,
		VenueSessionID:         cfg.VenueSessionID,
		Label:                  gameLabel(cfg.Game),
		Phase:                  "idle",
		Difficulty:             cfg.Difficulty,
		DifficultyConfigurable: gameHasConfigurableDifficulty(cfg.Game, cfg.PlatformURL),
		Level:                  cfg.Level,
		LevelMode:              cfg.LevelMode,
		TeamName:               cfg.TeamName,
		PlayerCount:            cfg.PlayerCount,
		PlayerConfigurable:     gameHasConfigurablePlayers(cfg.Game, cfg.PlatformURL),
		Players:                defaultDisplayPlayers(cfg),
		Lives:                  -1,
		StartedUnix:            started.Unix(),
		SessionStartedUnix:     unixOrZero(started),
		SessionElapsedMillis:   elapsedMillisSince(started, gameNow),
		ChallengeElapsedMillis: cfg.ChallengeElapsedMillis,
		ChallengeAttemptCount:  cfg.ChallengeAttemptCount,
		AudioEnabled:           audioEnabled,
		AudioMuted:             audioMuted,
		LastEventUnixNanos:     lastEvent.unixNanos,
		LastEventCue:           lastEvent.cue,
		LastEventMessage:       lastEvent.message,
	}

	if cfg.Game == "whack-a-mole" {
		if mole, ok := game.(*whackamole.Game); ok {
			snapshot := mole.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: snapshot.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if cfg.Game == "lava" {
		if lavaGame, ok := game.(*lava.Game); ok {
			snapshot := lavaGame.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.Difficulty = snapshot.Difficulty
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: snapshot.Lives,
				})
			}
		}
		r.applyIntroStatus(&status, gameNow, introUntil)
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if cfg.Game == "duel" {
		if duelGame, ok := game.(*duel.Game); ok {
			snapshot := duelGame.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.Success = snapshot.Success
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: player.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if cfg.Game == "memory" {
		if memoryGame, ok := game.(*memorychallenge.Game); ok {
			snapshot := memoryGame.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.Success = snapshot.Success
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: player.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if cfg.Game == "patrones" {
		if patronesGame, ok := game.(*patrones.Game); ok {
			snapshot := patronesGame.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.LivesStart = snapshot.LivesStart
			status.Difficulty = snapshot.Difficulty
			status.Level = snapshot.Level
			status.LevelNumber = snapshot.LevelNumber
			status.AttemptStartedUnixNanos = snapshot.CreatedUnixNanos
			status.GameplayStartedUnixNanos = snapshot.StartedUnixNanos
			status.AttemptEndedUnixNanos = snapshot.EndedUnixNanos
			status.Success = snapshot.Success
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: player.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if cfg.Game == "saltos" {
		if saltosGame, ok := game.(*saltos.Game); ok {
			snapshot := saltosGame.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.Level = snapshot.Level
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: snapshot.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if cfg.Game == "parkour" {
		if parkourGame, ok := game.(*parkour.Game); ok {
			snapshot := parkourGame.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.LivesStart = snapshot.LivesStart
			status.Difficulty = snapshot.Difficulty
			status.Level = snapshot.Level
			status.LevelNumber = snapshot.LevelNumber
			status.AttemptStartedUnixNanos = snapshot.CreatedUnixNanos
			status.GameplayStartedUnixNanos = snapshot.StartedUnixNanos
			status.AttemptEndedUnixNanos = snapshot.EndedUnixNanos
			status.Success = snapshot.Success
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: player.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if isPlatformRuntimeGame(cfg.Game) {
		if plataformasGame, ok := game.(*plataformas.Game); ok {
			snapshot := plataformasGame.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.LivesStart = snapshot.LivesStart
			if snapshot.Label != "" {
				status.Label = snapshot.Label
			}
			status.Difficulty = snapshot.Difficulty
			status.Level = snapshot.Level
			status.LevelNumber = snapshot.LevelNumber
			status.AttemptStartedUnixNanos = snapshot.CreatedUnixNanos
			status.GameplayStartedUnixNanos = snapshot.StartedUnixNanos
			status.AttemptEndedUnixNanos = snapshot.EndedUnixNanos
			status.Success = snapshot.Success
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: player.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if strings.HasPrefix(cfg.Game, "authored-") {
		if authoredGame, ok := game.(interface {
			Snapshot(time.Time) authored.Snapshot
			Label() string
		}); ok {
			snapshot := authoredGame.Snapshot(gameNow)
			status.Label = authoredGame.Label()
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Success = snapshot.Success
			status.Lives = snapshot.Lives
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: player.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if cfg.Game == "temporada1" || cfg.Game == "temporada2" {
		if temporadaGame, ok := game.(*temporada1.Game); ok {
			snapshot := temporadaGame.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.LivesStart = snapshot.LivesStart
			status.Difficulty = snapshot.Difficulty
			status.Level = snapshot.Level
			status.LevelNumber = snapshot.LevelNumber
			status.AttemptStartedUnixNanos = snapshot.CreatedUnixNanos
			status.GameplayStartedUnixNanos = snapshot.StartedUnixNanos
			status.AttemptEndedUnixNanos = snapshot.EndedUnixNanos
			status.Success = snapshot.Success
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: player.Lives,
				})
			}
		} else if temporadaGame, ok := game.(*temporada2.Game); ok {
			snapshot := temporadaGame.Snapshot(gameNow)
			status.Phase = snapshot.Phase
			status.Score = snapshot.Score
			status.StartedUnix = snapshot.StartedUnix
			status.EndsUnix = snapshot.EndsUnix
			status.ElapsedMillis = snapshot.ElapsedMillis
			status.RemainingMillis = snapshot.RemainingMillis
			status.CountdownRemainingMillis = snapshot.CountdownMillis
			status.ActiveTargets = snapshot.ActiveTargets
			status.Lives = snapshot.Lives
			status.LivesStart = snapshot.LivesStart
			status.Difficulty = snapshot.Difficulty
			status.Level = snapshot.Level
			status.LevelNumber = snapshot.LevelNumber
			status.AttemptStartedUnixNanos = snapshot.CreatedUnixNanos
			status.GameplayStartedUnixNanos = snapshot.StartedUnixNanos
			status.AttemptEndedUnixNanos = snapshot.EndedUnixNanos
			status.Success = snapshot.Success
			status.Players = make([]displayPlayer, 0, len(snapshot.Players))
			for _, player := range snapshot.Players {
				status.Players = append(status.Players, displayPlayer{
					Index: player.Index,
					Label: configuredPlayerLabel(cfg, player.Index, player.Label),
					Color: configuredPlayerColor(cfg, player.Index, displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)}),
					Score: player.Score,
					Lives: player.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return r.withDisplayAttemptSummary(status, started)
	}

	if !started.IsZero() {
		status.Phase = "ambient"
		status.ElapsedMillis = gameNow.Sub(started).Milliseconds()
	}
	if paused && status.Phase != "finished" {
		status.Phase = "paused"
	}
	return status
}

func (r *gameRuntime) withDisplayAttemptSummary(status displayStatus, sessionStarted time.Time) displayStatus {
	if r == nil || !recordsLevelAttempts(status.CurrentGame) || strings.TrimSpace(status.Level) == "" {
		return status
	}
	r.mu.RLock()
	recentAttempts := append([]finishedLevelAttemptStatus(nil), r.recentAttempts...)
	bestAttempts := make(map[string]int64, len(r.bestAttemptMillis))
	for key, millis := range r.bestAttemptMillis {
		bestAttempts[key] = millis
	}
	r.mu.RUnlock()

	sessionStartedUnixNanos := int64(0)
	if !sessionStarted.IsZero() {
		sessionStartedUnixNanos = sessionStarted.UnixNano()
	}
	bestKey := levelAttemptRecordKey(status.CurrentGame, status.Level, status.Difficulty)
	status.BestElapsedMillis = bestAttempts[bestKey]
	for _, attempt := range recentAttempts {
		if attempt.Game != status.CurrentGame || attempt.Level != status.Level {
			continue
		}
		if status.Difficulty != "" && attempt.Difficulty != "" && attempt.Difficulty != status.Difficulty {
			continue
		}
		if attempt.Success && attempt.ElapsedMillis > 0 && (status.BestElapsedMillis == 0 || attempt.ElapsedMillis < status.BestElapsedMillis) {
			status.BestElapsedMillis = attempt.ElapsedMillis
		}
		if sessionStartedUnixNanos > 0 && attempt.EndedUnixNanos > 0 && attempt.EndedUnixNanos < sessionStartedUnixNanos {
			continue
		}
		status.AttemptCount++
		if !attempt.Success || attempt.Result == "failed" {
			status.FailureCount++
		}
		if attempt.Success && attempt.ElapsedMillis > 0 && (status.SessionBestElapsedMillis == 0 || attempt.ElapsedMillis < status.SessionBestElapsedMillis) {
			status.SessionBestElapsedMillis = attempt.ElapsedMillis
		}
	}
	if status.Phase != "idle" && status.Phase != "ambient" && status.Phase != "finished" {
		status.AttemptCount++
	}
	return status
}

func (r *gameRuntime) Status() runtimeStatus {
	if r == nil {
		return runtimeStatus{Catalog: gameCatalog("")}
	}
	now := time.Now()
	r.enforceNoPressureTimeout(now)
	r.ExpireIdleVenueSession(now)
	r.mu.RLock()
	cfg := r.current
	activeVenueID := ""
	if r.venueStatus == "active" {
		activeVenueID = r.venueID
	}
	started := r.started
	audioEnabled := r.audio != nil
	audioMuted := r.audioMuted
	sessionID := r.sessionID
	lastPressureInput := r.lastPressureInput
	rngSeed := r.rngSeed
	paused := r.paused
	var recorderStats any
	if stats, ok := r.recorder.(interface{ Stats() sessionrecording.Stats }); ok {
		recorderStats = stats.Stats()
	}
	r.mu.RUnlock()
	display := r.DisplayStatus(now)
	r.ObserveDisplayStatus(display, now)
	r.mu.RLock()
	recentAttempts := append([]finishedLevelAttemptStatus(nil), r.recentAttempts...)
	r.mu.RUnlock()
	venueSessionID := activeVenueID
	if venueSessionID == "" {
		venueSessionID = cfg.VenueSessionID
	}
	if isAmbientActivityGame(cfg.Game) {
		sessionID = ""
		venueSessionID = ""
	}
	return runtimeStatus{
		CurrentGame:              cfg.Game,
		VenueSessionID:           venueSessionID,
		Label:                    display.Label,
		Difficulty:               display.Difficulty,
		Level:                    display.Level,
		LevelMode:                display.LevelMode,
		TeamName:                 cfg.TeamName,
		PlayerCount:              cfg.PlayerCount,
		Players:                  display.Players,
		Music:                    cfg.MusicRef,
		MusicVolume:              cfg.MusicVolume,
		AudioEnabled:             audioEnabled,
		AudioMuted:               audioMuted,
		Paused:                   paused,
		Phase:                    display.Phase,
		IntroRemainingMillis:     display.IntroRemainingMillis,
		CountdownRemainingMillis: display.CountdownRemainingMillis,
		StartedUnix:              unixOrZero(started),
		SessionElapsedMillis:     display.SessionElapsedMillis,
		ElapsedMillis:            display.ElapsedMillis,
		ChallengeElapsedMillis:   display.ChallengeElapsedMillis,
		ChallengeAttemptCount:    display.ChallengeAttemptCount,
		Success:                  display.Success,
		SessionID:                sessionID,
		LastPressureUnix:         unixOrZero(lastPressureInput),
		RNGSeed:                  rngSeed,
		Recorder:                 recorderStats,
		FinishedLevelAttempts:    recentAttempts,
		Performance:              r.framePerf.Snapshot(),
		Catalog:                  gameCatalog(cfg.PlatformURL),
	}
}

func (r *gameRuntime) Performance() framePerfSnapshot {
	if r == nil {
		return framePerfSnapshot{}
	}
	return r.framePerf.Snapshot()
}

func (r *gameRuntime) SessionID() string {
	if r == nil {
		return ""
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	if isAmbientActivityGame(r.current.Game) {
		return ""
	}
	return r.sessionID
}

func (r *gameRuntime) VenueSessionID() string {
	if r == nil {
		return ""
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	if isAmbientActivityGame(r.current.Game) {
		return ""
	}
	return r.current.VenueSessionID
}

func (r *gameRuntime) effectiveNowLocked(now time.Time) time.Time {
	if now.IsZero() {
		now = time.Now()
	}
	if r.paused {
		now = r.pausedAt
	}
	if r.pauseTotal > 0 {
		now = now.Add(-r.pauseTotal)
	}
	return now
}

func (r *gameRuntime) applyLocked(cfg config, playAudio bool) {
	r.applyLockedWithNarration(cfg, playAudio, narrationAuto)
}

func (r *gameRuntime) applyLockedWithNarration(cfg config, playAudio bool, mode narrationMode) {
	r.applyLockedWithNarrationReason(cfg, playAudio, mode, "game changed")
}

func (r *gameRuntime) applyLockedWithNarrationPrepared(cfg config, playAudio bool, mode narrationMode, preparedIntroHold time.Duration) {
	r.applyLockedWithNarrationReasonPrepared(cfg, playAudio, mode, "game changed", preparedIntroHold)
}

func (r *gameRuntime) applyLockedWithNarrationReason(cfg config, playAudio bool, mode narrationMode, endReason string) {
	r.applyLockedWithNarrationReasonPrepared(cfg, playAudio, mode, endReason, -1)
}

func (r *gameRuntime) applyLockedWithNarrationReasonPrepared(cfg config, playAudio bool, mode narrationMode, endReason string, preparedIntroHold time.Duration) {
	now := time.Now()
	if r.sessionID != "" {
		r.finishActiveLevelAttemptLocked("abandoned", displayStatus{}, now)
		if endReason == "" {
			endReason = "game changed"
		}
		r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
			record.Payload = &gamepb.GameSessionRecord_SessionEnded{SessionEnded: &gamepb.SessionEnded{
				Reason:         endReason,
				EndedUnixNanos: now.UnixNano(),
			}}
		})
	}
	cfg.normalize()
	r.rngSeed = now.UnixNano()
	game := makeGame(cfg, r.rngSeed, now)
	cfg = applyPlataformasAudioConfig(cfg, game)
	introHold := time.Duration(0)
	if playAudio && r.shouldNarrateLocked(cfg, mode) {
		if preparedIntroHold >= 0 {
			introHold = preparedIntroHold
		} else {
			introHold = r.narrationHoldDuration(cfg)
		}
	}
	gameNow := now.Add(introHold)
	if introHold > 0 {
		game = makeGame(cfg, r.rngSeed, gameNow)
		cfg = applyPlataformasAudioConfig(cfg, game)
	}
	label := gameLabel(cfg.Game)
	if labeled, ok := game.(interface{ Label() string }); ok {
		label = labeled.Label()
	}
	r.current = cfg
	r.started = now
	r.sessionID = newSessionID(now)
	r.sessionSeq = 0
	r.game = game
	r.lastEvent = displayEvent{}
	r.ambientTouches = nil
	r.levelAttempt = nil
	r.paused = false
	r.pausedAt = time.Time{}
	r.pauseTotal = 0
	r.lastPressure = now
	r.introUntil = time.Time{}
	if introHold > 0 {
		r.introUntil = gameNow
	}
	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_SessionStarted{SessionStarted: &gamepb.SessionStarted{
			Game:             cfg.Game,
			Label:            label,
			PlayerCount:      uint32(cfg.PlayerCount),
			RngSeed:          r.rngSeed,
			StartedUnixNanos: now.UnixNano(),
			Difficulty:       cfg.Difficulty,
			Level:            cfg.Level,
			TeamName:         cfg.TeamName,
			Players:          displayPlayersPB(defaultDisplayPlayers(cfg)),
			VenueSessionId:   cfg.VenueSessionID,
		}}
	})
	if playAudio {
		r.startAudioLocked(cfg, now, introHold, mode)
	}
}

func (r *gameRuntime) preparedLaunchIntroHold(cfg config, mode narrationMode) time.Duration {
	if r == nil {
		return 0
	}
	cfg.normalize()
	audioGame := makeGame(cfg, time.Now().UnixNano(), time.Now())
	cfg = applyPlataformasAudioConfig(cfg, audioGame)
	r.mu.RLock()
	shouldNarrate := r.shouldNarrateLocked(cfg, mode)
	r.mu.RUnlock()
	if !shouldNarrate {
		return 0
	}
	return r.narrationHoldDuration(cfg)
}

func applyPlataformasAudioConfig(cfg config, game floorGame) config {
	if isPlatformRuntimeGame(cfg.Game) {
		provider, ok := game.(plataformasAudioProvider)
		if !ok {
			return cfg
		}
		refs := provider.AudioRefs()
		if refs.MusicRef != "" {
			cfg.MusicRef = refs.MusicRef
			cfg.MusicVolume = clamp01(refs.MusicVolume)
		}
		if refs.StartCueRef != "" {
			cfg.StartCueRef = refs.StartCueRef
		}
		if refs.NarrationCueRef != "" {
			cfg.NarrationCueRef = refs.NarrationCueRef
		}
		if refs.CoinCueRef != "" {
			cfg.CoinCueRef = refs.CoinCueRef
		}
		if refs.DoubleCoinCueRef != "" {
			cfg.DoubleCoinCueRef = refs.DoubleCoinCueRef
		}
		if refs.DamageCueRef != "" {
			cfg.DamageCueRef = refs.DamageCueRef
		}
		if refs.WinCueRef != "" {
			cfg.WinCueRef = refs.WinCueRef
		}
		if refs.DefeatCueRef != "" {
			cfg.DefeatCueRef = refs.DefeatCueRef
		}
	} else if cfg.Game == "animations" || cfg.Game == "salvapantallas" || strings.HasPrefix(cfg.Game, "animation-") {
		provider, ok := game.(interface {
			AudioRefs() animations.AudioRefs
		})
		if !ok {
			return cfg
		}
		refs := provider.AudioRefs()
		if refs.MusicRef != "" {
			cfg.MusicRef = refs.MusicRef
			cfg.MusicVolume = clamp01(refs.MusicVolume)
		}
		if refs.CoinCueRef != "" {
			cfg.CoinCueRef = refs.CoinCueRef
		}
		if refs.DoubleCoinCueRef != "" {
			cfg.DoubleCoinCueRef = refs.DoubleCoinCueRef
		}
		if refs.DamageCueRef != "" {
			cfg.DamageCueRef = refs.DamageCueRef
		}
		if refs.WinCueRef != "" {
			cfg.WinCueRef = refs.WinCueRef
		}
		if refs.DefeatCueRef != "" {
			cfg.DefeatCueRef = refs.DefeatCueRef
		}
		if refs.PressureCueRef != "" {
			cfg.PressureCueRef = refs.PressureCueRef
		}
	}
	if cfg.DoubleCoinCueRef == "" {
		cfg.DoubleCoinCueRef = cfg.CoinCueRef
	}
	if cfg.DefeatCueRef == "" {
		cfg.DefeatCueRef = cfg.DamageCueRef
	}
	return cfg
}

func (r *gameRuntime) recordPressureActivity(now time.Time, pressed bool) {
	if r == nil {
		return
	}
	r.mu.Lock()
	if now.After(r.lastPressureInput) {
		r.lastPressureInput = now
	}
	if pressed && now.After(r.lastPressure) {
		r.lastPressure = now
	}
	if r.venueStatus == "active" && now.After(r.venueLastActivity) {
		r.venueLastActivity = now
	}
	r.mu.Unlock()
}

func (r *gameRuntime) enforceNoPressureTimeout(now time.Time) {
	if r == nil {
		return
	}
	if now.IsZero() {
		now = time.Now()
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.enforceNoPressureTimeoutLocked(now)
}

func (r *gameRuntime) enforceNoPressureTimeoutLocked(now time.Time) {
	if r.sessionID == "" || animation.IsAmbientMode(r.current.Game) {
		return
	}
	if r.lastPressure.IsZero() {
		r.lastPressure = r.started
	}
	if r.lastPressure.IsZero() || now.Sub(r.lastPressure) < noPressureGameLimit {
		return
	}
	log.Printf("game no-pressure timeout: game=%s idle=%s", r.current.Game, now.Sub(r.lastPressure).Round(time.Second))
	r.applyLockedWithNarrationReason(configForSelection(r.base, "salvapantallas", 1), true, narrationAuto, "no pressure timeout")
}

func (r *gameRuntime) recordEvent(cue, message string, now time.Time) {
	if r == nil {
		return
	}
	r.mu.Lock()
	r.lastEvent = displayEvent{unixNanos: now.UnixNano(), cue: cue, message: message}
	r.mu.Unlock()
}

func (r *gameRuntime) startAudioLocked(cfg config, now time.Time, countdownDelay time.Duration, mode narrationMode) {
	if r.audio == nil {
		return
	}
	if r.audioMuted {
		r.audio.StopLoop()
		return
	}
	if cfg.MusicRef != "" {
		if err := r.audio.StartLoop(cfg.MusicRef, cfg.MusicVolume); err != nil {
			log.Printf("background music: %v", err)
		} else {
			r.recordAudioCueLocked("music_loop", cfg.MusicRef, cfg.MusicVolume, now)
		}
	} else {
		r.audio.StopLoop()
	}
	if cfg.StartCueRef != "" {
		if err := r.audio.PlayCue(cfg.StartCueRef, cfg.CueVolume); err != nil {
			log.Printf("start cue: %v", err)
		} else {
			r.recordAudioCueLocked(whackamole.CueStart, cfg.StartCueRef, cfg.CueVolume, now)
		}
	}
	r.playStartNarrationLocked(cfg, now, mode)
	r.scheduleCountdownLocked(cfg, now, countdownDelay)
}

func (r *gameRuntime) playStartNarrationLocked(cfg config, now time.Time, mode narrationMode) {
	switch mode {
	case narrationSkip:
		return
	case narrationForce:
		r.playNarrationLocked(cfg, now, true)
	default:
		r.playNarrationLocked(cfg, now, false)
	}
}

func (r *gameRuntime) playNarrationLocked(cfg config, now time.Time, force bool) {
	if r.audio == nil || r.audioMuted || cfg.NarrationCueRef == "" {
		return
	}
	key := narrationKey(cfg)
	if !force && r.narrated[key] {
		return
	}
	if err := r.audio.PlayCue(cfg.NarrationCueRef, cfg.NarrationVolume); err != nil {
		log.Printf("narration cue: %v", err)
		return
	}
	r.narrated[key] = true
	r.recordAudioCueLocked("narration", cfg.NarrationCueRef, cfg.NarrationVolume, now)
}

func (r *gameRuntime) scheduleCountdownLocked(cfg config, now time.Time, delay time.Duration) {
	if r.audio == nil || r.audioMuted || cfg.CountdownCueRef == "" || !shouldPlayCountdownCue(cfg) {
		return
	}
	if delay <= 0 {
		r.playCountdownLocked(cfg, now)
		return
	}
	sessionID := r.sessionID
	game := cfg.Game
	go func() {
		timer := time.NewTimer(delay)
		defer timer.Stop()
		<-timer.C
		playAt := time.Now()
		r.mu.Lock()
		defer r.mu.Unlock()
		if r.sessionID != sessionID || r.current.Game != game || r.audioMuted {
			return
		}
		r.playCountdownLocked(r.current, playAt)
	}()
}

func (r *gameRuntime) playCountdownLocked(cfg config, now time.Time) {
	if r.audio == nil || r.audioMuted || cfg.CountdownCueRef == "" {
		return
	}
	if err := r.audio.PlayCue(cfg.CountdownCueRef, cfg.CountdownVolume); err != nil {
		log.Printf("countdown cue: %v", err)
		return
	}
	r.recordAudioCueLocked("countdown", cfg.CountdownCueRef, cfg.CountdownVolume, now)
}

func shouldPlayCountdownCue(cfg config) bool {
	if strings.HasPrefix(cfg.Game, "authored-") {
		return true
	}
	if isPlatformRuntimeGame(cfg.Game) {
		return true
	}
	switch cfg.Game {
	case "lava", "saltos", "parkour", "parkour2", "plataformas", "temporada1-niveles", "temporada1", "temporada2":
		return true
	default:
		return false
	}
}

func shouldPlayCountdownAfterReadyCue(cfg config) bool {
	switch cfg.Game {
	case "whack-a-mole", "duel":
		return true
	default:
		return false
	}
}

func (r *gameRuntime) shouldNarrateLocked(cfg config, mode narrationMode) bool {
	if r.audio == nil || r.audioMuted || cfg.NarrationCueRef == "" {
		return false
	}
	switch mode {
	case narrationSkip:
		return false
	case narrationForce:
		return true
	default:
		return !r.narrated[narrationKey(cfg)]
	}
}

func narrationKey(cfg config) string {
	ref := strings.TrimSpace(cfg.NarrationCueRef)
	if ref == "" {
		return normalizeGame(cfg.Game)
	}
	if level := strings.TrimSpace(cfg.Level); level != "" {
		return normalizeGame(cfg.Game) + "\x00" + level + "\x00" + ref
	}
	return normalizeGame(cfg.Game) + "\x00" + ref
}

func (r *gameRuntime) narrationHoldDuration(cfg config) time.Duration {
	if r.audio == nil || cfg.NarrationCueRef == "" {
		return 0
	}
	duration, err := r.audio.Duration(cfg.NarrationCueRef)
	if err != nil {
		log.Printf("narration duration: %v", err)
		return 0
	}
	return duration
}

func (r *gameRuntime) applyIntroStatus(status *displayStatus, now time.Time, introUntil time.Time) {
	if status == nil || introUntil.IsZero() || !now.Before(introUntil) || status.Phase == "finished" {
		return
	}
	introRemaining := introUntil.Sub(now).Milliseconds()
	if introRemaining < 0 {
		introRemaining = 0
	}
	status.Phase = "intro"
	status.IntroRemainingMillis = introRemaining
	if status.CountdownRemainingMillis > introRemaining {
		status.CountdownRemainingMillis -= introRemaining
	}
	status.RemainingMillis = introRemaining
}

func (r *gameRuntime) playCue(cfg config, audioPlayer *audio.Player, cue string, ref string, now time.Time) {
	if ref == "" {
		return
	}
	r.mu.RLock()
	muted := r.audioMuted
	r.mu.RUnlock()
	if audioPlayer != nil && !muted {
		if err := audioPlayer.PlayCue(ref, cfg.CueVolume); err != nil {
			log.Printf("pressure audio: %v", err)
		}
		if cue == whackamole.CueDoubleCoin {
			go func() {
				time.Sleep(70 * time.Millisecond)
				r.mu.RLock()
				stillMuted := r.audioMuted
				r.mu.RUnlock()
				if stillMuted {
					return
				}
				if err := audioPlayer.PlayCue(ref, cfg.CueVolume); err != nil {
					log.Printf("pressure audio: %v", err)
				}
			}()
		}
	}
	r.mu.Lock()
	r.recordAudioCueLocked(cue, ref, cfg.CueVolume, now)
	r.mu.Unlock()
}

func (r *gameRuntime) playCountdownCue(cfg config, audioPlayer *audio.Player, now time.Time) {
	if cfg.CountdownCueRef == "" {
		return
	}
	r.mu.RLock()
	muted := r.audioMuted
	r.mu.RUnlock()
	if audioPlayer != nil && !muted {
		if err := audioPlayer.PlayCue(cfg.CountdownCueRef, cfg.CountdownVolume); err != nil {
			log.Printf("countdown cue: %v", err)
		}
	}
	r.mu.Lock()
	r.recordAudioCueLocked("countdown", cfg.CountdownCueRef, cfg.CountdownVolume, now)
	r.mu.Unlock()
}

func (r *gameRuntime) setAudioMutedLocked(muted bool, now time.Time) {
	if r.audioMuted == muted {
		return
	}
	r.audioMuted = muted
	if r.audio == nil {
		return
	}
	if muted {
		r.audio.StopAll()
		return
	}
	r.startMusicLoopLocked(r.current, now)
}

func (r *gameRuntime) startMusicLoopLocked(cfg config, now time.Time) {
	if r.audio == nil || r.audioMuted || cfg.MusicRef == "" {
		return
	}
	if err := r.audio.StartLoop(cfg.MusicRef, cfg.MusicVolume); err != nil {
		log.Printf("background music: %v", err)
		return
	}
	r.recordAudioCueLocked("music_loop", cfg.MusicRef, cfg.MusicVolume, now)
}

func (r *gameRuntime) RecordAPIInteraction(method, path, remoteAddr string, status int, now time.Time) {
	if r == nil {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_ApiInteraction{ApiInteraction: &gamepb.ApiInteraction{
			Method:     method,
			Path:       path,
			RemoteAddr: remoteAddr,
			UnixNanos:  now.UnixNano(),
			Status:     uint32(status),
		}}
	})
}

func (r *gameRuntime) RecordDisplaySnapshot(status displayStatus, now time.Time) {
	if r == nil {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.recordLevelAttemptChangesLocked(status, now)
	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_DisplaySnapshot{DisplaySnapshot: displaySnapshotPB(status)}
	})
}

func (r *gameRuntime) ObserveDisplayStatus(status displayStatus, now time.Time) {
	if r == nil {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.recordLevelAttemptChangesLocked(status, now)
}

func (r *gameRuntime) recordLevelAttemptChangesLocked(status displayStatus, now time.Time) {
	if !recordsLevelAttempts(status.CurrentGame) || status.Level == "" {
		r.finishActiveLevelAttemptLocked("abandoned", status, now)
		return
	}
	if status.Phase == "finished" {
		if r.levelAttempt != nil && r.levelAttempt.Level == status.Level {
			result := "failed"
			if status.Success {
				result = "success"
			}
			r.finishActiveLevelAttemptLocked(result, status, now)
		}
		return
	}
	if status.Phase == "idle" {
		return
	}
	startedUnixNanos := status.AttemptStartedUnixNanos
	if startedUnixNanos == 0 {
		startedUnixNanos = now.UnixNano()
	}
	if r.levelAttempt != nil {
		if r.levelAttempt.Level == status.Level && r.levelAttempt.StartedUnixNanos == startedUnixNanos {
			return
		}
		r.finishActiveLevelAttemptLocked("superseded", status, now)
	}
	r.startLevelAttemptLocked(status, startedUnixNanos, now)
}

func (r *gameRuntime) startLevelAttemptLocked(status displayStatus, startedUnixNanos int64, now time.Time) {
	if r.sessionID == "" {
		return
	}
	gameplayStartedUnixNanos := status.GameplayStartedUnixNanos
	if gameplayStartedUnixNanos == 0 {
		gameplayStartedUnixNanos = startedUnixNanos
	}
	attempt := &levelAttemptTracker{
		AttemptID:                fmt.Sprintf("%s:%s:%d", r.sessionID, status.Level, startedUnixNanos),
		Game:                     status.CurrentGame,
		Level:                    status.Level,
		LevelNumber:              status.LevelNumber,
		Difficulty:               status.Difficulty,
		PlayerCount:              status.PlayerCount,
		LivesStart:               status.LivesStart,
		ScoreStart:               status.Score,
		ActiveTargetsStart:       status.ActiveTargets,
		StartedUnixNanos:         startedUnixNanos,
		GameplayStartedUnixNanos: gameplayStartedUnixNanos,
	}
	if attempt.LevelNumber == 0 {
		attempt.LevelNumber = levelNumberFromID(status.Level)
	}
	r.levelAttempt = attempt
	if r.cameraRecorder != nil {
		r.cameraRecorder.StartLevelAttempt(cameraRecordingStart{
			AttemptID:                attempt.AttemptID,
			SessionID:                r.sessionID,
			VenueSessionID:           r.current.VenueSessionID,
			ControllerLabel:          r.base.ControllerLabel,
			ControllerHostname:       r.base.ControllerHostname,
			Game:                     attempt.Game,
			Level:                    attempt.Level,
			LevelNumber:              attempt.LevelNumber,
			Difficulty:               attempt.Difficulty,
			TeamName:                 r.current.TeamName,
			PlayerCount:              attempt.PlayerCount,
			StartedUnixNanos:         attempt.StartedUnixNanos,
			GameplayStartedUnixNanos: attempt.GameplayStartedUnixNanos,
		})
	}
	r.recordLocked(time.Unix(0, startedUnixNanos), func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_LevelAttemptStarted{LevelAttemptStarted: &gamepb.LevelAttemptStarted{
			AttemptId:                attempt.AttemptID,
			Game:                     attempt.Game,
			LevelId:                  attempt.Level,
			LevelNumber:              uint32(attempt.LevelNumber),
			Difficulty:               attempt.Difficulty,
			PlayerCount:              uint32(attempt.PlayerCount),
			LivesStart:               int32(attempt.LivesStart),
			ScoreStart:               int32(attempt.ScoreStart),
			ActiveTargetsStart:       uint32(attempt.ActiveTargetsStart),
			StartedUnixNanos:         attempt.StartedUnixNanos,
			GameplayStartedUnixNanos: attempt.GameplayStartedUnixNanos,
		}}
	})
}

func (r *gameRuntime) finishActiveLevelAttemptLocked(result string, status displayStatus, now time.Time) {
	attempt := r.levelAttempt
	if attempt == nil {
		return
	}
	endedUnixNanos := status.AttemptEndedUnixNanos
	if endedUnixNanos == 0 {
		endedUnixNanos = now.UnixNano()
	}
	if endedUnixNanos < attempt.StartedUnixNanos {
		endedUnixNanos = now.UnixNano()
	}
	elapsedMillis := int64(status.ElapsedMillis)
	if elapsedMillis == 0 && endedUnixNanos > attempt.GameplayStartedUnixNanos {
		elapsedMillis = (endedUnixNanos - attempt.GameplayStartedUnixNanos) / int64(time.Millisecond)
	}
	scoreEnd := status.Score
	livesEnd := status.Lives
	activeTargetsEnd := status.ActiveTargets
	if result == "success" || result == "failed" {
		r.recentAttempts = append(r.recentAttempts, finishedLevelAttemptStatus{
			AttemptID:      attempt.AttemptID,
			Game:           attempt.Game,
			Level:          attempt.Level,
			LevelNumber:    attempt.LevelNumber,
			Difficulty:     attempt.Difficulty,
			Result:         result,
			Success:        result == "success",
			ElapsedMillis:  elapsedMillis,
			EndedUnixNanos: endedUnixNanos,
		})
		if len(r.recentAttempts) > 64 {
			r.recentAttempts = r.recentAttempts[len(r.recentAttempts)-64:]
		}
		if result == "success" && elapsedMillis > 0 {
			key := levelAttemptRecordKey(attempt.Game, attempt.Level, attempt.Difficulty)
			if key != "" && (r.bestAttemptMillis[key] == 0 || elapsedMillis < r.bestAttemptMillis[key]) {
				r.bestAttemptMillis[key] = elapsedMillis
			}
		}
	}
	if r.cameraRecorder != nil {
		r.cameraRecorder.FinishLevelAttempt(cameraRecordingFinish{
			AttemptID:      attempt.AttemptID,
			Result:         result,
			Success:        result == "success",
			ScoreEnd:       scoreEnd,
			LivesEnd:       livesEnd,
			ElapsedMillis:  elapsedMillis,
			EndedUnixNanos: endedUnixNanos,
		})
	}
	r.recordLocked(time.Unix(0, endedUnixNanos), func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_LevelAttemptFinished{LevelAttemptFinished: &gamepb.LevelAttemptFinished{
			AttemptId:                attempt.AttemptID,
			Game:                     attempt.Game,
			LevelId:                  attempt.Level,
			LevelNumber:              uint32(attempt.LevelNumber),
			Difficulty:               attempt.Difficulty,
			Result:                   result,
			ScoreStart:               int32(attempt.ScoreStart),
			ScoreEnd:                 int32(scoreEnd),
			LivesStart:               int32(attempt.LivesStart),
			LivesEnd:                 int32(livesEnd),
			ActiveTargetsStart:       uint32(attempt.ActiveTargetsStart),
			ActiveTargetsEnd:         uint32(activeTargetsEnd),
			StartedUnixNanos:         attempt.StartedUnixNanos,
			GameplayStartedUnixNanos: attempt.GameplayStartedUnixNanos,
			EndedUnixNanos:           endedUnixNanos,
			ElapsedMillis:            elapsedMillis,
		}}
	})
	r.levelAttempt = nil
}

func (r *gameRuntime) StartDisplaySnapshotRecording(interval time.Duration) {
	if r == nil {
		return
	}
	if interval <= 0 {
		interval = 250 * time.Millisecond
	}
	go func() {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for now := range ticker.C {
			r.RecordDisplaySnapshot(r.DisplayStatus(now), now)
		}
	}()
}

func recordsLevelAttempts(game string) bool {
	if isPlatformRuntimeGame(game) {
		return true
	}
	switch game {
	case "parkour", "parkour2", "plataformas", "temporada1-niveles", "temporada1", "temporada2":
		return true
	default:
		return false
	}
}

func levelAttemptRecordKey(game string, level string, difficulty string) string {
	game = strings.TrimSpace(normalizeGame(game))
	level = strings.TrimSpace(level)
	difficulty = strings.TrimSpace(difficulty)
	if game == "" || level == "" {
		return ""
	}
	return game + "\x00" + level + "\x00" + difficulty
}

func gameHasConfigurablePlayers(game string, platformURL string) bool {
	normalized := normalizeGame(game)
	for _, entry := range gameCatalog(platformURL) {
		if normalizeGame(entry.Game) == normalized {
			return entry.Players && entry.MaxPlayers > entry.MinPlayers
		}
	}
	if strings.HasPrefix(normalized, "animation-") || animation.IsAmbientMode(normalized) {
		return false
	}
	if strings.HasPrefix(normalized, "authored-") || isPlatformLevelGameID(normalized) {
		return true
	}
	return false
}

func gameHasConfigurableDifficulty(game string, platformURL string) bool {
	normalized := normalizeGame(game)
	for _, entry := range gameCatalog(platformURL) {
		if normalizeGame(entry.Game) == normalized {
			return entry.Difficulty
		}
	}
	if strings.HasPrefix(normalized, "animation-") || animation.IsAmbientMode(normalized) {
		return false
	}
	return strings.HasPrefix(normalized, "authored-") || isPlatformLevelGameID(normalized)
}

func isPlatformRuntimeGame(game string) bool {
	game = normalizeGame(game)
	return isPlatformLevelGameID(game) || game == "plataformas" || game == "parkour2" || game == "temporada1-niveles"
}

func (r *gameRuntime) recordPressureInput(event *inputpb.PressureEvent, now time.Time) {
	if r == nil || event == nil {
		return
	}
	unixNanos := event.UnixNanos
	if unixNanos == 0 {
		unixNanos = now.UnixNano()
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_PressureInput{PressureInput: &gamepb.PressureInput{
			SourceSequence: event.Sequence,
			UnixNanos:      unixNanos,
			X:              event.X,
			Y:              event.Y,
			Pressed:        event.Pressed,
			Source:         event.Source,
			Controller:     event.Controller,
			Channel:        event.Channel,
			Position:       event.Position,
		}}
	})
}

func (r *gameRuntime) recordGameEvent(cue, message string, now time.Time) {
	r.recordEvent(cue, message, now)
	r.mu.Lock()
	defer r.mu.Unlock()
	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_GameEvent{GameEvent: &gamepb.GameEvent{
			Cue:       cue,
			Message:   message,
			UnixNanos: now.UnixNano(),
		}}
	})
}

func (r *gameRuntime) recordAudioCueLocked(cue, ref string, volume float64, now time.Time) {
	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_AudioCue{AudioCue: &gamepb.AudioCue{
			Ref:       ref,
			Cue:       cue,
			Volume:    volume,
			UnixNanos: now.UnixNano(),
		}}
	})
}

func (r *gameRuntime) recordLocked(now time.Time, setPayload func(*gamepb.GameSessionRecord)) {
	if r.recorder == nil || r.sessionID == "" {
		return
	}
	if isAmbientActivityGame(r.current.Game) {
		return
	}
	if now.IsZero() {
		now = time.Now()
	}
	r.sessionSeq++
	record := &gamepb.GameSessionRecord{
		SessionId:      r.sessionID,
		VenueSessionId: r.current.VenueSessionID,
		Sequence:       r.sessionSeq,
		UnixNanos:      now.UnixNano(),
	}
	setPayload(record)
	if err := r.recorder.Record(record); err != nil {
		log.Printf("session recording: %v", err)
	}
}

func displaySnapshotPB(status displayStatus) *gamepb.DisplaySnapshot {
	return &gamepb.DisplaySnapshot{
		CurrentGame:              status.CurrentGame,
		Label:                    status.Label,
		Phase:                    status.Phase,
		PlayerCount:              uint32(status.PlayerCount),
		Players:                  displayPlayersPB(status.Players),
		Score:                    int32(status.Score),
		Lives:                    int32(status.Lives),
		StartedUnix:              status.StartedUnix,
		EndsUnix:                 status.EndsUnix,
		ElapsedMillis:            status.ElapsedMillis,
		RemainingMillis:          status.RemainingMillis,
		IntroRemainingMillis:     status.IntroRemainingMillis,
		CountdownRemainingMillis: status.CountdownRemainingMillis,
		ActiveTargets:            uint32(status.ActiveTargets),
		AudioEnabled:             status.AudioEnabled,
		AudioMuted:               status.AudioMuted,
		LastEventUnixNanos:       status.LastEventUnixNanos,
		LastEventCue:             status.LastEventCue,
		LastEventMessage:         status.LastEventMessage,
		Level:                    status.Level,
		Difficulty:               status.Difficulty,
		Success:                  status.Success,
	}
}

func displayPlayersPB(players []displayPlayer) []*gamepb.DisplayPlayer {
	out := make([]*gamepb.DisplayPlayer, 0, len(players))
	for _, player := range players {
		out = append(out, &gamepb.DisplayPlayer{
			Index: uint32(player.Index),
			Label: player.Label,
			Color: &gamepb.Color{R: uint32(player.Color.R), G: uint32(player.Color.G), B: uint32(player.Color.B)},
			Score: int32(player.Score),
			Lives: int32(player.Lives),
		})
	}
	return out
}

func levelNumberFromID(level string) int {
	value := strings.TrimPrefix(strings.TrimSpace(strings.ToLower(level)), "level-")
	n, err := strconv.Atoi(value)
	if err != nil || n < 0 {
		return 0
	}
	return n
}

func newSessionID(time.Time) string {
	id, err := newUUID()
	if err != nil {
		return fmt.Sprintf("00000000-0000-4000-8000-%012x", time.Now().UnixNano()&0xffffffffffff)
	}
	return id
}

func newUUID() (string, error) {
	var random [16]byte
	if _, err := crand.Read(random[:]); err != nil {
		return "", err
	}
	random[6] = (random[6] & 0x0f) | 0x40
	random[8] = (random[8] & 0x3f) | 0x80
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		random[0:4],
		random[4:6],
		random[6:8],
		random[8:10],
		random[10:16],
	), nil
}

func makeGame(cfg config, seed int64, now time.Time) floorGame {
	if isPlatformLevelGameID(cfg.Game) {
		log.Printf("game: platform-level id=%s players=%d difficulty=%s level=%s", cfg.Game, cfg.PlayerCount, cfg.Difficulty, cfg.Level)
		return plataformas.NewWithSeedForGame(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level, cfg.PlatformURL, cfg.Game)
	}
	if strings.HasPrefix(cfg.Game, "animation-") {
		cfg.Level = strings.TrimPrefix(cfg.Game, "animation-")
		cfg.Game = "animations"
	}
	if strings.HasPrefix(cfg.Game, "authored-") {
		log.Printf("game: authored id=%s players=%d difficulty=%s level=%s runtime=%s", cfg.Game, cfg.PlayerCount, cfg.Difficulty, cfg.Level, cfg.AuthoredRuntime)
		game, err := authored.NewWithSeedRuntime(now, seed, cfg.Game, cfg.PlayerCount, whackPlayersFromConfig(cfg), cfg.PlatformURL, cfg.Difficulty, cfg.Level, cfg.AuthoredRuntime)
		if err != nil {
			log.Printf("authored game: %v", err)
			return nil
		}
		return game
	}
	switch cfg.Game {
	case "whack-a-mole":
		log.Printf("game: whack-a-mole players=%d", cfg.PlayerCount)
		return whackamole.NewWithSeedAndPlayers(whackPlayersFromConfig(cfg), now, seed)
	case "lava":
		log.Printf("game: lava players=%d difficulty=%s", cfg.PlayerCount, cfg.Difficulty)
		return lava.NewWithSeed(cfg.PlayerCount, now, seed, cfg.Difficulty)
	case "saltos":
		log.Printf("game: saltos level=%s", cfg.Level)
		return saltos.NewWithSeed(now, seed, cfg.Level)
	case "parkour":
		log.Printf("game: parkour difficulty=%s level=%s", cfg.Difficulty, cfg.Level)
		return parkour.NewWithSeed(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level)
	case "plataformas":
		log.Printf("game: plataformas players=%d difficulty=%s level=%s", cfg.PlayerCount, cfg.Difficulty, cfg.Level)
		return plataformas.NewWithSeed(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level, cfg.PlatformURL)
	case "parkour2":
		log.Printf("game: parkour2 difficulty=%s level=%s", cfg.Difficulty, cfg.Level)
		return plataformas.NewWithSeedForGame(now, seed, 1, cfg.Difficulty, cfg.Level, cfg.PlatformURL, "parkour2")
	case "temporada1-niveles":
		log.Printf("game: temporada1-niveles players=%d difficulty=%s level=%s", cfg.PlayerCount, cfg.Difficulty, cfg.Level)
		return plataformas.NewWithSeedForGame(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level, cfg.PlatformURL, "temporada1-niveles")
	case "animations":
		log.Printf("game: animations players=%d difficulty=%s level=%s", cfg.PlayerCount, cfg.Difficulty, cfg.Level)
		return animations.NewWithSeed(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level, cfg.PlatformURL)
	case "salvapantallas":
		rotationEvery := time.Duration(cfg.DurationSeconds) * time.Second
		log.Printf("game: salvapantallas rotation=%s", rotationEvery)
		return animations.NewScreensaverWithSeed(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.PlatformURL, rotationEvery)
	case "temporada1":
		log.Printf("game: temporada1 players=%d difficulty=%s level=%s", cfg.PlayerCount, cfg.Difficulty, cfg.Level)
		return temporada1.NewWithSeed(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level)
	case "temporada2":
		log.Printf("game: temporada2 players=%d level=%s", cfg.PlayerCount, cfg.Level)
		return temporada2.NewWithSeed(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level)
	case "duel":
		log.Printf("game: duel players=%d", cfg.PlayerCount)
		return duel.NewWithSeedAndPlayers(whackPlayersFromConfig(cfg), now, seed)
	case "memory":
		log.Printf("game: memory players=%d", cfg.PlayerCount)
		return memorychallenge.NewWithSeedAndPlayers(now, seed, whackPlayersFromConfig(cfg))
	case "patrones":
		log.Printf("game: patrones players=%d difficulty=%s level=%s", cfg.PlayerCount, cfg.Difficulty, cfg.Level)
		return patrones.NewWithSeed(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level)
	default:
		log.Printf("game: %s", cfg.Game)
		return nil
	}
}

func whackPlayersFromConfig(cfg config) []whackamole.PlayerConfig {
	playerCount := normalizeRosterPlayerCount(cfg.PlayerCount)
	players := make([]whackamole.PlayerConfig, playerCount)
	for i := 0; i < playerCount; i++ {
		color := configuredPlayerColor(cfg, i, displayColor{})
		players[i] = whackamole.PlayerConfig{
			Label: configuredPlayerLabel(cfg, i, fmt.Sprintf("Jugador %d", i+1)),
			Color: animation.RGB{R: byte(clampColorByte(color.R)), G: byte(clampColorByte(color.G)), B: byte(clampColorByte(color.B))},
		}
	}
	return players
}

func clampColorByte(value int) int {
	if value < 0 {
		return 0
	}
	if value > 255 {
		return 255
	}
	return value
}

const (
	ambientTouchLifetime = 2200 * time.Millisecond
	ambientMaxTouches    = 64
)

func (r *gameRuntime) addAmbientTouch(x, y int, now time.Time) {
	if x < 0 || x >= animation.GridWidth || y < 0 || y >= animation.GridHeight {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.ambientTouches = appendActiveAmbientTouchesLocked(r.ambientTouches, now)
	r.ambientTouches = append(r.ambientTouches, ambientTouch{x: x, y: y, started: now})
	if len(r.ambientTouches) > ambientMaxTouches {
		r.ambientTouches = r.ambientTouches[len(r.ambientTouches)-ambientMaxTouches:]
	}
}

func copyActiveAmbientTouchesLocked(touches []ambientTouch, now time.Time) []ambientTouch {
	out := make([]ambientTouch, 0, len(touches))
	for _, touch := range touches {
		if now.Sub(touch.started) <= ambientTouchLifetime {
			out = append(out, touch)
		}
	}
	return out
}

func appendActiveAmbientTouchesLocked(touches []ambientTouch, now time.Time) []ambientTouch {
	if len(touches) == 0 {
		return touches
	}
	write := 0
	for _, touch := range touches {
		if now.Sub(touch.started) <= ambientTouchLifetime {
			touches[write] = touch
			write++
		}
	}
	return touches[:write]
}

func renderAmbient(game string, now time.Time, started time.Time, touches []ambientTouch) []animation.RGB {
	seconds := float64(0)
	if !now.IsZero() && !started.IsZero() {
		seconds = now.Sub(started).Seconds()
	}
	frame := make([]animation.RGB, animation.GridWidth*animation.GridHeight)
	for y := 0; y < animation.GridHeight; y++ {
		for x := 0; x < animation.GridWidth; x++ {
			color := animation.Color(game, x, y, seconds)
			if len(touches) > 0 {
				color = applyAmbientTouches(game, color, x, y, now, touches)
			}
			frame[y*animation.GridWidth+x] = color
		}
	}
	return frame
}

func applyAmbientTouches(game string, base animation.RGB, x, y int, now time.Time, touches []ambientTouch) animation.RGB {
	r := float64(base.R)
	g := float64(base.G)
	b := float64(base.B)
	for _, touch := range touches {
		age := now.Sub(touch.started).Seconds()
		if age < 0 || age > ambientTouchLifetime.Seconds() {
			continue
		}
		dist := math.Hypot(float64(x-touch.x), float64(y-touch.y))
		intensity := ambientTouchIntensity(game, dist, age)
		if intensity <= 0 {
			continue
		}
		tr, tg, tb := ambientTouchColor(game, age)
		r += tr * intensity
		g += tg * intensity
		b += tb * intensity
	}
	return animation.RGB{R: clampByte(r), G: clampByte(g), B: clampByte(b)}
}

func ambientTouchIntensity(game string, dist, age float64) float64 {
	fade := 1 - age/ambientTouchLifetime.Seconds()
	if fade <= 0 {
		return 0
	}
	switch game {
	case "ambient-pulse":
		radius := age * 10.5
		ring := math.Exp(-math.Pow(dist-radius, 2) / 3.8)
		center := math.Exp(-dist*dist/5.5) * math.Exp(-age*2.2)
		return clamp01((ring*1.2 + center*0.55) * fade)
	case "ambient-comet":
		radius := age * 7.0
		return clamp01(math.Exp(-math.Pow(dist-radius, 2)/2.2) * fade * 0.9)
	case "ambient-spark":
		return clamp01(math.Exp(-dist*dist/4.5) * math.Exp(-age*3.0) * 1.15)
	default:
		radius := age * 8.0
		return clamp01(math.Exp(-math.Pow(dist-radius, 2)/4.0) * fade)
	}
}

func ambientTouchColor(game string, age float64) (float64, float64, float64) {
	switch game {
	case "ambient-pulse":
		return 70, 255, 190
	case "ambient-comet":
		return 90, 170, 255
	case "ambient-spark":
		return 255, 120 + 60*math.Sin(age*12), 40
	default:
		return 180, 255, 120
	}
}

func clampByte(value float64) byte {
	if value <= 0 {
		return 0
	}
	if value >= 255 {
		return 255
	}
	return byte(math.Round(value))
}

func clampInt(value, min, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func configForSelection(base config, game string, players int) config {
	cfg := base
	cfg.Game = normalizeGame(game)
	cfg.PlayerCount = players
	if strings.HasPrefix(cfg.Game, "authored-") {
		cfg.PlayerCount = clampInt(players, 1, 6)
		cfg.Level = ""
		cfg.MusicRef = authored.DefaultMusicRef
		cfg.MusicVolume = authored.DefaultMusicVolume
		cfg.normalize()
		return cfg
	}
	if isPlatformLevelGameID(cfg.Game) {
		cfg.PlayerCount = clampInt(players, 1, 6)
		cfg.Level = plataformas.NormalizeLevel(cfg.Level)
		cfg.MusicRef = plataformas.DefaultMusicRef
		cfg.MusicVolume = plataformas.DefaultMusicVolume
		cfg.normalize()
		return cfg
	}
	switch cfg.Game {
	case "whack-a-mole":
		cfg.MusicRef = whackamole.DefaultMusicRef
		cfg.MusicVolume = whackamole.DefaultMusicVolume
	case "lava":
		cfg.MusicRef = lava.DefaultMusicRef
		cfg.MusicVolume = lava.DefaultMusicVolume
	case "saltos":
		cfg.PlayerCount = 1
		cfg.Level = saltos.NormalizeLevel(cfg.Level)
		cfg.MusicRef = saltos.DefaultMusicRef
		cfg.MusicVolume = saltos.DefaultMusicVolume
	case "parkour":
		cfg.PlayerCount = 1
		cfg.Level = parkour.NormalizeLevel(cfg.Level)
		cfg.MusicRef = parkour.DefaultMusicRef
		cfg.MusicVolume = parkour.DefaultMusicVolume
	case "plataformas":
		cfg.Level = plataformas.NormalizeLevel(cfg.Level)
	case "parkour2":
		cfg.PlayerCount = 1
		cfg.Level = plataformas.NormalizeLevel(cfg.Level)
	case "temporada1-niveles":
		cfg.Level = plataformas.NormalizeLevel(cfg.Level)
	case "temporada1":
		cfg.Level = temporada1.NormalizeLevel(cfg.Level)
	case "temporada2":
		cfg.Level = temporada2.NormalizeLevel(cfg.Level)
	case "duel":
		cfg.PlayerCount = clampInt(players, 2, 4)
	case "memory":
		cfg.PlayerCount = clampInt(players, 1, 4)
	case "patrones":
		cfg.PlayerCount = clampInt(players, 1, 6)
		cfg.Level = patrones.NormalizeLevel(cfg.Level)
	case "animations":
		cfg.PlayerCount = 1
		cfg.Level = ""
	case "salvapantallas":
		cfg.PlayerCount = 1
		cfg.Level = ""
	default:
	}
	cfg.MusicRef, cfg.MusicVolume = defaultMusicForGame(cfg.Game)
	cfg.normalize()
	return cfg
}

func defaultMusicForGame(game string) (string, float64) {
	if strings.HasPrefix(normalizeGame(game), "authored-") {
		return authored.DefaultMusicRef, authored.DefaultMusicVolume
	}
	if isPlatformLevelGameID(normalizeGame(game)) {
		return plataformas.DefaultMusicRef, plataformas.DefaultMusicVolume
	}
	switch normalizeGame(game) {
	case "whack-a-mole":
		return whackamole.DefaultMusicRef, whackamole.DefaultMusicVolume
	case "lava":
		return lava.DefaultMusicRef, lava.DefaultMusicVolume
	case "saltos":
		return saltos.DefaultMusicRef, saltos.DefaultMusicVolume
	case "parkour":
		return parkour.DefaultMusicRef, parkour.DefaultMusicVolume
	case "plataformas", "parkour2", "temporada1-niveles":
		return plataformas.DefaultMusicRef, plataformas.DefaultMusicVolume
	case "temporada1":
		return temporada1.DefaultMusicRef, temporada1.DefaultMusicVolume
	case "temporada2":
		return temporada2.DefaultMusicRef, temporada2.DefaultMusicVolume
	case "duel":
		return duel.DefaultMusicRef, duel.DefaultMusicVolume
	case "memory":
		return memorychallenge.DefaultMusicRef, memorychallenge.DefaultMusicVolume
	case "patrones":
		return patrones.DefaultMusicRef, patrones.DefaultMusicVolume
	default:
		return loopMusicRef, 0.10
	}
}

func defaultNarrationRef(game string) string {
	switch normalizeGame(game) {
	case "lava":
		return "Motion/narraciones/lava-intro.mp3"
	case "whack-a-mole":
		return "Motion/narraciones/atrapa-topos-intro.mp3"
	default:
		return ""
	}
}

func gameCatalog(platformURL string) []gameCatalogEntry {
	entries := []gameCatalogEntry{
		{
			Game:        "whack-a-mole",
			Label:       "Atrapa al topo",
			Description: "Step onto your color, wait for the countdown, then hit your team's 2x2 targets.",
			Music:       whackamole.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Difficulty:  true,
			Volume:      whackamole.DefaultMusicVolume,
		},
		{
			Game:        "lava",
			Label:       "El suelo es lava",
			Description: "Avoid flowing lava tiles, keep shared team lives, and claim as many unique safe platforms as possible.",
			Music:       lava.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Difficulty:  true,
			Volume:      lava.DefaultMusicVolume,
		},
		{
			Game:        "saltos",
			Label:       "Saltos",
			Description: "Salta desde la plataforma azul hacia la plataforma verde y evita pisar lava.",
			Music:       saltos.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  1,
			Difficulty:  false,
			Volume:      saltos.DefaultMusicVolume,
			Levels:      saltosCatalogLevels(),
		},
		{
			Game:        "parkour",
			Label:       "Parkour",
			Description: "Reto individual por niveles: pisa todas las plataformas azules, esquiva la lava y completa el recorrido lo más rápido posible.",
			Music:       parkour.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  1,
			Difficulty:  true,
			Volume:      parkour.DefaultMusicVolume,
			Levels:      parkourCatalogLevels(),
		},
		{
			Game:        "parkour2",
			Label:       "Parkour 2.0",
			Description: "Reto individual editable desde la plataforma, con animaciones opcionales para lava y plataformas verdes.",
			Music:       plataformas.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  1,
			Difficulty:  true,
			Volume:      plataformas.DefaultMusicVolume,
			Levels:      plataformasCatalogLevels(),
		},
		{
			Game:        "plataformas",
			Label:       "Plataformas",
			Description: "Niveles visibles desde la plataforma, creados como secuencias reutilizables de fotogramas.",
			Music:       plataformas.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Difficulty:  true,
			Volume:      plataformas.DefaultMusicVolume,
			Levels:      plataformasCatalogLevels(),
		},
		{
			Game:        "temporada1-niveles",
			Label:       "Temporada 1 Niveles",
			Description: "Ruta cooperativa editable desde la plataforma: puntos azules, peligros rojos y retos clasicos de temporada.",
			Music:       plataformas.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Difficulty:  true,
			Volume:      plataformas.DefaultMusicVolume,
			Levels:      temporada1CatalogLevels(),
		},
		{
			Game:        "temporada1",
			Label:       "Temporada 1",
			Description: "Superad niveles clásicos de temporada: puntos azules, peligros rojos y retos cooperativos.",
			Music:       temporada1.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Difficulty:  true,
			Volume:      temporada1.DefaultMusicVolume,
			Levels:      temporada1CatalogLevels(),
		},
		{
			Game:        "temporada2",
			Label:       "Temporada 2",
			Description: "Cinco retos cooperativos nuevos con zonas verdes seguras, zonas rojas móviles y monedas azules.",
			Music:       temporada2.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Difficulty:  false,
			Volume:      temporada2.DefaultMusicVolume,
			Levels:      temporada2CatalogLevels(),
		},
		{
			Game:        "duel",
			Label:       "Duelo",
			Description: "Cada jugador empieza en su zona 4x4. Al arrancar, el suelo se reparte en colores equilibrados; gana quien reclame primero todas sus baldosas.",
			Music:       duel.DefaultMusicRef,
			Players:     true,
			MinPlayers:  2,
			MaxPlayers:  4,
			Difficulty:  false,
			Volume:      duel.DefaultMusicVolume,
		},
		{
			Game:        "memory",
			Label:       "Reto de memoria",
			Description: "Memoriza el camino iluminado, sal de la zona inicial y recorre la ruta sin verla. Si pisas fuera, vuelve al inicio.",
			Music:       memorychallenge.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  4,
			Difficulty:  false,
			Volume:      memorychallenge.DefaultMusicVolume,
		},
		{
			Game:        "patrones",
			Label:       "Patrones",
			Description: "Reconstruid patrones azules en el canvas central sin pisar el fondo negro. Las zonas verdes alrededor son seguras.",
			Music:       patrones.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Difficulty:  true,
			Volume:      patrones.DefaultMusicVolume,
			Levels:      patronesCatalogLevels(),
		},
		{
			Game:        "salvapantallas",
			Label:       "Salvapantallas",
			Description: "Modo reposo que rota entre animaciones destacadas; si no hay destacadas usa las animaciones visibles.",
			Music:       loopMusicRef,
			Players:     false,
			MinPlayers:  1,
			MaxPlayers:  1,
			Difficulty:  false,
			Volume:      0.10,
		},
		{
			Game:        "animations",
			Label:       "Animaciones",
			Description: "Modo reposo para reproducir animaciones y efectos desde la plataforma.",
			Music:       loopMusicRef,
			Players:     false,
			MinPlayers:  1,
			MaxPlayers:  1,
			Difficulty:  false,
			Volume:      0.10,
		},
		{
			Game:        "ambient-comet",
			Label:       "Cometas",
			Description: "Cool luminous streaks sweep across the floor.",
			Music:       loopMusicRef,
			Players:     false,
			MinPlayers:  1,
			MaxPlayers:  1,
			Difficulty:  false,
			Volume:      0.10,
		},
		{
			Game:        "ambient-pulse",
			Label:       "Pulso",
			Description: "Soft center waves for a calmer ambient floor.",
			Music:       loopMusicRef,
			Players:     false,
			MinPlayers:  1,
			MaxPlayers:  1,
			Difficulty:  false,
			Volume:      0.10,
		},
		{
			Game:        "ambient-spark",
			Label:       "Chispas",
			Description: "Small warm sparks over a dark base.",
			Music:       loopMusicRef,
			Players:     false,
			MinPlayers:  1,
			MaxPlayers:  1,
			Difficulty:  false,
			Volume:      0.10,
		},
	}

	if platformURL != "" {
		for _, game := range authored.CachedCatalog() {
			entries = append(entries, gameCatalogEntry{
				Game:        game.EngineGame,
				Label:       game.Label,
				Description: game.Description,
				Music:       nonEmptyString(game.DefaultMusicRef, authored.DefaultMusicRef),
				Players:     true,
				MinPlayers:  clampInt(game.MinPlayers, 1, 6),
				MaxPlayers:  max(clampInt(game.MinPlayers, 1, 6), clampInt(game.MaxPlayers, 1, 6)),
				Difficulty:  false,
				Volume:      nonZeroFloat(game.DefaultMusicVolume, authored.DefaultMusicVolume),
			})
		}

		for _, level := range animations.CachedLevels() {
			entries = append(entries, gameCatalogEntry{
				Game:        "animation-" + level.ID(),
				Label:       level.Label(),
				Description: level.Description(),
				Music:       level.MusicRef(),
				Players:     false,
				MinPlayers:  1,
				MaxPlayers:  1,
				Difficulty:  false,
				Volume:      level.MusicVolume(),
			})
		}
	}

	return entries
}

func nonEmptyString(value string, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return value
}

func nonZeroFloat(value float64, fallback float64) float64 {
	if value == 0 {
		return fallback
	}
	return value
}

func saltosCatalogLevels() []gameLevelEntry {
	levels := saltos.Levels()
	out := make([]gameLevelEntry, 0, len(levels))
	for _, level := range levels {
		out = append(out, gameLevelEntry{
			ID:          level.ID,
			Label:       level.Label,
			Description: level.Description,
		})
	}
	return out
}

func temporada1CatalogLevels() []gameLevelEntry {
	levels := temporada1.Levels()
	out := make([]gameLevelEntry, 0, len(levels))
	for _, level := range levels {
		out = append(out, gameLevelEntry{
			ID:          level.ID,
			Label:       level.Label,
			Description: level.Description,
		})
	}
	return out
}

func temporada2CatalogLevels() []gameLevelEntry {
	levels := temporada2.Levels()
	out := make([]gameLevelEntry, 0, len(levels))
	for _, level := range levels {
		out = append(out, gameLevelEntry{
			ID:          level.ID,
			Label:       level.Label,
			Description: level.Description,
		})
	}
	return out
}

func parkourCatalogLevels() []gameLevelEntry {
	levels := parkour.Levels()
	out := make([]gameLevelEntry, 0, len(levels))
	for _, level := range levels {
		out = append(out, gameLevelEntry{
			ID:          level.ID,
			Label:       level.Label,
			Description: level.Description,
		})
	}
	return out
}

func plataformasCatalogLevels() []gameLevelEntry {
	levels := plataformas.Levels()
	out := make([]gameLevelEntry, 0, len(levels))
	for _, level := range levels {
		out = append(out, gameLevelEntry{
			ID:          level.ID,
			Label:       level.Label,
			Description: level.Description,
		})
	}
	return out
}

func patronesCatalogLevels() []gameLevelEntry {
	levels := patrones.Levels()
	out := make([]gameLevelEntry, 0, len(levels))
	for _, level := range levels {
		out = append(out, gameLevelEntry{
			ID:          level.ID,
			Label:       level.Label,
			Description: level.Description,
		})
	}
	return out
}

func gameLabel(game string) string {
	clean := strings.TrimSpace(game)
	if strings.HasPrefix(game, "animation-") {
		return animations.GetLabel(strings.TrimPrefix(game, "animation-"))
	}
	for _, entry := range gameCatalog("") {
		if entry.Game == game {
			return entry.Label
		}
	}
	if isPlatformLevelGameID(clean) {
		return "Juego de niveles"
	}
	if clean != "" {
		return clean
	}
	return "Motion Levels"
}

func defaultDisplayPlayers(cfg config) []displayPlayer {
	playerCount := cfg.PlayerCount
	if playerCount < 1 {
		playerCount = 1
	}
	if playerCount > 6 {
		playerCount = 6
	}
	colors := []displayColor{
		{R: 255, G: 0, B: 0},
		{R: 0, G: 255, B: 255},
		{R: 0, G: 255, B: 0},
		{R: 255, G: 0, B: 255},
		{R: 0, G: 0, B: 255},
		{R: 255, G: 255, B: 0},
	}
	players := make([]displayPlayer, 0, playerCount)
	for i := 0; i < playerCount; i++ {
		players = append(players, displayPlayer{
			Index: i,
			Label: configuredPlayerLabel(cfg, i, "Jugador "+string(rune('1'+i))),
			Color: configuredPlayerColor(cfg, i, colors[i%len(colors)]),
			Lives: -1,
		})
	}
	return players
}

func normalizePlayerRoster(players []playerConfig, playerCount int) []playerConfig {
	playerCount = normalizeRosterPlayerCount(playerCount)
	normalized := make([]playerConfig, 0, playerCount)
	indexes := map[int]struct{}{}
	labels := map[string]struct{}{}
	colors := map[string]struct{}{}
	for fallbackIndex, player := range players {
		if len(normalized) >= playerCount {
			break
		}
		index := player.Index
		if index < 0 || index >= playerCount {
			index = fallbackIndex
		}
		if index < 0 || index >= playerCount {
			continue
		}
		if _, exists := indexes[index]; exists {
			continue
		}
		label := strings.TrimSpace(player.Label)
		if labelKey := normalizedRosterLabel(label); labelKey != "" {
			if _, exists := labels[labelKey]; exists {
				continue
			}
			labels[labelKey] = struct{}{}
		}
		color := player.Color
		if color != nil {
			copied := *color
			if colorKey := playerColorKey(copied); colorKey != "" {
				if _, exists := colors[colorKey]; exists {
					continue
				}
				colors[colorKey] = struct{}{}
			}
			color = &copied
		}
		indexes[index] = struct{}{}
		normalized = append(normalized, playerConfig{Index: index, Label: label, Color: color})
	}
	return normalized
}

func validatePlayerRoster(players []playerConfig, playerCount int) error {
	playerCount = normalizeRosterPlayerCount(playerCount)
	indexes := map[int]struct{}{}
	labels := map[string]string{}
	colors := map[string]struct{}{}
	for fallbackIndex, player := range players {
		if fallbackIndex >= playerCount {
			break
		}
		index := player.Index
		if index < 0 || index >= playerCount {
			index = fallbackIndex
		}
		if index < 0 || index >= playerCount {
			continue
		}
		if _, exists := indexes[index]; exists {
			continue
		}
		indexes[index] = struct{}{}

		label := strings.TrimSpace(player.Label)
		if labelKey := normalizedRosterLabel(label); labelKey != "" {
			if previous, exists := labels[labelKey]; exists {
				return fmt.Errorf("duplicate player name %q", previous)
			}
			labels[labelKey] = label
		}
		if player.Color != nil {
			key := playerColorKey(*player.Color)
			if _, exists := colors[key]; exists {
				return fmt.Errorf("duplicate player color %s", key)
			}
			colors[key] = struct{}{}
		}
	}
	return nil
}

func normalizeRosterPlayerCount(playerCount int) int {
	if playerCount < 1 {
		return 1
	}
	if playerCount > 6 {
		return 6
	}
	return playerCount
}

func normalizedRosterLabel(label string) string {
	return strings.ToLower(strings.Join(strings.Fields(strings.TrimSpace(label)), " "))
}

func playerColorKey(color displayColor) string {
	return fmt.Sprintf("%d:%d:%d", color.R, color.G, color.B)
}

func configuredPlayerLabel(cfg config, index int, fallback string) string {
	for _, player := range cfg.Players {
		if player.Index == index && strings.TrimSpace(player.Label) != "" {
			return strings.TrimSpace(player.Label)
		}
	}
	return fallback
}

func configuredPlayerColor(cfg config, index int, fallback displayColor) displayColor {
	for _, player := range cfg.Players {
		if player.Index == index && player.Color != nil {
			return *player.Color
		}
	}
	return fallback
}

func preloadAudioRefs(cfg config) []string {
	refs := []string{
		loopMusicRef,
		whackamole.DefaultMusicRef,
		lava.DefaultMusicRef,
		saltos.DefaultMusicRef,
		parkour.DefaultMusicRef,
		plataformas.DefaultMusicRef,
		temporada1.DefaultMusicRef,
		temporada2.DefaultMusicRef,
		duel.DefaultMusicRef,
		memorychallenge.DefaultMusicRef,
		cfg.MusicRef,
		cfg.StartCueRef,
		cfg.CoinCueRef,
		cfg.DoubleCoinCueRef,
		cfg.DamageCueRef,
		cfg.WinCueRef,
		cfg.DefeatCueRef,
		cfg.PressureCueRef,
		cfg.NarrationCueRef,
		cfg.CountdownCueRef,
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
