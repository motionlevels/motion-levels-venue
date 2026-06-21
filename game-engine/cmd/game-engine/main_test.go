package main

import (
	"bytes"
	"context"
	"encoding/binary"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sync"
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/audio"
	"github.com/lobis/motion-levels/game-engine/internal/games/memorychallenge"
	"github.com/lobis/motion-levels/game-engine/internal/games/plataformas"
	"github.com/lobis/motion-levels/game-engine/internal/games/temporada1"
	"github.com/lobis/motion-levels/game-engine/internal/games/temporada2"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/lobis/motion-levels/game-engine/internal/sessionrecording"
	"github.com/lobis/motion-levels/packages/contracts/gamepb"
	"github.com/lobis/motion-levels/packages/contracts/inputpb"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
)

func TestMakeFrameProducesCompleteLogicalBoard(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "lava"}, nil, nil)
	frame := makeFrame(7, time.Unix(0, 123), 1.25, runtime)
	if frame.Sequence != 7 || frame.Width != 16 || frame.Height != 32 {
		t.Fatalf("unexpected frame metadata: %+v", frame)
	}
	if frame.SessionId == "" || frame.GameFrameSequence != 7 || frame.GameUnixNanos != 123 {
		t.Fatalf("unexpected frame lineage: %+v", frame)
	}
	if len(frame.Tiles) != 16*32 {
		t.Fatalf("tile count = %d, want %d", len(frame.Tiles), 16*32)
	}
}

func TestMakeFrameOmitsSessionLineageForAmbientGames(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "salvapantallas"}, nil, nil)
	frame := makeFrame(7, time.Unix(0, 123), 1.25, runtime)

	if frame.SessionId != "" || frame.VenueSessionId != "" {
		t.Fatalf("ambient frame lineage = session %q venue %q, want empty", frame.SessionId, frame.VenueSessionId)
	}
}

func TestReplayCatchUpFramesRepeatPreviousSessionFrame(t *testing.T) {
	started := time.Unix(100, 0)
	previous := &recordingpb.FrameRecord{
		Sequence:          7,
		UnixNanos:         started.UnixNano(),
		Width:             2,
		Height:            1,
		SessionId:         "session-1",
		VenueSessionId:    "venue-1",
		GameFrameSequence: 7,
		GameUnixNanos:     started.UnixNano(),
		Tiles: []*recordingpb.TileState{
			{X: 0, Y: 0, R: 10, G: 20, B: 30},
			{X: 1, Y: 0, R: 40, G: 50, B: 60},
		},
	}
	current := cloneFrameRecord(previous)
	current.Sequence = 8
	current.GameFrameSequence = 8
	current.UnixNanos = started.Add(70 * time.Millisecond).UnixNano()
	current.GameUnixNanos = current.UnixNanos

	catchUps := replayCatchUpFrames(previous, current, 20*time.Millisecond)
	if len(catchUps) != 3 {
		t.Fatalf("catch-up frames = %d, want 3", len(catchUps))
	}
	for i, frame := range catchUps {
		wantSequence := uint64(8 + i)
		if frame.Sequence != wantSequence || frame.GameFrameSequence != wantSequence {
			t.Fatalf("catch-up %d sequence = %d/%d, want %d", i, frame.Sequence, frame.GameFrameSequence, wantSequence)
		}
		wantUnix := started.Add(time.Duration(i+1) * 20 * time.Millisecond).UnixNano()
		if frame.UnixNanos != wantUnix || frame.GameUnixNanos != wantUnix {
			t.Fatalf("catch-up %d unix = %d/%d, want %d", i, frame.UnixNanos, frame.GameUnixNanos, wantUnix)
		}
	}
	if current.Sequence != 11 || current.GameFrameSequence != 11 {
		t.Fatalf("current sequence = %d/%d, want 11", current.Sequence, current.GameFrameSequence)
	}
	catchUps[0].Tiles[0].R = 99
	if previous.Tiles[0].R == 99 {
		t.Fatal("catch-up frame reused previous tile pointers")
	}
}

func TestReplayCatchUpFramesSkipSessionChanges(t *testing.T) {
	previous := &recordingpb.FrameRecord{
		Sequence:  7,
		UnixNanos: time.Unix(0, 0).UnixNano(),
		SessionId: "session-1",
	}
	current := &recordingpb.FrameRecord{
		Sequence:  8,
		UnixNanos: time.Unix(0, int64(70*time.Millisecond)).UnixNano(),
		SessionId: "session-2",
	}
	if got := replayCatchUpFrames(previous, current, 20*time.Millisecond); len(got) != 0 {
		t.Fatalf("catch-up frames across session change = %d, want 0", len(got))
	}
	if current.Sequence != 8 {
		t.Fatalf("current sequence changed to %d across session boundary", current.Sequence)
	}
}

func TestCountdownFloorOverlayIsOptIn(t *testing.T) {
	disabled := newGameRuntime(config{Brightness: 100, PlayerCount: 2, Game: "temporada1", Difficulty: "medium", Level: "level-1"}, nil, nil)
	disabledFrame := makeFrame(1, disabled.started.Add(500*time.Millisecond), 0, disabled)
	if got := countCountdownYellowTiles(disabledFrame); got != 0 {
		t.Fatalf("disabled countdown overlay yellow tiles = %d, want 0", got)
	}

	enabled := newGameRuntime(config{Brightness: 100, PlayerCount: 2, Game: "temporada1", Difficulty: "medium", Level: "level-1", CountdownFloorOverlay: true}, nil, nil)
	enabledFrame := makeFrame(2, enabled.started.Add(500*time.Millisecond), 0, enabled)
	if got := countCountdownYellowTiles(enabledFrame); got == 0 {
		t.Fatal("enabled countdown overlay did not draw yellow digit tiles")
	}
}

func TestLevelGameVictoryAdvancesToNextCountdownWithOverlay(t *testing.T) {
	platform := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		switch r.URL.Path {
		case "/api/level-games/temporada1-niveles/levels":
			_, _ = w.Write([]byte(`{
			"gameId":"temporada1-niveles",
			"levels":[{
				"slug":"level-1",
				"label":"Nivel 1",
				"difficulty":"medium",
				"life":5,
				"frame_tick_ms":25,
				"frames":[{"r":8,"c":[[5,5,1,"coin-a"]]}]
			},{
				"slug":"level-2",
				"label":"Nivel 2",
				"difficulty":"medium",
				"life":5,
				"frame_tick_ms":25,
				"frames":[{"r":8,"c":[[4,28,0],[6,5,1,"coin-b"]]}]
			}]
		}`))
		case "/api/game-runtime":
			_, _ = w.Write([]byte(`{"games":[]}`))
		case "/api/level-games/animations/levels":
			_, _ = w.Write([]byte(`{"gameId":"animations","levels":[]}`))
		default:
			http.NotFound(w, r)
		}
	}))
	defer platform.Close()

	runtime := newGameRuntime(config{
		Brightness:            100,
		PlayerCount:           1,
		Game:                  "temporada1-niveles",
		Difficulty:            "medium",
		Level:                 "level-1",
		PlatformURL:           platform.URL,
		CountdownFloorOverlay: true,
		ControllerLabel:       "Sala Test",
		ControllerHostname:    "motionlevels-test",
		DisplaySnapshotFPS:    4,
		CameraRecorderTimeout: time.Second,
	}, nil, nil)
	countdown := runtime.DisplayStatus(runtime.started.Add(500 * time.Millisecond))
	if countdown.Phase != "countdown" || countdown.Level != "level-1" {
		t.Fatalf("initial status = %+v, want level 1 countdown", countdown)
	}
	runtime.RecordDisplaySnapshot(countdown, runtime.started.Add(500*time.Millisecond))

	playAt := runtime.started.Add(3*time.Second + 50*time.Millisecond)
	runtime.HandlePressure(&inputpb.PressureEvent{
		X:         5,
		Y:         5,
		Pressed:   true,
		UnixNanos: playAt.UnixNano(),
	}, playAt)

	finished := runtime.DisplayStatus(playAt)
	if finished.Phase != "finished" || !finished.Success || finished.Level != "level-1" {
		t.Fatalf("finished status = %+v, want level 1 success", finished)
	}
	runtime.RecordDisplaySnapshot(finished, playAt)

	nextCountdownAt := playAt.Add(1250*time.Millisecond + time.Millisecond)
	next := runtime.DisplayStatus(nextCountdownAt)
	if next.Phase != "countdown" || next.Level != "level-2" || next.Success || next.CountdownRemainingMillis <= 0 {
		t.Fatalf("next status = %+v, want level 2 countdown", next)
	}
	runtime.RecordDisplaySnapshot(next, nextCountdownAt)
	status := runtime.Status()
	if len(status.FinishedLevelAttempts) != 1 {
		t.Fatalf("finished attempts = %d, want 1: %+v", len(status.FinishedLevelAttempts), status.FinishedLevelAttempts)
	}
	attempt := status.FinishedLevelAttempts[0]
	if attempt.Game != "temporada1-niveles" || attempt.Level != "level-1" || !attempt.Success || attempt.Result != "success" {
		t.Fatalf("finished attempt = %+v, want level 1 success", attempt)
	}

	frame := makeFrame(99, nextCountdownAt, 0, runtime)
	if got := countCountdownYellowTiles(frame); got == 0 {
		t.Fatal("next level countdown overlay did not draw yellow digit tiles")
	}
}

