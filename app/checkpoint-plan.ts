import course, { legacyModules } from './course-curriculum';
export type CheckpointPlanItem = {
  title: string;
  throughLessonId: string;
  recapKey?: string;
  legacyId?: string;
};

export function legacyCheckpointId(moduleId:string,index:number) {
  const expanded=(moduleId==='module-01'&&index>=2)||moduleId==='module-12';
  const reordered=['module-02','module-03','module-04','module-06','module-07','module-08','module-09','module-10','module-11','module-12','module-15','module-16'].includes(moduleId)||(moduleId==='module-01'&&index===13);
  return `${moduleId}-checkpoint-${index+1}${expanded?'-supplied-202609':''}${reordered?'-flow-202609':''}`;
}

// A checkpoint closes a coherent run of lessons. The assessment itself is
// cumulative from the start of the module, so earlier ideas return as the
// learner moves forward.
export const legacyCheckpointPlan: Record<string, readonly CheckpointPlanItem[]> = {
  'module-01': [
    { title: 'Electricity and charge', throughLessonId: 'p01-l04' },
    { title: 'Circuits and Ohm’s law', throughLessonId: 'p01-l07' },
    { title: 'Conductor geometry, temperature and resistance', throughLessonId: 'p06-l06' },
    { title: 'Length and material resistivity', throughLessonId: 'supp-resistance-06' },
    { title: 'Series and parallel circuits', throughLessonId: 'p01-l11' },
    { title: 'Power, energy and electrical effects', throughLessonId: 'p01-l16' },
    { title: 'Magnetism and AC waveforms', throughLessonId: 'p01-l21' },
    { title: 'Inductive and capacitive opposition', throughLessonId: 'supp-ac-theory-08' },
    { title: 'Waveforms and phasors', throughLessonId: 'supp-ac-theory-11' },
    { title: 'Voltage and impedance triangles', throughLessonId: 'p01-l24' },
    { title: 'AC currents and power', throughLessonId: 'supp-ac-theory-23' },
    { title: 'Coil analysis and correction', throughLessonId: 'supp-ac-theory-24' },
    { title: 'Power factor', throughLessonId: 'p06-l14' },
    { title: 'Safe electrical measurement', throughLessonId: 'p01-l31' },
  ],
  'module-02': [
    { title: 'Cables, supplies and earthing', throughLessonId: 'p02-l05' },
    { title: 'Protective devices', throughLessonId: 'p02-l08' },
    { title: 'Drawings and distribution connections', throughLessonId: 'p02-l11' },
  ],
  'module-03': [
    { title: 'Tools, safe isolation and conductor preparation', throughLessonId: 'p16-l02' },
    { title: 'Socket terminations', throughLessonId: 'p03-l04' },
    { title: 'Lighting-circuit connections', throughLessonId: 'p03-l09' },
    { title: 'Final circuits and consumer units', throughLessonId: 'p03-l12' },
  ],
  'module-04': [
    { title: 'PVC and steel conduit', throughLessonId: 'p04-l06' },
    { title: 'Tray, trunking and conduit circuit layout', throughLessonId: 'p04-l18', recapKey: 'p04-l10' },
    { title: 'SWA construction and installation', throughLessonId: 'p04-l14' },
    { title: 'Special cable systems', throughLessonId: 'p04-l17', recapKey: 'p04-l18' },
  ],
  'module-05': [
    { title: 'Faults, earthing and protective devices', throughLessonId: 'p05-l05' },
    { title: 'Disconnection and earth-fault loop impedance', throughLessonId: 'p05-l13' },
    { title: 'Protective coordination and surge protection', throughLessonId: 'p05-spd' },
  ],
  'module-06': [
    { title: 'Three-phase relationships', throughLessonId: 'p06-l13' },
    { title: 'Demand and design current', throughLessonId: 'p06-l03' },
    { title: 'Cable sizing and correction factors', throughLessonId: 'p06-l05' },
    { title: 'Voltage drop and fault rating', throughLessonId: 'p06-l15' },
  ],
  'module-07': [
    { title: 'Motor principles, contactors and starters', throughLessonId: 'p04-l20' },
    { title: 'Motor control and distribution', throughLessonId: 'p07-l07' },
    { title: 'Submains and building load', throughLessonId: 'p07-l16' },
  ],
  'module-08': [
    { title: 'Safe isolation, continuity and polarity', throughLessonId: 'p08-l05' },
    { title: 'Insulation resistance', throughLessonId: 'p08-l06' },
    { title: 'Tests at the origin', throughLessonId: 'p08-l17' },
    { title: 'Circuit tests and functional checks', throughLessonId: 'p08-l15' },
    { title: 'Installation certification, then periodic inspection', throughLessonId: 'p08-periodic', recapKey: 'p16-l09' },
  ],
  'module-09': [
    { title: 'Ring-circuit and insulation faults', throughLessonId: 'p09-l04' },
    { title: 'Circuit fault diagnosis', throughLessonId: 'p09-l08' },
    { title: 'Load, leakage and thermal diagnosis', throughLessonId: 'p16-l06' },
  ],
  'module-10': [
    { title: 'Load planning and service detection', throughLessonId: 'p16-l05', recapKey: 'project-survey' },
    { title: 'First fix and second fix', throughLessonId: 'p10-l04', recapKey: 'project-fixing' },
    { title: 'Complete installation projects', throughLessonId: 'p10-l08' },
  ],
  'module-11': [
    { title: 'Accessory specification, kitchen layout and demand', throughLessonId: 'p11-v2-l07', recapKey: 'residential-planning' },
    { title: 'Chasing, boxes and accessory installation', throughLessonId: 'p11-v2-l05' },
    { title: 'Special-location accessories', throughLessonId: 'p11-v2-l11' },
  ],
  'module-12': [
    { title: 'Visual task and human-centred lighting design', throughLessonId: 'p12-v2-l05', recapKey: 'lighting-brief' },
    { title: 'Lighting quantities and inverse-square calculations', throughLessonId: 'supp-lighting-03' },
    { title: 'Incidence angles and point calculations', throughLessonId: 'supp-lighting-05' },
    { title: 'Lumen method and fitting counts', throughLessonId: 'supp-lighting-09' },
    { title: 'Multiple-source lighting calculations', throughLessonId: 'supp-lighting-12' },
    { title: 'Professional lighting specification', throughLessonId: 'p12-v2-l06' },
    { title: 'Downlights and LED strip systems', throughLessonId: 'p12-v2-l10' },
    { title: 'Drivers, dimming and flicker', throughLessonId: 'p12-v2-l13' },
    { title: 'Ratings and garden lighting', throughLessonId: 'p12-v2-l16' },
    { title: 'Lighting-control systems', throughLessonId: 'p12-v2-l22' },
    { title: 'Emergency lighting and final design review', throughLessonId: 'p12-l04' },
  ],
  'module-13': [
    { title: 'KNX control', throughLessonId: 'p13-v2-l03' },
    { title: 'Data, security and access control', throughLessonId: 'p13-v2-l09' },
    { title: 'Gate safety and fire detection', throughLessonId: 'p13-v2-l13' },
  ],
  'module-14': [
    { title: 'Solar survey, preparation and isolation', throughLessonId: 'p14-v2-l09' },
    { title: 'Storage location and installation checks', throughLessonId: 'p14-v2-l07' },
    { title: 'Inverters, transfer and backup power', throughLessonId: 'p14-l07' },
    { title: 'EV charging and handover', throughLessonId: 'p14-v2-l16' },
  ],
  'module-15': [
    { title: 'Building-services controls and protection', throughLessonId: 'p15-v2-l04' },
  ],
  'module-16': [
    { title: 'Job pricing and rewire estimating', throughLessonId: 'p16-l08' },
  ],
};

