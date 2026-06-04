package temporada2

import (
	"strconv"
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestLevelsExposeThirtyGames(t *testing.T) {
	levels := Levels()
	if len(levels) != 30 {
		t.Fatalf("len(Levels()) = %d, want 30", len(levels))
	}
	for index, level := range levels {
		wantID := "level-" + strconv.Itoa(index+1)
		if level.ID != wantID {
			t.Fatalf("level %d id = %q, want %q", index, level.ID, wantID)
		}
		if level.Description == "" {
			t.Fatalf("level %d has empty description", index+1)
		}
	}
	if got := NormalizeLevel("5"); got != "level-5" {
		t.Fatalf("NormalizeLevel(5) = %q, want level-5", got)
	}
	if got := NormalizeLevel("30"); got != "level-30" {
		t.Fatalf("NormalizeLevel(30) = %q, want level-30", got)
	}
	if got := NormalizeDifficulty("expert"); got != DifficultyEasy {
		t.Fatalf("NormalizeDifficulty(expert) = %q, want easy while temporada2 is single-difficulty", got)
	}
}

func TestGeneratedLevelsHaveSafeCoinsAndMovingHazards(t *testing.T) {
	levels := levelsFor(DifficultyEasy)
	for _, level := range levels {
		if len(level.scoreUniqs) == 0 {
			t.Fatalf("%s has no score coins", level.id)
		}
		seenSafe := false
		seenCoin := false
		seenHazard := false
		hazardLayouts := map[string]bool{}
		for _, frame := range level.frames {
			key := ""
			for y := 0; y < GridHeight; y++ {
				for x := 0; x < GridWidth; x++ {
					point := frame.points[y][x]
					switch point.kind {
					case 0:
						seenSafe = true
					case 1:
						seenCoin = true
					case 2:
						seenHazard = true
						key += string(rune('A' + (x+y*GridWidth)%26))
					}
				}
			}
			if key != "" {
				hazardLayouts[key] = true
			}
		}
		if !seenSafe || !seenCoin || !seenHazard {
			t.Fatalf("%s safe=%v coin=%v hazard=%v, want all present", level.id, seenSafe, seenCoin, seenHazard)
		}
		if len(hazardLayouts) < 2 {
			t.Fatalf("%s hazards do not move enough", level.id)
		}
	}
}

func TestTileLayerPriorityIsGreenRedBlue(t *testing.T) {
	frame := newFrame(1)
	put(&frame, 4, 4, 0, "")
	put(&frame, 4, 4, 2, "")
	if got := frame.points[4][4].kind; got != 0 {
		t.Fatalf("safe then hazard kind = %d, want safe", got)
	}

	put(&frame, 5, 5, 2, "")
	put(&frame, 5, 5, 0, "")
	if got := frame.points[5][5].kind; got != 0 {
		t.Fatalf("hazard then safe kind = %d, want safe", got)
	}

	put(&frame, 6, 6, 1, "coin")
	put(&frame, 6, 6, 2, "")
	if got := frame.points[6][6].kind; got != 2 {
		t.Fatalf("coin then hazard kind = %d, want hazard", got)
	}
	if got := frame.points[6][6].underPoint().kind; got != 1 {
		t.Fatalf("hazard underlying kind = %d, want coin", got)
	}

	game := &Game{
		level: compiledLevel{
			totalDuration: time.Second,
			frames:        []compiledFrame{frame},
		},
		startedAt: time.Unix(100, 0),
		removed:   map[string]bool{"coin": true},
	}
	if got := game.pointAtLocked(Point{X: 6, Y: 6}, game.startedAt.Add(time.Millisecond)).kind; got != 2 {
		t.Fatalf("captured hidden coin visible kind = %d, want hazard", got)
	}
}

func TestCarruselArmsDoNotOverwriteCentralSafeZone(t *testing.T) {
	level := levelFor(DifficultyEasy, "level-3")
	if len(level.frames) == 0 {
		t.Fatal("level 3 has no frames")
	}
	for frameIndex, frame := range level.frames {
		for y := 13; y < 19; y++ {
			for x := 5; x < 11; x++ {
				if got := frame.points[y][x].kind; got != 0 {
					t.Fatalf("frame %d central safe tile (%d,%d) kind = %d, want safe", frameIndex, x, y, got)
				}
			}
		}
	}
}

func TestRioDeLavaUsesMovingGreenGatesThroughRedBands(t *testing.T) {
	level := levelFor(DifficultyEasy, "level-2")
	seenGateLayouts := map[string]bool{}
	for frameIndex, frame := range level.frames {
		key := ""
		for band := 0; band < 5; band++ {
			y := 5 + band*5
			seenSafeGate := false
			seenRedBarrier := false
			for yy := y; yy <= y+1; yy++ {
				for x := 0; x < GridWidth; x++ {
					point := frame.points[yy][x]
					if !point.present {
						t.Fatalf("frame %d barrier tile (%d,%d) is neutral black; want red barrier or green gate", frameIndex, x, yy)
					}
					switch point.kind {
					case 0:
						seenSafeGate = true
						key += strconv.Itoa(x) + ","
					case 2:
						seenRedBarrier = true
					case 1, 3:
						t.Fatalf("frame %d barrier tile (%d,%d) shows coin over red/green priority", frameIndex, x, yy)
					default:
						t.Fatalf("frame %d barrier tile (%d,%d) kind = %d, want red or green", frameIndex, x, yy, point.kind)
					}
				}
			}
			if !seenSafeGate || !seenRedBarrier {
				t.Fatalf("frame %d band %d safeGate=%v redBarrier=%v, want both", frameIndex, band, seenSafeGate, seenRedBarrier)
			}
			key += "|"
		}
		seenGateLayouts[key] = true
	}
	if len(seenGateLayouts) < 3 {
		t.Fatalf("level 2 gate layouts = %d, want moving green gates", len(seenGateLayouts))
	}
}

func TestRioDeLavaRedBarrierDamagesPlayer(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 42, 3, "easy", "level-2")
	playAt := game.startedAt.Add(50 * time.Millisecond)
	var hazard Point
	found := false
	frame := game.frameAtLocked(playAt)
	if frame == nil {
		t.Fatal("level 2 frame is nil")
	}
	for y := 5; y < 27 && !found; y++ {
		for x := 0; x < GridWidth; x++ {
			if frame.points[y][x].kind == 2 {
				hazard = Point{X: x, Y: y}
				found = true
				break
			}
		}
	}
	if !found {
		t.Fatal("level 2 has no red barrier tile")
	}
	livesBefore := game.lives
	events := game.Press(whackamole.PressEvent{X: hazard.X, Y: hazard.Y, Pressed: true}, playAt)
	if len(events) == 0 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("red barrier press events = %+v, want damage cue", events)
	}
	if game.lives != livesBefore-1 {
		t.Fatalf("lives after red barrier = %d, want %d", game.lives, livesBefore-1)
	}
}

