// Source of truth for this motion-go game. The platform seed
// platform/app/src/lib/seed/pingPongV2MotionGo.ts is generated from this file;
// run 'make motion-go-seeds' after editing.
package pingpongv2

import "github.com/lobis/motion-levels/packages/motiongo"

const (
	redColor              = "#ff1c28"
	blueColor             = "#145cff"
	defaultWinningScore   = 5
	readyAnimationNS      = int64(2000000000)
	postPointPauseNS      = int64(900000000)
	winAnimationNS        = int64(3000000000)
	paddleYRed            = 2
	paddleYBlue           = 29
	paddleWidth           = 5
	serveX                = motiongo.Width / 2
	serveY                = motiongo.Height / 2
	defaultIntervalEasy   = int64(180000000)
	defaultIntervalMedium = int64(140000000)
	defaultIntervalHard   = int64(105000000)
	minIntervalEasy       = int64(72000000)
	minIntervalMedium     = int64(56000000)
	minIntervalHard       = int64(42000000)
	speedStepNS           = int64(4500000)
)

var players []motiongo.Player
var winningScore int
var startedNS int64
var readyNS int64
var lastStepNS int64
var pauseUntilNS int64
var finishNS int64
var rng uint32
var initialIntervalNS int64
var minimumIntervalNS int64
var currentIntervalNS int64
var hitCount int
var redPaddleX int
var bluePaddleX int
var ballX int
var ballY int
var ballDX int
var ballDY int
var teamScore [2]int
var tileHeld [motiongo.Width * motiongo.Height]bool
var halfHeld [2]int
var phase string
var success bool
var scorer int
var winner int
var lastMessage string

//export alloc
func gameAlloc(size uint32) uint32 {
	return motiongo.Alloc(size)
}

//export init
func gameInit(ptr uint32, length uint32) uint64 {
	var req motiongo.InitRequest
	_ = motiongo.Decode(ptr, length, &req)
	players = req.Players
	if len(players) == 0 {
		players = []motiongo.Player{
			{Index: 0, Label: "Rojo", Color: redColor},
			{Index: 1, Label: "Azul", Color: blueColor},
		}
	}
	if len(players) > motiongo.MaxStartPadPlayers {
		players = players[:motiongo.MaxStartPadPlayers]
	}
	rng = uint32(req.Seed)
	if rng == 0 {
		rng = 202
	}
	winningScore = clamp(req.Config.Int("points_to_win", defaultWinningScore), 1, 21)
	initialIntervalNS, minimumIntervalNS = speedForDifficulty(req.Difficulty)
	startedNS = req.NowUnixNS
	resetGame(req.NowUnixNS)
	return motiongo.Respond([]motiongo.Event{{Cue: "ready", Message: "Ping Pong V2 espera rojo y azul."}})
}

//export press
func gamePress(ptr uint32, length uint32) uint64 {
	var req motiongo.PressRequest
	_ = motiongo.Decode(ptr, length, &req)
	updateOccupancy(req.X, req.Y, req.Pressed)
	if req.Pressed {
		movePaddle(req.X, req.Y)
	}
	events := updatePhase(req.NowUnixNS)
	return motiongo.Respond(events)
}

//export tick
func gameTick(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	events := updatePhase(req.NowUnixNS)
	if phase != "running" {
		if len(events) == 0 {
			return 0
		}
		return motiongo.Respond(events)
	}
	if req.NowUnixNS < pauseUntilNS {
		if len(events) == 0 {
			return 0
		}
		return motiongo.Respond(events)
	}

	steps := 0
	for steps < 8 {
		if req.NowUnixNS-lastStepNS < currentIntervalNS {
			break
		}
		lastStepNS += currentIntervalNS
		event := moveBall(lastStepNS)
		if event.Message != "" {
			events = append(events, event)
		}
		steps++
		if phase != "running" || lastStepNS < pauseUntilNS {
			break
		}
	}
	if len(events) == 0 {
		return 0
	}
	return motiongo.Respond(events)
}

