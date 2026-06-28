package temporada1

import (
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestLoadsAllSeasonLevels(t *testing.T) {
	levels := Levels()
	if len(levels) != 24 {
		t.Fatalf("levels = %d, want 24", len(levels))
	}
	if NormalizeLevel("24") != "level-24" {
		t.Fatalf("NormalizeLevel(24) = %q, want level-24", NormalizeLevel("24"))
	}
}

func TestDifficultyAliases(t *testing.T) {
	if NormalizeDifficulty("oficial") != DifficultyMedium {
		t.Fatalf("oficial should map to medium")
	}
	if NormalizeDifficulty("experto") != DifficultyExpert {
		t.Fatalf("experto should map to expert")
	}
}

func TestPressingScoreTileAddsScore(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 2, "easy", "level-1")
	playAt := now.Add(countdownDuration + tickDuration)
	game.tickLocked(playAt)

	var scorePoint Point
	found := false
	frame := game.frameAtLocked(playAt)
	for y := 0; y < GridHeight && !found; y++ {
		for x := 0; x < GridWidth && !found; x++ {
			if frame.points[y][x].kind == 1 {
				scorePoint = Point{X: x, Y: y}
				found = true
			}
		}
	}
	if !found {
		t.Fatal("level 1 has no score tile")
	}

	events := game.Press(whackamole.PressEvent{X: scorePoint.X, Y: scorePoint.Y, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueCoin {
		t.Fatalf("events = %+v, want hit", events)
	}
	if got := game.Snapshot(playAt).Score; got != 1 {
		t.Fatalf("score = %d, want 1", got)
	}
}

func TestHazardDamageCanEndLevel(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 1, "hard", "level-1")
	playAt := now.Add(countdownDuration + tickDuration)
	game.lives = 1
	game.tickLocked(playAt)

	var hazard Point
	found := false
	frame := game.frameAtLocked(playAt)
	for y := 0; y < GridHeight && !found; y++ {
		for x := 0; x < GridWidth && !found; x++ {
			if frame.points[y][x].kind == 2 {
				hazard = Point{X: x, Y: y}
				found = true
			}
		}
	}
	if !found {
		t.Fatal("level 1 has no hazard tile")
	}

	events := game.Press(whackamole.PressEvent{X: hazard.X, Y: hazard.Y, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("events = %+v, want miss", events)
	}
	if snapshot := game.Snapshot(playAt); snapshot.Phase != "finished" || snapshot.Success {
		t.Fatalf("snapshot = %+v, want failed finish", snapshot)
	}
}

func TestHazardDamageCooldownLastsThreeSeconds(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 1, "hard", "level-1")
	playAt := now.Add(countdownDuration + tickDuration)
	game.lives = 3

	if !game.damageLocked(Point{}, playAt) {
		t.Fatal("first hazard damage should apply")
	}
	if got := game.lives; got != 2 {
		t.Fatalf("lives after first damage = %d, want 2", got)
	}
	if game.damageLocked(Point{}, playAt.Add(2*time.Second)) {
		t.Fatal("hazard damage reapplied before 3 second cooldown")
	}
	if got := game.lives; got != 2 {
		t.Fatalf("lives during cooldown = %d, want 2", got)
	}
	if !game.damageLocked(Point{}, playAt.Add(3*time.Second)) {
		t.Fatal("hazard damage should reapply after 3 seconds")
	}
	if got := game.lives; got != 1 {
		t.Fatalf("lives after cooldown = %d, want 1", got)
	}
}

func TestMovingHazardUnderPressedTileQueuesDamageCue(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 1, "hard", "level-1")
	game.lives = 3
	playAt := now.Add(countdownDuration + tickDuration)
	hazardAt := playAt.Add(time.Second)

	safeFrame := game.frameAtLocked(playAt)
	hazardFrame := game.frameAtLocked(hazardAt)
	var target Point
	found := false
	for y := 0; y < GridHeight && !found; y++ {
		for x := 0; x < GridWidth && !found; x++ {
			if safeFrame.points[y][x].kind != 2 && hazardFrame.points[y][x].kind == 2 {
				target = Point{X: x, Y: y}
				found = true
			}
		}
	}
	if !found {
		t.Fatal("level 1 has no moving hazard crossing a safe tile")
	}

	if events := game.Press(whackamole.PressEvent{X: target.X, Y: target.Y, Pressed: true}, playAt); len(events) != 0 {
		t.Fatalf("initial events = %+v, want none before hazard arrives", events)
	}
	game.Render(hazardAt)
	events := game.DrainEvents()
	if len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("drained events = %+v, want damage cue", events)
	}
	if got := game.Snapshot(hazardAt).Lives; got != 2 {
		t.Fatalf("lives = %d, want 2", got)
	}
	if events := game.DrainEvents(); len(events) != 0 {
		t.Fatalf("second drain events = %+v, want none", events)
	}
}

