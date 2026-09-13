import { learningSections } from './learning-sections';
import type { CanonicalTerm, OverviewFormula, OverviewSection } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

const stageId = 'C2-05';
const sectionId = 'c2-05-faults-protective-devices-earthing-ads';
const moduleId = 'module-05';
const groups = learningSections.filter(section => section.moduleId === moduleId);
const lessonIds = [...new Set(groups.flatMap(section => section.lessonIds))];

const reviewed = (lessonIds: string[], relatedTermIds: string[] = [], formulaIds: string[] = []): Partial<CanonicalTerm> => ({
  editorialStatus: 'reviewed', stageIds: [stageId], sectionIds: [sectionId], lessonIds, relatedTermIds, formulaIds,
});

export const c205TermPatches: Record<string, Partial<CanonicalTerm>> = {
  mcb: {
    ...reviewed(['p05-l03','p05-l05','course-gqEu9t8HwW0','course-Me_adh09CdY'], ['overload-current','short-circuit','glossary-breaking-capacity','fuse','mccb']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-protection'],
    standardsMeaning: 'A miniature circuit-breaker is an overcurrent protective device with defined rated current, time-current characteristic and short-circuit interrupting capability; common designs use thermal response for sustained overload and magnetic response for high fault current.',
    plainMeaning: 'An MCB does more than carry its printed ampere value. Its curve, poles, fault duty and coordination with the cable/supply matter.',
    practicalExample: 'A breaker can have the right normal-current rating yet still be unsuitable if the available fault current exceeds its verified breaking capability.',
    explainAloud: 'Distinguish the thermal and magnetic operating regions of a typical MCB and explain why trip curve is not the same thing as breaking capacity.',
  },
  mccb: {
    ...reviewed(['course-TqdQRgf3uGs'], ['mcb','glossary-breaking-capacity','selectivity','overload-current','short-circuit']),
    sourceIds: ['course-vocabulary','course-c2-protection'],
    standardsMeaning: 'A moulded-case circuit-breaker is a circuit-breaker family used over a broad range of currents and fault duties; the frame, fitted trip unit, adjustable settings and short-circuit ratings must be read as separate product data.',
    plainMeaning: 'Do not treat “MCCB 250 A” as a complete specification. Frame size, rated current, overload setting and Icu/Ics/Icw or trip functions can describe different limits.',
    practicalExample: 'A feeder MCCB may have a frame rating above the selected long-time pickup Ir; its short-circuit breaking capacity still has to exceed the relevant prospective fault current or be part of a specifically verified combination.',
    explainAloud: 'Explain In/frame/Ir and why Icu, Ics and Icw answer different questions.',
  },
  rcd: {
    ...reviewed(['p05-l04','course-TUno2IT-KZY'], ['rccb','rcbo','rcd-types','additional-protection','earth-fault']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-protection','osg-rcd-operation'],
    standardsMeaning: 'An RCD is a residual-current protective device that detects imbalance between the currents passing through its sensing arrangement and operates according to its specified residual-current/time characteristics.',
    plainMeaning: 'It compares outgoing and returning current. A difference means some current is returning by another path; that is a different protective principle from measuring load overcurrent.',
    practicalExample: 'A downstream line-to-earth leakage can create residual imbalance even when the total load current is far below the MCB rating.',
    explainAloud: 'Where has the “missing” neutral current gone when an RCD detects a residual imbalance?',
  },
  rccb: {
    ...reviewed(['p02-l07','course-TUno2IT-KZY'], ['rcd','rcbo','mcb','overload-current']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-protection'],
    practicalExample: 'An RCCB can provide residual-current protection for a group of circuits but still requires suitable overcurrent protection because it does not contain integral overload/short-circuit protection.',
    explainAloud: 'Why is an RCCB not a substitute for an MCB or fuse?',
  },
  rcbo: {
    ...reviewed(['p02-l08','course-TUno2IT-KZY'], ['rcd','rccb','mcb']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-protection'],
    practicalExample: 'An RCBO on an individual final circuit combines the residual-current function with overcurrent protection for that circuit, subject to its full ratings and installation arrangement.',
    explainAloud: 'Name the two protective functions combined in an RCBO and distinguish them physically.',
  },
  ads: {
    ...reviewed(['p05-l06','p05-l07','p05-l11'], ['earth-fault','cpc','zs','ze','r1-r2','fault-protection'], ['earth-fault-loop','earth-fault-current']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-protection','osg-earthing-bonding'],
    standardsMeaning: 'Automatic disconnection of supply is a fault-protection measure in which the earthing/protective-conductor system and protective device are coordinated so a fault causing a dangerous touch condition results in automatic disconnection within the required conditions/time.',
    plainMeaning: 'A line-to-metal fault needs a complete return path to the source and a protective device that responds fast enough. Earthing is part of a circuit, not a sink where fault current disappears.',
    practicalExample: 'Line faults to an exposed metal case, fault current returns through CPC/earthing path to the source, and the coordinated breaker/RCD disconnects the supply.',
    explainAloud: 'Trace the full ADS current loop from the line conductor to a faulted metal enclosure and back to the source.',
  },
  zs: {
    ...reviewed(['p05-l07','p05-l11'], ['ze','r1-r2','ads','earth-fault'], ['earth-fault-loop','earth-fault-current']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-zs-appendix'],
    practicalExample: 'If Ze is 0.30 ohm and the stated R1+R2 contribution is 0.62 ohm under the same stated condition, the simplified loop model gives Zs about 0.92 ohm before any required design/test interpretation.',
    explainAloud: 'What parts of the fault loop are represented by Ze and by R1+R2?',
  },
  ze: {
    ...reviewed(['p05-l07'], ['zs','r1-r2']), sourceIds: ['course-vocabulary','course-c2-protection','osg-zs-appendix'],
    practicalExample: 'Ze is the external supply-side contribution considered at the installation origin; it is not the complete Zs at a final load.',
  },
  'r1-r2': {
    ...reviewed(['p05-l07','p05-l11'], ['zs','ze','cpc']), sourceIds: ['course-vocabulary','course-c2-protection','osg-zs-appendix'],
    practicalExample: 'R1+R2 represents the final-circuit line plus protective-conductor contribution in the simplified Zs relationship.',
  },
  cpc: {
    ...reviewed(['p05-l10'], ['ads','earthing-conductor','protective-bonding-conductor','met','exposed-conductive-part']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-earthing-bonding'],
    standardsMeaning: 'A circuit protective conductor forms part of the protective-conductor path associated with a circuit and connects relevant exposed-conductive-parts into the fault-protection arrangement.',
    plainMeaning: 'The CPC normally does not carry load current; during an earth fault it helps provide the intended low-impedance return path for protective operation.',
    practicalExample: 'An open CPC may leave Class I equipment operating normally until a fault makes the exposed metal hazardous.',
    explainAloud: 'Why can a CPC be electrically essential even though it carries no normal load current in a healthy circuit?',
  },
  met: {
    ...reviewed(['p02-l04','p02-l05'], ['cpc','earthing-conductor','protective-bonding-conductor']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-earthing-bonding'],
    standardsMeaning: 'The main earthing terminal is the principal terminal/bar at which the installation earthing conductor, protective conductors and relevant protective bonding conductors are brought together according to the installation arrangement.',
    plainMeaning: 'It is the main protective-conductor junction point, not simply “the earth bar” as a vague destination.',
    explainAloud: 'Name the different conductor functions that can meet at the MET and state why neutral is not just another CPC.',
  },
  'tn-s': { ...reviewed(['p05-l08'], ['tn-c-s','tt','it-earthing','earthing-conductor']), sourceIds: ['course-vocabulary','course-c2-protection','osg-earthing-bonding'] },
  'tn-c-s': { ...reviewed(['p05-l08'], ['tn-s','tt','it-earthing','pen']), sourceIds: ['course-vocabulary','course-c2-protection','osg-earthing-bonding'] },
  tt: { ...reviewed(['p05-l08'], ['tn-s','tn-c-s','it-earthing','earth-electrode','rcd']), sourceIds: ['course-vocabulary','course-c2-protection','osg-earthing-bonding'] },
  spd: {
    ...reviewed(['course-CNiLNvBLopI','p05-spd'], ['transient-overvoltage','afdd']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-protection'],
    standardsMeaning: 'A surge protective device limits transient overvoltage by diverting/limiting surge energy within its specified type, voltage, connection and coordination arrangement.',
    plainMeaning: 'An SPD handles short-duration voltage surges. It is not an overload device, RCD or substitute for an engineered lightning-protection system.',
    practicalExample: 'Long connecting conductors can reduce the effective voltage-limiting performance of an SPD arrangement, so location and connection layout matter as well as the device label.',
    explainAloud: 'Which fault/problem is an SPD intended to address, and which three protective jobs does it not replace?',
  },
  'glossary-breaking-capacity': {
    ...reviewed(['p05-l02','p05-l03','p05-l14'], ['pfc','pscc','pefc','mcb','mccb']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-protection'],
    standardsMeaning: 'Breaking capacity is the specified fault current a protective switching device can interrupt safely under the stated voltage, power-factor/test and product-standard conditions.',
    plainMeaning: 'The device must be able to safely stop the fault current available at its location. Normal load rating alone says nothing about that duty.',
    practicalExample: 'A device marked for 6 kA fault interruption is not accepted solely because the circuit load is only 20 A; the prospective fault current at the installation point must be within the verified duty/combination.',
    explainAloud: 'Why are 20 A and 6 kA markings answering completely different selection questions?',
  },
  'glossary-earthing': {
    ...reviewed(['p02-l04','p05-l08'], ['glossary-bonding','earthing-conductor','met','earth-electrode']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-earthing-bonding'],
    practicalExample: 'Earthing connects the installation protective system to the means of earthing/supply arrangement so fault protection has the intended reference and return path.',
  },
  'glossary-bonding': {
    ...reviewed(['p02-l05'], ['glossary-earthing','protective-bonding-conductor','extraneous-conductive-part']),
    sourceIds: ['course-vocabulary','course-c2-protection','osg-earthing-bonding'],
    practicalExample: 'Protective bonding connects relevant extraneous-conductive-parts into the equipotential protective arrangement; it does not replace the final-circuit CPC.',
  },
  'glossary-discrimination-selectivity': {
    ...reviewed(['p05-l14'], ['selectivity','mcb','mccb','fuse']), sourceIds: ['course-vocabulary','course-c2-protection'],
  },
};

const newTerm = (id: string, term: string, aliases: string[], standardsMeaning: string, plainMeaning: string, category: string, options: Partial<PreservedCanonicalTerm> = {}): PreservedCanonicalTerm => ({
  id, term, aliases, definition: standardsMeaning, category, authority: 'explanatory-definition', editorialStatus: 'reviewed', standardsMeaning, plainMeaning,
  practicalExample: options.practicalExample, notTheSameAs: options.notTheSameAs ?? [], relatedTermIds: options.relatedTermIds ?? [], sourceIds: options.sourceIds ?? ['course-c2-protection'],
  formulaIds: options.formulaIds ?? [], stageIds: [stageId], sectionIds: [sectionId], lessonIds: options.lessonIds ?? [], kenyaStatus: options.kenyaStatus ?? 'check-kenyan-requirement',
  explainAloud: options.explainAloud, contrast: options.contrast, unit: options.unit, formula: options.formula, formulaTex: options.formulaTex, formulaNote: options.formulaNote,
});

export const c205AdditionalTerms: PreservedCanonicalTerm[] = [
  newTerm('overload-current', 'Overload current', ['overload','overload current'], 'Overload current is overcurrent occurring in an electrically sound current path because the load demand exceeds the intended circuit/equipment capacity for sufficient time.', 'The current is flowing along the normal path, but too much of it is flowing for too long.', 'Protection', {
    lessonIds: ['p05-l01'], relatedTermIds: ['short-circuit','earth-fault','fuse','mcb'], practicalExample: 'Several loads added to a sound circuit can cause sustained conductor heating without any insulation fault.', explainAloud: 'How does an overload path differ from a short-circuit path?',
  }),
  newTerm('short-circuit', 'Short circuit', ['short circuit','short-circuit fault'], 'A short circuit is a fault producing an unintended low-impedance connection between conductors at different potentials, commonly causing high current limited by the source and loop impedances.', 'A fault bypasses the intended load path, so the available current can rise very rapidly.', 'Protection', {
    lessonIds: ['p05-l01'], relatedTermIds: ['overload-current','earth-fault','pscc','glossary-breaking-capacity'], practicalExample: 'Line-to-neutral contact through damaged insulation can produce short-circuit current far above the circuit design current.', explainAloud: 'Why does short-circuit current depend on source/loop impedance rather than on the normal load?',
  }),
  newTerm('earth-fault', 'Earth fault', ['earth fault','line to earth fault'], 'An earth fault is a fault in which a live conductor becomes connected to exposed conductive parts, protective conductors or earth/earth-referenced conductive paths, producing current through the fault-protection loop.', 'Current leaves the intended live-current path and returns toward the source through the protective/earth path.', 'Protection', {
    lessonIds: ['p05-l01','p05-l06'], formulaIds: ['earth-fault-current'], relatedTermIds: ['short-circuit','ads','cpc','zs','pefc'], practicalExample: 'A line conductor touching a metal appliance case creates an earth-fault condition that the protective system must clear.', explainAloud: 'Trace where earth-fault current returns; do not say it simply “goes into the ground and disappears.”',
  }),
  newTerm('fuse', 'Fuse', ['fuse','fuse element'], 'A fuse is an overcurrent protective device in which a calibrated element melts and interrupts the circuit when the time/current energy condition of the fuse is exceeded, within its specified ratings.', 'The fuse element is intentionally sacrificial. Its current rating, time-current behavior and breaking capacity all matter.', 'Protection', {
    lessonIds: ['p05-l02','course-kx35WN3uLis'], relatedTermIds: ['mcb','overload-current','short-circuit','glossary-breaking-capacity'], practicalExample: 'Two fuses with the same nominal current can have different utilization categories/time-current behavior and cannot be substituted merely by matching amperes.', explainAloud: 'Why is replacing a blown fuse with any fuse of the same current rating not a complete selection method?',
  }),
  newTerm('basic-protection', 'Basic protection', ['basic protection','protection against direct contact'], 'Basic protection is protection against electric shock under fault-free/normal conditions, principally by preventing dangerous contact with live parts through the applicable protective measures.', 'It prevents a person from normally touching hazardous live conductors in the first place.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-protection'], relatedTermIds: ['fault-protection','additional-protection'], practicalExample: 'Insulation and suitable barriers/enclosures are examples of ways the live parts can be made inaccessible under normal conditions.', explainAloud: 'Distinguish basic protection from what must happen after a line conductor faults to exposed metal.',
  }),
  newTerm('fault-protection', 'Fault protection', ['fault protection','indirect contact protection'], 'Fault protection addresses electric-shock risk arising under fault conditions, for example when an exposed-conductive-part becomes live because basic insulation has failed.', 'It is the protective layer that deals with “something has gone wrong,” commonly involving earthing, protective conductors and automatic disconnection.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-protection'], relatedTermIds: ['basic-protection','additional-protection','ads'], practicalExample: 'ADS is a common fault-protection method for Class I equipment where fault current operates the protective device.', explainAloud: 'Why does a metal appliance case need a fault-protection strategy even though it is not a live part during normal operation?',
  }),
  newTerm('additional-protection', 'Additional protection', ['additional protection'], 'Additional protection is a supplementary protective measure provided in addition to basic/fault protection for specified circumstances; it is not a substitute for defective basic protection or fault protection.', 'It adds another safety layer, often using a suitably selected RCD where the applicable requirements call for it.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-protection'], relatedTermIds: ['basic-protection','fault-protection','rcd'], practicalExample: 'A 30 mA-class residual device may be used for additional protection in specified applications, but the circuit still needs sound insulation, CPC/earthing and overcurrent protection.', explainAloud: 'Why does the presence of an RCD not justify leaving a broken CPC or damaged basic insulation?',
  }),
  newTerm('earthing-conductor', 'Earthing conductor', ['earthing conductor','earth conductor'], 'The earthing conductor connects the installation main earthing terminal to the means of earthing provided by the supply arrangement or installation electrode, as applicable.', 'It links the installation protective system at the MET to its earthing means; it is not the same conductor as every final-circuit CPC.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-earthing-bonding'], lessonIds: ['p02-l04'], relatedTermIds: ['met','cpc','protective-bonding-conductor','earth-electrode'], practicalExample: 'In a TT arrangement, the earthing conductor connects the MET to the installation earth electrode.', explainAloud: 'Differentiate the earthing conductor from a CPC and a protective bonding conductor.',
  }),
  newTerm('protective-bonding-conductor', 'Protective bonding conductor', ['bonding conductor','protective bonding'], 'A protective bonding conductor connects specified extraneous-conductive-parts into the protective equipotential bonding arrangement to limit dangerous potential differences.', 'It bonds relevant incoming/foreign conductive paths to the installation protective system; it is not a substitute for the CPC of a circuit.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-earthing-bonding'], lessonIds: ['p02-l05'], relatedTermIds: ['glossary-bonding','extraneous-conductive-part','met','cpc'], practicalExample: 'Where required, a metallic service capable of introducing earth potential is bonded at the appropriate location with a conductor selected for that bonding function.', explainAloud: 'Why are bonding and circuit protective conductors both protective but not interchangeable?',
  }),
  newTerm('exposed-conductive-part', 'Exposed-conductive-part', ['exposed conductive part','exposed metal'], 'An exposed-conductive-part is a conductive part of electrical equipment that can be touched and is not normally live but can become live if basic insulation fails.', 'It belongs to the electrical equipment and becomes dangerous because of an electrical fault.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-earthing-bonding'], relatedTermIds: ['extraneous-conductive-part','cpc','ads'], practicalExample: 'The metal case of Class I equipment can be an exposed-conductive-part connected to a CPC.', explainAloud: 'What makes an exposed-conductive-part different from a water pipe entering the building?',
  }),
  newTerm('extraneous-conductive-part', 'Extraneous-conductive-part', ['extraneous conductive part','extraneous metal'], 'An extraneous-conductive-part is a conductive part not forming part of the electrical installation that can introduce a potential, commonly earth potential, into the location.', 'It comes from outside the electrical equipment/system but can bring a different potential within reach.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-earthing-bonding'], relatedTermIds: ['exposed-conductive-part','protective-bonding-conductor','glossary-bonding'], practicalExample: 'A metallic service pipe may be an extraneous-conductive-part if it can introduce earth potential; classification depends on the actual installation, not appearance alone.', explainAloud: 'Why is “it is metal” not enough to classify a part as extraneous-conductive?',
  }),
  newTerm('earth-electrode', 'Earth electrode', ['earth electrode','ground rod'], 'An earth electrode is a conductive part or group of conductive parts in effective electrical contact with the earth and used as part of an earthing arrangement.', 'It provides an intentional electrical connection to the general mass of earth; its resistance and parallel paths matter to the protective design.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-earthing-bonding'], lessonIds: ['p05-l08'], relatedTermIds: ['tt','earthing-conductor','met'], practicalExample: 'In a TT system, the installation electrode is central to the protective earthing path and residual-current protection commonly has an important role.', explainAloud: 'Why should an electrode resistance result be interpreted as part of the whole protective arrangement rather than as a target of “zero ohms”?',
  }),
  newTerm('it-earthing', 'IT earthing arrangement', ['it system','it earthing'], 'In an IT arrangement the source is isolated from earth or connected to earth through a deliberately high impedance, while exposed-conductive-parts are earthed individually or collectively according to the system design.', 'The first earth fault behaves differently from ordinary TN/TT assumptions, so monitoring and fault management are part of the design.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-earthing-bonding'], relatedTermIds: ['tn-s','tn-c-s','tt'], practicalExample: 'IT systems are specialist arrangements; a C2 learner should recognize the topology but not assume domestic TN/TT fault behavior applies.', explainAloud: 'What source-to-earth feature distinguishes an IT arrangement from TN and TT at a high level?',
  }),
  newTerm('rcd-types', 'RCD type / waveform classification', ['rcd type','type ac','type a','type f','type b rcd'], 'RCD type classification describes the residual-current waveform components the device is designed to detect and respond to. The required type must suit the connected equipment and current applicable requirements/manufacturer data.', 'Electronic equipment can create residual currents that are not simple sinusoidal AC, so “30 mA” alone is not a complete RCD specification.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-protection','osg-rcd-operation'], relatedTermIds: ['rcd','rccb','rcbo'], practicalExample: 'Before selecting an RCD for electronic loads, identify the residual-current waveform characteristics and any manufacturer requirement rather than defaulting to a familiar type.', explainAloud: 'Why can two RCDs with the same IΔn rating still have different suitability for a load?',
  }),
  newTerm('selectivity', 'Selectivity', ['selectivity','discrimination'], 'Selectivity is coordination intended so the protective device nearest the fault operates without unnecessary operation of upstream devices, over the verified current/time range of the device combination.', 'The smallest faulted part should disconnect where the verified coordination permits, instead of blacking out healthy upstream circuits.', 'Protection', {
    sourceIds: ['course-c2-protection'], lessonIds: ['p05-l14'], relatedTermIds: ['glossary-discrimination-selectivity','mcb','mccb','fuse'], practicalExample: 'A socket-circuit fault should not unnecessarily trip the floor/main device if the exact device combination is selectively coordinated at the available fault level.', explainAloud: 'Why can an ampere-rating ratio suggest selectivity but not prove it?',
  }),
  newTerm('transient-overvoltage', 'Transient overvoltage', ['surge','transient overvoltage'], 'A transient overvoltage is a short-duration voltage rise that can stress or damage equipment and may arise from switching, lightning-related effects or other network events.', 'It is a brief voltage spike/surge rather than sustained overload current.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-protection'], lessonIds: ['course-CNiLNvBLopI','p05-spd'], relatedTermIds: ['spd'], practicalExample: 'An SPD is selected and connected to limit transient voltage at the protected installation/equipment within its specified arrangement.', explainAloud: 'Distinguish a transient overvoltage from an overload current.',
  }),
  newTerm('afdd', 'Arc fault detection device (AFDD)', ['afdd','arc fault detection'], 'An AFDD is a protective device intended to detect specified arc-fault signatures and disconnect under its product-standard/application conditions; it does not replace the other required overcurrent, residual-current or fault-protection functions unless combined and rated for them.', 'It looks for dangerous arcing patterns that ordinary current-magnitude protection may not identify in the same way.', 'Protection', {
    sourceIds: ['course-c2-protection','osg-protection'], relatedTermIds: ['mcb','rcbo','spd'], practicalExample: 'AFDD application is a current-standards selection question; awareness of the function does not justify fitting one everywhere without checking the actual requirement/product arrangement.', explainAloud: 'What hazard does an AFDD target, and why does that not make it a replacement for an MCB/RCD/SPD?',
  }),
];

