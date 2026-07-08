// Source of truth for this motion-go game. The platform seed
// platform/app/src/lib/seed/memoriaV2MotionGo.ts is generated from this file;
// run 'make motion-go-seeds' after editing.
package memoriav2go

import (
	"math"

	"github.com/lobis/motion-levels/packages/motiongo"
)

const (
	totalLevels   = 20
	livesPerLevel = 3
	maxTargets    = 48
	maxMistakes   = 32
	memorizeNS    = int64(5000000000)
	passNS        = int64(2200000000)
	failNS        = int64(2600000000)
)

const (
	phaseMemorize = "memorize"
	phaseRunning  = "running"
	phasePassed   = "passed"
	phaseFailed   = "failed"
	phaseFinished = "finished"
)

const (
	DefaultMusicRef  = "Motion/canciones/Background07.mp3"
	DefaultMusicGain = 16
)

type point struct {
	x int
	y int
}

type rect struct {
	x int
	y int
	w int
	h int
}

type rgb struct {
	r int
	g int
	b int
}

var defaultPlayers = [motiongo.MaxStartPadPlayers]motiongo.Player{
	{Index: 0, Label: "Red", Color: "#ff2938"},
	{Index: 1, Label: "Cyan", Color: "#1ed5ff"},
	{Index: 2, Label: "Green", Color: "#2fd86c"},
	{Index: 3, Label: "Pink", Color: "#f73dff"},
	{Index: 4, Label: "Blue", Color: "#0a5af8"},
	{Index: 5, Label: "Yellow", Color: "#ffd166"},
	{Index: 6, Label: "Violet", Color: "#a78bfa"},
	{Index: 7, Label: "Orange", Color: "#fb923c"},
}

var players []motiongo.Player
var createdNS int64
var levelStartedNS int64
var phaseStartedNS int64
var rng uint32
var level int
var lives int
var score int
var phase string
var arena rect
var target [maxTargets]point
var targetCount int
var hit [maxTargets]bool
var mistake [maxMistakes]point
var mistakeCount int

//export alloc
func gameAlloc(size uint32) uint32 {
	return motiongo.Alloc(size)
}

//export init
func gameInit(ptr uint32, length uint32) uint64 {
	var req motiongo.InitRequest
	_ = motiongo.Decode(ptr, length, &req)
	players = normalizePlayers(req.Players)
	rng = uint32(req.Seed)
	if rng == 0 {
		rng = uint32(req.NowUnixNS)
	}
	createdNS = req.NowUnixNS
	score = 0
	startLevel(1, req.NowUnixNS)
	return motiongo.Respond([]motiongo.Event{{Cue: "start", Message: "Memoria v2 lista"}})
}

//export press
func gamePress(ptr uint32, length uint32) uint64 {
	var req motiongo.PressRequest
	_ = motiongo.Decode(ptr, length, &req)
	events := advance(req.NowUnixNS)
	if !req.Pressed || !inBounds(req.X, req.Y) || phase != phaseRunning {
		return motiongo.Respond(events)
	}
	pt := point{x: req.X, y: req.Y}
	if !contains(arena, pt) {
		return motiongo.Respond(events)
	}
	index := targetIndex(pt)
	if index >= 0 {
		if !hit[index] {
			hit[index] = true
			score++
			if remainingTargets() == 0 {
				if level >= totalLevels {
					phase = phaseFinished
					phaseStartedNS = req.NowUnixNS
					events = append(events, motiongo.Event{Cue: "win", Message: "Game pass"})
				} else {
					phase = phasePassed
					phaseStartedNS = req.NowUnixNS
					events = append(events, motiongo.Event{Cue: "win", Message: "Nivel " + itoa(level) + " pass"})
				}
			} else {
				events = append(events, motiongo.Event{Cue: "coin", Message: "Correcto"})
			}
		}
		return motiongo.Respond(events)
	}
	if mistakeIndex(pt) >= 0 {
		return motiongo.Respond(events)
	}
	if mistakeCount < maxMistakes {
		mistake[mistakeCount] = pt
		mistakeCount++
	}
	if score > 0 {
		score--
	}
	lives--
	if lives <= 0 {
		lives = 0
		phase = phaseFailed
		phaseStartedNS = req.NowUnixNS
		events = append(events, motiongo.Event{Cue: "damage", Message: "Fail"})
	} else {
		events = append(events, motiongo.Event{Cue: "damage", Message: "Fallo"})
	}
	return motiongo.Respond(events)
}

