package plataformas

import (
	"math"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestFetchesCloudLevelAndScoresCoin(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/level-games/plataformas/levels" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		if r.URL.Query().Get("difficulty") != "medium" {
			t.Fatalf("difficulty query = %q", r.URL.Query().Get("difficulty"))
		}
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"gameId":"plataformas",
			"levels":[{
				"id":"cloud-1",
				"slug":"level-1",
				"label":"Cloud level",
				"description":"Fetched from platform",
				"difficulty":"medium",
				"life":5,
				"pass_score":2,
				"time_limit_seconds":0,
				"frame_tick_ms":25,
				"music_ref":"Motion/canciones/Musica8.mp3",
				"music_volume":0.31,
				"narration_cue_ref":"Motion/narraciones/nivel-1.mp3",
				"coin_cue_ref":"Motion/sonidos/coin.wav",
				"double_coin_cue_ref":"Motion/sonidos/coin-doble.wav",
				"damage_cue_ref":"Motion/sonidos/fallo.mp3",
				"win_cue_ref":"Motion/sonidos/victoria.mp3",
				"defeat_cue_ref":"Motion/sonidos/derrota.mp3",
				"frames":[{"r":8,"c":[[7,14,0],[4,4,1,"coin-a"],[10,10,2],[5,5,3,"purple-a"]]}]
			}]
		}`))
	}))
	defer server.Close()

	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 2, "medium", "level-1", server.URL)
	playAt := now.Add(countdownDuration + tickDuration)
	frame := game.frameAtLocked(playAt)
	if frame == nil {
		t.Fatal("frameAtLocked returned nil")
	}
	if got := frame.points[4][4].kind; got != 1 {
		t.Fatalf("coin kind = %d, want 1", got)
	}
	audio := game.AudioRefs()
	if audio.MusicRef != "Motion/canciones/Musica8.mp3" || audio.MusicVolume != 0.31 {
		t.Fatalf("audio music = %+v, want custom music", audio)
	}
	if audio.NarrationCueRef != "Motion/narraciones/nivel-1.mp3" {
		t.Fatalf("narration cue = %q, want custom narration", audio.NarrationCueRef)
	}
	if audio.DoubleCoinCueRef != "Motion/sonidos/coin-doble.wav" {
		t.Fatalf("double coin cue = %q, want custom cue", audio.DoubleCoinCueRef)
	}
	if audio.DefeatCueRef != "Motion/sonidos/derrota.mp3" {
		t.Fatalf("defeat cue = %q, want custom cue", audio.DefeatCueRef)
	}

	events := game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueCoin {
		t.Fatalf("events = %+v, want coin cue", events)
	}
	if snapshot := game.Snapshot(playAt); snapshot.Score != 1 || snapshot.ActiveTargets != 1 {
		t.Fatalf("snapshot = %+v, want score 1 and one active target remaining", snapshot)
	}
}

func TestFetchesParkourCloudLevelsFromNamedGame(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/level-games/parkour/levels" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"gameId":"parkour",
			"levels":[{
				"slug":"level-1",
				"label":"Parkour",
				"description":"Fetched from named game",
				"difficulty":"medium",
				"life":5,
				"pass_score":0,
				"frame_tick_ms":25,
				"frames":[{"r":8,"c":[[7,14,0]]}]
			}]
		}`))
	}))
	defer server.Close()

	game := NewWithSeedForGame(time.Unix(100, 0), 1, 1, "medium", "level-1", server.URL, "parkour")
	if game.level.label != "Parkour" {
		t.Fatalf("level label = %q, want Parkour", game.level.label)
	}
}

