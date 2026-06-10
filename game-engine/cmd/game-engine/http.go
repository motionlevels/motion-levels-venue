package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type selectGameRequest struct {
	Game             string `json:"game"`
	VenueSessionID   string `json:"venueSessionId"`
	PlayerCount      int    `json:"playerCount"`
	Difficulty       string `json:"difficulty"`
	Level            string `json:"level"`
	NarrationEnabled *bool  `json:"narrationEnabled"`
	TeamName         string `json:"teamName"`
	Players          []struct {
		Index int          `json:"index"`
		Label string       `json:"label"`
		Color displayColor `json:"color"`
	} `json:"players"`
}

type controlGameRequest struct {
	Action string `json:"action"`
}

type venueSessionRequest struct {
	Action         string `json:"action"` // start | end
	VenueSessionID string `json:"venueSessionId"`
	TeamName       string `json:"teamName"`
	KioskID        string `json:"kioskId"`
	Reason         string `json:"reason"`
}

type menuEventRequest struct {
	VenueSessionID       string         `json:"venueSessionId"`
	Name                 string         `json:"name"`
	KioskID              string         `json:"kioskId"`
	OccurredAtUnixMillis int64          `json:"occurredAtUnixMillis"`
	Properties           map[string]any `json:"properties"`
}

func serveGameAPI(addr string, runtime *gameRuntime) {
	if addr == "" {
		return
	}
	log.Printf("game engine API: http://127.0.0.1%s/api/status", portSuffix(addr))
	if err := http.ListenAndServe(addr, gameAPIHandler(runtime)); err != nil {
		log.Printf("game engine API stopped: %v", err)
	}
}

func gameAPIHandler(runtime *gameRuntime) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/status", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		writeJSON(w, runtime.Status())
	})
	mux.HandleFunc("/api/display", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		writeJSON(w, runtime.DisplayStatus(time.Now()))
	})
	mux.HandleFunc("/api/display/events", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		writeDisplayEvents(w, r, runtime)
	})
	mux.HandleFunc("/api/select", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var request selectGameRequest
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		players := make([]playerConfig, 0, len(request.Players))
		for _, player := range request.Players {
			color := player.Color
			players = append(players, playerConfig{
				Index: player.Index,
				Label: player.Label,
				Color: &color,
			})
		}
		if err := validatePlayerRoster(players, request.PlayerCount); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		runtime.SelectGameWithMetadata(request.Game, request.PlayerCount, request.Difficulty, request.Level, request.NarrationEnabled, request.TeamName, request.VenueSessionID, players)
		writeJSON(w, runtime.Status())
	})
	mux.HandleFunc("/api/control", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var request controlGameRequest
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		runtime.ControlGame(request.Action)
		writeJSON(w, runtime.Status())
	})
	mux.HandleFunc("/api/venue-session", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var request venueSessionRequest
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if request.VenueSessionID == "" {
			http.Error(w, "venueSessionId is required", http.StatusBadRequest)
			return
		}
		now := time.Now()
		switch request.Action {
		case "start":
			runtime.StartVenueSession(request.VenueSessionID, request.TeamName, request.KioskID, now)
		case "end":
			runtime.EndVenueSession(request.VenueSessionID, request.Reason, now)
		default:
			http.Error(w, "action must be start or end", http.StatusBadRequest)
			return
		}
		writeJSON(w, runtime.Status())
	})
	mux.HandleFunc("/api/menu-event", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var request menuEventRequest
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		var occurredAt time.Time
		if request.OccurredAtUnixMillis > 0 {
			occurredAt = time.UnixMilli(request.OccurredAtUnixMillis)
		}
		if err := runtime.RecordMenuEvent(request.VenueSessionID, request.Name, request.KioskID, request.Properties, occurredAt, time.Now()); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		writeJSON(w, map[string]bool{"ok": true})
	})
	return withAPILogging(runtime, withCORS(mux))
}

func writeDisplayEvents(w http.ResponseWriter, r *http.Request, runtime *gameRuntime) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "streaming unsupported", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Connection", "keep-alive")
	ticker := time.NewTicker(250 * time.Millisecond)
	defer ticker.Stop()
	for {
		select {
		case <-r.Context().Done():
			return
		case now := <-ticker.C:
			data, err := json.Marshal(runtime.DisplayStatus(now))
			if err != nil {
				log.Printf("display event: %v", err)
				continue
			}
			_, _ = fmt.Fprintf(w, "event: display\n")
			_, _ = fmt.Fprintf(w, "data: %s\n\n", data)
			flusher.Flush()
		}
	}
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if isAPIPath(r.URL.Path) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}

type statusResponseWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusResponseWriter) WriteHeader(status int) {
	w.status = status
	w.ResponseWriter.WriteHeader(status)
}

func (w *statusResponseWriter) Write(data []byte) (int, error) {
	if w.status == 0 {
		w.status = http.StatusOK
	}
	return w.ResponseWriter.Write(data)
}

func (w *statusResponseWriter) Flush() {
	if flusher, ok := w.ResponseWriter.(http.Flusher); ok {
		flusher.Flush()
	}
}

func withAPILogging(runtime *gameRuntime, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !isAPIPath(r.URL.Path) {
			next.ServeHTTP(w, r)
			return
		}
		started := time.Now()
		recorder := &statusResponseWriter{ResponseWriter: w}
		next.ServeHTTP(recorder, r)
		status := recorder.status
		if status == 0 {
			status = http.StatusOK
		}
		if runtime != nil {
			runtime.RecordAPIInteraction(r.Method, r.URL.Path, r.RemoteAddr, status, started)
		}
	})
}

func isAPIPath(path string) bool {
	switch path {
	case "/api/status", "/api/select", "/api/control", "/api/display", "/api/display/events":
		return true
	default:
		return false
	}
}

func writeJSON(w http.ResponseWriter, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Printf("json response: %v", err)
	}
}

func portSuffix(addr string) string {
	for i := len(addr) - 1; i >= 0; i-- {
		if addr[i] == ':' {
			return addr[i:]
		}
	}
	return addr
}
