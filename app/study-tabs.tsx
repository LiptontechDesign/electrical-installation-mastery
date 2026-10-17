'use client';

import { useRef, type ReactNode } from 'react';

type StudyTab<T extends string> = { id: T; label: string; content?: ReactNode };

// These panels update locally, so arrow-key activation does not wait on a route.
export default function StudyTabs<T extends string>({ id, label, value, items, onChange, className = '' }: {
  id: string; label: string; value: T; items: readonly StudyTab<T>[]; onChange: (value: T) => void; className?: string;
}) {
  const buttons = useRef(new Map<T, HTMLButtonElement>());
  return <div className={`study-tabs ${className}`} role="tablist" aria-label={label}>
    {items.map((item, index) => <button key={item.id} ref={node => { if (node) buttons.current.set(item.id, node); else buttons.current.delete(item.id); }}
      id={`${id}-${item.id}`} type="button" role="tab" aria-label={item.label} aria-selected={value === item.id}
      aria-controls={`${id}-panel`} tabIndex={value === item.id ? 0 : -1} onClick={() => onChange(item.id)}
      onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
          : event.key === 'ArrowRight' ? (index + 1) % items.length
            : event.key === 'ArrowLeft' ? (index + items.length - 1) % items.length : -1;
        if (next < 0) return;
        event.preventDefault();
        onChange(items[next].id);
        buttons.current.get(items[next].id)?.focus();
      }}>{item.content ?? item.label}</button>)}
  </div>;
}
