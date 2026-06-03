package parkour

import (
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestLevelSettingsNormalize(t *testing.T) {
	if NormalizeLevel("") != "starter" {
		t.Fatalf("empty level should use starter")
	}
	if NormalizeLevel("2") != "classic" {
		t.Fatalf("2 should map to classic")
	}
	if settingsForLevel("expert").StepDelay >= settingsForLevel("starter").StepDelay {
		t.Fatalf("expert should move faster than starter")
	}
}

func TestTargetKeepsConfiguredGap(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 42, "classic")
	gap := platformGapTiles(game.current, game.target)
	if gap != 4 {
		t.Fatalf("gap = %d, want 4", gap)
	}
}

func TestVisualTargetTravels(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 42, "classic")
	start := game.Target(now.Add(countdownDuration))
	mid := game.Target(now.Add(countdownDuration + settingsForLevel("classic").StepDelay))
	if start == game.target {
		t.Fatalf("target should start from lead origin before reaching final target")
	}
	if mid == start {
		t.Fatalf("target should move after one step")
	}
}

func TestLandingScoresAndMovesCurrent(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 42, "classic")
	playAt := game.targetReadyAt.Add(10 * time.Millisecond)
	target := game.Target(playAt)

	events := game.Press(whackamole.PressEvent{X: target.X, Y: target.Y, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueHit {
		t.Fatalf("events = %+v, want hit", events)
	}
	if game.Snapshot(playAt).Score != 1 {
		t.Fatalf("score = %d, want 1", game.Snapshot(playAt).Score)
	}
	if current := game.Current(); current != target {
		t.Fatalf("current = %+v, want %+v", current, target)
	}
}

func TestLavaPressFails(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 42, "classic")
	playAt := now.Add(countdownDuration + time.Second)
	events := game.Press(whackamole.PressEvent{X: 1, Y: GridHeight - 2, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueMiss {
		t.Fatalf("events = %+v, want miss", events)
	}
	if snapshot := game.Snapshot(playAt); snapshot.Phase != "finished" || snapshot.Lives != 0 {
		t.Fatalf("snapshot = %+v, want finished with no lives", snapshot)
	}
}
