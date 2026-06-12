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
