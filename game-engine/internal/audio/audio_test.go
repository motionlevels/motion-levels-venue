package audio

import (
	"context"
	"os"
	"path/filepath"
	"testing"
)

func TestResolveUsesAssetDirectory(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "Motion", "sonidos", "acierto.mp3")
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte("audio"), 0o644); err != nil {
		t.Fatal(err)
	}

	player := NewPlayer(dir, fakeBackend{})
	got, err := player.Resolve("Motion/sonidos/acierto.mp3")
	if err != nil {
		t.Fatal(err)
	}
	if got != path {
		t.Fatalf("resolved path = %q, want %q", got, path)
	}
}

func TestStartLoopReplacesPreviousLoop(t *testing.T) {
	dir := t.TempDir()
	first := filepath.Join(dir, "first.mp3")
	second := filepath.Join(dir, "second.mp3")
	for _, path := range []string{first, second} {
		if err := os.WriteFile(path, []byte("audio"), 0o644); err != nil {
			t.Fatal(err)
		}
	}

	backend := &blockingBackend{started: make(chan string, 2)}
	player := NewPlayer(dir, backend)
	if err := player.StartLoop("first.mp3", 0.1); err != nil {
		t.Fatal(err)
	}
	if got := <-backend.started; got != first {
		t.Fatalf("first loop path = %q, want %q", got, first)
	}
	if err := player.StartLoop("second.mp3", 0.1); err != nil {
		t.Fatal(err)
	}
	if got := <-backend.started; got != second {
		t.Fatalf("second loop path = %q, want %q", got, second)
	}
	player.StopLoop()
}

func TestCommandArgsForCommonPlayers(t *testing.T) {
	if got := commandArgs("afplay", "/tmp/a.mp3", 0.25); len(got) != 3 || got[0] != "-v" || got[1] != "0.250" {
		t.Fatalf("afplay args = %v", got)
	}
	if got := commandArgs("mpv", "/tmp/a.mp3", 0.25); len(got) != 4 || got[2] != "--volume=25" {
		t.Fatalf("mpv args = %v", got)
	}
	if got := commandArgs("ffplay", "/tmp/a.mp3", 0.25); len(got) != 7 || got[5] != "25" {
		t.Fatalf("ffplay args = %v", got)
	}
}

func TestEnsureStereoPCM16DuplicatesMonoSamples(t *testing.T) {
	mono := []byte{1, 2, 3, 4}
	got := ensureStereoPCM16(mono, 1)
	want := []byte{1, 2, 1, 2, 3, 4, 3, 4}
	if string(got) != string(want) {
		t.Fatalf("stereo pcm = %v, want %v", got, want)
	}
}

func TestNormalizePCMResamplesToTargetRate(t *testing.T) {
	stereo := []byte{
		0, 0, 0, 0,
		10, 0, 20, 0,
	}
	got := normalizePCM(stereo, 24000, 2, 48000)
	if len(got) != 16 {
		t.Fatalf("resampled byte length = %d, want 16", len(got))
	}
}

func TestPlayerPreloadUsesBackendWhenAvailable(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "cue.mp3")
	if err := os.WriteFile(path, []byte("audio"), 0o644); err != nil {
		t.Fatal(err)
	}
	backend := &preloadBackend{}
	player := NewPlayer(dir, backend)
	if err := player.Preload("cue.mp3"); err != nil {
		t.Fatal(err)
	}
	if len(backend.paths) != 1 || backend.paths[0] != path {
		t.Fatalf("preloaded paths = %v, want [%s]", backend.paths, path)
	}
}

func TestPreloadCachesResolvedPathForCuePlayback(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "cue.mp3")
	if err := os.WriteFile(path, []byte("audio"), 0o644); err != nil {
		t.Fatal(err)
	}
	player := NewPlayer(dir, &preloadBackend{})
	if err := player.Preload("cue.mp3"); err != nil {
		t.Fatal(err)
	}
	if err := os.Remove(path); err != nil {
		t.Fatal(err)
	}
	got, err := player.Resolve("cue.mp3")
	if err != nil {
		t.Fatal(err)
	}
	if got != path {
		t.Fatalf("resolved path = %q, want cached %q", got, path)
	}
}

type fakeBackend struct{}

func (fakeBackend) Play(context.Context, string, float64) error {
	return nil
}

type blockingBackend struct {
	started chan string
}

func (b *blockingBackend) Play(ctx context.Context, path string, volume float64) error {
	b.started <- path
	<-ctx.Done()
	return context.Canceled
}

type preloadBackend struct {
	paths []string
}

func (b *preloadBackend) Play(context.Context, string, float64) error {
	return nil
}

func (b *preloadBackend) Preload(path string) error {
	b.paths = append(b.paths, path)
	return nil
}
