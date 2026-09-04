'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, ChevronLeft, ChevronRight, Cloud, List, Search, X, ZoomIn, ZoomOut } from 'lucide-react';
import { courseBooks, getBook, printedPage, type BookId, type Reading } from './books-data';
import { emptyReaderState, type ReaderCommand, type ReaderState } from './reader-state';
import bookFigures from './book-figures.json';

const PdfPage = dynamic(() => import('./pdf-page'), { ssr: false, loading: () => <p className="reader-message">Opening reader…</p> });
type Session = { configured: boolean; authenticated: boolean };

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: 'no-store', ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Could not complete the request.');
  return data;
}

function Bookshelf({ state, onOpen }: { state: ReaderState; onOpen: (id: BookId, page: number) => void }) {
  return <div className="book-shelf"><div className="books-intro"><span className="eyebrow neutral">Your reading companions</span><h3>Go deeper into the lesson.</h3><p>Two complete books, with your place saved across devices.</p></div><div className="book-shelf-grid">{courseBooks.map((book, index) => {
    const progress = state.books[book.id];
    return <article className="book-shelf-card" key={book.id}><button type="button" className={`book-jacket jacket-${index}`} onClick={() => onOpen(book.id, progress?.page ?? 1)} aria-label={`Read ${book.title}`}><span>{book.edition}</span><strong>{book.title}</strong><div className="cover-circuit" aria-hidden="true"><i /><i /><i /><i /></div><small>{book.authors}</small></button><div><span className="book-edition">{book.year} · {book.pages} PDF pages</span><h3>{book.title}</h3><p>{book.description}</p><button type="button" className="reader-primary" onClick={() => onOpen(book.id, progress?.page ?? 1)}>{progress ? `Continue · ${printedPage(book, progress.page)}` : 'Open book'} <ArrowRight size={17} /></button>{Boolean(progress?.bookmarks.length) && <small>{progress?.bookmarks.length} saved pages</small>}</div></article>;
  })}</div><p className="books-source-note">Historical UK textbooks · use the examples to understand the concepts, and check current requirements before applying them.</p></div>;
}

