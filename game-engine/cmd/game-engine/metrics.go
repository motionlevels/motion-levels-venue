package main

import (
	"fmt"
	"net/http"
	"runtime"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/lobis/motion-levels/game-engine/internal/games/motionlevelsgames"
	"github.com/lobis/motion-levels/game-engine/internal/sessionrecording"
)

var engineStartedAt = time.Now()

var httpDurationBuckets = []float64{0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5}

type apiMetricKey struct {
	Method string
	Path   string
	Status string
}

type apiMetricValue struct {
	Count   uint64
	Sum     float64
	Buckets []uint64
}

type apiMetrics struct {
	mu     sync.Mutex
	values map[apiMetricKey]*apiMetricValue
}

func (m *apiMetrics) Observe(method, path string, status int, elapsed time.Duration) {
	if m == nil {
		return
	}
	key := apiMetricKey{Method: normalizeHTTPMethod(method), Path: normalizeAPIPath(path), Status: statusClass(status)}
	seconds := elapsed.Seconds()
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.values == nil {
		m.values = make(map[apiMetricKey]*apiMetricValue)
	}
	value := m.values[key]
	if value == nil {
		value = &apiMetricValue{Buckets: make([]uint64, len(httpDurationBuckets))}
		m.values[key] = value
	}
	value.Count++
	value.Sum += seconds
	for index, bucket := range httpDurationBuckets {
		if seconds <= bucket {
			value.Buckets[index]++
		}
	}
}

func (m *apiMetrics) Snapshot() map[apiMetricKey]apiMetricValue {
	if m == nil {
		return nil
	}
	m.mu.Lock()
	defer m.mu.Unlock()
	result := make(map[apiMetricKey]apiMetricValue, len(m.values))
	for key, value := range m.values {
		copyValue := *value
		copyValue.Buckets = append([]uint64(nil), value.Buckets...)
		result[key] = copyValue
	}
	return result
}

type enginePrometheusWriter struct {
	b strings.Builder
}

func (p *enginePrometheusWriter) family(name, help, kind string) {
	_, _ = fmt.Fprintf(&p.b, "# HELP %s %s\n# TYPE %s %s\n", name, help, name, kind)
}

func (p *enginePrometheusWriter) sample(name string, value any, labels ...string) {
	p.b.WriteString(name)
	if len(labels) > 0 {
		p.b.WriteByte('{')
		for index := 0; index+1 < len(labels); index += 2 {
			if index > 0 {
				p.b.WriteByte(',')
			}
			_, _ = fmt.Fprintf(&p.b, "%s=%s", labels[index], strconv.Quote(labels[index+1]))
		}
		p.b.WriteByte('}')
	}
	_, _ = fmt.Fprintf(&p.b, " %v\n", value)
}

func (p *enginePrometheusWriter) metric(name, help, kind string, value any, labels ...string) {
	p.family(name, help, kind)
	p.sample(name, value, labels...)
}

func engineMetricsHandler(game *gameRuntime) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "text/plain; version=0.0.4; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		if r.Method == http.MethodHead {
			w.WriteHeader(http.StatusOK)
			return
		}
		_, _ = w.Write([]byte(renderEngineMetrics(game, time.Now())))
	}
}

