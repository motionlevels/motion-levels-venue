package replay

import (
	"bufio"
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/packages/contracts/gamepb"
	"github.com/lobis/motion-levels/packages/contracts/pbstream"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
	"github.com/lobis/motion-levels/packages/contracts/replaypb"
)

const (
	contentType = "application/x-motion-levels-replay"
	version     = "mlreplay.v1"
)

type Options struct {
	ControllerID      string
	PlatformURL       string
	PlatformToken     string
	ZstdPath          string
	KeyframeInterval  time.Duration
	UploadHTTPTimeout time.Duration
}

type Recorder struct {
	mu sync.Mutex
	wg sync.WaitGroup

	root         string
	options      Options
	client       *http.Client
	file         *os.File
	writer       *bufio.Writer
	sessionID    string
	venueID      string
	path         string
	activePath   string
	sequence     uint64
	frameCount   uint64
	eventCount   uint64
	firstFrame   uint64
	lastFrame    uint64
	startedAt    time.Time
	endedAt      time.Time
	lastKeyframe time.Time
	previous     []tileState
}

type tileState struct {
	R       uint32
	G       uint32
	B       uint32
	Pressed bool
	Seen    bool
}

func New(root string, options Options) (*Recorder, error) {
	root = strings.TrimSpace(root)
	if root == "" {
		return nil, nil
	}
	if strings.TrimSpace(options.ZstdPath) == "" {
		options.ZstdPath = "zstd"
	}
	if options.KeyframeInterval <= 0 {
		options.KeyframeInterval = 5 * time.Second
	}
	if options.UploadHTTPTimeout <= 0 {
		options.UploadHTTPTimeout = 5 * time.Minute
	}
	options.PlatformURL = strings.TrimRight(strings.TrimSpace(options.PlatformURL), "/")
	options.PlatformToken = strings.TrimSpace(options.PlatformToken)
	options.ControllerID = strings.TrimSpace(options.ControllerID)
	if options.PlatformURL != "" {
		parsed, err := url.Parse(options.PlatformURL)
		if err != nil || parsed.Scheme == "" || parsed.Host == "" {
			return nil, fmt.Errorf("platform-url must be absolute")
		}
	}
	return &Recorder{
		root:    root,
		options: options,
		client:  &http.Client{Timeout: options.UploadHTTPTimeout},
	}, nil
}

func (r *Recorder) Record(record *gamepb.GameSessionRecord) error {
	if r == nil || record == nil {
		return nil
	}
	sessionID := strings.TrimSpace(record.GetSessionId())
	if sessionID == "" {
		return nil
	}
	now := unixNanosTime(record.GetUnixNanos())
	r.mu.Lock()
	defer r.mu.Unlock()
	if err := r.ensureSessionLocked(sessionID, record.GetVenueSessionId(), now); err != nil {
		return err
	}
	r.sequence++
	r.eventCount++
	if ended := record.GetSessionEnded(); ended != nil {
		if ended.EndedUnixNanos > 0 {
			r.endedAt = time.Unix(0, ended.EndedUnixNanos).UTC()
		}
	}
	if started := record.GetSessionStarted(); started != nil {
		r.writeHeaderFieldsLocked(started)
	}
	return pbstream.Write(r.writer, &replaypb.ReplayRecord{
		SessionId:      r.sessionID,
		VenueSessionId: r.venueID,
		Sequence:       r.sequence,
		UnixNanos:      record.GetUnixNanos(),
		Payload:        &replaypb.ReplayRecord_GameRecord{GameRecord: record},
	})
}

func (r *Recorder) RecordFrame(frame *recordingpb.FrameRecord) error {
	if r == nil || frame == nil || strings.TrimSpace(frame.GetSessionId()) == "" {
		return nil
	}
	now := unixNanosTime(frame.GetUnixNanos())
	r.mu.Lock()
	defer r.mu.Unlock()
	if err := r.ensureSessionLocked(frame.GetSessionId(), frame.GetVenueSessionId(), now); err != nil {
		return err
	}
	if r.frameCount == 0 {
		r.firstFrame = frame.GetSequence()
	}
	r.frameCount++
	r.lastFrame = frame.GetSequence()
	r.endedAt = now
	keyframe := r.shouldKeyframeLocked(now)
	deltas := r.frameDeltasLocked(frame, keyframe)
	if len(deltas) == 0 && !keyframe {
		return nil
	}
	if keyframe {
		r.lastKeyframe = now
	}
	r.sequence++
	return pbstream.Write(r.writer, &replaypb.ReplayRecord{
		SessionId:      r.sessionID,
		VenueSessionId: r.venueID,
		Sequence:       r.sequence,
		UnixNanos:      frame.GetUnixNanos(),
		Payload: &replaypb.ReplayRecord_FloorFrame{FloorFrame: &replaypb.FloorFrame{
			Width:                        frame.GetWidth(),
			Height:                       frame.GetHeight(),
			Keyframe:                     keyframe,
			ControllerSequence:           frame.GetSequence(),
			GameFrameSequence:            frame.GetGameFrameSequence(),
			GameUnixNanos:                frame.GetGameUnixNanos(),
			ControllerReceivedUnixNanos:  frame.GetControllerReceivedUnixNanos(),
			ControllerPresentedUnixNanos: frame.GetControllerPresentedUnixNanos(),
			Tiles:                        deltas,
		}},
	})
}

