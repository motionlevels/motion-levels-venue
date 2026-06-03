package temporada1

import (
	"bytes"
	"compress/gzip"
	"embed"
	"encoding/json"
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
	tickDuration       = 25 * time.Millisecond
	damageCooldown     = 1 * time.Second
	DefaultMusicRef    = "Motion/canciones/Background07.mp3"
	DefaultMusicVolume = 0.18
)

//go:embed temporada1_data.json.gz
var embeddedFS embed.FS

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
	Phase           string
	Difficulty      string
	Level           string
	LevelNumber     int
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

	level       compiledLevel
	difficulty  Difficulty
	playerCount int

	createdAt time.Time
	startedAt time.Time
	endedAt   time.Time

	score        int
	lives        int
	success      bool
	ended        bool
	removed      map[string]bool
	purpleHeld   map[string]bool
	purplePrimed map[string]bool
	pressed      map[Point]bool
	lastDamageAt time.Time
	hitFlash     map[Point]time.Time
}

type compiledLevel struct {
	id            string
	label         string
	lives         int
	passScore     int
	timeLimit     time.Duration
	totalDuration time.Duration
	frames        []compiledFrame
	scoreUniqs    map[string]struct{}
}

type compiledFrame struct {
	duration time.Duration
	points   [GridHeight][GridWidth]tilePoint
}

type tilePoint struct {
	present bool
	kind    int
	uniq    string
}

type bundle struct {
	Games []rawGame `json:"games"`
}

type rawGame struct {
	ID     int        `json:"id"`
	Levels []rawLevel `json:"levels"`
}

type rawLevel struct {
	Label  string     `json:"label"`
	Life   int        `json:"life"`
	Pass   int        `json:"pass"`
	Time   int        `json:"time"`
	Frames []rawFrame `json:"frames"`
}

type rawFrame struct {
	Repeat int         `json:"r"`
	Cells  []cellTuple `json:"c"`
}

type cellTuple struct {
	X    int
	Y    int
	Kind int
	Uniq string
}

func (c *cellTuple) UnmarshalJSON(data []byte) error {
	var values []json.RawMessage
	if err := json.Unmarshal(data, &values); err != nil {
		return err
	}
	if len(values) < 3 {
		return fmt.Errorf("temporada1 cell has %d fields, want at least 3", len(values))
	}
	if err := json.Unmarshal(values[0], &c.X); err != nil {
		return err
	}
	if err := json.Unmarshal(values[1], &c.Y); err != nil {
		return err
	}
	if err := json.Unmarshal(values[2], &c.Kind); err != nil {
		return err
	}
	if len(values) > 3 {
		_ = json.Unmarshal(values[3], &c.Uniq)
	}
	return nil
}

var (
	compiledOnce sync.Once
	compiledErr  error
	compiled     map[Difficulty][]compiledLevel
)

func Levels() []LevelInfo {
	if err := load(); err != nil {
		return fallbackLevels()
	}
	levels := compiled[DifficultyMedium]
	if len(levels) == 0 {
		levels = compiled[DifficultyEasy]
	}
	out := make([]LevelInfo, 0, len(levels))
	for i, level := range levels {
		out = append(out, LevelInfo{
			ID:          level.id,
			Label:       fmt.Sprintf("Nivel %d", i+1),
			Description: cleanLevelDescription(level.label),
		})
	}
	return out
}

func NormalizeLevel(value string) string {
	levels := Levels()
	if len(levels) == 0 {
		return "level-1"
	}
	value = strings.TrimSpace(strings.ToLower(value))
	for _, level := range levels {
		if value == level.ID {
			return level.ID
		}
	}
	if n, err := strconv.Atoi(strings.TrimPrefix(value, "nivel-")); err == nil && n >= 1 && n <= len(levels) {
		return "level-" + strconv.Itoa(n)
	}
	return levels[0].ID
}

func NormalizeDifficulty(value string) Difficulty {
	switch strings.TrimSpace(strings.ToLower(value)) {
	case "medium", "media", "oficial":
		return DifficultyMedium
	case "hard", "dificil", "difícil":
		return DifficultyHard
	case "expert", "experto":
		return DifficultyExpert
	default:
		return DifficultyEasy
	}
}

func New(now time.Time, playerCount int, difficulty string, level string) *Game {
	return NewWithSeed(now, 0, playerCount, difficulty, level)
}

