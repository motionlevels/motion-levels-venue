package tetris

type ABI struct{}

func NewABI() *ABI {
	return &ABI{}
}

func (a *ABI) Init(ptr uint32, length uint32) uint64 {
	return gameInit(ptr, length)
}

func (a *ABI) Press(ptr uint32, length uint32) uint64 {
	return gamePress(ptr, length)
}

func (a *ABI) Tick(ptr uint32, length uint32) uint64 {
	return gameTick(ptr, length)
}

func (a *ABI) Render(ptr uint32, length uint32) uint64 {
	return gameRender(ptr, length)
}

func (a *ABI) Snapshot(ptr uint32, length uint32) uint64 {
	return gameSnapshot(ptr, length)
}
