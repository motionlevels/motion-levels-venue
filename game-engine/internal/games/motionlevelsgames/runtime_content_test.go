package motionlevelsgames

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestFetchRuntimeContentUsesCanonicalIdentityAndSelection(t *testing.T) {
	canonicalID := "c1daea4f-e586-4116-8cbe-871cde887a81"
	levelID := "96b8403a-d5eb-41e8-b925-5afc3e2d7e41"
	revision := strings.Repeat("a", 64)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/level-games/"+canonicalID+"/runtime-content" {
			t.Fatalf("path = %q", r.URL.Path)
		}
		if r.URL.Query().Get("difficulty") != "hard" || r.URL.Query().Get("level") != levelID || r.URL.Query().Get("levelSlug") != "level-3" || r.URL.Query().Get("mode") != "challenge" {
			t.Fatalf("query = %v", r.URL.Query())
		}
		if got := r.Header.Get("Authorization"); got != "Bearer venue-token" {
			t.Fatalf("authorization = %q", got)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = fmt.Fprintf(w, `{"schema":%q,"gameId":%q,"engineGame":"parkour-renamed","contentRevision":%q,"selectedLevelId":%q,"selectedLevelSlug":"level-3","mode":"challenge","levels":[{"id":%q,"slug":"level-3","label":"Nivel 3","frames":[{"r":1,"c":[]}]}],"resultAnimations":[]}`, PublishedLevelContentSchema, canonicalID, revision, levelID, levelID)
	}))
	defer server.Close()

	content, err := FetchRuntimeContent(context.Background(), server.Client(), server.URL, "venue-token", RuntimeContentRequest{
		CanonicalGameID: canonicalID,
		EngineGame:      "parkour",
		Difficulty:      "hard",
		Level:           levelID,
		LevelSlug:       "level-3",
		Mode:            "challenge",
	})
	if err != nil {
		t.Fatal(err)
	}
	if content.ContentRevision != revision || content.EngineGame != "parkour-renamed" || len(content.Document) == 0 {
		t.Fatalf("content = %+v", content)
	}
}

func TestFetchRuntimeContentRejectsWrongIdentityRevisionAndMode(t *testing.T) {
	canonicalID := "4773837e-3565-49d7-8953-3b40f59fca7b"
	levelID := "ab3425b4-9740-4cdd-a0a1-3a803a8d5c0c"
	tests := []struct {
		name string
		body string
	}{
		{name: "identity", body: fmt.Sprintf(`{"schema":%q,"gameId":"c1daea4f-e586-4116-8cbe-871cde887a81","engineGame":"temporada-1","contentRevision":%q,"selectedLevelId":%q,"selectedLevelSlug":"level-1","mode":"free"}`, PublishedLevelContentSchema, strings.Repeat("b", 64), levelID)},
		{name: "revision", body: fmt.Sprintf(`{"schema":%q,"gameId":%q,"engineGame":"temporada-1","contentRevision":"mutable","selectedLevelId":%q,"selectedLevelSlug":"level-1","mode":"free"}`, PublishedLevelContentSchema, canonicalID, levelID)},
		{name: "mode", body: fmt.Sprintf(`{"schema":%q,"gameId":%q,"engineGame":"temporada-1","contentRevision":%q,"selectedLevelId":%q,"selectedLevelSlug":"level-1","mode":"challenge"}`, PublishedLevelContentSchema, canonicalID, strings.Repeat("b", 64), levelID)},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				_, _ = w.Write([]byte(test.body))
			}))
			defer server.Close()
			_, err := FetchRuntimeContent(context.Background(), server.Client(), server.URL, "", RuntimeContentRequest{
				CanonicalGameID: canonicalID,
				Mode:            "free",
			})
			if err == nil {
				t.Fatal("expected invalid content metadata to be rejected")
			}
		})
	}
}

func TestRuntimeContentIdentityAcceptsUUIDOrLowercaseHash(t *testing.T) {
	accepted := []string{
		"c1daea4f-e586-4116-8cbe-871cde887a81",
		"C1DAEA4F-E586-4116-8CBE-871CDE887A81",
		strings.Repeat("a", 32),
		strings.Repeat("b", 40),
		strings.Repeat("c", 64),
	}
	for _, value := range accepted {
		if !isRuntimeContentIdentity(value) {
			t.Fatalf("expected canonical identity %q to be accepted", value)
		}
	}
	rejected := []string{"parkour", strings.Repeat("a", 39), strings.Repeat("A", 40), strings.Repeat("g", 64)}
	for _, value := range rejected {
		if isRuntimeContentIdentity(value) {
			t.Fatalf("expected non-canonical identity %q to be rejected", value)
		}
	}
}

func TestFetchRuntimeContentAcceptsCanonicalHashIdentities(t *testing.T) {
	gameID := strings.Repeat("a", 40)
	levelID := strings.Repeat("b", 32)
	revision := strings.Repeat("c", 64)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/level-games/"+gameID+"/runtime-content" || r.URL.Query().Get("level") != levelID {
			t.Fatalf("request = %s?%s", r.URL.Path, r.URL.RawQuery)
		}
		_, _ = fmt.Fprintf(w, `{"schema":%q,"gameId":%q,"engineGame":"renameable-alias","contentRevision":%q,"selectedLevelId":%q,"selectedLevelSlug":"level-1","mode":"free"}`, PublishedLevelContentSchema, gameID, revision, levelID)
	}))
	defer server.Close()

	content, err := FetchRuntimeContent(context.Background(), server.Client(), server.URL, "", RuntimeContentRequest{
		CanonicalGameID: gameID,
		Level:           levelID,
		Mode:            "free",
	})
	if err != nil {
		t.Fatal(err)
	}
	if content.ContentRevision != revision {
		t.Fatalf("content revision = %q", content.ContentRevision)
	}
}
