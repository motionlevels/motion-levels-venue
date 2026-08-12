package motionlevelsgames

import (
	"encoding/json"
	"fmt"
	"math"
	"reflect"
	"strings"
)

// validateJSONSchema implements the deliberately small JSON Schema subset
// used by the player-experience contract. The schema remains authoritative;
// the Go adapter does not carry a second handwritten field list.
func validateJSONSchema(root map[string]any, schema map[string]any, value any, path string) error {
	if ref, _ := schema["$ref"].(string); ref != "" {
		resolved, err := resolveLocalSchemaRef(root, ref)
		if err != nil {
			return err
		}
		return validateJSONSchema(root, resolved, value, path)
	}
	if expected, ok := schema["const"]; ok && !reflect.DeepEqual(expected, value) {
		return fmt.Errorf("%s must equal %v", path, expected)
	}
	if values, ok := schema["enum"].([]any); ok {
		matched := false
		for _, expected := range values {
			matched = matched || reflect.DeepEqual(expected, value)
		}
		if !matched {
			return fmt.Errorf("%s is not an allowed value", path)
		}
	}
	if kind, _ := schema["type"].(string); kind != "" && !matchesJSONType(kind, value) {
		return fmt.Errorf("%s must be %s", path, kind)
	}
	if number, ok := value.(float64); ok {
		if minimum, ok := schema["minimum"].(float64); ok && number < minimum {
			return fmt.Errorf("%s must be at least %v", path, minimum)
		}
		if maximum, ok := schema["maximum"].(float64); ok && number > maximum {
			return fmt.Errorf("%s must be at most %v", path, maximum)
		}
	}
	if text, ok := value.(string); ok {
		if minimum, ok := schema["minLength"].(float64); ok && len([]rune(text)) < int(minimum) {
			return fmt.Errorf("%s is too short", path)
		}
	}
	if items, ok := value.([]any); ok {
		if itemSchema, ok := schema["items"].(map[string]any); ok {
			for index, item := range items {
				if err := validateJSONSchema(root, itemSchema, item, fmt.Sprintf("%s[%d]", path, index)); err != nil {
					return err
				}
			}
		}
		if unique, _ := schema["uniqueItems"].(bool); unique {
			seen := map[string]bool{}
			for _, item := range items {
				encoded, _ := json.Marshal(item)
				key := string(encoded)
				if seen[key] {
					return fmt.Errorf("%s must contain unique items", path)
				}
				seen[key] = true
			}
		}
	}
	if object, ok := value.(map[string]any); ok {
		for _, required := range stringList(schema["required"]) {
			if _, exists := object[required]; !exists {
				return fmt.Errorf("%s.%s is required", path, required)
			}
		}
		properties, _ := schema["properties"].(map[string]any)
		for key, field := range object {
			property, declared := properties[key]
			if !declared {
				if additional, ok := schema["additionalProperties"].(bool); ok && !additional {
					return fmt.Errorf("%s.%s is not allowed", path, key)
				}
				continue
			}
			propertySchema, ok := property.(map[string]any)
			if ok {
				if err := validateJSONSchema(root, propertySchema, field, path+"."+key); err != nil {
					return err
				}
			}
		}
	}
	return nil
}

func resolveLocalSchemaRef(root map[string]any, ref string) (map[string]any, error) {
	if !strings.HasPrefix(ref, "#/") {
		return nil, fmt.Errorf("unsupported schema reference %q", ref)
	}
	var current any = root
	for _, segment := range strings.Split(strings.TrimPrefix(ref, "#/"), "/") {
		object, ok := current.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("invalid schema reference %q", ref)
		}
		current, ok = object[segment]
		if !ok {
			return nil, fmt.Errorf("unknown schema reference %q", ref)
		}
	}
	resolved, ok := current.(map[string]any)
	if !ok {
		return nil, fmt.Errorf("schema reference %q is not an object", ref)
	}
	return resolved, nil
}

func matchesJSONType(kind string, value any) bool {
	switch kind {
	case "object":
		_, ok := value.(map[string]any)
		return ok
	case "array":
		_, ok := value.([]any)
		return ok
	case "string":
		_, ok := value.(string)
		return ok
	case "boolean":
		_, ok := value.(bool)
		return ok
	case "number":
		_, ok := value.(float64)
		return ok
	case "integer":
		number, ok := value.(float64)
		return ok && !math.IsNaN(number) && !math.IsInf(number, 0) && math.Trunc(number) == number
	default:
		return false
	}
}

func stringList(value any) []string {
	items, _ := value.([]any)
	result := make([]string, 0, len(items))
	for _, item := range items {
		if text, ok := item.(string); ok {
			result = append(result, text)
		}
	}
	return result
}