func TestParkourLavaRuleAnimatesRedTiles(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Animated lava",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Rules:       levelRules{RedFloorAnimation: "parkour_lava"},
		Frames: []rawFrame{{
			Repeat: 40,
			Cells:  []cellTuple{{X: 5, Y: 5, Kind: 2}},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}
	game := &Game{level: levels[0], startedAt: time.Unix(100, 0)}
	first := game.colorAtLocked(Point{X: 5, Y: 5}, game.startedAt.Add(tickDuration))
	second := game.colorAtLocked(Point{X: 5, Y: 5}, game.startedAt.Add(2*time.Second))
	if first == second {
		t.Fatalf("lava color did not animate: %+v", first)
	}
}

func TestCountdownDropsSafeZonesIntoPlaceByDefault(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Load animation",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Frames: []rawFrame{{
			Repeat: 40,
			Cells: []cellTuple{
				{X: 5, Y: 28, Kind: 0},
				{X: 6, Y: 28, Kind: 0},
				{X: 5, Y: 27, Kind: 0},
				{X: 7, Y: 28, Kind: 2},
			},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}
	now := time.Unix(100, 0)
	game := &Game{level: levels[0], createdAt: now, startedAt: now.Add(countdownDuration)}

	early := game.Render(now.Add(time.Second))
	if got := countVisibleGreen(early); got == 0 {
		t.Fatalf("visible green tiles during countdown = %d, want falling safe zones", got)
	}
	if hazard := early[28*GridWidth+7]; hazard != (RGB{}) {
		t.Fatalf("hazard during countdown = %+v, want hidden while load animation plays", hazard)
	}

	settled := game.Render(game.startedAt.Add(-50 * time.Millisecond))
	if color := settled[28*GridWidth+5]; color.G < 220 || color.R != 0 {
		t.Fatalf("settled safe tile color = %+v, want bright green at target position", color)
	}
}

