package authored

import (
	"encoding/json"
	"fmt"
	"log"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/authored/nativegames/duelgo"
	"github.com/lobis/motion-levels/game-engine/internal/games/authored/nativegames/lavago"
	"github.com/lobis/motion-levels/game-engine/internal/games/authored/nativegames/memorychallengego"
	"github.com/lobis/motion-levels/game-engine/internal/games/authored/nativegames/patronesgo"
	"github.com/lobis/motion-levels/game-engine/internal/games/authored/nativegames/pingpongmotion"
	"github.com/lobis/motion-levels/game-engine/internal/games/authored/nativegames/saltosgo"
	"github.com/lobis/motion-levels/game-engine/internal/games/authored/nativegames/tetris"
	"github.com/lobis/motion-levels/game-engine/internal/games/authored/nativegames/whackamolego"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/lobis/motion-levels/packages/motiongo"
)

type NativeABI interface {
	Init(ptr uint32, length uint32) uint64
	Press(ptr uint32, length uint32) uint64
	Tick(ptr uint32, length uint32) uint64
	Render(ptr uint32, length uint32) uint64
	Snapshot(ptr uint32, length uint32) uint64
}

type NativeGame struct {
	mu      sync.Mutex
	entry   CatalogEntry
	players []playerInfo
	abi     NativeABI
	pending []whackamole.Event
	failed  bool
	failErr error
}

var nativeFactories = map[string]func() NativeABI{
	"authored-duel":             func() NativeABI { return duelgo.NewABI() },
	"authored-lava":             func() NativeABI { return lavago.NewABI() },
	"authored-memory-challenge": func() NativeABI { return memorychallengego.NewABI() },
	"authored-patrones":         func() NativeABI { return patronesgo.NewABI() },
	"authored-ping-pong-motion": func() NativeABI { return pingpongmotion.NewABI() },
	"authored-saltos":           func() NativeABI { return saltosgo.NewABI() },
	"authored-tetris":           func() NativeABI { return tetris.NewABI() },
	"authored-whack-a-mole-go":  func() NativeABI { return whackamolego.NewABI() },
}

var nativeCatalogEntries = map[string]CatalogEntry{
	"authored-duel": {
		ID:                 "duel",
		EngineGame:         "authored-duel",
		Label:              "Duelo",
		Description:        "Cada jugador empieza en su zona. Gana quien reclame antes todas sus baldosas.",
		DefaultMusicRef:    duelgo.DefaultMusicRef,
		DefaultMusicVolume: 0.14,
		MinPlayers:         2,
		MaxPlayers:         8,
		GameSource:         nativeMotionGoSpec(),
	},
	"authored-lava": {
		ID:                 "lava",
		EngineGame:         "authored-lava",
		Label:              "El suelo es lava",
		Description:        "Evitad las baldosas rojas, descubrid plataformas seguras nuevas y cuidad las vidas del equipo.",
		DefaultMusicRef:    lavago.DefaultMusicRef,
		DefaultMusicVolume: 0.20,
		MinPlayers:         1,
		MaxPlayers:         6,
		GameSource:         nativeMotionGoSpec(),
	},
	"authored-memory-challenge": {
		ID:                 "memory-lights",
		EngineGame:         "authored-memory-challenge",
		Label:              "Reto de memoria",
		Description:        "Memorizad el camino iluminado y recorredlo sin verlo.",
		DefaultMusicRef:    "Motion/canciones/Background07.mp3",
		DefaultMusicVolume: 0.14,
		MinPlayers:         1,
		MaxPlayers:         4,
		GameSource:         nativeMotionGoSpec(),
	},
	"authored-patrones": {
		ID:                 "patrones",
		EngineGame:         "authored-patrones",
		Label:              "Patrones",
		Description:        "Reconstruid patrones azules en el canvas central sin errores.",
		DefaultMusicRef:    "Motion/canciones/Background07.mp3",
		DefaultMusicVolume: 0.18,
		MinPlayers:         1,
		MaxPlayers:         6,
		LevelNarration:     true,
		GameSource:         nativeMotionGoSpec(),
	},
	"authored-ping-pong-motion": {
		ID:                 "ping-pong-motion",
		EngineGame:         "authored-ping-pong-motion",
		Label:              "Ping Pong Motion",
		Description:        "Pelota de pista para dos equipos.",
		DefaultMusicRef:    DefaultMusicRef,
		DefaultMusicVolume: DefaultMusicVolume,
		MinPlayers:         2,
		MaxPlayers:         8,
		GameSource:         nativeMotionGoSpec(),
	},
	"authored-saltos": {
		ID:                 "saltos",
		EngineGame:         "authored-saltos",
		Label:              "Saltos",
		Description:        "Salta de la plataforma azul a la verde sin tocar la lava.",
		DefaultMusicRef:    "Motion/canciones/Background07.mp3",
		DefaultMusicVolume: 0.18,
		MinPlayers:         1,
		MaxPlayers:         1,
		LevelNarration:     true,
		GameSource:         nativeMotionGoSpec(),
	},
	"authored-tetris": {
		ID:                 "tetris",
		EngineGame:         "authored-tetris",
		Label:              "Tetris",
		Description:        "Piezas que caen en una pista de 10 columnas.",
		DefaultMusicRef:    DefaultMusicRef,
		DefaultMusicVolume: DefaultMusicVolume,
		MinPlayers:         1,
		MaxPlayers:         4,
		GameSource:         nativeMotionGoSpec(),
	},
	"authored-whack-a-mole-go": {
		ID:                 "whack-a-mole-go",
		EngineGame:         "authored-whack-a-mole-go",
		Label:              "Atrapa al topo",
		Description:        "Pisa los objetivos 2x2 antes de que se apaguen.",
		DefaultMusicRef:    DefaultMusicRef,
		DefaultMusicVolume: DefaultMusicVolume,
		MinPlayers:         1,
		MaxPlayers:         8,
		GameSource:         nativeMotionGoSpec(),
	},
}

