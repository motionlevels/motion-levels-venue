package duel

import (
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestGeneratedBoardIsBalancedAndOrganic(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeedAndPlayers([]whackamole.PlayerConfig{
		{Label: "Rojo", Color: RGB{R: 255}},
		{Label: "Azul", Color: RGB{B: 255}},
		{Label: "Verde", Color: RGB{G: 255}},
	}, now, 42)

	counts := make([]int, len(game.players))
	sameEdges := 0
	totalEdges := 0
	longestRun := 0
	for y := 0; y < GridHeight; y++ {
		runOwner := -2
		runLength := 0
		for x := 0; x < GridWidth; x++ {
			player := game.owners[y*GridWidth+x]
			if player < 0 {
				continue
			}
			counts[player]++
			if player == runOwner {
				runLength++
			} else {
				runOwner = player
				runLength = 1
			}
			if runLength > longestRun {
				longestRun = runLength
			}
			if x+1 < GridWidth {
				right := game.owners[y*GridWidth+x+1]
				if right == player {
					sameEdges++
				}
				totalEdges++
			}
			if y+1 < GridHeight {
				down := game.owners[(y+1)*GridWidth+x]
				if down == player {
					sameEdges++
				}
				totalEdges++
			}
		}
	}
	for x := 0; x < GridWidth; x++ {
		runOwner := -2
		runLength := 0
		for y := 0; y < GridHeight; y++ {
			player := game.owners[y*GridWidth+x]
			if player < 0 {
				continue
			}
			if player == runOwner {
				runLength++
			} else {
				runOwner = player
				runLength = 1
			}
			if runLength > longestRun {
				longestRun = runLength
			}
		}
	}
	for player, count := range counts {
		if count != game.tilesPerPlayer {
			t.Fatalf("player %d tile count = %d, want %d", player, count, game.tilesPerPlayer)
		}
	}
	if sameEdges < 80 {
		t.Fatalf("same-color edges = %d, want some adjacency so board is not a rigid checker pattern", sameEdges)
	}
	if float64(sameEdges)/float64(totalEdges) > 0.42 {
		t.Fatalf("same-color edge ratio = %.2f, board is too clumpy", float64(sameEdges)/float64(totalEdges))
	}
	if longestRun > 8 {
		t.Fatalf("longest same-color run = %d, want <= 8", longestRun)
	}
}

func TestDuelStartsFromPlayerPadsAndWinnerClaimsOwnTiles(t *testing.T) {
	now := time.Unix(200, 0)
	game := NewWithSeedAndPlayers([]whackamole.PlayerConfig{
		{Label: "Rojo", Color: RGB{R: 255}},
		{Label: "Azul", Color: RGB{B: 255}},
	}, now, 7)

	for player, origin := range game.startPadOrigins {
		events := game.Press(whackamole.PressEvent{X: origin.X, Y: origin.Y, Pressed: true}, now)
		if player == len(game.startPadOrigins)-1 {
			if len(events) != 1 || events[0].Cue != whackamole.CueStart {
				t.Fatalf("last start pad events = %+v, want start", events)
			}
			continue
		}
		if len(events) != 0 {
			t.Fatalf("early start pad events = %+v", events)
		}
	}

	runningAt := now.Add(setupDuration + time.Millisecond)
	scoreEvents := 0
	for index, owner := range game.owners {
		if owner != 0 {
			continue
		}
		x := index % GridWidth
		y := index / GridWidth
		events := game.Press(whackamole.PressEvent{X: x, Y: y, Pressed: true}, runningAt.Add(time.Duration(scoreEvents)*time.Millisecond))
		scoreEvents++
		if scoreEvents < game.tilesPerPlayer {
			if len(events) != 1 || events[0].Cue != whackamole.CueCoin {
				t.Fatalf("claim %d events = %+v, want coin", scoreEvents, events)
			}
		} else {
			if len(events) != 1 || events[0].Cue != whackamole.CueWin {
				t.Fatalf("final claim events = %+v, want win", events)
			}
		}
	}

	snapshot := game.Snapshot(runningAt.Add(2 * time.Second))
	if snapshot.Phase != "finished" || !snapshot.Success || snapshot.Winner != 0 {
		t.Fatalf("snapshot = %+v, want player 0 finished success", snapshot)
	}
	if snapshot.Players[0].Score != game.tilesPerPlayer || snapshot.Players[1].Score != 0 {
		t.Fatalf("scores = %+v, want player 0 complete only", snapshot.Players)
	}
}
