import type { CurriculumLesson } from './course-curriculum';
import { formatStudyDuration } from './course-extension/builders';
import { integratedLessons } from './integrated-lessons';
import integratedIndex from './integrated-video-index.json';

export type LicensingPath = 'C2' | 'C1' | 'Professional';
export const pathLabels: Record<LicensingPath, string> = {
  C2: 'C2 · Domestic and single-phase', C1: 'C1 · Three-phase and commercial', Professional: 'Advanced systems',
};
const range = (prefix: string, first: number, last: number) => Array.from({length:last-first+1},(_,i)=>`${prefix}${String(first+i).padStart(2,'0')}`);
type Stage = { id:string; path:LicensingPath; title:string; ids:string[]; purpose:string };
type ExistingModule = { id:string; number:number; title:string; description:string; learningOutcome:string; lessons:CurriculumLesson[]; durationSeconds:number; duration:string };
export function buildLicensingModules<T extends ExistingModule>(legacy:T[]) {
  const all = [...legacy.flatMap(m=>m.lessons),...integratedLessons], catalogue = new Map(all.map(l=>[l.id,l]));
  const original = (id:string) => legacy.find(m=>m.id===id)!.lessons.map(l=>l.id);
  const stages:Stage[] = [
    {id:'module-01',path:'C2',title:'Electrical Principles and Single-Phase Calculations',ids:original('module-01').filter(id=>!['p06-l14','p01-l28','p01-l29','p01-l30','p01-l31'].includes(id)),purpose:'Build electricity from charge and complete circuits through resistance, power, magnetism, transformers, AC quantities and power factor. Calculations appear only after the physical idea they describe.'},
    {id:'module-02',path:'C2',title:'Safety, Supply Architecture, Drawings and Instruments',ids:['p02-l02','p11-v2-l02','p07-l13','p07-l14','p07-l15','p16-l01','p03-l14','p01-l28','p01-l29','p01-l30','p01-l31','p16-l04','p16-l05'],purpose:'Trace a domestic supply and read its drawings, then learn tools, hazards, safe isolation and incident response before using meters or detecting concealed services. Instrument demonstrations are preparation for competent practice, not permission to work live.'},
    {id:'module-03',path:'C2',title:'Cables, Conductors and Final Circuits',ids:['p02-l01','p03-l01','p03-l02','p16-l02',...range('p03-l',5,9),'p03-l03','p03-l04','p03-l10','p11-v2-l06','p11-l01','p10-l03','p10-l04','p11-v2-l03','p11-v2-l04','p11-v2-l05','p11-v2-l08','p11-v2-l09','p11-v2-l10','p12-v2-l01','p12-v2-l07','p12-v2-l14','p03-l11'],purpose:'Identify cable construction and conductor functions before preparing conductors. Then progress from switching and socket topologies through route planning, first/second fix, accessories and luminaire connections.'},
    {id:'module-04',path:'C2',title:'Containment, Routing and Cable Installation',ids:original('module-04').filter(id=>!['p04-l15','p04-l16','p04-l17'].includes(id)),purpose:'Develop installation craft in order: PVC and steel conduit, trunking and tray capacity, route layout, mechanical protection, then SWA construction and termination.'},
    {id:'module-05',path:'C2',title:'Fault Protection, Earthing and Protective Devices',ids:['p05-l01','p02-l06','p05-l02','p05-l03','p05-l05','p02-l04','p02-l05','p05-l08','p05-l07','p05-l06','p05-l10','p05-l11','p02-l07','p05-l04','p02-l08','p05-l15','p05-spd','p05-l14'],purpose:'Start with fault types and protective functions, then connect overcurrent devices, earth-fault paths, earthing and ADS, RCD/RCBO protection, surge and arc protection, and finally rating and selectivity.'},
    {id:'module-06',path:'C2',title:'Load Assessment and Single-Phase Circuit Design',ids:['p06-l01','p10-l09','p06-l11','p11-v2-l07','p06-l12','p06-l02','p06-l03','p06-l04','p06-l10','p06-l07','p06-l08','p06-l09','p06-l15'],purpose:'Turn a load brief into a defensible circuit design: establish demand and Ib, select In, establish installed Iz, then check voltage drop, fault protection and breaking capacity before finalising the design.'},
    {id:'c2-boards',path:'C2',title:'Consumer Units: Assembly and Pre-Commissioning',ids:['p03-l13','p03-l12','p02-l10'],purpose:'Apply protection and design knowledge to correct torque, consumer-unit assembly and the longer-tail/switch-fuse special case. Stop at the pre-energisation boundary; the complete verification workflow follows next.'},
    {id:'module-08',path:'C2',title:'Initial Verification, Commissioning and Installation Capstones',ids:['p08-l02','p08-l03','p05-l09','p08-l04','p08-l05','p08-l16','p08-l06','p08-l12','p02-l09','p08-l08','p08-l09','p08-l10','p08-l13','p08-l14','p08-l15','p16-l09','p10-l01','p10-l02','p10-l05'],purpose:'Inspect and plan first, complete the appropriate dead tests, then proceed only under controlled conditions to live verification, functional checks and documentation. Finish with whole-installation cases that now make sense as capstones.'},
    {id:'module-09',path:'C2',title:'Systematic Fault Diagnosis',ids:['p09-l01','p09-l02','p09-l04','p09-l05','p09-l08','p09-l03','p09-l06','p09-l07','p09-l09','p09-l10','p09-l11'],purpose:'Use one repeatable method: define the symptom → make safe → classify likely causes → choose a discriminating test → localise → repair → retest. Cases progress from continuity and polarity to insulation/leakage and load-current diagnosis.'},
    {id:'c1-fundamentals',path:'C1',title:'Three-Phase Supply, Star/Delta and Neutral Behaviour',ids:['p02-l03',...range('p07-l',1,5)],purpose:'Build on the C2 AC foundation: first see three phase as a supply, then learn star/delta line-versus-phase relationships, balanced loads and the neutral current created by imbalance.'},
    {id:'c1-power',path:'C1',title:'Three-Phase Voltage, Current and Power Calculations',ids:['p06-l13'],purpose:'Consolidate line and phase quantities before using balanced three-phase P, Q and S calculations. Distinguish electrical input power from motor shaft output and state the assumptions behind each formula.'},
    {id:'c1-distribution',path:'C1',title:'Three-Phase Boards, Feeders and Outlets',ids:['p08-l01','p07-l06','p07-l07','p07-l08','p02-l11','p11-v2-l11'],purpose:'After safe isolation, identify the board and its outgoing circuits, follow a submain to the next board, then examine industrial outlets. This is the system map needed before sizing or installing it.'},
    {id:'c1-design',path:'C1',title:'Three-Phase Load, Cable and Protection Design',ids:['p10-l10','p07-l16','p06-l05'],purpose:'Estimate demand and phase allocation, then choose protection and cables and check three-phase voltage drop and fault duty. UK tables are teaching examples, not Kenyan approval.'},
    {id:'c1-earthing',path:'C1',title:'Small-Commercial Earthing and Installation Application',ids:['p05-l13','p05-l12','p07-l09','p10-l06','p10-l07'],purpose:'Complete fault-loop and earthing checks after sizing, then watch conductor management and full-board installations as applications of the design. The C2 fault-path foundation remains a prerequisite.'},
    {id:'c1-pfc',path:'C1',title:'Power Factor Causes, Correction and Capacitor Sizing',ids:['p06-l14'],purpose:'Understand why inductive loads draw reactive current and the consequences of poor power factor; then calculate compensating kVAr and compare individual, group and automatic bank placement.'},
    {id:'c1-motors',path:'C1',title:'Induction Motors, Nameplates and Terminal Connections',ids:['p07-induction'],purpose:'Learn rotating field, slip and speed before reading a real motor nameplate and connecting its windings in star or delta. Supply voltage and nameplate ratings govern the permissible connection.'},
    {id:'module-07',path:'C1',title:'Motor Starters, Protection and Speed Control',ids:['p04-l21','p15-v2-l01','p04-l19','p04-l20','p07-star-delta','p07-vfd'],purpose:'Move from contactor and overload function to DOL diagrams and wiring; only then compare star-delta, soft starting and VFD speed control. Keep short-circuit, overload and control functions distinct.'},
    {id:'c1-testing',path:'C1',title:'Three-Phase Initial Verification and Periodic Inspection',ids:['p08-l07','p08-l17','p08-l11','p08-periodic'],purpose:'Use the C2 inspection and dead-test sequence, then study phase rotation and controlled three-phase live measurements before periodic inspection and reporting.'},
    {id:'c1-faults',path:'C1',title:'Three-Phase and Motor Fault Diagnosis',ids:['p10-l08','p16-l06'],purpose:'Trace the system before testing: consider lost neutral, board defects, missing motor phase and thermal symptoms; isolate, repair and repeat the relevant verification. Videos do not replace supervised practice.'},
    {id:'professional-cables',path:'Professional',title:'Specialist Cable Systems',ids:['p04-l15','p04-l16','p04-l17'],purpose:'Extend core cable skills into specialist flexible and mineral-insulated systems with product-specific constraints.'},
    {id:'module-12',path:'Professional',title:'Advanced Lighting Design and Controls',ids:original('module-12').filter(id=>!['p12-v2-l01','p12-v2-l07','p12-v2-l14'].includes(id)),purpose:'Develop lighting calculations, specification, drivers, dimming, control architecture and emergency-lighting design beyond the licensing spine.'},
    {id:'module-13',path:'Professional',title:'Smart Buildings, Data, Security and Life Safety',ids:original('module-13'),purpose:'Study KNX, data and building-system interfaces after the core installation pathway; these do not block C2 or C1 progress.'},
    {id:'module-14',path:'Professional',title:'Solar, Storage, Backup Power and EV',ids:original('module-14'),purpose:'Extend into multiple-source energy systems with specific authorisations, isolation plans and product guidance.'},
    {id:'module-15',path:'Professional',title:'Specialist Building Services',ids:original('module-15'),purpose:'Apply core control and protection knowledge to pumps, ventilation and sensitive building loads.'},
    {id:'module-16',path:'Professional',title:'Estimating and Professional Practice',ids:original('module-16'),purpose:'Plan scope, resources, quotations and professional handover beyond licensing study.'},
  ];
  for(const video of integratedIndex){
    const stage=stages.find(s=>s.ids.includes(video.anchor));
    if(!stage)throw new Error('Missing integration anchor: '+video.anchor);
    stage.ids.splice(stage.ids.indexOf(video.anchor)+(video.position==='after'?1:0),0,video.id);
  }
  const used = new Set<string>(), pathNumbers = {C2:0,C1:0,Professional:0};
  const modules = stages.map((stage,index)=>{
    const base = legacy.find(m=>m.id===stage.id) ?? legacy[0];
    const lessons = stage.ids.map((id,i)=>{
      const lesson = catalogue.get(id);
      if (!lesson || used.has(id)) throw new Error(`Licensing curriculum missing/repeated lesson ${id}`);
      used.add(id);
      return {...lesson,number:i+1,prerequisite:i ? `Build on “${catalogue.get(stage.ids[i-1])!.title}”.` : stage.purpose};
    });
    const durationSeconds = lessons.reduce((sum,l)=>sum+l.durationSeconds,0);
    return {...base,id:stage.id,number:index+1,path:stage.path,stageNumber:++pathNumbers[stage.path],classification:stage.path==='Professional'?'PROFESSIONAL EXTENSION':`${stage.path} CORE`,title:stage.title,description:stage.purpose,learningOutcome:stage.purpose,lessons,durationSeconds,duration:formatStudyDuration(durationSeconds)};
  });
  if(used.size!==catalogue.size) throw new Error(`Unassigned licensing lessons: ${all.filter(l=>!used.has(l.id)).map(l=>l.id).join(', ')}`);
  return modules;
}
