package animations

import (
	"strings"
	"testing"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/whackamole"
)

func TestCompileCloudLevelsSupportsProceduralDSLWithoutFrames(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "dsl-test",
		Label:       "DSL Test",
		FrameTickMS: 20,
		Rules: cloudRules{AnimationSource: animationSource{
			Type:        "procedure",
			Language:    "motion-dsl-v1",
			Code:        "color = rgb(loop_progress * 255, xn * 255, yn * 255)",
			LoopSeconds: 2,
		}},
	}})
	if err != nil {
		t.Fatalf("compileCloudLevels returned error: %v", err)
	}
	if len(levels) != 1 {
		t.Fatalf("levels = %d, want 1", len(levels))
	}
	level := levels[0]
	if level.procedure == nil {
		t.Fatal("procedure was not compiled")
	}
	if len(level.frames) != 0 {
		t.Fatalf("frames = %d, want 0 for pure DSL animation", len(level.frames))
	}

	game := &Game{level: level, startedAt: time.Unix(0, 0), pressed: map[Point]bool{}}
	start := game.colorAtLocked(Point{X: 15, Y: 31}, time.Unix(0, 0))
	mid := game.colorAtLocked(Point{X: 15, Y: 31}, time.Unix(1, 0))
	wrapped := game.colorAtLocked(Point{X: 15, Y: 31}, time.Unix(2, 0))
	if start.R != 0 || start.G != 255 || start.B != 255 {
		t.Fatalf("start color = %+v, want cyan edge", start)
	}
	if mid.R < 126 || mid.R > 128 {
		t.Fatalf("mid red = %d, want about 128", mid.R)
	}
	if wrapped != start {
		t.Fatalf("wrapped color = %+v, want %+v", wrapped, start)
	}
}

func TestInvalidProceduralDSLFallsBackToFrames(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "bad-dsl-with-frames",
		Label:       "Bad DSL",
		FrameTickMS: 20,
		TileEffects: map[string]TileEffect{
			"1": {Label: "White", Color: "#ffffff", Press: "safe"},
		},
		Frames: []rawFrame{{Repeat: 1, Cells: []cellTuple{{X: 0, Y: 0, Kind: 1}}}},
		Rules: cloudRules{AnimationSource: animationSource{
			Type:        "procedure",
			Language:    "motion-dsl-v1",
			Code:        "x = 1\ncolor = rgb(0, 0, 0)",
			LoopSeconds: 1,
		}},
	}})
	if err != nil {
		t.Fatalf("compileCloudLevels returned error: %v", err)
	}
	level := levels[0]
	if level.procedure != nil {
		t.Fatal("invalid procedure should not be used")
	}
	game := &Game{level: level, startedAt: time.Unix(0, 0), pressed: map[Point]bool{}}
	if got := game.colorAtLocked(Point{X: 0, Y: 0}, time.Unix(0, 0)); got != (RGB{R: 255, G: 255, B: 255}) {
		t.Fatalf("fallback frame color = %+v, want white", got)
	}
}

func TestProceduralDSLRejectsReservedAssignments(t *testing.T) {
	_, err := compileProcedureSource(animationProcedureSource{
		Type:        "procedure",
		Language:    "motion-dsl-v1",
		Code:        "noise = 1\ncolor = rgb(0, 0, 0)",
		LoopSeconds: 1,
	})
	if err == nil {
		t.Fatal("compileProcedureSource accepted reserved function assignment")
	}
}

func TestProceduralDSLClampsLoopSeconds(t *testing.T) {
	source, err := compileProcedureSource(animationProcedureSource{
		Type:                 "procedure",
		Language:             "motion-dsl-v1",
		Code:                 "color = rgb(loop_progress * 255, loop_time, 0)",
		LoopSeconds:          500,
		ReferenceLoopSeconds: 500,
	})
	if err != nil {
		t.Fatalf("compileProcedureSource returned error: %v", err)
	}
	if source.loopSeconds != maxProcedureLoopSeconds {
		t.Fatalf("loopSeconds = %v, want %v", source.loopSeconds, maxProcedureLoopSeconds)
	}
	if source.referenceLoopSeconds != maxProcedureLoopSeconds {
		t.Fatalf("referenceLoopSeconds = %v, want %v", source.referenceLoopSeconds, maxProcedureLoopSeconds)
	}
}

func TestProceduralDSLMigratesLegacyNormalizedAssignments(t *testing.T) {
	source, err := compileProcedureSource(animationProcedureSource{
		Type:     "procedure",
		Language: "motion-dsl-v1",
		Code: strings.Join([]string{
			"xn = x / width",
			"yn = y / height",
			"hue = mod(xn * hue_x + yn * hue_y + loop_time * speed, 1)",
			"pulse = base + depth * sin((loop_time * pulse_speed + xn * pulse_x - yn * pulse_y) * pi)",
			"color = hsv(hue, saturation, clamp01(pulse))",
		}, "\n"),
		Params: map[string]any{
			"hue_x": 0.55, "hue_y": 0.35, "speed": 0.1,
			"base": 0.7, "depth": 0.3, "pulse_speed": 2.0,
			"pulse_x": 4.0, "pulse_y": 2.5, "saturation": 0.85,
		},
		LoopSeconds: 10,
	})
	if err != nil {
		t.Fatalf("compileProcedureSource returned error: %v", err)
	}
	if _, err := source.colorAt(3, 7, 0.25, 0); err != nil {
		t.Fatalf("legacy migrated source failed render: %v", err)
	}
}

