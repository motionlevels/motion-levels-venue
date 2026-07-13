export const saltosMotionGoSource = String.raw`// Code generated from platform/app/src/lib/seed; keep gameplay changes in sync with native runner.
package main

import (
	"math"

	"github.com/lobis/motion-levels/packages/motiongo"
)

func main() {}

const (
	countdownNS = int64(3000000000)
	durationNS  = int64(60000000000)
	radius      = 1
)

type point struct {
	x int
	y int
}

type rgb struct {
	r int
	g int
	b int
}

type levelSettings struct {
	id       string
	gap      int
	stepNS   int64
	leadStep int
}

var level levelSettings
var seed uint32
var current point
var target point
var origin point
var score int
var createdNS int64
var startedNS int64
var endNS int64
var targetStartedNS int64
var targetReadyNS int64
var failed bool
var ended bool
var failPoint point
var failStartedNS int64
var pulseUntilNS int64

//export alloc
func gameAlloc(size uint32) uint32 {
	return motiongo.Alloc(size)
}

//export init
func gameInit(ptr uint32, length uint32) uint64 {
	var req motiongo.InitRequest
	_ = motiongo.Decode(ptr, length, &req)
	seed = uint32(req.Seed)
	if seed == 0 {
		seed = uint32(req.NowUnixNS) ^ 0x6d2b79f5
	}
	level = settingsForLevel(req.Level)
	current = point{x: motiongo.Width / 2, y: 3}
	score = 0
	createdNS = req.NowUnixNS
	startedNS = req.NowUnixNS + countdownNS
	endNS = startedNS + durationNS
	failed = false
	ended = false
	failPoint = point{}
	failStartedNS = 0
	pulseUntilNS = 0
	target = nextTarget(current, point{x: -1, y: -1})
	origin = targetOrigin(current, target)
	targetStartedNS = startedNS
	targetReadyNS = targetStartedNS + targetTravelNS(origin, target)
	return motiongo.Respond([]motiongo.Event{{Cue: "start", Message: "Saltos listo"}})
}

//export press
func gamePress(ptr uint32, length uint32) uint64 {
	var req motiongo.PressRequest
	_ = motiongo.Decode(ptr, length, &req)
	if !req.Pressed || !inBounds(req.X, req.Y) || failed || ended || req.NowUnixNS < startedNS {
		return motiongo.Respond([]motiongo.Event{})
	}
	tick(req.NowUnixNS)
	pt := point{x: req.X, y: req.Y}
	visual := visualTarget(req.NowUnixNS)
	if inPlatform(pt, visual) {
		previous := current
		current = visual
		target = nextTarget(current, previous)
		origin = targetOrigin(current, target)
		targetStartedNS = req.NowUnixNS
		targetReadyNS = targetStartedNS + targetTravelNS(origin, target)
		score++
		pulseUntilNS = req.NowUnixNS + 260000000
		return motiongo.Respond([]motiongo.Event{{Cue: "coin", Message: "Salto " + itoa(score)}})
	}
	if inPlatform(pt, current) {
		return motiongo.Respond([]motiongo.Event{})
	}
	failed = true
	ended = true
	failPoint = pt
	failStartedNS = req.NowUnixNS
	return motiongo.Respond([]motiongo.Event{{Cue: "damage", Message: "Has pisado lava"}})
}

//export tick
func gameTick(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	tick(req.NowUnixNS)
	return 0
}

//export render
func gameRender(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	tick(req.NowUnixNS)
	frame := motiongo.NewFrame(motiongo.Black)
	seconds := float64(req.NowUnixNS-createdNS) / 1000000000
	visual := visualTarget(req.NowUnixNS)
	for y := 0; y < motiongo.Height; y++ {
		for x := 0; x < motiongo.Width; x++ {
			pt := point{x: x, y: y}
			color := lavaColor(x, y, seconds)
			if req.NowUnixNS < startedNS {
				color = scale(color, countdownFade(req.NowUnixNS))
			}
			if inPlatform(pt, current) {
				color = currentColor(pt, current, seconds)
			} else if req.NowUnixNS >= startedNS && inPlatform(pt, visual) {
				color = targetColor(pt, visual, seconds, req.NowUnixNS < pulseUntilNS)
			}
			if failed {
				color = failColor(pt, seconds, req.NowUnixNS-failStartedNS)
			} else if ended {
				color = endedColor(pt, seconds)
			}
			frame.Set(x, y, motiongo.Color(hex(color)))
		}
	}
	return motiongo.Respond(frame)
}

//export snapshot
func gameSnapshot(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	tick(req.NowUnixNS)
	phase := "running"
	if req.NowUnixNS < startedNS {
		phase = "countdown"
	} else if ended {
		phase = "finished"
	}
	elapsed := int64(0)
	if req.NowUnixNS > startedNS {
		elapsed = (req.NowUnixNS - startedNS) / 1000000
	}
	remaining := int64(0)
	if req.NowUnixNS < endNS && !failed {
		remaining = (endNS - req.NowUnixNS) / 1000000
	}
	countdown := int64(0)
	if req.NowUnixNS < startedNS {
		countdown = (startedNS - req.NowUnixNS) / 1000000
	}
	lives := 1
	if failed {
		lives = 0
	}
	return motiongo.Respond(motiongo.Snapshot{
		Phase:           phase,
		Score:           score,
		StartedUnix:     startedNS / 1000000000,
		EndsUnix:        endNS / 1000000000,
		ElapsedMillis:   elapsed,
		RemainingMillis: remaining,
		CountdownMillis: countdown,
		ActiveTargets:   1,
		Lives:           lives,
		Players: []motiongo.PlayerSnapshot{{
			Index: 0,
			Label: "Jugador 1",
			Color: "#0000ff",
			Score: score,
			Lives: lives,
		}},
	})
}

func settingsForLevel(value string) levelSettings {
	switch value {
	case "classic", "2", "medium", "medio":
		return levelSettings{id: "classic", gap: 4, stepNS: 500000000, leadStep: 6}
	case "expert", "3", "hard", "experto":
		return levelSettings{id: "expert", gap: 5, stepNS: 380000000, leadStep: 7}
	default:
		return levelSettings{id: "starter", gap: 3, stepNS: 650000000, leadStep: 4}
	}
}

func tick(nowNS int64) {
	if !ended && nowNS >= endNS {
		ended = true
	}
}

func visualTarget(nowNS int64) point {
	if nowNS < targetStartedNS {
		return origin
	}
	if nowNS >= targetReadyNS {
		return target
	}
	steps := int((nowNS - targetStartedNS) / level.stepNS)
	return pointAfterSteps(origin, target, steps)
}

func nextTarget(from point, avoid point) point {
	var candidates [512]point
	count := 0
	for y := radius; y < motiongo.Height-radius; y++ {
		for x := radius; x < motiongo.Width-radius; x++ {
			p := point{x: x, y: y}
			if inPlatform(p, from) || inPlatform(p, avoid) {
				continue
			}
			if platformGap(from, p) == level.gap && count < len(candidates) {
				candidates[count] = p
				count++
			}
		}
	}
	if count == 0 {
		return from
	}
	seed = seed*1664525 + 1013904223
	return candidates[int(seed%uint32(count))]
}

func targetOrigin(from point, to point) point {
	stepX := sign(to.x - from.x)
	stepY := sign(to.y - from.y)
	if stepX == 0 && stepY == 0 {
		stepY = 1
	}
	origin := to
	for i := 0; i < level.leadStep; i++ {
		next := point{x: clamp(origin.x+stepX, radius, motiongo.Width-1-radius), y: clamp(origin.y+stepY, radius, motiongo.Height-1-radius)}
		if next == origin {
			break
		}
		origin = next
	}
	return origin
}

func targetTravelNS(from point, to point) int64 {
	steps := max(abs(to.x-from.x), abs(to.y-from.y))
	if steps == 0 {
		steps = 1
	}
	return int64(steps) * level.stepNS
}

func inBounds(x int, y int) bool {
	return x >= 0 && x < motiongo.Width && y >= 0 && y < motiongo.Height
}

func inPlatform(pt point, center point) bool {
	return abs(pt.x-center.x) <= radius && abs(pt.y-center.y) <= radius
}

func platformGap(a point, b point) int {
	dx := abs(a.x-b.x) - radius*2 - 1
	dy := abs(a.y-b.y) - radius*2 - 1
	if dx < 0 {
		dx = 0
	}
	if dy < 0 {
		dy = 0
	}
	return max(dx, dy)
}

func pointAfterSteps(from point, to point, steps int) point {
	pt := from
	for i := 0; i < steps && pt != to; i++ {
		pt.x += sign(to.x - pt.x)
		pt.y += sign(to.y - pt.y)
	}
	return pt
}

func lavaColor(x int, y int, seconds float64) rgb {
	f1 := (math.Sin(float64(x)*0.75+float64(y)*0.22+seconds*1.9) + 1) / 2
	f2 := (math.Sin(float64(y)*0.55-seconds*2.7) + 1) / 2
	return rgb{r: int(115 + 85*f1), g: int(4 + 40*f2), b: 0}
}

func currentColor(pt point, center point, seconds float64) rgb {
	if pt == center {
		pulse := (math.Sin(seconds*3.2) + 1) / 2
		return rgb{r: int(170 + 85*pulse), g: int(235 + 20*pulse), b: 255}
	}
	edge := int(120 + 45*((math.Sin(seconds+float64(pt.x+pt.y))+1)/2))
	return rgb{r: 0, g: edge, b: 255}
}

func targetColor(pt point, center point, seconds float64, active bool) rgb {
	if active {
		return rgb{r: 205, g: 255, b: 205}
	}
	if pt == center {
		pulse := (math.Sin(seconds*4.0) + 1) / 2
		return rgb{r: int(210 + 45*pulse), g: 255, b: 40}
	}
	return rgb{r: 30, g: 210, b: 45}
}

func failColor(pt point, seconds float64, elapsedNS int64) rgb {
	base := lavaColor(pt.x, pt.y, seconds)
	dist := abs(pt.x-failPoint.x) + abs(pt.y-failPoint.y)
	ring := int(elapsedNS / 130000000)
	if dist == ring || dist == ring+1 {
		return rgb{r: 255, g: 255, b: 255}
	}
	if dist <= 2 {
		return rgb{r: 255, g: 35, b: 35}
	}
	return base
}

func endedColor(pt point, seconds float64) rgb {
	base := lavaColor(pt.x, pt.y, seconds)
	if inPlatform(pt, current) {
		return rgb{r: 30, g: 90, b: 140}
	}
	return rgb{r: int(float64(base.r) * 0.18), g: int(float64(base.g) * 0.18), b: 0}
}

func countdownFade(nowNS int64) float64 {
	progress := 1 - float64(startedNS-nowNS)/float64(countdownNS)
	return 0.12 + clampFloat(progress, 0, 1)*0.22
}

func scale(color rgb, factor float64) rgb {
	factor = clampFloat(factor, 0, 1)
	return rgb{r: int(float64(color.r) * factor), g: int(float64(color.g) * factor), b: int(float64(color.b) * factor)}
}

func hex(color rgb) string {
	const d = "0123456789abcdef"
	r := clamp(color.r, 0, 255)
	g := clamp(color.g, 0, 255)
	b := clamp(color.b, 0, 255)
	return string([]byte{'#', d[r>>4], d[r&15], d[g>>4], d[g&15], d[b>>4], d[b&15]})
}

func clamp(v int, lo int, hi int) int {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}

func clampFloat(v float64, lo float64, hi float64) float64 {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}

func sign(v int) int {
	if v < 0 {
		return -1
	}
	if v > 0 {
		return 1
	}
	return 0
}

func abs(v int) int {
	if v < 0 {
		return -v
	}
	return v
}

func max(a int, b int) int {
	if a > b {
		return a
	}
	return b
}

func itoa(v int) string {
	if v == 0 {
		return "0"
	}
	var buf [16]byte
	i := len(buf)
	for v > 0 {
		i--
		buf[i] = byte('0' + v%10)
		v /= 10
	}
	return string(buf[i:])
}
`;