function ReaderWorkspace({ initialReading }: { initialReading?: Reading }) {
  const [state, setState] = useState<ReaderState>(emptyReaderState);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<{ id: BookId; page: number } | null>(initialReading ? { id: initialReading.bookId, page: initialReading.pdf } : null);
  const [zoom, setZoom] = useState(1);
  const [sidebar, setSidebar] = useState(false);
  const [query, setQuery] = useState('');
  const [indexTab, setIndexTab] = useState<'contents' | 'saved' | 'figures'>('contents');
  const [figureId, setFigureId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [failedCommands, setFailedCommands] = useState<ReaderCommand[]>([]);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const lastRendered = useRef('');
  const pending = useRef(0);
  const book = selected && getBook(selected.id);
  const figure = bookFigures.find(item => item.id === figureId);
  const currentMark = selected && state.books[selected.id]?.bookmarks.find(mark => mark.page === selected.page);
  useEffect(() => {
    let active = true;
    requestJson<ReaderState>('/api/reader/state').then(value => { if (active) { setState(value); setLoaded(true); setError(''); } }).catch(error => { if (active) setError(error.message); });
    return () => { active = false; };
  }, [retry]);
  const save = useCallback((command: ReaderCommand) => {
    pending.current += 1;
    setSaveStatus('Saving…');
    queue.current = queue.current.then(async () => {
      try {
        const next = await requestJson<ReaderState>('/api/reader/state', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(command), keepalive: true });
        setState(next);
        setFailedCommands(commands => commands.filter(item => !(item.bookId === command.bookId && item.action === command.action && (item.action === 'position' || item.page === command.page))));
        if (pending.current === 1) setSaveStatus('Saved across devices');
      } catch (error) {
        setSaveStatus(error instanceof Error ? error.message : 'Changes were not saved.');
        setFailedCommands(commands => [...commands.filter(item => !(item.bookId === command.bookId && item.action === command.action && (item.action === 'position' || item.page === command.page))), command]);
      } finally { pending.current -= 1; }
    });
  }, []);
  const onRendered = useCallback((page: number) => {
    if (!selected || !loaded) return;
    const key = `${selected.id}-${page}`;
    if (lastRendered.current === key) return;
    lastRendered.current = key;
    save({ action: 'position', bookId: selected.id, page });
  }, [selected, loaded, save]);
  const open = (id: BookId, page: number) => { setSelected({ id, page }); setSidebar(false); setQuery(''); setZoom(1); setFigureId(null); lastRendered.current = ''; };
  const go = (page: number) => { if (book && Number.isInteger(page) && page >= 1 && page <= book.pages) { setSelected({ id: book.id, page }); setSidebar(false); setFigureId(null); } };
  if (!loaded) return <div className="reader-message">{error ? <><p role="alert">{error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>Retry saved pages</button></> : <p role="status">Loading your saved pages…</p>}</div>;
  return <><div className="reader-session-bar"><span><Cloud size={15} /> Books saved on Vercel</span></div>{!selected || !book ? <Bookshelf state={state} onOpen={open} /> : <div className="reader-workspace"><div className="reader-book-heading"><button type="button" onClick={() => { setSelected(null); setSidebar(false); }}><ArrowLeft size={17} /> My books</button><div><h3>{book.title}</h3><span>{book.edition} · {book.year}</span></div></div>{initialReading?.bookId === book.id && <div className="reading-focus"><BookOpen size={18} /><div><strong>{initialReading.title}</strong><span>{initialReading.purpose} pp. {initialReading.printed}</span></div><button type="button" onClick={() => go(initialReading.pdf)}>Go to reading</button></div>}<div className="reader-toolbar"><button type="button" aria-label="Book contents, saved pages and figures" aria-expanded={sidebar} onClick={() => setSidebar(value => !value)}><List size={18} /><span>Contents & figures</span></button><div className="reader-page-controls"><button type="button" aria-label="Previous page" disabled={selected.page === 1} onClick={() => go(selected.page - 1)}><ChevronLeft size={20} /></button><form onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); go(Number(new FormData(event.currentTarget).get('page'))); }}><label><span className="sr-only">PDF page</span><input key={`${book.id}-${selected.page}`} type="number" min="1" max={book.pages} defaultValue={selected.page} name="page" aria-label="PDF page number" /></label><span>/ {book.pages}</span><button type="submit">Go</button></form><button type="button" aria-label="Next page" disabled={selected.page === book.pages} onClick={() => go(selected.page + 1)}><ChevronRight size={20} /></button></div><div className="reader-zoom"><button type="button" aria-label="Zoom out" disabled={zoom <= .75} onClick={() => setZoom(value => value - .25)}><ZoomOut size={18} /></button><span>{Math.round(zoom * 100)}%</span><button type="button" aria-label="Zoom in" disabled={zoom >= 2} onClick={() => setZoom(value => value + .25)}><ZoomIn size={18} /></button></div><button type="button" className={currentMark ? 'is-saved' : ''} aria-label={currentMark ? 'Remove saved page' : 'Save this page'} aria-pressed={Boolean(currentMark)} onClick={() => save({ action: 'bookmark', bookId: book.id, page: selected.page, saved: !currentMark })}><Bookmark size={18} fill={currentMark ? 'currentColor' : 'none'} /><span>{currentMark ? 'Saved' : 'Save page'}</span></button></div><div className={`reader-body ${sidebar ? 'index-open' : ''}`}>{sidebar && <aside className="reader-index" aria-label="Book contents and saved pages"><div className="reader-index-tabs"><button type="button" aria-pressed={indexTab === 'contents'} onClick={() => setIndexTab('contents')}>Contents</button><button type="button" aria-pressed={indexTab === 'saved'} onClick={() => setIndexTab('saved')}>Saved pages</button><button type="button" aria-pressed={indexTab === 'figures'} onClick={() => setIndexTab('figures')}>Figures</button></div>{indexTab === 'contents' ? <><label className="reader-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a chapter" aria-label="Search chapter titles" /></label><button type="button" className="chapter-link" onClick={() => go(1)}>Front matter <small>PDF 1</small></button>{book.chapters.filter(chapter => chapter.title.toLowerCase().includes(query.toLowerCase())).map(chapter => <button type="button" className="chapter-link" key={chapter.pdf} onClick={() => go(chapter.pdf)}><span>{chapter.title}</span><small>p. {chapter.printed}</small></button>)}{!book.chapters.some(chapter => chapter.title.toLowerCase().includes(query.toLowerCase())) && <p>No chapters match that title.</p>}</> : indexTab === 'figures' ? <>{bookFigures.filter(item => item.bookId === book.id).map(item => <button type="button" className="chapter-link" key={item.id} onClick={() => { go(item.pdfPage); setFigureId(item.id); }}><span>{item.title}</span><small>p. {item.printedPage}</small></button>)}</> : <>{(state.books[book.id]?.bookmarks ?? []).map(mark => <button type="button" className="chapter-link saved-page-link" key={mark.page} onClick={() => go(mark.page)}><span>{printedPage(book, mark.page)}<small>{mark.note || 'Saved page'}</small></span><Bookmark size={14} /></button>)}{!state.books[book.id]?.bookmarks.length && <p>Save a page to return to it here.</p>}</>}</aside>}<>{figure ? <figure className="reader-figure"><div><span>Figure {figure.number} · p. {figure.printedPage}</span><h3>{figure.title}</h3><p>{figure.caption}</p></div><div className="reader-figure-image"><Image unoptimized src={`/api/reader/figures/${figure.id}`} width={figure.width} height={figure.height} alt={`${figure.title}, figure ${figure.number} from ${book.title}`} onLoad={() => onRendered(selected.page)} style={{ width: `${Math.round(zoom * 100)}%`, maxWidth: "none", height: "auto" }} /></div><figcaption><strong>{book.title} · {book.edition} · {book.year} · figure {figure.number}</strong><p>{figure.note}</p><button type="button" onClick={() => go(figure.pdfPage)}>Read the original page <ArrowRight size={15} /></button></figcaption></figure> : <PdfPage key={book.id} bookId={book.id} page={selected.page} zoom={zoom} onRendered={onRendered} />}</></div><div className="reader-page-footer"><span>{printedPage(book, selected.page)} <small>· PDF {selected.page}</small></span><span role="status">{failedCommands.length ? 'Some changes have not saved.' : saveStatus}{failedCommands.length > 0 && <button type="button" onClick={() => failedCommands.forEach(save)}>Retry saving</button>}</span></div>{currentMark && <form key={`${book.id}-${selected.page}-${currentMark.updatedAt}`} className="bookmark-note" onSubmit={event => { event.preventDefault(); save({ action: 'bookmark', bookId: book.id, page: selected.page, saved: true, note: String(new FormData(event.currentTarget).get('note') ?? '') }); }}><label>Note for this page<textarea name="note" defaultValue={currentMark.note} maxLength={2000} placeholder="What do you want to remember?" /></label><button type="submit"><Check size={16} /> Save note</button></form>}</div>}</>;
}

export default function BookReader({ initialReading, onClose }: { initialReading?: Reading; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, []);
  useEffect(() => {
    let active = true;
    requestJson<Session>('/api/reader/session', { method: 'POST' }).then(value => { if (active) { setSession(value); setError(''); } }).catch(error => { if (active) setError(error instanceof Error ? error.message : 'Could not open your books. Please retry.'); });
    return () => { active = false; };
  }, [retry]);
  return <dialog ref={dialog} className="book-reader-dialog" aria-labelledby="book-reader-title" onCancel={onClose}><header className="book-reader-header"><div><BookOpen size={22} /><h2 id="book-reader-title">My books</h2></div><button type="button" aria-label="Close book reader" onClick={onClose}><X size={23} /></button></header>{session?.authenticated ? <ReaderWorkspace initialReading={initialReading} /> : <div className="reader-message">{error ? <><p role="alert">{error}</p><button type="button" onClick={() => { setError(''); setRetry(value => value + 1); }}>Retry opening books</button></> : <p role="status">Opening your books…</p>}</div>}</dialog>;
}


