{ ... }:
{
  motionLevels.venueHost = {
    enable = true;
    venueRevision = "cd149b81f74dc25dd38cfffca26deca12d9d21fc";
    labCaddyImage = "ghcr.io/motionlevels/motion-levels-venue-caddy:sha-cd149b81f74dc25dd38cfffca26deca12d9d21fc";
  };

  networking = {
    hostName = "motionlevels-nixos-venue-lab";
    useDHCP = false;
    useNetworkd = true;
    nameservers = [
      "10.137.25.211"
      "192.168.1.1"
    ];
  };

  systemd.network = {
    enable = true;
    networks."10-venue-lab" = {
      matchConfig.Name = "ens18";
      address = [ "10.137.25.253/24" ];
      routes = [ { Gateway = "10.137.25.1"; } ];
      networkConfig = {
        DNS = [
          "10.137.25.211"
          "192.168.1.1"
        ];
        Domains = [ "homelab" ];
      };
    };
  };

  time.timeZone = "Europe/Madrid";
}
