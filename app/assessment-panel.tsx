'use client';

import { useRef, useState } from 'react';
import { ArrowRight, Award, BookOpen, BrainCircuit, Check, ChevronLeft, ChevronRight, Circle, Lightbulb, ListChecks, RotateCcw, ShieldCheck, X } from 'lucide-react';
import type { AssessmentQuestion, Flashcard } from './assessment-data';
import ConceptVisual from './concept-visual';

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
  onCompleteQuiz: (score: number, total: number) => void;
  onContinue?: () => void;
  continueLabel?: string;
  connectedLessonFlow?: boolean;
  mode?: AssessmentMode;
  onModeChange?: (mode: AssessmentMode) => void;
};

export default function AssessmentPanel({
  title, eyebrow, flashcards, questions, progress, bestScore, completed,
  onRateCard, onCompleteQuiz, onContinue, continueLabel = 'Continue learning', connectedLessonFlow = false,
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
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const card = flashcards[cardIndex];
  const question = questions[questionIndex];
  const revealed = answers[questionIndex] !== undefined;
  const score = Object.entries(answers).filter(([index, selected]) => questions[Number(index)]?.answer === selected).length;
  const passMark = Math.ceil(questions.length * 0.8);
  const knownCount = Object.values(ratings).filter(Boolean).length;
  const reviewCount = Object.values(ratings).filter((knew) => !knew).length;
  const dueCount = flashcards.filter((item) => !progress[item.id] || progress[item.id].dueAt <= new Date().toISOString().slice(0, 10)).length;
  const Icon = card?.kind.includes('check') ? ShieldCheck : card?.kind === 'Application' ? Lightbulb : BrainCircuit;

  const changeMode = (next: AssessmentMode) => { setInternalMode(next); onModeChange?.(next); };
  const chooseCard = (index: number) => { setCardIndex(index); setCardRevealed(false); };
  const rateCard = (knew: boolean) => {
    if (!card) return;
    onRateCard(card.id, knew);
    setRatings((current) => ({ ...current, [card.id]: knew }));
    setCardRevealed(false);
    if (cardIndex < flashcards.length - 1) setCardIndex((current) => current + 1);
    else changeMode('quiz');
  };
  const answerQuestion = (answer: number) => {
    if (revealed || !question) return;
    setAnswers((current) => ({ ...current, [questionIndex]: answer }));
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
  const restartQuiz = () => { setQuestionIndex(0); setAnswers({}); setFinished(false); };

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
      <div className="assessment-quiz-actions"><button type="button" onClick={restartQuiz}><RotateCcw size={17} /> Restart</button><button type="button" className="primary-button" disabled={!revealed} onClick={nextQuestion}>{questionIndex === questions.length - 1 ? 'See results' : 'Next question'} <ArrowRight size={17} /></button></div>
    </div>}

    {mode === 'quiz' && finished && <div className="quiz-finish">
      <div className="score-ring" role="img" aria-label={`${score} out of ${questions.length} correct`} style={{ background: `conic-gradient(${score >= passMark ? '#43cb83' : '#ff914d'} ${score / questions.length * 360}deg, #e7edf1 0)` }}><span><b>{Math.round(score / questions.length * 100)}%</b><small>{score}/{questions.length} correct</small></span></div>
      <div><h2>{score >= passMark ? 'Lesson understood.' : 'Keep building your understanding.'}</h2><p>{score >= passMark ? 'You reached 80%. Ready to continue?' : `You need ${passMark} correct to pass. Revisit the flashcards and try again.`}</p><span className="quiz-best"><Award size={17} /> Best: {Math.max(bestScore, score)}/{questions.length}{completed ? ' · Mastered' : ''}</span></div>
      <div className="quiz-finish-actions"><button type="button" className="secondary-button" onClick={() => changeMode('cards')}><BookOpen size={17} /> Flashcards</button><button type="button" className="secondary-button" onClick={restartQuiz}><RotateCcw size={17} /> Try again</button>{onContinue && <button type="button" className="primary-button" onClick={onContinue}>{continueLabel}<ArrowRight size={17} /></button>}</div>
    </div>}
  </section>;
}
