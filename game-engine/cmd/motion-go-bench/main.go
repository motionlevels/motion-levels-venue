package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"sort"
	"strings"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/authored"
)

type benchResult struct {
	Game          string  `json:"game"`
	Runtime       string  `json:"runtime"`
	Frames        int     `json:"frames"`
	Errored       bool    `json:"errored,omitempty"`
	Error         string  `json:"error,omitempty"`
	AverageMicros float64 `json:"averageMicros,omitempty"`
	MinMicros     int64   `json:"minMicros,omitempty"`
	P50Micros     int64   `json:"p50Micros,omitempty"`
	P95Micros     int64   `json:"p95Micros,omitempty"`
	MaxMicros     int64   `json:"maxMicros,omitempty"`
}

func main() {
	platformURL := flag.String("platform-url", os.Getenv("MOTION_LEVELS_PLATFORM_URL"), "platform base URL that serves /api/game-runtime")
	gamesFlag := flag.String("games", "authored-tetris,authored-ping-pong-motion", "comma-separated authored game ids")
	runtimesFlag := flag.String("runtimes", "native,wasm", "comma-separated runtimes: native, wasm")
	frames := flag.Int("frames", 300, "frames to render per game/runtime")
	fps := flag.Int("fps", 50, "simulated frames per second")
	players := flag.Int("players", 1, "player count")
	difficulty := flag.String("difficulty", "medium", "difficulty sent to motion-go-v1 init")
	seed := flag.Int64("seed", 12345, "deterministic seed")
	flag.Parse()

	if strings.TrimSpace(*platformURL) == "" {
		fmt.Fprintln(os.Stderr, "-platform-url is required, or set MOTION_LEVELS_PLATFORM_URL")
		os.Exit(2)
	}
	if *frames < 1 {
		*frames = 1
	}
	if *fps < 1 {
		*fps = 1
	}

	results := make([]benchResult, 0)
	for _, game := range splitList(*gamesFlag) {
		for _, runtime := range splitList(*runtimesFlag) {
			results = append(results, runBench(*platformURL, game, runtime, *frames, *fps, *players, *difficulty, *seed))
		}
	}
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(map[string]any{"results": results}); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func splitList(value string) []string {
	parts := strings.Split(value, ",")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		clean := strings.TrimSpace(part)
		if clean != "" {
			out = append(out, clean)
		}
	}
	return out
}

func runBench(platformURL string, gameID string, runtime string, frames int, fps int, players int, difficulty string, seed int64) benchResult {
	result := benchResult{Game: gameID, Runtime: runtime, Frames: frames}
	start := time.Unix(1_700_000_000, 0)
	game, err := authored.NewWithSeedRuntime(start, seed, gameID, players, nil, platformURL, difficulty, "", runtime)
	if err != nil {
		result.Errored = true
		result.Error = err.Error()
		return result
	}
	step := time.Duration(float64(time.Second) / float64(fps))
	durations := make([]time.Duration, 0, frames)
	for frame := 0; frame < frames; frame++ {
		frameAt := start.Add(time.Duration(frame) * step)
		begin := time.Now()
		_ = game.Render(frameAt)
		durations = append(durations, time.Since(begin))
	}
	sort.Slice(durations, func(i, j int) bool { return durations[i] < durations[j] })
	total := time.Duration(0)
	for _, duration := range durations {
		total += duration
	}
	result.AverageMicros = float64(total.Microseconds()) / float64(len(durations))
	result.MinMicros = durations[0].Microseconds()
	result.P50Micros = percentileMicros(durations, 0.50)
	result.P95Micros = percentileMicros(durations, 0.95)
	result.MaxMicros = durations[len(durations)-1].Microseconds()
	return result
}

func percentileMicros(durations []time.Duration, percentile float64) int64 {
	if len(durations) == 0 {
		return 0
	}
	index := int(float64(len(durations)-1) * percentile)
	if index < 0 {
		index = 0
	}
	if index >= len(durations) {
		index = len(durations) - 1
	}
	return durations[index].Microseconds()
}
