package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

type platformSyncer struct {
	runtime            *gameRuntime
	platformURL        string
	token              string
	controllerID       string
	controllerLabel    string
	controllerHostname string
	interval           time.Duration
	client             *http.Client

	lastSessionID       string
	lastEventUnixNanos  int64
	displaySnapshotSeq  uint64
	lastSyncErrorLogged time.Time
}

type platformSessionPayload struct {
	SessionID          string                    `json:"sessionId"`
	VenueSessionID     string                    `json:"venueSessionId,omitempty"`
	ControllerID       string                    `json:"controllerId,omitempty"`
	ControllerLabel    string                    `json:"controllerLabel,omitempty"`
	ControllerHostname string                    `json:"controllerHostname,omitempty"`
	Game               string                    `json:"game"`
	Label              string                    `json:"label"`
	Phase              string                    `json:"phase"`
	Status             string                    `json:"status"`
	TeamName           string                    `json:"teamName,omitempty"`
	StartedAt          string                    `json:"startedAt,omitempty"`
	EndedAt            string                    `json:"endedAt,omitempty"`
	RNGSeed            string                    `json:"rngSeed,omitempty"`
	PlayerCount        int                       `json:"playerCount"`
	Score              int                       `json:"score"`
	Lives              int                       `json:"lives"`
	ActiveTargets      int                       `json:"activeTargets"`
	LastEventMessage   string                    `json:"lastEventMessage,omitempty"`
	Players            []platformPlayerPayload   `json:"players,omitempty"`
	Events             []platformEventPayload    `json:"events,omitempty"`
	DisplaySnapshots   []platformSnapshotPayload `json:"displaySnapshots,omitempty"`
}

type platformPlayerPayload struct {
	Index int                  `json:"index"`
	Label string               `json:"label"`
	Color platformColorPayload `json:"color"`
	Score int                  `json:"score"`
	Lives int                  `json:"lives"`
}

type platformColorPayload struct {
	R int `json:"r"`
	G int `json:"g"`
	B int `json:"b"`
}

type platformEventPayload struct {
	EventKey   string         `json:"eventKey"`
	Sequence   string         `json:"sequence,omitempty"`
	OccurredAt string         `json:"occurredAt"`
	Type       string         `json:"type"`
	Cue        string         `json:"cue,omitempty"`
	Message    string         `json:"message,omitempty"`
	Payload    map[string]any `json:"payload,omitempty"`
}

type platformSnapshotPayload struct {
	SnapshotKey     string         `json:"snapshotKey"`
	Sequence        string         `json:"sequence"`
	OccurredAt      string         `json:"occurredAt"`
	Phase           string         `json:"phase"`
	Score           int            `json:"score"`
	Lives           int            `json:"lives"`
	ElapsedMillis   int64          `json:"elapsedMillis"`
	RemainingMillis int64          `json:"remainingMillis"`
	ActiveTargets   int            `json:"activeTargets"`
	Payload         map[string]any `json:"payload,omitempty"`
}

type platformIngestResponse struct {
	OK    bool   `json:"ok"`
	Error string `json:"error"`
}

type platformVenuePayload struct {
	VenueSessionID string                      `json:"venueSessionId"`
	ControllerID   string                      `json:"controllerId,omitempty"`
	KioskID        string                      `json:"kioskId,omitempty"`
	TeamName       string                      `json:"teamName,omitempty"`
	PlayerLabels   []string                    `json:"playerLabels,omitempty"`
	PlayerRoster   []platformVenuePlayer       `json:"players,omitempty"`
	Status         string                      `json:"status"`
	EndReason      string                      `json:"endReason,omitempty"`
	StartedAt      string                      `json:"startedAt,omitempty"`
	EndedAt        string                      `json:"endedAt,omitempty"`
	Events         []platformVenueEventPayload `json:"events,omitempty"`
}

type platformVenuePlayer struct {
	Index int    `json:"index"`
	Label string `json:"label"`
	Color string `json:"color,omitempty"`
}

type platformVenueEventPayload struct {
	EventKey   string         `json:"eventKey"`
	Sequence   string         `json:"sequence,omitempty"`
	OccurredAt string         `json:"occurredAt"`
	Type       string         `json:"type"`
	Name       string         `json:"name"`
	Payload    map[string]any `json:"payload,omitempty"`
}

