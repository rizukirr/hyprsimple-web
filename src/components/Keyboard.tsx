import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import groups from '@site/src/data/keys.json';

// The README's keybinding tables, laid on a keyboard. Hold modifiers by
// clicking them; every key that does something with that set lights up.
// When the keyboard has focus, real key presses select keys too (SUPER
// stays a click, since the desktop keeps it for itself).

type Mod = 'SUPER' | 'SHIFT' | 'CTRL' | 'ALT';
const MODS: Mod[] = ['SUPER', 'SHIFT', 'CTRL', 'ALT'];

export type Binding = { combo: string; action: string; group: string; mods: Mod[]; keys: string[]; pointer: boolean };

const ALIASES: Record<string, string[]> = {
  ESC: ['Esc'],
  ARROW: ['←', '↑', '↓', '→'],
  PRINT: ['Print'],
  '/': ['/'],
};

function keysOf(main: string): string[] {
  const m = main.trim();
  const range = /^\[(\d)-(\d), (\d)\]$/.exec(m);
  if (range) {
    const out: string[] = [];
    for (let i = +range[1]; i <= +range[2]; i++) out.push(String(i));
    return out.concat(range[3]);
  }
  if (/^[A-Z](?: \/ [A-Z])+$/.test(m)) return m.split(' / ');
  const upper = m.toUpperCase();
  if (ALIASES[upper]) return ALIASES[upper];
  if (/^[A-Z0-9]$/.test(m)) return [m];
  return [];
}

export const BINDINGS: Binding[] = groups.flatMap((g) =>
  g.bindings.map((b) => {
    const parts = b.combo.split(' + ').map((p) => p.trim());
    const mods = parts.filter((p): p is Mod => (MODS as string[]).includes(p));
    const main = parts.filter((p) => !(MODS as string[]).includes(p)).join(' + ');
    return { ...b, group: g.name, mods, keys: keysOf(main), pointer: /drag|scroll/i.test(main) };
  }),
);

type K = { id: string; label?: string; w?: number; mod?: Mod };
const ROWS: K[][] = [
  [{ id: 'Esc' }, ...'1234567890'.split('').map((id) => ({ id })), { id: '-' }, { id: '=' }, { id: 'Backspace', label: '⌫', w: 2 }],
  [{ id: 'Tab', w: 1.5 }, ...'QWERTYUIOP'.split('').map((id) => ({ id })), { id: '[' }, { id: ']' }, { id: '\\', w: 1.5 }],
  [{ id: 'Caps', w: 1.75 }, ...'ASDFGHJKL'.split('').map((id) => ({ id })), { id: ';' }, { id: "'" }, { id: 'Enter', w: 2.25 }],
  [{ id: 'SHIFT', label: 'Shift', w: 2.25, mod: 'SHIFT' }, ...'ZXCVBNM'.split('').map((id) => ({ id })), { id: ',' }, { id: '.' }, { id: '/' }, { id: 'Print', w: 2.75 }],
  [{ id: 'CTRL', label: 'Ctrl', w: 1.5, mod: 'CTRL' }, { id: 'SUPER', label: 'Super', w: 1.5, mod: 'SUPER' }, { id: 'ALT', label: 'Alt', w: 1.5, mod: 'ALT' }, { id: 'Space', label: '', w: 5.5 }, { id: '←' }, { id: '↑' }, { id: '↓' }, { id: '→' }],
];

const sameMods = (a: Mod[], b: Set<Mod>) => a.length === b.size && a.every((m) => b.has(m));

const FROM_EVENT: Record<string, string> = { Escape: 'Esc', ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', PrintScreen: 'Print', ' ': 'Space' };

export function Combo({ combo }: { combo: string }) {
  return (
    <span className="hs-combo">
      {combo.split(' + ').map((p, i) => (
        <kbd key={i}>{p}</kbd>
      ))}
    </span>
  );
}

export default function Keyboard({ compact = false }: { compact?: boolean }) {
  const [held, setHeld] = useState<Set<Mod>>(new Set(['SUPER']));
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const live = useMemo(() => {
    const m = new Map<string, Binding[]>();
    for (const b of BINDINGS) if (sameMods(b.mods, held)) for (const k of b.keys) m.set(k, [...(m.get(k) ?? []), b]);
    return m;
  }, [held]);

  const focus = hovered ?? selected;
  const readout = focus ? BINDINGS.filter((b) => b.keys.includes(focus)) : [];

  const toggle = (mod: Mod) =>
    setHeld((h) => {
      const next = new Set(h);
      next.has(mod) ? next.delete(mod) : next.add(mod);
      return next;
    });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') return;
    const id = FROM_EVENT[e.key] ?? (e.key.length === 1 ? e.key.toUpperCase() : null);
    if (!id || !ROWS.flat().some((k) => k.id === id)) return;
    e.preventDefault();
    setHeld((h) => {
      const next = new Set<Mod>(h.has('SUPER') ? ['SUPER'] : []);
      if (e.shiftKey) next.add('SHIFT');
      if (e.ctrlKey) next.add('CTRL');
      if (e.altKey) next.add('ALT');
      return next;
    });
    setSelected(id);
  };

  const heldLabel = held.size ? [...held].map((m) => m[0] + m.slice(1).toLowerCase()).join(' + ') : 'No modifier';

  return (
    <div className={clsx('hs-keyboard', compact && 'hs-keyboard--compact')}>
      <div className="hs-keyboard__board" role="group" aria-label="Keyboard. Click a modifier to hold it, then pick a key." onKeyDown={onKeyDown} onPointerLeave={() => setHovered(null)}>
        {ROWS.map((row, r) => (
          <div className="hs-keyboard__row" key={r}>
            {row.map((k) => {
              const isMod = !!k.mod;
              const on = isMod ? held.has(k.mod!) : live.has(k.id);
              return (
                <button
                  key={k.id}
                  type="button"
                  className={clsx('hs-cap', isMod && 'hs-cap--mod', on && 'is-on', selected === k.id && 'is-selected')}
                  style={{ ['--w' as string]: k.w ?? 1 }}
                  aria-pressed={isMod ? held.has(k.mod!) : selected === k.id}
                  aria-label={isMod ? `Hold ${k.label}` : `${k.label ?? k.id}${on ? `, ${live.get(k.id)!.map((b) => b.action).join('; ')}` : ''}`}
                  onPointerEnter={() => !isMod && setHovered(k.id)}
                  onFocus={() => !isMod && setHovered(k.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => (isMod ? toggle(k.mod!) : setSelected((s) => (s === k.id ? null : k.id)))}
                >
                  {k.label ?? k.id}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="hs-keyboard__readout" role="status" aria-live="polite">
        <p className="hs-keyboard__held">
          Holding <strong>{heldLabel}</strong>, {live.size} {live.size === 1 ? 'key does' : 'keys do'} something.
        </p>
        {focus && readout.length ? (
          <ul className="hs-keyboard__list">
            {readout.map((b) => (
              <li key={b.combo + b.action} className={clsx(sameMods(b.mods, held) && 'is-live')}>
                <Combo combo={b.combo} />
                <span>{b.action}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="hs-keyboard__empty">{focus ? `${focus} has no binding of its own.` : 'Point at a key, or focus the keyboard and press one.'}</p>
        )}
      </div>
    </div>
  );
}