//export render
func gameRender(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	frame := motiongo.NewFrame(motiongo.Black)

	if phase == "waiting" {
		drawWaiting(&frame, req.NowUnixNS)
		return motiongo.Respond(frame)
	}
	if phase == "starting" {
		drawReady(&frame, req.NowUnixNS)
		return motiongo.Respond(frame)
	}
	if phase == "finished" {
		drawWin(&frame, req.NowUnixNS)
		return motiongo.Respond(frame)
	}

	drawScore(&frame)
	drawPaddles(&frame)
	if req.NowUnixNS < pauseUntilNS {
		drawScoreFlash(&frame, req.NowUnixNS)
	} else {
		frame.FillRect(ballX, ballY, 1, 1, motiongo.White)
	}
	return motiongo.Respond(frame)
}

//export snapshot
func gameSnapshot(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	_ = updatePhase(req.NowUnixNS)

	countdown := int64(0)
	if phase == "starting" && req.NowUnixNS < readyNS {
		countdown = (readyNS - req.NowUnixNS) / 1000000
	}
	remaining := int64(0)
	if phase == "finished" && req.NowUnixNS < finishNS+winAnimationNS {
		remaining = (finishNS + winAnimationNS - req.NowUnixNS) / 1000000
	}

	return motiongo.Respond(motiongo.Snapshot{
		Phase:           phase,
		Score:           teamScore[0] + teamScore[1],
		StartedUnix:     startedNS / 1000000000,
		EndsUnix:        0,
		ElapsedMillis:   (req.NowUnixNS - startedNS) / 1000000,
		RemainingMillis: remaining,
		CountdownMillis: countdown,
		ActiveTargets:   activeHalves(),
		Success:         success,
		Players: []motiongo.PlayerSnapshot{
			{Index: 0, Label: labelForTeam(0), Color: redColor, Score: teamScore[0], Lives: winningScore - teamScore[0]},
			{Index: 1, Label: labelForTeam(1), Color: blueColor, Score: teamScore[1], Lives: winningScore - teamScore[1]},
		},
	})
}

func resetGame(nowNS int64) {
	for i := 0; i < len(tileHeld); i++ {
		tileHeld[i] = false
	}
	halfHeld[0] = 0
	halfHeld[1] = 0
	teamScore[0] = 0
	teamScore[1] = 0
	redPaddleX = (motiongo.Width - paddleWidth) / 2
	bluePaddleX = redPaddleX
	phase = "waiting"
	success = false
	scorer = -1
	winner = -1
	startedNS = nowNS
	readyNS = 0
	finishNS = 0
	resetBall()
	lastMessage = "Esperando a rojo arriba y azul abajo."
}

func updatePhase(nowNS int64) []motiongo.Event {
	events := []motiongo.Event{}
	if phase == "finished" {
		if nowNS-finishNS >= winAnimationNS {
			resetGame(nowNS)
			events = append(events, motiongo.Event{Cue: "ready", Message: "Nueva partida."})
		}
		return events
	}
	if phase == "waiting" && halvesReady() {
		phase = "starting"
		readyNS = nowNS + readyAnimationNS
		lastMessage = "Rojo y azul listos."
		return append(events, motiongo.Event{Cue: "start", Message: "Rojo y azul listos."})
	}
	if phase == "starting" {
		if !halvesReady() {
			phase = "waiting"
			readyNS = 0
			lastMessage = "Falta un jugador."
			return append(events, motiongo.Event{Cue: "ready", Message: "Falta un jugador."})
		}
		if nowNS >= readyNS {
			phase = "running"
			startedNS = nowNS
			lastStepNS = nowNS
			serve()
			return append(events, motiongo.Event{Cue: "start", Message: "La pelota esta en juego."})
		}
	}
	return events
}

func updateOccupancy(x int, y int, pressed bool) {
	if x < 0 || x >= motiongo.Width || y < 0 || y >= motiongo.Height {
		return
	}
	index := y*motiongo.Width + x
	if tileHeld[index] == pressed {
		return
	}
	tileHeld[index] = pressed
	half := halfForY(y)
	if pressed {
		halfHeld[half]++
	} else if halfHeld[half] > 0 {
		halfHeld[half]--
	}
}

func movePaddle(x int, y int) {
	center := clamp(x, paddleWidth/2, motiongo.Width-1-paddleWidth/2)
	left := center - paddleWidth/2
	if y < motiongo.Height/2 {
		redPaddleX = left
	} else {
		bluePaddleX = left
	}
}

