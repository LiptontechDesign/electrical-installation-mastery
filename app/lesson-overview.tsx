'use client';

import { ArrowRight, BookOpen, ChevronDown, Lightbulb } from 'lucide-react';
import type { Reading } from './books-data';
import { readingForLesson } from './books-data';
import type { LessonGuide } from './lesson-guides';
import { lessonConnections } from './lesson-connections-data';
import LessonConnection from './lesson-connection';
import LessonReading from './lesson-reading';
import type { EvidenceInput } from './tutor-model';
import { LessonCompass, LessonTerms, StandardsLearning } from './tutor-panels';

type LessonOverviewProps = {
  lessonId: string;
  guide: LessonGuide;
  watched: boolean;
  learningText: string;
  questionCount: number;
  onEvidence: (input: EvidenceInput) => void;
  onLesson: (lessonId: string) => void;
  onQuiz: () => void;
  onRead: (reading: Reading) => void;
};

export default function LessonOverview({
  lessonId,
  guide,
  watched,
  learningText,
  questionCount,
  onEvidence,
  onLesson,
  onQuiz,
  onRead,
}: LessonOverviewProps) {
  const reading = readingForLesson(lessonId);
  const connection = lessonConnections[lessonId];

  return <div className="overview-flow">
    <LessonCompass
      key={`${lessonId}-${watched}`}
      lessonId={lessonId}
      guide={guide}
      watched={watched}
      onEvidence={onEvidence}
      onLesson={onLesson}
    />

    <StandardsLearning text={learningText} lessonId={lessonId} />

    <section className="overview-application" aria-labelledby="practical-application-title">
      <span className="overview-section-icon"><Lightbulb size={20} /></span>
      <div>
        <span className="eyebrow neutral">Put it into practice</span>
        <h2 id="practical-application-title">Where this lesson becomes useful</h2>
        <p>{guide.practicalConnection}</p>
      </div>
    </section>

    <button type="button" className="overview-quiz-cta" onClick={onQuiz}>
      <span>
        <small>Next step</small>
        <strong>Start the lesson quiz</strong>
      </span>
      <span>{questionCount} multiple-choice questions <ArrowRight size={19} /></span>
    </button>

    <details className="overview-support">
      <summary>
        <span><BookOpen size={19} /><span><strong>Explore more</strong><small>Terms, book pages and deeper connections</small></span></span>
        <ChevronDown size={19} />
      </summary>
      <div className="overview-support-body">
        <LessonTerms lessonId={lessonId} onLesson={onLesson} />
        {connection && <LessonConnection key={lessonId} connection={connection} />}
        {reading && <LessonReading key={lessonId} lessonId={lessonId} onRead={onRead} />}
      </div>
    </details>
  </div>;
}
