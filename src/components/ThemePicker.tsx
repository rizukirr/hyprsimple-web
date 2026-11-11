import React, { useEffect, useMemo, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import { EmptyState } from './Hypri';
import { THEMES, OPEN_PICKER, openPicker, setTheme, stepTheme, typing, useTheme, type Theme } from '@site/src/lib/theme';

export function Swatches({ theme, count = 8 }: { theme: Theme; count?: number }) {
  const keys = ['accent', 'color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'foreground'].slice(0, count);
  return (
    <span className="hs-swatches" aria-hidden="true">
      {keys.map((k) => (
        <span key={k} style={{ ['--sw' as string]: (theme.palette as Record<string, string>)[k] }} />
      ))}
    </span>
  );
}

function Card({ theme, active, onPick }: { theme: Theme; active: boolean; onPick: () => void }) {
  const src = useBaseUrl(`/wallpapers/${theme.slug}-s.webp`);
  return (
    <li>
      <button type="button" className="hs-pick" aria-pressed={active} onClick={onPick} data-slug={theme.slug}>
        <span className="hs-pick__wall" data-slot={`wall-${theme.slug}`} data-kind="product">
          <img src={src} alt="" width={560} height={Math.round((560 * theme.wall.height) / theme.wall.width)} loading="lazy" decoding="async" />
        </span>
        <span className="hs-pick__name">{theme.name}</span>
        <Swatches theme={theme} />
      </button>
    </li>
  );
}

export function ThemeButton() {
  const theme = useTheme();
  const { setColorMode } = useColorMode();
  // Docusaurus' own light and dark follow whichever hyprsimple theme is on.
  useEffect(() => {
    setColorMode(theme.light ? 'light' : 'dark');
  }, [theme.light, setColorMode]);
  return (
    <button type="button" className="hs-theme-button" onClick={openPicker} aria-haspopup="dialog" title="Switch theme (T)">
      <Swatches theme={theme} count={4} />
      <span className="hs-theme-button__name">{theme.name}</span>
      <kbd>T</kbd>
    </button>
  );
}

// Mounted once, in Root, so the shortcuts and the dialog never double up.
export function PickerDialog() {
  const theme = useTheme();
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const open = () => {
      setQuery('');
      dialog.current?.showModal();
      requestAnimationFrame(() => {
        dialog.current?.querySelector<HTMLButtonElement>('.hs-pick[aria-pressed="true"]')?.scrollIntoView({ block: 'nearest' });
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e) || dialog.current?.open) return;
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); open(); }
      else if (e.key === ']') stepTheme(1);
      else if (e.key === '[') stepTheme(-1);
    };
    window.addEventListener(OPEN_PICKER, open);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_PICKER, open);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? THEMES.filter((t) => t.name.toLowerCase().includes(q) || t.slug.includes(q) || (q === 'light' ? t.light : q === 'dark' ? !t.light : false)) : THEMES;
  }, [query]);

  const pick = (slug: string) => {
    setTheme(slug);
    dialog.current?.close();
  };

  return (
    <dialog
        ref={dialog}
        className="hs-picker"
        aria-label="Switch theme"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="hs-picker__head">
          <h2>Switch theme</h2>
          <input
            type="search"
            name="theme-filter"
            autoComplete="off"
            placeholder="Filter by name, or type light or dark"
            aria-label="Filter themes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && shown[0]) pick(shown[0].slug);
            }}
          />
          <button type="button" className="hs-key" onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <p className="hs-picker__hint">
          The same forty themes as <kbd>SUPER</kbd> <kbd>SHIFT</kbd> <kbd>T</kbd> on the desktop. <kbd>[</kbd> and <kbd>]</kbd> step through them anywhere on this site.
        </p>
        {shown.length ? (
          <ul className="hs-picker__grid">
            {shown.map((t) => (
              <Card key={t.slug} theme={t} active={t.slug === theme.slug} onPick={() => pick(t.slug)} />
            ))}
          </ul>
        ) : (
          <div className="hs-picker__empty">
            <EmptyState art="empty-theme">
              <p>No theme matches "{query}".</p>
              <p>Clear the filter to see all forty, or type light or dark.</p>
            </EmptyState>
          </div>
        )}
      </dialog>
  );
}
