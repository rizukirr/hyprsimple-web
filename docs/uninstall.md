---
id: uninstall
title: "Uninstall"
sidebar_position: 4
---

`hyprsimple-uninstall.sh` removes hyprsimple from your account. It lists what it will do and asks once before changing anything.

It deletes the login entry, plugins, hyprsimple's services, the shell lines the installer added, unchanged scripts and the checkout. Your `~/.config` folders move to `<name>.hyprsimple-removed` so your edits survive, and any `.backup` from before hyprsimple goes back in place. A checkout with work that exists nowhere else is moved aside too.

Packages and system changes stay. The FAQ says how to undo those by hand. Log out when it finishes, because the session has lost its bar and config.
