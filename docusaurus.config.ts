import type { Config, LoadContext, Plugin } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import themeData from './src/data/themes.json';

const REPO = 'https://github.com/rizukirr/hyprsimple';

// Puts the chosen hyprsimple theme on <html> before first paint, and tells Docusaurus whether that theme is light or dark, so nothing flashes.
const themeBootstrap = ({ baseUrl }: LoadContext): Plugin => ({
  name: 'hyprsimple-theme-bootstrap',
  injectHtmlTags() {
    const light = themeData.themes.filter((t) => t.light).map((t) => t.slug);
    const known = themeData.themes.map((t) => t.slug);
    const script = `(function(){try{var k=${JSON.stringify(known)},l=${JSON.stringify(light)},s=localStorage.getItem('hs-theme');if(k.indexOf(s)<0)s=${JSON.stringify(themeData.defaultTheme)};document.documentElement.setAttribute('data-hs-theme',s);localStorage.setItem('theme',l.indexOf(s)<0?'dark':'light');}catch(e){document.documentElement.setAttribute('data-hs-theme',${JSON.stringify(themeData.defaultTheme)});}})();`;
    return {
      headTags: [
        { tagName: 'script', innerHTML: script },
        { tagName: 'link', attributes: { rel: 'apple-touch-icon', href: `${baseUrl}img/mascot/icon-180.png` } },
        { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
        {
          tagName: 'link',
          attributes: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
          },
        },
      ],
    };
  },
});

const config: Config = {
  title: 'hyprsimple',
  tagline: 'Minimalist Hyprland dotfiles for Arch Linux, with forty themes every app follows.',
  favicon: 'img/mascot/favicon.ico',
  url: 'https://rizukirr.github.io',
  // GitHub Pages serves this repository under its own name.
  baseUrl: '/hyprsimple-web/',
  organizationName: 'rizukirr',
  projectName: 'hyprsimple-web',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',
  markdown: { format: 'detect', hooks: { onBrokenMarkdownLinks: 'throw' } },
  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: { sidebarPath: './sidebars.ts', routeBasePath: 'docs' },
        blog: false,
        theme: { customCss: ['./src/css/themes.generated.css', './src/css/custom.css'] },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [themeBootstrap],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      { hashed: true, indexBlog: false, docsRouteBasePath: 'docs', highlightSearchTermsOnTargetPage: true, searchBarShortcutHint: true },
    ],
  ],

  themeConfig: {
    image: 'img/mascot/social.jpg',
    colorMode: { defaultMode: 'dark', disableSwitch: false, respectPrefersColorScheme: false },
    navbar: {
      title: 'hyprsimple',
      logo: { alt: 'hyprsimple home', src: 'img/mascot/icon-64.png', width: 32, height: 32 },
      hideOnScroll: false,
      items: [
        { type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs' },
        { to: '/keys', label: 'Keys', position: 'left' },
        { to: '/docs/theming', label: 'Theming', position: 'left' },
        { to: '/docs/plugins', label: 'Plugins', position: 'left' },
        { type: 'search', position: 'right' },
        { href: REPO, label: 'GitHub', position: 'right' },
      ],
    },
    docs: { sidebar: { hideable: true, autoCollapseCategories: true } },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    prism: {
      // No colours of its own: tokens take the active theme's palette in CSS.
      theme: { plain: {}, styles: [] },
      darkTheme: { plain: {}, styles: [] },
      additionalLanguages: ['bash', 'toml', 'lua', 'json', 'ini'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
