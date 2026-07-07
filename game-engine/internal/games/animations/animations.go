package animations

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

const (
	GridWidth           = animation.GridWidth
	GridHeight          = animation.GridHeight
	tickDuration        = 50 * time.Millisecond
	rotationDuration    = 60 * time.Second
	DefaultMusicRef     = "Motion/canciones/Background01.mp3"
	DefaultMusicVolume  = 0.10
	DefaultCoinCueRef   = "Motion/sonidos/coin.wav"
	DefaultDamageCueRef = "Motion/sonidos/fallo.mp3"
	DefaultWinCueRef    = "Motion/sonidos/victoria.mp3"
	levelCacheDuration  = 60 * time.Second
	levelFetchTimeout   = 20 * time.Second
)

type RGB = animation.RGB

type compiledTileEffect struct {
	label string
	color RGB
	press string
	cue   string
}

type compiledFrame struct {
	duration time.Duration
	points   [GridHeight][GridWidth]tilePoint
}

type compiledPressureEffect struct {
	kind      string
	preset    string
	duration  time.Duration
	procedure *compiledProcedure
}

type tilePoint struct {
	present bool
	kind    int
}

type CompiledLevel struct {
	id             string
	settingsHash   string
	label          string
	description    string
	featured       bool
	frameTick      time.Duration
	totalDuration  time.Duration
	frames         []compiledFrame
	procedure      *compiledProcedure
	pressureEffect *compiledPressureEffect
	tileEffects    map[int]compiledTileEffect
	audio          AudioRefs
}

func (cl CompiledLevel) ID() string           { return cl.id }
func (cl CompiledLevel) Label() string        { return cl.label }
func (cl CompiledLevel) Description() string  { return cl.description }
func (cl CompiledLevel) Featured() bool       { return cl.featured }
func (cl CompiledLevel) MusicRef() string     { return cl.audio.MusicRef }
func (cl CompiledLevel) MusicVolume() float64 { return cl.audio.MusicVolume }

func (cl CompiledLevel) ColorAtElapsed(x int, y int, elapsed time.Duration) RGB {
	if !inBounds(x, y) {
		return RGB{}
	}
	frameIndex := 0
	if cl.frameTick > 0 {
		frameIndex = int(elapsed / cl.frameTick)
	}
	return cl.previewColorAt(x, y, elapsed, frameIndex)
}

type PreviewFrame struct {
	Pixels string `json:"pixels"`
}

type AudioRefs struct {
	MusicRef         string
	MusicVolume      float64
	CoinCueRef       string
	DoubleCoinCueRef string
	DamageCueRef     string
	WinCueRef        string
	DefeatCueRef     string
	PressureCueRef   string
}

type Game struct {
	mu sync.Mutex

	level             CompiledLevel
	levels            []CompiledLevel
	platformURL       string
	refreshOnRotation bool
	rotationSeed      int64
	rotationEvery     time.Duration
	rotationIndex     int64
	refreshInFlight   bool
	startedAt         time.Time
	pressed           map[Point]bool
	pressureEvents    map[Point]time.Time
}

type Point struct {
	X int
	Y int
}

func New(now time.Time, playerCount int, difficulty string, level string, platformURL string) *Game {
	return NewWithSeed(now, 0, playerCount, difficulty, level, platformURL)
}

func NewWithSeed(now time.Time, seed int64, playerCount int, difficulty string, level string, platformURL string) *Game {
	_ = playerCount
	_ = difficulty
	levels, err := GetOrFetchLevels(platformURL)
	if err != nil {
		log.Printf("animations: cloud animation fetch failed: %v", err)
		levels = fallbackCompiledLevels()
	}
	selected := selectLevelForStart(levels, NormalizeLevel(level), seed, now)
	return &Game{
		level:          selected,
		startedAt:      now,
		pressed:        map[Point]bool{},
		pressureEvents: map[Point]time.Time{},
	}
}

func NewRandomRotationWithSeed(now time.Time, seed int64, playerCount int, difficulty string, platformURL string) *Game {
	return NewScreensaverWithSeed(now, seed, playerCount, difficulty, platformURL, rotationDuration)
}

func NewScreensaver(now time.Time, playerCount int, difficulty string, platformURL string, rotationEvery time.Duration) *Game {
	return NewScreensaverWithSeed(now, 0, playerCount, difficulty, platformURL, rotationEvery)
}

