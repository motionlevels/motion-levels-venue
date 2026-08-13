package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/packages/contracts/floorpb"
)

type liveFloorPublisher struct {
	endpoint     string
	token        string
	controllerID string
	interval     time.Duration
	client       *http.Client
	jobs         chan liveFloorJob

	mu           sync.Mutex
	lastEnqueued time.Time
	lastErrorLog time.Time
}

type liveFloorJob struct {
	ControllerID       string `json:"controllerId"`
	SessionID          string `json:"sessionId,omitempty"`
	Sequence           uint64 `json:"sequence"`
	Width              uint32 `json:"width"`
	Height             uint32 `json:"height"`
	PresentedUnixNanos int64  `json:"presentedUnixNanos"`
	FrameBase64        string `json:"frameBase64"`
}

func newLiveFloorPublisher(cfg config) (*liveFloorPublisher, error) {
	platformURL := strings.TrimRight(strings.TrimSpace(cfg.PlatformURL), "/")
	if platformURL == "" || cfg.LiveFloorFPS <= 0 {
		return nil, nil
	}
	parsed, err := url.Parse(platformURL)
	if err != nil || parsed.Scheme == "" || parsed.Host == "" {
		return nil, fmt.Errorf("live-floor platform URL must be absolute")
	}
	controllerID, err := resolveControllerID(cfg)
	if err != nil {
		return nil, fmt.Errorf("live-floor controller ID: %w", err)
	}
	if controllerID == "" {
		return nil, fmt.Errorf("live-floor controller ID is empty")
	}
	publisher := &liveFloorPublisher{
		endpoint:     platformURL + "/api/live-floor/ingest",
		token:        strings.TrimSpace(cfg.PlatformToken),
		controllerID: controllerID,
		interval:     time.Second / time.Duration(cfg.LiveFloorFPS),
		client:       &http.Client{Timeout: cfg.LiveFloorTimeout},
		jobs:         make(chan liveFloorJob, 1),
	}
	go publisher.run()
	return publisher, nil
}

func (p *liveFloorPublisher) observe(frame *floorpb.PresentedFrame, sessionID string, now time.Time) {
	if p == nil || frame == nil {
		return
	}
	p.mu.Lock()
	if !p.lastEnqueued.IsZero() && now.Sub(p.lastEnqueued) < p.interval {
		p.mu.Unlock()
		return
	}
	p.lastEnqueued = now
	p.mu.Unlock()

	viewerFrame, err := encodeLiveViewerFrame(frame)
	if err != nil {
		p.logError(err)
		return
	}
	job := liveFloorJob{
		ControllerID:       p.controllerID,
		SessionID:          sessionID,
		Sequence:           frame.PresentationSequence,
		Width:              frame.Width,
		Height:             frame.Height,
		PresentedUnixNanos: frame.PresentedUnixNanos,
		FrameBase64:        base64.StdEncoding.EncodeToString(viewerFrame),
	}
	replaceLatestLiveFloorJob(p.jobs, job)
}

func (p *liveFloorPublisher) run() {
	for job := range p.jobs {
		if err := p.post(context.Background(), job); err != nil {
			p.logError(err)
		}
	}
}

func (p *liveFloorPublisher) post(ctx context.Context, job liveFloorJob) error {
	body, err := json.Marshal(job)
	if err != nil {
		return err
	}
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, p.endpoint, bytes.NewReader(body))
	if err != nil {
		return err
	}
	request.Header.Set("Content-Type", "application/json")
	if p.token != "" {
		request.Header.Set("Authorization", "Bearer "+p.token)
	}
	response, err := p.client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	_, _ = io.Copy(io.Discard, response.Body)
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return fmt.Errorf("platform returned %s", response.Status)
	}
	return nil
}

func (p *liveFloorPublisher) logError(err error) {
	p.mu.Lock()
	defer p.mu.Unlock()
	now := time.Now()
	if now.Sub(p.lastErrorLog) < 10*time.Second {
		return
	}
	p.lastErrorLog = now
	log.Printf("live-floor publish: %v", err)
}

func encodeLiveViewerFrame(frame *floorpb.PresentedFrame) ([]byte, error) {
	if frame.Width == 0 || frame.Height == 0 {
		return nil, fmt.Errorf("presented frame dimensions must be positive")
	}
	tileCount := int(frame.Width * frame.Height)
	if len(frame.Rgb) != tileCount*3 {
		return nil, fmt.Errorf("presented RGB payload is %d bytes, want %d", len(frame.Rgb), tileCount*3)
	}
	pressureLength := (tileCount + 7) / 8
	if len(frame.PressureBits) != pressureLength {
		return nil, fmt.Errorf("presented pressure payload is %d bytes, want %d", len(frame.PressureBits), pressureLength)
	}
	const headerLength = 16
	result := make([]byte, headerLength+len(frame.Rgb)+len(frame.PressureBits))
	copy(result[:4], []byte{'M', 'L', 'F', '1'})
	binary.LittleEndian.PutUint32(result[4:8], uint32(frame.PresentationSequence))
	binary.LittleEndian.PutUint16(result[8:10], uint16(frame.Width))
	binary.LittleEndian.PutUint16(result[10:12], uint16(frame.Height))
	result[12] = 1
	binary.LittleEndian.PutUint16(result[14:16], headerLength)
	copy(result[headerLength:], frame.Rgb)
	copy(result[headerLength+len(frame.Rgb):], frame.PressureBits)
	return result, nil
}

func replaceLatestLiveFloorJob(channel chan liveFloorJob, job liveFloorJob) {
	select {
	case channel <- job:
		return
	default:
	}
	select {
	case <-channel:
	default:
	}
	select {
	case channel <- job:
	default:
	}
}