func TestCountdownOverlayDigit(t *testing.T) {
	tests := map[int64]int{
		2500: 3,
		1500: 2,
		500:  1,
		0:    0,
	}
	for remaining, want := range tests {
		if got := countdownOverlayDigit(remaining); got != want {
			t.Fatalf("countdownOverlayDigit(%d) = %d, want %d", remaining, got, want)
		}
	}
}

func TestCountdownOverlayDigitUsesFloorSpaceOrientation(t *testing.T) {
	frame := make([]animation.RGB, animation.GridWidth*animation.GridHeight)
	drawCountdownDigit(frame, 3)

	minX, minY := animation.GridWidth, animation.GridHeight
	maxX, maxY := -1, -1
	for i, tile := range frame {
		if tile.R != 255 || tile.G != 224 || tile.B != 32 {
			continue
		}
		x := i % animation.GridWidth
		y := i / animation.GridWidth
		if x < minX {
			minX = x
		}
		if x > maxX {
			maxX = x
		}
		if y < minY {
			minY = y
		}
		if y > maxY {
			maxY = y
		}
	}
	if maxX < 0 {
		t.Fatal("countdown digit did not draw any yellow tiles")
	}
	width := maxX - minX + 1
	height := maxY - minY + 1
	if width != 8 || height != 12 {
		t.Fatalf("countdown digit bounds = %dx%d, want compact floor-space 8x12", width, height)
	}
}

func countCountdownYellowTiles(frame *recordingpb.FrameRecord) int {
	count := 0
	for _, tile := range frame.GetTiles() {
		if tile.GetR() == 255 && tile.GetG() == 224 && tile.GetB() == 32 {
			count++
		}
	}
	return count
}

func TestAmbientActivityClassifierDoesNotTreatUnknownGamesAsAmbient(t *testing.T) {
	if isAmbientActivityGame("new-competitive-game") {
		t.Fatal("unknown gameplay id was classified as ambient")
	}
	if !isAmbientActivityGame("animations") || !isAmbientActivityGame("ambient-pulse") || !isAmbientActivityGame("animation-custom") {
		t.Fatal("known ambient ids were not classified as ambient")
	}
}

func TestConfigNormalizeClampsPlaybackSettings(t *testing.T) {
	cfg := config{FPS: 0, Brightness: 200, MusicVolume: 2, CueVolume: -1, PlayerCount: 99, Difficulty: "wild"}
	cfg.normalize()

	if cfg.FPS != 1 {
		t.Fatalf("fps = %d, want 1", cfg.FPS)
	}
	if cfg.Brightness != 100 {
		t.Fatalf("brightness = %d, want 100", cfg.Brightness)
	}
	if cfg.MusicVolume != 1 {
		t.Fatalf("music volume = %v, want 1", cfg.MusicVolume)
	}
	if cfg.CueVolume != 0 {
		t.Fatalf("cue volume = %v, want 0", cfg.CueVolume)
	}
	if cfg.PlayerCount != 6 {
		t.Fatalf("players = %d, want 6", cfg.PlayerCount)
	}
	if cfg.Difficulty != "easy" {
		t.Fatalf("difficulty = %q, want easy", cfg.Difficulty)
	}
}

func TestAudioPlayerDisabledByDefault(t *testing.T) {
	player, err := config{}.audioPlayer()
	if err != nil {
		t.Fatal(err)
	}
	if player != nil {
		t.Fatal("audio player should be nil when audio is disabled")
	}
}

func TestWhackAMoleUsesFocusedGameMusic(t *testing.T) {
	cfg := config{Game: "mole", MusicRef: "Motion/canciones/Background01.mp3", MusicVolume: 0.5, PlayerCount: 1}
	cfg.normalize()

	if cfg.Game != "whack-a-mole" {
		t.Fatalf("game = %q, want whack-a-mole", cfg.Game)
	}
	if cfg.MusicRef != "Motion/canciones/Musica8.mp3" {
		t.Fatalf("music = %q, want Musica8", cfg.MusicRef)
	}
	if cfg.MusicVolume != 0.12 {
		t.Fatalf("music volume = %v, want 0.12", cfg.MusicVolume)
	}
}

func TestConfigForSelectionUsesGameDefaults(t *testing.T) {
	base := config{Brightness: 80, PlayerCount: 1, MusicRef: "custom.mp3", MusicVolume: 0.5}

	mole := configForSelection(base, "mole", 4)
	if mole.Game != "whack-a-mole" || mole.PlayerCount != 4 {
		t.Fatalf("mole selection = %+v", mole)
	}
	if mole.MusicRef != "Motion/canciones/Musica8.mp3" {
		t.Fatalf("mole music = %q, want Musica8", mole.MusicRef)
	}
	if mole.NarrationCueRef != "Motion/narraciones/atrapa-topos-intro.mp3" {
		t.Fatalf("mole narration = %q, want atrapa-topos intro", mole.NarrationCueRef)
	}

	lava := configForSelection(base, "el-suelo-es-lava", 3)
	if lava.Game != "lava" || lava.PlayerCount != 3 {
		t.Fatalf("lava selection = %+v", lava)
	}
	if lava.MusicRef != "Motion/canciones/Background07.mp3" {
		t.Fatalf("lava music = %q, want Background07", lava.MusicRef)
	}
	if lava.MusicVolume != 0.20 {
		t.Fatalf("lava music volume = %v, want 0.20", lava.MusicVolume)
	}
	if lava.NarrationCueRef != "Motion/narraciones/lava-intro.mp3" {
		t.Fatalf("lava narration = %q, want lava intro", lava.NarrationCueRef)
	}

	saltos := configForSelection(base, "jump", 4)
	if saltos.Game != "saltos" || saltos.PlayerCount != 1 || saltos.Level != "starter" {
		t.Fatalf("saltos selection = %+v", saltos)
	}
	if saltos.MusicRef != "Motion/canciones/Background07.mp3" {
		t.Fatalf("saltos music = %q, want Background07", saltos.MusicRef)
	}

	parkour := configForSelection(base, "parkour", 4)
	if parkour.Game != "parkour" || parkour.PlayerCount != 1 || parkour.Level != "level-1" {
		t.Fatalf("parkour selection = %+v", parkour)
	}
	if parkour.MusicRef != "Motion/canciones/Background07.mp3" {
		t.Fatalf("parkour music = %q, want Background07", parkour.MusicRef)
	}

	season := configForSelection(base, "temporada-1", 4)
	if season.Game != "temporada1" || season.PlayerCount != 4 || season.Level != "level-1" {
		t.Fatalf("temporada1 selection = %+v", season)
	}
	if season.MusicRef != "Motion/canciones/Background07.mp3" {
		t.Fatalf("temporada1 music = %q, want Background07", season.MusicRef)
	}

	seasonLevels := configForSelection(base, "season1-levels", 4)
	if seasonLevels.Game != "temporada1-niveles" || seasonLevels.PlayerCount != 4 || seasonLevels.Level != "level-1" {
		t.Fatalf("temporada1-niveles selection = %+v", seasonLevels)
	}
	if seasonLevels.MusicRef != plataformas.DefaultMusicRef || seasonLevels.MusicVolume != plataformas.DefaultMusicVolume {
		t.Fatalf("temporada1-niveles music = %q %.2f, want %q %.2f", seasonLevels.MusicRef, seasonLevels.MusicVolume, plataformas.DefaultMusicRef, plataformas.DefaultMusicVolume)
	}

	season2 := configForSelection(base, "temporada-2", 4)
	if season2.Game != "temporada2" || season2.PlayerCount != 4 || season2.Level != "level-1" || season2.Difficulty != "easy" {
		t.Fatalf("temporada2 selection = %+v", season2)
	}
	if season2.MusicRef != temporada2.DefaultMusicRef || season2.MusicVolume != temporada2.DefaultMusicVolume {
		t.Fatalf("temporada2 music = %q %.2f, want %q %.2f", season2.MusicRef, season2.MusicVolume, temporada2.DefaultMusicRef, temporada2.DefaultMusicVolume)
	}

	duel := configForSelection(base, "duelo", 6)
	if duel.Game != "duel" || duel.PlayerCount != 4 {
		t.Fatalf("duel selection = %+v", duel)
	}
	if duel.MusicRef != "Motion/canciones/Musica8.mp3" {
		t.Fatalf("duel music = %q, want Musica8", duel.MusicRef)
	}

	memory := configForSelection(base, "memoria", 6)
	if memory.Game != "memory" || memory.PlayerCount != 4 {
		t.Fatalf("memory selection = %+v", memory)
	}
	if memory.MusicRef != memorychallenge.DefaultMusicRef || memory.MusicVolume != memorychallenge.DefaultMusicVolume {
		t.Fatalf("memory music = %q %.2f, want %q %.2f", memory.MusicRef, memory.MusicVolume, memorychallenge.DefaultMusicRef, memorychallenge.DefaultMusicVolume)
	}

	screensaver := configForSelection(base, "salvapantallas", 6)
	if screensaver.Game != "salvapantallas" {
		t.Fatalf("screensaver game = %q", screensaver.Game)
	}
	if screensaver.MusicRef != "Motion/canciones/Background01.mp3" {
		t.Fatalf("screensaver music = %q, want Background01", screensaver.MusicRef)
	}
	comet := configForSelection(base, "ambient-comet", 1)
	if comet.Game != "ambient-comet" {
		t.Fatalf("ambient game = %q, want ambient-comet", comet.Game)
	}
	if comet.MusicRef != "Motion/canciones/Background01.mp3" {
		t.Fatalf("ambient music = %q, want Background01", comet.MusicRef)
	}
}

