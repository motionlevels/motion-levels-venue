package patronesgo

type ABI struct {
	game *Game
}

func NewABI() *ABI {
	return &ABI{}
}

func (a *ABI) Init(ptr uint32, length uint32) uint64 {
	return a.gameInit(ptr, length)
}

func (a *ABI) Press(ptr uint32, length uint32) uint64 {
	return a.gamePress(ptr, length)
}

func (a *ABI) Tick(ptr uint32, length uint32) uint64 {
	return 0
}

func (a *ABI) Render(ptr uint32, length uint32) uint64 {
	return a.gameRender(ptr, length)
}

func (a *ABI) Snapshot(ptr uint32, length uint32) uint64 {
	return a.gameSnapshot(ptr, length)
}
