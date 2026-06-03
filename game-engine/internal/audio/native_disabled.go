//go:build no_oto_audio

package audio

import "fmt"

func NewNativeBackend() (Backend, error) {
	return nil, fmt.Errorf("native audio disabled by no_oto_audio build tag")
}
