'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronRight, ClipboardList, Clock3, GraduationCap, Layers3, Search, Sparkles, X } from 'lucide-react';
import { collections, guide, matchesQuestion, practiceTone, type Question, type Collection, type Pathway } from './study-model';
import StudyMarkdown, { InlineMarkdown } from './study-markdown';
import StudyReader, { hasSessionWork, type ReaderSession } from './study-reader';
import DefinitionsBrowser from './definitions-browser';
import definitions from './definitions.json';
import { definitionLearningNotes, guideReferences } from './definition-learning-notes';

type Mode = 'topic' | 'recall' | 'mock' | 'definitions';
type Session = { id: string; path: Pathway; collection: Collection; questionId?: string; quizQuestions?: Question[]; saved?: ReaderSession };

function matchesDefinition(entry: (typeof definitions)[number], query: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const learning = definitionLearningNotes[entry.id];
  const guide = learning?.guide ? guideReferences[learning.guide] : null;
  const haystack = [entry.term, entry.aliases.join(' '), entry.definition, entry.category, learning?.meaning ?? '', learning?.remember ?? '', learning?.guideDetail ?? '', guide?.label ?? '', guide?.summary ?? ''].join(' ').toLocaleLowerCase();
  return words.every(word => haystack.includes(word));
}
export default function StudyCentre() {
  const [path, setPath] = useState<Pathway>('C2');
  const [mode, setMode] = useState<Mode>('topic');
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState<string | null>(null);
  const [requestedDefinition, setRequestedDefinition] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('definition');
    const entry = requested ? definitions.find(item => item.id === requested) : undefined;
    if (!entry) return;
    const frame = window.requestAnimationFrame(() => {
      setMode('definitions');
      setRequestedDefinition(entry.id);
      setQuery(entry.term);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const save = useCallback((saved: ReaderSession) => {
    if (opened) setSessions(previous => ({ ...previous, [opened]: { ...previous[opened], saved } }));
  }, [opened]);
  const dirty = Object.values(sessions).some(session => session.saved && (hasSessionWork(session.saved) || (session.quizQuestions || session.collection.kind === 'mock') && session.saved.phase === 'attempt'));
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    const guard = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.('a');
      if (!link || !link.getAttribute('href')?.startsWith('/')) return;
      if (!window.confirm('Leave practice? Your session working and revision choices will be lost. Download the sessions you want to keep first.')) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', warn);
    document.addEventListener('click', guard, true);
    return () => { window.removeEventListener('beforeunload', warn); document.removeEventListener('click', guard, true); };
  }, [dirty]);
  const [showGuide, setShowGuide] = useState(false);
  const available = collections.filter(c => c.paths.includes(path) && c.kind === mode);
  const found = available.flatMap(c => c.questions.filter(q => matchesQuestion(q, query)).map(q => ({ collection: c, question: q })));
  const definitionFound = mode !== 'definitions' && query.trim() ? definitions.filter(entry => matchesDefinition(entry, query)).slice(0, 18) : [];
  const total = collections.filter(c => c.kind === 'topic' && c.paths.includes(path)).reduce((n,c) => n + c.questions.length, 0);
  function open(collection: Collection, questionId?: string) {
    const id = `${path}-${collection.id}`;
    setSessions(previous => previous[id] ? questionId ? { ...previous, [id]: { ...previous[id], questionId, saved: previous[id].saved ? { ...previous[id].saved!, selected: questionId } : undefined } } : previous : { ...previous, [id]: { id, path, collection, questionId } });
    setOpened(id); window.scrollTo({ top: 0 });
  }
  function openQuiz(questions: Question[]) {
    const current = sessions[opened!];
    const id = `${current.id}-quiz-${Object.keys(sessions).length + 1}`;
    setSessions(previous => ({ ...previous, [id]: { id, path: current.path, collection: current.collection, quizQuestions: questions } }));
    setOpened(id); window.scrollTo({ top: 0 });
  }
  function newAttempt() {
    const previous = sessions[opened!];
    const id = `${previous.path}-${previous.collection.id}-attempt-${Object.keys(sessions).length + 1}`;
    setSessions(all => ({ ...all, [id]: { id, path: previous.path, collection: previous.collection, quizQuestions: previous.quizQuestions } }));
    setOpened(id); window.scrollTo({ top: 0 });
  }
  if (opened && sessions[opened]) {
    const session = sessions[opened];
    return <StudyReader key={opened} collection={session.collection} initialId={session.saved ? undefined : session.questionId} saved={session.saved} quizQuestions={session.quizQuestions} path={session.path} onSave={save} onQuiz={openQuiz} onNewAttempt={newAttempt} onClose={() => { setOpened(null); window.scrollTo({ top: 0 }); }}/>;
  }
  return <div className="epra-centre">
    <div className="epra-eyebrow"><span className="epra-status-dot"/> THE SELF-STUDY PRACTICE CENTRE</div>
    <section className="epra-hero"><div><h1>Build understanding.<br/><em>Walk in prepared.</em></h1><p>Your space to work through questions, follow every calculation and prepare for your EPRA exam. One question at a time.</p><button className="epra-text-button" onClick={() => setShowGuide(!showGuide)} aria-expanded={showGuide}><BookOpen size={16}/> How to use your study pack <ChevronRight size={15}/></button></div><aside className="epra-method"><span className="epra-eyebrow">A BETTER WAY TO REVISE</span><ol><li><span>01</span><div><strong>Try it yourself</strong><p>Read the full question. Write your reasoning.</p></div></li><li><span>02</span><div><strong>Follow the worked answer</strong><p>Reveal the method, calculations and checks.</p></div></li><li><span>03</span><div><strong>Make it stick</strong><p>Reflect, revisit, then try a complete paper.</p></div></li></ol></aside></section>
    {showGuide && <section className="epra-guide"><button className="epra-text-button" onClick={() => setShowGuide(false)}><X size={16}/> Close study guide</button><StudyMarkdown prefix="guide">{guide.notes}</StudyMarkdown></section>}
    <section className="epra-pathways" aria-label="Choose your licence pathway">{(['C2','C1'] as const).map(p => <button key={p} className={`epra-path ${path === p ? 'is-selected' : ''}`} aria-pressed={path === p} onClick={() => { setPath(p); setQuery(''); setRequestedDefinition(null); }}><span className="epra-path-icon">{p}</span><span><small>YOUR LICENCE PATHWAY</small><strong>{p === 'C2' ? 'Build a strong foundation' : 'Extend your electrical knowledge'}</strong><span>{p === 'C2' ? 'Core topics, recall & the C2 mock paper' : 'Shared foundations, three-phase & the C1 mock paper'}</span></span><span className="epra-radio">{path === p && <Check size={14}/>}</span></button>)}</section>
    {Object.keys(sessions).length > 0 && <section className="epra-sessions" aria-label="Sessions in this tab"><h2>Continue this session</h2><p>Your working and revision choices stay here while this page is open. Download before closing or reloading. A timed paper keeps counting while you browse.</p><div>{Object.values(sessions).map(session => <button className="epra-button" key={session.id} onClick={() => { setOpened(session.id); window.scrollTo({ top: 0 }); }}>{session.path} · {session.collection.title}{session.quizQuestions ? ` · Quiz ${Object.values(sessions).filter(item => item.quizQuestions).indexOf(session) + 1}` : session.id.includes('-attempt-') ? ` · Attempt ${session.id.split('-attempt-')[1]}` : ''}<ArrowRight size={16}/></button>)}</div></section>}
    <div className="epra-workspace-heading"><div><span className="epra-eyebrow">YOUR {path} STUDY DESK</span><h2>{mode === 'definitions' ? 'Find a definition' : 'Choose how you practise'}</h2></div><p>{mode === 'definitions' ? '138 definitions · C2 + C1' : <>{total} topic questions <span>·</span> 110 recall questions <span>·</span> 1 complete mock</>}</p></div>
    <div className="epra-toolbar"><div className="epra-tabs" role="group" aria-label="Practice type">{([{ id: 'topic', label: 'Topic practice', icon: Layers3 }, { id: 'recall', label: 'Recall quizzes', icon: Sparkles }, { id: 'mock', label: 'Mock exams', icon: ClipboardList }, { id: 'definitions', label: 'Definitions', icon: BookOpen }] as const).map(item => <button key={item.id} aria-pressed={mode === item.id} onClick={() => { setMode(item.id); setQuery(''); setRequestedDefinition(null); }}><item.icon size={17}/>{item.label}</button>)}</div><label className="epra-search"><Search size={17}/><span className="sr-only">{mode === 'definitions' ? 'Search definitions' : `Search ${mode === 'mock' ? 'mock' : mode} questions`}</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder={mode === 'definitions' ? 'Find a definition…' : 'Find a topic or question…'}/>{query && <button onClick={() => { setQuery(''); setRequestedDefinition(null); }} aria-label="Clear search"><X size={15}/></button>}</label></div>
    <p className="epra-mode-note">{mode === 'definitions' ? 'Search a term or abbreviation, or open a learning area below.' : mode === 'topic' ? 'Follow the study order or go straight to the topic you need. Shared foundations appear in both pathways.' : mode === 'recall' ? 'Revisit the complete shared recall bank, or test yourself with a fresh set of 10 questions.' : 'Original practice papers from your study pack. Each paper includes all five questions, 100 marks and complete teaching answers. These are not official EPRA papers.'}</p>
    {mode === 'definitions' ? <DefinitionsBrowser key={requestedDefinition ?? 'browse'} query={query} initialOpenId={requestedDefinition} onRequestTerm={(term, id) => { setQuery(term); setRequestedDefinition(id); }}/> : query.trim() ? <section className="epra-results" aria-label="Search results"><p role="status">{found.length + definitionFound.length} matching results · {found.length} questions · {definitionFound.length} definitions</p>{found.map(({ collection, question }) => <button className="epra-result" key={question.id} onClick={() => open(collection, question.id)}><span><small>Question · {collection.title} · {question.topic}</small><strong><InlineMarkdown>{question.title}</InlineMarkdown></strong></span><ArrowRight size={18}/></button>)}{definitionFound.map(entry => <button className="epra-result epra-definition-result" key={entry.id} onClick={() => { setMode('definitions'); setQuery(entry.term); setRequestedDefinition(entry.id); window.scrollTo({ top: 0 }); }}><span><small>Definition · {entry.category}</small><strong>{entry.term}</strong><p>{definitionLearningNotes[entry.id]?.meaning}</p></span><ArrowRight size={18}/></button>)}{!found.length && !definitionFound.length && <div className="epra-empty"><Search size={28}/><h3>No results found</h3><p>Try a broader term such as “earthing”, “current” or “cable”.</p><button className="epra-button" onClick={() => setQuery('')}>Clear search</button></div>}</section> : <section className={`epra-collection-grid ${mode !== 'topic' ? 'epra-wide-cards' : ''}`} aria-label={mode === 'topic' ? 'Study topics' : mode === 'recall' ? 'Recall banks' : 'Mock papers'}>{available.map(c => <button className="epra-collection" data-practice-tone={practiceTone(c)} key={c.id} onClick={() => open(c)}><div className="epra-card-top"><span className="epra-step">{c.step ? `STEP ${String(c.step).padStart(2,'0')}` : c.kind === 'mock' ? <><ClipboardList size={18}/> FULL PAPER</> : <><Sparkles size={18}/> ACTIVE RECALL</>}</span><span className={`epra-badge ${c.paths.length === 1 ? 'epra-badge-accent' : ''}`}>{c.paths.length === 1 ? path : 'C2 + C1'}</span></div><h3>{c.title}</h3><p>{c.kind === 'mock' ? 'Set aside two hours. Attempt the whole paper, then review every answer at your own pace.' : c.kind === 'recall' ? '110 high-priority questions to strengthen recall and practise explaining your reasoning.' : [...new Set(c.questions.map(q => q.topic))].slice(0,3).join(' · ')}</p><div className="epra-card-bottom"><span>{c.kind === 'mock' ? <><Clock3 size={15}/> 2 hours · 100 marks</> : <><BookOpen size={15}/> {c.questions.length} questions</>}</span><span>{c.kind === 'mock' ? 'Open paper' : 'Start practising'} <ArrowRight size={16}/></span></div></button>)}</section>}
    <footer className="epra-centre-footer"><GraduationCap size={20}/><p><strong>Understanding comes before speed.</strong> Full questions. Complete answers. Space to work at your own pace.</p><Link className="pwa-install-link" href="/install">Install on your phone <ArrowRight size={16}/></Link><span>Session-only practice<br/>No sign-in required</span></footer>
  </div>;
}
