package authored

import (
	"fmt"
	"go/format"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

// The motion-go games that ship both as an editable platform seed
// (platform/app/src/lib/seed/*.ts, compiled to WASM by TinyGo) and as an
// embedded native copy (nativegames/*/game.go, run by the native runtime).
// Both copies must contain the same gameplay code or the floor behaves
// differently from the editor preview and the WASM fallback.
//
// patronesgo and saltosgo are excluded on purpose: they are thin native
// adapters over the built-in patrones/saltos engines, not copies of the seed.
var seedParityPairs = []struct {
	seedFile string
	pkg      string
}{
	{seedFile: "duelMotionGo.ts", pkg: "duelgo"},
	{seedFile: "lavaMotionGo.ts", pkg: "lavago"},
	{seedFile: "memoryChallengeMotionGo.ts", pkg: "memorychallengego"},
	{seedFile: "tetrisMotionGo.ts", pkg: "tetris"},
	{seedFile: "whackAMoleMotionGo.ts", pkg: "whackamolego"},
}

func TestNativeGamesMatchPlatformSeeds(t *testing.T) {
	root := repoRootForSeedParity(t)
	for _, pair := range seedParityPairs {
		t.Run(pair.pkg, func(t *testing.T) {
			seedPath := filepath.Join(root, "platform", "app", "src", "lib", "seed", pair.seedFile)
			nativePath := filepath.Join(root, "game-engine", "internal", "games", "authored", "nativegames", pair.pkg, "game.go")
			seedGo, err := seedGoSource(seedPath, pair.pkg)
			if err != nil {
				t.Fatal(err)
			}
			nativeGo, err := os.ReadFile(nativePath)
			if err != nil {
				t.Fatal(err)
			}
			seedNorm, err := normalizeGoForParity(seedGo)
			if err != nil {
				t.Fatalf("seed %s does not parse as Go: %v", pair.seedFile, err)
			}
			nativeNorm, err := normalizeGoForParity(string(nativeGo))
			if err != nil {
				t.Fatalf("native %s does not parse as Go: %v", nativePath, err)
			}
			if seedNorm != nativeNorm {
				t.Errorf("gameplay code drifted between %s and nativegames/%s/game.go; sync both copies in the same change\nfirst difference:\n%s",
					pair.seedFile, pair.pkg, firstParityDiff(seedNorm, nativeNorm))
			}
		})
	}
}

// seedGoSource extracts the Go source embedded in a platform seed .ts file and
// rewrites the bits that legitimately differ from the native copy: the package
// clause and the WASM-only func main stub.
func seedGoSource(path string, pkg string) (string, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	text := string(raw)
	begin := strings.Index(text, "String.raw`")
	end := strings.LastIndex(text, "`")
	if begin < 0 || end <= begin {
		return "", fmt.Errorf("no String.raw backtick block in %s", path)
	}
	code := text[begin+len("String.raw`") : end]
	code = strings.Replace(code, "package main", "package "+pkg, 1)
	code = strings.Replace(code, "func main() {}\n", "", 1)
	return code, nil
}

func normalizeGoForParity(code string) (string, error) {
	lines := strings.Split(code, "\n")
	kept := make([]string, 0, len(lines))
	for _, line := range lines {
		if strings.HasPrefix(strings.TrimSpace(line), "// Code generated") {
			continue
		}
		kept = append(kept, line)
	}
	formatted, err := format.Source([]byte(strings.Join(kept, "\n")))
	if err != nil {
		return "", err
	}
	return string(formatted), nil
}

func firstParityDiff(left string, right string) string {
	leftLines := strings.Split(left, "\n")
	rightLines := strings.Split(right, "\n")
	for i := 0; i < len(leftLines) || i < len(rightLines); i++ {
		leftLine, rightLine := "<missing>", "<missing>"
		if i < len(leftLines) {
			leftLine = leftLines[i]
		}
		if i < len(rightLines) {
			rightLine = rightLines[i]
		}
		if leftLine != rightLine {
			return fmt.Sprintf("line %d:\n  seed:   %s\n  native: %s", i+1, leftLine, rightLine)
		}
	}
	return "<identical>"
}

func repoRootForSeedParity(t *testing.T) string {
	t.Helper()
	_, thisFile, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("cannot locate test file")
	}
	// game-engine/internal/games/authored -> repo root is four directories up.
	return filepath.Clean(filepath.Join(filepath.Dir(thisFile), "..", "..", "..", ".."))
}
