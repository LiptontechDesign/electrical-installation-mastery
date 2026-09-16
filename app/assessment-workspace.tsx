'use client';

import { useDeferredValue, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Check, CheckCircle2, ChevronDown, Circle, Clock3, GraduationCap, Lightbulb, ListChecks, Menu, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { assessmentQuestions, type AssessmentCollection, type AssessmentPath, type AssessmentQuestion } from './assessment-types';
import { assessmentChoiceById } from './assessment-choice-types';
import type { LearnerState } from './learner-state';
import AssessmentMarkdown from './assessment-markdown';
import AssessmentDiagram from './assessment-diagram';

type Review = LearnerState['assessment']['reviews'][string];
type Mode = 'study' | 'mock' | 'oral' | 'diagram';
const modes: { id: Mode; label: string; collections: AssessmentCollection[] }[] = [
  { id: 'study', label: 'Study bank', collections: ['stage', 'specialist', 'review', 'rapid'] },
  { id: 'mock', label: 'Mock papers', collections: ['mock'] },
  { id: 'oral', label: 'Oral practice', collections: ['oral'] },
  { id: 'diagram', label: 'Drawing practice', collections: ['diagram'] },
];
const formatLabels: Record<string, string> = {
  mcq: 'Multiple choice', definition: 'Concept check', 'short-answer': 'Knowledge check', comparison: 'Comparison', calculation: 'Calculation',
  diagram: 'Drawing', procedure: 'Procedure', 'fault-scenario': 'Fault diagnosis', 'design-scenario': 'Design', structured: 'Structured', oral: 'Oral / viva',
};
const statusLabels = {
  'kenya-verified': 'Kenya context verified',
  'bs7671-technical-baseline': 'Current technical baseline',
  'check-kenyan-requirement': 'Verify adopted Kenyan requirement',
};
const availableQuestions = assessmentQuestions.filter(question => assessmentChoiceById.has(question.id));

function modeFor(question: AssessmentQuestion): Mode {
  return modes.find(mode => mode.collections.includes(question.collection))?.id ?? 'study';
}

export default function AssessmentWorkspace({ assessment, onSelect, onReview, onBookmark, onLesson }: {
  assessment: LearnerState['assessment'];
  onSelect: (id: string) => void;
  onReview: (id: string, review: Review) => void;
  onBookmark: (id: string) => void;
  onLesson: (id: string) => void;
}) {
  const initial = availableQuestions.find(question => question.id === assessment.activeQuestionId) ?? availableQuestions[0];
  const [pathway, setPathway] = useState<AssessmentPath>(initial.pathway);
  const [mode, setMode] = useState<Mode>(modeFor(initial));
  const [sectionId, setSectionId] = useState(initial.sectionId);
  const [query, setQuery] = useState('');
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const titleRef = useRef<HTMLHeadingElement>(null);

  const modeDefinition = modes.find(item => item.id === mode)!;
  const modeQuestions = useMemo(() => availableQuestions.filter(question => question.pathway === pathway && modeDefinition.collections.includes(question.collection)), [pathway, modeDefinition]);
  const sections = useMemo(() => [...new Map(modeQuestions.map(question => [question.sectionId, question.sectionTitle])).entries()], [modeQuestions]);
  const resolvedSection = sections.some(([id]) => id === sectionId) ? sectionId : sections[0]?.[0];
  const sectionQuestions = useMemo(() => modeQuestions.filter(question => question.sectionId === resolvedSection && (!deferredQuery || `${question.id} ${question.title} ${question.prompt}`.toLocaleLowerCase().includes(deferredQuery))), [modeQuestions, resolvedSection, deferredQuery]);
  const active = sectionQuestions.find(question => question.id === assessment.activeQuestionId) ?? sectionQuestions[0] ?? modeQuestions[0];
  const activeIndex = active ? sectionQuestions.findIndex(question => question.id === active.id) : -1;
  const review = active ? assessment.reviews[active.id] : undefined;
  const choiceSet = active ? assessmentChoiceById.get(active.id) : undefined;
  const reviewedInMode = modeQuestions.filter(question => assessment.reviews[question.id]).length;
  const correctInMode = modeQuestions.filter(question => assessment.reviews[question.id]?.isCorrect).length;

  const select = (question: AssessmentQuestion) => {
    onSelect(question.id);
    setNavigatorOpen(false);
    window.requestAnimationFrame(() => titleRef.current?.focus());
  };
  const choosePath = (next: AssessmentPath) => {
    const first = availableQuestions.find(question => question.pathway === next && modeDefinition.collections.includes(question.collection))
      ?? availableQuestions.find(question => question.pathway === next);
    if (!first) return;
    setPathway(next); setMode(modeFor(first)); setSectionId(first.sectionId); setQuery(''); select(first);
  };
  const chooseMode = (next: Mode) => {
    const definition = modes.find(item => item.id === next)!;
    const first = availableQuestions.find(question => question.pathway === pathway && definition.collections.includes(question.collection));
    if (!first) return;
    setMode(next); setSectionId(first.sectionId); setQuery(''); select(first);
  };
  const chooseSection = (nextSection: string) => {
    const first = modeQuestions.find(question => question.sectionId === nextSection);
    if (!first) return;
    setSectionId(nextSection); setQuery(''); select(first);
  };
  const chooseAnswer = (optionId: string) => {
    if (!active || !choiceSet) return;
    onReview(active.id, {
      selectedOptionId: optionId,
      isCorrect: optionId === choiceSet.correctOption,
      confidence: review?.confidence ?? null,
      updatedAt: new Date().toISOString(),
    });
    window.requestAnimationFrame(() => document.getElementById(`${active.id}-result`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  };
  const setConfidence = (confidence: Review['confidence']) => {
    if (!active || !review) return;
    onReview(active.id, { ...review, confidence, updatedAt: new Date().toISOString() });
  };
  const handleChoiceKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
    const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    const next = buttons[(current + direction + buttons.length) % buttons.length];
    next.focus();
    next.click();
  };

  if (!active || !choiceSet) return <section className="assessment-empty"><h1>No completed questions match this filter</h1><button type="button" onClick={() => setQuery('')}>Clear search</button></section>;
  const selectedChoice = choiceSet.options.find(option => option.id === review?.selectedOptionId);
  const enhancedC1 = active.pathway === 'C1' && Boolean(choiceSet.directAnswer && choiceSet.reasoning);
  return <div className="assessment-page">
    <header className="assessment-hero">
      <div><span className="eyebrow"><GraduationCap size={17}/> EPRA exam preparation</span><h1>Choose. Check. Understand why.</h1><p>Every option tests a real distinction. Select once to reveal the complete reasoning, worked method and drawing where the answer requires one.</p></div>
      <div className="assessment-overview" aria-label={`${reviewedInMode} of ${modeQuestions.length} questions answered`}><span><b>{reviewedInMode}</b><small>answered</small></span><span><b>{correctInMode}</b><small>correct</small></span><span className="assessment-total"><b>{modeQuestions.length}</b><small>in this mode</small></span><div><i style={{ width: `${modeQuestions.length ? Math.round(reviewedInMode / modeQuestions.length * 100) : 0}%` }}/></div></div>
    </header>

    <div className="assessment-controls">
      <div className="assessment-path" role="group" aria-label="Choose licence path">{(['C2', 'C1'] as const).map(path => { const ready = availableQuestions.some(question => question.pathway === path); return <button type="button" key={path} aria-pressed={pathway === path} disabled={!ready} title={ready ? undefined : `${path} question authoring is in progress`} onClick={() => choosePath(path)}><strong>{path}</strong><span>{path === 'C2' ? 'Single-phase' : 'Three-phase'}</span></button>; })}</div>
      <div className="assessment-modes" role="group" aria-label="Choose practice mode">{modes.map(item => { const available = availableQuestions.some(question => question.pathway === pathway && item.collections.includes(question.collection)); return <button type="button" key={item.id} aria-pressed={mode === item.id} disabled={!available} title={available ? undefined : `No completed ${item.label.toLocaleLowerCase()} bank is available for ${pathway}`} onClick={() => chooseMode(item.id)}>{item.label}</button>; })}</div>
    </div>

    <button className="assessment-navigator-toggle" type="button" aria-expanded={navigatorOpen} onClick={() => setNavigatorOpen(open => !open)}>{navigatorOpen ? <X size={18}/> : <Menu size={18}/>} Choose section or question <span>{active.id}</span></button>
    <div className="assessment-layout">
      <aside className={`assessment-navigator ${navigatorOpen ? 'open' : ''}`} aria-label="Question navigator">
        <div className="assessment-section-list">{sections.map(([id, title]) => <button type="button" key={id} className={resolvedSection === id ? 'active' : ''} aria-pressed={resolvedSection === id} onClick={() => chooseSection(id)}><span>{id.replace(`${pathway}-`, '')}</span><strong>{title}</strong><small>{modeQuestions.filter(question => question.sectionId === id).length}</small></button>)}</div>
        <label className="assessment-search"><Search size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search this section" aria-label="Search questions in this section"/></label>
        <nav className="assessment-question-list" aria-label={`${active.sectionTitle} questions`}>{sectionQuestions.map((question, index) => { const result = assessment.reviews[question.id]; return <button type="button" key={question.id} className={active.id === question.id ? 'active' : ''} aria-current={active.id === question.id ? 'true' : undefined} onClick={() => select(question)}><span>{result ? result.isCorrect ? <CheckCircle2 size={17}/> : <X size={17}/> : <Circle size={17}/>}</span><span><strong>{index + 1}. {question.title}</strong><small>{question.marks} {question.marks === 1 ? 'mark' : 'marks'} · {formatLabels[question.format]}</small></span>{assessment.bookmarkedQuestionIds.includes(question.id) ? <Bookmark size={14} fill="currentColor"/> : null}</button>; })}</nav>
      </aside>

      <main className="assessment-question" aria-labelledby="assessment-question-title">
        <div className="assessment-question-topline"><div><span>{active.id}</span><span>{formatLabels[active.format]}</span><span><Clock3 size={14}/>{active.expectedMinutes} min</span><span>{active.marks} {active.marks === 1 ? 'mark' : 'marks'}</span></div><button type="button" className={assessment.bookmarkedQuestionIds.includes(active.id) ? 'saved' : ''} aria-pressed={assessment.bookmarkedQuestionIds.includes(active.id)} onClick={() => onBookmark(active.id)}><Bookmark size={17} fill={assessment.bookmarkedQuestionIds.includes(active.id) ? 'currentColor' : 'none'}/>{assessment.bookmarkedQuestionIds.includes(active.id) ? 'Saved' : 'Save'}</button></div>
        <div className="assessment-question-copy">
          <span className={`source-status ${active.kenyaStatus}`}>{active.kenyaStatus === 'check-kenyan-requirement' ? <ShieldCheck size={15}/> : null} {statusLabels[active.kenyaStatus]}</span>
          <h2 id="assessment-question-title" ref={titleRef} tabIndex={-1}>{active.title}</h2>
          {active.format !== 'mcq' ? <AssessmentMarkdown text={active.prompt}/> : null}
          <div className="choice-instruction"><Lightbulb size={17}/><span>{choiceSet.objective}</span></div>
          <div className="assessment-options" role="radiogroup" aria-label={`Answer choices for ${active.id}`} onKeyDown={handleChoiceKeys}>{choiceSet.options.map((option, optionIndex) => {
            const selected = review?.selectedOptionId === option.id;
            const state = review ? option.isCorrect ? 'correct' : selected ? 'incorrect' : 'muted' : '';
            return <button type="button" role="radio" aria-checked={selected} tabIndex={selected || (!review && optionIndex === 0) ? 0 : -1} key={option.id} className={`${selected ? 'selected' : ''} ${state}`} onClick={() => chooseAnswer(option.id)}><span className="choice-letter">{option.id}</span><span className="choice-copy"><AssessmentMarkdown text={option.text}/></span>{review && option.isCorrect ? <CheckCircle2 className="choice-status" size={21}/> : selected && review ? <X className="choice-status" size={21}/> : null}</button>;
          })}</div>
          {!review ? <p className="choice-privacy">Select the strongest answer to reveal the complete solution. Nothing is submitted or automatically graded outside this device.</p> : null}
        </div>

        {review ? <section id={`${active.id}-result`} className={`solution-workspace ${review.isCorrect ? 'is-correct' : 'is-incorrect'}`} aria-live="polite" aria-label="Answer and full-credit solution">
          <header className="solution-verdict"><span className="verdict-icon">{review.isCorrect ? <Check size={22}/> : <X size={22}/>}</span><div><span className="eyebrow">{review.isCorrect ? 'Correct answer' : 'Review this distinction'}</span><h3>{enhancedC1 ? choiceSet.directAnswer : review.isCorrect ? 'Your choice is complete and technically sound.' : `The complete answer is ${choiceSet.correctOption}.`}</h3>{enhancedC1 ? <><AssessmentMarkdown text={choiceSet.reasoning!}/>{!review.isCorrect && selectedChoice ? <p><strong>Why your choice fails:</strong> {selectedChoice.feedback}</p> : null}</> : <p>{selectedChoice?.feedback}</p>}</div></header>
          <div className="solution-walkthrough">
            <div className="solution-heading"><span className="eyebrow neutral"><Sparkles size={15}/> Full worked solution</span><h3>Reasoning, method and final answer</h3><p>Follow the sequence; each displayed calculation retains its quantities and units.</p></div>
            <section className="solution-foundation" aria-label="Underlying electrical principle">
              <span className="eyebrow neutral">Underlying principle</span>
              <AssessmentMarkdown text={choiceSet.foundation}/>
              {choiceSet.workedMethod ? <div className="worked-method"><strong>Worked method: formula and substitution</strong><AssessmentMarkdown text={choiceSet.workedMethod}/></div> : null}
            </section>
            <AssessmentDiagram question={active}/>
            <article className="model-answer"><strong>Exam-ready model answer</strong><AssessmentMarkdown text={active.answer}/></article>
          </div>
          <details className="choice-rationales"><summary><span><ListChecks size={17}/><strong>Why every option is right or wrong</strong></span><ChevronDown size={18}/></summary><div>{choiceSet.options.filter(option => !(enhancedC1 && option.id === selectedChoice?.id)).map(option => <article key={option.id} className={option.isCorrect ? 'correct' : ''}><span>{option.id}</span><div><strong>{option.isCorrect ? 'Complete answer' : 'Not the best answer'}</strong><p>{option.feedback}</p></div></article>)}</div></details>
          <details className="marking-review"><summary><span><ListChecks size={17}/><strong>Full-credit evidence</strong></span><span>{active.marks} marks</span></summary><ol>{active.markingPoints.map((point, index) => <li key={`${index}-${point.criterion}`}><span>{index + 1}</span><div><AssessmentMarkdown text={point.criterion}/><b>{point.marks} {point.marks === 1 ? 'mark' : 'marks'}</b></div></li>)}</ol></details>
          <div className="solution-footer"><div><strong>How secure is this now?</strong><div className="confidence-buttons">{([['review', 'Needs review'], ['developing', 'Developing'], ['secure', 'Secure']] as const).map(([value, label]) => <button type="button" key={value} aria-pressed={review.confidence === value} onClick={() => setConfidence(value)}>{value === 'secure' ? <Check size={15}/> : null} {label}</button>)}</div></div><div className="solution-sources"><strong>Relearn the principle</strong>{active.sourceLessonIds.map(id => <button type="button" key={id} onClick={() => onLesson(id)}>Open related lesson <ArrowRight size={16}/></button>)}</div></div>
        </section> : null}

        <footer className="assessment-stepper"><button type="button" disabled={activeIndex <= 0} onClick={() => select(sectionQuestions[activeIndex - 1])}><ArrowLeft size={17}/> Previous</button><span>{activeIndex + 1} of {sectionQuestions.length} in {active.sectionTitle}</span><button type="button" disabled={activeIndex < 0 || activeIndex >= sectionQuestions.length - 1} onClick={() => select(sectionQuestions[activeIndex + 1])}>Next <ArrowRight size={17}/></button></footer>
      </main>
    </div>
  </div>;
}