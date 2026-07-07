package authored

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestFetchGameUsesShortTimeout(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		<-r.Context().Done()
	}))
	defer server.Close()

	start := time.Now()
	_, err := FetchGame(server.URL, "authored-ping-pong-motion")
	elapsed := time.Since(start)
	if err == nil {
		t.Fatal("expected slow platform fetch to time out")
	}
	if elapsed > 2500*time.Millisecond {
		t.Fatalf("FetchGame timeout took %s, want roughly %s", elapsed, gameFetchTimeout)
	}
	if !strings.Contains(err.Error(), "Client.Timeout") && !strings.Contains(err.Error(), "context deadline exceeded") {
		t.Fatalf("timeout error = %v", err)
	}
}
