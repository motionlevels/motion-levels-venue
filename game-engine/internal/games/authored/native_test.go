package authored

import (
	"testing"
	"time"
)

func TestNativeTetrisRunsWithoutWASMArtifact(t *testing.T) {
	start := time.Unix(1_700_000_000, 0)
	game, err := NewNativeWithSeed(start, 7, CatalogEntry{
		EngineGame: "authored-tetris",
		Label:      "Tetris",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}, 1, nil, "medium")
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
	}, 2, nil, "medium")
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

func TestNativeUnknownGameErrors(t *testing.T) {
	_, err := NewNativeWithSeed(time.Now(), 1, CatalogEntry{
		EngineGame: "authored-unknown",
		Label:      "Unknown",
		GameSource: Spec{Schema: "motion-go-v1", Kind: "wasm", Version: 1},
	}, 1, nil, "medium")
	if err == nil {
		t.Fatal("expected unknown native game to fail")
	}
}
