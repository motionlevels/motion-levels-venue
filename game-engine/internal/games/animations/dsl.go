package animations

import (
	"fmt"
	"math"
	"strings"
	"unicode"
)

type dslColor struct {
	r float64
	g float64
	b float64
}

type dslValue struct {
	number  float64
	color   dslColor
	isColor bool
}

type dslAssignment struct {
	name string
	expr dslExpr
}

type compiledProcedure struct {
	code                 string
	assignments          []dslAssignment
	params               map[string]float64
	seed                 float64
	loopSeconds          float64
	referenceLoopSeconds float64
}

type dslExpr interface {
	eval(*dslEvalContext) (dslValue, error)
}

type dslNumber struct {
	value float64
}

type dslVariable struct {
	name string
}

type dslUnary struct {
	value dslExpr
}

type dslBinary struct {
	op          string
	left, right dslExpr
}

type dslCall struct {
	name string
	args []dslExpr
}

type dslEvalContext struct {
	env    map[string]dslValue
	source *compiledProcedure
}

var dslBuiltinVariables = map[string]struct{}{
	"x": {}, "y": {}, "width": {}, "height": {}, "xn": {}, "yn": {},
	"loop_time": {}, "loop_progress": {}, "loop_seconds": {}, "frame": {}, "seed": {}, "pi": {},
	"press_x": {}, "press_y": {}, "press_age": {}, "press_progress": {}, "press_distance": {},
	"base_r": {}, "base_g": {}, "base_b": {},
}

var dslFunctionNames = map[string]struct{}{
	"sin": {}, "cos": {}, "tan": {}, "atan2": {}, "abs": {}, "min": {}, "max": {}, "floor": {}, "ceil": {}, "round": {},
	"sqrt": {}, "pow": {}, "hypot": {}, "mod": {}, "clamp": {}, "clamp01": {}, "mix": {}, "step": {}, "smoothstep": {},
	"rand": {}, "noise": {}, "hash": {}, "shr": {}, "rgb": {}, "hsv": {},
}

const (
	minProcedureLoopSeconds = 0.1
	maxProcedureLoopSeconds = 300
)

func compileProcedureSource(source animationProcedureSource) (*compiledProcedure, error) {
	if strings.TrimSpace(source.Code) == "" {
		return nil, fmt.Errorf("La fuente DSL no contiene asignaciones.")
	}
	code := canonicalizeDSLCode(source.Code)
	assignments := []dslAssignment{}
	for _, raw := range strings.Split(code, "\n") {
		line := stripDSLComment(raw)
		if line == "" {
			continue
		}
		assignment, err := parseDSLAssignment(line)
		if err != nil {
			return nil, err
		}
		assignments = append(assignments, assignment)
	}
	if len(assignments) == 0 {
		return nil, fmt.Errorf("La fuente DSL no contiene asignaciones.")
	}
	loopSeconds := loopSecondsFloat(source.LoopSeconds, 4)
	refSeconds := loopSecondsFloat(source.ReferenceLoopSeconds, loopSeconds)
	params := map[string]float64{}
	for key, raw := range source.Params {
		if _, reserved := dslBuiltinVariables[key]; reserved {
			continue
		}
		if _, reserved := dslFunctionNames[key]; reserved || key == "color" {
			continue
		}
		value, ok := raw.(float64)
		if !ok {
			continue
		}
		if math.IsNaN(value) || math.IsInf(value, 0) {
			continue
		}
		params[key] = value
	}
	return &compiledProcedure{
		code:                 code,
		assignments:          assignments,
		params:               params,
		seed:                 finiteFloat(source.Seed, 1),
		loopSeconds:          loopSeconds,
		referenceLoopSeconds: refSeconds,
	}, nil
}

func (p *compiledProcedure) colorAt(x, y int, elapsed timeSeconds, frameIndex int) (RGB, error) {
	return p.colorAtWithVariables(x, y, elapsed, frameIndex, nil)
}

