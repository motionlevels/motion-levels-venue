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

type levelAttemptCameraRecorder interface {
	StartLevelAttempt(cameraRecordingStart)
	FinishLevelAttempt(cameraRecordingFinish)
	Close() error
}

type cameraRecordingStart struct {
	AttemptID                string `json:"attemptId"`
	SessionID                string `json:"sessionId"`
	VenueSessionID           string `json:"venueSessionId,omitempty"`
	ControllerLabel          string `json:"controllerLabel,omitempty"`
	ControllerHostname       string `json:"controllerHostname,omitempty"`
	Game                     string `json:"game"`
	Level                    string `json:"level"`
	LevelNumber              int    `json:"levelNumber,omitempty"`
	Difficulty               string `json:"difficulty,omitempty"`
	TeamName                 string `json:"teamName,omitempty"`
	PlayerCount              int    `json:"playerCount,omitempty"`
	StartedUnixNanos         int64  `json:"startedUnixNanos"`
	GameplayStartedUnixNanos int64  `json:"gameplayStartedUnixNanos"`
}

type cameraRecordingFinish struct {
	AttemptID      string `json:"attemptId"`
	Result         string `json:"result"`
	Success        bool   `json:"success"`
	ScoreEnd       int    `json:"scoreEnd"`
	LivesEnd       int    `json:"livesEnd"`
	ElapsedMillis  int64  `json:"elapsedMillis"`
	EndedUnixNanos int64  `json:"endedUnixNanos"`
}

type httpCameraRecorder struct {
	baseURL string
	client  *http.Client
	jobs    chan cameraRecorderJob
}

type cameraRecorderJob struct {
	path string
	body any
}

func newHTTPCameraRecorder(baseURL string, timeout time.Duration) *httpCameraRecorder {
	baseURL = strings.TrimRight(strings.TrimSpace(baseURL), "/")
	if baseURL == "" {
		return nil
	}
	if timeout <= 0 {
		timeout = 2 * time.Second
	}
	recorder := &httpCameraRecorder{
		baseURL: baseURL,
		client:  &http.Client{Timeout: timeout},
		jobs:    make(chan cameraRecorderJob, 64),
	}
	go recorder.run()
	return recorder
}

func (r *httpCameraRecorder) StartLevelAttempt(start cameraRecordingStart) {
	r.enqueue("/recordings/start", start)
}

func (r *httpCameraRecorder) FinishLevelAttempt(finish cameraRecordingFinish) {
	r.enqueue("/recordings/stop", finish)
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
		if err := r.post(job.path, job.body); err != nil {
			log.Printf("camera recorder %s: %v", job.path, err)
		}
	}
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
