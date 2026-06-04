package memorychallenge

import (
	"math"
	"math/rand"
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

	laneWidth          = 4
	startRows          = 2
	pathFadeTime       = 1400 * time.Millisecond
	startGrace         = time.Second
	maxPlayers         = 4
	gameDuration       = 90 * time.Second
	progressStep       = 5
	DefaultMusicRef    = "Motion/canciones/Background07.mp3"
	DefaultMusicVolume = 0.14
)

type RGB = animation.RGB

type Point struct {
	X int
	Y int
}

type Rect struct {
	X int
	Y int
	W int
	H int
}

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
	Winner          int
	Success         bool
}

type playerMode int

const (
	playerAtStart playerMode = iota
	playerRunning
	playerFailed
	playerFinished
)

type playerState struct {
	label        string
	color        RGB
	progress     int
	bestProgress int
	mode         playerMode
	lane         Rect
	start        Rect
	path         []Point
	pathIndex    map[Point]int
	startPress   map[Point]bool
	fadeStarted  time.Time
	failStarted  time.Time
	failPoint    Point
}

type Game struct {
	mu sync.Mutex

	players []playerState
	created time.Time
	endAt   time.Time
	winner  int
	over    bool
	rng     *rand.Rand
}

var defaultPlayers = []struct {
	label string
	rgb   RGB
}{
	{label: "Green", rgb: RGB{R: 0, G: 255, B: 0}},
	{label: "Cyan", rgb: RGB{R: 0, G: 255, B: 255}},
	{label: "Pink", rgb: RGB{R: 255, G: 0, B: 255}},
	{label: "Yellow", rgb: RGB{R: 255, G: 255, B: 0}},
}

func New(now time.Time, playerCount int) *Game {
	return NewWithSeed(now, now.UnixNano(), playerCount)
}

func NewWithSeed(now time.Time, seed int64, playerCount int) *Game {
	return NewWithSeedAndPlayers(now, seed, defaultPlayerConfig(playerCount))
}

func NewWithSeedAndPlayers(now time.Time, seed int64, players []whackamole.PlayerConfig) *Game {
	if seed == 0 {
		seed = now.UnixNano()
	}
	roster := normalizePlayerConfig(players)
	rng := rand.New(rand.NewSource(seed))
	lanes := laneLayout(len(roster))
	states := make([]playerState, len(roster))
	for i := range states {
		lane := lanes[i]
		start := startZoneForLane(lane)
		path := generateLanePath(rng, lane, start)
		states[i] = playerState{
			label:      roster[i].label,
			color:      roster[i].color,
			mode:       playerAtStart,
			lane:       lane,
			start:      start,
			path:       path,
			pathIndex:  pathIndex(path),
			startPress: map[Point]bool{},
		}
	}
	return &Game{
		players: states,
		created: now,
		endAt:   now.Add(gameDuration),
		winner:  -1,
		rng:     rng,
	}
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if !inBounds(event.X, event.Y) {
		return nil
	}
	pt := Point{X: event.X, Y: event.Y}

	g.mu.Lock()
	defer g.mu.Unlock()

	if g.expireLocked(now) || g.over {
		return nil
	}
	playerIndex := g.playerForPointLocked(pt)
	if playerIndex < 0 {
		return nil
	}
	player := &g.players[playerIndex]

	if event.Pressed && player.mode == playerFailed && player.returnBandContains(pt) {
		g.returnPlayerToStartLocked(playerIndex, now)
		return []whackamole.Event{{Cue: whackamole.CueStart, Message: player.label + " vuelve"}}
	}
	if player.start.contains(pt) {
		if event.Pressed {
			player.startPress[pt] = true
			if player.mode == playerRunning && player.progress == 0 {
				player.fadeStarted = time.Time{}
			}
			return nil
		}
		delete(player.startPress, pt)
		if player.mode == playerAtStart && len(player.startPress) == 0 {
			g.beginPlayerRunLocked(playerIndex, now)
		} else if player.mode == playerRunning && player.progress == 0 && len(player.startPress) == 0 {
			g.schedulePlayerFadeLocked(playerIndex, now)
		}
		return nil
	}
	if !event.Pressed {
		return nil
	}
	switch player.mode {
	case playerAtStart:
		g.beginPlayerRunLocked(playerIndex, now)
		return g.handlePathPressLocked(playerIndex, pt, now)
	case playerRunning:
		return g.handlePathPressLocked(playerIndex, pt, now)
	default:
		return nil
	}
}

