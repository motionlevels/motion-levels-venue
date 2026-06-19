package main

import (
	"flag"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/games/temporada1"
	"github.com/lobis/motion-levels/game-engine/internal/games/temporada2"
)

const (
	gridWidth  = animation.GridWidth
	gridHeight = animation.GridHeight
	pitch      = 15
	gap        = 2
	lit        = pitch - gap
	margin     = 1
	frameCount = 72
	delayCS    = 3
)

var previewPalette = color.Palette{
	color.RGBA{R: 5, G: 7, B: 10, A: 255},
	color.RGBA{R: 13, G: 19, B: 30, A: 255},
	color.RGBA{R: 0, G: 230, B: 62, A: 255},
	color.RGBA{R: 112, G: 255, B: 92, A: 255},
	color.RGBA{R: 20, G: 92, B: 255, A: 255},
	color.RGBA{R: 42, G: 138, B: 255, A: 255},
	color.RGBA{R: 245, G: 38, B: 255, A: 255},
	color.RGBA{R: 245, G: 250, B: 255, A: 255},
	color.RGBA{R: 255, G: 28, B: 40, A: 255},
	color.RGBA{R: 255, G: 80, B: 26, A: 255},
	color.RGBA{R: 255, G: 160, B: 30, A: 255},
	color.RGBA{R: 0, G: 80, B: 32, A: 255},
	color.RGBA{R: 10, G: 38, B: 96, A: 255},
	color.RGBA{R: 84, G: 10, B: 18, A: 255},
}

type renderer func(level string, now time.Time) []animation.RGB

type previewLevel struct {
	ID string
}

func main() {
	output := flag.String("output", "/tmp/motion-levels-season-previews", "preview output directory")
	season := flag.String("season", "all", "season to render: all, temporada1, temporada2")
	force := flag.Bool("force", false, "overwrite existing WebP previews")
	flag.Parse()

	if err := os.MkdirAll(*output, 0o755); err != nil {
		fatal(err)
	}

	now := time.Unix(1_700_000_000, 0)
	if *season == "all" || *season == "temporada1" {
		renderLevels(*output, "temporada1", temporada1PreviewLevels(), *force, func(level string, at time.Time) []animation.RGB {
			return temporada1.NewWithSeed(now, 1, 4, "medium", level).Render(at)
		}, now)
	}
	if *season == "all" || *season == "temporada2" {
		renderLevels(*output, "temporada2", temporada2PreviewLevels(), *force, func(level string, at time.Time) []animation.RGB {
			return temporada2.NewWithSeed(now, 1, 4, "easy", level).Render(at)
		}, now)
	}
}

func temporada1PreviewLevels() []previewLevel {
	levels := temporada1.Levels()
	out := make([]previewLevel, 0, len(levels))
	for _, level := range levels {
		out = append(out, previewLevel{ID: level.ID})
	}
	return out
}

func temporada2PreviewLevels() []previewLevel {
	levels := temporada2.Levels()
	out := make([]previewLevel, 0, len(levels))
	for _, level := range levels {
		out = append(out, previewLevel{ID: level.ID})
	}
	return out
}

func renderLevels(output string, prefix string, levels []previewLevel, force bool, render renderer, now time.Time) {
	for index, level := range levels {
		path := filepath.Join(output, fmt.Sprintf("%s-level-%d.webp", prefix, index+1))
		if !force && exists(path) {
			fmt.Printf("kept %s\n", path)
			continue
		}
		if err := writePreviewWebP(path, level.ID, render, now); err != nil {
			fatal(fmt.Errorf("%s %s: %w", prefix, level.ID, err))
		}
		fmt.Printf("wrote %s\n", path)
	}
}

func writePreviewWebP(path string, level string, render renderer, now time.Time) error {
	frames := make([]*image.Paletted, 0, frameCount)
	start := now.Add(3300 * time.Millisecond)
	for frame := 0; frame < frameCount; frame++ {
		at := start.Add(time.Duration(frame) * 100 * time.Millisecond)
		frames = append(frames, renderFrame(render(level, at)))
	}
	return writeAnimatedWebP(path, frames, delayCS*10)
}

func writeAnimatedWebP(path string, frames []*image.Paletted, delayMS int) error {
	if len(frames) == 0 {
		return fmt.Errorf("no frames")
	}
	dir, err := os.MkdirTemp("", "motion-season-preview-*")
	if err != nil {
		return err
	}
	defer os.RemoveAll(dir)
	args := []string{"-loop", "0"}
	for index, frame := range frames {
		framePath := filepath.Join(dir, fmt.Sprintf("frame-%04d.png", index))
		file, err := os.Create(framePath)
		if err != nil {
			return err
		}
		encodeErr := png.Encode(file, frame)
		closeErr := file.Close()
		if encodeErr != nil {
			return encodeErr
		}
		if closeErr != nil {
			return closeErr
		}
		args = append(args, "-d", strconv.Itoa(delayMS), framePath)
	}
	args = append(args, "-o", path)
	if output, err := exec.Command("img2webp", args...).CombinedOutput(); err != nil {
		return fmt.Errorf("img2webp: %w: %s", err, strings.TrimSpace(string(output)))
	}
	return nil
}

func renderFrame(frame []animation.RGB) *image.Paletted {
	width := gridHeight*pitch + gap
	height := gridWidth*pitch + gap
	img := image.NewPaletted(image.Rect(0, 0, width, height), previewPalette)
	fill(img, 0)
	for y := 0; y < gridHeight; y++ {
		for x := 0; x < gridWidth; x++ {
			index := y*gridWidth + x
			colorIndex := uint8(1)
			if index >= 0 && index < len(frame) {
				colorIndex = nearestPaletteIndex(frame[index])
			}
			drawTile(img, x, y, colorIndex)
		}
	}
	return img
}

func drawTile(img *image.Paletted, x, y int, index uint8) {
	drawX := gridHeight - 1 - y
	drawY := x
	left := margin + drawX*pitch
	top := margin + drawY*pitch
	for py := top; py < top+lit; py++ {
		for px := left; px < left+lit; px++ {
			img.SetColorIndex(px, py, index)
		}
	}
}

func nearestPaletteIndex(value animation.RGB) uint8 {
	bestIndex := uint8(0)
	bestDistance := math.MaxFloat64
	for index, candidate := range previewPalette {
		r, g, b, _ := candidate.RGBA()
		dr := float64(value.R) - float64(r>>8)
		dg := float64(value.G) - float64(g>>8)
		db := float64(value.B) - float64(b>>8)
		distance := dr*dr + dg*dg + db*db
		if distance < bestDistance {
			bestDistance = distance
			bestIndex = uint8(index)
		}
	}
	return bestIndex
}

func fill(img *image.Paletted, index uint8) {
	for i := range img.Pix {
		img.Pix[i] = index
	}
}

func exists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

func fatal(err error) {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(1)
}
