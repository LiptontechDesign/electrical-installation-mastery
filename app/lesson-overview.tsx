'use client';

import { useState } from 'react';
import type { AssessmentQuestion } from './assessment-data';
import { overviewAnswers, overviewWorking, overviewPrompts, overviewPurpose, overviewModels, overviewFormulas } from './overview-answers';
import type { Retrieval } from './learning-design';
import RetrievalReveal from './retrieval-reveal';
import LearningText from './learning-text';
import Formula from './formula';
import { lessonKnowledge, lessonById } from './knowledge-graph';
import { ArrowRight, BookOpen, ChevronDown, Lightbulb } from 'lucide-react';
import type { Reading } from './books-data';
import { readingForLesson } from './books-data';
import type { LessonGuide } from './lesson-guides';
import { suppliedTeaching, sourceClarifications } from './supplied-lessons';
import { lessonConnections } from './lesson-connections-data';
import LessonConnection from './lesson-connection';
import LessonReading from './lesson-reading';
import type { EvidenceInput } from './tutor-model';
import { LessonTerms, StandardsLearning } from './tutor-panels';
import { terminologyForLesson } from './lesson-terminology';

type LessonOverviewProps = {
  lessonId: string;
  guide: LessonGuide;
  watched: boolean;
  learningText: string;
  questions: AssessmentQuestion[];
  onRateCard: (id: string, recalled: boolean) => void;
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
  questions,
  onRateCard,
  onEvidence,
  onLesson,
  onQuiz,
  onRead,
}: LessonOverviewProps) {
  const reading = readingForLesson(lessonId);
  const connection = lessonConnections[lessonId];
  const authored = suppliedTeaching[lessonId];

  const [showConsolidation, setShowConsolidation] = useState(false);
  const afterWatching = watched || showConsolidation;
  const core = questions.filter(question => question.id.includes('-q-concept-'));
  const target = core.find(question => question.design?.workingTex) ?? core[1] ?? questions[0];
  const before = core[0] ?? target;
  const other = core.find(question => question.id !== target.id) ?? questions.find(question => question.id !== target.id)!;
  const bridge = target.design?.followUp ?? { prompt: other.prompt, answer: other.options[other.answer], why: other.design?.why ?? other.teaching?.reasoning ?? other.explanation, distinction: other.design?.distinction, workingTex: other.design?.workingTex };
  const retrieval: Retrieval = authored?.retrieval ?? { prompt: overviewPrompts[lessonId] ?? guide.checkYourself, answer: overviewAnswers[lessonId], why: target.design?.why ?? target.teaching?.reasoning ?? target.explanation, distinction: target.design?.distinction, workingTex: overviewWorking[lessonId] };
  const trapIndex = before.design?.diagnostics.findIndex(item => item !== null) ?? -1;
  const trap = trapIndex >= 0 ? before.design!.diagnostics[trapIndex] : null;
  const knowledge = lessonKnowledge[lessonId];
  const terminology = terminologyForLesson(guide.keyConcepts.join(' '));
  const rate = (recalled: boolean) => {
    onRateCard(lessonId + '-overview-retrieval', recalled);
    onEvidence({ lessonId, conceptId: lessonId + '-overview-retrieval', activityId: lessonId + ':overview', dimension: 'recall', correct: recalled, assisted: false });
  };
  return <div className="overview-flow">
    <section className="overview-orientation"><span className="eyebrow neutral">Why this matters</span><p><LearningText text={overviewPurpose[lessonId] ?? guide.practicalConnection} /></p></section>
    {!afterWatching ? <section className="lesson-compass">
      <span className="eyebrow neutral">Before you watch</span><h2><LearningText text={authored?.retrieval.prompt ?? before.prompt} /></h2><p>Make a prediction. Look for the explanation as you watch.</p>
      <div className="lesson-key-ideas"><span className="lesson-focus-label">Listen for</span><ol>{core.slice(1, 3).map((question, index) => <li key={question.id}><span>{index + 1}</span><p><LearningText text={authored?.questions[index + 1].recall.prompt ?? question.prompt} /></p></li>)}</ol></div>
      <button type="button" className="secondary-button" onClick={() => setShowConsolidation(true)}>Open the learning review</button>
    </section> : <>
      <section className="lesson-compass after-video" aria-label="Lesson in one minute">
        <header className="lesson-guide-header"><div><span className="eyebrow neutral">Lesson in one minute</span><h2><LearningText text={overviewModels[lessonId] ?? guide.summary} /></h2></div></header>
        {overviewFormulas[lessonId] && <div className="overview-equation"><Formula tex={overviewFormulas[lessonId]} block /></div>}
        <div className="lesson-key-ideas"><span className="lesson-focus-label">Three key ideas</span><ol>{guide.keyConcepts.slice(0, 3).map((concept, index) => <li key={concept}><span>{index + 1}</span><p><LearningText text={concept} /></p></li>)}</ol></div>
        {sourceClarifications[lessonId] && <p><strong>Keep this distinction:</strong> <LearningText text={sourceClarifications[lessonId]} /></p>}
      </section>
      <RetrievalReveal key={target.id} item={retrieval} onRate={rate} />
      {terminology.length>0&&<details className="overview-terminology"><summary>Connect the terms used in this lesson</summary><dl>{terminology.map(item=><div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}</dl><p>Alternative names are shown together; different quantities are kept distinct.</p></details>}
      {trap && <details className="overview-trap"><summary>Common trap</summary><p><strong>Tempting explanation:</strong> <LearningText text={before.options[trapIndex]} /></p><p><strong>Where it breaks:</strong> <LearningText text={trap.diagnosis} /></p><p><strong>Correct model:</strong> <LearningText text={before.design!.why} /></p></details>}
      <section className="overview-application" aria-labelledby="practical-application-title"><span className="overview-section-icon"><Lightbulb size={20} /></span><div><span className="eyebrow neutral">Put it into practice</span><h2 id="practical-application-title">Use the idea</h2><p><LearningText text={target.design?.practice ?? target.teaching?.application ?? guide.practicalConnection} /></p></div></section>
      <StandardsLearning text={learningText} lessonId={lessonId} relevantOnly />
      <RetrievalReveal key={target.id + ':bridge'} item={bridge} label="Before the quiz — can you explain it?" />
      <button type="button" className="overview-quiz-cta" onClick={onQuiz}><span><small>Next step</small><strong>Start the lesson quiz</strong></span><span>{questions.length} multiple-choice questions <ArrowRight size={19} /></span></button>
    </>}
    <details className="overview-support"><summary><span><BookOpen size={19} /><span><strong>Need another connection?</strong><small>Foundations, terms and book pages</small></span></span><ChevronDown size={19} /></summary><div className="overview-support-body">
      {knowledge?.prerequisites.length > 0 && <div className="prerequisite-links"><strong>Builds on</strong>{knowledge.prerequisites.slice(0, 2).map(id => <button key={id} type="button" onClick={() => onLesson(id)}>{lessonById.get(id)?.title}<ArrowRight size={16} /></button>)}</div>}
      <LessonTerms lessonId={lessonId} onLesson={onLesson} />
      {connection && <LessonConnection key={lessonId} connection={connection} />}
      {reading && <LessonReading key={lessonId} lessonId={lessonId} onRead={onRead} />}
    </div></details>
  </div>;
}
