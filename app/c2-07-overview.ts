import { learningSections } from './learning-sections';
import type { CanonicalTerm, OverviewFormula, OverviewSection } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

const stageId = 'C2-07';
const sectionId = 'c2-07-consumer-units-complete-installation';
const moduleId = 'c2-boards';
const groups = learningSections.filter(section => section.moduleId === moduleId);
const lessonIds = [...new Set(groups.flatMap(section => section.lessonIds))];

const reviewed = (lessons: string[], relatedTermIds: string[] = []): Partial<CanonicalTerm> => ({
  editorialStatus: 'reviewed', stageIds: [stageId], sectionIds: [sectionId], lessonIds: lessons, relatedTermIds,
});

export const c207TermPatches: Record<string, Partial<CanonicalTerm>> = {
  'consumer-unit': {
    ...reviewed(['p03-l12','p10-l02'], ['main-switch','busbar','neutral-bar','protective-conductor-bar','circuit-division','board-compatibility','glossary-circuit-schedule']),
    sourceIds: ['course-vocabulary','course-c2-architecture','course-c2-boards','osg-electrical-supply','osg-protection'],
    standardsMeaning: 'A consumer unit is a coordinated assembly that receives the installation supply and distributes it to final circuits through specified switching, protective, neutral and protective-conductor arrangements within the assembly manufacturer’s ratings and instructions.',
    plainMeaning: 'It is one protective system, not just a box containing breakers. Incomer, busbars, devices, neutral paths, protective conductors, enclosure, labels and terminals all have to work together.',
    practicalExample: 'Replacing a consumer unit requires assessment of supply, earthing, bonding, existing circuits, fault level, device arrangement and pre-existing defects; a new enclosure does not repair faults elsewhere.',
    explainAloud: 'Trace one final circuit from incoming supply through the consumer unit and name the function of each internal stage.',
  },
  'main-switch': {
    ...reviewed(['p03-l12','p10-l02'], ['consumer-unit','glossary-isolation','busbar']),
    sourceIds: ['course-vocabulary','course-c2-architecture','course-c2-boards','osg-isolation-switching'],
    practicalExample: 'The main switch controls the normal incoming supply to the board, but alternative supplies/backfeeds still have to be identified separately before isolation is claimed.',
    explainAloud: 'Why does opening the main switch not prove every part of a modern installation is dead?',
  },
  termination: {
    ...reviewed(['p03-l13','p03-l12'], ['torque-controlled-termination','board-compatibility','consumer-unit']),
    sourceIds: ['course-vocabulary','course-c2-wiring','course-c2-boards'],
    practicalExample: 'A board termination can look neat yet be defective if conductor preparation, terminal capacity, torque, copper capture or neutral/device correspondence is wrong.',
    explainAloud: 'What evidence besides appearance shows a board termination is acceptable?',
  },
  'glossary-circuit-schedule': {
    ...reviewed(['p03-l12','p10-l02'], ['consumer-unit','circuit-division','final-circuit']),
    sourceIds: ['course-vocabulary','course-c2-architecture','course-c2-boards','osg-identification-notices'],
    practicalExample: 'Way number, circuit purpose and protective-device information should agree between the board schedule, labels and installation records so isolation/testing does not rely on guesswork.',
  },
};

const newTerm = (id: string, term: string, aliases: string[], standardsMeaning: string, plainMeaning: string, category: string, options: Partial<PreservedCanonicalTerm> = {}): PreservedCanonicalTerm => ({
  id, term, aliases, definition: standardsMeaning, category, authority: 'explanatory-definition', editorialStatus: 'reviewed', standardsMeaning, plainMeaning,
  practicalExample: options.practicalExample, notTheSameAs: options.notTheSameAs ?? [], relatedTermIds: options.relatedTermIds ?? [], sourceIds: options.sourceIds ?? ['course-c2-boards'],
  formulaIds: options.formulaIds ?? [], stageIds: [stageId], sectionIds: [sectionId], lessonIds: options.lessonIds ?? [], kenyaStatus: options.kenyaStatus ?? 'check-kenyan-requirement',
  explainAloud: options.explainAloud, contrast: options.contrast, unit: options.unit, formula: options.formula, formulaTex: options.formulaTex, formulaNote: options.formulaNote,
});

