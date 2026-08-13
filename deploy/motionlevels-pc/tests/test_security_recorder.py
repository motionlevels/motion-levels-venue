import contextlib
import importlib.util
import io
import os
import signal
import stat
import subprocess
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock


SCRIPT = Path(__file__).resolve().parents[1] / "motion-levels-security-recorder.py"


class SecurityRecorderCredentialBoundaryTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        root = Path(self.temporary.name)
        self.password = "reserved p@ss'word/with?chars"
        self.previous_environment = os.environ.copy()
        os.environ.update(
            {
                "MOTION_LEVELS_SECURITY_CAMERA_PASSWORD": self.password,
                "MOTION_LEVELS_SECURITY_RECORDER_INPUT_FILE": str(root / "input.ffconcat"),
                "MOTION_LEVELS_SECURITY_RECORDINGS_ROOT": str(root / "recordings"),
                "MOTION_LEVELS_PLATFORM_TOKEN": "test-platform-token",
            }
        )
        spec = importlib.util.spec_from_file_location("motion_levels_security_recorder_test", SCRIPT)
        assert spec and spec.loader
        self.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.module)

    def tearDown(self) -> None:
        os.environ.clear()
        os.environ.update(self.previous_environment)
        self.temporary.cleanup()

    def test_rtsp_secret_is_file_only_and_stderr_is_redacted(self) -> None:
        self.module.write_rtsp_input()
        input_path = self.module.RTSP_INPUT_PATH
        content = input_path.read_text(encoding="utf-8")
        encoded_password = self.module.parse.quote(self.password, safe="")

        self.assertEqual(stat.S_IMODE(input_path.stat().st_mode), 0o600)
        self.assertIn(encoded_password, content)
        self.assertIn("option rtsp_transport tcp", content)
        self.assertIn("option timeout 5000000", content)

        command = self.module.ffmpeg_command()
        rendered = " ".join(command)
        self.assertNotIn(self.password, rendered)
        self.assertNotIn(encoded_password, rendered)
        self.assertIn(str(input_path), command)

        error_line = f"failed {self.module.rtsp_url()} raw={self.password} encoded={encoded_password}\n"
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            self.module.log_ffmpeg_stderr(SimpleNamespace(stderr=[error_line]))
        logged = output.getvalue()
        self.assertNotIn(self.password, logged)
        self.assertNotIn(encoded_password, logged)
        self.assertNotIn(self.module.rtsp_url(), logged)
        self.assertIn("<redacted-password>", logged)

    def test_signal_stops_ffmpeg_and_prevents_new_upload_work(self) -> None:
        process = mock.Mock()
        process.poll.return_value = None
        self.module.ffmpeg_process = process

        with (
            mock.patch.object(self.module, "write_heartbeat") as heartbeat,
            mock.patch.object(self.module, "segment_candidates") as candidates,
        ):
            self.module.handle_signal(signal.SIGTERM, None)
            self.module.upload_pending(include_newest=True)

        self.assertTrue(self.module.stop_requested)
        self.assertTrue(self.module.stop_event.is_set())
        process.terminate.assert_called_once_with()
        candidates.assert_not_called()
        heartbeat.assert_called_once_with("stopping", f"signal={signal.SIGTERM}")

    def test_ffmpeg_shutdown_escalates_after_the_bounded_grace_period(self) -> None:
        process = mock.Mock()
        process.poll.return_value = None
        process.wait.side_effect = [
            subprocess.TimeoutExpired("ffmpeg", self.module.FFMPEG_STOP_TIMEOUT_SECONDS),
            0,
        ]
        self.module.ffmpeg_process = process

        self.module.stop_ffmpeg()

        process.terminate.assert_called_once_with()
        process.kill.assert_called_once_with()
        self.assertEqual(
            process.wait.call_args_list,
            [
                mock.call(timeout=self.module.FFMPEG_STOP_TIMEOUT_SECONDS),
                mock.call(timeout=2),
            ],
        )


if __name__ == "__main__":
    unittest.main()