//export tick
func gameTick(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	return motiongo.Respond(advance(req.NowUnixNS))
}

//export render
func gameRender(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	_ = advance(req.NowUnixNS)
	frame := motiongo.NewFrame(motiongo.Black)
	t := timePhase(req.NowUnixNS)
	for y := 0; y < motiongo.Height; y++ {
		for x := 0; x < motiongo.Width; x++ {
			frame.Set(x, y, rgbColor(colorAt(point{x: x, y: y}, req.NowUnixNS, t)))
		}
	}
	return motiongo.Respond(frame)
}

//export snapshot
func gameSnapshot(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	_ = advance(req.NowUnixNS)
	elapsed := int64(0)
	if req.NowUnixNS > createdNS {
		elapsed = (req.NowUnixNS - createdNS) / 1000000
	}
	countdown := int64(0)
	remaining := int64(0)
	if phase == phaseMemorize {
		end := phaseStartedNS + memorizeNS
		if end > req.NowUnixNS {
			countdown = (end - req.NowUnixNS) / 1000000
			remaining = countdown
		}
	}
	snapPlayers := make([]motiongo.PlayerSnapshot, 0, len(players))
	for i := 0; i < len(players); i++ {
		snapPlayers = append(snapPlayers, motiongo.PlayerSnapshot{
			Index: players[i].Index,
			Label: players[i].Label,
			Color: players[i].Color,
			Score: score,
			Lives: lives,
		})
	}
	return motiongo.Respond(motiongo.Snapshot{
		Phase:           phase,
		Score:           score,
		StartedUnix:     createdNS / 1000000000,
		ElapsedMillis:   elapsed,
		RemainingMillis: remaining,
		CountdownMillis: countdown,
		ActiveTargets:   remainingTargets(),
		Lives:           lives,
		Success:         phase == phaseFinished,
		Players:         snapPlayers,
		MatchTarget:     totalLevels,
		RoundHits:       level,
	})
}

func advance(nowNS int64) []motiongo.Event {
	if phase == phaseMemorize && nowNS-phaseStartedNS >= memorizeNS {
		phase = phaseRunning
		phaseStartedNS = nowNS
		return []motiongo.Event{{Cue: "start", Message: "Ahora"}}
	}
	if phase == phasePassed && nowNS-phaseStartedNS >= passNS {
		next := level + 1
		startLevel(next, nowNS)
		return []motiongo.Event{{Cue: "start", Message: "Nivel " + itoa(next)}}
	}
	if phase == phaseFailed && nowNS-phaseStartedNS >= failNS {
		startLevel(level, nowNS)
		return []motiongo.Event{{Cue: "start", Message: "Reintento nivel " + itoa(level)}}
	}
	return []motiongo.Event{}
}

func startLevel(next int, nowNS int64) {
	level = clampInt(next, 1, totalLevels)
	lives = livesPerLevel
	phase = phaseMemorize
	levelStartedNS = nowNS
	phaseStartedNS = nowNS
	targetCount = 0
	mistakeCount = 0
	for i := 0; i < maxTargets; i++ {
		target[i] = point{}
		hit[i] = false
	}
	for i := 0; i < maxMistakes; i++ {
		mistake[i] = point{}
	}
	generatePattern(level)
}

