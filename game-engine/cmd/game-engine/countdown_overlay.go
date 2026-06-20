package main

import "github.com/lobis/motion-levels/game-engine/internal/animation"

var countdownDigitPatterns = map[int][]string{
	1: {
		"0100",
		"1100",
		"0100",
		"0100",
		"0100",
		"1110",
	},
	2: {
		"1110",
		"0001",
		"0010",
		"0100",
		"1000",
		"1111",
	},
	3: {
		"1110",
		"0001",
		"0110",
		"0001",
		"0001",
		"1110",
	},
}

func countdownOverlayDigit(remainingMillis int64) int {
	switch {
	case remainingMillis > 2000:
		return 3
	case remainingMillis > 1000:
		return 2
	case remainingMillis > 0:
		return 1
	default:
		return 0
	}
}

func drawCountdownDigit(frame []animation.RGB, digit int) {
	pattern := countdownDigitPatterns[digit]
	if len(pattern) == 0 || len(frame) != animation.GridWidth*animation.GridHeight {
		return
	}
	const scale = 2
	patternWidth := len(pattern[0])
	patternHeight := len(pattern)
	width := patternWidth * scale
	height := patternHeight * scale
	startX := (animation.GridWidth - width) / 2
	startY := (animation.GridHeight - height) / 2
	yellow := animation.RGB{R: 255, G: 224, B: 32}
	for py, row := range pattern {
		for px, lit := range row {
			if lit != '1' {
				continue
			}
			flippedX := patternWidth - 1 - px
			flippedY := patternHeight - 1 - py
			for sy := 0; sy < scale; sy++ {
				for sx := 0; sx < scale; sx++ {
					x := startX + flippedX*scale + sx
					y := startY + flippedY*scale + sy
					if x < 0 || x >= animation.GridWidth || y < 0 || y >= animation.GridHeight {
						continue
					}
					frame[y*animation.GridWidth+x] = yellow
				}
			}
		}
	}
}
