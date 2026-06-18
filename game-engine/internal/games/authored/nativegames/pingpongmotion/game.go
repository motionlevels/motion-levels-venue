// Code generated from deployed authored-ping-pong-motion source; keep gameplay changes in sync with browser preview source.
package pingpongmotion

import "github.com/lobis/motion-levels/packages/motiongo"

const (
	gameDurationNS = int64(120000000000)
	topPaddleY     = 2
	bottomPaddleY  = 29
	paddleW        = 5
	winningScore   = 7
	startInterval  = int64(220000000)
	minInterval    = int64(65000000)
)

var players []motiongo.Player
var teamScore [2]int
var startedNS int64
var endsNS int64
var lastStepNS int64
var rng uint32
var redPaddleX int
var bluePaddleX int
var ballX int
var ballY int
var ballDX int
var ballDY int
var started bool
var finished bool
var success bool
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
			{Index: 0, Label: "Rojo", Color: "#ff4d5a"},
			{Index: 1, Label: "Azul", Color: "#36d9ff"},
		}
	}
	if len(players) > motiongo.MaxStartPadPlayers {
		players = players[:motiongo.MaxStartPadPlayers]
	}
	rng = uint32(req.Seed)
	if rng == 0 {
		rng = 99
	}
	startedNS = req.NowUnixNS
	endsNS = startedNS + gameDurationNS
	resetMatch()
	return motiongo.Respond([]motiongo.Event{{Cue: "start", Message: "Ping Pong listo."}})
}

//export press
func gamePress(ptr uint32, length uint32) uint64 {
	var req motiongo.PressRequest
	_ = motiongo.Decode(ptr, length, &req)
	if !req.Pressed {
		return motiongo.Respond([]motiongo.Event{})
	}
	if finished {
		resetMatch()
		startedNS = req.NowUnixNS
		endsNS = startedNS + gameDurationNS
	}
	movePaddle(req.X, req.Y)
	if !started {
		started = true
		lastStepNS = req.NowUnixNS
		serve(req.NowUnixNS)
		return motiongo.Respond([]motiongo.Event{{Cue: "start", Message: "La pelota sale desde el centro."}})
	}
	return motiongo.Respond([]motiongo.Event{})
}

