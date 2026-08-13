import importlib.util
import sys
import unittest
from pathlib import Path
from unittest import mock


SCRIPT = Path(__file__).resolve().parents[1] / "motion-levels-venue-supervisor.py"
SPEC = importlib.util.spec_from_file_location("motion_levels_venue_supervisor_test", SCRIPT)
SUPERVISOR = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = SUPERVISOR
SPEC.loader.exec_module(SUPERVISOR)


class VenueSupervisorTests(unittest.TestCase):
    def test_snapshot_composes_runtime_hardware_and_release_state(self):
        def fake_fetch(url, **_options):
            if url.endswith("/api/status"):
                return {"currentGame": "motion-levels-games:lava", "phase": "running"}
            if url.endswith("/api/health"):
                return {"status": "ok", "displayClient": {"healthy": True}}
            if url.endswith(":4101/health"):
                return {"ok": True}
            if url.endswith("/status"):
                return {"readyToRecord": True, "backend": "gopro"}
            raise AssertionError(url)

        with (
            mock.patch.object(SUPERVISOR, "fetch_json", side_effect=fake_fetch),
            mock.patch.object(SUPERVISOR, "service_states", return_value={"engine": "active"}),
            mock.patch.object(SUPERVISOR, "read_json_file", return_value={"revision": "abc1234"}),
        ):
            snapshot = SUPERVISOR.build_snapshot()

        self.assertEqual(snapshot["schema"], "motion-levels-venue-snapshot-v1")
        self.assertTrue(snapshot["ok"])
        self.assertEqual(snapshot["summary"]["game"], "motion-levels-games:lava")
        self.assertTrue(snapshot["summary"]["displayHealthy"])
        self.assertTrue(snapshot["summary"]["cameraDetected"])
        self.assertEqual(snapshot["venue"]["release"]["revision"], "abc1234")

    def test_quick_record_clamps_duration_and_identifies_venue_ui(self):
        with mock.patch.object(SUPERVISOR, "fetch_json", return_value={"ok": True}) as fetch:
            result = SUPERVISOR.quick_record({"durationSeconds": 999})

        self.assertTrue(result["ok"])
        payload = fetch.call_args.kwargs["payload"]
        self.assertEqual(payload["durationSeconds"], 60)
        self.assertEqual(payload["source"], "venue-operator-ui")
        self.assertTrue(payload["captureId"].startswith("venue-check-"))

    def test_platform_heartbeat_publishes_and_closes_game_and_venue_sessions(self):
        first = {
            "sessionId": "11111111-1111-4111-8111-111111111111",
            "venueSessionId": "22222222-2222-4222-8222-222222222222",
            "currentGame": "motion-levels-games:lava",
            "phase": "running",
            "players": [],
        }
        heartbeat = SUPERVISOR.PlatformHeartbeat()
        with (
            mock.patch.object(SUPERVISOR, "fetch_json", side_effect=[first, {"currentGame": "salvapantallas"}]),
            mock.patch.object(SUPERVISOR, "post_platform", return_value={"ok": True}) as post,
            mock.patch.object(SUPERVISOR, "read_secret", return_value="33333333-3333-4333-8333-333333333333"),
        ):
            heartbeat.once()
            heartbeat.once()

        paths = [call.args[0] for call in post.call_args_list]
        self.assertEqual(paths.count("/api/ingest/session"), 2)
        self.assertEqual(paths.count("/api/ingest/venue-session"), 2)
        self.assertEqual(post.call_args_list[2].args[1]["status"], "ended")
        self.assertEqual(post.call_args_list[3].args[1]["status"], "ended")


if __name__ == "__main__":
    unittest.main()
