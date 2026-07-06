package authored

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"math/rand"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

const (
	GridWidth  = animation.GridWidth
	GridHeight = animation.GridHeight

	DefaultMusicRef    = "Motion/canciones/Musica8.mp3"
	DefaultMusicVolume = 0.12
)

type RGB = animation.RGB

type Spec struct {
	Schema           string   `json:"schema"`
	Kind             string   `json:"kind"`
	Language         string   `json:"language,omitempty"`
	Version          int      `json:"version"`
	WASMBase64       string   `json:"wasm_base64,omitempty"`
	WASMURL          string   `json:"wasm_url,omitempty"`
	DurationMS       int      `json:"duration_ms"`
	CountdownMS      int      `json:"countdown_ms"`
	TargetSize       int      `json:"target_size"`
	TargetLifeMS     int      `json:"target_life_ms"`
	TargetMinLifeMS  int      `json:"target_min_life_ms"`
	RespawnMS        int      `json:"respawn_ms"`
	MinSpawnDistance float64  `json:"min_spawn_distance"`
	MaxSpawnDistance float64  `json:"max_spawn_distance"`
	BaseScore        int      `json:"base_score"`
	SpeedBonus       int      `json:"speed_bonus"`
	MissPenalty      int      `json:"miss_penalty"`
	BackgroundColor  string   `json:"background_color"`
	HitColor         string   `json:"hit_color"`
	MissColor        string   `json:"miss_color"`
	TargetPalette    []string `json:"target_palette"`
}

type CatalogEntry struct {
	ID                 string  `json:"id"`
	EngineGame         string  `json:"engine_game"`
	Label              string  `json:"label"`
	Description        string  `json:"description"`
	DefaultMusicRef    string  `json:"default_music_ref"`
	DefaultMusicVolume float64 `json:"default_music_volume"`
	MinPlayers         int     `json:"min_players"`
	MaxPlayers         int     `json:"max_players"`
	LevelNarration     bool    `json:"level_narration,omitempty"`
	GameSource         Spec    `json:"game_source"`
}

type RuntimeGame interface {
	Render(now time.Time) []RGB
	Press(event whackamole.PressEvent, now time.Time) []whackamole.Event
}

