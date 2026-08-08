{
  description = "NixOS hosts for Motion Levels venues";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    disko = {
      url = "github:nix-community/disko";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, disko, ... }: {
    nixosConfigurations.motionlevels-nixos-venue-lab = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        disko.nixosModules.disko
        ./modules/disk-qemu-bios.nix
        ./modules/motion-levels-venue-host.nix
        ./hosts/motionlevels-nixos-venue-lab.nix
      ];
    };
  };
}