export const c205Formulas: OverviewFormula[] = [
  {
    id: 'earth-fault-loop', expression: 'Zs ≈ Ze + (R1 + R2)',
    assumptions: ['Simplified final-circuit relationship where the stated line and CPC contribution represents the internal loop path.', 'Values must be compared at compatible stated temperature/test/design conditions.', 'Compliance depends on the actual protective device and applicable disconnection requirement, not the equation alone.'],
    variables: [
      { symbol: 'Zs', meaning: 'total earth-fault-loop impedance at the point', unit: 'Ω', termId: 'zs' },
      { symbol: 'Ze', meaning: 'external earth-fault-loop impedance at the origin', unit: 'Ω', termId: 'ze' },
      { symbol: 'R1+R2', meaning: 'line plus circuit protective conductor contribution', unit: 'Ω', termId: 'r1-r2' },
    ], sourceIds: ['course-c2-protection','osg-zs-appendix'],
  },
  {
    id: 'earth-fault-current', expression: 'If ≈ U0 / Zs',
    assumptions: ['Simplified magnitude relationship for a line-to-earth fault using the relevant nominal line-to-earth voltage and loop impedance.', 'Actual fault current can be influenced by source impedance/reactance, voltage variation, fault impedance and the complete system model.', 'Use the result to understand protective-device operation; do not substitute it for required verified fault-current/loop testing or current standards data.'],
    variables: [
      { symbol: 'If', meaning: 'prospective earth-fault current in the simplified model', unit: 'A' },
      { symbol: 'U0', meaning: 'nominal line-to-earth voltage used by the stated model', unit: 'V' },
      { symbol: 'Zs', meaning: 'earth-fault-loop impedance', unit: 'Ω', termId: 'zs' },
    ], sourceIds: ['course-c2-protection','osg-protection'],
  },
];

