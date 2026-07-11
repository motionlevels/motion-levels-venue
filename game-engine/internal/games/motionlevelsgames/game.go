package motionlevelsgames

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

type Config struct {
	GameID           string
	ExpectedRevision string
	Seed             int64
	PlayerCount      int
	Players          []PlayerConfig
	Difficulty       string
	DurationMillis   int64
	Options          map[string]json.RawMessage
	StartedAt        time.Time
	NodeBinary       string
}

type PlayerConfig struct {
	Index int    `json:"index"`
	Label string `json:"label"`
	Color string `json:"color"`
}

type PlayerSnapshot struct {
	Index int    `json:"index"`
	Label string `json:"label"`
	Color string `json:"color"`
	Score int    `json:"score"`
	Lives int    `json:"lives"`
}

type RoundSnapshot struct {
	Index       int    `json:"index"`
	WinnerIndex int    `json:"winnerIndex"`
	WinnerLabel string `json:"winnerLabel"`
	Hits        int    `json:"hits"`
}

type Snapshot struct {
	CurrentGame      string           `json:"currentGame"`
	Label            string           `json:"label"`
	Phase            string           `json:"phase"`
	PlayerCount      int              `json:"playerCount"`
	Players          []PlayerSnapshot `json:"players"`
	Score            int              `json:"score"`
	Lives            int              `json:"lives"`
	MaxLives         int              `json:"maxLives"`
	ElapsedMillis    int64            `json:"elapsedMillis"`
	RemainingMillis  int64            `json:"remainingMillis"`
	ActiveTargets    int              `json:"activeTargets"`
	Success          bool             `json:"success"`
	CountdownMillis  int64            `json:"countdownMillis"`
	MatchTarget      int              `json:"matchTarget"`
	RoundHits        int              `json:"roundHits"`
	LastRoundHits    int              `json:"lastRoundHits"`
	LastRoundWinner  string           `json:"lastRoundWinner"`
	Rounds           []RoundSnapshot  `json:"rounds"`
	LastEventCue     string           `json:"lastEventCue"`
	LastEventMessage string           `json:"lastEventMessage"`
}

type RunnerHealth struct {
	Status         string `json:"status"`
	SourceRevision string `json:"sourceRevision"`
	GameID         string `json:"gameId"`
	LastError      string `json:"lastError,omitempty"`
}

type Game struct {
	mu       sync.Mutex
	cmd      *exec.Cmd
	stdin    io.WriteCloser
	encoder  *json.Encoder
	decoder  *json.Decoder
	started  time.Time
	sequence uint64
	revision string
	gameID   string
	frame    []animation.RGB
	snapshot Snapshot
	raw      json.RawMessage
	pending  []whackamole.Event
	lastErr  error
}

type runnerRequest struct {
	Version int            `json:"version"`
	ID      string         `json:"id"`
	Method  string         `json:"method"`
	Params  map[string]any `json:"params,omitempty"`
}

type runnerResponse struct {
	Version        int         `json:"version"`
	ID             string      `json:"id"`
	OK             bool        `json:"ok"`
	SourceRevision string      `json:"sourceRevision"`
	State          runnerState `json:"state"`
	Error          string      `json:"error"`
}

type runnerState struct {
	ClockMillis int64           `json:"clockMillis"`
	Frame       runnerFrame     `json:"frame"`
	Snapshot    json.RawMessage `json:"snapshot"`
	Events      []runnerEvent   `json:"events"`
}

type runnerFrame struct {
	Width  int      `json:"width"`
	Height int      `json:"height"`
	Colors []string `json:"colors"`
}

type runnerEvent struct {
	Cue     string `json:"cue"`
	Message string `json:"message"`
}

func New(vendorRoot string, cfg Config) (*Game, error) {
	bundle, err := Load(vendorRoot)
	if err != nil {
		return nil, err
	}
	if cfg.ExpectedRevision != "" && cfg.ExpectedRevision != bundle.Manifest.SourceRevision {
		return nil, fmt.Errorf("motion-levels-games revision mismatch: requested %s, installed %s", cfg.ExpectedRevision, bundle.Manifest.SourceRevision)
	}
	if !contains(bundle.Manifest.Runtime.Games, cfg.GameID) {
		return nil, fmt.Errorf("motion-levels-games game is not production eligible: %s", cfg.GameID)
	}
	node := strings.TrimSpace(cfg.NodeBinary)
	if node == "" {
		node = "node"
	}
	runnerPath := filepath.Join(bundle.Root, filepath.FromSlash(bundle.Manifest.Runtime.Entry))
	cmd := exec.Command(node, runnerPath)
	cmd.Env = runnerEnvironment(os.Environ())
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return nil, err
	}
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		_ = stdin.Close()
		return nil, err
	}
	cmd.Stderr = os.Stderr
	if err := cmd.Start(); err != nil {
		_ = stdin.Close()
		return nil, err
	}
	started := cfg.StartedAt
	if started.IsZero() {
		started = time.Now()
	}
	game := &Game{
		cmd: cmd, stdin: stdin, encoder: json.NewEncoder(stdin), decoder: json.NewDecoder(bufio.NewReader(stdout)),
		started: started, revision: bundle.Manifest.SourceRevision, gameID: cfg.GameID,
	}
	params := map[string]any{
		"gameId": cfg.GameID, "seed": cfg.Seed, "playerCount": cfg.PlayerCount,
		"players": cfg.Players, "difficulty": cfg.Difficulty, "options": cfg.Options,
	}
	if cfg.DurationMillis > 0 {
		params["durationMillis"] = cfg.DurationMillis
	}
	if _, err := game.callLocked("init", params); err != nil {
		_ = game.closeLocked()
		return nil, err
	}
	return game, nil
}

