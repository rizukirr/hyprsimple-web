// Builds everything the site reads from a hyprsimple checkout, so the site never holds a second copy of the docs or the themes. The checkout is HYPRSIMPLE_PATH, or ../hyprsimple beside this repository. It writes:
//
//   docs/                        README split by section, plus FAQ, PLUGINS, THEMING
//   src/data/themes.json         every theme's palette, mode and wallpaper
//   src/data/keys.json           the keybinding tables from the README
//   src/css/themes.generated.css one token block per theme
//   static/wallpapers/           a resized copy of each theme's first wallpaper
import { readFile, writeFile, mkdir, readdir, rm, access } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseToml } from 'smol-toml';
import sharp from 'sharp';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = resolve(process.env.HYPRSIMPLE_PATH || join(SITE, '..', 'hyprsimple'));
const REPO = 'https://github.com/rizukirr/hyprsimple';
const THEMES = join(ROOT, '.config/hypr/themes');
const DEFAULT_THEME = 'deep-sea';

const exists = (p) => access(p).then(() => true, () => false);

// ---------------------------------------------------------------- docs

// Every README section becomes a page, in this order. Demo, FAQ and License have no page: the overview covers them, or they are dropped.
const README_PAGES = [
  { heading: null, id: 'overview', title: 'Overview', extra: ['Features'] },
  { heading: 'Install', id: 'install' },
  { heading: 'Update', id: 'update', title: 'Update and channels' },
  { heading: 'Uninstall', id: 'uninstall' },
  { heading: 'Keybindings', id: 'keybindings' },
  { heading: 'Scripts', id: 'scripts' },
  { heading: 'Audio', id: 'audio' },
  { heading: 'Network', id: 'network' },
];
const OTHER_PAGES = [
  { file: 'THEMING.md', id: 'theming', title: 'Theming' },
  { file: 'PLUGINS.md', id: 'plugins', title: 'Plugins' },
  { file: 'FAQ.md', id: 'faq', title: 'FAQ' },
];

const ROOT_DOC_LINKS = { 'PLUGINS.md': 'plugins', 'FAQ.md': 'faq', 'THEMING.md': 'theming', 'README.md': 'overview' };

