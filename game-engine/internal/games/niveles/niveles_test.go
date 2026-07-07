package niveles

import (
	"math"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestFetchesCloudLevelAndScoresCoin(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/level-games/level-game/levels" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		if r.URL.Query().Get("difficulty") != "medium" {
			t.Fatalf("difficulty query = %q", r.URL.Query().Get("difficulty"))
		}
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"gameId":"level-game",
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

func TestSelectedDifficultySettingsOverrideSharedLevelDifficulty(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/level-games/temporada1-niveles/levels" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		if r.URL.Query().Get("difficulty") != "expert" {
			t.Fatalf("difficulty query = %q", r.URL.Query().Get("difficulty"))
		}
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"gameId":"temporada1-niveles",
			"levels":[{
				"id":"cloud-1",
				"slug":"level-1",
				"label":"Shared board",
				"description":"Same board, per-difficulty rules",
				"difficulty":"medium",
				"life":5,
				"pass_score":2,
				"time_limit_seconds":0,
				"frame_tick_ms":40,
				"rules":{"difficulty_settings":{
					"medium":{"life":5,"gameplay_time_limit_seconds":60,"speed_multiplier":1},
					"expert":{"life":1,"gameplay_time_limit_seconds":12,"speed_multiplier":4}
				}},
				"frames":[{"r":1,"c":[[1,1,1,"coin-a"]]},{"r":1,"c":[[2,2,1,"coin-b"]]}]
			}]
		}`))
	}))
	defer server.Close()

	now := time.Unix(100, 0)
	game := NewWithSeedForGameMode(now, 1, 2, "expert", "level-1", server.URL, "temporada1-niveles", "challenge")
	if got := game.level.lives; got != 1 {
		t.Fatalf("expert lives = %d, want 1", got)
	}
	if got := game.level.timeLimit; got != 12*time.Second {
		t.Fatalf("expert time limit = %v, want 12s", got)
	}
	if got := game.level.frameTick; got != 10*time.Millisecond {
		t.Fatalf("expert frame tick = %v, want 10ms", got)
	}
	frame := game.frameAtLocked(game.startedAt.Add(11 * time.Millisecond))
	if frame == nil {
		t.Fatal("frameAtLocked returned nil")
	}
	if got := frame.points[2][2].kind; got != 1 {
		t.Fatalf("expert speed did not reach second frame, kind = %d", got)
	}
}

func TestExpertSpeedMultiplierAppliesBelowAuthoredMinimumDelay(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/level-games/temporada1-niveles/levels" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		if r.URL.Query().Get("difficulty") != "expert" {
			t.Fatalf("difficulty query = %q", r.URL.Query().Get("difficulty"))
		}
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"gameId":"temporada1-niveles",
			"levels":[{
				"id":"cloud-1",
				"slug":"level-1",
				"label":"Temporada 1 live timing shape",
				"difficulty":"expert",
				"life":1,
				"time_limit_seconds":0,
				"frame_tick_ms":10,
				"rules":{"difficulty_settings":{
					"expert":{"life":1,"speed_multiplier":4}
				}},
				"frames":[{"r":50,"c":[[1,1,1,"coin-a"]]},{"r":50,"c":[[2,2,1,"coin-b"]]}]
			}]
		}`))
	}))
	defer server.Close()

	now := time.Unix(100, 0)
	game := NewWithSeedForGameMode(now, 1, 2, "expert", "level-1", server.URL, "temporada1-niveles", "challenge")
	if got := game.level.frameTick; got != 2500*time.Microsecond {
		t.Fatalf("expert frame tick = %v, want 2.5ms from 10ms / 4x", got)
	}
	if got := game.level.frames[0].duration; got != 125*time.Millisecond {
		t.Fatalf("first frame duration = %v, want 125ms from 500ms / 4x", got)
	}
	firstFrame := game.frameAtLocked(game.startedAt.Add(124 * time.Millisecond))
	if firstFrame == nil {
		t.Fatal("first frameAtLocked returned nil")
	}
	if got := firstFrame.points[1][1].kind; got != 1 {
		t.Fatalf("expert 4x speed left first frame too early, kind = %d", got)
	}
	secondFrame := game.frameAtLocked(game.startedAt.Add(126 * time.Millisecond))
	if secondFrame == nil {
		t.Fatal("second frameAtLocked returned nil")
	}
	if got := secondFrame.points[2][2].kind; got != 1 {
		t.Fatalf("expert 4x speed did not reach second frame, kind = %d", got)
	}
}

