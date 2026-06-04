package duel

import (
	"math"
	"math/rand"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

const (
	GridWidth  = animation.GridWidth
	GridHeight = animation.GridHeight

	startPadSize    = 4
	setupDuration   = 3 * time.Second
	setupBlinks     = 3
	startPadHold    = 1 * time.Second
	claimFlash      = 240 * time.Millisecond
	maxDuelPlayers  = 4
	minDuelPlayers  = 2
	DefaultMusicRef = "Motion/canciones/Musica8.mp3"

	DefaultMusicVolume = 0.14
)

type RGB = animation.RGB

type Point struct {
	X int
	Y int
}

type PlayerSnapshot struct {
	Index int
	Label string
	Color RGB
	Score int
	Lives int
}

type Snapshot struct {
	Phase           string
	Players         []PlayerSnapshot
	Score           int
	StartedUnix     int64
	EndsUnix        int64
	ElapsedMillis   int64
	RemainingMillis int64
	CountdownMillis int64
	ActiveTargets   int
	Lives           int
	Winner          int
	Success         bool
}

type Game struct {
	mu sync.Mutex

	players         []playerInfo
	owners          []int
	claimed         []bool
	claimedAt       []time.Time
	tilesPerPlayer  int
	startPadPresses []map[Point]bool
	startPadHold    []time.Time
	startPadOrigins []Point
	setupStarted    time.Time
	setupUntil      time.Time
	started         time.Time
	endedAt         time.Time
	winner          int
	rng             *rand.Rand
}

type playerInfo struct {
	label string
	rgb   RGB
	score int
}

var defaultPlayerColors = []playerInfo{
	{label: "Red", rgb: RGB{R: 255, G: 0, B: 0}},
	{label: "Cyan", rgb: RGB{R: 0, G: 255, B: 255}},
	{label: "Green", rgb: RGB{R: 0, G: 255, B: 0}},
	{label: "Pink", rgb: RGB{R: 255, G: 0, B: 255}},
}

func New(playerCount int, now time.Time) *Game {
	return NewWithSeed(playerCount, now, now.UnixNano())
}

func NewWithSeed(playerCount int, now time.Time, seed int64) *Game {
	return NewWithSeedAndPlayers(defaultPlayerConfig(playerCount), now, seed)
}

func NewWithSeedAndPlayers(players []whackamole.PlayerConfig, now time.Time, seed int64) *Game {
	if seed == 0 {
		seed = now.UnixNano()
	}
	roster := normalizePlayerConfig(players)
	g := &Game{
		players:         roster,
		owners:          make([]int, GridWidth*GridHeight),
		claimed:         make([]bool, GridWidth*GridHeight),
		claimedAt:       make([]time.Time, GridWidth*GridHeight),
		tilesPerPlayer:  (GridWidth * GridHeight) / len(roster),
		startPadPresses: make([]map[Point]bool, len(roster)),
		startPadHold:    make([]time.Time, len(roster)),
		startPadOrigins: startPadOrigins(len(roster)),
		winner:          -1,
		rng:             rand.New(rand.NewSource(seed)),
	}
	for i := range g.owners {
		g.owners[i] = -1
	}
	for i := range g.startPadPresses {
		g.startPadPresses[i] = map[Point]bool{}
	}
	g.generateBoardLocked()
	return g
}

func (g *Game) Press(event whackamole.PressEvent, now time.Time) []whackamole.Event {
	if !inBounds(event.X, event.Y) {
		return nil
	}
	pt := Point{X: event.X, Y: event.Y}

	g.mu.Lock()
	defer g.mu.Unlock()

	if g.winner >= 0 {
		return nil
	}
	if g.awaitingPlayers() || g.inSetup(now) {
		wasAwaiting := g.awaitingPlayers()
		g.handleStartPadPressLocked(pt, event.Pressed, now)
		if event.Pressed && wasAwaiting && !g.awaitingPlayers() {
			return []whackamole.Event{{Cue: whackamole.CueStart, Message: "duel starting"}}
		}
		return nil
	}
	if !event.Pressed {
		return nil
	}

	index := tileIndex(pt)
	player := g.owners[index]
	if player < 0 || player >= len(g.players) || g.claimed[index] {
		return nil
	}

	g.claimed[index] = true
	g.claimedAt[index] = now
	g.players[player].score++
	if g.players[player].score >= g.tilesPerPlayer {
		g.winner = player
		g.endedAt = now
		return []whackamole.Event{{Cue: whackamole.CueWin, Message: g.playerLabel(player) + " gana"}}
	}
	return []whackamole.Event{{Cue: whackamole.CueCoin, Message: g.playerLabel(player) + " " + strconv.Itoa(g.players[player].score)}}
}

func (g *Game) Render(now time.Time) []RGB {
	g.mu.Lock()
	defer g.mu.Unlock()

	frame := make([]RGB, GridWidth*GridHeight)
	for y := 0; y < GridHeight; y++ {
		for x := 0; x < GridWidth; x++ {
			pt := Point{X: x, Y: y}
			frame[y*GridWidth+x] = g.colorAtLocked(pt, now)
		}
	}
	return frame
}

func (g *Game) Snapshot(now time.Time) Snapshot {
	g.mu.Lock()
	defer g.mu.Unlock()

	phase := "running"
	if g.awaitingPlayers() {
		phase = "ready"
	} else if g.inSetup(now) {
		phase = "countdown"
	} else if g.winner >= 0 {
		phase = "finished"
	}

	players := make([]PlayerSnapshot, 0, len(g.players))
	bestScore := 0
	for i, player := range g.players {
		if player.score > bestScore {
			bestScore = player.score
		}
		players = append(players, PlayerSnapshot{
			Index: i,
			Label: g.playerLabel(i),
			Color: player.rgb,
			Score: player.score,
			Lives: -1,
		})
	}

	startedUnix := int64(0)
	if !g.started.IsZero() {
		startedUnix = g.started.Unix()
	}
	elapsed := int64(0)
	if !g.started.IsZero() && now.After(g.started) {
		end := now
		if !g.endedAt.IsZero() {
			end = g.endedAt
		}
		elapsed = end.Sub(g.started).Milliseconds()
	}
	countdown := int64(0)
	if g.inSetup(now) {
		countdown = g.setupUntil.Sub(now).Milliseconds()
	}

	return Snapshot{
		Phase:           phase,
		Players:         players,
		Score:           bestScore,
		StartedUnix:     startedUnix,
		ElapsedMillis:   elapsed,
		CountdownMillis: countdown,
		ActiveTargets:   g.remainingTargetsLocked(),
		Lives:           -1,
		Winner:          g.winner,
		Success:         g.winner >= 0,
	}
}

func (g *Game) colorAtLocked(pt Point, now time.Time) RGB {
	if g.awaitingPlayers() || g.inSetup(now) {
		return g.startPadColorLocked(pt, now)
	}
	if g.winner >= 0 {
		return winnerColor(g.players[g.winner].rgb, pt, now, g.endedAt)
	}

	index := tileIndex(pt)
	player := g.owners[index]
	if player < 0 || player >= len(g.players) {
		return RGB{}
	}
	base := g.players[player].rgb
	if g.claimed[index] {
		if !g.claimedAt[index].IsZero() && now.Sub(g.claimedAt[index]) < claimFlash {
			return RGB{R: 255, G: 255, B: 255}
		}
		return scaleRGB(base, 0.16)
	}
	pulse := 0.78 + 0.22*math.Sin(now.Sub(time.Unix(0, 0)).Seconds()*2.2+float64(pt.X*3+pt.Y)*0.08)
	return scaleRGB(base, pulse)
}

func (g *Game) generateBoardLocked() {
	playerCount := len(g.players)
	g.tilesPerPlayer = (GridWidth * GridHeight) / playerCount
	targets := make([]int, playerCount)
	for player := range targets {
		targets[player] = g.tilesPerPlayer
	}

	best := []int(nil)
	bestScore := math.Inf(1)
	for attempt := 0; attempt < 18; attempt++ {
		candidate := g.generateBoardCandidateLocked(targets)
		score := boardOrganicPenalty(candidate)
		if score < bestScore {
			bestScore = score
			best = candidate
		}
	}
	copy(g.owners, best)
}

func (g *Game) generateBoardCandidateLocked(targets []int) []int {
	owners := make([]int, GridWidth*GridHeight)
	for index := range owners {
		owners[index] = -1
	}
	counts := make([]int, len(targets))
	for _, index := range g.rng.Perm(GridWidth * GridHeight) {
		bestPlayer := -1
		bestScore := math.Inf(1)
		x := index % GridWidth
		y := index / GridWidth
		for player, target := range targets {
			if counts[player] >= target {
				continue
			}
			sameOrth := sameOrthogonalNeighbors(owners, x, y, player)
			sameDiag := sameDiagonalNeighbors(owners, x, y, player)
			score := localAdjacencyPenalty(sameOrth)
			score += float64(sameDiag) * 0.12
			score += float64(counts[player]) / float64(target) * 0.2
			score += g.rng.Float64() * 1.35
			if score < bestScore {
				bestScore = score
				bestPlayer = player
			}
		}
		if bestPlayer < 0 {
			continue
		}
		owners[index] = bestPlayer
		counts[bestPlayer]++
	}
	return owners
}

func localAdjacencyPenalty(sameOrth int) float64 {
	switch sameOrth {
	case 0:
		return 0.85
	case 1:
		return 0
	case 2:
		return 0.45
	default:
		return 4.5
	}
}

func boardOrganicPenalty(owners []int) float64 {
	penalty := 0.0
	for y := 0; y < GridHeight; y++ {
		runOwner := -2
		runLength := 0
		for x := 0; x < GridWidth; x++ {
			owner := owners[y*GridWidth+x]
			if owner >= 0 {
				sameOrth := sameOrthogonalNeighbors(owners, x, y, owner)
				penalty += localAdjacencyPenalty(sameOrth)
				if sameOrth >= 3 {
					penalty += 6
				}
			}
			if owner == runOwner && owner >= 0 {
				runLength++
			} else {
				runOwner = owner
				runLength = 1
			}
			if runOwner >= 0 && runLength > 5 {
				penalty += float64(runLength-5) * 7
			}
		}
	}
	for x := 0; x < GridWidth; x++ {
		runOwner := -2
		runLength := 0
		for y := 0; y < GridHeight; y++ {
			owner := owners[y*GridWidth+x]
			if owner == runOwner && owner >= 0 {
				runLength++
			} else {
				runOwner = owner
				runLength = 1
			}
			if runOwner >= 0 && runLength > 5 {
				penalty += float64(runLength-5) * 7
			}
		}
	}
	return penalty
}

func sameOrthogonalNeighbors(owners []int, x, y, player int) int {
	count := 0
	for _, delta := range []Point{{X: -1, Y: 0}, {X: 1, Y: 0}, {X: 0, Y: -1}, {X: 0, Y: 1}} {
		nx, ny := x+delta.X, y+delta.Y
		if inBounds(nx, ny) && owners[ny*GridWidth+nx] == player {
			count++
		}
	}
	return count
}

func sameDiagonalNeighbors(owners []int, x, y, player int) int {
	count := 0
	for _, delta := range []Point{{X: -1, Y: -1}, {X: 1, Y: -1}, {X: -1, Y: 1}, {X: 1, Y: 1}} {
		nx, ny := x+delta.X, y+delta.Y
		if inBounds(nx, ny) && owners[ny*GridWidth+nx] == player {
			count++
		}
	}
	return count
}

func (g *Game) handleStartPadPressLocked(pt Point, pressed bool, now time.Time) {
	for player := range g.players {
		if !g.startPadContains(player, pt) {
			continue
		}
		if pressed {
			g.startPadPresses[player][pt] = true
			g.startPadHold[player] = time.Time{}
		} else {
			delete(g.startPadPresses[player], pt)
			if len(g.startPadPresses[player]) == 0 {
				g.startPadHold[player] = now.Add(startPadHold)
			}
		}
	}
	if g.awaitingPlayers() && g.allStartPadsOccupiedLocked(now) {
		g.setupStarted = now
		g.setupUntil = now.Add(setupDuration)
		g.started = g.setupUntil
	}
}

func (g *Game) awaitingPlayers() bool {
	return g.setupStarted.IsZero()
}

func (g *Game) inSetup(now time.Time) bool {
	return !g.setupUntil.IsZero() && now.Before(g.setupUntil)
}

func (g *Game) allStartPadsOccupiedLocked(now time.Time) bool {
	for player := range g.players {
		if !g.startPadOccupiedLocked(player, now) {
			return false
		}
	}
	return true
}

func (g *Game) startPadOccupiedLocked(player int, now time.Time) bool {
	return len(g.startPadPresses[player]) > 0 || now.Before(g.startPadHold[player])
}

func (g *Game) startPadColorLocked(pt Point, now time.Time) RGB {
	blinkVisible := g.awaitingPlayers() || setupBlinkVisible(g.setupStarted, now)
	for player := range g.players {
		if !g.startPadContains(player, pt) {
			continue
		}
		color := g.players[player].rgb
		if g.startPadOccupiedLocked(player, now) {
			return saturatedRGB(color)
		}
		if !blinkVisible {
			return RGB{}
		}
		if g.awaitingPlayers() {
			return scaleRGB(color, 0.30)
		}
		return color
	}
	return RGB{}
}

func (g *Game) startPadContains(player int, pt Point) bool {
	if player < 0 || player >= len(g.startPadOrigins) {
		return false
	}
	origin := g.startPadOrigins[player]
	return pt.X >= origin.X && pt.X < origin.X+startPadSize && pt.Y >= origin.Y && pt.Y < origin.Y+startPadSize
}

func (g *Game) remainingTargetsLocked() int {
	total := 0
	for player := range g.players {
		total += g.tilesPerPlayer - g.players[player].score
	}
	return total
}

func (g *Game) playerLabel(index int) string {
	if index >= 0 && index < len(g.players) && strings.TrimSpace(g.players[index].label) != "" {
		return strings.TrimSpace(g.players[index].label)
	}
	return "Player " + strconv.Itoa(index+1)
}

func startPadOrigins(playerCount int) []Point {
	switch playerCount {
	case 2:
		return []Point{{X: 0, Y: (GridHeight - startPadSize) / 2}, {X: GridWidth - startPadSize, Y: (GridHeight - startPadSize) / 2}}
	case 3:
		return []Point{{X: 0, Y: 0}, {X: GridWidth - startPadSize, Y: 0}, {X: (GridWidth - startPadSize) / 2, Y: GridHeight - startPadSize}}
	default:
		return []Point{{X: 0, Y: 0}, {X: GridWidth - startPadSize, Y: GridHeight - startPadSize}, {X: 0, Y: GridHeight - startPadSize}, {X: GridWidth - startPadSize, Y: 0}}
	}
}

func defaultPlayerConfig(playerCount int) []whackamole.PlayerConfig {
	playerCount = clampInt(playerCount, minDuelPlayers, maxDuelPlayers)
	players := make([]whackamole.PlayerConfig, playerCount)
	for i := range players {
		fallback := defaultPlayerColors[i]
		players[i] = whackamole.PlayerConfig{Label: fallback.label, Color: fallback.rgb}
	}
	return players
}

func normalizePlayerConfig(players []whackamole.PlayerConfig) []playerInfo {
	count := clampInt(len(players), minDuelPlayers, maxDuelPlayers)
	out := make([]playerInfo, count)
	for i := 0; i < count; i++ {
		fallback := defaultPlayerColors[i]
		config := whackamole.PlayerConfig{}
		if i < len(players) {
			config = players[i]
		}
		label := strings.TrimSpace(config.Label)
		if label == "" {
			label = fallback.label
		}
		color := config.Color
		if color == (RGB{}) {
			color = fallback.rgb
		}
		out[i] = playerInfo{label: label, rgb: color}
	}
	return out
}

func setupBlinkVisible(started, now time.Time) bool {
	if started.IsZero() || now.Before(started) {
		return true
	}
	elapsed := now.Sub(started)
	if elapsed >= setupDuration {
		return false
	}
	halfCycle := setupDuration / time.Duration(setupBlinks*2)
	if halfCycle <= 0 {
		return true
	}
	return int(elapsed/halfCycle)%2 == 0
}

func winnerColor(color RGB, pt Point, now time.Time, started time.Time) RGB {
	elapsed := now.Sub(started).Seconds()
	wave := 0.5 + 0.5*math.Sin(elapsed*math.Pi*3+float64(pt.X)*0.45+float64(pt.Y)*0.12)
	burst := 0.55 + 0.45*math.Sin(elapsed*math.Pi*8)
	return addRGB(scaleRGB(color, 0.55+0.45*wave), RGB{R: byte(60 * burst), G: byte(60 * burst), B: byte(60 * burst)})
}

func saturatedRGB(color RGB) RGB {
	return addRGB(color, scaleRGB(color, 0.35))
}

func addRGB(left, right RGB) RGB {
	return RGB{
		R: clampByte(int(left.R) + int(right.R)),
		G: clampByte(int(left.G) + int(right.G)),
		B: clampByte(int(left.B) + int(right.B)),
	}
}

func scaleRGB(color RGB, scale float64) RGB {
	return RGB{
		R: clampByte(int(math.Round(float64(color.R) * scale))),
		G: clampByte(int(math.Round(float64(color.G) * scale))),
		B: clampByte(int(math.Round(float64(color.B) * scale))),
	}
}

func clampByte(value int) byte {
	if value < 0 {
		return 0
	}
	if value > 255 {
		return 255
	}
	return byte(value)
}

func clampInt(value, min, max int) int {
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func inBounds(x, y int) bool {
	return x >= 0 && x < GridWidth && y >= 0 && y < GridHeight
}

func tileIndex(pt Point) int {
	return pt.Y*GridWidth + pt.X
}
