package temporada2

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
	transitionDuration = 1800 * time.Millisecond
	tickDuration       = 25 * time.Millisecond
	damageCooldown     = 1 * time.Second
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
	under   *tilePoint
}

type cellTuple struct {
	X    int
	Y    int
	Kind int
	Uniq string
}

type generatedLevel struct {
	Label       string
	Description string
	Lives       int
	PassScore   int
	TimeLimit   time.Duration
	Frames      []compiledFrame
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
	levels := compiled[DifficultyEasy]
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
	return DifficultyEasy
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
		if isHazardKind(g.pointAtLocked(pt, now).kind) {
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
			return []whackamole.Event{{Cue: whackamole.CueCoin, Message: "Temporada 2 punto " + strconv.Itoa(g.score)}}
		}
	case 3:
		if point.uniq != "" && !g.removed[point.uniq] && !g.purplePrimed[point.uniq] {
			g.purpleHeld[point.uniq] = true
			return []whackamole.Event{{Cue: whackamole.CueDoubleCoin, Message: "Temporada 2 doble toque"}}
		}
	case 2:
		if g.damageLocked(pt, now) {
			return []whackamole.Event{{Cue: whackamole.CueDamage, Message: "Temporada 2 daño"}}
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
		return point.underPoint()
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

func (point tilePoint) underPoint() tilePoint {
	if point.under == nil {
		return tilePoint{}
	}
	return *point.under
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
		levels, err := buildLevels()
		if err != nil {
			compiledErr = err
			return
		}
		compiled = map[Difficulty][]compiledLevel{
			DifficultyEasy:   levels,
			DifficultyMedium: levels,
			DifficultyHard:   levels,
			DifficultyExpert: levels,
		}
	})
	return compiledErr
}

func compileLevels(generated []generatedLevel) ([]compiledLevel, error) {
	levels := make([]compiledLevel, 0, len(generated))
	for index, level := range generated {
		compiledLevel := compiledLevel{
			id:         "level-" + strconv.Itoa(index+1),
			label:      level.Label,
			lives:      level.Lives,
			passScore:  level.PassScore,
			timeLimit:  level.TimeLimit,
			scoreUniqs: map[string]struct{}{},
		}
		for _, frame := range level.Frames {
			for y := 0; y < GridHeight; y++ {
				for x := 0; x < GridWidth; x++ {
					point := frame.points[y][x]
					if point.uniq != "" && (point.kind == 1 || point.kind == 3) {
						compiledLevel.scoreUniqs[point.uniq] = struct{}{}
					}
				}
			}
			compiledLevel.totalDuration += frame.duration
			compiledLevel.frames = append(compiledLevel.frames, frame)
		}
		if len(compiledLevel.frames) == 0 {
			return nil, fmt.Errorf("temporada2 level %d has no frames", index+1)
		}
		levels = append(levels, compiledLevel)
	}
	return levels, nil
}

func buildLevels() ([]compiledLevel, error) {
	generated := []generatedLevel{
		buildIslasCruzadas(),
		buildRioDeLava(),
		buildCarrusel(),
		buildPuertasRapidas(),
		buildLluviaDeMonedas(),
	}
	for _, spec := range temporada2PrototypeSpecs() {
		generated = append(generated, buildPrototypeLevel(spec))
	}
	return compileLevels(generated)
}

func newFrame(repeat int) compiledFrame {
	if repeat <= 0 {
		repeat = 1
	}
	return compiledFrame{duration: time.Duration(repeat) * tickDuration}
}

func put(frame *compiledFrame, x, y, kind int, uniq string) {
	if !inBounds(x, y) {
		return
	}
	current := frame.points[y][x]
	next := tilePoint{present: true, kind: kind, uniq: uniq}
	if !current.present {
		frame.points[y][x] = next
		return
	}

	switch kind {
	case 0:
		if current.isCollectible() || current.kind == 2 {
			next.under = tilePointPtr(current)
		}
		frame.points[y][x] = next
		return
	case 2:
		if current.kind == 0 {
			return
		}
		if current.isCollectible() {
			next.under = tilePointPtr(current)
		}
		frame.points[y][x] = next
		return
	}

	if next.isCollectible() && (current.kind == 0 || current.kind == 2) {
		current.under = tilePointPtr(next)
		frame.points[y][x] = current
		return
	}
	if next.isCollectible() {
		next.under = tilePointPtr(current)
	}
	frame.points[y][x] = next
}

