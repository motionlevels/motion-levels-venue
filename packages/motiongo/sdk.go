// Package motiongo contains the tiny host ABI shared by motion-go-v1 games.
//
// Authored games compile as WASM and export alloc/init/press/tick/render/snapshot.
// The engine passes JSON requests into linear memory and expects JSON responses
// at the packed pointer/length returned by each exported function.
package motiongo

import (
	"encoding/json"
	"unsafe"
)

const (
	Width  = 16
	Height = 32
)

const (
	MaxStartPadPlayers      = 6
	DefaultStartPadSize     = 4
	DefaultStartPadHoldNS   = int64(1000000000)
	DefaultStartCountdownNS = int64(3000000000)
)

type Color string

const (
	Black  Color = "#000000"
	White  Color = "#ffffff"
	Red    Color = "#ff3b30"
	Green  Color = "#34c759"
	Blue   Color = "#0a84ff"
	Yellow Color = "#ffd166"
	Cyan   Color = "#36d9ff"
	Pink   Color = "#ff52c8"
)

type Player struct {
	Index int    `json:"index"`
	Label string `json:"label"`
	Color string `json:"color"`
}

type Point struct {
	X int
	Y int
}

type StartPads struct {
	PlayerCount int
	Size        int
	HoldNS      int64
	CountdownNS int64
	Started     bool
	StartedNS   int64
	StartNS     int64
	Origins     [MaxStartPadPlayers]Point

	pressed   [MaxStartPadPlayers]uint64
	holdUntil [MaxStartPadPlayers]int64
}

type InitRequest struct {
	EngineGame string          `json:"engine_game"`
	Label      string          `json:"label"`
	Seed       int64           `json:"seed"`
	NowUnixNS  int64           `json:"now_unix_ns"`
	Width      int             `json:"width"`
	Height     int             `json:"height"`
	Players    []Player        `json:"players"`
	Spec       json.RawMessage `json:"spec"`
}

type TimeRequest struct {
	NowUnixNS int64 `json:"now_unix_ns"`
}

type PressRequest struct {
	NowUnixNS int64 `json:"now_unix_ns"`
	X         int   `json:"x"`
	Y         int   `json:"y"`
	Pressed   bool  `json:"pressed"`
}

type Event struct {
	Cue     string `json:"cue"`
	Message string `json:"message"`
}

type Frame struct {
	Pixels []string `json:"pixels"`
}

type PlayerSnapshot struct {
	Index int    `json:"index"`
	Label string `json:"label"`
	Color string `json:"color"`
	Score int    `json:"score"`
	Lives int    `json:"lives,omitempty"`
}

type Snapshot struct {
	Phase           string           `json:"phase"`
	Score           int              `json:"score"`
	StartedUnix     int64            `json:"started_unix"`
	EndsUnix        int64            `json:"ends_unix"`
	ElapsedMillis   int64            `json:"elapsed_millis"`
	RemainingMillis int64            `json:"remaining_millis"`
	CountdownMillis int64            `json:"countdown_millis"`
	ActiveTargets   int              `json:"active_targets"`
	Lives           int              `json:"lives,omitempty"`
	Success         bool             `json:"success"`
	Players         []PlayerSnapshot `json:"players"`
}

func NewFrame(fill Color) Frame {
	pixels := make([]string, Width*Height)
	for i := range pixels {
		pixels[i] = string(fill)
	}
	return Frame{Pixels: pixels}
}

func (f Frame) Set(x, y int, color Color) {
	if x < 0 || x >= Width || y < 0 || y >= Height {
		return
	}
	f.Pixels[y*Width+x] = string(color)
}

func (f Frame) FillRect(x, y, width, height int, color Color) {
	for yy := y; yy < y+height; yy++ {
		for xx := x; xx < x+width; xx++ {
			f.Set(xx, yy, color)
		}
	}
}

func NewStartPads(playerCount int, seed uint32) StartPads {
	var pads StartPads
	pads.Reset(playerCount, DefaultStartPadSize, DefaultStartPadHoldNS, DefaultStartCountdownNS, seed)
	return pads
}

