package authored

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
	"github.com/tetratelabs/wazero/imports/wasi_snapshot_preview1"
)

const wasmCallTimeout = 200 * time.Millisecond

type WASMGame struct {
	mu      sync.Mutex
	ctx     context.Context
	runtime wazero.Runtime
	module  api.Module
	entry   CatalogEntry
	players []playerInfo
	failed  bool
	failErr error
}

type wasmInitRequest struct {
	EngineGame string       `json:"engine_game"`
	Label      string       `json:"label"`
	Seed       int64        `json:"seed"`
	NowUnixNS  int64        `json:"now_unix_ns"`
	Width      int          `json:"width"`
	Height     int          `json:"height"`
	Players    []wasmPlayer `json:"players"`
	Spec       Spec         `json:"spec"`
}

type wasmPlayer struct {
	Index int    `json:"index"`
	Label string `json:"label"`
	Color string `json:"color"`
}

type wasmTimeRequest struct {
	NowUnixNS int64 `json:"now_unix_ns"`
}

type wasmPressRequest struct {
	NowUnixNS int64 `json:"now_unix_ns"`
	X         int   `json:"x"`
	Y         int   `json:"y"`
	Pressed   bool  `json:"pressed"`
}

type wasmEvent struct {
	Cue     string `json:"cue"`
	Message string `json:"message"`
}

type wasmFrameResponse struct {
	Pixels []string `json:"pixels"`
}

type wasmSnapshotResponse struct {
	Phase           string               `json:"phase"`
	Score           int                  `json:"score"`
	StartedUnix     int64                `json:"started_unix"`
	EndsUnix        int64                `json:"ends_unix"`
	ElapsedMillis   int64                `json:"elapsed_millis"`
	RemainingMillis int64                `json:"remaining_millis"`
	CountdownMillis int64                `json:"countdown_millis"`
	ActiveTargets   int                  `json:"active_targets"`
	Lives           int                  `json:"lives"`
	Success         bool                 `json:"success"`
	Players         []wasmPlayerSnapshot `json:"players"`
}

type wasmPlayerSnapshot struct {
	Index int    `json:"index"`
	Label string `json:"label"`
	Color string `json:"color"`
	Score int    `json:"score"`
	Lives int    `json:"lives"`
}

func NewWASMWithSeed(now time.Time, seed int64, entry CatalogEntry, playerCount int, players []whackamole.PlayerConfig) (*WASMGame, error) {
	if entry.GameSource.WASMBase64 == "" {
		return nil, fmt.Errorf("motion-go-v1 game %q has no wasm_base64 artifact", entry.EngineGame)
	}
	wasmBytes, err := base64.StdEncoding.DecodeString(entry.GameSource.WASMBase64)
	if err != nil {
		return nil, fmt.Errorf("decode wasm_base64: %w", err)
	}
	ctx := context.Background()
	runtime := wazero.NewRuntimeWithConfig(ctx, wazero.NewRuntimeConfig().WithCloseOnContextDone(true))
	if _, err := wasi_snapshot_preview1.Instantiate(ctx, runtime); err != nil {
		_ = runtime.Close(ctx)
		return nil, fmt.Errorf("instantiate wasi: %w", err)
	}
	module, err := runtime.InstantiateWithConfig(ctx, wasmBytes, wazero.NewModuleConfig().WithStartFunctions())
	if err != nil {
		_ = runtime.Close(ctx)
		return nil, fmt.Errorf("instantiate motion-go wasm: %w", err)
	}
	game := &WASMGame{
		ctx:     ctx,
		runtime: runtime,
		module:  module,
		entry:   entry,
		players: normalizePlayers(playerCount, players, NormalizeSpec(Spec{})),
	}
	initPlayers := make([]wasmPlayer, 0, len(game.players))
	for i, player := range game.players {
		initPlayers = append(initPlayers, wasmPlayer{Index: i, Label: player.label, Color: rgbHex(player.rgb)})
	}
	if _, err := game.call("init", wasmInitRequest{
		EngineGame: entry.EngineGame,
		Label:      entry.Label,
		Seed:       seed,
		NowUnixNS:  now.UnixNano(),
		Width:      GridWidth,
		Height:     GridHeight,
		Players:    initPlayers,
		Spec:       entry.GameSource,
	}); err != nil {
		_ = runtime.Close(ctx)
		return nil, err
	}
	return game, nil
}

func (g *WASMGame) Label() string {
	if g == nil || g.entry.Label == "" {
		return "Juego Go"
	}
	return g.entry.Label
}

func (g *WASMGame) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if g == nil || g.isFailed() {
		return nil
	}
	raw, err := g.call("press", wasmPressRequest{NowUnixNS: now.UnixNano(), X: event.X, Y: event.Y, Pressed: event.Pressed})
	if err != nil || len(raw) == 0 {
		return nil
	}
	var events []wasmEvent
	if err := json.Unmarshal(raw, &events); err != nil {
		return nil
	}
	out := make([]whackamole.Event, 0, len(events))
	for _, event := range events {
		out = append(out, whackamole.Event{Cue: event.Cue, Message: event.Message})
	}
	return out
}

func (g *WASMGame) Tick(now time.Time) {
	if g == nil || g.isFailed() {
		return
	}
	_, _ = g.call("tick", wasmTimeRequest{NowUnixNS: now.UnixNano()})
}

