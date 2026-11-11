import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl, { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import BrowserOnly from '@docusaurus/BrowserOnly';
import repo from '@site/src/data/repo.json';
import { THEMES, openPicker, setTheme, useTheme } from '@site/src/lib/theme';
import ThemeStage from '@site/src/components/ThemeStage';
import Keyboard from '@site/src/components/Keyboard';
import Mapping from '@site/src/components/Mapping';
import Command from '@site/src/components/Command';
import { Swatches } from '@site/src/components/ThemePicker';

const INSTALL = ['git clone https://github.com/rizukirr/hyprsimple.git', 'cd hyprsimple', './install.sh'];

function Hero() {
  return (
    <header className="hs-hero">
      <div className="container hs-hero__grid">
        <div className="hs-hero__text">
          <h1>Hyprland on Arch, nothing extra.</h1>
          <p className="lead">Forty themes, and every app follows the one you pick.</p>
          <div className="hs-actions">
            <Link className="hs-key hs-key--primary" to="/docs/install">
              Read the install guide
            </Link>
            <button type="button" className="hs-key" onClick={openPicker}>
              Try a theme
            </button>
          </div>
          <Command lines={INSTALL} label="Install commands" className="hs-hero__command" />
        </div>
        <BrowserOnly fallback={<StageFallback />}>{() => <ThemeStage />}</BrowserOnly>
      </div>
    </header>
  );
}

function StageFallback() {
  const t = THEMES.find((x) => x.slug === 'deep-sea') ?? THEMES[0];
  return (
    <figure className="hs-stage">
      <div className="hs-stage__frame" data-slot="hero" data-kind="product">
        <img src={useBaseUrl(`/wallpapers/${t.slug}.webp`)} alt={`${t.name} wallpaper`} width={t.wall.width} height={t.wall.height} fetchPriority="high" />
      </div>
    </figure>
  );
}

function Rail() {
  const active = useTheme();
  const { withBaseUrl } = useBaseUrlUtils();
  return (
    <section className="hs-section hs-rail-section" aria-labelledby="themes-head">
      <div className="container hs-split-head">
        <h2 id="themes-head">Forty themes, one key</h2>
        <p className="lead">The bar, terminal, lock screen and btop change together, and so does this site.</p>
      </div>
      <ul className="hs-rail" tabIndex={0} aria-label="Themes, scroll sideways">
        {THEMES.map((t) => (
          <li key={t.slug}>
            <button type="button" className="hs-tile" aria-pressed={t.slug === active.slug} onClick={() => setTheme(t.slug)}>
              <span className="hs-tile__wall" data-slot={`rail-${t.slug}`} data-kind="product">
                <img src={withBaseUrl(`/wallpapers/${t.slug}-s.webp`)} alt="" width={560} height={Math.round((560 * t.wall.height) / t.wall.width)} loading="lazy" decoding="async" />
              </span>
              <span className="hs-tile__name">{t.name}</span>
              <Swatches theme={t} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Palette() {
  return (
    <section className="hs-section hs-section--l" aria-labelledby="palette-head">
      <div className="container">
        <div className="hs-split-head">
          <h2 id="palette-head">One palette, every program</h2>
          <p className="lead">
            Templates turn one <code>colors.toml</code> into each app’s config. Here is ghostty’s.
          </p>
        </div>
        <BrowserOnly>{() => <Mapping />}</BrowserOnly>
        <p className="hs-more">
          <Link to="/docs/theming">Write your own theme</Link>
        </p>
      </div>
    </section>
  );
}

function Desktop() {
  return (
    <section className="hs-section hs-band" aria-labelledby="desktop-head">
      <div className="container">
        <h2 id="desktop-head">The desktop it installs</h2>
        <figure className="hs-showcase">
          <div className="hs-showcase__frame" data-slot="demo" data-kind="product" data-alt="The hyprsimple demo recording">
            <video
              controls
              playsInline
              preload="none"
              poster={useBaseUrl('/img/desktop.webp')}
              width={1920}
              height={1080}
              src="https://github.com/user-attachments/assets/f43671d7-4cd2-4cef-a13d-b3c28e432ccd"
            >
              <a href="https://github.com/rizukirr/hyprsimple#demo">Watch the demo on GitHub</a>
            </video>
          </div>
          <figcaption>The bar, the launcher and the theme carousel, recorded on a real install.</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Keys() {
  return (
    <section className="hs-section" aria-labelledby="keys-head">
      <div className="container">
        <div className="hs-split-head">
          <h2 id="keys-head">Every binding, on the keys</h2>
          <p className="lead">
            Hold a modifier, then point at a key. <kbd>SUPER</kbd> <kbd>/</kbd> shows the same list on the desktop.
          </p>
        </div>
        <Keyboard compact />
        <p className="hs-more">
          <Link to="/keys">Search all bindings</Link>
        </p>
      </div>
    </section>
  );
}

const DOCS = [
  { to: '/docs/install', title: 'Install', line: 'One sudo prompt at the start, then it runs to the end on its own.' },
  { to: '/docs/update', title: 'Update and channels', line: 'hyprsimple-update moves to the newest release and never overwrites your ~/.config.' },
  { to: '/docs/theming', title: 'Theming', line: 'Write a colors.toml, add a wallpaper, and the bar and terminals follow.' },
  { to: '/docs/plugins', title: 'Plugins', line: 'Add panels and widgets to the bar from a git repository.' },
  { to: '/docs/scripts', title: 'Scripts', line: `The ${repo.scripts} helpers in ~/.local/bin, and what each one does.` },
  { to: '/docs/faq', title: 'FAQ', line: 'NVIDIA hybrid laptops, bluetooth audio, a migration that failed.' },
];

function Manual() {
  return (
    <section className="hs-section hs-section--l" aria-labelledby="manual-head">
      <div className="container hs-manual">
        <h2 id="manual-head">From install to your own plugin</h2>
        <ol className="hs-rows">
          {DOCS.map((d) => (
            <li key={d.to}>
              <Link to={d.to} className="hs-row">
                <span className="hs-row__title">{d.title}</span>
                <span className="hs-row__line">{d.line}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="hs-section hs-close" aria-labelledby="close-head">
      <div className="container hs-close__grid">
        <div>
          <h2 id="close-head">Three lines to a desktop</h2>
          <p className="lead">Tested on a fresh Arch install with Hyprland picked during setup.</p>
        </div>
        <div className="hs-close__cmds">
          <Command lines={INSTALL} label="Install commands" />
          <Command lines={['hyprsimple-update']} label="Update command" />
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.ReactNode {
  return (
    <Layout
      title="Hyprland dotfiles for Arch Linux"
      description="hyprsimple is a minimalist Hyprland setup for Arch Linux, with forty themes that recolour the bar, terminal, lock screen and btop at once."
      wrapperClassName="hs-home"
    >
      <main>
        <Hero />
        <Rail />
        <Palette />
        <Desktop />
        <Keys />
        <Manual />
        <Close />
      </main>
    </Layout>
  );
}
