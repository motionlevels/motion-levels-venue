package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestMakeFrameProducesCompleteLogicalBoard(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil)
	frame := makeFrame(7, time.Unix(0, 123), 1.25, runtime)
	if frame.Sequence != 7 || frame.Width != 16 || frame.Height != 32 {
		t.Fatalf("unexpected frame metadata: %+v", frame)
	}
	if len(frame.Tiles) != 16*32 {
		t.Fatalf("tile count = %d, want %d", len(frame.Tiles), 16*32)
	}
}

func TestConfigNormalizeClampsPlaybackSettings(t *testing.T) {
	cfg := config{FPS: 0, Brightness: 200, MusicVolume: 2, CueVolume: -1, PlayerCount: 99}
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

	loop := configForSelection(base, "loop", 6)
	if loop.Game != "loop" {
		t.Fatalf("loop game = %q", loop.Game)
	}
	if loop.MusicRef != "Motion/canciones/Background01.mp3" {
		t.Fatalf("loop music = %q, want Background01", loop.MusicRef)
	}
}

func TestGameAPIStatusAndSelect(t *testing.T) {
	runtime := newGameRuntime(config{Brightness: 80, PlayerCount: 1}, nil)
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
	if len(status.Catalog) != 2 {
		t.Fatalf("catalog = %d entries, want 2", len(status.Catalog))
	}

	body := bytes.NewBufferString(`{"game":"whack-a-mole","playerCount":3}`)
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
	if status.CurrentGame != "whack-a-mole" || status.PlayerCount != 3 {
		t.Fatalf("selected status = %+v", status)
	}
}
