'use client';

import { ArrowLeft, CheckCircle2, ChevronDown, LockKeyhole } from 'lucide-react';
import type { CheckpointAssessment } from './assessment-data';
import AssessmentPanel from './assessment-panel';
import course from './course-curriculum';
import type { EvidenceInput, QuizRecord } from './tutor-model';

type FlashcardProgress = Record<string, { streak: number; dueAt: string }>;

type CheckpointWorkspaceProps = {
  checkpoint: CheckpointAssessment;
  moduleNumber: number;
  moduleTitle: string;
  checkpointTotal: number;
  progress: FlashcardProgress;
  bestScore: number;
  quizRecord?: QuizRecord;
  completed: boolean;
  onRateCard: (cardId: string, knew: boolean) => void;
  onEvidence: (input: EvidenceInput) => void;
  onOpenLesson: (lessonId: string) => void;
  onComplete: (score: number, total: number) => void;
  onContinue: () => void;
  onBack: () => void;
  continueLabel: string;
};

const lessonLookup = new Map(course.modules.flatMap((module)=>module.lessons.map((lesson)=>[lesson.id,lesson] as const)));

export default function CheckpointWorkspace({
  checkpoint,
  moduleNumber,
  moduleTitle,
  checkpointTotal,
  progress,
  bestScore,
  quizRecord,
  completed,
  onRateCard,
  onEvidence,
  onOpenLesson,
  onComplete,
  onContinue,
  onBack,
  continueLabel,
}: CheckpointWorkspaceProps) {
  const throughLesson=lessonLookup.get(checkpoint.throughLessonId);
  return <article className="checkpoint-workspace">
    <button type="button" className="checkpoint-back" onClick={onBack}><ArrowLeft size={17}/> Return to Lesson {String(throughLesson?.number??'').padStart(2,'0')}</button>
    <header className="checkpoint-hero">
      <div className="checkpoint-lock"><LockKeyhole size={22}/></div>
      <div>
        <span className="eyebrow">Module {String(moduleNumber).padStart(2,'0')} · Required checkpoint {checkpoint.number} of {checkpointTotal}</span>
        <h1>{checkpoint.title}</h1>
        <p>{checkpoint.questions.length} questions covering Lessons 1–{throughLesson?.number}. Score 80% to unlock the next group.</p>
      </div>
      {completed&&<span className="checkpoint-passed"><CheckCircle2 size={17}/> Passed</span>}
    </header>
    <details className="checkpoint-scope">
      <summary><span>New lessons in this checkpoint</span><small>{checkpoint.newLessonIds.length} lessons</small><ChevronDown size={18}/></summary>
      <ol>{checkpoint.newLessonIds.map((lessonId)=>{const lesson=lessonLookup.get(lessonId);return <li key={lessonId}>Lesson {String(lesson?.number??'').padStart(2,'0')} · {lesson?.title}</li>;})}</ol>
    </details>
    <AssessmentPanel
      key={checkpoint.id}
      eyebrow={`${moduleTitle} checkpoint`}
      title={checkpoint.title}
      description="Choose the best answer for each question."
      connectedLessonFlow
      mode="quiz"
      assessmentLabel="Checkpoint"
      requirePassToContinue
      showFlashcards={false}
      flashcards={checkpoint.flashcards}
      questions={checkpoint.questions}
      progress={progress}
      bestScore={bestScore}
      quizRecord={quizRecord}
      completed={completed}
      onRateCard={onRateCard}
      onEvidence={onEvidence}
      onOpenLesson={onOpenLesson}
      onCompleteQuiz={onComplete}
      onContinue={onContinue}
      continueLabel={continueLabel}
    />
  </article>;
}