func (point tilePoint) isCollectible() bool {
	return point.kind == 1 || point.kind == 3
}

func isHazardKind(kind int) bool {
	return kind == 2
}

func tilePointPtr(point tilePoint) *tilePoint {
	return &point
}

func rect(frame *compiledFrame, x0, y0, w, h, kind int, uniqPrefix string) {
	for y := y0; y < y0+h; y++ {
		for x := x0; x < x0+w; x++ {
			uniq := ""
			if uniqPrefix != "" {
				uniq = fmt.Sprintf("%s-%02d-%02d", uniqPrefix, x, y)
			}
			put(frame, x, y, kind, uniq)
		}
	}
}

func coinID(level string, index int) string {
	return level + "-coin-" + strconv.Itoa(index)
}

func addCoins(frame *compiledFrame, level string, points []Point) {
	for index, point := range points {
		put(frame, point.X, point.Y, 1, coinID(level, index+1))
	}
}

func addPurpleCoins(frame *compiledFrame, level string, points []Point) {
	for index, point := range points {
		put(frame, point.X, point.Y, 3, level+"-purple-"+strconv.Itoa(index+1))
	}
}

func buildIslasCruzadas() generatedLevel {
	coins := []Point{{1, 7}, {4, 6}, {11, 6}, {14, 7}, {2, 15}, {13, 15}, {4, 24}, {11, 24}, {7, 27}, {8, 27}}
	frames := make([]compiledFrame, 0, 120)
	for step := 0; step < 120; step++ {
		frame := newFrame(4)
		rect(&frame, 5, 12, 6, 8, 0, "")
		rect(&frame, 2, 2, 3, 4, 0, "")
		rect(&frame, 11, 2, 3, 4, 0, "")
		rect(&frame, 2, 26, 3, 4, 0, "")
		rect(&frame, 11, 26, 3, 4, 0, "")
		addCoins(&frame, "s2l1", coins)

		left := 1 + pingPong(step/3, 5)
		right := 14 - pingPong((step+9)/3, 5)
		for y := 0; y < GridHeight; y++ {
			put(&frame, left, y, 2, "")
			put(&frame, right, y, 2, "")
		}
		frames = append(frames, frame)
	}
	return generatedLevel{
		Label:       "Islas cruzadas",
		Description: "Cuatro islas seguras, escáneres rojos y monedas repartidas para moverse en equipo.",
		Lives:       8,
		PassScore:   20,
		TimeLimit:   90 * time.Second,
		Frames:      frames,
	}
}

func buildRioDeLava() generatedLevel {
	coins := []Point{{2, 3}, {13, 3}, {5, 8}, {10, 8}, {2, 13}, {14, 13}, {6, 18}, {11, 18}, {3, 23}, {13, 23}, {7, 29}, {10, 29}}
	purpleCoins := []Point{{7, 3}, {8, 13}, {4, 18}, {11, 23}}
	frames := make([]compiledFrame, 0, 144)
	for step := 0; step < 144; step++ {
		frame := newFrame(4)
		rect(&frame, 0, 0, GridWidth, 4, 0, "")
		rect(&frame, 0, 28, GridWidth, 4, 0, "")
		addCoins(&frame, "s2l2", coins)
		addPurpleCoins(&frame, "s2l2", purpleCoins)

		for band := 0; band < 5; band++ {
			y := 5 + band*5
			for x := 0; x < GridWidth; x++ {
				put(&frame, x, y, 2, "")
				put(&frame, x, y+1, 2, "")
			}
			gateA := 1 + pingPong((step+band*9)/5, 11)
			gateB := 13 - pingPong((step+band*7+18)/6, 10)
			rect(&frame, gateA, y, 3, 2, 0, "")
			rect(&frame, gateB, y+1, 2, 1, 0, "")
		}
		frames = append(frames, frame)
	}
	return generatedLevel{
		Label:       "Río de lava",
		Description: "Cruza barreras rojas usando compuertas verdes móviles y recoge monedas entre descansos.",
		Lives:       8,
		PassScore:   24,
		TimeLimit:   95 * time.Second,
		Frames:      frames,
	}
}

