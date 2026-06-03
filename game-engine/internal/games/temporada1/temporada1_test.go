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
	if len(events) != 1 || events[0].Cue != whackamole.CueHit {
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
	if len(events) != 1 || events[0].Cue != whackamole.CueMiss {
		t.Fatalf("events = %+v, want miss", events)
	}
	if snapshot := game.Snapshot(playAt); snapshot.Phase != "finished" || snapshot.Success {
		t.Fatalf("snapshot = %+v, want failed finish", snapshot)
	}
}

func TestPurpleTileRequiresReleaseBeforeCollecting(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 2, "easy", "level-1")
	playAt := now.Add(countdownDuration + tickDuration)
	game.tickLocked(playAt)
	purple := findTileKind(t, game.frameAtLocked(playAt), 3)

	if events := game.Press(whackamole.PressEvent{X: purple.X, Y: purple.Y, Pressed: true}, playAt); len(events) != 0 {
		t.Fatalf("first purple press events = %+v, want none", events)
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
	events := game.Press(whackamole.PressEvent{X: purple.X, Y: purple.Y, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueHit {
		t.Fatalf("primed purple press events = %+v, want hit", events)
	}
	if got := game.Snapshot(playAt).Score; got != 1 {
		t.Fatalf("score after primed purple press = %d, want 1", got)
	}
}

func TestCountdownShowsInitialSafeGreenZonesOnly(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 2, "easy", "level-1")
	firstFrame := &game.level.frames[0]
	safe := findTileKind(t, firstFrame, 0)
	hazard := findTileKind(t, firstFrame, 2)

	frame := game.Render(now.Add(time.Second))
	safeColor := frame[safe.Y*GridWidth+safe.X]
	if safeColor.G == 0 {
		t.Fatalf("safe countdown tile color = %+v, want visible green", safeColor)
	}
	hazardColor := frame[hazard.Y*GridWidth+hazard.X]
	if hazardColor != (RGB{}) {
		t.Fatalf("hazard countdown tile color = %+v, want hidden", hazardColor)
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
