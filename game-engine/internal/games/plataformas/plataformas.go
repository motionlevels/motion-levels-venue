package plataformas

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
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

const (
	GridWidth  = animation.GridWidth
	GridHeight = animation.GridHeight

	countdownDuration = 3 * time.Second
	tickDuration      = 25 * time.Millisecond
	// Green platform transition fades render between the slow gameplay
	// frames at the engine's render rate; they must end exactly at the
	// frame boundary so the disappearance itself is the animation.
	greenAppearWindow    = 400 * time.Millisecond
	greenDisappearWindow = 800 * time.Millisecond
	damageCooldown       = 1 * time.Second
	DefaultMusicRef      = "Motion/canciones/Background07.mp3"
	DefaultMusicVolume   = 0.18
	DefaultCoinCueRef    = "Motion/sonidos/coin.wav"
	DefaultDamageCueRef  = "Motion/sonidos/fallo.mp3"
	DefaultWinCueRef     = "Motion/sonidos/victoria.mp3"
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
	CoinCueRef       string
	DoubleCoinCueRef string
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
}

type compiledLevel struct {
	id            string
	settingsHash  string
	label         string
	description   string
	lives         int
	passScore     int
	timeLimit     time.Duration
	frameTick     time.Duration
	winCondition  string
	redAnimation  string
	greenFade     bool
	totalDuration time.Duration
	frames        []compiledFrame
	scoreUniqs    map[string]struct{}
	audio         AudioRefs
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
	CoinCueRef       string     `json:"coin_cue_ref"`
	DoubleCoinCueRef string     `json:"double_coin_cue_ref"`
	DamageCueRef     string     `json:"damage_cue_ref"`
	WinCueRef        string     `json:"win_cue_ref"`
	DefeatCueRef     string     `json:"defeat_cue_ref"`
	Frames           []rawFrame `json:"frames"`
}

type levelRules struct {
	VictoryCondition       string `json:"victory_condition"`
	RedFloorAnimation      string `json:"red_floor_animation"`
	GreenPlatformDisappear bool   `json:"green_platform_disappear"`
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
		return fmt.Errorf("plataformas cell has %d fields, want at least 3", len(values))
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
		Description: "Nivel de plataformas creado en la nube",
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
	return NewWithSeedForGame(now, seed, playerCount, difficulty, level, platformURL, "plataformas")
}