func buildCarrusel() generatedLevel {
	coins := []Point{{7, 3}, {8, 3}, {2, 8}, {13, 8}, {4, 15}, {11, 15}, {2, 23}, {13, 23}, {7, 28}, {8, 28}, {5, 20}, {10, 11}}
	frames := make([]compiledFrame, 0, 132)
	arms := []Point{{0, -1}, {1, 0}, {0, 1}, {-1, 0}}
	for step := 0; step < 132; step++ {
		frame := newFrame(4)
		rect(&frame, 5, 13, 6, 6, 0, "")
		addCoins(&frame, "s2l3", coins)

		cx, cy := 7.5, 15.5
		armPhase := (step / 7) % len(arms)
		for _, base := range []int{0, 2} {
			dir := arms[(armPhase+base)%len(arms)]
			for distance := 2; distance < 15; distance++ {
				x := int(math.Round(cx + float64(dir.X*distance)))
				y := int(math.Round(cy + float64(dir.Y*distance)))
				put(&frame, x, y, 2, "")
				if dir.X == 0 {
					put(&frame, x-1, y, 2, "")
				} else {
					put(&frame, x, y-1, 2, "")
				}
			}
		}
		frames = append(frames, frame)
	}
	return generatedLevel{
		Label:       "Carrusel",
		Description: "Una base central segura, brazos rojos que rotan por turnos y monedas alrededor.",
		Lives:       7,
		PassScore:   28,
		TimeLimit:   100 * time.Second,
		Frames:      frames,
	}
}

func buildPuertasRapidas() generatedLevel {
	coins := []Point{{1, 2}, {14, 3}, {3, 7}, {12, 8}, {6, 13}, {9, 18}, {3, 23}, {12, 24}, {1, 29}, {14, 29}, {7, 30}, {8, 30}}
	frames := make([]compiledFrame, 0, 150)
	for step := 0; step < 150; step++ {
		frame := newFrame(4)
		for y := 0; y < GridHeight; y += 5 {
			rect(&frame, 0, y, GridWidth, 2, 0, "")
		}
		addCoins(&frame, "s2l4", coins)

		for gate := 0; gate < 5; gate++ {
			y := 4 + gate*5
			open := (step/10 + gate*2) % 4
			for x := 0; x < GridWidth; x++ {
				if x/4 == open {
					continue
				}
				put(&frame, x, y, 2, "")
				put(&frame, x, y+1, 2, "")
			}
		}
		frames = append(frames, frame)
	}
	return generatedLevel{
		Label:       "Puertas rápidas",
		Description: "Lee las puertas que abren por columnas, entra a tiempo y limpia las monedas de cada sala.",
		Lives:       7,
		PassScore:   30,
		TimeLimit:   105 * time.Second,
		Frames:      frames,
	}
}

func buildLluviaDeMonedas() generatedLevel {
	coins := []Point{{2, 4}, {5, 4}, {10, 4}, {13, 4}, {3, 10}, {7, 10}, {11, 10}, {5, 16}, {10, 16}, {3, 22}, {7, 22}, {12, 22}, {2, 28}, {6, 28}, {10, 28}, {14, 28}}
	frames := make([]compiledFrame, 0, 168)
	for step := 0; step < 168; step++ {
		frame := newFrame(4)
		rect(&frame, 6, 13, 4, 6, 0, "")
		rect(&frame, 0, 0, 3, 3, 0, "")
		rect(&frame, 13, 0, 3, 3, 0, "")
		rect(&frame, 0, 29, 3, 3, 0, "")
		rect(&frame, 13, 29, 3, 3, 0, "")
		addCoins(&frame, "s2l5", coins)

		for diagonal := -GridHeight; diagonal < GridWidth; diagonal += 6 {
			offset := diagonal + step/3
			for y := 0; y < GridHeight; y++ {
				x := offset + y/2
				if x >= 0 && x < GridWidth {
					put(&frame, x, y, 2, "")
					put(&frame, x-1, y, 2, "")
				}
			}
		}
		frames = append(frames, frame)
	}
	return generatedLevel{
		Label:       "Lluvia de monedas",
		Description: "Final de temporada: refugios claros, diagonales rojas y muchas monedas para coordinarse.",
		Lives:       9,
		PassScore:   40,
		TimeLimit:   120 * time.Second,
		Frames:      frames,
	}
}

