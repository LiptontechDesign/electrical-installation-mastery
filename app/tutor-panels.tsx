'use client';
import { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { lessonKnowledge, lessonById, lessonsForTerm, type KnowledgeTerm } from './knowledge-graph';
import { standardSources, topicsForLesson } from './standards-data';
import { learningSnapshot, type LearningEvidence, type EvidenceInput } from './tutor-model';
import type { LessonGuide } from './lesson-guides';
import { standardsChecks } from './standards-checks';

export function ContextTerm({item,onLesson}:{item:KnowledgeTerm;onLesson:(id:string)=>void}){
  return <details className="context-term"><summary>{item.term}{item.unit&&<small>{item.unit}</small>}</summary><p>{item.definition}</p>{item.formula&&<p className="term-formula">{item.formula}</p>}{item.contrast&&<p><strong>Keep the distinction:</strong> {item.contrast}</p>}<div className="term-lesson-links">{lessonsForTerm(item.term).slice(0,3).map(lesson=><button type="button" key={lesson.id} onClick={()=>onLesson(lesson.id)}>{lesson.title}<ArrowRight size={15}/></button>)}</div></details>;
}
export function LessonCompass({lessonId,guide,watched,onEvidence,onLesson,onPractice}:{lessonId:string;guide:LessonGuide;watched:boolean;onEvidence:(input:EvidenceInput)=>void;onLesson:(id:string)=>void;onPractice:()=>void}){
  const knowledge=lessonKnowledge[lessonId];
  const [revealed,setRevealed]=useState(false),[saved,setSaved]=useState(false);
  return <section className="lesson-compass" aria-label={watched?'After the video':'Start here'}>
    <span className="eyebrow neutral">{watched?'After watching':'Start here'}</span><h2>{watched?'Check the idea that matters.':'One idea to look for.'}</h2><p>{guide.checkYourself}</p>
    <button type="button" className="secondary-button" onClick={()=>setRevealed(value=>!value)} aria-expanded={revealed}>{revealed?'Hide the answer':'Reveal the answer'}</button>
    {revealed&&<div className="retrieval-comparison"><ol>{knowledge.concepts.map(concept=><li key={concept.id}>{concept.statement}</li>)}</ol><div className="button-row"><button type="button" disabled={saved} className="secondary-button" onClick={()=>{setSaved(true);onEvidence({lessonId,conceptId:`${lessonId}:synthesis`,activityId:'synthesis',dimension:'recall',correct:false,assisted:false,misconception:'Review the key idea'});}}>Show this again later</button><button type="button" disabled={saved} className="secondary-button" onClick={()=>{setSaved(true);onEvidence({lessonId,conceptId:`${lessonId}:synthesis`,activityId:'synthesis',dimension:'recall',correct:true,assisted:false});}}>I remembered this</button></div>{saved&&<p role="status">Review choice saved.</p>}</div>}
    {knowledge.prerequisites.length>0&&<details className="prerequisite-links"><summary>Need an earlier explanation?</summary>{knowledge.prerequisites.map(id=><button key={id} type="button" onClick={()=>onLesson(id)}><BookOpen size={16}/>{lessonById.get(id)?.title}</button>)}</details>}
    <button type="button" className="text-action" onClick={onPractice}>Try the quiz <ArrowRight size={17}/></button>
  </section>;
}
export function LessonTerms({lessonId,onLesson}:{lessonId:string;onLesson:(id:string)=>void}){
  const terms=lessonKnowledge[lessonId].terms;
  return <details className="lesson-terms"><summary>Terms and distinctions <span>{terms.length} linked terms</span></summary>{terms.length?<div className="context-term-list">{terms.map(item=><ContextTerm key={item.term} item={item} onLesson={onLesson}/>)}</div>:<p>The key concepts below carry this lesson’s terminology. No matching glossary entry has been verified yet.</p>}</details>;
}
function StandardsQuestion({topicId,lessonId,onEvidence}:{topicId:string;lessonId:string;onEvidence:(input:EvidenceInput)=>void}){
  const check=standardsChecks[topicId];
  const [selected,setSelected]=useState<number|null>(null);
  if(!check)return null;
  const correct=selected===check.answer;
  return <div className="standards-check"><h4>Make the evidence-based decision</h4><p>{check.prompt}</p><div className="case-options">{check.options.map((option,index)=><button type="button" key={option} disabled={correct} aria-pressed={selected===index} className={selected===index?(correct?'correct':'incorrect'):''} onClick={()=>{onEvidence({lessonId,conceptId:`standard:${topicId}`,activityId:`standard:${topicId}`,dimension:'standards',correct:index===check.answer,assisted:selected!==null,misconception:index===check.answer?undefined:check.feedback[index]});setSelected(index);}}><span>{String.fromCharCode(65+index)}</span>{option}</button>)}</div>{selected!==null&&<p role="status"><strong>{correct?'Decision checked. ':'Reconsider the evidence. '}</strong>{check.feedback[selected]}{selected!==null&&!correct?' Choose again after reading the explanation.':''}</p>}<small>This checks recognition of an evidence requirement; it does not certify compliance.</small></div>;
}
export function StandardsLearning({text,lessonId,onEvidence}:{text:string;lessonId:string;onEvidence:(input:EvidenceInput)=>void}){
  const topics=topicsForLesson(text);
  return <section className="standards-learning"><span className="eyebrow neutral"><ShieldCheck size={17}/> The rule behind the practice</span>
    {topics.map(topic=><article className="standard-topic" key={topic.id}><small>{topic.reference}</small><h3>{topic.title}</h3><p>{topic.principle}</p><details><summary>Show me why, with an example</summary><p><strong>Why:</strong> {topic.why}</p><p><strong>Example:</strong> {topic.example}</p><p><strong>Remember:</strong> {topic.mistake}</p><details><summary>One step further</summary><p>{topic.verify}</p><StandardsQuestion key={`${lessonId}-${topic.id}`} topicId={topic.id} lessonId={lessonId} onEvidence={onEvidence}/></details></details></article>)}
    <details className="standards-provenance"><summary>About the teaching reference</summary><p>{standardSources[0].identifier} · {standardSources[0].edition}.</p><p>These are plain-language teaching summaries. The examples do not reproduce the full standard or its tables.</p><small>Reference status checked 5 September 2026.</small></details>
  </section>;
}
export function EvidenceOverview({events,onLesson}:{events:LearningEvidence[];onLesson:(id:string)=>void}){
  const snapshot=learningSnapshot(events);
  return <section className="evidence-overview"><div className="tutor-section-title"><div><span className="eyebrow neutral">Evidence of learning</span><h2>See what you can do.</h2></div><span className="evidence-label">{snapshot.total} recorded attempts</span></div><p>Latest evidence is shown separately from video coverage. Recognition, self-reported recall and independent application answer different questions.</p><div className="evidence-dimensions">{snapshot.dimensions.map(item=><article key={item.dimension}><strong>{item.label}</strong><b>{item.attempted?`${item.successful} / ${item.attempted}`:'Not yet assessed'}</b><small>{item.attempted?'latest successful attempts without support':'Try a relevant learning activity'}</small><meter min={0} max={Math.max(1,item.attempted)} value={item.successful} aria-label={`${item.label}: ${item.successful} of ${item.attempted}`}/></article>)}</div><p className="retention-note"><RotateCcw size={17}/>{snapshot.retained} concepts recalled successfully at least seven days apart. This is self-reported retention evidence.</p><details open={snapshot.weaknesses.length>0}><summary>Recent difficulties and supported attempts ({snapshot.weaknesses.length})</summary>{snapshot.weaknesses.slice(0,8).map(item=><button key={item.id} type="button" className="evidence-difficulty" onClick={()=>onLesson(item.lessonId)}><span><strong>{lessonById.get(item.lessonId)?.title}</strong><small>{item.misconception??'Try again independently'} · {new Date(item.at).toLocaleDateString()}</small></span><ArrowRight size={17}/></button>)}{!snapshot.weaknesses.length&&<p>No unresolved difficulty has been recorded. This does not mean every concept is mastered.</p>}</details><p className="simulation-safety"><CheckCircle2 size={17}/> Practical competence requires observed performance and appropriate authorisation. Digital activity is preparation, not certification.</p></section>;
}
