---
id: scripts
title: "Scripts"
sidebar_position: 6
---

Helper scripts live in [`.local/bin`](https://github.com/rizukirr/hyprsimple/tree/main/.local/bin) and are installed to `~/.local/bin`, which is on `PATH`. Most are wired to keybindings or the bar, and all of them can be run from a terminal.

## Audio

| Script | Description |
|--------|-------------|
| `audio-switch.sh` | Cycle through available audio output devices, for a bind of your own |
| `hyprsimple-clipboard-menu.sh` | Opens the bar's clipboard history panel, behind `SUPER + V` |
| `volume-notify.sh` | Show the current PipeWire volume as a notification |
| `record-audio.sh` | Record audio from the default input to `~/Music` |

## Display, theme and wallpaper

| Script | Description |
|--------|-------------|
| `brightness-notify.sh` | Show the current screen brightness as a notification |
| `keyboard-brightness.sh` | Control the keyboard backlight (`up` / `down` / `cycle`) |
| `toggle-nightlight.sh` | Toggle a warm screen temperature via hyprsunset |
| `theme-switcher.sh` | Switch theme via the visual picker, or apply one directly by name |
| `theme-apply-templates.sh` | Generate themed app configs from a theme's `colors.toml` |
| `wallpaper-switcher.sh` | Pick, add, delete or cycle a wallpaper within the current theme. `next` cycles, for a bind of your own |
| `hyprsimple-theme-picker.sh` | List one row per theme, with its wallpaper and colour swatches, for the bar's theme picker |
| `hyprsimple-wallpaper-picker.sh` | List one row per wallpaper in the current theme, newest first, for the bar's wallpaper picker |
| `hyprsimple-thumbnails.sh` | Swap the image in each of those rows for a small cached thumbnail, which is what the pickers show |
| `live-wallpaper-toggle.sh` | Turn live wallpaper on or off (cycling backgrounds or a static one), behind the switch in the wallpaper picker |
| `monitor-mirror-toggle.sh` | Toggle between extending to and mirroring on an external monitor |
| `virtual-mirror-toggle.sh` | Mirror a monitor into a window (via wl-mirror) for screen sharing |

## Screenshot and recording

| Script | Description |
|--------|-------------|
| `screenshot.sh` | Take a screenshot. `smart`, behind `Print`, picks on a frozen screen and both saves and copies. The other modes capture one thing: `region` / `window` / `monitor`, or `region-clipboard` / `window-clipboard` / `clipboard` |
| `screen-record.sh` | Start or stop screen recording (region, window or output, with mic, internal, or no audio) |
| `hyprsimple-record-menu.sh` | Opens the bar's record panel, behind `SUPER + R`, which picks what to record and starts or stops it |
| `screen-record-active.sh` | Report whether a screen recording is running |

## Network

| Script | Description |
|--------|-------------|
| `hyprsimple-audio-autoswitch.sh` | Move the sound to a bluetooth device when one connects, run as a user service |
| `wifi.sh` | List and connect to WiFi networks, asking for the password when one is needed |
| `hyprsimple-network-setup.sh` | Make NetworkManager run the network, which the bar's network panel needs. A machine on iwd is moved over with its saved networks, and moved back if the network does not return. One already on NetworkManager is left alone |
| `wifi-powersave.sh` | Toggle WiFi power saving (`on` / `off`) |
| `hotspot.sh` | Create a WiFi hotspot with internet sharing |
| `setup-dns.sh` | Configure the DNS provider (Cloudflare / Google / DHCP) |

## System and power

| Script | Description |
|--------|-------------|
| `battery-monitor.sh` | At a low battery, warns, dims the screen and switches to power saver. On the charger, puts both back and says so |
| `bluetooth-toggle.sh` | Toggle Bluetooth adapter power |
| `toggle_cpu_mode.sh` | Switch CPU governor between performance and powersave |
| `hyprsimple-hw-intel-laptop.sh` | Exit 0 on an Intel laptop new enough for thermald (used as a condition) |
| `toggle-idle.sh` | Toggle hypridle (lock on idle) on or off |
| `hypr-logout.sh` | Close all windows and stop the Hyprland session |

## Input and notifications

| Script | Description |
|--------|-------------|
| `capslock-notify.sh` | Notify on Caps Lock state changes |
| `notification-dismiss.sh` | Dismiss every notification on screen |

## Search and keybindings

| Script | Description |
|--------|-------------|
| `search.sh` | Fuzzy file finder (ripgrep + fzf) that opens the result in nvim |
| `search_by_keyword.sh` | Fuzzy content search (ripgrep + fzf) that opens the match in nvim |
| `show-keybindings.sh` | Open the bar's keybindings panel, a searchable list of every Hyprland keybinding. `--list` prints them instead |

## hyprsimple management

| Script | Description |
|--------|-------------|
| `hyprsimple-update.sh` | Pull hyprsimple, refresh scripts and packages, run pending migrations. `--stable` or `<branch>` switches channel |
| `hyprsimple-plugin` | Install, enable, disable, update, list or remove trusted external plugins |
| `hyprsimple-migrate.sh` | Run any migrations that have not run on this machine yet |
| `hyprsimple-refresh-config.sh` | Reset one `~/.config` file to the shipped default, with a backup and a diff |
| `hyprsimple-restart-bar.sh` | Start or restart the bar. `--if-running` restarts a running bar and does nothing otherwise, `--toggle` hides or shows a running bar and starts a stopped one |
| `hyprsimple-debug.sh` | Collect system diagnostics into one file to view, save, or upload |
| `hyprsimple-session.sh` | Add a "Hyprsimple" entry to the login screen, or `remove` it. It starts the same config as the stock Hyprland entry |
| `hyprsimple-uninstall.sh` | Remove hyprsimple from your account and restore your backups. Packages and system changes stay |
| `hyprsimple-dev-add-migration.sh` | Create a new migration file (for contributors) |

## External plugins

See [the plugin author guide](./plugins) for the manifest and QML contract.

Run `hyprsimple-plugin install OWNER/REPO` to install the newest release of a trusted plugin, or add `--branch main` to lock it to a branch. `hyprsimple-plugin update ID --stable` returns it to releases. Use `hyprsimple-plugin list`, `disable ID`, `enable ID`, `update ID` or `remove ID` to manage it. Plugins run code from their repository, so review it before installing.

Plugin code lives in `~/.local/share/hyprsimple-plugins`, outside the core checkout. Enablement, placement and plugin settings live in `~/.config/hyprsimple/plugins.json`. Developers can override the code directory with `HYPRSIMPLE_PLUGIN_ROOT`. Plugins bind no keys. Each one names a panel alias, and you bind a key to it in `~/.config/hypr/bindings/applications.lua`. The default Muslimtify plugin's alias is `prayer`:

```lua
hl.bind("SUPER + P", hl.dsp.exec_cmd(vars.barPanel .. "prayer"), { description = "Prayer Times (panel)" })
```

If the plugin is installed but disabled, run `hyprsimple-plugin enable muslimtify`. If the download failed, retry `hyprsimple-plugin install https://github.com/muslimtify-org/muslimtify-hyprsimple.git`. For an enabled plugin whose daemon is stopped, run `muslimtify daemon install` first. Removing the plugin keeps application settings and installed packages.

The delivery suites need a checkout of the published plugin at `2f2b9028b3833e6cb4dc25b5b138fc18ef74bfea`. Set `MUSLIMTIFY_PLUGIN_FIXTURE` to that checkout, then run `bash test/plugin-migration-test.sh` and `bash test/plugin-default-install-test.sh`. The local default is `/tmp/muslimtify-hyprsimple`. CI fetches the pinned fixture into `RUNNER_TEMP` before running either suite. The suites map the public URL to that local origin and perform no network, package or service operations.

## Shell init and internal helpers

These are sourced by other files rather than run directly.

| Script | Description |
|--------|-------------|
| `bashrc.sh` / `zsh.sh` / `fish.fish` | Per-shell init (zoxide, fzf, starship, aliases) sourced from your shell's rc file |
| `terminal.sh` | Detect your login shell and wire the matching init script into its rc file |
| `hypr-helpers.sh` | Shared hyprpaper helper functions used by the wallpaper scripts |
| `hyprsimple-aur-helper.sh` | Reports which AUR helper is installed, so the installer, the updater and the plugin manager all use the one you already have |
| `hyprsimple-require.sh` | Loads the helpers a script needs, and stops it rather than letting it run with them missing |
| `hyprsimple-theme-deliver.sh` | Puts a theme's generated files where each program reads them, shared by the theme switcher and the updater |
| `hyprsimple-hw-battery.sh` | Exits 0 when this machine has a battery, which is how hyprsimple decides it is a laptop |
| `hyprsimple-hw-nvidia.sh` | Exits 0 when this machine has an NVIDIA GPU |