func moveBall(nowNS int64) motiongo.Event {
	nextX := ballX + ballDX
	nextY := ballY + ballDY
	if nextX < 0 {
		nextX = 0
		ballDX = 1
	}
	if nextX >= motiongo.Width {
		nextX = motiongo.Width - 1
		ballDX = -1
	}
	if ballDY < 0 && nextY == paddleYRed && nextX >= redPaddleX && nextX < redPaddleX+paddleWidth {
		reflectFromPaddle(nextX, redPaddleX)
		ballDY = 1
		ballX = nextX
		ballY = paddleYRed + 1
		accelerate()
		return motiongo.Event{Cue: "coin", Message: "Rojo devuelve."}
	}
	if ballDY > 0 && nextY == paddleYBlue && nextX >= bluePaddleX && nextX < bluePaddleX+paddleWidth {
		reflectFromPaddle(nextX, bluePaddleX)
		ballDY = -1
		ballX = nextX
		ballY = paddleYBlue - 1
		accelerate()
		return motiongo.Event{Cue: "coin", Message: "Azul devuelve."}
	}
	if nextY < 0 {
		scorePoint(1, nowNS)
		return motiongo.Event{Cue: "score", Message: "Punto para azul."}
	}
	if nextY >= motiongo.Height {
		scorePoint(0, nowNS)
		return motiongo.Event{Cue: "score", Message: "Punto para rojo."}
	}
	ballX = nextX
	ballY = nextY
	return motiongo.Event{}
}

func scorePoint(team int, nowNS int64) {
	teamScore[team]++
	scorer = team
	if teamScore[team] >= winningScore {
		phase = "finished"
		success = team == 1
		winner = team
		finishNS = nowNS
		if team == 0 {
			lastMessage = "Gana rojo."
		} else {
			lastMessage = "Gana azul."
		}
		return
	}
	resetBall()
	pauseUntilNS = nowNS + postPointPauseNS
	lastStepNS = pauseUntilNS
	lastMessage = "Nuevo saque."
}

func resetBall() {
	ballX = serveX
	ballY = serveY
	currentIntervalNS = initialIntervalNS
	hitCount = 0
	pauseUntilNS = 0
	serve()
}

func serve() {
	ballX = serveX
	ballY = serveY
	rng = rng*1664525 + 1013904223
	if rng%2 == 0 {
		ballDY = -1
	} else {
		ballDY = 1
	}
	rng = rng*1664525 + 1013904223
	if rng%2 == 0 {
		ballDX = -1
	} else {
		ballDX = 1
	}
}

func reflectFromPaddle(x int, paddleX int) {
	center := paddleX + paddleWidth/2
	if x < center {
		ballDX = -1
	} else if x > center {
		ballDX = 1
	} else {
		rng = rng*1664525 + 1013904223
		if rng%2 == 0 {
			ballDX = -1
		} else {
			ballDX = 1
		}
	}
}

func accelerate() {
	hitCount++
	currentIntervalNS = initialIntervalNS - int64(hitCount)*speedStepNS
	if currentIntervalNS < minimumIntervalNS {
		currentIntervalNS = minimumIntervalNS
	}
}

func drawWaiting(frame *motiongo.Frame, nowNS int64) {
	pulse := int((nowNS / 180000000) % 4)
	redReady := halfHeld[0] > 0
	blueReady := halfHeld[1] > 0
	drawHalf(frame, 0, colorWhenReady(0, redReady, pulse))
	drawHalf(frame, 1, colorWhenReady(1, blueReady, pulse))
	if redReady {
		frame.FillRect(4, 5, 8, 3, motiongo.Color(redColor))
	} else {
		drawOutline(frame, 2+pulse, 4+pulse, motiongo.Width-4-pulse*2, 6, motiongo.Color(redColor))
	}
	if blueReady {
		frame.FillRect(4, 24, 8, 3, motiongo.Color(blueColor))
	} else {
		drawOutline(frame, 2+pulse, 22-pulse, motiongo.Width-4-pulse*2, 6, motiongo.Color(blueColor))
	}
}