func TestPressureEffectPresetRendersFromPressEvent(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "pressure-effect",
		Label:       "Pressure Effect",
		FrameTickMS: 20,
		Rules: cloudRules{AnimationSource: animationSource{
			Type:        "procedure",
			Language:    "motion-dsl-v1",
			Code:        "color = rgb(20, 30, 40)",
			LoopSeconds: 2,
			PressureEffect: pressureEffectSource{
				Type:            "preset",
				Preset:          "ripple",
				DurationSeconds: 1,
			},
		}},
	}})
	if err != nil {
		t.Fatalf("compileCloudLevels returned error: %v", err)
	}
	game := &Game{
		level:          levels[0],
		startedAt:      time.Unix(0, 0),
		pressed:        map[Point]bool{},
		pressureEvents: map[Point]time.Time{},
	}
	before := game.colorAtLocked(Point{X: 8, Y: 16}, time.Unix(0, 0))
	game.Press(whackamole.PressEvent{X: 8, Y: 16, Pressed: true}, time.Unix(0, int64(100*time.Millisecond)))
	after := game.colorAtLocked(Point{X: 8, Y: 16}, time.Unix(0, int64(100*time.Millisecond)))
	if before == after {
		t.Fatalf("pressure effect did not change color: before=%+v after=%+v", before, after)
	}
	expired := game.colorAtLocked(Point{X: 8, Y: 16}, time.Unix(2, 0))
	if expired != before {
		t.Fatalf("expired pressure color = %+v, want base %+v", expired, before)
	}
}

func TestPressureSoundEmitsPressureCue(t *testing.T) {
	levels, err := compileCloudLevels([]cloudLevel{{
		Slug:        "pressure-sound",
		Label:       "Pressure Sound",
		FrameTickMS: 20,
		Rules: cloudRules{AnimationSource: animationSource{
			Type:        "procedure",
			Language:    "motion-dsl-v1",
			Code:        "color = rgb(20, 30, 40)",
			LoopSeconds: 2,
			PressureSound: pressureSoundSource{
				Type:   "cue",
				CueRef: "Motion/sonidos/aparecer.mp3",
			},
		}},
	}})
	if err != nil {
		t.Fatalf("compileCloudLevels returned error: %v", err)
	}
	game := &Game{
		level:          levels[0],
		startedAt:      time.Unix(0, 0),
		pressed:        map[Point]bool{},
		pressureEvents: map[Point]time.Time{},
	}
	events := game.Press(whackamole.PressEvent{X: 8, Y: 16, Pressed: true}, time.Unix(0, 0))
	if len(events) != 1 || events[0].Cue != whackamole.CuePressure {
		t.Fatalf("events = %+v, want pressure cue", events)
	}
	if got := game.AudioRefs().PressureCueRef; got != "Motion/sonidos/aparecer.mp3" {
		t.Fatalf("pressure cue ref = %q", got)
	}
}

func TestRandomRotationSwitchesEveryMinuteWithoutImmediateRepeat(t *testing.T) {
	levels := []CompiledLevel{
		{id: "aurora", label: "Aurora", audio: AudioRefs{MusicRef: DefaultMusicRef, MusicVolume: DefaultMusicVolume}},
		{id: "lava", label: "Lava", audio: AudioRefs{MusicRef: DefaultMusicRef, MusicVolume: DefaultMusicVolume}},
		{id: "ocean", label: "Ocean", audio: AudioRefs{MusicRef: DefaultMusicRef, MusicVolume: DefaultMusicVolume}},
	}
	game := &Game{
		level:          rotatingLevelAt(levels, 42, 0, -1),
		levels:         levels,
		rotationSeed:   42,
		rotationEvery:  rotationDuration,
		rotationIndex:  0,
		startedAt:      time.Unix(0, 0),
		pressed:        map[Point]bool{},
		pressureEvents: map[Point]time.Time{},
	}

	initial := game.level.id
	game.updateRotationLocked(time.Unix(59, 0))
	if game.level.id != initial {
		t.Fatalf("level changed before 60s: got %q want %q", game.level.id, initial)
	}
	game.updateRotationLocked(time.Unix(60, 0))
	if game.level.id == initial {
		t.Fatalf("level repeated after first rotation: %q", game.level.id)
	}
	second := game.level.id
	game.updateRotationLocked(time.Unix(120, 0))
	if game.level.id == second {
		t.Fatalf("level repeated after second rotation: %q", game.level.id)
	}
}
