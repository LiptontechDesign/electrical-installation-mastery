'use client';

import { useState } from 'react';
import { ArrowRight, Award, BookOpen, Check, ChevronLeft, ChevronRight, Circle, Lightbulb, ListChecks, RotateCcw, ShieldCheck, Target } from 'lucide-react';
import type { AssessmentQuestion, Flashcard } from './assessment-data';

export type FlashcardProgress = Record<string, { streak: number; dueAt: string }>;

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
};

function percent(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

export default function AssessmentPanel({
  title, eyebrow, description, flashcards, questions, progress, bestScore, completed,
  onRateCard, onCompleteQuiz, onContinue, continueLabel = 'Continue learning',
}: AssessmentPanelProps) {
  const [mode, setMode] = useState<'cards' | 'quiz'>('cards');
  const [cardIndex, setCardIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const card = flashcards[cardIndex];
  const question = questions[questionIndex];
  const score = Object.entries(answers).filter(([index, selected]) => questions[Number(index)]?.answer === selected).length;
  const passMark = Math.ceil(questions.length * 0.8);
  const reviewedCount = flashcards.filter((item) => progress[item.id]).length;
  const dueCount = flashcards.filter((item) => !progress[item.id] || progress[item.id].dueAt <= new Date().toISOString().slice(0, 10)).length;

  const rateCard = (knew: boolean) => {
    if (!card) return;
    onRateCard(card.id, knew);
    setSessionReviewed((current) => current.includes(card.id) ? current : [...current, card.id]);
    setCardRevealed(false);
    if (cardIndex < flashcards.length - 1) setCardIndex((current) => current + 1);
    else setMode('quiz');
  };

  const answerQuestion = (answer: number) => {
    if (revealed || !question) return;
    setAnswers((current) => ({ ...current, [questionIndex]: answer }));
    setRevealed(true);
    if (answer !== question.answer) onRateCard(question.cardId, false);
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1); setRevealed(false); return;
    }
    setFinished(true);
    onCompleteQuiz(score, questions.length);
  };

  const restartQuiz = () => {
    setQuestionIndex(0); setAnswers({}); setRevealed(false); setFinished(false);
  };

  return (
    <section className="assessment-panel">
      <header className="assessment-header">
        <div><span className="eyebrow neutral"><Target size={16} /> {eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
        <div className="assessment-metrics" aria-label="Assessment size">
          <span><b>{flashcards.length}</b> flashcards</span><span><b>{questions.length}</b> questions</span><span><b>80%</b> mastery</span>
        </div>
      </header>

      <div className="assessment-status-strip">
        <span><BookOpen size={17} /><b>{reviewedCount}</b> cards reviewed</span>
        <span><RotateCcw size={17} /><b>{dueCount}</b> due for recall</span>
        <span><Award size={17} /><b>{bestScore}/{questions.length}</b> best score</span>
        {completed && <span className="mastery-earned"><Check size={17} /> Mastery earned</span>}
      </div>

      <nav className="assessment-mode-tabs" aria-label="Choose review mode">
        <button type="button" className={mode === 'cards' ? 'active' : ''} onClick={() => setMode('cards')}><BookOpen size={18} /> Flashcards <small>{sessionReviewed.length}/{flashcards.length}</small></button>
        <button type="button" className={mode === 'quiz' ? 'active' : ''} onClick={() => setMode('quiz')}><ListChecks size={18} /> Quiz <small>{Object.keys(answers).length}/{questions.length}</small></button>
      </nav>

      {mode === 'cards' && card && (
        <div className="flashcard-workspace">
          <div className="trainer-progress"><span>Flashcard {cardIndex + 1} of {flashcards.length}</span><b>{percent(sessionReviewed.length, flashcards.length)}% reviewed this session</b><div className="progress-line"><span style={{ width: `${percent(cardIndex + 1, flashcards.length)}%` }} /></div></div>
          <button type="button" className={`learning-flashcard ${cardRevealed ? 'revealed' : ''}`} onClick={() => setCardRevealed((current) => !current)} aria-label={cardRevealed ? 'Hide answer' : 'Reveal answer'}>
            <div className="learning-item-labels"><span className="flashcard-side-label">{cardRevealed ? 'Model answer' : 'Recall first'}</span><span className="learning-kind">{card.kind}</span></div>
            <h3>{cardRevealed ? card.back : card.front}</h3>
            {cardRevealed ? <>
              {card.answerPoints && card.answerPoints.length > 0 && <div className="complete-answer"><strong>A complete answer should include</strong><ol>{card.answerPoints.map((point, index) => <li key={`${card.id}-point-${index}`}>{point}</li>)}</ol></div>}
              <div className="why-it-matters"><Lightbulb size={19} /><p><strong>Why it matters</strong>{card.whyItMatters}</p></div>
              {card.kenyaNote && <div className="kenya-card-note"><ShieldCheck size={18} /><p>{card.kenyaNote}</p></div>}
            </> : <p className="flip-instruction">Pause. Explain the answer in your own words and give one job example, then reveal the model answer.</p>}
          </button>
          <div className="flashcard-actions">
            <button type="button" className="card-nav" disabled={cardIndex === 0} onClick={() => { setCardIndex((current) => current - 1); setCardRevealed(false); }}><ChevronLeft size={18} /> Previous</button>
            {cardRevealed ? <div className="card-rating"><button type="button" className="again" onClick={() => rateCard(false)}><RotateCcw size={18} /> Again</button><button type="button" className="got-it" onClick={() => rateCard(true)}><Check size={18} /> Got it</button></div> : <button type="button" className="reveal-card" onClick={() => setCardRevealed(true)}>Reveal answer</button>}
            <button type="button" className="card-nav" disabled={cardIndex === flashcards.length - 1} onClick={() => { setCardIndex((current) => current + 1); setCardRevealed(false); }}>Next <ChevronRight size={18} /></button>
          </div>
        </div>
      )}

      {mode === 'quiz' && !finished && question && (
        <div className="assessment-quiz">
          <div className="trainer-progress"><span>Question {questionIndex + 1} of {questions.length}</span><b>{score} correct so far</b><div className="progress-line"><span style={{ width: `${percent(questionIndex + (revealed ? 1 : 0), questions.length)}%` }} /></div></div>
          <div className="question-identity"><span>Question {questionIndex + 1}</span><b>{question.kind}</b></div>
          <h3>{question.prompt}</h3>
          <div className="assessment-options">{question.options.map((option, index) => {
            const selected = answers[questionIndex] === index;
            const correct = question.answer === index;
            return <button type="button" key={`${question.id}-${index}`} disabled={revealed} className={`${selected ? 'selected' : ''} ${revealed && correct ? 'correct' : ''} ${revealed && selected && !correct ? 'incorrect' : ''}`} onClick={() => answerQuestion(index)}><span>{String.fromCharCode(65 + index)}</span><p>{option}</p>{revealed && correct ? <Check size={18} /> : <Circle size={18} />}</button>;
          })}</div>
          {revealed && <div className={answers[questionIndex] === question.answer ? 'assessment-feedback correct' : 'assessment-feedback'}><Lightbulb size={21} /><div><strong>{answers[questionIndex] === question.answer ? 'Correct—now explain why.' : 'Not yet—study the reasoning, not only the correct letter.'}</strong><p>{question.explanation}</p><small>Before continuing, say what you would check or do differently on a real job.</small></div></div>}
          <div className="assessment-quiz-actions"><button type="button" onClick={restartQuiz}><RotateCcw size={17} /> Restart</button><button type="button" className="primary-button" disabled={!revealed} onClick={nextQuestion}>{questionIndex === questions.length - 1 ? 'Finish assessment' : 'Next question'} <ArrowRight size={17} /></button></div>
        </div>
      )}

      {mode === 'quiz' && finished && (
        <div className={`assessment-result ${score >= passMark ? 'passed' : ''}`}>
          <span className="result-symbol">{score >= passMark ? <Award size={34} /> : <RotateCcw size={32} />}</span>
          <div><span className="eyebrow neutral">Assessment complete</span><h3>{score} of {questions.length} correct</h3><p>{score >= passMark ? 'You reached the mastery threshold. Keep reviewing when the cards become due so the knowledge remains available.' : `Review the explanations and try again. You need ${passMark} correct to reach 80% mastery.`}</p></div>
          <div className="result-actions"><button type="button" onClick={restartQuiz}><RotateCcw size={17} /> Try again</button>{onContinue && <button type="button" className="primary-button" onClick={onContinue}>{continueLabel} <ArrowRight size={17} /></button>}</div>
        </div>
      )}
    </section>
  );
}
