'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Search, Zap } from 'lucide-react';
import type { SearchLesson } from './site-search-model';

const SearchDialog = dynamic(() => import('./site-search-dialog'), { ssr: false });

export default function SiteSearch({ lessons, onLesson }: { lessons?: SearchLesson[]; onLesson?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (document.querySelector('dialog[open], [role="dialog"]') || target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, []);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return <>
    <button ref={trigger} type="button" className="site-search-trigger" aria-label="Search lessons and definitions" aria-haspopup="dialog" onClick={() => setOpen(true)}><Search size={18}/><span>Search</span><kbd>/</kbd></button>
    {open && <SearchDialog lessons={lessons} onLesson={onLesson} onClose={close}/>}
  </>;
}

export function SearchPageHeader() {
  return <header className="reference-site-header"><Link href="/" className="reference-brand"><Zap size={21}/><span>Electrical Mastery</span></Link><SiteSearch/></header>;
}