func TestCountdownGreenLoadAnimationDisabledShowsSettledSafeZones(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Load animation off",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Rules:       levelRules{GreenPlatformLoad: boolPtr(false)},
		Frames: []rawFrame{{
			Repeat: 40,
			Cells:  []cellTuple{{X: 5, Y: 28, Kind: 0}, {X: 6, Y: 28, Kind: 2}},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}
	now := time.Unix(100, 0)
	game := &Game{level: levels[0], createdAt: now, startedAt: now.Add(countdownDuration)}

	frame := game.Render(now.Add(time.Second))
	green := colorForPoint(tilePoint{present: true, kind: 0})
	if color := frame[28*GridWidth+5]; color != green {
		t.Fatalf("settled green tile during disabled countdown = %+v, want %+v", color, green)
	}
	if hazard := frame[28*GridWidth+6]; hazard != (RGB{}) {
		t.Fatalf("hazard during disabled countdown = %+v, want hidden", hazard)
	}
}

func TestCountdownGreenLoadSideDefaultsLeftAndCanUseRight(t *testing.T) {
	targetY := 12
	if got := normalizeGreenPlatformLoadSide(""); got != "left" {
		t.Fatalf("default green load side = %q, want left", got)
	}
	if got := countdownFallingY(targetY, 0, "left"); got != targetY+GridHeight {
		t.Fatalf("left start y = %d, want %d", got, targetY+GridHeight)
	}
	if got := countdownFallingY(targetY, 0, "right"); got != targetY-GridHeight {
		t.Fatalf("right start y = %d, want %d", got, targetY-GridHeight)
	}
	if got := countdownFallingY(targetY, 1, "left"); got != targetY {
		t.Fatalf("left settled y = %d, want %d", got, targetY)
	}
	if got := countdownFallingY(targetY, 1, "right"); got != targetY {
		t.Fatalf("right settled y = %d, want %d", got, targetY)
	}

	frame := &compiledFrame{}
	frame.points[2][1] = tilePoint{present: true, kind: 0}
	frame.points[28][1] = tilePoint{present: true, kind: 0}
	leftOrder := countdownSafeTiles(frame, "left")
	if len(leftOrder) != 2 || leftOrder[0].Y != 2 || leftOrder[1].Y != 28 {
		t.Fatalf("left load order = %+v, want far side y=2 before near side y=28", leftOrder)
	}
	rightOrder := countdownSafeTiles(frame, "right")
	if len(rightOrder) != 2 || rightOrder[0].Y != 28 || rightOrder[1].Y != 2 {
		t.Fatalf("right load order = %+v, want far side y=28 before near side y=2", rightOrder)
	}
}

func TestSuccessAdvancesToNextLevelAfterResultAnimation(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{
		{
			Slug:        "level-1",
			Label:       "First",
			Difficulty:  string(DifficultyMedium),
			Life:        5,
			FrameTickMS: 25,
			Frames: []rawFrame{{
				Repeat: 40,
				Cells:  []cellTuple{{X: 5, Y: 5, Kind: 1, Uniq: "coin-a"}},
			}},
		},
		{
			Slug:        "level-2",
			Label:       "Second",
			Difficulty:  string(DifficultyMedium),
			Life:        5,
			FrameTickMS: 25,
			Frames: []rawFrame{{
				Repeat: 40,
				Cells:  []cellTuple{{X: 4, Y: 28, Kind: 0}, {X: 6, Y: 5, Kind: 1, Uniq: "coin-b"}},
			}},
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	now := time.Unix(100, 0)
	game := newTestGameWithLevels(levels, now)
	playAt := game.startedAt.Add(tickDuration)

	events := game.Press(whackamole.PressEvent{X: 5, Y: 5, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueCoin {
		t.Fatalf("events = %+v, want coin cue", events)
	}
	finished := game.Snapshot(playAt)
	if finished.Phase != "finished" || !finished.Success || finished.Level != "level-1" {
		t.Fatalf("finished snapshot = %+v, want level 1 success", finished)
	}

	during := game.Snapshot(playAt.Add(resultDuration / 2))
	if during.Phase != "finished" || during.Level != "level-1" || !during.Success {
		t.Fatalf("during result snapshot = %+v, want level 1 result animation", during)
	}

	after := game.Snapshot(playAt.Add(resultDuration + time.Millisecond))
	if after.Phase != "countdown" || after.Level != "level-2" || after.Success {
		t.Fatalf("after result snapshot = %+v, want level 2 countdown", after)
	}
	if after.CountdownMillis <= 0 {
		t.Fatalf("after result countdown = %d, want positive", after.CountdownMillis)
	}
	frame := game.Render(playAt.Add(resultDuration + 2900*time.Millisecond))
	if got := countVisibleGreen(frame); got == 0 {
		t.Fatalf("level 2 countdown green tiles = %d, want load effect visible", got)
	}
}

func TestDifficultySettingsOverrideRuntimeTimingAndLimits(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:             "level-1",
		Label:            "Tuned difficulty",
		Difficulty:       string(DifficultyMedium),
		Life:             5,
		TimeLimitSeconds: 30,
		FrameTickMS:      40,
		Rules: levelRules{DifficultySettings: map[string]difficultySetting{
			string(DifficultyMedium): {
				Life:                     4,
				GameplayLives:            8,
				GameplayTimeLimitSeconds: 90,
				FrameDurationMS:          50,
				SpeedMultiplier:          2,
			},
		}},
		Frames: []rawFrame{{Repeat: 2, Cells: []cellTuple{{X: 5, Y: 5, Kind: 0}}}},
	}})
	if err != nil {
		t.Fatal(err)
	}
	if got := levels[0].lives; got != 8 {
		t.Fatalf("lives = %d, want gameplay override", got)
	}
	if got := levels[0].timeLimit; got != 90*time.Second {
		t.Fatalf("timeLimit = %s, want 90s", got)
	}
	if got := levels[0].frameTick; got != 25*time.Millisecond {
		t.Fatalf("frameTick = %s, want speed-adjusted 25ms", got)
	}
}

func newTestGameWithLevels(levels []compiledLevel, now time.Time) *Game {
	selected := levels[0]
	lives := selected.lives
	if lives < 1 {
		lives = 5
	}
	return &Game{
		level:        selected,
		levels:       append([]compiledLevel(nil), levels...),
		difficulty:   DifficultyMedium,
		playerCount:  1,
		createdAt:    now,
		startedAt:    now.Add(countdownDuration),
		lives:        lives,
		removed:      map[string]bool{},
		purpleHeld:   map[string]bool{},
		purplePrimed: map[string]bool{},
		pressed:      map[Point]bool{},
		greenImpacts: map[string]bool{},
		capturedAt:   map[string]time.Time{},
		hitFlash:     map[Point]time.Time{},
	}
}

func TestGreenPlatformDisappearRuleTransitionsToNextFrameColor(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Fade green",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Rules:       levelRules{GreenPlatformDisappear: true, RedFloorAnimation: "parkour_lava"},
		Frames: []rawFrame{
			{Repeat: 40, Cells: []cellTuple{{X: 5, Y: 5, Kind: 0}}},
			{Repeat: 40, Cells: []cellTuple{{X: 5, Y: 5, Kind: 2}}},
		},
	}})
	if err != nil {
		t.Fatal(err)
	}
	game := &Game{level: levels[0], startedAt: time.Unix(100, 0)}
	steady := game.colorAtLocked(Point{X: 5, Y: 5}, game.startedAt.Add(450*time.Millisecond))
	fading := game.colorAtLocked(Point{X: 5, Y: 5}, game.startedAt.Add(900*time.Millisecond))
	nearBoundaryTime := game.startedAt.Add(995 * time.Millisecond)
	nearBoundary := game.colorAtLocked(Point{X: 5, Y: 5}, nearBoundaryTime)
	nextBoundaryLava := lavaColor(Point{X: 5, Y: 5}, game.startedAt.Add(time.Second))
	if fading.G >= steady.G {
		t.Fatalf("fading green = %+v, steady = %+v; want dimmer before disappearing", fading, steady)
	}
	if nearBoundary.R <= fading.R {
		t.Fatalf("near-boundary color = %+v, fading = %+v; want transition toward incoming lava", nearBoundary, fading)
	}
	if colorDistance(nearBoundary, nextBoundaryLava) > 8 {
		t.Fatalf("near-boundary color = %+v, next lava = %+v at %s; want almost next frame color", nearBoundary, nextBoundaryLava, nearBoundaryTime)
	}
}

