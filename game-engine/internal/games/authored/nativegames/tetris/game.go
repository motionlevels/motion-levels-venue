// Code generated from platform/app/src/lib/seed; keep gameplay changes in sync with browser preview source.
package tetris

import "github.com/lobis/motion-levels/packages/motiongo"

const (
	boardX                 = 3
	boardW                 = 10
	startY                 = 0
	startDelayNS           = int64(1800000000)
	rotateCooldownNS       = int64(180000000)
	maxGravityCatchupSteps = 4
)

type pieceState struct {
	shape int
	rot   int
	x     int
	y     int
	color motiongo.Color
}

var shapes = [7][4][4][2]int{
	{
		{{0, 0}, {1, 0}, {2, 0}, {3, 0}},
		{{0, 0}, {0, 1}, {0, 2}, {0, 3}},
		{{0, 0}, {1, 0}, {2, 0}, {3, 0}},
		{{0, 0}, {0, 1}, {0, 2}, {0, 3}},
	},
	{
		{{0, 0}, {1, 0}, {0, 1}, {1, 1}},
		{{0, 0}, {1, 0}, {0, 1}, {1, 1}},
		{{0, 0}, {1, 0}, {0, 1}, {1, 1}},
		{{0, 0}, {1, 0}, {0, 1}, {1, 1}},
	},
	{
		{{1, 0}, {0, 1}, {1, 1}, {2, 1}},
		{{0, 0}, {0, 1}, {1, 1}, {0, 2}},
		{{0, 0}, {1, 0}, {2, 0}, {1, 1}},
		{{1, 0}, {0, 1}, {1, 1}, {1, 2}},
	},
	{
		{{1, 0}, {2, 0}, {0, 1}, {1, 1}},
		{{0, 0}, {0, 1}, {1, 1}, {1, 2}},
		{{1, 0}, {2, 0}, {0, 1}, {1, 1}},
		{{0, 0}, {0, 1}, {1, 1}, {1, 2}},
	},
	{
		{{0, 0}, {1, 0}, {1, 1}, {2, 1}},
		{{1, 0}, {0, 1}, {1, 1}, {0, 2}},
		{{0, 0}, {1, 0}, {1, 1}, {2, 1}},
		{{1, 0}, {0, 1}, {1, 1}, {0, 2}},
	},
	{
		{{0, 0}, {0, 1}, {1, 1}, {2, 1}},
		{{0, 0}, {1, 0}, {0, 1}, {0, 2}},
		{{0, 0}, {1, 0}, {2, 0}, {2, 1}},
		{{1, 0}, {1, 1}, {0, 2}, {1, 2}},
	},
	{
		{{2, 0}, {0, 1}, {1, 1}, {2, 1}},
		{{0, 0}, {0, 1}, {0, 2}, {1, 2}},
		{{0, 0}, {1, 0}, {2, 0}, {0, 1}},
		{{0, 0}, {1, 0}, {1, 1}, {1, 2}},
	},
}

var palette = [7]motiongo.Color{"#36d9ff", "#ffd166", "#ff52c8", "#34c759", "#ff7a1a", "#0a84ff", "#ff3b30"}
var lineScores = [5]int{0, 100, 300, 500, 800}
var board [motiongo.Height][motiongo.Width]string
var active pieceState
var next pieceState
var players []motiongo.Player
var rng uint32
var score int
var lines int
var level int
var targetX int
var playerX int
var playerY int
var startedNS int64
var lastFallNS int64
var lastRotateNS int64
var lastClearNS int64
var lastClearCount int
var lostNS int64
var finished bool

//export alloc
func gameAlloc(size uint32) uint32 {
	return motiongo.Alloc(size)
}

//export init
func gameInit(ptr uint32, length uint32) uint64 {
	var req motiongo.InitRequest
	_ = motiongo.Decode(ptr, length, &req)
	players = req.Players
	rng = uint32(req.Seed)
	if rng == 0 {
		rng = uint32(req.NowUnixNS)
	}
	score = 0
	lines = 0
	level = 1
	finished = false
	lostNS = 0
	lastClearNS = 0
	lastClearCount = 0
	startedNS = req.NowUnixNS
	lastFallNS = startedNS + startDelayNS
	lastRotateNS = 0
	playerX = boardX + boardW/2
	playerY = motiongo.Height - 1
	clearBoard()
	active = randomPiece()
	next = randomPiece()
	targetX = active.x
	if collidesPiece(active, active.x, active.y, active.rot) {
		finish(req.NowUnixNS)
	}
	return motiongo.Respond([]motiongo.Event{{Cue: "start", Message: "Tetris"}})
}