func NewWithSeedForGame(now time.Time, seed int64, playerCount int, difficulty string, level string, platformURL string, gameID string) *Game {
	_ = seed
	diff := NormalizeDifficulty(difficulty)
	levels, err := fetchLevels(platformURL, diff, gameID)
	if err != nil {
		log.Printf("%s: cloud level fetch failed: %v", gameID, err)
		levels = fallbackCompiledLevels()
	}
	selected := selectLevel(levels, NormalizeLevel(level))
	playerCount = clampInt(playerCount, 1, 6)
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

func (g *Game) tickLocked(now time.Time) {
	if g.ended {
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
	if g.hasWonLocked() {
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
		if point.uniq != "" && !g.removed[point.uniq] {
			g.removed[point.uniq] = true
			delete(g.purpleHeld, point.uniq)
			delete(g.purplePrimed, point.uniq)
			g.score++
			return []whackamole.Event{{Cue: whackamole.CueCoin, Message: "Plataformas punto " + strconv.Itoa(g.score)}}
		}
	case 3:
		if point.uniq != "" && !g.removed[point.uniq] && !g.purplePrimed[point.uniq] {
			g.purpleHeld[point.uniq] = true
			return []whackamole.Event{{Cue: whackamole.CueDoubleCoin, Message: "Plataformas doble toque"}}
		}
	case 2:
		if g.damageLocked(pt, now) {
			if g.ended && !g.success {
				return []whackamole.Event{{Cue: whackamole.CueDefeat, Message: "Plataformas derrota"}}
			}
			return []whackamole.Event{{Cue: whackamole.CueDamage, Message: "Plataformas daño"}}
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
	g.createdAt = now
	g.startedAt = now
	g.endedAt = time.Time{}
	g.restartAt = time.Time{}
	g.score = 0
	g.lives = g.startingLivesLocked()
	g.success = false
	g.ended = false
	g.removed = map[string]bool{}
	g.purpleHeld = map[string]bool{}
	g.purplePrimed = map[string]bool{}
	g.lastDamageAt = time.Time{}
	g.hitFlash = map[Point]time.Time{}
}

func (g *Game) colorAtLocked(pt Point, now time.Time) RGB {
	if g.ended {
		if g.success {
			return successColor(pt, now)
		}
		return g.failureColorAtLocked(pt, now)
	}
	if until, ok := g.hitFlash[pt]; ok && now.Before(until) {
		return RGB{R: 255, G: 236, B: 82}
	}
	if now.Before(g.startedAt) {
		return g.countdownColorAtLocked(pt, now)
	}
	point := g.pointAtLocked(pt, now)
	return g.colorForPointLocked(pt, point, now)
}

func (g *Game) colorForPointLocked(pt Point, point tilePoint, now time.Time) RGB {
	if !point.present {
		return RGB{}
	}
	if point.kind == 2 && g.level.redAnimation == "parkour_lava" {
		return lavaColor(pt, now)
	}
	if point.kind == 0 && g.level.greenFade {
		return g.greenPlatformColorLocked(pt, now)
	}
	return colorForPoint(point)
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

func (g *Game) greenPlatformColorLocked(pt Point, now time.Time) RGB {
	frame, index, elapsed := g.framePositionAtLocked(now)
	if frame == nil || index < 0 {
		return RGB{}
	}
	point := frame.points[pt.Y][pt.X]
	if !point.present || point.kind != 0 {
		return RGB{}
	}
	scale := 1.0
	if len(g.level.frames) > 1 {
		previous := g.level.frames[(index-1+len(g.level.frames))%len(g.level.frames)].points[pt.Y][pt.X]
		next := g.level.frames[(index+1)%len(g.level.frames)].points[pt.Y][pt.X]
		appearWindow := minDuration(greenAppearWindow, frame.duration/2)
		disappearWindow := minDuration(greenDisappearWindow, frame.duration/2)
		if (!previous.present || previous.kind != 0) && appearWindow > 0 && elapsed < appearWindow {
			scale = easeInOut(float64(elapsed) / float64(appearWindow))
		}
		if (!next.present || next.kind != 0) && disappearWindow > 0 {
			remaining := frame.duration - elapsed
			if remaining < disappearWindow {
				fade := easeInOut(float64(remaining) / float64(disappearWindow))
				if fade < scale {
					scale = fade
				}
			}
		}
	}
	return scaleRGB(colorForPoint(point), scale)
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

func (g *Game) failureColorAtLocked(pt Point, now time.Time) RGB {
	if int(now.Sub(g.endedAt)/(120*time.Millisecond))%2 == 0 {
		return RGB{R: 255, G: 22, B: 34}
	}
	return RGB{}
}

func (g *Game) countdownColorAtLocked(pt Point, now time.Time) RGB {
	if len(g.level.frames) == 0 {
		return RGB{}
	}
	point := g.level.frames[0].points[pt.Y][pt.X]
	if point.kind != 0 {
		return RGB{}
	}
	if int(now.Sub(g.createdAt)/(180*time.Millisecond))%2 == 0 {
		return RGB{G: 140}
	}
	return RGB{G: 255}
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

func fetchLevels(platformURL string, diff Difficulty, gameID string) ([]compiledLevel, error) {
	base := strings.TrimRight(strings.TrimSpace(platformURL), "/")
	if base == "" {
		return nil, fmt.Errorf("platform URL is empty")
	}
	cleanGameID := strings.Trim(strings.TrimSpace(gameID), "/")
	if cleanGameID == "" {
		cleanGameID = "plataformas"
	}
	endpoint, err := url.Parse(base + "/api/level-games/" + url.PathEscape(cleanGameID) + "/levels")
	if err != nil {
		return nil, err
	}
	query := endpoint.Query()
	query.Set("difficulty", string(diff))
	endpoint.RawQuery = query.Encode()
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
	return compileCloudLevels(payload.Levels)
}

func compileCloudLevels(raw []cloudLevel) ([]compiledLevel, error) {
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
		winCondition := strings.TrimSpace(level.Rules.VictoryCondition)
		if winCondition != "score_at_least" {
			winCondition = "collect_all"
		}
		compiled := compiledLevel{
			id:           NormalizeLevel(id),
			settingsHash: strings.TrimSpace(level.SettingsHash),
			label:        level.Label,
			description:  level.Description,
			lives:        level.Life,
			passScore:    level.PassScore,
			timeLimit:    time.Duration(level.TimeLimitSeconds) * time.Second,
			frameTick:    frameTick,
			winCondition: winCondition,
			redAnimation: normalizeRedFloorAnimation(level.Rules.RedFloorAnimation),
			greenFade:    level.Rules.GreenPlatformDisappear,
			scoreUniqs:   map[string]struct{}{},
			audio:        normalizeAudioRefs(level),
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
		return nil, fmt.Errorf("no published levels returned")
	}
	return levels, nil
}

func normalizeAudioRefs(level cloudLevel) AudioRefs {
	audio := AudioRefs{
		MusicRef:         strings.TrimSpace(level.MusicRef),
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

func selectLevel(levels []compiledLevel, id string) compiledLevel {
	for _, candidate := range levels {
		if candidate.id == id {
			return candidate
		}
	}
	return levels[0]
}

func fallbackCompiledLevels() []compiledLevel {
	frame := rawFrame{Repeat: 20, Cells: []cellTuple{
		{X: 7, Y: 14, Kind: 0},
		{X: 8, Y: 14, Kind: 0},
		{X: 7, Y: 15, Kind: 0},
		{X: 8, Y: 15, Kind: 0},
		{X: 3, Y: 5, Kind: 1, Uniq: "fallback-coin-1"},
		{X: 12, Y: 25, Kind: 1, Uniq: "fallback-coin-2"},
		{X: 0, Y: 10, Kind: 2},
		{X: 15, Y: 20, Kind: 2},
		{X: 5, Y: 22, Kind: 3, Uniq: "fallback-purple-1"},
	}}
	levels, _ := compileCloudLevels([]cloudLevel{{
		Slug:        "level-1",
		Label:       "Nivel de respaldo",
		Description: "Respaldo local cuando la plataforma no está disponible.",
		Difficulty:  string(DifficultyMedium),
		Life:        5,
		PassScore:   2,
		FrameTickMS: 25,
		Frames:      []rawFrame{frame},
	}})
	return levels
}

func colorForPoint(point tilePoint) RGB {
	if !point.present {
		return RGB{}
	}
	switch point.kind {
	case 0:
		return RGB{G: 230, B: 62}
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

func normalizeRedFloorAnimation(value string) string {
	if strings.TrimSpace(value) == "parkour_lava" {
		return "parkour_lava"
	}
	return "none"
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

func successColor(pt Point, now time.Time) RGB {
	pulse := 0.72 + 0.28*float64((pt.X+pt.Y+int(now.UnixMilli()/90))%4)/3
	return RGB{R: byte(20 * pulse), G: byte(255 * pulse), B: byte(80 * pulse)}
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
