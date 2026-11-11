// Checks the docs against a hyprsimple checkout, so they cannot drift from what hyprsimple ships. These checks lived in hyprsimple's own test suites while the docs lived there. The checkout is HYPRSIMPLE_PATH, or ../hyprsimple beside this repository.
//
// The pages that used to be the README stand in for README.md, and docs/faq.md for FAQ.md, so each check means what it meant before the move.
import { readFile, readdir, access } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = resolve(process.env.HYPRSIMPLE_PATH || join(SITE, '..', 'hyprsimple'));
const DOCS = join(SITE, 'docs');
const README_PAGES = ['overview', 'install', 'update', 'uninstall', 'keybindings', 'scripts', 'audio', 'network'];

let failures = 0;
const pass = (m) => console.log(`ok - ${m}`);
const fail = (m) => {
  console.error(`not ok - ${m}`);
  failures++;
};
const check = (m, got, want) => (got === want ? pass(m) : fail(`${m} (want ${JSON.stringify(want)}, got ${JSON.stringify(got)})`));
const count = (text, needle) => text.split(needle).length - 1;
const exists = (p) => access(p).then(() => true, () => false);
const page = (id) => readFile(join(DOCS, `${id}.md`), 'utf8');
const sorted = (xs) => [...new Set(xs)].sort();

if (!(await exists(join(ROOT, 'default/hypr')))) {
  console.error(`check-docs: no hyprsimple checkout at ${ROOT}. Clone it beside this repository, or set HYPRSIMPLE_PATH.`);
  process.exit(1);
}

const readme = (await Promise.all(README_PAGES.map(page))).join('\n');
const faq = await page('faq');
const keysPage = await page('keybindings');

// ---------------------------------------------------------------- keybindings
//
// Every key hyprsimple binds is documented, and every documented key is bound. Descriptions are prose and are not compared, except for the one row pinned below.

