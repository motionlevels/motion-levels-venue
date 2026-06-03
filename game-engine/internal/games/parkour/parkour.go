package parkour

import (
	"math"
	"math/rand"
	"strconv"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

const (
	GridWidth  = animation.GridWidth
	GridHeight = animation.GridHeight

	platformRadius     = 1
	countdownDuration  = 3 * time.Second
	DefaultMusicRef    = "Motion/canciones/Background07.mp3"
	DefaultMusicVolume = 0.18
)

type RGB = animation.RGB

type Point struct {
	X int
	Y int
}

type LevelInfo struct {
	ID          string
	Label       string
	Description string
	Gap         int
	Duration    time.Duration
	StepDelay   time.Duration
	LeadSteps   int
}

type PlayerSnapshot struct {
	Index int
	Label string
	Color RGB
	Score int
}

type Snapshot struct {
	Phase           string
	Level           string
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

	level LevelInfo
	rng   *rand.Rand

	current Point
	target  Point
	origin  Point
	score   int

	createdAt       time.Time
	startedAt       time.Time
	endAt           time.Time
	targetStartedAt time.Time
	targetReadyAt   time.Time

	failed      bool
	ended       bool
	failPoint   Point
	failStarted time.Time
	pulseUntil  time.Time
}

var levels = []LevelInfo{
	{
		ID:          "starter",
		Label:       "Nivel 1",
		Description: "Saltos cercanos y objetivo más lento para aprender la dinámica.",
		Gap:         3,
		Duration:    60 * time.Second,
		StepDelay:   650 * time.Millisecond,
		LeadSteps:   4,
	},
	{
		ID:          "classic",
		Label:       "Nivel 2",
		Description: "Distancia clásica del juego original, con ritmo constante.",
		Gap:         4,
		Duration:    60 * time.Second,
		StepDelay:   500 * time.Millisecond,
		LeadSteps:   6,
	},
	{
		ID:          "expert",
		Label:       "Nivel 3",
		Description: "Saltos más largos y objetivo más rápido para jugadores seguros.",
		Gap:         5,
		Duration:    60 * time.Second,
		StepDelay:   380 * time.Millisecond,
		LeadSteps:   7,
	},
}

func Levels() []LevelInfo {
	out := make([]LevelInfo, len(levels))
	copy(out, levels)
	return out
}

func NormalizeLevel(value string) string {
	if value == "" {
		return levels[0].ID
	}
	for _, level := range levels {
		if value == level.ID {
			return value
		}
	}
	switch value {
	case "1", "easy", "facil":
		return "starter"
	case "2", "medium", "medio", "classic":
		return "classic"
	case "3", "hard", "expert", "experto":
		return "expert"
	default:
		return levels[0].ID
	}
}

func New(now time.Time, level string) *Game {
	return NewWithSeed(now, 0, level)
}

func NewWithSeed(now time.Time, seed int64, level string) *Game {
	if seed == 0 {
		seed = now.UnixNano()
	}
	settings := settingsForLevel(level)
	rng := rand.New(rand.NewSource(seed))
	game := &Game{
		level:     settings,
		rng:       rng,
		current:   Point{X: GridWidth / 2, Y: 3},
		createdAt: now,
		startedAt: now.Add(countdownDuration),
		endAt:     now.Add(countdownDuration).Add(settings.Duration),
	}
	game.target = game.nextTarget(game.current, Point{X: -1, Y: -1})
	game.origin = game.targetOrigin(game.current, game.target)
	game.targetStartedAt = game.startedAt
	game.targetReadyAt = game.targetStartedAt.Add(game.targetTravelDuration(game.origin, game.target))
	return game
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if !event.Pressed || !inBounds(event.X, event.Y) {
		return nil
	}

	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)
	if g.failed || g.ended || now.Before(g.startedAt) {
		return nil
	}

	pt := Point{X: event.X, Y: event.Y}
	target := g.visualTargetLocked(now)
	switch {
	case inPlatform(pt, target):
		previous := g.current
		g.current = target
		g.target = g.nextTarget(g.current, previous)
		g.origin = g.targetOrigin(g.current, g.target)
		g.targetStartedAt = now
		g.targetReadyAt = now.Add(g.targetTravelDuration(g.origin, g.target))
		g.score++
		g.pulseUntil = now.Add(260 * time.Millisecond)
		return []whackamole.Event{{Cue: whackamole.CueHit, Message: "Salto " + strconv.Itoa(g.score)}}
	case inPlatform(pt, g.current):
		return nil
	default:
		g.failed = true
		g.ended = true
		g.failPoint = pt
		g.failStarted = now
		return []whackamole.Event{{Cue: whackamole.CueMiss, Message: "Has pisado lava"}}
	}
}

