'use client';

import { useEffect, useRef, useState } from 'react';

type TooltipState = { text: string; left: number; top: number; above: boolean };
const tooltipSelector = '[data-tooltip], button[aria-label], a[aria-label]';

export default function AccessibleTooltips() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = null;
    };
    const hide = () => { clearTimer(); setTooltip(null); };
    const findTarget = (value: EventTarget | null) => value instanceof Element ? value.closest<HTMLElement>(tooltipSelector) : null;
    const show = (target: HTMLElement, delayed: boolean) => {
      if (target.matches(':disabled') || target.getAttribute('aria-disabled') === 'true') return;
      const text = target.dataset.tooltip || target.getAttribute('aria-label');
      if (!text) return;
      const reveal = () => {
        const rect = target.getBoundingClientRect();
        const above = rect.bottom + 52 > window.innerHeight && rect.top > 52;
        setTooltip({
          text,
          left: Math.min(window.innerWidth - 12, Math.max(12, rect.left + rect.width / 2)),
          top: above ? rect.top - 8 : rect.bottom + 8,
          above,
        });
      };
      clearTimer();
      if (delayed) timer.current = window.setTimeout(reveal, 220);
      else reveal();
    };
    const pointerOver = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const target = findTarget(event.target);
      if (target && !target.contains(event.relatedTarget as Node | null)) show(target, true);
    };
    const pointerOut = (event: PointerEvent) => {
      const target = findTarget(event.target);
      if (target && !target.contains(event.relatedTarget as Node | null)) hide();
    };
    const focusIn = (event: FocusEvent) => { const target = findTarget(event.target); if (target) show(target, false); };
    const focusOut = (event: FocusEvent) => { const target = findTarget(event.target); if (target && !target.contains(event.relatedTarget as Node | null)) hide(); };

    document.addEventListener('pointerover', pointerOver);
    document.addEventListener('pointerout', pointerOut);
    document.addEventListener('focusin', focusIn);
    document.addEventListener('focusout', focusOut);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      clearTimer();
      document.removeEventListener('pointerover', pointerOver);
      document.removeEventListener('pointerout', pointerOut);
      document.removeEventListener('focusin', focusIn);
      document.removeEventListener('focusout', focusOut);
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, []);

  return tooltip ? <div className={`accessible-tooltip ${tooltip.above ? 'above' : ''}`} role="tooltip" style={{ left: tooltip.left, top: tooltip.top }}>{tooltip.text}</div> : null;
}
