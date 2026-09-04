'use client';

import { useState } from 'react';
import { ArrowUpRight, BookOpen, Check, ChevronDown, ShieldCheck } from 'lucide-react';
import { getBook, readingForLesson, type Reading } from './books-data';
import LearningExperiment from './learning-experiment';

export default function LessonReading({ lessonId, onRead, note, onNote }: { lessonId: string; onRead: (reading: Reading) => void; note: string; onNote: (value: string) => void }) {
  const topic = readingForLesson(lessonId);
  const [reveal, setReveal] = useState(false);
  if (!topic) return null;
  return <section className="lesson-reading" aria-label="Read and explore this concept">
    <div className="reading-heading"><span><BookOpen size={18} /> Read & understand</span><h2>{topic.title}</h2></div>
    <p>{topic.principle}</p>
    <div className="reading-links">{topic.readings.map((reading, index) => <button type="button" className={index === 0 ? 'reading-link primary-reading' : 'reading-link'} key={`${reading.bookId}-${reading.pdf}`} onClick={() => onRead(reading)}><BookOpen size={20} /><span><strong>{reading.title}</strong><small>{getBook(reading.bookId)?.shortTitle} · pp. {reading.printed}</small></span><ArrowUpRight size={18} /></button>)}</div>
    {topic.experiment && <LearningExperiment kind={topic.experiment} />}
    <details className="explain-it"><summary>Explain it in your own words <ChevronDown size={17} /></summary><p>{topic.question}</p><label><span className="sr-only">Your explanation</span><textarea value={note} onChange={event => onNote(event.target.value)} placeholder="Write your reasoning. This becomes part of My notes." /></label><button type="button" onClick={() => setReveal(value => !value)}>{reveal ? 'Hide explanation' : 'Compare your reasoning'}</button>{reveal && <p className="reasoning-feedback"><Check size={18} />{topic.explanation}</p>}</details>
    <details className="source-context"><summary><ShieldCheck size={17} /> Source & current requirements</summary><div className="source-context-body"><span>UK book example · 2010 / 2013</span><p>{topic.rule}</p><p>For a Kenyan requirement, check the applicable document, edition, clause and scope. A draft or a textbook reference does not establish current applicability.</p><div><a href="https://www.kebs.org/" target="_blank" rel="noreferrer">KEBS standards <ArrowUpRight size={14} /></a><a href="https://epra.go.ke/electricity-1" target="_blank" rel="noreferrer">EPRA requirements <ArrowUpRight size={14} /></a><a href="https://electrical.theiet.org/bs-7671-18th-edition-wiring-regulations/ensure-you-are-up-to-date-with-bs-7671/" target="_blank" rel="noreferrer">UK edition guidance <ArrowUpRight size={14} /></a></div></div></details>
  </section>;
}
