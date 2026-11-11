import { useSyncExternalStore } from 'react';
import data from '@site/src/data/themes.json';

export type Theme = (typeof data.themes)[number];
export const THEMES: Theme[] = data.themes;
export const DEFAULT_THEME: string = data.defaultTheme;

const listeners = new Set<() => void>();

function current(): string {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  return document.documentElement.dataset.hsTheme || DEFAULT_THEME;
}

export function setTheme(slug: string): void {
  if (!THEMES.some((t) => t.slug === slug)) return;
  document.documentElement.dataset.hsTheme = slug;
  try {
    localStorage.setItem('hs-theme', slug);
  } catch {
    // Private windows may refuse storage; the theme still applies for this visit.
  }
  listeners.forEach((l) => l());
}

export function stepTheme(by: number): void {
  const i = THEMES.findIndex((t) => t.slug === current());
  setTheme(THEMES[(i + by + THEMES.length) % THEMES.length].slug);
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useTheme(): Theme {
  const slug = useSyncExternalStore(subscribe, current, () => DEFAULT_THEME);
  return THEMES.find((t) => t.slug === slug) ?? THEMES[0];
}

// Opening the picker from anywhere on the page (a hero key, a shortcut).
export const OPEN_PICKER = 'hs:open-picker';
export const openPicker = () => window.dispatchEvent(new Event(OPEN_PICKER));

export const typing = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
};