type prototypeSpec struct {
	Number      int
	Label       string
	Description string
	Pattern     int
	Lives       int
	TimeLimit   time.Duration
}

func temporada2PrototypeSpecs() []prototypeSpec {
	return []prototypeSpec{
		{6, "Puente norte", "Cruza barreras con compuertas verdes que alternan desde arriba.", 0, 8, 95 * time.Second},
		{7, "Patios cruzados", "Refugios repartidos y escáneres que obligan a cambiar de patio.", 1, 8, 95 * time.Second},
		{8, "Diagonal suave", "Lee barridos diagonales lentos y limpia objetivos entre pasos.", 2, 8, 95 * time.Second},
		{9, "Anillo central", "Defiende el centro mientras los brazos rojos rodean la pista.", 3, 7, 100 * time.Second},
		{10, "Salas dobles", "Puertas alternas conectan salas verdes con monedas en pasillos.", 4, 8, 100 * time.Second},
		{11, "Puente sur", "La misma idea de puente, ahora con ritmos desplazados.", 0, 7, 95 * time.Second},
		{12, "Patios rápidos", "Escáneres más cerrados alrededor de islas seguras.", 1, 7, 100 * time.Second},
		{13, "Diagonal partida", "Dos barridos diagonales se cruzan y dejan ventanas cortas.", 2, 7, 100 * time.Second},
		{14, "Anillo estrecho", "El centro es seguro pero los radios llegan con menos aviso.", 3, 7, 105 * time.Second},
		{15, "Salas en cadena", "Avanza por salas conectadas recogiendo puntos por turnos.", 4, 8, 105 * time.Second},
		{16, "Puente de calma", "Compuertas amplias para probar lectura cooperativa sin prisa.", 0, 9, 110 * time.Second},
		{17, "Patios espejados", "Los escáneres entran desde lados opuestos con zonas de descanso.", 1, 8, 105 * time.Second},
		{18, "Diagonal doble", "Dos familias de diagonales obligan a cambiar de carril.", 2, 7, 105 * time.Second},
		{19, "Anillo exterior", "Usa el borde y el centro para escapar de cruces rojos.", 3, 8, 105 * time.Second},
		{20, "Salas rápidas", "Puertas con ritmo más vivo y objetivos en descansos cortos.", 4, 7, 105 * time.Second},
		{21, "Puente partido", "Las compuertas verdes no siempre alinean: esperad al hueco bueno.", 0, 7, 110 * time.Second},
		{22, "Patios de riesgo", "Patios pequeños, escáneres anchos y monedas cerca de los bordes.", 1, 7, 110 * time.Second},
		{23, "Diagonal larga", "Barridos amplios para probar rutas largas de extremo a extremo.", 2, 7, 110 * time.Second},
		{24, "Anillo vivo", "Los refugios cambian alrededor del centro mientras gira la amenaza.", 3, 7, 110 * time.Second},
		{25, "Salas finales", "Última versión de salas con puertas encadenadas y doble toque.", 4, 7, 115 * time.Second},
		{26, "Puente caótico", "Compuertas con ritmos distintos para separar roles del equipo.", 0, 7, 115 * time.Second},
		{27, "Patios finales", "Más lectura lateral y puntos morados en zonas expuestas.", 1, 7, 115 * time.Second},
		{28, "Diagonal final", "Barridos diagonales densos con descanso justo entre oleadas.", 2, 7, 115 * time.Second},
		{29, "Anillo final", "Cruces rojos intensos alrededor del núcleo seguro.", 3, 7, 115 * time.Second},
		{30, "Gran cierre", "Salas, puertas y objetivos de doble toque para cerrar la selección.", 4, 8, 120 * time.Second},
	}
}

