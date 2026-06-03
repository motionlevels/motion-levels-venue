//go:build !no_oto_audio

package audio

import (
	"bytes"
	"context"
	"sync"
	"time"

	"github.com/ebitengine/oto/v3"
)

type NativeBackend struct {
	ctx *oto.Context

	mu    sync.Mutex
	cache map[string]decodedAudio
}

type decodedAudio struct {
	pcm []byte
}

func NewNativeBackend() (Backend, error) {
	ctx, ready, err := oto.NewContext(&oto.NewContextOptions{
		SampleRate:   nativeSampleRate,
		ChannelCount: 2,
		Format:       oto.FormatSignedInt16LE,
		BufferSize:   10 * time.Millisecond,
	})
	if err != nil {
		return nil, err
	}
	<-ready
	return &NativeBackend{
		ctx:   ctx,
		cache: make(map[string]decodedAudio),
	}, nil
}

func (b *NativeBackend) Preload(path string) error {
	_, err := b.load(path)
	return err
}

func (b *NativeBackend) Play(ctx context.Context, path string, volume float64) error {
	if b == nil || b.ctx == nil {
		return nil
	}
	decoded, err := b.load(path)
	if err != nil {
		return err
	}
	player := b.ctx.NewPlayer(bytes.NewReader(decoded.pcm))
	player.SetBufferSize(nativeSampleRate * 2 * 2 / 100)
	player.SetVolume(normalizeVolume(volume, 1))
	player.Play()
	defer player.Close()

	ticker := time.NewTicker(5 * time.Millisecond)
	defer ticker.Stop()
	for {
		if ctx.Err() != nil {
			player.Pause()
			return context.Canceled
		}
		if err := player.Err(); err != nil {
			return err
		}
		if !player.IsPlaying() {
			return nil
		}
		<-ticker.C
	}
}

func (b *NativeBackend) load(path string) (decodedAudio, error) {
	b.mu.Lock()
	if decoded, ok := b.cache[path]; ok {
		b.mu.Unlock()
		return decoded, nil
	}
	b.mu.Unlock()

	pcm, sampleRate, channels, err := decodeAudioFile(path)
	if err != nil {
		return decodedAudio{}, err
	}
	pcm = normalizePCM(pcm, sampleRate, channels, nativeSampleRate)
	decoded := decodedAudio{pcm: pcm}

	b.mu.Lock()
	b.cache[path] = decoded
	b.mu.Unlock()
	return decoded, nil
}
