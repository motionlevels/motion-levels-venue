package main

import (
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/lobis/motion-levels/packages/contracts/floorpb"
)

func TestEncodeLiveViewerFramePreservesObservedRGBAndPressure(t *testing.T) {
	frame, err := encodeLiveViewerFrame(&floorpb.PresentedFrame{
		PresentationSequence: 42,
		Width:                2,
		Height:               1,
		Rgb:                  []byte{10, 20, 30, 40, 50, 60},
		PressureBits:         []byte{0b00000010},
	})
	if err != nil {
		t.Fatal(err)
	}
	if got := string(frame[:4]); got != "MLF1" {
		t.Fatalf("magic = %q, want MLF1", got)
	}
	if got := binary.LittleEndian.Uint32(frame[4:8]); got != 42 {
		t.Fatalf("sequence = %d, want 42", got)
	}
	if got := binary.LittleEndian.Uint16(frame[8:10]); got != 2 {
		t.Fatalf("width = %d, want 2", got)
	}
	if got := binary.LittleEndian.Uint16(frame[10:12]); got != 1 {
		t.Fatalf("height = %d, want 1", got)
	}
	if frame[12] != 1 || frame[22] != 0b00000010 {
		t.Fatalf("pressure encoding was not preserved: %v", frame)
	}
}

func TestLiveFloorPublisherUsesEngineIdentityAndObservedFrame(t *testing.T) {
	requests := make(chan liveFloorJob, 1)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/live-floor/ingest" {
			t.Errorf("path = %q, want live-floor ingest", r.URL.Path)
		}
		if got := r.Header.Get("Authorization"); got != "Bearer test-token" {
			t.Errorf("authorization = %q", got)
		}
		var job liveFloorJob
		if err := json.NewDecoder(r.Body).Decode(&job); err != nil {
			t.Errorf("decode body: %v", err)
		}
		requests <- job
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer server.Close()

	publisher, err := newLiveFloorPublisher(config{
		PlatformURL:      server.URL,
		PlatformToken:    "test-token",
		ControllerID:     "01234567-89ab-4def-8123-456789abcdef",
		LiveFloorFPS:     5,
		LiveFloorTimeout: time.Second,
	})
	if err != nil {
		t.Fatal(err)
	}
	publisher.observe(&floorpb.PresentedFrame{
		PresentationSequence: 17,
		PresentedUnixNanos:   999,
		Width:                1,
		Height:               1,
		Rgb:                  []byte{1, 2, 3},
		PressureBits:         []byte{1},
	}, "session-engine-owned", time.Now())

	select {
	case job := <-requests:
		if job.ControllerID != "01234567-89ab-4def-8123-456789abcdef" || job.SessionID != "session-engine-owned" || job.Sequence != 17 || job.PresentedUnixNanos != 999 {
			t.Fatalf("unexpected live-floor identity or lineage: %+v", job)
		}
		decoded, err := base64.StdEncoding.DecodeString(job.FrameBase64)
		if err != nil {
			t.Fatal(err)
		}
		if string(decoded[:4]) != "MLF1" || decoded[16] != 1 || decoded[17] != 2 || decoded[18] != 3 || decoded[19] != 1 {
			t.Fatalf("unexpected live-floor payload: %v", decoded)
		}
	case <-time.After(time.Second):
		t.Fatal("live-floor publisher did not send observed frame")
	}
}

func TestFloorAdapterStateIsExposedByEngineMetrics(t *testing.T) {
	runtime := &gameRuntime{}
	runtime.SetFloorAdapterConnected(&floorpb.AdapterHello{
		ProtocolVersion: 2,
		AdapterRevision: "adapter-test",
		Width:           16,
		Height:          32,
		TargetFps:       50,
	})
	runtime.ObserveFloorAdapterStatus(&floorpb.AdapterStatus{
		UnixNanos:             time.Now().UnixNano(),
		PresentedFrames:       123,
		ActualFps:             49.8,
		TargetFps:             50,
		DesiredFrameAgeMillis: 20,
		UdpSendErrors:         2,
	})
	metrics := renderEngineMetrics(runtime, time.Now())
	for _, expected := range []string{
		"motion_levels_engine_floor_adapter_connected 1",
		"motion_levels_engine_floor_adapter_actual_fps 49.8",
		"motion_levels_engine_floor_adapter_presented_frames_total 123",
		"motion_levels_engine_floor_adapter_udp_send_errors_total 2",
	} {
		if !containsText(metrics, expected) {
			t.Fatalf("metrics missing %q:\n%s", expected, metrics)
		}
	}
}

func containsText(value, expected string) bool {
	for index := 0; index+len(expected) <= len(value); index++ {
		if value[index:index+len(expected)] == expected {
			return true
		}
	}
	return false
}