func NewWithSeed(now time.Time, _ int64, playerCount int, difficulty string, level string) *Game {
	_ = load()
	diff := NormalizeDifficulty(difficulty)
	selected := levelFor(diff, level)
	if playerCount < 1 {
		playerCount = 1
	}
	if playerCount > 6 {
		playerCount = 6
	}
	lives := selected.lives
	if lives < 1 {
		lives = 5
	}
	return &Game{
		level:        selected,
		difficulty:   diff,
		playerCount:  playerCount,
		createdAt:    now,
		startedAt:    now.Add(countdownDuration),
		lives:        lives,
		removed:      map[string]bool{},
		purpleHeld:   map[string]bool{},
		purplePrimed: map[string]bool{},
		pressed:      map[Point]bool{},
		hitFlash:     map[Point]time.Time{},
	}
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if !inBounds(event.X, event.Y) {
		return nil
	}
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)

	pt := Point{X: event.X, Y: event.Y}
	if event.Pressed {
		g.pressed[pt] = true
	} else {
		delete(g.pressed, pt)
		g.releasePurpleLocked(pt, now)
	}
	if !event.Pressed || g.ended || now.Before(g.startedAt) {
		return nil
	}
	point := g.pointAtLocked(pt, now)
	return g.applyPointLocked(point, pt, now)
}

func (g *Game) Render(now time.Time) []RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.tickLocked(now)
	frame := make([]RGB, GridWidth*GridHeight)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			color := g.colorAtLocked(pt, now)
			if now.Before(g.startedAt) {
				color = scale(color, countdownFade(now, g.createdAt, g.startedAt))
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
	}
	if g.ended {
		phase = "finished"
	}
	elapsed := int64(0)
	if now.After(g.startedAt) {
		elapsed = now.Sub(g.startedAt).Milliseconds()
	}
	remaining := int64(0)
	if g.level.timeLimit > 0 && !g.ended {
		deadline := g.startedAt.Add(g.level.timeLimit)
		if now.Before(deadline) {
			remaining = deadline.Sub(now).Milliseconds()
		}
	}
	countdown := int64(0)
	if now.Before(g.startedAt) {
		countdown = g.startedAt.Sub(now).Milliseconds()
	}
	return Snapshot{
		Phase:           phase,
		Difficulty:      string(g.difficulty),
		Level:           g.level.id,
		LevelNumber:     levelNumber(g.level.id),
		Players:         g.playersLocked(),
		Score:           g.score,
		StartedUnix:     g.startedAt.Unix(),
		EndsUnix:        g.endsUnixLocked(),
		ElapsedMillis:   elapsed,
		RemainingMillis: remaining,
		CountdownMillis: countdown,
		ActiveTargets:   len(g.level.scoreUniqs) - len(g.removed),
		Lives:           g.lives,
		Success:         g.success,
	}
}

func (g *Game) tickLocked(now time.Time) {
	if g.ended || now.Before(g.startedAt) {
		return
	}
	if g.level.timeLimit > 0 && now.Sub(g.startedAt) >= g.level.timeLimit {
		g.ended = true
		g.endedAt = now
		return
	}
	for pt := range g.pressed {
		if g.pointAtLocked(pt, now).kind == 2 {
			_ = g.damageLocked(pt, now)
			if g.ended {
				return
			}
		}
	}
	if len(g.level.scoreUniqs) > 0 && len(g.removed) >= len(g.level.scoreUniqs) {
		g.success = true
		g.ended = true
		g.endedAt = now
		g.score += g.level.passScore
	}
}

func (g *Game) applyPointLocked(point tilePoint, pt Point, now time.Time) []whackamole.Event {
	switch point.kind {
	case 1:
		if point.uniq != "" && !g.removed[point.uniq] {
			g.removed[point.uniq] = true
			delete(g.purpleHeld, point.uniq)
			delete(g.purplePrimed, point.uniq)
			g.score++
			return []whackamole.Event{{Cue: whackamole.CueHit, Message: "Temporada 1 punto " + strconv.Itoa(g.score)}}
		}
	case 3:
		if point.uniq != "" && !g.removed[point.uniq] && !g.purplePrimed[point.uniq] {
			g.purpleHeld[point.uniq] = true
		}
	case 2:
		if g.damageLocked(pt, now) {
			return []whackamole.Event{{Cue: whackamole.CueMiss, Message: "Temporada 1 daño"}}
		}
	}
	return nil
}

func (g *Game) releasePurpleLocked(pt Point, now time.Time) {
	if g.ended || now.Before(g.startedAt) {
		return
	}
	point := g.rawPointAtLocked(pt, now)
	if point.uniq == "" || !g.purpleHeld[point.uniq] {
		return
	}
	delete(g.purpleHeld, point.uniq)
	if !g.removed[point.uniq] {
		g.purplePrimed[point.uniq] = true
	}
}

