package main

import (
	crand "crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/audio"
	"github.com/lobis/motion-levels/game-engine/internal/games/lava"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/lobis/motion-levels/game-engine/internal/sessionrecording"
	"github.com/lobis/motion-levels/packages/contracts/gamepb"
	"github.com/lobis/motion-levels/packages/contracts/inputpb"
)

const loopMusicRef = "Motion/canciones/Background01.mp3"

type gameRuntime struct {
	mu         sync.RWMutex
	base       config
	current    config
	game       floorGame
	audio      *audio.Player
	started    time.Time
	lastEvent  displayEvent
	recorder   *sessionrecording.Recorder
	sessionID  string
	sessionSeq uint64
	rngSeed    int64
	paused     bool
	pausedAt   time.Time
	pauseTotal time.Duration
	narrated   map[string]bool
	introUntil time.Time
	audioMuted bool
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

type gameCatalogEntry struct {
	Game        string  `json:"game"`
	Label       string  `json:"label"`
	Description string  `json:"description"`
	Music       string  `json:"music"`
	Players     bool    `json:"players"`
	MinPlayers  int     `json:"minPlayers"`
	MaxPlayers  int     `json:"maxPlayers"`
	Difficulty  bool    `json:"difficulty"`
	Volume      float64 `json:"volume"`
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

type displayStatus struct {
	CurrentGame              string          `json:"currentGame"`
	Label                    string          `json:"label"`
	Phase                    string          `json:"phase"`
	Difficulty               string          `json:"difficulty"`
	PlayerCount              int             `json:"playerCount"`
	Players                  []displayPlayer `json:"players"`
	Score                    int             `json:"score"`
	Lives                    int             `json:"lives"`
	StartedUnix              int64           `json:"startedUnix"`
	EndsUnix                 int64           `json:"endsUnix"`
	ElapsedMillis            int64           `json:"elapsedMillis"`
	RemainingMillis          int64           `json:"remainingMillis"`
	IntroRemainingMillis     int64           `json:"introRemainingMillis"`
	CountdownRemainingMillis int64           `json:"countdownRemainingMillis"`
	ActiveTargets            int             `json:"activeTargets"`
	AudioEnabled             bool            `json:"audioEnabled"`
	AudioMuted               bool            `json:"audioMuted"`
	LastEventUnixNanos       int64           `json:"lastEventUnixNanos"`
	LastEventCue             string          `json:"lastEventCue"`
	LastEventMessage         string          `json:"lastEventMessage"`
}

type runtimeStatus struct {
	CurrentGame              string                 `json:"currentGame"`
	Label                    string                 `json:"label"`
	Difficulty               string                 `json:"difficulty"`
	PlayerCount              int                    `json:"playerCount"`
	Music                    string                 `json:"music"`
	MusicVolume              float64                `json:"musicVolume"`
	AudioEnabled             bool                   `json:"audioEnabled"`
	AudioMuted               bool                   `json:"audioMuted"`
	Paused                   bool                   `json:"paused"`
	Phase                    string                 `json:"phase"`
	IntroRemainingMillis     int64                  `json:"introRemainingMillis"`
	CountdownRemainingMillis int64                  `json:"countdownRemainingMillis"`
	StartedUnix              int64                  `json:"startedUnix"`
	SessionID                string                 `json:"sessionId"`
	RNGSeed                  int64                  `json:"rngSeed"`
	Recorder                 sessionrecording.Stats `json:"recorder"`
	Catalog                  []gameCatalogEntry     `json:"catalog"`
}

func newGameRuntime(cfg config, audioPlayer *audio.Player, recorder *sessionrecording.Recorder) *gameRuntime {
	runtime := &gameRuntime{
		base:     cfg,
		audio:    audioPlayer,
		recorder: recorder,
		narrated: map[string]bool{},
	}
	runtime.applyLocked(cfg, true)
	return runtime
}

func (r *gameRuntime) SelectGame(game string, players int) {
	r.SelectGameWithDifficulty(game, players, "")
}

func (r *gameRuntime) SelectGameWithDifficulty(game string, players int, difficulty string) {
	r.SelectGameWithOptions(game, players, difficulty, nil)
}

func (r *gameRuntime) SelectGameWithOptions(game string, players int, difficulty string, narrationEnabled *bool) {
	if r == nil {
		return
	}
	cfg := configForSelection(r.base, game, players)
	if difficulty != "" {
		cfg.Difficulty = normalizeDifficulty(difficulty)
	}
	mode := narrationAuto
	if narrationEnabled != nil {
		if *narrationEnabled {
			mode = narrationForce
		} else {
			mode = narrationSkip
		}
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.applyLockedWithNarration(cfg, true, mode)
	now := time.Now()
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
		r.applyLocked(configForSelection(r.base, "loop", 1), true)
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

func (r *gameRuntime) Render(now time.Time) (int, []animation.RGB) {
	if r == nil {
		return 80, nil
	}
	r.mu.RLock()
	brightness := r.current.Brightness
	gameID := r.current.Game
	game := r.game
	started := r.started
	gameNow := r.effectiveNowLocked(now)
	r.mu.RUnlock()
	if game == nil {
		if animation.IsAmbientMode(gameID) {
			return brightness, renderAmbient(gameID, gameNow, started)
		}
		return brightness, nil
	}
	return brightness, game.Render(gameNow)
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
	paused := r.paused
	gameNow := r.effectiveNowLocked(now)
	r.mu.RUnlock()
	if startedAt.IsZero() {
		startedAt = fallbackStartedAt
	}
	r.recordPressureInput(event, now)
	if paused {
		return
	}

	if game != nil {
		for _, gameEvent := range game.Press(whackamole.PressEvent{X: int(event.X), Y: int(event.Y), Pressed: event.Pressed}, gameNow) {
			r.recordGameEvent(gameEvent.Cue, gameEvent.Message, gameNow)
			r.playCue(cfg, audioPlayer, gameEvent.Cue, cueRef(cfg, gameEvent.Cue), gameNow)
		}
		return
	}
	if audioPlayer == nil || !event.Pressed {
		return
	}
	seconds := gameNow.Sub(startedAt).Seconds()
	r.playCue(cfg, audioPlayer, "loop-pressure", cueForPressure(cfg, int(event.X), int(event.Y), seconds), now)
}

func (r *gameRuntime) DisplayStatus(now time.Time) displayStatus {
	if r == nil {
		return displayStatus{
			CurrentGame: "loop",
			Label:       gameLabel("loop"),
			Phase:       "idle",
			Lives:       -1,
		}
	}
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
		CurrentGame:        cfg.Game,
		Label:              gameLabel(cfg.Game),
		Phase:              "idle",
		Difficulty:         cfg.Difficulty,
		PlayerCount:        cfg.PlayerCount,
		Players:            defaultDisplayPlayers(cfg.PlayerCount),
		Lives:              -1,
		StartedUnix:        started.Unix(),
		AudioEnabled:       audioEnabled,
		AudioMuted:         audioMuted,
		LastEventUnixNanos: lastEvent.unixNanos,
		LastEventCue:       lastEvent.cue,
		LastEventMessage:   lastEvent.message,
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
					Label: player.Label,
					Color: displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)},
					Score: player.Score,
					Lives: snapshot.Lives,
				})
			}
		}
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return status
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
					Label: player.Label,
					Color: displayColor{R: int(player.Color.R), G: int(player.Color.G), B: int(player.Color.B)},
					Score: player.Score,
					Lives: snapshot.Lives,
				})
			}
		}
		r.applyIntroStatus(&status, gameNow, introUntil)
		if paused && status.Phase != "finished" {
			status.Phase = "paused"
		}
		return status
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

