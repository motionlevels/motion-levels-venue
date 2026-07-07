package niveles

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	resultanimations "github.com/lobis/motion-levels/game-engine/internal/games/animations"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

const (
	GridWidth  = animation.GridWidth
	GridHeight = animation.GridHeight

	countdownDuration = 3 * time.Second
	tickDuration      = 25 * time.Millisecond
	// Green platform transitions render between the slow gameplay frames at the
	// engine's render rate; they must end exactly at the frame boundary so the
	// disappearance itself is the animation.
	greenAppearWindow    = 400 * time.Millisecond
	greenDisappearWindow = 800 * time.Millisecond
	greenImpactDuration  = 1100 * time.Millisecond
	blueCaptureWindow    = 600 * time.Millisecond
	damageCooldown       = 1 * time.Second
	resultDuration       = 1250 * time.Millisecond
	DefaultMusicRef      = "Motion/canciones/Background07.mp3"
	DefaultMusicVolume   = 0.18
	DefaultCoinCueRef    = "Motion/sonidos/coin.wav"
	DefaultDamageCueRef  = "Motion/sonidos/fallo.mp3"
	DefaultWinCueRef     = "Motion/sonidos/victoria.mp3"
	defaultGameID        = "level-game"
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

type AudioRefs struct {
	MusicRef         string
	MusicVolume      float64
	NarrationCueRef  string
	CoinCueRef       string
	DoubleCoinCueRef string
	StartCueRef      string
	DamageCueRef     string
	WinCueRef        string
	DefeatCueRef     string
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
	Label            string
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
	levels      []compiledLevel
	difficulty  Difficulty
	playerCount int
	resultAnimations map[string]resultanimations.CompiledLevel

	createdAt time.Time
	startedAt time.Time
	endedAt   time.Time
	restartAt time.Time

	score         int
	lives         int
	success       bool
	ended         bool
	removed       map[string]bool
	purpleHeld    map[string]bool
	purplePrimed  map[string]bool
	pressed       map[Point]bool
	greenImpacts  map[string]bool
	ripples       []greenImpactRipple
	capturedAt    map[string]time.Time
	lastDamageAt  time.Time
	lastDamageBy  map[Point]time.Time
	hitFlash      map[Point]time.Time
	pendingEvents []whackamole.Event
}

type compiledLevel struct {
	id                string
	settingsHash      string
	label             string
	description       string
	lives             int
	passScore         int
	timeLimit         time.Duration
	frameTick         time.Duration
	winCondition      string
	redAnimation      string
	victoryAnimations []string
	defeatAnimations  []string
	greenFade         bool
	greenImpact       bool
	greenLoad         bool
	greenLoadSide     string
	blueTurnGreen     bool
	blueCapture       bool
	damageGrace       bool
	totalDuration     time.Duration
	frames            []compiledFrame
	scoreUniqs        map[string]struct{}
	audio             AudioRefs
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

type greenImpactRipple struct {
	centerX   float64
	centerY   float64
	startedAt time.Time
}

type greenPlatformComponent struct {
	key     string
	centerX float64
	centerY float64
}

type cloudResponse struct {
	Levels []cloudLevel `json:"levels"`
}

type cloudLevel struct {
	ID               string     `json:"id"`
	Slug             string     `json:"slug"`
	SettingsHash     string     `json:"settings_hash"`
	Label            string     `json:"label"`
	Description      string     `json:"description"`
	Difficulty       string     `json:"difficulty"`
	Life             int        `json:"life"`
	PassScore        int        `json:"pass_score"`
	TimeLimitSeconds int        `json:"time_limit_seconds"`
	FrameTickMS      int        `json:"frame_tick_ms"`
	Rules            levelRules `json:"rules"`
	MusicRef         string     `json:"music_ref"`
	MusicVolume      *float64   `json:"music_volume"`
	NarrationCueRef  string     `json:"narration_cue_ref"`
	StartCueRef      string     `json:"start_cue_ref"`
	CoinCueRef       string     `json:"coin_cue_ref"`
	DoubleCoinCueRef string     `json:"double_coin_cue_ref"`
	DamageCueRef     string     `json:"damage_cue_ref"`
	WinCueRef        string     `json:"win_cue_ref"`
	DefeatCueRef     string     `json:"defeat_cue_ref"`
	Frames           []rawFrame `json:"frames"`
}

type levelRules struct {
	VictoryCondition          string                       `json:"victory_condition"`
	VictoryAnimations         []string                     `json:"victory_animations"`
	DefeatAnimations          []string                     `json:"defeat_animations"`
	DifficultySettings        map[string]difficultySetting `json:"difficulty_settings"`
	RedFloorAnimation         string                       `json:"red_floor_animation"`
	RedDamageGracePeriod      *bool                        `json:"red_damage_grace_period"`
	GreenPlatformLoad         *bool                        `json:"green_platform_load_animation"`
	GreenPlatformLoadSide     string                       `json:"green_platform_load_side"`
	GreenPlatformDisappear    bool                         `json:"green_platform_disappear"`
	GreenPlatformImpactRipple bool                         `json:"green_platform_impact_ripple"`
	BluePlatformTurnGreen     bool                         `json:"blue_platform_turn_green"`
	BluePlatformCaptureArea   bool                         `json:"blue_platform_capture_area"`
}

type difficultySetting struct {
	Life                     int     `json:"life"`
	FrameDurationMS          int     `json:"frame_duration_ms"`
	GameplayLives            int     `json:"gameplay_lives"`
	GameplayTimeLimitSeconds int     `json:"gameplay_time_limit_seconds"`
	SpeedMultiplier          float64 `json:"speed_multiplier"`
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
		return fmt.Errorf("niveles cell has %d fields, want at least 3", len(values))
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

func Levels() []LevelInfo {
	return []LevelInfo{{
		ID:          "level-1",
		Label:       "Nivel 1",
		Description: "Nivel creado en la plataforma",
	}}
}

func NormalizeLevel(value string) string {
	value = strings.TrimSpace(strings.ToLower(value))
	if value == "" || value == "starter" {
		return "level-1"
	}
	if n, err := strconv.Atoi(strings.TrimPrefix(value, "nivel-")); err == nil && n >= 1 {
		return "level-" + strconv.Itoa(n)
	}
	return value
}

func NormalizeDifficulty(value string) Difficulty {
	switch strings.TrimSpace(strings.ToLower(value)) {
	case "easy", "facil", "fácil":
		return DifficultyEasy
	case "hard", "dificil", "difícil":
		return DifficultyHard
	case "expert", "experto":
		return DifficultyExpert
	default:
		return DifficultyMedium
	}
}

func New(now time.Time, playerCount int, difficulty string, level string, platformURL string) *Game {
	return NewWithSeed(now, 0, playerCount, difficulty, level, platformURL)
}

func NewWithSeed(now time.Time, seed int64, playerCount int, difficulty string, level string, platformURL string) *Game {
	return NewWithSeedForGame(now, seed, playerCount, difficulty, level, platformURL, defaultGameID)
}

func NewWithSeedForGame(now time.Time, seed int64, playerCount int, difficulty string, level string, platformURL string, gameID string) *Game {
	return NewWithSeedForGameMode(now, seed, playerCount, difficulty, level, platformURL, gameID, "challenge")
}

func NewWithSeedForGameMode(now time.Time, seed int64, playerCount int, difficulty string, level string, platformURL string, gameID string, levelMode string) *Game {
	_ = seed
	diff := NormalizeDifficulty(difficulty)
	levels, err := fetchLevels(platformURL, diff, gameID, levelMode)
	levelID := NormalizeLevel(level)
	if err != nil {
		log.Printf("%s: platform level fetch failed: %v", gameID, err)
		levels = fallbackCompiledLevels(levelID)
	}
	resultAnimations := fetchResultAnimations(platformURL, levels)
	selected := selectLevel(levels, levelID)
	playerCount = clampInt(playerCount, 1, 6)
	lives := selected.lives
	if lives < 1 {
		lives = 5
	}
	return &Game{
		level:        selected,
		levels:       append([]compiledLevel(nil), levels...),
		difficulty:   diff,
		playerCount:  playerCount,
		resultAnimations: resultAnimations,
		createdAt:    now,
		startedAt:    now.Add(countdownDuration),
		lives:        lives,
		removed:      map[string]bool{},
		purpleHeld:   map[string]bool{},
		purplePrimed: map[string]bool{},
		pressed:      map[Point]bool{},
		greenImpacts: map[string]bool{},
		capturedAt:   map[string]time.Time{},
		lastDamageBy: map[Point]time.Time{},
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
	g.triggerGreenImpactLocked(pt, now)
	return g.applyPointLocked(g.pointAtLocked(pt, now), pt, now)
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
		Label:            g.level.label,
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

func (g *Game) AudioRefs() AudioRefs {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.level.audio
}

func (g *Game) DrainEvents() []whackamole.Event {
	g.mu.Lock()
	defer g.mu.Unlock()
	if len(g.pendingEvents) == 0 {
		return nil
	}
	events := append([]whackamole.Event(nil), g.pendingEvents...)
	g.pendingEvents = g.pendingEvents[:0]
	return events
}

func (g *Game) tickLocked(now time.Time) {
	g.pruneRipplesLocked(now)
	if g.ended {
		if g.success && !g.endedAt.IsZero() && !now.Before(g.endedAt.Add(resultDuration)) {
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
			if g.damageLocked(pt, now) {
				if g.ended && !g.success {
					g.queueEventLocked(whackamole.CueDefeat, "Niveles derrota")
				} else {
					g.queueEventLocked(whackamole.CueDamage, "Niveles daño")
				}
			}
			if g.ended {
				return
			}
		}
	}
	if g.hasWonLocked() {
		if g.level.winCondition == "collect_all" && g.level.passScore > 0 {
			g.score += g.level.passScore
		}
		g.success = true
		g.ended = true
		g.endedAt = now
	}
}

func (g *Game) hasWonLocked() bool {
	switch g.level.winCondition {
	case "score_at_least":
		return g.level.passScore > 0 && g.score >= g.level.passScore
	default:
		return len(g.level.scoreUniqs) > 0 && len(g.removed) >= len(g.level.scoreUniqs)
	}
}

func (g *Game) applyPointLocked(point tilePoint, pt Point, now time.Time) []whackamole.Event {
	switch point.kind {
	case 1:
		if g.captureBluePlatformLocked(point, pt, now) > 0 {
			return []whackamole.Event{{Cue: whackamole.CueCoin, Message: "Niveles punto " + strconv.Itoa(g.score)}}
		}
	case 3:
		if point.uniq != "" && !g.removed[point.uniq] && !g.purplePrimed[point.uniq] {
			g.purpleHeld[point.uniq] = true
			return []whackamole.Event{{Cue: whackamole.CueDoubleCoin, Message: "Niveles doble toque"}}
		}
	case 2:
		if g.damageLocked(pt, now) {
			if g.ended && !g.success {
				return []whackamole.Event{{Cue: whackamole.CueDefeat, Message: "Niveles derrota"}}
			}
			return []whackamole.Event{{Cue: whackamole.CueDamage, Message: "Niveles daño"}}
		}
	}
	return nil
}

func (g *Game) queueEventLocked(cue string, message string) {
	g.pendingEvents = append(g.pendingEvents, whackamole.Event{Cue: cue, Message: message})
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
	if g.level.damageGrace {
		if !g.lastDamageAt.IsZero() && now.Sub(g.lastDamageAt) < damageCooldown {
			return false
		}
		g.lastDamageAt = now
	} else {
		if g.lastDamageBy == nil {
			g.lastDamageBy = map[Point]time.Time{}
		}
		if last, ok := g.lastDamageBy[pt]; ok && now.Sub(last) < damageCooldown {
			return false
		}
		g.lastDamageBy[pt] = now
	}
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
	g.resetLevelRunLocked(g.level, now)
	g.startedAt = now
}

func (g *Game) advanceSuccessLevelLocked(now time.Time) {
	next, ok := g.nextLevelLocked()
	if !ok {
		return
	}
	g.resetLevelRunLocked(next, now)
}

func (g *Game) nextLevelLocked() (compiledLevel, bool) {
	if len(g.levels) == 0 {
		return compiledLevel{}, false
	}
	currentID := g.level.id
	for index := range g.levels {
		if g.levels[index].id != currentID {
			continue
		}
		next := index + 1
		if next >= len(g.levels) {
			return compiledLevel{}, false
		}
		return g.levels[next], true
	}
	return compiledLevel{}, false
}

func (g *Game) resetLevelRunLocked(level compiledLevel, now time.Time) {
	g.level = level
	g.createdAt = now
	g.startedAt = now.Add(countdownDuration)
	g.endedAt = time.Time{}
	g.restartAt = time.Time{}
	g.score = 0
	g.lives = g.startingLivesLocked()
	g.success = false
	g.ended = false
	g.removed = map[string]bool{}
	g.purpleHeld = map[string]bool{}
	g.purplePrimed = map[string]bool{}
	g.greenImpacts = map[string]bool{}
	g.ripples = nil
	g.capturedAt = map[string]time.Time{}
	g.lastDamageAt = time.Time{}
	g.lastDamageBy = map[Point]time.Time{}
	g.hitFlash = map[Point]time.Time{}
	g.pendingEvents = nil
}

func (g *Game) colorAtLocked(pt Point, now time.Time) RGB {
	if g.ended {
		if g.success {
			animationName := chosenResultAnimation(g.level.victoryAnimations, "victory-pulse", g.endedAt)
			if color, ok := g.catalogResultAnimationColor(animationName, pt, now); ok {
				return color
			}
			return resultAnimationColor(animationName, pt, now, g.endedAt)
		}
		animationName := chosenResultAnimation(g.level.defeatAnimations, "defeat-pulse", g.endedAt)
		if color, ok := g.catalogResultAnimationColor(animationName, pt, now); ok {
			return color
		}
		return resultAnimationColor(animationName, pt, now, g.endedAt)
	}
	if until, ok := g.hitFlash[pt]; ok && now.Before(until) {
		return RGB{R: 255, G: 236, B: 82}
	}
	if now.Before(g.startedAt) {
		return g.countdownColorAtLocked(pt, now)
	}
	point := g.pointAtLocked(pt, now)
	color := g.colorForPointLocked(pt, point, now)
	return g.greenImpactColorLocked(pt, point, color, now)
}

func (g *Game) catalogResultAnimationColor(name string, pt Point, now time.Time) (RGB, bool) {
	if len(g.resultAnimations) == 0 {
		return RGB{}, false
	}
	animationLevel, ok := g.resultAnimations[resultanimations.NormalizeLevel(name)]
	if !ok {
		return RGB{}, false
	}
	elapsed := now.Sub(g.endedAt)
	if elapsed < 0 {
		elapsed = 0
	}
	return animationLevel.ColorAtElapsed(pt.X, pt.Y, elapsed), true
}

func (g *Game) colorForPointLocked(pt Point, point tilePoint, now time.Time) RGB {
	if !point.present {
		return RGB{}
	}
	if point.kind == 2 && g.level.redAnimation == "parkour_lava" {
		return lavaColor(pt, now)
	}
	if point.kind == 0 && point.uniq != "" && g.removed[point.uniq] && g.level.blueTurnGreen {
		return g.capturedBlueColorLocked(point.uniq, now)
	}
	if point.kind == 0 && g.level.greenFade {
		return g.greenPlatformColorLocked(pt, now)
	}
	return colorForPoint(point)
}

func (g *Game) pointAtLocked(pt Point, now time.Time) tilePoint {
	point := g.rawPointAtLocked(pt, now)
	if point.uniq != "" && g.removed[point.uniq] {
		if g.level.blueTurnGreen && point.kind == 1 {
			point.kind = 0
			return point
		}
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

func (g *Game) greenPlatformColorLocked(pt Point, now time.Time) RGB {
	frame, index, elapsed := g.framePositionAtLocked(now)
	if frame == nil || index < 0 {
		return RGB{}
	}
	point := frame.points[pt.Y][pt.X]
	if !point.present || point.kind != 0 {
		return RGB{}
	}
	color := colorForPoint(point)
	if len(g.level.frames) > 1 {
		previous := g.level.frames[(index-1+len(g.level.frames))%len(g.level.frames)].points[pt.Y][pt.X]
		next := g.level.frames[(index+1)%len(g.level.frames)].points[pt.Y][pt.X]
		appearWindow := minDuration(greenAppearWindow, frame.duration/2)
		disappearWindow := minDuration(greenDisappearWindow, frame.duration/2)
		if (!previous.present || previous.kind != 0) && appearWindow > 0 && elapsed < appearWindow {
			previousTime := now.Add(-elapsed)
			previousColor := g.transitionPointColorLocked(pt, previous, previousTime)
			color = mixRGB(previousColor, color, easeInOut(float64(elapsed)/float64(appearWindow)))
		}
		if (!next.present || next.kind != 0) && disappearWindow > 0 {
			remaining := frame.duration - elapsed
			if remaining < disappearWindow {
				nextTime := now.Add(remaining)
				nextColor := g.transitionPointColorLocked(pt, next, nextTime)
				color = mixRGB(color, nextColor, 1-easeInOut(float64(remaining)/float64(disappearWindow)))
			}
		}
	}
	return color
}

func (g *Game) transitionPointColorLocked(pt Point, point tilePoint, now time.Time) RGB {
	if !point.present {
		return RGB{}
	}
	if point.kind == 2 && g.level.redAnimation == "parkour_lava" {
		return lavaColor(pt, now)
	}
	return colorForPoint(point)
}

func (g *Game) capturedBlueColorLocked(uniq string, now time.Time) RGB {
	blue := colorForPoint(tilePoint{present: true, kind: 1})
	green := colorForPoint(tilePoint{present: true, kind: 0})
	startedAt, ok := g.capturedAt[uniq]
	if !ok || now.Sub(startedAt) >= blueCaptureWindow {
		return green
	}
	if now.Before(startedAt) {
		return blue
	}
	return mixRGB(blue, green, easeInOut(float64(now.Sub(startedAt))/float64(blueCaptureWindow)))
}

func (g *Game) captureBluePlatformLocked(point tilePoint, pt Point, now time.Time) int {
	if point.uniq == "" || g.removed[point.uniq] {
		return 0
	}
	uniqs := []string{point.uniq}
	if g.level.blueCapture {
		uniqs = g.connectedBluePlatformUniqsLocked(pt, now)
	}
	if g.capturedAt == nil {
		g.capturedAt = map[string]time.Time{}
	}
	captured := 0
	for _, uniq := range uniqs {
		if uniq == "" || g.removed[uniq] {
			continue
		}
		g.removed[uniq] = true
		g.capturedAt[uniq] = now
		delete(g.purpleHeld, uniq)
		delete(g.purplePrimed, uniq)
		g.score++
		captured++
	}
	return captured
}

func (g *Game) connectedBluePlatformUniqsLocked(start Point, now time.Time) []string {
	frame := g.frameAtLocked(now)
	if frame == nil || !inBounds(start.X, start.Y) {
		return nil
	}
	first := frame.points[start.Y][start.X]
	if !first.present || first.kind != 1 {
		return nil
	}

	visited := [GridHeight][GridWidth]bool{}
	queue := []Point{start}
	visited[start.Y][start.X] = true
	for len(queue) > 0 {
		pt := queue[0]
		queue = queue[1:]
		for _, next := range []Point{
			{X: pt.X - 1, Y: pt.Y},
			{X: pt.X + 1, Y: pt.Y},
			{X: pt.X, Y: pt.Y - 1},
			{X: pt.X, Y: pt.Y + 1},
		} {
			if !inBounds(next.X, next.Y) || visited[next.Y][next.X] {
				continue
			}
			candidate := frame.points[next.Y][next.X]
			if !candidate.present || candidate.kind != 1 {
				continue
			}
			visited[next.Y][next.X] = true
			queue = append(queue, next)
		}
	}

	seen := map[string]bool{}
	uniqs := []string{}
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if !visited[y][x] {
				continue
			}
			uniq := frame.points[y][x].uniq
			if uniq == "" || seen[uniq] {
				continue
			}
			seen[uniq] = true
			uniqs = append(uniqs, uniq)
		}
	}
	return uniqs
}

func (g *Game) triggerGreenImpactLocked(pt Point, now time.Time) {
	if !g.level.greenImpact {
		return
	}
	point := g.pointAtLocked(pt, now)
	if !point.present || point.kind != 0 {
		return
	}
	component, ok := g.greenPlatformComponentLocked(pt, now)
	if !ok {
		return
	}
	if g.greenImpacts == nil {
		g.greenImpacts = map[string]bool{}
	}
	if g.greenImpacts[component.key] {
		return
	}
	g.greenImpacts[component.key] = true
	g.ripples = append(g.ripples, greenImpactRipple{
		centerX:   component.centerX,
		centerY:   component.centerY,
		startedAt: now,
	})
}

func (g *Game) greenPlatformComponentLocked(start Point, now time.Time) (greenPlatformComponent, bool) {
	frame := g.frameAtLocked(now)
	if frame == nil || !inBounds(start.X, start.Y) {
		return greenPlatformComponent{}, false
	}
	first := frame.points[start.Y][start.X]
	if !first.present || first.kind != 0 {
		return greenPlatformComponent{}, false
	}

	visited := [GridHeight][GridWidth]bool{}
	queue := []Point{start}
	visited[start.Y][start.X] = true
	count := 0
	sumX := 0.0
	sumY := 0.0
	for len(queue) > 0 {
		pt := queue[0]
		queue = queue[1:]
		count++
		sumX += float64(pt.X) + 0.5
		sumY += float64(pt.Y) + 0.5

		for _, next := range []Point{
			{X: pt.X - 1, Y: pt.Y},
			{X: pt.X + 1, Y: pt.Y},
			{X: pt.X, Y: pt.Y - 1},
			{X: pt.X, Y: pt.Y + 1},
		} {
			if !inBounds(next.X, next.Y) || visited[next.Y][next.X] {
				continue
			}
			candidate := frame.points[next.Y][next.X]
			if !candidate.present || candidate.kind != 0 {
				continue
			}
			visited[next.Y][next.X] = true
			queue = append(queue, next)
		}
	}
	if count == 0 {
		return greenPlatformComponent{}, false
	}

	var key strings.Builder
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			if visited[y][x] {
				key.WriteString(strconv.Itoa(x))
				key.WriteByte(',')
				key.WriteString(strconv.Itoa(y))
				key.WriteByte(';')
			}
		}
	}
	return greenPlatformComponent{
		key:     key.String(),
		centerX: sumX / float64(count),
		centerY: sumY / float64(count),
	}, true
}

func (g *Game) greenImpactColorLocked(pt Point, point tilePoint, color RGB, now time.Time) RGB {
	if !g.level.greenImpact || len(g.ripples) == 0 || !point.present || point.kind != 2 {
		return color
	}
	cellX := float64(pt.X) + 0.5
	cellY := float64(pt.Y) + 0.5
	result := color
	for _, ripple := range g.ripples {
		age := now.Sub(ripple.startedAt)
		if age < 0 || age > greenImpactDuration {
			continue
		}
		progress := float64(age) / float64(greenImpactDuration)
		radius := 0.35 + progress*7.0
		distance := math.Hypot(cellX-ripple.centerX, cellY-ripple.centerY)
		ring := 1 - math.Abs(distance-radius)/0.85
		strength := clampFloat(ring) * (1 - progress)
		if strength <= 0 {
			continue
		}
		result = mixRGB(result, RGB{R: 255, G: 185, B: 72}, strength*0.7)
	}
	return result
}

func (g *Game) pruneRipplesLocked(now time.Time) {
	if len(g.ripples) == 0 {
		return
	}
	active := g.ripples[:0]
	for _, ripple := range g.ripples {
		if now.Sub(ripple.startedAt) <= greenImpactDuration {
			active = append(active, ripple)
		}
	}
	g.ripples = active
}

func (g *Game) frameAtLocked(now time.Time) *compiledFrame {
	frame, _, _ := g.framePositionAtLocked(now)
	return frame
}

func (g *Game) framePositionAtLocked(now time.Time) (*compiledFrame, int, time.Duration) {
	if len(g.level.frames) == 0 || now.Before(g.startedAt) {
		return nil, -1, 0
	}
	elapsed := now.Sub(g.startedAt)
	if g.level.totalDuration > 0 {
		elapsed %= g.level.totalDuration
	}
	for i := range g.level.frames {
		frame := &g.level.frames[i]
		if elapsed < frame.duration {
			return frame, i, elapsed
		}
		elapsed -= frame.duration
	}
	last := len(g.level.frames) - 1
	return &g.level.frames[last], last, g.level.frames[last].duration
}

func (g *Game) countdownColorAtLocked(pt Point, now time.Time) RGB {
	if !g.level.greenLoad {
		return g.settledSafeZoneCountdownColorAtLocked(pt)
	}
	return g.safeZoneCountdownColorAtLocked(pt, now)
}

func (g *Game) settledSafeZoneCountdownColorAtLocked(pt Point) RGB {
	if len(g.level.frames) == 0 {
		return RGB{}
	}
	point := g.level.frames[0].points[pt.Y][pt.X]
	if !point.present || point.kind != 0 {
		return RGB{}
	}
	return colorForPoint(point)
}

func (g *Game) safeZoneCountdownColorAtLocked(pt Point, now time.Time) RGB {
	if len(g.level.frames) == 0 {
		return RGB{}
	}
	progress := countdownProgress(now, g.createdAt, g.startedAt)
	safeTiles := countdownSafeTiles(&g.level.frames[0], g.level.greenLoadSide)
	for order, target := range safeTiles {
		tileProgress := countdownTileProgress(progress, order, len(safeTiles))
		if tileProgress < 0 {
			continue
		}
		if target.X == pt.X && countdownFallingY(target.Y, tileProgress, g.level.greenLoadSide) == pt.Y {
			if tileProgress >= 1 {
				return animation.SafeZoneGreen
			}
			return countdownPulseGreen(target, now, g.createdAt)
		}
	}
	return RGB{}
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

func (g *Game) startingLivesLocked() int {
	if g.level.lives < 1 {
		return 5
	}
	return g.level.lives
}

func (g *Game) endsUnixLocked() int64 {
	if g.level.timeLimit <= 0 {
		return 0
	}
	return g.startedAt.Add(g.level.timeLimit).Unix()
}

func fetchLevels(platformURL string, diff Difficulty, gameID string, levelMode string) ([]compiledLevel, error) {
	base := strings.TrimRight(strings.TrimSpace(platformURL), "/")
	if base == "" {
		return nil, fmt.Errorf("platform URL is empty")
	}
	cleanGameID := strings.Trim(strings.TrimSpace(gameID), "/")
	if cleanGameID == "" {
		return nil, fmt.Errorf("game id is empty")
	}
	levels, err := fetchLevelsForDifficulty(base, cleanGameID, string(diff), levelMode)
	if err == nil {
		return levels, nil
	}
	return nil, err
}

func fetchLevelsForDifficulty(base string, gameID string, difficulty string, levelMode string) ([]compiledLevel, error) {
	endpoint, err := url.Parse(base + "/api/level-games/" + url.PathEscape(gameID) + "/levels")
	if err != nil {
		return nil, err
	}
	if difficulty != "" {
		query := endpoint.Query()
		query.Set("difficulty", difficulty)
		endpoint.RawQuery = query.Encode()
	}
	client := &http.Client{Timeout: 5 * time.Second}
	response, err := client.Get(endpoint.String())
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return nil, fmt.Errorf("status %d", response.StatusCode)
	}
	var payload cloudResponse
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		return nil, err
	}
	return compileCloudLevelsForModeWithDifficulty(payload.Levels, levelMode, difficulty)
}

func fetchResultAnimations(platformURL string, levels []compiledLevel) map[string]resultanimations.CompiledLevel {
	refs := resultAnimationRefs(levels)
	if len(refs) == 0 {
		return nil
	}
	animationLevels, err := resultanimations.GetOrFetchLevels(platformURL)
	if err != nil {
		log.Printf("niveles: result animation catalog fetch failed: %v", err)
		return nil
	}
	byID := map[string]resultanimations.CompiledLevel{}
	for _, level := range animationLevels {
		byID[resultanimations.NormalizeLevel(level.ID())] = level
	}
	resolved := map[string]resultanimations.CompiledLevel{}
	for ref := range refs {
		animationLevel, ok := byID[ref]
		if !ok {
			continue
		}
		resolved[ref] = animationLevel
	}
	return resolved
}

func resultAnimationRefs(levels []compiledLevel) map[string]struct{} {
	refs := map[string]struct{}{}
	for _, level := range levels {
		for _, value := range append(append([]string{}, level.victoryAnimations...), level.defeatAnimations...) {
			normalized := normalizeResultAnimation(value, "")
			if normalized == "" || isBuiltInResultAnimation(normalized) {
				continue
			}
			refs[resultanimations.NormalizeLevel(normalized)] = struct{}{}
		}
	}
	return refs
}

func compileCloudLevels(raw []cloudLevel) ([]compiledLevel, error) {
	return compileCloudLevelsForMode(raw, "challenge")
}

func compileCloudLevelsForMode(raw []cloudLevel, levelMode string) ([]compiledLevel, error) {
	return compileCloudLevelsForModeWithDifficulty(raw, levelMode, "")
}

func compileCloudLevelsForModeWithDifficulty(raw []cloudLevel, levelMode string, selectedDifficulty string) ([]compiledLevel, error) {
	challengeMode := strings.EqualFold(strings.TrimSpace(levelMode), "challenge")
	selectedDifficulty = strings.ToLower(strings.TrimSpace(selectedDifficulty))
	raw = dedupeCloudLevelsForDifficulty(raw, selectedDifficulty)
	levels := make([]compiledLevel, 0, len(raw))
	for index, level := range raw {
		id := level.Slug
		if strings.TrimSpace(id) == "" {
			id = "level-" + strconv.Itoa(index+1)
		}
		frameTick := time.Duration(level.FrameTickMS) * time.Millisecond
		if frameTick <= 0 {
			frameTick = tickDuration
		}
		settingsDifficulty := strings.ToLower(strings.TrimSpace(level.Difficulty))
		if selectedDifficulty != "" {
			settingsDifficulty = selectedDifficulty
		}
		settings, hasDifficultySettings := level.Rules.DifficultySettings[settingsDifficulty]
		hasAnyDifficultySettings := len(level.Rules.DifficultySettings) > 0
		lives := 0
		if !hasAnyDifficultySettings {
			lives = level.Life
		}
		timeLimit := time.Duration(0)
		if challengeMode && !hasAnyDifficultySettings {
			timeLimit = time.Duration(level.TimeLimitSeconds) * time.Second
		}
		if hasDifficultySettings {
			if settings.Life > 0 {
				lives = settings.Life
			}
			if challengeMode && settings.GameplayTimeLimitSeconds > 0 {
				timeLimit = time.Duration(settings.GameplayTimeLimitSeconds) * time.Second
			}
			if settings.SpeedMultiplier > 0 {
				frameTick = time.Duration(float64(frameTick) / settings.SpeedMultiplier)
				if frameTick <= 0 {
					frameTick = time.Millisecond
				}
			}
		}
		winCondition := strings.TrimSpace(level.Rules.VictoryCondition)
		if winCondition != "score_at_least" {
			winCondition = "collect_all"
		}
		compiled := compiledLevel{
			id:                NormalizeLevel(id),
			settingsHash:      strings.TrimSpace(level.SettingsHash),
			label:             level.Label,
			description:       level.Description,
			lives:             lives,
			passScore:         level.PassScore,
			timeLimit:         timeLimit,
			frameTick:         frameTick,
			winCondition:      winCondition,
			redAnimation:      normalizeRedFloorAnimation(level.Rules.RedFloorAnimation),
			victoryAnimations: normalizeResultAnimationList(level.Rules.VictoryAnimations, "victory-pulse"),
			defeatAnimations:  normalizeResultAnimationList(level.Rules.DefeatAnimations, "defeat-pulse"),
			greenFade:         level.Rules.GreenPlatformDisappear,
			greenImpact:       level.Rules.GreenPlatformImpactRipple,
			greenLoad:         boolDefaultTrue(level.Rules.GreenPlatformLoad),
			greenLoadSide:     normalizeGreenPlatformLoadSide(level.Rules.GreenPlatformLoadSide),
			blueTurnGreen:     level.Rules.BluePlatformTurnGreen,
			blueCapture:       level.Rules.BluePlatformCaptureArea,
			damageGrace:       boolPtrTrue(level.Rules.RedDamageGracePeriod),
			scoreUniqs:        map[string]struct{}{},
			audio:             normalizeAudioRefs(level),
		}
		for _, frame := range level.Frames {
			repeat := frame.Repeat
			if repeat <= 0 {
				repeat = 1
			}
			next := compiledFrame{duration: time.Duration(repeat) * frameTick}
			for _, cell := range frame.Cells {
				if !inBounds(cell.X, cell.Y) {
					continue
				}
				next.points[cell.Y][cell.X] = tilePoint{present: true, kind: cell.Kind, uniq: cell.Uniq}
				if cell.Uniq != "" && (cell.Kind == 1 || cell.Kind == 3) {
					compiled.scoreUniqs[cell.Uniq] = struct{}{}
				}
			}
			compiled.totalDuration += next.duration
			compiled.frames = append(compiled.frames, next)
		}
		if len(compiled.frames) == 0 {
			return nil, fmt.Errorf("level %s has no frames", compiled.id)
		}
		levels = append(levels, compiled)
	}
	if len(levels) == 0 {
		return nil, fmt.Errorf("no visible levels returned")
	}
	return levels, nil
}

func normalizeAudioRefs(level cloudLevel) AudioRefs {
	audio := AudioRefs{
		MusicRef:         strings.TrimSpace(level.MusicRef),
		NarrationCueRef:  strings.TrimSpace(level.NarrationCueRef),
		StartCueRef:      strings.TrimSpace(level.StartCueRef),
		CoinCueRef:       strings.TrimSpace(level.CoinCueRef),
		DoubleCoinCueRef: strings.TrimSpace(level.DoubleCoinCueRef),
		DamageCueRef:     strings.TrimSpace(level.DamageCueRef),
		WinCueRef:        strings.TrimSpace(level.WinCueRef),
		DefeatCueRef:     strings.TrimSpace(level.DefeatCueRef),
	}
	if audio.MusicRef == "" {
		audio.MusicRef = DefaultMusicRef
	}
	if level.MusicVolume == nil {
		audio.MusicVolume = DefaultMusicVolume
	} else {
		audio.MusicVolume = *level.MusicVolume
		if audio.MusicVolume < 0 {
			audio.MusicVolume = 0
		}
		if audio.MusicVolume > 1 {
			audio.MusicVolume = 1
		}
	}
	if audio.CoinCueRef == "" {
		audio.CoinCueRef = DefaultCoinCueRef
	}
	if audio.DoubleCoinCueRef == "" {
		audio.DoubleCoinCueRef = audio.CoinCueRef
	}
	if audio.DamageCueRef == "" {
		audio.DamageCueRef = DefaultDamageCueRef
	}
	if audio.WinCueRef == "" {
		audio.WinCueRef = DefaultWinCueRef
	}
	if audio.DefeatCueRef == "" {
		audio.DefeatCueRef = audio.DamageCueRef
	}
	return audio
}

func dedupeCloudLevelsForDifficulty(raw []cloudLevel, selectedDifficulty string) []cloudLevel {
	if strings.TrimSpace(selectedDifficulty) == "" || len(raw) < 2 {
		return raw
	}
	type selectedLevel struct {
		level cloudLevel
		rank  int
		order int
	}
	byKey := map[string]selectedLevel{}
	order := make([]string, 0, len(raw))
	for index, level := range raw {
		key := NormalizeLevel(level.Slug)
		if key == "" {
			key = "level-" + strconv.Itoa(index+1)
		}
		rank := difficultyLevelRank(level, selectedDifficulty)
		current, exists := byKey[key]
		if !exists {
			byKey[key] = selectedLevel{level: level, rank: rank, order: len(order)}
			order = append(order, key)
			continue
		}
		if rank > current.rank {
			byKey[key] = selectedLevel{level: level, rank: rank, order: current.order}
		}
	}
	if len(byKey) == len(raw) {
		return raw
	}
	deduped := make([]cloudLevel, 0, len(order))
	for _, key := range order {
		deduped = append(deduped, byKey[key].level)
	}
	return deduped
}

func difficultyLevelRank(level cloudLevel, selectedDifficulty string) int {
	if strings.EqualFold(strings.TrimSpace(level.Difficulty), selectedDifficulty) {
		return 3
	}
	if _, ok := level.Rules.DifficultySettings[selectedDifficulty]; ok {
		return 2
	}
	return 1
}

func selectLevel(levels []compiledLevel, id string) compiledLevel {
	for _, candidate := range levels {
		if candidate.id == id {
			return candidate
		}
	}
	return levels[0]
}

func fallbackCompiledLevels(levelID string) []compiledLevel {
	if strings.TrimSpace(levelID) == "" {
		levelID = "level-1"
	}
	levels, _ := compileCloudLevels([]cloudLevel{{
		Slug:        levelID,
		Label:       "Nivel no disponible",
		Description: "La plataforma no devolvió niveles publicados para esta partida.",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		PassScore:   0,
		FrameTickMS: 25,
		Frames: []rawFrame{{Repeat: 20, Cells: []cellTuple{
			{X: 6, Y: 14, Kind: 2},
			{X: 7, Y: 14, Kind: 2},
			{X: 8, Y: 14, Kind: 2},
			{X: 9, Y: 14, Kind: 2},
			{X: 6, Y: 15, Kind: 2},
			{X: 9, Y: 15, Kind: 2},
			{X: 6, Y: 16, Kind: 2},
			{X: 9, Y: 16, Kind: 2},
			{X: 6, Y: 17, Kind: 2},
			{X: 7, Y: 17, Kind: 2},
			{X: 8, Y: 17, Kind: 2},
			{X: 9, Y: 17, Kind: 2},
			{X: 7, Y: 15, Kind: 0},
			{X: 8, Y: 15, Kind: 0},
			{X: 7, Y: 16, Kind: 0},
			{X: 8, Y: 16, Kind: 0},
		}}},
	}})
	return levels
}

func colorForPoint(point tilePoint) RGB {
	if !point.present {
		return RGB{}
	}
	switch point.kind {
	case 0:
		return animation.SafeZoneGreen
	case 1:
		return RGB{B: 255}
	case 2:
		return RGB{R: 255}
	case 3:
		return RGB{R: 245, G: 38, B: 255}
	case 4:
		return RGB{R: 245, G: 250, B: 255}
	default:
		return RGB{}
	}
}

func normalizeRedFloorAnimation(value string) string {
	if strings.TrimSpace(value) == "parkour_lava" {
		return "parkour_lava"
	}
	return "none"
}

func normalizeGreenPlatformLoadSide(value string) string {
	if strings.TrimSpace(value) == "right" {
		return "right"
	}
	return "left"
}

func boolDefaultTrue(value *bool) bool {
	return value == nil || *value
}

func boolPtrTrue(value *bool) bool {
	return value != nil && *value
}

func lavaColor(pt Point, now time.Time) RGB {
	seconds := now.Sub(time.Unix(0, 0)).Seconds() * 0.22
	field := parkourLavaHeatField(pt, seconds)
	heat := clampFloat(0.18 + field*0.82)
	flicker := 0.92 + 0.08*math.Sin((float64(pt.X)*1.3+float64(pt.Y)*0.7+seconds*4.2)*math.Pi)
	return RGB{
		R: clampByte(math.Round((150 + 105*heat) * flicker)),
		G: clampByte(math.Round((14 + 70*heat) * flicker)),
		B: clampByte(math.Round((2 + 10*heat) * flicker)),
	}
}

func parkourLavaHeatField(pt Point, seconds float64) float64 {
	nx := float64(pt.X) / float64(GridWidth)
	ny := float64(pt.Y) / float64(GridHeight)
	return 0.5 + 0.5*math.Sin((nx*3.0+ny*1.6+seconds*0.7)*math.Pi)*math.Cos((nx*2.2-ny*3.2-seconds*0.5)*math.Pi)
}

func scaleRGB(color RGB, scale float64) RGB {
	return RGB{
		R: clampByte(math.Round(float64(color.R) * scale)),
		G: clampByte(math.Round(float64(color.G) * scale)),
		B: clampByte(math.Round(float64(color.B) * scale)),
	}
}

func mixRGB(from RGB, to RGB, amount float64) RGB {
	t := clampFloat(amount)
	return RGB{
		R: clampByte(math.Round(float64(from.R) + (float64(to.R)-float64(from.R))*t)),
		G: clampByte(math.Round(float64(from.G) + (float64(to.G)-float64(from.G))*t)),
		B: clampByte(math.Round(float64(from.B) + (float64(to.B)-float64(from.B))*t)),
	}
}

func minDuration(a, b time.Duration) time.Duration {
	if a < b {
		return a
	}
	return b
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

func resultAnimationColor(name string, pt Point, now time.Time, started time.Time) RGB {
	elapsed := now.Sub(started)
	progress := math.Mod(math.Max(0, elapsed.Seconds())/1.25, 1)
	cx := float64(GridWidth-1) / 2
	cy := float64(GridHeight-1) / 2
	dist := math.Hypot((float64(pt.X)-cx)/cx, (float64(pt.Y)-cy)/cy)
	switch normalizeResultAnimation(name, "victory-pulse") {
	case "victory-confetti":
		return victoryConfettiColor(pt, progress)
	case "victory-wave":
		wave := 0.5 + 0.5*math.Sin((float64(pt.X)/float64(GridWidth-1)+float64(pt.Y)/float64(GridHeight-1)-progress*2.6)*math.Pi*2)
		return hsvColor(0.48+wave*0.08, 0.82, 0.12+wave*0.82)
	case "victory-spark":
		seed := hashInt(pt.X*13 + pt.Y*29 + int(progress*18)*71)
		if seed%100 > 86 {
			return RGB{R: 248, G: 250, B: 252}
		}
		return hsvColor(0.11, 0.88, 0.08+0.42*math.Max(0, math.Sin((progress+float64(seed%100)/100)*math.Pi)))
	case "defeat-sweep":
		head := progress * float64(GridHeight+8)
		distance := math.Abs(float64(pt.Y) - head)
		if distance < 2.4 {
			return RGB{R: 255, G: 32, B: 56}
		}
		return scaleRGB(RGB{R: 255, G: 22, B: 34}, math.Max(0, 0.22-distance*0.018))
	case "defeat-static":
		seed := hashInt(pt.X*23 + pt.Y*41 + int(progress*20)*97)
		if seed%100 > 70 {
			return RGB{R: 255, G: byte(16 + seed%40), B: byte(24 + seed%24)}
		}
		return RGB{}
	case "defeat-pulse":
		if int(elapsed/(120*time.Millisecond))%2 == 0 {
			return RGB{R: 255, G: 22, B: 34}
		}
		return RGB{}
	default:
		ring := math.Max(0, 1-math.Abs(dist-progress*1.45)*4.2)
		pulse := 0.16 + math.Pow(ring, 1.6)*0.84
		return RGB{R: byte(20 * pulse), G: byte(255 * pulse), B: byte(80 * pulse)}
	}
}

func victoryConfettiColor(pt Point, progress float64) RGB {
	centerX := float64(GridWidth-1) / 2
	centerY := float64(GridHeight-1) / 2
	dist := math.Hypot((float64(pt.X)-centerX)/centerX, (float64(pt.Y)-centerY)/centerY)
	glow := 0.12 + 0.14*math.Max(0, 1-dist) + 0.04*math.Sin(progress*math.Pi*2)
	base := hsvColor(0.38, 0.78, glow)
	lane := pt.X/3 + pt.Y/2
	seed := hashInt(pt.X*37 + pt.Y*73 + lane*101)
	fall := math.Mod(float64(pt.Y)+progress*float64(GridHeight+10)+float64(seed%13)/3, 10)
	if fall > 2.1 {
		return base
	}
	stagger := math.Mod(float64(pt.X)+float64(seed%9)+progress*7, 6)
	if stagger > 2.8 {
		return base
	}
	colors := []RGB{
		{R: 255, G: 214, B: 64},
		{R: 80, G: 220, B: 255},
		{R: 255, G: 86, B: 184},
		{R: 98, G: 255, B: 126},
		{R: 255, G: 126, B: 55},
	}
	color := colors[seed%len(colors)]
	flash := 0.9 + 0.1*math.Sin(progress*math.Pi*2+float64(seed%360))
	return scaleRGB(color, flash)
}

func normalizeResultAnimation(value string, fallback string) string {
	clean := strings.TrimSpace(value)
	if clean == "" {
		return fallback
	}
	switch clean {
	case "pulse":
		return "victory-pulse"
	case "confetti":
		return "victory-confetti"
	case "wave":
		return "victory-wave"
	case "spark":
		return "victory-spark"
	default:
		return clean
	}
}

func isBuiltInResultAnimation(value string) bool {
	switch normalizeResultAnimation(value, "") {
	case "victory-pulse", "victory-confetti", "victory-wave", "victory-spark",
		"defeat-pulse", "defeat-static", "defeat-sweep":
		return true
	default:
		return false
	}
}

func normalizeResultAnimationList(values []string, fallback string) []string {
	unique := map[string]struct{}{}
	result := []string{}
	for _, value := range values {
		normalized := normalizeResultAnimation(value, "")
		if normalized == "" {
			continue
		}
		if _, ok := unique[normalized]; ok {
			continue
		}
		unique[normalized] = struct{}{}
		result = append(result, normalized)
	}
	if len(result) == 0 {
		return []string{fallback}
	}
	return result
}

func chosenResultAnimation(values []string, fallback string, _ time.Time) string {
	if len(values) == 0 {
		return fallback
	}
	for index := len(values) - 1; index >= 0; index-- {
		if normalized := normalizeResultAnimation(values[index], ""); normalized != "" {
			return normalized
		}
	}
	return fallback
}

func firstNonEmpty(values []string, fallback string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return fallback
}

func hashInt(value int) int {
	x := uint32(value) + 0x9e3779b9
	x ^= x >> 16
	x *= 0x85ebca6b
	x ^= x >> 13
	x *= 0xc2b2ae35
	x ^= x >> 16
	return int(x & 0x7fffffff)
}

func hsvColor(h, s, v float64) RGB {
	h = math.Mod(h, 1)
	if h < 0 {
		h += 1
	}
	i := int(h * 6)
	f := h*6 - float64(i)
	p := v * (1 - s)
	q := v * (1 - f*s)
	t := v * (1 - (1-f)*s)
	var r, g, b float64
	switch i % 6 {
	case 0:
		r, g, b = v, t, p
	case 1:
		r, g, b = q, v, p
	case 2:
		r, g, b = p, v, t
	case 3:
		r, g, b = p, q, v
	case 4:
		r, g, b = t, p, v
	default:
		r, g, b = v, p, q
	}
	return RGB{R: clampByte(r * 255), G: clampByte(g * 255), B: clampByte(b * 255)}
}

func playerColor(index int) RGB {
	colors := []RGB{
		{R: 255},
		{G: 255, B: 255},
		{G: 255},
		{R: 255, B: 255},
		{B: 255},
		{R: 255, G: 255},
	}
	return colors[index%len(colors)]
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
		// Match the multi-tile schedule: fully settled by the final beat of the countdown.
		return math.Min(countdownProgress/0.92, 1)
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

func countdownFallingY(targetY int, tileProgress float64, side string) int {
	if tileProgress < 0 {
		tileProgress = 0
	}
	if tileProgress > 1 {
		tileProgress = 1
	}
	eased := 1 - math.Pow(1-tileProgress, 3)
	startY := targetY + GridHeight
	if side == "right" {
		startY = targetY - GridHeight
	}
	y := float64(startY) + float64(targetY-startY)*eased
	return int(math.Round(y))
}

func countdownSafeTiles(frame *compiledFrame, side string) []Point {
	if frame == nil {
		return nil
	}
	tiles := []Point{}
	firstY, pastLastY, stepY := 0, GridHeight, 1
	if side == "right" {
		firstY, pastLastY, stepY = GridHeight-1, -1, -1
	}
	for y := firstY; y != pastLastY; y += stepY {
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
	return scaleRGB(animation.SafeZoneGreen, 0.78+0.22*pulse)
}

func levelNumber(id string) int {
	n, _ := strconv.Atoi(strings.TrimPrefix(id, "level-"))
	return n
}

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
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
