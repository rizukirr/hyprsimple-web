---
id: audio
title: "Audio"
sidebar_position: 7
---

`SUPER + S` opens the bar's volume panel, with a mute switch, a volume slider and every output device. Click a device to make it the default. The microphone has the same panel behind its bar icon. Noise suppression stays on the microphone you choose.

A bluetooth microphone switches the headset into its call profile while it is in use, which lowers playback quality until recording stops. That is how bluetooth headsets work, not something hyprsimple can avoid.

Connecting a bluetooth headset or speaker moves the sound to it. Switching by hand with `SUPER + S` still wins while that device stays connected, and the next one to connect takes over again. Turn it off with

```bash
systemctl --user disable --now hyprsimple-audio-autoswitch.service
```
