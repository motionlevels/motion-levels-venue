import contextlib
import importlib.util
import io
import os
import stat
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace


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


if __name__ == "__main__":
    unittest.main()
