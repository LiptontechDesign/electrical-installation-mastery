export type CheckpointPlanItem = {
  title: string;
  throughLessonId: string;
};

// A checkpoint closes a coherent run of lessons. The assessment itself is
// cumulative from the start of the module, so earlier ideas return as the
// learner moves forward.
export const checkpointPlan: Record<string, readonly CheckpointPlanItem[]> = {
  'module-01': [
    { title: 'Electricity and charge', throughLessonId: 'p01-l04' },
    { title: 'Circuits and Ohm’s law', throughLessonId: 'p01-l07' },
    { title: 'Series and parallel circuits', throughLessonId: 'p01-l11' },
    { title: 'Power, energy and electrical effects', throughLessonId: 'p01-l16' },
    { title: 'Magnetism and AC waveforms', throughLessonId: 'p01-l21' },
    { title: 'AC opposition and transformers', throughLessonId: 'p01-l25' },
    { title: 'Power factor', throughLessonId: 'p06-l14' },
    { title: 'Safe electrical measurement', throughLessonId: 'p01-l31' },
  ],
  'module-02': [
    { title: 'Cables, supplies and earthing', throughLessonId: 'p02-l05' },
    { title: 'Protective devices', throughLessonId: 'p02-l08' },
    { title: 'Drawings and distribution connections', throughLessonId: 'p02-l11' },
  ],
  'module-03': [
    { title: 'Tools and conductor preparation', throughLessonId: 'p16-l02' },
    { title: 'Socket terminations', throughLessonId: 'p03-l04' },
    { title: 'Lighting-circuit connections', throughLessonId: 'p03-l09' },
    { title: 'Final circuits and consumer units', throughLessonId: 'p03-l12' },
  ],
  'module-04': [
    { title: 'PVC and steel conduit', throughLessonId: 'p04-l06' },
    { title: 'Tray, trunking and cable capacity', throughLessonId: 'p04-l10' },
    { title: 'SWA construction and installation', throughLessonId: 'p04-l14' },
    { title: 'Special cable systems', throughLessonId: 'p04-l18' },
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
    { title: 'Isolation and motor starting', throughLessonId: 'p04-l20' },
    { title: 'Motor control and distribution', throughLessonId: 'p07-l07' },
    { title: 'Submains and building load', throughLessonId: 'p07-l16' },
  ],
  'module-08': [
    { title: 'Continuity and polarity', throughLessonId: 'p08-l05' },
    { title: 'Insulation resistance', throughLessonId: 'p08-l06' },
    { title: 'Tests at the origin', throughLessonId: 'p08-l17' },
    { title: 'Circuit tests and functional checks', throughLessonId: 'p08-l15' },
    { title: 'Periodic inspection and certification', throughLessonId: 'p16-l09' },
  ],
  'module-09': [
    { title: 'Ring-circuit and insulation faults', throughLessonId: 'p09-l04' },
    { title: 'Circuit fault diagnosis', throughLessonId: 'p09-l08' },
    { title: 'Load and leakage diagnosis', throughLessonId: 'p09-l11' },
  ],
  'module-10': [
    { title: 'Load planning and service detection', throughLessonId: 'p16-l04' },
    { title: 'First fix, second fix and safe routing', throughLessonId: 'p16-l05' },
    { title: 'Complete installation projects', throughLessonId: 'p10-l08' },
  ],
  'module-11': [
    { title: 'Boxes and common accessories', throughLessonId: 'p11-v2-l05' },
    { title: 'Kitchen, cooker and shower planning', throughLessonId: 'p11-v2-l08' },
    { title: 'Special-location accessories', throughLessonId: 'p11-v2-l11' },
  ],
  'module-12': [
    { title: 'Lighting calculations', throughLessonId: 'p07-l12' },
    { title: 'Lighting design decisions', throughLessonId: 'p12-v2-l06' },
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
    { title: 'Diagnosis, pricing and estimating', throughLessonId: 'p16-l08' },
  ],
};