func TestSelectedDifficultyDeduplicatesSharedRowsAndPrefersExactDifficulty(t *testing.T) {
	levels, err := compileCloudLevelsForModeWithDifficulty([]cloudLevel{
		{
			Slug:        "level-1",
			Label:       "Shared board hard row",
			Difficulty:  string(DifficultyHard),
			Life:        3,
			FrameTickMS: 25,
			Rules: levelRules{DifficultySettings: map[string]difficultySetting{
				string(DifficultyExpert): {Life: 1, SpeedMultiplier: 4},
			}},
			Frames: []rawFrame{{Repeat: 8, Cells: []cellTuple{{X: 1, Y: 1, Kind: 0}}}},
		},
		{
			Slug:        "level-1",
			Label:       "Shared board expert row",
			Difficulty:  string(DifficultyExpert),
			Life:        1,
			FrameTickMS: 25,
			Rules: levelRules{DifficultySettings: map[string]difficultySetting{
				string(DifficultyExpert): {Life: 1, SpeedMultiplier: 4},
			}},
			Frames: []rawFrame{{Repeat: 8, Cells: []cellTuple{{X: 2, Y: 2, Kind: 1, Uniq: "expert-coin"}}}},
		},
	}, "challenge", string(DifficultyExpert))
	if err != nil {
		t.Fatal(err)
	}
	if len(levels) != 1 {
		t.Fatalf("levels = %d, want one deduplicated level", len(levels))
	}
	if levels[0].label != "Shared board expert row" {
		t.Fatalf("selected label = %q, want exact difficulty row", levels[0].label)
	}
	if levels[0].frames[0].points[2][2].kind != 1 {
		t.Fatalf("selected frame did not come from exact expert row")
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

func TestDefaultLevelTileColorsUseCanonicalSafeGreen(t *testing.T) {
	tests := []struct {
		name string
		kind int
		want RGB
	}{
		{name: "safe", kind: 0, want: animation.SafeZoneGreen},
		{name: "coin", kind: 1, want: RGB{B: 255}},
		{name: "hazard", kind: 2, want: RGB{R: 255}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := colorForPoint(tilePoint{present: true, kind: tt.kind})
			if got != tt.want {
				t.Fatalf("kind %d color = %+v, want %+v", tt.kind, got, tt.want)
			}
		})
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
	if color := settled[28*GridWidth+5]; color != animation.SafeZoneGreen {
		t.Fatalf("settled safe tile color = %+v, want canonical safe green at target position %+v", color, animation.SafeZoneGreen)
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

func TestUnavailableLevelFallbackIsVisibleDuringCountdownAndGameplay(t *testing.T) {
	now := time.Unix(100, 0)
	game := newTestGameWithLevels(fallbackCompiledLevels("level-1"), now)

	countdownFrame := game.Render(now.Add(time.Second))
	if got := countVisibleTiles(countdownFrame); got == 0 {
		t.Fatalf("fallback countdown visible tiles = %d, want visible error marker", got)
	}

	playFrame := game.Render(game.startedAt.Add(tickDuration))
	if got := countVisibleTiles(playFrame); got == 0 {
		t.Fatalf("fallback gameplay visible tiles = %d, want visible error marker", got)
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

func TestDifficultySettingsOverrideRuntimeTimingAndChallengeClock(t *testing.T) {
	rawLevels := []cloudLevel{{
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
	}}
	levels, err := compileCloudLevelsForMode(rawLevels, "challenge")
	if err != nil {
		t.Fatal(err)
	}
	if got := levels[0].lives; got != 4 {
		t.Fatalf("lives = %d, want per-level difficulty lives", got)
	}
	if got := levels[0].timeLimit; got != 90*time.Second {
		t.Fatalf("timeLimit = %s, want 90s", got)
	}
	if got := levels[0].frameTick; got != 20*time.Millisecond {
		t.Fatalf("frameTick = %s, want base 40ms adjusted by 2x speed", got)
	}
	freeLevels, err := compileCloudLevelsForMode(rawLevels, "free")
	if err != nil {
		t.Fatal(err)
	}
	if got := freeLevels[0].lives; got != 4 {
		t.Fatalf("free mode lives = %d, want per-level difficulty lives", got)
	}
	if got := freeLevels[0].timeLimit; got != 0 {
		t.Fatalf("free mode timeLimit = %s, want unlimited", got)
	}
	noLimitChallengeLevels, err := compileCloudLevelsForMode([]cloudLevel{{
		Slug:             "level-1",
		Label:            "No challenge limit",
		Difficulty:       string(DifficultyHard),
		Life:             5,
		TimeLimitSeconds: 300,
		FrameTickMS:      40,
		Rules: levelRules{DifficultySettings: map[string]difficultySetting{
			string(DifficultyHard): {
				Life:                     3,
				GameplayTimeLimitSeconds: 0,
			},
		}},
		Frames: []rawFrame{{Repeat: 2, Cells: []cellTuple{{X: 5, Y: 5, Kind: 0}}}},
	}}, "challenge")
	if err != nil {
		t.Fatal(err)
	}
	if got := noLimitChallengeLevels[0].timeLimit; got != 0 {
		t.Fatalf("challenge mode timeLimit = %s, want unlimited when difficulty setting is 0", got)
	}
	if got := noLimitChallengeLevels[0].lives; got != 3 {
		t.Fatalf("challenge mode lives = %d, want difficulty lives when gameplay lives is 0", got)
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

func TestCompileCloudLevelUsesConfiguredResultAnimations(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Result animations",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		ResultAnimations: resultAnimationsConfig{
			VictoryAnimations: []string{"victory-wave"},
			DefeatAnimations:  []string{"defeat-spark"},
		},
		Frames: []rawFrame{{
			Repeat: 8,
			Cells:  []cellTuple{{X: 4, Y: 4, Kind: 1, Uniq: "coin-a"}},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}

	if got := levels[0].victoryAnimations; len(got) != 1 || got[0] != "victory-wave" {
		t.Fatalf("victoryAnimations = %#v, want [victory-wave]", got)
	}
	if got := levels[0].defeatAnimations; len(got) != 1 || got[0] != "defeat-spark" {
		t.Fatalf("defeatAnimations = %#v, want [defeat-spark]", got)
	}
}

func TestCustomVictoryAnimationUsesLatestSelectedCatalogAnimation(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		switch r.URL.Path {
		case "/api/level-games/temporada1-niveles/levels":
			_, _ = w.Write([]byte(`{"levels":[{
				"slug":"level-1",
				"label":"Game pass result",
				"difficulty":"medium",
				"life":5,
				"pass_score":0,
				"frame_tick_ms":25,
				"result_animations":{
					"victory_animations":["game-pass"]
				},
				"frames":[{"r":20,"c":[[5,5,1,"coin-a"]]}]
			}]}`))
		case "/api/level-games/animations/levels":
			if got := r.URL.Query().Get("summary"); got != "0" {
				t.Fatalf("animation summary = %q, want 0", got)
			}
			_, _ = w.Write([]byte(`{"levels":[{
				"slug":"game-pass",
				"label":"Game Pass",
				"difficulty":"medium",
				"frame_tick_ms":50,
				"tile_effects":{"1":{"label":"Gold","color":"#123456","press":"none"}},
				"rules":{"catalog_featured":true},
				"frames":[{"r":20,"c":[[5,5,1]]}]
			}]}`))
		default:
			http.NotFound(w, r)
		}
	}))
	defer server.Close()

	now := time.Unix(100, 0)
	game := NewWithSeedForGameMode(now, 1, 1, "medium", "level-1", server.URL, "temporada1-niveles", "challenge")
	playAt := now.Add(countdownDuration + tickDuration)
	game.Press(whackamole.PressEvent{X: 5, Y: 5, Pressed: true}, playAt)

	got := game.Render(playAt.Add(100 * time.Millisecond))[5*GridWidth+5]
	if got != (RGB{R: 0x12, G: 0x34, B: 0x56}) {
		t.Fatalf("result animation color = %+v, want catalog Game Pass color", got)
	}
	configured := []string{"victory-pulse", "game-pass"}
	stable := chosenResultAnimation(configured, "victory-pulse", now)
	if again := chosenResultAnimation(configured, "victory-pulse", now); again != stable {
		t.Fatalf("chosen result animation not stable for a fixed end time: %q then %q", stable, again)
	}
	if stable != "victory-pulse" && stable != "game-pass" {
		t.Fatalf("chosen result animation = %q, want one of the configured animations", stable)
	}
	seen := map[string]bool{}
	for offset := 0; offset < 200; offset++ {
		seen[chosenResultAnimation(configured, "victory-pulse", now.Add(time.Duration(offset)*time.Millisecond))] = true
	}
	if len(seen) < 2 {
		t.Fatalf("chosen result animation never varied across end times: %v", seen)
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

func TestMovingHazardUnderPressedTileQueuesDamageCue(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Moving hazard",
		Difficulty:  string(DifficultyMedium),
		Life:        3,
		FrameTickMS: 25,
		Frames: []rawFrame{
			{Repeat: 5, Cells: []cellTuple{{X: 4, Y: 4, Kind: 0}}},
			{Repeat: 5, Cells: []cellTuple{{X: 4, Y: 4, Kind: 2}}},
		},
	}})
	if err != nil {
		t.Fatal(err)
	}

	now := time.Unix(100, 0)
	game := newTestGameWithLevels(levels, now)
	playAt := game.startedAt.Add(10 * time.Millisecond)
	if events := game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt); len(events) != 0 {
		t.Fatalf("initial events = %+v, want none on safe tile", events)
	}

	game.Render(game.startedAt.Add(150 * time.Millisecond))
	events := game.DrainEvents()
	if len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("drained events = %+v, want damage cue", events)
	}
	if got := game.Snapshot(game.startedAt.Add(151 * time.Millisecond)).Lives; got != 2 {
		t.Fatalf("lives = %d, want 2", got)
	}
	if events := game.DrainEvents(); len(events) != 0 {
		t.Fatalf("second drain events = %+v, want none", events)
	}
}

func TestRedDamageDefaultsToPerTileNoMercy(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "No mercy hazards",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Frames: []rawFrame{{
			Repeat: 8,
			Cells: []cellTuple{
				{X: 4, Y: 4, Kind: 2},
				{X: 5, Y: 4, Kind: 2},
			},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}

	game := newTestGameWithLevels(levels, time.Unix(100, 0))
	playAt := game.startedAt.Add(10 * time.Millisecond)
	if events := game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt); len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("first damage events = %+v, want damage cue", events)
	}
	if events := game.Press(whackamole.PressEvent{X: 5, Y: 4, Pressed: true}, playAt); len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("adjacent damage events = %+v, want second damage cue", events)
	}
	if got := game.Snapshot(playAt).Lives; got != 3 {
		t.Fatalf("lives after adjacent hazards = %d, want 3", got)
	}
	game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: false}, playAt.Add(50*time.Millisecond))
	if events := game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt.Add(100*time.Millisecond)); len(events) != 0 {
		t.Fatalf("same tile quick re-press events = %+v, want none", events)
	}
	if got := game.Snapshot(playAt.Add(100 * time.Millisecond)).Lives; got != 3 {
		t.Fatalf("lives after same tile quick re-press = %d, want 3", got)
	}
}