func (s *StartPads) Reset(playerCount int, size int, holdNS int64, countdownNS int64, seed uint32) {
	s.PlayerCount = clampStartPadInt(playerCount, 0, MaxStartPadPlayers)
	if size <= 0 {
		size = DefaultStartPadSize
	}
	if size > 8 {
		size = 8
	}
	s.Size = size
	if holdNS <= 0 {
		holdNS = DefaultStartPadHoldNS
	}
	if countdownNS <= 0 {
		countdownNS = DefaultStartCountdownNS
	}
	s.HoldNS = holdNS
	s.CountdownNS = countdownNS
	s.Started = false
	s.StartedNS = 0
	s.StartNS = 0
	for i := 0; i < MaxStartPadPlayers; i++ {
		s.pressed[i] = 0
		s.holdUntil[i] = 0
		s.Origins[i] = Point{}
	}
	s.assignStartPadOrigins(seed)
}

func (s *StartPads) Press(x int, y int, pressed bool, nowNS int64) bool {
	for player := 0; player < s.PlayerCount; player++ {
		origin := s.Origins[player]
		if x < origin.X || x >= origin.X+s.Size || y < origin.Y || y >= origin.Y+s.Size {
			continue
		}
		bit := uint64(1) << uint((y-origin.Y)*s.Size+x-origin.X)
		if pressed {
			s.pressed[player] |= bit
			s.holdUntil[player] = 0
		} else {
			s.pressed[player] &^= bit
			if s.pressed[player] == 0 {
				s.holdUntil[player] = nowNS + s.HoldNS
			}
		}
	}
	if s.AwaitingPlayers() && s.AllOccupied(nowNS) {
		s.Started = true
		s.StartedNS = nowNS
		s.StartNS = nowNS + s.CountdownNS
		return true
	}
	return false
}

func (s *StartPads) AwaitingPlayers() bool {
	return !s.Started
}

func (s *StartPads) InCountdown(nowNS int64) bool {
	return s.Started && nowNS < s.StartNS
}

func (s *StartPads) Running(nowNS int64) bool {
	return s.Started && nowNS >= s.StartNS
}

func (s *StartPads) Phase(nowNS int64) string {
	if s.AwaitingPlayers() {
		return "ready"
	}
	if s.InCountdown(nowNS) {
		return "countdown"
	}
	return "running"
}

func (s *StartPads) CountdownMillis(nowNS int64) int64 {
	if !s.InCountdown(nowNS) {
		return 0
	}
	return (s.StartNS - nowNS) / 1000000
}

func (s *StartPads) AllOccupied(nowNS int64) bool {
	if s.PlayerCount <= 0 {
		return false
	}
	for player := 0; player < s.PlayerCount; player++ {
		if !s.Occupied(player, nowNS) {
			return false
		}
	}
	return true
}

func (s *StartPads) Occupied(player int, nowNS int64) bool {
	if player < 0 || player >= s.PlayerCount {
		return false
	}
	return s.pressed[player] != 0 || nowNS < s.holdUntil[player]
}

func (s *StartPads) Origin(player int) Point {
	if player < 0 || player >= s.PlayerCount {
		return Point{}
	}
	return s.Origins[player]
}

func (s *StartPads) Contains(player int, x int, y int) bool {
	if player < 0 || player >= s.PlayerCount {
		return false
	}
	origin := s.Origins[player]
	return x >= origin.X && x < origin.X+s.Size && y >= origin.Y && y < origin.Y+s.Size
}

func (s *StartPads) ColorAt(x int, y int, nowNS int64, playerColors []string) Color {
	visible := s.AwaitingPlayers() || s.CountdownBlinkVisible(nowNS)
	for player := 0; player < s.PlayerCount; player++ {
		if !s.Contains(player, x, y) {
			continue
		}
		color := startPadPlayerColor(player, playerColors)
		if s.Occupied(player, nowNS) {
			return ScaleHexColor(color, 135)
		}
		if !visible {
			return Black
		}
		if s.AwaitingPlayers() {
			return ScaleHexColor(color, 30)
		}
		return Color(color)
	}
	return Black
}

func (s *StartPads) CountdownBlinkVisible(nowNS int64) bool {
	if !s.Started || nowNS < s.StartedNS {
		return true
	}
	elapsed := nowNS - s.StartedNS
	if elapsed >= s.CountdownNS {
		return false
	}
	halfCycle := s.CountdownNS / 6
	if halfCycle <= 0 {
		return true
	}
	return int(elapsed/halfCycle)%2 == 0
}

