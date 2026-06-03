package lava

import (
	"math"
	"strconv"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

const (
	GridWidth  = animation.GridWidth
	GridHeight = animation.GridHeight

	countdownDuration  = 3 * time.Second
	globalImmunity     = time.Second
	damageFlash        = 420 * time.Millisecond
	DefaultMusicRef    = "Motion/canciones/Background07.mp3"
	DefaultMusicVolume = 0.20
)

type RGB = animation.RGB

type Difficulty string

const (
	DifficultyEasy   Difficulty = "easy"
	DifficultyMedium Difficulty = "medium"
	DifficultyHard   Difficulty = "hard"
	DifficultyExpert Difficulty = "expert"
)

type Point struct {
	X int
	Y int
}

type PlayerSnapshot struct {
	Index int
	Label string
	Color RGB
	Score int
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
	ImmuneMillis    int64
	Difficulty      string
}

type Game struct {
	mu sync.Mutex

	playerCount      int
	difficulty       Difficulty
	lives            int
	score            int
	speed            float64
	started          time.Time
	gameOver         bool
	lastTick         time.Time
	immuneUntil      time.Time
	damageFlashUntil time.Time
	claimedPlatforms []claimedPlatform
}

type claimedPlatform struct {
	phaseA float64
	phaseB float64
}

var playerColors = []struct {
	label string
	rgb   RGB
}{
	{label: "Blue", rgb: RGB{R: 0, G: 65, B: 255}},
	{label: "Green", rgb: RGB{R: 0, G: 255, B: 60}},
	{label: "Pink", rgb: RGB{R: 255, G: 0, B: 212}},
	{label: "Yellow", rgb: RGB{R: 255, G: 212, B: 0}},
	{label: "Orange", rgb: RGB{R: 255, G: 90, B: 0}},
	{label: "Cyan", rgb: RGB{R: 0, G: 229, B: 255}},
}

func New(playerCount int, now time.Time, difficulty string) *Game {
	return NewWithSeed(playerCount, now, 0, difficulty)
}

func NewWithSeed(playerCount int, now time.Time, _ int64, difficulty string) *Game {
	playerCount = clampInt(playerCount, 1, len(playerColors))
	settings := settingsForDifficulty(difficulty)
	return &Game{
		playerCount: playerCount,
		difficulty:  settings.difficulty,
		lives:       settings.lives,
		speed:       settings.speed,
		started:     now.Add(countdownDuration),
		lastTick:    now,
	}
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if !event.Pressed || !inBounds(event.X, event.Y) {
		return nil
	}

	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)
	if g.gameOver {
		return nil
	}
	if g.inCountdown(now) {
		return nil
	}
	if now.Before(g.immuneUntil) {
		return nil
	}

	pt := Point{X: event.X, Y: event.Y}
	if lavaAt(pt, g.patternSeconds(now)) {
		g.lives--
		g.immuneUntil = now.Add(globalImmunity)
		g.damageFlashUntil = now.Add(damageFlash)
		if g.lives <= 0 {
			g.lives = 0
			g.gameOver = true
			return []whackamole.Event{{Cue: whackamole.CueMiss, Message: "Sin vidas"}}
		}
		return []whackamole.Event{{Cue: whackamole.CueMiss, Message: "Vida perdida · " + strconv.Itoa(g.lives)}}
	}

	claimed := g.claimedMask(g.patternSeconds(now))
	if claimed[pointIndex(pt)] {
		return nil
	}

	g.claimedPlatforms = append(g.claimedPlatforms, newClaimedPlatform(pt, g.patternSeconds(now)))
	g.score = len(g.claimedPlatforms)
	return []whackamole.Event{{Cue: whackamole.CueHit, Message: "Plataforma nueva · " + strconv.Itoa(g.score)}}
}

func (g *Game) Render(now time.Time) []RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)

	frame := make([]RGB, GridWidth*GridHeight)
	seconds := g.patternSeconds(now)
	claimed := g.claimedMask(seconds)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			color := colorAt(pt, seconds)
			if claimed[pointIndex(pt)] && !g.inCountdown(now) && !g.gameOver {
				color = claimedColor(color, now)
			}
			if g.inCountdown(now) {
				color = scaleRGB(color, 0.34)
			}
			if !g.immuneUntil.IsZero() && now.Before(g.immuneUntil) {
				color = immuneColor(color, now)
			}
			if !g.damageFlashUntil.IsZero() && now.Before(g.damageFlashUntil) {
				color = damageColor(color, now, g.damageFlashUntil.Sub(now))
			}
			if g.gameOver {
				color = gameOverColor(now)
			}
			frame[y*GridWidth+x] = color
		}
	}
	return frame
}

func (g *Game) Score() int {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.score
}

