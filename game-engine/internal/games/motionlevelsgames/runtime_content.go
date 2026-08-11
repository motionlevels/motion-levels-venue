package motionlevelsgames

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"
)

const (
	PublishedLevelProductTag    = "published-levels"
	PublishedLevelContentSchema = "motion-levels-published-level-content-v1"
	maxRuntimeContentBytes      = 32 << 20
)

var (
	runtimeContentRevisionPattern = regexp.MustCompile(`^[a-f0-9]{64}$`)
	runtimeContentUUIDPattern     = regexp.MustCompile(`(?i)^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`)
	runtimeContentHashPattern     = regexp.MustCompile(`^(?:[0-9a-f]{32}|[0-9a-f]{40}|[0-9a-f]{64})$`)
)

type RuntimeContentRequest struct {
	CanonicalGameID string
	EngineGame      string
	Difficulty      string
	Level           string
	LevelSlug       string
	Mode            string
}

type RuntimeContent struct {
	Document        json.RawMessage
	ContentRevision string
	EngineGame      string
}

type runtimeContentMetadata struct {
	Schema            string `json:"schema"`
	GameID            string `json:"gameId"`
	EngineGame        string `json:"engineGame"`
	ContentRevision   string `json:"contentRevision"`
	SelectedLevelID   string `json:"selectedLevelId"`
	SelectedLevelSlug string `json:"selectedLevelSlug"`
	Mode              string `json:"mode"`
}

// FetchRuntimeContent obtains the platform-owned immutable input document.
// The venue validates only its transport envelope and identity metadata; the
// TypeScript product remains the sole parser and owner of authored mechanics.
func FetchRuntimeContent(ctx context.Context, client *http.Client, platformURL string, token string, request RuntimeContentRequest) (RuntimeContent, error) {
	canonicalID := strings.TrimSpace(request.CanonicalGameID)
	if !isRuntimeContentIdentity(canonicalID) {
		return RuntimeContent{}, fmt.Errorf("published level canonical game id must be a UUID or lowercase 32/40/64 hex id")
	}
	canonicalID = strings.ToLower(canonicalID)
	endpoint, err := runtimeContentURL(platformURL, canonicalID, request)
	if err != nil {
		return RuntimeContent{}, err
	}
	if client == nil {
		client = &http.Client{Timeout: 12 * time.Second}
	}
	httpRequest, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return RuntimeContent{}, err
	}
	httpRequest.Header.Set("Accept", "application/json")
	if token = strings.TrimSpace(token); token != "" {
		httpRequest.Header.Set("Authorization", "Bearer "+token)
	}
	response, err := client.Do(httpRequest)
	if err != nil {
		return RuntimeContent{}, fmt.Errorf("fetch published level runtime content: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		_, _ = io.Copy(io.Discard, io.LimitReader(response.Body, 4<<10))
		return RuntimeContent{}, fmt.Errorf("fetch published level runtime content: status %d", response.StatusCode)
	}
	document, err := io.ReadAll(io.LimitReader(response.Body, maxRuntimeContentBytes+1))
	if err != nil {
		return RuntimeContent{}, fmt.Errorf("read published level runtime content: %w", err)
	}
	if len(document) > maxRuntimeContentBytes {
		return RuntimeContent{}, fmt.Errorf("published level runtime content exceeds %d bytes", maxRuntimeContentBytes)
	}
	var metadata runtimeContentMetadata
	if err := json.Unmarshal(document, &metadata); err != nil {
		return RuntimeContent{}, fmt.Errorf("decode published level runtime content: %w", err)
	}
	if metadata.Schema != PublishedLevelContentSchema {
		return RuntimeContent{}, fmt.Errorf("unsupported published level runtime content schema %q", metadata.Schema)
	}
	if !isRuntimeContentIdentity(strings.TrimSpace(metadata.GameID)) || strings.ToLower(strings.TrimSpace(metadata.GameID)) != canonicalID {
		return RuntimeContent{}, fmt.Errorf("published level runtime content identity mismatch: got %q, want %q", metadata.GameID, canonicalID)
	}
	engineGame := strings.TrimSpace(metadata.EngineGame)
	if engineGame == "" || len(engineGame) > 160 {
		return RuntimeContent{}, fmt.Errorf("published level runtime content engineGame is invalid")
	}
	contentRevision := strings.ToLower(strings.TrimSpace(metadata.ContentRevision))
	if !runtimeContentRevisionPattern.MatchString(contentRevision) {
		return RuntimeContent{}, fmt.Errorf("published level runtime content revision is invalid")
	}
	if strings.TrimSpace(metadata.SelectedLevelID) == "" {
		return RuntimeContent{}, fmt.Errorf("published level runtime content selectedLevelId is required")
	}
	if !isRuntimeContentIdentity(strings.TrimSpace(metadata.SelectedLevelID)) {
		return RuntimeContent{}, fmt.Errorf("published level runtime content selectedLevelId must be a UUID or lowercase 32/40/64 hex id")
	}
	if requestedLevelID := strings.TrimSpace(request.Level); isRuntimeContentIdentity(requestedLevelID) && strings.ToLower(strings.TrimSpace(metadata.SelectedLevelID)) != strings.ToLower(requestedLevelID) {
		return RuntimeContent{}, fmt.Errorf("published level runtime content level identity mismatch: got %q, want %q", metadata.SelectedLevelID, requestedLevelID)
	}
	if strings.TrimSpace(metadata.SelectedLevelSlug) == "" {
		return RuntimeContent{}, fmt.Errorf("published level runtime content selectedLevelSlug is required")
	}
	mode := strings.ToLower(strings.TrimSpace(metadata.Mode))
	if mode != "challenge" && mode != "free" {
		return RuntimeContent{}, fmt.Errorf("published level runtime content mode is invalid")
	}
	if requestedMode := strings.ToLower(strings.TrimSpace(request.Mode)); requestedMode != "" && mode != requestedMode {
		return RuntimeContent{}, fmt.Errorf("published level runtime content mode mismatch: got %q, want %q", mode, requestedMode)
	}
	return RuntimeContent{
		Document:        append(json.RawMessage(nil), document...),
		ContentRevision: contentRevision,
		EngineGame:      engineGame,
	}, nil
}

func isRuntimeContentIdentity(value string) bool {
	value = strings.TrimSpace(value)
	return runtimeContentUUIDPattern.MatchString(value) || runtimeContentHashPattern.MatchString(value)
}

func runtimeContentURL(platformURL string, canonicalID string, request RuntimeContentRequest) (string, error) {
	base, err := url.Parse(strings.TrimSpace(platformURL))
	if err != nil || base.Scheme == "" || base.Host == "" {
		return "", fmt.Errorf("platform URL is invalid")
	}
	if base.Scheme != "http" && base.Scheme != "https" {
		return "", fmt.Errorf("platform URL scheme is not supported")
	}
	base.RawQuery = ""
	base.Fragment = ""
	base.Path = strings.TrimRight(base.Path, "/") + "/api/level-games/" + url.PathEscape(canonicalID) + "/runtime-content"
	query := base.Query()
	if value := strings.TrimSpace(request.Difficulty); value != "" {
		query.Set("difficulty", value)
	}
	if value := strings.TrimSpace(request.Level); value != "" {
		query.Set("level", value)
	}
	if value := strings.TrimSpace(request.LevelSlug); value != "" {
		query.Set("levelSlug", value)
	}
	if value := strings.TrimSpace(request.Mode); value != "" {
		query.Set("mode", value)
	}
	base.RawQuery = query.Encode()
	return base.String(), nil
}