func drawReady(frame *motiongo.Frame, nowNS int64) {
	elapsed := nowNS - (readyNS - readyAnimationNS)
	if elapsed < 0 {
		elapsed = 0
	}
	radius := int(elapsed * int64(motiongo.Width/2) / readyAnimationNS)
	if radius < 1 {
		radius = 1
	}
	if radius > motiongo.Width/2 {
		radius = motiongo.Width / 2
	}
	for y := 0; y < motiongo.Height; y++ {
		for x := 0; x < motiongo.Width; x++ {
			dx := abs(x - serveX)
			dy := abs(y - serveY)
			if dx+dy <= radius+1 {
				if y < motiongo.Height/2 {
					frame.Set(x, y, motiongo.Color(redColor))
				} else {
					frame.Set(x, y, motiongo.Color(blueColor))
				}
			}
		}
	}
	frame.FillRect(serveX, serveY, 1, 1, motiongo.White)
}

func drawScoreFlash(frame *motiongo.Frame, nowNS int64) {
	color := motiongo.Color(redColor)
	if scorer == 1 {
		color = motiongo.Color(blueColor)
	}
	wave := int(((pauseUntilNS - nowNS) / 90000000) % 5)
	for y := 0; y < motiongo.Height; y++ {
		for x := 0; x < motiongo.Width; x++ {
			if (x+y+wave)%5 == 0 {
				frame.Set(x, y, color)
			}
		}
	}
	drawPaddles(frame)
}

func drawWin(frame *motiongo.Frame, nowNS int64) {
	color := motiongo.Color(redColor)
	if winner == 1 {
		color = motiongo.Color(blueColor)
	}
	phaseStep := int((nowNS / 120000000) % 6)
	for y := 0; y < motiongo.Height; y++ {
		for x := 0; x < motiongo.Width; x++ {
			if (x+y+phaseStep)%6 < 3 {
				frame.Set(x, y, color)
			}
		}
	}
	frame.FillRect(serveX-1, serveY-1, 3, 3, motiongo.White)
}

func drawScore(frame *motiongo.Frame) {
	for i := 0; i < teamScore[0] && i < motiongo.Width; i++ {
		frame.Set(i, 0, motiongo.Color(redColor))
	}
	for i := 0; i < teamScore[1] && i < motiongo.Width; i++ {
		frame.Set(i, motiongo.Height-1, motiongo.Color(blueColor))
	}
}

func drawPaddles(frame *motiongo.Frame) {
	frame.FillRect(redPaddleX, paddleYRed, paddleWidth, 1, motiongo.Color(redColor))
	frame.FillRect(bluePaddleX, paddleYBlue, paddleWidth, 1, motiongo.Color(blueColor))
}

func drawHalf(frame *motiongo.Frame, half int, color motiongo.Color) {
	startY := 0
	if half == 1 {
		startY = motiongo.Height / 2
	}
	for y := startY; y < startY+motiongo.Height/2; y++ {
		for x := 0; x < motiongo.Width; x++ {
			if (x+y)%4 == 0 {
				frame.Set(x, y, color)
			}
		}
	}
}

func drawOutline(frame *motiongo.Frame, x int, y int, width int, height int, color motiongo.Color) {
	if width < 2 {
		width = 2
	}
	if height < 2 {
		height = 2
	}
	frame.FillRect(x, y, width, 1, color)
	frame.FillRect(x, y+height-1, width, 1, color)
	frame.FillRect(x, y, 1, height, color)
	frame.FillRect(x+width-1, y, 1, height, color)
}

func colorWhenReady(team int, ready bool, pulse int) motiongo.Color {
	if ready || pulse < 2 {
		if team == 0 {
			return motiongo.Color(redColor)
		}
		return motiongo.Color(blueColor)
	}
	return motiongo.Black
}

func halvesReady() bool {
	return halfHeld[0] > 0 && halfHeld[1] > 0
}

func activeHalves() int {
	out := 0
	if halfHeld[0] > 0 {
		out++
	}
	if halfHeld[1] > 0 {
		out++
	}
	return out
}

func halfForY(y int) int {
	if y < motiongo.Height/2 {
		return 0
	}
	return 1
}

func speedForDifficulty(value string) (int64, int64) {
	switch value {
	case "easy":
		return defaultIntervalEasy, minIntervalEasy
	case "hard", "expert":
		return defaultIntervalHard, minIntervalHard
	default:
		return defaultIntervalMedium, minIntervalMedium
	}
}

func labelForTeam(team int) string {
	if team < len(players) && players[team].Label != "" {
		return players[team].Label
	}
	if team == 0 {
		return "Rojo"
	}
	return "Azul"
}

func abs(value int) int {
	if value < 0 {
		return -value
	}
	return value
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