func (r *gameRuntime) Status() runtimeStatus {
	if r == nil {
		return runtimeStatus{Catalog: gameCatalog()}
	}
	r.mu.RLock()
	cfg := r.current
	started := r.started
	audioEnabled := r.audio != nil
	audioMuted := r.audioMuted
	sessionID := r.sessionID
	rngSeed := r.rngSeed
	paused := r.paused
	recorderStats := r.recorder.Stats()
	r.mu.RUnlock()
	display := r.DisplayStatus(time.Now())
	return runtimeStatus{
		CurrentGame:              cfg.Game,
		Label:                    gameLabel(cfg.Game),
		Difficulty:               cfg.Difficulty,
		PlayerCount:              cfg.PlayerCount,
		Music:                    cfg.MusicRef,
		MusicVolume:              cfg.MusicVolume,
		AudioEnabled:             audioEnabled,
		AudioMuted:               audioMuted,
		Paused:                   paused,
		Phase:                    display.Phase,
		IntroRemainingMillis:     display.IntroRemainingMillis,
		CountdownRemainingMillis: display.CountdownRemainingMillis,
		StartedUnix:              started.Unix(),
		SessionID:                sessionID,
		RNGSeed:                  rngSeed,
		Recorder:                 recorderStats,
		Catalog:                  gameCatalog(),
	}
}