func (g *Game) Render(now time.Time) []RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)

	frame := make([]RGB, GridWidth*GridHeight)
	seconds := now.Sub(g.createdAt).Seconds()
	target := g.visualTargetLocked(now)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			color := lavaColor(x, y, seconds)
			if now.Before(g.startedAt) {
				color = scaleRGB(color, countdownFade(now, g.createdAt, g.startedAt))
			}
			if inPlatform(pt, g.current) {
				color = currentPlatformColor(pt, g.current, seconds)
			} else if !now.Before(g.startedAt) && inPlatform(pt, target) {
				color = targetPlatformColor(pt, target, seconds, now.Before(g.pulseUntil))
			}
			if g.failed {
				color = failColor(pt, g.failPoint, seconds, now.Sub(g.failStarted))
			} else if g.ended {
				color = endedColor(pt, g.current, seconds)
			}
			frame[y*GridWidth+x] = color
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
	} else if g.ended {
		phase = "finished"
	}
	elapsed := int64(0)
	if now.After(g.startedAt) {
		elapsed = now.Sub(g.startedAt).Milliseconds()
	}
	remaining := int64(0)
	if now.Before(g.endAt) && !g.failed {
		remaining = g.endAt.Sub(now).Milliseconds()
	}
	countdown := int64(0)
	if now.Before(g.startedAt) {
		countdown = g.startedAt.Sub(now).Milliseconds()
	}
	lives := 1
	if g.failed {
		lives = 0
	}
	return Snapshot{
		Phase:           phase,
		Level:           g.level.ID,
		Players:         []PlayerSnapshot{{Index: 0, Label: "Jugador 1", Color: RGB{R: 0, G: 65, B: 255}, Score: g.score}},
		Score:           g.score,
		StartedUnix:     g.startedAt.Unix(),
		EndsUnix:        g.endAt.Unix(),
		ElapsedMillis:   elapsed,
		RemainingMillis: remaining,
		CountdownMillis: countdown,
		ActiveTargets:   1,
		Lives:           lives,
	}
}

func (g *Game) Current() Point {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.current
}

func (g *Game) Target(now time.Time) Point {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.visualTargetLocked(now)
}

func (g *Game) tickLocked(now time.Time) {
	if !g.ended && !now.Before(g.endAt) {
		g.ended = true
	}
}

func (g *Game) visualTargetLocked(now time.Time) Point {
	if now.Before(g.targetStartedAt) {
		return g.origin
	}
	if !now.Before(g.targetReadyAt) {
		return g.target
	}
	steps := int(now.Sub(g.targetStartedAt) / g.level.StepDelay)
	return pointAfterSteps(g.origin, g.target, steps)
}

func (g *Game) nextTarget(from, avoid Point) Point {
	candidates := make([]Point, 0, GridWidth*GridHeight)
	for y := platformRadius; y < GridHeight-platformRadius; y++ {
		for x := platformRadius; x < GridWidth-platformRadius; x++ {
			p := Point{X: x, Y: y}
			if inPlatform(p, from) || inPlatform(p, avoid) {
				continue
			}
			if platformGapTiles(from, p) == g.level.Gap {
				candidates = append(candidates, p)
			}
		}
	}
	if len(candidates) == 0 {
		return from
	}
	return candidates[g.rng.Intn(len(candidates))]
}

func (g *Game) targetOrigin(from, target Point) Point {
	stepX := signInt(target.X - from.X)
	stepY := signInt(target.Y - from.Y)
	if stepX == 0 && stepY == 0 {
		stepY = 1
	}
	origin := target
	for i := 0; i < g.level.LeadSteps; i++ {
		next := Point{
			X: clampInt(origin.X+stepX, platformRadius, GridWidth-1-platformRadius),
			Y: clampInt(origin.Y+stepY, platformRadius, GridHeight-1-platformRadius),
		}
		if next == origin {
			next = Point{X: clampInt(origin.X+stepX, platformRadius, GridWidth-1-platformRadius), Y: origin.Y}
		}
		if next == origin {
			next = Point{X: origin.X, Y: clampInt(origin.Y+stepY, platformRadius, GridHeight-1-platformRadius)}
		}
		if next == origin {
			break
		}
		origin = next
	}
	return origin
}