export const c207AdditionalTerms: PreservedCanonicalTerm[] = [
  newTerm('busbar', 'Busbar', ['busbar','comb busbar'], 'A busbar is a conductive distribution component used within an assembly to carry and distribute current to connected devices/ways within its specified current, fault and assembly ratings.', 'It is the common conductor feeding multiple devices inside the board. Its rating and compatibility belong to the complete assembly, not just its physical size.', 'Installation', {
    lessonIds: ['p03-l12'], relatedTermIds: ['consumer-unit','main-switch','board-compatibility'], practicalExample: 'A replacement protective device must physically and electrically match the busbar/assembly system rather than merely fitting the enclosure opening.', explainAloud: 'Why is a breaker that clips onto the rail not automatically compatible with the installed busbar?',
  }),
  newTerm('neutral-bar', 'Neutral bar', ['neutral bar','neutral terminal bar'], 'A neutral bar is the assembly terminal arrangement used for neutral conductors according to the consumer-unit/distribution-board architecture and the protective-device scheme.', 'It organizes neutral paths, but the exact neutral must correspond to the correct circuit and residual-protection boundary.', 'Installation', {
    lessonIds: ['p03-l12','p10-l02'], relatedTermIds: ['consumer-unit','rcd','rcbo','protective-conductor-bar'], practicalExample: 'A borrowed or misplaced neutral can cause residual-current devices to operate incorrectly even when line conductors are assigned to the intended ways.', explainAloud: 'Why can moving only a neutral conductor between bars change RCD/RCBO operation?',
  }),
  newTerm('protective-conductor-bar', 'Protective-conductor / earth bar', ['earth bar','protective conductor bar','cpc bar'], 'The protective-conductor bar is the assembly termination point for circuit protective conductors and related protective conductors according to the board design and installation earthing arrangement.', 'It brings protective conductors to the board/MET arrangement; it must not be confused with a neutral bar.', 'Protection', {
    lessonIds: ['p03-l12'], relatedTermIds: ['consumer-unit','cpc','met','neutral-bar'], practicalExample: 'Every outgoing Class I circuit needs its protective conductor correctly identified and terminated to preserve the intended fault path.', explainAloud: 'Why are neutral and protective-conductor bars functionally different even if both are metal terminal strips?',
  }),
  newTerm('meter-tails', 'Meter tails / incoming installation conductors', ['meter tails','tails'], 'Meter tails are the conductors forming part of the connection between metering/supply-side equipment and the installation main switching/distribution equipment, with route, length, fault protection and ownership/interface requirements determined by the actual supply arrangement.', 'These short-looking conductors can carry the whole installation current and be exposed to high prospective fault energy, so their route and protection are critical.', 'Installation', {
    lessonIds: ['p02-l10'], relatedTermIds: ['service-cut-out','electricity-meter','switch-fuse','main-switch'], practicalExample: 'A long or unusually routed tail arrangement may require additional upstream protection depending on utility/local rules and the installation design; a remembered distance is not a universal rule.', explainAloud: 'Why do meter tails need separate thought even though they may be physically short?',
  }),
  newTerm('switch-fuse', 'Switch-fuse', ['switch fuse','switch-fuse'], 'A switch-fuse combines a switching/isolating function with fuse-based overcurrent protection within the ratings and duties of the selected assembly.', 'It can provide a controlled switching point and upstream protection for a feeder/tail arrangement when the design requires it.', 'Protection', {
    lessonIds: ['p02-l10'], relatedTermIds: ['meter-tails','fuse','glossary-isolation','selectivity'], practicalExample: 'A switch-fuse used ahead of a long feeder must coordinate with the feeder capacity, prospective fault current and downstream protection.', explainAloud: 'Which two separate functions are combined in a switch-fuse?',
  }),
  newTerm('torque-controlled-termination', 'Torque-controlled termination', ['terminal torque','torque screwdriver','specified torque'], 'A torque-controlled termination is tightened using the equipment manufacturer’s specified method/value with a suitable tool so the clamping condition is reproducible without relying on feel alone.', 'Correct torque supports reliable contact pressure, but it does not cure wrong conductor preparation, wrong terminal capacity or incompatible equipment.', 'Installation', {
    lessonIds: ['p03-l13','p03-l12'], relatedTermIds: ['termination','board-compatibility'], practicalExample: 'A torque screwdriver can click at the set value while the conductor is still wrongly stripped or only partly captured, so visual/mechanical inspection remains necessary.', explainAloud: 'What does a torque click prove, and what does it not prove?',
  }),
  newTerm('circuit-division', 'Division of installation into circuits', ['circuit division','division of installation'], 'Circuit division is the deliberate separation of an installation into final circuits/groups so protection, isolation, fault impact, maintenance and user needs are managed in a controlled way.', 'Do not put every load behind one point of failure. Circuit grouping should make faults and maintenance manageable while preserving required protection.', 'Design', {
    lessonIds: ['p03-l12','p10-l02'], relatedTermIds: ['consumer-unit','final-circuit','selectivity','glossary-circuit-schedule'], practicalExample: 'Separating lighting and socket circuits can reduce the consequences of one final-circuit fault, but the exact arrangement must suit the installation.', explainAloud: 'Why is circuit division a safety/continuity decision rather than only a convenience?',
  }),
  newTerm('board-compatibility', 'Assembly and device compatibility', ['device compatibility','consumer unit compatibility','board compatibility'], 'Assembly/device compatibility means the protective devices, busbars, enclosures, terminals and accessories are used in combinations verified by the assembly/product manufacturer and applicable standards for their stated ratings.', 'A device being the same width or fitting the DIN rail is not proof it is approved for that board system.', 'Protection', {
    lessonIds: ['p03-l12','p10-l02'], relatedTermIds: ['consumer-unit','busbar','mcb','rcbo','rccb','glossary-breaking-capacity'], practicalExample: 'Mixing device families can invalidate thermal/fault-performance assumptions even when the front dimensions appear identical.', explainAloud: 'Why is physical fit weaker evidence than verified assembly compatibility?',
  }),
  newTerm('split-load-arrangement', 'Split-load / grouped RCD arrangement', ['split load consumer unit','split-load board','grouped rcd'], 'A split-load arrangement groups multiple circuits behind shared residual-current devices; it is one distribution architecture whose suitability depends on current requirements, circuit division, fault consequences and product configuration.', 'One RCD fault can remove several circuits in the same group, so newer designs may prefer individual RCBO protection where appropriate; the historical arrangement remains useful to understand.', 'Protection', {
    lessonIds: ['p03-l12','p10-l02'], relatedTermIds: ['consumer-unit','rccb','rcbo','circuit-division'], practicalExample: 'A leakage fault on one circuit in a grouped-RCD section can disconnect healthy circuits sharing that RCCB.', explainAloud: 'What continuity disadvantage can a grouped RCD arrangement have compared with individual RCBOs?',
  }),
];

