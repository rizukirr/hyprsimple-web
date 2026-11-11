import React, { useState } from 'react';
import clsx from 'clsx';
import repo from '@site/src/data/repo.json';
import { useTheme } from '@site/src/lib/theme';

// colors.toml on the left, the ghostty.conf the template renders from it on the right, for whichever theme is active. Matching lines are joined. The sixteen palette entries show as one row of swatches on each side.

const LH = 28; // px per line, shared with the CSS through --lh
const PAD = 16;
const HEAD = 40;

type Line = { text?: string; key?: string; palette?: boolean };

export default function Mapping() {
  const theme = useTheme();
  const p = theme.palette as Record<string, string>;
  const [hot, setHot] = useState<string | null>('background');
  const [cell, setCell] = useState<number | null>(null);

  const left: Line[] = [
    ...['accent', 'cursor', 'foreground', 'background', 'selection_foreground', 'selection_background'].map((k) => ({ key: k, text: `${k} = "${p[k]}"` })),
    { key: 'palette', palette: true },
  ];
  const templ = repo.ghosttyTemplate.trimEnd().split('\n').filter((l) => l.trim() && !l.startsWith('palette'));
  const right: Line[] = [
    ...templ.map((line) => {
      const m = /\{\{ (\w+) \}\}/.exec(line);
      return { key: m?.[1], text: m ? line.replace(m[0], p[m[1]] ?? m[0]) : line };
    }),
    { text: '' },
    { key: 'palette', palette: true },
  ];

  const y = (lines: Line[], key: string) => HEAD + PAD + lines.findIndex((l) => l.key === key) * LH + LH / 2;
  const pairs = left.filter((l) => l.key && right.some((r) => r.key === l.key)).map((l) => l.key!);
  const height = HEAD + PAD * 2 + Math.max(left.length, right.length) * LH;

  const swatches = (side: 'colors' | 'palette') => (
    <span className="hs-strip" onPointerLeave={() => setCell(null)}>
      <span className="hs-strip__label">{side === 'colors' ? 'color0 to color15' : 'palette = 0 to 15'}</span>
      <span className="hs-strip__cells">
        {Array.from({ length: 16 }, (_, i) => (
          <i
            key={i}
            className={clsx(cell === i && 'is-hot')}
            style={{ ['--sw' as string]: p[`color${i}`] }}
            title={`${side === 'colors' ? `color${i}` : `palette ${i}`} ${p[`color${i}`]}`}
            onPointerEnter={() => setCell(i)}
          />
        ))}
      </span>
    </span>
  );

  const pane = (file: string, lines: Line[], side: 'colors' | 'palette') => (
    <div className="hs-pane">
      <div className="hs-pane__head">{file}</div>
      <pre className="hs-pane__code" style={{ ['--lh' as string]: `${LH}px` }}>
        {lines.map((l, i) => (
          <span key={i} className={clsx('hs-line', l.key === hot && 'is-hot')} onPointerEnter={() => l.key && setHot(l.key)}>
            {l.palette ? (
              swatches(side)
            ) : (
              <>
                {l.key && <i className="hs-chip" style={{ ['--sw' as string]: p[l.key] }} aria-hidden="true" />}
                {l.text || ' '}
              </>
            )}
          </span>
        ))}
      </pre>
    </div>
  );

  return (
    <div className="hs-mapping" style={{ ['--map-h' as string]: `${height}px` }}>
      {pane(`themes/${theme.slug}/colors.toml`, left, 'colors')}
      <svg className="hs-mapping__wires" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
        {pairs.map((k, i) => (
          <path key={k} className={clsx(k === hot && 'is-hot')} d={`M0 ${y(left, k)} H${16 + (i * 68) / pairs.length} V${y(right, k)} H100`} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {pane('generated/ghostty.conf', right, 'palette')}
    </div>
  );
}