func (r *Recorder) Close() error {
	if r == nil {
		return nil
	}
	r.mu.Lock()
	err := r.closeSessionLocked("shutdown")
	r.mu.Unlock()
	r.wg.Wait()
	return err
}

func (r *Recorder) ensureSessionLocked(sessionID string, venueID string, now time.Time) error {
	sessionID = strings.TrimSpace(sessionID)
	if sessionID == "" {
		return nil
	}
	if r.sessionID == sessionID && r.file != nil {
		if r.venueID == "" {
			r.venueID = strings.TrimSpace(venueID)
		}
		return nil
	}
	if err := r.closeSessionLocked("session_changed"); err != nil {
		return err
	}
	dir := filepath.Join(r.root, pathPart(sessionID))
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return err
	}
	base := filepath.Join(dir, "replay.mlreplay")
	active := base + ".open"
	file, err := os.OpenFile(active, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0o644)
	if err != nil {
		return err
	}
	r.file = file
	r.writer = bufio.NewWriterSize(file, 1<<20)
	r.sessionID = sessionID
	r.venueID = strings.TrimSpace(venueID)
	r.path = base
	r.activePath = active
	r.sequence = 1
	r.frameCount = 0
	r.eventCount = 0
	r.firstFrame = 0
	r.lastFrame = 0
	r.startedAt = now
	r.endedAt = now
	r.lastKeyframe = time.Time{}
	r.previous = nil
	return pbstream.Write(r.writer, &replaypb.ReplayRecord{
		SessionId:      sessionID,
		VenueSessionId: r.venueID,
		Sequence:       r.sequence,
		UnixNanos:      now.UnixNano(),
		Payload: &replaypb.ReplayRecord_Header{Header: &replaypb.ReplayHeader{
			Version:          version,
			ControllerId:     r.options.ControllerID,
			StartedUnixNanos: now.UnixNano(),
		}},
	})
}

func (r *Recorder) writeHeaderFieldsLocked(started *gamepb.SessionStarted) {
	if started == nil || r.writer == nil {
		return
	}
	header := &replaypb.ReplayHeader{
		Version:          version,
		ControllerId:     r.options.ControllerID,
		Game:             started.GetGame(),
		Label:            started.GetLabel(),
		TeamName:         started.GetTeamName(),
		StartedUnixNanos: started.GetStartedUnixNanos(),
	}
	if started.GetStartedUnixNanos() > 0 {
		r.startedAt = time.Unix(0, started.GetStartedUnixNanos()).UTC()
	}
	r.sequence++
	_ = pbstream.Write(r.writer, &replaypb.ReplayRecord{
		SessionId:      r.sessionID,
		VenueSessionId: r.venueID,
		Sequence:       r.sequence,
		UnixNanos:      header.StartedUnixNanos,
		Payload:        &replaypb.ReplayRecord_Header{Header: header},
	})
}

