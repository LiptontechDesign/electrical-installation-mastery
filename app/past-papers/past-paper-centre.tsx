'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ChevronDown, Download, ExternalLink, List, PencilLine, Search, SlidersHorizontal, X } from 'lucide-react';
import StudyMarkdown, { InlineMarkdown } from '../practice/study-markdown';
import definitions from '../practice/definitions.json';
import { compilationMarkdown, filterQuestions, questionsFor } from './bank';
import type { PaperPath } from './sources';
import { diagrams } from './study-diagrams';
import { PastPaperPathSwitcher } from '../past-paper-links';
import StudyTabs from '../study-tabs';

export default function PastPaperCentre({ path }: { path: PaperPath }) {
  const bank = useMemo(() => questionsFor(path), [path]);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedId, setSelectedId] = useState(bank[0]?.id ?? '');
  const [attempt, setAttempt] = useState(false);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [working, setWorking] = useState<Record<string, string>>({});
  const [downloadedWorking, setDownloadedWorking] = useState('');
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [workingOpen, setWorkingOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const answer = useRef<HTMLElement>(null);
  const navigator = useRef<HTMLDialogElement>(null);
  const navigatorTitle = useRef<HTMLHeadingElement>(null);
  const workingField = useRef<HTMLTextAreaElement>(null);
  const filtered = useMemo(() => filterQuestions(path, query, topic), [path, query, topic]);
  const current = filtered.find(question => question.id === selectedId) ?? filtered[0];
  const index = current ? filtered.indexOf(current) : -1;
  const matchingLabel = `${filtered.length} matching question${filtered.length === 1 ? '' : 's'}`;
  const showAnswer = !attempt || (current && revealed.includes(current.id));
  const hasWorking = Object.values(working).some(value => value.trim());
  const unsavedWorking = hasWorking && JSON.stringify(working) !== downloadedWorking;
  useEffect(() => {
    const dialog = navigator.current;
    if (!dialog) return;
    if (navigatorOpen && !dialog.open) {
      dialog.showModal();
      navigatorTitle.current?.focus({ preventScroll: true });
      dialog.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    } else if (!navigatorOpen && dialog.open) dialog.close();
  }, [navigatorOpen]);
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
      if (!link || event.defaultPrevented || event.button !== 0 || event.altKey || link.hasAttribute('download') || event.ctrlKey || event.metaKey || event.shiftKey || link.getAttribute('target') === '_blank') return;
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
    setNavigatorOpen(false);
    setWorkingOpen(false);
    const url = new URL(window.location.href); url.searchParams.set('question', id);
    window.history.replaceState(null, '', url);
    requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); });
  };
  const reveal = () => {
    if (!current) return;
    setRevealed(previous => [...previous, current.id]);
    requestAnimationFrame(() => {
      answer.current?.focus({ preventScroll: true });
      answer.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  };
  const download = () => {
    const blob = new Blob([compilationMarkdown(path, bank, working)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = `${path.toLowerCase()}-past-paper-study-answers.md`; link.click();
    setDownloadedWorking(JSON.stringify(working));
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const questionList = () => filtered.map((question, i) => <button key={question.id} type="button" aria-current={current?.id === question.id ? 'step' : undefined} onClick={() => choose(question.id)}><span>{String(i + 1).padStart(2, '0')}</span><span><small>{question.topic}</small><strong>{question.title}</strong></span></button>);
  const browserTools = () => <div className="paper-browse-tools">
    <label className="epra-search"><Search size={17}/><input aria-label="Search past-paper questions and answers" placeholder="Find a question…" value={query} onChange={event => setQuery(event.target.value)}/></label>
    <details className="paper-filter-disclosure"><summary aria-label={`Filters${topic ? ' active' : ''}`}><SlidersHorizontal size={17}/><span>Filters</span>{topic && <b className="paper-filter-count" aria-hidden="true">1</b>}</summary><label className="paper-topic-filter">Topic<select aria-label="Topic" value={topic} onChange={event => setTopic(event.target.value)}><option value="">All topics</option>{[...new Set(bank.map(question => question.topic))].map(value => <option key={value}>{value}</option>)}</select></label></details>
    {(query || topic) && <div className="paper-filter-results"><span role="status">{matchingLabel}</span><button type="button" onClick={() => { setQuery(''); setTopic(''); }}>Clear filters</button></div>}
  </div>;
  const workingEditor = current && <div id="paper-working-editor" className="past-paper-working" hidden={!attempt && !workingOpen}>
    {attempt && <h3>Your working</h3>}
    <textarea ref={workingField} aria-label="Your answer and working" aria-describedby="paper-working-hint" rows={6} value={working[current.id] ?? ''} onChange={event => setWorking(previous => ({ ...previous, [current.id]: event.target.value }))} placeholder="Work through the question here…"/>
    <p id="paper-working-hint">Working stays in this open page. Download the compilation to keep it.</p>
  </div>;
  return <div className="past-paper-centre">
    <header className="workspace-page-heading paper-heading"><div><h1>Past papers</h1></div><button type="button" className="past-paper-download" aria-label="Download compilation" onClick={download} disabled={!bank.length}><Download size={17}/><span>Download</span></button></header>
    <PastPaperPathSwitcher active={path}/>
    <div className="past-paper-workspace">
      <aside className="past-paper-browser" aria-label="Question browser"><div className="paper-browser-heading"><h2>Questions</h2><span>{bank.length} {path}</span></div>{browserTools()}<div id="paper-question-list" className="past-paper-list" aria-label="Consolidated question list">{questionList()}{!filtered.length && <p className="paper-browser-empty">No matching questions</p>}</div></aside>
      <div className="past-paper-reading">
      <div className="paper-control-row"><StudyTabs id="paper-study-mode" label="Study mode" className="past-paper-mode" value={attempt ? 'attempt' : 'study'} items={[{ id: 'study', label: 'Study' }, { id: 'attempt', label: 'Attempt first' }]} onChange={value => setAttempt(value === 'attempt')}/><button type="button" className="paper-mobile-navigator" aria-label={`Browse questions${current ? `, ${index + 1} of ${filtered.length}` : ''}${query || topic ? ', filters active' : ''}`} aria-haspopup="dialog" aria-expanded={navigatorOpen} aria-controls="paper-question-dialog" onClick={() => setNavigatorOpen(true)}><List size={17}/><span>Questions</span>{(query || topic) && <b className="paper-filter-count" aria-hidden="true">{Number(Boolean(query)) + Number(Boolean(topic))}</b>}<ChevronDown size={14}/></button></div>
      <div id="paper-study-mode-panel" role="tabpanel" aria-labelledby={`paper-study-mode-${attempt ? 'attempt' : 'study'}`} tabIndex={0}>
      {(query || topic) && <div className="paper-active-filter"><span>{matchingLabel}</span><button type="button" onClick={() => { setQuery(''); setTopic(''); }}>Clear filters</button></div>}
      <p className="paper-working-status" role="status">{hasWorking ? `${unsavedWorking ? 'Working not downloaded' : 'Working downloaded'} · session only` : ''}</p>
      {current ? <article key={current.id} className="past-paper-question">
        <div className="past-paper-stepper">
          <div className="paper-question-meta"><span className="paper-question-position">Question <strong>{String(index + 1).padStart(2, '0')}</strong><span> / {filtered.length}</span></span><p className="epra-eyebrow">{current.topic}</p></div>
          <div><button type="button" aria-label="Previous question" disabled={index === 0} onClick={() => choose(filtered[index - 1].id)}><ArrowLeft size={18}/></button><button type="button" aria-label="Next question" disabled={index === filtered.length - 1} onClick={() => choose(filtered[index + 1].id)}><ArrowRight size={18}/></button></div>
        </div>
        <h2 ref={heading} tabIndex={-1}>{current.title}</h2><div className="past-paper-prompt"><StudyMarkdown prefix={`prompt-${current.id}`}>{current.prompt}</StudyMarkdown></div>
        {attempt && workingEditor}
        {showAnswer ? <div className="past-paper-solution"><section ref={answer} tabIndex={-1} aria-label="Worked answer"><div className="paper-answer-heading"><h3>Worked answer</h3>{!attempt && <button type="button" className="paper-working-toggle" aria-expanded={workingOpen} aria-controls="paper-working-editor" onClick={() => { setWorkingOpen(!workingOpen); if (!workingOpen) requestAnimationFrame(() => workingField.current?.focus({ preventScroll: true })); }}><PencilLine size={15}/><span>Your working</span>{working[current.id]?.trim() && <><span className="paper-draft-dot" aria-hidden="true"/><span className="sr-only"> (contains working)</span></>}</button>}</div>{!attempt && workingEditor}<StudyMarkdown prefix={`paper-${current.id}`}>{current.answer}</StudyMarkdown>{current.diagram && diagrams[current.diagram] && <figure className="past-paper-diagram"><div><Image src={`/past-paper-diagrams/${current.diagram}.svg`} width={900} height={diagrams[current.diagram].height} alt={diagrams[current.diagram].alt} unoptimized/></div><figcaption>{diagrams[current.diagram].caption} <a href={`/past-paper-diagrams/${current.diagram}.svg`} target="_blank" rel="noreferrer">Open full-size diagram <ExternalLink size={12}/></a></figcaption></figure>}</section><details className="past-paper-check"><summary>Check your answer</summary><ul>{current.check.map(item => <li key={item}><InlineMarkdown>{item}</InlineMarkdown></li>)}</ul></details>{current.terms.some(term => term.definitionId) && <details className="past-paper-reference"><summary>BS 7671 reference definitions (17th edition)</summary>{current.terms.map(term => { const definition = definitions.find(item => item.id === term.definitionId); return definition ? <p key={term.term}><strong>{term.term}:</strong> {definition.definition} <a href={`/practice?definition=${definition.id}`}>Related terms</a></p> : null; })}</details>}{attempt && <button className="epra-text-button" onClick={() => { setRevealed(previous => previous.filter(id => id !== current.id)); requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); }); }}>Hide explanation</button>}</div> : <button className="past-paper-reveal" onClick={reveal}>Show worked answer <ArrowRight size={17}/></button>}
      <nav className="paper-question-footer" aria-label="Continue through questions"><button type="button" aria-label="Go to previous question" disabled={index === 0} onClick={() => choose(filtered[index - 1].id)}><ArrowLeft size={17}/> Previous</button><span>{index + 1} / {filtered.length}</span><button type="button" aria-label="Continue to next question" disabled={index === filtered.length - 1} onClick={() => choose(filtered[index + 1].id)}>Next question <ArrowRight size={17}/></button></nav></article> : <div className="past-paper-empty"><Search size={24}/><h2>No matching questions</h2><p>Try another term or clear the filters.</p><button onClick={() => { setQuery(''); setTopic(''); }}>Clear filters</button></div>}
      </div></div></div>
    <dialog ref={navigator} id="paper-question-dialog" className="paper-question-dialog" aria-labelledby="paper-dialog-title" aria-modal="true" onCancel={() => setNavigatorOpen(false)} onClose={() => setNavigatorOpen(false)} onKeyDown={event => {
      if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;
      const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], summary, input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')].filter(node => node.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement as HTMLElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement as HTMLElement))) { event.preventDefault(); first.focus(); }
    }} onClick={event => { if (event.target === event.currentTarget) setNavigatorOpen(false); }}>
      <div className="paper-dialog-heading"><div><h2 id="paper-dialog-title" ref={navigatorTitle} tabIndex={-1}>Browse questions</h2><p>{filtered.length} {path} question{filtered.length === 1 ? '' : 's'}</p></div><button type="button" aria-label="Close question browser" onClick={() => setNavigatorOpen(false)}><X size={20}/></button></div>
      {browserTools()}
      <div className="paper-dialog-list"><div className="past-paper-list">{questionList()}{!filtered.length && <p className="paper-browser-empty">No matching questions</p>}</div></div>
    </dialog>
  </div>;
}
