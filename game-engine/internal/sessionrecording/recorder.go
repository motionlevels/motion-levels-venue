package sessionrecording

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"google.golang.org/protobuf/proto"

	"github.com/lobis/motion-levels/packages/contracts/gamepb"
	"github.com/lobis/motion-levels/packages/contracts/pbstream"
)

const defaultQueueSize = 4096

type Options struct {
	MaxSegmentBytes    int64
	MaxSegmentDuration time.Duration
}

type Recorder struct {
	mu sync.Mutex

	file             *os.File
	writer           *bufio.Writer
	basePath         string
	path             string
	activePath       string
	maxSegmentBytes  int64
	maxSegmentAge    time.Duration
	segmentIndex     int
	segmentBytes     int64
	segmentStartedAt time.Time

	jobs    chan *gamepb.GameSessionRecord
	done    chan struct{}
	closed  bool
	err     error
	dropped uint64
	written uint64
}

type Stats struct {
	Path           string `json:"path"`
	ActivePath     string `json:"activePath,omitempty"`
	SegmentIndex   int    `json:"segmentIndex"`
	SegmentBytes   int64  `json:"segmentBytes"`
	QueueDepth     int    `json:"queueDepth"`
	QueueCapacity  int    `json:"queueCapacity"`
	WrittenRecords uint64 `json:"writtenRecords"`
	DroppedRecords uint64 `json:"droppedRecords"`
	Error          string `json:"error,omitempty"`
}

func New(path string, now time.Time, options Options) (*Recorder, error) {
	if strings.TrimSpace(path) == "" {
		return nil, nil
	}
	if now.IsZero() {
		now = time.Now().UTC()
	}
	if options.MaxSegmentBytes <= 0 {
		options.MaxSegmentBytes = 256 << 20
	}
	if options.MaxSegmentDuration <= 0 {
		options.MaxSegmentDuration = 30 * time.Minute
	}
	resolved := ResolvePath(path, now)
	if err := os.MkdirAll(filepath.Dir(resolved), 0o755); err != nil {
		return nil, err
	}
	if err := RecoverDirectory(filepath.Dir(resolved)); err != nil {
		return nil, err
	}
	file, actualPath, activePath, err := openSegment(resolved)
	if err != nil {
		return nil, err
	}
	recorder := &Recorder{
		file:             file,
		writer:           bufio.NewWriterSize(file, 1<<20),
		basePath:         actualPath,
		path:             actualPath,
		activePath:       activePath,
		maxSegmentBytes:  options.MaxSegmentBytes,
		maxSegmentAge:    options.MaxSegmentDuration,
		segmentIndex:     1,
		segmentStartedAt: now,
		jobs:             make(chan *gamepb.GameSessionRecord, defaultQueueSize),
		done:             make(chan struct{}),
	}
	go recorder.run()
	return recorder, nil
}

func ResolvePath(path string, now time.Time) string {
	clean := filepath.Clean(path)
	if filepath.Ext(clean) == "" || strings.HasSuffix(path, string(os.PathSeparator)) {
		return filepath.Join(clean, now.UTC().Format("20060102T150405Z")+".game.pbstream")
	}
	return clean
}