// parseGameEvents decodes the JSON event list a motion-go call returned.
func parseGameEvents(raw []byte) []whackamole.Event {
	if len(raw) == 0 {
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

// initEvents adapts events returned by init before they reach the runtime. The
// engine already plays the configured start cue when a session begins, so a
// "start" cue from init is delivered as "ready": the message still reaches the
// displays but no duplicate start audio or post-ready countdown is triggered.
func initEvents(events []whackamole.Event) []whackamole.Event {
	for i := range events {
		if events[i].Cue == whackamole.CueStart {
			events[i].Cue = "ready"
		}
	}
	return events
}

type catalogResponse struct {
	Games []CatalogEntry `json:"games"`
}

type gameResponse struct {
	Game CatalogEntry `json:"game"`
}

var (
	catalogMu     sync.Mutex
	cachedCatalog []CatalogEntry
	catalogExpire time.Time
)

type PlayerSnapshot struct {
	Index int
	Label string
	Color RGB
	Score int
	Lives int
}

type Snapshot struct {
	Phase           string
	Players         []PlayerSnapshot
	Score           int
	StartedUnix     int64
	EndsUnix        int64
	ElapsedMillis   int64
	RemainingMillis int64
	CountdownMillis int64
	ActiveTargets   int
	Lives           int
	Success         bool
}

type Point struct {
	X int
	Y int
}

type Game struct {
	mu sync.Mutex

	id      string
	label   string
	spec    Spec
	players []playerInfo
	states  []playerState
	targets []target

	createdAt time.Time
	startedAt time.Time
	endedAt   time.Time
	endAt     time.Time
	ended     bool

	hitFlash  map[Point]flash
	missFlash map[Point]time.Time
	rng       *rand.Rand
}

type playerInfo struct {
	label string
	rgb   RGB
}

type playerState struct {
	score        int
	nextSpawnAt  time.Time
	lastOrigin   Point
	hasLastSpawn bool
}

type target struct {
	player   int
	origin   Point
	born     time.Time
	deadline time.Time
	active   bool
}

type flash struct {
	until time.Time
	color RGB
}

func FetchCatalog(platformURL string) ([]CatalogEntry, error) {
	catalogMu.Lock()
	if time.Now().Before(catalogExpire) && len(cachedCatalog) > 0 {
		out := copyCatalog(cachedCatalog)
		catalogMu.Unlock()
		return out, nil
	}
	catalogMu.Unlock()
	return RefreshCatalog(platformURL)
}

func CachedCatalog() []CatalogEntry {
	catalogMu.Lock()
	defer catalogMu.Unlock()
	return copyCatalog(cachedCatalog)
}

func RefreshCatalog(platformURL string) ([]CatalogEntry, error) {
	endpoint, err := runtimeEndpoint(platformURL, "")
	if err != nil {
		return nil, err
	}
	var payload catalogResponse
	if err := getJSON(endpoint, &payload); err != nil {
		catalogMu.Lock()
		defer catalogMu.Unlock()
		if len(cachedCatalog) > 0 {
			return copyCatalog(cachedCatalog), nil
		}
		return nil, err
	}
	out := make([]CatalogEntry, 0, len(payload.Games))
	for _, game := range payload.Games {
		game.GameSource = NormalizeSpec(game.GameSource)
		if game.EngineGame != "" && (game.GameSource.Schema == "motion-game-v1" || game.GameSource.Schema == "motion-go-v1") {
			out = append(out, game)
		}
	}
	catalogMu.Lock()
	cachedCatalog = copyCatalog(out)
	catalogExpire = time.Now().Add(30 * time.Second)
	catalogMu.Unlock()
	return out, nil
}

func copyCatalog(entries []CatalogEntry) []CatalogEntry {
	if len(entries) == 0 {
		return nil
	}
	out := make([]CatalogEntry, len(entries))
	copy(out, entries)
	return out
}

func FetchGame(platformURL, engineGame string) (CatalogEntry, error) {
	endpoint, err := runtimeEndpoint(platformURL, engineGame)
	if err != nil {
		return CatalogEntry{}, err
	}
	var payload gameResponse
	if err := getJSON(endpoint, &payload); err != nil {
		return CatalogEntry{}, err
	}
	payload.Game.GameSource = NormalizeSpec(payload.Game.GameSource)
	if payload.Game.EngineGame == "" || (payload.Game.GameSource.Schema != "motion-game-v1" && payload.Game.GameSource.Schema != "motion-go-v1") {
		return CatalogEntry{}, fmt.Errorf("authored game %q has no supported game source", engineGame)
	}
	cacheCatalogEntry(payload.Game)
	return payload.Game, nil
}

func cacheCatalogEntry(entry CatalogEntry) {
	if strings.TrimSpace(entry.EngineGame) == "" {
		return
	}
	catalogMu.Lock()
	defer catalogMu.Unlock()
	for index, cached := range cachedCatalog {
		if cached.EngineGame == entry.EngineGame {
			cachedCatalog[index] = entry
			if catalogExpire.Before(time.Now()) {
				catalogExpire = time.Now().Add(30 * time.Second)
			}
			return
		}
	}
	cachedCatalog = append(cachedCatalog, entry)
	if catalogExpire.Before(time.Now()) {
		catalogExpire = time.Now().Add(30 * time.Second)
	}
}

func NewWithSeed(now time.Time, seed int64, engineGame string, playerCount int, players []whackamole.PlayerConfig, platformURL string, difficulty string) (RuntimeGame, error) {
	return NewWithSeedRuntime(now, seed, engineGame, playerCount, players, platformURL, difficulty, "", "auto")
}

func NewWithSeedRuntime(now time.Time, seed int64, engineGame string, playerCount int, players []whackamole.PlayerConfig, platformURL string, difficulty string, level string, runtimeKind string) (RuntimeGame, error) {
	entry, err := FetchGame(platformURL, engineGame)
	if err != nil {
		if runtimeKind == "wasm" {
			return nil, err
		}
		fallback, ok := NativeCatalogEntry(engineGame)
		if !ok {
			return nil, err
		}
		log.Printf("motion-go native game %q using embedded catalog fallback: %v", engineGame, err)
		entry = fallback
	}
	if entry.GameSource.Schema == "motion-go-v1" {
		if runtimeKind != "wasm" && HasNative(entry.EngineGame) {
			game, err := NewNativeWithSeed(now, seed, entry, playerCount, players, difficulty, level)
			if err == nil || runtimeKind == "native" {
				return game, err
			}
			log.Printf("motion-go native game %q failed; falling back to wasm: %v", entry.EngineGame, err)
		}
		return NewWASMWithSeed(now, seed, entry, playerCount, players, difficulty, level)
	}
	return NewFromSpec(now, seed, entry.EngineGame, entry.Label, entry.GameSource, playerCount, players), nil
}

func NewFromSpec(now time.Time, seed int64, id string, label string, spec Spec, playerCount int, players []whackamole.PlayerConfig) *Game {
	spec = NormalizeSpec(spec)
	if seed == 0 {
		seed = now.UnixNano()
	}
	roster := normalizePlayers(playerCount, players, spec)
	startedAt := now.Add(time.Duration(spec.CountdownMS) * time.Millisecond)
	game := &Game{
		id:        id,
		label:     label,
		spec:      spec,
		players:   roster,
		states:    make([]playerState, len(roster)),
		targets:   make([]target, len(roster)),
		createdAt: now,
		startedAt: startedAt,
		endAt:     startedAt.Add(time.Duration(spec.DurationMS) * time.Millisecond),
		hitFlash:  map[Point]flash{},
		missFlash: map[Point]time.Time{},
		rng:       rand.New(rand.NewSource(seed)),
	}
	for i := range game.states {
		game.states[i].nextSpawnAt = startedAt
	}
	return game
}

func NormalizeSpec(spec Spec) Spec {
	if spec.Schema == "motion-go-v1" {
		if spec.Version < 1 {
			spec.Version = 1
		}
		spec.Kind = "wasm"
		if spec.Language == "" {
			spec.Language = "go"
		}
		return spec
	}
	if spec.Schema != "motion-game-v1" || spec.Kind != "target-rush" {
		spec.Schema = "motion-game-v1"
		spec.Kind = "target-rush"
	}
	if spec.Version < 1 {
		spec.Version = 1
	}
	spec.DurationMS = clampInt(spec.DurationMS, 5000, 600000, 60000)
	spec.CountdownMS = clampInt(spec.CountdownMS, 0, 30000, 3000)
	spec.TargetSize = clampInt(spec.TargetSize, 1, 6, 2)
	spec.TargetLifeMS = clampInt(spec.TargetLifeMS, 250, 30000, 3200)
	spec.TargetMinLifeMS = clampInt(spec.TargetMinLifeMS, 250, spec.TargetLifeMS, min(1800, spec.TargetLifeMS))
	spec.RespawnMS = clampInt(spec.RespawnMS, 0, 10000, 250)
	if spec.MaxSpawnDistance <= 0 {
		spec.MaxSpawnDistance = 15
	}
	spec.MaxSpawnDistance = clampFloat(spec.MaxSpawnDistance, 1, 40, 15)
	spec.MinSpawnDistance = clampFloat(spec.MinSpawnDistance, 0, spec.MaxSpawnDistance, 5)
	spec.BaseScore = clampInt(spec.BaseScore, 0, 999, 4)
	spec.SpeedBonus = clampInt(spec.SpeedBonus, 0, 999, 8)
	spec.MissPenalty = clampInt(spec.MissPenalty, 0, 999, 0)
	if spec.BackgroundColor == "" {
		spec.BackgroundColor = "#000000"
	}
	if spec.HitColor == "" {
		spec.HitColor = "#ffec52"
	}
	if spec.MissColor == "" {
		spec.MissColor = "#ff2844"
	}
	if len(spec.TargetPalette) == 0 {
		spec.TargetPalette = []string{"#ff3b30", "#00ffff", "#34c759", "#ff2dff", "#0a84ff", "#ffff00"}
	}
	return spec
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if !inBounds(event.X, event.Y) {
		return nil
	}
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)
	if !event.Pressed || g.ended || now.Before(g.startedAt) {
		return nil
	}
	pt := Point{X: event.X, Y: event.Y}
	for index := range g.targets {
		target := &g.targets[index]
		if target.active && target.contains(pt, g.spec.TargetSize) && now.Before(target.deadline) {
			points := g.hitTargetLocked(target, now)
			return []whackamole.Event{{Cue: whackamole.CueHit, Message: g.playerLabel(target.player) + " +" + fmt.Sprint(points)}}
		}
	}
	if g.spec.MissPenalty > 0 {
		for i := range g.states {
			if g.states[i].score > 0 {
				g.states[i].score = max(0, g.states[i].score-g.spec.MissPenalty)
				break
			}
		}
	}
	g.missFlash[pt] = now.Add(220 * time.Millisecond)
	return []whackamole.Event{{Cue: whackamole.CueMiss, Message: "miss"}}
}

func (g *Game) Render(now time.Time) []RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)
	frame := make([]RGB, GridWidth*GridHeight)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			frame[y*GridWidth+x] = g.colorAtLocked(Point{X: x, Y: y}, now)
		}
	}
	return frame
}

