package motionlevelsgames

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestFetchAnimationRuntimeContentValidatesAndReturnsSnapshot(t *testing.T) {
	gameID := "a861f0dc-3e2e-4fe9-b487-33194af75b68"
	revision := strings.Repeat("a", 64)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/level-games/"+gameID+"/runtime-content" {
			t.Fatalf("path = %q", r.URL.Path)
		}
		if r.URL.Query().Get("animation") != "aurora" || r.URL.Query().Get("rotationSeconds") != "17" {
			t.Fatalf("query = %q", r.URL.RawQuery)
		}
		if r.Header.Get("Authorization") != "Bearer venue-token" {
			t.Fatalf("authorization = %q", r.Header.Get("Authorization"))
		}
		_, _ = w.Write([]byte(`{"schema":"` + AnimationContentSchema + `","contentRevision":"` + revision + `","selectedAnimationId":"aurora","rotationIds":["aurora","neon-ribbons"],"rotationSeconds":17}`))
	}))
	defer server.Close()

	content, err := FetchAnimationRuntimeContent(context.Background(), server.Client(), server.URL, "venue-token", AnimationRuntimeContentRequest{
		CanonicalGameID:   gameID,
		SelectedAnimation: "aurora",
		RotationSeconds:   17,
	})
	if err != nil {
		t.Fatal(err)
	}
	if content.ContentRevision != revision || content.EngineGame != "animations" || len(content.Document) == 0 {
		t.Fatalf("content = %+v", content)
	}
}

func TestFetchAnimationRuntimeContentRejectsInvalidEnvelope(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte(`{"schema":"wrong","contentRevision":"bad","rotationIds":[]}`))
	}))
	defer server.Close()
	_, err := FetchAnimationRuntimeContent(context.Background(), server.Client(), server.URL, "", AnimationRuntimeContentRequest{
		CanonicalGameID: "a861f0dc-3e2e-4fe9-b487-33194af75b68",
	})
	if err == nil {
		t.Fatal("expected invalid animation content to be rejected")
	}
}