func renderEngineMetrics(game *gameRuntime, now time.Time) string {
	if now.IsZero() {
		now = time.Now()
	}
	if game == nil {
		return "# HELP motion_levels_engine_up Whether the venue game engine can serve metrics.\n# TYPE motion_levels_engine_up gauge\nmotion_levels_engine_up 0\n"
	}
	status, display := game.statusAt(now)
	displayClient := status.DisplayClient
	lifecycle := playerExperienceLifecycle(status.CurrentGame, display.Phase, status.Paused)
	perf := status.Performance

	game.playerStateMu.Lock()
	stateRevision := game.playerStateVersion
	stateUpdated := game.playerStateUpdated
	game.playerStateMu.Unlock()
	game.mu.RLock()
	menuVersion := game.menuStateVersion
	menuUpdatedMillis := game.menuStateSnapshot.UpdatedUnixMillis
	game.mu.RUnlock()

	var memory runtime.MemStats
	runtime.ReadMemStats(&memory)
	var p enginePrometheusWriter
	p.metric("motion_levels_engine_up", "Whether the venue game engine can serve metrics.", "gauge", 1)
	p.metric("motion_levels_engine_process_start_time_seconds", "Venue game engine process start time since Unix epoch.", "gauge", engineStartedAt.Unix())
	p.metric("motion_levels_engine_process_memory_bytes", "Memory reserved by the Go runtime.", "gauge", memory.Sys)
	p.metric("motion_levels_engine_process_goroutines", "Current number of Go routines.", "gauge", runtime.NumGoroutine())
	p.metric("motion_levels_engine_active_game_info", "Current game and runtime identity without session or player identifiers.", "gauge", 1,
		"game", status.CurrentGame, "source_kind", status.SourceKind, "runtime", perf.Runtime)
	p.metric("motion_levels_engine_session_active", "Whether a non-ambient game session is active.", "gauge", boolMetric(status.SessionID != ""))
	p.metric("motion_levels_engine_pressure_stream_connected", "Whether controller pressure input is connected.", "gauge", boolMetric(status.PressureStreamConnected))
	adapter := status.FloorAdapter
	p.metric("motion_levels_engine_floor_adapter_connected", "Whether the hardware floor adapter transport is connected.", "gauge", boolMetric(adapter.Connected))
	p.metric("motion_levels_engine_floor_adapter_info", "Connected floor adapter protocol and build revision.", "gauge", 1, "protocol", boundedAdapterProtocol(adapter.Protocol), "revision", adapter.Revision)
	p.metric("motion_levels_engine_floor_adapter_actual_fps", "Physical presentation rate reported by the floor adapter.", "gauge", adapter.ActualFPS)
	p.metric("motion_levels_engine_floor_adapter_target_fps", "Physical presentation target reported by the floor adapter.", "gauge", adapter.TargetFPS)
	p.metric("motion_levels_engine_floor_adapter_desired_frame_age_seconds", "Age of the latest desired frame as observed by the floor adapter.", "gauge", nonNegativeSeconds(adapter.DesiredFrameAgeMillis))
	p.metric("motion_levels_engine_floor_adapter_presented_frames_total", "Frames presented by the floor adapter.", "counter", adapter.PresentedFrames)
	p.metric("motion_levels_engine_floor_adapter_udp_send_errors_total", "Physical UDP send errors reported by the floor adapter.", "counter", adapter.UDPErrorCount)
	p.metric("motion_levels_engine_floor_adapter_fade_ratio", "Safety fade reported in the latest observed floor frame.", "gauge", adapter.FadeRatio)
	p.metric("motion_levels_engine_floor_adapter_status_age_seconds", "Age of the latest floor adapter status message.", "gauge", unixNanosAge(now, adapter.LastStatusUnixNanos))
	p.metric("motion_levels_engine_floor_presented_frame_age_seconds", "Age of the latest actually presented floor snapshot.", "gauge", unixNanosAge(now, adapter.LastPresentedUnixNanos))
	pressureAge := float64(0)
	if status.LastPressureUnix > 0 {
		pressureAge = now.Sub(time.Unix(status.LastPressureUnix, 0)).Seconds()
		if pressureAge < 0 {
			pressureAge = 0
		}
	}
	p.metric("motion_levels_engine_last_pressure_age_seconds", "Age of the latest pressure input.", "gauge", pressureAge)
	p.metric("motion_levels_engine_frame_render_duration_seconds", "Latest, average, minimum and maximum game frame render duration.", "gauge", float64(perf.LastMicros)/1e6, "stat", "last", "runtime", perf.Runtime)
	p.sample("motion_levels_engine_frame_render_duration_seconds", perf.AverageMicros/1e6, "stat", "average", "runtime", perf.Runtime)
	p.sample("motion_levels_engine_frame_render_duration_seconds", float64(perf.MinMicros)/1e6, "stat", "min", "runtime", perf.Runtime)
	p.sample("motion_levels_engine_frame_render_duration_seconds", float64(perf.MaxMicros)/1e6, "stat", "max", "runtime", perf.Runtime)
	p.metric("motion_levels_engine_rendered_frames_total", "Frames rendered by the current game runtime process.", "counter", perf.Count, "runtime", perf.Runtime)

	lifecycles := []string{"idle", "launching", "waiting", "starting", "running", "paused", "finished", "stopping", "error"}
	p.family("motion_levels_game_state_lifecycle", "Canonical player-experience lifecycle as a one-hot gauge.", "gauge")
	for _, candidate := range lifecycles {
		p.sample("motion_levels_game_state_lifecycle", boolMetric(lifecycle == candidate), "lifecycle", candidate)
	}
	p.metric("motion_levels_game_state_revision", "Latest canonical player-experience revision observed by clients.", "gauge", stateRevision)
	updatedSeconds := int64(0)
	if !stateUpdated.IsZero() {
		updatedSeconds = stateUpdated.Unix()
	}
	p.metric("motion_levels_game_state_last_update_timestamp_seconds", "Unix timestamp of the latest canonical state snapshot.", "gauge", updatedSeconds)
	p.metric("motion_levels_game_state_paused", "Whether the canonical game state is paused.", "gauge", boolMetric(status.Paused))
	p.metric("motion_levels_game_state_elapsed_seconds", "Elapsed time in the active game state.", "gauge", float64(status.ElapsedMillis)/1000)
	p.metric("motion_levels_game_state_remaining_seconds", "Remaining time in the active game state.", "gauge", float64(display.RemainingMillis)/1000)
	p.metric("motion_levels_game_state_score", "Current canonical score.", "gauge", display.Score)
	p.metric("motion_levels_game_state_lives", "Current canonical lives value; -1 means the game has no lives mechanic.", "gauge", display.Lives)
	p.metric("motion_levels_game_state_menu_revision", "Latest venue-owned menu snapshot revision.", "gauge", menuVersion)
	menuAge := float64(0)
	if menuUpdatedMillis > 0 {
		menuAge = now.Sub(time.UnixMilli(menuUpdatedMillis)).Seconds()
		if menuAge < 0 {
			menuAge = 0
		}
	}
	p.metric("motion_levels_game_state_menu_age_seconds", "Age of the latest menu snapshot.", "gauge", menuAge)

	p.metric("motion_levels_display_client_seen", "Whether the player display has ever reported to the engine.", "gauge", boolMetric(displayClient.Seen))
	p.metric("motion_levels_display_client_healthy", "Whether the player display report is fresh, connected, ready and aligned.", "gauge", boolMetric(displayClient.Healthy))
	p.metric("motion_levels_display_client_age_seconds", "Age of the latest player display heartbeat.", "gauge", float64(displayClient.AgeMillis)/1000)
	p.metric("motion_levels_display_client_revision_matches", "Whether loaded and expected game revisions match.", "gauge", boolMetric(displayClient.RevisionMatches))
	p.metric("motion_levels_display_client_game_matches", "Whether the display and engine report the same current game.", "gauge", boolMetric(displayClient.MatchesCurrentGame))
	p.metric("motion_levels_display_client_feed_age_seconds", "Age of the latest player display state feed event.", "gauge", unixMillisAge(now, displayClient.LastFeedUnixMillis))
	p.metric("motion_levels_display_client_paint_age_seconds", "Age of the latest player display paint.", "gauge", unixMillisAge(now, displayClient.LastPaintUnixMillis))
	p.metric("motion_levels_display_client_viewport_width_pixels", "Reported player display viewport width.", "gauge", displayClient.ViewportWidth)
	p.metric("motion_levels_display_client_viewport_height_pixels", "Reported player display viewport height.", "gauge", displayClient.ViewportHeight)
	p.metric("motion_levels_display_client_device_pixel_ratio", "Reported player display device pixel ratio.", "gauge", displayClient.DevicePixelRatio)
	p.family("motion_levels_display_client_render_status", "Player display render status as a one-hot gauge.", "gauge")
	for _, candidate := range []string{"loading", "ready", "fallback", "error", "unknown"} {
		actual := displayClient.RenderStatus
		if actual == "" {
			actual = "unknown"
		}
		p.sample("motion_levels_display_client_render_status", boolMetric(actual == candidate), "status", candidate)
	}
	p.family("motion_levels_display_client_feed_transport", "Player display feed transport as a one-hot gauge.", "gauge")
	for _, candidate := range []string{"eventsource", "poll", "none"} {
		p.sample("motion_levels_display_client_feed_transport", boolMetric(displayClient.FeedTransport == candidate), "transport", candidate)
	}

	if runner, ok := status.GamesRunner.(motionlevelsgames.RunnerHealth); ok {
		telemetry := runner.Telemetry
		p.metric("motion_levels_typescript_runner_up", "Whether the active TypeScript runner is healthy.", "gauge", boolMetric(runner.Status == "ok"))
		p.metric("motion_levels_typescript_runner_info", "Active TypeScript runner build and product identity.", "gauge", 1, "game", runner.GameID, "revision", runner.SourceRevision)
		p.metric("motion_levels_typescript_runner_uptime_seconds", "TypeScript runner process uptime.", "gauge", float64(telemetry.UptimeMillis)/1000)
		p.metric("motion_levels_typescript_runner_requests_total", "Requests handled by the TypeScript runner.", "counter", telemetry.RequestsTotal)
		p.metric("motion_levels_typescript_runner_errors_total", "Failed TypeScript runner requests.", "counter", telemetry.ErrorsTotal)
		p.metric("motion_levels_typescript_runner_method_requests_total", "TypeScript runner requests by bounded method.", "counter", telemetry.InitTotal, "method", "init")
		p.sample("motion_levels_typescript_runner_method_requests_total", telemetry.InputTotal, "method", "input")
		p.sample("motion_levels_typescript_runner_method_requests_total", telemetry.ControlTotal, "method", "control")
		p.sample("motion_levels_typescript_runner_method_requests_total", telemetry.TickTotal, "method", "tick")
		p.sample("motion_levels_typescript_runner_method_requests_total", telemetry.StatusTotal, "method", "status")
		p.metric("motion_levels_typescript_runner_last_request_duration_seconds", "Duration of the latest TypeScript runner request.", "gauge", float64(telemetry.LastRequestDurationMicros)/1e6, "method", normalizeRunnerMethod(telemetry.LastMethod))
		p.metric("motion_levels_typescript_runner_memory_bytes", "TypeScript runner process memory.", "gauge", telemetry.RSSBytes, "kind", "rss")
		p.sample("motion_levels_typescript_runner_memory_bytes", telemetry.HeapUsedBytes, "kind", "heap_used")
	}

	if recorder, ok := status.Recorder.(sessionrecording.Stats); ok {
		p.metric("motion_levels_engine_recording_queue_depth", "Session records waiting to be written.", "gauge", recorder.QueueDepth)
		p.metric("motion_levels_engine_recording_written_records_total", "Session records written.", "counter", recorder.WrittenRecords)
		p.metric("motion_levels_engine_recording_dropped_records_total", "Session records dropped.", "counter", recorder.DroppedRecords)
		p.metric("motion_levels_engine_recording_error", "Whether session recording reports an error.", "gauge", boolMetric(recorder.Error != ""))
	}
	renderAPIMetrics(&p, game.apiMetrics.Snapshot())
	return p.b.String()
}

