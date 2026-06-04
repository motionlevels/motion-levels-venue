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
	platformWidth    int
	platformHeight   int
	platformSpacing  int
	started          time.Time
	gameOver         bool
	lastTick         time.Time
	immuneUntil      time.Time
	damageFlashUntil time.Time
	claimedPlatforms []claimedPlatform
}

type claimedPlatform struct {
	spawn          int
	width          int
	height         int
	motionPerSec   float64
	initialSeconds float64
	initialY       float64
}

type movingPlatform struct {
	spawn        int
	x            int
	y            int
	width        int
	height       int
	motionPerSec float64
	seconds      float64
	yFloat       float64
}

var playerColors = []struct {
	label string
	rgb   RGB
}{
	{label: "Red", rgb: RGB{R: 255, G: 0, B: 0}},
	{label: "Cyan", rgb: RGB{R: 0, G: 255, B: 255}},
	{label: "Green", rgb: RGB{R: 0, G: 255, B: 0}},
	{label: "Pink", rgb: RGB{R: 255, G: 0, B: 255}},
	{label: "Blue", rgb: RGB{R: 0, G: 0, B: 255}},
	{label: "Yellow", rgb: RGB{R: 255, G: 255, B: 0}},
}

func New(playerCount int, now time.Time, difficulty string) *Game {
	return NewWithSeed(playerCount, now, 0, difficulty)
}

