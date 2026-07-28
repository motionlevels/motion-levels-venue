HOST ?= root@motionlevels-1
LIMIT ?= motionlevels-1
DEPLOY_MODE ?= all
STANDARD_VENUES ?= motionlevels-1
# Local checkout of motionlevels/motion-levels-platform, used by sync-platform-seeds.
PLATFORM_DIR ?= ../motion-levels

.PHONY: motion-go-seeds check-platform-mirrors sync-platform-mirrors sync-platform-seeds install-ansible-collections ansible-ping deploy-venues deploy-standard-venues deploy-motionlevels-1 deploy-motionlevels-cloud-1 deploy-frontends-motionlevels-cloud-1 deploy-runtime-motionlevels-cloud-1 status-motionlevels-1 logs-motionlevels-1 restart-motionlevels-1 rollback-motionlevels-1

# Regenerate the motion-go seeds from the native engine games
# (game-engine/internal/games/authored/nativegames). The engine copy is the
# source of truth; game-engine/internal/games/authored/seedgen tests fail when
# a seed is stale.
motion-go-seeds:
	go run ./game-engine/cmd/motion-go-seeds

# Verify every platform-side mirror without modifying either checkout.
check-platform-mirrors:
	go run ./game-engine/cmd/motion-go-seeds -check
	scripts/sync-platform-mirrors.sh --check --platform-dir "$(PLATFORM_DIR)"

# Synchronize shared packages, the Go module, audio, and generated seeds into
# the platform checkout. Review and commit that checkout separately.
sync-platform-mirrors: motion-go-seeds
	scripts/sync-platform-mirrors.sh --sync --platform-dir "$(PLATFORM_DIR)"

# Copy only generated seeds into a motion-levels-platform checkout. Run after
# motion-go-seeds whenever an authored game changed, then commit both repos.
sync-platform-seeds: motion-go-seeds
	scripts/sync-platform-mirrors.sh --sync --scope seeds --platform-dir "$(PLATFORM_DIR)"

install-ansible-collections:
	ansible-galaxy collection install -r ansible/requirements.yml

ansible-ping:
	ansible motion_levels_venues --limit "$(LIMIT)" -m ping

deploy-venues:
	GHCR_TOKEN="$${GHCR_TOKEN:-$$(gh auth token)}" GHCR_USERNAME="$${GHCR_USERNAME:-lobis}" ansible-playbook ansible/playbooks/venue-containers.yml --limit "$(LIMIT)"

deploy-standard-venues:
	@set -eu; \
	ghcr_token="$${GHCR_TOKEN:-$$(gh auth token)}"; \
	ghcr_username="$${GHCR_USERNAME:-lobis}"; \
	deployed=""; \
	failed=""; \
	for venue in $(STANDARD_VENUES); do \
		printf '==> Checking %s\n' "$$venue"; \
		if ansible motion_levels_venues --limit "$$venue" -m ping >/tmp/motion-levels-$$venue-ping.log 2>&1; then \
			printf '==> %s reachable\n' "$$venue"; \
			printf '==> Deploying %s\n' "$$venue"; \
			segment="$${MOTION_LEVELS_CAMERA_RECORDER_SEGMENT_SECONDS:-}"; \
			if [ -z "$$segment" ] && [ -n "$${MOTION_LEVELS_DEPLOYMENT_POLICY_BASE_URL:-}" ]; then \
				policy_url="$${MOTION_LEVELS_DEPLOYMENT_POLICY_BASE_URL%/}/api/rooms/$$venue/deployment-policy"; \
				segment="$$(curl -fsS --max-time 10 "$$policy_url" | python3 -c 'import json, sys; payload = json.load(sys.stdin); value = payload.get("cameraRecordingSegmentSeconds"); print(value if isinstance(value, int) else "")' || true)"; \
			fi; \
			segment="$${segment:-300}"; \
			printf '==> %s camera video segment: %ss\n' "$$venue" "$$segment"; \
			if GHCR_TOKEN="$$ghcr_token" GHCR_USERNAME="$$ghcr_username" MOTION_LEVELS_CAMERA_RECORDER_SEGMENT_SECONDS="$$segment" ansible-playbook ansible/playbooks/venue-containers.yml --limit "$$venue"; then \
				deployed="$${deployed:+$$deployed,}$$venue"; \
			else \
				printf '==> %s deploy failed; continuing\n' "$$venue"; \
				failed="$${failed:+$$failed,}$$venue"; \
			fi; \
		else \
			printf '==> %s unavailable; skipping\n' "$$venue"; \
			sed 's/^/    /' "/tmp/motion-levels-$$venue-ping.log"; \
		fi; \
	done; \
	if [ -n "$$deployed" ]; then \
		echo "==> Deployed standard venues: $$deployed"; \
		if [ -n "$$failed" ]; then \
			echo "==> Some standard venues failed: $$failed"; \
		fi; \
		exit 0; \
	fi; \
	if [ -n "$$failed" ]; then \
		echo "==> No standard venues deployed; failed: $$failed"; \
		exit 1; \
	fi; \
	echo "==> No standard venues reachable; venue deploy skipped."

deploy-motionlevels-1:
	GHCR_TOKEN="$${GHCR_TOKEN:-$$(gh auth token)}" GHCR_USERNAME="$${GHCR_USERNAME:-lobis}" ansible-playbook ansible/playbooks/venue-containers.yml --limit motionlevels-1

deploy-motionlevels-cloud-1:
	GHCR_TOKEN="$${GHCR_TOKEN:-$$(gh auth token)}" GHCR_USERNAME="$${GHCR_USERNAME:-lobis}" MOTION_LEVELS_DEPLOY_MODE="$(DEPLOY_MODE)" ansible-playbook ansible/playbooks/venue.yml --limit motionlevels-cloud-1

deploy-frontends-motionlevels-cloud-1:
	$(MAKE) deploy-motionlevels-cloud-1 DEPLOY_MODE=frontends

deploy-runtime-motionlevels-cloud-1:
	$(MAKE) deploy-motionlevels-cloud-1 DEPLOY_MODE=runtime

status-motionlevels-1:
	ssh "$(HOST)" '/usr/local/sbin/motion-levels-venue-containers status'

logs-motionlevels-1:
	ssh "$(HOST)" '/usr/local/sbin/motion-levels-venue-containers logs'

restart-motionlevels-1:
	ssh "$(HOST)" '/usr/local/sbin/motion-levels-venue-containers restart'

rollback-motionlevels-1:
	ssh "$(HOST)" '/usr/local/sbin/motion-levels-venue-containers rollback'
