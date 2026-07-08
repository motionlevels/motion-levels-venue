package authored

import (
	"encoding/json"
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

func TestNativePingPongV2ReadinessPlayfieldAndAutoReset(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	entry, ok := NativeCatalogEntry("authored-ping-pong-v2")
	if !ok {
		t.Fatal("missing native ping pong v2 entry")
	}
	game, err := NewNativeWithSeedConfig(start, 7, entry, 2, nil, "hard", "", map[string]json.RawMessage{
		"points_to_win": json.RawMessage("1"),
	})
	if err != nil {
		t.Fatal(err)
	}
	if !HasNative("authored-ping-pong-v2") {
		t.Fatal("ping pong v2 should be registered as a native authored game")
	}
	if snapshot := game.Snapshot(start); snapshot.Phase != "waiting" || snapshot.ActiveTargets != 0 {
		t.Fatalf("initial snapshot = %+v, want waiting with no ready halves", snapshot)
	}

	firstHalfTime := start.Add(100 * time.Millisecond)
	if events := game.Press(pressEvent(0, 4, true), firstHalfTime); len(events) != 0 {
		t.Fatalf("first half press events = %+v, want none", events)
	}
	if snapshot := game.Snapshot(firstHalfTime); snapshot.Phase != "waiting" || snapshot.ActiveTargets != 1 {
		t.Fatalf("one-half snapshot = %+v, want waiting with one ready half", snapshot)
	}

	bothHalvesTime := start.Add(200 * time.Millisecond)
	if events := game.Press(pressEvent(0, 4, false), bothHalvesTime); len(events) != 0 {
		t.Fatalf("first half release events = %+v, want none", events)
	}
	events := game.Press(pressEvent(0, GridHeight-5, true), bothHalvesTime.Add(500*time.Millisecond))
	if len(events) != 1 || events[0].Cue != "start" {
		t.Fatalf("second half press events = %+v, want start cue", events)
	}
	if events := game.Press(pressEvent(0, GridHeight-5, false), bothHalvesTime.Add(600*time.Millisecond)); len(events) != 0 {
		t.Fatalf("second half release events = %+v, want none after start animation begins", events)
	}
	if snapshot := game.Snapshot(bothHalvesTime.Add(1100 * time.Millisecond)); snapshot.Phase != "starting" || snapshot.CountdownMillis == 0 {
		t.Fatalf("ready animation snapshot = %+v, want starting countdown", snapshot)
	}

	runningAt := bothHalvesTime.Add(2800 * time.Millisecond)
	snapshot := game.Snapshot(runningAt)
	if snapshot.Phase != "running" || snapshot.Players[0].Lives != 1 || snapshot.Players[1].Lives != 1 {
		t.Fatalf("running snapshot = %+v, want one-point game running", snapshot)
	}
	frame := game.Render(runningAt)
	if len(frame) != GridWidth*GridHeight {
		t.Fatalf("frame len = %d, want %d", len(frame), GridWidth*GridHeight)
	}
	if white := countRGB(frame, RGB{R: 255, G: 255, B: 255}); white != 1 {
		t.Fatalf("white pixels = %d, want exactly one visible ball", white)
	}
	if black := countRGB(frame, RGB{}); black < GridWidth*GridHeight/2 {
		t.Fatalf("black/off pixels = %d, want black background dominant", black)
	}

	finishedAt := time.Time{}
	for tickAt := runningAt.Add(100 * time.Millisecond); tickAt.Before(runningAt.Add(20 * time.Second)); tickAt = tickAt.Add(100 * time.Millisecond) {
		game.Tick(tickAt)
		if snapshot := game.Snapshot(tickAt); snapshot.Phase == "finished" {
			finishedAt = tickAt
			break
		}
	}
	if finishedAt.IsZero() {
		t.Fatal("ping pong v2 did not finish after a one-point score window")
	}
	if snapshot := game.Snapshot(finishedAt.Add(4 * time.Second)); snapshot.Phase != "waiting" || snapshot.Score != 0 {
		t.Fatalf("reset snapshot = %+v, want automatic reset to waiting with zero score", snapshot)
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

func TestNativeDuelFullMatchFlow(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	entry := CatalogEntry{
		EngineGame: "authored-duel",
		Label:      "Duelo",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}
	game, err := NewNativeWithSeed(start, 7, entry, 2, nil, "medium", "")
	if err != nil {
		t.Fatal(err)
	}

	initDrained := game.DrainEvents()
	if len(initDrained) != 1 || initDrained[0].Cue != "ready" {
		t.Fatalf("init events = %+v, want single ready event", initDrained)
	}
	if drained := game.DrainEvents(); len(drained) != 0 {
		t.Fatalf("second drain = %+v, want empty", drained)
	}
	if phase := game.Snapshot(start).Phase; phase != "ready" {
		t.Fatalf("phase before pads = %q, want ready", phase)
	}

	// Two players: pads sit at the left/right middle rows. Occupying both
	// starts the countdown and emits the start cue.
	padTime := start.Add(time.Second)
	if events := game.Press(pressEvent(0, (GridHeight-4)/2, true), padTime); len(events) != 0 {
		t.Fatalf("first pad press events = %+v, want none", events)
	}
	events := game.Press(pressEvent(GridWidth-1, (GridHeight-4)/2, true), padTime)
	if len(events) != 1 || events[0].Cue != "start" {
		t.Fatalf("second pad press events = %+v, want start", events)
	}
	countdown := game.Snapshot(padTime.Add(time.Second))
	if countdown.Phase != "countdown" || countdown.CountdownMillis <= 0 {
		t.Fatalf("countdown snapshot = %+v", countdown)
	}

	// Claim every tile after the countdown; the first player to finish their
	// zone wins and the win cue fires exactly once.
	runTime := padTime.Add(4 * time.Second)
	if phase := game.Snapshot(runTime).Phase; phase != "running" {
		t.Fatalf("phase after countdown = %q, want running", phase)
	}
	winEvents := 0
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			for _, event := range game.Press(pressEvent(x, y, true), runTime) {
				if event.Cue == "win" {
					winEvents++
				}
			}
		}
	}
	if winEvents != 1 {
		t.Fatalf("win events = %d, want 1", winEvents)
	}
	final := game.Snapshot(runTime.Add(time.Second))
	if final.Phase != "finished" || !final.Success {
		t.Fatalf("final snapshot = %+v, want finished success", final)
	}
	frame := game.Render(runTime.Add(time.Second))
	if len(frame) != GridWidth*GridHeight {
		t.Fatalf("winner frame len = %d", len(frame))
	}
	lit := 0
	for _, color := range frame {
		if int(color.R)+int(color.G)+int(color.B) > 60 {
			lit++
		}
	}
	if lit < GridWidth*GridHeight/2 {
		t.Fatalf("winner animation lights %d tiles, want a full-floor celebration", lit)
	}
}

func TestNativeDuelSupportsEightPlayers(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	entry := CatalogEntry{
		EngineGame: "authored-duel",
		Label:      "Duelo",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}
	game, err := NewNativeWithSeed(start, 7, entry, 8, nil, "hard", "")
	if err != nil {
		t.Fatal(err)
	}
	snapshot := game.Snapshot(start)
	if len(snapshot.Players) != 8 {
		t.Fatalf("players = %d, want 8", len(snapshot.Players))
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

func countRGB(frame []RGB, want RGB) int {
	total := 0
	for _, color := range frame {
		if color == want {
			total++
		}
	}
	return total
}

func pressEvent(x int, y int, pressed bool) whackamole.PressEvent {
	return whackamole.PressEvent{X: x, Y: y, Pressed: pressed}
}
