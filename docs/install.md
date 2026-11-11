---
id: install
title: "Install"
sidebar_position: 2
---

```bash
git clone https://github.com/rizukirr/hyprsimple.git
cd hyprsimple
./install.sh
```

The install asks for your sudo password once, at the start, and then runs to the end without stopping. Package operations confirm nothing, so you can start it and walk away. It comes back to you once, at the very end, to ask whether to log out.

If you would rather read what pacman is about to do, `./install.sh --interactive` puts every confirmation back, including the full system upgrade. It also asks which AUR helper to install when you have neither paru nor yay, instead of taking paru. The helper comes from a repository when your distribution ships one, and is built from the AUR otherwise. Whichever helper you already have is the one used either way, and `HYPRSIMPLE_AUR_HELPER=yay ./install.sh` settles a machine that has both.

`./install.sh --session-entry` also adds a "Hyprsimple" entry to the login screen. It starts the same config as the stock Hyprland entry, so it changes the name you pick and nothing else. `hyprsimple-session.sh` adds or removes it on an existing install, and the FAQ says what it does and does not separate.

:::warning[Warning]

These dotfiles are tested on a fresh Arch Linux install where Hyprland was selected as the desktop during installation. The login entry has also been tested beside another Hyprland setup on the same machine, and the FAQ lists what the two still share. Coming from another desktop environment (KDE, GNOME and the like) is untested and may need manual cleanup.

:::

If you run into a problem installing hyprsimple, please [open an issue](https://github.com/rizukirr/hyprsimple/issues). Run `hyprsimple-debug` first and attach the link it gives you. It bundles your hardware, journal warnings, migration state and the install log (`~/.local/state/hyprsimple/install.log`) into a single paste that expires in 24 hours. Review it before uploading, because it includes your hostname and package list.
