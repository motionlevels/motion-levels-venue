package whackamole

import (
	"math"
	"math/rand"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
)

const (
	GridWidth  = animation.GridWidth
	GridHeight = animation.GridHeight

	setupDuration    = 3 * time.Second
	setupBlinks      = 3
	startPadSize     = 4
	startPadHold     = 1 * time.Second
	gameDuration     = 60 * time.Second
	targetSize       = 2
	targetGap        = 2
	targetBaseLife   = 3400 * time.Millisecond
	targetMinLife    = 2300 * time.Millisecond
	targetOverlap    = 1 * time.Second
	catchUpBonus     = 2 * time.Second
	hitFlashTicks    = 8
	spawnRetryDelay  = 160 * time.Millisecond
	minSpawnDistance = 5.0
	maxSpawnDistance = 15.0
	targetBaseScore  = 4
	targetSpeedBonus = 8

	DefaultMusicRef    = "Motion/canciones/Musica8.mp3"
	DefaultMusicVolume = 0.12
)

const (
	CueStart      = "start"
	CueHit        = "hit"
	CueMiss       = "miss"
	CueWin        = "win"
	CueCoin       = "coin"
	CueDoubleCoin = "double_coin"
	CueDamage     = "damage"
)

type RGB = animation.RGB

type Point struct {
	X int
	Y int
}

type PressEvent struct {
	X       int
	Y       int
	Pressed bool
}

type Event struct {
	Cue     string
	Message string
}

type PlayerSnapshot struct {
	Index int
	Label string
	Color RGB
	Score int
}

type PlayerConfig struct {
	Label string
	Color RGB
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
}

type Game struct {
	mu sync.Mutex

	players []playerState
	roster  []playerInfo
	targets []target
	hits    map[Point]int

	startPadPresses []map[Point]bool
	startPadHold    []time.Time
	startPadOrigins []Point
	setupStarted    time.Time
	setupUntil      time.Time
	started         time.Time
	endAt           time.Time
	gameOver        bool
	lastTick        time.Time
	rng             *rand.Rand
}

type playerState struct {
	score        int
	lastOrigin   Point
	hasLastSpawn bool
	nextSpawnAt  time.Time
	catchUpBonus time.Duration
}

type playerInfo struct {
	label string
	rgb   RGB
}

type target struct {
	player   int
	tint     RGB
	origin   Point
	born     time.Time
	deadline time.Time
	active   bool
}

var defaultPlayerColors = []playerInfo{
	{label: "Red", rgb: RGB{R: 255, G: 0, B: 0}},
	{label: "Cyan", rgb: RGB{R: 0, G: 255, B: 255}},
	{label: "Green", rgb: RGB{R: 0, G: 255, B: 0}},
	{label: "Pink", rgb: RGB{R: 255, G: 0, B: 255}},
	{label: "Blue", rgb: RGB{R: 0, G: 0, B: 255}},
	{label: "Yellow", rgb: RGB{R: 255, G: 255, B: 0}},
}

func New(playerCount int, now time.Time) *Game {
	return NewWithSeed(playerCount, now, now.UnixNano())
}

func NewWithSeed(playerCount int, now time.Time, seed int64) *Game {
	return NewWithSeedAndPlayers(defaultPlayerConfig(playerCount), now, seed)
}

func NewWithSeedAndPlayers(players []PlayerConfig, now time.Time, seed int64) *Game {
	roster := normalizePlayerConfig(players)
	game := &Game{
		players:         make([]playerState, len(roster)),
		roster:          roster,
		startPadPresses: make([]map[Point]bool, len(roster)),
		startPadHold:    make([]time.Time, len(roster)),
		hits:            make(map[Point]int),
		lastTick:        now,
		rng:             rand.New(rand.NewSource(seed)),
	}
	game.startPadOrigins = game.shuffledStartPadOrigins(len(roster))
	for i := range game.startPadPresses {
		game.startPadPresses[i] = map[Point]bool{}
	}
	game.initializeStartPositions(time.Time{})
	return game
}