function splitSections(md) {
  const lines = md.split('\n');
  const sections = [];
  let current = { heading: null, body: [] };
  let fence = false;
  for (const line of lines) {
    if (/^```/.test(line)) fence = !fence;
    const m = !fence && /^## (.+)$/.exec(line);
    if (m) {
      sections.push(current);
      current = { heading: m[1].trim(), body: [] };
    } else current.body.push(line);
  }
  sections.push(current);
  return sections;
}

// GitHub callouts become Docusaurus admonitions.
function admonitions(md) {
  const kinds = { NOTE: 'note', TIP: 'tip', IMPORTANT: 'info', WARNING: 'warning', CAUTION: 'danger' };
  return md.replace(/^> \[!(\w+)\]\n((?:>.*\n?)*)/gim, (_, kind, body) => {
    const text = body.replace(/^> ?/gm, '').replace(/\n+$/, '');
    const title = kind[0].toUpperCase() + kind.slice(1).toLowerCase();
    return `:::${kinds[kind.toUpperCase()] ?? 'note'}[${title}]\n\n${text}\n\n:::\n`;
  });
}

function links(md) {
  return md.replace(/\]\(([^)\s]+)\)/g, (all, target) => {
    if (/^(https?:|mailto:|#)/.test(target)) return all;
    const [path, hash] = target.split('#');
    if (ROOT_DOC_LINKS[path]) return `](./${ROOT_DOC_LINKS[path]}${hash ? `#${hash}` : ''})`;
    return `](${REPO}/tree/main/${path.replace(/^\.\//, '')}${hash ? `#${hash}` : ''})`;
  });
}

function page(id, title, position, body) {
  const front = `---\nid: ${id}\ntitle: ${JSON.stringify(title)}\nsidebar_position: ${position}\ncustom_edit_url: null\n---\n\n`;
  return front + admonitions(links(body)).trim() + '\n';
}

async function syncDocs() {
  const out = join(SITE, 'docs');
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  const readme = await readFile(join(ROOT, 'README.md'), 'utf8');
  const sections = splitSections(readme);
  const byHeading = new Map(sections.map((s) => [s.heading, s.body.join('\n')]));
  // A section nobody placed would vanish from the site without a word.
  const placed = new Set([null, 'Demo', 'FAQ', 'License', ...README_PAGES.flatMap((p) => [p.heading, ...(p.extra ?? [])])]);
  const unplaced = sections.map((s) => s.heading).filter((h) => !placed.has(h));
  if (unplaced.length) throw new Error(`README sections with no page: ${unplaced.join(', ')}. Add them to README_PAGES in scripts/sync.mjs of hyprsimple-web`);
  let position = 1;

  for (const p of README_PAGES) {
    let body;
    if (p.heading === null) {
      // The intro, without the H1 and the README's embedded screenshot.
      body = byHeading.get(null).replace(/^# .*\n/, '').replace(/<img [^>]*\/>\n?/g, '');
      for (const extra of p.extra) body += `\n## ${extra}\n${byHeading.get(extra)}`;
    } else {
      const raw = byHeading.get(p.heading);
      if (raw === undefined) throw new Error(`README has no "## ${p.heading}" section`);
      body = raw.replace(/^### /gm, '## ').replace(/^#### /gm, '### ');
    }
    await writeFile(join(out, `${p.id}.md`), page(p.id, p.title ?? p.heading, position++, body));
  }

  for (const p of OTHER_PAGES) {
    const raw = await readFile(join(ROOT, p.file), 'utf8');
    await writeFile(join(out, `${p.id}.md`), page(p.id, p.title, position++, raw.replace(/^# .*\n/, '')));
  }

  return byHeading.get('Keybindings');
}

// ---------------------------------------------------------------- keys

function parseKeys(section) {
  const groups = [];
  let group = null;
  for (const line of section.split('\n')) {
    const h = /^### (.+)$/.exec(line);
    if (h) { group = { name: h[1].trim(), bindings: [] }; groups.push(group); continue; }
    const row = /^\| `([^`]+)` \| (.+?) \|\s*$/.exec(line);
    if (row && group) group.bindings.push({ combo: row[1].trim(), action: row[2].trim() });
  }
  return groups.filter((g) => g.bindings.length);
}

// ---------------------------------------------------------------- colour

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};
const rgbToHex = (rgb) => '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('');
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (hex) => { const [r, g, b] = hexToRgb(hex).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const mix = (a, b, t) => { const A = hexToRgb(a), B = hexToRgb(b); return rgbToHex(A.map((c, i) => c + (B[i] - c) * t)); };

// Moves a colour towards `toward` until it reads at `ratio` on `surface`, and leaves it untouched when it already does, the way hyprsimple's bar does.
function readable(color, surface, ratio, toward) {
  for (let t = 0; t <= 1.0001; t += 0.04) {
    const c = mix(color, toward, t);
    if (contrast(c, surface) >= ratio) return c;
  }
  return toward;
}

function tokensFor(c, light) {
  const bg = c.background, fg = c.foreground;
  const far = light ? '#000000' : '#ffffff';
  const paper2 = mix(bg, fg, 0.045);
  const paper3 = mix(bg, fg, 0.09);
  const ink = readable(fg, bg, 7, far);
  const muted = readable(mix(fg, bg, 0.3), paper2, 4.6, far);
  const accent = readable(c.accent, paper2, 4.6, far);
  const accentInk = contrast(bg, accent) >= contrast(ink, accent) ? bg : ink;
  // Code runs on the terminal's own ground, a step away from the page.
  const code = light ? mix(bg, fg, 0.06) : mix(bg, '#000000', 0.28);
  const ansi = Array.from({ length: 16 }, (_, i) => c[`color${i}`]);
  const syn = (i) => readable(ansi[i], code, 4.6, light ? '#000000' : '#ffffff');
  return {
    '--color-paper': bg,
    '--color-paper-2': paper2,
    '--color-paper-3': paper3,
    '--color-ink': ink,
    '--color-ink-2': mix(ink, bg, 0.14),
    '--color-muted': muted,
    '--color-rule': mix(bg, fg, 0.14),
    '--color-rule-2': readable(mix(bg, fg, 0.26), bg, 3, far),
    '--color-accent': accent,
    '--color-accent-ink': accentInk,
    '--color-accent-wash': mix(bg, c.accent, light ? 0.1 : 0.16),
    '--color-accent-edge': mix(accent, light ? '#000000' : bg, 0.35),
    '--color-focus': readable(c.accent, bg, 3.2, far),
    '--color-key-face': light ? mix(bg, '#ffffff', 0.6) : mix(bg, fg, 0.08),
    '--color-key-edge': mix(bg, light ? '#000000' : '#000000', light ? 0.2 : 0.45),
    '--color-code': code,
    '--color-code-2': mix(code, fg, 0.07),
    '--color-code-ink': readable(fg, code, 7, far),
    '--color-code-muted': readable(mix(fg, code, 0.4), code, 4.6, far),
    '--color-syn-string': syn(2),
    '--color-syn-keyword': syn(5),
    '--color-syn-func': syn(4),
    '--color-syn-number': syn(3),
    '--color-syn-type': syn(6),
    '--color-syn-danger': syn(1),
    ...Object.fromEntries(ansi.map((v, i) => [`--color-ansi-${i}`, v])),
    '--color-wall': bg,
  };
}

// ---------------------------------------------------------------- themes

const pretty = (slug) => slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
  .replace('Rosepine', 'Rosé Pine').replace('Catppuccin Latte', 'Catppuccin Latte').replace('Github', 'GitHub');

async function syncThemes() {
  const wallOut = join(SITE, 'static/wallpapers');
  await mkdir(wallOut, { recursive: true });
  const slugs = (await readdir(THEMES, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && d.name !== 'templates')
    .map((d) => d.name)
    .sort();

  const themes = [];
  const css = ['/* Generated by scripts/sync.mjs from .config/hypr/themes. Do not edit. */'];
  for (const slug of slugs) {
    const dir = join(THEMES, slug);
    if (!(await exists(join(dir, 'colors.toml')))) continue;
    const colors = parseToml(await readFile(join(dir, 'colors.toml'), 'utf8'));
    const light = await exists(join(dir, 'light.mode'));
    const walls = (await readdir(join(dir, 'backgrounds'))).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort();

    for (const [suffix, width, quality] of [['', 1600, 70], ['-s', 560, 62]]) {
      const target = join(wallOut, `${slug}${suffix}.webp`);
      if (!(await exists(target))) {
        await sharp(join(dir, 'backgrounds', walls[0])).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(target);
      }
    }
    const meta = await sharp(join(wallOut, `${slug}.webp`)).metadata();

    const tokens = tokensFor(colors, light);
    css.push(`html[data-hs-theme="${slug}"] {\n  color-scheme: ${light ? 'light' : 'dark'};\n${Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`);
    themes.push({
      slug,
      name: pretty(slug),
      light,
      wallpapers: walls.length,
      wall: { width: meta.width, height: meta.height },
      palette: Object.fromEntries(['accent', 'background', 'foreground', 'cursor', 'selection_foreground', 'selection_background', ...Array.from({ length: 16 }, (_, i) => `color${i}`)].map((k) => [k, colors[k]])),
    });
  }

  await writeFile(join(SITE, 'src/css/themes.generated.css'), css.join('\n\n') + '\n');
  return themes;
}

// ---------------------------------------------------------------- mascot

// Web copies of Hypri from branding/mascot/assets, the full-size art kept in this repository.
const MASCOT = join(SITE, 'branding/mascot/assets');
const MASCOT_OUT = join(SITE, 'static/img/mascot');

async function syncMascot() {
  await mkdir(MASCOT_OUT, { recursive: true });
  const src = (f) => join(MASCOT, f);
  const out = (f) => join(MASCOT_OUT, f);
  const jobs = [
    ['favicon.ico', async () => writeFile(out('favicon.ico'), await readFile(src('hypri-favicon.ico')))],
    ['icon-64.png', () => sharp(src('hypri-icon-64.png')).png().toFile(out('icon-64.png'))],
    ['icon-180.png', () => sharp(src('hypri-icon-180.png')).png().toFile(out('icon-180.png'))],
    ['social.jpg', () => sharp(src('hyprsimple-social-1200x630.png')).jpeg({ quality: 86, mozjpeg: true }).toFile(out('social.jpg'))],
    ['empty.webp', () => sharp(src('a_detailed_anime_style_digital_illustration_in_a.png')).flatten({ background: '#181e45' }).resize({ width: 960 }).webp({ quality: 78 }).toFile(out('empty.webp'))],
    // The source has a broken cutout in its top right corner. Flattening onto the scene's own navy fills it.
    ['lost.webp', () => sharp(src('a_detailed_anime_style_digital_illustration_a_se.png')).flatten({ background: '#181e45' }).resize({ width: 1280 }).webp({ quality: 78 }).toFile(out('lost.webp'))],
  ];
  for (const [name, make] of jobs) if (!(await exists(out(name)))) await make();
  return jobs.length;
}

// ---------------------------------------------------------------- main

if (!(await exists(join(ROOT, 'README.md'))) || !(await exists(THEMES))) {
  console.error(`sync: no hyprsimple checkout at ${ROOT}. Clone it beside this repository, or set HYPRSIMPLE_PATH.`);
  process.exit(1);
}
await mkdir(join(SITE, 'src/data'), { recursive: true });
const keySection = await syncDocs();
const themes = await syncThemes();
const keys = parseKeys(keySection);
const mascot = await syncMascot();
const template = await readFile(join(THEMES, 'templates/ghostty.conf.tpl'), 'utf8');
const scripts = (await readdir(join(ROOT, '.local/bin'))).filter((f) => !f.startsWith('.')).length;
const version = (await readFile(join(ROOT, 'version'), 'utf8')).trim();

await writeFile(join(SITE, 'src/data/themes.json'), JSON.stringify({ defaultTheme: DEFAULT_THEME, themes }, null, 1));
await writeFile(join(SITE, 'src/data/keys.json'), JSON.stringify(keys, null, 1));
await writeFile(join(SITE, 'src/data/repo.json'), JSON.stringify({ version, scripts, ghosttyTemplate: template }, null, 1));
console.log(`sync: ${ROOT}, ${themes.length} themes, ${keys.reduce((n, g) => n + g.bindings.length, 0)} bindings, ${scripts} scripts, ${mascot} mascot images, v${version}`);
