import type { CurriculumLesson } from './course-curriculum';
import { formatStudyDuration } from './course-extension/builders';

export type LicensingPath = 'C2' | 'C1' | 'Professional';
export const pathLabels: Record<LicensingPath, string> = {
  C2: 'Part I · C2 Licensing Path', C1: 'Part II · C1 Licensing Path', Professional: 'Part III · Professional Mastery',
};
const range = (prefix: string, first: number, last: number) => Array.from({length:last-first+1},(_,i)=>`${prefix}${String(first+i).padStart(2,'0')}`);
type Stage = { id:string; path:LicensingPath; title:string; ids:string[]; purpose:string };
type ExistingModule = { id:string; number:number; title:string; description:string; checkpoint:string; lessons:CurriculumLesson[]; durationSeconds:number; duration:string };
export function buildLicensingModules<T extends ExistingModule>(legacy:T[]) {
  const all = legacy.flatMap(m=>m.lessons), catalogue = new Map(all.map(l=>[l.id,l]));
  const original = (id:string) => legacy.find(m=>m.id===id)!.lessons.map(l=>l.id);
  const stages:Stage[] = [
    {id:'module-01',path:'C2',title:'Electrical Foundations',ids:original('module-01').filter(id=>id!=='p06-l14'),purpose:'Charge, circuits, power, magnetism, AC, basic power factor and measurement. Measurement demonstrations are preparation for supervised work, not permission to work live.'},
    {id:'module-02',path:'C2',title:'Installation Architecture, Drawings and Safety',ids:['p02-l02','p11-v2-l02','p07-l13','p07-l14','p07-l15','p16-l01','p03-l14','p16-l04','p16-l05'],purpose:'Follow supply → isolation → distribution → final circuit → load. Read drawings, recognise equipment and isolate safely before installation work.'},
    {id:'module-03',path:'C2',title:'Single-Phase Wiring and Accessories',ids:['p03-l01','p03-l02','p16-l02',...range('p03-l',5,9),'p03-l03','p03-l04','p03-l10','p11-v2-l06','p11-l01','p10-l03','p10-l04','p11-v2-l03','p11-v2-l04','p11-v2-l05','p11-v2-l08','p11-v2-l09','p11-v2-l10','p12-v2-l01','p12-v2-l07','p03-l11'],purpose:'Prepare conductors, follow switching diagrams, wire accessories and select practical luminaires. Complete board assembly comes after protection and design.'},
    {id:'module-04',path:'C2',title:'Cable Systems, Containment and Installation Methods',ids:['p02-l01',...original('module-04').filter(id=>!['p04-l15','p04-l16','p04-l17'].includes(id))],purpose:'Choose cable construction and containment, then practise routing, capacity checks, mechanical protection and SWA termination.'},
    {id:'module-05',path:'C2',title:'Faults, Protective Devices, Earthing and ADS',ids:['p05-l01','p02-l06','p05-l02','p05-l03','p05-l05','p02-l07','p05-l04','p02-l08','p02-l04','p02-l05','p05-l08','p05-l10','p05-l07','p05-l06','p05-l11','p05-l14','p05-l15','p05-spd'],purpose:'Fault → device response → earthing and bonding → earth-fault path → disconnection → coordination. Distinguish overcurrent, residual-current and surge protection.'},
    {id:'module-06',path:'C2',title:'Single-Phase Circuit Design',ids:['p06-l01','p10-l09','p06-l11','p11-v2-l07','p06-l12','p06-l02','p06-l03','p06-l04','p06-l10','p06-l07','p06-l08','p06-l09','p06-l15'],purpose:'Treat load, Ib, In, Iz, correction factors, cable size, voltage drop, fault protection and breaking capacity as one documented design workflow.'},
    {id:'c2-boards',path:'C2',title:'Consumer Units and Complete Installation',ids:['p02-l10','p03-l13','p03-l12','p10-l01','p10-l02','p10-l05'],purpose:'Apply protection and design decisions to board termination, torque, circuit schedules and complete single-phase installation cases. Preview verification; formal testing follows next.'},
    {id:'module-08',path:'C2',title:'C2 Inspection, Testing and Commissioning',ids:['p08-l02','p08-l03','p05-l09','p08-l04','p08-l05','p08-l16','p08-l06','p08-l12','p02-l09','p08-l08','p08-l09','p08-l10','p08-l13','p08-l14','p08-l15','p16-l09'],purpose:'Inspect first; complete appropriate dead tests before controlled energisation and live verification. Interpret results, rectify defects and document the installation.'},
    {id:'module-09',path:'C2',title:'C2 Fault Finding',ids:range('p09-l',1,11),purpose:'Information → inspection → isolation → hypothesis → suitable test → interpretation → repair → retest → return to service.'},
    {id:'c1-fundamentals',path:'C1',title:'Three-Phase Fundamentals',ids:['p02-l03',...range('p07-l',1,5)],purpose:'C1 assumes the C2 core. Understand phase displacement, star/delta, line/phase quantities, balanced loads and neutral current before three-phase applications.'},
    {id:'c1-power',path:'C1',title:'Three-Phase Power and Calculations',ids:['p06-l13'],purpose:'Extend the AC power model to line/phase values, star/delta relationships and three-phase calculations.'},
    {id:'c1-distribution',path:'C1',title:'Three-Phase Distribution Systems',ids:['p08-l01','p02-l11','p11-v2-l11','p07-l06','p07-l07','p07-l08','p07-l09','p07-l16','p10-l10','p10-l06','p10-l07'],purpose:'Start with three-phase safe isolation, then trace boards, feeders, outlets, phase allocation and building distribution. Practical work remains supervised.'},
    {id:'c1-design',path:'C1',title:'Three-Phase Cable and Protective-Device Design',ids:['p06-l05'],purpose:'Reuse the C2 design chain in a complete three-phase SWA design example. UK tables remain source examples, not Kenyan regulatory approval.'},
    {id:'c1-pfc',path:'C1',title:'Power Factor Correction',ids:['p06-l14'],purpose:'Connect P/Q/S and poor power factor to current, losses and correction. Use the supporting video and worked kVAr exercise to extend foundation theory.'},
    {id:'c1-motors',path:'C1',title:'Three-Phase Motor Principles and Nameplates',ids:['p07-induction'],purpose:'Rotating magnetic field → rotor and slip → rated speed → nameplate → terminal arrangements. Understand the motor before its starter.'},
    {id:'module-07',path:'C1',title:'Motor Starting, Control and Protection',ids:['p04-l21','p15-v2-l01','p04-l19','p04-l20','p07-star-delta','p07-vfd'],purpose:'Contactor and coil → auxiliary contacts → overload → starter diagrams → physical wiring → interlocking → drives. Supporting lessons explain the equipment before wiring.'},
    {id:'c1-earthing',path:'C1',title:'Earthing and Protection Application',ids:['p05-l12','p05-l13'],purpose:'Apply the C2 fault-path model to detailed impedance calculations and design evidence. These are calculation refinements, not a different earthing philosophy.'},
    {id:'c1-testing',path:'C1',title:'Three-Phase Testing and Periodic Inspection',ids:['p08-l07','p08-l17','p08-l11','p08-periodic'],purpose:'Extend C2 verification to three-phase measurements and periodic evidence. Compare findings with applicable requirements and record limitations.'},
    {id:'c1-faults',path:'C1',title:'C1 Distribution Fault Diagnosis',ids:['p10-l08','p16-l06'],purpose:'Use distribution-board and thermal evidence critically. Motor phase-loss and imbalance diagnosis need additional supervised practice, not inference from these videos alone.'},
    {id:'professional-cables',path:'Professional',title:'Specialist Cable Systems',ids:['p04-l15','p04-l16','p04-l17'],purpose:'Extend core cable skills into specialist flexible and mineral-insulated systems with product-specific constraints.'},
    {id:'module-12',path:'Professional',title:'Advanced Lighting Design and Controls',ids:original('module-12').filter(id=>!['p12-v2-l01','p12-v2-l07'].includes(id)),purpose:'Develop lighting calculations, specification, drivers, dimming, control architecture and emergency-lighting design beyond the licensing spine.'},
    {id:'module-13',path:'Professional',title:'Smart Buildings, Data, Security and Life Safety',ids:original('module-13'),purpose:'Study KNX, data and building-system interfaces after the core installation pathway; these do not block C2 or C1 progress.'},
    {id:'module-14',path:'Professional',title:'Solar, Storage, Backup Power and EV',ids:original('module-14'),purpose:'Extend into multiple-source energy systems with specific authorisations, isolation plans and product guidance.'},
    {id:'module-15',path:'Professional',title:'Specialist Building Services',ids:original('module-15'),purpose:'Apply core control and protection knowledge to pumps, ventilation and sensitive building loads.'},
    {id:'module-16',path:'Professional',title:'Estimating and Professional Practice',ids:original('module-16'),purpose:'Plan scope, resources, quotations and professional handover beyond licensing study.'},
  ];
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
    return {...base,id:stage.id,number:index+1,path:stage.path,stageNumber:++pathNumbers[stage.path],classification:stage.path==='Professional'?'PROFESSIONAL EXTENSION':`${stage.path} CORE`,title:stage.title,description:stage.purpose,checkpoint:stage.purpose,lessons,durationSeconds,duration:formatStudyDuration(durationSeconds)};
  });
  if(used.size!==catalogue.size) throw new Error(`Unassigned licensing lessons: ${all.filter(l=>!used.has(l.id)).map(l=>l.id).join(', ')}`);
  return modules;
}