func NewScreensaverWithSeed(now time.Time, seed int64, playerCount int, difficulty string, platformURL string, rotationEvery time.Duration) *Game {
	_ = playerCount
	_ = difficulty
	if rotationEvery <= 0 {
		rotationEvery = rotationDuration
	}
	levels := CachedLevels()
	if len(levels) == 0 {
		levels = screensaverFallbackLevels()
	}
	levels = screensaverLevels(levels)
	selected := rotatingLevelAt(levels, seed, 0, -1)
	game := &Game{
		level:             selected,
		levels:            levels,
		platformURL:       platformURL,
		refreshOnRotation: true,
		rotationSeed:      seed,
		rotationEvery:     rotationEvery,
		rotationIndex:     0,
		startedAt:         now,
		pressed:           map[Point]bool{},
		pressureEvents:    map[Point]time.Time{},
	}
	game.startRefresh()
	return game
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if !inBounds(event.X, event.Y) {
		return nil
	}
	g.mu.Lock()
	defer g.mu.Unlock()
	g.updateRotationLocked(now)

	pt := Point{X: event.X, Y: event.Y}
	if event.Pressed {
		g.pressed[pt] = true
		if g.pressureEvents == nil {
			g.pressureEvents = map[Point]time.Time{}
		}
		g.pressureEvents[pt] = now
	} else {
		delete(g.pressed, pt)
		return nil
	}

	// Map the effect press/cue action to the standard cue event
	var cueName string
	point := g.rawPointAtLocked(pt, now)
	if point.present {
		if eff, ok := g.level.tileEffects[point.kind]; ok {
			switch eff.cue {
			case "coin":
				cueName = whackamole.CueCoin
			case "doubleCoin":
				cueName = whackamole.CueDoubleCoin
			case "damage":
				cueName = whackamole.CueDamage
			case "win":
				cueName = whackamole.CueWin
			default:
				// fallback to standard mapping based on press behavior
				switch eff.press {
				case "score":
					cueName = whackamole.CueCoin
				case "primeThenScore":
					cueName = whackamole.CueDoubleCoin
				case "damage":
					cueName = whackamole.CueDamage
				}
			}
			if cueName != "" {
				return []whackamole.Event{{Cue: cueName, Message: "Animación toque " + eff.label}}
			}
		}
	}

	if g.level.audio.PressureCueRef != "" {
		cueName = whackamole.CuePressure
	}

	if cueName != "" {
		return []whackamole.Event{{Cue: cueName, Message: "Animación presión"}}
	}
	return nil
}

func (g *Game) Render(now time.Time) []RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.updateRotationLocked(now)
	g.cleanupPressureEventsLocked(now)
	frame := make([]RGB, GridWidth*GridHeight)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			frame[y*GridWidth+x] = g.colorAtLocked(Point{X: x, Y: y}, now)
		}
	}
	return frame
}

func (g *Game) colorAtLocked(pt Point, now time.Time) RGB {
	base := RGB{}
	if g.level.procedure != nil {
		elapsed := g.renderElapsedLocked(now)
		frameIndex := 0
		if g.level.frameTick > 0 {
			frameIndex = int(elapsed / g.level.frameTick)
		}
		color, err := g.level.procedure.colorAt(pt.X, pt.Y, timeSeconds(elapsed.Seconds()), frameIndex)
		if err == nil {
			base = color
			return g.applyPressureEffectLocked(pt, base, now, elapsed, frameIndex)
		}
	}
	point := g.rawPointAtLocked(pt, now)
	if !point.present {
		return g.applyPressureEffectLocked(pt, base, now, g.renderElapsedLocked(now), 0)
	}
	if eff, ok := g.level.tileEffects[point.kind]; ok {
		base = eff.color
	}
	return g.applyPressureEffectLocked(pt, base, now, g.renderElapsedLocked(now), 0)
}

