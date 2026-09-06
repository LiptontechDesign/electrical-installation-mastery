'use client';
import { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { lessonKnowledge, lessonById, lessonsForTerm, type KnowledgeTerm } from './knowledge-graph';
import { topicsForLesson } from './standards-data';
import { learningSnapshot, type LearningEvidence, type EvidenceInput } from './tutor-model';
import type { LessonGuide } from './lesson-guides';
import Formula from './formula';

export function ContextTerm({item,onLesson}:{item:KnowledgeTerm;onLesson:(id:string)=>void}){
  return <details className="context-term"><summary>{item.term}{item.unit&&<small>{item.unit}</small>}</summary><p>{item.definition}</p>{item.formulaTex?<div className="term-formula"><Formula tex={item.formulaTex} block />{item.formulaNote&&<small>{item.formulaNote}</small>}</div>:item.formula&&<p className="term-formula">{item.formula}</p>}{item.contrast&&<p><strong>Keep the distinction:</strong> {item.contrast}</p>}<div className="term-lesson-links">{lessonsForTerm(item.term).slice(0,3).map(lesson=><button type="button" key={lesson.id} onClick={()=>onLesson(lesson.id)}>{lesson.title}<ArrowRight size={15}/></button>)}</div></details>;
}
export function LessonCompass({lessonId,guide,watched,onEvidence,onLesson}:{lessonId:string;guide:LessonGuide;watched:boolean;onEvidence:(input:EvidenceInput)=>void;onLesson:(id:string)=>void}){
  const knowledge=lessonKnowledge[lessonId];
  const [revealed,setRevealed]=useState(false),[saved,setSaved]=useState(false);
  return <section className={`lesson-compass ${watched?'after-video':''}`} aria-label="Lesson in one minute">
    <header className="lesson-guide-header"><div><span className="eyebrow neutral">Lesson in one minute</span><h2>{guide.summary}</h2></div><span className="lesson-watch-status">{watched?'Video watched':'Before you watch'}</span></header>
    {knowledge.prerequisites.length>0&&<details className="prerequisite-links"><summary>Need a foundation first?</summary>{knowledge.prerequisites.map(id=><button key={id} type="button" onClick={()=>onLesson(id)}><BookOpen size={16}/>{lessonById.get(id)?.title}</button>)}</details>}
    <div className="lesson-key-ideas"><span className="lesson-focus-label">Three key ideas</span><ol>{guide.keyConcepts.slice(0,3).map((concept,index)=><li key={concept}><span>{index+1}</span><p>{concept}</p></li>)}</ol></div>
    <div className="lesson-recall-check"><span className="lesson-focus-label">Check yourself</span><h3>{guide.checkYourself}</h3><button type="button" className="secondary-button" onClick={()=>setRevealed(value=>!value)} aria-expanded={revealed}>{revealed?'Hide answer':'Reveal answer'}</button>
      {revealed&&<div className="retrieval-comparison"><span>Answer to remember</span><p>{guide.remember}</p><div className="button-row"><button type="button" disabled={saved} className="secondary-button" onClick={()=>{setSaved(true);onEvidence({lessonId,conceptId:`${lessonId}:synthesis`,activityId:'synthesis',dimension:'recall',correct:false,assisted:false,misconception:'Review the key idea'});}}>Review this later</button><button type="button" disabled={saved} className="secondary-button" onClick={()=>{setSaved(true);onEvidence({lessonId,conceptId:`${lessonId}:synthesis`,activityId:'synthesis',dimension:'recall',correct:true,assisted:false});}}>I recalled it</button></div>{saved&&<p role="status">Review choice saved.</p>}</div>}
    </div>
  </section>;
}
export function LessonTerms({lessonId,onLesson}:{lessonId:string;onLesson:(id:string)=>void}){
  const terms=lessonKnowledge[lessonId].terms;
  if(!terms.length)return null;
  return <details className="lesson-terms"><summary>Terms and distinctions <span>{terms.length} linked terms</span></summary><div className="context-term-list">{terms.map(item=><ContextTerm key={item.term} item={item} onLesson={onLesson}/>)}</div></details>;
}
export function StandardsLearning({text,lessonId}:{text:string;lessonId:string}){
  const topics=topicsForLesson(text,lessonId);
  const isFoundation=topics.length===1&&topics[0].id==='basic-protection';
  if(isFoundation){const topic=topics[0];return <details className="standards-learning standards-baseline"><summary><ShieldCheck size={18}/><span><strong>Core safety connection</strong><small>{topic.reference}</small></span></summary><div className="standards-baseline-body"><p>{topic.principle}</p><p>{topic.example}</p></div></details>;}
  return <section className="standards-learning" aria-label="Standard to know"><header className="standards-heading"><span className="overview-section-icon"><ShieldCheck size={20}/></span><div><span className="eyebrow neutral">Standard to know</span><h2>{topics.length===1?topics[0].title:`${topics.length} connected requirements`}</h2></div></header>
    {topics.map(topic=><article className="standard-topic" key={topic.id}><small>{topic.reference}</small>{topics.length>1&&<h3>{topic.title}</h3>}<p>{topic.principle}</p><div className="standard-example"><strong>Apply it:</strong> {topic.example}</div><details><summary>Why it matters</summary><p>{topic.why}</p><p><strong>Avoid:</strong> {topic.mistake}</p><p><strong>Verify:</strong> {topic.verify}</p></details></article>)}
  </section>;
}
export function EvidenceOverview({events,onLesson}:{events:LearningEvidence[];onLesson:(id:string)=>void}){
  const snapshot=learningSnapshot(events);
  return <section className="evidence-overview"><div className="tutor-section-title"><div><span className="eyebrow neutral">Evidence of learning</span><h2>See what you can do.</h2></div><span className="evidence-label">{snapshot.total} recorded attempts</span></div><p>Latest evidence is shown separately from video coverage. Recognition, self-reported recall and independent application answer different questions.</p><div className="evidence-dimensions">{snapshot.dimensions.map(item=><article key={item.dimension}><strong>{item.label}</strong><b>{item.attempted?`${item.successful} / ${item.attempted}`:'Not yet assessed'}</b><small>{item.attempted?'latest successful attempts without support':'Try a relevant learning activity'}</small><meter min={0} max={Math.max(1,item.attempted)} value={item.successful} aria-label={`${item.label}: ${item.successful} of ${item.attempted}`}/></article>)}</div><p className="retention-note"><RotateCcw size={17}/>{snapshot.retained} concepts recalled successfully at least seven days apart. This is self-reported retention evidence.</p><details open={snapshot.weaknesses.length>0}><summary>Recent difficulties and supported attempts ({snapshot.weaknesses.length})</summary>{snapshot.weaknesses.slice(0,8).map(item=><button key={item.id} type="button" className="evidence-difficulty" onClick={()=>onLesson(item.lessonId)}><span><strong>{lessonById.get(item.lessonId)?.title}</strong><small>{item.misconception??'Try again independently'} · {new Date(item.at).toLocaleDateString()}</small></span><ArrowRight size={17}/></button>)}{!snapshot.weaknesses.length&&<p>No unresolved difficulty has been recorded. This does not mean every concept is mastered.</p>}</details><p className="simulation-safety"><CheckCircle2 size={17}/> Practical competence requires observed performance and appropriate authorisation. Digital activity is preparation, not certification.</p></section>;
}
