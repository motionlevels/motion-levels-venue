package main

import (
	"strings"

	"github.com/lobis/motion-levels/game-engine/internal/animation"
)

func isAmbientActivityGame(game string) bool {
	game = strings.ToLower(strings.TrimSpace(game))
	return animation.IsAmbientMode(game) ||
		game == "screensaver" ||
		game == "screen-saver" ||
		strings.HasPrefix(game, "ambient-") ||
		strings.HasPrefix(game, "animation-")
}
