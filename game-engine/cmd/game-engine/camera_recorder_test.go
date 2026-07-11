package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestHTTPCameraRecorderSendsBearerToken(t *testing.T) {
	t.Helper()
	received := make(chan struct{}, 1)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if got := r.Header.Get("authorization"); got != "Bearer camera-secret" {
			t.Errorf("authorization = %q", got)
		}
		if got := r.Header.Get("content-type"); got != "application/json" {
			t.Errorf("content-type = %q", got)
		}
		var payload map[string]any
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			t.Errorf("decode payload: %v", err)
		}
		received <- struct{}{}
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	recorder := newHTTPCameraRecorder(server.URL, " camera-secret ", time.Second)
	if recorder == nil {
		t.Fatal("expected recorder")
	}
	defer recorder.Close()
	if err := recorder.post("/sessions/start", map[string]any{"venueSessionId": "session-1"}); err != nil {
		t.Fatalf("post: %v", err)
	}

	select {
	case <-received:
	case <-time.After(time.Second):
		t.Fatal("request was not received")
	}
}