func (g *Game) Snapshot(now time.Time) Snapshot {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)
	phase := "running"
	if now.Before(g.startedAt) {
		phase = "countdown"
	}
	if g.ended {
		phase = "finished"
	}
	elapsed := int64(0)
	if now.After(g.startedAt) {
		elapsed = now.Sub(g.startedAt).Milliseconds()
	}
	remaining := int64(0)
	if !g.ended && now.Before(g.endAt) {
		remaining = g.endAt.Sub(now).Milliseconds()
	}
	countdown := int64(0)
	if now.Before(g.startedAt) {
		countdown = g.startedAt.Sub(now).Milliseconds()
	}
	return Snapshot{
		Phase:           phase,
		Players:         g.playersLocked(),
		Score:           g.totalScoreLocked(),
		StartedUnix:     g.startedAt.Unix(),
		EndsUnix:        g.endAt.Unix(),
		ElapsedMillis:   elapsed,
		RemainingMillis: remaining,
		CountdownMillis: countdown,
		ActiveTargets:   g.activeTargetsLocked(),
		Success:         g.ended,
	}
}

func (g *Game) Label() string {
	if g == nil || strings.TrimSpace(g.label) == "" {
		return "Juego authored"
	}
	return g.label
}

func (g *Game) tickLocked(now time.Time) {
	if g.ended {
		g.decayFlashesLocked(now)
		return
	}
	if !now.Before(g.endAt) {
		g.ended = true
		g.endedAt = now
		g.decayFlashesLocked(now)
		return
	}
	if now.Before(g.startedAt) {
		g.decayFlashesLocked(now)
		return
	}
	for i := range g.targets {
		target := &g.targets[i]
		if target.active && !now.Before(target.deadline) {
			target.active = false
			g.states[i].nextSpawnAt = now.Add(time.Duration(g.spec.RespawnMS) * time.Millisecond)
		}
		if !target.active && !now.Before(g.states[i].nextSpawnAt) {
			g.spawnTargetLocked(i, now)
		}
	}
	g.decayFlashesLocked(now)
}

