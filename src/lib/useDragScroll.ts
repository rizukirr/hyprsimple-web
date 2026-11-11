import { useEffect, type RefObject } from 'react';

// Lets a mouse drag a horizontal scroller sideways. Touch and pens keep their native scrolling. A drag past a few pixels swallows the click that ends it, so dragging never presses a tile.
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let startLeft = 0;
    let pointer: number | null = null;
    let moved = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      pointer = e.pointerId;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      moved = false;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add('is-dragging');
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return;
      pointer = null;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.classList.remove('is-dragging');
    };
    const click = (e: MouseEvent) => {
      if (!moved) return;
      moved = false;
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true);
    };
  }, [ref]);
}