//export press
func gamePress(ptr uint32, length uint32) uint64 {
	var req motiongo.PressRequest
	_ = motiongo.Decode(ptr, length, &req)
	if !req.Pressed || finished || req.NowUnixNS-startedNS < startDelayNS {
		return motiongo.Respond([]motiongo.Event{})
	}
	if rotateZone(req.X, req.Y, -1) {
		rotatePiece(-1, req.NowUnixNS)
		return motiongo.Respond([]motiongo.Event{{Cue: "tick", Message: "Rotar izquierda"}})
	}
	if rotateZone(req.X, req.Y, 1) {
		rotatePiece(1, req.NowUnixNS)
		return motiongo.Respond([]motiongo.Event{{Cue: "tick", Message: "Rotar derecha"}})
	}
	if req.X < boardX || req.X >= boardX+boardW {
		return motiongo.Respond([]motiongo.Event{})
	}
	playerX = clamp(req.X, boardX+1, boardX+boardW-2)
	playerY = clamp(req.Y, 1, motiongo.Height-1)
	targetX = clamp(req.X-pieceWidth(active)/2, boardX, boardX+boardW-pieceWidth(active))
	steerPiece()
	return motiongo.Respond([]motiongo.Event{})
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
	drawBoard(frame, req.NowUnixNS)
	drawNext(frame, req.NowUnixNS)
	drawScore(frame)
	drawGuide(frame, req.NowUnixNS)
	drawGhost(frame)
	drawActive(frame)
	drawStart(frame, req.NowUnixNS)
	drawLost(frame, req.NowUnixNS)
	return motiongo.Respond(frame)
}

//export snapshot
func gameSnapshot(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	tick(req.NowUnixNS)
	phase := "running"
	if req.NowUnixNS-startedNS < startDelayNS && !finished {
		phase = "starting"
	}
	if finished {
		phase = "lost"
	}
	elapsed := int64(0)
	if startedNS > 0 {
		elapsed = (req.NowUnixNS - startedNS) / 1000000
	}
	snapPlayers := make([]motiongo.PlayerSnapshot, 0, len(players))
	for i, player := range players {
		snapPlayers = append(snapPlayers, motiongo.PlayerSnapshot{
			Index: i,
			Label: player.Label,
			Color: player.Color,
			Score: score,
		})
	}
	return motiongo.Respond(motiongo.Snapshot{
		Phase:           phase,
		Score:           score,
		StartedUnix:     startedNS / 1000000000,
		EndsUnix:        0,
		ElapsedMillis:   elapsed,
		RemainingMillis: 0,
		ActiveTargets:   1,
		Success:         !finished,
		Players:         snapPlayers,
	})
}

func tick(nowNS int64) {
	if finished || nowNS-startedNS < startDelayNS {
		return
	}
	if nowNS < lastFallNS {
		lastFallNS = nowNS
		return
	}
	interval := gravityInterval()
	if playerY > active.y+5 {
		interval = interval / 3
		if interval < 70000000 {
			interval = 70000000
		}
	} else if playerY < active.y-2 {
		interval = interval + interval/3
	}
	maxCatchup := interval * int64(maxGravityCatchupSteps)
	if nowNS-lastFallNS > maxCatchup {
		lastFallNS = nowNS - maxCatchup
	}
	steps := 0
	for nowNS-lastFallNS >= interval && steps < maxGravityCatchupSteps && !finished {
		steerPiece()
		if collidesPiece(active, active.x, active.y+1, active.rot) {
			lockPiece(nowNS)
			lastFallNS = nowNS
			break
		} else {
			active.y++
		}
		lastFallNS += interval
		steps++
	}
}

func clearBoard() {
	for y := 0; y < motiongo.Height; y++ {
		for x := 0; x < motiongo.Width; x++ {
			board[y][x] = ""
		}
	}
}

func randomPiece() pieceState {
	shape := int(nextRand() % uint32(len(shapes)))
	piece := pieceState{
		shape: shape,
		rot:   0,
		x:     boardX + boardW/2 - pieceWidthFor(shape, 0)/2,
		y:     startY,
		color: palette[shape],
	}
	return piece
}

func spawnNext(nowNS int64) {
	active = next
	active.x = boardX + boardW/2 - pieceWidth(active)/2
	active.y = startY
	targetX = active.x
	playerX = clamp(targetX+pieceWidth(active)/2, boardX+1, boardX+boardW-2)
	next = randomPiece()
	lastFallNS = nowNS
	if collidesPiece(active, active.x, active.y, active.rot) {
		finish(nowNS)
	}
}

