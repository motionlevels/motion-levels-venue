{
  description = "NixOS host for the Motion Levels Zaragoza venue VM";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    disko = {
      url = "github:nix-community/disko";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      disko,
      ...
    }:
    let
      mkZaragoza =
        commissioningMode:
        nixpkgs.lib.nixosSystem {
          system = "x86_64-linux";
          modules = [
            disko.nixosModules.disko
            ./modules/disk-qemu-uefi.nix
            ./modules/motion-levels-venue-native.nix
            ./hosts/motionlevels-zaragoza.nix
            {
              motionLevels.venueHost.commissioningMode = nixpkgs.lib.mkForce commissioningMode;
            }
          ];
        };
    in
    {
      nixosConfigurations = {
        motionlevels-zaragoza-commissioning = mkZaragoza true;
        motionlevels-zaragoza-production = mkZaragoza false;
      };

      checks.x86_64-linux = {
        motionlevels-zaragoza-commissioning =
          self.nixosConfigurations.motionlevels-zaragoza-commissioning.config.system.build.toplevel;
        motionlevels-zaragoza-production =
          self.nixosConfigurations.motionlevels-zaragoza-production.config.system.build.toplevel;
      };
    };
}
