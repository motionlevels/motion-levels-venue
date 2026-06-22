package saltosgo

import (
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/saltos"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
	"github.com/lobis/motion-levels/packages/motiongo"
)

type Game struct {
	inner *saltos.Game
}

func (a *ABI) gameInit(ptr uint32, length uint32) uint64 {
	var req motiongo.InitRequest
	_ = motiongo.Decode(ptr, length, &req)
	now := time.Unix(0, req.NowUnixNS)
	if now.IsZero() {
		now = time.Now()
	}
	a.game = &Game{inner: saltos.NewWithSeed(now, req.Seed, req.Level)}
	return motiongo.Respond([]motiongo.Event{{Cue: "start", Message: "Saltos listo"}})
}

func (a *ABI) gamePress(ptr uint32, length uint32) uint64 {
	if a.game == nil || a.game.inner == nil {
		return 0
	}
	var req motiongo.PressRequest
	_ = motiongo.Decode(ptr, length, &req)
	events := a.game.inner.Press(whackamole.PressEvent{X: req.X, Y: req.Y, Pressed: req.Pressed}, time.Unix(0, req.NowUnixNS))
	out := make([]motiongo.Event, 0, len(events))
	for _, event := range events {
		out = append(out, motiongo.Event{Cue: event.Cue, Message: event.Message})
	}
	return motiongo.Respond(out)
}

func (a *ABI) gameRender(ptr uint32, length uint32) uint64 {
	if a.game == nil || a.game.inner == nil {
		return motiongo.Respond(motiongo.NewFrame(motiongo.Black))
	}
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	frame := motiongo.NewFrame(motiongo.Black)
	pixels := a.game.inner.Render(time.Unix(0, req.NowUnixNS))
	for y := 0; y < motiongo.Height; y++ {
		for x := 0; x < motiongo.Width; x++ {
			index := y*motiongo.Width + x
			if index < len(pixels) {
				frame.Set(x, y, motiongo.Color(rgbHex(pixels[index])))
			}
		}
	}
	return motiongo.Respond(frame)
}

func (a *ABI) gameSnapshot(ptr uint32, length uint32) uint64 {
	if a.game == nil || a.game.inner == nil {
		return motiongo.Respond(motiongo.Snapshot{Phase: "failed"})
	}
	var req motiongo.TimeRequest
	_ = motiongo.Decode(ptr, length, &req)
	snapshot := a.game.inner.Snapshot(time.Unix(0, req.NowUnixNS))
	players := make([]motiongo.PlayerSnapshot, 0, len(snapshot.Players))
	for _, player := range snapshot.Players {
		players = append(players, motiongo.PlayerSnapshot{
			Index: player.Index,
			Label: player.Label,
			Color: rgbHex(player.Color),
			Score: player.Score,
			Lives: snapshot.Lives,
		})
	}
	return motiongo.Respond(motiongo.Snapshot{
		Phase:           snapshot.Phase,
		Score:           snapshot.Score,
		StartedUnix:     snapshot.StartedUnix,
		EndsUnix:        snapshot.EndsUnix,
		ElapsedMillis:   snapshot.ElapsedMillis,
		RemainingMillis: snapshot.RemainingMillis,
		CountdownMillis: snapshot.CountdownMillis,
		ActiveTargets:   snapshot.ActiveTargets,
		Lives:           snapshot.Lives,
		Success:         snapshot.Phase == "finished" && snapshot.Lives > 0,
		Players:         players,
	})
}

func rgbHex(color saltos.RGB) string {
	const digits = "0123456789abcdef"
	out := []byte{'#', '0', '0', '0', '0', '0', '0'}
	out[1] = digits[color.R>>4]
	out[2] = digits[color.R&0x0f]
	out[3] = digits[color.G>>4]
	out[4] = digits[color.G&0x0f]
	out[5] = digits[color.B>>4]
	out[6] = digits[color.B&0x0f]
	return string(out)
}
