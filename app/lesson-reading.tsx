'use client';

import { useState } from 'react';
import { ArrowUpRight, BookOpen, Check, ChevronDown, ShieldCheck } from 'lucide-react';
import { getBook, readingForLesson, type Reading } from './books-data';
import LearningExperiment from './learning-experiment';

export default function LessonReading({ lessonId, onRead }: { lessonId: string; onRead: (reading: Reading) => void }) {
  const topic = readingForLesson(lessonId);
  const [reveal, setReveal] = useState(false);
  if (!topic) return null;
  return <section className="lesson-reading" aria-label="Read and explore this concept">
    <div className="reading-heading"><span><BookOpen size={18} /> Read & understand</span><h2>{topic.title}</h2></div>
    <p>{topic.principle}</p>
    <div className="reading-links">{topic.readings.map((reading, index) => <button type="button" className={index === 0 ? 'reading-link primary-reading' : 'reading-link'} key={`${reading.bookId}-${reading.pdf}`} onClick={() => onRead(reading)}><BookOpen size={20} /><span><strong>{reading.title}</strong><small>{getBook(reading.bookId)?.shortTitle} · pp. {reading.printed}</small></span><ArrowUpRight size={18} /></button>)}</div>
    {topic.experiment && <LearningExperiment kind={topic.experiment} />}
    <details className="explain-it"><summary>Reveal the book’s explanation <ChevronDown size={17}/></summary><p>{topic.question}</p><button type="button" onClick={()=>setReveal(value=>!value)}>{reveal?'Hide the answer':'Show the answer'}</button>{reveal&&<p className="reasoning-feedback"><Check size={18}/>{topic.explanation}</p>}</details>
    <details className="source-context"><summary><ShieldCheck size={17}/> What to remember</summary><div className="source-context-body"><p>{topic.rule}</p><small>Book editions: 2010 and 2013. The current teaching reference is summarised below.</small></div></details>
  </section>;
}
