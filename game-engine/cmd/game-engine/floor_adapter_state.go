package main

import (
	"time"

	"github.com/lobis/motion-levels/packages/contracts/floorpb"
)

type floorAdapterStatus struct {
	Connected              bool    `json:"connected"`
	Protocol               string  `json:"protocol"`
	Revision               string  `json:"revision,omitempty"`
	Width                  uint32  `json:"width,omitempty"`
	Height                 uint32  `json:"height,omitempty"`
	TargetFPS              uint32  `json:"targetFps,omitempty"`
	ActualFPS              float64 `json:"actualFps,omitempty"`
	DesiredFrameAgeMillis  int64   `json:"desiredFrameAgeMillis"`
	PresentedFrames        uint64  `json:"presentedFrames"`
	UDPErrorCount          uint64  `json:"udpErrorCount"`
	LastStatusUnixNanos    int64   `json:"lastStatusUnixNanos,omitempty"`
	LastPresentedSequence  uint64  `json:"lastPresentedSequence"`
	LastPresentedUnixNanos int64   `json:"lastPresentedUnixNanos,omitempty"`
	FadeRatio              float32 `json:"fadeRatio"`
}

func (r *gameRuntime) SetFloorAdapterConnected(hello *floorpb.AdapterHello) {
	if r == nil {
		return
	}
	status := floorAdapterStatus{Connected: true, Protocol: "v2", DesiredFrameAgeMillis: -1}
	if hello != nil {
		status.Revision = hello.AdapterRevision
		status.Width = hello.Width
		status.Height = hello.Height
		status.TargetFPS = hello.TargetFps
	}
	r.mu.Lock()
	r.floorAdapter = status
	r.mu.Unlock()
}

func (r *gameRuntime) SetFloorAdapterConnectedLegacy() {
	if r == nil {
		return
	}
	r.mu.Lock()
	r.floorAdapter = floorAdapterStatus{Connected: true, Protocol: "v1", DesiredFrameAgeMillis: -1}
	r.mu.Unlock()
}

func (r *gameRuntime) SetFloorAdapterDisconnected() {
	if r == nil {
		return
	}
	r.mu.Lock()
	r.floorAdapter.Connected = false
	r.mu.Unlock()
}

func (r *gameRuntime) ObserveFloorAdapterStatus(status *floorpb.AdapterStatus) {
	if r == nil || status == nil {
		return
	}
	r.mu.Lock()
	r.floorAdapter.ActualFPS = status.ActualFps
	r.floorAdapter.TargetFPS = status.TargetFps
	r.floorAdapter.DesiredFrameAgeMillis = status.DesiredFrameAgeMillis
	r.floorAdapter.PresentedFrames = status.PresentedFrames
	r.floorAdapter.UDPErrorCount = status.UdpSendErrors
	r.floorAdapter.LastStatusUnixNanos = status.UnixNanos
	r.mu.Unlock()
}

func (r *gameRuntime) ObservePresentedFloor(frame *floorpb.PresentedFrame) {
	if r == nil || frame == nil {
		return
	}
	r.mu.Lock()
	r.floorAdapter.LastPresentedSequence = frame.PresentationSequence
	r.floorAdapter.LastPresentedUnixNanos = frame.PresentedUnixNanos
	r.floorAdapter.FadeRatio = frame.FadeRatio
	publisher := r.liveFloorPublisher
	sessionID := r.sessionID
	if isAmbientActivityGame(r.current.Game) {
		sessionID = ""
	}
	r.mu.Unlock()
	if publisher != nil {
		publisher.observe(frame, sessionID, time.Now())
	}
}

func (r *gameRuntime) SetLiveFloorPublisher(publisher *liveFloorPublisher) {
	if r == nil {
		return
	}
	r.mu.Lock()
	r.liveFloorPublisher = publisher
	r.mu.Unlock()
}

func (r *gameRuntime) FloorAdapterStatus() floorAdapterStatus {
	if r == nil {
		return floorAdapterStatus{}
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.floorAdapter
}
