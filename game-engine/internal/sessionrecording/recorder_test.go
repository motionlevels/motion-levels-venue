package sessionrecording

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/lobis/motion-levels/packages/contracts/gamepb"
)

func TestRecorderWritesRecoverableRecords(t *testing.T) {
	dir := t.TempDir()
	recorder, err := New(dir, time.Date(2026, 6, 3, 12, 0, 0, 0, time.UTC), Options{})
	if err != nil {
		t.Fatal(err)
	}
	if err := recorder.Record(&gamepb.GameSessionRecord{
		SessionId: "session-1",
		Sequence:  1,
		UnixNanos: time.Now().UnixNano(),
		Payload: &gamepb.GameSessionRecord_SessionStarted{SessionStarted: &gamepb.SessionStarted{
			Game: "whack-a-mole",
		}},
	}); err != nil {
		t.Fatal(err)
	}
	if err := recorder.Close(); err != nil {
		t.Fatal(err)
	}

	path := filepath.Join(dir, "20260603T120000Z.game.pbstream")
	var sessions []string
	count, err := ReadRecoverable(path, func(record *gamepb.GameSessionRecord) error {
		sessions = append(sessions, record.SessionId)
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if count != 1 || len(sessions) != 1 || sessions[0] != "session-1" {
		t.Fatalf("count=%d sessions=%v", count, sessions)
	}
}

func TestRecoverDirectoryFinalizesOpenSegments(t *testing.T) {
	dir := t.TempDir()
	active := filepath.Join(dir, "test.game.pbstream.open")
	if err := os.WriteFile(active, []byte("partial"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := RecoverDirectory(dir); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(filepath.Join(dir, "test.game.pbstream")); err != nil {
		t.Fatal(err)
	}
}