func (g *Game) Render(now time.Time) []RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.expireLocked(now)

	frame := make([]RGB, GridWidth*GridHeight)
	t := g.timePhase(now)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			frame[y*GridWidth+x] = g.colorAtLocked(pt, now, t)
		}
	}
	return frame
}

func (g *Game) Snapshot(now time.Time) Snapshot {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.expireLocked(now)

	phase := "ready"
	running := false
	failed := false
	for _, player := range g.players {
		switch player.mode {
		case playerRunning:
			running = true
		case playerFailed:
			failed = true
		}
	}
	if running {
		phase = "running"
	}
	if failed {
		phase = "failed"
	}
	if g.over {
		phase = "finished"
	}

	players := make([]PlayerSnapshot, 0, len(g.players))
	best := 0
	for i, player := range g.players {
		if player.bestProgress > best {
			best = player.bestProgress
		}
		players = append(players, PlayerSnapshot{
			Index: i,
			Label: player.label,
			Color: player.color,
			Score: player.bestProgress,
			Lives: -1,
		})
	}

	elapsed := int64(0)
	if now.After(g.created) {
		elapsed = now.Sub(g.created).Milliseconds()
	}
	remaining := int64(0)
	if now.Before(g.endAt) && !g.over {
		remaining = g.endAt.Sub(now).Milliseconds()
	}
	activeTargets := 0
	for _, player := range g.players {
		activeTargets += maxInt(0, len(player.path)-player.bestProgress)
	}

	return Snapshot{
		Phase:           phase,
		Players:         players,
		Score:           best,
		StartedUnix:     g.created.Unix(),
		EndsUnix:        g.endAt.Unix(),
		ElapsedMillis:   elapsed,
		RemainingMillis: remaining,
		ActiveTargets:   activeTargets,
		Lives:           -1,
		Winner:          g.winner,
		Success:         g.winner >= 0,
	}
}

func (g *Game) beginPlayerRunLocked(playerIndex int, now time.Time) {
	if playerIndex < 0 || playerIndex >= len(g.players) {
		return
	}
	player := &g.players[playerIndex]
	if player.mode == playerFinished {
		return
	}
	player.mode = playerRunning
	g.schedulePlayerFadeLocked(playerIndex, now)
}

func (g *Game) schedulePlayerFadeLocked(playerIndex int, now time.Time) {
	player := &g.players[playerIndex]
	if len(player.startPress) > 0 {
		player.fadeStarted = time.Time{}
		return
	}
	player.fadeStarted = now.Add(startGrace)
}

func (g *Game) returnPlayerToStartLocked(playerIndex int, now time.Time) {
	player := &g.players[playerIndex]
	player.mode = playerAtStart
	player.startPress = map[Point]bool{}
	player.fadeStarted = time.Time{}
	player.failStarted = time.Time{}
}

func (g *Game) handlePathPressLocked(playerIndex int, pt Point, now time.Time) []whackamole.Event {
	player := &g.players[playerIndex]
	if player.mode != playerRunning {
		return nil
	}
	if player.progress < len(player.path) && pt == player.path[player.progress] {
		if player.progress == 0 {
			player.fadeStarted = now
		}
		player.progress++
		if player.progress > player.bestProgress {
			player.bestProgress = player.progress
		}
		if player.progress >= len(player.path) {
			g.finishPlayerLocked(playerIndex, now)
			return []whackamole.Event{{Cue: whackamole.CueWin, Message: "Memoria gana " + player.label}}
		}
		if shouldEmitProgress(player.progress, len(player.path)) {
			return []whackamole.Event{{Cue: whackamole.CueCoin, Message: player.label + " " + strconv.Itoa(player.progress)}}
		}
		return nil
	}
	if index, ok := player.pathIndex[pt]; ok && index < player.progress {
		return nil
	}
	g.failPlayerLocked(playerIndex, pt, now)
	return []whackamole.Event{{Cue: whackamole.CueDamage, Message: player.label + " falló"}}
}

func shouldEmitProgress(progress, pathLength int) bool {
	return progress == 1 || progress%progressStep == 0 || progress >= pathLength
}