func (r *gameRuntime) SessionID() string {
	if r == nil {
		return ""
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.sessionID
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
	now := time.Now()
	if r.sessionID != "" {
		r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
			record.Payload = &gamepb.GameSessionRecord_SessionEnded{SessionEnded: &gamepb.SessionEnded{
				Reason:         "game changed",
				EndedUnixNanos: now.UnixNano(),
			}}
		})
	}
	cfg.normalize()
	introHold := time.Duration(0)
	if playAudio && r.shouldNarrateLocked(cfg, mode) {
		introHold = r.narrationHoldDurationLocked(cfg)
	}
	gameNow := now.Add(introHold)
	r.current = cfg
	r.started = now
	r.sessionID = newSessionID(now)
	r.sessionSeq = 0
	r.rngSeed = now.UnixNano()
	r.game = makeGame(cfg, r.rngSeed, gameNow)
	r.lastEvent = displayEvent{}
	r.paused = false
	r.pausedAt = time.Time{}
	r.pauseTotal = 0
	r.introUntil = time.Time{}
	if introHold > 0 {
		r.introUntil = gameNow
	}
	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_SessionStarted{SessionStarted: &gamepb.SessionStarted{
			Game:             cfg.Game,
			Label:            gameLabel(cfg.Game),
			PlayerCount:      uint32(cfg.PlayerCount),
			RngSeed:          r.rngSeed,
			StartedUnixNanos: now.UnixNano(),
		}}
	})
	if playAudio {
		r.startAudioLocked(cfg, now, introHold, mode)
	}
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
	if !force && r.narrated[cfg.Game] {
		return
	}
	if err := r.audio.PlayCue(cfg.NarrationCueRef, cfg.NarrationVolume); err != nil {
		log.Printf("narration cue: %v", err)
		return
	}
	r.narrated[cfg.Game] = true
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
	switch cfg.Game {
	case "lava":
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
		return !r.narrated[cfg.Game]
	}
}

func (r *gameRuntime) narrationHoldDurationLocked(cfg config) time.Duration {
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
	}
	r.mu.Lock()
	r.recordAudioCueLocked(cue, ref, cfg.CueVolume, now)
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
	r.recordLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_DisplaySnapshot{DisplaySnapshot: displaySnapshotPB(status)}
	})
}

