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
	transitionDuration = 1800 * time.Millisecond
	tickDuration       = 25 * time.Millisecond
	damageCooldown     = 3 * time.Second
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

type Game struct {
	mu sync.Mutex

	level       compiledLevel
	difficulty  Difficulty
	playerCount int

	createdAt time.Time
	startedAt time.Time
	endedAt   time.Time
	restartAt time.Time

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
	transitionID int
	seed         int64
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

func NewWithSeed(now time.Time, seed int64, playerCount int, difficulty string, level string) *Game {
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
		transitionID: transitionIDFromSeed(seed, selected.id, now),
		seed:         seed,
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
		Phase:            phase,
		Difficulty:       string(g.difficulty),
		Level:            g.level.id,
		LevelNumber:      levelNumber(g.level.id),
		Players:          g.playersLocked(),
		Score:            g.score,
		StartedUnix:      g.startedAt.Unix(),
		CreatedUnixNanos: g.createdAt.UnixNano(),
		StartedUnixNanos: g.startedAt.UnixNano(),
		EndedUnixNanos:   g.endedAt.UnixNano(),
		EndsUnix:         g.endsUnixLocked(),
		ElapsedMillis:    elapsed,
		RemainingMillis:  remaining,
		CountdownMillis:  countdown,
		ActiveTargets:    len(g.level.scoreUniqs) - len(g.removed),
		LivesStart:       g.startingLivesLocked(),
		Lives:            g.lives,
		Success:          g.success,
	}
}

func (g *Game) startingLivesLocked() int {
	lives := g.level.lives
	if lives < 1 {
		return 5
	}
	return lives
}

func (g *Game) tickLocked(now time.Time) {
	if g.ended {
		if g.success && !g.endedAt.IsZero() && !now.Before(g.endedAt.Add(transitionDuration)) {
			g.advanceSuccessLevelLocked(now)
		}
		if !g.success && !g.restartAt.IsZero() && !now.Before(g.restartAt) {
			g.restartFailedLevelLocked(now)
		}
		return
	}
	if now.Before(g.startedAt) {
		return
	}
	if g.level.timeLimit > 0 && now.Sub(g.startedAt) >= g.level.timeLimit {
		g.finishFailureLocked(now)
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
			return []whackamole.Event{{Cue: whackamole.CueCoin, Message: "Temporada 1 punto " + strconv.Itoa(g.score)}}
		}
	case 3:
		if point.uniq != "" && !g.removed[point.uniq] && !g.purplePrimed[point.uniq] {
			g.purpleHeld[point.uniq] = true
			return []whackamole.Event{{Cue: whackamole.CueDoubleCoin, Message: "Temporada 1 doble toque"}}
		}
	case 2:
		if g.damageLocked(pt, now) {
			return []whackamole.Event{{Cue: whackamole.CueDamage, Message: "Temporada 1 daño"}}
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
		g.finishFailureLocked(now)
	}
	return true
}

func (g *Game) finishFailureLocked(now time.Time) {
	g.ended = true
	g.success = false
	g.endedAt = now
	g.restartAt = now.Add(3 * time.Second)
}

func (g *Game) restartFailedLevelLocked(now time.Time) {
	lives := g.level.lives
	if lives < 1 {
		lives = 5
	}
	g.createdAt = now
	g.startedAt = now
	g.endedAt = time.Time{}
	g.restartAt = time.Time{}
	g.score = 0
	g.lives = lives
	g.success = false
	g.ended = false
	g.removed = map[string]bool{}
	g.purpleHeld = map[string]bool{}
	g.purplePrimed = map[string]bool{}
	g.lastDamageAt = time.Time{}
	g.hitFlash = map[Point]time.Time{}
}

func (g *Game) advanceSuccessLevelLocked(now time.Time) {
	next, ok := nextLevel(g.difficulty, g.level.id)
	if !ok {
		return
	}
	g.level = next
	g.createdAt = now
	g.startedAt = now.Add(countdownDuration)
	g.endedAt = time.Time{}
	g.restartAt = time.Time{}
	g.score = 0
	lives := g.level.lives
	if lives < 1 {
		lives = 5
	}
	g.lives = lives
	g.success = false
	g.ended = false
	g.removed = map[string]bool{}
	g.purpleHeld = map[string]bool{}
	g.purplePrimed = map[string]bool{}
	g.lastDamageAt = time.Time{}
	g.hitFlash = map[Point]time.Time{}
	g.transitionID = transitionIDFromSeed(g.seed, g.level.id, now)
}

