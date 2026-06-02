package main

import (
	"testing"
	"time"
)

func TestMakeFrameProducesCompleteLogicalBoard(t *testing.T) {
	frame := makeFrame(7, time.Unix(0, 123), 1.25, 80)
	if frame.Sequence != 7 || frame.Width != 16 || frame.Height != 32 {
		t.Fatalf("unexpected frame metadata: %+v", frame)
	}
	if len(frame.Tiles) != 16*32 {
		t.Fatalf("tile count = %d, want %d", len(frame.Tiles), 16*32)
	}
}
