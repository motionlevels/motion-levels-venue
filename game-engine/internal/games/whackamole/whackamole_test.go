package whackamole

import (
	"math"
	"testing"
	"time"
)

func TestTargetIsTwoByTwoAndScoresBySpeed(t *testing.T) {
	now := time.Now()
	target := target{
		player:   0,
		origin:   Point{X: 4, Y: 8},
		born:     now,
		deadline: now.Add(3 * time.Second),
		active:   true,
	}

	for _, pt := range []Point{{X: 4, Y: 8}, {X: 5, Y: 8}, {X: 4, Y: 9}, {X: 5, Y: 9}} {
		if !target.contains(pt) {
			t.Fatalf("target should contain %+v", pt)
		}
	}
	for _, pt := range []Point{{X: 3, Y: 8}, {X: 6, Y: 8}, {X: 4, Y: 10}} {
		if target.contains(pt) {
			t.Fatalf("target should not contain %+v", pt)
		}
	}

	fast := target.score(now.Add(200 * time.Millisecond))
	slow := target.score(now.Add(2700 * time.Millisecond))
	if fast <= slow {
		t.Fatalf("fast score = %d, slow score = %d, want fast higher", fast, slow)
	}
}

func TestSpawnDistanceIsControlledPerPlayer(t *testing.T) {
	game := &Game{
		players: []playerState{{
			lastOrigin:   Point{X: 7, Y: 15},
			hasLastSpawn: true,
		}},
	}
	for i := 0; i < 50; i++ {
		next, ok := game.pickTargetOrigin(0)
		if !ok {
			t.Fatal("expected target origin")
		}
		distance := targetDistance(next, game.players[0].lastOrigin)
		if distance < minSpawnDistance || distance > maxSpawnDistance {
			t.Fatalf("spawn distance = %.2f from %+v to %+v, want within %.2f..%.2f", distance, game.players[0].lastOrigin, next, minSpawnDistance, maxSpawnDistance)
		}
	}
}

func TestTargetsKeepConfiguredGap(t *testing.T) {
	now := time.Now()
	game := &Game{
		players: make([]playerState, 6),
		started: now,
	}
	for player := range game.players {
		game.spawnTarget(player, now)
	}

	for i, left := range game.targets {
		for j, right := range game.targets {
			if i >= j {
				continue
			}
			for _, a := range left.tiles() {
				for _, b := range right.tiles() {
					if math.Abs(float64(a.X-b.X)) <= targetGap && math.Abs(float64(a.Y-b.Y)) <= targetGap {
						t.Fatalf("targets %d and %d are too close at %+v and %+v", left.player, right.player, a, b)
					}
				}
			}
		}
	}
}

func TestStartPadBeginsCountdownAndReturnsStartCue(t *testing.T) {
	now := time.Now()
	game := &Game{
		players:         make([]playerState, 1),
		startPadPresses: []map[Point]bool{{}},
		startPadHold:    make([]time.Time, 1),
		startPadOrigins: []Point{{X: 0, Y: 0}},
		hits:            map[Point]int{},
	}
	game.initializeStartPositions(time.Time{})

	events := game.Press(PressEvent{X: 0, Y: 0, Pressed: true}, now)
	if game.awaitingPlayers() {
		t.Fatal("countdown did not start")
	}
	if len(events) != 1 || events[0].Cue != CueStart {
		t.Fatalf("events = %+v, want start cue", events)
	}
	if got := game.setupUntil.Sub(game.setupStarted); got != setupDuration {
		t.Fatalf("setup duration = %s, want %s", got, setupDuration)
	}
}

func TestHitSpawnsReplacementAndReturnsHitCue(t *testing.T) {
	now := time.Now()
	game := &Game{
		players:      make([]playerState, 1),
		setupStarted: now.Add(-4 * time.Second),
		setupUntil:   now.Add(-time.Second),
		started:      now,
		endAt:        now.Add(gameDuration),
		hits:         map[Point]int{},
	}
	game.spawnTarget(0, now)
	if len(game.targets) != 1 {
		t.Fatalf("initial targets = %d, want 1", len(game.targets))
	}
	origin := game.targets[0].origin

	events := game.Press(PressEvent{X: origin.X, Y: origin.Y, Pressed: true}, now.Add(200*time.Millisecond))
	if len(events) != 1 || events[0].Cue != CueHit {
		t.Fatalf("events = %+v, want hit cue", events)
	}
	if game.Score() <= 0 {
		t.Fatal("hit did not increase score")
	}
	if len(game.targets) != 1 {
		t.Fatalf("targets after hit = %d, want immediate replacement", len(game.targets))
	}
	if game.targets[0].origin == origin {
		t.Fatalf("replacement reused old origin %+v", origin)
	}
}

func TestMissReturnsMissCue(t *testing.T) {
	game := New(1, time.Now())
	game.setupStarted = time.Now().Add(-4 * time.Second)
	game.setupUntil = time.Now().Add(-time.Second)
	game.started = game.setupUntil
	game.endAt = time.Now().Add(time.Minute)
	game.players[0].nextSpawnAt = time.Now().Add(time.Minute)

	events := game.Press(PressEvent{X: 7, Y: 15, Pressed: true}, time.Now())
	if len(events) != 1 || events[0].Cue != CueMiss {
		t.Fatalf("events = %+v, want miss cue", events)
	}
}