func (g *Game) failPlayerLocked(playerIndex int, pt Point, now time.Time) {
	player := &g.players[playerIndex]
	if player.mode != playerRunning && player.mode != playerAtStart {
		return
	}
	player.progress = 0
	player.failPoint = pt
	player.failStarted = now
	player.fadeStarted = time.Time{}
	player.startPress = map[Point]bool{}
	player.mode = playerFailed
}

func (g *Game) finishPlayerLocked(playerIndex int, now time.Time) {
	player := &g.players[playerIndex]
	player.mode = playerFinished
	player.bestProgress = len(player.path)
	g.winner = playerIndex
	g.over = true
}

func (g *Game) expireLocked(now time.Time) bool {
	if g.over || g.endAt.IsZero() || now.Before(g.endAt) {
		return false
	}
	g.over = true
	return true
}

func (g *Game) colorAtLocked(pt Point, now time.Time, t float64) RGB {
	playerIndex := g.playerForPointLocked(pt)
	if playerIndex < 0 {
		return lavaColor(pt.X, pt.Y, t, 0.32)
	}
	player := g.players[playerIndex]
	color := player.color

	if g.over {
		return g.gameOverColorLocked(playerIndex, pt, t)
	}
	if player.start.contains(pt) {
		return g.startColorLocked(playerIndex, pt, t)
	}
	if player.mode == playerFailed && pt == player.failPoint {
		pulse := (math.Sin(t*12) + 1) / 2
		return RGB{R: 255, G: byte(130 + 100*pulse), B: byte(60 + 130*pulse)}
	}
	if player.mode == playerFailed && manhattan(pt, player.failPoint) <= 2 && int(t*10)%6 < 3 {
		return addRGB(lavaColor(pt.X, pt.Y, t, 1.0), RGB{R: 90, G: 22})
	}
	if index, ok := player.pathIndex[pt]; ok {
		return pathColor(player, color, pt, index, now, t)
	}
	return lavaColor(pt.X, pt.Y, t, 1.0)
}

func (g *Game) startColorLocked(playerIndex int, pt Point, t float64) RGB {
	player := g.players[playerIndex]
	color := player.color
	pulse := (math.Sin(t*5+float64(pt.X)*0.4) + 1) / 2
	factor := 0.30 + 0.34*pulse
	if player.mode == playerAtStart || len(player.startPress) > 0 {
		factor = 0.58 + 0.36*pulse
	}
	if player.mode == playerFailed {
		factor = 0.44 + 0.48*pulse
	}
	if player.mode == playerFinished {
		factor = 0.70 + 0.28*pulse
	}
	if len(player.startPress) > 0 {
		return addRGB(scaleRGB(color, factor), scaleRGB(RGB{R: 255, G: 255, B: 255}, 0.28))
	}
	return scaleRGB(color, factor)
}

func pathColor(player playerState, color RGB, pt Point, index int, now time.Time, t float64) RGB {
	pulse := (math.Sin(t*4+float64(index)*0.14) + 1) / 2
	switch player.mode {
	case playerAtStart:
		return pathLitColor(color, pulse)
	case playerFailed:
		if int(t*10)%6 < 3 {
			return pathLitColor(color, pulse)
		}
		return scaleRGB(color, 0.12+0.18*pulse)
	case playerRunning:
		if index < player.progress {
			return pathLitColor(color, pulse)
		}
		if player.fadeStarted.IsZero() || now.Before(player.fadeStarted) {
			return pathLitColor(color, pulse)
		}
		ratio := 1 - clamp01(float64(now.Sub(player.fadeStarted))/float64(pathFadeTime))
		if ratio > 0 {
			return blendRGB(lavaColor(pt.X, pt.Y, t, 1.0), pathLitColor(color, pulse), ratio)
		}
		return lavaColor(pt.X, pt.Y, t, 1.0)
	case playerFinished:
		return pathLitColor(color, pulse)
	default:
		return lavaColor(pt.X, pt.Y, t, 1.0)
	}
}

func pathLitColor(color RGB, pulse float64) RGB {
	return scaleRGB(color, 0.84+0.16*pulse)
}

