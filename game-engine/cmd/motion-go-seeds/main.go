// Command motion-go-seeds regenerates the platform motion-go seed files from
// the native game sources in game-engine/internal/games/authored/nativegames.
// Run it from the repo root ("make motion-go-seeds"); use -check to verify the
// seeds are up to date without writing.
package main

import (
	"bytes"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/lobis/motion-levels/game-engine/internal/games/authored/seedgen"
)

func main() {
	check := flag.Bool("check", false, "verify seeds are up to date; exit nonzero when stale")
	root := flag.String("root", "", "repo root (defaults to the working directory)")
	flag.Parse()

	repoRoot := *root
	if repoRoot == "" {
		wd, err := os.Getwd()
		if err != nil {
			log.Fatal(err)
		}
		repoRoot = wd
	}
	if _, err := os.Stat(filepath.Join(repoRoot, "platform", "app", "src", "lib", "seed")); err != nil {
		log.Fatalf("run from the repo root (or pass -root): %v", err)
	}

	stale := 0
	for _, seed := range seedgen.Seeds {
		generated, err := seedgen.Generate(repoRoot, seed)
		if err != nil {
			log.Fatalf("generate %s: %v", seed.SeedFile, err)
		}
		seedPath := seedgen.SeedPath(repoRoot, seed.SeedFile)
		current, err := os.ReadFile(seedPath)
		if err != nil && !os.IsNotExist(err) {
			log.Fatalf("read %s: %v", seedPath, err)
		}
		if bytes.Equal(current, generated) {
			fmt.Printf("%-28s up to date\n", seed.SeedFile)
			continue
		}
		if *check {
			fmt.Printf("%-28s STALE (regenerate with 'make motion-go-seeds')\n", seed.SeedFile)
			stale++
			continue
		}
		if err := os.WriteFile(seedPath, generated, 0o644); err != nil {
			log.Fatalf("write %s: %v", seedPath, err)
		}
		fmt.Printf("%-28s regenerated from nativegames/%s/game.go\n", seed.SeedFile, seed.Pkg)
	}
	if stale > 0 {
		os.Exit(1)
	}
}
