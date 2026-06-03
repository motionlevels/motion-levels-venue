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
	if snapshot.Score != 1 {
		t.Fatalf("score after first platform = %d, want 1", snapshot.Score)
	}

	claimed := game.claimedMask(game.patternSeconds(activeAt.Add(10 * time.Millisecond)))
	repeatedPt := firstSafeTileInMask(claimed, activeAt.Add(10*time.Millisecond), game)
	events = game.Press(whackamole.PressEvent{X: repeatedPt.X, Y: repeatedPt.Y, Pressed: true}, activeAt.Add(10*time.Millisecond))
	if len(events) != 0 {
		t.Fatalf("events after repeated platform = %+v, want none", events)
	}
	if got := game.Snapshot(activeAt.Add(10 * time.Millisecond)).Score; got != 1 {
		t.Fatalf("score after repeated platform = %d, want 1", got)
	}

	claimed = game.claimedMask(game.patternSeconds(activeAt.Add(20 * time.Millisecond)))
	nextPt := firstSafeTileOutsideMask(claimed, activeAt.Add(20*time.Millisecond), game)
	_ = game.Press(whackamole.PressEvent{X: nextPt.X, Y: nextPt.Y, Pressed: true}, activeAt.Add(20*time.Millisecond))
	if got := game.Snapshot(activeAt.Add(20 * time.Millisecond)).Score; got != 2 {
		t.Fatalf("score after second unique platform = %d, want 2", got)
	}
}

func TestLavaHasNoTimeLimitAndScoreDoesNotUseSurvivalTime(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "easy")
	activeAt := now.Add(countdownDuration)
	later := activeAt.Add(10 * time.Minute)

	snapshot := game.Snapshot(later)
	if snapshot.Phase != "running" {
		t.Fatalf("phase after long run = %q, want running", snapshot.Phase)
	}
	if snapshot.EndsUnix != 0 {
		t.Fatalf("ends unix = %d, want 0 for no time limit", snapshot.EndsUnix)
	}
	if snapshot.RemainingMillis != 0 {
		t.Fatalf("remaining millis = %d, want 0 for no time limit", snapshot.RemainingMillis)
	}
	if snapshot.Score != 0 {
		t.Fatalf("score after waiting = %d, want 0", snapshot.Score)
	}
}

func TestClaimedPlatformChangesColor(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "easy")
	activeAt := now.Add(countdownDuration)
	pt := firstSafeTile(activeAt, game)

	before := game.Render(activeAt)
	_ = game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt)
	after := game.Render(activeAt)
	claimed := game.claimedMask(game.patternSeconds(activeAt))

	changedTiles := 0
	for index, isClaimed := range claimed {
		if isClaimed && before[index] != after[index] {
			changedTiles++
		}
	}
	if changedTiles <= 1 {
		t.Fatalf("changed claimed tiles = %d, want whole platform", changedTiles)
	}

	later := activeAt.Add(2 * time.Second)
	movedClaimed := game.claimedMask(game.patternSeconds(later))
	if masksEqual(claimed, movedClaimed) {
		t.Fatal("claimed platform mask did not move with the animation")
	}
}

func TestClaimedPlatformDoesNotJumpAfterLeavingBoard(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "easy")
	activeAt := now.Add(countdownDuration)
	pt := firstSafeTileLeavingBoard(activeAt, activeAt.Add(2*time.Minute), game)

	events := game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueHit {
		t.Fatalf("events after claim = %+v, want hit", events)
	}

	laterSeconds := game.patternSeconds(activeAt.Add(2 * time.Minute))
	mask := game.claimedMask(laterSeconds)
	if got := maskCount(mask); got != 0 {
		t.Fatalf("claimed platform visible after leaving board = %d tiles, want 0", got)
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

func firstSafeTileLeavingBoard(now time.Time, later time.Time, game *Game) Point {
	seconds := game.patternSeconds(now)
	laterSeconds := game.patternSeconds(later)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			if lavaAt(pt, seconds) {
				continue
			}
			platform := newClaimedPlatform(pt, seconds)
			if _, ok := platform.currentSeed(laterSeconds); !ok {
				return pt
			}
		}
	}
	return firstSafeTile(now, game)
}

func firstSafeTileInMask(mask []bool, now time.Time, game *Game) Point {
	seconds := game.patternSeconds(now)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			if mask[pointIndex(pt)] && !lavaAt(pt, seconds) {
				return pt
			}
		}
	}
	return Point{}
}

func firstSafeTileOutsideMask(mask []bool, now time.Time, game *Game) Point {
	seconds := game.patternSeconds(now)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			if !mask[pointIndex(pt)] && !lavaAt(pt, seconds) {
				return pt
			}
		}
	}
	return Point{}
}

func maskCount(mask []bool) int {
	count := 0
	for _, value := range mask {
		if value {
			count++
		}
	}
	return count
}

func masksEqual(left, right []bool) bool {
	if len(left) != len(right) {
		return false
	}
	for index := range left {
		if left[index] != right[index] {
			return false
		}
	}
	return true
}
