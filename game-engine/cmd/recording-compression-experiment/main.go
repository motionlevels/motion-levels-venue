package main

import (
	"bufio"
	"compress/gzip"
	"encoding/binary"
	"flag"
	"fmt"
	"log"
	"math"
	"os"
	"path/filepath"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
	"google.golang.org/protobuf/proto"
)

type config struct {
	OutDir     string
	FPS        int
	Duration   time.Duration
	Loop       time.Duration
	Brightness int
}

func main() {
	cfg := config{}
	flag.StringVar(&cfg.OutDir, "out", "recordings/compression-experiment", "output directory")
	flag.IntVar(&cfg.FPS, "fps", 30, "frames per second")
	flag.DurationVar(&cfg.Duration, "duration", time.Hour, "recording duration to generate")
	flag.DurationVar(&cfg.Loop, "loop", 10*time.Second, "animation loop duration")
	flag.IntVar(&cfg.Brightness, "brightness", 80, "brightness percentage")
	flag.Parse()

	if err := cfg.validate(); err != nil {
		log.Fatal(err)
	}
	if err := os.MkdirAll(cfg.OutDir, 0o755); err != nil {
		log.Fatal(err)
	}

	rawPath := filepath.Join(cfg.OutDir, fmt.Sprintf("loop-%s-%dfps.raw.pbstream", cleanDuration(cfg.Duration), cfg.FPS))
	perFrameGzipPath := filepath.Join(cfg.OutDir, fmt.Sprintf("loop-%s-%dfps.per-frame.pbstream.gz", cleanDuration(cfg.Duration), cfg.FPS))
	if err := generate(cfg, rawPath, perFrameGzipPath); err != nil {
		log.Fatal(err)
	}
	log.Printf("raw: %s", rawPath)
	log.Printf("per-frame gzip: %s", perFrameGzipPath)
}

func (c config) validate() error {
	if c.FPS < 1 {
		return fmt.Errorf("fps must be at least 1")
	}
	if c.Duration <= 0 {
		return fmt.Errorf("duration must be positive")
	}
	if c.Loop <= 0 {
		return fmt.Errorf("loop must be positive")
	}
	if c.Brightness < 1 || c.Brightness > 100 {
		return fmt.Errorf("brightness must be between 1 and 100")
	}
	return nil
}

func generate(cfg config, rawPath, perFrameGzipPath string) error {
	rawFile, err := os.Create(rawPath)
	if err != nil {
		return err
	}
	defer rawFile.Close()
	rawWriter := bufio.NewWriterSize(rawFile, 1<<20)
	defer rawWriter.Flush()

	perFrameGzipFile, err := os.Create(perFrameGzipPath)
	if err != nil {
		return err
	}
	defer perFrameGzipFile.Close()
	perFrameGzipWriter := bufio.NewWriterSize(perFrameGzipFile, 1<<20)
	defer perFrameGzipWriter.Flush()

	frameCount := int(math.Round(cfg.Duration.Seconds() * float64(cfg.FPS)))
	loopFrames := max(1, int(math.Round(cfg.Loop.Seconds()*float64(cfg.FPS))))
	start := time.Date(2026, 6, 3, 12, 0, 0, 0, time.UTC)
	step := time.Duration(float64(time.Second) / float64(cfg.FPS))

	for i := 0; i < frameCount; i++ {
		loopFrame := i % loopFrames
		frame := makeFrame(uint64(i+1), start.Add(time.Duration(i)*step), float64(loopFrame)/float64(cfg.FPS), cfg.Brightness)
		payload, err := proto.Marshal(frame)
		if err != nil {
			return err
		}
		lengthPrefixed := lengthPrefix(payload)
		if _, err := rawWriter.Write(lengthPrefixed); err != nil {
			return err
		}
		compressed, err := gzipFrame(lengthPrefixed)
		if err != nil {
			return err
		}
		if _, err := perFrameGzipWriter.Write(compressed); err != nil {
			return err
		}
		if (i+1)%10000 == 0 {
			log.Printf("generated %d/%d frames", i+1, frameCount)
		}
	}
	return nil
}

func makeFrame(sequence uint64, now time.Time, seconds float64, brightness int) *recordingpb.FrameRecord {
	scale := float64(brightness) / 100
	frame := &recordingpb.FrameRecord{
		Sequence:  sequence,
		UnixNanos: now.UnixNano(),
		Width:     animation.GridWidth,
		Height:    animation.GridHeight,
		Tiles:     make([]*recordingpb.TileState, 0, animation.GridWidth*animation.GridHeight),
	}
	for y := 0; y < animation.GridHeight; y++ {
		for x := 0; x < animation.GridWidth; x++ {
			color := animation.LoopColor(x, y, seconds)
			frame.Tiles = append(frame.Tiles, &recordingpb.TileState{
				X: uint32(x),
				Y: uint32(y),
				R: uint32(math.Round(float64(color.R) * scale)),
				G: uint32(math.Round(float64(color.G) * scale)),
				B: uint32(math.Round(float64(color.B) * scale)),
			})
		}
	}
	return frame
}

func lengthPrefix(payload []byte) []byte {
	var length [binary.MaxVarintLen64]byte
	n := binary.PutUvarint(length[:], uint64(len(payload)))
	out := make([]byte, n+len(payload))
	copy(out, length[:n])
	copy(out[n:], payload)
	return out
}

func gzipFrame(data []byte) ([]byte, error) {
	var out bufferedBytes
	writer := gzip.NewWriter(&out)
	if _, err := writer.Write(data); err != nil {
		_ = writer.Close()
		return nil, err
	}
	if err := writer.Close(); err != nil {
		return nil, err
	}
	return out.bytes, nil
}

type bufferedBytes struct {
	bytes []byte
}

func (b *bufferedBytes) Write(data []byte) (int, error) {
	b.bytes = append(b.bytes, data...)
	return len(data), nil
}

func cleanDuration(duration time.Duration) string {
	return duration.String()
}
