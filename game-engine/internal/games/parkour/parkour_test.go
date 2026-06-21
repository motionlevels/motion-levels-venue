package parkour

import (
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestParkourLevel1PlaythroughUsesGreenRouteAndBlueFinish(t *testing.T) {
	now := time.Unix(1_700_000_000, 0)
	game := NewWithSeed(now, 42, 1, "easy", "level-1")
	playAt := game.startedAt

	if len(game.level.frames) < 2 {
		t.Fatalf("level 1 has %d frame, want animated green route frames", len(game.level.frames))
	}
	if !greenCountsVary(game.level.frames) {
		t.Fatal("level 1 green route count does not change across frames")
	}

	frameStart := time.Duration(0)
	greenSteps := 0
	startingLives := game.Snapshot(playAt).Lives
	for _, frame := range game.level.frames {
		pt, ok := firstGreenPoint(frame)
		if ok {
			stepAt := playAt.Add(frameStart + frame.duration/2)
			events := game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, stepAt)
			game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: false}, stepAt.Add(10*time.Millisecond))
			if len(events) != 0 {
				t.Fatalf("green route step at %v emitted events: %+v", pt, events)
			}
			snapshot := game.Snapshot(stepAt.Add(20 * time.Millisecond))
			if snapshot.Score != 0 || snapshot.Success || snapshot.Lives != startingLives {
				t.Fatalf("green route step changed game outcome: %+v", snapshot)
			}
			greenSteps++
			if greenSteps == 5 {
				break
			}
		}
		frameStart += frame.duration
	}
	if greenSteps < 3 {
		t.Fatalf("walked %d green route steps, want at least 3", greenSteps)
	}

	finish := representativeBlueTargets(t, game)[0]
	events := game.Press(whackamole.PressEvent{X: finish.X, Y: finish.Y, Pressed: true}, playAt.Add(finish.offset))
	if len(events) == 0 {
		t.Fatalf("pressing blue finish platform %v did not emit a claim event", finish.Point)
	}
	snapshot := game.Snapshot(playAt.Add(finish.offset + 10*time.Millisecond))
	if !snapshot.Success {
		t.Fatalf("game did not finish after stepping on blue platform: %+v", snapshot)
	}
	if snapshot.Score != 1 {
		t.Fatalf("score = %d, want final blue platform score 1", snapshot.Score)
	}
	if snapshot.ActiveTargets != 0 {
		t.Fatalf("active targets = %d, want 0", snapshot.ActiveTargets)
	}
}

func TestGreenPlatformsDoNotAdvanceParkour(t *testing.T) {
	now := time.Unix(1_700_000_000, 0)
	game := NewWithSeed(now, 42, 1, "easy", "level-2")
	playAt := game.startedAt
	pt := representativeGreenPoint(t, game.level.frames[0])

	events := game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, playAt)
	if len(events) != 0 {
		t.Fatalf("pressing green platform emitted events: %+v", events)
	}
	snapshot := game.Snapshot(playAt.Add(10 * time.Millisecond))
	if snapshot.Score != 0 || snapshot.Success {
		t.Fatalf("green platform advanced parkour objective: %+v", snapshot)
	}
}

func TestStableGreenRouteTilesRenderPureFullBrightness(t *testing.T) {
	now := time.Unix(1_700_000_000, 0)
	game := NewWithSeed(now, 42, 1, "easy", "level-1")
	sample := stableGreenPoint(t, game.level.frames)
	renderAt := game.startedAt.Add(sample.offset + sample.duration/2)

	first := game.Render(renderAt)[sample.Y*GridWidth+sample.X]
	second := game.Render(renderAt.Add(120 * time.Millisecond))[sample.Y*GridWidth+sample.X]
	want := RGB{G: 255}
	if first != want || second != want {
		t.Fatalf("stable green route tile rendered as first=%+v second=%+v, want %+v", first, second, want)
	}
}