func (g *Game) hitTargetLocked(target *target, now time.Time) int {
	life := target.deadline.Sub(target.born)
	remaining := target.deadline.Sub(now)
	bonus := 0
	if life > 0 && remaining > 0 {
		bonus = int(math.Round(float64(g.spec.SpeedBonus) * float64(remaining) / float64(life)))
	}
	points := max(0, g.spec.BaseScore+bonus)
	player := target.player
	g.states[player].score += points
	target.active = false
	g.states[player].nextSpawnAt = now.Add(time.Duration(g.spec.RespawnMS) * time.Millisecond)
	color := hexColor(g.spec.HitColor, RGB{R: 255, G: 236, B: 82})
	for y := target.origin.Y; y < target.origin.Y+g.spec.TargetSize; y++ {
		for x := target.origin.X; x < target.origin.X+g.spec.TargetSize; x++ {
			g.hitFlash[Point{X: x, Y: y}] = flash{until: now.Add(250 * time.Millisecond), color: color}
		}
	}
	return points
}

func (g *Game) spawnTargetLocked(player int, now time.Time) {
	origin := g.pickTargetOriginLocked(player)
	life := g.targetLifeForPlayerLocked(player)
	g.targets[player] = target{
		player:   player,
		origin:   origin,
		born:     now,
		deadline: now.Add(life),
		active:   true,
	}
	g.states[player].lastOrigin = origin
	g.states[player].hasLastSpawn = true
}

