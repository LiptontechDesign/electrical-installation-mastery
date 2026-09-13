'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import explanations from './lesson-explanations.json';
import { overviewPurpose, overviewModels, overviewFormulas } from './overview-answers';
import LearningText from './learning-text';
import Formula from './formula';
import { lessonKnowledge, lessonById } from './knowledge-graph';
import { ArrowRight, BookOpen, ChevronDown, Lightbulb } from 'lucide-react';
import { readingForLesson, type Reading } from './books-data';
import type { LessonGuide } from './lesson-guides';
import { sourceClarifications } from './supplied-lessons';
import { lessonConnections } from './lesson-connections-data';
import LessonConnection from './lesson-connection';
import LessonReading from './lesson-reading';
import { LessonTerms, StandardsLearning } from './tutor-panels';
import { terminologyForLesson } from './lesson-terminology';
import OverviewReader from './overview-reader';
import { overviewData, overviewSectionForLesson } from './overview-data';

type Explanation = { prompt: string; answer?: string; why?: string; distinction?: string; workingTex?: string };
type Notes = { before: string; listenFor: string[]; explanation: Explanation; bridge: Explanation; application: string; trap?: { temptation: string; diagnosis: string; model: string } };
const lessonExplanations: Record<string, Notes> = explanations;
const StudyNotes = dynamic(() => import('./study-notes'));
function ModelExplanation({ item, title }: { item: Explanation; title: string }) {
  return <details className="overview-support"><summary>{title}</summary><div className="overview-support-body"><h3><LearningText text={item.prompt}/></h3>{item.answer&&<p><LearningText text={item.answer}/></p>}{item.workingTex&&<Formula tex={item.workingTex} block/>}{item.why&&<p><LearningText text={item.why}/></p>}{item.distinction&&<p><strong>Keep separate:</strong> <LearningText text={item.distinction}/></p>}</div></details>;
}
export default function LessonOverview({ lessonId, guide, watched, learningText, onLesson, onRead }: {
  lessonId: string; guide: LessonGuide; watched: boolean; learningText: string;
  onLesson: (id: string) => void; onRead: (reading: Reading) => void;
}) {
  const notes = lessonExplanations[lessonId];
  const [showReview, setShowReview] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const knowledge = lessonKnowledge[lessonId];
  const terminology = terminologyForLesson(guide.keyConcepts.join(' '));
  const standardsSection = overviewSectionForLesson(lessonId);
  return <div className="overview-flow">
    <section className="overview-orientation"><span className="eyebrow neutral">Why this matters</span><p><LearningText text={overviewPurpose[lessonId] ?? guide.practicalConnection}/></p></section>
    {!watched&&!showReview&&<section className="lesson-compass"><span className="eyebrow neutral">Before you watch</span><h2><LearningText text={notes?.before ?? guide.checkYourself}/></h2><p>Look for the explanation as you watch.</p><ul>{(notes?.listenFor ?? guide.keyConcepts).map((idea,i)=><li key={i}><LearningText text={idea}/></li>)}</ul><button type="button" className="secondary-button" onClick={()=>setShowReview(true)}>Open the learning review</button></section>}
    {(watched||showReview)&&<>
      <section className="lesson-compass after-video" aria-label="Lesson in one minute"><span className="eyebrow neutral">Lesson in one minute</span><h2><LearningText text={overviewModels[lessonId] ?? guide.summary}/></h2>{overviewFormulas[lessonId]&&<Formula tex={overviewFormulas[lessonId]} block/>}<div className="lesson-key-ideas"><span className="lesson-focus-label">Key ideas</span><ol>{guide.keyConcepts.map((concept,i)=><li key={i}><span>{i+1}</span><p><LearningText text={concept}/></p></li>)}</ol></div>{sourceClarifications[lessonId]&&<p><strong>Keep this distinction:</strong> <LearningText text={sourceClarifications[lessonId]}/></p>}</section>
      {notes&&<ModelExplanation item={notes.explanation} title="Read the model explanation"/>}
      {terminology.length>0&&<details className="overview-terminology"><summary>Connect the terms used in this lesson</summary><dl>{terminology.map(item=><div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}</dl></details>}
      {notes?.trap&&<details className="overview-trap"><summary>Common misunderstanding</summary><p><strong>Tempting explanation:</strong> <LearningText text={notes.trap.temptation}/></p><p><strong>Where it breaks:</strong> <LearningText text={notes.trap.diagnosis}/></p><p><strong>Correct model:</strong> <LearningText text={notes.trap.model}/></p></details>}
      <section className="overview-application"><span className="overview-section-icon"><Lightbulb size={20}/></span><div><span className="eyebrow neutral">Put it into practice</span><h2>Use the idea</h2><p><LearningText text={notes?.application ?? guide.practicalConnection}/></p></div></section>
      {notes&&<ModelExplanation item={notes.bridge} title="A further connection"/>}
    </>}
    {standardsSection&&<OverviewReader section={standardsSection} terms={overviewData.terms} sources={overviewData.sources} formulas={overviewData.formulas} onLesson={onLesson} onRead={onRead}/>} 
    <StandardsLearning text={learningText} lessonId={lessonId} relevantOnly/>
    <details className="overview-support" onToggle={event=>setShowNotes(event.currentTarget.open)}><summary>Further explanations and practical connections</summary>{showNotes&&<StudyNotes lessonId={lessonId}/>}</details>
    <details className="overview-support"><summary><span><BookOpen size={19}/><span><strong>Need another connection?</strong><small>Foundations, terms and book pages</small></span></span><ChevronDown size={19}/></summary><div className="overview-support-body">
      {knowledge?.prerequisites.length>0&&<div className="prerequisite-links"><strong>Builds on</strong>{knowledge.prerequisites.slice(0,2).map(id=><button key={id} type="button" onClick={()=>onLesson(id)}>{lessonById.get(id)?.title}<ArrowRight size={16}/></button>)}</div>}
      <LessonTerms lessonId={lessonId} onLesson={onLesson}/>
      {lessonConnections[lessonId]&&<LessonConnection key={lessonId} connection={lessonConnections[lessonId]}/>}
      {readingForLesson(lessonId)&&<LessonReading key={lessonId} lessonId={lessonId} onRead={onRead}/>}
    </div></details>
  </div>;
}