func TestRedDamageGracePeriodSharesCooldownAcrossTiles(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Grace hazards",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Rules:       levelRules{RedDamageGracePeriod: boolPtr(true)},
		Frames: []rawFrame{{
			Repeat: 8,
			Cells: []cellTuple{
				{X: 4, Y: 4, Kind: 2},
				{X: 5, Y: 4, Kind: 2},
			},
		}},
	}})
	if err != nil {
		t.Fatal(err)
	}

	game := newTestGameWithLevels(levels, time.Unix(100, 0))
	playAt := game.startedAt.Add(10 * time.Millisecond)
	if events := game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: true}, playAt); len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("first damage events = %+v, want damage cue", events)
	}
	game.Press(whackamole.PressEvent{X: 4, Y: 4, Pressed: false}, playAt.Add(50*time.Millisecond))
	if events := game.Press(whackamole.PressEvent{X: 5, Y: 4, Pressed: true}, playAt.Add(100*time.Millisecond)); len(events) != 0 {
		t.Fatalf("grace-period adjacent events = %+v, want none", events)
	}
	if got := game.Snapshot(playAt.Add(100 * time.Millisecond)).Lives; got != 4 {
		t.Fatalf("lives during grace period = %d, want 4", got)
	}
	game.Press(whackamole.PressEvent{X: 5, Y: 4, Pressed: false}, playAt.Add(150*time.Millisecond))
	if events := game.Press(whackamole.PressEvent{X: 5, Y: 4, Pressed: true}, playAt.Add(damageCooldown+10*time.Millisecond)); len(events) != 1 || events[0].Cue != whackamole.CueDamage {
		t.Fatalf("post-grace adjacent events = %+v, want damage cue", events)
	}
	if got := game.Snapshot(playAt.Add(damageCooldown + 10*time.Millisecond)).Lives; got != 3 {
		t.Fatalf("lives after grace expires = %d, want 3", got)
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
		if color.G >= 198 && color.R == 0 && color.B == 0 {
			count++
		}
	}
	return count
}

func countVisibleTiles(frame []RGB) int {
	count := 0
	for _, color := range frame {
		if color != (RGB{}) {
			count++
		}
	}
	return count
}