func TestGreenPlatformImpactRippleTriggersOncePerConnectedPlatform(t *testing.T) {
	game := newGreenImpactTestGame(t)
	playAt := game.startedAt.Add(tickDuration)

	game.Press(whackamole.PressEvent{X: 5, Y: 5, Pressed: true}, playAt)
	if len(game.ripples) != 1 {
		t.Fatalf("ripples after first platform impact = %d, want 1", len(game.ripples))
	}

	game.Press(whackamole.PressEvent{X: 6, Y: 6, Pressed: true}, playAt.Add(20*time.Millisecond))
	if len(game.ripples) != 1 {
		t.Fatalf("ripples after same connected platform impact = %d, want still 1", len(game.ripples))
	}

	game.Press(whackamole.PressEvent{X: 10, Y: 10, Pressed: true}, playAt.Add(40*time.Millisecond))
	if len(game.ripples) != 2 {
		t.Fatalf("ripples after distinct platform impact = %d, want 2", len(game.ripples))
	}
}

func TestGreenPlatformImpactRippleBrightensNearbyLava(t *testing.T) {
	game := newGreenImpactTestGame(t)
	playAt := game.startedAt.Add(tickDuration)
	lavaPoint := Point{X: 7, Y: 5}
	renderAt := playAt.Add(260 * time.Millisecond)
	base := lavaColor(lavaPoint, renderAt)

	game.Press(whackamole.PressEvent{X: 5, Y: 5, Pressed: true}, playAt)
	rippled := game.colorAtLocked(lavaPoint, renderAt)

	if rippled == base {
		t.Fatalf("rippled lava color = base %+v, want visible impact ripple", base)
	}
	if rippled.G <= base.G {
		t.Fatalf("rippled lava color = %+v, base = %+v; want warmer highlighted lava", rippled, base)
	}
}

