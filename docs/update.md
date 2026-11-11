---
id: update
title: "Update and channels"
sidebar_position: 3
---

:::info[Important]

If you installed hyprsimple before it could update itself, run this **once** to get on the update system. Unlike `install.sh`, it does not replace your `~/.config`:

```bash
curl -fsSL https://raw.githubusercontent.com/rizukirr/hyprsimple/main/bootstrap.sh | bash
```

It installs hyprsimple to `~/.local/share/hyprsimple`, refreshes the helper scripts, and applies every fix you missed as a migration. After that, `hyprsimple-update` is all you need.

:::

```bash
hyprsimple-update
```

This pulls the latest hyprsimple, refreshes the helper scripts in `~/.local/bin`, installs any newly required packages, and runs pending migrations.

## Releases or main

A fresh install follows release tags, so `hyprsimple-update` on its own moves you from one release to the next and never to an untagged commit.

```bash
hyprsimple-update            # stay on the channel you are already on
hyprsimple-update --stable   # switch to the newest release
hyprsimple-update main       # switch to main, and stay there
hyprsimple-update <branch>   # switch to any branch of origin, for testing
```

The choice sticks. Once you run `hyprsimple-update main`, every later bare `hyprsimple-update` pulls main until you run `hyprsimple-update --stable`. There is no config file behind this. The channel is whatever the checkout at `~/.local/share/hyprsimple` is on, which you can read with `hyprsimple-debug`.

Tracking main gets you fixes the day they merge, at the cost of landing on commits no release has covered.

**An update never edits your `~/.config` files on its own.** Only a migration does, and only when a default has to change. Every migration says what it touched.

A migration either makes one specific edit, or saves your version aside first. `hyprsimple-refresh-config <path>` writes `<file>.bak.<timestamp>` and prints the diff before replacing. A larger change may move your file to `<file>.pre-split.<timestamp>` and tell you where it went. Nothing is deleted.

Migrations run once per machine, and the state lives in `~/.local/state/hyprsimple/migrations`. A fresh install already ships every fix, so new users skip the history entirely. If one fails you can skip it and carry on. To reset a single config to the shipped default at any time:

```bash
hyprsimple-refresh-config hypr/hyprlock.conf
```

Writing a migration is documented in [`migrations/README.md`](https://github.com/rizukirr/hyprsimple/tree/main/migrations/README.md).

Some configs cannot be delivered automatically. `starship.toml` and `yazi/yazi.toml` are TOML, and that format has no include directive to hang a default off.

When an update changes one of those and you have your own version, `hyprsimple-update` says so and prints the command to take the new one. It only mentions a file this update changed, so editing something on purpose does not nag you every time.

## Theme templates

Writing a theme of your own is covered in [Theming](./theming), from `colors.toml` to the files each program reads.

Themes are rendered from the `.tpl` files in `~/.local/share/hyprsimple/.config/hypr/themes/templates`. The install owns them, so a template change reaches you through `hyprsimple-update` with no migration.

To change one, copy it to `~/.config/hypr/themes/templates.user/` under the same name and edit it there. That directory wins over the install, and a file in it with no shipped counterpart is rendered too, so you can add templates of your own.

Older installs have a copy of the templates at `~/.config/hypr/themes/templates`. That directory is not read, and an update removes it once every file in it is one hyprsimple shipped. If you had edited one, the whole directory is left alone and you are told which file it was, so you can move it to `templates.user/`.