func buildPrototypeLevel(spec prototypeSpec) generatedLevel {
	frames := make([]compiledFrame, 0, 144)
	for step := 0; step < 144; step++ {
		frame := newFrame(4)
		switch spec.Pattern {
		case 0:
			drawBridgePrototype(&frame, spec.Number, step)
		case 1:
			drawCourtyardPrototype(&frame, spec.Number, step)
		case 2:
			drawDiagonalPrototype(&frame, spec.Number, step)
		case 3:
			drawRingPrototype(&frame, spec.Number, step)
		default:
			drawRoomsPrototype(&frame, spec.Number, step)
		}
		addPrototypeTargets(&frame, spec.Number)
		frames = append(frames, frame)
	}
	return generatedLevel{
		Label:       spec.Label,
		Description: spec.Description,
		Lives:       spec.Lives,
		PassScore:   22 + spec.Number/2,
		TimeLimit:   spec.TimeLimit,
		Frames:      frames,
	}
}

func addPrototypeTargets(frame *compiledFrame, number int) {
	blue := prototypeBlueTargets(number)
	purple := prototypePurpleTargets(number)
	addCoins(frame, "s2l"+strconv.Itoa(number), blue)
	addPurpleCoins(frame, "s2l"+strconv.Itoa(number), purple)
}

func prototypeBlueTargets(number int) []Point {
	templates := [][]Point{
		{{2, 4}, {7, 4}, {13, 4}, {3, 10}, {11, 14}, {5, 19}, {13, 24}, {8, 29}},
		{{1, 8}, {6, 5}, {12, 7}, {4, 14}, {10, 17}, {14, 21}, {3, 26}, {9, 29}},
		{{3, 3}, {10, 5}, {14, 9}, {5, 13}, {1, 17}, {11, 21}, {6, 26}, {13, 29}},
		{{7, 3}, {2, 9}, {13, 9}, {4, 15}, {11, 16}, {2, 23}, {13, 24}, {8, 29}},
		{{1, 3}, {14, 3}, {5, 8}, {10, 11}, {3, 16}, {12, 19}, {6, 25}, {14, 29}},
	}
	return templates[number%len(templates)]
}

func prototypePurpleTargets(number int) []Point {
	templates := [][]Point{
		{{9, 9}, {4, 23}},
		{{8, 11}, {13, 25}},
		{{2, 12}, {9, 24}},
		{{6, 20}, {12, 4}},
		{{7, 14}, {11, 27}},
	}
	return templates[(number/2)%len(templates)]
}

func drawBridgePrototype(frame *compiledFrame, number, step int) {
	rect(frame, 0, 0, GridWidth, 3, 0, "")
	rect(frame, 0, 29, GridWidth, 3, 0, "")
	rect(frame, 0, 14, 4, 4, 0, "")
	rect(frame, 12, 14, 4, 4, 0, "")
	for band := 0; band < 5; band++ {
		y := 5 + band*5
		for x := 0; x < GridWidth; x++ {
			put(frame, x, y, 2, "")
			put(frame, x, y+1, 2, "")
		}
		width := 2 + (number+band)%2
		gate := 1 + pingPong((step+number*3+band*8)/(4+(number+band)%3), 13-width)
		rect(frame, gate, y, width, 2, 0, "")
		if band%2 == 1 {
			other := 13 - pingPong((step+band*7+number)/6, 10)
			rect(frame, other, y+1, 2, 1, 0, "")
		}
	}
}

