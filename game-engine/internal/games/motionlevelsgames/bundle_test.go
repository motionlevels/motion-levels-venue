package motionlevelsgames

import (
	"os/exec"
	"path/filepath"
	"runtime"
	"testing"
	"time"
)

func TestPinnedBundleVerifiesAndListsProductionGames(t *testing.T) {
	_, currentFile, _, _ := runtime.Caller(0)
	vendorRoot := filepath.Clean(filepath.Join(filepath.Dir(currentFile), "../../../../game-bundles/motion-levels-games"))
	bundle, err := Load(vendorRoot)
	if err != nil {
		t.Fatal(err)
	}
	if len(bundle.Manifest.SourceRevision) != 40 {
		t.Fatalf("revision = %q", bundle.Manifest.SourceRevision)
	}
	if !contains(bundle.Manifest.Runtime.Games, "ping-pong") || !contains(bundle.Manifest.Runtime.Games, "arkanoid") {
		t.Fatalf("production games = %v", bundle.Manifest.Runtime.Games)
	}
}

func TestPinnedRunnerStartsAndReturnsFrame(t *testing.T) {
	node, err := exec.LookPath("node")
	if err != nil {
		t.Skip("node is not installed")
	}
	_, currentFile, _, _ := runtime.Caller(0)
	vendorRoot := filepath.Clean(filepath.Join(filepath.Dir(currentFile), "../../../../game-bundles/motion-levels-games"))
	bundle, err := Load(vendorRoot)
	if err != nil {
		t.Fatal(err)
	}
	game, err := New(vendorRoot, Config{
		GameID: "ping-pong", ExpectedRevision: bundle.Manifest.SourceRevision,
		Seed: 137, PlayerCount: 0, Difficulty: "medium", NodeBinary: node,
	})
	if err != nil {
		t.Fatal(err)
	}
	defer game.Close()
	frame := game.Render(time.Now().Add(20 * time.Millisecond))
	if len(frame) != 16*32 {
		t.Fatalf("frame length = %d", len(frame))
	}
	if snapshot := game.Snapshot(); snapshot.CurrentGame != "ping-pong" || snapshot.PlayerCount != 0 {
		t.Fatalf("snapshot = %+v", snapshot)
	}
}
