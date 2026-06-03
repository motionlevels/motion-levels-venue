package audio

import (
	"bytes"
	"context"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"log"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"

	"github.com/ebitengine/oto/v3"
	"github.com/hajimehoshi/go-mp3"
)

const nativeSampleRate = 48000

type Backend interface {
	Play(ctx context.Context, path string, volume float64) error
}

type PreloadBackend interface {
	Preload(path string) error
}

type Player struct {
	assetsDir string
	backend   Backend

	mu         sync.Mutex
	resolved   map[string]string
	loopCancel context.CancelFunc
	loopRef    string
}

func NewPlayer(assetsDir string, backend Backend) *Player {
	return &Player{
		assetsDir: strings.TrimSpace(assetsDir),
		backend:   backend,
		resolved:  make(map[string]string),
	}
}

func NewSystemPlayer(assetsDir, preferredPlayer string) (*Player, error) {
	preferredPlayer = strings.TrimSpace(preferredPlayer)
	if preferredPlayer == "" || preferredPlayer == "native" {
		backend, err := NewNativeBackend()
		if err == nil {
			return NewPlayer(assetsDir, backend), nil
		}
		if preferredPlayer == "native" {
			return nil, err
		}
		log.Printf("native audio unavailable, falling back to command player: %v", err)
	}
	backend, err := NewCommandBackend(preferredPlayer)
	if err != nil {
		return nil, err
	}
	return NewPlayer(assetsDir, backend), nil
}

func (p *Player) Preload(refs ...string) error {
	if p == nil || p.backend == nil {
		return nil
	}
	preloader, ok := p.backend.(PreloadBackend)
	if !ok {
		return nil
	}
	for _, ref := range refs {
		if strings.TrimSpace(ref) == "" {
			continue
		}
		path, err := p.Resolve(ref)
		if err != nil {
			return err
		}
		if err := preloader.Preload(path); err != nil {
			return err
		}
	}
	return nil
}

func (p *Player) PlayCue(ref string, volume float64) error {
	if p == nil || p.backend == nil {
		return nil
	}
	path, err := p.Resolve(ref)
	if err != nil {
		return err
	}
	volume = normalizeVolume(volume, 1)
	go func() {
		if err := p.backend.Play(context.Background(), path, volume); err != nil {
			log.Printf("audio cue %s: %v", ref, err)
		}
	}()
	return nil
}

func (p *Player) StartLoop(ref string, volume float64) error {
	if p == nil || p.backend == nil {
		return nil
	}
	path, err := p.Resolve(ref)
	if err != nil {
		return err
	}
	volume = normalizeVolume(volume, 1)

	p.mu.Lock()
	if p.loopRef == ref && p.loopCancel != nil {
		p.mu.Unlock()
		return nil
	}
	if p.loopCancel != nil {
		p.loopCancel()
	}
	ctx, cancel := context.WithCancel(context.Background())
	p.loopCancel = cancel
	p.loopRef = ref
	p.mu.Unlock()

	go func() {
		for {
			if ctx.Err() != nil {
				return
			}
			if err := p.backend.Play(ctx, path, volume); err != nil && !errors.Is(err, context.Canceled) {
				log.Printf("audio loop %s: %v", ref, err)
				select {
				case <-ctx.Done():
					return
				case <-time.After(time.Second):
				}
				continue
			}
		}
	}()
	return nil
}

func (p *Player) StopLoop() {
	if p == nil {
		return
	}
	p.mu.Lock()
	defer p.mu.Unlock()
	if p.loopCancel != nil {
		p.loopCancel()
	}
	p.loopCancel = nil
	p.loopRef = ""
}

func (p *Player) Resolve(ref string) (string, error) {
	ref = strings.TrimSpace(ref)
	if ref == "" {
		return "", fmt.Errorf("audio ref is empty")
	}
	p.mu.Lock()
	if path, ok := p.resolved[ref]; ok {
		p.mu.Unlock()
		return path, nil
	}
	p.mu.Unlock()

	var path string
	var err error
	if filepath.IsAbs(ref) {
		path, err = requireFile(ref)
	} else if p.assetsDir == "" {
		return "", fmt.Errorf("audio asset %q needs -audio-assets or an absolute path", ref)
	} else {
		path, err = requireFile(filepath.Join(p.assetsDir, filepath.FromSlash(ref)))
	}
	if err != nil {
		return "", err
	}

	p.mu.Lock()
	p.resolved[ref] = path
	p.mu.Unlock()
	return path, nil
}

