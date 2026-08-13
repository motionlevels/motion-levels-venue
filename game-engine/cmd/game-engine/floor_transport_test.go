package main

import (
	"testing"

	"github.com/lobis/motion-levels/packages/contracts/floorpb"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
)

func TestDesiredFrameEnvelopePacksRGBWithoutBusinessIdentity(t *testing.T) {
	frame := &recordingpb.FrameRecord{
		Sequence: 7, UnixNanos: 123, Width: 4, Height: 2,
		SessionId: "session-must-stay-in-engine", VenueSessionId: "venue-must-stay-in-engine",
		Tiles: []*recordingpb.TileState{
			{X: 1, Y: 0, R: 10, G: 20, B: 30},
			{X: 3, Y: 1, R: 40, G: 50, B: 60},
		},
	}
	envelope, err := desiredFrameEnvelope(frame)
	if err != nil {
		t.Fatal(err)
	}
	desired := envelope.GetDesiredFrame()
	if desired == nil || desired.Sequence != 7 || desired.UnixNanos != 123 || desired.Width != 4 || desired.Height != 2 {
		t.Fatalf("unexpected desired frame: %+v", desired)
	}
	if len(desired.Rgb) != 4*2*3 {
		t.Fatalf("RGB length = %d, want 24", len(desired.Rgb))
	}
	if desired.Rgb[3] != 10 || desired.Rgb[4] != 20 || desired.Rgb[5] != 30 {
		t.Fatalf("unexpected first RGB pixel: %v", desired.Rgb[3:6])
	}
	if desired.Rgb[21] != 40 || desired.Rgb[22] != 50 || desired.Rgb[23] != 60 {
		t.Fatalf("unexpected last RGB pixel: %v", desired.Rgb[21:24])
	}
}

func TestDesiredFrameEnvelopeRejectsMissingDimensions(t *testing.T) {
	if _, err := desiredFrameEnvelope(&recordingpb.FrameRecord{Sequence: 1}); err == nil {
		t.Fatal("expected missing dimensions error")
	}
}

func TestLegacyPressureEventPreservesPhysicalCoordinates(t *testing.T) {
	event := legacyPressureEvent(&floorpb.PressureEvent{
		Sequence: 5, UnixNanos: 99, X: 2, Y: 3, Pressed: true,
		HardwareController: 1, HardwareChannel: 4, HardwarePosition: 8,
	})
	if event.Sequence != 5 || event.UnixNanos != 99 || event.X != 2 || event.Y != 3 || !event.Pressed {
		t.Fatalf("unexpected logical event: %+v", event)
	}
	if event.Source != "floor-v2" || event.Controller != 1 || event.Channel != 4 || event.Position != 8 {
		t.Fatalf("unexpected physical event: %+v", event)
	}
}
