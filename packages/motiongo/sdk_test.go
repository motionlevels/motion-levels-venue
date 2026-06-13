package motiongo

import "testing"

func TestStartPadsWaitForEveryPlayer(t *testing.T) {
	pads := NewStartPads(2, 7)
	now := int64(0)

	first := pads.Origin(0)
	if pads.Press(first.X, first.Y, true, now) {
		t.Fatal("first player should not start the countdown alone")
	}
	if !pads.AwaitingPlayers() {
		t.Fatal("pads should still be waiting for players")
	}

	second := pads.Origin(1)
	if !pads.Press(second.X, second.Y, true, now+1) {
		t.Fatal("second occupied pad should start the countdown")
	}
	if pads.AwaitingPlayers() {
		t.Fatal("pads should no longer be waiting")
	}
	if !pads.InCountdown(now + 2) {
		t.Fatal("pads should be in the countdown before start time")
	}
	if !pads.Running(pads.StartNS) {
		t.Fatal("pads should be running at start time")
	}
}

func TestStartPadsReleaseGraceKeepsPadOccupied(t *testing.T) {
	pads := NewStartPads(1, 3)
	now := int64(2000)
	origin := pads.Origin(0)

	pads.Press(origin.X, origin.Y, true, now)
	pads.Press(origin.X, origin.Y, false, now+10)

	if !pads.Occupied(0, now+10+pads.HoldNS-1) {
		t.Fatal("pad should stay occupied during release grace")
	}
	if pads.Occupied(0, now+10+pads.HoldNS) {
		t.Fatal("pad should clear after release grace")
	}
}

func TestScaleHexColor(t *testing.T) {
	if got := ScaleHexColor("#204080", 50); got != "#102040" {
		t.Fatalf("ScaleHexColor = %q, want #102040", got)
	}
	if got := ScaleHexColor("#f0f0f0", 135); got != "#ffffff" {
		t.Fatalf("ScaleHexColor clamps = %q, want #ffffff", got)
	}
}