func (p *compiledProcedure) colorAtWithVariables(x, y int, elapsed timeSeconds, frameIndex int, extraVariables map[string]float64) (RGB, error) {
	renderTime := float64(elapsed)
	if p.loopSeconds > 0 {
		renderTime = positiveModFloat(renderTime, p.loopSeconds)
	}
	loopTime := renderTime
	if p.referenceLoopSeconds > 0 && p.loopSeconds > 0 {
		loopTime = renderTime * (p.referenceLoopSeconds / p.loopSeconds)
	}
	loopProgress := 0.0
	if p.loopSeconds > 0 {
		loopProgress = renderTime / p.loopSeconds
	}
	width := float64(GridWidth)
	height := float64(GridHeight)
	env := map[string]dslValue{
		"x":             numberValue(float64(x)),
		"y":             numberValue(float64(y)),
		"width":         numberValue(width),
		"height":        numberValue(height),
		"xn":            numberValue(normalizedCoord(x, GridWidth)),
		"yn":            numberValue(normalizedCoord(y, GridHeight)),
		"loop_time":     numberValue(loopTime),
		"loop_progress": numberValue(loopProgress),
		"frame":         numberValue(float64(frameIndex)),
		"seed":          numberValue(p.seed),
		"pi":            numberValue(math.Pi),
		"loop_seconds":  numberValue(p.referenceLoopSeconds),
	}
	for key, value := range p.params {
		env[key] = numberValue(value)
	}
	for key, value := range extraVariables {
		if _, ok := dslBuiltinVariables[key]; ok {
			env[key] = numberValue(value)
		}
	}
	ctx := &dslEvalContext{env: env, source: p}
	for _, assignment := range p.assignments {
		value, err := assignment.expr.eval(ctx)
		if err != nil {
			return RGB{}, err
		}
		ctx.env[assignment.name] = value
	}
	value, ok := ctx.env["color"]
	if !ok || !value.isColor {
		return RGB{}, fmt.Errorf("La fuente DSL debe asignar color = hsv(...) o color = rgb(...).")
	}
	return RGB{R: clampByteFloat(value.color.r), G: clampByteFloat(value.color.g), B: clampByteFloat(value.color.b)}, nil
}

type timeSeconds float64

func parseDSLAssignment(line string) (dslAssignment, error) {
	parts := strings.SplitN(line, "=", 2)
	if len(parts) != 2 {
		return dslAssignment{}, fmt.Errorf("Linea DSL no valida: %s", line)
	}
	name := strings.TrimSpace(parts[0])
	if !validDSLIdentifier(name) {
		return dslAssignment{}, fmt.Errorf("Linea DSL no valida: %s", line)
	}
	if _, reserved := dslBuiltinVariables[name]; reserved {
		return dslAssignment{}, fmt.Errorf("%q es un nombre reservado del DSL.", name)
	}
	if _, reserved := dslFunctionNames[name]; reserved {
		return dslAssignment{}, fmt.Errorf("%q es un nombre reservado del DSL.", name)
	}
	parser, err := newDSLParser(parts[1])
	if err != nil {
		return dslAssignment{}, err
	}
	expr, err := parser.parse()
	if err != nil {
		return dslAssignment{}, err
	}
	return dslAssignment{name: name, expr: expr}, nil
}

func (n dslNumber) eval(*dslEvalContext) (dslValue, error) {
	return numberValue(n.value), nil
}

func (v dslVariable) eval(ctx *dslEvalContext) (dslValue, error) {
	value, ok := ctx.env[v.name]
	if !ok {
		return dslValue{}, fmt.Errorf("Variable DSL desconocida: %s", v.name)
	}
	return value, nil
}

func (u dslUnary) eval(ctx *dslEvalContext) (dslValue, error) {
	value, err := evalNumber(u.value, ctx)
	if err != nil {
		return dslValue{}, err
	}
	return numberValue(-value), nil
}

func (b dslBinary) eval(ctx *dslEvalContext) (dslValue, error) {
	left, err := evalNumber(b.left, ctx)
	if err != nil {
		return dslValue{}, err
	}
	right, err := evalNumber(b.right, ctx)
	if err != nil {
		return dslValue{}, err
	}
	switch b.op {
	case "+":
		return numberValue(left + right), nil
	case "-":
		return numberValue(left - right), nil
	case "*":
		return numberValue(left * right), nil
	case "/":
		if right == 0 {
			return numberValue(0), nil
		}
		return numberValue(left / right), nil
	case "%":
		if right == 0 {
			right = 1
		}
		return numberValue(positiveModFloat(left, right)), nil
	default:
		return dslValue{}, fmt.Errorf("Operador DSL desconocido: %s", b.op)
	}
}

func (c dslCall) eval(ctx *dslEvalContext) (dslValue, error) {
	args := make([]float64, 0, len(c.args))
	for _, expr := range c.args {
		value, err := evalNumber(expr, ctx)
		if err != nil {
			return dslValue{}, err
		}
		args = append(args, value)
	}
	return callDSLFunction(c.name, args, ctx.source)
}