func (g *Game) Press(event PressEvent, now time.Time) []Event {
	if !inBounds(event.X, event.Y) {
		return nil
	}
	pt := Point{X: event.X, Y: event.Y}

	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)

	if g.gameOver {
		return nil
	}
	if g.awaitingPlayers() || g.inSetup(now) {
		wasAwaiting := g.awaitingPlayers()
		g.handleStartPadPressLocked(pt, event.Pressed, now)
		if event.Pressed && wasAwaiting && !g.awaitingPlayers() {
			return []Event{{Cue: CueStart, Message: "starting"}}
		}
		return nil
	}
	if !event.Pressed {
		return nil
	}
	if g.expireGameIfNeededLocked(now) {
		return []Event{{Cue: CueWin, Message: "time up"}}
	}

	for i, target := range g.targets {
		if target.active && target.contains(pt) && now.Before(target.deadline) {
			points, player := g.hitTargetLocked(i, now)
			return []Event{{Cue: CueHit, Message: g.playerLabel(player) + " +" + strconv.Itoa(points)}}
		}
	}
	return []Event{{Cue: CueMiss, Message: "miss"}}
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

func (g *Game) Score() int {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.totalScoreLocked()
}

func (g *Game) Snapshot(now time.Time) Snapshot {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)

	players := make([]PlayerSnapshot, 0, len(g.players))
	for i, player := range g.players {
		players = append(players, PlayerSnapshot{
			Index: i,
			Label: g.playerLabel(i),
			Color: g.playerColor(i),
			Score: player.score,
		})
	}

	phase := "running"
	if g.awaitingPlayers() {
		phase = "ready"
	} else if g.inSetup(now) {
		phase = "countdown"
	} else if g.gameOver {
		phase = "finished"
	}

	startedUnix := int64(0)
	if !g.started.IsZero() {
		startedUnix = g.started.Unix()
	}
	endsUnix := int64(0)
	if !g.endAt.IsZero() {
		endsUnix = g.endAt.Unix()
	}
	elapsed := int64(0)
	if !g.started.IsZero() && now.After(g.started) {
		elapsed = now.Sub(g.started).Milliseconds()
	}
	remaining := int64(0)
	if !g.endAt.IsZero() && now.Before(g.endAt) {
		remaining = g.endAt.Sub(now).Milliseconds()
	}
	countdown := int64(0)
	if g.inSetup(now) {
		countdown = g.setupUntil.Sub(now).Milliseconds()
	}

	activeTargets := 0
	for _, target := range g.targets {
		if target.active {
			activeTargets++
		}
	}

	return Snapshot{
		Phase:           phase,
		Players:         players,
		Score:           g.totalScoreLocked(),
		StartedUnix:     startedUnix,
		EndsUnix:        endsUnix,
		ElapsedMillis:   elapsed,
		RemainingMillis: remaining,
		CountdownMillis: countdown,
		ActiveTargets:   activeTargets,
		Lives:           -1,
	}
}

func (g *Game) tickLocked(now time.Time) []Event {
	if g.lastTick.IsZero() {
		g.lastTick = now
	}
	if now.Before(g.lastTick) {
		now = g.lastTick
	}
	g.lastTick = now

	g.decayFlashesLocked()
	if g.gameOver || g.awaitingPlayers() || g.inSetup(now) {
		return nil
	}
	if g.expireGameIfNeededLocked(now) {
		return []Event{{Cue: CueWin, Message: "time up"}}
	}
	g.expireTargetsLocked(now)
	for player := range g.players {
		if !now.Before(g.players[player].nextSpawnAt) {
			g.spawnTarget(player, now)
		}
	}
	return nil
}

func (g *Game) colorAtLocked(pt Point, now time.Time) RGB {
	if g.awaitingPlayers() || g.inSetup(now) {
		return g.startPadColorLocked(pt, now)
	}
	if ticks, ok := g.hits[pt]; ok && ticks > 0 {
		value := byte(255 * ticks / hitFlashTicks)
		return RGB{R: value, G: value, B: value}
	}
	for _, target := range g.targets {
		if target.active && target.contains(pt) {
			return target.color(now)
		}
	}
	if g.gameOver {
		return pulseGameOverColor(now)
	}
	return RGB{}
}

func (g *Game) initializeStartPositions(firstSpawnAt time.Time) {
	for player := range g.players {
		g.players[player].lastOrigin = g.startReferenceOrigin(player)
		g.players[player].hasLastSpawn = true
		g.players[player].nextSpawnAt = firstSpawnAt
	}
}

func (g *Game) awaitingPlayers() bool {
	return g.setupStarted.IsZero()
}

