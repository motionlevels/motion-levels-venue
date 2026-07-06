package patrones

import (
	"fmt"
	"math"
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

	countdownDuration  = 3 * time.Second
	failureDuration    = 2200 * time.Millisecond
	DefaultMusicRef    = "Motion/canciones/Background07.mp3"
	DefaultMusicVolume = 0.18
)

type RGB = animation.RGB

type Difficulty string

const (
	DifficultyEasy   Difficulty = "easy"
	DifficultyMedium Difficulty = "medium"
	DifficultyHard   Difficulty = "hard"
	DifficultyExpert Difficulty = "expert"
)

type LevelInfo struct {
	ID          string
	Label       string
	Description string
}

type PlayerSnapshot struct {
	Index int
	Label string
	Color RGB
	Score int
	Lives int
}

type Snapshot struct {
	Phase            string
	Difficulty       string
	Level            string
	LevelNumber      int
	Players          []PlayerSnapshot
	Score            int
	StartedUnix      int64
	CreatedUnixNanos int64
	StartedUnixNanos int64
	EndedUnixNanos   int64
	EndsUnix         int64
	ElapsedMillis    int64
	RemainingMillis  int64
	CountdownMillis  int64
	ActiveTargets    int
	LivesStart       int
	Lives            int
	Success          bool
}

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

func (r Rect) contains(pt Point) bool {
	return pt.X >= r.X && pt.X < r.X+r.W && pt.Y >= r.Y && pt.Y < r.Y+r.H
}

type Game struct {
	mu sync.Mutex

	level       levelDef
	difficulty  Difficulty
	playerCount int
	players     []whackamole.PlayerConfig

	createdAt time.Time
	startedAt time.Time
	endedAt   time.Time

	canvas        Rect
	targets       []Point
	targetIndex   map[Point]int
	claimed       map[Point]bool
	lastClaimedAt map[Point]time.Time
	failPoint     Point

	ended   bool
	success bool
	score   int
}

type levelDef struct {
	id          string
	label       string
	description string
	kind        string
}

var levels = []levelDef{
	{"level-1", "Nivel 1", "Copia una cruz simple en el canvas central.", "cross"},
	{"level-2", "Nivel 2", "Reconstruye una diagonal doble sin pisar el fondo negro.", "diagonal"},
	{"level-3", "Nivel 3", "Completa el marco de luz del patrón.", "frame"},
	{"level-4", "Nivel 4", "Sigue una escalera luminosa por el centro.", "stair"},
	{"level-5", "Nivel 5", "Cierra un símbolo compacto con varias ramas.", "glyph"},
}

func Levels() []LevelInfo {
	out := make([]LevelInfo, 0, len(levels))
	for _, level := range levels {
		out = append(out, LevelInfo{ID: level.id, Label: level.label, Description: level.description})
	}
	return out
}

func NormalizeLevel(value string) string {
	value = strings.TrimSpace(strings.ToLower(value))
	for _, level := range levels {
		if value == level.id {
			return level.id
		}
	}
	return levels[0].id
}

func NormalizeDifficulty(value string) Difficulty {
	switch strings.TrimSpace(strings.ToLower(value)) {
	case string(DifficultyMedium):
		return DifficultyMedium
	case string(DifficultyHard):
		return DifficultyHard
	case string(DifficultyExpert):
		return DifficultyExpert
	default:
		return DifficultyEasy
	}
}

func NewWithSeed(now time.Time, _ int64, playerCount int, difficulty string, level string) *Game {
	if now.IsZero() {
		now = time.Now()
	}
	diff := NormalizeDifficulty(difficulty)
	def := levelByID(NormalizeLevel(level))
	canvas := canvasForDifficulty(diff)
	targets := patternTargets(def.kind, canvas, patternSize(diff))
	targetIndex := make(map[Point]int, len(targets))
	for i, pt := range targets {
		targetIndex[pt] = i
	}
	return &Game{
		level:         def,
		difficulty:    diff,
		playerCount:   clampInt(playerCount, 1, 6),
		players:       defaultPlayers(clampInt(playerCount, 1, 6)),
		createdAt:     now,
		startedAt:     now.Add(countdownDuration),
		canvas:        canvas,
		targets:       targets,
		targetIndex:   targetIndex,
		claimed:       map[Point]bool{},
		lastClaimedAt: map[Point]time.Time{},
	}
}