func (g *Game) applyPressureEffectLocked(pt Point, base RGB, now time.Time, elapsed time.Duration, frameIndex int) RGB {
	effect := g.level.pressureEffect
	if effect == nil || effect.duration <= 0 || len(g.pressureEvents) == 0 {
		return base
	}
	events := make([]struct {
		point     Point
		startedAt time.Time
	}, 0, len(g.pressureEvents))
	for point, startedAt := range g.pressureEvents {
		age := now.Sub(startedAt)
		if age >= 0 && age <= effect.duration {
			events = append(events, struct {
				point     Point
				startedAt time.Time
			}{point: point, startedAt: startedAt})
		}
	}
	sort.Slice(events, func(i, j int) bool {
		return events[i].startedAt.Before(events[j].startedAt)
	})
	out := base
	for _, event := range events {
		age := now.Sub(event.startedAt)
		progress := clampFloat(age.Seconds()/effect.duration.Seconds(), 0, 1)
		distance := math.Hypot(float64(pt.X-event.point.X), float64(pt.Y-event.point.Y))
		if effect.kind == "dsl" && effect.procedure != nil {
			color, err := effect.procedure.colorAtWithVariables(pt.X, pt.Y, timeSeconds(age.Seconds()), frameIndex, map[string]float64{
				"press_x":        float64(event.point.X),
				"press_y":        float64(event.point.Y),
				"press_age":      age.Seconds(),
				"press_progress": progress,
				"press_distance": distance,
				"base_r":         float64(out.R),
				"base_g":         float64(out.G),
				"base_b":         float64(out.B),
			})
			if err == nil {
				out = color
			}
			continue
		}
		out = applyPresetPressureEffect(out, effect.preset, progress, distance, event.point, pt)
	}
	return out
}

func (g *Game) cleanupPressureEventsLocked(now time.Time) {
	effect := g.level.pressureEffect
	if effect == nil || effect.duration <= 0 || len(g.pressureEvents) == 0 {
		return
	}
	for point, startedAt := range g.pressureEvents {
		if now.Sub(startedAt) > effect.duration {
			delete(g.pressureEvents, point)
		}
	}
}

func (g *Game) rawPointAtLocked(pt Point, now time.Time) tilePoint {
	frame := g.frameAtLocked(now)
	if frame == nil {
		return tilePoint{}
	}
	return frame.points[pt.Y][pt.X]
}

