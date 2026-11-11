import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { openPicker } from '@site/src/lib/theme';

export default function NotFoundContent(): React.ReactNode {
  return (
    <main className="hs-lost">
      <div className="container hs-lost__grid">
        <figure className="hs-lost__art" data-slot="hypri-lost" data-kind="product">
          <img src={useBaseUrl('/img/mascot/lost.webp')} alt="Hypri, the hyprsimple mascot, sitting cross-legged and puzzled beside a large 404" width={1280} height={853} fetchPriority="high" />
        </figure>
        <div className="hs-lost__text">
          <h1>This page is not here</h1>
          <p className="lead">The link may point to a page that moved. The docs and the keybindings are a click away.</p>
          <div className="hs-actions">
            <Link className="hs-key hs-key--primary" to="/docs/overview">
              Open the docs
            </Link>
            <Link className="hs-key" to="/">
              Home page
            </Link>
          </div>
          <p className="hs-lost__hint">
            Or press <kbd>T</kbd> and <button type="button" className="hs-textbutton" onClick={openPicker}>switch theme</button> while you are here.
          </p>
        </div>
      </div>
    </main>
  );
}