func (r *Recorder) closeSessionLocked(reason string) error {
	if r.file == nil {
		return nil
	}
	if r.endedAt.IsZero() {
		r.endedAt = time.Now().UTC()
	}
	r.sequence++
	_ = pbstream.Write(r.writer, &replaypb.ReplayRecord{
		SessionId:      r.sessionID,
		VenueSessionId: r.venueID,
		Sequence:       r.sequence,
		UnixNanos:      r.endedAt.UnixNano(),
		Payload: &replaypb.ReplayRecord_Footer{Footer: &replaypb.ReplayFooter{
			Reason:         reason,
			EndedUnixNanos: r.endedAt.UnixNano(),
			FrameCount:     r.frameCount,
			EventCount:     r.eventCount,
		}},
	})
	if err := r.writer.Flush(); err != nil {
		_ = r.file.Close()
		return err
	}
	if err := r.file.Close(); err != nil {
		return err
	}

	active := r.activePath
	raw := r.path
	compressed := raw + ".zst"
	sessionID := r.sessionID
	venueID := r.venueID
	frameCount := r.frameCount
	firstFrame := r.firstFrame
	lastFrame := r.lastFrame
	startedAt := r.startedAt
	endedAt := r.endedAt
	r.file = nil
	r.writer = nil
	r.sessionID = ""
	r.venueID = ""
	r.path = ""
	r.activePath = ""
	r.previous = nil

	if err := os.Rename(active, raw); err != nil {
		return err
	}
	if err := compressZstd(r.options.ZstdPath, raw, compressed); err != nil {
		return err
	}
	_ = os.Remove(raw)
	if r.options.PlatformURL != "" && frameCount > 0 {
		r.wg.Add(1)
		go r.uploadWithRetry(compressed, uploadMetadata{
			SessionID:      sessionID,
			VenueSessionID: venueID,
			FrameCount:     frameCount,
			FirstSequence:  firstFrame,
			LastSequence:   lastFrame,
			StartedAt:      startedAt,
			EndedAt:        endedAt,
		})
	}
	return nil
}

func (r *Recorder) shouldKeyframeLocked(now time.Time) bool {
	if len(r.previous) == 0 || r.lastKeyframe.IsZero() {
		return true
	}
	return !now.Before(r.lastKeyframe.Add(r.options.KeyframeInterval))
}

func (r *Recorder) frameDeltasLocked(frame *recordingpb.FrameRecord, keyframe bool) []*replaypb.TileDelta {
	total := int(frame.GetWidth() * frame.GetHeight())
	if total <= 0 {
		total = len(frame.GetTiles())
	}
	if len(r.previous) != total {
		r.previous = make([]tileState, total)
		keyframe = true
	}
	deltas := make([]*replaypb.TileDelta, 0, len(frame.GetTiles()))
	for _, tile := range frame.GetTiles() {
		index := int(tile.GetY()*frame.GetWidth() + tile.GetX())
		if index < 0 || index >= len(r.previous) {
			continue
		}
		next := tileState{R: tile.GetR(), G: tile.GetG(), B: tile.GetB(), Pressed: tile.GetPressed(), Seen: true}
		prev := r.previous[index]
		if keyframe || !prev.Seen || prev.R != next.R || prev.G != next.G || prev.B != next.B || prev.Pressed != next.Pressed {
			deltas = append(deltas, &replaypb.TileDelta{
				Index:   uint32(index),
				R:       next.R,
				G:       next.G,
				B:       next.B,
				Pressed: next.Pressed,
			})
			r.previous[index] = next
		}
	}
	return deltas
}

type uploadMetadata struct {
	SessionID      string
	VenueSessionID string
	FrameCount     uint64
	FirstSequence  uint64
	LastSequence   uint64
	StartedAt      time.Time
	EndedAt        time.Time
}

func (r *Recorder) uploadWithRetry(path string, metadata uploadMetadata) {
	defer r.wg.Done()
	var last error
	for attempt := 1; attempt <= 5; attempt++ {
		if err := r.upload(path, metadata); err != nil {
			last = err
			time.Sleep(time.Duration(attempt) * time.Second)
			continue
		}
		return
	}
	if last != nil {
		fmt.Fprintf(os.Stderr, "replay upload failed: %v\n", last)
	}
}

func (r *Recorder) upload(path string, metadata uploadMetadata) error {
	info, err := os.Stat(path)
	if err != nil {
		return err
	}
	checksum, err := sha256File(path)
	if err != nil {
		return err
	}
	initResp, err := r.initUpload(path, info.Size(), metadata)
	if err != nil {
		return err
	}
	if err := putObject(r.client, initResp.UploadURL, path, contentType); err != nil {
		return err
	}
	if err := r.completeUpload(initResp.UploadID, info.Size(), checksum, metadata); err != nil {
		return err
	}
	removeUploadedReplay(path)
	return nil
}

type uploadInitResponse struct {
	OK        bool   `json:"ok"`
	UploadID  string `json:"uploadId"`
	ObjectKey string `json:"objectKey"`
	UploadURL string `json:"uploadUrl"`
	Error     string `json:"error"`
}