func (g *Game) colorAtLocked(pt Point, now time.Time) RGB {
	if g.ended {
		if g.success {
			return successTransitionColor(g.transitionID, pt, now, g.endedAt)
		}
		return g.failureRestartColorAtLocked(pt, now)
	}
	if until, ok := g.hitFlash[pt]; ok && now.Before(until) {
		return RGB{R: 255, G: 236, B: 82}
	}
	if now.Before(g.startedAt) {
		return g.countdownColorAtLocked(pt, now)
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

func (g *Game) failureRestartColorAtLocked(pt Point, now time.Time) RGB {
	frameTime := g.endedAt
	if frameTime.IsZero() {
		frameTime = now
	}
	frame := g.frameAtLocked(frameTime)
	if frame != nil {
		point := frame.points[pt.Y][pt.X]
		if point.present && point.kind == 0 {
			return colorForPoint(point)
		}
	}
	if int(now.Sub(frameTime)/(120*time.Millisecond))%2 == 0 {
		return RGB{R: 255, G: 22, B: 34}
	}
	return RGB{}
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

func (g *Game) countdownColorAtLocked(pt Point, now time.Time) RGB {
	return g.safeZoneCountdownColorAtLocked(pt, now)
}

func (g *Game) safeZoneCountdownColorAtLocked(pt Point, now time.Time) RGB {
	if len(g.level.frames) == 0 {
		return RGB{}
	}
	progress := countdownProgress(now, g.createdAt, g.startedAt)
	safeTiles := countdownSafeTiles(&g.level.frames[0])
	for order, target := range safeTiles {
		tileProgress := countdownTileProgress(progress, order, len(safeTiles))
		if tileProgress < 0 {
			continue
		}
		if target.X == pt.X && countdownFallingY(target.Y, tileProgress) == pt.Y {
			return countdownPulseGreen(target, now, g.createdAt)
		}
	}
	return RGB{}
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
	levels := levelsFor(diff)
	id := NormalizeLevel(level)
	for _, candidate := range levels {
		if candidate.id == id {
			return candidate
		}
	}
	return levels[0]
}

func nextLevel(diff Difficulty, currentID string) (compiledLevel, bool) {
	levels := levelsFor(diff)
	for index, candidate := range levels {
		if candidate.id == currentID && index+1 < len(levels) {
			return levels[index+1], true
		}
	}
	return compiledLevel{}, false
}

func levelsFor(diff Difficulty) []compiledLevel {
	if err := load(); err != nil {
		panic(err)
	}
	levels := compiled[diff]
	if len(levels) == 0 {
		levels = compiled[DifficultyEasy]
	}
	return levels
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
		return RGB{R: 0, G: 255, B: 0}
	case 1:
		return RGB{R: 0, G: 0, B: 255}
	case 2:
		return RGB{R: 255, G: 0, B: 0}
	case 3:
		return RGB{R: 245, G: 38, B: 255}
	case 4:
		return RGB{R: 245, G: 250, B: 255}
	default:
		return RGB{}
	}
}

func transitionIDFromSeed(seed int64, levelID string, now time.Time) int {
	if seed == 0 {
		seed = now.UnixNano()
	}
	value := seed
	for _, char := range levelID {
		value = value*31 + int64(char)
	}
	if value < 0 {
		value = -value
	}
	return int(value % int64(transitionCount()))
}

func transitionCount() int {
	return 5
}

func successTransitionColor(id int, pt Point, now time.Time, startedAt time.Time) RGB {
	if startedAt.IsZero() {
		startedAt = now
	}
	progress := clampFloat(float64(now.Sub(startedAt)) / float64(transitionDuration))
	if progress >= 1 {
		return successSettleColor(pt, now)
	}
	switch id % transitionCount() {
	case 0:
		return portalWipeColor(pt, progress, now)
	case 1:
		return coinBurstColor(pt, progress, now)
	case 2:
		return scannerSweepColor(pt, progress, now)
	case 3:
		return spiralGateColor(pt, progress, now)
	default:
		return elevatorRiseColor(pt, progress, now)
	}
}

func successSettleColor(pt Point, now time.Time) RGB {
	pulse := 0.72 + 0.28*math.Sin(now.Sub(time.Unix(0, 0)).Seconds()*5+float64(pt.X+pt.Y)*0.2)
	return RGB{R: byte(20 * pulse), G: byte(255 * pulse), B: byte(80 * pulse)}
}

func portalWipeColor(pt Point, progress float64, now time.Time) RGB {
	centerX, centerY := 7.5, 15.5
	d := distanceFloat(float64(pt.X), float64(pt.Y), centerX, centerY)
	maxD := distanceFloat(0, 0, centerX, centerY)
	ring := math.Abs(d/maxD - easeInOut(progress))
	if progress < 0.2 {
		if checker(pt, now, 5) {
			return RGB{R: 0, G: 84, B: 32}
		}
		return idleTransitionColor()
	}
	if ring < 0.045 {
		return RGB{R: 245, G: 250, B: 255}
	}
	if ring < 0.11 {
		return RGB{R: 112, G: 255, B: 92}
	}
	if d/maxD < easeInOut(progress)-0.05 {
		return RGB{R: 50, G: 212, B: 255}
	}
	if checker(pt, now, 7) {
		return RGB{R: 10, G: 38, B: 96}
	}
	return idleTransitionColor()
}

func coinBurstColor(pt Point, progress float64, now time.Time) RGB {
	centerX, centerY := 7.5, 15.5
	d := distanceFloat(float64(pt.X), float64(pt.Y), centerX, centerY)
	maxD := distanceFloat(0, 0, centerX, centerY)
	wave := progress * maxD * 1.15
	if math.Abs(d-wave) < 0.55 {
		return RGB{R: 255, G: 232, B: 72}
	}
	if math.Abs(d-wave+1.2) < 0.45 {
		return RGB{R: 255, G: 142, B: 34}
	}
	if sparkle(pt, now) && progress > 0.18 && progress < 0.85 {
		colors := []RGB{
			{R: 20, G: 92, B: 255},
			{R: 50, G: 212, B: 255},
			{R: 255, G: 232, B: 72},
			{R: 245, G: 38, B: 255},
		}
		return colors[(pt.X+pt.Y+transitionFrame(now))%len(colors)]
	}
	if d < 2.4 && progress < 0.25 {
		return RGB{R: 112, G: 255, B: 92}
	}
	if d < wave-1.6 {
		return RGB{R: 0, G: 84, B: 32}
	}
	return idleTransitionColor()
}

func scannerSweepColor(pt Point, progress float64, now time.Time) RGB {
	sweep := easeInOut(progress)*float64(GridHeight+8) - 4
	if math.Abs(float64(pt.Y)-sweep) < 0.55 {
		return RGB{R: 245, G: 250, B: 255}
	}
	if math.Abs(float64(pt.Y)-sweep) < 1.6 {
		return RGB{R: 50, G: 212, B: 255}
	}
	if float64(pt.Y) < sweep {
		if (pt.X+pt.Y+transitionFrame(now)/3)%7 == 0 {
			return RGB{R: 0, G: 230, B: 62}
		}
		return RGB{R: 10, G: 38, B: 96}
	}
	if checker(pt, now, 9) {
		return RGB{R: 0, G: 84, B: 32}
	}
	return idleTransitionColor()
}

func spiralGateColor(pt Point, progress float64, now time.Time) RGB {
	centerX, centerY := 7.5, 15.5
	dx := float64(pt.X) - centerX
	dy := float64(pt.Y) - centerY
	angle := math.Atan2(dy, dx)
	if angle < 0 {
		angle += math.Pi * 2
	}
	radius := math.Sqrt(dx*dx+dy*dy) / distanceFloat(0, 0, centerX, centerY)
	spiral := math.Mod(angle/(math.Pi*2)+radius*1.25-progress*1.55+1, 1)
	if spiral < 0.055 {
		return RGB{R: 245, G: 250, B: 255}
	}
	if spiral < 0.13 {
		return RGB{R: 150, G: 54, B: 255}
	}
	if radius < easeInOut(progress)*0.95 && spiral < 0.28 {
		return RGB{R: 0, G: 230, B: 62}
	}
	if progress > 0.78 && radius < (progress-0.78)*4.2 {
		return RGB{R: 112, G: 255, B: 92}
	}
	return idleTransitionColor()
}

func elevatorRiseColor(pt Point, progress float64, now time.Time) RGB {
	columnDelay := float64((pt.Y*3+pt.X)%GridHeight) / float64(GridHeight) * 0.32
	p := clampFloat((progress - columnDelay) / 0.62)
	top := int(math.Round(float64(GridWidth) * (1 - easeOutBack(p))))
	if pt.X >= top {
		if pt.X == top || pt.X == top+1 {
			return RGB{R: 245, G: 250, B: 255}
		}
		if (pt.X+pt.Y+transitionFrame(now)/2)%5 == 0 {
			return RGB{R: 50, G: 212, B: 255}
		}
		return RGB{R: 0, G: 230, B: 62}
	}
	if p > 0.75 && checker(pt, now, 6) {
		return RGB{R: 0, G: 84, B: 32}
	}
	return idleTransitionColor()
}

func idleTransitionColor() RGB {
	return RGB{R: 13, G: 19, B: 30}
}

func transitionFrame(now time.Time) int {
	return int(now.Sub(time.Unix(0, 0)) / (30 * time.Millisecond))
}

func checker(pt Point, now time.Time, modulo int) bool {
	return (pt.X*11+pt.Y*7+transitionFrame(now))%modulo == 0
}

func sparkle(pt Point, now time.Time) bool {
	value := (pt.X*37 + pt.Y*19 + transitionFrame(now)*11) % 47
	return value == 0 || value == 5
}

func distanceFloat(x1, y1, x2, y2 float64) float64 {
	return math.Hypot(x1-x2, y1-y2)
}

func clampFloat(value float64) float64 {
	if value < 0 {
		return 0
	}
	if value > 1 {
		return 1
	}
	return value
}

func easeInOut(t float64) float64 {
	t = clampFloat(t)
	return t * t * (3 - 2*t)
}

func easeOutBack(t float64) float64 {
	t = clampFloat(t) - 1
	return 1 + 2.2*t*t*t + 1.2*t*t
}

func playerColor(index int) RGB {
	palette := []RGB{
		{R: 255, G: 0, B: 0},
		{R: 0, G: 255, B: 255},
		{R: 0, G: 255, B: 0},
		{R: 255, G: 0, B: 255},
		{R: 0, G: 0, B: 255},
		{R: 255, G: 255, B: 0},
	}
	return palette[index%len(palette)]
}

func countdownProgress(now, createdAt, startedAt time.Time) float64 {
	total := startedAt.Sub(createdAt)
	if total <= 0 {
		return 1
	}
	progress := float64(now.Sub(createdAt)) / float64(total)
	if progress < 0 {
		return 0
	}
	if progress > 1 {
		return 1
	}
	return progress
}

func countdownTileProgress(countdownProgress float64, order int, total int) float64 {
	if total <= 1 {
		return countdownProgress
	}
	// Spread the starts across the countdown, but leave a final beat where all tiles are settled.
	delay := float64(order) / float64(total-1) * 0.68
	fallDuration := 0.24
	progress := (countdownProgress - delay) / fallDuration
	if progress < 0 {
		return -1
	}
	if progress > 1 {
		return 1
	}
	return progress
}

func countdownFallingY(targetY int, tileProgress float64) int {
	if tileProgress < 0 {
		tileProgress = 0
	}
	if tileProgress > 1 {
		tileProgress = 1
	}
	eased := 1 - math.Pow(1-tileProgress, 3)
	startY := targetY - GridHeight
	y := float64(startY) + float64(targetY-startY)*eased
	return int(math.Round(y))
}

func countdownSafeTiles(frame *compiledFrame) []Point {
	if frame == nil {
		return nil
	}
	tiles := []Point{}
	for y := GridHeight - 1; y >= 0; y-- {
		for x := 0; x < GridWidth; x++ {
			point := frame.points[y][x]
			if point.present && point.kind == 0 {
				tiles = append(tiles, Point{X: x, Y: y})
			}
		}
	}
	return tiles
}

func countdownPulseGreen(pt Point, now time.Time, createdAt time.Time) RGB {
	phase := now.Sub(createdAt).Seconds()*math.Pi*4 + float64(pt.X+pt.Y)*0.22
	pulse := 0.5 + 0.5*math.Sin(phase)
	return RGB{
		R: 0,
		G: byte(232 + 23*pulse),
		B: byte(68 + 18*pulse),
	}
}

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}
