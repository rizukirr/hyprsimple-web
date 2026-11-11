import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import groups from '@site/src/data/keys.json';
import Keyboard, { Combo } from '@site/src/components/Keyboard';
import { EmptyState } from '@site/src/components/Hypri';

export default function Keys(): React.ReactNode {
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .map((g) => ({ ...g, bindings: q ? g.bindings.filter((b) => (b.combo + ' ' + b.action).toLowerCase().includes(q)) : g.bindings }))
      .filter((g) => g.bindings.length);
  }, [query]);
  const total = shown.reduce((n, g) => n + g.bindings.length, 0);

  return (
    <Layout title="Keybindings" description="Every hyprsimple keybinding, on a keyboard you can try and in a list you can search.">
      <main className="hs-keys-page">
        <header className="hs-section hs-section--top">
          <div className="container">
            <h1 className="hs-page-title">Keybindings</h1>
            <p className="lead">
              Hold a modifier, then point at a key. <kbd>SUPER</kbd> <kbd>/</kbd> opens this on the desktop.
            </p>
            <Keyboard />
          </div>
        </header>
        <section className="hs-section" aria-labelledby="list-head">
          <div className="container">
            <div className="hs-keys-page__bar">
              <h2 id="list-head">All bindings</h2>
              <input
                type="search"
                name="binding-filter"
                autoComplete="off"
                className="hs-input"
                placeholder="Filter, for example screenshot or SHIFT"
                aria-label="Filter bindings"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <p className="hs-keys-page__count" role="status">
              {total} {total === 1 ? 'binding' : 'bindings'}
            </p>
            {shown.map((g) => (
              <table key={g.name} className="hs-table">
                <caption>{g.name}</caption>
                <thead>
                  <tr>
                    <th scope="col">Keys</th>
                    <th scope="col">What it does</th>
                  </tr>
                </thead>
                <tbody>
                  {g.bindings.map((b) => (
                    <tr key={b.combo}>
                      <td><Combo combo={b.combo} /></td>
                      <td>{b.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
            {!total && (
              <EmptyState>
                <p>No binding matches "{query}".</p>
                <p>Clear the filter to see all of them, or search for a key such as SHIFT.</p>
              </EmptyState>
            )}
            <p className="hs-more">
              <Link to="/docs/keybindings">The same list, with notes, in the docs</Link>
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