func startPlatformSync(runtime *gameRuntime, cfg config) {
	syncer, err := newPlatformSyncer(runtime, cfg)
	if err != nil {
		log.Printf("platform sync disabled: %v", err)
		return
	}
	if syncer == nil {
		return
	}
	go syncer.run()
}

func newPlatformSyncer(runtime *gameRuntime, cfg config) (*platformSyncer, error) {
	platformURL := strings.TrimRight(strings.TrimSpace(cfg.PlatformURL), "/")
	if platformURL == "" {
		return nil, nil
	}
	if !strings.HasPrefix(platformURL, "http://") && !strings.HasPrefix(platformURL, "https://") {
		return nil, fmt.Errorf("platform-url must be absolute")
	}
	interval := cfg.PlatformSyncInterval
	if interval <= 0 {
		interval = 5 * time.Second
	}
	controllerID, err := resolveControllerID(cfg)
	if err != nil {
		log.Printf("platform sync controller id: %v", err)
	}
	return &platformSyncer{
		runtime:            runtime,
		platformURL:        platformURL,
		token:              strings.TrimSpace(cfg.PlatformToken),
		controllerID:       controllerID,
		controllerLabel:    strings.TrimSpace(cfg.ControllerLabel),
		controllerHostname: strings.TrimSpace(cfg.ControllerHostname),
		interval:           interval,
		client:             &http.Client{Timeout: 10 * time.Second},
	}, nil
}

func resolveControllerID(cfg config) (string, error) {
	if id := strings.TrimSpace(cfg.ControllerID); id != "" {
		return id, nil
	}
	if strings.TrimSpace(cfg.ControllerIDFile) == "" {
		return "", nil
	}
	raw, err := os.ReadFile(cfg.ControllerIDFile)
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(string(raw)), nil
}

func (s *platformSyncer) run() {
	s.syncTick(time.Now())
	ticker := time.NewTicker(s.interval)
	defer ticker.Stop()
	for now := range ticker.C {
		s.syncTick(now)
	}
}

func (s *platformSyncer) syncTick(now time.Time) {
	if err := s.syncOnce(now); err != nil {
		s.logError(err)
	}
	if err := s.syncVenueOnce(now); err != nil {
		s.logError(err)
	}
}

func (s *platformSyncer) syncOnce(now time.Time) error {
	if s == nil || s.runtime == nil {
		return nil
	}
	status := s.runtime.Status()
	display := s.runtime.DisplayStatus(now)
	if status.SessionID == "" {
		return nil
	}
	if isAmbientActivityGame(status.CurrentGame) || isAmbientActivityGame(display.CurrentGame) {
		return nil
	}
	if currentSessionID := s.runtime.SessionID(); currentSessionID != "" && currentSessionID != status.SessionID {
		return nil
	}
	if status.SessionID != s.lastSessionID {
		s.lastSessionID = status.SessionID
		s.lastEventUnixNanos = 0
		s.displaySnapshotSeq = 0
	}
	return s.postIngest("/api/ingest/session", s.payload(status, display, now))
}

const venueSyncBatchLimit = 200

// syncVenueOnce forwards visit lifecycle and kiosk menu events, and sends a
// heartbeat upsert while a visit is active so the platform can detect stale
// visits after an engine crash.
func (s *platformSyncer) syncVenueOnce(now time.Time) error {
	if s == nil || s.runtime == nil {
		return nil
	}
	events := s.runtime.DrainVenueOutbox(venueSyncBatchLimit)
	if len(events) == 0 {
		snapshot, ok := s.runtime.VenueSnapshot()
		if !ok || snapshot.Status != "active" {
			return nil
		}
		return s.postIngest("/api/ingest/venue-session", s.venuePayload(snapshot, nil))
	}
	for start := 0; start < len(events); {
		end := start + 1
		for end < len(events) && events[end].VenueID == events[start].VenueID {
			end++
		}
		group := events[start:end]
		// The newest event carries the freshest venue row state for the upsert.
		if err := s.postIngest("/api/ingest/venue-session", s.venuePayload(group[len(group)-1].Venue, group)); err != nil {
			s.runtime.RequeueVenueOutbox(events[start:])
			return err
		}
		start = end
	}
	return nil
}