func (g *Game) frameAtLocked(now time.Time) *compiledFrame {
	if len(g.level.frames) == 0 {
		return nil
	}
	elapsed := g.renderElapsedLocked(now)
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

func (g *Game) elapsedLocked(now time.Time) time.Duration {
	elapsed := now.Sub(g.startedAt)
	if elapsed < 0 {
		return 0
	}
	return elapsed
}

func (g *Game) renderElapsedLocked(now time.Time) time.Duration {
	elapsed := g.elapsedLocked(now)
	if g.rotationEvery <= 0 {
		return elapsed
	}
	return elapsed % g.rotationEvery
}

func (g *Game) updateRotationLocked(now time.Time) {
	if len(g.levels) == 0 || g.rotationEvery <= 0 {
		return
	}
	elapsed := g.elapsedLocked(now)
	nextRotationIndex := int64(elapsed / g.rotationEvery)
	if nextRotationIndex == g.rotationIndex {
		return
	}
	if g.refreshOnRotation {
		g.startRefreshLocked()
	}
	previous := indexOfLevel(g.levels, g.level.id)
	g.level = rotatingLevelAt(g.levels, g.rotationSeed, nextRotationIndex, previous)
	g.rotationIndex = nextRotationIndex
	g.pressed = map[Point]bool{}
	g.pressureEvents = map[Point]time.Time{}
}

func (g *Game) startRefresh() {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.startRefreshLocked()
}

func (g *Game) startRefreshLocked() {
	if !g.refreshOnRotation || g.refreshInFlight || strings.TrimSpace(g.platformURL) == "" {
		return
	}
	g.refreshInFlight = true
	platformURL := g.platformURL
	go func() {
		levels, err := RefreshLevels(platformURL)
		g.mu.Lock()
		defer g.mu.Unlock()
		g.refreshInFlight = false
		if err != nil {
			log.Printf("animations: screensaver refresh failed: %v", err)
			return
		}
		if candidates := screensaverLevels(levels); len(candidates) > 0 {
			previousLevelsKey := levelListKey(g.levels)
			g.levels = candidates
			cycleChanged := previousLevelsKey != levelListKey(candidates)
			if indexOfLevel(g.levels, g.level.id) < 0 || (cycleChanged && !g.currentLevelFeaturedLocked() && anyFeatured(candidates)) {
				g.level = rotatingLevelAt(g.levels, g.rotationSeed, g.rotationIndex, -1)
			}
		}
	}()
}

func screensaverLevels(levels []CompiledLevel) []CompiledLevel {
	if len(levels) == 0 {
		return levels
	}
	featured := make([]CompiledLevel, 0, len(levels))
	for _, level := range levels {
		if level.featured {
			featured = append(featured, level)
		}
	}
	if len(featured) > 0 {
		return featured
	}
	return levels
}

func (g *Game) currentLevelFeaturedLocked() bool {
	for _, level := range g.levels {
		if level.id == g.level.id {
			return level.featured
		}
	}
	return false
}

func anyFeatured(levels []CompiledLevel) bool {
	for _, level := range levels {
		if level.featured {
			return true
		}
	}
	return false
}

func levelListKey(levels []CompiledLevel) string {
	if len(levels) == 0 {
		return ""
	}
	var builder strings.Builder
	for _, level := range levels {
		builder.WriteString(level.id)
		builder.WriteByte(':')
		if level.featured {
			builder.WriteByte('1')
		} else {
			builder.WriteByte('0')
		}
		builder.WriteByte(';')
	}
	return builder.String()
}

func rotatingLevelAt(levels []CompiledLevel, seed int64, rotationIndex int64, previous int) CompiledLevel {
	if len(levels) == 0 {
		return CompiledLevel{}
	}
	if len(levels) == 1 || previous < 0 || previous >= len(levels) {
		index := int(uintHashFloat(float64(seed/9973)+float64(rotationIndex)*131.0) % uint32(len(levels)))
		return levels[index]
	}

	index := int(uintHashFloat(float64(seed/9973)+float64(rotationIndex)*131.0) % uint32(len(levels)-1))
	if index >= previous {
		index++
	}
	return levels[index]
}

func indexOfLevel(levels []CompiledLevel, id string) int {
	for index, level := range levels {
		if level.id == id {
			return index
		}
	}
	return -1
}

func (g *Game) AudioRefs() AudioRefs {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.level.audio
}

type cloudResponse struct {
	Levels []cloudLevel `json:"levels"`
}

type cloudLevel struct {
	ID               string                `json:"id"`
	Slug             string                `json:"slug"`
	SettingsHash     string                `json:"settings_hash"`
	Label            string                `json:"label"`
	Description      string                `json:"description"`
	Difficulty       string                `json:"difficulty"`
	Life             int                   `json:"life"`
	PassScore        int                   `json:"pass_score"`
	TimeLimitSeconds int                   `json:"time_limit_seconds"`
	FrameTickMS      int                   `json:"frame_tick_ms"`
	MusicRef         string                `json:"music_ref"`
	MusicVolume      *float64              `json:"music_volume"`
	CoinCueRef       string                `json:"coin_cue_ref"`
	DoubleCoinCueRef string                `json:"double_coin_cue_ref"`
	DamageCueRef     string                `json:"damage_cue_ref"`
	WinCueRef        string                `json:"win_cue_ref"`
	DefeatCueRef     string                `json:"defeat_cue_ref"`
	TileEffects      map[string]TileEffect `json:"tile_effects"`
	Frames           []rawFrame            `json:"frames"`
	Rules            cloudRules            `json:"rules"`
}

type cloudRules struct {
	AnimationSource animationSource `json:"animation_source"`
	CatalogFeatured bool            `json:"catalog_featured"`
}

type animationSource struct {
	Type                 string               `json:"type"`
	Language             string               `json:"language"`
	Code                 string               `json:"code"`
	Params               map[string]any       `json:"params"`
	Seed                 float64              `json:"seed"`
	LoopSeconds          float64              `json:"loop_seconds"`
	ReferenceLoopSeconds float64              `json:"reference_loop_seconds"`
	PressureEffect       pressureEffectSource `json:"pressure_effect"`
	PressureSound        pressureSoundSource  `json:"pressure_sound"`
}

type animationProcedureSource = animationSource

type pressureEffectSource struct {
	Type            string         `json:"type"`
	Preset          string         `json:"preset"`
	Code            string         `json:"code"`
	Params          map[string]any `json:"params"`
	Seed            float64        `json:"seed"`
	DurationSeconds float64        `json:"duration_seconds"`
}

type pressureSoundSource struct {
	Type   string `json:"type"`
	CueRef string `json:"cue_ref"`
}

type TileEffect struct {
	ID    string `json:"id"`
	Label string `json:"label"`
	Color string `json:"color"`
	Press string `json:"press"`
	Cue   string `json:"cue,omitempty"`
}

type rawFrame struct {
	Repeat int         `json:"r"`
	Cells  []cellTuple `json:"c"`
}

type cellTuple struct {
	X    int
	Y    int
	Kind int
}

func (c *cellTuple) UnmarshalJSON(data []byte) error {
	var values []json.RawMessage
	if err := json.Unmarshal(data, &values); err != nil {
		return err
	}
	if len(values) < 3 {
		return fmt.Errorf("animations cell has %d fields, want at least 3", len(values))
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
	return nil
}

func NormalizeLevel(value string) string {
	value = strings.TrimSpace(strings.ToLower(value))
	if value == "" || value == "starter" {
		return "arcoiris"
	}
	return value
}

func GetLabel(id string) string {
	cacheMu.Lock()
	defer cacheMu.Unlock()
	for _, cl := range cachedLevels {
		if cl.id == id {
			return cl.label
		}
	}
	parts := strings.Split(id, "-")
	for i, part := range parts {
		if len(part) > 0 {
			parts[i] = strings.ToUpper(part[0:1]) + part[1:]
		}
	}
	return strings.Join(parts, " ")
}

var (
	cacheMu      sync.Mutex
	cachedLevels []CompiledLevel
	cacheExpire  time.Time
)

func CachedLevels() []CompiledLevel {
	cacheMu.Lock()
	defer cacheMu.Unlock()
	if len(cachedLevels) == 0 {
		return nil
	}
	levels := make([]CompiledLevel, len(cachedLevels))
	copy(levels, cachedLevels)
	return levels
}

func GetOrFetchLevels(platformURL string) ([]CompiledLevel, error) {
	cacheMu.Lock()
	if time.Now().Before(cacheExpire) && len(cachedLevels) > 0 {
		levels := make([]CompiledLevel, len(cachedLevels))
		copy(levels, cachedLevels)
		cacheMu.Unlock()
		return levels, nil
	}
	cacheMu.Unlock()

	levels, err := fetchLevels(platformURL)
	if err != nil {
		cacheMu.Lock()
		defer cacheMu.Unlock()
		if len(cachedLevels) > 0 {
			levels := make([]CompiledLevel, len(cachedLevels))
			copy(levels, cachedLevels)
			return levels, nil
		}
		return nil, err
	}
	cacheMu.Lock()
	cachedLevels = levels
	cacheExpire = time.Now().Add(levelCacheDuration)
	cacheMu.Unlock()
	return levels, nil
}

func RefreshLevels(platformURL string) ([]CompiledLevel, error) {
	levels, err := fetchLevels(platformURL)
	if err != nil {
		return nil, err
	}
	cacheMu.Lock()
	cachedLevels = levels
	cacheExpire = time.Now().Add(levelCacheDuration)
	cacheMu.Unlock()
	return levels, nil
}

func fetchLevels(platformURL string) ([]CompiledLevel, error) {
	base := strings.TrimRight(strings.TrimSpace(platformURL), "/")
	if base == "" {
		return nil, fmt.Errorf("platform URL is empty")
	}
	endpoint, err := url.Parse(base + "/api/level-games/animations/levels")
	if err != nil {
		return nil, err
	}
	query := endpoint.Query()
	query.Set("summary", "0")
	endpoint.RawQuery = query.Encode()
	client := &http.Client{Timeout: levelFetchTimeout}
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

func compileCloudLevels(raw []cloudLevel) ([]CompiledLevel, error) {
	levels := make([]CompiledLevel, 0, len(raw))
	for index, level := range raw {
		id := level.Slug
		if strings.TrimSpace(id) == "" {
			id = "level-" + strconv.Itoa(index+1)
		}
		frameTick := time.Duration(level.FrameTickMS) * time.Millisecond
		if frameTick <= 0 {
			frameTick = tickDuration
		}
		compiled := CompiledLevel{
			id:           NormalizeLevel(id),
			settingsHash: strings.TrimSpace(level.SettingsHash),
			label:        level.Label,
			description:  level.Description,
			featured:     level.Rules.CatalogFeatured,
			frameTick:    frameTick,
			tileEffects:  map[int]compiledTileEffect{},
			audio:        normalizeAudioRefs(level),
		}

		// Compile tile effects
		for kindStr, eff := range level.TileEffects {
			kind, err := strconv.Atoi(kindStr)
			if err != nil {
				continue
			}
			compiled.tileEffects[kind] = compiledTileEffect{
				label: eff.Label,
				color: parseHexColor(eff.Color),
				press: eff.Press,
				cue:   eff.Cue,
			}
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
				next.points[cell.Y][cell.X] = tilePoint{present: true, kind: cell.Kind}
			}
			compiled.totalDuration += next.duration
			compiled.frames = append(compiled.frames, next)
		}
		if isProcedureSource(level.Rules.AnimationSource) {
			procedure, err := compileProcedureSource(animationProcedureSource(level.Rules.AnimationSource))
			if err != nil {
				if len(compiled.frames) == 0 {
					return nil, fmt.Errorf("animation %s has invalid procedural source: %w", compiled.id, err)
				}
				log.Printf("animations: animation %s has invalid procedural source, using baked frames: %v", compiled.id, err)
			} else {
				compiled.procedure = procedure
				if compiled.totalDuration <= 0 {
					compiled.totalDuration = time.Duration(procedure.loopSeconds * float64(time.Second))
				}
			}
		}
		if pressureEffect, err := compilePressureEffect(level.Rules.AnimationSource.PressureEffect, level.Rules.AnimationSource.Seed); err != nil {
			log.Printf("animations: animation %s has invalid pressure effect: %v", compiled.id, err)
		} else {
			compiled.pressureEffect = pressureEffect
		}
		if len(compiled.frames) == 0 && compiled.procedure == nil {
			return nil, fmt.Errorf("animation %s has no frames", compiled.id)
		}
		levels = append(levels, compiled)
	}
	if len(levels) == 0 {
		return nil, fmt.Errorf("no visible animations returned")
	}
	return levels, nil
}

func isProcedureSource(source animationSource) bool {
	return source.Type == "procedure" && source.Language == "motion-dsl-v1" && strings.TrimSpace(source.Code) != ""
}

func compilePressureEffect(source pressureEffectSource, fallbackSeed float64) (*compiledPressureEffect, error) {
	effectType := strings.TrimSpace(source.Type)
	if effectType == "" || effectType == "none" {
		return nil, nil
	}
	duration := time.Duration(clampFloat(positiveFloat(source.DurationSeconds, 0.75), 0.15, 2.5) * float64(time.Second))
	if effectType == "preset" {
		preset := strings.TrimSpace(source.Preset)
		if preset != "ripple" && preset != "spark" && preset != "glow" {
			preset = "ripple"
		}
		return &compiledPressureEffect{kind: "preset", preset: preset, duration: duration}, nil
	}
	if effectType != "dsl" {
		return nil, nil
	}
	procedure, err := compileProcedureSource(animationProcedureSource{
		Type:                 "procedure",
		Language:             "motion-dsl-v1",
		Code:                 source.Code,
		Params:               source.Params,
		Seed:                 finiteFloat(source.Seed, finiteFloat(fallbackSeed, 1)),
		LoopSeconds:          duration.Seconds(),
		ReferenceLoopSeconds: duration.Seconds(),
	})
	if err != nil {
		return nil, err
	}
	return &compiledPressureEffect{kind: "dsl", duration: duration, procedure: procedure}, nil
}

func applyPresetPressureEffect(base RGB, preset string, progress float64, distance float64, event Point, point Point) RGB {
	fade := math.Pow(1-progress, 0.82)
	switch preset {
	case "spark":
		core := math.Max(0, 1-distance/2.8)
		rays := math.Max(0, math.Sin(float64(point.X-event.X)*2.1+float64(point.Y-event.Y)*1.4+progress*math.Pi*8))
		strength := clampFloat((core*0.95+rays*core*0.28)*math.Pow(1-progress, 1.5), 0, 1)
		return mixRGB(base, RGB{R: 255, G: 232, B: 120}, strength)
	case "glow":
		strength := clampFloat(math.Max(0, 1-distance/5.5)*fade, 0, 1)
		return mixRGB(base, RGB{R: 94, G: 234, B: 212}, strength)
	default:
		radius := progress * 7.4
		ring := math.Max(0, 1-math.Abs(distance-radius)/1.05)
		core := math.Max(0, 1-distance/1.8) * math.Pow(1-progress, 2)
		strength := clampFloat((ring*0.95+core*0.5)*fade, 0, 1)
		return mixRGB(base, RGB{R: 125, G: 211, B: 252}, strength)
	}
}

func mixRGB(base RGB, target RGB, amount float64) RGB {
	t := clampFloat(amount, 0, 1)
	return RGB{
		R: clampByteFloat(float64(base.R) + (float64(target.R)-float64(base.R))*t),
		G: clampByteFloat(float64(base.G) + (float64(target.G)-float64(base.G))*t),
		B: clampByteFloat(float64(base.B) + (float64(target.B)-float64(base.B))*t),
	}
}

func parseHexColor(hexStr string) RGB {
	hexStr = strings.TrimPrefix(hexStr, "#")
	if len(hexStr) != 6 {
		return RGB{}
	}
	r, err1 := strconv.ParseUint(hexStr[0:2], 16, 8)
	g, err2 := strconv.ParseUint(hexStr[2:4], 16, 8)
	b, err3 := strconv.ParseUint(hexStr[4:6], 16, 8)
	if err1 != nil || err2 != nil || err3 != nil {
		return RGB{}
	}
	return RGB{R: byte(r), G: byte(g), B: byte(b)}
}

func normalizeAudioRefs(level cloudLevel) AudioRefs {
	audio := AudioRefs{
		MusicRef:         strings.TrimSpace(level.MusicRef),
		CoinCueRef:       strings.TrimSpace(level.CoinCueRef),
		DoubleCoinCueRef: strings.TrimSpace(level.DoubleCoinCueRef),
		DamageCueRef:     strings.TrimSpace(level.DamageCueRef),
		WinCueRef:        strings.TrimSpace(level.WinCueRef),
		DefeatCueRef:     strings.TrimSpace(level.DefeatCueRef),
		PressureCueRef:   normalizePressureSoundRef(level.Rules.AnimationSource.PressureSound),
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

func normalizePressureSoundRef(source pressureSoundSource) string {
	if strings.TrimSpace(source.Type) != "cue" {
		return ""
	}
	return strings.TrimSpace(source.CueRef)
}

func selectLevel(levels []CompiledLevel, id string) CompiledLevel {
	for _, candidate := range levels {
		if candidate.id == id {
			return candidate
		}
	}
	return levels[0]
}

func selectLevelForStart(levels []CompiledLevel, id string, seed int64, now time.Time) CompiledLevel {
	if len(levels) == 0 {
		return CompiledLevel{}
	}
	if strings.TrimSpace(id) != "" {
		return selectLevel(levels, id)
	}
	candidates := make([]CompiledLevel, 0, len(levels))
	for _, level := range levels {
		if level.featured {
			candidates = append(candidates, level)
		}
	}
	if len(candidates) == 0 {
		candidates = levels
	}
	index := int(uintHashFloat(float64(seed)/9973.0+float64(now.UnixNano()%1_000_000)) % uint32(len(candidates)))
	return candidates[index]
}

func PreviewFrames(platformURL string, id string, frameCount int) ([]PreviewFrame, error) {
	levels, err := GetOrFetchLevels(platformURL)
	if err != nil {
		return nil, err
	}
	selected := selectLevel(levels, NormalizeLevel(id))
	if frameCount < 2 {
		frameCount = 2
	}
	if frameCount > 24 {
		frameCount = 24
	}
	loopDuration := selected.totalDuration
	if loopDuration <= 0 {
		loopDuration = 4 * time.Second
	}
	frames := make([]PreviewFrame, 0, frameCount)
	for index := 0; index < frameCount; index++ {
		elapsed := time.Duration(float64(loopDuration) * float64(index) / float64(frameCount))
		frames = append(frames, PreviewFrame{Pixels: selected.previewPixels(elapsed)})
	}
	return frames, nil
}

func (cl CompiledLevel) previewPixels(elapsed time.Duration) string {
	var builder strings.Builder
	builder.Grow(GridWidth * GridHeight * 6)
	frameIndex := 0
	if cl.frameTick > 0 {
		frameIndex = int(elapsed / cl.frameTick)
	}
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			color := cl.previewColorAt(x, y, elapsed, frameIndex)
			builder.WriteString(hexByte(color.R))
			builder.WriteString(hexByte(color.G))
			builder.WriteString(hexByte(color.B))
		}
	}
	return builder.String()
}

func (cl CompiledLevel) previewColorAt(x, y int, elapsed time.Duration, frameIndex int) RGB {
	if cl.procedure != nil {
		color, err := cl.procedure.colorAt(x, y, timeSeconds(elapsed.Seconds()), frameIndex)
		if err == nil {
			return color
		}
	}
	frame := cl.previewFrameAt(elapsed)
	if frame == nil {
		return RGB{}
	}
	point := frame.points[y][x]
	if !point.present {
		return RGB{}
	}
	if eff, ok := cl.tileEffects[point.kind]; ok {
		return eff.color
	}
	return RGB{}
}

func (cl CompiledLevel) previewFrameAt(elapsed time.Duration) *compiledFrame {
	if len(cl.frames) == 0 {
		return nil
	}
	if cl.totalDuration > 0 {
		elapsed %= cl.totalDuration
	}
	for index := range cl.frames {
		frame := &cl.frames[index]
		if elapsed < frame.duration {
			return frame
		}
		elapsed -= frame.duration
	}
	return &cl.frames[len(cl.frames)-1]
}

func hexByte(value byte) string {
	const digits = "0123456789abcdef"
	return string([]byte{digits[value>>4], digits[value&0x0f]})
}

func fallbackCompiledLevels() []CompiledLevel {
	// Fallback to simple rainbow-ish moving pattern
	compiled := CompiledLevel{
		id:          "arcoiris",
		label:       "Arcoíris (Respaldo)",
		description: "Respaldo local cuando la plataforma no está disponible.",
		frameTick:   50 * time.Millisecond,
		tileEffects: map[int]compiledTileEffect{
			0: {label: "Verde", color: RGB{G: 230, B: 62}, press: "safe"},
			1: {label: "Cian", color: RGB{R: 20, G: 92, B: 255}, press: "score", cue: "coin"},
			2: {label: "Rojo", color: RGB{R: 255, G: 28, B: 40}, press: "damage", cue: "damage"},
			3: {label: "Morado", color: RGB{R: 245, G: 38, B: 255}, press: "primeThenScore", cue: "doubleCoin"},
		},
		audio: AudioRefs{
			MusicRef:     DefaultMusicRef,
			MusicVolume:  DefaultMusicVolume,
			CoinCueRef:   DefaultCoinCueRef,
			DamageCueRef: DefaultDamageCueRef,
			WinCueRef:    DefaultWinCueRef,
		},
	}

	for frameIdx := 0; frameIdx < 4; frameIdx++ {
		next := compiledFrame{duration: 500 * time.Millisecond}
		for y := 0; y < GridHeight; y++ {
			for x := 0; x < GridWidth; x++ {
				kind := (x + y + frameIdx) % 4
				next.points[y][x] = tilePoint{present: true, kind: kind}
			}
		}
		compiled.totalDuration += next.duration
		compiled.frames = append(compiled.frames, next)
	}

	return []CompiledLevel{compiled}
}

func screensaverFallbackLevels() []CompiledLevel {
	compiled := CompiledLevel{
		id:            "salvapantallas",
		label:         "Salvapantallas",
		description:   "Esperando animaciones visibles de la plataforma.",
		frameTick:     50 * time.Millisecond,
		totalDuration: time.Second,
		tileEffects: map[int]compiledTileEffect{
			0: {label: "Reposo", color: RGB{}, press: "safe"},
		},
		audio: AudioRefs{
			MusicRef:    DefaultMusicRef,
			MusicVolume: DefaultMusicVolume,
		},
	}
	next := compiledFrame{duration: time.Second}
	compiled.frames = append(compiled.frames, next)
	return []CompiledLevel{compiled}
}

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}