func nativeMotionGoSpec() Spec {
	return Spec{Schema: "motion-go-v1", Kind: "wasm", Language: "go", Version: 1}
}

func HasNative(engineGame string) bool {
	_, ok := nativeFactories[engineGame]
	return ok
}

func NativeCatalogEntry(engineGame string) (CatalogEntry, bool) {
	entry, ok := nativeCatalogEntries[strings.TrimSpace(engineGame)]
	if !ok {
		return CatalogEntry{}, false
	}
	entry.GameSource = NormalizeSpec(entry.GameSource)
	return entry, true
}

func NativeCatalogEntries() []CatalogEntry {
	ids := make([]string, 0, len(nativeCatalogEntries))
	for id := range nativeCatalogEntries {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	out := make([]CatalogEntry, 0, len(ids))
	for _, id := range ids {
		if entry, ok := NativeCatalogEntry(id); ok {
			out = append(out, entry)
		}
	}
	return out
}

func NativeGameIDs() []string {
	out := make([]string, 0, len(nativeFactories))
	for id := range nativeFactories {
		out = append(out, id)
	}
	return out
}

func NewNativeWithSeed(now time.Time, seed int64, entry CatalogEntry, playerCount int, players []whackamole.PlayerConfig, difficulty string, level string) (*NativeGame, error) {
	factory, ok := nativeFactories[entry.EngineGame]
	if !ok {
		return nil, fmt.Errorf("motion-go-v1 game %q has no native runner", entry.EngineGame)
	}
	game := &NativeGame{
		entry:   entry,
		players: normalizePlayers(playerCount, players, NormalizeSpec(Spec{})),
		abi:     factory(),
	}
	initPlayers := make([]wasmPlayer, 0, len(game.players))
	for i, player := range game.players {
		initPlayers = append(initPlayers, wasmPlayer{Index: i, Label: player.label, Color: rgbHex(player.rgb)})
	}
	raw, err := game.call("init", wasmInitRequest{
		EngineGame: entry.EngineGame,
		Label:      entry.Label,
		Seed:       seed,
		Difficulty: normalizeDifficulty(difficulty),
		Level:      strings.TrimSpace(level),
		NowUnixNS:  now.UnixNano(),
		Width:      GridWidth,
		Height:     GridHeight,
		Players:    initPlayers,
		Spec:       entry.GameSource,
	})
	if err != nil {
		return nil, err
	}
	game.queueEvents(initEvents(parseGameEvents(raw)))
	return game, nil
}

func (g *NativeGame) RuntimeKind() string {
	return "native"
}

func (g *NativeGame) Label() string {
	if g == nil || g.entry.Label == "" {
		return "Juego Go"
	}
	return g.entry.Label
}

func (g *NativeGame) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if g == nil || g.isFailed() {
		return nil
	}
	raw, err := g.call("press", wasmPressRequest{NowUnixNS: now.UnixNano(), X: event.X, Y: event.Y, Pressed: event.Pressed})
	if err != nil {
		return nil
	}
	return parseGameEvents(raw)
}