func (r *Recorder) initUpload(path string, byteSize int64, metadata uploadMetadata) (uploadInitResponse, error) {
	payload := map[string]any{
		"sessionId":      metadata.SessionID,
		"venueSessionId": metadata.VenueSessionID,
		"controllerId":   r.options.ControllerID,
		"fileName":       filepath.Base(path),
		"contentType":    contentType,
		"compression":    "zstd",
		"byteSize":       byteSize,
		"frameCount":     metadata.FrameCount,
		"firstSequence":  metadata.FirstSequence,
		"lastSequence":   metadata.LastSequence,
		"startedAt":      formatTime(metadata.StartedAt),
		"endedAt":        formatTime(metadata.EndedAt),
	}
	var response uploadInitResponse
	if err := r.postJSON("/api/recording-uploads/init", payload, &response); err != nil {
		return response, err
	}
	if !response.OK || response.UploadID == "" || response.UploadURL == "" {
		if response.Error != "" {
			return response, errors.New(response.Error)
		}
		return response, errors.New("platform upload init returned incomplete response")
	}
	return response, nil
}

func (r *Recorder) completeUpload(uploadID string, byteSize int64, checksum string, metadata uploadMetadata) error {
	payload := map[string]any{
		"uploadId":      uploadID,
		"byteSize":      byteSize,
		"sha256":        checksum,
		"frameCount":    metadata.FrameCount,
		"firstSequence": metadata.FirstSequence,
		"lastSequence":  metadata.LastSequence,
		"startedAt":     formatTime(metadata.StartedAt),
		"endedAt":       formatTime(metadata.EndedAt),
	}
	var response struct {
		OK    bool   `json:"ok"`
		Error string `json:"error"`
	}
	if err := r.postJSON("/api/recording-uploads/complete", payload, &response); err != nil {
		return err
	}
	if !response.OK {
		if response.Error != "" {
			return errors.New(response.Error)
		}
		return errors.New("platform upload completion failed")
	}
	return nil
}

func (r *Recorder) postJSON(path string, payload any, response any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	req, err := http.NewRequest(http.MethodPost, r.options.PlatformURL+path, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	if r.options.PlatformToken != "" {
		req.Header.Set("Authorization", "Bearer "+r.options.PlatformToken)
	}
	resp, err := r.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		raw, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return fmt.Errorf("platform %s returned %d: %s", path, resp.StatusCode, strings.TrimSpace(string(raw)))
	}
	return json.NewDecoder(resp.Body).Decode(response)
}

func putObject(client *http.Client, uploadURL string, path string, contentType string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()
	info, err := file.Stat()
	if err != nil {
		return err
	}
	req, err := http.NewRequest(http.MethodPut, uploadURL, file)
	if err != nil {
		return err
	}
	req.ContentLength = info.Size()
	req.Header.Set("Content-Type", contentType)
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		raw, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return fmt.Errorf("upload PUT returned %d: %s", resp.StatusCode, strings.TrimSpace(string(raw)))
	}
	return nil
}

func removeUploadedReplay(path string) {
	if err := os.Remove(path); err != nil && !errors.Is(err, os.ErrNotExist) {
		fmt.Fprintf(os.Stderr, "replay cleanup failed: %v\n", err)
		return
	}
	parent := filepath.Dir(path)
	if err := os.Remove(parent); err != nil && !errors.Is(err, os.ErrNotExist) {
		// The directory can legitimately contain retry leftovers or diagnostics.
		return
	}
}

func sha256File(path string) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()
	hash := sha256.New()
	if _, err := io.Copy(hash, file); err != nil {
		return "", err
	}
	return hex.EncodeToString(hash.Sum(nil)), nil
}

func compressZstd(zstdPath, src, dst string) error {
	tmp := dst + ".tmp"
	_ = os.Remove(tmp)
	cmd := exec.Command(zstdPath, "-q", "-f", "-o", tmp, src)
	if output, err := cmd.CombinedOutput(); err != nil {
		return fmt.Errorf("zstd compress %s: %w: %s", src, err, strings.TrimSpace(string(output)))
	}
	return os.Rename(tmp, dst)
}

func unixNanosTime(nanos int64) time.Time {
	if nanos <= 0 {
		return time.Now().UTC()
	}
	return time.Unix(0, nanos).UTC()
}

func formatTime(value time.Time) string {
	if value.IsZero() {
		return ""
	}
	return value.UTC().Format(time.RFC3339Nano)
}

func pathPart(value string) string {
	cleaned := strings.Map(func(r rune) rune {
		switch {
		case r >= 'a' && r <= 'z', r >= 'A' && r <= 'Z', r >= '0' && r <= '9', r == '.', r == '_', r == '-':
			return r
		default:
			return '-'
		}
	}, strings.TrimSpace(value))
	cleaned = strings.Trim(cleaned, "-")
	if cleaned == "" {
		return "unknown"
	}
	return cleaned
}
