ARG NODE_IMAGE=node:24-bookworm-slim

FROM ${NODE_IMAGE} AS frontends
WORKDIR /workspace
COPY packages ./packages
COPY apps/player-menu ./apps/player-menu
COPY apps/player-display ./apps/player-display
RUN npm ci --prefix packages/floor-view \
    && npm ci --prefix apps/player-menu \
    && npm ci --prefix apps/player-display \
    && npm test --prefix apps/player-menu \
    && npm run build --prefix apps/player-menu \
    && npm run build --prefix apps/player-display

FROM ${NODE_IMAGE} AS player-menu-assets
WORKDIR /workspace
COPY game-bundles/motion-levels-games ./game-bundles/motion-levels-games
COPY scripts/install-player-menu-from-games-bundle.mjs ./scripts/install-player-menu-from-games-bundle.mjs
COPY --from=frontends /workspace/apps/player-menu/dist ./fallback
RUN node ./scripts/install-player-menu-from-games-bundle.mjs \
    --vendor-root ./game-bundles/motion-levels-games \
    --fallback-root ./fallback \
    --output-root ./player-menu

FROM ${NODE_IMAGE} AS games-bundle
WORKDIR /workspace
COPY game-bundles/motion-levels-games ./vendor
RUN node -e 'const fs=require("node:fs"); const pin=JSON.parse(fs.readFileSync("./vendor/pin.json")); fs.cpSync(`./vendor/${pin.bundlePath}`, "./bundle", {recursive:true})'

FROM ${NODE_IMAGE} AS runtime
ARG BUILD_REVISION=unknown
ARG BUILD_CREATED_AT=
LABEL org.opencontainers.image.source="https://github.com/motionlevels/motion-levels-venue"
LABEL org.opencontainers.image.revision="${BUILD_REVISION}"
LABEL org.opencontainers.image.created="${BUILD_CREATED_AT}"
RUN mkdir -p /release/bin \
    && cp /usr/local/bin/node /release/bin/node
COPY --from=player-menu-assets /workspace/player-menu /release/apps/player-menu/dist
COPY --from=frontends /workspace/apps/player-display/dist /release/apps/player-display/dist
COPY game-bundles /release/game-bundles
COPY deploy/motionlevels-pc /release/deploy/motionlevels-pc
CMD ["sleep", "infinity"]

FROM ${NODE_IMAGE} AS engine-runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 10001 motionlevels \
    && useradd --uid 10001 --gid 10001 --no-create-home --home-dir /nonexistent motionlevels
ARG BUILD_REVISION=unknown
ARG BUILD_CREATED_AT=
LABEL org.opencontainers.image.source="https://github.com/motionlevels/motion-levels-venue"
LABEL org.opencontainers.image.revision="${BUILD_REVISION}"
LABEL org.opencontainers.image.created="${BUILD_CREATED_AT}"
COPY --from=games-bundle /workspace/bundle /app/games
COPY deploy/motionlevels-pc/venue-game-engine /usr/local/bin/venue-game-engine
RUN /bin/sh -n /usr/local/bin/venue-game-engine \
    && find /app/games -type d -exec chmod a+rx {} + \
    && find /app/games -type f -exec chmod a+r {} +
USER 10001:10001
ENTRYPOINT ["/usr/local/bin/venue-game-engine"]

FROM debian:bookworm-slim AS camera-helper-runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    python3 \
    python3-opencv \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 10002 motionlevels-camera \
    && useradd --uid 10002 --gid 10002 --no-create-home --home-dir /nonexistent motionlevels-camera
ARG BUILD_REVISION=unknown
ARG BUILD_CREATED_AT=
LABEL org.opencontainers.image.source="https://github.com/motionlevels/motion-levels-venue"
LABEL org.opencontainers.image.revision="${BUILD_REVISION}"
LABEL org.opencontainers.image.created="${BUILD_CREATED_AT}"
COPY deploy/motionlevels-pc/motion-levels-camera-helper.py /app/motion-levels-camera-helper.py
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
RUN python3 -m py_compile /app/motion-levels-camera-helper.py
USER 10002:10002
ENTRYPOINT ["/usr/bin/python3", "/app/motion-levels-camera-helper.py"]

FROM debian:bookworm-slim AS security-recorder-runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    ffmpeg \
    python3 \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 10002 motionlevels-camera \
    && useradd --uid 10002 --gid 10002 --no-create-home --home-dir /nonexistent motionlevels-camera
ARG BUILD_REVISION=unknown
ARG BUILD_CREATED_AT=
LABEL org.opencontainers.image.source="https://github.com/motionlevels/motion-levels-venue"
LABEL org.opencontainers.image.revision="${BUILD_REVISION}"
LABEL org.opencontainers.image.created="${BUILD_CREATED_AT}"
COPY deploy/motionlevels-pc/motion-levels-security-recorder.py /app/motion-levels-security-recorder.py
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
RUN python3 -m py_compile /app/motion-levels-security-recorder.py
USER 10002:10002
ENTRYPOINT ["/usr/bin/python3", "/app/motion-levels-security-recorder.py"]

FROM caddy:2-alpine AS caddy-runtime
RUN apk add --no-cache curl \
    && setcap -r /usr/bin/caddy \
    && addgroup -g 10003 motionlevels-web \
    && adduser -D -H -u 10003 -G motionlevels-web motionlevels-web
ARG BUILD_REVISION=unknown
ARG BUILD_CREATED_AT=
LABEL org.opencontainers.image.source="https://github.com/motionlevels/motion-levels-venue"
LABEL org.opencontainers.image.revision="${BUILD_REVISION}"
LABEL org.opencontainers.image.created="${BUILD_CREATED_AT}"
COPY deploy/motionlevels-pc/Caddyfile.container /etc/caddy/Caddyfile
COPY deploy/motionlevels-pc/venue-caddy /usr/local/bin/venue-caddy
COPY --from=player-menu-assets /workspace/player-menu /srv/player-menu
COPY --from=frontends /workspace/apps/player-display/dist /srv/player-display
COPY game-bundles/motion-levels-games /srv/games
COPY deploy/motionlevels-pc/cameras.html /srv/venue/cameras.html
COPY deploy/motionlevels-pc/venue.html /srv/venue/venue.html
RUN /bin/sh -n /usr/local/bin/venue-caddy \
    && caddy validate --config /etc/caddy/Caddyfile
USER 10003:10003
ENTRYPOINT ["/usr/local/bin/venue-caddy"]

FROM debian:trixie-slim AS player-runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    chromium \
    curl \
    fonts-noto-color-emoji \
    libegl1 \
    libgl1-mesa-dri \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 10003 motionlevels-display \
    && useradd --uid 10003 --gid 10003 --no-create-home --home-dir /var/lib/motion-levels/player-profile motionlevels-display
ARG BUILD_REVISION=unknown
ARG BUILD_CREATED_AT=
LABEL org.opencontainers.image.source="https://github.com/motionlevels/motion-levels-venue"
LABEL org.opencontainers.image.revision="${BUILD_REVISION}"
LABEL org.opencontainers.image.created="${BUILD_CREATED_AT}"
COPY deploy/motionlevels-pc/motion-levels-player-container /usr/local/bin/motion-levels-player-container
RUN /bin/sh -n /usr/local/bin/motion-levels-player-container
USER 10003:10003
ENTRYPOINT ["/usr/local/bin/motion-levels-player-container"]
