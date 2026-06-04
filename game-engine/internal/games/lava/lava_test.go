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
		{difficulty: "easy", lives: 8},
		{difficulty: "medium", lives: 6},
		{difficulty: "hard", lives: 5},
		{difficulty: "expert", lives: 4},
		{difficulty: "unknown", lives: 8},
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
	if len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("events after lava hit = %+v, want miss", events)
	}
	if got := game.Snapshot(activeAt).Lives; got != 4 {
		t.Fatalf("lives after first hit = %d, want 4", got)
	}

	events = game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt.Add(500*time.Millisecond))
	if len(events) != 0 {
		t.Fatalf("events during immunity = %+v, want none", events)
	}
	if got := game.Snapshot(activeAt.Add(500 * time.Millisecond)).Lives; got != 4 {
		t.Fatalf("lives during immunity = %d, want 4", got)
	}

	_ = game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt.Add(1100*time.Millisecond))
	if got := game.Snapshot(activeAt.Add(1100 * time.Millisecond)).Lives; got != 3 {
		t.Fatalf("lives after immunity = %d, want 3", got)
	}
}

func TestSafePressScoresWithoutLosingLife(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "easy")
	activeAt := now.Add(countdownDuration)
	pt := firstSafeTile(activeAt, game)

	events := game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueCoin {
		t.Fatalf("events after safe press = %+v, want hit", events)
	}
	snapshot := game.Snapshot(activeAt)
	if snapshot.Lives != 8 {
		t.Fatalf("lives after safe press = %d, want 8", snapshot.Lives)
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

func TestEasyClaimsNeverSpreadAcrossConnectedPlatforms(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "easy")
	activeAt := now.Add(countdownDuration)

	for sample := 0; sample < 40; sample++ {
		at := activeAt.Add(time.Duration(sample) * 350 * time.Millisecond)
		pt := firstSafeTile(at, game)
		testGame := NewWithSeed(1, now, 1, "easy")
		platform, ok := testGame.platformAt(pt, testGame.patternSeconds(at))
		if !ok {
			t.Fatalf("sample %d safe tile has no platform", sample)
		}
		events := testGame.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, at)
		if len(events) != 1 || events[0].Cue != whackamole.CueCoin {
			t.Fatalf("sample %d claim events = %+v, want coin", sample, events)
		}
		seconds := testGame.patternSeconds(at)
		claimed := testGame.claimedMask(seconds)
		want := visiblePlatformArea(platform)
		if got := maskCount(claimed); got != want {
			t.Fatalf("sample %d claimed tiles = %d, want platform area %d", sample, got, want)
		}
		if safe := safeTileCount(testGame, seconds); maskCount(claimed) >= safe {
			t.Fatalf("sample %d claimed all safe tiles: claimed=%d safe=%d", sample, maskCount(claimed), safe)
		}
		assertMaskMatchesPlatform(t, claimed, platform)
	}
}

func TestEasyPlatformsDoNotTouch(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "easy")
	activeAt := now.Add(countdownDuration)

	for sample := 0; sample < 40; sample++ {
		at := activeAt.Add(time.Duration(sample) * 350 * time.Millisecond)
		platforms := game.visiblePlatforms(game.patternSeconds(at))
		for i := 0; i < len(platforms); i++ {
			for j := i + 1; j < len(platforms); j++ {
				if platformsTouch(platforms[i], platforms[j]) {
					t.Fatalf("sample %d platforms touch: %+v %+v", sample, platforms[i], platforms[j])
				}
			}
		}
	}
}