export const c207Formulas: OverviewFormula[] = [];

export const c207Sections: OverviewSection[] = [{
  id: sectionId, stageId, moduleId, learningSectionIds: groups.map(section => section.id), title: 'Consumer Units and Complete Single-Phase Installation', status: 'reviewed', lessonIds,
  termIds: ['service-cut-out','electricity-meter','meter-tails','switch-fuse','main-switch','consumer-unit','busbar','neutral-bar','protective-conductor-bar','circuit-division','board-compatibility','split-load-arrangement','mcb','rccb','rcbo','spd','glossary-breaking-capacity','pfc','selectivity','termination','torque-controlled-termination','cpc','met','glossary-circuit-schedule','final-circuit','glossary-isolation'],
  sourceIds: ['epra-c2-competencies','course-c2-boards','course-c2-design','course-c2-protection','osg-electrical-supply','osg-isolation-switching','osg-protection','osg-identification-notices','osg-final-circuits'],
  relatedSectionIds: ['c2-06-single-phase-circuit-design'], prerequisiteSectionIds: ['c2-06-single-phase-circuit-design'],
  coverage: [
    { competency: 'Trace and explain a complete single-phase installation from supply/service equipment through the consumer unit to final circuits and loads.', referenceIds: ['epra-c2-competencies','course-c2-boards'], teachingPage: 'system-model' },
    { competency: 'Identify the functions and limitations of main switch, busbars, neutral/protective bars, MCB/RCCB/RCBO/SPD arrangements and circuit schedules.', referenceIds: ['epra-c2-competencies','osg-protection'], teachingPage: 'definitions' },
    { competency: 'Apply board assembly compatibility, breaking capacity, earthing, termination torque, labels and circuit-division principles.', referenceIds: ['course-c2-boards','osg-protection','osg-identification-notices'], teachingPage: 'engineering-rules' },
    { competency: 'Integrate load, cable, protection, isolation and final-point Zs considerations into a complete single-phase installation case.', referenceIds: ['course-c2-boards','course-c2-design','course-c2-protection'], teachingPage: 'application' },
  ],
  pages: {
    'system-model': [
      { kind: 'flow', title: 'Supply-to-load architecture', steps: ['Distributor/service arrangement', 'Service protective device / cut-out', 'Metering', 'Meter tails / incoming conductors', 'Main switch or switch-fuse as designed', 'Consumer unit enclosure and busbars', 'Outgoing protective devices', 'Neutral and protective-conductor terminations', 'Final circuits', 'Local isolation/connection where required', 'Loads'], sourceIds: ['course-c2-boards','osg-electrical-supply'] },
      { kind: 'flow', title: 'Board design is the meeting point of earlier C2 stages', steps: ['C2-01 load/current fundamentals', 'C2-03 final-circuit topology/accessories', 'C2-04 cable/containment', 'C2-05 protective functions/earthing', 'C2-06 design calculations', 'C2-07 coordinated board and complete installation'], sourceIds: ['course-c2-boards'] },
    ],
    definitions: [
      { kind: 'table', title: 'Inside the consumer unit', columns: ['Part','Primary function','Do not confuse with'], rows: [
        ['Main switch','Installation-level switching/isolation function within its rating','Automatic overcurrent protection unless specifically combined'],
        ['Busbar','Distributes supply to compatible outgoing devices','A generic interchangeable rail'],
        ['MCB','Overcurrent protection','Residual-current protection'],
        ['RCCB','Residual-current protection for its group','Integral overcurrent protection'],
        ['RCBO','Combined residual-current and overcurrent functions','Proof that every other design check is satisfied'],
        ['Neutral bar/path','Returns normal circuit current according to board architecture','Protective-conductor bar'],
        ['Protective-conductor bar','Connects CPCs into protective arrangement','Normal-load neutral path'],
        ['Circuit schedule','Identifies what each way supplies/protects','A substitute for testing labels against reality'],
      ], sourceIds: ['course-c2-boards','osg-protection'] },
    ],
    relationships: [
      { kind: 'table', title: 'Protection boundaries must be explicit', columns: ['Question','Evidence to establish'], rows: [
        ['What does this device protect?','Trace line/neutral/protective paths and board architecture'],
        ['What fault can it interrupt?','Prospective fault current versus device/assembly breaking duty'],
        ['Which circuits share residual protection?','RCCB/RCBO neutral and line paths'],
        ['What remains energized after switching?','All normal and alternative sources / isolation boundaries'],
        ['What happens after one fault?','Circuit division and verified selectivity/coordination'],
      ], sourceIds: ['course-c2-boards','course-c2-protection'] },
    ],
    'engineering-rules': [
      { kind: 'flow', title: 'Consumer-unit acceptance logic', steps: ['Confirm supply/earthing/PFC', 'Confirm maximum demand and board rating', 'Confirm main switching duty', 'Confirm circuit division', 'Confirm device functions/ratings/curves/RCD types', 'Confirm assembly/device/busbar compatibility', 'Confirm breaking duty and coordination', 'Confirm neutral/CPC architecture', 'Confirm conductor preparation and manufacturer torque', 'Confirm labels/schedule/notices', 'Inspect/test before energization and handover'], sourceIds: ['course-c2-boards','osg-protection','osg-identification-notices'] },
      { kind: 'prose', title: 'Meter tails and switch-fuse arrangements', paragraphs: ['Do not turn a familiar distance guideline into a universal rule. Tail/feeder protection depends on distributor requirements, route, conductor construction, fault energy, enclosure and the exact supply interface.', 'Where a switch-fuse is used, both its switching function and fuse protection must coordinate with upstream supply equipment, the protected conductor and downstream devices.'], sourceIds: ['course-c2-boards','osg-electrical-supply'] },
    ],
    application: [
      { kind: 'flow', title: 'Complete single-phase installation case', steps: ['Survey supply and earthing before altering the board', 'Record pre-existing circuit defects/limitations', 'Confirm design load and circuit schedule', 'Confirm cable/protection checks from C2-06', 'Select compatible board/device architecture', 'Plan neutral and CPC terminations', 'Install/terminate to manufacturer instructions and torque', 'Label every circuit and protective boundary', 'Complete inspection/testing sequence', 'Handover records and unresolved limitations'], sourceIds: ['course-c2-boards'] },
      { kind: 'prose', title: 'Cooker/large-load example', paragraphs: ['For a fixed high-load circuit, treat assessed demand, protective device, cable capacity, local switching/isolation, termination ratings and appliance instructions as one design. Final-point Zs or other ADS evidence confirms fault protection; it does not replace the earlier load/cable checks.'], sourceIds: ['course-c2-boards','course-c2-design','course-c2-protection'] },
    ],
    verification: [
      { kind: 'verification', title: 'Pre-energization board review', purpose: 'Establish that the distribution assembly matches the design and can be safely taken into the formal C2-08 verification sequence.', safeState: 'Board isolated, secured and proven dead for visual/termination checks; live measurements are reserved for the controlled test sequence.', instrument: 'Design/schedule, manufacturer data, torque tool where specified, visual inspection and the test instruments used in C2-08.', method: ['Compare installed devices with the design schedule.', 'Verify assembly compatibility and busbar engagement.', 'Verify line/neutral/CPC correspondence for every circuit.', 'Inspect conductor preparation, copper capture and terminal torque records.', 'Confirm labels, notices and main switching identification.', 'Confirm earthing/bonding connections at the board.', 'Confirm no pre-existing defect was hidden by the board change.', 'Proceed to formal dead/live tests only after inspection is satisfactory.'], expected: 'Installed board is traceable to the design, mechanically/electrically coherent and ready for verification.', abnormal: 'Mixed incompatible devices, borrowed/misplaced neutrals, missing CPC, damaged conductors, unverified torque, wrong labels or insufficient fault duty require correction before energization.', nextAction: 'Correct the assembly/design defect, update documentation and repeat affected inspection/tests.', sourceIds: ['course-c2-boards','osg-protection','osg-identification-notices'] },
    ],
    'common-confusions': [
      { kind: 'table', title: 'Board misconceptions', columns: ['Mistake','Correction'], rows: [
        ['“Any breaker that fits the DIN rail is compatible.”','Use the exact assembly/manufacturer compatibility evidence.'],
        ['“RCCB protects against overload.”','RCCB provides residual-current protection; separate overcurrent protection is still required.'],
        ['“Neutrals can share any neutral bar.”','Neutral routing must match the circuit and residual-protection architecture.'],
        ['“Torque fixes every termination problem.”','Torque only controls tightening; preparation/capture/capacity still require inspection.'],
        ['“New consumer unit makes old circuits safe.”','Pre-existing defects must be identified and corrected/recorded; the new board cannot repair them.'],
        ['“Split-load is the modern default.”','Understand it historically; current design should choose the architecture that meets present requirements and fault/continuity needs.'],
      ], sourceIds: ['course-c2-boards'] },
    ],
    sources: [
      { kind: 'prose', title: 'Source discipline for C2-07', paragraphs: ['EPRA requires competent application of protective devices, earthing and complete single-phase installation work. The current IET On-Site Guide supply, protection, switching, identification and final-circuit sections provide the technical baseline where consistent with Kenyan requirements.', 'Board assembly is manufacturer-dependent. Device interchangeability, torque, busbar compatibility and fault ratings must come from the exact assembly/product data rather than from photographs or generic dimensions.'], sourceIds: ['epra-c2-competencies','course-c2-boards','osg-electrical-supply','osg-protection','osg-isolation-switching','osg-identification-notices'] },
    ],
  },
}];