func (g *Game) damageLocked(pt Point, now time.Time) bool {
	if !g.lastDamageAt.IsZero() && now.Sub(g.lastDamageAt) < damageCooldown {
		return false
	}
	g.lastDamageAt = now
	g.hitFlash[pt] = now.Add(350 * time.Millisecond)
	if g.lives > 0 {
		g.lives--
	}
	if g.lives <= 0 {
		g.ended = true
		g.endedAt = now
	}
	return true
}

func (g *Game) colorAtLocked(pt Point, now time.Time) RGB {
	if g.ended {
		if g.success {
			return successColor(pt, now)
		}
		return failColor(pt, now)
	}
	if until, ok := g.hitFlash[pt]; ok && now.Before(until) {
		return RGB{R: 255, G: 236, B: 82}
	}
	if now.Before(g.startedAt) {
		return colorForCountdownPoint(g.countdownPointAtLocked(pt))
	}
	return colorForPoint(g.pointAtLocked(pt, now))
}

func (g *Game) pointAtLocked(pt Point, now time.Time) tilePoint {
	point := g.rawPointAtLocked(pt, now)
	if point.uniq != "" && g.removed[point.uniq] {
		return tilePoint{}
	}
	if point.uniq != "" && g.purplePrimed[point.uniq] {
		point.kind = 1
	}
	if point.uniq != "" && g.purpleHeld[point.uniq] {
		point.kind = 4
	}
	return point
}

func (g *Game) rawPointAtLocked(pt Point, now time.Time) tilePoint {
	frame := g.frameAtLocked(now)
	if frame == nil {
		return tilePoint{}
	}
	return frame.points[pt.Y][pt.X]
}

func (g *Game) countdownPointAtLocked(pt Point) tilePoint {
	if len(g.level.frames) == 0 {
		return tilePoint{}
	}
	point := g.level.frames[0].points[pt.Y][pt.X]
	if point.kind != 0 {
		return tilePoint{}
	}
	return point
}

func (g *Game) frameAtLocked(now time.Time) *compiledFrame {
	if len(g.level.frames) == 0 || now.Before(g.startedAt) {
		return nil
	}
	elapsed := now.Sub(g.startedAt)
	if g.level.totalDuration > 0 {
		elapsed %= g.level.totalDuration
	}
	for i := range g.level.frames {
		frame := &g.level.frames[i]
		if elapsed < frame.duration {
			return frame
		}
		elapsed -= frame.duration
	}
	return &g.level.frames[len(g.level.frames)-1]
}

func (g *Game) playersLocked() []PlayerSnapshot {
	players := make([]PlayerSnapshot, g.playerCount)
	for i := 0; i < g.playerCount; i++ {
		players[i] = PlayerSnapshot{
			Index: i,
			Label: fmt.Sprintf("Jugador %d", i+1),
			Color: playerColor(i),
			Score: g.score,
			Lives: g.lives,
		}
	}
	return players
}

func (g *Game) endsUnixLocked() int64 {
	if !g.endedAt.IsZero() {
		return g.endedAt.Unix()
	}
	if g.level.timeLimit > 0 {
		return g.startedAt.Add(g.level.timeLimit).Unix()
	}
	return 0
}

func load() error {
	compiledOnce.Do(func() {
		compiled = map[Difficulty][]compiledLevel{}
		data, err := embeddedFS.ReadFile("temporada1_data.json.gz")
		if err != nil {
			compiledErr = err
			return
		}
		reader, err := gzip.NewReader(bytes.NewReader(data))
		if err != nil {
			compiledErr = err
			return
		}
		defer reader.Close()
		var b bundle
		if err := json.NewDecoder(reader).Decode(&b); err != nil {
			compiledErr = err
			return
		}
		for _, game := range b.Games {
			diff, ok := difficultyForGameID(game.ID)
			if !ok {
				continue
			}
			levels, err := compileLevels(game.Levels)
			if err != nil {
				compiledErr = err
				return
			}
			compiled[diff] = levels
			if diff == DifficultyHard {
				compiled[DifficultyExpert] = levels
			}
		}
		if len(compiled) == 0 {
			compiledErr = fmt.Errorf("temporada1 data has no supported games")
		}
	})
	return compiledErr
}

