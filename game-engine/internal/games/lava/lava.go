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

	gameDuration       = 60 * time.Second
	countdownDuration  = 3 * time.Second
	globalImmunity     = time.Second
	damageFlash        = 420 * time.Millisecond
	safeStepScore      = 1
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
	endAt            time.Time
	gameOver         bool
	lastTick         time.Time
	immuneUntil      time.Time
	damageFlashUntil time.Time
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
		endAt:       now.Add(countdownDuration + gameDuration),
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

	g.score += safeStepScore
	return []whackamole.Event{{Cue: whackamole.CueHit, Message: "Zona segura +" + strconv.Itoa(safeStepScore)}}
}

func (g *Game) Render(now time.Time) []RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)

	frame := make([]RGB, GridWidth*GridHeight)
	seconds := g.patternSeconds(now)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			color := colorAt(Point{X: x, Y: y}, seconds)
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
	remaining := int64(0)
	if now.Before(g.endAt) {
		remaining = g.endAt.Sub(now).Milliseconds()
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
		Score:           g.score + int(elapsed/1000),
		StartedUnix:     g.started.Unix(),
		EndsUnix:        g.endAt.Unix(),
		ElapsedMillis:   elapsed,
		RemainingMillis: remaining,
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
	if !g.gameOver && !g.endAt.IsZero() && !now.Before(g.endAt) {
		g.gameOver = true
	}
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

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}
