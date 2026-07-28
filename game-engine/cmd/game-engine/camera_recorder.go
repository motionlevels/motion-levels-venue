package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"
)

type sessionCameraRecorder interface {
	StartVenueSession(cameraVenueSessionStart)
	FinishVenueSession(cameraVenueSessionFinish)
	Close() error
}

type cameraVenueSessionStart struct {
	VenueSessionID      string `json:"venueSessionId"`
	ControllerLabel     string `json:"controllerLabel,omitempty"`
	ControllerHostname  string `json:"controllerHostname,omitempty"`
	TeamName            string `json:"teamName,omitempty"`
	KioskID             string `json:"kioskId,omitempty"`
	StartedUnixNanos    int64  `json:"startedUnixNanos"`
	PlatformSessionPath string `json:"platformSessionPath,omitempty"`
	SegmentSeconds      int    `json:"segmentSeconds,omitempty"`
}

type cameraVenueSessionFinish struct {
	VenueSessionID string `json:"venueSessionId"`
	Reason         string `json:"reason,omitempty"`
	EndedUnixNanos int64  `json:"endedUnixNanos"`
}

type httpCameraRecorder struct {
	baseURL string
	token   string
	client  *http.Client
	jobs    chan cameraRecorderJob
}

type cameraRecorderJob struct {
	path string
	body any
}

func newHTTPCameraRecorder(baseURL, token string, timeout time.Duration) *httpCameraRecorder {
	baseURL = strings.TrimRight(strings.TrimSpace(baseURL), "/")
	if baseURL == "" {
		return nil
	}
	if timeout <= 0 {
		timeout = 2 * time.Second
	}
	recorder := &httpCameraRecorder{
		baseURL: baseURL,
		token:   strings.TrimSpace(token),
		client:  &http.Client{Timeout: timeout},
		jobs:    make(chan cameraRecorderJob, 64),
	}
	go recorder.run()
	return recorder
}

func (r *httpCameraRecorder) StartVenueSession(start cameraVenueSessionStart) {
	r.enqueue("/sessions/start", start)
}

func (r *httpCameraRecorder) FinishVenueSession(finish cameraVenueSessionFinish) {
	r.enqueue("/sessions/stop", finish)
}

func (r *httpCameraRecorder) Close() error {
	if r == nil {
		return nil
	}
	close(r.jobs)
	return nil
}

func (r *httpCameraRecorder) enqueue(path string, body any) {
	if r == nil {
		return
	}
	select {
	case r.jobs <- cameraRecorderJob{path: path, body: body}:
	default:
		log.Printf("camera recorder queue full; dropping %s", path)
	}
}

func (r *httpCameraRecorder) run() {
	for job := range r.jobs {
		if err := r.postWithRetry(job.path, job.body); err != nil {
			log.Printf("camera recorder %s: %v", job.path, err)
		}
	}
}

func (r *httpCameraRecorder) postWithRetry(path string, body any) error {
	var lastErr error
	for attempt := 0; attempt < 3; attempt++ {
		if attempt > 0 {
			time.Sleep(time.Duration(attempt) * 500 * time.Millisecond)
		}
		if err := r.post(path, body); err != nil {
			lastErr = err
			continue
		}
		return nil
	}
	return lastErr
}

func (r *httpCameraRecorder) post(path string, body any) error {
	payload, err := json.Marshal(body)
	if err != nil {
		return err
	}
	request, err := http.NewRequestWithContext(context.Background(), http.MethodPost, r.baseURL+path, bytes.NewReader(payload))
	if err != nil {
		return err
	}
	request.Header.Set("content-type", "application/json")
	if r.token != "" {
		request.Header.Set("authorization", "Bearer "+r.token)
	}
	response, err := r.client.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return fmt.Errorf("unexpected status %s", response.Status)
	}
	return nil
}