func (g *Game) handleStartPadPressLocked(pt Point, pressed bool, now time.Time) {
	for player := range g.players {
		if !g.startPadContains(player, pt) {
			continue
		}
		if pressed {
			g.startPadPresses[player][pt] = true
			g.startPadHold[player] = time.Time{}
		} else {
			delete(g.startPadPresses[player], pt)
			if len(g.startPadPresses[player]) == 0 {
				g.startPadHold[player] = now.Add(startPadHold)
			}
		}
	}
	if g.awaitingPlayers() && g.allStartPadsOccupiedLocked(now) {
		g.beginSetupCountdown(now)
	}
}

func (g *Game) beginSetupCountdown(now time.Time) {
	g.setupStarted = now
	g.setupUntil = now.Add(setupDuration)
	g.started = g.setupUntil
	g.endAt = g.started.Add(gameDuration)
	g.initializeStartPositions(g.setupUntil)
}

func (g *Game) allStartPadsOccupiedLocked(now time.Time) bool {
	if len(g.players) == 0 {
		return false
	}
	for player := range g.players {
		if !g.startPadOccupiedLocked(player, now) {
			return false
		}
	}
	return true
}

func (g *Game) startPadOccupiedLocked(player int, now time.Time) bool {
	return len(g.startPadPresses[player]) > 0 || now.Before(g.startPadHold[player])
}

func (g *Game) inSetup(now time.Time) bool {
	return !g.setupUntil.IsZero() && now.Before(g.setupUntil)
}

func (g *Game) startPadColorLocked(pt Point, now time.Time) RGB {
	blinkVisible := g.awaitingPlayers() || setupBlinkVisible(g.setupStarted, now)
	for player := range g.players {
		if g.startPadContains(player, pt) {
			color := g.playerColor(player)
			if g.startPadOccupiedLocked(player, now) {
				return saturatedRGB(color)
			}
			if !blinkVisible {
				return RGB{}
			}
			if g.awaitingPlayers() {
				return scaleRGB(color, 0.30)
			}
			return color
		}
	}
	return RGB{}
}

func (g *Game) shuffledStartPadOrigins(playerCount int) []Point {
	slots := startPadCornerOrigins()
	playerCount = clampInt(playerCount, 0, len(slots))
	if playerCount == 2 {
		diagonals := [][]Point{
			{slots[0], slots[1]},
			{slots[2], slots[3]},
		}
		origins := append([]Point(nil), diagonals[g.randIntn(len(diagonals))]...)
		if g.randIntn(2) == 1 {
			origins[0], origins[1] = origins[1], origins[0]
		}
		return origins
	}
	order := g.randPerm(len(slots))
	origins := make([]Point, playerCount)
	for i := range origins {
		origins[i] = slots[order[i]]
	}
	return origins
}

func startPadCornerOrigins() []Point {
	return []Point{
		{X: 0, Y: 0},
		{X: GridWidth - startPadSize, Y: GridHeight - startPadSize},
		{X: 0, Y: GridHeight - startPadSize},
		{X: GridWidth - startPadSize, Y: 0},
		{X: 0, Y: (GridHeight - startPadSize) / 2},
		{X: GridWidth - startPadSize, Y: (GridHeight - startPadSize) / 2},
	}
}

func startPadOrigin(player int) Point {
	slots := startPadCornerOrigins()
	if player >= 0 && player < len(slots) {
		return slots[player]
	}
	return slots[len(slots)-1]
}

func (g *Game) startPadOrigin(player int) Point {
	if player >= 0 && player < len(g.startPadOrigins) {
		return g.startPadOrigins[player]
	}
	return startPadOrigin(player)
}

func (g *Game) startReferenceOrigin(player int) Point {
	return g.startPadOrigin(player)
}

func (g *Game) startPadContains(player int, pt Point) bool {
	origin := g.startPadOrigin(player)
	return pt.X >= origin.X && pt.X < origin.X+startPadSize && pt.Y >= origin.Y && pt.Y < origin.Y+startPadSize
}

func setupBlinkVisible(started, now time.Time) bool {
	if started.IsZero() || now.Before(started) {
		return true
	}
	elapsed := now.Sub(started)
	if elapsed >= setupDuration {
		return false
	}
	halfCycle := setupDuration / time.Duration(setupBlinks*2)
	if halfCycle <= 0 {
		return true
	}
	return int(elapsed/halfCycle)%2 == 0
}