func TestNormalizeProvidesFocusedGameMusicAndCueFallbacks(t *testing.T) {
	cfg := config{Game: "temporada1", MusicRef: "", CoinCueRef: "coin.wav"}
	cfg.normalize()
	if cfg.MusicRef != temporada1.DefaultMusicRef || cfg.MusicVolume != temporada1.DefaultMusicVolume {
		t.Fatalf("temporada1 music = %q %.2f, want %q %.2f", cfg.MusicRef, cfg.MusicVolume, temporada1.DefaultMusicRef, temporada1.DefaultMusicVolume)
	}
	if cfg.DoubleCoinCueRef != "coin.wav" {
		t.Fatalf("double coin fallback = %q, want coin.wav", cfg.DoubleCoinCueRef)
	}
}

func TestReusableTileCueRefsAndDoubleCoinBurst(t *testing.T) {
	dir := t.TempDir()
	coinPath := filepath.Join(dir, "coin.wav")
	damagePath := filepath.Join(dir, "damage.wav")
	for _, path := range []string{coinPath, damagePath} {
		if err := os.WriteFile(path, []byte("audio"), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	backend := &recordingBackend{}
	player := audio.NewPlayer(dir, backend)
	cfg := config{
		CueVolume:        0.18,
		CoinCueRef:       "coin.wav",
		DoubleCoinCueRef: "coin.wav",
		DamageCueRef:     "damage.wav",
	}
	cfg.normalize()

	if got := cueRef(cfg, whackamole.CueCoin); got != cfg.CoinCueRef {
		t.Fatalf("coin cue ref = %q", got)
	}
	if got := cueRef(cfg, whackamole.CueDoubleCoin); got != cfg.DoubleCoinCueRef {
		t.Fatalf("double coin cue ref = %q", got)
	}
	if got := cueRef(cfg, whackamole.CueDamage); got != cfg.DamageCueRef {
		t.Fatalf("damage cue ref = %q", got)
	}
	if got := cueRef(cfg, whackamole.CueDefeat); got != cfg.DamageCueRef {
		t.Fatalf("defeat fallback cue ref = %q", got)
	}
	cfg.PressureCueRef = "pressure.wav"
	if got := cueRef(cfg, whackamole.CuePressure); got != cfg.PressureCueRef {
		t.Fatalf("pressure cue ref = %q", got)
	}

	for i := 0; i < 3; i++ {
		playCue(cfg, player, whackamole.CueDoubleCoin, cueRef(cfg, whackamole.CueDoubleCoin))
	}
	backend.waitForCount(t, coinPath, 6)
}

func TestPlataformasRuntimeUsesCloudLevelAudioRefs(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/api/game-runtime" {
			w.Header().Set("content-type", "application/json")
			_, _ = w.Write([]byte(`{"games":[]}`))
			return
		}
		if r.URL.Path == "/api/level-games/animations/levels" {
			w.Header().Set("content-type", "application/json")
			_, _ = w.Write([]byte(`{"gameId":"animations","levels":[]}`))
			return
		}
		if r.URL.Path != "/api/level-games/plataformas/levels" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"gameId":"plataformas",
			"levels":[{
				"id":"cloud-1",
				"slug":"level-1",
				"label":"Nivel nube",
				"description":"Nivel con audio personalizado",
				"difficulty":"medium",
				"life":5,
				"pass_score":2,
				"time_limit_seconds":0,
				"frame_tick_ms":25,
				"music_ref":"Motion/canciones/Musica8.mp3",
				"music_volume":0.27,
				"coin_cue_ref":"Motion/sonidos/coin.wav",
				"double_coin_cue_ref":"Motion/sonidos/coin-doble.wav",
				"damage_cue_ref":"Motion/sonidos/fallo.mp3",
				"win_cue_ref":"Motion/sonidos/victoria.mp3",
				"defeat_cue_ref":"Motion/sonidos/derrota.mp3",
				"frames":[{"r":8,"c":[[7,14,0],[4,4,1,"coin-a"]]}]
			}]
		}`))
	}))
	defer server.Close()

	runtime := newGameRuntime(config{
		Game:               "plataformas",
		Difficulty:         "medium",
		Level:              "level-1",
		PlayerCount:        1,
		PlatformURL:        server.URL,
		MusicRef:           loopMusicRef,
		MusicVolume:        0.10,
		CoinCueRef:         "Motion/sonidos/default-coin.wav",
		DamageCueRef:       "Motion/sonidos/default-damage.wav",
		WinCueRef:          "Motion/sonidos/default-win.wav",
		DefeatCueRef:       "Motion/sonidos/default-defeat.wav",
		CueVolume:          0.18,
		Brightness:         80,
		FPS:                20,
		DisplaySnapshotFPS: 4,
	}, nil, nil)

	status := runtime.Status()
	if status.Music != "Motion/canciones/Musica8.mp3" || status.MusicVolume != 0.27 {
		t.Fatalf("status music = %q %.2f, want cloud audio", status.Music, status.MusicVolume)
	}
	refs := runtime.current
	if refs.CoinCueRef != "Motion/sonidos/coin.wav" || refs.DoubleCoinCueRef != "Motion/sonidos/coin-doble.wav" {
		t.Fatalf("runtime cues = %+v, want cloud cues", refs)
	}
	if refs.DefeatCueRef != "Motion/sonidos/derrota.mp3" {
		t.Fatalf("runtime defeat cue = %q, want cloud cue", refs.DefeatCueRef)
	}
	if got := plataformas.DefaultMusicRef; got == status.Music {
		t.Fatalf("status music = default %q, want cloud override", got)
	}
}

func TestSelectPlatformLevelGameByUUIDUsesLaunchPlatformURL(t *testing.T) {
	gameID := "8b20d467-b2d1-4d62-9ef3-8455adb61393"
	var fetchedPath string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/api/game-runtime" {
			w.Header().Set("content-type", "application/json")
			_, _ = w.Write([]byte(`{"games":[]}`))
			return
		}
		if r.URL.Path == "/api/level-games/animations/levels" {
			w.Header().Set("content-type", "application/json")
			_, _ = w.Write([]byte(`{"gameId":"animations","levels":[]}`))
			return
		}
		fetchedPath = r.URL.Path
		if r.URL.Path != "/api/level-games/"+gameID+"/levels" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		if r.URL.Query().Get("difficulty") != "medium" {
			t.Fatalf("difficulty = %s", r.URL.Query().Get("difficulty"))
		}
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"gameId":"` + gameID + `",
			"levels":[{
				"id":"cloud-uuid-1",
				"slug":"level-2",
				"label":"UUID Parkour",
				"description":"Selected through platform UUID",
				"difficulty":"medium",
				"life":5,
				"pass_score":1,
				"time_limit_seconds":0,
				"frame_tick_ms":25,
				"frames":[{"r":8,"c":[[1,1,1,"coin-a"]]}]
			}]
		}`))
	}))
	defer server.Close()

	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	api := httptest.NewServer(gameAPIHandler(runtime))
	defer api.Close()

	body := bytes.NewBufferString(`{"game":"` + gameID + `","platformUrl":"` + server.URL + `","playerCount":1,"difficulty":"medium","level":"level-2"}`)
	response, err := http.Post(api.URL+"/api/select", "application/json", body)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("select response = %d", response.StatusCode)
	}
	var status runtimeStatus
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if status.CurrentGame != gameID || status.Level != "level-2" || status.Label != "UUID Parkour" {
		t.Fatalf("status = %+v, want UUID platform game", status)
	}
	if fetchedPath != "/api/level-games/"+gameID+"/levels" {
		t.Fatalf("fetched path = %q", fetchedPath)
	}
}

func TestSelectPlatformLevelGameByUUIDIgnoresLoopbackLaunchPlatformURLWhenConfigured(t *testing.T) {
	gameID := "8b20d467-b2d1-4d62-9ef3-8455adb61393"
	var fetchedPath string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/api/game-runtime" {
			w.Header().Set("content-type", "application/json")
			_, _ = w.Write([]byte(`{"games":[]}`))
			return
		}
		if r.URL.Path == "/api/level-games/animations/levels" {
			w.Header().Set("content-type", "application/json")
			_, _ = w.Write([]byte(`{"gameId":"animations","levels":[]}`))
			return
		}
		fetchedPath = r.URL.Path
		if r.URL.Path != "/api/level-games/"+gameID+"/levels" {
			t.Fatalf("path = %s", r.URL.Path)
		}
		w.Header().Set("content-type", "application/json")
		_, _ = w.Write([]byte(`{
			"gameId":"` + gameID + `",
			"levels":[{
				"id":"cloud-uuid-configured",
				"slug":"level-1",
				"label":"Configured Platform Parkour",
				"description":"Selected from the venue configured platform URL",
				"difficulty":"medium",
				"life":5,
				"pass_score":1,
				"time_limit_seconds":0,
				"frame_tick_ms":25,
				"frames":[{"r":8,"c":[[1,1,1,"coin-a"]]}]
			}]
		}`))
	}))
	defer server.Close()

	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, PlatformURL: server.URL}, nil, nil)
	api := httptest.NewServer(gameAPIHandler(runtime))
	defer api.Close()

	body := bytes.NewBufferString(`{"game":"` + gameID + `","platformUrl":"http://localhost:3000","playerCount":1,"difficulty":"medium","level":"level-1"}`)
	response, err := http.Post(api.URL+"/api/select", "application/json", body)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("select response = %d", response.StatusCode)
	}
	var status runtimeStatus
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if status.CurrentGame != gameID || status.Level != "level-1" || status.Label != "Configured Platform Parkour" {
		t.Fatalf("status = %+v, want configured platform game", status)
	}
	if fetchedPath != "/api/level-games/"+gameID+"/levels" {
		t.Fatalf("fetched path = %q", fetchedPath)
	}
}