func renderAPIMetrics(p *enginePrometheusWriter, values map[apiMetricKey]apiMetricValue) {
	p.family("motion_levels_engine_http_requests_total", "Venue game engine API requests.", "counter")
	p.family("motion_levels_engine_http_request_duration_seconds", "Venue game engine API request duration.", "histogram")
	keys := make([]apiMetricKey, 0, len(values))
	for key := range values {
		keys = append(keys, key)
	}
	sort.Slice(keys, func(i, j int) bool {
		return fmt.Sprint(keys[i]) < fmt.Sprint(keys[j])
	})
	for _, key := range keys {
		value := values[key]
		labels := []string{"method", key.Method, "path", key.Path, "status", key.Status}
		p.sample("motion_levels_engine_http_requests_total", value.Count, labels...)
		for index, bucket := range httpDurationBuckets {
			p.sample("motion_levels_engine_http_request_duration_seconds_bucket", value.Buckets[index], append(labels, "le", strconv.FormatFloat(bucket, 'g', -1, 64))...)
		}
		p.sample("motion_levels_engine_http_request_duration_seconds_bucket", value.Count, append(labels, "le", "+Inf")...)
		p.sample("motion_levels_engine_http_request_duration_seconds_sum", value.Sum, labels...)
		p.sample("motion_levels_engine_http_request_duration_seconds_count", value.Count, labels...)
	}
}