func requireFile(path string) (string, error) {
	info, err := os.Stat(path)
	if err != nil {
		return "", err
	}
	if info.IsDir() {
		return "", fmt.Errorf("%s is a directory", path)
	}
	return path, nil
}

func normalizeVolume(value, fallback float64) float64 {
	if value <= 0 {
		value = fallback
	}
	if value > 1 {
		return 1
	}
	return value
}

type NativeBackend struct {
	ctx *oto.Context

	mu    sync.Mutex
	cache map[string]decodedAudio
}

type decodedAudio struct {
	pcm []byte
}

func NewNativeBackend() (*NativeBackend, error) {
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

func decodeAudioFile(path string) ([]byte, int, int, error) {
	switch strings.ToLower(filepath.Ext(path)) {
	case ".mp3":
		return decodeMP3(path)
	case ".wav":
		return decodeWAV(path)
	default:
		return nil, 0, 0, fmt.Errorf("unsupported audio format %q", filepath.Ext(path))
	}
}

func decodeMP3(path string) ([]byte, int, int, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, 0, 0, err
	}
	defer file.Close()
	decoder, err := mp3.NewDecoder(file)
	if err != nil {
		return nil, 0, 0, err
	}
	pcm, err := io.ReadAll(decoder)
	if err != nil {
		return nil, 0, 0, err
	}
	return pcm, decoder.SampleRate(), 2, nil
}

func decodeWAV(path string) ([]byte, int, int, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, 0, 0, err
	}
	defer file.Close()

	var riff [12]byte
	if _, err := io.ReadFull(file, riff[:]); err != nil {
		return nil, 0, 0, err
	}
	if string(riff[0:4]) != "RIFF" || string(riff[8:12]) != "WAVE" {
		return nil, 0, 0, fmt.Errorf("%s is not a RIFF/WAVE file", path)
	}

	var channels int
	var sampleRate int
	var bitsPerSample int
	var data []byte
	for {
		var header [8]byte
		if _, err := io.ReadFull(file, header[:]); err != nil {
			if errors.Is(err, io.EOF) || errors.Is(err, io.ErrUnexpectedEOF) {
				break
			}
			return nil, 0, 0, err
		}
		chunkID := string(header[0:4])
		chunkSize := int(binary.LittleEndian.Uint32(header[4:8]))
		chunk := make([]byte, chunkSize)
		if _, err := io.ReadFull(file, chunk); err != nil {
			return nil, 0, 0, err
		}
		if chunkSize%2 == 1 {
			if _, err := file.Seek(1, io.SeekCurrent); err != nil {
				return nil, 0, 0, err
			}
		}
		switch chunkID {
		case "fmt ":
			if len(chunk) < 16 {
				return nil, 0, 0, fmt.Errorf("%s has short fmt chunk", path)
			}
			format := binary.LittleEndian.Uint16(chunk[0:2])
			if format != 1 {
				return nil, 0, 0, fmt.Errorf("%s uses unsupported WAV format %d", path, format)
			}
			channels = int(binary.LittleEndian.Uint16(chunk[2:4]))
			sampleRate = int(binary.LittleEndian.Uint32(chunk[4:8]))
			bitsPerSample = int(binary.LittleEndian.Uint16(chunk[14:16]))
		case "data":
			data = chunk
		}
	}
	if channels < 1 || channels > 2 || sampleRate <= 0 || bitsPerSample != 16 || len(data) == 0 {
		return nil, 0, 0, fmt.Errorf("%s must be 16-bit mono/stereo PCM WAV", path)
	}
	return data, sampleRate, channels, nil
}

