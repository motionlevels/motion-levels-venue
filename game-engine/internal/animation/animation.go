package animation

import "math"

const (
	GridWidth  = 16
	GridHeight = 32
)

type RGB struct {
	R byte
	G byte
	B byte
}

func LoopColor(x, y int, seconds float64) RGB {
	widthPhase := float64(x) / float64(GridWidth)
	heightPhase := float64(y) / float64(GridHeight)
	hue := math.Mod(widthPhase*0.55+heightPhase*0.35+seconds*0.10, 1)
	pulse := 0.70 + 0.30*math.Sin((seconds*2.0+widthPhase*4.0-heightPhase*2.5)*math.Pi)
	return hsv(hue, 0.85, clamp01(pulse))
}

func hsv(h, s, v float64) RGB {
	h = math.Mod(h, 1)
	if h < 0 {
		h += 1
	}
	i := int(h * 6)
	f := h*6 - float64(i)
	p := v * (1 - s)
	q := v * (1 - f*s)
	t := v * (1 - (1-f)*s)

	var r, g, b float64
	switch i % 6 {
	case 0:
		r, g, b = v, t, p
	case 1:
		r, g, b = q, v, p
	case 2:
		r, g, b = p, v, t
	case 3:
		r, g, b = p, q, v
	case 4:
		r, g, b = t, p, v
	default:
		r, g, b = v, p, q
	}

	return RGB{byte(r * 255), byte(g * 255), byte(b * 255)}
}

func clamp01(value float64) float64 {
	if value < 0 {
		return 0
	}
	if value > 1 {
		return 1
	}
	return value
}