func lockPiece(nowNS int64) {
	for i := 0; i < 4; i++ {
		cx := active.x + shapes[active.shape][active.rot][i][0]
		cy := active.y + shapes[active.shape][active.rot][i][1]
		if cx >= boardX && cx < boardX+boardW && cy >= 0 && cy < motiongo.Height {
			board[cy][cx] = string(active.color)
		}
	}
	cleared := clearLines()
	if cleared > 0 {
		level = lines/10 + 1
		score += lineScores[cleared] * level
		lastClearNS = nowNS
		lastClearCount = cleared
	}
	spawnNext(nowNS)
}

func clearLines() int {
	cleared := 0
	for y := motiongo.Height - 1; y >= 0; y-- {
		full := true
		for x := boardX; x < boardX+boardW; x++ {
			if board[y][x] == "" {
				full = false
			}
		}
		if full {
			cleared++
			lines++
			for pull := y; pull > 0; pull-- {
				for x := boardX; x < boardX+boardW; x++ {
					board[pull][x] = board[pull-1][x]
				}
			}
			for x := boardX; x < boardX+boardW; x++ {
				board[0][x] = ""
			}
			y++
		}
	}
	return cleared
}

func steerPiece() {
	targetX = clamp(targetX, boardX, boardX+boardW-pieceWidth(active))
	if active.x < targetX && !collidesPiece(active, active.x+1, active.y, active.rot) {
		active.x++
	}
	if active.x > targetX && !collidesPiece(active, active.x-1, active.y, active.rot) {
		active.x--
	}
}

func rotatePiece(direction int, nowNS int64) {
	if nowNS-lastRotateNS < rotateCooldownNS {
		return
	}
	nextRot := (active.rot + direction + 4) % 4
	kicks := [5]int{0, -1, 1, -2, 2}
	for i := 0; i < len(kicks); i++ {
		nextX := active.x + kicks[i]
		if !collidesPiece(active, nextX, active.y, nextRot) {
			active.x = nextX
			active.rot = nextRot
			targetX = clamp(targetX, boardX, boardX+boardW-pieceWidth(active))
			lastRotateNS = nowNS
			return
		}
	}
}

func collidesPiece(piece pieceState, x int, y int, rot int) bool {
	for i := 0; i < 4; i++ {
		cx := x + shapes[piece.shape][rot][i][0]
		cy := y + shapes[piece.shape][rot][i][1]
		if cx < boardX || cx >= boardX+boardW || cy >= motiongo.Height {
			return true
		}
		if cy >= 0 && board[cy][cx] != "" {
			return true
		}
	}
	return false
}

func rotateZone(x int, y int, direction int) bool {
	buttonY := rotateButtonY()
	if y != buttonY {
		return false
	}
	if direction < 0 {
		return x == playerX-1
	}
	return x == playerX+1
}

func rotateButtonY() int {
	return clamp(playerY-1, 1, motiongo.Height-2)
}

func gravityInterval() int64 {
	interval := int64(720000000 - (level-1)*45000000)
	if interval < 100000000 {
		interval = 100000000
	}
	return interval
}

func finish(nowNS int64) {
	finished = true
	if lostNS == 0 {
		lostNS = nowNS
	}
}

func drawBoard(frame motiongo.Frame, nowNS int64) {
	for y := 0; y < motiongo.Height; y++ {
		frame.Set(boardX-1, y, motiongo.Color("#06131a"))
		frame.Set(boardX+boardW, y, motiongo.Color("#06131a"))
		for x := boardX; x < boardX+boardW; x++ {
			color := motiongo.Color("#020609")
			if board[y][x] != "" {
				color = motiongo.Color(board[y][x])
			}
			frame.Set(x, y, color)
		}
	}
	if lastClearCount > 0 && nowNS-lastClearNS < 280000000 {
		flashY := motiongo.Height - 1 - clamp(int((nowNS-lastClearNS)/70000000), 0, 3)
		for x := boardX; x < boardX+boardW; x++ {
			frame.Set(x, flashY, motiongo.White)
		}
	}
}

func drawGuide(frame motiongo.Frame, nowNS int64) {
	if finished || nowNS-startedNS < startDelayNS {
		return
	}
	if board[playerY][playerX] == "" {
		frame.Set(playerX, playerY, motiongo.Color("#12303a"))
	}
	drawRotateButtons(frame)
}

