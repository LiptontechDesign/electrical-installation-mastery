'use client';
import { licensingPracticeId } from './integrated-progress';
import {useEffect,useState} from 'react';
import course from './course-curriculum';
import {pathLabels,type LicensingPath} from './licensing-curriculum';
import AssessmentPanel from './assessment-panel';
import type {buildAssessmentBank} from './assessment-data';
import type {EvidenceInput,QuizRecord} from './tutor-model';
import Formula from './formula';

export function ElectricalShockContext() {
  return <aside className="licensing-safety"><h3>Electrical incident: protect yourself before helping</h3><p>Do not touch a casualty who may still be in contact with electricity. Keep others clear. Disconnect the supply only if safe; do not approach fallen lines or attempt a high-voltage rescue. Summon emergency help and follow the dispatcher’s instructions.</p><p>In Kenya, call <strong>999 or 112</strong>, give the exact location and describe the electrical hazard. Once the scene is safe, assess responsiveness and normal breathing; follow current CPR/AED guidance when indicated. Arrange medical assessment after electric shock, including injuries or burns. These videos do not replace practical first-aid training.</p><p><a href="https://www.sja.org.uk/first-aid-advice/electrocution/" target="_blank" rel="noreferrer">St John: electrical-shock first aid</a> · <a href="https://disastermanagement.go.ke/" target="_blank" rel="noreferrer">Kenya emergency contacts</a></p></aside>;
}
function CorrectionExample() {
  const [kw,setKw]=useState(10),[initial,setInitial]=useState(.7),[target,setTarget]=useState(.95);
  const kvar=kw*(Math.tan(Math.acos(initial))-Math.tan(Math.acos(target)));
  return <div className="licensing-example"><h3>Worked correction exercise</h3><p>A workshop load consumes real power at lagging power factor. Estimate the reactive compensation for a higher target, assuming sinusoidal steady-state conditions and unchanged real power.</p><div className="supp-fields"><label>Real power (kW)<input type="number" min=".1" max="10000" step=".1" value={kw} onChange={e=>setKw(Math.max(.1,Math.min(10000,Number(e.target.value)||.1)))}/></label><label>Existing power factor<input type="number" min=".1" max="1" step=".01" value={initial} onChange={e=>setInitial(Math.max(.1,Math.min(1,Number(e.target.value)||.1)))}/></label><label>Target power factor<input type="number" min=".1" max="1" step=".01" value={target} onChange={e=>setTarget(Math.max(.1,Math.min(1,Number(e.target.value)||.1)))}/></label></div><Formula tex={'Q_c=P(\\tan\\varphi_1-\\tan\\varphi_2),\\quad \\varphi=\\cos^{-1}(\\mathrm{pf})'} block/>{target<initial?<p>Choose a target at least as high as the existing power factor for this correction exercise.</p>:<p><strong>{kvar.toFixed(2)} kVAr</strong> of theoretical compensation. Explain why compensation reduces supply reactive current rather than the real power used by the load.</p>}<p>This is not an equipment specification. Selection must also address voltage, steps/control, harmonics/resonance, switching and manufacturer limits. Individual correction serves a load; group correction serves a load group; central automatic banks respond to changing site demand. Capacitors retain hazardous stored energy.</p></div>;
}
export function LicensingStageGuide({moduleId}:{moduleId:string}) {
  const stage=course.modules.find(m=>m.id===moduleId)!;
  return <section className="licensing-stage-guide"><span className="eyebrow">{pathLabels[stage.path]} · Stage {stage.stageNumber}</span><h2>{stage.title}</h2><p>{stage.description}</p>
    {moduleId==='module-02'&&<details><summary>Electrical-shock response: read before CPR/AED</summary><ElectricalShockContext/></details>}
    {moduleId==='module-06'&&<><Formula tex={'I_b \\leq I_n \\leq I_z'} block/><p>Identify the load and design current first. Select protection, then check installed cable capacity using the applicable correction factors. Check voltage drop, fault protection and breaking capacity before finalising the design. A cable passing one calculation has not necessarily passed the others.</p></>}
    {moduleId==='module-08'&&<details open><summary>Initial Verification — The Complete Test Sequence</summary><p>Visual inspection and safe isolation establish the starting condition. Appropriate continuity/CPC, ring continuity where relevant, insulation resistance and polarity checks identify defects before energisation. Earth-electrode checks apply where required. Only when the dead-test evidence and safety controls permit it should a competent person proceed to live verification: supply polarity, external loop impedance, prospective fault current, circuit loop/RCD performance and functional checks, followed by documentation.</p><p>This is a learning sequence, not a universal field procedure: method, order, parallel paths, connected equipment and safe conditions depend on the installation and applicable standard. For every demonstration record the purpose, instrument, safe condition, expected interpretation, defect indication and next action. Never energise simply because you reached the next video.</p></details>}
    {moduleId==='c1-pfc'&&<CorrectionExample/>}
    {moduleId==='c1-faults'&&<p className="licensing-gap">Further supervised scenarios are still needed for motor phase loss, phase imbalance and protection coordination. The board and thermal lessons do not establish full C1 fault-finding competence.</p>}
  </section>;
}

