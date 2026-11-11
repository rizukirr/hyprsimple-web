import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

const LINKS = [
  { to: '/docs/overview', label: 'Docs' },
  { to: '/keys', label: 'Keybindings' },
  { to: '/docs/theming', label: 'Theming' },
  { to: '/docs/plugins', label: 'Plugins' },
  { to: '/docs/faq', label: 'FAQ' },
  { href: 'https://github.com/rizukirr/hyprsimple', label: 'GitHub' },
  { href: 'https://github.com/rizukirr/hyprsimple/issues', label: 'Report a problem' },
];

export default function Footer(): React.ReactNode {
  return (
    <footer className="hs-footer">
      <div className="container hs-footer__grid">
        <img className="hs-footer__hypri" src={useBaseUrl('/img/mascot/footer.webp')} alt="Hypri, the hyprsimple mascot, sitting and pointing at the links" width={560} height={574} loading="lazy" decoding="async" />
        <div className="hs-footer__body">
        <p className="hs-footer__mark" aria-hidden="true">hyprsimple</p>
        <nav aria-label="Footer">
          <ul>
            {LINKS.map((l) => (
              <li key={l.label}>{'to' in l ? <Link to={l.to}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}</li>
            ))}
          </ul>
        </nav>
        <p className="hs-footer__legal">MIT licensed. Wallpapers ship with each theme in the repository.</p>
        </div>
      </div>
    </footer>
  );
}