func TestFailureFlashesRedThenRestartsWithoutCountdown(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 1, "hard", "level-1")
	playAt := now.Add(countdownDuration + tickDuration)
	game.lives = 1
	game.tickLocked(playAt)
	frame := game.frameAtLocked(playAt)
	hazard := findTileKind(t, frame, 2)
	safe := findTileKind(t, frame, 0)

	_ = game.Press(whackamole.PressEvent{X: hazard.X, Y: hazard.Y, Pressed: true}, playAt)
	flashOn := game.Render(playAt)
	hazardOn := flashOn[hazard.Y*GridWidth+hazard.X]
	if hazardOn.R < 220 || hazardOn.G > 60 {
		t.Fatalf("hazard flash on color = %+v, want red", hazardOn)
	}
	safeColor := flashOn[safe.Y*GridWidth+safe.X]
	if safeColor.G < 200 || safeColor.R > 20 {
		t.Fatalf("safe color during failure = %+v, want green", safeColor)
	}

	flashOff := game.Render(playAt.Add(130 * time.Millisecond))
	hazardOff := flashOff[hazard.Y*GridWidth+hazard.X]
	if hazardOff != (RGB{}) {
		t.Fatalf("hazard flash off color = %+v, want off", hazardOff)
	}

	restarted := game.Snapshot(playAt.Add(3*time.Second + time.Millisecond))
	if restarted.Phase != "running" || restarted.CountdownMillis != 0 {
		t.Fatalf("restart snapshot = %+v, want running without countdown", restarted)
	}
	if restarted.Lives != game.level.lives {
		t.Fatalf("restart lives = %d, want %d", restarted.Lives, game.level.lives)
	}
}

func TestSuccessPlaysSeededTransitionThenSettles(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 12345, 2, "easy", "level-24")
	game.success = true
	game.ended = true
	game.endedAt = now

	during := game.Render(now.Add(transitionDuration / 2))
	colors := uniqueColors(during)
	if colors < 3 {
		t.Fatalf("success transition unique colors = %d, want animated multi-color frame", colors)
	}

	settled := game.Render(now.Add(transitionDuration + time.Second))
	for _, color := range settled {
		if color.G < color.R || color.G < color.B {
			t.Fatalf("settled success color = %+v, want green-dominant", color)
		}
	}
}

func TestSuccessAdvancesToNextLevelAfterTransition(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 12345, 2, "easy", "level-1")
	game.success = true
	game.ended = true
	game.endedAt = now

	during := game.Snapshot(now.Add(transitionDuration / 2))
	if during.Phase != "finished" || during.Level != "level-1" || !during.Success {
		t.Fatalf("during transition snapshot = %+v, want finished level 1 success", during)
	}

	after := game.Snapshot(now.Add(transitionDuration + time.Millisecond))
	if after.Phase != "countdown" || after.Level != "level-2" || after.Success {
		t.Fatalf("after transition snapshot = %+v, want level 2 countdown", after)
	}
	if after.CountdownMillis <= 0 {
		t.Fatalf("after transition countdown = %d, want positive", after.CountdownMillis)
	}
}

func TestFinalLevelSuccessDoesNotAdvancePastSeason(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 12345, 2, "easy", "level-24")
	game.success = true
	game.ended = true
	game.endedAt = now

	after := game.Snapshot(now.Add(transitionDuration + time.Second))
	if after.Phase != "finished" || after.Level != "level-24" || !after.Success {
		t.Fatalf("final level snapshot = %+v, want finished level 24 success", after)
	}
}

func TestSuccessTransitionIsDeterministicBySeedAndLevel(t *testing.T) {
	now := time.Unix(100, 0)
	a := NewWithSeed(now, 123, 2, "easy", "level-1")
	b := NewWithSeed(now, 123, 2, "easy", "level-1")
	c := NewWithSeed(now, 124, 2, "easy", "level-1")
	if a.transitionID != b.transitionID {
		t.Fatalf("same seed transition ids = %d and %d, want same", a.transitionID, b.transitionID)
	}
	if a.transitionID == c.transitionID && transitionCount() > 1 {
		t.Fatalf("nearby seed transition id = %d, want variety", a.transitionID)
	}
}