func (g *Game) targetTravelDuration(from, to Point) time.Duration {
	steps := maxInt(absInt(to.X-from.X), absInt(to.Y-from.Y))
	if steps == 0 {
		return g.level.StepDelay
	}
	return time.Duration(steps) * g.level.StepDelay
}

func settingsForLevel(value string) LevelInfo {
	normalized := NormalizeLevel(value)
	for _, level := range levels {
		if level.ID == normalized {
			return level
		}
	}
	return levels[0]
}

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}

func inPlatform(pt, center Point) bool {
	return absInt(pt.X-center.X) <= platformRadius && absInt(pt.Y-center.Y) <= platformRadius
}

func platformGapTiles(a, b Point) int {
	dx := absInt(a.X-b.X) - platformRadius*2 - 1
	dy := absInt(a.Y-b.Y) - platformRadius*2 - 1
	if dx < 0 {
		dx = 0
	}
	if dy < 0 {
		dy = 0
	}
	return maxInt(dx, dy)
}

func pointAfterSteps(from, to Point, steps int) Point {
	pt := from
	for i := 0; i < steps && pt != to; i++ {
		pt.X += signInt(to.X - pt.X)
		pt.Y += signInt(to.Y - pt.Y)
	}
	return pt
}

func countdownFade(now, createdAt, startedAt time.Time) float64 {
	total := startedAt.Sub(createdAt)
	if total <= 0 {
		return 0.34
	}
	progress := 1 - float64(startedAt.Sub(now))/float64(total)
	if progress < 0 {
		progress = 0
	}
	if progress > 1 {
		progress = 1
	}
	return 0.12 + progress*0.22
}

func lavaColor(x, y int, seconds float64) RGB {
	f1 := (math.Sin(float64(x)*0.75+float64(y)*0.22+seconds*1.9) + 1) / 2
	f2 := (math.Sin(float64(y)*0.55-seconds*2.7) + 1) / 2
	return RGB{R: byte(115 + 85*f1), G: byte(4 + 40*f2), B: 0}
}

func currentPlatformColor(pt, center Point, seconds float64) RGB {
	if pt == center {
		pulse := (math.Sin(seconds*3.2) + 1) / 2
		return RGB{R: byte(170 + 85*pulse), G: byte(235 + 20*pulse), B: 255}
	}
	edge := byte(120 + 45*((math.Sin(seconds+float64(pt.X+pt.Y))+1)/2))
	return RGB{R: 0, G: edge, B: 255}
}

func targetPlatformColor(pt, center Point, seconds float64, pulseActive bool) RGB {
	if pulseActive {
		return RGB{R: 205, G: 255, B: 205}
	}
	if pt == center {
		pulse := (math.Sin(seconds*4.0) + 1) / 2
		return RGB{R: byte(210 + 45*pulse), G: 255, B: 40}
	}
	return RGB{R: 30, G: 210, B: 45}
}

func failColor(pt, fail Point, seconds float64, elapsed time.Duration) RGB {
	base := lavaColor(pt.X, pt.Y, seconds)
	dist := absInt(pt.X-fail.X) + absInt(pt.Y-fail.Y)
	ring := int(elapsed / (130 * time.Millisecond))
	if dist == ring || dist == ring+1 {
		return RGB{R: 255, G: 255, B: 255}
	}
	if dist <= 2 {
		return RGB{R: 255, G: 35, B: 35}
	}
	return base
}

func endedColor(pt, current Point, seconds float64) RGB {
	base := lavaColor(pt.X, pt.Y, seconds)
	if inPlatform(pt, current) {
		return RGB{R: 30, G: 90, B: 140}
	}
	return RGB{R: byte(float64(base.R) * 0.18), G: byte(float64(base.G) * 0.18), B: 0}
}

func scaleRGB(color RGB, factor float64) RGB {
	if factor < 0 {
		factor = 0
	}
	if factor > 1 {
		factor = 1
	}
	return RGB{
		R: byte(float64(color.R) * factor),
		G: byte(float64(color.G) * factor),
		B: byte(float64(color.B) * factor),
	}
}

func clampInt(v, lo, hi int) int {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}

func signInt(v int) int {
	switch {
	case v < 0:
		return -1
	case v > 0:
		return 1
	default:
		return 0
	}
}

func absInt(v int) int {
	if v < 0 {
		return -v
	}
	return v
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}
