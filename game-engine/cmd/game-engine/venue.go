package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/lobis/motion-levels/packages/contracts/gamepb"
)

// Venue sessions describe a client visit at the kiosk: they begin when the
// menu opens a session, span any number of game sessions (including ambient
// loops between games), and end when the menu closes the session or the visit
// goes idle. Venue records are written to the same pbstream as game records
// but with an empty session_id, and they are forwarded to the platform through
// a dedicated outbox so they survive transient ingest failures.

const (
	venueOutboxLimit       = 5000
	venueEventMaxClockSkew = 5 * time.Minute
	defaultVenueIdleLimit  = 60 * time.Minute
)

type venueSnapshot struct {
	ID           string
	TeamName     string
	PlayerLabels []string
	PlayerRoster []venuePlayerSnapshot
	KioskID      string
	Status       string // active | ended
	EndReason    string
	StartedAt    time.Time
	EndedAt      time.Time
}

type venuePlayerSnapshot struct {
	Index int    `json:"index"`
	Label string `json:"label"`
	Color string `json:"color,omitempty"`
}

type venueOutboxEvent struct {
	VenueID    string
	EventKey   string
	Sequence   uint64
	OccurredAt time.Time
	Type       string // menu_event | venue_lifecycle
	Name       string
	Payload    map[string]any
	// Venue row state at enqueue time, so the platform upsert stays correct
	// even after this venue has been superseded by a newer visit.
	Venue venueSnapshot
}

func (r *gameRuntime) StartVenueSession(id, teamName, kioskID string, now time.Time) {
	if r == nil || strings.TrimSpace(id) == "" {
		return
	}
	if now.IsZero() {
		now = time.Now()
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.startVenueLocked(strings.TrimSpace(id), teamName, kioskID, now, false)
}

func (r *gameRuntime) EndVenueSession(id, reason string, now time.Time) {
	if r == nil {
		return
	}
	if now.IsZero() {
		now = time.Now()
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.endVenueLocked(strings.TrimSpace(id), reason, now)
}

// RecordMenuEvent ingests one kiosk menu event. Unknown venue ids implicitly
// start that venue session: the menu is the source of truth and the engine may
// have restarted mid-visit.
func (r *gameRuntime) RecordMenuEvent(venueID, name, kioskID string, properties map[string]any, occurredAt time.Time, now time.Time) error {
	if r == nil {
		return fmt.Errorf("runtime unavailable")
	}
	venueID = strings.TrimSpace(venueID)
	name = strings.TrimSpace(name)
	if venueID == "" {
		return fmt.Errorf("venueSessionId is required")
	}
	if name == "" {
		return fmt.Errorf("name is required")
	}
	if now.IsZero() {
		now = time.Now()
	}
	occurred := clampToClock(occurredAt, now, venueEventMaxClockSkew)

	r.mu.Lock()
	defer r.mu.Unlock()
	if r.venueID != venueID || r.venueStatus != "active" {
		r.startVenueLocked(venueID, "", kioskID, now, true)
	}
	r.venueLastActivity = now
	r.applyVenuePropertiesLocked(properties)

	propertiesJSON := "{}"
	if len(properties) > 0 {
		if raw, err := json.Marshal(properties); err == nil {
			propertiesJSON = string(raw)
		}
	}
	r.recordVenueLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_MenuEvent{MenuEvent: &gamepb.MenuEvent{
			Name:           name,
			KioskId:        strings.TrimSpace(kioskID),
			PropertiesJson: propertiesJSON,
			UnixNanos:      occurred.UnixNano(),
			VenueSequence:  r.venueSeq,
		}}
	})
	r.enqueueVenueEventLocked(occurred, "menu_event", name, properties)
	return nil
}

func (r *gameRuntime) startVenueLocked(id, teamName, kioskID string, now time.Time, implicit bool) {
	teamName = strings.TrimSpace(teamName)
	kioskID = strings.TrimSpace(kioskID)
	if r.venueID == id && r.venueStatus == "active" {
		if teamName != "" {
			r.venueTeamName = teamName
		}
		if kioskID != "" {
			r.venueKioskID = kioskID
		}
		r.venueLastActivity = now
		return
	}
	if r.venueID != "" && r.venueStatus == "active" {
		r.endVenueLocked(r.venueID, "superseded", now)
	}
	r.venueID = id
	r.venueTeamName = teamName
	r.venuePlayerLabels = nil
	r.venuePlayerRoster = nil
	r.venueKioskID = kioskID
	r.venueStatus = "active"
	r.venueEndReason = ""
	r.venueStartedAt = now
	r.venueEndedAt = time.Time{}
	r.venueSeq = 0
	r.venueLastActivity = now
	r.recordVenueLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_VenueSessionStarted{VenueSessionStarted: &gamepb.VenueSessionStarted{
			TeamName:         teamName,
			KioskId:          kioskID,
			StartedUnixNanos: now.UnixNano(),
		}}
	})
	r.enqueueVenueEventLocked(now, "venue_lifecycle", "venue_started", map[string]any{
		"team_name": teamName,
		"kiosk_id":  kioskID,
		"implicit":  implicit,
	})
	log.Printf("venue session started: id=%s implicit=%v", id, implicit)
}

