{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.motionLevels.venueHost;
  types = lib.types;

  releaseRoot = "${cfg.installRoot}/current";
  releaseManifest = "${releaseRoot}/release-manifest.json";
  runtimeRoot = "${releaseRoot}/deploy/motionlevels-pc";
  gamesRoot = "${releaseRoot}/game-bundles/motion-levels-games";
  venueAddressOnly = builtins.head (lib.splitString "/" cfg.network.venueAddress);
  productionWantedBy = lib.optionals (!cfg.commissioningMode) [ "multi-user.target" ];

  cameraPython = pkgs.python313.withPackages (
    pythonPackages: with pythonPackages; [
      fastapi
      httptools
      opencv4
      pydantic
      pyyaml
      python-dotenv
      uvicorn
      uvloop
      watchfiles
      websockets
    ]
  );

  runtimePackages = with pkgs; [
    alsa-utils
    bash
    caddy
    chromium
    coreutils
    curl
    ethtool
    ffmpeg
    gawk
    git
    gnugrep
    gnused
    iproute2
    jq
    nodejs_24
    pciutils
    procps
    rclone
    ripgrep
    rsync
    systemd
    tailscale
    unclutter
    usbutils
    util-linux
    v4l-utils
    xinit
    xorg-server
    xrandr
    zstd
    cameraPython
  ];

  alsaConfiguration = ''
    pcm.!default {
      type plug
      slave.pcm "motionlevels_hdmi"
    }

    pcm.motionlevels_hdmi {
      type dmix
      ipc_key 2048
      ipc_perm 0600
      slave {
        pcm {
          type hw
          card ${toString cfg.display.alsaCard}
          device ${toString cfg.display.alsaDevice}
        }
        channels 2
        rate 48000
        format S16_LE
        period_size 1024
        buffer_size 8192
      }
      bindings {
        0 0
        1 1
      }
    }

    ctl.!default {
      type hw
      card ${toString cfg.display.alsaCard}
    }
  '';

  floorControllerStart = pkgs.writeShellScript "motion-levels-floor-controller-start" ''
    exec ${releaseRoot}/bin/floor-controller \
      -http "$MOTION_LEVELS_CONTROLLER_HTTP" \
      -frames "$MOTION_LEVELS_CONTROLLER_FRAMES" \
      -input-events "$MOTION_LEVELS_CONTROLLER_INPUT_EVENTS" \
      -duplex "$MOTION_LEVELS_CONTROLLER_DUPLEX" \
      -recv-port "$MOTION_LEVELS_FLOOR_RECV_PORT" \
      -floor-source-ip "$MOTION_LEVELS_FLOOR_SOURCE_IP" \
      -broadcast-ip "$MOTION_LEVELS_LED_BROADCAST_IP" \
      -broadcast-port "$MOTION_LEVELS_LED_BROADCAST_PORT" \
      -refresh-fps "$MOTION_LEVELS_REFRESH_FPS" \
      -engine-fade-delay 2s \
      -engine-fade-duration 3s
  '';

  cameraHelperStart = pkgs.writeShellScript "motion-levels-camera-helper-start" ''
    if [ "''${MOTION_LEVELS_SECURITY_RECORDER_ENABLED:-0}" != "1" ]; then
      echo "camera helper disabled by venue configuration"
      exec ${pkgs.coreutils}/bin/sleep infinity
    fi
    if [ -z "''${MOTION_LEVELS_CAMERA_PASSWORD:-}" ] && [ -z "''${ML_TAPO_PASSWORD:-}" ]; then
      echo "camera helper waiting for camera password"
      exec ${pkgs.coreutils}/bin/sleep infinity
    fi
    exec ${cameraPython}/bin/python3 ${runtimeRoot}/motion-levels-camera-helper.py
  '';

  chromiumCompat = pkgs.writeShellScript "motion-levels-chromium-compat" ''
    exec -a /usr/lib/chromium/chromium ${lib.getExe pkgs.chromium} "$@"
  '';

  commonService = {
    wantedBy = productionWantedBy;
    restartIfChanged = !cfg.commissioningMode;
    stopIfChanged = !cfg.commissioningMode;
    unitConfig.ConditionPathExists = releaseManifest;
    path = runtimePackages;
  };
in
{
  options.motionLevels.venueHost = {
    enable = lib.mkEnableOption "the native Motion Levels venue host stack";
    commissioningMode = lib.mkOption {
      type = types.bool;
      default = true;
      description = ''
        Install the complete host configuration and venue units without adding
        the application services to a boot target or restarting them. Disable
        only after the release, secrets, passthrough, and venue wiring are ready.
      '';
    };
    installRoot = lib.mkOption {
      type = types.str;
      default = "/opt/motion-levels/venue";
    };
    stateRoot = lib.mkOption {
      type = types.str;
      default = "/var/lib/motion-levels";
    };
    cameraStateRoot = lib.mkOption {
      type = types.str;
      default = "/var/lib/motion-levels-cameras";
    };
    identity = {
      slug = lib.mkOption { type = types.str; };
      displayName = lib.mkOption { type = types.str; };
      platformRoomId = lib.mkOption { type = types.str; };
      platformRoomSlug = lib.mkOption { type = types.str; };
    };

    network = {
      venueInterface = lib.mkOption { type = types.str; };
      venueAddress = lib.mkOption { type = types.str; };
      venueGateway = lib.mkOption { type = types.str; };
      floorSourceAddress = lib.mkOption { type = types.str; };
      floorBroadcastAddress = lib.mkOption { type = types.str; };
    };

    display = {
      output = lib.mkOption { type = types.str; };
      mode = lib.mkOption { type = types.str; };
      refreshHz = lib.mkOption { type = types.ints.positive; };
      alsaCard = lib.mkOption { type = types.ints.unsigned; };
      alsaDevice = lib.mkOption { type = types.ints.unsigned; };
    };

    gopro = {
      serial = lib.mkOption { type = types.str; };
      usbVendorId = lib.mkOption { type = types.str; };
      usbProductId = lib.mkOption { type = types.str; };
      networkInterface = lib.mkOption { type = types.str; };
      baseUrl = lib.mkOption { type = types.str; };
    };
  };

  config = lib.mkIf cfg.enable {
    assertions = [
      {
        assertion = builtins.match "^[0-9a-f-]{36}$" cfg.identity.platformRoomId != null;
        message = "motionLevels.venueHost.identity.platformRoomId must be a UUID.";
      }
      {
        assertion = builtins.match "^[0-9a-fA-F]{4}$" cfg.gopro.usbVendorId != null;
        message = "The GoPro USB vendor id must contain four hexadecimal digits.";
      }
      {
        assertion = builtins.match "^[0-9a-fA-F]{4}$" cfg.gopro.usbProductId != null;
        message = "The GoPro USB product id must contain four hexadecimal digits.";
      }
      {
        assertion = cfg.network.floorSourceAddress == venueAddressOnly;
        message = "The floor source address must equal the venue LAN address.";
      }
    ];

    environment.systemPackages = runtimePackages;
    hardware.enableRedistributableFirmware = true;
    hardware.graphics.enable = true;
    fonts.packages = with pkgs; [
      dejavu_fonts
      noto-fonts
      noto-fonts-color-emoji
    ];

    users.groups = {
      caddy = { };
      motion-levels-cameras.gid = 10001;
    };
    users.users = {
      caddy = {
        isSystemUser = true;
        group = "caddy";
        home = "/var/lib/caddy";
        createHome = false;
      };
      motion-levels-cameras = {
        isSystemUser = true;
        uid = 10001;
        group = "motion-levels-cameras";
        home = cfg.cameraStateRoot;
        createHome = false;
      };
    };

    environment.etc = {
      "asound.conf".text = alsaConfiguration;
      "chromium/policies/managed/motion-levels-kiosk.json".text = builtins.toJSON {
        TranslateEnabled = false;
      };
    };

    systemd.tmpfiles.rules = [
      "d ${cfg.installRoot} 0755 root root -"
      "d ${cfg.installRoot}/releases 0755 root root -"
      "d ${cfg.stateRoot} 0755 root root -"
      "d ${cfg.stateRoot}/public 0755 root root -"
      "d ${cfg.stateRoot}/floor-controller 0755 root root -"
      "d ${cfg.stateRoot}/platform-asset-cache 0755 root root -"
      "d ${cfg.stateRoot}/session-sync 0750 root root -"
      "d ${cfg.stateRoot}/session-sync/artifacts 0750 root root -"
      "d ${cfg.stateRoot}/camera-recordings 0750 motion-levels-cameras motion-levels-cameras -"
      "d ${cfg.stateRoot}/security-recordings 0750 root root -"
      "d ${cfg.stateRoot}/player-chromium 0750 root root -"
      "d ${cfg.cameraStateRoot} 0750 motion-levels-cameras motion-levels-cameras -"
      "d /etc/motion-levels 0710 root motion-levels-cameras -"
      "d /etc/motion-levels-cameras 0750 root motion-levels-cameras -"
      "d /etc/caddy 0755 root root -"
      "d /var/lib/caddy 0750 caddy caddy -"
      "d /usr/bin 0755 root root -"
      "d /usr/sbin 0755 root root -"
      "d /usr/lib/chromium 0755 root root -"
      "L+ /usr/bin/amixer - - - - ${pkgs.alsa-utils}/bin/amixer"
      "L+ /usr/sbin/alsactl - - - - ${pkgs.alsa-utils}/bin/alsactl"
      "L+ /usr/bin/chromium - - - - ${chromiumCompat}"
      "L+ /usr/lib/chromium/chromium - - - - ${chromiumCompat}"
      "L+ /usr/bin/curl - - - - ${pkgs.curl}/bin/curl"
      "L+ /usr/bin/node - - - - ${pkgs.nodejs_24}/bin/node"
      "L+ /usr/bin/python3 - - - - ${cameraPython}/bin/python3"
      "L+ /usr/bin/unclutter - - - - ${pkgs.unclutter}/bin/unclutter"
      "L+ /usr/bin/xinit - - - - ${pkgs.xinit}/bin/xinit"
      "L+ /usr/bin/xrandr - - - - ${pkgs.xrandr}/bin/xrandr"
    ];

    services.udev.extraRules = lib.optionalString (!cfg.commissioningMode) ''
      # Fail closed on the exact venue-owned GoPro serial. The hotplug action is
      # withheld completely while commissioningMode is enabled.
      ACTION=="add|change", SUBSYSTEM=="usb", ENV{DEVTYPE}=="usb_device", ATTR{idVendor}=="${cfg.gopro.usbVendorId}", ATTR{idProduct}=="${cfg.gopro.usbProductId}", ATTR{serial}=="${cfg.gopro.serial}", TAG+="systemd", ENV{SYSTEMD_WANTS}+="motion-levels-gopro-reconcile.service"
    '';

    systemd.services.motion-levels-lan-ip = {
      description = "Prepare the Motion Levels venue LAN interface";
      wantedBy = productionWantedBy;
      after = [ "network-online.target" ];
      wants = [ "network-online.target" ];
      restartIfChanged = !cfg.commissioningMode;
      stopIfChanged = !cfg.commissioningMode;
      serviceConfig = {
        Type = "oneshot";
        RemainAfterExit = true;
        ExecStart = "${pkgs.iproute2}/bin/ip link set ${cfg.network.venueInterface} up";
      };
    };

    systemd.services.motion-levels-floor-controller = commonService // {
      description = "Motion Levels floor controller";
      after = [
        "network-online.target"
        "motion-levels-lan-ip.service"
      ];
      wants = [
        "network-online.target"
        "motion-levels-lan-ip.service"
      ];
      environment.GOMAXPROCS = "2";
      serviceConfig = {
        Type = "simple";
        WorkingDirectory = releaseRoot;
        EnvironmentFile = [
          "/etc/motion-levels/motion-levels.env"
          "-/etc/motion-levels/platform.env"
        ];
        ExecStart = floorControllerStart;
        Restart = "always";
        RestartSec = 2;
        Nice = -5;
        CPUWeight = 1000;
        LimitNOFILE = 65536;
      };
    };

    systemd.services.motion-levels-venue-runtime = commonService // {
      description = "Motion Levels TypeScript venue runtime";
      after = [
        "network-online.target"
        "motion-levels-floor-controller.service"
      ];
      wants = [
        "network-online.target"
        "motion-levels-floor-controller.service"
      ];
      environment = {
        MOTION_LEVELS_CONTROLLER_ADDR = "127.0.0.1:4203";
        MOTION_LEVELS_GAMES_ROOT = gamesRoot;
        MOTION_LEVELS_NODE_BINARY = "${pkgs.nodejs_24}/bin/node";
        MOTION_LEVELS_CAMERA_RECORDER_TOKEN_FILE = "/etc/motion-levels/camera-recorder-token";
      };
      serviceConfig = {
        Type = "simple";
        WorkingDirectory = releaseRoot;
        EnvironmentFile = [
          "/etc/motion-levels/motion-levels.env"
          "-/etc/motion-levels/platform.env"
        ];
        ExecStart = "${runtimeRoot}/venue-runtime";
        Restart = "always";
        RestartSec = 2;
        NoNewPrivileges = true;
        PrivateTmp = true;
        ProtectHome = true;
        ProtectSystem = "strict";
        ReadWritePaths = cfg.stateRoot;
        RestrictAddressFamilies = [
          "AF_INET"
          "AF_INET6"
          "AF_UNIX"
        ];
      };
    };

    systemd.services.motion-levels-venue-supervisor = commonService // {
      description = "Motion Levels venue supervisor API";
      after = [
        "network-online.target"
        "motion-levels-floor-controller.service"
        "motion-levels-venue-runtime.service"
      ];
      wants = [
        "network-online.target"
        "motion-levels-floor-controller.service"
        "motion-levels-venue-runtime.service"
      ];
      environment.MOTION_LEVELS_CAMERA_RECORDER_TOKEN_FILE = "/etc/motion-levels/camera-recorder-token";
      serviceConfig = {
        Type = "simple";
        EnvironmentFile = [
          "/etc/motion-levels/motion-levels.env"
          "-/etc/motion-levels/platform.env"
          "-/etc/motion-levels/venue-supervisor.env"
        ];
        ExecStart = "${cameraPython}/bin/python3 ${runtimeRoot}/motion-levels-venue-supervisor.py";
        Restart = "always";
        RestartSec = 2;
        User = "root";
      };
    };

    systemd.services.motion-levels-cameras = commonService // {
      description = "Motion Levels GoPro control and recording service";
      after = [ "network-online.target" ];
      wants = [ "network-online.target" ];
      environment = {
        HOME = cfg.cameraStateRoot;
        PYTHONDONTWRITEBYTECODE = "1";
        PYTHONUNBUFFERED = "1";
        PYTHONPATH = "${releaseRoot}/components/cameras/source";
      };
      serviceConfig = {
        Type = "simple";
        User = "motion-levels-cameras";
        Group = "motion-levels-cameras";
        EnvironmentFile = "/etc/motion-levels-cameras.env";
        WorkingDirectory = cfg.cameraStateRoot;
        ExecStart = "${cameraPython}/bin/python3 -m motion_levels_cameras.main";
        Restart = "always";
        RestartSec = 3;
        TimeoutStopSec = 45;
        NoNewPrivileges = true;
        PrivateDevices = true;
        PrivateTmp = true;
        ProtectControlGroups = true;
        ProtectHome = true;
        ProtectKernelLogs = true;
        ProtectKernelModules = true;
        ProtectKernelTunables = true;
        ProtectSystem = "strict";
        ReadWritePaths = [
          cfg.cameraStateRoot
          "${cfg.stateRoot}/camera-recordings"
        ];
        RestrictAddressFamilies = [
          "AF_INET"
          "AF_INET6"
          "AF_UNIX"
        ];
        RestrictNamespaces = true;
        RestrictRealtime = true;
        SystemCallArchitectures = "native";
        UMask = "0027";
      };
    };

    systemd.services.motion-levels-security-recorder = commonService // {
      description = "Motion Levels security camera recorder";
      after = [ "network-online.target" ];
      wants = [ "network-online.target" ];
      serviceConfig = {
        Type = "simple";
        EnvironmentFile = [
          "/etc/motion-levels/motion-levels.env"
          "-/etc/motion-levels/platform.env"
          "-/etc/motion-levels/camera.env"
          "-/etc/motion-levels/security-recorder.env"
        ];
        ExecStart = "${cameraPython}/bin/python3 ${runtimeRoot}/motion-levels-security-recorder.py";
        Restart = "always";
        RestartSec = 10;
        TimeoutStopSec = 20;
        KillMode = "control-group";
        SendSIGKILL = true;
        User = "root";
      };
    };

    systemd.services.motion-levels-camera-helper = commonService // {
      description = "Motion Levels camera snapshot helper";
      after = [ "network-online.target" ];
      wants = [ "network-online.target" ];
      serviceConfig = {
        Type = "simple";
        EnvironmentFile = [
          "/etc/motion-levels/motion-levels.env"
          "-/etc/motion-levels/camera.env"
        ];
        WorkingDirectory = runtimeRoot;
        ExecStart = cameraHelperStart;
        Restart = "always";
        RestartSec = 2;
        Nice = 12;
        CPUWeight = 100;
        CPUQuota = "45%";
        IOSchedulingClass = "idle";
        MemoryMax = "512M";
      };
    };

    systemd.services.caddy = commonService // {
      description = "Caddy web boundary for the Motion Levels venue";
      after = [ "network-online.target" ];
      wants = [ "network-online.target" ];
      serviceConfig = {
        Type = "notify";
        NotifyAccess = "all";
        User = "caddy";
        Group = "caddy";
        WorkingDirectory = "/var/lib/caddy";
        ExecStart = "${pkgs.caddy}/bin/caddy run --environ --config /etc/caddy/Caddyfile";
        ExecReload = "${pkgs.caddy}/bin/caddy reload --config /etc/caddy/Caddyfile --force";
        Restart = "on-abnormal";
        TimeoutStopSec = 5;
        LimitNOFILE = 1048576;
        AmbientCapabilities = "CAP_NET_BIND_SERVICE";
        CapabilityBoundingSet = "CAP_NET_BIND_SERVICE";
        NoNewPrivileges = true;
        PrivateTmp = true;
        ProtectHome = true;
        ProtectSystem = "strict";
        ReadWritePaths = "/var/lib/caddy";
      };
    };

    systemd.services.motion-levels-kiosk = commonService // {
      description = "Motion Levels HDMI kiosk browser";
      after = [
        "network-online.target"
        "sound.target"
        "caddy.service"
        "motion-levels-venue-runtime.service"
      ];
      wants = [
        "network-online.target"
        "sound.target"
      ];
      conflicts = [
        "getty@tty7.service"
        "display-manager.service"
        "motion-levels-player-tv.service"
      ];
      environment = {
        DISPLAY = ":0";
        XDG_RUNTIME_DIR = "/run/motion-levels-kiosk";
      };
      serviceConfig = {
        Type = "simple";
        EnvironmentFile = "/etc/motion-levels/motion-levels.env";
        RuntimeDirectory = "motion-levels-kiosk";
        RuntimeDirectoryMode = "0700";
        RuntimeDirectoryPreserve = "restart";
        WorkingDirectory = cfg.stateRoot;
        ExecStart = "${pkgs.xinit}/bin/xinit ${runtimeRoot}/motion-levels-player-kiosk -- :0 vt7 -nolisten tcp -s 0 -dpms";
        Restart = "always";
        RestartSec = 3;
      };
    };

    systemd.services.motion-levels-hdmi-watchdog = commonService // {
      description = "Motion Levels HDMI audio/video watchdog";
      after = [
        "network-online.target"
        "sound.target"
        "motion-levels-kiosk.service"
      ];
      wants = [
        "network-online.target"
        "sound.target"
        "motion-levels-kiosk.service"
      ];
      environment = {
        DISPLAY = ":0";
        XDG_RUNTIME_DIR = "/run/motion-levels-kiosk";
      };
      serviceConfig = {
        Type = "simple";
        EnvironmentFile = "/etc/motion-levels/motion-levels.env";
        WorkingDirectory = cfg.stateRoot;
        ExecStart = "${runtimeRoot}/motion-levels-hdmi-watchdog";
        Restart = "always";
        RestartSec = 5;
      };
    };

    systemd.services.motion-levels-gopro-reconcile = {
      description = "Verify and reconnect the venue GoPro after USB changes";
      after = [ "network-online.target" ];
      wants = [ "network-online.target" ];
      restartIfChanged = false;
      unitConfig.ConditionPathExists = releaseManifest;
      path = runtimePackages;
      serviceConfig = {
        Type = "oneshot";
        ExecStart = "${cameraPython}/bin/python3 ${runtimeRoot}/motion-levels-gopro-reconcile";
        TimeoutStartSec = "2min";
      };
    };
  };
}