const luaFiles = [join(ROOT, 'default/hypr/bindings.lua')];
for (const dir of ['default/hypr/bindings', '.config/hypr/bindings']) {
  const abs = join(ROOT, dir);
  if (await exists(abs)) for (const f of (await readdir(abs)).filter((f) => f.endsWith('.lua')).sort()) luaFiles.push(join(abs, f));
}
let lua = '';
for (const f of luaFiles) if (await exists(f)) lua += (await readFile(f, 'utf8')).replace(/^[ \t]*--.*$/gm, '') + '\n';
// Flattened before matching, because several binds put the key on the line after hl.bind(.
const flat = lua.replace(/\n/g, ' ');
// workspaces.lua builds its keys in a loop, so a literal match sees only the prefix "SUPER + ". Those are dropped and the loop is checked on its own.
const bound = sorted([...flat.matchAll(/hl\.bind\(\s*"([^"]*)"/g)].map((m) => m[1])).filter((k) => k && !/\+ $/.test(k));

if (bound.length < 40) fail(`found only ${bound.length} bindings, so the extractor is not reading the files`);
else pass(`read ${bound.length} bindings from the config`);
check('a commented-out example is not counted as a binding', bound.includes('SUPER + O'), false);
check('and a real binding beside it still is', bound.includes('SUPER + A'), true);

const documented = sorted([...keysPage.matchAll(/^\| `([^`]+)`/gm)].map((m) => m[1]));
if (documented.length < 30) fail(`found only ${documented.length} documented keys, so the page was not read`);
else pass(`read ${documented.length} keys from docs/keybindings.md`);
check('and no script names were read as keys', documented.filter((k) => k.endsWith('.sh')).length, 0);

// One row standing for several keys is easier to read than ten rows. Written out rather than pattern matched, so adding a shorthand is a deliberate act.
const EXPAND = {
  'SUPER + [1-9, 0]': [],
  'SUPER + SHIFT + [1-9, 0]': [],
  'SUPER + H / J / K / L': ['H', 'J', 'K', 'L'].map((k) => `SUPER + ${k}`),
  'SUPER + SHIFT + Arrow': ['UP', 'DOWN', 'LEFT', 'RIGHT'].map((k) => `SUPER + SHIFT + ${k}`),
  'SUPER + CTRL + Arrow': ['UP', 'DOWN', 'LEFT', 'RIGHT'].map((k) => `SUPER + CTRL + ${k}`),
  'SUPER + LMB drag': ['SUPER + mouse:272'],
  'SUPER + RMB drag': ['SUPER + mouse:273'],
  'SUPER + Scroll': ['SUPER + mouse_up', 'SUPER + mouse_down'],
  'SUPER + /': ['SUPER + slash'],
  'SUPER + ESC': ['SUPER + ESCAPE'],
  'CTRL + ESC': ['CTRL + ESCAPE'],
  'Volume Up / Down': ['XF86AudioRaiseVolume', 'XF86AudioLowerVolume'],
  Mute: ['XF86AudioMute'],
  'Mic Mute': ['XF86AudioMicMute'],
  'Play / Pause': ['XF86AudioPlay', 'XF86AudioPause'],
  'Next / Prev': ['XF86AudioNext', 'XF86AudioPrev'],
  'Brightness Up / Down': ['XF86MonBrightnessUp', 'XF86MonBrightnessDown'],
  'Kbd Brightness Up / Down': ['XF86KbdBrightnessUp', 'XF86KbdBrightnessDown'],
};
const expanded = sorted(documented.flatMap((k) => EXPAND[k] ?? [k]));
if (expanded.length > documented.length) pass(`the shorthand rows expand to ${expanded.length} keys`);
else fail(`expansion produced ${expanded.length} keys from ${documented.length} rows, so it is doing nothing`);

check('every key hyprsimple binds is in the docs', bound.filter((k) => !expanded.includes(k)).join(' '), '');
check('and every key the docs document is bound', expanded.filter((k) => !bound.includes(k)).join(' '), '');

const ws = (await readFile(join(ROOT, 'default/hypr/bindings/workspaces.lua'), 'utf8')).replace(/\n/g, ' ');
check('workspaces are bound in a loop over all ten', count(ws, 'for ws = 1, 10 do'), 1);
check('which binds a plain key per workspace', count(ws, 'hl.bind("SUPER + " .. key'), 1);
check('and a shifted one to move a window there', (ws.match(/hl\.bind\(\s*"SUPER \+ SHIFT \+ " \.\. key/g) ?? []).length, 1);
check('and the docs document both rows', documented.filter((k) => /^SUPER \+ (SHIFT \+ )?\[1-9, 0\]$/.test(k)).length, 2);

// A row whose key was right and whose description was wrong once sent people to the wrong screenshot mode, so this one description is pinned.
check('the docs describe Print as taking the screenshot itself', count(keysPage, 'Print` | Take a screenshot: drag a region, click a window'), 1);

// ---------------------------------------------------------------- scripts

const shipped = (await readdir(join(ROOT, '.local/bin'), { withFileTypes: true })).filter((d) => d.isFile()).map((d) => d.name).sort();
const named = sorted([...readme.matchAll(/`([a-zA-Z0-9_.-]+\.(?:sh|fish)|hyprsimple-plugin)`/g)].map((m) => m[1]));
if (shipped.length < 20) fail(`found ${shipped.length} scripts in .local/bin, which is too few to be right`);
else if (named.length < 20) fail(`found ${named.length} script names in the docs, which is too few to be right`);
else pass(`comparing ${shipped.length} shipped scripts against ${named.length} named in the docs`);
check('every script in .local/bin is named in the docs', shipped.filter((s) => !named.includes(s)).join(' '), '');
const notShipped = [];
for (const n of named) if (n !== 'install.sh' && n !== 'bootstrap.sh' && !(await exists(join(ROOT, '.local/bin', n)))) notShipped.push(n);
check('and every script the docs name is one that ships', notShipped.join(' '), '');

// ---------------------------------------------------------------- facts the suites pinned

const themes = [];
for (const d of await readdir(join(ROOT, '.config/hypr/themes'), { withFileTypes: true })) {
  if (d.isDirectory() && (await exists(join(ROOT, '.config/hypr/themes', d.name, 'colors.toml')))) themes.push(d.name);
}
check('the overview counts the themes hyprsimple ships', count(await page('overview'), `**${themes.length} themes**`), 1);

for (const [name, text] of [['the docs', readme], ['the FAQ', faq]]) {
  if (text.includes('hyprsimple-audio-autoswitch.service')) pass(`${name} say how to turn audio autoswitching off`);
  else fail(`${name} do not mention hyprsimple-audio-autoswitch.service, so there is no way to find it`);
  if (text.includes('--interactive')) pass(`${name} document --interactive`);
  else fail(`${name} do not mention --interactive, so the flag is undocumented`);
}
check('the FAQ explains why the audio was stuck, not just how to fix it', count(faq, '30000 + priority'), 1);
check('the install docs say the password is asked for once', count(readme, 'sudo password once'), 1);
check('the FAQ says what an unattended upgrade gives up', count(faq, 'including which packages to replace'), 1);
check('the docs no longer list hyprsunset.conf among the TOML configs', (readme.match(/hyprsunset\.conf. are TOML/g) ?? []).length, 0);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nall checks passed');