func (r *gameRuntime) endVenueLocked(id, reason string, now time.Time) {
	if r.venueID == "" || r.venueStatus != "active" {
		return
	}
	if id != "" && id != r.venueID {
		return
	}
	reason = strings.TrimSpace(reason)
	if reason == "" {
		reason = "manual"
	}
	r.venueStatus = "ended"
	r.venueEndReason = reason
	r.venueEndedAt = now
	r.recordVenueLocked(now, func(record *gamepb.GameSessionRecord) {
		record.Payload = &gamepb.GameSessionRecord_VenueSessionEnded{VenueSessionEnded: &gamepb.VenueSessionEnded{
			Reason:         reason,
			EndedUnixNanos: now.UnixNano(),
		}}
	})
	r.enqueueVenueEventLocked(now, "venue_lifecycle", "venue_ended", map[string]any{"reason": reason})
	if r.current.VenueSessionID == r.venueID && !isAmbientActivityGame(r.current.Game) {
		r.exitActiveGameLocked("venue session ended")
	}
	log.Printf("venue session ended: id=%s reason=%s", r.venueID, reason)
}

// recordVenueLocked mirrors recordLocked but is venue-scoped: records carry an
// empty session_id and the venue's own monotonic sequence.
func (r *gameRuntime) recordVenueLocked(now time.Time, setPayload func(*gamepb.GameSessionRecord)) {
	r.venueSeq++
	if r.recorder == nil {
		return
	}
	record := &gamepb.GameSessionRecord{
		VenueSessionId: r.venueID,
		Sequence:       r.venueSeq,
		UnixNanos:      now.UnixNano(),
	}
	setPayload(record)
	if err := r.recorder.Record(record); err != nil {
		log.Printf("venue recording: %v", err)
	}
}

func (r *gameRuntime) enqueueVenueEventLocked(occurredAt time.Time, eventType, name string, payload map[string]any) {
	if len(r.venueOutbox) >= venueOutboxLimit {
		r.venueOutbox = r.venueOutbox[1:]
		r.venueDropped++
		if r.venueDropped == 1 || r.venueDropped%100 == 0 {
			log.Printf("venue outbox full: dropped=%d", r.venueDropped)
		}
	}
	r.venueOutbox = append(r.venueOutbox, venueOutboxEvent{
		VenueID:    r.venueID,
		EventKey:   fmt.Sprintf("menu:%s:%d", r.venueID, r.venueSeq),
		Sequence:   r.venueSeq,
		OccurredAt: occurredAt,
		Type:       eventType,
		Name:       name,
		Payload:    payload,
		Venue:      r.venueSnapshotLocked(),
	})
}

func (r *gameRuntime) venueSnapshotLocked() venueSnapshot {
	playerLabels := append([]string(nil), r.venuePlayerLabels...)
	playerRoster := append([]venuePlayerSnapshot(nil), r.venuePlayerRoster...)
	return venueSnapshot{
		ID:           r.venueID,
		TeamName:     r.venueTeamName,
		PlayerLabels: playerLabels,
		PlayerRoster: playerRoster,
		KioskID:      r.venueKioskID,
		Status:       r.venueStatus,
		EndReason:    r.venueEndReason,
		StartedAt:    r.venueStartedAt,
		EndedAt:      r.venueEndedAt,
	}
}

func (r *gameRuntime) applyVenuePropertiesLocked(properties map[string]any) {
	if len(properties) == 0 {
		return
	}
	if teamName := stringProperty(properties, "team_name", "teamName"); teamName != "" {
		r.venueTeamName = teamName
	}
	if roster, labels := playerRosterProperty(properties["players"]); len(roster) > 0 || len(labels) > 0 {
		r.venuePlayerRoster = roster
		r.venuePlayerLabels = labels
	}
}

