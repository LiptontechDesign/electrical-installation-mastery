'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { printedPage } from './books-data';
import { latestReading, type BookSelection, type ReaderState } from './reader-state';

export default function HomeBookResume({ userId, onOpen }: { userId: string; onOpen: (selection?: BookSelection) => void }) {
  const [reading, setReading] = useState<ReturnType<typeof latestReading>>();
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    void fetch('/api/reader/state', { cache: 'no-store', signal: controller.signal })
      .then(async response => response.ok ? await response.json() as ReaderState : undefined)
      .then(state => { if (active && state) setReading(latestReading(state)); })
      .catch(() => { /* The library remains available if its saved place is unavailable. */ });
    return () => { active = false; controller.abort(); };
  }, [userId]);
  return <button type="button" className="study-library-link" onClick={() => onOpen(reading ? { id: reading.book.id, page: reading.page } : undefined)}><BookOpen size={23}/><span>{reading ? <><small>Continue reading</small><strong>{reading.book.shortTitle}</strong><small>{reading.book.year} · {printedPage(reading.book, reading.page)}</small></> : <><strong>Reference library</strong><small>Continue reading or open a book</small></>}</span><ArrowRight size={18}/></button>;
}