function PracticeTimer({minutes}:{minutes:number}) {
  const [deadline,setDeadline]=useState<number|null>(null);
  const [remaining,setRemaining]=useState(minutes*60);
  useEffect(()=>{
    if(deadline===null)return;
    const timer=window.setInterval(()=>setRemaining(Math.max(0,Math.ceil((deadline-Date.now())/1000))),1000);
    return ()=>window.clearInterval(timer);
  },[deadline]);
  return <div><button className="secondary-button" onClick={()=>{setRemaining(minutes*60);setDeadline(Date.now()+minutes*60000);}}>{deadline===null?'Start':'Restart'} optional practice timer</button><p role="timer" aria-label="Practice time remaining">{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')} remaining{remaining===0?' — time reached; finish and review your answers.':''}</p><small>Study aid only: the timer does not submit answers or certify exam readiness.</small></div>;
}
type Props={initialExam?:'C2'|'C1'|null;bank:ReturnType<typeof buildAssessmentBank>;completed:string[];passedCheckpoints:string[];records:Record<string,QuizRecord>;onLesson:(id:string)=>void;onExam:(path:'C2'|'C1',score:number,total:number)=>void;onEvidence:(e:EvidenceInput)=>void};
export function LicensingOverview({initialExam=null,bank,completed,passedCheckpoints,records,onLesson,onExam,onEvidence}:Props) {
  const [exam,setExam]=useState<'C2'|'C1'|null>(initialExam);
  const done=new Set(completed),passed=new Set(passedCheckpoints);
  const pathComplete=(path:'C2'|'C1')=>{
    const stages=course.modules.filter(m=>m.path===path);
    const record=records[licensingPracticeId(path)];
    return stages.every(m=>m.lessons.every(l=>done.has(l.id))&&bank.checkpointsByModule[m.id].every(c=>passed.has(c.id)))&&Boolean(record&&record.bestTotal>0&&record.bestScore/record.bestTotal>=.8);
  };
  const questionSet=(path:'C2'|'C1')=>course.modules.filter(m=>m.path===path).flatMap(m=>{
    const questions=bank.modules[m.id].questions;
    return [0,Math.floor(questions.length/2),questions.length-1].filter((n,i,a)=>a.indexOf(n)===i).map(n=>questions[n]);
  });
  return <section className="licensing-overview" aria-label="Licensing pathways"><h2>Your learning progression</h2><p>Complete the C2 foundation, extend it through C1, then explore specialist systems. Course milestones require watched core videos, passed checkpoints and at least 80% on course written practice. C1 also requires the C2 milestone. These are study records, not an EPRA licence or proof of practical competence.</p><div className="licensing-paths">{(['C2','C1','Professional'] as LicensingPath[]).map(path=>{
    const modules=course.modules.filter(m=>m.path===path),lessons=modules.flatMap(m=>m.lessons),checks=modules.flatMap(m=>bank.checkpointsByModule[m.id]);
    const watched=lessons.filter(l=>done.has(l.id)).length,checksDone=checks.filter(c=>passed.has(c.id)).length;
    const complete=path!=='Professional'&&pathComplete(path)&&(path!=='C1'||pathComplete('C2'));
    return <article key={path}><span className="eyebrow">{path==='Professional'?'Optional enrichment':path+' core'}</span><h3>{pathLabels[path]}</h3><p>{path==='C2'?'Foundations → installation → protection → design → testing → fault finding':path==='C1'?'Three-phase → design → power factor → motors → verification':'Specialist cables, lighting, automation, energy systems and professional practice'}</p><p>{watched}/{lessons.length} videos · {checksDone}/{checks.length} checkpoints</p><button className="secondary-button" onClick={()=>onLesson(lessons.find(l=>!done.has(l.id))?.id??lessons[0].id)}>Open {path} pathway</button>{path!=='Professional'&&<><button className="secondary-button" onClick={()=>setExam(exam===path?null:path)}>EPRA {path} preparation</button><p className="licensing-milestone">{complete?path+' COURSE CORE COMPLETE':path+' core in progress'}</p></>}</article>;
  })}</div>
  {exam&&<section className="licensing-preparation"><h3>EPRA {exam} preparation</h3><p>This is course-authored revision, not an official EPRA past paper or a guarantee of eligibility. Verify current regulations, Kenyan standards, application conditions and practical requirements with <a href="https://www.epra.go.ke/written-oral-interviews-areas-competency" target="_blank" rel="noreferrer">EPRA’s competency publication</a>.</p><details open><summary>Oral and practical preparation</summary><ol>{(exam==='C2'?[
    'Explain the path from the supply to a socket load, including isolation, protection, neutral and CPC. Identify the role of each without assuming colour alone proves identity.',
    'For a new final circuit, explain how Ib, In and Iz connect to cable routing, correction factors, voltage drop and fault protection. Which evidence could make you reject the design?',
    'An RCD trips intermittently: explain how you would collect information, isolate safely, choose tests, interpret the results and verify a repair.',
    'Explain why dead tests precede controlled energisation, which defects prevent progress, and what belongs in the test record.',
    'Describe electrical-incident response without becoming a second casualty, and practise CPR/AED with an accredited trainer.',
  ]:[
    'Read a three-phase motor nameplate and justify supply connection, load current and protective settings using the actual manufacturer information.',
    'Explain the complete three-phase cable-design chain, then identify the limits of using a UK worked example for a Kenyan installation.',
    'Explain real, reactive and apparent power; calculate a target compensation value and identify practical capacitor-bank checks.',
    'Explain how a contactor, overload relay and short-circuit protective device cooperate, then reason through a failure-to-start scenario.',
    'Plan initial or periodic verification of a three-phase board, explaining safe conditions, interpretation, limitations and reporting.',
  ]).map(q=><li key={q}>{q}</li>)}</ol></details><p>Suggested written practice: allow about one minute per question, then review the explanatory feedback. Exact EPRA exam timing and pass requirements are not represented here.</p><PracticeTimer key={exam+"-timer"} minutes={questionSet(exam).length}/><AssessmentPanel key={exam} title={exam+' written practice'} eyebrow="Course-authored revision" description="A balanced selection from the existing lesson assessments. These results do not overwrite lesson or checkpoint passes." flashcards={[]} questions={questionSet(exam)} progress={{}} bestScore={records[licensingPracticeId(exam)]?.bestScore??0} quizRecord={records[licensingPracticeId(exam)]} completed={Boolean(records[licensingPracticeId(exam)] && records[licensingPracticeId(exam)].bestScore / records[licensingPracticeId(exam)].bestTotal >= .8)} mode="quiz" showFlashcards={false} onRateCard={()=>{}} onEvidence={onEvidence} onCompleteQuiz={(score,total)=>onExam(exam,score,total)}/><p className="licensing-gap">Still required outside this course: authoritative current Kenya/KEBS tables and regulatory material, verified official past papers where available, supervised practical assessment and confirmed EPRA eligibility. A mock score does not establish these.</p></section>}
  </section>;
}