func TestLegacyEditorTargetTilesRenderAsBlueObjectives(t *testing.T) {
	now := time.Unix(1_700_000_000, 0)
	game := NewWithSeed(now, 42, 1, "easy", "level-2")
	sample := representativeLegacyTarget(t, game)

	point := game.level.frames[sample.frameIndex].points[sample.Y][sample.X]
	if point.target == "" {
		t.Fatalf("legacy editor target tile at %v was not included as a blue objective", sample.Point)
	}
	color := game.Render(game.startedAt.Add(sample.offset))[sample.Y*GridWidth+sample.X]
	if color.B < 180 || color.R > 80 || color.G < 50 || color.G > 130 {
		t.Fatalf("legacy editor target tile rendered as %+v, want blue", color)
	}
}

func TestGreenRouteTilesAnimateInAndOut(t *testing.T) {
	now := time.Unix(1_700_000_000, 0)
	game := NewWithSeed(now, 42, 1, "easy", "level-1")
	playAt := game.startedAt
	sample := disappearingGreenPoint(t, game.level.frames)

	mid := game.Render(playAt.Add(sample.offset + sample.duration/2))[sample.Y*GridWidth+sample.X]
	late := game.Render(playAt.Add(sample.offset + sample.duration - 80*time.Millisecond))[sample.Y*GridWidth+sample.X]
	if mid.G <= late.G {
		t.Fatalf("green route tile did not fade before disappearing: mid=%+v late=%+v", mid, late)
	}
}

func TestClaimedBluePlatformFlashesThenStaysGreen(t *testing.T) {
	now := time.Unix(1_700_000_000, 0)
	game := NewWithSeed(now, 42, 1, "easy", "level-2")
	target := representativeBlueTargets(t, game)[0]
	playAt := game.startedAt.Add(target.offset)
	pt := target.Point

	game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, playAt)
	flash := game.Render(playAt.Add(150 * time.Millisecond))[pt.Y*GridWidth+pt.X]
	if flash.G < 230 || flash.R < 120 || flash.B < 120 {
		t.Fatalf("claimed platform flash = %+v, want bright confirmation flash", flash)
	}
	settled := game.Render(playAt.Add(claimFlashDuration + 100*time.Millisecond))[pt.Y*GridWidth+pt.X]
	if settled != (RGB{G: 255}) {
		t.Fatalf("claimed platform settled = %+v, want pure green", settled)
	}
	later := game.Render(playAt.Add(claimFlashDuration + claimFadeDuration + 100*time.Millisecond))[pt.Y*GridWidth+pt.X]
	if later != (RGB{G: 255}) {
		t.Fatalf("claimed platform later = %+v, want to remain pure green", later)
	}
}

func TestSuccessAdvancesToNextLevelAfterTransition(t *testing.T) {
	now := time.Unix(1_700_000_000, 0)
	game := NewWithSeed(now, 42, 1, "easy", "level-1")

	assertLevelCompletionAdvances(t, game, "level-1", "level-2")
	assertLevelCompletionAdvances(t, game, "level-2", "level-3")
}

func TestLavaColorAnimates(t *testing.T) {
	now := time.Unix(1_700_000_000, 0)
	game := NewWithSeed(now, 42, 1, "easy", "level-2")
	playAt := game.startedAt
	pt := representativeLavaPoint(t, game.level.frames[0])

	first := game.Render(playAt)[pt.Y*GridWidth+pt.X]
	second := game.Render(playAt.Add(275 * time.Millisecond))[pt.Y*GridWidth+pt.X]
	if first == second {
		t.Fatalf("lava color did not animate at %v: %+v", pt, first)
	}
	if first == (RGB{R: 255, G: 28, B: 40}) || second == (RGB{R: 255, G: 28, B: 40}) {
		t.Fatalf("lava used the old flat red color: first=%+v second=%+v", first, second)
	}
	for _, color := range []RGB{first, second} {
		if color.R < 135 || color.G > 95 || color.B > 16 || color.R <= color.G*2 {
			t.Fatalf("lava color = %+v, want bright red-dominant lava palette", color)
		}
	}
	if colorDelta(first, second) > 48 {
		t.Fatalf("lava changed too abruptly: first=%+v second=%+v", first, second)
	}
}