func (g *Game) gameOverColorLocked(playerIndex int, pt Point, t float64) RGB {
	if g.winner < 0 {
		if int(t*10)%8 < 4 {
			return RGB{R: 255, G: 28}
		}
		return lavaColor(pt.X, pt.Y, t, 0.72)
	}
	if playerIndex != g.winner {
		return lavaColor(pt.X, pt.Y, t, 0.50)
	}
	color := g.players[playerIndex].color
	player := g.players[playerIndex]
	pulse := (math.Sin(t*8) + 1) / 2
	if player.start.contains(pt) {
		return addRGB(scaleRGB(color, 0.74+0.24*pulse), scaleRGB(RGB{R: 255, G: 255, B: 255}, 0.20+0.25*pulse))
	}
	if index, ok := player.pathIndex[pt]; ok {
		tick := int(t * 20)
		if traceTile(player, index, tick) {
			return complementColor(color)
		}
		return pathLitColor(color, pulse)
	}
	return blendRGB(lavaColor(pt.X, pt.Y, t, 0.82), color, 0.30+0.28*pulse)
}

func traceTile(player playerState, index, tick int) bool {
	if len(player.path) == 0 || index < 0 {
		return false
	}
	traceIndex := len(player.path) - 1 - (tick % len(player.path))
	return index == traceIndex
}

func complementColor(color RGB) RGB {
	return RGB{R: 255 - color.R, G: 255 - color.G, B: 255 - color.B}
}

func lavaColor(x, y int, t, intensity float64) RGB {
	flicker := (math.Sin(float64(x)*0.83+float64(y)*0.37+t*2.2) + 1) / 2
	flow := (math.Sin(float64(y)*0.55+t*1.4) + 1) / 2
	ember := (math.Sin(float64(x+y)*0.41+t*3.7) + 1) / 2
	r := clampByte(int((18 + 54*flicker + 16*ember) * intensity))
	g := clampByte(int((2 + 16*flow + 6*ember) * intensity))
	b := clampByte(int((1 + 4*(1-flicker)) * intensity))
	return RGB{R: r, G: g, B: b}
}

func (g *Game) playerForPointLocked(pt Point) int {
	for i, player := range g.players {
		if player.lane.contains(pt) {
			return i
		}
	}
	return -1
}

func laneLayout(playerCount int) []Rect {
	playerCount = clampInt(playerCount, 1, maxPlayers)
	switch playerCount {
	case 1:
		return []Rect{{X: 0, Y: 0, W: GridWidth, H: GridHeight}}
	case 2:
		return []Rect{{X: 0, Y: 0, W: GridWidth / 2, H: GridHeight}, {X: GridWidth / 2, Y: 0, W: GridWidth / 2, H: GridHeight}}
	case 3:
		return []Rect{{X: 0, Y: 0, W: laneWidth, H: GridHeight}, {X: 6, Y: 0, W: laneWidth, H: GridHeight}, {X: 12, Y: 0, W: laneWidth, H: GridHeight}}
	default:
		return []Rect{{X: 0, Y: 0, W: laneWidth, H: GridHeight}, {X: 4, Y: 0, W: laneWidth, H: GridHeight}, {X: 8, Y: 0, W: laneWidth, H: GridHeight}, {X: 12, Y: 0, W: laneWidth, H: GridHeight}}
	}
}

func startZoneForLane(lane Rect) Rect {
	width := laneWidth
	if lane.W < width {
		width = lane.W
	}
	return Rect{X: lane.X + (lane.W-width)/2, Y: 0, W: width, H: startRows}
}

func generateLanePath(rng *rand.Rand, lane, start Rect) []Point {
	for attempt := 0; attempt < 1000; attempt++ {
		path := candidateLanePath(rng, lane, start)
		if pathOrderUnambiguous(path) {
			return path
		}
	}
	return straightLanePath(lane, start)
}

func candidateLanePath(rng *rand.Rand, lane, start Rect) []Point {
	x := start.X + rng.Intn(start.W)
	y := startRows
	path := []Point{{X: x, Y: y}}
	segmentRows := 3 + rng.Intn(4)
	for y < GridHeight-1 {
		if segmentRows <= 0 {
			candidates := make([]int, 0, 2)
			if x > lane.X {
				candidates = append(candidates, x-1)
			}
			if x < lane.X+lane.W-1 {
				candidates = append(candidates, x+1)
			}
			if len(candidates) > 0 {
				x = candidates[rng.Intn(len(candidates))]
				path = append(path, Point{X: x, Y: y})
			}
			segmentRows = 3 + rng.Intn(5)
		}
		y++
		path = append(path, Point{X: x, Y: y})
		segmentRows--
	}
	return path
}