func TestRioDeLavaPurpleCoinRequiresReleaseBeforeCollecting(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 42, 3, "easy", "level-2")
	playAt := game.startedAt.Add(50 * time.Millisecond)
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
		t.Fatalf("held purple kind = %d, want white held kind 4", point.kind)
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
		t.Fatalf("primed purple press events = %+v, want coin", events)
	}
	if got := game.Snapshot(playAt).Score; got != 1 {
		t.Fatalf("score after primed purple press = %d, want 1", got)
	}
}

func TestLevelOneCanBeCompletedByCollectingCoins(t *testing.T) {
	now := time.Unix(100, 0)
	game := NewWithSeed(now, 42, 3, "easy", "level-1")
	collected := map[string]bool{}
	playAt := game.startedAt.Add(50 * time.Millisecond)
	lastPressAt := playAt

	for frameIndex, frame := range game.level.frames {
		frameAt := playAt.Add(time.Duration(frameIndex) * frame.duration)
		for y := 0; y < GridHeight; y++ {
			for x := 0; x < GridWidth; x++ {
				point := frame.points[y][x]
				if point.kind != 1 || point.uniq == "" || collected[point.uniq] {
					continue
				}
				collected[point.uniq] = true
				game.Press(whackamole.PressEvent{X: x, Y: y, Pressed: true}, frameAt)
				game.Press(whackamole.PressEvent{X: x, Y: y, Pressed: false}, frameAt.Add(time.Millisecond))
				lastPressAt = frameAt.Add(2 * time.Millisecond)
			}
		}
		if len(collected) == len(game.level.scoreUniqs) {
			break
		}
	}

	if len(collected) != len(game.level.scoreUniqs) {
		t.Fatalf("collected %d coins, want %d", len(collected), len(game.level.scoreUniqs))
	}
	snapshot := game.Snapshot(lastPressAt)
	if !snapshot.Success || snapshot.Phase != "finished" {
		t.Fatalf("snapshot success=%v phase=%s score=%d active=%d", snapshot.Success, snapshot.Phase, snapshot.Score, snapshot.ActiveTargets)
	}
}

func findTileKind(t *testing.T, frame *compiledFrame, kind int) Point {
	t.Helper()
	if frame == nil {
		t.Fatal("frame is nil")
	}
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if frame.points[y][x].kind == kind {
				return Point{X: x, Y: y}
			}
		}
	}
	t.Fatalf("tile kind %d not found", kind)
	return Point{}
}