func callDSLFunction(name string, args []float64, source *compiledProcedure) (dslValue, error) {
	arg := func(index int, fallback float64) float64 {
		if index >= len(args) || math.IsNaN(args[index]) || math.IsInf(args[index], 0) {
			return fallback
		}
		return args[index]
	}
	switch name {
	case "sin":
		return numberValue(math.Sin(arg(0, 0))), nil
	case "cos":
		return numberValue(math.Cos(arg(0, 0))), nil
	case "tan":
		return numberValue(math.Tan(arg(0, 0))), nil
	case "atan2":
		return numberValue(math.Atan2(arg(0, 0), arg(1, 0))), nil
	case "abs":
		return numberValue(math.Abs(arg(0, 0))), nil
	case "min":
		if len(args) == 0 {
			return numberValue(0), nil
		}
		out := args[0]
		for _, value := range args[1:] {
			out = math.Min(out, value)
		}
		return numberValue(out), nil
	case "max":
		if len(args) == 0 {
			return numberValue(0), nil
		}
		out := args[0]
		for _, value := range args[1:] {
			out = math.Max(out, value)
		}
		return numberValue(out), nil
	case "floor":
		return numberValue(math.Floor(arg(0, 0))), nil
	case "ceil":
		return numberValue(math.Ceil(arg(0, 0))), nil
	case "round":
		return numberValue(math.Round(arg(0, 0))), nil
	case "sqrt":
		return numberValue(math.Sqrt(math.Max(0, arg(0, 0)))), nil
	case "pow":
		return numberValue(math.Pow(arg(0, 0), arg(1, 1))), nil
	case "hypot":
		return numberValue(math.Hypot(arg(0, 0), arg(1, 0))), nil
	case "mod":
		return numberValue(positiveModFloat(arg(0, 0), arg(1, 1))), nil
	case "clamp":
		return numberValue(clampFloat(arg(0, 0), arg(1, 0), arg(2, 1))), nil
	case "clamp01":
		return numberValue(clampFloat(arg(0, 0), 0, 1)), nil
	case "mix":
		amount := clampFloat(arg(2, 0), 0, 1)
		return numberValue(arg(0, 0) + (arg(1, 0)-arg(0, 0))*amount), nil
	case "step":
		if arg(1, 0) < arg(0, 0) {
			return numberValue(0), nil
		}
		return numberValue(1), nil
	case "smoothstep":
		minimum := arg(0, 0)
		maximum := arg(1, 1)
		amount := clampFloat((arg(2, 0)-minimum)/(maximum-minimum), 0, 1)
		return numberValue(amount * amount * (3 - 2*amount)), nil
	case "rand", "noise":
		return numberValue(seededDSLNoise(append([]float64{source.seed}, args...))), nil
	case "hash":
		return numberValue(float64(uintHashFloat(arg(0, 0)))), nil
	case "shr":
		shift := uint(math.Max(0, math.Min(31, math.Round(arg(1, 0)))))
		return numberValue(float64(uintHashFloat(arg(0, 0)) >> shift)), nil
	case "rgb":
		return colorValue(arg(0, 0), arg(1, 0), arg(2, 0)), nil
	case "hsv":
		return colorValueFromRGB(hsvFloat(arg(0, 0), arg(1, 1), arg(2, 1))), nil
	default:
		return dslValue{}, fmt.Errorf("Funcion DSL desconocida: %s", name)
	}
}

func evalNumber(expr dslExpr, ctx *dslEvalContext) (float64, error) {
	value, err := expr.eval(ctx)
	if err != nil {
		return 0, err
	}
	if value.isColor || math.IsNaN(value.number) || math.IsInf(value.number, 0) {
		return 0, fmt.Errorf("Se esperaba un valor numerico en la fuente DSL.")
	}
	return value.number, nil
}

func numberValue(value float64) dslValue {
	if math.IsNaN(value) || math.IsInf(value, 0) {
		value = 0
	}
	return dslValue{number: value}
}

func colorValue(r, g, b float64) dslValue {
	return dslValue{color: dslColor{r: r, g: g, b: b}, isColor: true}
}

func colorValueFromRGB(color RGB) dslValue {
	return colorValue(float64(color.R), float64(color.G), float64(color.B))
}

func stripDSLComment(line string) string {
	if index := strings.Index(line, "//"); index >= 0 {
		line = line[:index]
	}
	if index := strings.Index(line, "#"); index >= 0 {
		line = line[:index]
	}
	return strings.TrimSpace(line)
}

