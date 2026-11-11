---
id: network
title: "Network"
sidebar_position: 8
---

`wifi` on its own rescans and lists the networks in range. `wifi "MY NETWORK"` connects to one. An open network, or one you have joined before, connects straight away, and a secured one asks for the password.

From a keybind or a script there is nobody to ask, so pass it instead:

```bash
wifi "MY NETWORK" "my password"
```

`wifi --help` lists both forms. It uses NetworkManager if it is running, and iwd otherwise.
