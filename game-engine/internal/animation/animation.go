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

func Color(mode string, x, y int, seconds float64) RGB {
	switch mode {
	case "ambient-comet":
		return cometColor(x, y, seconds)
	case "ambient-pulse":
		return pulseColor(x, y, seconds)
	case "ambient-spark":
		return sparkColor(x, y, seconds)
	default:
		return LoopColor(x, y, seconds)
	}
}

func IsAmbientMode(mode string) bool {
	switch mode {
	case "salvapantallas", "animations", "ambient-comet", "ambient-pulse", "ambient-spark":
		return true
	default:
		return false
	}
}

func cometColor(x, y int, seconds float64) RGB {
	nx := float64(x) / float64(GridWidth)
	ny := float64(y) / float64(GridHeight)
	glow := 0.04
	for i := 0; i < 4; i++ {
		seed := float64(i) * 0.23
		head := positiveMod(seconds*(0.13+float64(i)*0.018)+seed, 1.45) - 0.22
		lane := 0.16 + float64(i)*0.22 + math.Sin(seconds*0.38+float64(i))*0.05
		diagonal := nx*0.84 + ny*0.36
		dist := math.Abs(diagonal-head) + math.Abs(ny-lane)*0.62
		glow += math.Max(0, 1-dist*12) * 0.95
	}
	baseHue := positiveMod(0.55+nx*0.1-ny*0.05+seconds*0.035, 1)
	return hsv(baseHue, 0.82, clamp01(glow))
}

func pulseColor(x, y int, seconds float64) RGB {
	cx := float64(GridWidth-1) / 2
	cy := float64(GridHeight-1) / 2
	dist := math.Hypot((float64(x)-cx)/float64(GridWidth), (float64(y)-cy)/float64(GridHeight))
	ring := 0.5 + 0.5*math.Sin((dist*8.5-seconds*1.35)*math.Pi*2)
	shimmer := 0.5 + 0.5*math.Sin((float64(x)*0.55-float64(y)*0.21+seconds*0.8)*math.Pi)
	value := 0.16 + ring*0.54 + shimmer*0.14
	return hsv(positiveMod(0.34+dist*0.28+seconds*0.025, 1), 0.72, clamp01(value))
}

func sparkColor(x, y int, seconds float64) RGB {
	beat := int(math.Floor(seconds * 8))
	phase := seconds*8 - float64(beat)
	value := 0.06
	hue := 0.08
	for i := 0; i < 6; i++ {
		seed := hash(uint32(beat*17 + i*29))
		sx := int(seed % GridWidth)
		sy := int((seed >> 8) % GridHeight)
		dist := absInt(x-sx) + absInt(y-sy)
		if dist > 2 {
			continue
		}
		falloff := math.Max(0, 1-float64(dist)/2.4) * math.Pow(1-phase, 1.7)
		value += falloff
		hue = 0.06 + float64((seed>>16)%18)/100
	}
	underglow := 0.03 + 0.05*math.Sin((float64(x)*0.4+float64(y)*0.2+seconds*0.5)*math.Pi)
	return hsv(hue, 0.9, clamp01(value+underglow))
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

func positiveMod(value, n float64) float64 {
	out := math.Mod(value, n)
	if out < 0 {
		out += n
	}
	return out
}

func hash(n uint32) uint32 {
	h := (n ^ 0x9e3779b9)
	h = (h ^ (h >> 15)) * 0x85ebca6b
	h = (h ^ (h >> 13)) * 0xc2b2ae35
	return h ^ (h >> 16)
}

func absInt(value int) int {
	if value < 0 {
		return -value
	}
	return value
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
