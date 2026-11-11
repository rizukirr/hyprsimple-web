# hyprsimple-web

The documentation site for [hyprsimple](https://github.com/rizukirr/hyprsimple), built with Docusaurus, and the home of hyprsimple's docs.

The docs are the Markdown files in `docs/`. Edit them here: every page has an "Edit this page" link to its file. A new page also needs a place in `sidebars.ts`.

The site still reads a hyprsimple checkout, `HYPRSIMPLE_PATH` when it is set and `../hyprsimple` beside this repository otherwise, for what the docs describe:

- Every theme in `.config/hypr/themes/` becomes a token block in `src/css/themes.generated.css`, with its colours nudged until text reads on them, and its first wallpaper is resized into `static/wallpapers/`.
- `scripts/check-docs.mjs` holds the docs to the checkout. Every key hyprsimple binds has a row in `docs/keybindings.md` and every row is a key it binds, every script in `.local/bin` is named in the docs and every script they name ships, and the theme count in the overview is the real one. It fails and names what drifted.

The keybinding tables in `docs/keybindings.md` also become `src/data/keys.json`, which drives the keyboard on the home page and on `/keys`. The art in `branding/mascot/` gets web copies in `static/img/mascot/`. Everything `scripts/sync.mjs` writes is ignored by git.

```bash
git clone https://github.com/rizukirr/hyprsimple.git ../hyprsimple   # once
npm ci
npm start        # sync, then a dev server on localhost:3000/hyprsimple-web/
npm run check    # the docs against the checkout
npm run build    # sync, then a static build in build/
HYPRSIMPLE_PATH=~/src/hyprsimple npm start                        # a checkout somewhere else
```

`.github/workflows/docs.yml` checks the docs against hyprsimple's newest release tag, builds, and publishes to GitHub Pages on every push to main, once a day, and on demand. Pull requests only build and check. A change to the docs is live as soon as it reaches main, so docs for something not yet released wait on a branch until hyprsimple tags it.
