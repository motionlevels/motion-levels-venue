HOST ?= root@motionlevels-1
LIMIT ?= motionlevels-1
RELEASE_DIR ?=

NATIVE_SERVICES = \
	motion-levels-floor-controller.service \
	motion-levels-venue-runtime.service \
	motion-levels-venue-supervisor.service \
	motion-levels-cameras.service \
	motion-levels-security-recorder.service \
	motion-levels-camera-helper.service \
	motion-levels-kiosk.service \
	motion-levels-hdmi-watchdog.service \
	caddy.service

.PHONY: install-ansible-collections ansible-ping show-pins build-native-release verify-native-release deploy-venues deploy-motionlevels-1 status-motionlevels-1 health-motionlevels-1 release-motionlevels-1 logs-motionlevels-1 restart-motionlevels-1 rollback-motionlevels-1

install-ansible-collections:
	ansible-galaxy collection install -r ansible/requirements.yml

ansible-ping:
	ansible motion_levels_venues --limit "$(LIMIT)" -m ping

show-pins:
	@jq '{schema, components}' deploy/motionlevels-pc/venue-components.lock.json

build-native-release:
	@scripts/build-native-release.sh

verify-native-release:
	@test -n "$(RELEASE_DIR)" || { echo "RELEASE_DIR is required" >&2; exit 64; }
	python3 scripts/verify-native-release.py "$(RELEASE_DIR)"

deploy-venues:
	ansible-playbook ansible/playbooks/venue.yml --limit "$(LIMIT)"

deploy-motionlevels-1:
	$(MAKE) deploy-venues LIMIT=motionlevels-1

status-motionlevels-1:
	ssh "$(HOST)" 'systemctl --no-pager --full status $(NATIVE_SERVICES)'

health-motionlevels-1:
	ssh "$(HOST)" 'set -eu; for url in http://127.0.0.1/controller/health http://127.0.0.1/engine/api/status http://127.0.0.1/venue-api/v1/snapshot http://127.0.0.1/menu/ http://127.0.0.1/display/ http://127.0.0.1:8040/readyz; do printf "%-58s" "$$url"; curl -fsS -o /dev/null "$$url"; echo ok; done; camera_id=$$(sed -n "s/^ML_CAMERAS_CAMERA_ID=//p" /etc/motion-levels-cameras.env | tail -1); expected=$$(sed -n "s/^ML_CAMERAS_USB_SERIAL=//p" /etc/motion-levels-cameras.env | tail -1); test -n "$$camera_id"; test -n "$$expected"; curl -fsS "http://127.0.0.1:8040/api/v1/cameras/$$camera_id/status" | jq -e --arg expected "$$expected" "{serial, usb_detected, command_ready} | select(.serial == \$$expected and .usb_detected == true and .command_ready == true)"'

release-motionlevels-1:
	ssh "$(HOST)" 'set -eu; root=/opt/motion-levels/venue; printf "current  %s\n" "$$(readlink -f "$$root/current")"; if [ -L "$$root/previous" ]; then printf "previous %s\n" "$$(readlink -f "$$root/previous")"; fi; python3 -m json.tool /etc/motion-levels/stack.json'

logs-motionlevels-1:
	ssh "$(HOST)" 'journalctl $(foreach service,$(NATIVE_SERVICES),-u $(service)) -n 300 --no-pager'

restart-motionlevels-1:
	ssh "$(HOST)" 'systemctl restart $(NATIVE_SERVICES)'

rollback-motionlevels-1:
	ssh "$(HOST)" 'set -eu; root=/opt/motion-levels/venue; current=$$(readlink -f "$$root/current"); previous=$$(readlink -f "$$root/previous"); case "$$current" in "$$root"/releases/*) ;; *) exit 65 ;; esac; case "$$previous" in "$$root"/releases/*) ;; *) exit 65 ;; esac; test -f "$$current/release-manifest.json"; test -f "$$previous/release-manifest.json"; test "$$current" != "$$previous"; ln -s "$$previous" "$$root/.current.rollback.$$$$"; mv -Tf "$$root/.current.rollback.$$$$" "$$root/current"; ln -s "$$current" "$$root/.previous.rollback.$$$$"; mv -Tf "$$root/.previous.rollback.$$$$" "$$root/previous"; systemctl daemon-reload; systemctl restart $(NATIVE_SERVICES)'
	$(MAKE) status-motionlevels-1
	$(MAKE) health-motionlevels-1