func generatePattern(lvl int) {
	w := clampInt(6+lvl/3, 6, 14)
	h := clampInt(8+lvl/2, 8, 28)
	arena = rect{x: (motiongo.Width - w) / 2, y: (motiongo.Height - h) / 2, w: w, h: h}
	if lvl <= 3 {
		addEarlyPattern(lvl)
		return
	}
	if lvl == totalLevels {
		addUmbrellaPattern()
		return
	}
	desired := clampInt(4+lvl+lvl/3, 5, 38)
	clusters := clampInt(1+lvl/6, 1, 4)
	for cluster := 0; cluster < clusters && targetCount < desired; cluster++ {
		x := arena.x + 1 + randInt(maxInt(1, arena.w-2))
		y := arena.y + 1 + randInt(maxInt(1, arena.h-2))
		steps := desired/clusters + 2
		for step := 0; step < steps && targetCount < desired; step++ {
			addTarget(point{x: x, y: y})
			switch randInt(4) {
			case 0:
				x++
			case 1:
				x--
			case 2:
				y++
			default:
				y--
			}
			x = clampInt(x, arena.x+1, arena.x+arena.w-2)
			y = clampInt(y, arena.y+1, arena.y+arena.h-2)
		}
	}
	guard := 0
	for targetCount < desired && guard < 200 {
		guard++
		addTarget(point{
			x: arena.x + 1 + randInt(maxInt(1, arena.w-2)),
			y: arena.y + 1 + randInt(maxInt(1, arena.h-2)),
		})
	}
}

func addEarlyPattern(lvl int) {
	cx := arena.x + arena.w/2
	top := arena.y + 2
	bottom := arena.y + arena.h - 3
	if lvl == 1 {
		for y := top; y <= bottom; y++ {
			addTarget(point{x: cx, y: y})
		}
		return
	}
	if lvl == 2 {
		for y := top; y <= bottom; y++ {
			addTarget(point{x: cx - 1, y: y})
		}
		for x := cx - 1; x <= cx+2; x++ {
			addTarget(point{x: x, y: bottom})
		}
		return
	}
	left := cx - 2
	right := cx + 2
	mid := (top + bottom) / 2
	for x := left; x <= right; x++ {
		addTarget(point{x: x, y: top})
		addTarget(point{x: x, y: mid})
		addTarget(point{x: x, y: bottom})
	}
	for y := top; y <= bottom; y++ {
		addTarget(point{x: left, y: y})
		addTarget(point{x: right, y: y})
	}
}

func addUmbrellaPattern() {
	cx := arena.x + arena.w/2
	top := arena.y + 4
	for dx := -4; dx <= 4; dx++ {
		addTarget(point{x: cx + dx, y: top + int(math.Abs(float64(dx)))/2})
	}
	for dx := -3; dx <= 3; dx++ {
		addTarget(point{x: cx + dx, y: top + 1})
	}
	for y := top + 2; y <= arena.y+arena.h-5; y++ {
		addTarget(point{x: cx, y: y})
	}
	hookY := arena.y + arena.h - 5
	for x := cx - 3; x <= cx; x++ {
		addTarget(point{x: x, y: hookY})
	}
	for y := hookY - 3; y <= hookY; y++ {
		addTarget(point{x: cx - 3, y: y})
	}
}

func addTarget(pt point) {
	if !contains(arena, pt) || onBorder(arena, pt) || targetIndex(pt) >= 0 || targetCount >= maxTargets {
		return
	}
	target[targetCount] = pt
	targetCount++
}

func colorAt(pt point, nowNS int64, t int) rgb {
	if !contains(arena, pt) {
		return rgb{r: 0, g: 3 + (pt.x+pt.y+t)%5, b: 8 + (pt.x*2+pt.y+t)%8}
	}
	if onBorder(arena, pt) {
		return pulse(rgb{r: 30, g: 215, b: 85}, t, 24)
	}
	if phase == phaseFailed && onFailureCross(pt) {
		return pulse(rgb{r: 255, g: 35, b: 48}, t, 80)
	}
	if phase == phasePassed && (pt.x+pt.y+t)%5 == 0 {
		return rgb{r: 190, g: 255, b: 210}
	}
	if phase == phaseFinished && (pt.x*3+pt.y+t)%7 == 0 {
		return rgb{r: 255, g: 211, b: 102}
	}
	if mistakeIndex(pt) >= 0 {
		return rgb{r: 255, g: 35, b: 48}
	}
	index := targetIndex(pt)
	if index >= 0 {
		if phase == phaseMemorize || phase == phasePassed || phase == phaseFinished {
			return pulse(rgb{r: 45, g: 85, b: 255}, t, 45)
		}
		if hit[index] {
			return rgb{r: 196, g: 255, b: 255}
		}
	}
	base := rgb{r: 1, g: 18, b: 14}
	if (pt.x+pt.y)%2 == 0 {
		base = rgb{r: 4, g: 26, b: 20}
	}
	if phase == phaseMemorize {
		age := nowNS - phaseStartedNS
		if age > memorizeNS-1000000000 {
			return blendRGB(base, rgb{r: 30, g: 215, b: 85}, int((memorizeNS-age)/50000000))
		}
	}
	return base
}

