package main

import (
	"fmt"
	"strings"
	"time"
)

const displayClientFreshness = 15 * time.Second

type displayClientReport struct {
	ClientID             string  `json:"clientId"`
	CurrentGame          string  `json:"currentGame"`
	ExpectedRevision     string  `json:"expectedRevision"`
	LoadedRevision       string  `json:"loadedRevision"`
	RenderStatus         string  `json:"renderStatus"`
	RenderAttempt        int     `json:"renderAttempt"`
	Connected            bool    `json:"connected"`
	FeedTransport        string  `json:"feedTransport"`
	LastFeedUnixMillis   int64   `json:"lastFeedUnixMillis"`
	LastPaintUnixMillis  int64   `json:"lastPaintUnixMillis"`
	PageLoadedUnixMillis int64   `json:"pageLoadedUnixMillis"`
	ViewportWidth        int     `json:"viewportWidth"`
	ViewportHeight       int     `json:"viewportHeight"`
	DevicePixelRatio     float64 `json:"devicePixelRatio"`
	Error                string  `json:"error,omitempty"`
}

type displayClientStatus struct {
	displayClientReport
	Seen               bool  `json:"seen"`
	Fresh              bool  `json:"fresh"`
	Healthy            bool  `json:"healthy"`
	MatchesCurrentGame bool  `json:"matchesCurrentGame"`
	RevisionMatches    bool  `json:"revisionMatches"`
	ReceivedUnixMillis int64 `json:"receivedUnixMillis"`
	AgeMillis          int64 `json:"ageMillis"`
}

func normalizeDisplayClientReport(report displayClientReport) (displayClientReport, error) {
	report.ClientID = strings.TrimSpace(report.ClientID)
	report.CurrentGame = strings.TrimSpace(report.CurrentGame)
	report.ExpectedRevision = strings.TrimSpace(report.ExpectedRevision)
	report.LoadedRevision = strings.TrimSpace(report.LoadedRevision)
	report.RenderStatus = strings.TrimSpace(report.RenderStatus)
	report.FeedTransport = strings.TrimSpace(report.FeedTransport)
	report.Error = strings.TrimSpace(report.Error)
	if report.ClientID != "player-display" {
		return displayClientReport{}, fmt.Errorf("clientId must be player-display")
	}
	if !oneOf(report.RenderStatus, "loading", "ready", "fallback", "error") {
		return displayClientReport{}, fmt.Errorf("invalid renderStatus")
	}
	if !oneOf(report.FeedTransport, "eventsource", "poll", "none") {
		return displayClientReport{}, fmt.Errorf("invalid feedTransport")
	}
	if report.RenderAttempt < 0 || report.RenderAttempt > 1_000_000 {
		return displayClientReport{}, fmt.Errorf("invalid renderAttempt")
	}
	if report.ViewportWidth < 0 || report.ViewportWidth > 32_768 || report.ViewportHeight < 0 || report.ViewportHeight > 32_768 {
		return displayClientReport{}, fmt.Errorf("invalid viewport")
	}
	if report.DevicePixelRatio < 0 || report.DevicePixelRatio > 16 {
		return displayClientReport{}, fmt.Errorf("invalid devicePixelRatio")
	}
	for name, value := range map[string]string{
		"currentGame": report.CurrentGame, "expectedRevision": report.ExpectedRevision,
		"loadedRevision": report.LoadedRevision, "error": report.Error,
	} {
		if len(value) > 512 {
			return displayClientReport{}, fmt.Errorf("%s is too long", name)
		}
	}
	return report, nil
}

func oneOf(value string, choices ...string) bool {
	for _, choice := range choices {
		if value == choice {
			return true
		}
	}
	return false
}

func (r *gameRuntime) UpdateDisplayClient(report displayClientReport, now time.Time) (displayClientStatus, error) {
	if r == nil {
		return displayClientStatus{}, fmt.Errorf("runtime is unavailable")
	}
	normalized, err := normalizeDisplayClientReport(report)
	if err != nil {
		return displayClientStatus{}, err
	}
	if now.IsZero() {
		now = time.Now()
	}
	r.mu.Lock()
	r.displayClient = normalized
	r.displayClientReceivedAt = now
	r.mu.Unlock()
	return r.DisplayClientStatus(now), nil
}

func (r *gameRuntime) DisplayClientStatus(now time.Time) displayClientStatus {
	if r == nil {
		return displayClientStatus{}
	}
	if now.IsZero() {
		now = time.Now()
	}
	r.mu.RLock()
	report := r.displayClient
	receivedAt := r.displayClientReceivedAt
	currentGame := r.current.Game
	r.mu.RUnlock()
	seen := !receivedAt.IsZero()
	age := int64(0)
	if seen && now.After(receivedAt) {
		age = now.Sub(receivedAt).Milliseconds()
	}
	fresh := seen && age <= displayClientFreshness.Milliseconds()
	matchesCurrentGame := seen && report.CurrentGame == currentGame
	revisionMatches := seen && report.ExpectedRevision == report.LoadedRevision
	receivedUnixMillis := int64(0)
	if seen {
		receivedUnixMillis = receivedAt.UnixMilli()
	}
	return displayClientStatus{
		displayClientReport: report,
		Seen:                seen,
		Fresh:               fresh,
		Healthy:             fresh && report.Connected && report.RenderStatus == "ready" && matchesCurrentGame && revisionMatches,
		MatchesCurrentGame:  matchesCurrentGame,
		RevisionMatches:     revisionMatches,
		ReceivedUnixMillis:  receivedUnixMillis,
		AgeMillis:           age,
	}
}