func ScaleHexColor(color string, percent int) Color {
	if len(color) != 7 || color[0] != '#' {
		return Color(color)
	}
	r := hexByte(color[1], color[2])
	g := hexByte(color[3], color[4])
	b := hexByte(color[5], color[6])
	return Color(hexColor(clampStartPadInt(r*percent/100, 0, 255), clampStartPadInt(g*percent/100, 0, 255), clampStartPadInt(b*percent/100, 0, 255)))
}

func Pack(ptr, length uint32) uint64 {
	return uint64(ptr)<<32 | uint64(length)
}

func Decode(ptr, length uint32, out any) error {
	if length == 0 {
		return json.Unmarshal(nil, out)
	}
	data := unsafe.Slice((*byte)(unsafe.Pointer(uintptr(ptr))), length)
	return json.Unmarshal(data, out)
}

var responseBuffer []byte
var requestBuffer []byte

func Alloc(size uint32) uint32 {
	if cap(requestBuffer) < int(size) {
		requestBuffer = make([]byte, size)
	}
	requestBuffer = requestBuffer[:size]
	if len(requestBuffer) == 0 {
		return 0
	}
	return uint32(uintptr(unsafe.Pointer(&requestBuffer[0])))
}

func Respond(value any) uint64 {
	data, err := json.Marshal(value)
	if err != nil {
		data = []byte(`{"error":"json marshal failed"}`)
	}
	responseBuffer = data
	if len(responseBuffer) == 0 {
		return 0
	}
	return Pack(uint32(uintptr(unsafe.Pointer(&responseBuffer[0]))), uint32(len(responseBuffer)))
}

func (s *StartPads) assignStartPadOrigins(seed uint32) {
	slots := defaultStartPadOrigins(s.Size)
	if seed == 0 {
		seed = 1
	}
	if s.PlayerCount == 2 {
		if startPadRand(&seed, 2) == 0 {
			s.Origins[0] = slots[0]
			s.Origins[1] = slots[1]
		} else {
			s.Origins[0] = slots[2]
			s.Origins[1] = slots[3]
		}
		if startPadRand(&seed, 2) == 1 {
			s.Origins[0], s.Origins[1] = s.Origins[1], s.Origins[0]
		}
		return
	}
	order := [MaxStartPadPlayers]int{0, 1, 2, 3, 4, 5}
	for i := MaxStartPadPlayers - 1; i > 0; i-- {
		j := startPadRand(&seed, i+1)
		order[i], order[j] = order[j], order[i]
	}
	for player := 0; player < s.PlayerCount; player++ {
		s.Origins[player] = slots[order[player]]
	}
}

func defaultStartPadOrigins(size int) [MaxStartPadPlayers]Point {
	return [MaxStartPadPlayers]Point{
		{X: 0, Y: 0},
		{X: Width - size, Y: Height - size},
		{X: 0, Y: Height - size},
		{X: Width - size, Y: 0},
		{X: 0, Y: (Height - size) / 2},
		{X: Width - size, Y: (Height - size) / 2},
	}
}

func startPadRand(seed *uint32, n int) int {
	if n <= 0 {
		return 0
	}
	*seed = *seed*1664525 + 1013904223
	return int(*seed % uint32(n))
}

func startPadPlayerColor(player int, colors []string) string {
	if player >= 0 && player < len(colors) && colors[player] != "" {
		return colors[player]
	}
	switch player {
	case 0:
		return string(Red)
	case 1:
		return string(Cyan)
	case 2:
		return string(Green)
	case 3:
		return string(Pink)
	case 4:
		return string(Blue)
	default:
		return string(Yellow)
	}
}

func clampStartPadInt(value int, min int, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func hexByte(high byte, low byte) int {
	return hexNibble(high)*16 + hexNibble(low)
}

func hexNibble(value byte) int {
	if value >= '0' && value <= '9' {
		return int(value - '0')
	}
	if value >= 'a' && value <= 'f' {
		return int(value-'a') + 10
	}
	if value >= 'A' && value <= 'F' {
		return int(value-'A') + 10
	}
	return 0
}

func hexColor(r int, g int, b int) string {
	digits := "0123456789abcdef"
	out := []byte{'#', 0, 0, 0, 0, 0, 0}
	out[1] = digits[(r>>4)&15]
	out[2] = digits[r&15]
	out[3] = digits[(g>>4)&15]
	out[4] = digits[g&15]
	out[5] = digits[(b>>4)&15]
	out[6] = digits[b&15]
	return string(out)
}