func (g *Game) hitTargetLocked(index int, now time.Time) (points int, player int) {
	target := g.targets[index]
	player = target.player
	points = target.score(now)
	g.players[player].score += points
	for _, tile := range target.tiles() {
		g.hits[tile] = hitFlashTicks
	}
	g.targets = append(g.targets[:index], g.targets[index+1:]...)
	g.spawnTarget(player, now)
	return points, player
}

func (g *Game) expireGameIfNeededLocked(now time.Time) bool {
	if g.endAt.IsZero() || now.Before(g.endAt) {
		return false
	}
	g.gameOver = true
	g.targets = nil
	return true
}

func (g *Game) expireTargetsLocked(now time.Time) {
	alive := g.targets[:0]
	for _, target := range g.targets {
		if now.Before(target.deadline) {
			alive = append(alive, target)
			continue
		}
		if target.active && target.player >= 0 && target.player < len(g.players) {
			g.players[target.player].catchUpBonus = catchUpBonus
		}
	}
	g.targets = alive
}

func (g *Game) decayFlashesLocked() {
	for pt, ticks := range g.hits {
		if ticks <= 1 {
			delete(g.hits, pt)
		} else {
			g.hits[pt] = ticks - 1
		}
	}
}

func (g *Game) spawnTarget(player int, now time.Time) {
	if player < 0 || player >= len(g.players) {
		return
	}
	state := &g.players[player]
	origin, ok := g.pickTargetOrigin(player)
	if !ok {
		state.nextSpawnAt = now.Add(spawnRetryDelay)
		return
	}
	interval := targetInterval(now.Sub(g.started))
	life := interval + targetOverlap + state.catchUpBonus
	state.catchUpBonus = 0
	state.nextSpawnAt = now.Add(interval)
	state.lastOrigin = origin
	state.hasLastSpawn = true
	g.targets = append(g.targets, target{
		player:   player,
		tint:     g.playerColor(player),
		origin:   origin,
		born:     now,
		deadline: now.Add(life),
		active:   true,
	})
}

func (g *Game) pickTargetOrigin(player int) (Point, bool) {
	occupied := g.occupiedTiles()
	candidates := make([]Point, 0, 64)
	fallback := make([]Point, 0, 64)
	for y := 0; y <= GridHeight-targetSize; y++ {
		for x := 0; x <= GridWidth-targetSize; x++ {
			origin := Point{X: x, Y: y}
			if targetTooClose(origin, occupied) {
				continue
			}
			fallback = append(fallback, origin)
			if player >= 0 && player < len(g.players) && g.players[player].hasLastSpawn {
				d := targetDistance(origin, g.players[player].lastOrigin)
				if d < minSpawnDistance || d > maxSpawnDistance {
					continue
				}
			}
			candidates = append(candidates, origin)
		}
	}
	if len(candidates) > 0 {
		return candidates[g.randIntn(len(candidates))], true
	}
	if len(fallback) > 0 {
		return fallback[g.randIntn(len(fallback))], true
	}
	return Point{}, false
}

func (g *Game) randIntn(n int) int {
	if g.rng == nil {
		g.rng = rand.New(rand.NewSource(1))
	}
	return g.rng.Intn(n)
}

func (g *Game) randPerm(n int) []int {
	if g.rng == nil {
		g.rng = rand.New(rand.NewSource(1))
	}
	return g.rng.Perm(n)
}

func (g *Game) occupiedTiles() map[Point]bool {
	occupied := make(map[Point]bool)
	for _, target := range g.targets {
		if !target.active {
			continue
		}
		for _, pt := range target.tiles() {
			occupied[pt] = true
		}
	}
	return occupied
}

func (g *Game) totalScoreLocked() int {
	total := 0
	for _, player := range g.players {
		total += player.score
	}
	return total
}

func targetTooClose(origin Point, occupied map[Point]bool) bool {
	for dy := -targetGap; dy < targetSize+targetGap; dy++ {
		for dx := -targetGap; dx < targetSize+targetGap; dx++ {
			if occupied[Point{X: origin.X + dx, Y: origin.Y + dy}] {
				return true
			}
		}
	}
	return false
}