func (r *Recorder) Record(record *gamepb.GameSessionRecord) error {
	if r == nil || record == nil {
		return nil
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.err != nil {
		return r.err
	}
	if r.closed {
		return errors.New("session recorder is closed")
	}
	select {
	case r.jobs <- cloneRecord(record):
	default:
		r.dropped++
	}
	return nil
}

func (r *Recorder) Close() error {
	if r == nil {
		return nil
	}
	r.mu.Lock()
	if !r.closed {
		r.closed = true
		close(r.jobs)
	}
	r.mu.Unlock()
	<-r.done
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.err
}

func (r *Recorder) Stats() Stats {
	if r == nil {
		return Stats{}
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	stats := Stats{
		Path:           r.path,
		ActivePath:     r.activePath,
		SegmentIndex:   r.segmentIndex,
		SegmentBytes:   r.segmentBytes,
		QueueDepth:     len(r.jobs),
		QueueCapacity:  cap(r.jobs),
		WrittenRecords: r.written,
		DroppedRecords: r.dropped,
	}
	if r.err != nil {
		stats.Error = r.err.Error()
	}
	return stats
}

func (r *Recorder) run() {
	defer close(r.done)
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()
	for {
		select {
		case record, ok := <-r.jobs:
			if !ok {
				r.setErr(r.closeCurrentSegment())
				return
			}
			if err := r.writeRecord(record); err != nil {
				r.setErr(err)
			} else {
				r.mu.Lock()
				r.written++
				r.mu.Unlock()
			}
		case <-ticker.C:
			r.setErr(r.flush())
		}
	}
}

func (r *Recorder) writeRecord(record *gamepb.GameSessionRecord) error {
	if err := r.rotateIfNeeded(record.UnixNanos); err != nil {
		return err
	}
	counting := &countingWriter{writer: r.writer}
	if err := pbstream.Write(counting, record); err != nil {
		return err
	}
	if err := r.writer.Flush(); err != nil {
		return err
	}
	r.mu.Lock()
	r.segmentBytes += counting.n
	r.mu.Unlock()
	return nil
}

func (r *Recorder) rotateIfNeeded(unixNanos int64) error {
	now := time.Unix(0, unixNanos)
	if unixNanos <= 0 {
		now = time.Now()
	}
	r.mu.Lock()
	bySize := r.maxSegmentBytes > 0 && r.segmentBytes >= r.maxSegmentBytes
	byAge := r.maxSegmentAge > 0 && r.segmentBytes > 0 && !now.Before(r.segmentStartedAt.Add(r.maxSegmentAge))
	shouldRotate := bySize || byAge
	nextIndex := r.segmentIndex + 1
	r.mu.Unlock()
	if !shouldRotate {
		return nil
	}
	if err := r.closeCurrentSegment(); err != nil {
		return err
	}
	nextPath := segmentPath(r.basePath, nextIndex)
	file, actualPath, activePath, err := openSegment(nextPath)
	if err != nil {
		return err
	}
	r.mu.Lock()
	r.file = file
	r.writer = bufio.NewWriterSize(file, 1<<20)
	r.path = actualPath
	r.activePath = activePath
	r.segmentIndex = nextIndex
	r.segmentBytes = 0
	r.segmentStartedAt = now
	r.mu.Unlock()
	return nil
}

func (r *Recorder) flush() error {
	if r == nil || r.writer == nil {
		return nil
	}
	return r.writer.Flush()
}

func (r *Recorder) closeCurrentSegment() error {
	r.mu.Lock()
	file := r.file
	writer := r.writer
	activePath := r.activePath
	path := r.path
	r.file = nil
	r.writer = nil
	r.activePath = ""
	r.mu.Unlock()
	if file == nil {
		return nil
	}
	if writer != nil {
		if err := writer.Flush(); err != nil {
			_ = file.Close()
			return err
		}
	}
	if err := file.Sync(); err != nil {
		_ = file.Close()
		return err
	}
	if err := file.Close(); err != nil {
		return err
	}
	return os.Rename(activePath, path)
}

func (r *Recorder) setErr(err error) {
	if err == nil {
		return
	}
	r.mu.Lock()
	if r.err == nil {
		r.err = err
	}
	r.mu.Unlock()
}

func openSegment(path string) (*os.File, string, string, error) {
	for attempt := 0; ; attempt++ {
		candidate := path
		if attempt > 0 {
			ext := filepath.Ext(path)
			base := strings.TrimSuffix(path, ext)
			candidate = fmt.Sprintf("%s-%d%s", base, attempt, ext)
		}
		if _, err := os.Stat(candidate); err == nil {
			continue
		} else if err != nil && !errors.Is(err, os.ErrNotExist) {
			return nil, "", "", err
		}
		activePath := candidate + ".open"
		file, err := os.OpenFile(activePath, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o644)
		if err == nil {
			return file, candidate, activePath, nil
		}
		if !errors.Is(err, os.ErrExist) {
			return nil, "", "", err
		}
	}
}

func RecoverDirectory(dir string) error {
	entries, err := os.ReadDir(dir)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil
		}
		return err
	}
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".open") {
			continue
		}
		activePath := filepath.Join(dir, entry.Name())
		finalPath := strings.TrimSuffix(activePath, ".open")
		if _, err := os.Stat(finalPath); err == nil {
			finalPath = finalPath + ".recovered-" + time.Now().UTC().Format("20060102T150405Z")
		} else if err != nil && !errors.Is(err, os.ErrNotExist) {
			return err
		}
		if err := os.Rename(activePath, finalPath); err != nil {
			return err
		}
	}
	return nil
}

func ReadRecoverable(path string, onRecord func(*gamepb.GameSessionRecord) error) (int, error) {
	file, err := os.Open(path)
	if err != nil {
		return 0, err
	}
	defer file.Close()
	reader := bufio.NewReader(file)
	var count int
	for {
		var record gamepb.GameSessionRecord
		err := pbstream.Read(reader, &record)
		if errors.Is(err, io.EOF) || errors.Is(err, io.ErrUnexpectedEOF) {
			return count, nil
		}
		if err != nil {
			return count, err
		}
		if err := onRecord(&record); err != nil {
			return count, err
		}
		count++
	}
}

func segmentPath(path string, index int) string {
	if index <= 1 {
		return path
	}
	if strings.HasSuffix(path, ".game.pbstream") {
		base := strings.TrimSuffix(path, ".game.pbstream")
		return fmt.Sprintf("%s-%06d.game.pbstream", base, index)
	}
	ext := filepath.Ext(path)
	base := strings.TrimSuffix(path, ext)
	return fmt.Sprintf("%s-%06d%s", base, index, ext)
}

type countingWriter struct {
	writer io.Writer
	n      int64
}

func (w *countingWriter) Write(p []byte) (int, error) {
	n, err := w.writer.Write(p)
	w.n += int64(n)
	return n, err
}

func cloneRecord(record *gamepb.GameSessionRecord) *gamepb.GameSessionRecord {
	// Deep copy: a shallow copy would share the Payload pointer with the
	// caller, racing with the async writer goroutine.
	return proto.Clone(record).(*gamepb.GameSessionRecord)
}
