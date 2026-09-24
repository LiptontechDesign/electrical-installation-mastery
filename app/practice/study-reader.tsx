'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Download, Eye, EyeOff, Flag, List, RotateCcw, Search } from 'lucide-react';
import StudyMarkdown, { InlineMarkdown } from './study-markdown';
import { displayAnswer, matchesQuestion, sampleQuestions, prerequisiteQuestions, prerequisiteIds, questionParts, multipleChoiceItems, practiceTone, type Collection, type Pathway, type Question } from './study-model';

type Confidence = 'understood' | 'revisit';
export type ReaderSession = {
  questions: Question[]; selected: string; revealed: Record<string, boolean>; drafts: Record<string, string>;
  flags: Record<string, boolean>; confidence: Record<string, Confidence>; phase: 'ready' | 'attempt' | 'review';
  deadline: number | null; marks: Record<string, number | undefined>; responses: Record<string, Record<string, string>>;
  partMarks: Record<string, Record<string, number | undefined>>;
};
export function hasSessionWork(session: ReaderSession) {
  return Object.values(session.drafts).some(value => value.trim()) || Object.values(session.flags).some(Boolean)
    || Object.keys(session.confidence).length > 0 || Object.values(session.marks).some(value => value !== undefined)
    || Object.values(session.responses).some(parts => Object.values(parts).some(value => value.trim()))
    || Object.values(session.partMarks).some(parts => Object.values(parts).some(value => value !== undefined))
    || session.phase !== 'ready' && session.deadline !== null;
}