func targetDistance(a, b Point) float64 {
	ax := float64(a.X) + 0.5
	ay := float64(a.Y) + 0.5
	bx := float64(b.X) + 0.5
	by := float64(b.Y) + 0.5
	return math.Hypot(ax-bx, ay-by)
}

func targetInterval(elapsed time.Duration) time.Duration {
	progress := clamp01(float64(elapsed) / float64(gameDuration))
	life := float64(targetBaseLife-targetOverlap) - progress*float64(targetBaseLife-targetMinLife)
	return time.Duration(life)
}

func (t target) contains(pt Point) bool {
	return pt.X >= t.origin.X && pt.X < t.origin.X+targetSize && pt.Y >= t.origin.Y && pt.Y < t.origin.Y+targetSize
}

func (t target) tiles() []Point {
	tiles := make([]Point, 0, targetSize*targetSize)
	for dy := 0; dy < targetSize; dy++ {
		for dx := 0; dx < targetSize; dx++ {
			tiles = append(tiles, Point{X: t.origin.X + dx, Y: t.origin.Y + dy})
		}
	}
	return tiles
}

func (t target) ratio(now time.Time) float64 {
	total := t.deadline.Sub(t.born)
	if total <= 0 {
		return 0
	}
	return clamp01(float64(t.deadline.Sub(now)) / float64(total))
}

func (t target) score(now time.Time) int {
	return targetBaseScore + int(math.Ceil(t.ratio(now)*targetSpeedBonus))
}

func (t target) color(now time.Time) RGB {
	ratio := t.ratio(now)
	if ratio <= 0 {
		return RGB{}
	}
	base := t.tint
	brightness := math.Pow(ratio, 1.35)
	if remaining := t.deadline.Sub(now); remaining < time.Second {
		brightness *= clamp01(float64(remaining) / float64(time.Second))
	}
	return RGB{
		R: byte(float64(base.R)*brightness + 0.5),
		G: byte(float64(base.G)*brightness + 0.5),
		B: byte(float64(base.B)*brightness + 0.5),
	}
}

func pulseGameOverColor(now time.Time) RGB {
	value := byte(20 + 35*(0.5+0.5*math.Sin(float64(now.UnixNano())/float64(time.Second)*math.Pi*2)))
	return RGB{R: value, G: value, B: value}
}

func saturatedRGB(color RGB) RGB {
	return addRGB(color, scaleRGB(color, 0.35))
}

func addRGB(left, right RGB) RGB {
	return RGB{
		R: clampByte(int(left.R) + int(right.R)),
		G: clampByte(int(left.G) + int(right.G)),
		B: clampByte(int(left.B) + int(right.B)),
	}
}

func scaleRGB(color RGB, scale float64) RGB {
	return RGB{
		R: clampByte(int(math.Round(float64(color.R) * scale))),
		G: clampByte(int(math.Round(float64(color.G) * scale))),
		B: clampByte(int(math.Round(float64(color.B) * scale))),
	}
}

func defaultPlayerConfig(playerCount int) []PlayerConfig {
	playerCount = clampInt(playerCount, 1, len(defaultPlayerColors))
	players := make([]PlayerConfig, playerCount)
	for i := range players {
		players[i] = PlayerConfig{
			Label: defaultPlayerColors[i].label,
			Color: defaultPlayerColors[i].rgb,
		}
	}
	return players
}

func normalizePlayerConfig(players []PlayerConfig) []playerInfo {
	count := clampInt(len(players), 1, len(defaultPlayerColors))
	normalized := make([]playerInfo, count)
	for i := 0; i < count; i++ {
		fallback := defaultPlayerColors[i]
		config := PlayerConfig{}
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
		normalized[i] = playerInfo{label: label, rgb: color}
	}
	return normalized
}

func (g *Game) playerLabel(player int) string {
	if player >= 0 && player < len(g.roster) && strings.TrimSpace(g.roster[player].label) != "" {
		return g.roster[player].label
	}
	return "Player " + strconv.Itoa(player+1)
}

func (g *Game) playerColor(player int) RGB {
	if player >= 0 && player < len(g.roster) && g.roster[player].rgb != (RGB{}) {
		return g.roster[player].rgb
	}
	if player >= 0 && player < len(defaultPlayerColors) {
		return defaultPlayerColors[player].rgb
	}
	return RGB{}
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

func clampInt(value, min, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
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

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}