func (g *Game) Render(now time.Time) []RGB {
	if now.IsZero() {
		now = time.Now()
	}
	g.mu.Lock()
	defer g.mu.Unlock()

	frame := make([]RGB, GridWidth*GridHeight)
	phase := g.phaseLocked(now)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			frame[y*GridWidth+x] = g.colorAtLocked(pt, now, phase)
		}
	}
	return frame
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if now.IsZero() {
		now = time.Now()
	}
	if !event.Pressed {
		return nil
	}
	pt := Point{X: event.X, Y: event.Y}
	if pt.X < 0 || pt.X >= GridWidth || pt.Y < 0 || pt.Y >= GridHeight {
		return nil
	}

	g.mu.Lock()
	defer g.mu.Unlock()
	if g.ended || now.Before(g.startedAt) {
		return nil
	}
	if !g.canvas.contains(pt) {
		return nil
	}
	if _, ok := g.targetIndex[pt]; !ok {
		g.ended = true
		g.success = false
		g.endedAt = now
		g.failPoint = pt
		return []whackamole.Event{{Cue: whackamole.CueDamage, Message: "Patrón incorrecto"}}
	}
	if g.claimed[pt] {
		return nil
	}
	g.claimed[pt] = true
	g.lastClaimedAt[pt] = now
	g.score = len(g.claimed)
	if g.score >= len(g.targets) {
		g.ended = true
		g.success = true
		g.endedAt = now
		return []whackamole.Event{{Cue: whackamole.CueWin, Message: "Patrón completo"}}
	}
	return []whackamole.Event{{Cue: whackamole.CueCoin, Message: "Patrón " + strconv.Itoa(g.score) + "/" + strconv.Itoa(len(g.targets))}}
}

func (g *Game) Snapshot(now time.Time) Snapshot {
	if now.IsZero() {
		now = time.Now()
	}
	g.mu.Lock()
	defer g.mu.Unlock()

	phase := g.phaseLocked(now)
	elapsed := int64(0)
	if now.After(g.startedAt) {
		elapsed = now.Sub(g.startedAt).Milliseconds()
	}
	if !g.endedAt.IsZero() {
		elapsed = g.endedAt.Sub(g.startedAt).Milliseconds()
	}
	countdown := int64(0)
	if now.Before(g.startedAt) {
		countdown = g.startedAt.Sub(now).Milliseconds()
	}
	players := make([]PlayerSnapshot, 0, g.playerCount)
	for i := 0; i < g.playerCount; i++ {
		cfg := g.players[i%len(g.players)]
		players = append(players, PlayerSnapshot{
			Index: i,
			Label: cfg.Label,
			Color: cfg.Color,
			Score: g.score,
			Lives: g.livesLocked(),
		})
	}
	return Snapshot{
		Phase:            phase,
		Difficulty:       string(g.difficulty),
		Level:            g.level.id,
		LevelNumber:      levelNumber(g.level.id),
		Players:          players,
		Score:            g.score,
		StartedUnix:      g.startedAt.Unix(),
		CreatedUnixNanos: g.createdAt.UnixNano(),
		StartedUnixNanos: g.startedAt.UnixNano(),
		EndedUnixNanos:   g.endedAt.UnixNano(),
		ElapsedMillis:    elapsed,
		CountdownMillis:  countdown,
		ActiveTargets:    len(g.targets) - len(g.claimed),
		LivesStart:       1,
		Lives:            g.livesLocked(),
		Success:          g.success,
	}
}

func (g *Game) colorAtLocked(pt Point, now time.Time, phase string) RGB {
	t := now.Sub(g.createdAt).Seconds()
	if !g.canvas.contains(pt) {
		pulse := 0.82 + 0.18*math.Sin(t*3.2+float64(pt.X)*0.31+float64(pt.Y)*0.09)
		return scaleRGB(RGB{G: 255}, pulse)
	}
	if g.ended && !g.success {
		if pt == g.failPoint && int(t*14)%4 < 2 {
			return RGB{R: 255, G: 28, B: 40}
		}
		return RGB{}
	}
	if g.ended && g.success {
		wave := 0.45 + 0.55*math.Sin(t*8+float64(pt.X+pt.Y)*0.4)
		if _, ok := g.targetIndex[pt]; ok {
			return RGB{R: byte(50 * wave), G: 255, B: byte(90 * wave)}
		}
		return RGB{}
	}
	if index, ok := g.targetIndex[pt]; ok {
		if g.claimed[pt] {
			flash := now.Sub(g.lastClaimedAt[pt])
			if flash >= 0 && flash < 180*time.Millisecond {
				return RGB{R: 245, G: 250, B: 255}
			}
			return RGB{G: 255}
		}
		pulse := 0.78 + 0.22*math.Sin(t*4.4+float64(index)*0.5)
		if phase == "countdown" {
			pulse = 0.88 + 0.12*math.Sin(t*7.0+float64(index)*0.7)
		}
		return scaleRGB(RGB{R: 20, G: 104, B: 255}, pulse)
	}
	return RGB{}
}

