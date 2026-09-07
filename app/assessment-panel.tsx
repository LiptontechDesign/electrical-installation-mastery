'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowRight, Award, BookOpen, BrainCircuit, Check, ChevronLeft, ChevronRight, Circle, Lightbulb, ListChecks, RotateCcw, ShieldCheck, X } from 'lucide-react';
import type { AssessmentQuestion, Flashcard } from './assessment-data';
import ConceptVisual from './concept-visual';
import { shuffleQuestion } from './learning-design';
import LearningText from './learning-text';
import Formula from './formula';
import RetrievalReveal from './retrieval-reveal';
import type { EvidenceInput, QuizRecord } from './tutor-model';
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
  quizRecord?: QuizRecord;
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
  assessmentLabel?: string;
  requirePassToContinue?: boolean;
  showFlashcards?: boolean;
};

export default function AssessmentPanel({
  title, eyebrow, description, flashcards, questions, progress, bestScore, quizRecord, completed,
  onRateCard, onEvidence, onPractice, onCompleteQuiz, onContinue, continueLabel = 'Continue learning', connectedLessonFlow = false,
  mode: controlledMode, onModeChange, assessmentLabel = 'Quiz', requirePassToContinue = false, showFlashcards = true,
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
  const [initialAttemptCount] = useState(()=>quizRecord?.attempts??0);
  const [completedSubmissions, setCompletedSubmissions] = useState(0);
  const [passedBeforeResult, setPassedBeforeResult] = useState(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const quizQuestions = useMemo(() => {
    // Feedback and choices stay together on every attempt, including the first.
    const shuffled = questions.map(question => shuffleQuestion(question, attempt));
    if (attempt === 0) return shuffled;
    const offset = attempt % Math.max(1, shuffled.length);
    return [...shuffled.slice(offset), ...shuffled.slice(0, offset)];
  }, [attempt, questions]);
  const card = flashcards[cardIndex];
  const question = quizQuestions[questionIndex];
  const revealed = answers[questionIndex] !== undefined;
  const score = Object.entries(answers).filter(([index, selected]) => quizQuestions[Number(index)]?.answer === selected).length;
  const passMark = Math.ceil(quizQuestions.length * 0.8);
  const knownCount = Object.values(ratings).filter(Boolean).length;
  const reviewCount = Object.values(ratings).filter((knew) => !knew).length;
  const dueCount = flashcards.filter((item) => !progress[item.id] || progress[item.id].dueAt <= calendarDay()).length;
  const recordedBestScore=quizRecord?.bestScore??0;
  const recordedBestTotal=quizRecord?.bestTotal??questions.length;
  const currentIsBest=quizQuestions.length>0&&score/quizQuestions.length>recordedBestScore/Math.max(1,recordedBestTotal);
  const visibleBestScore=currentIsBest?score:recordedBestScore;
  const visibleBestTotal=currentIsBest?quizQuestions.length:recordedBestTotal;
  const visibleAttempts=Math.max(quizRecord?.attempts??0,initialAttemptCount+completedSubmissions);
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
    const dimension = question.kind === 'Application' ? 'application' : question.kind === 'Standards check' ? 'standards' : question.kind === 'Safety check' ? 'diagnosis' : 'recognition';
    onEvidence?.({lessonId:question.lessonId,conceptId:question.cardId,activityId:question.id,dimension,correct:answer===question.answer,assisted:attempt>0,misconception:question.design?.diagnostics[answer]?.diagnosis});
    if (answer !== question.answer && flashcards.some((item)=>item.id===question.cardId)) onRateCard(question.cardId, false);
  };
  const nextQuestion = () => {
    if (!revealed) return;
    if (questionIndex < quizQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      window.requestAnimationFrame(() => questionHeading.current?.focus());
      return;
    }
    setPassedBeforeResult(completed);
    setCompletedSubmissions((value)=>value+1);
    setFinished(true);
    onCompleteQuiz(score, quizQuestions.length);
  };
  const restartQuiz = () => { setQuestionIndex(0); setAnswers({}); setFinished(false); setAttempt(value=>value+1); };

  return <section className="assessment-panel focused-assessment" aria-label={mode === 'cards' ? 'Flashcards' : 'Quiz'}>
    {!connectedLessonFlow && <header className="compact-assessment-heading"><span className="eyebrow neutral">{eyebrow}</span><h2>{title}</h2><p>{description}</p></header>}
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
        <span className="recall-copy" aria-live="polite"><LearningText text={cardRevealed ? card.back : card.front} /></span>
        <span className="recall-hint">{cardRevealed ? 'How did you do?' : 'Think it through, then tap to reveal.'}</span>
      </button>
      <div className="flashcard-actions">
        <button type="button" className="card-nav" disabled={cardIndex === 0} onClick={() => chooseCard(cardIndex - 1)}><ChevronLeft size={18} /> Previous</button>
        {cardRevealed ? <div className="card-rating"><button type="button" className="again" onClick={() => rateCard(false)}><RotateCcw size={18} /> Need another look</button><button type="button" className="got-it" onClick={() => rateCard(true)}><Check size={18} /> Got it</button></div> : <button type="button" className="reveal-card" onClick={() => setCardRevealed(true)}>Show answer</button>}
        <button type="button" className="card-nav" disabled={cardIndex === flashcards.length - 1} onClick={() => chooseCard(cardIndex + 1)}>Next <ChevronRight size={18} /></button>
      </div>
      <div className="recall-tally" role="status"><span><Check size={16} /> {knownCount} recalled</span><span><RotateCcw size={16} /> {reviewCount} to revisit</span><button type="button" onClick={() => changeMode('quiz')}>Take the quiz <ArrowRight size={16} /></button></div>
      {cardRevealed && card.design && <div className="flashcard-explanation">
        {card.design.workingTex && <Formula tex={card.design.workingTex} block />}
        <p><strong>Why:</strong> <LearningText text={card.design.why} /></p>
        {card.design.distinction && <p><strong>Keep separate:</strong> <LearningText text={card.design.distinction} /></p>}
        <details key={card.id}><summary>In practice</summary><p><LearningText text={card.design.practice} /></p></details>
      </div>}
      {cardRevealed && <ConceptVisual key={card.lessonId} lessonId={card.lessonId} />}
    </div>}

    {mode === 'quiz' && !finished && question && <div className="assessment-quiz">
      {(quizRecord||bestScore>0)&&<div className="quiz-prior-record" aria-label="Previous quiz record">{quizRecord?<><span>Latest {quizRecord.latestScore}/{quizRecord.latestTotal}</span><span>Best {recordedBestScore}/{recordedBestTotal}</span><span>{quizRecord.attempts} recorded {quizRecord.attempts===1?'attempt':'attempts'}</span></>:<span>Earlier quiz: {bestScore} correct</span>}</div>}
      <div className="session-heading"><h2>Question {questionIndex + 1}<span> / {quizQuestions.length}</span></h2><span>{score} correct · {passMark} to pass</span></div>
      <div className="quiz-map" aria-hidden="true">{quizQuestions.map((item, index) => <span key={item.id} className={`${index === questionIndex ? 'current' : ''} ${answers[index] === undefined ? '' : answers[index] === item.answer ? 'known' : 'again'}`} />)}</div>
      {!connectedLessonFlow && <p className="assessment-question-source">{question.lessonTitle}</p>}
      <span className="question-kind">{question.kind}</span>
      <h3 ref={questionHeading} tabIndex={-1}><LearningText text={question.prompt} /></h3>
      <div className="assessment-options">{question.options.map((option, index) => {
        const selected = answers[questionIndex] === index;
        const correct = question.answer === index;
        return <button type="button" key={`${question.id}-${index}`} disabled={revealed} className={`${selected ? 'selected' : ''} ${revealed && correct ? 'correct' : ''} ${revealed && selected && !correct ? 'incorrect' : ''}`} onClick={() => answerQuestion(index)}><span>{String.fromCharCode(65 + index)}</span><span className="option-copy"><LearningText text={option} /></span>{revealed && correct ? <Check size={20} aria-label="Correct answer" /> : revealed && selected ? <X size={20} aria-label="Incorrect answer" /> : <Circle size={18} aria-hidden="true" />}</button>;
      })}</div>
      {revealed && <div className={answers[questionIndex] === question.answer ? 'assessment-feedback correct' : 'assessment-feedback'} role="status" aria-live="polite">
        {answers[questionIndex] === question.answer ? <Check size={22} /> : <RotateCcw size={22} />}
        <div><strong>{answers[questionIndex] === question.answer ? 'Correct' : 'Let’s correct the model'}</strong>
          {answers[questionIndex] !== question.answer && (question.design?.diagnostics[answers[questionIndex]]
            ? <p className="misconception-diagnosis"><LearningText text={question.design.diagnostics[answers[questionIndex]]!.diagnosis} /></p>
            : question.feedback?.[answers[questionIndex]] && <p>{question.feedback[answers[questionIndex]]}</p>)}
          <p className="answer-principle"><LearningText text={question.design?.principle ?? question.options[question.answer]} /></p>
          {!question.design && question.kind === 'Application' && question.explanation !== question.options[question.answer] && <p><LearningText text={question.explanation} /></p>}
          {question.design?.workingTex && <Formula tex={question.design.workingTex} block />}
          {question.teaching && <>
            <p><strong>Why:</strong> <LearningText text={question.design?.why ?? question.teaching.reasoning} /></p>
            {question.design?.distinction && <p><strong>Keep separate:</strong> <LearningText text={question.design.distinction} /></p>}
            <details key={question.id} className="answer-application"><summary>See it in practice</summary><p><LearningText text={question.design?.practice ?? question.teaching.application} /></p></details>
          </>}
        </div>
      </div>}
      {revealed && question.design?.followUp && <RetrievalReveal key={question.id} item={question.design.followUp} label="Try a different situation" onRate={recalled => {
        if (!recalled) onRateCard(question.cardId, false);
        onEvidence?.({ lessonId: question.lessonId, conceptId: question.cardId, activityId: question.id + ':transfer', dimension: 'recall', correct: recalled, assisted: true });
      }} />}
      <div className="assessment-quiz-actions"><button type="button" onClick={restartQuiz}><RotateCcw size={17} /> Restart</button><button type="button" className="primary-button" disabled={!revealed} onClick={nextQuestion}>{questionIndex === quizQuestions.length - 1 ? 'See results' : 'Next question'} <ArrowRight size={17} /></button></div>
    </div>}

    {mode === 'quiz' && finished && <div className="quiz-finish">
      <div className="score-ring" role="img" aria-label={`${score} out of ${quizQuestions.length} correct`} style={{ background: `conic-gradient(${score >= passMark ? '#43cb83' : '#ff914d'} ${score / quizQuestions.length * 360}deg, #e7edf1 0)` }}><span><b>{Math.round(score / quizQuestions.length * 100)}%</b><small>{score}/{quizQuestions.length} correct</small></span></div>
      <div><h2>{score >= passMark ? `${assessmentLabel} passed.` : 'Keep building your understanding.'}</h2><p>{score >= passMark ? 'You reached 80%. Continue while the ideas are fresh.' : passedBeforeResult ? `Latest: ${score}/${quizQuestions.length}. Your earlier pass remains saved; review the missed ideas and retry.` : `You need ${passMark} correct to pass. Review the missed ideas, then try again.`}</p><div className="quiz-score-record"><span><RotateCcw size={16}/> Latest <strong>{score}/{quizQuestions.length}</strong></span><span><Award size={16}/> Best <strong>{visibleBestScore}/{visibleBestTotal}</strong></span><span>{visibleAttempts} recorded {visibleAttempts===1?'attempt':'attempts'}{passedBeforeResult?' · Passed previously':''}</span></div>{onPractice&&<button className="primary-button" type="button" onClick={onPractice}>Apply this lesson <ArrowRight size={17}/></button>}</div>
      <div className="quiz-finish-actions">{showFlashcards&&<button type="button" className="secondary-button" onClick={() => changeMode('cards')}><BookOpen size={17} /> Flashcards</button>}<button type="button" className="secondary-button" onClick={restartQuiz}><RotateCcw size={17} /> Try again</button>{onContinue&&(!requirePassToContinue||score>=passMark||passedBeforeResult||completed)&&<button type="button" className="primary-button" onClick={onContinue}>{continueLabel}<ArrowRight size={17} /></button>}</div>
    </div>}
  </section>;
}