func drawRotateButtons(frame motiongo.Frame) {
	buttonY := rotateButtonY()
	if board[buttonY][playerX-1] == "" {
		frame.Set(playerX-1, buttonY, motiongo.Color("#7a1f61"))
	}
	if board[buttonY][playerX+1] == "" {
		frame.Set(playerX+1, buttonY, motiongo.Color("#7a5f1f"))
	}
}

func drawGhost(frame motiongo.Frame) {
	if finished {
		return
	}
	landingY := active.y
	for !collidesPiece(active, active.x, landingY+1, active.rot) {
		landingY++
	}
	if landingY == active.y {
		return
	}
	for i := 0; i < 4; i++ {
		cx := active.x + shapes[active.shape][active.rot][i][0]
		cy := landingY + shapes[active.shape][active.rot][i][1]
		if cy >= 0 && cy < motiongo.Height && board[cy][cx] == "" {
			frame.Set(cx, cy, motiongo.Color("#17404a"))
		}
	}
}

func drawActive(frame motiongo.Frame) {
	if finished {
		return
	}
	for i := 0; i < 4; i++ {
		cx := active.x + shapes[active.shape][active.rot][i][0]
		cy := active.y + shapes[active.shape][active.rot][i][1]
		frame.Set(cx, cy, active.color)
	}
}

func drawNext(frame motiongo.Frame, nowNS int64) {
	if finished || nowNS-startedNS < startDelayNS || active.y < 5 {
		return
	}
	preview := next
	preview.x = boardX + boardW/2 - pieceWidth(preview)/2
	preview.y = startY
	for i := 0; i < 4; i++ {
		cx := preview.x + shapes[preview.shape][preview.rot][i][0]
		cy := preview.y + shapes[preview.shape][preview.rot][i][1]
		frame.Set(cx, cy, motiongo.Color("#12303a"))
	}
}

func drawScore(frame motiongo.Frame) {
	height := clamp(lines, 0, motiongo.Height)
	for y := motiongo.Height - height; y < motiongo.Height; y++ {
		frame.Set(0, y, motiongo.Yellow)
		frame.Set(motiongo.Width-1, y, motiongo.Cyan)
	}
	levelHeight := clamp(level, 1, motiongo.Height)
	for y := motiongo.Height - levelHeight; y < motiongo.Height; y++ {
		frame.Set(1, y, motiongo.Color("#12384a"))
		frame.Set(motiongo.Width-2, y, motiongo.Color("#12384a"))
	}
}

func drawStart(frame motiongo.Frame, nowNS int64) {
	elapsed := nowNS - startedNS
	if elapsed < 0 || elapsed >= startDelayNS || finished {
		return
	}
	rows := clamp(int(elapsed*int64(motiongo.Height)/startDelayNS), 0, motiongo.Height)
	for y := 0; y <= rows; y++ {
		frame.Set(boardX-1, y, motiongo.Cyan)
		frame.Set(boardX+boardW, y, motiongo.Cyan)
	}
	for i := 0; i < 4; i++ {
		x := boardX + 3 + i
		frame.Set(x, 4, motiongo.Color("#12384a"))
		frame.Set(x, 5, motiongo.Cyan)
	}
}

func drawLost(frame motiongo.Frame, nowNS int64) {
	if !finished {
		return
	}
	elapsed := nowNS - lostNS
	border := motiongo.Color("#67151f")
	accent := motiongo.Color("#2c0810")
	if (elapsed/260000000)%2 == 0 {
		border = motiongo.Red
		accent = motiongo.Color("#441018")
	}
	for y := 0; y < motiongo.Height; y++ {
		frame.Set(boardX-1, y, border)
		frame.Set(boardX+boardW, y, border)
	}
	for x := boardX; x < boardX+boardW; x++ {
		frame.Set(x, 0, accent)
		frame.Set(x, motiongo.Height-1, accent)
	}
	centerY := motiongo.Height / 2
	for x := boardX + 2; x < boardX+boardW-2; x++ {
		frame.Set(x, centerY, border)
		if x == boardX+2 || x == boardX+boardW-3 {
			frame.Set(x, centerY-1, border)
			frame.Set(x, centerY+1, border)
		}
	}
}

func pieceWidth(piece pieceState) int {
	return pieceWidthFor(piece.shape, piece.rot)
}

func pieceWidthFor(shape int, rot int) int {
	minX := 99
	maxX := -99
	for i := 0; i < 4; i++ {
		x := shapes[shape][rot][i][0]
		if x < minX {
			minX = x
		}
		if x > maxX {
			maxX = x
		}
	}
	return maxX - minX + 1
}

func nextRand() uint32 {
	rng = rng*1664525 + 1013904223
	return rng
}

func clamp(value int, min int, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}