func straightLanePath(lane, start Rect) []Point {
	x := start.X + start.W/2
	path := make([]Point, 0, GridHeight-startRows)
	for y := startRows; y < GridHeight; y++ {
		path = append(path, Point{X: x, Y: y})
	}
	return path
}

func pathOrderUnambiguous(path []Point) bool {
	if len(path) < 2 {
		return false
	}
	seen := make(map[Point]int, len(path))
	for i, pt := range path {
		if _, ok := seen[pt]; ok {
			return false
		}
		seen[pt] = i
		if i > 0 && manhattan(pt, path[i-1]) != 1 {
			return false
		}
	}
	for i, pt := range path {
		for j, other := range path {
			if absInt(i-j) <= 1 {
				continue
			}
			if manhattan(pt, other) == 1 {
				return false
			}
		}
	}
	return true
}

func pathIndex(path []Point) map[Point]int {
	index := make(map[Point]int, len(path))
	for i, pt := range path {
		index[pt] = i
	}
	return index
}

func (r Rect) contains(pt Point) bool {
	return pt.X >= r.X && pt.X < r.X+r.W && pt.Y >= r.Y && pt.Y < r.Y+r.H
}

func (p playerState) returnBandContains(pt Point) bool {
	return p.lane.contains(pt) && pt.Y >= 0 && pt.Y < startRows
}

func defaultPlayerConfig(playerCount int) []whackamole.PlayerConfig {
	playerCount = clampInt(playerCount, 1, maxPlayers)
	players := make([]whackamole.PlayerConfig, playerCount)
	for i := range players {
		fallback := defaultPlayers[i]
		players[i] = whackamole.PlayerConfig{Label: fallback.label, Color: fallback.rgb}
	}
	return players
}

func normalizePlayerConfig(players []whackamole.PlayerConfig) []playerState {
	count := clampInt(len(players), 1, maxPlayers)
	out := make([]playerState, count)
	for i := 0; i < count; i++ {
		fallback := defaultPlayers[i]
		config := whackamole.PlayerConfig{}
		if i < len(players) {
			config = players[i]
		}
		label := strings.TrimSpace(config.Label)
		if label == "" {
			label = fallback.label
		}
		color := config.Color
		if color == (RGB{}) {
			color = fallback.rgb
		}
		out[i] = playerState{label: label, color: color}
	}
	return out
}

func (g *Game) timePhase(now time.Time) float64 {
	if now.Before(g.created) {
		return 0
	}
	return now.Sub(g.created).Seconds() * 2.2
}

func manhattan(a, b Point) int {
	return absInt(a.X-b.X) + absInt(a.Y-b.Y)
}

func blendRGB(left, right RGB, ratio float64) RGB {
	ratio = clamp01(ratio)
	return RGB{
		R: clampByte(int(float64(left.R)*(1-ratio) + float64(right.R)*ratio)),
		G: clampByte(int(float64(left.G)*(1-ratio) + float64(right.G)*ratio)),
		B: clampByte(int(float64(left.B)*(1-ratio) + float64(right.B)*ratio)),
	}
}

func addRGB(left, right RGB) RGB {
	return RGB{R: clampByte(int(left.R) + int(right.R)), G: clampByte(int(left.G) + int(right.G)), B: clampByte(int(left.B) + int(right.B))}
}

func scaleRGB(color RGB, scale float64) RGB {
	return RGB{
		R: clampByte(int(math.Round(float64(color.R) * scale))),
		G: clampByte(int(math.Round(float64(color.G) * scale))),
		B: clampByte(int(math.Round(float64(color.B) * scale))),
	}
}

func clampByte(value int) byte {
	if value < 0 {
		return 0
	}
	if value > 255 {
		return 255
	}
	return byte(value)
}

func clamp01(value float64) float64 {
	if value < 0 {
		return 0
	}
	if value > 1 {
		return 1
	}
	return value
}

func clampInt(value, min, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func absInt(value int) int {
	if value < 0 {
		return -value
	}
	return value
}

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}