// Keep old coverage available for history and recap provenance, not as current gates.
export const legacyScopes = legacyModules.flatMap(module => {
  let start=0;
  return legacyCheckpointPlan[module.id].map((item,index)=>{
    const end=module.lessons.findIndex(l=>l.id===item.throughLessonId);
    const scope={...item,moduleId:module.id,id:legacyCheckpointId(module.id,index),lessonIds:module.lessons.slice(0,end+1).map(l=>l.id),newLessonIds:module.lessons.slice(start,end+1).map(l=>l.id)};
    start=end+1;return scope;
  });
});
const sourceChapter=new Map(legacyScopes.flatMap(scope=>scope.newLessonIds.map(id=>[id,scope] as const)));
// New stage boundaries follow coherent work tasks rather than every legacy chapter change.
const stageGroups:Record<string,readonly (readonly [string,string])[]>={
  'module-02':[['p07-l15','Supply architecture and drawings'],['p16-l05','Tools, isolation and service detection']],
  'module-03':[['p16-l02','Preparing conductors and connections'],['p03-l09','Lighting switching arrangements'],['p03-l10','Socket circuits and accessories'],['p10-l04','Planning and first/second fix'],['p11-v2-l10','Installing residential accessories'],['p03-l11','Practical luminaires and final connections']],
  'module-05':[['p05-l05','Faults, fuses and overcurrent response'],['p02-l08','Residual-current and protective-device distinctions'],['p05-l10','Earthing and protective bonding'],['p05-l11','Fault loops and automatic disconnection'],['p05-spd','Device selection and surge protection']],
  'module-06':[['p06-l12','Load, demand and design current'],['p06-l10','Cable sizing and installation factors'],['p06-l08','Voltage-drop checks'],['p06-l15','Fault checks and final design evidence']],
  'c2-boards':[['p03-l12','Consumer-unit assembly and connections'],['p10-l05','Complete installation cases']],
  'module-08':[['p08-l06','Inspection, continuity, insulation and polarity'],['p08-l10','Controlled live verification'],['p16-l09','RCD, functional checks and documentation']],
  'c1-distribution':[['p11-v2-l11','Safe isolation and industrial accessories'],['p07-l16','Boards and distribution arrangements'],['p10-l07','Three-phase installation projects']],
  'c1-testing':[['p08-l17','Three-phase measurement and verification'],['p08-periodic','Inspection findings and periodic evidence']],
  'c1-faults':[['p16-l06','Distribution faults and thermal evidence']],
};
export const checkpointPlan:Record<string,readonly CheckpointPlanItem[]> = Object.fromEntries(course.modules.map(module=>{
  const result:CheckpointPlanItem[]=[];
  let start=0;
  module.lessons.forEach((lesson,index)=>{
    const source=sourceChapter.get(lesson.id)!;
    const next=module.lessons[index+1];
    const groups=stageGroups[module.id],group=groups?.find(([end])=>end===lesson.id);
    if(groups&&!group)return;
    if(!groups&&next&&sourceChapter.get(next.id)?.id===source.id&&(module.id==='module-01'||index-start<5))return;
    const cumulative=module.lessons.slice(0,index+1).map(l=>l.id);
    const old=legacyScopes.find(scope=>scope.moduleId===module.id&&scope.lessonIds.join('|')===cumulative.join('|'));
    result.push({title:group?.[1]??(index===start?lesson.title:source.title),throughLessonId:lesson.id,recapKey:source.recapKey??source.throughLessonId,legacyId:old?.id});
    start=index+1;
  });
  return [module.id,result];
}));