func normalizeHTTPMethod(method string) string {
	switch method {
	case http.MethodGet, http.MethodHead, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions:
		return method
	default:
		return "OTHER"
	}
}

func normalizeAPIPath(path string) string {
	switch path {
	case "/api/health", "/api/status", "/api/player-state", "/api/performance", "/api/display", "/api/display-client",
		"/api/animation-preview", "/api/display/events", "/api/player-state/events", "/api/menu-state", "/api/menu-state/events",
		"/api/select", "/api/control", "/api/venue-session", "/api/menu-event":
		return path
	default:
		return "/api/other"
	}
}

func statusClass(status int) string {
	if status < 100 || status > 599 {
		return "unknown"
	}
	return strconv.Itoa(status/100) + "xx"
}

func normalizeRunnerMethod(method string) string {
	switch method {
	case "init", "input", "control", "tick", "status":
		return method
	default:
		return "invalid"
	}
}

func unixMillisAge(now time.Time, millis int64) float64 {
	if millis <= 0 {
		return 0
	}
	age := now.Sub(time.UnixMilli(millis)).Seconds()
	if age < 0 {
		return 0
	}
	return age
}

func unixNanosAge(now time.Time, nanos int64) float64 {
	if nanos <= 0 {
		return 0
	}
	age := now.Sub(time.Unix(0, nanos)).Seconds()
	if age < 0 {
		return 0
	}
	return age
}

func nonNegativeSeconds(millis int64) float64 {
	if millis <= 0 {
		return 0
	}
	return float64(millis) / 1000
}

func boundedAdapterProtocol(protocol string) string {
	switch protocol {
	case "v1", "v2":
		return protocol
	default:
		return "none"
	}
}

func boolMetric(value bool) int {
	if value {
		return 1
	}
	return 0
}