func (r *gameRuntime) StartDisplaySnapshotRecording(interval time.Duration) {
	if r == nil || r.recorder == nil {
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
	if now.IsZero() {
		now = time.Now()
	}
	r.sessionSeq++
	record := &gamepb.GameSessionRecord{
		SessionId: r.sessionID,
		Sequence:  r.sessionSeq,
		UnixNanos: now.UnixNano(),
	}
	setPayload(record)
	if err := r.recorder.Record(record); err != nil {
		log.Printf("session recording: %v", err)
	}
}

func displaySnapshotPB(status displayStatus) *gamepb.DisplaySnapshot {
	players := make([]*gamepb.DisplayPlayer, 0, len(status.Players))
	for _, player := range status.Players {
		players = append(players, &gamepb.DisplayPlayer{
			Index: uint32(player.Index),
			Label: player.Label,
			Color: &gamepb.Color{R: uint32(player.Color.R), G: uint32(player.Color.G), B: uint32(player.Color.B)},
			Score: int32(player.Score),
			Lives: int32(player.Lives),
		})
	}
	return &gamepb.DisplaySnapshot{
		CurrentGame:              status.CurrentGame,
		Label:                    status.Label,
		Phase:                    status.Phase,
		PlayerCount:              uint32(status.PlayerCount),
		Players:                  players,
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
	}
}

func newSessionID(now time.Time) string {
	var random [8]byte
	if _, err := crand.Read(random[:]); err == nil {
		return now.UTC().Format("20060102T150405Z") + "-" + hex.EncodeToString(random[:])
	}
	return fmt.Sprintf("%s-%d", now.UTC().Format("20060102T150405Z"), now.UnixNano())
}

func makeGame(cfg config, seed int64, now time.Time) floorGame {
	switch cfg.Game {
	case "whack-a-mole":
		log.Printf("game: whack-a-mole players=%d", cfg.PlayerCount)
		return whackamole.NewWithSeed(cfg.PlayerCount, now, seed)
	case "lava":
		log.Printf("game: lava players=%d difficulty=%s", cfg.PlayerCount, cfg.Difficulty)
		return lava.NewWithSeed(cfg.PlayerCount, now, seed, cfg.Difficulty)
	default:
		log.Printf("game: %s", cfg.Game)
		return nil
	}
}

func renderAmbient(game string, now time.Time, started time.Time) []animation.RGB {
	seconds := float64(0)
	if !now.IsZero() && !started.IsZero() {
		seconds = now.Sub(started).Seconds()
	}
	frame := make([]animation.RGB, animation.GridWidth*animation.GridHeight)
	for y := 0; y < animation.GridHeight; y++ {
		for x := 0; x < animation.GridWidth; x++ {
			frame[y*animation.GridWidth+x] = animation.Color(game, x, y, seconds)
		}
	}
	return frame
}

func configForSelection(base config, game string, players int) config {
	cfg := base
	cfg.Game = normalizeGame(game)
	cfg.PlayerCount = players
	switch cfg.Game {
	case "whack-a-mole":
		cfg.MusicRef = whackamole.DefaultMusicRef
		cfg.MusicVolume = whackamole.DefaultMusicVolume
	case "lava":
		cfg.MusicRef = lava.DefaultMusicRef
		cfg.MusicVolume = lava.DefaultMusicVolume
	default:
		cfg.MusicRef = loopMusicRef
		cfg.MusicVolume = 0.10
	}
	cfg.normalize()
	return cfg
}

func defaultNarrationRef(game string) string {
	switch normalizeGame(game) {
	case "lava":
		return "Motion/narraciones/lava-intro.mp3"
	default:
		return ""
	}
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
			Difficulty:  true,
			Volume:      whackamole.DefaultMusicVolume,
		},
		{
			Game:        "lava",
			Label:       "El suelo es lava",
			Description: "Avoid flowing lava tiles, lose shared team lives, and survive the timer.",
			Music:       lava.DefaultMusicRef,
			Players:     true,
			MinPlayers:  1,
			MaxPlayers:  6,
			Difficulty:  true,
			Volume:      lava.DefaultMusicVolume,
		},
		{
			Game:        "loop",
			Label:       "Arcoíris",
			Description: "The simple full-floor looping color animation.",
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

func gameLabel(game string) string {
	for _, entry := range gameCatalog() {
		if entry.Game == game {
			return entry.Label
		}
	}
	return "Animation loop"
}

func defaultDisplayPlayers(playerCount int) []displayPlayer {
	if playerCount < 1 {
		playerCount = 1
	}
	if playerCount > 6 {
		playerCount = 6
	}
	colors := []displayColor{
		{R: 0, G: 65, B: 255},
		{R: 0, G: 255, B: 60},
		{R: 255, G: 0, B: 212},
		{R: 255, G: 212, B: 0},
		{R: 255, G: 90, B: 0},
		{R: 0, G: 229, B: 255},
	}
	players := make([]displayPlayer, 0, playerCount)
	for i := 0; i < playerCount; i++ {
		players = append(players, displayPlayer{
			Index: i,
			Label: "Player " + string(rune('1'+i)),
			Color: colors[i%len(colors)],
			Lives: -1,
		})
	}
	return players
}

func preloadAudioRefs(cfg config) []string {
	refs := []string{
		loopMusicRef,
		whackamole.DefaultMusicRef,
		lava.DefaultMusicRef,
		cfg.MusicRef,
		cfg.StartCueRef,
		cfg.CoinCueRef,
		cfg.DamageCueRef,
		cfg.WinCueRef,
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
