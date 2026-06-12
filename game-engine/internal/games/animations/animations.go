package animations

import (
	"encoding/json"
	"fmt"
	"log"
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
	GridWidth           = animation.GridWidth
	GridHeight          = animation.GridHeight
	tickDuration        = 50 * time.Millisecond
	DefaultMusicRef     = "Motion/canciones/Background01.mp3"
	DefaultMusicVolume  = 0.10
	DefaultCoinCueRef   = "Motion/sonidos/coin.wav"
	DefaultDamageCueRef = "Motion/sonidos/fallo.mp3"
	DefaultWinCueRef    = "Motion/sonidos/victoria.mp3"
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

type tilePoint struct {
	present bool
	kind    int
}

type CompiledLevel struct {
	id            string
	settingsHash  string
	label         string
	description   string
	frameTick     time.Duration
	totalDuration time.Duration
	frames        []compiledFrame
	procedure     *compiledProcedure
	tileEffects   map[int]compiledTileEffect
	audio         AudioRefs
}

func (cl CompiledLevel) ID() string           { return cl.id }
func (cl CompiledLevel) Label() string        { return cl.label }
func (cl CompiledLevel) Description() string  { return cl.description }
func (cl CompiledLevel) MusicRef() string     { return cl.audio.MusicRef }
func (cl CompiledLevel) MusicVolume() float64 { return cl.audio.MusicVolume }

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
}

type Game struct {
	mu sync.Mutex

	level     CompiledLevel
	startedAt time.Time
	pressed   map[Point]bool
}

type Point struct {
	X int
	Y int
}

func New(now time.Time, playerCount int, difficulty string, level string, platformURL string) *Game {
	return NewWithSeed(now, 0, playerCount, difficulty, level, platformURL)
}

func NewWithSeed(now time.Time, seed int64, playerCount int, difficulty string, level string, platformURL string) *Game {
	_ = seed
	_ = playerCount
	_ = difficulty
	levels, err := GetOrFetchLevels(platformURL)
	if err != nil {
		log.Printf("animations: cloud animation fetch failed: %v", err)
		levels = fallbackCompiledLevels()
	}
	selected := selectLevel(levels, NormalizeLevel(level))
	return &Game{
		level:     selected,
		startedAt: now,
		pressed:   map[Point]bool{},
	}
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if !inBounds(event.X, event.Y) {
		return nil
	}
	g.mu.Lock()
	defer g.mu.Unlock()

	pt := Point{X: event.X, Y: event.Y}
	if event.Pressed {
		g.pressed[pt] = true
	} else {
		delete(g.pressed, pt)
		return nil
	}

	point := g.rawPointAtLocked(pt, now)
	if !point.present {
		return nil
	}

	eff, ok := g.level.tileEffects[point.kind]
	if !ok {
		return nil
	}

	// Map the effect press/cue action to the standard cue event
	var cueName string
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
	return nil
}

func (g *Game) Render(now time.Time) []RGB {
	g.mu.Lock()
	defer g.mu.Unlock()
	frame := make([]RGB, GridWidth*GridHeight)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			frame[y*GridWidth+x] = g.colorAtLocked(Point{X: x, Y: y}, now)
		}
	}
	return frame
}

func (g *Game) colorAtLocked(pt Point, now time.Time) RGB {
	if g.level.procedure != nil {
		elapsed := g.elapsedLocked(now)
		frameIndex := 0
		if g.level.frameTick > 0 {
			frameIndex = int(elapsed / g.level.frameTick)
		}
		color, err := g.level.procedure.colorAt(pt.X, pt.Y, timeSeconds(elapsed.Seconds()), frameIndex)
		if err == nil {
			return color
		}
	}
	point := g.rawPointAtLocked(pt, now)
	if !point.present {
		return RGB{}
	}
	if eff, ok := g.level.tileEffects[point.kind]; ok {
		return eff.color
	}
	return RGB{}
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
	elapsed := g.elapsedLocked(now)
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
}

type animationSource struct {
	Type                 string         `json:"type"`
	Language             string         `json:"language"`
	Code                 string         `json:"code"`
	Params               map[string]any `json:"params"`
	Seed                 float64        `json:"seed"`
	LoopSeconds          float64        `json:"loop_seconds"`
	ReferenceLoopSeconds float64        `json:"reference_loop_seconds"`
}

type animationProcedureSource = animationSource

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

func GetOrFetchLevels(platformURL string) ([]CompiledLevel, error) {
	cacheMu.Lock()
	defer cacheMu.Unlock()
	if time.Now().Before(cacheExpire) && len(cachedLevels) > 0 {
		return cachedLevels, nil
	}
	levels, err := fetchLevels(platformURL)
	if err != nil {
		if len(cachedLevels) > 0 {
			return cachedLevels, nil
		}
		return nil, err
	}
	cachedLevels = levels
	cacheExpire = time.Now().Add(2 * time.Second)
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
		if len(compiled.frames) == 0 && compiled.procedure == nil {
			return nil, fmt.Errorf("animation %s has no frames", compiled.id)
		}
		levels = append(levels, compiled)
	}
	if len(levels) == 0 {
		return nil, fmt.Errorf("no published animations returned")
	}
	return levels, nil
}

func isProcedureSource(source animationSource) bool {
	return source.Type == "procedure" && source.Language == "motion-dsl-v1" && strings.TrimSpace(source.Code) != ""
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

func selectLevel(levels []CompiledLevel, id string) CompiledLevel {
	for _, candidate := range levels {
		if candidate.id == id {
			return candidate
		}
	}
	return levels[0]
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

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}