func (g *Game) Snapshot(now time.Time) Snapshot {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)

	players := make([]PlayerSnapshot, 0, g.playerCount)
	for i := 0; i < g.playerCount; i++ {
		color := playerColors[i%len(playerColors)]
		players = append(players, PlayerSnapshot{
			Index: i,
			Label: color.label,
			Color: color.rgb,
			Score: g.score,
		})
	}

	phase := "running"
	if g.inCountdown(now) {
		phase = "countdown"
	} else if g.gameOver {
		phase = "finished"
	}
	elapsed := int64(0)
	if now.After(g.started) {
		elapsed = now.Sub(g.started).Milliseconds()
	}
	countdown := int64(0)
	if g.inCountdown(now) {
		countdown = g.started.Sub(now).Milliseconds()
	}
	immune := int64(0)
	if now.Before(g.immuneUntil) {
		immune = g.immuneUntil.Sub(now).Milliseconds()
	}

	return Snapshot{
		Phase:           phase,
		Players:         players,
		Score:           g.score,
		StartedUnix:     g.started.Unix(),
		EndsUnix:        0,
		ElapsedMillis:   elapsed,
		RemainingMillis: 0,
		CountdownMillis: countdown,
		ActiveTargets:   lavaTileCount(g.patternSeconds(now)),
		Lives:           g.lives,
		ImmuneMillis:    immune,
		Difficulty:      string(g.difficulty),
	}
}

func (g *Game) tickLocked(now time.Time) {
	if g.lastTick.IsZero() {
		g.lastTick = now
	}
	if now.Before(g.lastTick) {
		now = g.lastTick
	}
	g.lastTick = now
}

func (g *Game) patternSeconds(now time.Time) float64 {
	if g.started.IsZero() {
		return 0
	}
	return math.Max(0, now.Sub(g.started).Seconds()) * g.speed
}

func (g *Game) inCountdown(now time.Time) bool {
	return !g.started.IsZero() && now.Before(g.started)
}

type difficultySettings struct {
	difficulty Difficulty
	lives      int
	speed      float64
}

func settingsForDifficulty(value string) difficultySettings {
	switch Difficulty(value) {
	case DifficultyExpert:
		return difficultySettings{difficulty: DifficultyExpert, lives: 2, speed: 1.55}
	case DifficultyHard:
		return difficultySettings{difficulty: DifficultyHard, lives: 3, speed: 1.28}
	case DifficultyMedium:
		return difficultySettings{difficulty: DifficultyMedium, lives: 4, speed: 1.0}
	default:
		return difficultySettings{difficulty: DifficultyEasy, lives: 5, speed: 0.72}
	}
}

func lavaAt(pt Point, seconds float64) bool {
	return heatField(pt, seconds) >= 0.34
}

func newClaimedPlatform(pt Point, seconds float64) claimedPlatform {
	phaseA, phaseB := platformPhase(pt, seconds)
	return claimedPlatform{
		phaseA: phaseA,
		phaseB: phaseB,
	}
}

func (g *Game) claimedMask(seconds float64) []bool {
	mask := make([]bool, GridWidth*GridHeight)
	for index := range g.claimedPlatforms {
		seed, ok := g.claimedPlatforms[index].currentSeed(seconds)
		if !ok {
			continue
		}
		safeSeed, ok := nearestSafeTile(seed, seconds)
		if !ok {
			continue
		}
		markSafeComponent(mask, safeSeed, seconds)
	}
	return mask
}

func (platform claimedPlatform) currentSeed(seconds float64) (Point, bool) {
	x, y := solvePlatformPosition(platform.phaseA, platform.phaseB, seconds)
	if x < -6 || x > float64(GridWidth+5) || y < -6 || y > float64(GridHeight+5) {
		return Point{}, false
	}
	return Point{X: int(math.Round(x)), Y: int(math.Round(y))}, true
}

func platformPhase(pt Point, seconds float64) (float64, float64) {
	nx := float64(pt.X) / float64(GridWidth)
	ny := float64(pt.Y) / float64(GridHeight)
	return 3.0*nx + 1.6*ny + seconds*0.7, 2.2*nx - 3.2*ny - seconds*0.5
}

func solvePlatformPosition(phaseA, phaseB, seconds float64) (float64, float64) {
	rhsA := phaseA - seconds*0.7
	rhsB := phaseB + seconds*0.5
	const determinant = -13.12
	nx := (rhsA*(-3.2) - 1.6*rhsB) / determinant
	ny := (3.0*rhsB - 2.2*rhsA) / determinant
	return nx * float64(GridWidth), ny * float64(GridHeight)
}

func nearestSafeTile(seed Point, seconds float64) (Point, bool) {
	if inBounds(seed.X, seed.Y) && !lavaAt(seed, seconds) {
		return seed, true
	}
	best := Point{}
	bestDistance := math.MaxFloat64
	found := false
	for radius := 1; radius <= 6; radius++ {
		for y := seed.Y - radius; y <= seed.Y+radius; y++ {
			for x := seed.X - radius; x <= seed.X+radius; x++ {
				if !inBounds(x, y) {
					continue
				}
				pt := Point{X: x, Y: y}
				if lavaAt(pt, seconds) {
					continue
				}
				distance := math.Hypot(float64(x-seed.X), float64(y-seed.Y))
				if distance < bestDistance {
					best = pt
					bestDistance = distance
					found = true
				}
			}
		}
		if found {
			return best, true
		}
	}
	return Point{}, false
}

