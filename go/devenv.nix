{ pkgs, ... }:

{
  # https://devenv.sh/basics/
  # env.GREET = "devenv";
  # env.GOEXPERIMENT = "rangefunc";

  # https://devenv.sh/packages/
  packages = with pkgs; [

  ];

  # https://devenv.sh/scripts/
  # scripts.hello.exec = "echo hello from $GREET";

  enterShell = ''
    export GH_TOKEN=$(pass github_tokens/personal)
  '';

  # https://devenv.sh/languages/
  # languages.nix.enable = true;
  languages.go = {
    enable = true;
    # version = "1.22";
  };

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  # processes.ping.exec = "ping example.com";

  # See full reference at https://devenv.sh/reference/options/
}