func (s *platformSyncer) venuePayload(venue venueSnapshot, events []venueOutboxEvent) platformVenuePayload {
	payload := platformVenuePayload{
		VenueSessionID: venue.ID,
		ControllerID:   s.controllerID,
		KioskID:        venue.KioskID,
		TeamName:       venue.TeamName,
		PlayerLabels:   venue.PlayerLabels,
		PlayerRoster:   venuePlayersPayload(venue.PlayerRoster),
		Status:         venue.Status,
		EndReason:      venue.EndReason,
	}
	if !venue.StartedAt.IsZero() {
		payload.StartedAt = venue.StartedAt.UTC().Format(time.RFC3339Nano)
	}
	if !venue.EndedAt.IsZero() {
		payload.EndedAt = venue.EndedAt.UTC().Format(time.RFC3339Nano)
	}
	for _, event := range events {
		payload.Events = append(payload.Events, platformVenueEventPayload{
			EventKey:   event.EventKey,
			Sequence:   fmt.Sprintf("%d", event.Sequence),
			OccurredAt: event.OccurredAt.UTC().Format(time.RFC3339Nano),
			Type:       event.Type,
			Name:       event.Name,
			Payload:    event.Payload,
		})
	}
	return payload
}

func venuePlayersPayload(players []venuePlayerSnapshot) []platformVenuePlayer {
	if len(players) == 0 {
		return nil
	}
	out := make([]platformVenuePlayer, 0, len(players))
	for _, player := range players {
		out = append(out, platformVenuePlayer{
			Index: player.Index,
			Label: player.Label,
			Color: player.Color,
		})
	}
	return out
}

func (s *platformSyncer) postIngest(path string, payload any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	request, err := http.NewRequest(http.MethodPost, s.platformURL+path, bytes.NewReader(body))
	if err != nil {
		return err
	}
	request.Header.Set("content-type", "application/json")
	if s.token != "" {
		request.Header.Set("authorization", "Bearer "+s.token)
	}
	response, err := s.client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		body, _ := io.ReadAll(io.LimitReader(response.Body, 1024))
		return fmt.Errorf("platform ingest failed: status=%d body=%s", response.StatusCode, strings.TrimSpace(string(body)))
	}
	var result platformIngestResponse
	if err := json.NewDecoder(response.Body).Decode(&result); err != nil {
		return err
	}
	if !result.OK {
		if result.Error != "" {
			return fmt.Errorf("platform ingest failed: %s", result.Error)
		}
		return fmt.Errorf("platform ingest failed")
	}
	return nil
}

