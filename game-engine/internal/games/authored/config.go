package authored

import (
	"encoding/json"
	"strings"
)

// ConfigSpec declares the variables a motion-go game exposes. It lives in the
// game_source payload the platform serves (game_source.config), so the games
// editor can edit definitions and the player menu can render the player-facing
// ones. The engine resolves defaults + overrides into the flat value map games
// receive as the init request's "config" field.
type ConfigSpec struct {
	Vars []ConfigVar `json:"vars"`
}

type ConfigVar struct {
	Key          string          `json:"key"`
	Label        string          `json:"label,omitempty"`
	Description  string          `json:"description,omitempty"`
	Type         string          `json:"type,omitempty"` // int | float | bool | enum
	Default      json.RawMessage `json:"default,omitempty"`
	Min          *float64        `json:"min,omitempty"`
	Max          *float64        `json:"max,omitempty"`
	Step         *float64        `json:"step,omitempty"`
	Options      []ConfigOption  `json:"options,omitempty"`
	PlayerFacing bool            `json:"player_facing,omitempty"`
}

type ConfigOption struct {
	Value string `json:"value"`
	Label string `json:"label,omitempty"`
}

// ResolveConfig merges a spec's declared defaults with launch overrides.
// Overrides for undeclared keys are dropped, values must match the declared
// type, numbers are clamped to [min, max], and enum values must be one of the
// declared options. The result is what games receive as init "config".
func ResolveConfig(spec Spec, overrides map[string]json.RawMessage) map[string]json.RawMessage {
	if spec.Config == nil || len(spec.Config.Vars) == 0 {
		return nil
	}
	out := make(map[string]json.RawMessage, len(spec.Config.Vars))
	for _, item := range spec.Config.Vars {
		key := strings.TrimSpace(item.Key)
		if key == "" {
			continue
		}
		value := item.normalizeValue(item.Default)
		if override, ok := overrides[key]; ok {
			if normalized := item.normalizeValue(override); normalized != nil {
				value = normalized
			}
		}
		if value != nil {
			out[key] = value
		}
	}
	if len(out) == 0 {
		return nil
	}
	return out
}

// normalizeValue validates raw against the variable's type and returns the
// canonical JSON encoding, or nil when the value is unusable.
func (v ConfigVar) normalizeValue(raw json.RawMessage) json.RawMessage {
	if len(raw) == 0 {
		return nil
	}
	switch v.Type {
	case "bool":
		var value bool
		if err := json.Unmarshal(raw, &value); err != nil {
			return nil
		}
		return mustConfigJSON(value)
	case "enum":
		var value string
		if err := json.Unmarshal(raw, &value); err != nil {
			return nil
		}
		for _, option := range v.Options {
			if option.Value == value {
				return mustConfigJSON(value)
			}
		}
		return nil
	case "float", "int", "":
		var value float64
		if err := json.Unmarshal(raw, &value); err != nil {
			return nil
		}
		if v.Min != nil && value < *v.Min {
			value = *v.Min
		}
		if v.Max != nil && value > *v.Max {
			value = *v.Max
		}
		if v.Type != "float" {
			if value >= 0 {
				value = float64(int64(value + 0.5))
			} else {
				value = float64(int64(value - 0.5))
			}
		}
		return mustConfigJSON(value)
	default:
		return nil
	}
}

func mustConfigJSON(value any) json.RawMessage {
	data, err := json.Marshal(value)
	if err != nil {
		return nil
	}
	return data
}
