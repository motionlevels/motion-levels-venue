package authored

import (
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestNativeTetrisRunsWithoutWASMArtifact(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	game, err := NewNativeWithSeed(start, 7, CatalogEntry{
		EngineGame: "authored-tetris",
		Label:      "Tetris",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}, 1, nil, "medium", "")
	if err != nil {
		t.Fatal(err)
	}
	if game.RuntimeKind() != "native" {
		t.Fatalf("runtime = %q, want native", game.RuntimeKind())
	}
	frame := game.Render(start.Add(2 * time.Second))
	if len(frame) != GridWidth*GridHeight {
		t.Fatalf("frame len = %d, want %d", len(frame), GridWidth*GridHeight)
	}
	snapshot := game.Snapshot(start.Add(2 * time.Second))
	if snapshot.Phase == "" || len(snapshot.Players) != 1 {
		t.Fatalf("snapshot = %+v", snapshot)
	}
}

func TestNativePingPongRunsWithoutWASMArtifact(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	game, err := NewNativeWithSeed(start, 7, CatalogEntry{
		EngineGame: "authored-ping-pong-motion",
		Label:      "Ping Pong Motion",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}, 2, nil, "medium", "")
	if err != nil {
		t.Fatal(err)
	}
	frame := game.Render(start.Add(2 * time.Second))
	if len(frame) != GridWidth*GridHeight {
		t.Fatalf("frame len = %d, want %d", len(frame), GridWidth*GridHeight)
	}
	snapshot := game.Snapshot(start.Add(2 * time.Second))
	if snapshot.Phase == "" || len(snapshot.Players) != 2 {
		t.Fatalf("snapshot = %+v", snapshot)
	}
}

func TestNativeMemoryChallengeRunsWithoutWASMArtifact(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	game, err := NewNativeWithSeed(start, 7, CatalogEntry{
		EngineGame: "authored-memory-challenge",
		Label:      "Reto de memoria",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}, 4, nil, "medium", "")
	if err != nil {
		t.Fatal(err)
	}
	frame := game.Render(start.Add(2 * time.Second))
	if len(frame) != GridWidth*GridHeight {
		t.Fatalf("frame len = %d, want %d", len(frame), GridWidth*GridHeight)
	}
	snapshot := game.Snapshot(start.Add(2 * time.Second))
	if snapshot.Phase == "" || len(snapshot.Players) != 4 || snapshot.ActiveTargets == 0 {
		t.Fatalf("snapshot = %+v", snapshot)
	}
	if !HasNative("authored-memory-challenge") {
		t.Fatal("memory challenge should be registered as a native authored game")
	}
}

func TestNativeDuelDifficultyControlsFloorFill(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	entry := CatalogEntry{
		EngineGame: "authored-duel",
		Label:      "Duelo",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}
	medium, err := NewNativeWithSeed(start, 7, entry, 4, nil, "medium", "")
	if err != nil {
		t.Fatal(err)
	}
	mediumSnapshot := medium.Snapshot(start)
	mediumFrame := medium.Render(start)
	hard, err := NewNativeWithSeed(start, 7, entry, 4, nil, "hard", "")
	if err != nil {
		t.Fatal(err)
	}
	hardSnapshot := hard.Snapshot(start)
	if mediumSnapshot.ActiveTargets != 307 {
		t.Fatalf("medium active targets = %d, want 307", mediumSnapshot.ActiveTargets)
	}
	if hardSnapshot.ActiveTargets != 461 {
		t.Fatalf("hard active targets = %d, want 461", hardSnapshot.ActiveTargets)
	}
	if len(mediumFrame) != GridWidth*GridHeight {
		t.Fatalf("medium frame has wrong size")
	}
	if !HasNative("authored-duel") {
		t.Fatal("duel should be registered as a native authored game")
	}
}

func TestNativeLavaRunsWithLivesAndDamage(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	entry := CatalogEntry{
		EngineGame: "authored-lava",
		Label:      "El suelo es lava",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}
	game, err := NewNativeWithSeed(start, 7, entry, 3, nil, "hard", "")
	if err != nil {
		t.Fatal(err)
	}
	if !HasNative("authored-lava") {
		t.Fatal("lava should be registered as a native authored game")
	}
	activeAt := start.Add(3 * time.Second)
	snapshot := game.Snapshot(activeAt)
	if snapshot.Phase != "running" || snapshot.Lives != 5 || len(snapshot.Players) != 3 {
		t.Fatalf("snapshot = %+v, want running hard lava with 5 lives and 3 players", snapshot)
	}
	frame := game.Render(activeAt)
	if len(frame) != GridWidth*GridHeight {
		t.Fatalf("frame len = %d, want %d", len(frame), GridWidth*GridHeight)
	}
	x, y := firstNativeLavaTile(t, frame)
	events := game.Press(pressEvent(x, y, true), activeAt)
	if len(events) != 1 || events[0].Cue != "damage" {
		t.Fatalf("lava press events = %+v, want damage", events)
	}
	if got := game.Snapshot(activeAt).Lives; got != 4 {
		t.Fatalf("lives after lava press = %d, want 4", got)
	}
}

func TestNativeSaltosAndPatronesRunWithSelectedLevels(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	for _, tc := range []struct {
		id      string
		label   string
		players int
		level   string
	}{
		{id: "authored-saltos", label: "Saltos", players: 1, level: "classic"},
		{id: "authored-patrones", label: "Patrones", players: 4, level: "level-3"},
	} {
		game, err := NewNativeWithSeed(start, 7, CatalogEntry{
			EngineGame: tc.id,
			Label:      tc.label,
			GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
		}, tc.players, nil, "hard", tc.level)
		if err != nil {
			t.Fatalf("%s init: %v", tc.id, err)
		}
		if !HasNative(tc.id) {
			t.Fatalf("%s should be registered as a native authored game", tc.id)
		}
		frame := game.Render(start.Add(4 * time.Second))
		if len(frame) != GridWidth*GridHeight {
			t.Fatalf("%s frame len = %d, want %d", tc.id, len(frame), GridWidth*GridHeight)
		}
		snapshot := game.Snapshot(start.Add(4 * time.Second))
		if snapshot.Phase == "" || len(snapshot.Players) != tc.players {
			t.Fatalf("%s snapshot = %+v", tc.id, snapshot)
		}
	}
}

func TestNativeUnknownGameErrors(t *testing.T) {
	_, err := NewNativeWithSeed(time.Now(), 1, CatalogEntry{
		EngineGame: "authored-unknown",
		Label:      "Unknown",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}, 1, nil, "medium", "")
	if err == nil {
		t.Fatal("expected unknown native game to fail")
	}
}

func firstNativeLavaTile(t *testing.T, frame []RGB) (int, int) {
	t.Helper()
	for index, color := range frame {
		if color.R > 120 && color.G > 15 && color.B < 40 {
			return index % GridWidth, index / GridWidth
		}
	}
	t.Fatalf("no lava-colored tile found in frame")
	return 0, 0
}

func pressEvent(x int, y int, pressed bool) whackamole.PressEvent {
	return whackamole.PressEvent{X: x, Y: y, Pressed: pressed}
}