export const c205Sections: OverviewSection[] = [{
  id: sectionId, stageId, moduleId, learningSectionIds: groups.map(section => section.id), title: 'Faults, Protective Devices, Earthing and ADS', status: 'reviewed', lessonIds,
  termIds: [
    'overload-current','short-circuit','earth-fault','fuse','mcb','mccb','glossary-breaking-capacity','pfc','pscc','pefc',
    'rcd','rccb','rcbo','rcd-types','basic-protection','fault-protection','additional-protection','ads',
    'cpc','earthing-conductor','protective-bonding-conductor','met','glossary-earthing','glossary-bonding','exposed-conductive-part','extraneous-conductive-part','earth-electrode',
    'tn-s','tn-c-s','tt','it-earthing','pen','zs','ze','r1-r2','selectivity','glossary-discrimination-selectivity','transient-overvoltage','spd','afdd',
  ],
  sourceIds: ['epra-c2-competencies','course-c2-protection','osg-protection','osg-earthing-bonding','osg-rcd-operation','osg-zs-appendix'],
  relatedSectionIds: ['c2-04-cable-systems-containment-installation-methods'], prerequisiteSectionIds: ['c2-04-cable-systems-containment-installation-methods'],
  coverage: [
    { competency: 'Identify overload, short-circuit and earth-fault conditions and select the relevant protective function.', referenceIds: ['epra-c2-competencies','course-c2-protection','osg-protection'], teachingPage: 'system-model' },
    { competency: 'Understand fuse, MCB, MCCB, RCD/RCCB/RCBO, SPD and other special protective-device functions, ratings and distinctions.', referenceIds: ['epra-c2-competencies','osg-protection'], teachingPage: 'definitions' },
    { competency: 'Explain domestic earthing, bonding, CPC/MET roles, TN-S/TN-C-S/TT/IT concepts and automatic disconnection of supply.', referenceIds: ['epra-c2-competencies','osg-earthing-bonding'], teachingPage: 'relationships' },
    { competency: 'Relate Ze, R1+R2 and Zs to earth-fault current and protective-device operation without treating a table value as a universal constant.', referenceIds: ['course-c2-protection','osg-zs-appendix'], teachingPage: 'engineering-rules' },
  ],
  pages: {
    'system-model': [
      { kind: 'flow', title: 'Classify the abnormal condition by current path', steps: ['Normal load path', 'Overload: normal path but excessive sustained current', 'Short circuit: unintended low-impedance path between live conductors', 'Earth fault: live conductor to exposed/protective/earth path', 'Identify which protective function detects/responds', 'Verify device rating, fault duty and required operating condition'], sourceIds: ['course-c2-protection','osg-protection'] },
      { kind: 'flow', title: 'ADS fault loop', steps: ['Line conductor', 'Fault to exposed-conductive-part', 'CPC / protective conductor', 'MET / earthing path', 'Source return path', 'Fault current established by loop impedance', 'Protective device operates', 'Dangerous touch condition is disconnected'], sourceIds: ['course-c2-protection','osg-earthing-bonding'] },
    ],
    definitions: [
      { kind: 'table', title: 'Protective devices answer different questions', columns: ['Device/function', 'Primary protective question', 'Do not assume'], rows: [
        ['Fuse', 'Will its element interrupt the specified overcurrent/fault safely?', 'Same current rating means same time/current or breaking duty'],
        ['MCB', 'Will its thermal/magnetic characteristic protect and interrupt the circuit duty?', 'Ampere rating alone selects it'],
        ['MCCB', 'Do frame, trip settings and fault ratings suit the feeder/duty?', 'Frame rating equals overload setting or breaking capacity'],
        ['RCCB', 'Will residual imbalance be detected/cleared as specified?', 'Integral overload/short-circuit protection'],
        ['RCBO', 'Are residual and overcurrent functions both suitable for the circuit?', 'One label removes the need to check fault duty/type/poles'],
        ['SPD', 'Will transient overvoltage be limited in the intended coordinated arrangement?', 'It replaces MCB/RCD/lightning or earthing design'],
        ['AFDD', 'Will specified arc-fault signatures be detected in the intended application?', 'It replaces every other protective function'],
      ], sourceIds: ['course-c2-protection','osg-protection'] },
    ],
    relationships: [
      { kind: 'table', title: 'Earthing and bonding conductor roles', columns: ['Concept', 'Role'], rows: [
        ['CPC', 'Links exposed-conductive-parts of a circuit into the protective fault-current path'],
        ['Earthing conductor', 'Connects MET to the means of earthing'],
        ['Protective bonding conductor', 'Connects relevant extraneous-conductive-parts into the protective equipotential arrangement'],
        ['MET', 'Main junction point for relevant protective/earthing/bonding conductors'],
        ['Exposed-conductive-part', 'Part of electrical equipment that may become live on insulation fault'],
        ['Extraneous-conductive-part', 'Non-installation conductive part capable of introducing a potential'],
      ], sourceIds: ['course-c2-protection','osg-earthing-bonding'] },
      { kind: 'table', title: 'Earthing-arrangement mental model', columns: ['Arrangement', 'High-level protective-path idea', 'Caution'], rows: [
        ['TN-S', 'Neutral and protective functions remain separate throughout the stated system', 'Confirm actual distributor arrangement rather than infer it from appearance'],
        ['TN-C-S', 'Combined PEN function upstream, separated into N and PE for the installation', 'Open-PEN/PME implications require current utility/standards treatment'],
        ['TT', 'Installation exposed parts connect to a local electrode independent of the source electrode', 'Electrode/loop conditions commonly make RCD coordination important'],
        ['IT', 'Source isolated from earth or earthed through high impedance; exposed parts earthed by the designed arrangement', 'Specialist fault monitoring/first-fault behavior; do not import TN/TT assumptions'],
      ], sourceIds: ['course-c2-protection','osg-earthing-bonding'] },
    ],
    'engineering-rules': [
      { kind: 'formula', formulaId: 'earth-fault-loop' },
      { kind: 'formula', formulaId: 'earth-fault-current' },
      { kind: 'flow', title: 'Protective-device selection logic', steps: ['Identify normal load current and cable capacity', 'Identify fault types the circuit must clear', 'Establish prospective fault current at the device point', 'Choose device function/type/rating/curve or settings', 'Verify breaking capacity / backup combination', 'Verify ADS/disconnection condition', 'Check residual protection and RCD type where required', 'Check selectivity/coordination where continuity matters', 'Check special protection such as SPD where applicable', 'Document manufacturer/standards evidence'], sourceIds: ['course-c2-protection','osg-protection'] },
      { kind: 'prose', title: 'Breaking capacity is not trip current', paragraphs: [
        'The current at which a protective device begins to operate and the maximum fault current it can safely interrupt are different specifications. Never infer short-circuit duty from the normal current rating or trip curve.',
        'Selectivity and backup/cascading are also different claims. A manufacturer-verified combination may safely interrupt a high fault without being selective through that same current range.',
      ], sourceIds: ['course-c2-protection','osg-protection'] },
    ],
    application: [
      { kind: 'flow', title: 'Read a protective-device label/specification before accepting it', steps: ['Device family/function', 'Rated voltage and poles', 'Rated current / frame / settings as applicable', 'Trip characteristic or residual rating/type', 'Short-circuit breaking duty', 'Any service/short-time withstand ratings', 'Manufacturer coordination/selectivity data', 'Environmental/assembly compatibility', 'Circuit/application requirement'], sourceIds: ['course-c2-protection'] },
      { kind: 'prose', title: 'RCD application starts with the current path', paragraphs: [
        'An RCD does not consume or “lose” current: it compares the currents passing through its sensing system. Residual current means part of the return path lies outside that sensed set of conductors.',
        'Neutral-to-earth faults, mixed/borrowed neutrals, standing equipment leakage and actual insulation faults can all affect residual operation. The RCD test button checks the device mechanism/test circuit; complete installation verification remains separate.',
      ], sourceIds: ['course-c2-protection','osg-rcd-operation'] },
    ],
    verification: [
      { kind: 'verification', title: 'Verify the protective arrangement as a system', purpose: 'Establish that the protective path and device evidence support the intended fault protection rather than proving only one isolated component.', safeState: 'Visual/dead tests are completed under safe isolation before controlled live measurements that genuinely require energization.', instrument: 'Inspection plus the appropriate low-resistance, loop/PFC and RCD functions taught in detail in C2-08; this stage focuses on what each result means.', method: ['Confirm the actual earthing arrangement and protective-conductor connections.', 'Verify CPC/bonding continuity under an appropriate dead-test method.', 'Establish or obtain Ze/source information and circuit R1+R2 evidence.', 'Relate Zs/fault-current evidence to the exact protective device and applicable disconnection condition.', 'Compare prospective fault current with verified device/assembly breaking duty.', 'Where residual protection is used, verify correct type/rating/connection and later perform the specified RCD tests.', 'Record assumptions and do not hide parallel paths or conflicting evidence.'], expected: 'Protective conductors are continuous, the fault path is credible, fault duty is within equipment capability and the selected protective device can meet the intended protective condition.', abnormal: 'High loop impedance, open/high-resistance CPC, unverified supply arrangement, PFC above device duty, wrong RCD type/neutral routing or conflicting measurements requires investigation.', nextAction: 'Do not compensate by arbitrarily increasing device rating or bypassing protection; correct the cause/design and repeat the relevant verification.', sourceIds: ['course-c2-protection','osg-earthing-bonding','osg-zs-appendix','osg-rcd-operation'] },
    ],
    'common-confusions': [
      { kind: 'table', title: 'Protection misconceptions that lose marks and create hazards', columns: ['Mistake', 'Correction'], rows: [
        ['“Overload and short circuit are the same.”', 'Both are overcurrent, but their current paths/causes and device response regions differ.'],
        ['“RCD means overcurrent protection.”', 'RCD detects residual imbalance; RCCB has no integral overcurrent protection, RCBO combines functions.'],
        ['“Earth absorbs the fault current.”', 'Fault current must complete a loop back to the source.'],
        ['“Bonding is the same as earthing/CPC.”', 'They are related protective functions with different conductor roles.'],
        ['“Low Zs is always enough.”', 'Zs must be coordinated with the exact device and required disconnection/protective condition.'],
        ['“Breaker ampere rating proves it can interrupt the fault.”', 'Breaking capacity must be compared with prospective fault current.'],
        ['“SPD protects against overload or earth leakage.”', 'SPD limits transient overvoltage; other protective functions remain required.'],
        ['“Selectivity follows from a 2:1 rating ratio.”', 'Use exact device curves/settings/manufacturer selectivity evidence and the available fault level.'],
      ], sourceIds: ['course-c2-protection'] },
    ],
    sources: [
      { kind: 'prose', title: 'Source hierarchy for C2-05', paragraphs: [
        'EPRA defines the C2 protective-device, earthing and special-protection competence. The course lessons explain current paths, device functions and fault loops. The current IET On-Site Guide is the technical baseline for protection, earthing/bonding, RCD operation and Zs interpretation where consistent with Kenyan requirements.',
        'Numeric disconnection limits, maximum Zs values, RCD application rules and device coordination are source-sensitive. This Overview teaches the engineering relationships but does not invent current Kenyan numerical tables. The OSG references remain bibliography-only until exact reader-page mappings are verified.',
      ], sourceIds: ['epra-c2-competencies','course-c2-protection','osg-protection','osg-earthing-bonding','osg-rcd-operation','osg-zs-appendix'] },
    ],
  },
}];