func onFailureCross(pt point) bool {
	localX := pt.x - arena.x
	localY := pt.y - arena.y
	return localX == localY/2 || localX == arena.w-1-localY/2
}

func targetIndex(pt point) int {
	for i := 0; i < targetCount; i++ {
		if target[i] == pt {
			return i
		}
	}
	return -1
}

func mistakeIndex(pt point) int {
	for i := 0; i < mistakeCount; i++ {
		if mistake[i] == pt {
			return i
		}
	}
	return -1
}

func remainingTargets() int {
	remaining := 0
	for i := 0; i < targetCount; i++ {
		if !hit[i] {
			remaining++
		}
	}
	return remaining
}

func normalizePlayers(input []motiongo.Player) []motiongo.Player {
	count := len(input)
	if count <= 0 {
		count = 1
	}
	if count > motiongo.MaxStartPadPlayers {
		count = motiongo.MaxStartPadPlayers
	}
	out := make([]motiongo.Player, count)
	for i := 0; i < count; i++ {
		if i < len(input) {
			out[i] = input[i]
		} else {
			out[i] = defaultPlayers[i]
		}
		if out[i].Label == "" {
			out[i].Label = defaultPlayers[i].Label
		}
		if out[i].Color == "" {
			out[i].Color = defaultPlayers[i].Color
		}
		out[i].Index = i
	}
	return out
}

func contains(r rect, pt point) bool {
	return pt.x >= r.x && pt.x < r.x+r.w && pt.y >= r.y && pt.y < r.y+r.h
}

func onBorder(r rect, pt point) bool {
	return contains(r, pt) && (pt.x == r.x || pt.x == r.x+r.w-1 || pt.y == r.y || pt.y == r.y+r.h-1)
}

func inBounds(x int, y int) bool {
	return x >= 0 && x < motiongo.Width && y >= 0 && y < motiongo.Height
}

func nextRand() uint32 {
	if rng == 0 {
		rng = 1
	}
	rng = rng*1664525 + 1013904223
	return rng
}

func randInt(max int) int {
	if max <= 1 {
		return 0
	}
	return int(nextRand() % uint32(max))
}

func timePhase(nowNS int64) int {
	return int((nowNS / 90000000) % 1024)
}

func pulse(base rgb, t int, amount int) rgb {
	wave := (t % 20) - 10
	if wave < 0 {
		wave = -wave
	}
	return addRGB(base, amount-wave*amount/10)
}

func rgbColor(c rgb) motiongo.Color {
	return motiongo.Color(rgbHex(c))
}

func rgbHex(c rgb) string {
	return "#" + hexByte(c.r) + hexByte(c.g) + hexByte(c.b)
}

func hexByte(v int) string {
	const digits = "0123456789abcdef"
	n := clampInt(v, 0, 255)
	return string([]byte{digits[n/16], digits[n%16]})
}

func addRGB(c rgb, amount int) rgb {
	return rgb{
		r: clampInt(c.r+amount, 0, 255),
		g: clampInt(c.g+amount, 0, 255),
		b: clampInt(c.b+amount, 0, 255),
	}
}

func blendRGB(a rgb, b rgb, pct int) rgb {
	p := clampInt(pct, 0, 100)
	return rgb{
		r: (a.r*(100-p) + b.r*p) / 100,
		g: (a.g*(100-p) + b.g*p) / 100,
		b: (a.b*(100-p) + b.b*p) / 100,
	}
}

func clampInt(value int, min int, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func maxInt(a int, b int) int {
	if a > b {
		return a
	}
	return b
}

func itoa(value int) string {
	if value == 0 {
		return "0"
	}
	if value < 0 {
		return "-" + itoa(-value)
	}
	digits := [12]byte{}
	index := len(digits)
	for value > 0 {
		index--
		digits[index] = byte('0' + value%10)
		value /= 10
	}
	return string(digits[index:])
}
