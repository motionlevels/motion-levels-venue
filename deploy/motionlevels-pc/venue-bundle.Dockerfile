ARG NODE_IMAGE=node:24-bookworm-slim
ARG GO_IMAGE=golang:1.24-bookworm

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

FROM ${GO_IMAGE} AS runtime-build
RUN apt-get update && apt-get install -y --no-install-recommends \
    libasound2-dev \
    libudev-dev \
    libusb-1.0-0-dev \
    nodejs \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /workspace
COPY go.mod go.sum ./
RUN go mod download
COPY game-engine ./game-engine
COPY floor-controller ./floor-controller
COPY packages ./packages
COPY game-bundles ./game-bundles
COPY content ./content
RUN go test ./game-engine/cmd/game-engine ./floor-controller/cmd/floor-controller \
    && mkdir -p /release/bin \
    && go build -trimpath -ldflags="-s -w" -o /release/bin/game-engine ./game-engine/cmd/game-engine \
    && go build -trimpath -ldflags="-s -w" -o /release/bin/floor-controller ./floor-controller/cmd/floor-controller

FROM debian:bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libasound2 \
    libudev1 \
    libusb-1.0-0 \
    zstd \
    && rm -rf /var/lib/apt/lists/*
ARG BUILD_REVISION=unknown
ARG BUILD_CREATED_AT=
LABEL org.opencontainers.image.source="https://github.com/motionlevels/motion-levels-platform"
LABEL org.opencontainers.image.revision="${BUILD_REVISION}"
LABEL org.opencontainers.image.created="${BUILD_CREATED_AT}"
COPY --from=runtime-build /release /release
COPY --from=frontends /workspace/apps/player-menu/dist /release/apps/player-menu/dist
COPY --from=frontends /workspace/apps/player-display/dist /release/apps/player-display/dist
COPY game-bundles /release/game-bundles
COPY content /release/content
COPY deploy/motionlevels-pc /release/deploy/motionlevels-pc
CMD ["sleep", "infinity"]
