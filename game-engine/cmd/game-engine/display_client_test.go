package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func healthyDisplayClientReport() displayClientReport {
	return displayClientReport{
		ClientID:             "player-display",
		CurrentGame:          "motion-levels-games:pong",
		ExpectedRevision:     "games-v1.7.0",
		LoadedRevision:       "games-v1.7.0",
		RenderStatus:         "ready",
		Connected:            true,
		FeedTransport:        "eventsource",
		LastFeedUnixMillis:   1_800_000_000_000,
		LastPaintUnixMillis:  1_800_000_000_000,
		PageLoadedUnixMillis: 1_800_000_000_000,
		ViewportWidth:        1920,
		ViewportHeight:       1080,
		DevicePixelRatio:     1,
	}
}

func TestDisplayClientStatusTracksFreshHealthyRender(t *testing.T) {
	runtime := &gameRuntime{current: config{Game: "motion-levels-games:pong"}}
	now := time.Unix(1_800_000_000, 0)
	status, err := runtime.UpdateDisplayClient(healthyDisplayClientReport(), now)
	if err != nil {
		t.Fatal(err)
	}
	if !status.Seen || !status.Fresh || !status.Healthy || !status.MatchesCurrentGame || !status.RevisionMatches {
		t.Fatalf("healthy status = %+v", status)
	}
	stale := runtime.DisplayClientStatus(now.Add(displayClientFreshness + time.Millisecond))
	if stale.Fresh || stale.Healthy {
		t.Fatalf("stale status = %+v", stale)
	}
}

func TestDisplayClientStatusRejectsRevisionMismatch(t *testing.T) {
	runtime := &gameRuntime{current: config{Game: "motion-levels-games:pong"}}
	report := healthyDisplayClientReport()
	report.LoadedRevision = "games-v1.6.0"
	status, err := runtime.UpdateDisplayClient(report, time.Now())
	if err != nil {
		t.Fatal(err)
	}
	if status.RevisionMatches || status.Healthy {
		t.Fatalf("mismatched status = %+v", status)
	}
}

func TestDisplayClientAPIAcceptsHeartbeat(t *testing.T) {
	runtime := &gameRuntime{current: config{Game: "motion-levels-games:pong"}}
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()
	payload, err := json.Marshal(healthyDisplayClientReport())
	if err != nil {
		t.Fatal(err)
	}
	response, err := http.Post(server.URL+"/api/display-client", "application/json", bytes.NewReader(payload))
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("POST status = %d", response.StatusCode)
	}
	var status displayClientStatus
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if !status.Healthy || status.ViewportWidth != 1920 || status.FeedTransport != "eventsource" {
		t.Fatalf("POST status = %+v", status)
	}
	response, err = http.Get(server.URL + "/api/display-client")
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if !status.Seen || status.CurrentGame != "motion-levels-games:pong" {
		t.Fatalf("GET status = %+v", status)
	}
}

func TestDisplayClientAPIRejectsInvalidReport(t *testing.T) {
	runtime := &gameRuntime{current: config{Game: "motion-levels-games:pong"}}
	request := httptest.NewRequest(http.MethodPost, "/api/display-client", bytes.NewBufferString(`{"clientId":"other"}`))
	response := httptest.NewRecorder()
	gameAPIHandler(runtime).ServeHTTP(response, request)
	if response.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusBadRequest)
	}
}

func TestEngineHealthReportsMissingDisplayWithoutTakingEngineOffline(t *testing.T) {
	runtime := &gameRuntime{current: config{Game: "salvapantallas"}}
	request := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	response := httptest.NewRecorder()
	gameAPIHandler(runtime).ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}
	var payload struct {
		Status        string              `json:"status"`
		DisplayClient displayClientStatus `json:"displayClient"`
	}
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if payload.Status != "ok" || payload.DisplayClient.Seen || payload.DisplayClient.Healthy {
		t.Fatalf("health payload = %+v", payload)
	}
}