//export tick
func gameTick(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	if finished || !started {
		return 0
	}
	if req.NowUnixNS >= endsNS {
		finished = true
		success = teamScore[1] >= teamScore[0]
		lastMessage = "Tiempo agotado."
		return motiongo.Respond([]motiongo.Event{{Cue: "defeat", Message: lastMessage}})
	}

	events := []motiongo.Event{}
	steps := 0
	for steps < 6 {
		interval := currentInterval(req.NowUnixNS)
		if req.NowUnixNS-lastStepNS < interval {
			break
		}
		lastStepNS += interval
		event := moveBall()
		if event.Message != "" {
			events = append(events, event)
		}
		steps++
		if finished || !started {
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
	frame := motiongo.NewFrame(motiongo.Black)
	frame.FillRect(0, 0, motiongo.Width, motiongo.Height, motiongo.Color("#050914"))

	drawCenterLine(&frame)
	frame.FillRect(redPaddleX, topPaddleY, paddleW, 1, motiongo.Color("#ff4d5a"))
	frame.FillRect(bluePaddleX, bottomPaddleY, paddleW, 1, motiongo.Color("#36d9ff"))
	frame.FillRect(ballX, ballY, 1, 1, motiongo.White)
	drawScore(&frame)

	if !started && !finished {
		frame.FillRect(4, 14, 8, 4, motiongo.Color("#1f6feb"))
		frame.FillRect(6, 15, 4, 1, motiongo.White)
		frame.FillRect(5, 17, 6, 1, motiongo.Color("#ffd166"))
	}
	if finished {
		color := motiongo.Color("#ff4d5a")
		if teamScore[1] >= teamScore[0] {
			color = motiongo.Color("#36d9ff")
		}
		frame.FillRect(2, 13, 12, 6, color)
		frame.FillRect(4, 15, 8, 1, motiongo.White)
		frame.FillRect(5, 17, 6, 1, motiongo.Color("#ffd166"))
	}

	return motiongo.Respond(frame)
}

//export snapshot
func gameSnapshot(ptr uint32, length uint32) uint64 {
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)

	remaining := int64(0)
	if req.NowUnixNS < endsNS {
		remaining = (endsNS - req.NowUnixNS) / 1000000
	}
	phase := "ready"
	if started {
		phase = "running"
	}
	if finished {
		phase = "finished"
	}

	playerSnapshots := make([]motiongo.PlayerSnapshot, 0, 2)
	playerSnapshots = append(playerSnapshots, motiongo.PlayerSnapshot{
		Index: 0,
		Label: labelForTeam(0),
		Color: "#ff4d5a",
		Score: teamScore[0],
		Lives: winningScore - teamScore[1],
	})
	playerSnapshots = append(playerSnapshots, motiongo.PlayerSnapshot{
		Index: 1,
		Label: labelForTeam(1),
		Color: "#36d9ff",
		Score: teamScore[1],
		Lives: winningScore - teamScore[0],
	})

	return motiongo.Respond(motiongo.Snapshot{
		Phase:           phase,
		Score:           teamScore[0] + teamScore[1],
		Lives:           (winningScore - teamScore[0]) + (winningScore - teamScore[1]),
		StartedUnix:     startedNS / 1000000000,
		EndsUnix:        endsNS / 1000000000,
		ElapsedMillis:   (req.NowUnixNS - startedNS) / 1000000,
		RemainingMillis: remaining,
		ActiveTargets:   1,
		Success:         success,
		Players:         playerSnapshots,
	})
}

func resetMatch() {
	teamScore[0] = 0
	teamScore[1] = 0
	redPaddleX = (motiongo.Width - paddleW) / 2
	bluePaddleX = redPaddleX
	ballX = motiongo.Width / 2
	ballY = motiongo.Height / 2
	ballDX = 1
	ballDY = 1
	started = false
	finished = false
	success = false
	lastStepNS = startedNS
	lastMessage = "Toca arriba para rojo o abajo para azul."
}

func serve(nowNS int64) {
	lastStepNS = nowNS
	ballX = motiongo.Width / 2
	ballY = motiongo.Height / 2
	rng = rng*1664525 + 1013904223
	if rng%2 == 0 {
		ballDY = -1
	} else {
		ballDY = 1
	}
	rng = rng*1664525 + 1013904223
	side := int(rng % 3)
	ballDX = side - 1
	if ballDX == 0 {
		rng = rng*1664525 + 1013904223
		if rng%2 == 0 {
			ballDX = -1
		} else {
			ballDX = 1
		}
	}
}

func movePaddle(x int, y int) {
	center := clamp(x, paddleW/2, motiongo.Width-1-paddleW/2)
	left := center - paddleW/2
	if y < motiongo.Height/2 {
		redPaddleX = left
	} else {
		bluePaddleX = left
	}
}

func moveBall() motiongo.Event {
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

	if ballDY < 0 && nextY == topPaddleY && nextX >= redPaddleX && nextX < redPaddleX+paddleW {
		adjustBallFromPaddle(nextX, redPaddleX)
		ballDY = 1
		ballX = nextX
		ballY = topPaddleY + 1
		return motiongo.Event{Cue: "coin", Message: "Rojo devuelve."}
	}
	if ballDY > 0 && nextY == bottomPaddleY && nextX >= bluePaddleX && nextX < bluePaddleX+paddleW {
		adjustBallFromPaddle(nextX, bluePaddleX)
		ballDY = -1
		ballX = nextX
		ballY = bottomPaddleY - 1
		return motiongo.Event{Cue: "coin", Message: "Azul devuelve."}
	}

	if nextY < 0 {
		scorePoint(1)
		return motiongo.Event{Cue: "damage", Message: "Punto para azul."}
	}
	if nextY >= motiongo.Height {
		scorePoint(0)
		return motiongo.Event{Cue: "damage", Message: "Punto para rojo."}
	}

	ballX = nextX
	ballY = nextY
	return motiongo.Event{}
}

func scorePoint(team int) {
	teamScore[team]++
	if teamScore[team] >= winningScore {
		finished = true
		started = false
		success = team == 1
		if team == 0 {
			lastMessage = "Gana rojo."
		} else {
			lastMessage = "Gana azul."
		}
		return
	}
	serve(lastStepNS)
	lastMessage = "Nuevo saque."
}

func adjustBallFromPaddle(x int, paddleX int) {
	center := paddleX + paddleW/2
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

func currentInterval(now int64) int64 {
	elapsed := now - startedNS
	if elapsed < 0 {
		elapsed = 0
	}
	speedup := elapsed / 1000000000 * 9
	interval := startInterval - speedup*1000000
	if interval < minInterval {
		return minInterval
	}
	return interval
}

func drawCenterLine(frame *motiongo.Frame) {
	for x := 0; x < motiongo.Width; x += 2 {
		frame.FillRect(x, motiongo.Height/2, 1, 1, motiongo.Color("#8b949e"))
	}
}

func drawScore(frame *motiongo.Frame) {
	red := teamScore[0]
	if red > motiongo.Width {
		red = motiongo.Width
	}
	blue := teamScore[1]
	if blue > motiongo.Width {
		blue = motiongo.Width
	}
	if red > 0 {
		frame.FillRect(0, 0, red, 1, motiongo.Color("#ff4d5a"))
	}
	if blue > 0 {
		frame.FillRect(0, motiongo.Height-1, blue, 1, motiongo.Color("#36d9ff"))
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

func clamp(v int, lo int, hi int) int {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}
