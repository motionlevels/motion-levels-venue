package authored

import (
	"encoding/base64"
	"strings"
	"testing"
	"time"
)

func TestWASMGameInitTimeoutFailsClosed(t *testing.T) {
	entry := CatalogEntry{
		EngineGame: "authored-loop",
		Label:      "Loop",
		GameSource: Spec{
			Schema:     "motion-go-v1",
			Kind:       "wasm",
			WASMBase64: base64.StdEncoding.EncodeToString(loopingInitWASM),
		},
	}

	start := time.Now()
	game, err := NewWASMWithSeed(start, 1, entry, 1, nil)
	if err == nil {
		if game != nil {
			snapshot := game.Snapshot(start)
			if snapshot.Phase != "failed" {
				t.Fatalf("snapshot phase = %q, want failed", snapshot.Phase)
			}
		}
		t.Fatal("expected looping wasm init to fail")
	}
	if elapsed := time.Since(start); elapsed > 2*time.Second {
		t.Fatalf("looping wasm init took %s, watchdog did not close promptly", elapsed)
	}
	if !strings.Contains(err.Error(), "init") {
		t.Fatalf("error = %v, want init context", err)
	}
}

// loopingInitWASM is equivalent to:
//
//	(module
//	  (memory (export "memory") 1)
//	  (func (export "alloc") (param i32) (result i32) i32.const 0)
//	  (func (export "init") (param i32 i32) (result i64)
//	    (loop br 0)
//	    i64.const 0))
var loopingInitWASM = []byte{
	0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
	0x01, 0x0c, 0x02, 0x60, 0x01, 0x7f, 0x01, 0x7f,
	0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7e,
	0x03, 0x03, 0x02, 0x00, 0x01,
	0x05, 0x03, 0x01, 0x00, 0x01,
	0x07, 0x19, 0x03,
	0x06, 0x6d, 0x65, 0x6d, 0x6f, 0x72, 0x79, 0x02, 0x00,
	0x05, 0x61, 0x6c, 0x6c, 0x6f, 0x63, 0x00, 0x00,
	0x04, 0x69, 0x6e, 0x69, 0x74, 0x00, 0x01,
	0x0a, 0x10, 0x02,
	0x04, 0x00, 0x41, 0x00, 0x0b,
	0x09, 0x00, 0x03, 0x40, 0x0c, 0x00, 0x0b, 0x42, 0x00, 0x0b,
}