func TestBluePlatformTurnGreenRuleAnimatesCapturedTile(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Blue turns green",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Rules:       levelRules{BluePlatformTurnGreen: true},
		Frames: []rawFrame{{
			Repeat: 40,
			Cells:  []cellTuple{{X: 4, Y: 4, Kind: 1, Uniq: "blue-a"}},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}
	game := newTestGame(levels[0])
	playAt := game.startedAt.Add(tickDuration)
	game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt)

	point := game.pointAtLocked(Point{X: 4, Y: 4}, playAt.Add(blueCaptureWindow))
	if point.kind != 0 {
		t.Fatalf("captured point kind = %d, want green platform", point.kind)
	}
	startColor := game.colorAtLocked(Point{X: 4, Y: 4}, playAt)
	endColor := game.colorAtLocked(Point{X: 4, Y: 4}, playAt.Add(blueCaptureWindow))
	blue := colorForPoint(tilePoint{present: true, kind: 1})
	green := colorForPoint(tilePoint{present: true, kind: 0})
	if colorDistance(startColor, blue) > 1 {
		t.Fatalf("capture start color = %+v, blue = %+v; want transition from blue", startColor, blue)
	}
	if endColor != green {
		t.Fatalf("capture end color = %+v, want green %+v", endColor, green)
	}
}

func TestBluePlatformCaptureAreaRuleScoresConnectedBluePlatform(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Blue capture area",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Rules:       levelRules{BluePlatformCaptureArea: true},
		Frames: []rawFrame{{
			Repeat: 40,
			Cells: []cellTuple{
				{X: 4, Y: 4, Kind: 1, Uniq: "blue-a"},
				{X: 5, Y: 4, Kind: 1, Uniq: "blue-b"},
				{X: 4, Y: 5, Kind: 1, Uniq: "blue-c"},
				{X: 5, Y: 5, Kind: 1, Uniq: "blue-d"},
				{X: 8, Y: 8, Kind: 1, Uniq: "blue-isolated"},
			},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}
	game := newTestGame(levels[0])
	playAt := game.startedAt.Add(tickDuration)
	game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt)

	if game.score != 4 {
		t.Fatalf("score = %d, want all four connected blue cells captured", game.score)
	}
	if len(game.removed) != 4 || game.removed["blue-isolated"] {
		t.Fatalf("removed = %+v, want only connected blue platform captured", game.removed)
	}
	game.Press(whackamole.PressEvent{X: 5, Y: 5, Pressed: true}, playAt.Add(20*time.Millisecond))
	if game.score != 4 {
		t.Fatalf("score after re-pressing captured platform = %d, want unchanged", game.score)
	}
}

func TestScoreAtLeastWinCondition(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"levels":[{
				"slug":"level-1",
				"label":"Score target",
				"difficulty":"medium",
				"life":5,
				"pass_score":1,
				"frame_tick_ms":25,
				"rules":{"victory_condition":"score_at_least"},
				"frames":[{"r":8,"c":[[4,4,1,"coin-a"],[8,8,1,"coin-b"]]}]
			}]
		}`))
	}))
	defer server.Close()

	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 1, "medium", "level-1", server.URL)
	playAt := now.Add(countdownDuration + tickDuration)
	game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt)

	snapshot := game.Snapshot(playAt.Add(time.Millisecond))
	if !snapshot.Success {
		t.Fatalf("success = false, want true after reaching score target")
	}
	if snapshot.Score != 1 {
		t.Fatalf("score = %d, want threshold score without completion bonus", snapshot.Score)
	}
	if snapshot.ActiveTargets != 1 {
		t.Fatalf("active targets = %d, want one uncollected target remaining", snapshot.ActiveTargets)
	}
}

func TestFinalDamageEmitsDefeatCue(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"levels":[{
				"slug":"level-1",
				"label":"Final damage",
				"difficulty":"medium",
				"life":1,
				"frame_tick_ms":25,
				"frames":[{"r":8,"c":[[4,4,2]]}]
			}]
		}`))
	}))
	defer server.Close()

	now := time.Unix(100, 0)
	game := NewWithSeed(now, 1, 1, "medium", "level-1", server.URL)
	playAt := now.Add(countdownDuration + tickDuration)
	events := game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt)
	if len(events) != 1 || events[0].Cue != whackamole.CueDefeat {
		t.Fatalf("events = %+v, want defeat cue", events)
	}
	snapshot := game.Snapshot(playAt)
	if snapshot.Success || snapshot.Phase != "finished" {
		t.Fatalf("snapshot = %+v, want failed finished level", snapshot)
	}
}

