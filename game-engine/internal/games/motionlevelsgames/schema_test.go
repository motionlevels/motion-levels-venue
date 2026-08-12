package motionlevelsgames

import "testing"

func TestPlayerExperienceSchemaValidationUsesBundledContract(t *testing.T) {
	schema := map[string]any{
		"type":     "object",
		"required": []any{"contractVersion", "revision", "lifecycle", "players"},
		"properties": map[string]any{
			"contractVersion": map[string]any{"const": float64(1)},
			"revision":        map[string]any{"type": "integer", "minimum": float64(1)},
			"lifecycle":       map[string]any{"enum": []any{"idle", "running"}},
			"players": map[string]any{
				"type":  "array",
				"items": map[string]any{"$ref": "#/$defs/player"},
			},
		},
		"$defs": map[string]any{
			"player": map[string]any{
				"type":                 "object",
				"additionalProperties": false,
				"required":             []any{"index"},
				"properties": map[string]any{
					"index": map[string]any{"type": "integer", "minimum": float64(0)},
				},
			},
		},
	}
	bundle := &Bundle{playerExperienceSchema: schema}
	valid := map[string]any{
		"contractVersion": 1,
		"revision":        4,
		"lifecycle":       "running",
		"players":         []map[string]any{{"index": 0}},
	}
	if err := bundle.ValidatePlayerExperienceState(valid); err != nil {
		t.Fatalf("valid state rejected: %v", err)
	}
	invalid := map[string]any{
		"contractVersion": 1,
		"revision":        3,
		"lifecycle":       "running",
		"players":         []map[string]any{{"index": -1}},
	}
	if err := bundle.ValidatePlayerExperienceState(invalid); err == nil {
		t.Fatal("invalid nested player was accepted")
	}
}
