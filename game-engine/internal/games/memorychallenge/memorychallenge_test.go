package memorychallenge

import (
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestGeneratedPathsStayInLaneAndOrder(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 42, 4)

	if len(game.players) != 4 {
		t.Fatalf("player count = %d, want 4", len(game.players))
	}
	for playerIndex, player := range game.players {
		if len(player.path) < GridHeight-startRows {
			t.Fatalf("player %d path length = %d, want at least %d", playerIndex, len(player.path), GridHeight-startRows)
		}
		if player.path[0].Y != startRows {
			t.Fatalf("player %d first path point = %+v, want row %d", playerIndex, player.path[0], startRows)
		}
		if player.path[len(player.path)-1].Y != GridHeight-1 {
			t.Fatalf("player %d final path point = %+v, want row %d", playerIndex, player.path[len(player.path)-1], GridHeight-1)
		}
		if !pathOrderUnambiguous(player.path) {
			t.Fatalf("player %d path is ambiguous: %+v", playerIndex, player.path)
		}
		for _, pt := range player.path {
			if !player.lane.contains(pt) {
				t.Fatalf("player %d path point %+v outside lane %+v", playerIndex, pt, player.lane)
			}
			if pt.Y < startRows {
				t.Fatalf("player %d path point %+v is inside start rows", playerIndex, pt)
			}
		}
	}
}

func TestPathFadesAfterPlayerLeavesStart(t *testing.T) {
	now := time.Unix(200, 0)
	game := NewWithSeed(now, 7, 1)
	player := game.players[0]
	start := Point{X: player.start.X, Y: player.start.Y}
	first := player.path[0]

	game.Press(whackamole.PressEvent{X: start.X, Y: start.Y, Pressed: true}, now)
	game.Press(whackamole.PressEvent{X: start.X, Y: start.Y, Pressed: false}, now.Add(100*time.Millisecond))

	if game.players[0].mode != playerRunning {
		t.Fatalf("mode = %v, want running", game.players[0].mode)
	}
	if game.players[0].fadeStarted.IsZero() {
		t.Fatal("fade should be scheduled after leaving start")
	}

	before := game.colorAtLocked(first, now.Add(startGrace/2), game.timePhase(now.Add(startGrace/2)))
	after := game.colorAtLocked(first, now.Add(startGrace+pathFadeTime+100*time.Millisecond), game.timePhase(now.Add(startGrace+pathFadeTime+100*time.Millisecond)))
	if before.G <= after.G {
		t.Fatalf("path did not fade from bright player color to lava: before=%+v after=%+v", before, after)
	}
}

func TestLavaStaysDarkEnoughForMemoryPathContrast(t *testing.T) {
	now := time.Unix(250, 0)
	game := NewWithSeedAndPlayers(now, 9, []whackamole.PlayerConfig{{Label: "Nora", Color: RGB{G: 255}}})
	player := game.players[0]
	path := player.path[len(player.path)/2]
	lava := path
	for y := startRows; y < GridHeight; y++ {
		for x := player.lane.X; x < player.lane.X+player.lane.W; x++ {
			candidate := Point{X: x, Y: y}
			if _, onPath := player.pathIndex[candidate]; !onPath {
				lava = candidate
				break
			}
		}
		if _, onPath := player.pathIndex[lava]; !onPath {
			break
		}
	}

	frameAt := now.Add(750 * time.Millisecond)
	lavaColor := game.colorAtLocked(lava, frameAt, game.timePhase(frameAt))
	pathColor := game.colorAtLocked(path, frameAt, game.timePhase(frameAt))
	if lavaColor.R > 92 || lavaColor.G > 26 || lavaColor.B > 6 {
		t.Fatalf("memory lava is too bright: %+v", lavaColor)
	}
	if brightness(pathColor) < brightness(lavaColor)*3 {
		t.Fatalf("path lacks contrast over lava: path=%+v lava=%+v", pathColor, lavaColor)
	}
}

func TestWrongPressRequiresReturnToStart(t *testing.T) {
	now := time.Unix(300, 0)
	game := NewWithSeed(now, 11, 1)
	first := game.players[0].path[0]
	wrong := first
	if wrong.X+1 < GridWidth {
		wrong.X++
	} else {
		wrong.X--
	}
	if _, ok := game.players[0].pathIndex[wrong]; ok {
		for y := GridHeight - 1; y >= startRows; y-- {
			for x := 0; x < GridWidth; x++ {
				candidate := Point{X: x, Y: y}
				if _, onPath := game.players[0].pathIndex[candidate]; !onPath {
					wrong = candidate
					break
				}
			}
			if _, onPath := game.players[0].pathIndex[wrong]; !onPath {
				break
			}
		}
	}

	events := game.Press(whackamole.PressEvent{X: wrong.X, Y: wrong.Y, Pressed: true}, now)
	if len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("wrong press events = %+v, want damage", events)
	}
	if game.players[0].mode != playerFailed {
		t.Fatalf("mode = %v, want failed", game.players[0].mode)
	}

	start := game.players[0].start
	events = game.Press(whackamole.PressEvent{X: start.X, Y: start.Y, Pressed: true}, now.Add(time.Second))
	if len(events) != 1 || events[0].Cue != whackamole.CueStart {
		t.Fatalf("return-to-start events = %+v, want start", events)
	}
	if game.players[0].mode != playerAtStart {
		t.Fatalf("mode = %v, want at-start after return", game.players[0].mode)
	}
}

func brightness(color RGB) int {
	return int(color.R) + int(color.G) + int(color.B)
}

func TestCompletingPathWinsMemoryChallenge(t *testing.T) {
	now := time.Unix(400, 0)
	game := NewWithSeedAndPlayers(now, 13, []whackamole.PlayerConfig{{Label: "Nora", Color: RGB{G: 255}}})

	var events []whackamole.Event
	for i, pt := range game.players[0].path {
		events = game.Press(whackamole.PressEvent{X: pt.X, Y: pt.Y, Pressed: true}, now.Add(time.Duration(i)*10*time.Millisecond))
	}
	if len(events) != 1 || events[0].Cue != whackamole.CueWin {
		t.Fatalf("final path events = %+v, want win", events)
	}

	snapshot := game.Snapshot(now.Add(time.Second))
	if snapshot.Phase != "finished" || !snapshot.Success || snapshot.Winner != 0 {
		t.Fatalf("snapshot = %+v, want finished success by player 0", snapshot)
	}
	if snapshot.Score != len(game.players[0].path) || snapshot.Players[0].Score != len(game.players[0].path) {
		t.Fatalf("scores = %+v, want complete path score %d", snapshot.Players, len(game.players[0].path))
	}
}