func TestGameAPIStatusAndSelect(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	healthResponse, err := http.Head(server.URL + "/api/health")
	if err != nil {
		t.Fatal(err)
	}
	defer healthResponse.Body.Close()
	if healthResponse.StatusCode != http.StatusOK {
		t.Fatalf("health response = %d", healthResponse.StatusCode)
	}

	response, err := http.Get(server.URL + "/api/status")
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("status response = %d", response.StatusCode)
	}

	var status runtimeStatus
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if len(status.Catalog) != 17 {
		t.Fatalf("catalog = %d entries, want 17", len(status.Catalog))
	}
	if !catalogHasGame(status.Catalog, "salvapantallas") {
		t.Fatal("catalog missing salvapantallas")
	}
	if !catalogHasGame(status.Catalog, "temporada1-niveles") {
		t.Fatal("catalog missing temporada1-niveles")
	}

	menuStateBody := bytes.NewBufferString(`{"kioskId":"kiosk-test","snapshot":{"screenMode":"browse","message":"ready"}}`)
	response, err = http.Post(server.URL+"/api/menu-state", "application/json", menuStateBody)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("menu state response = %d", response.StatusCode)
	}
	var menuState menuStateSnapshot
	if err := json.NewDecoder(response.Body).Decode(&menuState); err != nil {
		t.Fatal(err)
	}
	if menuState.KioskID != "kiosk-test" || menuState.Version == 0 || len(menuState.Snapshot) == 0 {
		t.Fatalf("menu state = %+v, want stored snapshot", menuState)
	}
	response, err = http.Get(server.URL + "/api/menu-state")
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("menu state get response = %d", response.StatusCode)
	}
	var fetchedMenuState menuStateSnapshot
	if err := json.NewDecoder(response.Body).Decode(&fetchedMenuState); err != nil {
		t.Fatal(err)
	}
	if fetchedMenuState.Version != menuState.Version || string(fetchedMenuState.Snapshot) != string(menuState.Snapshot) {
		t.Fatalf("fetched menu state = %+v, want %+v", fetchedMenuState, menuState)
	}

	body := bytes.NewBufferString(`{"game":"lava","playerCount":3,"difficulty":"expert"}`)
	response, err = http.Post(server.URL+"/api/select", "application/json", body)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("select response = %d", response.StatusCode)
	}
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if status.CurrentGame != "lava" || status.PlayerCount != 3 || status.Difficulty != "expert" {
		t.Fatalf("selected status = %+v", status)
	}

	body = bytes.NewBufferString(`{"game":"saltos","playerCount":3,"level":"classic"}`)
	response, err = http.Post(server.URL+"/api/select", "application/json", body)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("saltos select response = %d", response.StatusCode)
	}
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if status.CurrentGame != "saltos" || status.PlayerCount != 1 || status.Level != "classic" {
		t.Fatalf("selected saltos status = %+v", status)
	}

	body = bytes.NewBufferString(`{"game":"temporada1","playerCount":4,"difficulty":"medium","level":"level-2"}`)
	response, err = http.Post(server.URL+"/api/select", "application/json", body)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("temporada1 select response = %d", response.StatusCode)
	}
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if status.CurrentGame != "temporada1" || status.PlayerCount != 4 || status.Difficulty != "medium" || status.Level != "level-2" {
		t.Fatalf("selected temporada1 status = %+v", status)
	}

	body = bytes.NewBufferString(`{"game":"temporada2","playerCount":4,"difficulty":"expert","level":"level-2"}`)
	response, err = http.Post(server.URL+"/api/select", "application/json", body)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("temporada2 select response = %d", response.StatusCode)
	}
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if status.CurrentGame != "temporada2" || status.PlayerCount != 4 || status.Difficulty != "easy" || status.Level != "level-2" {
		t.Fatalf("selected temporada2 status = %+v", status)
	}

	body = bytes.NewBufferString(`{"game":"patrones","playerCount":4,"difficulty":"hard","level":"level-3"}`)
	response, err = http.Post(server.URL+"/api/select", "application/json", body)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("patrones select response = %d", response.StatusCode)
	}
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if status.CurrentGame != "patrones" || status.PlayerCount != 4 || status.Difficulty != "hard" || status.Level != "level-3" || status.Phase != "countdown" {
		t.Fatalf("selected patrones status = %+v", status)
	}
}

func TestAuthoredGameSelectsFromPlatformRuntimeSpec(t *testing.T) {
	platform := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		switch r.URL.Path {
		case "/api/game-runtime":
			_, _ = w.Write([]byte(`{"games":[{
				"id":"turbo-topos",
				"engine_game":"authored-turbo-topos",
				"label":"Turbo topos",
				"description":"Whack-a-mole authored variation",
				"default_music_ref":"Motion/canciones/Musica8.mp3",
				"default_music_volume":0.12,
				"min_players":1,
				"max_players":6,
				"game_source":{
					"schema":"motion-game-v1",
					"kind":"target-rush",
					"version":1,
					"duration_ms":45000,
					"countdown_ms":500,
					"target_size":1,
					"target_life_ms":5000,
					"target_min_life_ms":1000,
					"respawn_ms":100,
					"min_spawn_distance":0,
					"max_spawn_distance":40,
					"base_score":3,
					"speed_bonus":12,
					"miss_penalty":0,
					"target_palette":["#ff7a1a"]
				}
			}]}`))
		case "/api/game-runtime/authored-turbo-topos":
			_, _ = w.Write([]byte(`{"game":{
				"id":"turbo-topos",
				"engine_game":"authored-turbo-topos",
				"label":"Turbo topos",
				"description":"Whack-a-mole authored variation",
				"default_music_ref":"Motion/canciones/Musica8.mp3",
				"default_music_volume":0.12,
				"min_players":1,
				"max_players":6,
				"game_source":{
					"schema":"motion-game-v1",
					"kind":"target-rush",
					"version":1,
					"duration_ms":45000,
					"countdown_ms":500,
					"target_size":1,
					"target_life_ms":5000,
					"target_min_life_ms":1000,
					"respawn_ms":100,
					"min_spawn_distance":0,
					"max_spawn_distance":40,
					"base_score":3,
					"speed_bonus":12,
					"miss_penalty":0,
					"target_palette":["#ff7a1a"]
				}
			}}`))
		case "/api/level-games/animations/levels":
			_, _ = w.Write([]byte(`{"gameId":"animations","levels":[]}`))
		default:
			t.Fatalf("platform path = %s", r.URL.Path)
		}
	}))
	defer platform.Close()

	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, PlatformURL: platform.URL}, nil, nil)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	response, err := http.Post(server.URL+"/api/select", "application/json", bytes.NewBufferString(`{"game":"authored-turbo-topos","playerCount":1}`))
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("select response = %d", response.StatusCode)
	}
	var status runtimeStatus
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if status.CurrentGame != "authored-turbo-topos" || status.Label != "Turbo topos" || status.Phase != "countdown" {
		t.Fatalf("authored selected status = %+v", status)
	}
	if !catalogHasGame(status.Catalog, "authored-turbo-topos") {
		t.Fatal("engine catalog missing authored runtime game")
	}

	playAt := time.Now().Add(2 * time.Second)
	for y := 0; y < animation.GridHeight && runtime.Status().Players[0].Score == 0; y++ {
		for x := 0; x < animation.GridWidth && runtime.Status().Players[0].Score == 0; x++ {
			runtime.HandlePressure(&inputpb.PressureEvent{X: uint32(x), Y: uint32(y), Pressed: true, UnixNanos: playAt.UnixNano()}, playAt)
		}
	}
	display := runtime.DisplayStatus(playAt)
	if display.Phase != "running" || display.Players[0].Score <= 0 || display.ActiveTargets > 1 {
		t.Fatalf("authored gameplay status = %+v", display)
	}
}

func TestAuthoredMotionGoPrefersNativeAndReportsPerformance(t *testing.T) {
	platform := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		gameJSON := `{
			"id":"tetris",
			"engine_game":"authored-tetris",
			"label":"Tetris",
			"description":"Native seeded tetris",
			"default_music_ref":"Motion/canciones/Musica8.mp3",
			"default_music_volume":0.12,
			"min_players":1,
			"max_players":4,
			"game_source":{"schema":"motion-go-v1","kind":"wasm","language":"go","version":1}
		}`
		switch r.URL.Path {
		case "/api/game-runtime":
			_, _ = w.Write([]byte(`{"games":[` + gameJSON + `]}`))
		case "/api/game-runtime/authored-tetris":
			_, _ = w.Write([]byte(`{"game":` + gameJSON + `}`))
		case "/api/level-games/animations/levels":
			_, _ = w.Write([]byte(`{"gameId":"animations","levels":[]}`))
		default:
			t.Fatalf("platform path = %s", r.URL.Path)
		}
	}))
	defer platform.Close()

	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, PlatformURL: platform.URL}, nil, nil)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	response, err := http.Post(server.URL+"/api/select", "application/json", bytes.NewBufferString(`{"game":"authored-tetris","playerCount":1}`))
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("select response = %d", response.StatusCode)
	}
	_, frame := runtime.Render(time.Now().Add(2 * time.Second))
	if len(frame) != animation.GridWidth*animation.GridHeight {
		t.Fatalf("frame len = %d", len(frame))
	}
	performanceResponse, err := http.Get(server.URL + "/api/performance")
	if err != nil {
		t.Fatal(err)
	}
	defer performanceResponse.Body.Close()
	if performanceResponse.StatusCode != http.StatusOK {
		t.Fatalf("performance response = %d", performanceResponse.StatusCode)
	}
	var performance framePerfSnapshot
	if err := json.NewDecoder(performanceResponse.Body).Decode(&performance); err != nil {
		t.Fatal(err)
	}
	if performance.Game != "authored-tetris" || performance.Runtime != "native" || performance.Count == 0 {
		t.Fatalf("performance = %+v", performance)
	}
}

