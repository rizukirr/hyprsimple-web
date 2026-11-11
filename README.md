# hyprsimple-web

The documentation site for [hyprsimple](https://github.com/rizukirr/hyprsimple), built with Docusaurus.

It keeps no copy of the docs. `scripts/sync.mjs` reads them from a hyprsimple checkout on every start and build: `HYPRSIMPLE_PATH` when it is set, otherwise `../hyprsimple` beside this repository.

- hyprsimple's `README.md` is split into one page per section, and `FAQ.md`, `PLUGINS.md` and `THEMING.md` become pages of their own. Edit those files in hyprsimple, not anything under `docs/` here.
- Every theme in `.config/hypr/themes/` becomes a token block in `src/css/themes.generated.css`, with its colours nudged until text reads on them, and its first wallpaper is resized into `static/wallpapers/`.
- The keybinding tables in the README become `src/data/keys.json`, which drives the keyboard on the home page and on `/keys`.

All of those are generated and ignored by git.

```bash
git clone https://github.com/rizukirr/hyprsimple.git ../hyprsimple   # once
npm ci
npm start        # sync, then a dev server on localhost:3000/hyprsimple-web/
npm run build    # sync, then a static build in build/
HYPRSIMPLE_PATH=~/src/hyprsimple npm start                        # a checkout somewhere else
```

The site is built from whatever the checkout has. To preview docs for a branch of hyprsimple, check that branch out there first.

A new README section in hyprsimple needs a line in `README_PAGES` in `scripts/sync.mjs` and a place in `sidebars.ts`. Until it has one, the build stops and names the section.

`.github/workflows/docs.yml` builds from hyprsimple's newest release tag and publishes to GitHub Pages on every push to main, once a day, and on demand. Pull requests only build.
