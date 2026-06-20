package main

import "github.com/lobis/motion-levels/game-engine/internal/animation"

var countdownDigitPatterns = map[int][]string{
	1: {
		"01100",
		"11100",
		"01100",
		"01100",
		"01100",
		"01100",
		"11110",
	},
	2: {
		"11110",
		"00011",
		"00011",
		"11110",
		"11000",
		"11000",
		"11111",
	},
	3: {
		"11110",
		"00011",
		"00011",
		"11110",
		"00011",
		"00011",
		"11110",
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
			for sy := 0; sy < scale; sy++ {
				for sx := 0; sx < scale; sx++ {
					x := startX + px*scale + sx
					y := startY + py*scale + sy
					if x < 0 || x >= animation.GridWidth || y < 0 || y >= animation.GridHeight {
						continue
					}
					frame[y*animation.GridWidth+x] = yellow
				}
			}
		}
	}
}
