package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"reflect"
	"testing"
	"time"
)

func TestPlayerExperienceSelectorsMatchCompatibilityFixture(t *testing.T) {
	data, err := os.ReadFile(filepath.Join("..", "..", "..", "test", "fixtures", "player-experience-selectors.json"))
	if err != nil {
		t.Fatal(err)
	}
	var fixture struct {
		Schema string `json:"schema"`
		Cases  []struct {
			Name         string   `json:"name"`
			Game         string   `json:"game"`
			Phase        string   `json:"phase"`
			Paused       bool     `json:"paused"`
			AudioEnabled bool     `json:"audioEnabled"`
			AudioMuted   bool     `json:"audioMuted"`
			Lifecycle    string   `json:"lifecycle"`
			Controls     []string `json:"controls"`
		} `json:"cases"`
	}
	if err := json.Unmarshal(data, &fixture); err != nil {
		t.Fatal(err)
	}
	if fixture.Schema != "motion-levels-player-experience-selectors-v1" {
		t.Fatalf("fixture schema = %q", fixture.Schema)
	}
	for _, entry := range fixture.Cases {
		t.Run(entry.Name, func(t *testing.T) {
			lifecycle := playerExperienceLifecycle(entry.Game, entry.Phase, entry.Paused)
			if lifecycle != entry.Lifecycle {
				t.Fatalf("lifecycle = %q, want %q", lifecycle, entry.Lifecycle)
			}
			controls := playerExperienceControls(lifecycle, entry.AudioEnabled, entry.AudioMuted)
			if !reflect.DeepEqual(controls, entry.Controls) {
				t.Fatalf("controls = %#v, want %#v", controls, entry.Controls)
			}
		})
	}
}

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