func (g *Game) phaseLocked(now time.Time) string {
	if g.ended {
		if g.success {
			return "finished"
		}
		if !g.endedAt.IsZero() && now.Sub(g.endedAt) < failureDuration {
			return "failed"
		}
		return "finished"
	}
	if now.Before(g.startedAt) {
		return "countdown"
	}
	return "playing"
}

func (g *Game) livesLocked() int {
	if g.ended && !g.success {
		return 0
	}
	return 1
}

func levelByID(id string) levelDef {
	for _, level := range levels {
		if level.id == id {
			return level
		}
	}
	return levels[0]
}

func levelNumber(id string) int {
	value := strings.TrimPrefix(id, "level-")
	n, err := strconv.Atoi(value)
	if err != nil || n < 1 {
		return 1
	}
	return n
}

func canvasForDifficulty(difficulty Difficulty) Rect {
	switch difficulty {
	case DifficultyExpert:
		return Rect{X: 2, Y: 7, W: 12, H: 18}
	case DifficultyHard:
		return Rect{X: 3, Y: 8, W: 10, H: 16}
	case DifficultyMedium:
		return Rect{X: 4, Y: 9, W: 8, H: 14}
	default:
		return Rect{X: 5, Y: 10, W: 6, H: 12}
	}
}

func patternSize(difficulty Difficulty) int {
	switch difficulty {
	case DifficultyExpert:
		return 7
	case DifficultyHard:
		return 6
	case DifficultyMedium:
		return 5
	default:
		return 4
	}
}

func patternTargets(kind string, canvas Rect, size int) []Point {
	cx := canvas.X + canvas.W/2
	cy := canvas.Y + canvas.H/2
	minX := canvas.X + 1
	maxX := canvas.X + canvas.W - 2
	minY := canvas.Y + 1
	maxY := canvas.Y + canvas.H - 2
	points := map[Point]bool{}
	add := func(x, y int) {
		pt := Point{X: clampInt(x, minX, maxX), Y: clampInt(y, minY, maxY)}
		points[pt] = true
	}

	radius := size / 2
	switch kind {
	case "diagonal":
		for i := -radius; i <= radius; i++ {
			add(cx+i, cy+i)
			add(cx+i, cy-i)
		}
	case "frame":
		for i := -radius; i <= radius; i++ {
			add(cx+i, cy-radius)
			add(cx+i, cy+radius)
			add(cx-radius, cy+i)
			add(cx+radius, cy+i)
		}
	case "stair":
		for i := 0; i < size; i++ {
			add(cx-radius+i, cy+radius-i)
			if i%2 == 0 {
				add(cx-radius+i, cy+radius-i-1)
			}
		}
	case "glyph":
		for i := -radius; i <= radius; i++ {
			add(cx+i, cy)
			add(cx, cy+i)
		}
		add(cx-radius, cy-radius)
		add(cx+radius, cy-radius)
		add(cx-radius, cy+radius)
		add(cx+radius, cy+radius)
	default:
		for i := -radius; i <= radius; i++ {
			add(cx+i, cy)
			add(cx, cy+i)
		}
	}

	out := make([]Point, 0, len(points))
	for pt := range points {
		out = append(out, pt)
	}
	return out
}

func defaultPlayers(playerCount int) []whackamole.PlayerConfig {
	palette := []RGB{
		{R: 255},
		{G: 255, B: 255},
		{G: 255},
		{R: 255, B: 255},
		{B: 255},
		{R: 255, G: 255},
	}
	players := make([]whackamole.PlayerConfig, 0, playerCount)
	for i := 0; i < playerCount; i++ {
		players = append(players, whackamole.PlayerConfig{
			Label: fmt.Sprintf("Jugador %d", i+1),
			Color: palette[i%len(palette)],
		})
	}
	return players
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

func scaleRGB(color RGB, scale float64) RGB {
	if scale < 0 {
		scale = 0
	}
	if scale > 1 {
		scale = 1
	}
	return RGB{R: byte(math.Round(float64(color.R) * scale)), G: byte(math.Round(float64(color.G) * scale)), B: byte(math.Round(float64(color.B) * scale))}
}