export default function StudyReader({ collection, initialId, path, onClose, saved, quizQuestions, onSave, onQuiz, onNewAttempt }: { collection: Collection; initialId?: string; path: Pathway; onClose: () => void; saved?: ReaderSession; quizQuestions?: Question[]; onSave: (session: ReaderSession) => void; onQuiz: (questions: Question[]) => void; onNewAttempt: () => void }) {
  const isMock = collection.kind === 'mock';
  const [questions] = useState(saved?.questions ?? quizQuestions ?? collection.questions);
  const [selected, setSelected] = useState(initialId ?? saved?.selected ?? questions[0].id);
  const [revealed, setRevealed] = useState<Record<string, boolean>>(saved?.revealed ?? {});
  const [drafts, setDrafts] = useState<Record<string, string>>(saved?.drafts ?? {});
  const [flags, setFlags] = useState<Record<string, boolean>>(saved?.flags ?? {});
  const [confidence, setConfidence] = useState<Record<string, Confidence>>(saved?.confidence ?? {});
  const [topic, setTopic] = useState('all');
  const [query, setQuery] = useState('');
  const [onlyRevisit, setOnlyRevisit] = useState(false);
  const quiz = !!quizQuestions;
  const [phase, setPhase] = useState<'ready' | 'attempt' | 'review'>(saved?.phase ?? (isMock ? 'ready' : 'attempt'));
  const [deadline, setDeadline] = useState<number | null>(saved?.deadline ?? null);
  const [remaining, setRemaining] = useState(7200);
  const [showNotes, setShowNotes] = useState(false);
  const [finishPrompt, setFinishPrompt] = useState(false);
  const [marks, setMarks] = useState<Record<string, number | undefined>>(saved?.marks ?? {});
  const [responses, setResponses] = useState<ReaderSession['responses']>(saved?.responses ?? {});
  const [partMarks, setPartMarks] = useState<ReaderSession['partMarks']>(saved?.partMarks ?? {});
  const [compare, setCompare] = useState(false);
  useEffect(() => { onSave({ questions, selected, revealed, drafts, flags, confidence, phase, deadline, marks, responses, partMarks }); }, [onSave, questions, selected, revealed, drafts, flags, confidence, phase, deadline, marks, responses, partMarks]);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lockAnswers = (isMock || quiz) && phase !== 'review';
  const filtered = questions.filter(q => (topic === 'all' || q.topic === topic) && matchesQuestion(q, query) && (!onlyRevisit || confidence[q.id] === 'revisit' || flags[q.id]));
  const current = filtered.find(q => q.id === selected) ?? filtered[0] ?? questions[0];
  const index = questions.indexOf(current);
  const visibleIndex = filtered.indexOf(current);
  const drafted = questions.filter(q => drafts[q.id]?.trim() || Object.values(responses[q.id] ?? {}).some(value => value.trim())).length;
  const reviewed = questions.filter(q => confidence[q.id]).length;
  const assessedMarks = Object.fromEntries(questions.map(q => {
    const parts = questionParts(q).parts;
    const entered = partMarks[q.id] ?? {};
    return [q.id, parts.length && parts.every(part => entered[part.label] !== undefined) ? parts.reduce((sum, part) => sum + (entered[part.label] ?? 0), 0) : marks[q.id]];
  }));
  const scored = questions.filter(q => assessedMarks[q.id] !== undefined);
  const score = scored.reduce((sum,q) => sum + (assessedMarks[q.id] ?? 0), 0);
  const prerequisites = prerequisiteQuestions(current, collection.questions);
  const parts = questionParts(current);
  const mcq = multipleChoiceItems(current);
  const independentCount = filtered.filter(q => prerequisiteIds(q).length === 0).length;
  const status = (q: Question) => confidence[q.id] === 'revisit' ? 'Needs revision' : confidence[q.id] ? 'Reviewed' : drafts[q.id]?.trim() || Object.values(responses[q.id] ?? {}).some(value => value.trim()) ? 'Attempted' : 'Not attempted';
  function jumpToAnswer() { document.getElementById(`answer-${current.id}`)?.focus(); document.getElementById(`answer-${current.id}`)?.scrollIntoView({ block: 'start' }); }
  function respond(label: string, value: string) { setResponses({ ...responses, [current.id]: { ...responses[current.id], [label]: value } }); }

  const timedOut = deadline !== null && remaining === 0;
  const select = useCallback((q: Question) => {
    setSelected(q.id); setFinishPrompt(false); setNavigatorOpen(false);
    window.requestAnimationFrame(() => { titleRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); titleRef.current?.focus({ preventScroll: true }); });
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (phase === 'ready' || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || (event.target as Element).closest?.('input, textarea, select, [contenteditable=true], .epra-table-scroll, .katex-display, pre')) return;
      const next = event.key === 'ArrowRight' ? filtered[visibleIndex + 1] : event.key === 'ArrowLeft' ? filtered[visibleIndex - 1] : null;
      if (next) { event.preventDefault(); select(next); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [filtered, visibleIndex, phase, select]);

  useEffect(() => {
    if (deadline === null || phase !== 'attempt') return;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0) { setPhase('review'); setFinishPrompt(false); }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [deadline, phase]);

  function revealAnswer() {
    if (revealed[current.id]) { setRevealed({ ...revealed, [current.id]: false }); select(current); return; }
    setRevealed({ ...revealed, [current.id]: true });
    window.requestAnimationFrame(() => {
      const answer = document.getElementById(`answer-${current.id}`);
      answer?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      answer?.focus({ preventScroll: true });
    });
  }
  function leave() { onClose(); }
  function applyFilters(nextTopic: string, nextQuery: string, nextRevisit: boolean) {
    setTopic(nextTopic); setQuery(nextQuery); setOnlyRevisit(nextRevisit);
    const result = questions.filter(q => (nextTopic === 'all' || q.topic === nextTopic) && matchesQuestion(q, nextQuery) && (!nextRevisit || confidence[q.id] === 'revisit' || flags[q.id]));
    if (result.length && !result.some(q => q.id === selected)) setSelected(result[0].id);
  }
  function startMock(timed: boolean) { setPhase('attempt'); setRemaining(7200); setDeadline(timed ? Date.now() + 7200000 : null); window.scrollTo({ top: 0 }); }
  function startQuiz() { const chosen = sampleQuestions(filtered); if (chosen.length) onQuiz(chosen); }
  function download() {
    const body = `# ${path} — ${collection.title}\n\n` + questions.map(q => `## ${q.title}\n\nID: ${q.id}\nFlagged: ${flags[q.id] ? 'Yes' : 'No'}\n\n${q.question}\n\n${[...new Set([...Object.keys(responses[q.id] ?? {}), ...Object.keys(partMarks[q.id] ?? {})])].map(label => [label, responses[q.id]?.[label] ?? '(No written response)']).map(([label, value]) => `### My response (${label})\n\n${value}\n${partMarks[q.id]?.[label] !== undefined ? `Self-assessed part marks: ${partMarks[q.id][label]}/${questionParts(q).parts.find(part => part.label === label)?.marks}` : ''}`).join('\n\n')}\n\n### My working\n\n${drafts[q.id] || '(No written working)'}\n\nReview: ${confidence[q.id] ?? 'Not reviewed'}${assessedMarks[q.id] !== undefined ? `\nSelf-assessed marks: ${assessedMarks[q.id]}/20` : ''}\n`).join('\n---\n\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${collection.id}-my-working.md`; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={`epra-reader ${compare ? 'epra-compare' : ''}`} data-practice-tone={practiceTone(collection)}>
    <div className="epra-reader-top"><button className="epra-text-button" onClick={leave}><ArrowLeft size={16}/> Practice centre</button><span>{path} pathway <ChevronRight size={13}/> {isMock ? 'Mock exam' : quiz ? 'Recall quiz' : 'Topic practice'}</span><button className="epra-text-button" onClick={download}><Download size={16}/> <span>Download my working</span></button></div>
    <header className="epra-reader-heading"><div><span className="epra-eyebrow">{collection.step ? `STEP ${String(collection.step).padStart(2,'0')}` : isMock ? 'FULL MOCK PAPER' : 'RECALL & REINFORCEMENT'} · {collection.paths.length === 2 ? 'SHARED C2 + C1 KNOWLEDGE' : `${path} PATHWAY`}</span><h1>{collection.title}</h1><p>{isMock ? '5 complete questions · 100 marks · 2 hours' : `${questions.length} questions · ${quiz ? 'Attempt first, review afterwards' : 'Complete worked answers, at your pace'}`}</p></div>{phase === 'attempt' && isMock && <div className="epra-timer" role="timer" aria-label="Time remaining"><Clock3 size={19}/>{deadline === null ? 'Untimed practice' : `${Math.floor(remaining / 3600)}:${String(Math.floor(remaining % 3600 / 60)).padStart(2,'0')}:${String(remaining % 60).padStart(2,'0')}`}</div>}</header>
    {isMock && phase === 'ready' ? <section className="epra-exam-start"><div className="epra-exam-intro"><span className="epra-eyebrow">MAKE ROOM TO THINK</span><h2>Your practice exam starts here.</h2><p>Use the on-screen working area or pen and paper. Move freely between questions and flag anything you want to revisit. Answers stay hidden until you finish.</p><div className="epra-exam-facts"><span><strong>02:00</strong>hours</span><span><strong>5</strong>questions</span><span><strong>100</strong>marks</span></div><button className="epra-button epra-primary" onClick={() => startMock(true)}>Start timed exam <ArrowRight size={17}/></button><button className="epra-button" onClick={() => startMock(false)}>Practise without a timer</button><p className="epra-small">Working is kept in this session only. Download it before leaving. At two hours, the paper opens in review mode.</p></div><div className="epra-paper-instructions"><StudyMarkdown prefix="instructions">{collection.notes.split('# END OF EXAM PAPER')[0]}</StudyMarkdown></div></section> : <>
    {phase === 'review' && (isMock || quiz) && <section className="epra-review-summary" role="status"><Check size={23}/><div><h2>{timedOut ? 'Time is up. Let’s review.' : 'Attempt complete. Now build understanding.'}</h2><p>{drafted} of {questions.length} questions have written working. Reveal each answer, compare your reasoning and choose what to revisit.</p>{isMock && <p><strong>Self-assessment: {score}/{scored.length * 20} marks reviewed</strong> · {scored.length}/5 questions scored{scored.length === 5 ? ` · Total: ${score}/100` : ''}</p>}<button className="epra-button" onClick={onNewAttempt}>Start another attempt</button></div></section>}
    <div className="epra-study-layout"><aside className="epra-question-nav"><button className="epra-mobile-navigator" aria-expanded={navigatorOpen} aria-controls="question-navigator" onClick={() => setNavigatorOpen(!navigatorOpen)}><List size={18}/><span>Browse questions <small>{index + 1} of {questions.length}</small></span><ChevronDown size={17}/></button><div id="question-navigator" className={`epra-navigator-content ${navigatorOpen ? 'is-open' : ''}`}><div className="epra-nav-heading"><strong>{quiz ? 'Your quiz' : isMock ? 'Your paper' : 'Question navigator'}</strong><span>{questions.length}</span></div>{!isMock && !quiz && <><label className="epra-field">Topic<select value={topic} onChange={e => applyFilters(e.target.value, query, onlyRevisit)}><option value="all">All topics</option>{[...new Set(questions.map(q => q.topic))].map(t => <option key={t}>{t}</option>)}</select></label><label className="epra-search"><Search size={16}/><input aria-label="Find a question" placeholder="Find a question…" value={query} onChange={e => applyFilters(topic, e.target.value, onlyRevisit)}/></label></>}
      <label className="epra-revisit-filter"><input type="checkbox" checked={onlyRevisit} onChange={e => applyFilters(topic, query, e.target.checked)}/> Flagged / needs revision</label><details className="epra-question-list" open><summary>Browse questions · {filtered.length}</summary><nav aria-label="Questions">{filtered.map(q => <button key={q.id} className={q.id === current.id ? 'is-current' : ''} aria-current={q.id === current.id ? 'step' : undefined} onClick={() => select(q)}><span><InlineMarkdown>{q.title}</InlineMarkdown><small className="epra-question-state">{status(q)}{flags[q.id] ? ' · Flagged' : ''}</small></span>{flags[q.id] ? <Flag size={14}/> : confidence[q.id] === 'understood' ? <Check size={14}/> : drafts[q.id]?.trim() ? <span className="epra-draft-dot" aria-label="Has working"/> : null}</button>)}{!filtered.length && <p className="epra-small">No matching questions. Change your filters to browse again.</p>}</nav></details>
      {!isMock && !quiz && <button className="epra-button epra-quiz-start" disabled={!independentCount} onClick={startQuiz}>Quiz me · {Math.min(10,independentCount)} questions <ArrowRight size={16}/></button>}
      {!isMock && !quiz && <p className="epra-small">Quizzes use self-contained questions. Linked exercises stay together in topic study.</p>}<div className="epra-session-note"><BookOpen size={18}/><p>{reviewed} of {questions.length} reviewed<br/><span>Return to the centre freely. Download before closing or reloading.</span></p></div>{!lockAnswers && <button className="epra-text-button" onClick={() => setShowNotes(!showNotes)} aria-expanded={showNotes}>Study notes & source guidance <ChevronRight size={14}/></button>}
    </div></aside><div className="epra-question-column">
      {showNotes && !lockAnswers && <section className="epra-guide"><button className="epra-text-button" onClick={() => setShowNotes(false)}>Close source guidance</button><StudyMarkdown prefix="source-guide">{collection.notes}</StudyMarkdown></section>}
      {finishPrompt && <section className="epra-finish-prompt" role="alert"><h2>Finish and open answer review?</h2><p>You have written working for {drafted} of {questions.length} questions. You can compare your work with every complete answer after finishing.</p><button className="epra-button epra-primary" onClick={() => { setPhase('review'); setFinishPrompt(false); }}>Finish & review answers</button><button className="epra-button" onClick={() => setFinishPrompt(false)}>Keep working</button></section>}
      {!filtered.length ? <section className="epra-empty"><Search size={28}/><h2>No questions match these filters</h2><p>Clear your filters to return to the question bank.</p><button className="epra-button" onClick={() => applyFilters('all', '', false)}>Clear filters</button></section> : <><article key={current.id} className="epra-question-card"><div className="epra-question-meta"><span>IN THIS SET · {index + 1} / {questions.length}</span><button className="epra-text-button" aria-pressed={!!flags[current.id]} onClick={() => setFlags({ ...flags, [current.id]: !flags[current.id] })}><Flag size={15}/>{flags[current.id] ? 'Flagged' : 'Flag for later'}</button></div><p className="epra-question-topic"><InlineMarkdown>{current.topic}</InlineMarkdown></p><h2 ref={titleRef} tabIndex={-1}><InlineMarkdown>{current.title}</InlineMarkdown></h2><div className="epra-study-actions"><span className="epra-state-label">{status(current)}{current.marks ? ` · ${current.marks} marks` : ''}</span>{!lockAnswers && <button className="epra-button" aria-pressed={compare} onClick={() => setCompare(!compare)}>Compare side by side</button>}</div>
      {prerequisites.length > 0 && <aside className="epra-context"><h3>Earlier exercise information</h3><p>Use these original questions for the shared information and any preceding calculation. Their answers remain hidden.</p>{prerequisites.map(q => <details key={q.id} open><summary><InlineMarkdown>{q.title}</InlineMarkdown></summary><StudyMarkdown prefix={`context-${current.id}-${q.id}`}>{q.question}</StudyMarkdown></details>)}</aside>}
      <div className={`epra-answer-workspace ${!lockAnswers && revealed[current.id] ? 'has-answer' : ''}`}><div className="epra-attempt-pane">
      {mcq.length ? <><StudyMarkdown prefix={`question-${current.id}`}>{current.question.slice(0, current.question.indexOf('### 1.'))}</StudyMarkdown>{mcq.map(item => <fieldset className="epra-mcq" key={item.label} disabled={phase === 'review'}><legend>Question {item.label} · 1 mark</legend><StudyMarkdown prefix={`mcq-${item.label}`}>{item.prompt}</StudyMarkdown>{item.choices.map(choice => <label key={choice.value}><input type="radio" name={`choice-${current.id}-${item.label}`} value={choice.value} checked={responses[current.id]?.[item.label] === choice.value} onChange={() => respond(item.label, choice.value)}/><span><strong>{choice.value}.</strong> <InlineMarkdown>{choice.text}</InlineMarkdown></span></label>)}</fieldset>)}</> : parts.parts.length ? <><StudyMarkdown prefix={`question-${current.id}`}>{parts.intro}</StudyMarkdown>{parts.parts.map(part => <section className="epra-part" key={part.label}><StudyMarkdown prefix={`part-${current.id}-${part.label}`}>{part.text}</StudyMarkdown><label className="epra-part-working">Your working — part ({part.label})<textarea rows={3} value={responses[current.id]?.[part.label] ?? ''} readOnly={phase === 'review'} onChange={e => respond(part.label, e.target.value)}/></label></section>)}</> : <StudyMarkdown prefix={`question-${current.id}`}>{current.question}</StudyMarkdown>}
      {isMock && <details className="epra-original-question"><summary>View the complete original question</summary><StudyMarkdown prefix={`original-${current.id}`}>{current.question}</StudyMarkdown></details>}<div className="epra-working"><label htmlFor="epra-working">{mcq.length || parts.parts.length ? 'Additional working' : 'Your working'} <span>Write your steps, calculations or reasoning.</span></label><textarea id="epra-working" rows={5} value={drafts[current.id] ?? ''} readOnly={phase === 'review' && (quiz || isMock)} onChange={e => setDrafts({ ...drafts, [current.id]: e.target.value })} placeholder="Start with what you know…"/><small>{phase === 'review' && (quiz || isMock) ? 'Your original attempt is preserved for comparison.' : 'Session only. You can also work on paper.'}</small></div>
      {lockAnswers ? <div className="epra-answer-locked"><EyeOff size={18}/><span>Answers open after you finish {isMock ? 'the paper' : 'the quiz'}.</span></div> : <button className={`epra-reveal ${revealed[current.id] ? 'is-revealed' : ''}`} aria-expanded={!!revealed[current.id]} aria-controls={`answer-${current.id}`} onClick={revealAnswer}>{revealed[current.id] ? <EyeOff size={19}/> : <Eye size={19}/>}<span>{revealed[current.id] ? 'Hide Answer' : 'Reveal Answer'}</span><span className="epra-reveal-note">{revealed[current.id] ? 'Return to your own reasoning' : 'Compare your method, not just the result'}</span></button>}
      </div>{!lockAnswers && revealed[current.id] && <section id={`answer-${current.id}`} className="epra-answer" tabIndex={-1} aria-label="Worked answer"><div className="epra-answer-label"><BookOpen size={17}/><span>THE COMPLETE WORKED ANSWER</span></div>{mcq.length > 0 && <div className="epra-choice-review"><h3>Your choices and the supplied answer key</h3><p>{mcq.filter(item => responses[current.id]?.[item.label] === item.correct).length} / {mcq.length} match the supplied key. Review the explanations below.</p><ol>{mcq.map(item => <li key={item.label}>Q{item.label}: Your choice <strong>{responses[current.id]?.[item.label] ?? 'Not answered'}</strong> · Supplied answer <strong>{item.correct}</strong></li>)}</ol></div>}<StudyMarkdown outline prefix={`solution-${current.id}`}>{displayAnswer(current)}</StudyMarkdown><div className="epra-reflection"><h3>How did you get on?</h3><p>Use your understanding of the method to guide what you revise next.</p><div><button className="epra-button" aria-pressed={confidence[current.id] === 'understood'} onClick={() => setConfidence({ ...confidence, [current.id]: 'understood' })}><Check size={16}/> I understand this</button><button className="epra-button" aria-pressed={confidence[current.id] === 'revisit'} onClick={() => setConfidence({ ...confidence, [current.id]: 'revisit' })}><RotateCcw size={16}/> Revisit this question</button></div>{isMock && parts.parts.length > 0 ? <fieldset className="epra-part-marks"><legend>Self-assess each part</legend><p>Use the supplied marking guidance. The total appears when every part has a mark.</p>{parts.parts.map(part => <label key={part.label}>Part ({part.label}) · /{part.marks}<input aria-label={`Self-assessed marks for part (${part.label}) out of ${part.marks}`} type="number" min={0} max={part.marks} step={1} value={partMarks[current.id]?.[part.label] ?? ''} onChange={e => setPartMarks({ ...partMarks, [current.id]: { ...partMarks[current.id], [part.label]: e.target.value === '' ? undefined : Math.min(part.marks, Math.max(0, Math.round(Number(e.target.value) || 0))) } })}/></label>)}</fieldset> : isMock && <label className="epra-field epra-mark-field">Your self-assessed marks (0–20)<input type="number" min={0} max={20} step={1} value={marks[current.id] ?? ''} onChange={e => setMarks({ ...marks, [current.id]: e.target.value === '' ? undefined : Math.min(20,Math.max(0,Math.round(Number(e.target.value) || 0))) })}/><small>Compare with the supplied marking scheme. This is your assessment, not an official grade.</small></label>}</div></section>}
      </div></article><nav className="epra-reading-dock" aria-label="Question controls"><div className="epra-dock-inner"><div className="epra-dock-position"><span>IN THIS SET <strong>{visibleIndex + 1} <small>/ {filtered.length}</small></strong></span><progress aria-label="Position in question set" value={visibleIndex + 1} max={filtered.length}/></div><button className="epra-button" aria-keyshortcuts="ArrowLeft" disabled={visibleIndex <= 0} onClick={() => select(filtered[visibleIndex - 1])}><ChevronLeft size={17}/> <span>Previous</span></button>{!lockAnswers && revealed[current.id] && <button className="epra-button epra-dock-question" onClick={() => select(current)}>Question</button>}{!lockAnswers ? <button className="epra-button epra-dock-answer" onClick={() => revealed[current.id] ? jumpToAnswer() : revealAnswer()}>{revealed[current.id] ? <BookOpen size={17}/> : <Eye size={17}/>}<span>{revealed[current.id] ? 'Go to answer' : 'Show answer'}</span></button> : <span className="epra-dock-hint"><EyeOff size={15}/> Attempt first. Review afterwards.</span>}<button className="epra-button epra-primary" aria-keyshortcuts="ArrowRight" disabled={visibleIndex === filtered.length - 1} onClick={() => select(filtered[visibleIndex + 1])}><span>Next question</span> <ChevronRight size={17}/></button><span className="epra-keyboard-hint">← → to move</span></div></nav></>}
      {(isMock || quiz) && phase === 'attempt' && <button className="epra-button epra-primary epra-finish" onClick={() => { setFinishPrompt(true); window.scrollTo({ top: 0 }); }}>Finish {isMock ? 'paper' : 'quiz'} & review <ArrowRight size={17}/></button>}
    </div></div></>}
  </div>;
}
