import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
KIOSK = (ROOT / "motion-levels-player-kiosk").read_text(encoding="utf-8")
ENV_TEMPLATE = (ROOT.parents[1] / "ansible" / "templates" / "motion-levels.env.j2").read_text(encoding="utf-8")


class PlayerKioskAudioTests(unittest.TestCase):
    def test_runtime_audio_capability_follows_inventory(self):
        self.assertIn("MOTION_LEVELS_AUDIO_ENABLED={{ '1' if motion_levels_display.audio_enabled else '0' }}", ENV_TEMPLATE)

    def test_chromium_uses_the_configured_hdmi_pcm(self):
        self.assertIn('MOTION_LEVELS_HDMI_ALSA_DEVICE="$(env_file_value MOTION_LEVELS_HDMI_ALSA_DEVICE)"', KIOSK)
        self.assertIn('chrome_flags+=( "--alsa-output-device=${MOTION_LEVELS_HDMI_ALSA_DEVICE}" )', KIOSK)
        self.assertIn('--autoplay-policy=no-user-gesture-required', KIOSK)


if __name__ == "__main__":
    unittest.main()