func markSafeComponent(mask []bool, seed Point, seconds float64) {
	if !inBounds(seed.X, seed.Y) || lavaAt(seed, seconds) {
		return
	}
	queue := []Point{seed}
	seen := make([]bool, GridWidth*GridHeight)
	seen[pointIndex(seed)] = true
	for len(queue) > 0 {
		pt := queue[0]
		queue = queue[1:]
		mask[pointIndex(pt)] = true
		for _, next := range neighbors(pt) {
			index := pointIndex(next)
			if seen[index] || lavaAt(next, seconds) {
				continue
			}
			seen[index] = true
			queue = append(queue, next)
		}
	}
}

func neighbors(pt Point) []Point {
	out := make([]Point, 0, 4)
	candidates := []Point{
		{X: pt.X + 1, Y: pt.Y},
		{X: pt.X - 1, Y: pt.Y},
		{X: pt.X, Y: pt.Y + 1},
		{X: pt.X, Y: pt.Y - 1},
	}
	for _, candidate := range candidates {
		if inBounds(candidate.X, candidate.Y) {
			out = append(out, candidate)
		}
	}
	return out
}

func colorAt(pt Point, seconds float64) RGB {
	field := heatField(pt, seconds)
	if field < 0.34 {
		return RGB{R: 4, G: 9, B: 18}
	}
	heat := clamp01((field - 0.34) / 0.66)
	flicker := 0.82 + 0.18*math.Sin((float64(pt.X)*1.3+float64(pt.Y)*0.7+seconds*6)*math.Pi)
	return RGB{
		R: clampByte(math.Round(255 * flicker)),
		G: clampByte(math.Round((45 + 150*heat) * flicker)),
		B: clampByte(math.Round(8 * heat * flicker)),
	}
}

func heatField(pt Point, seconds float64) float64 {
	nx := float64(pt.X) / float64(GridWidth)
	ny := float64(pt.Y) / float64(GridHeight)
	return 0.5 + 0.5*math.Sin((nx*3.0+ny*1.6+seconds*0.7)*math.Pi)*math.Cos((nx*2.2-ny*3.2-seconds*0.5)*math.Pi)
}

func immuneColor(color RGB, now time.Time) RGB {
	pulse := 0.42 + 0.18*math.Sin(float64(now.UnixNano())/float64(time.Second)*math.Pi*8)
	return addRGB(scaleRGB(color, 0.62), RGB{R: 0, G: clampByte(math.Round(80 * pulse)), B: clampByte(math.Round(190 * pulse))})
}

func damageColor(color RGB, now time.Time, remaining time.Duration) RGB {
	amount := clamp01(float64(remaining) / float64(damageFlash))
	strobe := 0.5 + 0.5*math.Sin(float64(now.UnixNano())/float64(time.Second)*math.Pi*18)
	return addRGB(scaleRGB(color, 0.38), RGB{
		R: clampByte(math.Round(255 * amount)),
		G: clampByte(math.Round(32 * amount * strobe)),
		B: clampByte(math.Round(32 * amount * strobe)),
	})
}

func claimedColor(color RGB, now time.Time) RGB {
	pulse := 0.72 + 0.28*math.Sin(float64(now.UnixNano())/float64(time.Second)*math.Pi*3)
	return addRGB(scaleRGB(color, 0.22), RGB{
		R: clampByte(math.Round(18 + 18*pulse)),
		G: clampByte(math.Round(132 + 95*pulse)),
		B: clampByte(math.Round(24 + 42*pulse)),
	})
}

func gameOverColor(now time.Time) RGB {
	value := byte(10 + 42*(0.5+0.5*math.Sin(float64(now.UnixNano())/float64(time.Second)*math.Pi*2)))
	return RGB{R: value, G: 2, B: 4}
}

func lavaTileCount(seconds float64) int {
	count := 0
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if lavaAt(Point{X: x, Y: y}, seconds) {
				count++
			}
		}
	}
	return count
}

func addRGB(left, right RGB) RGB {
	return RGB{
		R: clampByte(float64(left.R) + float64(right.R)),
		G: clampByte(float64(left.G) + float64(right.G)),
		B: clampByte(float64(left.B) + float64(right.B)),
	}
}

func scaleRGB(color RGB, scale float64) RGB {
	return RGB{
		R: clampByte(math.Round(float64(color.R) * scale)),
		G: clampByte(math.Round(float64(color.G) * scale)),
		B: clampByte(math.Round(float64(color.B) * scale)),
	}
}

func clampByte(value float64) byte {
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

func pointIndex(pt Point) int {
	return pt.Y*GridWidth + pt.X
}

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}
