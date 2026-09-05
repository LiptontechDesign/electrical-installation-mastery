'use client';

import { useRef, useState } from 'react';
import { ArrowRight, Award, BookOpen, BrainCircuit, Check, ChevronLeft, ChevronRight, Circle, Lightbulb, ListChecks, RotateCcw, ShieldCheck, X } from 'lucide-react';
import type { AssessmentQuestion, Flashcard } from './assessment-data';
import ConceptVisual from './concept-visual';
import { lessonKnowledge, lessonById } from './knowledge-graph';
import type { EvidenceInput } from './tutor-model';
import { calendarDay } from './tutor-model';

export type FlashcardProgress = Record<string, { streak: number; dueAt: string }>;
export type AssessmentMode = 'cards' | 'quiz';

type AssessmentPanelProps = {
  title: string;
  eyebrow: string;
  description: string;
  flashcards: Flashcard[];
  questions: AssessmentQuestion[];
  progress: FlashcardProgress;
  bestScore: number;
  completed: boolean;
  onRateCard: (cardId: string, knew: boolean) => void;
  onEvidence?: (input: EvidenceInput) => void;
  onOpenLesson?: (lessonId: string) => void;
  onPractice?: () => void;
  onCompleteQuiz: (score: number, total: number) => void;
  onContinue?: () => void;
  continueLabel?: string;
  connectedLessonFlow?: boolean;
  mode?: AssessmentMode;
  onModeChange?: (mode: AssessmentMode) => void;
};