func catalogHasGame(catalog []gameCatalogEntry, game string) bool {
	for _, entry := range catalog {
		if entry.Game == game {
			return true
		}
	}
	return false
}

func TestGameAPIRejectsDuplicatePlayerNames(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	body := bytes.NewBufferString(`{"game":"lava","playerCount":2,"players":[{"index":0,"label":"Nora","color":{"r":10,"g":20,"b":30}},{"index":1,"label":" nora ","color":{"r":40,"g":50,"b":60}}]}`)
	response, err := http.Post(server.URL+"/api/select", "application/json", body)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusBadRequest {
		t.Fatalf("select response = %d, want %d", response.StatusCode, http.StatusBadRequest)
	}
	if runtime.Status().CurrentGame == "lava" {
		t.Fatal("duplicate roster should not select lava")
	}
}

func TestGameAPIRejectsDuplicatePlayerColors(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	body := bytes.NewBufferString(`{"game":"lava","playerCount":2,"players":[{"index":0,"label":"Nora","color":{"r":10,"g":20,"b":30}},{"index":1,"label":"Leo","color":{"r":10,"g":20,"b":30}}]}`)
	response, err := http.Post(server.URL+"/api/select", "application/json", body)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusBadRequest {
		t.Fatalf("select response = %d, want %d", response.StatusCode, http.StatusBadRequest)
	}
	if runtime.Status().CurrentGame == "lava" {
		t.Fatal("duplicate roster should not select lava")
	}
}

func TestSessionRecordingWritesLevelAttemptRecords(t *testing.T) {
	dir := t.TempDir()
	recorder, err := sessionrecording.New(dir, time.Date(2026, 6, 4, 8, 0, 0, 0, time.UTC), sessionrecording.Options{})
	if err != nil {
		t.Fatal(err)
	}
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 2, Game: "temporada1", Difficulty: "medium", Level: "level-1"}, nil, recorder)
	started := time.Date(2026, 6, 4, 8, 1, 0, 0, time.UTC)
	gameplayStarted := started.Add(3 * time.Second)
	ended := gameplayStarted.Add(42 * time.Second)

	runtime.RecordDisplaySnapshot(displayStatus{
		CurrentGame:              "temporada1",
		Label:                    "Temporada 1",
		Phase:                    "countdown",
		Difficulty:               "medium",
		Level:                    "level-1",
		LevelNumber:              1,
		PlayerCount:              2,
		Score:                    0,
		Lives:                    5,
		LivesStart:               5,
		ActiveTargets:            23,
		AttemptStartedUnixNanos:  started.UnixNano(),
		GameplayStartedUnixNanos: gameplayStarted.UnixNano(),
	}, started)
	runtime.RecordDisplaySnapshot(displayStatus{
		CurrentGame:              "temporada1",
		Label:                    "Temporada 1",
		Phase:                    "finished",
		Difficulty:               "medium",
		Level:                    "level-1",
		LevelNumber:              1,
		PlayerCount:              2,
		Score:                    23,
		Lives:                    4,
		LivesStart:               5,
		ActiveTargets:            0,
		Success:                  true,
		ElapsedMillis:            42000,
		AttemptStartedUnixNanos:  started.UnixNano(),
		GameplayStartedUnixNanos: gameplayStarted.UnixNano(),
		AttemptEndedUnixNanos:    ended.UnixNano(),
	}, ended)
	if err := recorder.Close(); err != nil {
		t.Fatal(err)
	}

	var startedRecord *gamepb.LevelAttemptStarted
	var finishedRecord *gamepb.LevelAttemptFinished
	path := filepath.Join(dir, "20260604T080000Z.game.pbstream")
	if _, err := sessionrecording.ReadRecoverable(path, func(record *gamepb.GameSessionRecord) error {
		if payload := record.GetLevelAttemptStarted(); payload != nil {
			startedRecord = payload
		}
		if payload := record.GetLevelAttemptFinished(); payload != nil {
			finishedRecord = payload
		}
		return nil
	}); err != nil {
		t.Fatal(err)
	}
	if startedRecord == nil {
		t.Fatal("missing level attempt started record")
	}
	if finishedRecord == nil {
		t.Fatal("missing level attempt finished record")
	}
	if startedRecord.LevelId != "level-1" || startedRecord.LevelNumber != 1 || startedRecord.LivesStart != 5 || startedRecord.ActiveTargetsStart != 23 {
		t.Fatalf("started record = %+v", startedRecord)
	}
	if finishedRecord.AttemptId != startedRecord.AttemptId || finishedRecord.Result != "success" || finishedRecord.ScoreEnd != 23 || finishedRecord.LivesEnd != 4 || finishedRecord.ElapsedMillis != 42000 {
		t.Fatalf("finished record = %+v started=%+v", finishedRecord, startedRecord)
	}
}

func TestLevelAttemptControlsCameraRecording(t *testing.T) {
	runtime := newGameRuntime(config{
		Brightness:            80,
		PlayerCount:           2,
		Game:                  "temporada1",
		Difficulty:            "medium",
		Level:                 "level-1",
		TeamName:              "Equipo Azul",
		VenueSessionID:        "venue-1",
		ControllerLabel:       "Sala Test",
		ControllerHostname:    "motionlevels-test",
		DisplaySnapshotFPS:    4,
		CameraRecorderURL:     "http://127.0.0.1:8030",
		CameraRecorderTimeout: time.Second,
	}, nil, nil)
	recorder := &cameraRecorderBackend{}
	runtime.SetCameraRecorder(recorder)
	started := time.Date(2026, 6, 4, 8, 1, 0, 0, time.UTC)
	gameplayStarted := started.Add(3 * time.Second)
	ended := gameplayStarted.Add(42 * time.Second)

	runtime.RecordDisplaySnapshot(displayStatus{
		CurrentGame:              "temporada1",
		Label:                    "Temporada 1",
		Phase:                    "countdown",
		Difficulty:               "medium",
		Level:                    "level-1",
		LevelNumber:              1,
		PlayerCount:              2,
		Score:                    0,
		Lives:                    5,
		LivesStart:               5,
		ActiveTargets:            23,
		AttemptStartedUnixNanos:  started.UnixNano(),
		GameplayStartedUnixNanos: gameplayStarted.UnixNano(),
	}, started)
	runtime.RecordDisplaySnapshot(displayStatus{
		CurrentGame:              "temporada1",
		Label:                    "Temporada 1",
		Phase:                    "finished",
		Difficulty:               "medium",
		Level:                    "level-1",
		LevelNumber:              1,
		PlayerCount:              2,
		Score:                    23,
		Lives:                    4,
		LivesStart:               5,
		ActiveTargets:            0,
		Success:                  true,
		ElapsedMillis:            42000,
		AttemptStartedUnixNanos:  started.UnixNano(),
		GameplayStartedUnixNanos: gameplayStarted.UnixNano(),
		AttemptEndedUnixNanos:    ended.UnixNano(),
	}, ended)

	if len(recorder.starts) != 1 {
		t.Fatalf("camera starts = %d, want 1", len(recorder.starts))
	}
	if len(recorder.finishes) != 1 {
		t.Fatalf("camera finishes = %d, want 1", len(recorder.finishes))
	}
	start := recorder.starts[0]
	finish := recorder.finishes[0]
	if start.Game != "temporada1" || start.Level != "level-1" || start.LevelNumber != 1 || start.TeamName != "Equipo Azul" {
		t.Fatalf("camera start = %+v", start)
	}
	if start.VenueSessionID != "venue-1" || start.ControllerLabel != "Sala Test" || start.ControllerHostname != "motionlevels-test" {
		t.Fatalf("camera start venue metadata = %+v", start)
	}
	if finish.AttemptID != start.AttemptID || finish.Result != "success" || !finish.Success || finish.ElapsedMillis != 42000 {
		t.Fatalf("camera finish = %+v start=%+v", finish, start)
	}
}