func (g *Game) targetLifeForPlayerLocked(player int) time.Duration {
	score := 0
	if player >= 0 && player < len(g.states) {
		score = g.states[player].score
	}
	base := float64(g.spec.TargetLifeMS)
	minLife := float64(g.spec.TargetMinLifeMS)
	scale := math.Pow(0.94, float64(score)/8)
	return time.Duration(math.Max(minLife, base*scale)) * time.Millisecond
}

func (g *Game) pickTargetOriginLocked(player int) Point {
	maxX := max(0, GridWidth-g.spec.TargetSize)
	maxY := max(0, GridHeight-g.spec.TargetSize)
	for attempt := 0; attempt < 80; attempt++ {
		pt := Point{X: g.rng.Intn(maxX + 1), Y: g.rng.Intn(maxY + 1)}
		if g.targetOriginOKLocked(player, pt) {
			return pt
		}
	}
	return Point{X: g.rng.Intn(maxX + 1), Y: g.rng.Intn(maxY + 1)}
}

func (g *Game) targetOriginOKLocked(player int, pt Point) bool {
	center := targetCenter(pt, g.spec.TargetSize)
	if player >= 0 && player < len(g.states) && g.states[player].hasLastSpawn {
		dist := distance(center, targetCenter(g.states[player].lastOrigin, g.spec.TargetSize))
		if dist < g.spec.MinSpawnDistance || dist > g.spec.MaxSpawnDistance {
			return false
		}
	}
	for _, target := range g.targets {
		if target.active && rectsOverlap(pt, g.spec.TargetSize, target.origin, g.spec.TargetSize) {
			return false
		}
	}
	return true
}

func (g *Game) colorAtLocked(pt Point, now time.Time) RGB {
	if g.ended {
		return gameOverColor(pt, now)
	}
	if flash, ok := g.hitFlash[pt]; ok && now.Before(flash.until) {
		return flash.color
	}
	if until, ok := g.missFlash[pt]; ok && now.Before(until) {
		return hexColor(g.spec.MissColor, RGB{R: 255, G: 40, B: 68})
	}
	if now.Before(g.startedAt) {
		return countdownColor(pt, now, g.createdAt, g.startedAt)
	}
	for _, target := range g.targets {
		if target.active && target.contains(pt, g.spec.TargetSize) {
			return g.playerColor(target.player)
		}
	}
	return hexColor(g.spec.BackgroundColor, RGB{})
}

func (g *Game) playersLocked() []PlayerSnapshot {
	out := make([]PlayerSnapshot, 0, len(g.players))
	for i := range g.players {
		out = append(out, PlayerSnapshot{
			Index: i,
			Label: g.playerLabel(i),
			Color: g.playerColor(i),
			Score: g.states[i].score,
		})
	}
	return out
}

func (g *Game) activeTargetsLocked() int {
	count := 0
	for _, target := range g.targets {
		if target.active {
			count++
		}
	}
	return count
}

func (g *Game) totalScoreLocked() int {
	total := 0
	for _, state := range g.states {
		total += state.score
	}
	return total
}

func (g *Game) decayFlashesLocked(now time.Time) {
	for pt, flash := range g.hitFlash {
		if !now.Before(flash.until) {
			delete(g.hitFlash, pt)
		}
	}
	for pt, until := range g.missFlash {
		if !now.Before(until) {
			delete(g.missFlash, pt)
		}
	}
}

func (g *Game) playerLabel(player int) string {
	if player >= 0 && player < len(g.players) && g.players[player].label != "" {
		return g.players[player].label
	}
	return fmt.Sprintf("Jugador %d", player+1)
}

func (g *Game) playerColor(player int) RGB {
	if player >= 0 && player < len(g.players) {
		return g.players[player].rgb
	}
	return RGB{R: 255, G: 255, B: 255}
}

