package seedgen

import (
	"bytes"
	"fmt"
	"go/format"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"
)

func TestGeneratedSeedsAreUpToDate(t *testing.T) {
	root := repoRoot(t)
	for _, seed := range Seeds {
		t.Run(seed.Pkg, func(t *testing.T) {
			generated, err := Generate(root, seed)
			if err != nil {
				t.Fatal(err)
			}
			current, err := os.ReadFile(SeedPath(root, seed.SeedFile))
			if err != nil {
				t.Fatal(err)
			}
			if !bytes.Equal(current, generated) {
				t.Errorf("%s is stale; the engine copy nativegames/%s/game.go is the source of truth — run 'make motion-go-seeds' and commit the result", seed.SeedFile, seed.Pkg)
			}
		})
	}
}

func TestHandwrittenSeedsSatisfyContract(t *testing.T) {
	root := repoRoot(t)
	for _, seedFile := range HandwrittenSeedFiles {
		t.Run(seedFile, func(t *testing.T) {
			code := readSeedGoSource(t, root, seedFile)
			if err := CheckSeedContract(code); err != nil {
				t.Fatal(err)
			}
			if _, err := format.Source([]byte(code)); err != nil {
				t.Fatalf("seed does not parse as Go: %v", err)
			}
		})
	}
}

// TestSeedsCompileWithTinyGo builds every seed to WASM exactly as the platform
// does on save (platform/app/src/lib/motionGo.ts). Skipped in -short runs and
// when TinyGo is not installed.
func TestSeedsCompileWithTinyGo(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping TinyGo compilation in -short mode")
	}
	tinygo := resolveTinyGo()
	if tinygo == "" {
		t.Skip("tinygo not installed")
	}
	root := repoRoot(t)
	seedFiles := make([]string, 0, len(Seeds)+len(HandwrittenSeedFiles))
	for _, seed := range Seeds {
		seedFiles = append(seedFiles, seed.SeedFile)
	}
	seedFiles = append(seedFiles, HandwrittenSeedFiles...)
	for _, seedFile := range seedFiles {
		t.Run(seedFile, func(t *testing.T) {
			compileSeedWithTinyGo(t, tinygo, root, readSeedGoSource(t, root, seedFile))
		})
	}
}

func readSeedGoSource(t *testing.T, root string, seedFile string) string {
	t.Helper()
	raw, err := os.ReadFile(SeedPath(root, seedFile))
	if err != nil {
		t.Fatal(err)
	}
	code, err := ExtractSeedGoSource(string(raw))
	if err != nil {
		t.Fatalf("%s: %v", seedFile, err)
	}
	return code
}

func compileSeedWithTinyGo(t *testing.T, tinygo string, repoRoot string, code string) {
	t.Helper()
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "game.go"), []byte(code), 0o644); err != nil {
		t.Fatal(err)
	}
	goMod := fmt.Sprintf("module game\n\ngo 1.23\n\nrequire github.com/lobis/motion-levels v0.0.0\n\nreplace github.com/lobis/motion-levels => %s\n", repoRoot)
	if err := os.WriteFile(filepath.Join(dir, "go.mod"), []byte(goMod), 0o644); err != nil {
		t.Fatal(err)
	}
	runSeedCommand(t, dir, "go", "mod", "tidy")
	runSeedCommand(t, dir, tinygo, "build", "-target=wasi", "-scheduler=none", "-no-debug", "-o", filepath.Join(dir, "game.wasm"), filepath.Join(dir, "game.go"))
	info, err := os.Stat(filepath.Join(dir, "game.wasm"))
	if err != nil || info.Size() == 0 {
		t.Fatalf("tinygo produced no game.wasm: %v", err)
	}
}

func runSeedCommand(t *testing.T, dir string, name string, args ...string) {
	t.Helper()
	cmd := exec.Command(name, args...)
	cmd.Dir = dir
	var output bytes.Buffer
	cmd.Stdout = &output
	cmd.Stderr = &output
	start := time.Now()
	if err := cmd.Run(); err != nil {
		t.Fatalf("%s %s failed after %s: %v\n%s", name, strings.Join(args, " "), time.Since(start).Round(time.Millisecond), err, output.String())
	}
}

func resolveTinyGo() string {
	if bin := os.Getenv("TINYGO_BIN"); bin != "" {
		return bin
	}
	if path, err := exec.LookPath("tinygo"); err == nil {
		return path
	}
	for _, candidate := range []string{"/opt/homebrew/opt/tinygo/bin/tinygo", "/opt/homebrew/bin/tinygo", "/usr/local/bin/tinygo"} {
		if _, err := os.Stat(candidate); err == nil {
			return candidate
		}
	}
	return ""
}

func repoRoot(t *testing.T) string {
	t.Helper()
	_, thisFile, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("cannot locate test file")
	}
	// game-engine/internal/games/authored/seedgen -> repo root is five directories up.
	return filepath.Clean(filepath.Join(filepath.Dir(thisFile), "..", "..", "..", "..", ".."))
}
