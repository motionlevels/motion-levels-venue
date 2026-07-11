package motionlevelsgames

import (
	"slices"
	"testing"
)

func TestRunnerEnvironmentDropsParentSecrets(t *testing.T) {
	environment := runnerEnvironment([]string{
		"PATH=/usr/bin",
		"NORMAL_SETTING=visible",
		"MOTION_LEVELS_PLATFORM_TOKEN=secret",
		"MOTION_LEVELS_CAMERA_RECORDER_TOKEN=secret",
		"DATABASE_PASSWORD=secret",
		"GOOGLE_PRIVATE_KEY=secret",
		"SERVICE_CREDENTIAL_JSON=secret",
	})
	if !slices.Contains(environment, "PATH=/usr/bin") || !slices.Contains(environment, "NORMAL_SETTING=visible") {
		t.Fatalf("runner environment lost non-secret values: %v", environment)
	}
	if len(environment) != 2 {
		t.Fatalf("runner environment retained a secret: %v", environment)
	}
}
