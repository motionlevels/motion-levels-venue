package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestPlayerStateIsCanonicalAndMonotonic(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "authored-lava"}, nil, nil)
	now := time.Now().Truncate(20 * time.Millisecond)
	first := runtime.PlayerState(now)
	sameTick := runtime.PlayerState(now.Add(time.Millisecond))
	second := runtime.PlayerState(now.Add(20 * time.Millisecond))

	if first["contractVersion"] != 1 || first["lifecycle"] == "" {
		t.Fatalf("canonical metadata = %#v", first)
	}
	if first["currentGame"] != second["currentGame"] || first["runId"] == "" {
		t.Fatalf("runtime identity drifted: %#v %#v", first, second)
	}
	firstRevision, ok := first["revision"].(uint64)
	if !ok {
		t.Fatalf("revision type = %T", first["revision"])
	}
	secondRevision := second["revision"].(uint64)
	if sameTick["revision"] != first["revision"] {
		t.Fatalf("read created a competing revision: %#v %#v", first, sameTick)
	}
	if secondRevision <= firstRevision {
		t.Fatalf("revision %d did not advance beyond %d", secondRevision, firstRevision)
	}
	for _, required := range []string{"players", "score", "lives", "remainingMillis", "activeTargets", "catalog", "allowedControls"} {
		if _, ok := first[required]; !ok {
			t.Fatalf("canonical state omitted %s", required)
		}
	}
}

func TestPlayerCommandsAreSerializedAndIdempotent(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "authored-lava"}, nil, nil)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	payload := []byte(`{"action":"pause","commandId":"d0482251-482b-4260-9bbb-3f93fca8cead"}`)
	post := func() map[string]any {
		response, err := http.Post(server.URL+"/api/control", "application/json", bytes.NewReader(payload))
		if err != nil {
			t.Fatal(err)
		}
		defer response.Body.Close()
		if response.StatusCode != http.StatusOK {
			t.Fatalf("status = %d", response.StatusCode)
		}
		var state map[string]any
		if err := json.NewDecoder(response.Body).Decode(&state); err != nil {
			t.Fatal(err)
		}
		return state
	}

	first := post()
	second := post()
	if first["revision"] != second["revision"] || first["runId"] != second["runId"] {
		t.Fatalf("duplicate command was executed twice: %#v %#v", first, second)
	}
	if first["lifecycle"] != "paused" {
		t.Fatalf("pause result lifecycle = %v", first["lifecycle"])
	}
}

func TestPlayerStateEndpointSupersedesLegacyViews(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "salvapantallas"}, nil, nil)
	request := httptest.NewRequest(http.MethodGet, "/api/player-state", nil)
	response := httptest.NewRecorder()
	gameAPIHandler(runtime).ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("status = %d", response.Code)
	}
	var state map[string]any
	if err := json.Unmarshal(response.Body.Bytes(), &state); err != nil {
		t.Fatal(err)
	}
	if state["lifecycle"] != "idle" || state["contractVersion"] != float64(1) {
		t.Fatalf("state = %#v", state)
	}
}
