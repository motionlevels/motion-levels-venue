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

	"github.com/lobis/motion-levels/game-engine/internal/audio"
	"github.com/lobis/motion-levels/game-engine/internal/sessionrecording"
	"github.com/lobis/motion-levels/packages/contracts/gamepb"
)

func TestMakeFrameProducesCompleteLogicalBoard(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
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

func TestCueForPressureUsesCurrentTileColor(t *testing.T) {
	cfg := config{CoinCueRef: "coin", DamageCueRef: "damage"}
	var foundCoin bool
	var foundDamage bool

	for y := 0; y < 32; y++ {
		for x := 0; x < 16; x++ {
			switch cueForPressure(cfg, x, y, 0) {
			case "coin":
				foundCoin = true
			case "damage":
				foundDamage = true
			}
		}
	}

	if !foundCoin || !foundDamage {
		t.Fatalf("classifier found coin=%v damage=%v, want both", foundCoin, foundDamage)
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

	loop := configForSelection(base, "loop", 6)
	if loop.Game != "loop" {
		t.Fatalf("loop game = %q", loop.Game)
	}
	if loop.MusicRef != "Motion/canciones/Background01.mp3" {
		t.Fatalf("loop music = %q, want Background01", loop.MusicRef)
	}

	comet := configForSelection(base, "ambient-comet", 1)
	if comet.Game != "ambient-comet" {
		t.Fatalf("ambient game = %q, want ambient-comet", comet.Game)
	}
	if comet.MusicRef != "Motion/canciones/Background01.mp3" {
		t.Fatalf("ambient music = %q, want Background01", comet.MusicRef)
	}
}

func TestGameAPIStatusAndSelect(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, nil)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

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
	if len(status.Catalog) != 6 {
		t.Fatalf("catalog = %d entries, want 6", len(status.Catalog))
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
}

func TestAmbientSelectionChangesRenderedFrame(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 100, PlayerCount: 1, Game: "loop"}, nil, nil)
	now := time.Now()
	loopFrame := makeFrame(1, now, 0, runtime)

	runtime.SelectGameWithDifficulty("ambient-spark", 1, "")
	sparkFrame := makeFrame(2, now.Add(500*time.Millisecond), 0.5, runtime)

	var different bool
	for i := range loopFrame.Tiles {
		left := loopFrame.Tiles[i]
		right := sparkFrame.Tiles[i]
		if left.R != right.R || left.G != right.G || left.B != right.B {
			different = true
			break
		}
	}
	if !different {
		t.Fatal("ambient-spark frame matched loop frame exactly")
	}
	if runtime.Status().CurrentGame != "ambient-spark" {
		t.Fatalf("status game = %q, want ambient-spark", runtime.Status().CurrentGame)
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
	if runtime.Status().CurrentGame != "loop" {
		t.Fatalf("exit game = %q, want loop", runtime.Status().CurrentGame)
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
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "loop"}, player, nil)

	runtime.SelectGameWithDifficulty("lava", 1, "easy")
	runtime.SelectGameWithDifficulty("loop", 1, "")
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
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "loop"}, player, nil)
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
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "loop", NarrationCueRef: "cue.mp3"}, player, nil)
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
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1, Game: "loop"}, player, nil)
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

	runtime.SelectGameWithDifficulty("loop", 1, "")
	runtime.SelectGameWithDifficulty("lava", 1, "easy")
	status = runtime.DisplayStatus(time.Now())
	if status.Phase == "intro" || status.IntroRemainingMillis != 0 {
		t.Fatalf("second launch status = %+v, want no intro hold", status)
	}
	backend.waitForCount(t, countdownPath, 2)
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
	startedAt := time.Date(2026, 6, 3, 13, 0, 0, 0, time.UTC)
	recorder, err := sessionrecording.New(dir, startedAt, sessionrecording.Options{MaxSegmentDuration: 24 * time.Hour})
	if err != nil {
		t.Fatal(err)
	}
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil, recorder)
	server := httptest.NewServer(gameAPIHandler(runtime))
	defer server.Close()

	response, err := http.Post(server.URL+"/api/select", "application/json", bytes.NewBufferString(`{"game":"whack-a-mole","playerCount":2}`))
	if err != nil {
		t.Fatal(err)
	}
	_ = response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("select response = %d", response.StatusCode)
	}
	runtime.RecordDisplaySnapshot(runtime.DisplayStatus(time.Now()), time.Now())
	if err := recorder.Close(); err != nil {
		t.Fatal(err)
	}

	var sawSessionStarted, sawMenuCommand, sawAPIInteraction, sawDisplay bool
	_, err = sessionrecording.ReadRecoverable(filepath.Join(dir, "20260603T130000Z.game.pbstream"), func(record *gamepb.GameSessionRecord) error {
		switch record.Payload.(type) {
		case *gamepb.GameSessionRecord_SessionStarted:
			sawSessionStarted = true
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
