package replay

import (
	"bufio"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
	"time"

	"github.com/lobis/motion-levels/packages/contracts/gamepb"
	"github.com/lobis/motion-levels/packages/contracts/pbstream"
	"github.com/lobis/motion-levels/packages/contracts/recordingpb"
	"github.com/lobis/motion-levels/packages/contracts/replaypb"
)

func TestRecorderWritesCompressedDeltaReplay(t *testing.T) {
	zstdPath, err := exec.LookPath("zstd")
	if err != nil {
		t.Skip("zstd not installed")
	}
	started := time.Date(2026, 6, 10, 12, 0, 0, 0, time.UTC)
	recorder, err := New(t.TempDir(), Options{
		ControllerID:     "controller-1",
		ZstdPath:         zstdPath,
		KeyframeInterval: time.Hour,
	})
	if err != nil {
		t.Fatal(err)
	}
	if err := recorder.Record(&gamepb.GameSessionRecord{
		SessionId: "session-1",
		Sequence:  1,
		UnixNanos: started.UnixNano(),
		Payload: &gamepb.GameSessionRecord_SessionStarted{SessionStarted: &gamepb.SessionStarted{
			Game:             "temporada1",
			Label:            "Temporada 1",
			StartedUnixNanos: started.UnixNano(),
		}},
	}); err != nil {
		t.Fatal(err)
	}
	if err := recorder.RecordFrame(testFrame(1, started, 10, 20)); err != nil {
		t.Fatal(err)
	}
	if err := recorder.RecordFrame(testFrame(2, started.Add(50*time.Millisecond), 10, 21)); err != nil {
		t.Fatal(err)
	}
	if err := recorder.RecordFrame(testFrame(3, started.Add(100*time.Millisecond), 10, 21)); err != nil {
		t.Fatal(err)
	}
	if err := recorder.Close(); err != nil {
		t.Fatal(err)
	}

	records := readReplay(t, filepath.Join(recorder.root, "session-1", "replay.mlreplay.zst"), zstdPath)
	var keyframeTiles int
	var floorFrames int
	var nonEmptyDeltaTiles int
	var emptyDeltaFrames int
	var footerFrameCount uint64
	for _, record := range records {
		frame := record.GetFloorFrame()
		if frame != nil {
			floorFrames++
			if frame.GetKeyframe() {
				keyframeTiles = len(frame.GetTiles())
			} else if len(frame.GetTiles()) == 0 {
				emptyDeltaFrames++
			} else {
				nonEmptyDeltaTiles += len(frame.GetTiles())
			}
		}
		if footer := record.GetFooter(); footer != nil {
			footerFrameCount = footer.GetFrameCount()
		}
	}
	if floorFrames != 3 {
		t.Fatalf("floor frames = %d, want 3", floorFrames)
	}
	if keyframeTiles != 4 {
		t.Fatalf("keyframe tiles = %d, want 4", keyframeTiles)
	}
	if nonEmptyDeltaTiles != 1 {
		t.Fatalf("non-empty delta tiles = %d, want 1", nonEmptyDeltaTiles)
	}
	if emptyDeltaFrames != 1 {
		t.Fatalf("empty delta frames = %d, want 1", emptyDeltaFrames)
	}
	if footerFrameCount != 3 {
		t.Fatalf("footer frame count = %d, want 3", footerFrameCount)
	}
}

func TestRecorderClosesReplayOnSessionEnded(t *testing.T) {
	zstdPath, err := exec.LookPath("zstd")
	if err != nil {
		t.Skip("zstd not installed")
	}
	root := t.TempDir()
	started := time.Date(2026, 6, 10, 12, 0, 0, 0, time.UTC)
	recorder, err := New(root, Options{
		ControllerID:     "controller-1",
		ZstdPath:         zstdPath,
		KeyframeInterval: time.Hour,
	})
	if err != nil {
		t.Fatal(err)
	}
	if err := recorder.Record(&gamepb.GameSessionRecord{
		SessionId: "session-1",
		Sequence:  1,
		UnixNanos: started.UnixNano(),
		Payload: &gamepb.GameSessionRecord_SessionStarted{SessionStarted: &gamepb.SessionStarted{
			Game:             "lava",
			Label:            "El suelo es lava",
			StartedUnixNanos: started.UnixNano(),
		}},
	}); err != nil {
		t.Fatal(err)
	}
	if err := recorder.RecordFrame(testFrame(1, started.Add(20*time.Millisecond), 10, 20)); err != nil {
		t.Fatal(err)
	}
	if err := recorder.Record(&gamepb.GameSessionRecord{
		SessionId: "session-1",
		Sequence:  2,
		UnixNanos: started.Add(time.Second).UnixNano(),
		Payload: &gamepb.GameSessionRecord_SessionEnded{SessionEnded: &gamepb.SessionEnded{
			Reason:         "game changed",
			EndedUnixNanos: started.Add(time.Second).UnixNano(),
		}},
	}); err != nil {
		t.Fatal(err)
	}
	if err := recorder.Close(); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(filepath.Join(root, "session-1", "replay.mlreplay.open")); !os.IsNotExist(err) {
		t.Fatalf("active replay still exists after session end: %v", err)
	}
	records := readReplay(t, filepath.Join(root, "session-1", "replay.mlreplay.zst"), zstdPath)
	if len(records) == 0 {
		t.Fatal("replay has no records")
	}
	if footer := records[len(records)-1].GetFooter(); footer == nil || footer.GetFrameCount() != 1 {
		t.Fatalf("last record footer = %#v, want frame count 1", footer)
	}
}

