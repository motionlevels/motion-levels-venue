package main

import (
	"bufio"
	"flag"
	"log"
	"math"
	"net"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/packages/contracts/pbstream"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
)

type config struct {
	ControllerAddr string
	FPS            int
	Brightness     int
}

func main() {
	cfg := config{}
	flag.StringVar(&cfg.ControllerAddr, "controller", "127.0.0.1:9090", "floor-controller frame stream address")
	flag.IntVar(&cfg.FPS, "fps", 20, "frames per second")
	flag.IntVar(&cfg.Brightness, "brightness", 80, "brightness percentage, 1-100")
	flag.Parse()

	if cfg.FPS < 1 {
		cfg.FPS = 1
	}
	if cfg.Brightness < 1 {
		cfg.Brightness = 1
	}
	if cfg.Brightness > 100 {
		cfg.Brightness = 100
	}

	for {
		if err := run(cfg); err != nil {
			log.Printf("game-engine stream ended: %v", err)
			time.Sleep(time.Second)
		}
	}
}

func run(cfg config) error {
	conn, err := net.Dial("tcp", cfg.ControllerAddr)
	if err != nil {
		return err
	}
	defer conn.Close()
	log.Printf("connected to floor-controller: %s", cfg.ControllerAddr)

	writer := bufio.NewWriterSize(conn, 1<<20)
	ticker := time.NewTicker(time.Duration(float64(time.Second) / float64(cfg.FPS)))
	defer ticker.Stop()

	startedAt := time.Now()
	var sequence uint64
	for now := range ticker.C {
		sequence++
		frame := makeFrame(sequence, now, now.Sub(startedAt).Seconds(), cfg.Brightness)
		if err := pbstream.Write(writer, frame); err != nil {
			return err
		}
		if err := writer.Flush(); err != nil {
			return err
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