func (g *NativeGame) Tick(now time.Time) {
	if g == nil || g.isFailed() {
		return
	}
	raw, err := g.call("tick", wasmTimeRequest{NowUnixNS: now.UnixNano()})
	if err != nil {
		return
	}
	g.queueEvents(parseGameEvents(raw))
}

// DrainEvents returns events queued from init and tick calls so the runtime can
// play cues and update the last-event display for time-based game moments.
func (g *NativeGame) DrainEvents() []whackamole.Event {
	if g == nil {
		return nil
	}
	g.mu.Lock()
	defer g.mu.Unlock()
	out := g.pending
	g.pending = nil
	return out
}

func (g *NativeGame) queueEvents(events []whackamole.Event) {
	if g == nil || len(events) == 0 {
		return
	}
	g.mu.Lock()
	g.pending = append(g.pending, events...)
	g.mu.Unlock()
}

func (g *NativeGame) Render(now time.Time) []RGB {
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

func (g *NativeGame) Snapshot(now time.Time) Snapshot {
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
	return authoredSnapshot(snapshot, g.defaultPlayers())
}

func (g *NativeGame) defaultPlayers() []PlayerSnapshot {
	out := make([]PlayerSnapshot, 0, len(g.players))
	for i, player := range g.players {
		out = append(out, PlayerSnapshot{Index: i, Label: player.label, Color: player.rgb})
	}
	return out
}

func (g *NativeGame) call(name string, input any) (out []byte, err error) {
	g.mu.Lock()
	defer g.mu.Unlock()
	if g.failed {
		return nil, g.failErr
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("motion-go native %s panic: %v", name, recovered)
			g.failLocked(err)
		}
	}()
	payload, err := json.Marshal(input)
	if err != nil {
		return nil, err
	}
	ptr := motiongo.Alloc(uint32(len(payload)))
	if !motiongo.WriteRequest(ptr, payload) {
		err := fmt.Errorf("motion-go native request write failed")
		g.failLocked(err)
		return nil, err
	}
	var packed uint64
	switch name {
	case "init":
		packed = g.abi.Init(ptr, uint32(len(payload)))
	case "press":
		packed = g.abi.Press(ptr, uint32(len(payload)))
	case "tick":
		packed = g.abi.Tick(ptr, uint32(len(payload)))
	case "render":
		packed = g.abi.Render(ptr, uint32(len(payload)))
	case "snapshot":
		packed = g.abi.Snapshot(ptr, uint32(len(payload)))
	default:
		err := fmt.Errorf("motion-go native missing call %q", name)
		g.failLocked(err)
		return nil, err
	}
	if packed == 0 {
		return nil, nil
	}
	outPtr, outLen := unpackPtrLen(packed)
	if outLen == 0 {
		return nil, nil
	}
	out, ok := motiongo.ReadResponse(outPtr, outLen)
	if !ok {
		err := fmt.Errorf("motion-go native response read failed")
		g.failLocked(err)
		return nil, err
	}
	return append([]byte(nil), out...), nil
}

func (g *NativeGame) isFailed() bool {
	if g == nil {
		return true
	}
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.failed
}

func (g *NativeGame) failLocked(err error) {
	if g == nil || g.failed {
		return
	}
	g.failed = true
	g.failErr = err
	log.Printf("motion-go native game %q disabled after runtime failure: %v", g.entry.EngineGame, err)
}