func (t target) contains(pt Point, size int) bool {
	return pt.X >= t.origin.X && pt.X < t.origin.X+size && pt.Y >= t.origin.Y && pt.Y < t.origin.Y+size
}

func runtimeEndpoint(platformURL, engineGame string) (string, error) {
	base := strings.TrimRight(strings.TrimSpace(platformURL), "/")
	if base == "" {
		return "", fmt.Errorf("platform URL is required for authored games")
	}
	if engineGame == "" {
		return base + "/api/game-runtime", nil
	}
	return base + "/api/game-runtime/" + url.PathEscape(engineGame), nil
}

func getJSON(endpoint string, out any) error {
	client := http.Client{Timeout: 5 * time.Second}
	response, err := client.Get(endpoint)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return fmt.Errorf("GET %s: status %d", endpoint, response.StatusCode)
	}
	return json.NewDecoder(response.Body).Decode(out)
}

func normalizePlayers(playerCount int, players []whackamole.PlayerConfig, spec Spec) []playerInfo {
	if playerCount < 1 {
		playerCount = len(players)
	}
	playerCount = clampInt(playerCount, 1, 8, 1)
	out := make([]playerInfo, playerCount)
	for i := range out {
		out[i] = playerInfo{
			label: fmt.Sprintf("Jugador %d", i+1),
			rgb:   hexColor(spec.TargetPalette[i%len(spec.TargetPalette)], RGB{R: 255, G: 255, B: 255}),
		}
		if i < len(players) {
			if players[i].Label != "" {
				out[i].label = players[i].Label
			}
			if players[i].Color != (RGB{}) {
				out[i].rgb = players[i].Color
			}
		}
	}
	return out
}

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}

func hexColor(value string, fallback RGB) RGB {
	value = strings.TrimPrefix(strings.TrimSpace(value), "#")
	if len(value) != 6 {
		return fallback
	}
	raw, err := strconv.ParseUint(value, 16, 32)
	if err != nil {
		return fallback
	}
	return RGB{R: byte(raw >> 16), G: byte(raw >> 8), B: byte(raw)}
}

func countdownColor(pt Point, now, createdAt, startedAt time.Time) RGB {
	remaining := startedAt.Sub(now)
	if remaining < 0 {
		remaining = 0
	}
	pulse := 0.35 + 0.65*(0.5+0.5*math.Sin(now.Sub(createdAt).Seconds()*math.Pi*5))
	centerX := float64(GridWidth-1) / 2
	centerY := float64(GridHeight-1) / 2
	dist := math.Hypot((float64(pt.X)-centerX)/float64(GridWidth), (float64(pt.Y)-centerY)/float64(GridHeight))
	ring := math.Max(0, 1-dist*3.1)
	scale := pulse * ring
	return RGB{G: byte(clampFloat(scale*255, 0, 255, 0)), B: byte(clampFloat(scale*120, 0, 255, 0))}
}

func gameOverColor(pt Point, now time.Time) RGB {
	wave := 0.5 + 0.5*math.Sin((float64(pt.X)*0.18+float64(pt.Y)*0.11+float64(now.UnixNano())*0.000000006)*math.Pi*2)
	return RGB{G: byte(120 + wave*135), B: byte(60 + wave*120)}
}

func targetCenter(pt Point, size int) Point {
	return Point{X: pt.X + size/2, Y: pt.Y + size/2}
}

func distance(a, b Point) float64 {
	return math.Hypot(float64(a.X-b.X), float64(a.Y-b.Y))
}

func rectsOverlap(a Point, aSize int, b Point, bSize int) bool {
	return a.X < b.X+bSize && a.X+aSize > b.X && a.Y < b.Y+bSize && a.Y+aSize > b.Y
}

func clampInt(value, minValue, maxValue, fallback int) int {
	if value == 0 {
		value = fallback
	}
	if value < minValue {
		return minValue
	}
	if value > maxValue {
		return maxValue
	}
	return value
}

func clampFloat(value, minValue, maxValue, fallback float64) float64 {
	if value == 0 {
		value = fallback
	}
	if value < minValue {
		return minValue
	}
	if value > maxValue {
		return maxValue
	}
	return value
}
