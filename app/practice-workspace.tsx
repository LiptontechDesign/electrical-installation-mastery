'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Lightbulb, ShieldCheck } from 'lucide-react';
import { calculationProblem, calculationChoices, checkCalculation, type Calculation, type FaultCase } from './practice-data';
import type { EvidenceInput, LearningEvidence } from './tutor-model';
import { calendarDay } from './tutor-model';
import LoopVisual from './loop-visual';
import { lessonGuides } from './lesson-guides';
import ConceptVisual from './concept-visual';
import Formula from './formula';

type Props = { lessonId:string; calculation?:Calculation; cases:FaultCase[]; onEvidence:(input:EvidenceInput)=>void; evidence:LearningEvidence[] };
function CalculationStudio({ spec, lessonId, onEvidence, evidence }: { spec:Calculation } & Pick<Props,'lessonId'|'onEvidence'|'evidence'>) {
  const [stage,setStage]=useState<'worked'|'guided'|'independent'>('worked');
  const [variant,setVariant]=useState(0),[selected,setSelected]=useState<number|null>(null),[hint,setHint]=useState(false);
  const problem=calculationProblem(spec.id,variant);
  const {choices,answer}=calculationChoices(problem,variant);
  const activityId=`calc-choice:${spec.id}:${variant}`;
  const attemptedToday=evidence.some(event=>event.lessonId===lessonId&&event.activityId===activityId&&calendarDay(new Date(event.at))===calendarDay());
  const begin=(next:typeof stage)=>{setStage(next);setVariant(v=>(v+1)%4);setSelected(null);setHint(false);};
  const choose=(index:number)=>{
    if(selected!==null)return;
    setSelected(index);
    const result=checkCalculation(problem,choices[index].value,choices[index].unit);
    onEvidence({lessonId,conceptId:spec.concept,activityId,dimension:'application',correct:index===answer,assisted:stage!=='independent'||hint||attemptedToday,misconception:result.misconception});
  };
  return <section className="calculation-coach" aria-label={spec.title}>
    <span className="eyebrow neutral">{stage==='worked'?'See an example':stage==='guided'?'Try with help':'Choose your answer'}</span><h2>{spec.title}</h2>
    <p className="practice-question">{problem.prompt}</p>
    {stage==='worked'?<><div className="worked-solution"><Lightbulb size={21}/><div><strong>Step by step</strong><p>{problem.hint}</p><Formula tex={problem.workingTex} block /></div></div><button className="primary-button" type="button" onClick={()=>begin('guided')}>Try a similar question <ArrowRight size={17}/></button><button className="text-action" type="button" onClick={()=>begin('independent')}>Try without the hint</button></>:<>
      {(stage==='guided'||hint)&&<p className="practice-hint">{problem.hint}</p>}
      <div className="case-options">{choices.map((choice,index)=><button type="button" key={`${choice.value}-${choice.unit}`} disabled={selected!==null} aria-pressed={selected===index} className={selected===index?(index===answer?'correct':'incorrect'):''} onClick={()=>choose(index)}><span>{String.fromCharCode(65+index)}</span>{choice.value} {choice.unit}</button>)}</div>
      {selected===null&&stage==='independent'&&!hint&&<button type="button" className="text-action" onClick={()=>setHint(true)}>Show a hint</button>}
      {selected!==null&&<div className={`tutor-feedback ${selected===answer?'success':''}`} role="status"><strong>{selected===answer?'Correct.':'Let’s work it through.'}</strong><p>{checkCalculation(problem,choices[selected].value,choices[selected].unit).feedback}</p><p>{problem.hint}</p><Formula tex={problem.workingTex} block /><p>{problem.transfer}</p><button className="primary-button" type="button" onClick={()=>begin('independent')}>Try another question <ArrowRight size={17}/></button></div>}
      <button type="button" className="text-action" onClick={()=>setStage('worked')}>See the worked example</button>
    </>}
    {spec.id==='loop'&&<LoopVisual/>}
    <details className="source-details"><summary>What this example assumes</summary><p>{spec.assumption}</p></details>
  </section>;
}
function CaseStudio({scenario,lessonId,onEvidence,evidence}:{scenario:FaultCase}&Pick<Props,'lessonId'|'onEvidence'|'evidence'>){
  const [index,setIndex]=useState(0),[selected,setSelected]=useState<number|null>(null),[missed,setMissed]=useState(false),[finished,setFinished]=useState(false);
  const step=scenario.steps[index],correct=selected===step.answer;
  const choose=(choice:number)=>{
    if(correct)return;
    const activityId=`case:${scenario.id}:${index}`;
    const alreadySeen=evidence.some(event=>event.activityId===activityId&&calendarDay(new Date(event.at))===calendarDay());
    setSelected(choice);
    onEvidence({lessonId,conceptId:scenario.concept,activityId,dimension:scenario.id==='professional-evidence'?'standards':'diagnosis',correct:choice===step.answer,assisted:missed||alreadySeen,misconception:choice===step.answer?undefined:step.title});
    if(choice!==step.answer)setMissed(true);
  };
  return <section className="case-studio" aria-label={scenario.title}>
    <span className="eyebrow neutral"><ShieldCheck size={17}/> Virtual investigation</span><h2>{scenario.title}</h2><p>{scenario.observation}</p>
    <p className="simulation-safety">Simulation only. Real inspection, testing and correction require suitable equipment, competence, supervision and applicable authorisation.</p>
    <ol className="case-timeline" aria-label="Investigation stages">{scenario.steps.map((item,i)=><li key={item.title} aria-current={!finished&&i===index?'step':undefined} className={finished||i<index?'done':i===index?'current':''}><span>{finished||i<index?<CheckCircle2 size={16}/>:i+1}</span>{item.title}</li>)}</ol>
    {finished?<div className="tutor-feedback success" role="status"><h3>Investigation completed</h3><p>You connected observations to a test, a supported conclusion and verification. Review any supported steps in your learning record; completion is not a practical qualification.</p><button type="button" className="secondary-button" onClick={()=>{setFinished(false);setIndex(0);setSelected(null);setMissed(true);}}>Revisit the reasoning</button></div>:<>
      <h3>{step.prompt}</h3><div className="case-options">{step.options.map((option,i)=><button key={option} type="button" disabled={correct} aria-pressed={selected===i} onClick={()=>choose(i)} className={selected===i?(correct?'correct':'incorrect'):''}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
      {selected!==null&&<div className={`tutor-feedback ${correct?'success':''}`} role="status"><strong>{correct?'Reasoning checked':'Reconsider this step'}</strong><p>{step.feedback[selected]}</p>{!correct&&<><p>{step.feedback[step.answer]}</p><p>Use this reasoning to choose again.</p></>}</div>}
      <button className="primary-button" type="button" disabled={!correct} onClick={()=>{if(index===scenario.steps.length-1)setFinished(true);else{setIndex(i=>i+1);setSelected(null);setMissed(false);}}}>{index===scenario.steps.length-1?'Complete investigation':'Continue investigation'} <ArrowRight size={17}/></button>
    </>}
    <details className="source-details"><summary>Teaching source</summary><p>{scenario.source}. Fictional supplemental case; no live measurements are requested.</p></details>
  </section>;
}
export default function PracticeWorkspace({lessonId,calculation,cases,onEvidence,evidence}:Props){
  const activities=[...(calculation?[{id:`calc:${calculation.id}`,title:calculation.title}]:[]),...cases.map(item=>({id:`case:${item.id}`,title:item.title}))];
  const [active,setActive]=useState(activities[0]?.id??'');
  return <div className="practice-workspace">{activities.length>0&&<nav className="practice-picker" aria-label="Choose a practice activity">{activities.map(item=><button type="button" key={item.id} aria-pressed={active===item.id} onClick={()=>setActive(item.id)}>{item.title}</button>)}</nav>}{calculation&&active===`calc:${calculation.id}`&&<CalculationStudio key={`${lessonId}-${active}`} spec={calculation} lessonId={lessonId} onEvidence={onEvidence} evidence={evidence}/>}{cases.filter(item=>active===`case:${item.id}`).map(item=><CaseStudio key={`${lessonId}-${item.id}`} scenario={item} lessonId={lessonId} onEvidence={onEvidence} evidence={evidence}/>)}<GuidePractice key={`guide-${lessonId}`} lessonId={lessonId}/></div>;
}
function GuidePractice({lessonId}:Pick<Props,'lessonId'>){
  const guide=lessonGuides[lessonId];
  return <section className="guide-practice"><span className="eyebrow neutral">One more connection</span><h2>See how the idea is used.</h2><p>{guide.checkYourself}</p><details className="practice-explanation"><summary>Read the explanation</summary><p><strong>The key idea:</strong> {guide.remember}</p><ul>{guide.keyConcepts.map(item=><li key={item}>{item}</li>)}</ul></details><ConceptVisual lessonId={lessonId}/></section>;
}
