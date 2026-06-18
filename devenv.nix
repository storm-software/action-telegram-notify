{ pkgs, ... }:
{
  name = "storm-software/action-telegram-notify";

  dotenv.enable = true;
  dotenv.filename = [
    ".env"
    ".env.local"
  ];
  dotenv.disableHint = true;

  packages = with pkgs; [
    zizmor
  ];
}
