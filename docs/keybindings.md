---
id: keybindings
title: "Keybindings"
sidebar_position: 5
---

Press **`SUPER + /`** for an interactive viewer with fuzzy search.

## Applications

| Key | Action |
|-----|--------|
| `SUPER + T` | Open terminal (Ghostty) |
| `SUPER + B` | Open browser (Firefox) |
| `SUPER + A` | App launcher, a sidebar of the bar |
| `SUPER + F` | File manager (Nautilus) |
| `SUPER + V` | Clipboard history, a panel of the bar |
| `SUPER + M` | Color picker |

## Window management

| Key | Action |
|-----|--------|
| `SUPER + Q` | Kill active window |
| `SUPER + W` | Toggle floating |
| `SUPER + H / J / K / L` | Move focus left / down / up / right |
| `SUPER + SHIFT + Arrow` | Resize window |
| `SUPER + LMB drag` | Move window |
| `SUPER + RMB drag` | Resize window |

## Workspaces

| Key | Action |
|-----|--------|
| `SUPER + [1-9, 0]` | Switch to workspace 1-10 |
| `SUPER + SHIFT + [1-9, 0]` | Move window to workspace 1-10 |
| `SUPER + SHIFT + S` | Move window to scratchpad |
| `SUPER + CTRL + Arrow` | Move the whole workspace to the monitor in that direction |
| `SUPER + Scroll` | Cycle through workspaces |

## Theming and wallpaper

| Key | Action |
|-----|--------|
| `SUPER + SHIFT + T` | Switch theme, from a carousel of wallpapers and colour swatches |
| `SUPER + SHIFT + W` | Pick a wallpaper from the current theme, same carousel. Its last tile adds one or several from files, `Shift + Delete` or the bin on a picture deletes it after asking, and the switch under it cycles through them every 30s |

## Screenshot

| Key | Action |
|-----|--------|
| `Print` | Take a screenshot: drag a region, click a window, or click where there is none for the whole screen |

The screen freezes while you pick, and Escape takes nothing. The picture is saved to `~/Pictures/Screenshots` and copied to the clipboard, both.

## Screen recording

| Key | Action |
|-----|--------|
| `SUPER + R` | Open the recording menu, a panel of the bar, which starts a recording or stops the one that is running. Recording a window asks which one, from a list |

The menu offers a region, a window or the whole screen, each with microphone audio, system audio, or none. A window is recorded as the area it covered when you picked it, so moving it or covering it shows in the recording. While something is recording it offers to stop instead, so the same key both starts and stops.

Recording uses `wl-screenrec` where it can and `wf-recorder` otherwise, and NVIDIA machines prefer `wf-recorder`. Only `wf-recorder` is required. It comes from the official repositories, so recording still works if the `wl-screenrec` build fails during install.

## Media and brightness

| Key | Action |
|-----|--------|
| `Volume Up / Down` | Adjust volume |
| `Mute` | Toggle mute |
| `Mic Mute` | Toggle microphone mute |
| `Play / Pause` | Media play/pause |
| `Next / Prev` | Media next/previous track |
| `Brightness Up / Down` | Adjust screen brightness |
| `Kbd Brightness Up / Down` | Adjust keyboard backlight |

## System

| Key | Action |
|-----|--------|
| `SUPER + ESC` | Power menu, a panel of the bar |
| `SUPER + SHIFT + L` | Lock screen |
| `SUPER + X` | Exit Hyprland |
| `CTRL + ESC` | Hide or show the bar |
| `SUPER + N` | Toggle nightlight |
| `SUPER + D` | Dismiss notifications |
| `SUPER + SHIFT + I` | Toggle idle lock |
| `SUPER + S` | Open the volume panel, to set the volume and choose a speaker |
| `SUPER + ALT + S` | Open the microphone panel |
| `SUPER + SHIFT + N` | Open the network panel |
| `SUPER + SHIFT + B` | Open the bluetooth panel |
| `SUPER + SHIFT + D` | Open the notifications panel |
| `SUPER + C` | Open the calendar panel |
| `SUPER + I` | Open the system panel: power mode, CPU, memory and GPU |
| `SUPER + SHIFT + M` | Toggle monitor mirroring |
| `SUPER + CTRL + V` | Toggle virtual mirror |
| `SUPER + /` | Show all keybindings, in a searchable panel of the bar |
