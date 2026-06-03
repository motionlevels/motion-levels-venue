package lava

import (
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestDifficultyControlsLives(t *testing.T) {
	now := time.Unix(0, 0)
	tests := []struct {
		difficulty string
		lives      int
	}{
		{difficulty: "easy", lives: 5},
		{difficulty: "medium", lives: 4},
		{difficulty: "hard", lives: 3},
		{difficulty: "expert", lives: 2},
		{difficulty: "unknown", lives: 5},
	}

	for _, tt := range tests {
		game := NewWithSeed(2, now, 1, tt.difficulty)
		if got := game.Snapshot(now).Lives; got != tt.lives {
			t.Fatalf("%s lives = %d, want %d", tt.difficulty, got, tt.lives)
		}
	}
}

func TestLavaHitLosesOneLifeThenGrantsGlobalImmunity(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "hard")
	activeAt := now.Add(countdownDuration)
	pt := firstLavaTile(activeAt, game)

	events := game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueMiss {
		t.Fatalf("events after lava hit = %+v, want miss", events)
	}
	if got := game.Snapshot(activeAt).Lives; got != 2 {
		t.Fatalf("lives after first hit = %d, want 2", got)
	}

	events = game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt.Add(500*time.Millisecond))
	if len(events) != 0 {
		t.Fatalf("events during immunity = %+v, want none", events)
	}
	if got := game.Snapshot(activeAt.Add(500 * time.Millisecond)).Lives; got != 2 {
		t.Fatalf("lives during immunity = %d, want 2", got)
	}

	_ = game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt.Add(1100*time.Millisecond))
	if got := game.Snapshot(activeAt.Add(1100 * time.Millisecond)).Lives; got != 1 {
		t.Fatalf("lives after immunity = %d, want 1", got)
	}
}

func TestSafePressScoresWithoutLosingLife(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "easy")
	activeAt := now.Add(countdownDuration)
	pt := firstSafeTile(activeAt, game)

	events := game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueHit {
		t.Fatalf("events after safe press = %+v, want hit", events)
	}
	snapshot := game.Snapshot(activeAt)
	if snapshot.Lives != 5 {
		t.Fatalf("lives after safe press = %d, want 5", snapshot.Lives)
	}
	if snapshot.Score <= 0 {
		t.Fatalf("score after safe press = %d, want positive", snapshot.Score)
	}
}

func TestCountdownIsSafeAndFrozen(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "hard")
	pt := firstLavaTile(now, game)

	if phase := game.Snapshot(now).Phase; phase != "countdown" {
		t.Fatalf("phase = %q, want countdown", phase)
	}
	events := game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, now)
	if len(events) != 0 {
		t.Fatalf("countdown events = %+v, want none", events)
	}
	if got := game.Snapshot(now).Lives; got != 3 {
		t.Fatalf("countdown lives = %d, want 3", got)
	}
	if game.patternSeconds(now) != game.patternSeconds(now.Add(time.Second)) {
		t.Fatal("pattern moved during countdown")
	}
}

func firstLavaTile(now time.Time, game *Game) Point {
	seconds := game.patternSeconds(now)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			if lavaAt(pt, seconds) {
				return pt
			}
		}
	}
	return Point{}
}

func firstSafeTile(now time.Time, game *Game) Point {
	seconds := game.patternSeconds(now)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			if !lavaAt(pt, seconds) {
				return pt
			}
		}
	}
	return Point{}
}