func TestClaimedPlatformDoesNotJumpAfterLeavingBoard(t *testing.T) {
	now := time.Unix(0, 0)
	game := NewWithSeed(1, now, 1, "easy")
	activeAt := now.Add(countdownDuration)
	pt := firstSafeTileLeavingBoard(activeAt, activeAt.Add(2*time.Minute), game)

	events := game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, activeAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueCoin {
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
	if got := game.Snapshot(now).Lives; got != 5 {
		t.Fatalf("countdown lives = %d, want 5", got)
	}
	if game.patternSeconds(now) != game.patternSeconds(now.Add(time.Second)) {
		t.Fatal("pattern moved during countdown")
	}
}

func TestDifficultyCurveMakesEasySlowerAndSafer(t *testing.T) {
	now := time.Unix(0, 0)
	easy := NewWithSeed(1, now, 1, "easy")
	medium := NewWithSeed(1, now, 1, "medium")
	hard := NewWithSeed(1, now, 1, "hard")
	expert := NewWithSeed(1, now, 1, "expert")

	if !(easy.speed < medium.speed && medium.speed < hard.speed && hard.speed < expert.speed) {
		t.Fatalf("speeds = easy %.2f medium %.2f hard %.2f expert %.2f, want ascending", easy.speed, medium.speed, hard.speed, expert.speed)
	}
	if expert.speed >= 0.72 {
		t.Fatalf("expert speed = %.2f, should still be slower than previous easy mode", expert.speed)
	}

	activeAt := now.Add(countdownDuration)
	easySafe := safeTileCount(easy, easy.patternSeconds(activeAt))
	mediumSafe := safeTileCount(medium, medium.patternSeconds(activeAt))
	hardSafe := safeTileCount(hard, hard.patternSeconds(activeAt))
	expertSafe := safeTileCount(expert, expert.patternSeconds(activeAt))
	if !(easySafe > mediumSafe && mediumSafe > hardSafe && hardSafe > expertSafe) {
		t.Fatalf("safe counts = easy %d medium %d hard %d expert %d, want descending", easySafe, mediumSafe, hardSafe, expertSafe)
	}
	if largestSafePlatform(easy, activeAt) <= largestSafePlatform(expert, activeAt) {
		t.Fatalf("easy largest platform = %d, expert = %d; want easy larger", largestSafePlatform(easy, activeAt), largestSafePlatform(expert, activeAt))
	}
}

func firstLavaTile(now time.Time, game *Game) Point {
	seconds := game.patternSeconds(now)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			if game.lavaAt(pt, seconds) {
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
			if !game.lavaAt(pt, seconds) {
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
			platform, ok := game.platformAt(pt, seconds)
			if !ok {
				continue
			}
			claim := newClaimedPlatform(platform)
			if _, ok := claim.currentPlatform(laterSeconds); !ok {
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
			if mask[pointIndex(pt)] && !game.lavaAt(pt, seconds) {
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
			if !mask[pointIndex(pt)] && !game.lavaAt(pt, seconds) {
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

func safeTileCount(game *Game, seconds float64) int {
	count := 0
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if !game.lavaAt(Point{X: x, Y: y}, seconds) {
				count++
			}
		}
	}
	return count
}

func visiblePlatformArea(platform movingPlatform) int {
	count := 0
	for y := platform.y; y < platform.y+platform.height; y++ {
		for x := platform.x; x < platform.x+platform.width; x++ {
			if inBounds(x, y) {
				count++
			}
		}
	}
	return count
}

func assertMaskMatchesPlatform(t *testing.T, mask []bool, platform movingPlatform) {
	t.Helper()
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			want := pointInPlatform(pt, platform)
			if got := mask[pointIndex(pt)]; got != want {
				t.Fatalf("claimed mask at %v = %v, want %v for platform %+v", pt, got, want, platform)
			}
		}
	}
}

func platformsTouch(left movingPlatform, right movingPlatform) bool {
	leftMinX := left.x - 1
	leftMaxX := left.x + left.width
	leftMinY := left.y - 1
	leftMaxY := left.y + left.height
	rightMinX := right.x
	rightMaxX := right.x + right.width - 1
	rightMinY := right.y
	rightMaxY := right.y + right.height - 1
	return leftMinX <= rightMaxX && leftMaxX >= rightMinX && leftMinY <= rightMaxY && leftMaxY >= rightMinY
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

func largestSafePlatform(game *Game, now time.Time) int {
	seconds := game.patternSeconds(now)
	seen := make([]bool, GridWidth*GridHeight)
	best := 0
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			index := pointIndex(pt)
			if seen[index] || game.lavaAt(pt, seconds) {
				continue
			}
			count := 0
			queue := []Point{pt}
			seen[index] = true
			for len(queue) > 0 {
				current := queue[0]
				queue = queue[1:]
				count++
				for _, next := range neighbors(current) {
					nextIndex := pointIndex(next)
					if seen[nextIndex] || game.lavaAt(next, seconds) {
						continue
					}
					seen[nextIndex] = true
					queue = append(queue, next)
				}
			}
			if count > best {
				best = count
			}
		}
	}
	return best
}