func canonicalizeDSLCode(code string) string {
	return replaceBareDSLIdentifier(
		code,
		"loop_t", "loop_time",
		"time", "loop_time",
		"t", "loop_time",
		"duration_seconds", "loop_seconds",
		"actual_loop_seconds", "loop_seconds",
	)
}

func replaceBareDSLIdentifier(code string, pairs ...string) string {
	if len(pairs)%2 != 0 {
		return code
	}
	replacements := map[string]string{}
	for i := 0; i < len(pairs); i += 2 {
		replacements[pairs[i]] = pairs[i+1]
	}
	var out strings.Builder
	for index := 0; index < len(code); {
		r := rune(code[index])
		if isIdentifierStart(r) {
			start := index
			index++
			for index < len(code) && isIdentifierPart(rune(code[index])) {
				index++
			}
			word := code[start:index]
			if replacement, ok := replacements[word]; ok {
				out.WriteString(replacement)
			} else {
				out.WriteString(word)
			}
			continue
		}
		out.WriteByte(code[index])
		index++
	}
	return out.String()
}

func validDSLIdentifier(value string) bool {
	if value == "" {
		return false
	}
	for index, r := range value {
		if index == 0 {
			if !isIdentifierStart(r) {
				return false
			}
			continue
		}
		if !isIdentifierPart(r) {
			return false
		}
	}
	return true
}

func isIdentifierStart(r rune) bool {
	return r == '_' || unicode.IsLetter(r)
}

func isIdentifierPart(r rune) bool {
	return r == '_' || unicode.IsLetter(r) || unicode.IsDigit(r)
}

func normalizedCoord(value, size int) float64 {
	if size <= 1 {
		return 0
	}
	return float64(value) / float64(size-1)
}

func finiteFloat(value, fallback float64) float64 {
	if math.IsNaN(value) || math.IsInf(value, 0) {
		return fallback
	}
	return value
}

func positiveFloat(value, fallback float64) float64 {
	value = finiteFloat(value, fallback)
	if value <= 0 {
		return fallback
	}
	return value
}

func loopSecondsFloat(value, fallback float64) float64 {
	return clampFloat(positiveFloat(value, fallback), minProcedureLoopSeconds, maxProcedureLoopSeconds)
}

func positiveModFloat(value, divisor float64) float64 {
	if divisor == 0 || math.IsNaN(divisor) || math.IsInf(divisor, 0) {
		divisor = 1
	}
	out := math.Mod(value, divisor)
	if out < 0 {
		out += divisor
	}
	return out
}

func clampFloat(value, minimum, maximum float64) float64 {
	if math.IsNaN(value) || math.IsInf(value, 0) {
		return minimum
	}
	if value < minimum {
		return minimum
	}
	if value > maximum {
		return maximum
	}
	return value
}

func clampByteFloat(value float64) byte {
	return byte(math.Round(clampFloat(value, 0, 255)))
}

func hsvFloat(hue, saturation, value float64) RGB {
	h := positiveModFloat(hue, 1) * 6
	s := clampFloat(saturation, 0, 1)
	v := clampFloat(value, 0, 1)
	c := v * s
	x := c * (1 - math.Abs(math.Mod(h, 2)-1))
	m := v - c
	var r, g, b float64
	switch {
	case h < 1:
		r, g, b = c, x, 0
	case h < 2:
		r, g, b = x, c, 0
	case h < 3:
		r, g, b = 0, c, x
	case h < 4:
		r, g, b = 0, x, c
	case h < 5:
		r, g, b = x, 0, c
	default:
		r, g, b = c, 0, x
	}
	return RGB{R: clampByteFloat((r + m) * 255), G: clampByteFloat((g + m) * 255), B: clampByteFloat((b + m) * 255)}
}

func seededDSLNoise(values []float64) float64 {
	hash := uint32(2166136261)
	for _, value := range values {
		if math.IsNaN(value) || math.IsInf(value, 0) {
			value = 0
		}
		scaled := uint32(int32(math.Round(value * 1000003)))
		hash ^= scaled
		hash *= 16777619
		hash ^= hash >> 13
	}
	return float64(hash) / 4294967295
}

func uintHashFloat(value float64) uint32 {
	hash := uint32(int32(math.Trunc(value))) ^ 0x9e3779b9
	hash = (hash ^ (hash >> 15)) * 0x85ebca6b
	hash = (hash ^ (hash >> 13)) * 0xc2b2ae35
	return hash ^ (hash >> 16)
}