export default function AssessmentPanel({
  title, eyebrow, flashcards, questions, progress, bestScore, completed,
  onRateCard, onEvidence, onOpenLesson, onPractice, onCompleteQuiz, onContinue, continueLabel = 'Continue learning', connectedLessonFlow = false,
  mode: controlledMode, onModeChange,
}: AssessmentPanelProps) {
  const [internalMode, setInternalMode] = useState<AssessmentMode>('cards');
  const mode = controlledMode ?? internalMode;
  const [cardIndex, setCardIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [ratings, setRatings] = useState<Record<string, boolean>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [difficulty, setDifficulty] = useState<Record<number, string>>({});
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const card = flashcards[cardIndex];
  const question = questions[questionIndex];
  const revealed = answers[questionIndex] !== undefined;
  const score = Object.entries(answers).filter(([index, selected]) => questions[Number(index)]?.answer === selected).length;
  const passMark = Math.ceil(questions.length * 0.8);
  const knownCount = Object.values(ratings).filter(Boolean).length;
  const reviewCount = Object.values(ratings).filter((knew) => !knew).length;
  const dueCount = flashcards.filter((item) => !progress[item.id] || progress[item.id].dueAt <= calendarDay()).length;
  const Icon = card?.kind.includes('check') ? ShieldCheck : card?.kind === 'Application' ? Lightbulb : BrainCircuit;

  const changeMode = (next: AssessmentMode) => { setInternalMode(next); onModeChange?.(next); };
  const chooseCard = (index: number) => { setCardIndex(index); setCardRevealed(false); };
  const rateCard = (knew: boolean) => {
    if (!card) return;
    onRateCard(card.id, knew);
    onEvidence?.({ lessonId:card.lessonId,conceptId:card.id,activityId:card.id,dimension:'recall',correct:knew,assisted:ratings[card.id]!==undefined });
    setRatings((current) => ({ ...current, [card.id]: knew }));
    setCardRevealed(false);
    if (cardIndex < flashcards.length - 1) setCardIndex((current) => current + 1);
    else changeMode('quiz');
  };
  const answerQuestion = (answer: number) => {
    if (revealed || !question) return;
    setAnswers((current) => ({ ...current, [questionIndex]: answer }));
    onEvidence?.({lessonId:question.lessonId,conceptId:question.cardId,activityId:question.id,dimension:'recognition',correct:answer===question.answer,assisted:attempt>0});
    if (answer !== question.answer) onRateCard(question.cardId, false);
  };
  const nextQuestion = () => {
    if (!revealed) return;
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      window.requestAnimationFrame(() => questionHeading.current?.focus());
      return;
    }
    setFinished(true);
    onCompleteQuiz(score, questions.length);
  };
  const restartQuiz = () => { setQuestionIndex(0); setAnswers({}); setFinished(false); setAttempt(value=>value+1); setDifficulty({}); };

  return <section className="assessment-panel focused-assessment" aria-label={mode === 'cards' ? 'Flashcards' : 'Quiz'}>
    {!connectedLessonFlow && <header className="compact-assessment-heading"><span className="eyebrow neutral">{eyebrow}</span><h2>{title}</h2></header>}
    {controlledMode === undefined && <nav className="assessment-mode-tabs" aria-label="Choose review mode">
      <button type="button" aria-pressed={mode === 'cards'} className={mode === 'cards' ? 'active' : ''} onClick={() => changeMode('cards')}><BookOpen size={18} /> Flashcards</button>
      <button type="button" aria-pressed={mode === 'quiz'} className={mode === 'quiz' ? 'active' : ''} onClick={() => changeMode('quiz')}><ListChecks size={18} /> Quiz</button>
    </nav>}

    {mode === 'cards' && card && <div className="flashcard-workspace">
      <div className="session-heading"><h2>Flashcard {cardIndex + 1}<span> / {flashcards.length}</span></h2><span>{dueCount} due</span></div>
      <div className="recall-map" aria-label="Your flashcards">{flashcards.map((item, index) => <button type="button" key={item.id} aria-label={`Card ${index + 1}${ratings[item.id] === true ? ', recalled' : ratings[item.id] === false ? ', revisit' : ''}`} aria-current={index === cardIndex ? 'step' : undefined} className={`${index === cardIndex ? 'current' : ''} ${ratings[item.id] === true ? 'known' : ratings[item.id] === false ? 'again' : ''}`} onClick={() => chooseCard(index)}>{ratings[item.id] === true ? <Check size={14} /> : index + 1}</button>)}</div>
      <button type="button" className={`recall-card ${cardRevealed ? 'revealed' : ''}`} aria-label={cardRevealed ? 'Hide answer' : 'Reveal answer'} aria-pressed={cardRevealed} onClick={() => setCardRevealed((current) => !current)}>
        <span className="recall-card-meta"><span>{cardRevealed ? 'Answer' : card.kind}</span><Icon size={26} /></span>
        {!connectedLessonFlow && <span className="recall-source">{card.lessonTitle}</span>}
        <span className="recall-copy" aria-live="polite">{cardRevealed ? card.back : card.front}</span>
        <span className="recall-hint">{cardRevealed ? 'How did you do?' : 'Think it through, then tap to reveal.'}</span>
      </button>
      <div className="flashcard-actions">
        <button type="button" className="card-nav" disabled={cardIndex === 0} onClick={() => chooseCard(cardIndex - 1)}><ChevronLeft size={18} /> Previous</button>
        {cardRevealed ? <div className="card-rating"><button type="button" className="again" onClick={() => rateCard(false)}><RotateCcw size={18} /> Revisit</button><button type="button" className="got-it" onClick={() => rateCard(true)}><Check size={18} /> Got it</button></div> : <button type="button" className="reveal-card" onClick={() => setCardRevealed(true)}>Show answer</button>}
        <button type="button" className="card-nav" disabled={cardIndex === flashcards.length - 1} onClick={() => chooseCard(cardIndex + 1)}>Next <ChevronRight size={18} /></button>
      </div>
      <div className="recall-tally" role="status"><span><Check size={16} /> {knownCount} recalled</span><span><RotateCcw size={16} /> {reviewCount} to revisit</span><button type="button" onClick={() => changeMode('quiz')}>Take the quiz <ArrowRight size={16} /></button></div>
      {cardRevealed && <ConceptVisual key={card.lessonId} lessonId={card.lessonId} />}
    </div>}

    {mode === 'quiz' && !finished && question && <div className="assessment-quiz">
      <p className="source-caption">Recognition check · try recalling the answer before reading the choices. Application is assessed separately.</p>
      <div className="session-heading"><h2>Question {questionIndex + 1}<span> / {questions.length}</span></h2><span>{score} correct · {passMark} to pass</span></div>
      <div className="quiz-map" aria-hidden="true">{questions.map((item, index) => <span key={item.id} className={`${index === questionIndex ? 'current' : ''} ${answers[index] === undefined ? '' : answers[index] === item.answer ? 'known' : 'again'}`} />)}</div>
      {!connectedLessonFlow && <p className="assessment-question-source">{question.lessonTitle}</p>}
      <h3 ref={questionHeading} tabIndex={-1}>{question.prompt}</h3>
      <div className="assessment-options">{question.options.map((option, index) => {
        const selected = answers[questionIndex] === index;
        const correct = question.answer === index;
        return <button type="button" key={`${question.id}-${index}`} disabled={revealed} className={`${selected ? 'selected' : ''} ${revealed && correct ? 'correct' : ''} ${revealed && selected && !correct ? 'incorrect' : ''}`} onClick={() => answerQuestion(index)}><span>{String.fromCharCode(65 + index)}</span><span className="option-copy">{option}</span>{revealed && correct ? <Check size={20} aria-label="Correct answer" /> : revealed && selected ? <X size={20} aria-label="Incorrect answer" /> : <Circle size={18} aria-hidden="true" />}</button>;
      })}</div>
      {revealed && <div className={answers[questionIndex] === question.answer ? 'assessment-feedback correct' : 'assessment-feedback'} role="status" aria-live="polite">
        {answers[questionIndex] === question.answer ? <Check size={22} /> : <RotateCcw size={22} />}
        <div><strong>{answers[questionIndex] === question.answer ? 'Correct' : 'Not quite — the correct answer is highlighted.'}</strong><p>{question.explanation}</p></div>
      </div>}
      {revealed && <ConceptVisual key={question.lessonId} lessonId={question.lessonId} />}
      {revealed && answers[questionIndex] !== question.answer && <div className="diagnostic-help">
        <h4>Which part needs another explanation?</h4><p>A wrong choice alone cannot tell us why. Choose the part that felt uncertain.</p>
        <div className="diagnostic-choices">{['The terminology','The relationship or formula','The procedure or safety condition','An earlier idea'].map(reason=><button type="button" key={reason} aria-pressed={difficulty[questionIndex]===reason} onClick={()=>{setDifficulty(current=>({...current,[questionIndex]:reason}));onEvidence?.({lessonId:question.lessonId,conceptId:question.cardId,activityId:question.id,dimension:'recognition',correct:false,assisted:false,misconception:`Self-reported difficulty: ${reason.toLowerCase()}`});}}>{reason}</button>)}</div>
        {difficulty[questionIndex]&&<div className="diagnostic-response" role="status">
          <strong>{difficulty[questionIndex]==='The terminology'?'Separate the words before the rule':difficulty[questionIndex]==='The relationship or formula'?'Start with the quantities':difficulty[questionIndex]==='An earlier idea'?'Rebuild the foundation':'Explain the reason for the sequence'}</strong>
          <p>{difficulty[questionIndex]==='The terminology'?'Name each component or quantity in the question, then explain its function without using the abbreviation.':difficulty[questionIndex]==='The relationship or formula'?'Identify what is given and what must be found. Sketch the path or relationship, then check the units before substituting numbers.':difficulty[questionIndex]==='An earlier idea'?'Use an explicit prerequisite below, then return and explain this answer in your own words.':'Ask what hazard or failure each step prevents. A procedure is easier to reconstruct when its purpose is clear.'}</p>
          {difficulty[questionIndex]==='The terminology'&&lessonKnowledge[question.lessonId]?.terms.slice(0,3).map(term=><p key={term.term}><strong>{term.term}:</strong> {term.definition}{term.contrast&&` ${term.contrast}`}</p>)}
          {onOpenLesson&&lessonKnowledge[question.lessonId]?.prerequisites.map(id=><button className="text-action" type="button" key={id} onClick={()=>onOpenLesson(id)}>Revisit: {lessonById.get(id)?.title}<ArrowRight size={16}/></button>)}
          {onPractice&&<button className="secondary-button" type="button" onClick={onPractice}>Try a worked example or investigation</button>}
          <p>Then try a fresh question. An immediate retry is recorded as supported practice.</p>
        </div>}
      </div>}
      <div className="assessment-quiz-actions"><button type="button" onClick={restartQuiz}><RotateCcw size={17} /> Restart</button><button type="button" className="primary-button" disabled={!revealed} onClick={nextQuestion}>{questionIndex === questions.length - 1 ? 'See results' : 'Next question'} <ArrowRight size={17} /></button></div>
    </div>}

    {mode === 'quiz' && finished && <div className="quiz-finish">
      <div className="score-ring" role="img" aria-label={`${score} out of ${questions.length} correct`} style={{ background: `conic-gradient(${score >= passMark ? '#43cb83' : '#ff914d'} ${score / questions.length * 360}deg, #e7edf1 0)` }}><span><b>{Math.round(score / questions.length * 100)}%</b><small>{score}/{questions.length} correct</small></span></div>
      <div><h2>{score >= passMark ? 'Recognition check passed.' : 'Keep building your understanding.'}</h2><p>{score >= passMark ? 'You reached 80%. Now apply the idea and retrieve it again later.' : `You need ${passMark} correct to pass. Work through the missed ideas before retrying.`}</p><span className="quiz-best"><Award size={17} /> Best: {Math.max(bestScore, score)}/{questions.length}{completed ? ' · Passed previously' : ''}</span><p className="source-caption">A quiz pass is one piece of learning evidence, not proof of practical competence.</p>{onPractice&&<button className="primary-button" type="button" onClick={onPractice}>Apply this lesson <ArrowRight size={17}/></button>}</div>
      <div className="quiz-finish-actions"><button type="button" className="secondary-button" onClick={() => changeMode('cards')}><BookOpen size={17} /> Flashcards</button><button type="button" className="secondary-button" onClick={restartQuiz}><RotateCcw size={17} /> Try again</button>{onContinue && <button type="button" className="primary-button" onClick={onContinue}>{continueLabel}<ArrowRight size={17} /></button>}</div>
    </div>}
  </section>;
}
