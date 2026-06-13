package main

import (
	"encoding/json"
	"strings"
	"time"
)

type menuStateSnapshot struct {
	KioskID           string          `json:"kioskId"`
	Version           uint64          `json:"version"`
	UpdatedUnixMillis int64           `json:"updatedUnixMillis"`
	Snapshot          json.RawMessage `json:"snapshot"`
}

func (r *gameRuntime) PutMenuStateSnapshot(kioskID string, snapshot json.RawMessage, now time.Time) menuStateSnapshot {
	if r == nil {
		return menuStateSnapshot{}
	}
	copied := append(json.RawMessage(nil), snapshot...)
	r.mu.Lock()
	defer r.mu.Unlock()
	r.menuStateVersion++
	r.menuStateSnapshot = menuStateSnapshot{
		KioskID:           strings.TrimSpace(kioskID),
		Version:           r.menuStateVersion,
		UpdatedUnixMillis: now.UnixMilli(),
		Snapshot:          copied,
	}
	return copyMenuStateSnapshot(r.menuStateSnapshot)
}

func (r *gameRuntime) MenuStateSnapshot() menuStateSnapshot {
	if r == nil {
		return menuStateSnapshot{}
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	return copyMenuStateSnapshot(r.menuStateSnapshot)
}

func copyMenuStateSnapshot(snapshot menuStateSnapshot) menuStateSnapshot {
	snapshot.Snapshot = append(json.RawMessage(nil), snapshot.Snapshot...)
	return snapshot
}