func TestCollectAllAddsPassScoreCompletionBonus(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Collect all",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		PassScore:   20,
		FrameTickMS: 25,
		Rules:       levelRules{VictoryCondition: "collect_all"},
		Frames: []rawFrame{{
			Repeat: 8,
			Cells:  []cellTuple{{X: 4, Y: 4, Kind: 1, Uniq: "coin-a"}},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}
	game := &Game{
		level:        levels[0],
		startedAt:    time.Unix(100, 0),
		lives:        5,
		removed:      map[string]bool{},
		purpleHeld:   map[string]bool{},
		purplePrimed: map[string]bool{},
		pressed:      map[Point]bool{},
		hitFlash:     map[Point]time.Time{},
	}
	playAt := game.startedAt.Add(tickDuration)
	game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt)
	snapshot := game.Snapshot(playAt.Add(time.Millisecond))
	if !snapshot.Success {
		t.Fatalf("success = false, want true after collecting all points")
	}
	if snapshot.Score != 21 {
		t.Fatalf("score = %d, want collected point plus completion bonus", snapshot.Score)
	}
}

func TestFallsBackWhenCloudUnavailable(t *testing.T) {
	game := NewWithSeed(time.Unix(100, 0), 1, 1, "medium", "level-1", "")
	if game.level.id != "level-1" {
		t.Fatalf("fallback level = %q", game.level.id)
	}
	if len(game.level.frames) != 1 {
		t.Fatalf("fallback frames = %d, want 1", len(game.level.frames))
	}
	if audio := game.AudioRefs(); audio.MusicRef != DefaultMusicRef || audio.CoinCueRef != DefaultCoinCueRef {
		t.Fatalf("fallback audio = %+v, want defaults", audio)
	}
}

func newGreenImpactTestGame(t *testing.T) *Game {
	t.Helper()
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Impact ripple",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Rules:       levelRules{RedFloorAnimation: "parkour_lava", GreenPlatformImpactRipple: true},
		Frames: []rawFrame{{
			Repeat: 40,
			Cells: []cellTuple{
				{X: 5, Y: 5, Kind: 0},
				{X: 6, Y: 5, Kind: 0},
				{X: 5, Y: 6, Kind: 0},
				{X: 6, Y: 6, Kind: 0},
				{X: 10, Y: 10, Kind: 0},
				{X: 7, Y: 5, Kind: 2},
			},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}
	return &Game{
		level:        levels[0],
		startedAt:    time.Unix(100, 0),
		lives:        5,
		removed:      map[string]bool{},
		purpleHeld:   map[string]bool{},
		purplePrimed: map[string]bool{},
		pressed:      map[Point]bool{},
		greenImpacts: map[string]bool{},
		capturedAt:   map[string]time.Time{},
		hitFlash:     map[Point]time.Time{},
	}
}

func newTestGame(level compiledLevel) *Game {
	return &Game{
		level:        level,
		startedAt:    time.Unix(100, 0),
		lives:        5,
		removed:      map[string]bool{},
		purpleHeld:   map[string]bool{},
		purplePrimed: map[string]bool{},
		pressed:      map[Point]bool{},
		greenImpacts: map[string]bool{},
		capturedAt:   map[string]time.Time{},
		hitFlash:     map[Point]time.Time{},
	}
}

func colorDistance(a RGB, b RGB) float64 {
	dr := float64(a.R) - float64(b.R)
	dg := float64(a.G) - float64(b.G)
	db := float64(a.B) - float64(b.B)
	return math.Sqrt(dr*dr + dg*dg + db*db)
}

func boolPtr(value bool) *bool {
	return &value
}

func countVisibleGreen(frame []RGB) int {
	count := 0
	for _, color := range frame {
		if color.G > 180 && color.R < 32 && color.B > 40 {
			count++
		}
	}
	return count
}
