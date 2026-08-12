{
  config,
  lib,
  modulesPath,
  pkgs,
  ...
}:
let
  cfg = config.motionLevels.venueHost;
  labCompose = pkgs.writeText "motion-levels-venue-lab-compose.yaml" ''
    services:
      caddy:
        image: ${cfg.labCaddyImage}
        pull_policy: never
        restart: "no"
        ports:
          - "${toString cfg.labListenPort}:8080"
        volumes:
          - /etc/motion-levels/venue-public:/srv/runtime:ro
        read_only: true
        cap_drop:
          - ALL
        security_opt:
          - no-new-privileges=true
        tmpfs:
          - /tmp:rw,noexec,nosuid,nodev,size=16m
          - /data:rw,noexec,nosuid,nodev,size=16m,uid=10003,gid=10003
          - /config:rw,noexec,nosuid,nodev,size=16m,uid=10003,gid=10003
        pids_limit: 128
        mem_limit: 192m
        cpus: 0.35
        healthcheck:
          test: ["CMD", "curl", "-fsS", "http://127.0.0.1:8080/menu/"]
          interval: 5s
          timeout: 3s
          retries: 12
          start_period: 10s
        labels:
          com.motionlevels.revision: ${cfg.venueRevision}
  '';
in
{
  imports = [ "${modulesPath}/profiles/qemu-guest.nix" ];

  options.motionLevels.venueHost = {
    enable = lib.mkEnableOption "Motion Levels venue host defaults";
    venueRevision = lib.mkOption {
      type = lib.types.str;
      description = "Immutable venue Git revision exercised by the lab service.";
    };
    labCaddyImage = lib.mkOption {
      type = lib.types.str;
      description = "Immutable venue Caddy image exercised by the lab service.";
    };
    labListenPort = lib.mkOption {
      type = lib.types.port;
      default = 8080;
      description = "Host port for the lab-only venue web bundle.";
    };
  };

  config = lib.mkIf cfg.enable {
    nix.settings.experimental-features = [
      "nix-command"
      "flakes"
    ];

    services.openssh = {
      enable = true;
      authorizedKeysFiles = [ "/etc/ssh/authorized_keys.d/%u" ];
      settings = {
        KbdInteractiveAuthentication = false;
        PasswordAuthentication = false;
        PermitRootLogin = "prohibit-password";
      };
    };
    services.qemuGuest.enable = true;
    services.tailscale.enable = true;

    users.mutableUsers = false;
    # The operator key is injected with nixos-anywhere --extra-files rather
    # than committed to this repository. Password SSH remains disabled.
    users.allowNoPasswordLogin = true;
    users.users.root.hashedPassword = "!";

    virtualisation.docker = {
      enable = true;
      enableOnBoot = true;
      daemon.settings = {
        live-restore = true;
        log-driver = "local";
      };
    };

    environment.systemPackages = with pkgs; [
      curl
      docker-compose
      ethtool
      git
      jq
      pciutils
      python3
      tailscale
      usbutils
    ];

    networking.firewall = {
      enable = true;
      allowedTCPPorts = [
        22
        cfg.labListenPort
      ];
      trustedInterfaces = [ "tailscale0" ];
    };

    systemd.tmpfiles.rules = [
      "d /etc/motion-levels 0755 root root -"
      "d /etc/motion-levels/venue-public 0755 root root -"
      "d /opt/motion-levels 0755 root root -"
      "d /run/motion-levels-audio 0755 root root -"
      "d /run/motion-levels-display 0755 root root -"
      "d /var/lib/motion-levels 0755 root root -"
      "d /var/lib/motion-levels/player-profile 0755 10003 10003 -"
      "d /var/lib/motion-levels/security-recordings 0755 10004 10004 -"
    ];

    environment.etc."motion-levels/venue-lab/compose.yaml".source = labCompose;

    # Deliberately not wantedBy multi-user.target. The private image is loaded
    # explicitly during validation, then this service can be started safely.
    systemd.services.motion-levels-venue-lab = {
      description = "Motion Levels venue web-bundle laboratory smoke test";
      after = [
        "docker.service"
        "network-online.target"
      ];
      requires = [ "docker.service" ];
      wants = [ "network-online.target" ];
      path = [
        pkgs.docker
        pkgs.docker-compose
      ];
      serviceConfig = {
        Type = "oneshot";
        RemainAfterExit = true;
        WorkingDirectory = "/etc/motion-levels/venue-lab";
        ExecStartPre = "${pkgs.docker}/bin/docker image inspect ${cfg.labCaddyImage}";
        ExecStart = "${pkgs.docker}/bin/docker compose up --detach --wait";
        ExecStop = "${pkgs.docker}/bin/docker compose down";
        TimeoutStartSec = "2min";
        TimeoutStopSec = "30s";
      };
    };

    system.stateVersion = "26.05";
  };
}