func stringProperty(properties map[string]any, keys ...string) string {
	for _, key := range keys {
		if value, ok := properties[key]; ok {
			if text, ok := value.(string); ok {
				if trimmed := strings.TrimSpace(text); trimmed != "" {
					return trimmed
				}
			}
		}
	}
	return ""
}

func playerRosterProperty(value any) ([]venuePlayerSnapshot, []string) {
	items, ok := value.([]any)
	if !ok {
		return nil, nil
	}
	roster := make([]venuePlayerSnapshot, 0, len(items))
	labels := make([]string, 0, len(items))
	for fallbackIndex, item := range items {
		player, ok := item.(map[string]any)
		if !ok {
			continue
		}
		index := fallbackIndex
		if rawIndex, ok := player["index"]; ok {
			switch typed := rawIndex.(type) {
			case float64:
				index = int(typed)
			case int:
				index = typed
			}
		}
		label, _ := player["label"].(string)
		label = strings.TrimSpace(label)
		if label == "" {
			label = fmt.Sprintf("Jugador %d", index+1)
		}
		color := ""
		if rawColor, ok := player["color"]; ok {
			color = colorProperty(rawColor)
		}
		roster = append(roster, venuePlayerSnapshot{Index: index, Label: label, Color: color})
		labels = append(labels, label)
	}
	return roster, labels
}

func colorProperty(value any) string {
	switch typed := value.(type) {
	case string:
		return strings.TrimSpace(typed)
	case map[string]any:
		r, okR := numericColor(typed["r"])
		g, okG := numericColor(typed["g"])
		b, okB := numericColor(typed["b"])
		if okR && okG && okB {
			return fmt.Sprintf("#%02x%02x%02x", r, g, b)
		}
	}
	return ""
}

func numericColor(value any) (int, bool) {
	switch typed := value.(type) {
	case float64:
		if typed < 0 || typed > 255 {
			return 0, false
		}
		return int(typed), true
	case int:
		if typed < 0 || typed > 255 {
			return 0, false
		}
		return typed, true
	}
	return 0, false
}

// VenueSnapshot returns the current visit state for the platform heartbeat.
func (r *gameRuntime) VenueSnapshot() (venueSnapshot, bool) {
	if r == nil {
		return venueSnapshot{}, false
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	if r.venueID == "" {
		return venueSnapshot{}, false
	}
	return r.venueSnapshotLocked(), true
}

// DrainVenueOutbox removes and returns up to max pending events.
func (r *gameRuntime) DrainVenueOutbox(max int) []venueOutboxEvent {
	if r == nil || max <= 0 {
		return nil
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	if len(r.venueOutbox) == 0 {
		return nil
	}
	count := min(max, len(r.venueOutbox))
	drained := make([]venueOutboxEvent, count)
	copy(drained, r.venueOutbox[:count])
	r.venueOutbox = append(r.venueOutbox[:0], r.venueOutbox[count:]...)
	return drained
}

// RequeueVenueOutbox puts events back at the front after a failed sync.
func (r *gameRuntime) RequeueVenueOutbox(events []venueOutboxEvent) {
	if r == nil || len(events) == 0 {
		return
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	combined := make([]venueOutboxEvent, 0, len(events)+len(r.venueOutbox))
	combined = append(combined, events...)
	combined = append(combined, r.venueOutbox...)
	if overflow := len(combined) - venueOutboxLimit; overflow > 0 {
		r.venueDropped += uint64(overflow)
		combined = combined[:venueOutboxLimit]
	}
	r.venueOutbox = combined
}

// ExpireIdleVenueSession ends the visit after a period without any menu or
// gameplay activity (kiosk left unattended without closing the session).
func (r *gameRuntime) ExpireIdleVenueSession(now time.Time) {
	if r == nil {
		return
	}
	if now.IsZero() {
		now = time.Now()
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.venueStatus != "active" || r.venueIdleTimeout <= 0 {
		return
	}
	last := r.venueLastActivity
	if last.IsZero() {
		last = r.venueStartedAt
	}
	if last.IsZero() || now.Sub(last) < r.venueIdleTimeout {
		return
	}
	r.endVenueLocked(r.venueID, "idle_timeout", now)
}

func clampToClock(claimed, reference time.Time, maxSkew time.Duration) time.Time {
	if claimed.IsZero() {
		return reference
	}
	if delta := claimed.Sub(reference); delta > maxSkew {
		return reference.Add(maxSkew)
	} else if delta < -maxSkew {
		return reference.Add(-maxSkew)
	}
	return claimed
}
