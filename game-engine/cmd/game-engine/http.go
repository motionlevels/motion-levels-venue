package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type selectGameRequest struct {
	Game        string `json:"game"`
	PlayerCount int    `json:"playerCount"`
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
		runtime.SelectGame(request.Game, request.PlayerCount)
		writeJSON(w, runtime.Status())
	})
	return withCORS(mux)
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/api/status" || r.URL.Path == "/api/select" {
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
