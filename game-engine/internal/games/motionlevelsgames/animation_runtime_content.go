package motionlevelsgames

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const AnimationContentSchema = "motion-levels-animation-content-v1"

type AnimationRuntimeContentRequest struct {
	CanonicalGameID   string
	SelectedAnimation string
	RotationSeconds   int
}

type animationRuntimeContentMetadata struct {
	Schema              string   `json:"schema"`
	ContentRevision     string   `json:"contentRevision"`
	SelectedAnimationID string   `json:"selectedAnimationId"`
	RotationIDs         []string `json:"rotationIds"`
}

// FetchAnimationRuntimeContent obtains the small, versioned selection document
// for the native TypeScript animation product. The TypeScript package remains
// the authoritative parser; venue validates only the transport envelope.
func FetchAnimationRuntimeContent(ctx context.Context, client *http.Client, platformURL string, token string, request AnimationRuntimeContentRequest) (RuntimeContent, error) {
	canonicalID := strings.ToLower(strings.TrimSpace(request.CanonicalGameID))
	if !isRuntimeContentIdentity(canonicalID) {
		return RuntimeContent{}, fmt.Errorf("animation canonical game id must be a UUID or lowercase 32/40/64 hex id")
	}
	endpoint, err := animationRuntimeContentURL(platformURL, canonicalID, request)
	if err != nil {
		return RuntimeContent{}, err
	}
	if client == nil {
		client = &http.Client{Timeout: 4 * time.Second}
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
		return RuntimeContent{}, fmt.Errorf("fetch animation runtime content: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		_, _ = io.Copy(io.Discard, io.LimitReader(response.Body, 4<<10))
		return RuntimeContent{}, fmt.Errorf("fetch animation runtime content: status %d", response.StatusCode)
	}
	document, err := io.ReadAll(io.LimitReader(response.Body, (1<<20)+1))
	if err != nil {
		return RuntimeContent{}, fmt.Errorf("read animation runtime content: %w", err)
	}
	if len(document) > 1<<20 {
		return RuntimeContent{}, fmt.Errorf("animation runtime content exceeds %d bytes", 1<<20)
	}
	var metadata animationRuntimeContentMetadata
	if err := json.Unmarshal(document, &metadata); err != nil {
		return RuntimeContent{}, fmt.Errorf("decode animation runtime content: %w", err)
	}
	if metadata.Schema != AnimationContentSchema {
		return RuntimeContent{}, fmt.Errorf("unsupported animation runtime content schema %q", metadata.Schema)
	}
	contentRevision := strings.ToLower(strings.TrimSpace(metadata.ContentRevision))
	if !runtimeContentRevisionPattern.MatchString(contentRevision) {
		return RuntimeContent{}, fmt.Errorf("animation runtime content revision is invalid")
	}
	if len(metadata.RotationIDs) == 0 || len(metadata.RotationIDs) > 100 {
		return RuntimeContent{}, fmt.Errorf("animation runtime content rotation is invalid")
	}
	for _, id := range metadata.RotationIDs {
		id = strings.TrimSpace(id)
		if id == "" || len(id) > 120 {
			return RuntimeContent{}, fmt.Errorf("animation runtime content id is invalid")
		}
	}
	if selected := strings.TrimSpace(metadata.SelectedAnimationID); len(selected) > 120 {
		return RuntimeContent{}, fmt.Errorf("animation runtime content selected id is invalid")
	}
	return RuntimeContent{
		Document:        append(json.RawMessage(nil), document...),
		ContentRevision: contentRevision,
		EngineGame:      "animations",
	}, nil
}

func animationRuntimeContentURL(platformURL string, canonicalID string, request AnimationRuntimeContentRequest) (string, error) {
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
	if value := strings.TrimSpace(request.SelectedAnimation); value != "" {
		query.Set("animation", value)
	}
	if request.RotationSeconds > 0 {
		query.Set("rotationSeconds", fmt.Sprintf("%d", request.RotationSeconds))
	}
	base.RawQuery = query.Encode()
	return base.String(), nil
}