func TestLavaTilesDoNotRenderAsBlackPatches(t *testing.T) {
	now := time.Unix(1_700_000_000, 0)
	game := NewWithSeed(now, 42, 1, "easy", "level-1")
	playAt := game.startedAt
	for _, instant := range []time.Time{playAt, playAt.Add(700 * time.Millisecond), playAt.Add(2 * time.Second)} {
		currentFrame := game.frameAtLocked(instant)
		frame := game.Render(instant)
		for y := 0; y < GridHeight; y++ {
			for x := 0; x < GridWidth; x++ {
				point := currentFrame.points[y][x]
				if point.kind != 2 {
					continue
				}
				color := frame[y*GridWidth+x]
				if color.R < 70 || color.G < 12 {
					t.Fatalf("lava tile %d,%d at %s rendered too dark: %+v", x, y, instant.Sub(playAt), color)
				}
			}
		}
	}
}

func colorDelta(a RGB, b RGB) int {
	return absInt(int(a.R)-int(b.R)) + absInt(int(a.G)-int(b.G)) + absInt(int(a.B)-int(b.B))
}

func absInt(value int) int {
	if value < 0 {
		return -value
	}
	return value
}

func representativeLavaPoint(t *testing.T, frame compiledFrame) Point {
	t.Helper()
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if frame.points[y][x].kind == 2 {
				return Point{X: x, Y: y}
			}
		}
	}
	t.Fatal("expected a lava tile in the test level")
	return Point{}
}

type timedPoint struct {
	Point
	offset     time.Duration
	duration   time.Duration
	frameIndex int
}

func representativeBlueTargets(t *testing.T, game *Game) []timedPoint {
	t.Helper()
	seen := map[string]bool{}
	out := []timedPoint{}
	offset := time.Duration(0)
	for frameIndex, frame := range game.level.frames {
		for y := 0; y < GridHeight; y++ {
			for x := 0; x < GridWidth; x++ {
				point := frame.points[y][x]
				if point.target == "" || !isPlatformKind(point.kind) || seen[point.target] {
					continue
				}
				seen[point.target] = true
				out = append(out, timedPoint{
					Point:      Point{X: x, Y: y},
					offset:     offset + frame.duration/2,
					duration:   frame.duration,
					frameIndex: frameIndex,
				})
			}
		}
		offset += frame.duration
	}
	if len(out) == 0 {
		t.Fatal("expected at least one blue objective target")
	}
	return out
}

func representativeLegacyTarget(t *testing.T, game *Game) timedPoint {
	t.Helper()
	offset := time.Duration(0)
	for frameIndex, frame := range game.level.frames {
		for y := 0; y < GridHeight; y++ {
			for x := 0; x < GridWidth; x++ {
				if frame.points[y][x].kind == 3 {
					return timedPoint{
						Point:      Point{X: x, Y: y},
						offset:     offset + frame.duration/2,
						duration:   frame.duration,
						frameIndex: frameIndex,
					}
				}
			}
		}
		offset += frame.duration
	}
	t.Fatal("expected a legacy editor target tile in the test level")
	return timedPoint{}
}

func representativeGreenPoint(t *testing.T, frame compiledFrame) Point {
	t.Helper()
	pt, ok := firstGreenPoint(frame)
	if !ok {
		t.Fatal("expected a non-objective green tile in the test level")
	}
	return pt
}

func firstGreenPoint(frame compiledFrame) (Point, bool) {
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			point := frame.points[y][x]
			if point.kind == 0 && point.target == "" {
				return Point{X: x, Y: y}, true
			}
		}
	}
	return Point{}, false
}

func greenCountsVary(frames []compiledFrame) bool {
	if len(frames) < 2 {
		return false
	}
	first := greenCount(frames[0])
	for _, frame := range frames[1:] {
		if greenCount(frame) != first {
			return true
		}
	}
	return false
}