func (g *WASMGame) Render(now time.Time) []RGB {
	if g == nil || g.isFailed() {
		return nil
	}
	g.Tick(now)
	raw, err := g.call("render", wasmTimeRequest{NowUnixNS: now.UnixNano()})
	if err != nil || len(raw) == 0 {
		return nil
	}
	var frame wasmFrameResponse
	if err := json.Unmarshal(raw, &frame); err != nil {
		return nil
	}
	out := make([]RGB, GridWidth*GridHeight)
	for index := range out {
		if index < len(frame.Pixels) {
			out[index] = hexColor(frame.Pixels[index], RGB{})
		}
	}
	return out
}

func (g *WASMGame) Snapshot(now time.Time) Snapshot {
	if g == nil {
		return Snapshot{}
	}
	if g.isFailed() {
		return Snapshot{Phase: "failed", Players: g.defaultPlayers(), Lives: -1}
	}
	g.Tick(now)
	raw, err := g.call("snapshot", wasmTimeRequest{NowUnixNS: now.UnixNano()})
	if err != nil || len(raw) == 0 {
		if g.isFailed() {
			return Snapshot{Phase: "failed", Players: g.defaultPlayers(), Lives: -1}
		}
		return Snapshot{Phase: "running", Players: g.defaultPlayers()}
	}
	var snapshot wasmSnapshotResponse
	if err := json.Unmarshal(raw, &snapshot); err != nil {
		return Snapshot{Phase: "running", Players: g.defaultPlayers()}
	}
	players := make([]PlayerSnapshot, 0, len(snapshot.Players))
	for _, player := range snapshot.Players {
		players = append(players, PlayerSnapshot{
			Index: player.Index,
			Label: player.Label,
			Color: hexColor(player.Color, RGB{R: 255, G: 255, B: 255}),
			Score: player.Score,
			Lives: player.Lives,
		})
	}
	if len(players) == 0 {
		players = g.defaultPlayers()
	}
	return Snapshot{
		Phase:           snapshot.Phase,
		Players:         players,
		Score:           snapshot.Score,
		StartedUnix:     snapshot.StartedUnix,
		EndsUnix:        snapshot.EndsUnix,
		ElapsedMillis:   snapshot.ElapsedMillis,
		RemainingMillis: snapshot.RemainingMillis,
		CountdownMillis: snapshot.CountdownMillis,
		ActiveTargets:   snapshot.ActiveTargets,
		Lives:           snapshot.Lives,
		Success:         snapshot.Success,
	}
}

func (g *WASMGame) defaultPlayers() []PlayerSnapshot {
	out := make([]PlayerSnapshot, 0, len(g.players))
	for i, player := range g.players {
		out = append(out, PlayerSnapshot{Index: i, Label: player.label, Color: player.rgb})
	}
	return out
}

func (g *WASMGame) call(name string, input any) (out []byte, err error) {
	g.mu.Lock()
	defer g.mu.Unlock()
	if g.failed {
		return nil, g.failErr
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("motion-go wasm %s panic: %v", name, recovered)
			g.failLocked(err)
		}
	}()
	fn := g.module.ExportedFunction(name)
	if fn == nil {
		err := fmt.Errorf("motion-go wasm missing export %q", name)
		g.failLocked(err)
		return nil, err
	}
	payload, err := json.Marshal(input)
	if err != nil {
		return nil, err
	}
	ptr, err := g.alloc(uint32(len(payload)))
	if err != nil {
		err = fmt.Errorf("motion-go wasm %s alloc: %w", name, err)
		g.failLocked(err)
		return nil, err
	}
	if !g.module.Memory().Write(ptr, payload) {
		err := fmt.Errorf("motion-go wasm memory write failed")
		g.failLocked(err)
		return nil, err
	}
	callCtx, cancel := context.WithTimeout(g.ctx, wasmCallTimeout)
	defer cancel()
	results, err := fn.Call(callCtx, uint64(ptr), uint64(len(payload)))
	if err != nil {
		err = fmt.Errorf("motion-go wasm %s: %w", name, err)
		g.failLocked(err)
		return nil, err
	}
	if len(results) == 0 || results[0] == 0 {
		return nil, nil
	}
	outPtr, outLen := unpackPtrLen(results[0])
	out, ok := g.module.Memory().Read(outPtr, outLen)
	if !ok {
		err := fmt.Errorf("motion-go wasm memory read failed")
		g.failLocked(err)
		return nil, err
	}
	return append([]byte(nil), out...), nil
}

func (g *WASMGame) alloc(size uint32) (uint32, error) {
	alloc := g.module.ExportedFunction("alloc")
	if alloc == nil {
		return 0, fmt.Errorf("motion-go wasm missing export \"alloc\"")
	}
	callCtx, cancel := context.WithTimeout(g.ctx, wasmCallTimeout)
	defer cancel()
	results, err := alloc.Call(callCtx, uint64(size))
	if err != nil {
		return 0, err
	}
	if len(results) == 0 {
		return 0, fmt.Errorf("motion-go wasm alloc returned no pointer")
	}
	return uint32(results[0]), nil
}

func (g *WASMGame) isFailed() bool {
	if g == nil {
		return true
	}
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.failed
}

func (g *WASMGame) failLocked(err error) {
	if g == nil || g.failed {
		return
	}
	g.failed = true
	g.failErr = err
	log.Printf("motion-go wasm game %q disabled after runtime failure: %v", g.entry.EngineGame, err)
	closeCtx, cancel := context.WithTimeout(context.Background(), wasmCallTimeout)
	defer cancel()
	_ = g.runtime.Close(closeCtx)
}

func unpackPtrLen(value uint64) (uint32, uint32) {
	return uint32(value >> 32), uint32(value)
}

func rgbHex(color RGB) string {
	return fmt.Sprintf("#%02x%02x%02x", color.R, color.G, color.B)
}
