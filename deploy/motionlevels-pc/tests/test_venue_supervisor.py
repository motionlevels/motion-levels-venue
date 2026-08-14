import importlib.util
import hashlib
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


SCRIPT = Path(__file__).resolve().parents[1] / "motion-levels-venue-supervisor.py"
SPEC = importlib.util.spec_from_file_location("motion_levels_venue_supervisor_test", SCRIPT)
SUPERVISOR = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = SUPERVISOR
SPEC.loader.exec_module(SUPERVISOR)


class VenueSupervisorTests(unittest.TestCase):
    def test_display_connection_reports_disconnected_outputs(self):
        query = """Screen 0: minimum 8 x 8, current 1024 x 768, maximum 32767 x 32767
HDMI-1 disconnected primary (normal left inverted right x axis y axis)
DP-1 disconnected (normal left inverted right x axis y axis)
"""
        with mock.patch.object(
            SUPERVISOR.subprocess,
            "run",
            return_value=mock.Mock(returncode=0, stdout=query, stderr=""),
        ):
            status = SUPERVISOR.display_connection()

        self.assertTrue(status["available"])
        self.assertFalse(status["connected"])
        self.assertIsNone(status["activeMode"])

    def test_display_connection_reports_active_mode(self):
        query = """Screen 0: minimum 8 x 8, current 1920 x 1080, maximum 32767 x 32767
HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)
"""
        with mock.patch.object(
            SUPERVISOR.subprocess,
            "run",
            return_value=mock.Mock(returncode=0, stdout=query, stderr=""),
        ):
            status = SUPERVISOR.display_connection()

        self.assertTrue(status["connected"])
        self.assertEqual(status["activeMode"], "1920x1080")

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
            mock.patch.object(
                SUPERVISOR,
                "display_connection",
                return_value={"available": True, "connected": True, "activeMode": "1920x1080"},
            ),
            mock.patch.object(SUPERVISOR, "read_json_file", return_value={"revision": "abc1234"}),
        ):
            snapshot = SUPERVISOR.build_snapshot()

        self.assertEqual(snapshot["schema"], "motion-levels-venue-snapshot-v1")
        self.assertTrue(snapshot["ok"])
        self.assertEqual(snapshot["summary"]["game"], "motion-levels-games:lava")
        self.assertTrue(snapshot["summary"]["displayHealthy"])
        self.assertTrue(snapshot["summary"]["displayConnected"])
        self.assertTrue(snapshot["summary"]["cameraDetected"])
        self.assertEqual(snapshot["venue"]["release"]["revision"], "abc1234")

    def test_disconnected_display_is_visible_but_does_not_fail_the_venue(self):
        def fake_fetch(url, **_options):
            if url.endswith("/api/status"):
                return {"currentGame": "salvapantallas", "phase": "idle"}
            if url.endswith("/api/health"):
                return {"status": "ok", "displayClient": {"healthy": False, "fresh": False}}
            if url.endswith(":4101/health"):
                return {"ok": True}
            if url.endswith("/status"):
                return {"readyToRecord": True}
            raise AssertionError(url)

        with (
            mock.patch.object(SUPERVISOR, "fetch_json", side_effect=fake_fetch),
            mock.patch.object(SUPERVISOR, "service_states", return_value={"engine": "active"}),
            mock.patch.object(
                SUPERVISOR,
                "display_connection",
                return_value={"available": True, "connected": False, "activeMode": None},
            ),
        ):
            snapshot = SUPERVISOR.build_snapshot()

        self.assertTrue(snapshot["ok"])
        self.assertFalse(snapshot["summary"]["displayConnected"])
        self.assertFalse(snapshot["summary"]["displayHealthy"])

    def test_session_sync_failure_is_observable_but_never_gates_snapshot_health(self):
        sync_status = {
            "enabled": True,
            "configured": True,
            "lastAttemptAt": "2026-08-15T00:00:00Z",
            "lastSuccessAt": "2026-08-14T23:59:00Z",
            "pendingVisitCount": 2,
            "failure": {
                "active": True,
                "consecutiveAttempts": 3,
                "visitsInBackoff": 2,
                "backoffSeconds": 60,
                "retryAt": "2026-08-15T00:01:00Z",
                "nextVisitRetryAt": "2026-08-15T00:00:30Z",
            },
        }

        def fake_fetch(url, **_options):
            if url.endswith("/api/status"):
                return {"currentGame": "salvapantallas", "phase": "idle"}
            if url.endswith("/api/health"):
                return {"status": "ok", "displayClient": {"healthy": True}}
            if url.endswith(":4101/health"):
                return {"ok": True}
            if url.endswith("/status"):
                return {"readyToRecord": False}
            raise AssertionError(url)

        with (
            mock.patch.object(SUPERVISOR, "fetch_json", side_effect=fake_fetch),
            mock.patch.object(SUPERVISOR, "service_states", return_value={"engine": "active"}),
            mock.patch.object(
                SUPERVISOR,
                "display_connection",
                return_value={"available": True, "connected": True, "activeMode": "1920x1080"},
            ),
            mock.patch.object(SUPERVISOR, "session_sync_observability", return_value=sync_status),
        ):
            snapshot = SUPERVISOR.build_snapshot()

        self.assertTrue(snapshot["ok"])
        self.assertEqual(snapshot["sessionSync"], sync_status)
        self.assertNotIn("sessionSync", snapshot["summary"])

    def test_session_sync_observability_exposes_only_bounded_summary(self):
        initial = {
            "lastAttemptAt": "2026-08-15T00:00:00Z",
            "lastSuccessAt": None,
            "consecutiveFailures": 2,
            "backoffSeconds": 30,
            "retryAt": "2026-08-15T00:00:30Z",
            "pendingVisitCount": 4,
            "visitsInBackoff": 3,
            "nextVisitRetryAt": "2026-08-15T00:00:15Z",
            "rawError": "must-not-leak",
            "token": "must-not-leak",
            "path": "/must/not/leak",
        }
        with (
            mock.patch.dict(SUPERVISOR.SESSION_SYNC_OBSERVABILITY, initial, clear=True),
            mock.patch.object(SUPERVISOR, "PLATFORM_URL", "https://platform.example"),
            mock.patch.object(SUPERVISOR, "platform_token", return_value="secret-platform-token"),
            mock.patch.object(SUPERVISOR, "engine_token", return_value="secret-engine-token"),
        ):
            status = SUPERVISOR.session_sync_observability()

        self.assertTrue(status["configured"])
        self.assertEqual(status["pendingVisitCount"], 4)
        self.assertEqual(status["failure"]["consecutiveAttempts"], 2)
        rendered = repr(status)
        self.assertNotIn("must-not-leak", rendered)
        self.assertNotIn("secret-platform-token", rendered)
        self.assertNotIn("secret-engine-token", rendered)

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

    def test_canonical_event_reader_uses_after_sequence_and_snapshot_bound(self):
        visit_id = "22222222-2222-4222-8222-222222222222"
        response = {
            "schema": SUPERVISOR.SESSION_HISTORY_SCHEMA,
            "sessionId": visit_id,
            "events": [
                {"id": "event-8", "sequence": 8},
                {"id": "event-9", "sequence": 9},
            ],
        }
        with mock.patch.object(SUPERVISOR, "fetch_json", return_value=response) as fetch:
            events = SUPERVISOR.get_history_event_batch(
                visit_id,
                after_sequence=7,
                snapshot_last_sequence=9,
            )

        self.assertEqual([event["sequence"] for event in events], [8, 9])
        self.assertIn("afterSequence=7", fetch.call_args.args[0])
        self.assertIn("limit=2", fetch.call_args.args[0])
        self.assertNotIn("cursor=", fetch.call_args.args[0])

    def test_canonical_sync_posts_snapshot_then_each_bounded_event_batch(self):
        visit = self.visit_fixture(last_sequence=501)
        read_after = []

        def read_batch(_visit_id, *, after_sequence, snapshot_last_sequence):
            read_after.append((after_sequence, snapshot_last_sequence))
            end = min(snapshot_last_sequence, after_sequence + 250)
            return [
                {"id": f"event-{sequence}", "sequence": sequence}
                for sequence in range(after_sequence + 1, end + 1)
            ]

        def post(_visit, events):
            return {
                "ok": True,
                "lastStoredEventSequence": events[-1]["sequence"] if events else 0,
            }

        with (
            mock.patch.object(SUPERVISOR, "get_history_event_batch", side_effect=read_batch),
            mock.patch.object(SUPERVISOR, "post_canonical_visit", side_effect=post) as publish,
        ):
            high_water = SUPERVISOR.sync_visit_snapshot_events(visit)

        self.assertEqual(high_water, 501)
        self.assertEqual([len(call.args[1]) for call in publish.call_args_list], [0, 250, 250, 1])
        self.assertTrue(all(call.args[0] is visit for call in publish.call_args_list))
        self.assertEqual(read_after, [(0, 501), (250, 501), (500, 501)])

    def test_canonical_sync_resumes_from_server_high_water_after_mid_batch_failure(self):
        visit = self.visit_fixture(last_sequence=300)
        stored_sequence = 0
        fail_once = True
        read_after = []

        def read_batch(_visit_id, *, after_sequence, snapshot_last_sequence):
            read_after.append(after_sequence)
            end = min(snapshot_last_sequence, after_sequence + 250)
            return [
                {"id": f"event-{sequence}", "sequence": sequence}
                for sequence in range(after_sequence + 1, end + 1)
            ]

        def post(_visit, events):
            nonlocal stored_sequence, fail_once
            if not events:
                return {"ok": True, "lastStoredEventSequence": stored_sequence}
            if events[0]["sequence"] == 251 and fail_once:
                fail_once = False
                raise RuntimeError("platform unavailable mid-history")
            stored_sequence = max(stored_sequence, events[-1]["sequence"])
            return {"ok": True, "lastStoredEventSequence": stored_sequence}

        with (
            mock.patch.object(SUPERVISOR, "get_history_event_batch", side_effect=read_batch),
            mock.patch.object(SUPERVISOR, "post_canonical_visit", side_effect=post),
        ):
            with self.assertRaisesRegex(RuntimeError, "unavailable mid-history"):
                SUPERVISOR.sync_visit_snapshot_events(visit)
            self.assertEqual(SUPERVISOR.sync_visit_snapshot_events(visit), 300)

        self.assertEqual(stored_sequence, 300)
        self.assertEqual(read_after, [0, 250, 250])

    def test_canonical_sync_restart_needs_no_local_event_cursor(self):
        visit = self.visit_fixture(last_sequence=300)
        self.assertFalse(any("event" in key.lower() for key in SUPERVISOR.default_session_sync_state()))

        with (
            mock.patch.object(
                SUPERVISOR,
                "get_history_event_batch",
                return_value=[
                    {"id": f"event-{sequence}", "sequence": sequence}
                    for sequence in range(251, 301)
                ],
            ) as read_batch,
            mock.patch.object(
                SUPERVISOR,
                "post_canonical_visit",
                side_effect=[
                    {"ok": True, "lastStoredEventSequence": 250},
                    {"ok": True, "lastStoredEventSequence": 300},
                ],
            ),
        ):
            self.assertEqual(SUPERVISOR.sync_visit_snapshot_events(visit), 300)

        self.assertEqual(read_batch.call_args.kwargs["after_sequence"], 250)

    def test_canonical_sync_defers_events_newer_than_the_snapshot(self):
        visit = self.visit_fixture(last_sequence=2)
        post_bodies = []

        def post(_visit, events):
            post_bodies.append(events)
            return {
                "ok": True,
                "lastStoredEventSequence": events[-1]["sequence"] if events else 0,
            }

        with (
            mock.patch.object(SUPERVISOR, "get_history_visit", return_value=visit) as snapshot,
            mock.patch.object(
                SUPERVISOR,
                "get_history_event_batch",
                return_value=[
                    {"id": "event-1", "sequence": 1},
                    {"id": "event-2", "sequence": 2},
                ],
            ) as read_batch,
            mock.patch.object(SUPERVISOR, "post_canonical_visit", side_effect=post),
        ):
            SUPERVISOR.sync_history_visit(visit["id"])

        snapshot.assert_called_once_with(visit["id"])
        self.assertEqual(read_batch.call_args.kwargs["snapshot_last_sequence"], 2)
        self.assertEqual([event["sequence"] for body in post_bodies for event in body], [1, 2])

    def test_replay_init_uses_only_canonical_ids_and_maps_presentation_sequences(self):
        visit, recording = self.replay_fixture(status="pending_upload")
        payload = SUPERVISOR.replay_init_payload(visit, recording)

        self.assertEqual(payload["artifactKind"], "gameplay_replay")
        self.assertEqual(payload["visitId"], visit["id"])
        self.assertEqual(payload["selectionId"], recording["selectionId"])
        self.assertEqual(payload["runId"], recording["runId"])
        self.assertEqual(payload["assetId"], recording["id"])
        self.assertEqual(payload["artifactStatus"], "pending_upload")
        self.assertEqual(payload["metadata"], recording["metadata"])
        self.assertEqual(payload["metadata"]["partIndex"], 0)
        self.assertEqual(payload["metadata"]["runFrameOffset"], 0)
        self.assertTrue(payload["metadata"]["isFinalPart"])
        self.assertEqual(payload["metadata"]["partCount"], 1)
        self.assertEqual(payload["firstSequence"], "10")
        self.assertEqual(payload["lastSequence"], "19")
        self.assertNotIn("sessionId", payload)
        self.assertNotIn("venueSessionId", payload)

    def test_partial_run_replay_is_an_upload_candidate(self):
        _visit, recording = self.replay_fixture(status="partial")
        self.assertTrue(SUPERVISOR.replay_upload_candidate(recording))
        SUPERVISOR.replay_part_metadata(recording)

    def test_legacy_single_replay_is_read_only_not_an_upload_candidate(self):
        _visit, recording = self.replay_fixture(status="pending_upload")
        recording["id"] = f"run-replay-{recording['runId']}"
        recording["fileName"] = f"{recording['runId']}.mlrun.jsonl.gz"
        recording["localPath"] = f"replays/{recording['fileName']}"

        self.assertFalse(SUPERVISOR.replay_upload_candidate(recording))

    def test_multipart_assets_are_sorted_and_a_failed_part_does_not_block_later_parts(self):
        visit, part_two = self.replay_fixture(
            status="pending_upload",
            part_index=2,
            run_frame_offset=20_000,
            is_final=True,
        )
        _visit, part_zero = self.replay_fixture(
            status="pending_upload",
            part_index=0,
            run_frame_offset=0,
            is_final=False,
        )
        _visit, part_one = self.replay_fixture(
            status="pending_upload",
            part_index=1,
            run_frame_offset=10_000,
            is_final=False,
        )
        visit["recordings"] = [part_two, part_zero, part_one]

        def upload(_visit, recording):
            if recording["metadata"]["partIndex"] == 0:
                raise RuntimeError("part zero unavailable")
            return True

        with (
            mock.patch.object(SUPERVISOR, "get_history_visit", side_effect=[visit, visit]),
            mock.patch.object(SUPERVISOR, "sync_visit_snapshot_events", return_value=0),
            mock.patch.object(SUPERVISOR, "upload_replay_artifact", side_effect=upload) as uploader,
        ):
            with self.assertRaisesRegex(RuntimeError, "replay artifacts remain queued"):
                SUPERVISOR.sync_history_visit(visit["id"])

        self.assertEqual(
            [call.args[1]["metadata"]["partIndex"] for call in uploader.call_args_list],
            [0, 1, 2],
        )

    def test_replay_part_contract_recomputes_run_hash_and_rejects_invalid_metadata(self):
        _visit, recording = self.replay_fixture(status="pending_upload")
        recording["id"] = recording["id"].replace("-part-", "0-part-", 1)
        with self.assertRaisesRegex(ValueError, "does not match run id and partIndex"):
            SUPERVISOR.replay_part_metadata(recording)

        _visit, non_final = self.replay_fixture(
            status="pending_upload",
            part_index=0,
            is_final=False,
        )
        non_final["metadata"]["partCount"] = 1
        with self.assertRaisesRegex(ValueError, "non-final part declares partCount"):
            SUPERVISOR.replay_part_metadata(non_final)

    def test_replay_download_uses_exact_asset_url_and_recomputes_sha(self):
        visit, recording = self.replay_fixture(status="pending_upload")
        payload = b"bounded-multipart-replay"
        recording["byteSize"] = len(payload)
        recording["sha256"] = hashlib.sha256(payload).hexdigest()
        response = mock.MagicMock()
        response.headers = {"content-length": str(len(payload))}
        response.read.side_effect = [payload, b""]
        response.__enter__.return_value = response

        with tempfile.TemporaryDirectory() as directory:
            state_path = Path(directory) / "session-sync" / "state.json"
            temp_root = state_path.parent / "artifacts"
            with (
                mock.patch.object(SUPERVISOR, "SESSION_SYNC_STATE_PATH", state_path),
                mock.patch.object(SUPERVISOR, "SESSION_SYNC_TEMP_DIR", temp_root),
                mock.patch.object(SUPERVISOR, "engine_token", return_value="engine-token"),
                mock.patch.object(SUPERVISOR.request, "urlopen", return_value=response) as urlopen,
            ):
                downloaded = SUPERVISOR.download_replay_artifact(visit["id"], recording)
                self.assertEqual(downloaded.read_bytes(), payload)
                downloaded.unlink()

        requested = urlopen.call_args.args[0]
        self.assertEqual(
            requested.full_url,
            f"{SUPERVISOR.ENGINE_URL}/api/history/v1/sessions/{visit['id']}"
            f"/runs/{recording['runId']}/replay/{recording['id']}",
        )
        self.assertEqual(requested.headers["X-motion-levels-engine-token"], "engine-token")

        recording["sha256"] = "0" * 64
        second_response = mock.MagicMock()
        second_response.headers = {"content-length": str(len(payload))}
        second_response.read.side_effect = [payload, b""]
        second_response.__enter__.return_value = second_response
        with tempfile.TemporaryDirectory() as directory:
            state_path = Path(directory) / "session-sync" / "state.json"
            with (
                mock.patch.object(SUPERVISOR, "SESSION_SYNC_STATE_PATH", state_path),
                mock.patch.object(SUPERVISOR, "SESSION_SYNC_TEMP_DIR", state_path.parent / "artifacts"),
                mock.patch.object(SUPERVISOR, "engine_token", return_value="engine-token"),
                mock.patch.object(SUPERVISOR.request, "urlopen", return_value=second_response),
            ):
                with self.assertRaisesRegex(RuntimeError, "sha256 mismatch"):
                    SUPERVISOR.download_replay_artifact(visit["id"], recording)

    def test_replay_upload_marks_engine_complete_only_after_platform_completion(self):
        visit, recording = self.replay_fixture(status="pending_upload")
        payload = b"compressed-replay-payload"
        recording["byteSize"] = len(payload)
        recording["sha256"] = hashlib.sha256(payload).hexdigest()
        with tempfile.TemporaryDirectory() as directory:
            artifact = Path(directory) / recording["fileName"]
            artifact.write_bytes(payload)
            initialized = {
                "ok": True,
                "uploadId": "upload-1",
                "uploadUrl": "https://objects.example/replay",
                "bucket": "recordings",
                "objectKey": "controller/visit/run/replay.gz",
            }
            completed = {"ok": True, "recording": {"id": "upload-1"}}
            with (
                mock.patch.object(SUPERVISOR, "PLATFORM_URL", "https://platform.motionlevels.obis.dev"),
                mock.patch.object(SUPERVISOR, "download_replay_artifact", return_value=artifact),
                mock.patch.object(SUPERVISOR, "post_platform", side_effect=[initialized, completed]) as post,
                mock.patch.object(SUPERVISOR, "put_artifact") as put,
                mock.patch.object(
                    SUPERVISOR,
                    "update_engine_recording",
                    return_value={
                        "schema": SUPERVISOR.SESSION_HISTORY_SCHEMA,
                        "recording": {"id": recording["id"], "status": "complete"},
                    },
                ) as update,
            ):
                self.assertTrue(SUPERVISOR.upload_replay_artifact(visit, recording))

        self.assertEqual(post.call_args_list[0].args[0], "/api/recording-uploads/init")
        self.assertEqual(post.call_args_list[1].args[0], "/api/recording-uploads/complete")
        put.assert_called_once()
        uploaded_recording = update.call_args.args[1]
        self.assertEqual(uploaded_recording["status"], "complete")
        self.assertEqual(
            uploaded_recording["downloadUrl"],
            "https://platform.motionlevels.obis.dev/api/recording-objects/upload-1/download",
        )

    def test_already_complete_init_skips_put_but_verifies_completion(self):
        visit, recording = self.replay_fixture(status="partial")
        payload = b"partial-replay"
        recording["byteSize"] = len(payload)
        recording["sha256"] = hashlib.sha256(payload).hexdigest()
        with tempfile.TemporaryDirectory() as directory:
            artifact = Path(directory) / recording["fileName"]
            artifact.write_bytes(payload)
            with (
                mock.patch.object(SUPERVISOR, "download_replay_artifact", return_value=artifact),
                mock.patch.object(
                    SUPERVISOR,
                    "post_platform",
                    side_effect=[
                        {"ok": True, "uploadId": "upload-1", "alreadyComplete": True},
                        {"ok": True, "recording": {"id": "upload-1"}},
                    ],
                ) as post,
                mock.patch.object(SUPERVISOR, "put_artifact") as put,
                mock.patch.object(
                    SUPERVISOR,
                    "update_engine_recording",
                    return_value={
                        "schema": SUPERVISOR.SESSION_HISTORY_SCHEMA,
                        "recording": {"id": recording["id"], "status": "complete"},
                    },
                ),
            ):
                self.assertTrue(SUPERVISOR.upload_replay_artifact(visit, recording))

        put.assert_not_called()
        self.assertEqual(post.call_args_list[1].args[0], "/api/recording-uploads/complete")

    def test_failed_complete_is_retried_without_marking_engine(self):
        visit, recording = self.replay_fixture(status="pending_upload")
        payload = b"retryable-replay"
        recording["byteSize"] = len(payload)
        recording["sha256"] = hashlib.sha256(payload).hexdigest()
        with tempfile.TemporaryDirectory() as directory:
            first = Path(directory) / f"first-{recording['fileName']}"
            second = Path(directory) / f"second-{recording['fileName']}"
            first.write_bytes(payload)
            second.write_bytes(payload)
            init = {
                "ok": True,
                "uploadId": "stable-upload",
                "uploadUrl": "https://objects.example/replay",
            }
            with (
                mock.patch.object(SUPERVISOR, "download_replay_artifact", side_effect=[first, second]),
                mock.patch.object(
                    SUPERVISOR,
                    "post_platform",
                    side_effect=[init, RuntimeError("complete unavailable"), init, {"ok": True, "recording": {}}],
                ),
                mock.patch.object(SUPERVISOR, "put_artifact") as put,
                mock.patch.object(
                    SUPERVISOR,
                    "update_engine_recording",
                    return_value={
                        "schema": SUPERVISOR.SESSION_HISTORY_SCHEMA,
                        "recording": {"id": recording["id"], "status": "complete"},
                    },
                ) as update,
            ):
                with self.assertRaisesRegex(RuntimeError, "complete unavailable"):
                    SUPERVISOR.upload_replay_artifact(visit, recording)
                update.assert_not_called()
                self.assertTrue(SUPERVISOR.upload_replay_artifact(visit, recording))

        self.assertEqual(put.call_count, 2)
        update.assert_called_once()

    def test_put_artifact_streams_chunks_and_signed_sha_header(self):
        payload = b"a" * (2 * 1024 * 1024 + 17)
        response = mock.Mock(status=200)
        response.read.return_value = b""
        connection = mock.Mock()
        connection.getresponse.return_value = response
        with tempfile.TemporaryDirectory() as directory:
            artifact = Path(directory) / "replay.gz"
            artifact.write_bytes(payload)
            with (
                mock.patch.object(SUPERVISOR.http.client, "HTTPSConnection", return_value=connection),
                mock.patch.object(Path, "read_bytes", side_effect=AssertionError("must stream")) as read_bytes,
            ):
                SUPERVISOR.put_artifact(
                    "https://objects.example/replay?signature=abc",
                    artifact,
                    "application/vnd.motion-levels.run-replay+jsonl",
                    "a" * 64,
                )

        read_bytes.assert_not_called()
        headers = [call.args for call in connection.putheader.call_args_list]
        self.assertIn(("content-length", str(len(payload))), headers)
        self.assertIn(("x-amz-meta-sha256", "a" * 64), headers)
        self.assertEqual(b"".join(call.args[0] for call in connection.send.call_args_list), payload)
        self.assertGreater(len(connection.send.call_args_list), 1)

    def test_stale_replay_cleanup_is_age_and_directory_bounded(self):
        now = 100_000.0
        with tempfile.TemporaryDirectory() as directory:
            state_path = Path(directory) / "session-sync" / "state.json"
            temp_root = state_path.parent / "artifacts"
            temp_root.mkdir(parents=True)
            stale = temp_root / ".replay-upload-old.mlrun.jsonl.gz"
            recent = temp_root / ".replay-upload-active.mlrun.jsonl.gz"
            unrelated = temp_root / "operator-note.mlrun.jsonl.gz"
            outside = Path(directory) / "outside.mlrun.jsonl.gz"
            symlink = temp_root / ".replay-upload-link.mlrun.jsonl.gz"
            for path in (stale, recent, unrelated, outside):
                path.write_bytes(b"data")
            symlink.symlink_to(outside)
            os.utime(stale, (now - 7_200, now - 7_200))
            os.utime(recent, (now - 30, now - 30))
            os.utime(unrelated, (now - 7_200, now - 7_200))
            with (
                mock.patch.object(SUPERVISOR, "SESSION_SYNC_STATE_PATH", state_path),
                mock.patch.object(SUPERVISOR, "SESSION_SYNC_TEMP_DIR", temp_root),
                mock.patch.object(SUPERVISOR, "SESSION_SYNC_STALE_TEMP_SECONDS", 3_600),
            ):
                removed = SUPERVISOR.cleanup_stale_replay_temps(now)

            self.assertEqual(removed, 1)
            self.assertFalse(stale.exists())
            self.assertTrue(recent.exists())
            self.assertTrue(unrelated.exists())
            self.assertTrue(symlink.is_symlink())
            self.assertTrue(outside.exists())

    def test_replay_temp_directory_cannot_escape_sync_state(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            with (
                mock.patch.object(SUPERVISOR, "SESSION_SYNC_STATE_PATH", root / "sync" / "state.json"),
                mock.patch.object(SUPERVISOR, "SESSION_SYNC_TEMP_DIR", root / "outside"),
            ):
                with self.assertRaisesRegex(ValueError, "must be below"):
                    SUPERVISOR.session_sync_temp_dir()

    def test_canonical_active_poll_follows_session_pages(self):
        sync = SUPERVISOR.CanonicalSessionSync()
        sync.state = SUPERVISOR.default_session_sync_state()
        sync.state["endedSweepAfterUnixMillis"] = 9_999_999_999_999
        active_first = {
            "schema": SUPERVISOR.SESSION_HISTORY_SCHEMA,
            "sessions": [{"id": "visit-active-1"}],
            "nextCursor": "active-next",
        }
        active_second = {
            "schema": SUPERVISOR.SESSION_HISTORY_SCHEMA,
            "sessions": [{"id": "visit-active-2"}],
            "nextCursor": None,
        }
        ended = {"schema": SUPERVISOR.SESSION_HISTORY_SCHEMA, "sessions": [], "nextCursor": None}

        def pages(*, status, limit, cursor=None):
            if status == "ended":
                return ended
            return active_second if cursor else active_first

        with (
            mock.patch.object(SUPERVISOR, "PLATFORM_URL", "https://platform.motionlevels.obis.dev"),
            mock.patch.object(SUPERVISOR, "platform_token", return_value="platform-token"),
            mock.patch.object(SUPERVISOR, "engine_token", return_value="engine-token"),
            mock.patch.object(SUPERVISOR, "list_history_sessions", side_effect=pages),
            mock.patch.object(
                SUPERVISOR,
                "sync_history_visit",
                return_value={"updatedAtUnixMillis": 1, "lastSequence": 1, "needsArtifactRetry": False},
            ) as visit,
            mock.patch.object(SUPERVISOR, "save_session_sync_state"),
        ):
            sync.once()

        self.assertEqual([call.args[0] for call in visit.call_args_list], ["visit-active-1", "visit-active-2"])

    @staticmethod
    def visit_fixture(*, last_sequence=0):
        return {
            "schema": SUPERVISOR.SESSION_HISTORY_SCHEMA,
            "id": "22222222-2222-4222-8222-222222222222",
            "controllerId": "33333333-3333-4333-8333-333333333333",
            "lastSequence": last_sequence,
            "updatedAtUnixMillis": 2_000,
            "recordings": [],
        }

    @classmethod
    def replay_fixture(
        cls,
        *,
        status,
        part_index=0,
        run_frame_offset=0,
        is_final=True,
    ):
        run_id = "55555555-5555-4555-8555-555555555555"
        run_digest = hashlib.sha256(run_id.encode("utf-8")).hexdigest()
        asset_id = f"run-replay-{run_digest}-part-{part_index:06d}"
        visit = cls.visit_fixture()
        recording = {
            "id": asset_id,
            "scope": "run",
            "status": status,
            "selectionId": "44444444-4444-4444-8444-444444444444",
            "runId": run_id,
            "linkedRunIds": [run_id],
            "backend": "venue-runtime-replay",
            "localPath": f"replays/{asset_id}.mlrun.jsonl.gz",
            "fileName": f"{asset_id}.mlrun.jsonl.gz",
            "contentType": "application/vnd.motion-levels.run-replay+jsonl",
            "byteSize": 123,
            "sha256": "a" * 64,
            "startedAtUnixMillis": 1_000,
            "endedAtUnixMillis": 2_000,
            "metadata": {
                "schema": "motion-levels-run-replay-v1",
                "contractVersion": 1,
                "compression": "gzip",
                "partIndex": part_index,
                "runFrameOffset": run_frame_offset,
                "isFinalPart": is_final,
                "partial": status == "partial",
                "frameCount": 10,
                "firstPresentationSequence": 10,
                "lastPresentationSequence": 19,
            },
        }
        if is_final:
            recording["metadata"]["partCount"] = part_index + 1
        return visit, recording


if __name__ == "__main__":
    unittest.main()
