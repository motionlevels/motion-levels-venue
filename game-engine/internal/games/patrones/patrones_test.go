package patrones

import (
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestPatternTargetsRenderBlueAndClaimGreen(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 2, "easy", "level-1")
	playAt := game.startedAt.Add(100 * time.Millisecond)
	target := game.targets[0]

	before := game.Render(playAt)[target.Y*GridWidth+target.X]
	if before.B < 180 || before.R > 60 || before.G > 140 {
		t.Fatalf("target before claim = %+v, want bright blue", before)
	}

	events := game.Press(whackamole.PressEvent{X: target.X, Y: target.Y, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueCoin {
		t.Fatalf("claim events = %+v, want coin", events)
	}
	after := game.Render(playAt.Add(300 * time.Millisecond))[target.Y*GridWidth+target.X]
	if after.G < 220 || after.R > 30 || after.B > 30 {
		t.Fatalf("target after claim = %+v, want green", after)
	}
}

func TestSafeAreaAroundCanvasDoesNotFail(t *testing.T) {
	now := time.Unix(200, 0)
	game := NewWithSeed(now, 2, 2, "medium", "level-2")
	playAt := game.startedAt.Add(100 * time.Millisecond)
	safe := Point{X: 0, Y: 0}

	color := game.Render(playAt)[safe.Y*GridWidth+safe.X]
	if color.G < 180 || color.R > 40 || color.B > 40 {
		t.Fatalf("safe area = %+v, want green", color)
	}
	if events := game.Press(whackamole.PressEvent{X: safe.X, Y: safe.Y, Pressed: true}, playAt); len(events) != 0 {
		t.Fatalf("safe press events = %+v, want none", events)
	}
	if game.phaseLocked(playAt) != "playing" {
		t.Fatalf("phase after safe press = %s, want playing", game.phaseLocked(playAt))
	}
}

func TestBlackCanvasMistakeFailsLevel(t *testing.T) {
	now := time.Unix(300, 0)
	game := NewWithSeed(now, 3, 2, "hard", "level-3")
	playAt := game.startedAt.Add(100 * time.Millisecond)
	mistake := firstBlackCanvasPoint(game)

	events := game.Press(whackamole.PressEvent{X: mistake.X, Y: mistake.Y, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("mistake events = %+v, want damage", events)
	}
	snapshot := game.Snapshot(playAt)
	if snapshot.Phase != "failed" || snapshot.Success || snapshot.Lives != 0 {
		t.Fatalf("snapshot after mistake = %+v, want failed without success", snapshot)
	}
}

func TestCompletingPatternWinsLevel(t *testing.T) {
	now := time.Unix(400, 0)
	game := NewWithSeed(now, 4, 3, "easy", "level-4")
	playAt := game.startedAt.Add(100 * time.Millisecond)

	var events []whackamole.Event
	for i, target := range game.targets {
		events = game.Press(whackamole.PressEvent{X: target.X, Y: target.Y, Pressed: true}, playAt.Add(time.Duration(i)*10*time.Millisecond))
	}
	if len(events) != 1 || events[0].Cue != whackamole.CueWin {
		t.Fatalf("final events = %+v, want win", events)
	}
	snapshot := game.Snapshot(playAt.Add(time.Second))
	if snapshot.Phase != "finished" || !snapshot.Success || snapshot.Score != len(game.targets) {
		t.Fatalf("snapshot after completion = %+v, want finished success with full score", snapshot)
	}
}

func TestDifficultyChangesCanvasAndPatternSize(t *testing.T) {
	now := time.Unix(500, 0)
	easy := NewWithSeed(now, 5, 2, "easy", "level-5")
	expert := NewWithSeed(now, 5, 2, "expert", "level-5")

	if expert.canvas.W <= easy.canvas.W || expert.canvas.H <= easy.canvas.H {
		t.Fatalf("expert canvas = %+v, easy canvas = %+v; want expert larger", expert.canvas, easy.canvas)
	}
	if len(expert.targets) <= len(easy.targets) {
		t.Fatalf("expert targets = %d, easy targets = %d; want more targets", len(expert.targets), len(easy.targets))
	}
}

func firstBlackCanvasPoint(game *Game) Point {
	for y := game.canvas.Y; y < game.canvas.Y+game.canvas.H; y++ {
		for x := game.canvas.X; x < game.canvas.X+game.canvas.W; x++ {
			pt := Point{X: x, Y: y}
			if _, ok := game.targetIndex[pt]; !ok {
				return pt
			}
		}
	}
	return Point{X: game.canvas.X, Y: game.canvas.Y}
}
