{ lib, modulesPath, ... }:
{
  imports = [ "${modulesPath}/profiles/qemu-guest.nix" ];

  # Keep the complete boot path observable through Proxmox's serial console.
  # The qemu-guest profile supplies the VirtIO SCSI modules required to mount
  # the root disk before the real hardware passthrough is attached.
  boot.kernelParams = [ "console=ttyS0,115200n8" ];

  networking = {
    hostName = "motionlevels-zaragoza";
    useDHCP = false;
    useNetworkd = true;
    nameservers = [
      "1.1.1.1"
      "9.9.9.9"
    ];
    firewall = {
      enable = true;
      checkReversePath = "loose";
      interfaces = {
        mgmt0.allowedTCPPorts = [
          22
          80
        ];
        venue0 = {
          allowedTCPPorts = [ 80 ];
          allowedUDPPorts = [ 7800 ];
        };
        gopro0.allowedUDPPorts = [ 8554 ];
        tailscale0.allowedTCPPorts = [
          22
          80
        ];
      };
    };
  };

  systemd.network = {
    enable = true;
    links = {
      "10-mgmt" = {
        matchConfig.MACAddress = "BC:24:11:49:08:EF";
        linkConfig.Name = "mgmt0";
      };
      "10-venue" = {
        matchConfig.MACAddress = "BC:24:11:2D:D7:75";
        linkConfig.Name = "venue0";
      };
      "10-gopro" = {
        matchConfig.MACAddress = "04:57:47:04:B1:1C";
        linkConfig.Name = "gopro0";
      };
    };
    networks = {
      "10-mgmt" = {
        matchConfig.Name = "mgmt0";
        address = [ "10.137.50.100/24" ];
        routes = [ { Gateway = "10.137.50.1"; } ];
        networkConfig = {
          DHCP = "no";
          DNS = [
            "1.1.1.1"
            "9.9.9.9"
          ];
          IPv6AcceptRA = false;
        };
        linkConfig.RequiredForOnline = "routable";
      };
      "20-venue" = {
        matchConfig.Name = "venue0";
        address = [ "192.168.1.142/24" ];
        networkConfig = {
          DHCP = "no";
          ConfigureWithoutCarrier = true;
          DNSDefaultRoute = false;
          IPv6AcceptRA = false;
          LinkLocalAddressing = "no";
        };
        linkConfig.RequiredForOnline = "no";
      };
      "30-gopro" = {
        matchConfig.Name = "gopro0";
        networkConfig = {
          DHCP = "ipv4";
          DNSDefaultRoute = false;
          IPv6AcceptRA = false;
          LinkLocalAddressing = "no";
        };
        dhcpV4Config = {
          RouteMetric = 8197;
          UseDNS = false;
          UseRoutes = true;
        };
        linkConfig.RequiredForOnline = "no";
      };
    };
  };

  motionLevels.venueHost = {
    enable = true;

    identity = {
      slug = "zaragoza-caracol-1";
      displayName = "Zaragoza Caracol 1";
      platformRoomId = "47d11be3-8117-4ec1-95d1-87068b0b803b";
      platformRoomSlug = "motionlevels-1";
    };

    network = {
      venueInterface = "venue0";
      venueAddress = "192.168.1.142/24";
      venueGateway = "192.168.1.1";
      floorSourceAddress = "192.168.1.142";
      floorBroadcastAddress = "255.255.255.255";
    };

    display = {
      output = "HDMI-1";
      mode = "1920x1080";
      refreshHz = 60;
      # Verified fallback for HDMI-A-2; the kiosk follows the live ELD/PCM.
      alsaCard = 1;
      alsaDevice = 7;
    };

    gopro = {
      serial = "C3501324639939";
      usbVendorId = "2672";
      usbProductId = "0059";
      networkInterface = "gopro0";
      baseUrl = "http://172.29.139.51:8080";
    };

    # This recorder remains absent from boot targets until the venue-owned
    # credential is provisioned and the inventory flag is changed with it.
    securityCamera.enable = false;
  };

  time.timeZone = "Europe/Madrid";

  # This system is installed into a QEMU VM and administered only by SSH.
  services.qemuGuest.enable = true;
  # The Proxmox local-zfs zvol is intentionally presented without discard.
  # Keep NixOS 26.05's default weekly fstrim timer off until this exact
  # storage path has passed a disposable-disk discard qualification.
  services.fstrim.enable = false;
  services.openssh = {
    enable = true;
    authorizedKeysFiles = [ "/etc/ssh/authorized_keys.d/%u" ];
    settings = {
      KbdInteractiveAuthentication = false;
      PasswordAuthentication = false;
      PermitRootLogin = "prohibit-password";
    };
  };
  services.tailscale = {
    enable = true;
    openFirewall = true;
    useRoutingFeatures = "client";
  };

  users.mutableUsers = false;
  users.allowNoPasswordLogin = true;
  users.users.root.hashedPassword = "!";

  nix = {
    settings = {
      experimental-features = [
        "nix-command"
        "flakes"
      ];
      auto-optimise-store = true;
    };
    gc = {
      automatic = true;
      dates = "weekly";
      options = "--delete-older-than 30d";
    };
  };

  systemd.tmpfiles.rules = [
    "d /etc/ssh/authorized_keys.d 0755 root root -"
  ];

  boot.kernel.sysctl = {
    "net.ipv4.conf.all.arp_ignore" = 1;
    "net.ipv4.conf.all.arp_announce" = 2;
  };

  system.stateVersion = "26.05";
}