func TestRecorderRemovesLocalReplayAfterSuccessfulUpload(t *testing.T) {
	zstdPath, err := exec.LookPath("zstd")
	if err != nil {
		t.Skip("zstd not installed")
	}
	var uploadedBytes int
	var completed bool
	var platform *httptest.Server
	platform = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/upload":
			if r.Method != http.MethodPut {
				t.Fatalf("upload method = %s, want PUT", r.Method)
			}
			body, err := io.ReadAll(r.Body)
			if err != nil {
				t.Fatal(err)
			}
			uploadedBytes = len(body)
			w.WriteHeader(http.StatusOK)
		case "/api/recording-uploads/init":
			if got := r.Header.Get("authorization"); got != "Bearer test-token" {
				t.Fatalf("authorization = %q", got)
			}
			_ = json.NewEncoder(w).Encode(uploadInitResponse{
				OK:        true,
				UploadID:  "upload-1",
				ObjectKey: "recordings/controller-1/session-1/replay.mlreplay.zst",
				UploadURL: platform.URL + "/upload",
			})
		case "/api/recording-uploads/complete":
			completed = true
			_ = json.NewEncoder(w).Encode(map[string]any{"ok": true})
		default:
			http.NotFound(w, r)
		}
	}))
	defer platform.Close()

	root := t.TempDir()
	started := time.Date(2026, 6, 10, 12, 0, 0, 0, time.UTC)
	recorder, err := New(root, Options{
		ControllerID:     "controller-1",
		PlatformURL:      platform.URL,
		PlatformToken:    "test-token",
		ZstdPath:         zstdPath,
		KeyframeInterval: time.Hour,
	})
	if err != nil {
		t.Fatal(err)
	}
	if err := recorder.Record(&gamepb.GameSessionRecord{
		SessionId: "session-1",
		Sequence:  1,
		UnixNanos: started.UnixNano(),
		Payload: &gamepb.GameSessionRecord_SessionStarted{SessionStarted: &gamepb.SessionStarted{
			Game:             "temporada1",
			Label:            "Temporada 1",
			StartedUnixNanos: started.UnixNano(),
		}},
	}); err != nil {
		t.Fatal(err)
	}
	if err := recorder.RecordFrame(testFrame(1, started, 10, 20)); err != nil {
		t.Fatal(err)
	}
	if err := recorder.Close(); err != nil {
		t.Fatal(err)
	}
	if uploadedBytes == 0 || !completed {
		t.Fatalf("upload did not complete: bytes=%d completed=%t", uploadedBytes, completed)
	}
	if _, err := os.Stat(filepath.Join(root, "session-1", "replay.mlreplay.zst")); !os.IsNotExist(err) {
		t.Fatalf("local replay still exists after upload: %v", err)
	}
}

func testFrame(sequence uint64, now time.Time, r uint32, changedB uint32) *recordingpb.FrameRecord {
	tiles := []*recordingpb.TileState{
		{X: 0, Y: 0, R: r, G: 0, B: 0},
		{X: 1, Y: 0, R: 0, G: 20, B: 0},
		{X: 0, Y: 1, R: 0, G: 0, B: changedB},
		{X: 1, Y: 1, R: 2, G: 3, B: 4, Pressed: true},
	}
	return &recordingpb.FrameRecord{
		Sequence:          sequence,
		UnixNanos:         now.UnixNano(),
		Width:             2,
		Height:            2,
		SessionId:         "session-1",
		GameFrameSequence: sequence,
		GameUnixNanos:     now.UnixNano(),
		Tiles:             tiles,
	}
}

func readReplay(t *testing.T, path string, zstdPath string) []*replaypb.ReplayRecord {
	t.Helper()
	cmd := exec.Command(zstdPath, "-dc", path)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		t.Fatal(err)
	}
	if err := cmd.Start(); err != nil {
		t.Fatal(err)
	}
	reader := bufio.NewReader(stdout)
	var records []*replaypb.ReplayRecord
	for {
		var record replaypb.ReplayRecord
		err := pbstream.Read(reader, &record)
		if err == nil {
			records = append(records, &record)
			continue
		}
		if err == io.EOF || err == io.ErrUnexpectedEOF {
			break
		}
		t.Fatal(err)
	}
	if err := cmd.Wait(); err != nil {
		t.Fatal(err)
	}
	return records
}
