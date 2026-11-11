---
id: overview
title: "Overview"
sidebar_position: 1
---

Minimalist and aesthetically pleasing Hyprland dotfiles for Arch Linux. Just the essential utilities for everyday use, with a clean and beautiful look and feel. Nothing fancy.

If you want more features, Hyprsimple supports a plugin system, so you can install any plugin you like or build your own. Read [Plugins](./plugins) to learn more.

If you encounter any issues or have feedback, feel free to open an [issue](https://github.com/rizukirr/hyprsimple/issues).

:::note[Note]

Muslimtify is installed by default as an [external plugin](https://github.com/muslimtify-org/muslimtify-hyprsimple). `hyprsimple-plugin remove muslimtify` removes its integration and daemon and keeps the package and your settings. `hyprsimple-plugin install https://github.com/muslimtify-org/muslimtify-hyprsimple.git` installs or enables it again.

:::

## Features

- Switch between **41 themes** with one key, and every app follows at once: the bar with its menus and notifications, ghostty, hyprlock and btop. The default is hyprsimple, made from the colours of Hypri, the mascot, with three rainy night wallpapers of her. The well known colorschemes are here too, Dracula, Solarized, Catppuccin, Tokyo Night, Rosé Pine, Gruvbox, Nord, Everforest, Kanagawa, Ayu, Nightfox, Oxocarbon and more, in dark and light.
- Pick themes and wallpapers visually, from a carousel of previews in a panel of the bar, with each theme's colour swatches, filterable by typing.
- Every theme has its own wallpapers, with a picker and a cycle switch.
- The installer detects your hardware: NVIDIA, hybrid GPU power saving, Vulkan, Intel iGPU, WiFi and battery.
- The session is Wayland-native through uwsm, with no X11 dependencies.
- An optional "Hyprsimple" entry on the login screen, so hyprsimple can sit beside another Hyprland setup on the same machine.
- The Hyprland config is split into focused files.
- GTK and Qt follow the theme, including light or dark mode.
- On a laptop, a low battery dims the screen and switches to power saver, and the charger puts both back.
- The system panel switches the power mode between power saver, balanced and performance through power-profiles-daemon.
- Screen recording with the microphone, system audio, or no sound.
- Screenshots of a monitor, a window, a region, or straight to the clipboard.
- Clipboard history in a panel of the bar, with search, pictures shown as pictures, and removal of one entry or all of them.
- A nightlight toggle for a warm screen temperature.
- Audio output switching with one key.
- An app launcher in a sidebar that grows from the left edge. It searches names, keywords and initials, and lists the apps you start most first.
- A Quickshell bar with panels for the calendar, system usage, volume, microphone, network, bluetooth and power.
- Prayer times on the bar through muslimtify, with every setting in its panel.
- A firewall (UFW) configured out of the box.
- In-place updates through `hyprsimple-update`, which never overwrites your `~/.config`.
- Migrations deliver fixes to machines already installed, once each and safe to repeat.
- One-command diagnostics with `hyprsimple-debug` for issue reports.
