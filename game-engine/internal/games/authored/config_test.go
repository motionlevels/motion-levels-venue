package authored

import (
	"encoding/json"
	"testing"
	"time"
)

func testConfigSpec() Spec {
	return Spec{
		Schema: "motion-go-v1",
		Kind:   "wasm",
		Config: &ConfigSpec{Vars: []ConfigVar{
			{Key: "points_to_win", Type: "int", Default: json.RawMessage("7"), Min: floatPtr(1), Max: floatPtr(21), PlayerFacing: true},
			{Key: "speed", Type: "float", Default: json.RawMessage("1.5"), Min: floatPtr(0.5), Max: floatPtr(3)},
			{Key: "sudden_death", Type: "bool", Default: json.RawMessage("false"), PlayerFacing: true},
			{Key: "mode", Type: "enum", Default: json.RawMessage(`"classic"`), Options: []ConfigOption{{Value: "classic"}, {Value: "turbo"}}},
		}},
	}
}

func TestResolveConfigDefaults(t *testing.T) {
	values := ResolveConfig(testConfigSpec(), nil)
	if got := string(values["points_to_win"]); got != "7" {
		t.Fatalf("points_to_win = %s, want 7", got)
	}
	if got := string(values["speed"]); got != "1.5" {
		t.Fatalf("speed = %s, want 1.5", got)
	}
	if got := string(values["sudden_death"]); got != "false" {
		t.Fatalf("sudden_death = %s, want false", got)
	}
	if got := string(values["mode"]); got != `"classic"` {
		t.Fatalf("mode = %s, want \"classic\"", got)
	}
}

func TestResolveConfigOverridesClampAndValidate(t *testing.T) {
	overrides := map[string]json.RawMessage{
		"points_to_win": json.RawMessage("99"),        // clamped to max
		"speed":         json.RawMessage(`"fast"`),    // wrong type, keeps default
		"sudden_death":  json.RawMessage("true"),      // valid override
		"mode":          json.RawMessage(`"hacked"`),  // not an option, keeps default
		"unknown":       json.RawMessage("123"),       // undeclared, dropped
		"":              json.RawMessage(`"ignored"`), // empty key
	}
	values := ResolveConfig(testConfigSpec(), overrides)
	if got := string(values["points_to_win"]); got != "21" {
		t.Fatalf("points_to_win = %s, want 21", got)
	}
	if got := string(values["speed"]); got != "1.5" {
		t.Fatalf("speed = %s, want default 1.5", got)
	}
	if got := string(values["sudden_death"]); got != "true" {
		t.Fatalf("sudden_death = %s, want true", got)
	}
	if got := string(values["mode"]); got != `"classic"` {
		t.Fatalf("mode = %s, want default \"classic\"", got)
	}
	if _, ok := values["unknown"]; ok {
		t.Fatal("undeclared override should be dropped")
	}
}

func TestResolveConfigIntRounding(t *testing.T) {
	spec := Spec{Config: &ConfigSpec{Vars: []ConfigVar{{Key: "count", Type: "int", Default: json.RawMessage("2")}}}}
	values := ResolveConfig(spec, map[string]json.RawMessage{"count": json.RawMessage("3.6")})
	if got := string(values["count"]); got != "4" {
		t.Fatalf("count = %s, want 4", got)
	}
}

func TestResolveConfigWithoutSpec(t *testing.T) {
	if values := ResolveConfig(Spec{}, map[string]json.RawMessage{"points_to_win": json.RawMessage("3")}); values != nil {
		t.Fatalf("values = %v, want nil without declared vars", values)
	}
}

func TestNativePingPongHonorsConfigOverrides(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	entry, ok := NativeCatalogEntry("authored-ping-pong-motion")
	if !ok {
		t.Fatal("missing native ping pong entry")
	}
	overrides := map[string]json.RawMessage{"points_to_win": json.RawMessage("3")}
	game, err := NewNativeWithSeedConfig(start, 7, entry, 2, nil, "medium", "", overrides)
	if err != nil {
		t.Fatal(err)
	}
	snapshot := game.Snapshot(start.Add(time.Second))
	if len(snapshot.Players) != 2 {
		t.Fatalf("players = %d, want 2", len(snapshot.Players))
	}
	// Ping pong reports Lives as points_to_win minus the rival score, so a
	// fresh match reflects the configured target directly.
	if snapshot.Players[0].Lives != 3 {
		t.Fatalf("player lives = %d, want 3 (points_to_win override)", snapshot.Players[0].Lives)
	}
}
