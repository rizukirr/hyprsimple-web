import React, { useCallback, useEffect, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { THEMES, openPicker, stepTheme, useTheme, type Theme } from '@site/src/lib/theme';
import { Swatches } from './ThemePicker';

// The active theme's wallpaper, the left part redrawn as a terminal would: one glyph per 8 by 16 cell, each in the nearest of the theme's sixteen colours. The split follows the pointer, or the arrow keys.
const CELL_W = 8;
const CELL_H = 16;
const RAMP = ' .:-=+*#%@';

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function render(canvas: HTMLCanvasElement, img: HTMLImageElement, theme: Theme, split: number) {
  const box = canvas.getBoundingClientRect();
  if (!box.width || !img.naturalWidth) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(box.width * dpr);
  canvas.height = Math.round(box.height * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cols = Math.ceil(box.width / CELL_W);
  const rows = Math.ceil(box.height / CELL_H);
  const sample = document.createElement('canvas');
  sample.width = cols;
  sample.height = rows;
  const sctx = sample.getContext('2d', { willReadFrequently: true });
  if (!sctx) return;
  // object-fit: cover, done by hand so the glyphs line up with the picture.
  const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
  const sw = box.width / scale;
  const sh = box.height / scale;
  sctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
  const px = sctx.getImageData(0, 0, cols, rows).data;

  const p = theme.palette as Record<string, string>;
  const palette = Array.from({ length: 16 }, (_, i) => p[`color${i}`]).concat(p.foreground, p.accent);
  const prgb = palette.map(rgb);
  const bg = p.background;

  const edge = Math.round((box.width * split) / CELL_W);
  ctx.clearRect(0, 0, box.width, box.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, edge * CELL_W, box.height);
  ctx.font = `500 13px ${getComputedStyle(canvas).getPropertyValue('--font-outlier') || 'monospace'}`;
  ctx.textBaseline = 'top';

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < edge; x++) {
      const o = (y * cols + x) * 4;
      const r = px[o], g = px[o + 1], b = px[o + 2];
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < prgb.length; i++) {
        const [pr, pg, pb] = prgb[i];
        const d = (r - pr) ** 2 * 0.3 + (g - pg) ** 2 * 0.59 + (b - pb) ** 2 * 0.11;
        if (d < bestD) { bestD = d; best = i; }
      }
      const glyph = RAMP[Math.min(RAMP.length - 1, Math.floor(lum * RAMP.length))];
      if (glyph === ' ') continue;
      ctx.fillStyle = palette[best];
      ctx.fillText(glyph, x * CELL_W, y * CELL_H + 1);
    }
  }
}

// Hypri on the floor in front of the wallpaper's lower left corner, with her laptop over its edge. Clicks pass through her to the split.
export function HypriLanding() {
  return <img className="hs-stage__hypri" src={useBaseUrl('/img/mascot/landing.webp')} alt="" width={880} height={785} decoding="async" fetchPriority="high" />;
}

export default function ThemeStage() {
  const theme = useTheme();
  const src = useBaseUrl(`/wallpapers/${theme.slug}.webp`);
  const canvas = useRef<HTMLCanvasElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [split, setSplit] = useState(0.56);
  const frame = useRef(0);

  const draw = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (canvas.current && img.current?.complete) render(canvas.current, img.current, theme, split);
    });
  }, [theme, split]);

  useEffect(() => {
    draw();
    const ro = new ResizeObserver(draw);
    if (canvas.current) ro.observe(canvas.current);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    // Fonts arrive after first paint. Redraw once the mono face is in.
    document.fonts?.ready.then(draw);
  }, [draw]);

  const fromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' && e.type === 'pointermove' && !e.buttons) return;
    const box = e.currentTarget.getBoundingClientRect();
    setSplit(Math.min(0.96, Math.max(0.04, (e.clientX - box.left) / box.width)));
  };

  const index = THEMES.findIndex((t) => t.slug === theme.slug) + 1;

  return (
    <figure className="hs-stage hs-stage--hypri">
      <div
        className="hs-stage__frame"
        data-slot="hero"
        data-kind="product"
        data-alt="The active theme's wallpaper, the part left of the split drawn in its terminal colours"
        role="slider"
        tabIndex={0}
        aria-label="Split between the terminal rendering and the wallpaper"
        aria-valuemin={4}
        aria-valuemax={96}
        aria-valuenow={Math.round(split * 100)}
        aria-valuetext={`${Math.round(split * 100)} percent drawn as glyphs`}
        style={{ ['--split' as string]: split }}
        onPointerMove={fromPointer}
        onPointerDown={fromPointer}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 0.1 : 0.03;
          if (e.key === 'ArrowLeft') { e.preventDefault(); setSplit((s) => Math.max(0.04, s - step)); }
          if (e.key === 'ArrowRight') { e.preventDefault(); setSplit((s) => Math.min(0.96, s + step)); }
        }}
      >
        <img ref={img} src={src} alt={`${theme.name} wallpaper`} width={theme.wall.width} height={theme.wall.height} fetchPriority="high" decoding="async" onLoad={draw} />
        <canvas ref={canvas} aria-hidden="true" />
        <span className="hs-stage__seam" aria-hidden="true" />
      </div>
      <HypriLanding />
      <figcaption className="hs-stage__bar">
        <span className="hs-stage__name">
          <Swatches theme={theme} />
          <span className="hs-stage__theme" title={`${theme.name}, ${index} of ${THEMES.length}`}>{theme.name}</span>
        </span>
        <span className="hs-stage__keys">
          <button type="button" className="hs-key hs-key--small" onClick={() => stepTheme(-1)} aria-label="Previous theme">[</button>
          <button type="button" className="hs-key hs-key--small" onClick={() => stepTheme(1)} aria-label="Next theme">]</button>
          <button type="button" className="hs-key hs-key--small" onClick={openPicker}>All themes</button>
        </span>
      </figcaption>
    </figure>
  );
}