func TestRuntimeStatusExposesRecentFinishedLevelAttempts(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "parkour", Difficulty: "easy", Level: "level-1"}, nil, nil)
	started := time.Date(2026, 6, 4, 8, 2, 0, 0, time.UTC)
	gameplayStarted := started.Add(3 * time.Second)
	ended := gameplayStarted.Add(16*time.Second + 100*time.Millisecond)

	runtime.RecordDisplaySnapshot(displayStatus{
		CurrentGame:              "parkour",
		Label:                    "Parkour",
		Phase:                    "running",
		Difficulty:               "easy",
		Level:                    "level-1",
		LevelNumber:              1,
		PlayerCount:              1,
		Lives:                    3,
		LivesStart:               3,
		ActiveTargets:            5,
		AttemptStartedUnixNanos:  started.UnixNano(),
		GameplayStartedUnixNanos: gameplayStarted.UnixNano(),
	}, gameplayStarted)
	runtime.RecordDisplaySnapshot(displayStatus{
		CurrentGame:              "parkour",
		Label:                    "Parkour",
		Phase:                    "finished",
		Difficulty:               "easy",
		Level:                    "level-1",
		LevelNumber:              1,
		PlayerCount:              1,
		Score:                    5,
		Lives:                    3,
		LivesStart:               3,
		ActiveTargets:            0,
		Success:                  true,
		ElapsedMillis:            16100,
		AttemptStartedUnixNanos:  started.UnixNano(),
		GameplayStartedUnixNanos: gameplayStarted.UnixNano(),
		AttemptEndedUnixNanos:    ended.UnixNano(),
	}, ended)

	status := runtime.Status()
	if len(status.FinishedLevelAttempts) != 1 {
		t.Fatalf("finished attempts = %d, want 1: %+v", len(status.FinishedLevelAttempts), status.FinishedLevelAttempts)
	}
	attempt := status.FinishedLevelAttempts[0]
	if attempt.Game != "parkour" || attempt.Level != "level-1" || attempt.Result != "success" || !attempt.Success || attempt.ElapsedMillis != 16100 {
		t.Fatalf("finished attempt = %+v", attempt)
	}
}

type cameraRecorderBackend struct {
	starts   []cameraRecordingStart
	finishes []cameraRecordingFinish
}

func (b *cameraRecorderBackend) StartLevelAttempt(start cameraRecordingStart) {
	b.starts = append(b.starts, start)
}

func (b *cameraRecorderBackend) FinishLevelAttempt(finish cameraRecordingFinish) {
	b.finishes = append(b.finishes, finish)
}

func (b *cameraRecorderBackend) Close() error {
	return nil
}

func TestPlatformSyncPostsSessionSnapshot(t *testing.T) {
	var auth string
	var payload platformSessionPayload
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth = r.Header.Get("authorization")
		if r.URL.Path != "/api/ingest/session" {
			t.Fatalf("path = %q", r.URL.Path)
		}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			t.Fatal(err)
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"ok": true})
	}))
	defer server.Close()

	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 2, Game: "lava", Difficulty: "hard"}, nil, nil)
	syncer, err := newPlatformSyncer(runtime, config{
		PlatformURL:          server.URL,
		PlatformToken:        "test-token",
		ControllerID:         "controller-1",
		PlatformSyncInterval: time.Second,
	})
	if err != nil {
		t.Fatal(err)
	}
	if err := syncer.syncOnce(time.Unix(100, 0)); err != nil {
		t.Fatal(err)
	}

	if auth != "Bearer test-token" {
		t.Fatalf("authorization = %q", auth)
	}
	if payload.ControllerID != "controller-1" || payload.Game != "lava" || payload.Label != "El suelo es lava" {
		t.Fatalf("payload metadata = %+v", payload)
	}
	if payload.SessionID == "" || payload.Status != "open" || payload.StartedAt == "" {
		t.Fatalf("payload session fields = %+v", payload)
	}
	if len(payload.Players) != 2 {
		t.Fatalf("players = %d, want 2", len(payload.Players))
	}
	if len(payload.DisplaySnapshots) != 1 || payload.DisplaySnapshots[0].SnapshotKey == "" {
		t.Fatalf("snapshots = %+v", payload.DisplaySnapshots)
	}
}

func TestPlatformSyncSkipsAmbientSessionSnapshot(t *testing.T) {
	requests := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requests++
		_ = json.NewEncoder(w).Encode(map[string]any{"ok": true})
	}))
	defer server.Close()

	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "salvapantallas"}, nil, nil)
	syncer, err := newPlatformSyncer(runtime, config{
		PlatformURL:          server.URL,
		ControllerID:         "controller-1",
		PlatformSyncInterval: time.Second,
	})
	if err != nil {
		t.Fatal(err)
	}
	if err := syncer.syncOnce(time.Unix(100, 0)); err != nil {
		t.Fatal(err)
	}

	if requests != 0 {
		t.Fatalf("ambient sync requests = %d, want 0", requests)
	}
}

func TestAmbientSelectionChangesRenderedFrame(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 100, PlayerCount: 1, Game: "salvapantallas"}, nil, nil)
	now := time.Now()
	screensaverFrame := makeFrame(1, now, 0, runtime)

	runtime.SelectGameWithDifficulty("ambient-spark", 1, "")
	sparkFrame := makeFrame(2, now.Add(500*time.Millisecond), 0.5, runtime)

	var different bool
	for i := range screensaverFrame.Tiles {
		left := screensaverFrame.Tiles[i]
		right := sparkFrame.Tiles[i]
		if left.R != right.R || left.G != right.G || left.B != right.B {
			different = true
			break
		}
	}
	if !different {
		t.Fatal("ambient-spark frame matched screensaver frame exactly")
	}
	if runtime.Status().CurrentGame != "ambient-spark" {
		t.Fatalf("status game = %q, want ambient-spark", runtime.Status().CurrentGame)
	}
}

func TestAmbientPressureAddsTouchEffect(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 100, PlayerCount: 1, Game: "ambient-pulse"}, nil, nil)
	now := time.Now()
	renderAt := now.Add(300 * time.Millisecond)

	_, before := runtime.Render(renderAt)
	runtime.HandlePressure(&inputpb.PressureEvent{
		X:         8,
		Y:         16,
		Pressed:   true,
		UnixNanos: now.UnixNano(),
	}, now)
	_, after := runtime.Render(renderAt)

	index := 16*animation.GridWidth + 8
	if before[index] == after[index] {
		t.Fatalf("pressed tile color did not change: before=%+v after=%+v", before[index], after[index])
	}
}

func TestAmbientPressureDoesNotPlayGenericCue(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "coin.wav"), []byte("audio"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "damage.wav"), []byte("audio"), 0o644); err != nil {
		t.Fatal(err)
	}
	backend := &recordingBackend{}
	player := audio.NewPlayer(dir, backend)
	runtime := newGameRuntime(config{
		Brightness:   100,
		PlayerCount:  1,
		Game:         "ambient-pulse",
		MusicRef:     "",
		StartCueRef:  "",
		CoinCueRef:   "coin.wav",
		DamageCueRef: "damage.wav",
	}, player, nil)

	runtime.HandlePressure(&inputpb.PressureEvent{
		X:         8,
		Y:         16,
		Pressed:   true,
		UnixNanos: time.Now().UnixNano(),
	}, time.Now())
	time.Sleep(20 * time.Millisecond)

	if got := backend.count(filepath.Join(dir, "coin.wav")); got != 0 {
		t.Fatalf("coin cue plays on ambient press = %d, want 0", got)
	}
	if got := backend.count(filepath.Join(dir, "damage.wav")); got != 0 {
		t.Fatalf("damage cue plays on ambient press = %d, want 0", got)
	}
}

func TestGameAPIControlPauseRestartAndExit(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	response, err := http.Post(server.URL+"/api/select", "application/json", bytes.NewBufferString(`{"game":"lava","playerCount":2,"difficulty":"hard"}`))
	if err != nil {
		t.Fatal(err)
	}
	_ = response.Body.Close()

	response, err = http.Post(server.URL+"/api/control", "application/json", bytes.NewBufferString(`{"action":"pause"}`))
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	var status runtimeStatus
	if err := json.NewDecoder(response.Body).Decode(&status); err != nil {
		t.Fatal(err)
	}
	if !status.Paused || status.CurrentGame != "lava" {
		t.Fatalf("paused status = %+v", status)
	}

	response, err = http.Post(server.URL+"/api/control", "application/json", bytes.NewBufferString(`{"action":"restart"}`))
	if err != nil {
		t.Fatal(err)
	}
	_ = response.Body.Close()
	if runtime.Status().Paused {
		t.Fatal("restart should clear pause")
	}
	if runtime.Status().CurrentGame != "lava" {
		t.Fatalf("restart game = %q, want lava", runtime.Status().CurrentGame)
	}

	response, err = http.Post(server.URL+"/api/control", "application/json", bytes.NewBufferString(`{"action":"exit"}`))
	if err != nil {
		t.Fatal(err)
	}
	_ = response.Body.Close()
	if runtime.Status().CurrentGame != "salvapantallas" {
		t.Fatalf("exit game = %q, want salvapantallas", runtime.Status().CurrentGame)
	}
}

func TestRuntimeStopsNonAmbientGameAfterFiveMinutesWithoutPressure(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	runtime.SelectGameWithDifficulty("lava", 1, "easy")
	runtime.mu.Lock()
	runtime.lastPressure = time.Now().Add(-noPressureGameLimit - time.Second)
	runtime.mu.Unlock()

	status := runtime.Status()
	if status.CurrentGame != "salvapantallas" {
		t.Fatalf("game after no-pressure timeout = %q, want salvapantallas", status.CurrentGame)
	}
}

func TestRuntimeDoesNotStopAmbientAfterFiveMinutesWithoutPressure(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	runtime.SelectGameWithDifficulty("ambient-spark", 1, "")
	runtime.mu.Lock()
	runtime.lastPressure = time.Now().Add(-noPressureGameLimit - time.Second)
	runtime.mu.Unlock()

	status := runtime.Status()
	if status.CurrentGame != "ambient-spark" {
		t.Fatalf("ambient game after no-pressure timeout = %q, want ambient-spark", status.CurrentGame)
	}
}