func drawCourtyardPrototype(frame *compiledFrame, number, step int) {
	rect(frame, 1, 2, 4, 5, 0, "")
	rect(frame, 11, 2, 4, 5, 0, "")
	rect(frame, 1, 25, 4, 5, 0, "")
	rect(frame, 11, 25, 4, 5, 0, "")
	rect(frame, 6, 13, 4, 6, 0, "")
	left := 2 + pingPong((step+number)/4, 4)
	right := 13 - pingPong((step+number*2)/5, 4)
	for y := 0; y < GridHeight; y++ {
		put(frame, left, y, 2, "")
		put(frame, right, y, 2, "")
	}
	sweepY := 4 + pingPong((step+number*3)/6, 24)
	for x := 0; x < GridWidth; x++ {
		if x >= 6 && x < 10 {
			continue
		}
		put(frame, x, sweepY, 2, "")
	}
}

func drawDiagonalPrototype(frame *compiledFrame, number, step int) {
	for y := 2; y < GridHeight; y += 6 {
		x := 1 + ((y/2 + number) % 11)
		rect(frame, x, y, 4, 2, 0, "")
	}
	rect(frame, 0, 0, 3, 3, 0, "")
	rect(frame, 13, 29, 3, 3, 0, "")
	for diagonal := -GridHeight; diagonal < GridWidth; diagonal += 7 {
		offset := diagonal + (step+number*2)/4
		for y := 0; y < GridHeight; y++ {
			x := offset + y/2
			put(frame, x, y, 2, "")
			if number%2 == 0 {
				put(frame, x+1, y, 2, "")
			}
		}
	}
	for diagonal := 0; diagonal < GridWidth+GridHeight; diagonal += 9 {
		offset := diagonal - (step+number)/5
		for y := 0; y < GridHeight; y++ {
			x := offset - y/3
			put(frame, x, y, 2, "")
		}
	}
}

func drawRingPrototype(frame *compiledFrame, number, step int) {
	rect(frame, 5, 12, 6, 8, 0, "")
	for x := 2; x < 14; x++ {
		put(frame, x, 4, 0, "")
		put(frame, x, 27, 0, "")
	}
	for y := 6; y < 26; y++ {
		put(frame, 2, y, 0, "")
		put(frame, 13, y, 0, "")
	}
	phase := (step / (6 + number%3)) % 4
	for distance := 0; distance < 18; distance++ {
		switch phase {
		case 0:
			put(frame, 7, distance, 2, "")
			put(frame, 8, distance, 2, "")
		case 1:
			put(frame, distance-2, 15, 2, "")
			put(frame, distance-2, 16, 2, "")
		case 2:
			put(frame, 7, GridHeight-1-distance, 2, "")
			put(frame, 8, GridHeight-1-distance, 2, "")
		default:
			put(frame, GridWidth+1-distance, 15, 2, "")
			put(frame, GridWidth+1-distance, 16, 2, "")
		}
	}
	ringY := 6 + pingPong((step+number)/5, 20)
	for x := 3; x < 13; x++ {
		put(frame, x, ringY, 2, "")
	}
}

func drawRoomsPrototype(frame *compiledFrame, number, step int) {
	for room := 0; room < 4; room++ {
		y := 1 + room*8
		rect(frame, 1, y, 5, 5, 0, "")
		rect(frame, 10, y, 5, 5, 0, "")
	}
	for door := 0; door < 4; door++ {
		y := 6 + door*8
		open := (step/9 + door + number) % 4
		for x := 0; x < GridWidth; x++ {
			if x/4 == open {
				rect(frame, x, y, 1, 2, 0, "")
				continue
			}
			put(frame, x, y, 2, "")
			put(frame, x, y+1, 2, "")
		}
	}
	xSweep := 1 + pingPong((step+number*2)/7, 13)
	for y := 0; y < GridHeight; y++ {
		if y%8 < 5 {
			continue
		}
		put(frame, xSweep, y, 2, "")
	}
}

func pingPong(step, max int) int {
	if max <= 0 {
		return 0
	}
	period := max * 2
	value := step % period
	if value < 0 {
		value += period
	}
	if value > max {
		return period - value
	}
	return value
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

func fallbackLevels() []LevelInfo {
	out := make([]LevelInfo, 30)
	for i := range out {
		out[i] = LevelInfo{ID: "level-" + strconv.Itoa(i+1), Label: fmt.Sprintf("Nivel %d", i+1), Description: "Temporada 2"}
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
