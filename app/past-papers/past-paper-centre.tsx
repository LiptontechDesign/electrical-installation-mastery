'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Download, ExternalLink, Files, Search } from 'lucide-react';
import StudyMarkdown, { InlineMarkdown } from '../practice/study-markdown';
import definitions from '../practice/definitions.json';
import { compilationMarkdown, filterQuestions, questionsFor } from './bank';
import type { PaperPath } from './sources';
import { diagrams } from './study-diagrams';
import { PastPaperPathSwitcher } from '../past-paper-links';

export default function PastPaperCentre({ path }: { path: PaperPath }) {
  const bank = useMemo(() => questionsFor(path), [path]);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedId, setSelectedId] = useState(bank[0]?.id ?? '');
  const [attempt, setAttempt] = useState(false);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [working, setWorking] = useState<Record<string, string>>({});
  const [downloadedWorking, setDownloadedWorking] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const filtered = useMemo(() => filterQuestions(path, query, topic), [path, query, topic]);
  const current = filtered.find(question => question.id === selectedId) ?? filtered[0];
  const index = current ? filtered.indexOf(current) : -1;
  const showAnswer = !attempt || (current && revealed.includes(current.id));
  const hasWorking = Object.values(working).some(value => value.trim());
  const unsavedWorking = hasWorking && JSON.stringify(working) !== downloadedWorking;
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('question');
    if (!requested || !bank.some(item => item.id === requested)) return;
    const frame = requestAnimationFrame(() => setSelectedId(requested));
    return () => cancelAnimationFrame(frame);
  }, [bank]);
  useEffect(() => {
    if (!unsavedWorking) return;
    const guard = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const leave = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.('a[href]');
      if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || link.getAttribute('target') === '_blank') return;
      const url = new URL(link.getAttribute('href')!, window.location.href);
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (!window.confirm('Your working is kept only on this page. Leave without downloading it?')) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', guard);
    document.addEventListener('click', leave, true);
    return () => { window.removeEventListener('beforeunload', guard); document.removeEventListener('click', leave, true); };
  }, [unsavedWorking]);
  const choose = (id: string) => {
    setSelectedId(id);
    const url = new URL(window.location.href); url.searchParams.set('question', id);
    window.history.replaceState(null, '', url);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const download = () => {
    const blob = new Blob([compilationMarkdown(path, bank, working)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = `${path.toLowerCase()}-past-paper-study-answers.md`; link.click();
    setDownloadedWorking(JSON.stringify(working));
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="past-paper-centre">
    <PastPaperPathSwitcher active={path}/>
    <div className="past-paper-hero"><div><p className="epra-eyebrow"><Files size={15}/> {path} · PAST PAPERS</p><h1>Questions with<br/><em>worked answers.</em></h1><p>Clear explanations, worked calculations and diagrams in one study paper.</p></div><div className="past-paper-count"><strong>{bank.length}</strong><span>study questions</span></div></div>
    <div className="past-paper-topbar"><p>Read, practise and check your reasoning.</p><button className="past-paper-download" onClick={download} disabled={!bank.length}><Download size={16}/> Download compilation</button></div>
      <div className="past-paper-filters"><label className="epra-search"><Search size={17}/><input aria-label="Search past-paper questions and answers" placeholder="Search questions, terms or answers…" value={query} onChange={event => setQuery(event.target.value)}/></label><label>Topic<select aria-label="Topic" value={topic} onChange={event => setTopic(event.target.value)}><option value="">All topics</option>{[...new Set(bank.map(question => question.topic))].map(value => <option key={value}>{value}</option>)}</select></label></div>
      <div className="past-paper-mode"><div role="group" aria-label="Study mode"><button aria-pressed={!attempt} onClick={() => setAttempt(false)}>Study</button><button aria-pressed={attempt} onClick={() => setAttempt(true)}>Attempt first</button></div><p role="status">{filtered.length} {filtered.length === 1 ? 'question' : 'questions'}{hasWorking ? ' · Working kept for this open page; download before leaving' : ''}</p></div>
      <div className="past-paper-workspace"><aside className="past-paper-list" aria-label="Consolidated question list">{filtered.map((question, i) => <button key={question.id} aria-current={current?.id === question.id ? 'true' : undefined} onClick={() => choose(question.id)}><span>{String(i + 1).padStart(2, '0')}</span><span><small>{question.topic}</small><strong>{question.title}</strong></span></button>)}</aside><div className="past-paper-reading">{current ? <article key={current.id} className="past-paper-question"><div className="past-paper-stepper"><span>Question {index + 1} of {filtered.length}</span><div><button aria-label="Previous question" disabled={index === 0} onClick={() => choose(filtered[index - 1].id)}><ArrowLeft size={18}/></button><button aria-label="Next question" disabled={index === filtered.length - 1} onClick={() => choose(filtered[index + 1].id)}><ArrowRight size={18}/></button></div></div><p className="epra-eyebrow">{current.topic}</p><h2 ref={heading} tabIndex={-1}>{current.title}</h2><div className="past-paper-prompt"><StudyMarkdown prefix={`prompt-${current.id}`}>{current.prompt}</StudyMarkdown></div>
        <details className="past-paper-working" open={attempt || undefined}><summary>Your working</summary><textarea aria-label="Your answer and working" rows={6} value={working[current.id] ?? ''} onChange={event => setWorking(previous => ({ ...previous, [current.id]: event.target.value }))} placeholder="Work through the question here…"/><p>Working stays in this open page. Download the compilation to keep it.</p></details>
        {showAnswer ? <div className="past-paper-solution"><section><h3>Worked answer</h3><StudyMarkdown prefix={`paper-${current.id}`}>{current.answer}</StudyMarkdown>{current.diagram && diagrams[current.diagram] && <figure className="past-paper-diagram"><div><Image src={`/past-paper-diagrams/${current.diagram}.svg`} width={900} height={diagrams[current.diagram].height} alt={diagrams[current.diagram].alt} unoptimized/></div><figcaption>{diagrams[current.diagram].caption} <a href={`/past-paper-diagrams/${current.diagram}.svg`} target="_blank" rel="noreferrer">Open full-size diagram <ExternalLink size={12}/></a></figcaption></figure>}</section><details className="past-paper-check"><summary>Check your answer</summary><ul>{current.check.map(item => <li key={item}><InlineMarkdown>{item}</InlineMarkdown></li>)}</ul></details>{current.terms.some(term => term.definitionId) && <details className="past-paper-reference"><summary>BS 7671 reference definitions (17th edition)</summary>{current.terms.map(term => { const definition = definitions.find(item => item.id === term.definitionId); return definition ? <p key={term.term}><strong>{term.term}:</strong> {definition.definition} <a href={`/practice?definition=${definition.id}`}>Related terms</a></p> : null; })}</details>}{attempt && <button className="epra-text-button" onClick={() => setRevealed(previous => previous.filter(id => id !== current.id))}>Hide explanation</button>}</div> : <button className="past-paper-reveal" onClick={() => setRevealed(previous => [...previous, current.id])}>Show worked answer <ArrowRight size={17}/></button>}
      </article> : <div className="past-paper-empty"><Search size={24}/><h2>No matching questions</h2><p>Try another term or clear the filters.</p><button onClick={() => { setQuery(''); setTopic(''); }}>Clear filters</button></div>}</div></div>
  </div>;
}