func TestRuntimePressureInputPreventsNoPressureTimeout(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	runtime.SelectGameWithDifficulty("lava", 1, "easy")
	now := time.Now()
	runtime.mu.Lock()
	runtime.lastPressure = now.Add(-noPressureGameLimit - time.Second)
	runtime.mu.Unlock()

	runtime.HandlePressure(&inputpb.PressureEvent{X: 0, Y: 0, Pressed: true, UnixNanos: now.UnixNano()}, now)

	status := runtime.Status()
	if status.CurrentGame != "lava" {
		t.Fatalf("game after pressure input = %q, want lava", status.CurrentGame)
	}
}

func TestRuntimeStatusExposesLastRealPressureInput(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	runtime.SelectGameWithDifficulty("lava", 1, "easy")

	if got := runtime.Status().LastPressureUnix; got != 0 {
		t.Fatalf("last pressure before input = %d, want 0", got)
	}

	now := time.Now().Truncate(time.Second)
	runtime.HandlePressure(&inputpb.PressureEvent{X: 2, Y: 3, Pressed: false, UnixNanos: now.UnixNano()}, now)

	if got := runtime.Status().LastPressureUnix; got != now.Unix() {
		t.Fatalf("last pressure after input = %d, want %d", got, now.Unix())
	}
}

func TestNarrationAutoPlaysOnceAndCanReplay(t *testing.T) {
	dir := t.TempDir()
	if err := os.MkdirAll(filepath.Join(dir, "Motion/narraciones"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "Motion/narraciones/lava-intro.mp3"), []byte("audio"), 0o644); err != nil {
		t.Fatal(err)
	}
	backend := &recordingBackend{}
	player := audio.NewPlayer(dir, backend)
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "salvapantallas"}, player, nil)

	runtime.SelectGameWithDifficulty("lava", 1, "easy")
	runtime.SelectGameWithDifficulty("salvapantallas", 1, "")
	runtime.SelectGameWithDifficulty("lava", 1, "easy")
	narrationPath := filepath.Join(dir, "Motion/narraciones/lava-intro.mp3")
	backend.waitForCount(t, narrationPath, 1)

	runtime.ControlGame("narration")
	backend.waitForCount(t, narrationPath, 2)
}

func TestSelectGameCanSkipOrForceNarration(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "cue.mp3"), []byte("audio"), 0o644); err != nil {
		t.Fatal(err)
	}
	backend := &recordingBackend{}
	player := audio.NewPlayer(dir, backend)
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "salvapantallas"}, player, nil)
	runtime.base.NarrationCueRef = "cue.mp3"
	cuePath := filepath.Join(dir, "cue.mp3")

	skip := false
	runtime.SelectGameWithOptions("lava", 1, "easy", &skip)
	time.Sleep(20 * time.Millisecond)
	if got := backend.count(cuePath); got != 0 {
		t.Fatalf("skip narration plays = %d, want 0", got)
	}

	force := true
	runtime.SelectGameWithOptions("lava", 1, "easy", &force)
	backend.waitForCount(t, cuePath, 1)
	runtime.SelectGameWithOptions("lava", 1, "easy", &force)
	backend.waitForCount(t, cuePath, 2)
}

func TestAudioMuteToggleSuppressesCues(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "cue.mp3"), []byte("audio"), 0o644); err != nil {
		t.Fatal(err)
	}
	backend := &recordingBackend{}
	player := audio.NewPlayer(dir, backend)
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "salvapantallas", NarrationCueRef: "cue.mp3"}, player, nil)
	cuePath := filepath.Join(dir, "cue.mp3")
	backend.waitForCount(t, cuePath, 1)

	runtime.ControlGame("toggle_mute")
	if status := runtime.Status(); !status.AudioMuted {
		t.Fatalf("audio muted = %v, want true", status.AudioMuted)
	}
	runtime.ControlGame("narration")
	time.Sleep(20 * time.Millisecond)
	if got := backend.count(cuePath); got != 1 {
		t.Fatalf("cue plays while muted = %d, want 1", got)
	}

	runtime.ControlGame("toggle_mute")
	if status := runtime.Status(); status.AudioMuted {
		t.Fatalf("audio muted = %v, want false", status.AudioMuted)
	}
	runtime.ControlGame("narration")
	backend.waitForCount(t, cuePath, 2)
}

func TestFirstNarrationHoldsLavaCountdown(t *testing.T) {
	dir := t.TempDir()
	narrationRef := "Motion/narraciones/lava-intro.wav"
	countdownRef := "Motion/narraciones/countdown.wav"
	narrationPath := filepath.Join(dir, filepath.FromSlash(narrationRef))
	countdownPath := filepath.Join(dir, filepath.FromSlash(countdownRef))
	if err := os.MkdirAll(filepath.Dir(narrationPath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := writeSilentWAV(narrationPath, 300*time.Millisecond); err != nil {
		t.Fatal(err)
	}
	if err := writeSilentWAV(countdownPath, 400*time.Millisecond); err != nil {
		t.Fatal(err)
	}

	backend := &recordingBackend{}
	player := audio.NewPlayer(dir, backend)
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "salvapantallas"}, player, nil)
	runtime.base.NarrationCueRef = narrationRef
	runtime.base.CountdownCueRef = countdownRef
	runtime.base.CountdownVolume = 0.9

	runtime.SelectGameWithDifficulty("lava", 1, "easy")
	status := runtime.DisplayStatus(time.Now())
	if status.Phase != "intro" {
		t.Fatalf("phase = %q, want intro", status.Phase)
	}
	if status.IntroRemainingMillis <= 0 {
		t.Fatalf("intro remaining = %d, want positive", status.IntroRemainingMillis)
	}
	if status.CountdownRemainingMillis < 2500 || status.CountdownRemainingMillis > 3100 {
		t.Fatalf("countdown remaining = %d, want about 3000ms", status.CountdownRemainingMillis)
	}
	if got := backend.count(countdownPath); got != 0 {
		t.Fatalf("countdown plays before intro ends = %d, want 0", got)
	}
	backend.waitForCount(t, countdownPath, 1)

	runtime.SelectGameWithDifficulty("salvapantallas", 1, "")
	runtime.SelectGameWithDifficulty("lava", 1, "easy")
	status = runtime.DisplayStatus(time.Now())
	if status.Phase == "intro" || status.IntroRemainingMillis != 0 {
		t.Fatalf("second launch status = %+v, want no intro hold", status)
	}
	backend.waitForCount(t, countdownPath, 2)
}

func TestWhackAMoleCountdownPlaysAfterPlayersAreReady(t *testing.T) {
	dir := t.TempDir()
	countdownRef := "Motion/narraciones/countdown.wav"
	countdownPath := filepath.Join(dir, filepath.FromSlash(countdownRef))
	if err := os.MkdirAll(filepath.Dir(countdownPath), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := writeSilentWAV(countdownPath, 300*time.Millisecond); err != nil {
		t.Fatal(err)
	}

	backend := &recordingBackend{}
	player := audio.NewPlayer(dir, backend)
	runtime := newGameRuntime(config{
		Brightness:      80,
		PlayerCount:     1,
		Game:            "salvapantallas",
		CountdownCueRef: countdownRef,
		StartCueRef:     "",
		MusicRef:        "",
	}, player, nil)

	skip := false
	runtime.SelectGameWithOptions("whack-a-mole", 1, "", &skip)
	time.Sleep(20 * time.Millisecond)
	if got := backend.count(countdownPath); got != 0 {
		t.Fatalf("countdown before ready = %d, want 0", got)
	}

	now := time.Now()
	for y := 0; y < animation.GridHeight; y++ {
		for x := 0; x < animation.GridWidth; x++ {
			runtime.HandlePressure(&inputpb.PressureEvent{
				X:         uint32(x),
				Y:         uint32(y),
				Pressed:   true,
				UnixNanos: now.UnixNano(),
			}, now)
		}
	}
	backend.waitForCount(t, countdownPath, 1)
}

type recordingBackend struct {
	mu     sync.Mutex
	played []string
}

func (b *recordingBackend) Play(_ context.Context, path string, _ float64) error {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.played = append(b.played, path)
	return nil
}

func (b *recordingBackend) count(path string) int {
	b.mu.Lock()
	defer b.mu.Unlock()
	count := 0
	for _, played := range b.played {
		if played == path {
			count++
		}
	}
	return count
}

func (b *recordingBackend) waitForCount(t *testing.T, path string, want int) {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		if got := b.count(path); got == want {
			return
		}
		time.Sleep(10 * time.Millisecond)
	}
	t.Fatalf("%s plays = %d, want %d", path, b.count(path), want)
}

func writeSilentWAV(path string, duration time.Duration) error {
	const sampleRate = 8000
	const channels = 1
	const bitsPerSample = 16
	frames := int(duration.Seconds() * sampleRate)
	dataSize := frames * channels * bitsPerSample / 8
	file := make([]byte, 44+dataSize)
	copy(file[0:4], "RIFF")
	binary.LittleEndian.PutUint32(file[4:8], uint32(36+dataSize))
	copy(file[8:12], "WAVE")
	copy(file[12:16], "fmt ")
	binary.LittleEndian.PutUint32(file[16:20], 16)
	binary.LittleEndian.PutUint16(file[20:22], 1)
	binary.LittleEndian.PutUint16(file[22:24], channels)
	binary.LittleEndian.PutUint32(file[24:28], sampleRate)
	binary.LittleEndian.PutUint32(file[28:32], sampleRate*channels*bitsPerSample/8)
	binary.LittleEndian.PutUint16(file[32:34], channels*bitsPerSample/8)
	binary.LittleEndian.PutUint16(file[34:36], bitsPerSample)
	copy(file[36:40], "data")
	binary.LittleEndian.PutUint32(file[40:44], uint32(dataSize))
	return os.WriteFile(path, file, 0o644)
}

