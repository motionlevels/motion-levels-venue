package main

import (
	crand "crypto/rand"
	"encoding/json"
	"fmt"
	"io"
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
	"github.com/lobis/motion-levels/game-engine/internal/games/motionlevelsgames"
	"github.com/lobis/motion-levels/game-engine/internal/games/niveles"
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
	cameraRecorder    sessionCameraRecorder
	sessionID         string
	sessionSeq        uint64
	rngSeed           int64
	paused            bool
	pausedAt          time.Time
	pauseTotal        time.Duration
	lastPressure      time.Time
	lastPressureInput time.Time
	pressureConnected bool
	narrated          map[string]bool
	introUntil        time.Time
	audioMuted        bool
	ambientTouches    []ambientTouch
	levelAttempt      *levelAttemptTracker
	recentAttempts    []finishedLevelAttemptStatus
	bestAttemptMillis map[string]int64

	// Venue session (client visit) state; see venue.go.
	venueID                     string
	venueTeamName               string
	venuePlayerLabels           []string
	venuePlayerRoster           []venuePlayerSnapshot
	venueKioskID                string
	venueStatus                 string // "" | active | ended
	venueEndReason              string
	venueCameraRecordingEnabled bool
	venueStartedAt              time.Time
	venueEndedAt                time.Time
	venueSeq                    uint64
	venueLastActivity           time.Time
	venueIdleTimeout            time.Duration
	venueOutbox                 []venueOutboxEvent
	venueDropped                uint64

	menuStateSnapshot menuStateSnapshot
	menuStateVersion  uint64

	framePerf framePerf

	displayClient           displayClientReport
	displayClientReceivedAt time.Time
}

type ambientTouch struct {
	x       int
	y       int
	started time.Time
}

