'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, PlayCircle, Search, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import definitions from './practice/definitions.json';
import { DefinitionRow } from './practice/definitions-browser';
import { findSearchResults, publicSearchLessons, searchDefinitions, type SearchEntry, type SearchLesson } from './site-search-model';

export default function SearchDialog({ lessons, onLesson, onClose }: { lessons?: SearchLesson[]; onLesson?: (id: string) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const resultsArea = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);
  const [limit, setLimit] = useState(24);
  const matches = useMemo(() => findSearchResults([...(lessons ?? publicSearchLessons), ...searchDefinitions], query), [lessons, query]);
  const filtered = matches.filter(entry => filter === 'All' || (filter === 'Definitions' ? entry.kind === 'Definition' : entry.kind !== 'Definition'));
  const definition = definitions.find(entry => entry.id === selected);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    input.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; };
  }, []);

  const close = () => { dialog.current?.close(); onClose(); };

  const choose = (entry: SearchEntry) => {
    if (entry.kind === 'Definition') { setSelected(entry.id); resultsArea.current?.scrollTo(0, 0); return; }
    close();
    if (onLesson) onLesson(entry.id);
    // A full navigation preserves the practice reader’s beforeunload guard for unsaved working.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    else window.location.assign(`/#learn/${encodeURIComponent(entry.id)}`);
  };
  const edit = (value: string) => { setQuery(value); setSelected(null); setLimit(24); resultsArea.current?.scrollTo(0, 0); };

  return createPortal(<dialog ref={dialog} className="site-search-dialog" aria-label="Search lessons and definitions" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="site-search-surface">
      <div className="site-search-input"><Search size={20}/><input ref={input} aria-label="Search lessons and definitions" placeholder="Find a lesson, term or abbreviation…" value={query} autoComplete="off" onChange={event => edit(event.target.value)} onKeyDown={event => {
        if (event.key === 'ArrowDown') { event.preventDefault(); resultsArea.current?.querySelector<HTMLButtonElement>('.site-search-result')?.focus(); }
        if (event.key === 'Enter' && !selected && filtered[0]) { event.preventDefault(); choose(filtered[0]); }
      }}/>{query && <button aria-label="Clear search" onClick={() => { edit(''); input.current?.focus(); }}><X size={16}/></button>}<button className="site-search-close" onClick={close} aria-label="Close search"><X size={21}/></button></div>
      {definition ? <div className="site-search-back"><button onClick={() => { setSelected(null); input.current?.focus(); }}><ArrowLeft size={16}/> Results</button><span>Definition</span></div> : <div className="site-search-filters" role="group" aria-label="Search result type">{['All', 'Definitions', 'Lessons'].map(value => <button key={value} aria-pressed={filter === value} onClick={() => { setFilter(value); setLimit(24); }}>{value}</button>)}<span role="status">{query.trim() ? `${filtered.length} results` : 'Search the course'}</span></div>}
      <div ref={resultsArea} className="site-search-body" onKeyDown={event => {
        if (!['ArrowDown', 'ArrowUp'].includes(event.key) || !(event.target as HTMLElement).matches('.site-search-result')) return;
        event.preventDefault();
        const buttons = Array.from(resultsArea.current?.querySelectorAll<HTMLButtonElement>('.site-search-result') ?? []);
        const next = buttons.indexOf(event.target as HTMLButtonElement) + (event.key === 'ArrowDown' ? 1 : -1);
        if (next < 0) input.current?.focus(); else buttons[Math.min(next, buttons.length - 1)]?.focus();
      }}>
        {definition ? <div className="site-search-reading"><DefinitionRow key={definition.id} idPrefix="search-" entry={definition} open onToggle={() => setSelected(null)} showCategory onRequestTerm={(_, id) => { setSelected(id); resultsArea.current?.scrollTo(0, 0); }}/></div> : !query.trim() ? <div className="site-search-empty"><BookOpen size={25}/><h2>What would you like to understand?</h2><p>Find a definition or jump to a video lesson.</p><div>{['Earthing conductor', 'CPC', 'RCD', 'Three phase'].map(term => <button key={term} onClick={() => { edit(term); input.current?.focus(); }}>{term}</button>)}</div></div> : <>
          {filtered.slice(0, limit).map(entry => <button className="site-search-result" key={`${entry.kind}-${entry.id}`} onClick={() => choose(entry)}><span className="site-search-result-icon">{entry.kind === 'Definition' ? <BookOpen size={18}/> : <PlayCircle size={18}/>}</span><span><small>{entry.kind}</small><strong>{entry.title}</strong><p>{entry.subtitle}</p></span><ChevronRight size={16}/></button>)}
          {!filtered.length && <div className="site-search-empty"><Search size={25}/><h2>No matches found</h2><p>Try a shorter term or choose All.</p></div>}
          {filtered.length > limit && <button className="site-search-more" onClick={() => setLimit(value => value + 24)}>Show more results</button>}
        </>}
      </div>
    </div>
  </dialog>, document.body);
}