func TestGameAPIDisplayStatus(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 2, Game: "whack-a-mole"}, nil, nil)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	response, err := http.Get(server.URL + "/api/display")
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("display response = %d", response.StatusCode)
	}

	var display displayStatus
	if err := json.NewDecoder(response.Body).Decode(&display); err != nil {
		t.Fatal(err)
	}
	if display.CurrentGame != "whack-a-mole" {
		t.Fatalf("display game = %q", display.CurrentGame)
	}
	if len(display.Players) != 2 {
		t.Fatalf("display players = %d, want 2", len(display.Players))
	}
	if display.Lives != -1 {
		t.Fatalf("display lives = %d, want unlimited sentinel", display.Lives)
	}
}

func TestRuntimeRecordsSessionAPIAndDisplayData(t *testing.T) {
	dir := t.TempDir()
	// Recent start time: a stale fixed date plus real-time record timestamps
	// would exceed MaxSegmentDuration and rotate the segment mid-test.
	startedAt := time.Now().UTC().Truncate(time.Second)
	recorder, err := sessionrecording.New(dir, startedAt, sessionrecording.Options{MaxSegmentDuration: 7 * 24 * time.Hour})
	if err != nil {
		t.Fatal(err)
	}
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, recorder)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	const venueSessionID = "11111111-1111-4111-8111-111111111111"
	response, err := http.Post(server.URL+"/api/select", "application/json", bytes.NewBufferString(`{"game":"whack-a-mole","playerCount":2,"venueSessionId":"`+venueSessionID+`"}`))
	if err != nil {
		t.Fatal(err)
	}
	_ = response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("select response = %d", response.StatusCode)
	}
	selectedSessionID := runtime.SessionID()
	runtime.RecordDisplaySnapshot(runtime.DisplayStatus(time.Now()), time.Now())
	if err := recorder.Close(); err != nil {
		t.Fatal(err)
	}

	var sawSessionStarted, sawMenuCommand, sawAPIInteraction, sawDisplay bool
	_, err = sessionrecording.ReadRecoverable(filepath.Join(dir, startedAt.Format("20060102T150405Z")+".game.pbstream"), func(record *gamepb.GameSessionRecord) error {
		if record.GetSessionId() != selectedSessionID {
			return nil
		}
		if record.GetVenueSessionId() != venueSessionID {
			t.Fatalf("record venue session id = %q, want %q", record.GetVenueSessionId(), venueSessionID)
		}
		switch record.Payload.(type) {
		case *gamepb.GameSessionRecord_SessionStarted:
			sawSessionStarted = true
			if record.GetSessionStarted().GetVenueSessionId() != venueSessionID {
				t.Fatalf("session started venue session id = %q, want %q", record.GetSessionStarted().GetVenueSessionId(), venueSessionID)
			}
		case *gamepb.GameSessionRecord_MenuCommand:
			sawMenuCommand = true
		case *gamepb.GameSessionRecord_ApiInteraction:
			sawAPIInteraction = true
		case *gamepb.GameSessionRecord_DisplaySnapshot:
			sawDisplay = true
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if !sawSessionStarted || !sawMenuCommand || !sawAPIInteraction || !sawDisplay {
		t.Fatalf("records session=%v menu=%v api=%v display=%v", sawSessionStarted, sawMenuCommand, sawAPIInteraction, sawDisplay)
	}
}

func TestRuntimeSkipsSessionActivityForAmbientGames(t *testing.T) {
	dir := t.TempDir()
	startedAt := time.Now().UTC().Truncate(time.Second)
	recorder, err := sessionrecording.New(dir, startedAt, sessionrecording.Options{MaxSegmentDuration: 7 * 24 * time.Hour})
	if err != nil {
		t.Fatal(err)
	}
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "animations"}, nil, recorder)
	runtime.RecordDisplaySnapshot(runtime.DisplayStatus(time.Now()), time.Now())
	runtime.RecordAPIInteraction("GET", "/api/status", "127.0.0.1", http.StatusOK, time.Now())
	if err := recorder.Close(); err != nil {
		t.Fatal(err)
	}

	stats := recorder.Stats()
	if stats.WrittenRecords != 0 {
		t.Fatalf("ambient written records = %d, want 0", stats.WrittenRecords)
	}
	if runtime.Status().SessionID != "" || runtime.Status().VenueSessionID != "" {
		t.Fatalf("ambient status exposes session ids: %+v", runtime.Status())
	}
}

func TestVenueSessionLifecycleAndMenuEvents(t *testing.T) {
	dir := t.TempDir()
	startedAt := time.Now().UTC().Truncate(time.Second)
	recorder, err := sessionrecording.New(dir, startedAt, sessionrecording.Options{MaxSegmentDuration: 7 * 24 * time.Hour})
	if err != nil {
		t.Fatal(err)
	}
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, recorder)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	const venueSessionID = "22222222-2222-4222-8222-222222222222"
	post := func(path, body string) *http.Response {
		t.Helper()
		response, err := http.Post(server.URL+path, "application/json", bytes.NewBufferString(body))
		if err != nil {
			t.Fatal(err)
		}
		t.Cleanup(func() { _ = response.Body.Close() })
		return response
	}

	if response := post("/api/venue-session", `{"action":"start","venueSessionId":"`+venueSessionID+`","teamName":"Equipo Test","kioskId":"33333333-3333-4333-8333-333333333333"}`); response.StatusCode != http.StatusOK {
		t.Fatalf("venue start response = %d", response.StatusCode)
	}
	if response := post("/api/menu-event", `{"venueSessionId":"`+venueSessionID+`","name":"player_added","properties":{"player_count":3}}`); response.StatusCode != http.StatusOK {
		t.Fatalf("menu event response = %d", response.StatusCode)
	}
	if response := post("/api/select", `{"game":"whack-a-mole","playerCount":2,"venueSessionId":"`+venueSessionID+`"}`); response.StatusCode != http.StatusOK {
		t.Fatalf("select response = %d", response.StatusCode)
	}
	if got := runtime.Status().VenueSessionID; got != venueSessionID {
		t.Fatalf("status venue session id = %q, want %q", got, venueSessionID)
	}
	if got := runtime.Status().CurrentGame; got != "whack-a-mole" {
		t.Fatalf("current game before venue end = %q, want whack-a-mole", got)
	}
	if response := post("/api/venue-session", `{"action":"end","venueSessionId":"`+venueSessionID+`","reason":"manual"}`); response.StatusCode != http.StatusOK {
		t.Fatalf("venue end response = %d", response.StatusCode)
	}
	if status := runtime.Status(); status.CurrentGame != "salvapantallas" || status.VenueSessionID != "" {
		t.Fatalf("status after venue end = %+v, want ambient without venue session", status)
	}
	if err := recorder.Close(); err != nil {
		t.Fatal(err)
	}

	var sawStarted, sawEnded, sawMenuEvent bool
	_, err = sessionrecording.ReadRecoverable(filepath.Join(dir, startedAt.Format("20060102T150405Z")+".game.pbstream"), func(record *gamepb.GameSessionRecord) error {
		switch payload := record.Payload.(type) {
		case *gamepb.GameSessionRecord_VenueSessionStarted:
			sawStarted = true
			if record.GetSessionId() != "" {
				t.Fatalf("venue started record has session id %q", record.GetSessionId())
			}
			if record.GetVenueSessionId() != venueSessionID {
				t.Fatalf("venue started record venue id = %q", record.GetVenueSessionId())
			}
			if payload.VenueSessionStarted.GetTeamName() != "Equipo Test" {
				t.Fatalf("venue started team = %q", payload.VenueSessionStarted.GetTeamName())
			}
		case *gamepb.GameSessionRecord_VenueSessionEnded:
			sawEnded = true
			if payload.VenueSessionEnded.GetReason() != "manual" {
				t.Fatalf("venue ended reason = %q", payload.VenueSessionEnded.GetReason())
			}
		case *gamepb.GameSessionRecord_MenuEvent:
			sawMenuEvent = true
			if payload.MenuEvent.GetName() != "player_added" {
				t.Fatalf("menu event name = %q", payload.MenuEvent.GetName())
			}
			if payload.MenuEvent.GetPropertiesJson() == "" || payload.MenuEvent.GetPropertiesJson() == "{}" {
				t.Fatalf("menu event properties json = %q", payload.MenuEvent.GetPropertiesJson())
			}
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if !sawStarted || !sawEnded || !sawMenuEvent {
		t.Fatalf("venue records started=%v ended=%v menu=%v", sawStarted, sawEnded, sawMenuEvent)
	}

	events := runtime.DrainVenueOutbox(100)
	var lifecycle, menu int
	for _, event := range events {
		if event.VenueID != venueSessionID {
			t.Fatalf("outbox event venue id = %q", event.VenueID)
		}
		switch event.Type {
		case "venue_lifecycle":
			lifecycle++
		case "menu_event":
			menu++
		}
	}
	if lifecycle != 2 || menu != 1 {
		t.Fatalf("outbox lifecycle=%d menu=%d (events=%d)", lifecycle, menu, len(events))
	}
	last := events[len(events)-1]
	if last.Name != "venue_ended" || last.Venue.Status != "ended" || last.Venue.EndReason != "manual" {
		t.Fatalf("last outbox event = %+v", last)
	}
}