func compileLevels(raw []rawLevel) ([]compiledLevel, error) {
	levels := make([]compiledLevel, 0, len(raw))
	for index, level := range raw {
		compiledLevel := compiledLevel{
			id:         "level-" + strconv.Itoa(index+1),
			label:      level.Label,
			lives:      level.Life,
			passScore:  level.Pass,
			timeLimit:  time.Duration(level.Time) * time.Second,
			scoreUniqs: map[string]struct{}{},
		}
		for _, frame := range level.Frames {
			repeat := frame.Repeat
			if repeat <= 0 {
				repeat = 1
			}
			next := compiledFrame{duration: time.Duration(repeat) * tickDuration}
			for _, cell := range frame.Cells {
				if !inBounds(cell.X, cell.Y) {
					continue
				}
				next.points[cell.Y][cell.X] = tilePoint{present: true, kind: cell.Kind, uniq: cell.Uniq}
				if cell.Uniq != "" && (cell.Kind == 1 || cell.Kind == 3) {
					compiledLevel.scoreUniqs[cell.Uniq] = struct{}{}
				}
			}
			compiledLevel.totalDuration += next.duration
			compiledLevel.frames = append(compiledLevel.frames, next)
		}
		if len(compiledLevel.frames) == 0 {
			return nil, fmt.Errorf("temporada1 level %d has no frames", index+1)
		}
		levels = append(levels, compiledLevel)
	}
	return levels, nil
}

func levelFor(diff Difficulty, level string) compiledLevel {
	if err := load(); err != nil {
		panic(err)
	}
	levels := compiled[diff]
	if len(levels) == 0 {
		levels = compiled[DifficultyEasy]
	}
	id := NormalizeLevel(level)
	for _, candidate := range levels {
		if candidate.id == id {
			return candidate
		}
	}
	return levels[0]
}

func difficultyForGameID(id int) (Difficulty, bool) {
	switch id {
	case 1219:
		return DifficultyEasy, true
	case 1218:
		return DifficultyMedium, true
	case 1122:
		return DifficultyHard, true
	default:
		return "", false
	}
}

func fallbackLevels() []LevelInfo {
	out := make([]LevelInfo, 24)
	for i := range out {
		out[i] = LevelInfo{ID: "level-" + strconv.Itoa(i+1), Label: fmt.Sprintf("Nivel %d", i+1), Description: "Temporada 1"}
	}
	return out
}

func cleanLevelDescription(label string) string {
	label = strings.TrimSpace(label)
	if label == "" {
		return "Reto de temporada"
	}
	return strings.TrimSuffix(strings.TrimSpace(label), ")")
}

func levelNumber(id string) int {
	n, _ := strconv.Atoi(strings.TrimPrefix(id, "level-"))
	return n
}

func colorForPoint(point tilePoint) RGB {
	if !point.present {
		return RGB{}
	}
	switch point.kind {
	case 0:
		return RGB{R: 0, G: 230, B: 62}
	case 1:
		return RGB{R: 20, G: 92, B: 255}
	case 2:
		return RGB{R: 255, G: 28, B: 40}
	case 3:
		return RGB{R: 245, G: 38, B: 255}
	case 4:
		return RGB{R: 245, G: 250, B: 255}
	default:
		return RGB{}
	}
}

func colorForCountdownPoint(point tilePoint) RGB {
	if !point.present || point.kind != 0 {
		return RGB{}
	}
	return RGB{R: 0, G: 210, B: 70}
}

func successColor(pt Point, now time.Time) RGB {
	pulse := 0.68 + 0.32*math.Sin(now.Sub(time.Unix(0, 0)).Seconds()*5+float64(pt.X+pt.Y)*0.2)
	return RGB{R: byte(20 * pulse), G: byte(255 * pulse), B: byte(80 * pulse)}
}

func failColor(pt Point, now time.Time) RGB {
	pulse := 0.55 + 0.45*math.Sin(now.Sub(time.Unix(0, 0)).Seconds()*8+float64(pt.X)*0.3)
	return RGB{R: byte(255 * pulse), G: byte(18 * pulse), B: byte(32 * pulse)}
}

func playerColor(index int) RGB {
	palette := []RGB{
		{R: 255, G: 59, B: 48},
		{R: 52, G: 199, B: 89},
		{R: 10, G: 132, B: 255},
		{R: 255, G: 214, B: 10},
		{R: 191, G: 90, B: 242},
		{R: 50, G: 212, B: 255},
	}
	return palette[index%len(palette)]
}

func countdownFade(now, createdAt, startedAt time.Time) float64 {
	total := startedAt.Sub(createdAt)
	if total <= 0 {
		return 1
	}
	progress := 1 - float64(startedAt.Sub(now))/float64(total)
	if progress < 0 {
		progress = 0
	}
	if progress > 1 {
		progress = 1
	}
	return 0.16 + progress*0.36
}

func scale(color RGB, factor float64) RGB {
	return RGB{R: byte(float64(color.R) * factor), G: byte(float64(color.G) * factor), B: byte(float64(color.B) * factor)}
}

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}
