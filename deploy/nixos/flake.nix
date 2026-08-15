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
    {
      nixosConfigurations.motionlevels-zaragoza = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        modules = [
          disko.nixosModules.disko
          ./modules/disk-qemu-uefi.nix
          ./modules/motion-levels-venue-native.nix
          ./hosts/motionlevels-zaragoza.nix
        ];
      };

      checks.x86_64-linux.motionlevels-zaragoza =
        self.nixosConfigurations.motionlevels-zaragoza.config.system.build.toplevel;
    };
}