func NewWithSeed(playerCount int, now time.Time, _ int64, difficulty string) *Game {
	playerCount = clampInt(playerCount, 1, len(playerColors))
	settings := settingsForDifficulty(difficulty)
	return &Game{
		playerCount:     playerCount,
		difficulty:      settings.difficulty,
		lives:           settings.lives,
		speed:           settings.speed,
		platformWidth:   settings.platformWidth,
		platformHeight:  settings.platformHeight,
		platformSpacing: settings.platformSpacing,
		started:         now.Add(countdownDuration),
		lastTick:        now,
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
	platform, onPlatform := g.platformAt(pt, g.patternSeconds(now))
	if !onPlatform {
		g.lives--
		g.immuneUntil = now.Add(globalImmunity)
		g.damageFlashUntil = now.Add(damageFlash)
		if g.lives <= 0 {
			g.lives = 0
			g.gameOver = true
			return []whackamole.Event{{Cue: whackamole.CueDamage, Message: "Sin vidas"}}
		}
		return []whackamole.Event{{Cue: whackamole.CueDamage, Message: "Vida perdida · " + strconv.Itoa(g.lives)}}
	}

	claimed := g.claimedMask(g.patternSeconds(now))
	if claimed[pointIndex(pt)] {
		return nil
	}

	g.claimedPlatforms = append(g.claimedPlatforms, newClaimedPlatform(platform))
	g.score = len(g.claimedPlatforms)
	return []whackamole.Event{{Cue: whackamole.CueCoin, Message: "Plataforma nueva · " + strconv.Itoa(g.score)}}
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
			color := g.colorAt(pt, seconds)
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
		ActiveTargets:   activeSafeTileCount(g, g.patternSeconds(now)),
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
	difficulty      Difficulty
	lives           int
	speed           float64
	platformWidth   int
	platformHeight  int
	platformSpacing int
}

func settingsForDifficulty(value string) difficultySettings {
	switch Difficulty(value) {
	case DifficultyExpert:
		return difficultySettings{difficulty: DifficultyExpert, lives: 4, speed: 0.48, platformWidth: 3, platformHeight: 2, platformSpacing: 5}
	case DifficultyHard:
		return difficultySettings{difficulty: DifficultyHard, lives: 5, speed: 0.34, platformWidth: 4, platformHeight: 2, platformSpacing: 6}
	case DifficultyMedium:
		return difficultySettings{difficulty: DifficultyMedium, lives: 6, speed: 0.24, platformWidth: 5, platformHeight: 3, platformSpacing: 7}
	default:
		return difficultySettings{difficulty: DifficultyEasy, lives: 8, speed: 0.14, platformWidth: 6, platformHeight: 4, platformSpacing: 8}
	}
}

func (g *Game) lavaAt(pt Point, seconds float64) bool {
	_, ok := g.platformAt(pt, seconds)
	return !ok
}

func newClaimedPlatform(platform movingPlatform) claimedPlatform {
	return claimedPlatform{
		spawn:          platform.spawn,
		width:          platform.width,
		height:         platform.height,
		motionPerSec:   platform.motionPerSec,
		initialSeconds: platform.seconds,
		initialY:       platform.yFloat,
	}
}

func (g *Game) claimedMask(seconds float64) []bool {
	mask := make([]bool, GridWidth*GridHeight)
	for index := range g.claimedPlatforms {
		platform, ok := g.claimedPlatforms[index].currentPlatform(seconds)
		if !ok {
			continue
		}
		markPlatform(mask, platform)
	}
	return mask
}

func (platform claimedPlatform) currentPlatform(seconds float64) (movingPlatform, bool) {
	yFloat := platform.initialY - (seconds-platform.initialSeconds)*platform.motionPerSec
	y := int(math.Round(yFloat))
	if y+platform.height <= 0 || y >= GridHeight {
		return movingPlatform{}, false
	}
	x := platformX(platform.spawn, platform.width)
	return movingPlatform{
		spawn:        platform.spawn,
		x:            x,
		y:            y,
		width:        platform.width,
		height:       platform.height,
		motionPerSec: platform.motionPerSec,
		seconds:      seconds,
		yFloat:       yFloat,
	}, true
}

func (g *Game) platformAt(pt Point, seconds float64) (movingPlatform, bool) {
	if !inBounds(pt.X, pt.Y) {
		return movingPlatform{}, false
	}
	for _, platform := range g.visiblePlatforms(seconds) {
		if pointInPlatform(pt, platform) {
			return platform, true
		}
	}
	return movingPlatform{}, false
}

func (g *Game) visiblePlatforms(seconds float64) []movingPlatform {
	motionPerSec := 5.5
	platforms := make([]movingPlatform, 0, 8)
	height := g.platformHeight
	spacing := g.platformSpacing
	if height <= 0 || spacing <= height {
		return platforms
	}
	firstSpawn := int(math.Floor((seconds*motionPerSec-float64(height))/float64(spacing))) - 1
	lastSpawn := int(math.Ceil((seconds*motionPerSec+float64(GridHeight+height))/float64(spacing))) + 1
	for spawn := firstSpawn; spawn <= lastSpawn; spawn++ {
		yFloat := float64(spawn*spacing) - seconds*motionPerSec - float64(height)
		y := int(math.Round(yFloat))
		if y+height <= 0 || y >= GridHeight {
			continue
		}
		platforms = append(platforms, movingPlatform{
			spawn:        spawn,
			x:            platformX(spawn, g.platformWidth),
			y:            y,
			width:        g.platformWidth,
			height:       height,
			motionPerSec: motionPerSec,
			seconds:      seconds,
			yFloat:       yFloat,
		})
	}
	return platforms
}

func platformX(spawn int, width int) int {
	maxX := GridWidth - width
	if maxX <= 0 {
		return 0
	}
	value := positiveMod(spawn*7+spawn*spawn*3+5, maxX+1)
	return value
}

func markPlatform(mask []bool, platform movingPlatform) {
	for y := platform.y; y < platform.y+platform.height; y++ {
		for x := platform.x; x < platform.x+platform.width; x++ {
			if inBounds(x, y) {
				mask[pointIndex(Point{X: x, Y: y})] = true
			}
		}
	}
}

func pointInPlatform(pt Point, platform movingPlatform) bool {
	return pt.X >= platform.x && pt.X < platform.x+platform.width && pt.Y >= platform.y && pt.Y < platform.y+platform.height
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

func (g *Game) colorAt(pt Point, seconds float64) RGB {
	if _, ok := g.platformAt(pt, seconds); ok {
		return RGB{R: 4, G: 9, B: 18}
	}
	field := heatField(pt, seconds)
	heat := clamp01(field)
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

func activeSafeTileCount(game *Game, seconds float64) int {
	count := 0
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if _, ok := game.platformAt(Point{X: x, Y: y}, seconds); ok {
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

func positiveMod(value, modulus int) int {
	out := value % modulus
	if out < 0 {
		out += modulus
	}
	return out
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