func greenCount(frame compiledFrame) int {
	count := 0
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if frame.points[y][x].kind == 0 && frame.points[y][x].target == "" {
				count++
			}
		}
	}
	return count
}

func countVisibleGreen(frame []RGB) int {
	count := 0
	for _, color := range frame {
		if color.G > 180 && color.R < 90 && color.B < 120 {
			count++
		}
	}
	return count
}

func assertLevelCompletionAdvances(t *testing.T, game *Game, currentID string, nextID string) {
	t.Helper()
	if game.level.id != currentID {
		t.Fatalf("current level = %s, want %s", game.level.id, currentID)
	}

	var finished Snapshot
	for _, target := range representativeBlueTargets(t, game) {
		pressAt := game.startedAt.Add(target.offset)
		events := game.Press(whackamole.PressEvent{X: target.X, Y: target.Y, Pressed: true}, pressAt)
		if len(events) == 0 {
			t.Fatalf("pressing %s objective %v did not emit a claim event", currentID, target.Point)
		}
		game.Press(whackamole.PressEvent{X: target.X, Y: target.Y, Pressed: false}, pressAt.Add(5*time.Millisecond))
		finished = game.Snapshot(pressAt.Add(10 * time.Millisecond))
	}
	if finished.Phase != "finished" || finished.Level != currentID || !finished.Success {
		t.Fatalf("finished snapshot = %+v, want %s success", finished, currentID)
	}
	endedAt := time.Unix(0, finished.EndedUnixNanos)

	during := game.Snapshot(endedAt.Add(transitionDuration / 2))
	if during.Phase != "finished" || during.Level != currentID || !during.Success {
		t.Fatalf("during transition snapshot = %+v, want finished %s success", during, currentID)
	}

	after := game.Snapshot(endedAt.Add(transitionDuration + time.Millisecond))
	if after.Phase != "countdown" || after.Level != nextID || after.Success {
		t.Fatalf("after transition snapshot = %+v, want %s countdown", after, nextID)
	}
	if after.CountdownMillis <= 0 {
		t.Fatalf("after transition countdown = %d, want positive", after.CountdownMillis)
	}
	frame := game.Render(endedAt.Add(transitionDuration + 500*time.Millisecond))
	if got := countVisibleGreen(frame); got == 0 {
		t.Fatalf("%s countdown green tiles = %d, want load effect visible", nextID, got)
	}
}

func disappearingGreenPoint(t *testing.T, frames []compiledFrame) timedPoint {
	t.Helper()
	offset := time.Duration(0)
	for index, frame := range frames {
		next := frames[(index+1)%len(frames)]
		for y := 0; y < GridHeight; y++ {
			for x := 0; x < GridWidth; x++ {
				point := frame.points[y][x]
				nextPoint := next.points[y][x]
				if point.kind == 0 && point.target == "" && nextPoint.kind != 0 {
					return timedPoint{
						Point:      Point{X: x, Y: y},
						offset:     offset,
						duration:   frame.duration,
						frameIndex: index,
					}
				}
			}
		}
		offset += frame.duration
	}
	t.Fatal("expected at least one green route tile to disappear between frames")
	return timedPoint{}
}

func stableGreenPoint(t *testing.T, frames []compiledFrame) timedPoint {
	t.Helper()
	offset := time.Duration(0)
	for index, frame := range frames {
		previous := frames[(index-1+len(frames))%len(frames)]
		next := frames[(index+1)%len(frames)]
		for y := 0; y < GridHeight; y++ {
			for x := 0; x < GridWidth; x++ {
				point := frame.points[y][x]
				if point.kind == 0 && point.target == "" && previous.points[y][x].kind == 0 && next.points[y][x].kind == 0 {
					return timedPoint{
						Point:      Point{X: x, Y: y},
						offset:     offset,
						duration:   frame.duration,
						frameIndex: index,
					}
				}
			}
		}
		offset += frame.duration
	}
	t.Fatal("expected at least one stable green route tile")
	return timedPoint{}
}