type levelAttemptTracker struct {
	AttemptID                string
	VenueSessionID           string
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
	VenueSessionID string `json:"venueSessionId"`
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

type nivelesAudioProvider interface {
	AudioRefs() niveles.AudioRefs
}

type gameEventDrainer interface {
	DrainEvents() []whackamole.Event
}

type gameCatalogEntry struct {
	Game        string           `json:"game"`
	Label       string           `json:"label"`
	Description string           `json:"description"`
	Music       string           `json:"music"`
	Players     bool             `json:"players"`
	AllowAny    bool             `json:"allowAnyPlayers,omitempty"`
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

type displayRound struct {
	Index       int    `json:"index"`
	WinnerIndex int    `json:"winnerIndex"`
	WinnerLabel string `json:"winnerLabel"`
	Hits        int    `json:"hits"`
}

type playerConfig struct {
	Index int
	Label string
	Color *displayColor
}

type displayStatus struct {
	CurrentGame              string          `json:"currentGame"`
	SourceKind               string          `json:"sourceKind,omitempty"`
	SourceRevision           string          `json:"sourceRevision,omitempty"`
	GameSnapshot             json.RawMessage `json:"gameSnapshot,omitempty"`
	Frame                    *displayFrame   `json:"frame,omitempty"`
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
	DurationSeconds          int             `json:"-"`
	SessionElapsedMillis     int64           `json:"sessionElapsedMillis"`
	SessionRemainingMillis   int64           `json:"sessionRemainingMillis,omitempty"`
	ChallengeElapsedMillis   int64           `json:"challengeElapsedMillis,omitempty"`
	ChallengeAttemptCount    int             `json:"challengeAttemptCount,omitempty"`
	ElapsedMillis            int64           `json:"elapsedMillis"`
	RemainingMillis          int64           `json:"remainingMillis"`
	IntroRemainingMillis     int64           `json:"introRemainingMillis"`
	CountdownRemainingMillis int64           `json:"countdownRemainingMillis"`
	ActiveTargets            int             `json:"activeTargets"`
	Success                  bool            `json:"success"`
	MatchTarget              int             `json:"matchTarget,omitempty"`
	RoundHits                int             `json:"roundHits,omitempty"`
	LastRoundHits            int             `json:"lastRoundHits,omitempty"`
	LastRoundWinner          string          `json:"lastRoundWinner,omitempty"`
	Rounds                   []displayRound  `json:"rounds,omitempty"`
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

type displayFrame struct {
	Width  int                `json:"width"`
	Height int                `json:"height"`
	Cells  []displayFrameCell `json:"cells"`
}

type displayFrameCell struct {
	X     int    `json:"x"`
	Y     int    `json:"y"`
	Color string `json:"color"`
}

type runtimeStatus struct {
	CurrentGame              string                       `json:"currentGame"`
	SourceKind               string                       `json:"sourceKind,omitempty"`
	SourceRevision           string                       `json:"sourceRevision,omitempty"`
	GamesRunner              any                          `json:"gamesRunner,omitempty"`
	DisplayClient            displayClientStatus          `json:"displayClient"`
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
	PressureStreamConnected  bool                         `json:"pressureStreamConnected"`
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

func (r *gameRuntime) SetCameraRecorder(recorder sessionCameraRecorder) {
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

func (r *gameRuntime) SelectGameWithDifficulty(game string, players int, difficulty string) {
	r.SelectGameWithOptions(game, players, difficulty, nil)
}

func (r *gameRuntime) SelectGameWithOptions(game string, players int, difficulty string, narrationEnabled *bool) {
	r.SelectGameWithMetadata(game, "", "", "", players, false, difficulty, "", "", 0, 0, 0, narrationEnabled, false, "", "", true, "", nil, nil)
}

func (r *gameRuntime) SelectGameWithMetadata(game string, gameLabel string, sourceKind string, sourceRevision string, players int, allowAnyPlayers bool, difficulty string, level string, levelMode string, durationSeconds int, challengeElapsedMillis int64, challengeAttemptCount int, narrationEnabled *bool, countdownFloorOverlay bool, teamName string, venueSessionID string, cameraRecordingEnabled bool, platformURL string, roster []playerConfig, gameConfig map[string]json.RawMessage) {
	if r == nil {
		return
	}
	cfg := configForSelection(r.base, game, players)
	cfg.AllowAnyPlayers = allowAnyPlayers
	if allowAnyPlayers && players == 0 {
		cfg.PlayerCount = 0
	}
	cfg.GameLabel = strings.TrimSpace(gameLabel)
	cfg.SourceKind = strings.TrimSpace(sourceKind)
	cfg.SourceRevision = strings.TrimSpace(sourceRevision)
	if isMotionLevelsGamesGame(cfg.Game) {
		cfg.SourceKind = "motion_levels_games"
	}
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
	cfg.Players = normalizePlayerRoster(roster, rosterPlayerLimit(cfg.PlayerCount, allowAnyPlayers, len(roster)))
	cfg.GameConfig = normalizeGameConfigOverrides(gameConfig)
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
		r.startVenueLocked(cfg.VenueSessionID, cfg.TeamName, "", now, true, cameraRecordingEnabled)
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
			if controller, ok := r.game.(interface{ Control(string) error }); ok {
				_ = controller.Control("pause")
			}
			r.paused = true
			r.pausedAt = now
		}
	case "resume":
		if r.paused {
			if controller, ok := r.game.(interface{ Control(string) error }); ok {
				_ = controller.Control("resume")
			}
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
	cfg := r.current
	brightness := r.current.Brightness
	gameID := r.current.Game
	game := r.game
	audioPlayer := r.audio
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
	if eventSource, ok := game.(gameEventDrainer); ok {
		r.handleGameEvents(cfg, audioPlayer, eventSource.DrainEvents(), gameNow)
	}
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
		r.handleGameEvents(cfg, audioPlayer, game.Press(whackamole.PressEvent{X: int(event.X), Y: int(event.Y), Pressed: event.Pressed}, gameNow), gameNow)
		return
	}
	if event.Pressed && animation.IsAmbientMode(cfg.Game) {
		r.addAmbientTouch(int(event.X), int(event.Y), gameNow)
	}
}

func (r *gameRuntime) handleGameEvents(cfg config, audioPlayer *audio.Player, events []whackamole.Event, gameNow time.Time) {
	for _, gameEvent := range events {
		r.recordGameEvent(gameEvent.Cue, gameEvent.Message, gameNow)
		r.playCue(cfg, audioPlayer, gameEvent.Cue, cueRef(cfg, gameEvent.Cue), gameNow)
		if gameEvent.Cue == whackamole.CueStart && shouldPlayCountdownAfterReadyCue(cfg) {
			r.playCountdownCue(cfg, audioPlayer, gameNow)
		}
	}
}

// makeDisplayPlayer converts a game snapshot's per-player fields into the
// display player shape, applying any per-venue label/color overrides. It is the
// single source of truth shared by every per-game block in DisplayStatus.
func makeDisplayPlayer(cfg config, index int, label string, color animation.RGB, score, lives int) displayPlayer {
	return displayPlayer{
		Index: index,
		Label: configuredPlayerLabel(cfg, index, label),
		Color: configuredPlayerColor(cfg, index, displayColor{R: int(color.R), G: int(color.G), B: int(color.B)}),
		Score: score,
		Lives: lives,
	}
}

// mapDisplayPlayers builds the display player list from a game snapshot's
// players using the supplied conversion, preserving the original pre-allocation.
func mapDisplayPlayers[P any](players []P, convert func(P) displayPlayer) []displayPlayer {
	out := make([]displayPlayer, 0, len(players))
	for _, player := range players {
		out = append(out, convert(player))
	}
	return out
}

// finalizeGameStatus applies the shared paused handling and attempt summary that
// every per-game snapshot block performs before returning.
func (r *gameRuntime) finalizeGameStatus(status displayStatus, started time.Time, paused bool) displayStatus {
	status.SessionRemainingMillis = displaySessionRemainingMillis(status)
	if paused && status.Phase != "finished" {
		status.Phase = "paused"
	}
	return r.withDisplayAttemptSummary(status, started)
}

func displaySessionRemainingMillis(status displayStatus) int64 {
	if status.DurationSeconds <= 0 {
		return 0
	}
	elapsed := status.SessionElapsedMillis
	if status.LevelMode == "challenge" {
		elapsed = status.ChallengeElapsedMillis + status.ElapsedMillis
	}
	if elapsed < 0 {
		elapsed = 0
	}
	remaining := int64(status.DurationSeconds)*1000 - elapsed
	if remaining < 0 {
		return 0
	}
	return remaining
}

func (r *gameRuntime) DisplayStatus(now time.Time) displayStatus {
	if r == nil {
		return displayStatus{
			CurrentGame:    "salvapantallas",
			VenueSessionID: "",
			Label:          staticGameLabel("salvapantallas"),
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
		SourceKind:             cfg.SourceKind,
		SourceRevision:         cfg.SourceRevision,
		VenueSessionID:         cfg.VenueSessionID,
		Label:                  displayGameLabel(cfg),
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
		DurationSeconds:        cfg.DurationSeconds,
		SessionElapsedMillis:   elapsedMillisSince(started, gameNow),
		ChallengeElapsedMillis: cfg.ChallengeElapsedMillis,
		ChallengeAttemptCount:  cfg.ChallengeAttemptCount,
		AudioEnabled:           audioEnabled,
		AudioMuted:             audioMuted,
		LastEventUnixNanos:     lastEvent.unixNanos,
		LastEventCue:           lastEvent.cue,
		LastEventMessage:       lastEvent.message,
	}

	if isNivelesRuntimeGame(cfg.Game) {
		if nivelesGame, ok := game.(*niveles.Game); ok {
			snapshot := nivelesGame.Snapshot(gameNow)
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
			status.Players = mapDisplayPlayers(snapshot.Players, func(player niveles.PlayerSnapshot) displayPlayer {
				return makeDisplayPlayer(cfg, player.Index, player.Label, player.Color, player.Score, player.Lives)
			})
		}
		return r.finalizeGameStatus(status, started, paused)
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
			status.MatchTarget = snapshot.MatchTarget
			status.RoundHits = snapshot.RoundHits
			status.LastRoundHits = snapshot.LastRoundHits
			status.LastRoundWinner = snapshot.LastRoundWinner
			status.Rounds = displayRounds(snapshot.Rounds)
			status.Lives = snapshot.Lives
			status.Players = mapDisplayPlayers(snapshot.Players, func(player authored.PlayerSnapshot) displayPlayer {
				return makeDisplayPlayer(cfg, player.Index, player.Label, player.Color, player.Score, player.Lives)
			})
		}
		if cfg.Game == "authored-lava" {
			r.applyIntroStatus(&status, gameNow, introUntil)
		}
		return r.finalizeGameStatus(status, started, paused)
	}

	if motionGame, ok := game.(*motionlevelsgames.Game); ok {
		snapshot := motionGame.Snapshot()
		status.SourceKind = "motion_levels_games"
		status.SourceRevision = motionGame.SourceRevision()
		status.GameSnapshot = motionGame.RawSnapshot()
		status.Frame = displayFrameFromColors(motionGame.Frame())
		status.Label = snapshot.Label
		status.Phase = snapshot.Phase
		status.PlayerCount = snapshot.PlayerCount
		status.Score = snapshot.Score
		status.Lives = snapshot.Lives
		status.LivesStart = snapshot.MaxLives
		status.ElapsedMillis = snapshot.ElapsedMillis
		status.RemainingMillis = snapshot.RemainingMillis
		status.CountdownRemainingMillis = snapshot.CountdownMillis
		status.ActiveTargets = snapshot.ActiveTargets
		status.Success = snapshot.Success
		status.MatchTarget = snapshot.MatchTarget
		status.RoundHits = snapshot.RoundHits
		status.LastRoundHits = snapshot.LastRoundHits
		status.LastRoundWinner = snapshot.LastRoundWinner
		status.Rounds = motionLevelsDisplayRounds(snapshot.Rounds)
		status.Players = mapDisplayPlayers(snapshot.Players, func(player motionlevelsgames.PlayerSnapshot) displayPlayer {
			return makeDisplayPlayer(cfg, player.Index, player.Label, parseDisplayHexColor(player.Color), player.Score, player.Lives)
		})
		return r.finalizeGameStatus(status, started, paused)
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

func displayRounds(rounds []authored.RoundSnapshot) []displayRound {
	if len(rounds) == 0 {
		return nil
	}
	out := make([]displayRound, 0, len(rounds))
	for _, round := range rounds {
		out = append(out, displayRound{
			Index:       round.Index,
			WinnerIndex: round.WinnerIndex,
			WinnerLabel: round.WinnerLabel,
			Hits:        round.Hits,
		})
	}
	return out
}

func motionLevelsDisplayRounds(rounds []motionlevelsgames.RoundSnapshot) []displayRound {
	if len(rounds) == 0 {
		return nil
	}
	out := make([]displayRound, 0, len(rounds))
	for _, round := range rounds {
		out = append(out, displayRound{Index: round.Index, WinnerIndex: round.WinnerIndex, WinnerLabel: round.WinnerLabel, Hits: round.Hits})
	}
	return out
}

func displayFrameFromColors(colors []animation.RGB) *displayFrame {
	if len(colors) != animation.GridWidth*animation.GridHeight {
		return nil
	}
	cells := make([]displayFrameCell, 0, len(colors))
	for index, color := range colors {
		cells = append(cells, displayFrameCell{
			X:     index % animation.GridWidth,
			Y:     index / animation.GridWidth,
			Color: fmt.Sprintf("#%02x%02x%02x", color.R, color.G, color.B),
		})
	}
	return &displayFrame{Width: animation.GridWidth, Height: animation.GridHeight, Cells: cells}
}

func parseDisplayHexColor(value string) animation.RGB {
	value = strings.TrimPrefix(strings.TrimSpace(value), "#")
	number, err := strconv.ParseUint(value, 16, 24)
	if err != nil || len(value) != 6 {
		return animation.RGB{}
	}
	return animation.RGB{R: byte(number >> 16), G: byte(number >> 8), B: byte(number)}
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
	pressureConnected := r.pressureConnected
	rngSeed := r.rngSeed
	paused := r.paused
	game := r.game
	var recorderStats any
	if stats, ok := r.recorder.(interface{ Stats() sessionrecording.Stats }); ok {
		recorderStats = stats.Stats()
	}
	r.mu.RUnlock()
	var gamesRunner any
	if reporter, ok := game.(interface {
		RunnerHealth() motionlevelsgames.RunnerHealth
	}); ok {
		gamesRunner = reporter.RunnerHealth()
	}
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
		SourceKind:               display.SourceKind,
		SourceRevision:           display.SourceRevision,
		GamesRunner:              gamesRunner,
		DisplayClient:            r.DisplayClientStatus(now),
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
		PressureStreamConnected:  pressureConnected,
		RNGSeed:                  rngSeed,
		Recorder:                 recorderStats,
		FinishedLevelAttempts:    recentAttempts,
		Performance:              r.framePerf.Snapshot(),
		Catalog:                  gameCatalog(cfg.PlatformURL),
	}
}

func (r *gameRuntime) SetPressureStreamConnected(connected bool) {
	if r == nil {
		return
	}
	r.mu.Lock()
	r.pressureConnected = connected
	r.mu.Unlock()
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
	if closer, ok := r.game.(io.Closer); ok {
		if err := closer.Close(); err != nil {
			log.Printf("close previous game: %v", err)
		}
	}
	cfg.normalize()
	r.rngSeed = now.UnixNano()
	game := makeGame(cfg, r.rngSeed, now)
	cfg = applyNivelesAudioConfig(cfg, game)
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
		cfg = applyNivelesAudioConfig(cfg, game)
	}
	label := displayGameLabel(cfg)
	if labeled, ok := game.(interface{ Label() string }); ok && !isNivelesRuntimeGame(cfg.Game) {
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
	var audioGame floorGame
	if !isMotionLevelsGamesGame(cfg.Game) {
		audioGame = makeGame(cfg, time.Now().UnixNano(), time.Now())
	}
	cfg = applyNivelesAudioConfig(cfg, audioGame)
	r.mu.RLock()
	shouldNarrate := r.shouldNarrateLocked(cfg, mode)
	r.mu.RUnlock()
	if !shouldNarrate {
		return 0
	}
	return r.narrationHoldDuration(cfg)
}

func applyNivelesAudioConfig(cfg config, game floorGame) config {
	if isNivelesRuntimeGame(cfg.Game) {
		provider, ok := game.(nivelesAudioProvider)
		if !ok {
			return cfg
		}
		refs := provider.AudioRefs()
		if refs.MusicRef != "" {
			cfg.MusicRef = refs.MusicRef
			cfg.MusicVolume = clamp01(refs.MusicVolume)
		}
		cfg.StartCueRef = refs.StartCueRef
		cfg.NarrationCueRef = refs.NarrationCueRef
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
	cfg = applyLevelNarrationDefaults(cfg)
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
	if shouldUseLevelNarrationInsteadOfCountdown(cfg) {
		return false
	}
	if strings.HasPrefix(cfg.Game, "authored-") {
		switch cfg.Game {
		case "authored-duel", "authored-whack-a-mole-go":
			return false
		}
		return true
	}
	if isNivelesRuntimeGame(cfg.Game) {
		return true
	}
	return false
}

func shouldUseLevelNarrationInsteadOfCountdown(cfg config) bool {
	return isLevelNarrationGame(cfg.Game) && strings.TrimSpace(cfg.NarrationCueRef) != ""
}

func shouldPlayCountdownAfterReadyCue(cfg config) bool {
	switch cfg.Game {
	case "authored-duel", "authored-whack-a-mole-go":
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
		VenueSessionID:           strings.TrimSpace(status.VenueSessionID),
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
			VenueSessionID: attempt.VenueSessionID,
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
	return isNivelesRuntimeGame(game)
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
			return entry.Players && (entry.AllowAny || entry.MaxPlayers > entry.MinPlayers)
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

func isNivelesRuntimeGame(game string) bool {
	game = normalizeGame(game)
	if isPlatformLevelGameID(game) {
		return true
	}
	_, ok := levelCatalogEntry(game)
	return ok
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
	if isMotionLevelsGamesGame(cfg.Game) {
		gameID := strings.TrimPrefix(cfg.Game, "motion-levels-games:")
		players := make([]motionlevelsgames.PlayerConfig, 0, len(cfg.Players))
		for _, player := range cfg.Players {
			color := configuredPlayerColor(cfg, player.Index, displayColor{})
			players = append(players, motionlevelsgames.PlayerConfig{
				Index: player.Index,
				Label: configuredPlayerLabel(cfg, player.Index, player.Label),
				Color: fmt.Sprintf("#%02x%02x%02x", clampColorByte(color.R), clampColorByte(color.G), clampColorByte(color.B)),
			})
		}
		game, err := motionlevelsgames.New(cfg.MotionLevelsGamesRoot, motionlevelsgames.Config{
			GameID: gameID, ExpectedRevision: cfg.SourceRevision, Seed: seed,
			PlayerCount: cfg.PlayerCount, Players: players, Difficulty: cfg.Difficulty,
			DurationMillis: int64(cfg.DurationSeconds) * 1000, Options: cfg.GameConfig,
			StartedAt: now, NodeBinary: cfg.MotionLevelsGamesNode,
		})
		if err != nil {
			log.Printf("motion-levels-games: %v", err)
			return nil
		}
		return game
	}
	if isPlatformLevelGameID(cfg.Game) {
		log.Printf("game: platform-level id=%s players=%d difficulty=%s level=%s mode=%s", cfg.Game, cfg.PlayerCount, cfg.Difficulty, cfg.Level, cfg.LevelMode)
		return niveles.NewWithSeedForGameMode(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level, cfg.PlatformURL, cfg.Game, cfg.LevelMode)
	}
	if strings.HasPrefix(cfg.Game, "animation-") {
		cfg.Level = strings.TrimPrefix(cfg.Game, "animation-")
		cfg.Game = "animations"
	}
	if strings.HasPrefix(cfg.Game, "authored-") {
		log.Printf("game: authored id=%s players=%d difficulty=%s level=%s runtime=%s", cfg.Game, cfg.PlayerCount, cfg.Difficulty, cfg.Level, cfg.AuthoredRuntime)
		game, err := authored.NewWithSeedRuntimeConfig(now, seed, cfg.Game, cfg.PlayerCount, whackPlayersFromConfig(cfg), cfg.PlatformURL, cfg.Difficulty, cfg.Level, cfg.AuthoredRuntime, cfg.GameConfig)
		if err != nil {
			log.Printf("authored game: %v", err)
			return nil
		}
		return game
	}
	if entry, ok := levelCatalogEntry(cfg.Game); ok {
		players := cfg.PlayerCount
		if !entry.Players {
			players = clampInt(entry.MinPlayers, 1, maxAuthoredPlayers)
		}
		log.Printf("game: niveles id=%s players=%d difficulty=%s level=%s mode=%s", cfg.Game, players, cfg.Difficulty, cfg.Level, cfg.LevelMode)
		return niveles.NewWithSeedForGameMode(now, seed, players, cfg.Difficulty, cfg.Level, cfg.PlatformURL, cfg.Game, cfg.LevelMode)
	}
	switch cfg.Game {
	case "animations":
		log.Printf("game: animations players=%d difficulty=%s level=%s", cfg.PlayerCount, cfg.Difficulty, cfg.Level)
		return animations.NewWithSeed(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.Level, cfg.PlatformURL)
	case "salvapantallas":
		rotationEvery := time.Duration(cfg.DurationSeconds) * time.Second
		log.Printf("game: salvapantallas rotation=%s", rotationEvery)
		return animations.NewScreensaverWithSeed(now, seed, cfg.PlayerCount, cfg.Difficulty, cfg.PlatformURL, rotationEvery)
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
	if isMotionLevelsGamesGame(cfg.Game) {
		cfg.Level = ""
		cfg.normalize()
		return cfg
	}
	if strings.HasPrefix(cfg.Game, "authored-") {
		cfg.Level = ""
		cfg.MusicRef, cfg.MusicVolume = defaultMusicForGame(cfg.Game)
		cfg.normalize()
		return cfg
	}
	if isPlatformLevelGameID(cfg.Game) {
		cfg.PlayerCount = clampInt(players, 1, 6)
		cfg.Level = niveles.NormalizeLevel(cfg.Level)
		cfg.MusicRef = niveles.DefaultMusicRef
		cfg.MusicVolume = niveles.DefaultMusicVolume
		cfg.normalize()
		return cfg
	}
	if entry, ok := levelCatalogEntry(cfg.Game); ok {
		if entry.Players {
			cfg.PlayerCount = clampInt(players, clampInt(entry.MinPlayers, 1, maxAuthoredPlayers), clampInt(entry.MaxPlayers, 1, maxAuthoredPlayers))
		} else {
			cfg.PlayerCount = clampInt(entry.MinPlayers, 1, maxAuthoredPlayers)
		}
		cfg.Level = niveles.NormalizeLevel(cfg.Level)
		cfg.MusicRef = nonEmptyString(entry.Music, niveles.DefaultMusicRef)
		cfg.MusicVolume = nonZeroFloat(entry.Volume, niveles.DefaultMusicVolume)
		cfg.normalize()
		return cfg
	}
	// Music ref/volume are assigned unconditionally below via
	// defaultMusicForGame, so per-game cases only need non-music adjustments.
	switch cfg.Game {
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

func isMotionLevelsGamesGame(game string) bool {
	return strings.HasPrefix(strings.ToLower(strings.TrimSpace(game)), "motion-levels-games:")
}

func defaultMusicForGame(game string) (string, float64) {
	normalized := normalizeGame(game)
	if strings.HasPrefix(normalized, "authored-") {
		if entry, ok := authored.NativeCatalogEntry(normalized); ok {
			return nonEmptyString(entry.DefaultMusicRef, authored.DefaultMusicRef), nonZeroFloat(entry.DefaultMusicVolume, authored.DefaultMusicVolume)
		}
		return authored.DefaultMusicRef, authored.DefaultMusicVolume
	}
	if isPlatformLevelGameID(normalized) {
		return niveles.DefaultMusicRef, niveles.DefaultMusicVolume
	}
	if entry, ok := catalogEntry(normalized); ok {
		return nonEmptyString(entry.Music, loopMusicRef), nonZeroFloat(entry.Volume, 0.10)
	}
	return loopMusicRef, 0.10
}

func defaultNarrationRef(game string) string {
	switch normalizeGame(game) {
	case "authored-lava":
		return "Motion/narraciones/lava-intro.mp3"
	case "authored-whack-a-mole-go":
		return "Motion/narraciones/atrapa-topos-intro.mp3"
	default:
		return ""
	}
}

func applyLevelNarrationDefaults(cfg config) config {
	if cfg.NarrationCueRef == "" && isLevelNarrationGame(cfg.Game) {
		cfg.NarrationCueRef = defaultLevelNarrationRef(cfg.Level)
	}
	if shouldUseLevelNarrationInsteadOfCountdown(cfg) && isBundledDefaultStartCue(cfg.StartCueRef) {
		cfg.StartCueRef = ""
	}
	return cfg
}

func isLevelNarrationGame(game string) bool {
	game = normalizeGame(game)
	if isNivelesRuntimeGame(game) {
		return true
	}
	entry, ok := authored.NativeCatalogEntry(game)
	return ok && entry.LevelNarration
}

func defaultLevelNarrationRef(level string) string {
	levelNumber := levelNumberFromString(level)
	if levelNumber < 1 || levelNumber > 50 {
		return ""
	}
	return fmt.Sprintf("Motion/narraciones/nivel-%d.mp3", levelNumber)
}

func levelNumberFromString(value string) int {
	value = strings.TrimSpace(strings.ToLower(value))
	if value == "" {
		return 0
	}
	for _, prefix := range []string{"nivel-", "level-", "nivel ", "level "} {
		if strings.HasPrefix(value, prefix) {
			value = strings.TrimSpace(strings.TrimPrefix(value, prefix))
			break
		}
	}
	number, err := strconv.Atoi(value)
	if err != nil {
		return 0
	}
	return number
}

func isBundledDefaultStartCue(ref string) bool {
	switch strings.TrimSpace(ref) {
	case "", "Motion/sonidos/aparecer.mp3", "Motion/narraciones/countdown-tres-dos-uno-vamos.mp3":
		return true
	default:
		return false
	}
}

func baseGameCatalogEntries() []gameCatalogEntry {
	return []gameCatalogEntry{
		{
			Game:        "parkour",
			Label:       "Parkour",
			Description: "Reto individual editable desde la plataforma, con animaciones opcionales para lava y plataformas verdes.",
			Music:       niveles.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  1,
			Difficulty:  true,
			Volume:      niveles.DefaultMusicVolume,
			Levels:      nivelesCatalogLevels(),
		},
		{
			Game:        "temporada1-niveles",
			Label:       "Temporada 1",
			Description: "Ruta cooperativa editable desde la plataforma: puntos azules, peligros rojos y retos clasicos de temporada.",
			Music:       niveles.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Difficulty:  true,
			Volume:      niveles.DefaultMusicVolume,
			Levels:      nivelesCatalogLevels(),
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
}

func gameCatalog(platformURL string) []gameCatalogEntry {
	entries := baseGameCatalogEntries()

	for _, game := range authored.CachedCatalog() {
		entries = appendAuthoredCatalogEntry(entries, game)
	}
	for _, game := range authored.NativeCatalogEntries() {
		entries = appendAuthoredCatalogEntry(entries, game)
	}
	if bundle, err := motionlevelsgames.Load(nonEmptyEnv("MOTION_LEVELS_GAMES_ROOT", "game-bundles/motion-levels-games")); err == nil {
		for _, game := range bundle.Catalog {
			if !bundle.SupportsGame(game.ID) {
				continue
			}
			entries = append(entries, gameCatalogEntry{
				Game: game.EngineGame, Label: game.Label, Description: game.Description,
				Players: true, AllowAny: game.Players.AllowAny, MinPlayers: game.Players.Min, MaxPlayers: game.Players.Max,
				Difficulty: len(game.Config.Difficulty.Options) > 1, Volume: 0.10,
			})
		}
	}

	if platformURL != "" {
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

func catalogEntry(game string) (gameCatalogEntry, bool) {
	normalized := normalizeGame(game)
	for _, entry := range gameCatalog("") {
		if normalizeGame(entry.Game) == normalized {
			return entry, true
		}
	}
	return gameCatalogEntry{}, false
}

func levelCatalogEntry(game string) (gameCatalogEntry, bool) {
	entry, ok := catalogEntry(game)
	if !ok || len(entry.Levels) == 0 {
		return gameCatalogEntry{}, false
	}
	return entry, true
}

func isBaseCatalogGameID(game string) bool {
	normalized := strings.ToLower(strings.TrimSpace(game))
	for _, entry := range baseGameCatalogEntries() {
		if strings.ToLower(strings.TrimSpace(entry.Game)) == normalized {
			return true
		}
	}
	return false
}

func appendAuthoredCatalogEntry(entries []gameCatalogEntry, game authored.CatalogEntry) []gameCatalogEntry {
	if strings.TrimSpace(game.EngineGame) == "" {
		return entries
	}
	for _, entry := range entries {
		if entry.Game == game.EngineGame {
			return entries
		}
	}
	return append(entries, gameCatalogEntry{
		Game:        game.EngineGame,
		Label:       game.Label,
		Description: game.Description,
		Music:       nonEmptyString(game.DefaultMusicRef, authored.DefaultMusicRef),
		Players:     true,
		MinPlayers:  clampInt(game.MinPlayers, 1, maxAuthoredPlayers),
		MaxPlayers:  max(clampInt(game.MinPlayers, 1, maxAuthoredPlayers), clampInt(game.MaxPlayers, 1, maxAuthoredPlayers)),
		Difficulty:  authoredGameHasDifficulty(game.EngineGame),
		Volume:      nonZeroFloat(game.DefaultMusicVolume, authored.DefaultMusicVolume),
	})
}

func authoredGameHasDifficulty(engineGame string) bool {
	switch engineGame {
	case "authored-duel", "authored-lava", "authored-patrones", "authored-whack-a-mole-go":
		return true
	default:
		return false
	}
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

func nivelesCatalogLevels() []gameLevelEntry {
	levels := niveles.Levels()
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

func displayGameLabel(cfg config) string {
	if label := strings.TrimSpace(cfg.GameLabel); label != "" {
		return label
	}
	return staticGameLabel(cfg.Game)
}

func staticGameLabel(game string) string {
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
	if playerCount > maxAuthoredPlayers {
		playerCount = maxAuthoredPlayers
	}
	colors := []displayColor{
		{R: 255, G: 0, B: 0},
		{R: 0, G: 255, B: 255},
		{R: 0, G: 255, B: 0},
		{R: 255, G: 0, B: 255},
		{R: 0, G: 0, B: 255},
		{R: 255, G: 255, B: 0},
		{R: 167, G: 139, B: 250},
		{R: 251, G: 146, B: 60},
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

// normalizeGameConfigOverrides bounds the launch config payload; per-variable
// validation (types, clamping, enum options) happens in authored.ResolveConfig
// against the game's declared variables.
func normalizeGameConfigOverrides(overrides map[string]json.RawMessage) map[string]json.RawMessage {
	const maxConfigVars = 32
	const maxConfigValueBytes = 256
	if len(overrides) == 0 {
		return nil
	}
	normalized := make(map[string]json.RawMessage, len(overrides))
	for key, value := range overrides {
		key = strings.TrimSpace(key)
		if key == "" || len(key) > 60 || len(value) == 0 || len(value) > maxConfigValueBytes || !json.Valid(value) {
			continue
		}
		normalized[key] = append(json.RawMessage(nil), value...)
		if len(normalized) >= maxConfigVars {
			break
		}
	}
	if len(normalized) == 0 {
		return nil
	}
	return normalized
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

func validatePlayerRoster(players []playerConfig, playerCount int, allowAnyPlayers bool) error {
	playerCount = rosterPlayerLimit(playerCount, allowAnyPlayers, len(players))
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

func rosterPlayerLimit(playerCount int, allowAnyPlayers bool, rosterSize int) int {
	if allowAnyPlayers && playerCount == 0 {
		return normalizeRosterPlayerCount(max(1, rosterSize))
	}
	return normalizeRosterPlayerCount(playerCount)
}

func normalizeRosterPlayerCount(playerCount int) int {
	if playerCount < 1 {
		return 1
	}
	if playerCount > maxAuthoredPlayers {
		return maxAuthoredPlayers
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
		niveles.DefaultMusicRef,
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
	for _, entry := range authored.NativeCatalogEntries() {
		refs = append(refs, entry.DefaultMusicRef)
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