func (s *platformSyncer) payload(status runtimeStatus, display displayStatus, now time.Time) platformSessionPayload {
	players := make([]platformPlayerPayload, 0, len(display.Players))
	for _, player := range display.Players {
		players = append(players, platformPlayerPayload{
			Index: player.Index,
			Label: player.Label,
			Color: platformColorPayload{R: player.Color.R, G: player.Color.G, B: player.Color.B},
			Score: player.Score,
			Lives: player.Lives,
		})
	}

	s.displaySnapshotSeq++
	snapshotSeq := s.displaySnapshotSeq
	snapshots := []platformSnapshotPayload{{
		SnapshotKey:     fmt.Sprintf("display:%s:%d", status.SessionID, snapshotSeq),
		Sequence:        fmt.Sprintf("%d", snapshotSeq),
		OccurredAt:      now.UTC().Format(time.RFC3339Nano),
		Phase:           display.Phase,
		Score:           display.Score,
		Lives:           display.Lives,
		ElapsedMillis:   display.ElapsedMillis,
		RemainingMillis: display.RemainingMillis,
		ActiveTargets:   display.ActiveTargets,
		Payload: map[string]any{
			"view":                     "player-display-v1",
			"currentGame":              display.CurrentGame,
			"label":                    platformDisplayLabel(display),
			"level":                    display.Level,
			"levelNumber":              display.LevelNumber,
			"difficulty":               display.Difficulty,
			"introRemainingMillis":     display.IntroRemainingMillis,
			"countdownRemainingMillis": display.CountdownRemainingMillis,
			"audioEnabled":             display.AudioEnabled,
			"audioMuted":               display.AudioMuted,
			// Per-player scores at this instant, so replay scoreboards can
			// show time-accurate values instead of the session's final state.
			"players": display.Players,
		},
	}}

	var events []platformEventPayload
	if display.LastEventUnixNanos != 0 && display.LastEventUnixNanos != s.lastEventUnixNanos {
		s.lastEventUnixNanos = display.LastEventUnixNanos
		events = append(events, platformEventPayload{
			EventKey:   fmt.Sprintf("display-event:%d", display.LastEventUnixNanos),
			Sequence:   fmt.Sprintf("%d", snapshotSeq),
			OccurredAt: unixNanosTime(display.LastEventUnixNanos).Format(time.RFC3339Nano),
			Type:       "game_event",
			Cue:        display.LastEventCue,
			Message:    display.LastEventMessage,
		})
	}

	payload := platformSessionPayload{
		SessionID:          status.SessionID,
		VenueSessionID:     status.VenueSessionID,
		ControllerID:       s.controllerID,
		ControllerLabel:    s.controllerLabel,
		ControllerHostname: s.controllerHostname,
		Game:               display.CurrentGame,
		Label:              platformDisplayLabel(display),
		Phase:              display.Phase,
		Status:             platformSessionStatus(display.Phase),
		TeamName:           display.TeamName,
		StartedAt:          unixSecondsTime(display.StartedUnix).Format(time.RFC3339Nano),
		RNGSeed:            fmt.Sprintf("%d", status.RNGSeed),
		PlayerCount:        display.PlayerCount,
		Score:              display.Score,
		Lives:              display.Lives,
		ActiveTargets:      display.ActiveTargets,
		LastEventMessage:   display.LastEventMessage,
		Players:            players,
		Events:             events,
		DisplaySnapshots:   snapshots,
	}
	if payload.Status == "complete" {
		payload.EndedAt = now.UTC().Format(time.RFC3339Nano)
	}
	return payload
}

func platformDisplayLabel(display displayStatus) string {
	base := strings.TrimSpace(display.Label)
	if base == "" {
		base = staticGameLabel(display.CurrentGame)
	}
	level := platformLevelLabel(display.Level, display.LevelNumber)
	if level == "" {
		return base
	}
	difficulty := platformDifficultyLabel(display.Difficulty)
	if difficulty != "" {
		return fmt.Sprintf("%s / %s · %s", base, level, difficulty)
	}
	return fmt.Sprintf("%s / %s", base, level)
}

func platformLevelLabel(level string, levelNumber int) string {
	if levelNumber > 0 {
		return fmt.Sprintf("Nivel %d", levelNumber)
	}
	level = strings.TrimSpace(level)
	if level == "" {
		return ""
	}
	if strings.HasPrefix(level, "level-") {
		if number, err := strconv.Atoi(strings.TrimPrefix(level, "level-")); err == nil && number > 0 {
			return fmt.Sprintf("Nivel %d", number)
		}
	}
	if number, err := strconv.Atoi(level); err == nil && number > 0 {
		return fmt.Sprintf("Nivel %d", number)
	}
	return level
}

func platformDifficultyLabel(difficulty string) string {
	switch strings.TrimSpace(difficulty) {
	case "easy":
		return "Fácil"
	case "medium":
		return "Media"
	case "hard":
		return "Difícil"
	case "expert":
		return "Experto"
	default:
		return ""
	}
}

func (s *platformSyncer) logError(err error) {
	now := time.Now()
	if now.Sub(s.lastSyncErrorLogged) < time.Minute {
		return
	}
	s.lastSyncErrorLogged = now
	log.Printf("platform sync: %v", err)
}

func platformSessionStatus(phase string) string {
	switch phase {
	case "finished":
		return "complete"
	default:
		return "open"
	}
}

func unixSecondsTime(seconds int64) time.Time {
	if seconds <= 0 {
		return time.Now().UTC()
	}
	return time.Unix(seconds, 0).UTC()
}

func unixNanosTime(nanos int64) time.Time {
	if nanos <= 0 {
		return time.Now().UTC()
	}
	return time.Unix(0, nanos).UTC()
}