func normalizePCM(pcm []byte, sourceRate int, sourceChannels int, targetRate int) []byte {
	stereo := ensureStereoPCM16(pcm, sourceChannels)
	if sourceRate == targetRate {
		return stereo
	}
	sourceFrames := len(stereo) / 4
	if sourceFrames == 0 || sourceRate <= 0 || targetRate <= 0 {
		return stereo
	}
	targetFrames := int(math.Ceil(float64(sourceFrames) * float64(targetRate) / float64(sourceRate)))
	out := make([]byte, targetFrames*4)
	for i := 0; i < targetFrames; i++ {
		position := float64(i) * float64(sourceRate) / float64(targetRate)
		leftIndex := int(position)
		rightIndex := leftIndex + 1
		if rightIndex >= sourceFrames {
			rightIndex = sourceFrames - 1
		}
		frac := position - float64(leftIndex)
		for channel := 0; channel < 2; channel++ {
			a := sampleAt(stereo, leftIndex, channel)
			b := sampleAt(stereo, rightIndex, channel)
			value := int16(math.Round(float64(a)*(1-frac) + float64(b)*frac))
			binary.LittleEndian.PutUint16(out[i*4+channel*2:], uint16(value))
		}
	}
	return out
}

func ensureStereoPCM16(pcm []byte, channels int) []byte {
	if channels == 2 {
		return pcm
	}
	frames := len(pcm) / 2
	out := make([]byte, frames*4)
	for i := 0; i < frames; i++ {
		sample := pcm[i*2 : i*2+2]
		copy(out[i*4:i*4+2], sample)
		copy(out[i*4+2:i*4+4], sample)
	}
	return out
}

func sampleAt(pcm []byte, frame int, channel int) int16 {
	offset := frame*4 + channel*2
	return int16(binary.LittleEndian.Uint16(pcm[offset : offset+2]))
}

type CommandBackend struct {
	player string
}

func NewCommandBackend(preferred string) (*CommandBackend, error) {
	if preferred = strings.TrimSpace(preferred); preferred != "" {
		if _, err := exec.LookPath(preferred); err != nil {
			return nil, err
		}
		return &CommandBackend{player: preferred}, nil
	}

	for _, candidate := range playerCandidates(runtime.GOOS) {
		if _, err := exec.LookPath(candidate); err == nil {
			return &CommandBackend{player: candidate}, nil
		}
	}
	return nil, fmt.Errorf("no audio player found; install afplay, mpv, ffplay, mpg123, or pass -audio-player")
}

func (b *CommandBackend) Play(ctx context.Context, path string, volume float64) error {
	if b == nil || b.player == "" {
		return nil
	}
	args := commandArgs(filepath.Base(b.player), path, normalizeVolume(volume, 1))
	cmd := exec.CommandContext(ctx, b.player, args...)
	output, err := cmd.CombinedOutput()
	if ctx.Err() != nil {
		return context.Canceled
	}
	if err != nil {
		return fmt.Errorf("%s %s: %w: %s", b.player, path, err, strings.TrimSpace(string(output)))
	}
	return nil
}

func playerCandidates(goos string) []string {
	if goos == "darwin" {
		return []string{"afplay", "mpv", "ffplay", "mpg123"}
	}
	return []string{"mpv", "ffplay", "mpg123", "paplay", "aplay", "afplay"}
}

func commandArgs(player, path string, volume float64) []string {
	switch player {
	case "afplay":
		return []string{"-v", fmt.Sprintf("%.3f", volume), path}
	case "mpv":
		return []string{"--no-video", "--really-quiet", fmt.Sprintf("--volume=%d", percentVolume(volume)), path}
	case "ffplay":
		return []string{"-nodisp", "-autoexit", "-loglevel", "quiet", "-volume", fmt.Sprintf("%d", percentVolume(volume)), path}
	case "mpg123":
		return []string{"-q", "-f", fmt.Sprintf("%d", int(volume*32768)), path}
	case "paplay":
		return []string{fmt.Sprintf("--volume=%d", int(volume*65536)), path}
	case "aplay":
		return []string{"-q", path}
	default:
		return []string{path}
	}
}

func percentVolume(volume float64) int {
	return int(normalizeVolume(volume, 1) * 100)
}
