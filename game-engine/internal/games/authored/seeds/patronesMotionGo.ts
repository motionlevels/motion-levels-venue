export const patronesMotionGoSource = String.raw`// Code generated from platform/app/src/lib/seed; keep gameplay changes in sync with native runner.
package main

import (
	"math"

	"github.com/lobis/motion-levels/packages/motiongo"
)

func main() {}

const (
	countdownNS   = int64(3000000000)
	failVisibleNS = int64(2200000000)
	maxTargets    = 96
	maxPlayers    = 6
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

var levelID string
var difficulty string
var playerCount int
var players [maxPlayers]motiongo.Player
var createdNS int64
var startedNS int64
var endedNS int64
var canvas rect
var targets [maxTargets]point
var targetCount int
var claimed [maxTargets]bool
var claimedAt [maxTargets]int64
var failPoint point
var ended bool
var success bool
var score int

//export alloc
func gameAlloc(size uint32) uint32 {
	return motiongo.Alloc(size)
}

//export init
func gameInit(ptr uint32, length uint32) uint64 {
	var req motiongo.InitRequest
	_ = motiongo.Decode(ptr, length, &req)
	levelID = normalizeLevel(req.Level)
	difficulty = normalizeDifficulty(req.Difficulty)
	playerCount = clamp(len(req.Players), 1, maxPlayers)
	for i := 0; i < playerCount; i++ {
		players[i] = req.Players[i]
		if players[i].Label == "" {
			players[i].Label = "Jugador " + itoa(i+1)
		}
		if players[i].Color == "" {
			players[i].Color = defaultColor(i)
		}
	}
	createdNS = req.NowUnixNS
	startedNS = req.NowUnixNS + countdownNS
	endedNS = 0
	canvas = canvasForDifficulty(difficulty)
	targetCount = 0
	score = 0
	ended = false
	success = false
	failPoint = point{}
	for i := 0; i < maxTargets; i++ {
		targets[i] = point{}
		claimed[i] = false
		claimedAt[i] = 0
	}
	buildPattern(kindForLevel(levelID), patternSize(difficulty))
	return motiongo.Respond([]motiongo.Event{{Cue: "start", Message: "Patrones listo"}})
}

//export press
func gamePress(ptr uint32, length uint32) uint64 {
	var req motiongo.PressRequest
	_ = motiongo.Decode(ptr, length, &req)
	if !req.Pressed || ended || req.NowUnixNS < startedNS || !inBounds(req.X, req.Y) {
		return motiongo.Respond([]motiongo.Event{})
	}
	pt := point{x: req.X, y: req.Y}
	if !contains(canvas, pt) {
		return motiongo.Respond([]motiongo.Event{})
	}
	index := targetIndex(pt)
	if index < 0 {
		ended = true
		success = false
		endedNS = req.NowUnixNS
		failPoint = pt
		return motiongo.Respond([]motiongo.Event{{Cue: "damage", Message: "Patron incorrecto"}})
	}
	if claimed[index] {
		return motiongo.Respond([]motiongo.Event{})
	}
	claimed[index] = true
	claimedAt[index] = req.NowUnixNS
	score++
	if score >= targetCount {
		ended = true
		success = true
		endedNS = req.NowUnixNS
		return motiongo.Respond([]motiongo.Event{{Cue: "win", Message: "Patron completo"}})
	}
	return motiongo.Respond([]motiongo.Event{{Cue: "coin", Message: "Patron " + itoa(score) + "/" + itoa(targetCount)}})
}

//export tick
func gameTick(ptr uint32, length uint32) uint64 {
	return 0
}

//export render
func gameRender(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	frame := motiongo.NewFrame(motiongo.Black)
	phase := phaseAt(req.NowUnixNS)
	for y := 0; y < motiongo.Height; y++ {
		for x := 0; x < motiongo.Width; x++ {
			frame.Set(x, y, motiongo.Color(hex(colorAt(point{x: x, y: y}, req.NowUnixNS, phase))))
		}
	}
	return motiongo.Respond(frame)
}

//export snapshot
func gameSnapshot(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	phase := phaseAt(req.NowUnixNS)
	elapsed := int64(0)
	if req.NowUnixNS > startedNS {
		elapsed = (req.NowUnixNS - startedNS) / 1000000
	}
	if endedNS > 0 {
		elapsed = (endedNS - startedNS) / 1000000
	}
	countdown := int64(0)
	if req.NowUnixNS < startedNS {
		countdown = (startedNS - req.NowUnixNS) / 1000000
	}
	lives := 1
	if ended && !success {
		lives = 0
	}
	snapPlayers := make([]motiongo.PlayerSnapshot, 0, playerCount)
	for i := 0; i < playerCount; i++ {
		snapPlayers = append(snapPlayers, motiongo.PlayerSnapshot{
			Index: i,
			Label: players[i].Label,
			Color: players[i].Color,
			Score: score,
			Lives: lives,
		})
	}
	return motiongo.Respond(motiongo.Snapshot{
		Phase:           phase,
		Score:           score,
		StartedUnix:     startedNS / 1000000000,
		ElapsedMillis:   elapsed,
		CountdownMillis: countdown,
		ActiveTargets:   targetCount - score,
		Lives:           lives,
		Success:         success,
		Players:         snapPlayers,
	})
}

func colorAt(pt point, nowNS int64, phase string) rgb {
	t := float64(nowNS-createdNS) / 1000000000
	if !contains(canvas, pt) {
		pulse := 0.82 + 0.18*math.Sin(t*3.2+float64(pt.x)*0.31+float64(pt.y)*0.09)
		return scale(rgb{g: 255}, pulse)
	}
	if ended && !success {
		if pt == failPoint && int(t*14)%4 < 2 {
			return rgb{r: 255, g: 28, b: 40}
		}
		return rgb{}
	}
	if ended && success {
		index := targetIndex(pt)
		wave := 0.45 + 0.55*math.Sin(t*8+float64(pt.x+pt.y)*0.4)
		if index >= 0 {
			return rgb{r: int(50 * wave), g: 255, b: int(90 * wave)}
		}
		return rgb{}
	}
	index := targetIndex(pt)
	if index >= 0 {
		if claimed[index] {
			if nowNS-claimedAt[index] >= 0 && nowNS-claimedAt[index] < 180000000 {
				return rgb{r: 245, g: 250, b: 255}
			}
			return rgb{g: 255}
		}
		pulse := 0.78 + 0.22*math.Sin(t*4.4+float64(index)*0.5)
		if phase == "countdown" {
			pulse = 0.88 + 0.12*math.Sin(t*7.0+float64(index)*0.7)
		}
		return scale(rgb{r: 20, g: 104, b: 255}, pulse)
	}
	return rgb{}
}

func phaseAt(nowNS int64) string {
	if ended {
		if success {
			return "finished"
		}
		if endedNS > 0 && nowNS-endedNS < failVisibleNS {
			return "failed"
		}
		return "finished"
	}
	if nowNS < startedNS {
		return "countdown"
	}
	return "playing"
}

func buildPattern(kind string, size int) {
	cx := canvas.x + canvas.w/2
	cy := canvas.y + canvas.h/2
	radius := size / 2
	switch kind {
	case "diagonal":
		for i := -radius; i <= radius; i++ {
			addTarget(cx+i, cy+i)
			addTarget(cx+i, cy-i)
		}
	case "frame":
		for i := -radius; i <= radius; i++ {
			addTarget(cx+i, cy-radius)
			addTarget(cx+i, cy+radius)
			addTarget(cx-radius, cy+i)
			addTarget(cx+radius, cy+i)
		}
	case "stair":
		for i := 0; i < size; i++ {
			addTarget(cx-radius+i, cy+radius-i)
			if i%2 == 0 {
				addTarget(cx-radius+i, cy+radius-i-1)
			}
		}
	case "glyph":
		for i := -radius; i <= radius; i++ {
			addTarget(cx+i, cy)
			addTarget(cx, cy+i)
		}
		addTarget(cx-radius, cy-radius)
		addTarget(cx+radius, cy-radius)
		addTarget(cx-radius, cy+radius)
		addTarget(cx+radius, cy+radius)
	default:
		for i := -radius; i <= radius; i++ {
			addTarget(cx+i, cy)
			addTarget(cx, cy+i)
		}
	}
}

func addTarget(x int, y int) {
	minX := canvas.x + 1
	maxX := canvas.x + canvas.w - 2
	minY := canvas.y + 1
	maxY := canvas.y + canvas.h - 2
	pt := point{x: clamp(x, minX, maxX), y: clamp(y, minY, maxY)}
	if targetIndex(pt) >= 0 || targetCount >= maxTargets {
		return
	}
	targets[targetCount] = pt
	targetCount++
}

func targetIndex(pt point) int {
	for i := 0; i < targetCount; i++ {
		if targets[i] == pt {
			return i
		}
	}
	return -1
}

func normalizeLevel(value string) string {
	switch value {
	case "level-2", "2":
		return "level-2"
	case "level-3", "3":
		return "level-3"
	case "level-4", "4":
		return "level-4"
	case "level-5", "5":
		return "level-5"
	default:
		return "level-1"
	}
}

func kindForLevel(value string) string {
	switch value {
	case "level-2":
		return "diagonal"
	case "level-3":
		return "frame"
	case "level-4":
		return "stair"
	case "level-5":
		return "glyph"
	default:
		return "cross"
	}
}

func normalizeDifficulty(value string) string {
	switch value {
	case "medium", "hard", "expert":
		return value
	default:
		return "easy"
	}
}

func canvasForDifficulty(value string) rect {
	switch value {
	case "expert":
		return rect{x: 2, y: 7, w: 12, h: 18}
	case "hard":
		return rect{x: 3, y: 8, w: 10, h: 16}
	case "medium":
		return rect{x: 4, y: 9, w: 8, h: 14}
	default:
		return rect{x: 5, y: 10, w: 6, h: 12}
	}
}

func patternSize(value string) int {
	switch value {
	case "expert":
		return 7
	case "hard":
		return 6
	case "medium":
		return 5
	default:
		return 4
	}
}

func contains(r rect, pt point) bool {
	return pt.x >= r.x && pt.x < r.x+r.w && pt.y >= r.y && pt.y < r.y+r.h
}

func inBounds(x int, y int) bool {
	return x >= 0 && x < motiongo.Width && y >= 0 && y < motiongo.Height
}

func defaultColor(index int) string {
	switch index % 6 {
	case 0:
		return "#ff0000"
	case 1:
		return "#00ffff"
	case 2:
		return "#00ff00"
	case 3:
		return "#ff00ff"
	case 4:
		return "#0000ff"
	default:
		return "#ffff00"
	}
}

func scale(color rgb, factor float64) rgb {
	if factor < 0 {
		factor = 0
	}
	if factor > 1 {
		factor = 1
	}
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