func runnerEnvironment(environment []string) []string {
	blocked := []string{"TOKEN", "PASSWORD", "SECRET", "PRIVATE_KEY", "CREDENTIAL"}
	filtered := make([]string, 0, len(environment))
	for _, entry := range environment {
		key, _, _ := strings.Cut(entry, "=")
		upper := strings.ToUpper(key)
		sensitive := false
		for _, marker := range blocked {
			if strings.Contains(upper, marker) {
				sensitive = true
				break
			}
		}
		if !sensitive {
			filtered = append(filtered, entry)
		}
	}
	return filtered
}

func (g *Game) Render(now time.Time) []animation.RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	state, err := g.callLocked("tick", map[string]any{"atMillis": g.atMillis(now)})
	if err != nil {
		g.lastErr = err
		return append([]animation.RGB(nil), g.frame...)
	}
	g.pending = events(state.Events)
	return append([]animation.RGB(nil), g.frame...)
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	g.mu.Lock()
	defer g.mu.Unlock()
	state, err := g.callLocked("input", map[string]any{
		"x": event.X, "y": event.Y, "pressed": event.Pressed, "atMillis": g.atMillis(now),
	})
	if err != nil {
		g.lastErr = err
		return nil
	}
	return events(state.Events)
}

func (g *Game) DrainEvents() []whackamole.Event {
	g.mu.Lock()
	defer g.mu.Unlock()
	events := append([]whackamole.Event(nil), g.pending...)
	g.pending = nil
	return events
}

func (g *Game) Control(action string) error {
	g.mu.Lock()
	defer g.mu.Unlock()
	state, err := g.callLocked("control", map[string]any{"action": action})
	if err != nil {
		g.lastErr = err
		return err
	}
	g.pending = append(g.pending, events(state.Events)...)
	return nil
}

func (g *Game) Snapshot() Snapshot {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.snapshot
}

func (g *Game) RawSnapshot() json.RawMessage {
	g.mu.Lock()
	defer g.mu.Unlock()
	return append(json.RawMessage(nil), g.raw...)
}

func (g *Game) Frame() []animation.RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	return append([]animation.RGB(nil), g.frame...)
}

func (g *Game) Label() string          { return g.Snapshot().Label }
func (g *Game) RuntimeKind() string    { return "motion-levels-games" }
func (g *Game) SourceRevision() string { return g.revision }

func (g *Game) RunnerHealth() RunnerHealth {
	g.mu.Lock()
	defer g.mu.Unlock()
	health := RunnerHealth{Status: "ok", SourceRevision: g.revision, GameID: g.gameID}
	if g.lastErr != nil {
		health.Status = "error"
		health.LastError = g.lastErr.Error()
	}
	return health
}

func (g *Game) Close() error {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.closeLocked()
}

func (g *Game) closeLocked() error {
	if g.stdin != nil {
		_ = g.stdin.Close()
		g.stdin = nil
	}
	if g.cmd != nil && g.cmd.Process != nil {
		_ = g.cmd.Process.Kill()
		err := g.cmd.Wait()
		g.cmd = nil
		return err
	}
	return nil
}

func (g *Game) callLocked(method string, params map[string]any) (runnerState, error) {
	g.sequence++
	id := strconv.FormatUint(g.sequence, 10)
	if err := g.encoder.Encode(runnerRequest{Version: 1, ID: id, Method: method, Params: params}); err != nil {
		return runnerState{}, err
	}
	var response runnerResponse
	if err := g.decoder.Decode(&response); err != nil {
		return runnerState{}, err
	}
	if response.Version != 1 || response.ID != id || response.SourceRevision != g.revision {
		return runnerState{}, fmt.Errorf("invalid motion-levels-games runner response")
	}
	if !response.OK {
		return runnerState{}, fmt.Errorf("motion-levels-games runner: %s", response.Error)
	}
	if err := g.applyState(response.State); err != nil {
		return runnerState{}, err
	}
	return response.State, nil
}

func (g *Game) applyState(state runnerState) error {
	if state.Frame.Width != animation.GridWidth || state.Frame.Height != animation.GridHeight || len(state.Frame.Colors) != animation.GridWidth*animation.GridHeight {
		return fmt.Errorf("motion-levels-games runner returned an invalid frame")
	}
	frame := make([]animation.RGB, len(state.Frame.Colors))
	for index, color := range state.Frame.Colors {
		parsed, err := parseHexColor(color)
		if err != nil {
			return err
		}
		frame[index] = parsed
	}
	var snapshot Snapshot
	if err := json.Unmarshal(state.Snapshot, &snapshot); err != nil {
		return err
	}
	g.frame = frame
	g.snapshot = snapshot
	g.raw = append(json.RawMessage(nil), state.Snapshot...)
	g.lastErr = nil
	return nil
}

func (g *Game) atMillis(now time.Time) int64 {
	if now.IsZero() || now.Before(g.started) {
		return 0
	}
	return now.Sub(g.started).Milliseconds()
}

func events(source []runnerEvent) []whackamole.Event {
	out := make([]whackamole.Event, 0, len(source))
	for _, event := range source {
		out = append(out, whackamole.Event{Cue: event.Cue, Message: event.Message})
	}
	return out
}

func parseHexColor(value string) (animation.RGB, error) {
	value = strings.TrimPrefix(strings.TrimSpace(value), "#")
	if len(value) != 6 {
		return animation.RGB{}, fmt.Errorf("invalid frame color")
	}
	number, err := strconv.ParseUint(value, 16, 24)
	if err != nil {
		return animation.RGB{}, err
	}
	return animation.RGB{R: byte(number >> 16), G: byte(number >> 8), B: byte(number)}, nil
}

func contains(values []string, target string) bool {
	for _, value := range values {
		if value == target {
			return true
		}
	}
	return false
}
