package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"log"
	"net"
	"time"

	"github.com/lobis/motion-levels/packages/contracts/floorpb"
	"github.com/lobis/motion-levels/packages/contracts/inputpb"
	"github.com/lobis/motion-levels/packages/contracts/pbstream"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
)

const (
	floorProtocolV2       = 2
	maxFloorEnvelopeBytes = 1 << 20
)

func runDuplexController(cfg config, runtime *gameRuntime) (bool, error) {
	conn, err := net.DialTimeout("tcp", cfg.ControllerDuplexAddr, 2*time.Second)
	if err != nil {
		return false, err
	}
	established := false
	defer conn.Close()

	reader := bufio.NewReaderSize(conn, 1<<20)
	writer := bufio.NewWriterSize(conn, 1<<20)
	if err := conn.SetDeadline(time.Now().Add(3 * time.Second)); err != nil {
		return false, err
	}
	if err := pbstream.Write(writer, &floorpb.Envelope{Payload: &floorpb.Envelope_EngineHello{
		EngineHello: &floorpb.EngineHello{ProtocolVersion: floorProtocolV2, EngineRevision: buildRevision},
	}}); err != nil {
		return false, err
	}
	if err := writer.Flush(); err != nil {
		return false, err
	}
	var response floorpb.Envelope
	if err := pbstream.ReadLimit(reader, &response, maxFloorEnvelopeBytes); err != nil {
		return false, err
	}
	hello := response.GetAdapterHello()
	if hello == nil || hello.ProtocolVersion != floorProtocolV2 {
		return false, fmt.Errorf("floor adapter returned protocol %d", hello.GetProtocolVersion())
	}
	if err := conn.SetDeadline(time.Time{}); err != nil {
		return false, err
	}
	established = true
	log.Printf("connected to floor-controller protocol v2: %s revision=%s grid=%dx%d target=%dfps", cfg.ControllerDuplexAddr, hello.AdapterRevision, hello.Width, hello.Height, hello.TargetFps)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	startedAt := time.Now()
	if runtime != nil {
		runtime.SetPressureStreamConnected(true)
		defer runtime.SetPressureStreamConnected(false)
		runtime.SetFloorAdapterConnected(hello)
		defer runtime.SetFloorAdapterDisconnected()
	}
	errors := make(chan error, 2)
	go func() {
		errors <- readDuplexEvents(ctx, reader, runtime, startedAt)
	}()
	go func() {
		errors <- streamFrames(ctx, cfg, runtime, startedAt, func(frame *recordingpb.FrameRecord) error {
			desired, err := desiredFrameEnvelope(frame)
			if err != nil {
				return err
			}
			if err := pbstream.Write(writer, desired); err != nil {
				return err
			}
			return writer.Flush()
		})
	}()
	err = <-errors
	cancel()
	_ = conn.Close()
	return established, err
}

func readDuplexEvents(ctx context.Context, reader *bufio.Reader, runtime *gameRuntime, startedAt time.Time) error {
	for {
		var envelope floorpb.Envelope
		if err := pbstream.ReadLimit(reader, &envelope, maxFloorEnvelopeBytes); err != nil {
			if err == io.EOF && ctx.Err() != nil {
				return context.Canceled
			}
			return err
		}
		switch payload := envelope.Payload.(type) {
		case *floorpb.Envelope_PressureEvent:
			if runtime != nil {
				runtime.HandlePressure(legacyPressureEvent(payload.PressureEvent), startedAt)
			}
		case *floorpb.Envelope_PresentedFrame:
			if runtime != nil {
				runtime.ObservePresentedFloor(payload.PresentedFrame)
			}
		case *floorpb.Envelope_AdapterStatus:
			if runtime != nil {
				runtime.ObserveFloorAdapterStatus(payload.AdapterStatus)
			}
		default:
			return fmt.Errorf("unexpected floor adapter message %T", payload)
		}
	}
}

func desiredFrameEnvelope(frame *recordingpb.FrameRecord) (*floorpb.Envelope, error) {
	if frame == nil || frame.Width == 0 || frame.Height == 0 {
		return nil, fmt.Errorf("desired frame dimensions must be positive")
	}
	tileCount := int(frame.Width * frame.Height)
	rgb := make([]byte, tileCount*3)
	for _, tile := range frame.Tiles {
		if tile.X >= frame.Width || tile.Y >= frame.Height {
			continue
		}
		index := int(tile.Y*frame.Width + tile.X)
		rgb[index*3] = byte(tile.R)
		rgb[index*3+1] = byte(tile.G)
		rgb[index*3+2] = byte(tile.B)
	}
	return &floorpb.Envelope{Payload: &floorpb.Envelope_DesiredFrame{
		DesiredFrame: &floorpb.DesiredFrame{
			Sequence:  frame.Sequence,
			UnixNanos: frame.UnixNanos,
			Width:     frame.Width,
			Height:    frame.Height,
			Rgb:       rgb,
		},
	}}, nil
}

func legacyPressureEvent(event *floorpb.PressureEvent) *inputpb.PressureEvent {
	if event == nil {
		return &inputpb.PressureEvent{}
	}
	return &inputpb.PressureEvent{
		Sequence:   event.Sequence,
		UnixNanos:  event.UnixNanos,
		X:          event.X,
		Y:          event.Y,
		Pressed:    event.Pressed,
		Source:     "floor-v2",
		Controller: event.HardwareController,
		Channel:    event.HardwareChannel,
		Position:   event.HardwarePosition,
	}
}