func TestPurpleTileRequiresReleaseBeforeCollecting(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 2, "easy", "level-1")
	playAt := now.Add(countdownDuration + tickDuration)
	game.tickLocked(playAt)
	purple := findTileKind(t, game.frameAtLocked(playAt), 3)

	events := game.Press(whackamole.PressEvent{X: purple.X, Y: purple.Y, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueDoubleCoin {
		t.Fatalf("first purple press events = %+v, want double coin", events)
	}
	if got := game.Snapshot(playAt).Score; got != 0 {
		t.Fatalf("score after first purple press = %d, want 0", got)
	}
	if point := game.pointAtLocked(purple, playAt); point.kind != 4 {
		t.Fatalf("held purple kind = %d, want 4", point.kind)
	}
	if events := game.Press(whackamole.PressEvent{X: purple.X, Y: purple.Y, Pressed: true}, playAt); len(events) != 0 {
		t.Fatalf("second held purple press events = %+v, want none", events)
	}

	_ = game.Press(whackamole.PressEvent{X: purple.X, Y: purple.Y, Pressed: false}, playAt)
	if point := game.pointAtLocked(purple, playAt); point.kind != 1 {
		t.Fatalf("released purple kind = %d, want blue coin kind 1", point.kind)
	}
	events = game.Press(whackamole.PressEvent{X: purple.X, Y: purple.Y, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueCoin {
		t.Fatalf("primed purple press events = %+v, want hit", events)
	}
	if got := game.Snapshot(playAt).Score; got != 1 {
		t.Fatalf("score after primed purple press = %d, want 1", got)
	}
}

func TestCountdownDropsSafeZoneIntoPlaceForAllLevels(t *testing.T) {
	now := time.Unix(100, 0)
	for _, level := range Levels() {
		t.Run(level.ID, func(t *testing.T) {
			game := NewWithSeed(now, 1, 2, "easy", level.ID)
			firstFrame := &game.level.frames[0]
			safeTiles := countdownSafeTiles(firstFrame)
			if len(safeTiles) == 0 {
				t.Skip("level has no starting safe zone")
			}
			for index := 1; index < len(safeTiles); index++ {
				if safeTiles[index].Y > safeTiles[index-1].Y {
					t.Fatalf("safe tile order moved toward far side at index %d: before=%+v after=%+v", index, safeTiles[index-1], safeTiles[index])
				}
			}

			early := now.Add(time.Second)
			frame := game.Render(early)
			if visibleGreenTiles(frame) == 0 {
				t.Fatal("early countdown frame has no visible green setup tiles")
			}
			if hazard, ok := findTileKindOptional(firstFrame, 2); ok {
				hazardColor := frame[hazard.Y*GridWidth+hazard.X]
				if hazardColor != (RGB{}) {
					t.Fatalf("hazard countdown tile color = %+v, want hidden", hazardColor)
				}
			}

			settledFrame := game.Render(game.startedAt.Add(-50 * time.Millisecond))
			for _, safe := range safeTiles {
				settledColor := settledFrame[safe.Y*GridWidth+safe.X]
				if settledColor.G < 220 {
					t.Fatalf("settled safe tile %+v color = %+v, want bright green", safe, settledColor)
				}
			}
		})
	}
}

func findTileKind(t *testing.T, frame *compiledFrame, kind int) Point {
	t.Helper()
	if frame == nil {
		t.Fatal("missing frame")
	}
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if frame.points[y][x].present && frame.points[y][x].kind == kind {
				return Point{X: x, Y: y}
			}
		}
	}
	t.Fatalf("frame has no tile kind %d", kind)
	return Point{}
}

func visibleGreenTiles(frame []RGB) int {
	count := 0
	for _, color := range frame {
		if color.G >= 220 && color.R < 20 {
			count++
		}
	}
	return count
}

func uniqueColors(frame []RGB) int {
	seen := map[RGB]bool{}
	for _, color := range frame {
		seen[color] = true
	}
	return len(seen)
}

func findTileKindOptional(frame *compiledFrame, kind int) (Point, bool) {
	if frame == nil {
		return Point{}, false
	}
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if frame.points[y][x].present && frame.points[y][x].kind == kind {
				return Point{X: x, Y: y}, true
			}
		}
	}
	return Point{}, false
}
