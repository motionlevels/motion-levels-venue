package plataformas

import (
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

func TestFetchesParkour2CloudLevelsFromNamedGame(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/level-games/parkour2/levels" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"gameId":"parkour2",
			"levels":[{
				"slug":"level-1",
				"label":"Parkour 2.0",
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

	game := NewWithSeedForGame(time.Unix(100, 0), 1, 1, "medium", "level-1", server.URL, "parkour2")
	if game.level.label != "Parkour 2.0" {
		t.Fatalf("level label = %q, want Parkour 2.0", game.level.label)
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

func TestGreenPlatformDisappearRuleFadesBeforeNextFrame(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Fade green",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		FrameTickMS: 25,
		Rules:       levelRules{GreenPlatformDisappear: true},
		Frames: []rawFrame{
			{Repeat: 40, Cells: []cellTuple{{X: 5, Y: 5, Kind: 0}}},
			{Repeat: 40, Cells: []cellTuple{{X: 5, Y: 5, Kind: 2}}},
		},
	}})
	if err != nil {
		t.Fatal(err)
	}
	game := &Game{level: levels[0], startedAt: time.Unix(100, 0)}
	steady := game.colorAtLocked(Point{X: 5, Y: 5}, game.startedAt.Add(200*time.Millisecond))
	fading := game.colorAtLocked(Point{X: 5, Y: 5}, game.startedAt.Add(900*time.Millisecond))
	if fading.G >= steady.G {
		t.Fatalf("fading green = %+v, steady = %+v; want dimmer before disappearing", fading, steady)
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

func TestCollectAllDoesNotAddPassScoreBonus(t *testing.T) {
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
	if snapshot.Score != 1 {
		t.Fatalf("score = %d, want collected point only", snapshot.Score)
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
