package audio

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"testing"
)

func TestPlayerPreloadSkipsMissingRefs(t *testing.T) {
	dir := t.TempDir()
	backend := &preloadBackend{}
	player := NewPlayer(dir, backend)

	if err := player.Preload("missing.mp3"); err != nil {
		t.Fatal(err)
	}
	if len(backend.paths) != 0 {
		t.Fatalf("preloaded paths = %v, want none", backend.paths)
	}
}

func TestPlayerPreloadSkipsBackendFailures(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "cue.mp3")
	if err := os.WriteFile(path, []byte("audio"), 0o644); err != nil {
		t.Fatal(err)
	}
	player := NewPlayer(dir, &failingPreloadBackend{})

	if err := player.Preload("cue.mp3"); err != nil {
		t.Fatal(err)
	}
}

type failingPreloadBackend struct{}

func (b *failingPreloadBackend) Play(context.Context, string, float64) error {
	return nil
}

func (b *failingPreloadBackend) Preload(string) error {
	return errors.New("boom")
}
