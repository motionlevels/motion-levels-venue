import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
KIOSK = (ROOT / "motion-levels-player-kiosk").read_text(encoding="utf-8")
KIOSK_SERVICE = (ROOT / "motion-levels-kiosk.service").read_text(encoding="utf-8")
WATCHDOG_SERVICE = (ROOT / "motion-levels-hdmi-watchdog.service").read_text(encoding="utf-8")
ENV_TEMPLATE = (ROOT.parents[1] / "ansible" / "templates" / "motion-levels.env.j2").read_text(encoding="utf-8")


class PlayerKioskAudioTests(unittest.TestCase):
    def test_runtime_audio_capability_follows_inventory(self):
        self.assertIn("MOTION_LEVELS_AUDIO_ENABLED={{ '1' if motion_levels_display.audio_enabled else '0' }}", ENV_TEMPLATE)

    def test_chromium_uses_the_configured_hdmi_pcm(self):
        self.assertIn('MOTION_LEVELS_HDMI_ALSA_DEVICE="$(env_file_value MOTION_LEVELS_HDMI_ALSA_DEVICE)"', KIOSK)
        self.assertIn('resolve_live_hdmi_alsa_device() {', KIOSK)
        self.assertIn('resolved_alsa_device="$(resolve_hdmi_alsa_device_with_fallback "${screen_output}")"', KIOSK)
        self.assertIn('chrome_flags+=( "--alsa-output-device=${resolved_alsa_device}" )', KIOSK)
        self.assertNotIn('chrome_flags+=( "--alsa-output-device=${MOTION_LEVELS_HDMI_ALSA_DEVICE}" )', KIOSK)
        self.assertLess(
            KIOSK.index('enable_hdmi_audio_output "${screen_output}"'),
            KIOSK.index('resolved_alsa_device="$(resolve_hdmi_alsa_device_with_fallback "${screen_output}")"'),
        )
        self.assertIn('--autoplay-policy=no-user-gesture-required', KIOSK)

    def test_kiosk_runtime_directory_does_not_depend_on_a_login_session(self):
        self.assertIn("RuntimeDirectory=motion-levels-kiosk", KIOSK_SERVICE)
        self.assertIn("RuntimeDirectoryPreserve=restart", KIOSK_SERVICE)
        self.assertIn("Environment=XDG_RUNTIME_DIR=/run/motion-levels-kiosk", KIOSK_SERVICE)
        self.assertIn("Environment=XDG_RUNTIME_DIR=/run/motion-levels-kiosk", WATCHDOG_SERVICE)
        self.assertNotIn("/run/user/0", KIOSK_SERVICE)
        self.assertNotIn("/run/user/0", WATCHDOG_SERVICE)

    def test_chromium_keeps_the_kiosk_renderer_active(self):
        self.assertIn("--disable-background-timer-throttling", KIOSK)
        self.assertIn("--disable-backgrounding-occluded-windows", KIOSK)
        self.assertIn("--disable-renderer-backgrounding", KIOSK)


if __name__ == "__main__":
    unittest.main()
