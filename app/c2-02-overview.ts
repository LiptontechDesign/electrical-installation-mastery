import { learningSections } from './learning-sections';
import type { CanonicalTerm, OverviewFormula, OverviewSection } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

const stageId = 'C2-02';
const sectionId = 'c2-02-installation-architecture-drawings-safety';
const moduleId = 'module-02';
const groups = learningSections.filter(section => section.moduleId === moduleId);
const lessonIds = [...new Set(groups.flatMap(section => section.lessonIds))];

const reviewed = (lessonIds: string[], relatedTermIds: string[] = []): Partial<CanonicalTerm> => ({
  editorialStatus: 'reviewed',
  stageIds: [stageId],
  sectionIds: [sectionId],
  lessonIds,
  relatedTermIds,
});

export const c202TermPatches: Record<string, Partial<CanonicalTerm>> = {
  'consumer-unit': {
    ...reviewed(['p02-l02'], ['main-switch', 'final-circuit', 'service-cut-out', 'electricity-meter']),
    sourceIds: ['course-vocabulary', 'course-c2-architecture', 'osg-electrical-supply'],
    practicalExample: 'On a small installation, the consumer unit receives the installation supply and divides it into identified final circuits through the intended switching and protective devices.',
    explainAloud: 'Trace one final circuit from the incoming supply through the consumer unit to the load, naming the function of every stage.',
  },
  'safe-isolation': {
    ...reviewed(['p03-l14'], ['glossary-isolation', 'lock-off', 'voltage-indicator', 'functional-switching']),
    sourceIds: ['course-vocabulary', 'course-c2-architecture', 'osg-safe-working'],
    practicalExample: 'Before conductors are touched, the correct source is identified, isolated and secured, the voltage indicator is proved, all relevant conductors are checked, and the indicator is re-proved.',
    notTheSameAs: [{ termId: 'functional-switching', distinction: 'Functional switching controls normal operation. Safe isolation establishes and verifies a controlled de-energized condition for work.' }],
    explainAloud: 'Explain why “the switch is off” is not enough evidence that a circuit is safe to work on.',
  },
  'concealed-services': {
    ...reviewed(['p16-l04', 'p16-l05'], ['cable-detector', 'cat-and-genny']),
    sourceIds: ['course-vocabulary', 'course-c2-architecture'],
    practicalExample: 'Before drilling or chasing, drawings and expected routes are reviewed, the area is scanned from more than one direction and conflicting indications are escalated rather than ignored.',
    explainAloud: 'Why can a clear detector display still fail to prove that a wall or ground route contains no service?',
  },
  'glossary-isolation': {
    ...reviewed(['p03-l14'], ['safe-isolation', 'functional-switching', 'emergency-switching', 'switching-for-mechanical-maintenance']),
    sourceIds: ['course-vocabulary', 'course-c2-architecture', 'osg-isolation-switching'],
    standardsMeaning: 'Isolation is the function intended to cut off, for reasons of safety, the supply from all or a discrete section of an installation by separating it from every relevant source of electrical energy.',
    plainMeaning: 'Isolation creates a defined electrical separation so work can proceed under a safe system. It is a purpose, not merely the position of a control switch.',
    practicalExample: 'Opening and securing the correct isolating device is one part of a safe-isolation procedure; proving absence of voltage is separate evidence.',
    explainAloud: 'Distinguish isolation from normal on/off control and from emergency switching.',
  },
  'glossary-single-line-diagram-sld': {
    ...reviewed(['p07-l13', 'p07-l14'], ['riser-diagram', 'block-diagram', 'glossary-circuit-schedule']),
    sourceIds: ['course-vocabulary', 'course-c2-architecture'],
    practicalExample: 'A single-line diagram can show source, meter, main switch, distribution board, feeders and protective devices without drawing every individual conductor.',
    explainAloud: 'What information belongs on a single-line diagram that would let another technician trace the power path and identify protection?',
  },
  'glossary-circuit-schedule': {
    ...reviewed(['p07-l15'], ['glossary-single-line-diagram-sld', 'consumer-unit', 'final-circuit']),
    sourceIds: ['course-vocabulary', 'course-c2-architecture'],
    practicalExample: 'A board schedule identifies the way number, circuit purpose and associated protective device so the physical board and drawings agree.',
    explainAloud: 'Why can a technically correct drawing still be unsafe to use if its circuit identifiers do not match the board labels?',
  },
};

const newTerm = (
  id: string,
  term: string,
  aliases: string[],
  standardsMeaning: string,
  plainMeaning: string,
  category: string,
  options: Partial<PreservedCanonicalTerm> = {},
): PreservedCanonicalTerm => ({
  id,
  term,
  aliases,
  definition: standardsMeaning,
  category,
  authority: 'explanatory-definition',
  editorialStatus: 'reviewed',
  standardsMeaning,
  plainMeaning,
  practicalExample: options.practicalExample,
  notTheSameAs: options.notTheSameAs ?? [],
  relatedTermIds: options.relatedTermIds ?? [],
  sourceIds: options.sourceIds ?? ['course-c2-architecture'],
  formulaIds: [],
  stageIds: [stageId],
  sectionIds: [sectionId],
  lessonIds: options.lessonIds ?? [],
  kenyaStatus: options.kenyaStatus ?? 'check-kenyan-requirement',
  explainAloud: options.explainAloud,
  contrast: options.contrast,
  unit: options.unit,
  formula: options.formula,
  formulaTex: options.formulaTex,
  formulaNote: options.formulaNote,
});

export const c202AdditionalTerms: PreservedCanonicalTerm[] = [
  newTerm('service-cut-out', 'Service cut-out / service protective device', ['service cutout', 'service fuse', 'cut-out'], 'The service protective device is part of the supply-side arrangement that provides protection at or near the service entry; its ownership and exact arrangement depend on the distributor and installation.', 'It is the upstream protective boundary before the customer installation distribution equipment. Do not assume permission to open or alter distributor-owned equipment.', 'Installation', {
    sourceIds: ['course-c2-architecture', 'osg-electrical-supply'], lessonIds: ['p02-l02'], relatedTermIds: ['electricity-meter', 'main-switch', 'consumer-unit'],
    practicalExample: 'On a typical supply path, service protection is encountered before the meter and installation distribution equipment.', explainAloud: 'Where does service protection sit in the supply-to-load chain, and why must ownership boundaries be respected?',
  }),
  newTerm('electricity-meter', 'Electricity meter', ['meter', 'energy meter', 'kwh meter'], 'An electricity meter measures electrical energy or other specified quantities for metering and billing/monitoring according to the supply arrangement.', 'It records how much electrical energy passes through the metered supply boundary; it is not the circuit protective device for final circuits.', 'Installation', {
    sourceIds: ['course-c2-architecture', 'osg-electrical-supply'], lessonIds: ['p02-l02'], relatedTermIds: ['service-cut-out', 'main-switch', 'consumer-unit'],
    practicalExample: 'The meter sits between supply-side equipment and the installation switching/distribution arrangement in a common domestic topology.', explainAloud: 'Why is the meter not a substitute for a main isolating or protective device?',
  }),
  newTerm('main-switch', 'Main switch', ['main switch', 'main isolator'], 'The main switch is the principal installation switching device used to control the supply to the installation or distribution assembly within its specified function and ratings.', 'It provides a deliberate installation-level switching point. Whether it alone provides every isolation requirement depends on its design and the actual sources present.', 'Installation', {
    sourceIds: ['course-c2-architecture', 'osg-isolation-switching'], lessonIds: ['p02-l02'], relatedTermIds: ['glossary-isolation', 'consumer-unit', 'functional-switching'],
    practicalExample: 'The main switch can disconnect the normal incoming supply to a consumer unit, but alternative or backfeed sources must still be identified separately.', explainAloud: 'Why can a main switch be open while another source still makes part of an installation live?',
  }),
  newTerm('final-circuit', 'Final circuit', ['final circuit'], 'A final circuit supplies current-using equipment directly, or socket-outlets/connection points intended to supply such equipment, rather than feeding another distribution board as a sub-main.', 'It is the last distribution circuit before the actual loads or outlets it serves.', 'Installation', {
    sourceIds: ['course-c2-architecture'], lessonIds: ['p02-l02'], relatedTermIds: ['consumer-unit', 'glossary-circuit-schedule'],
    practicalExample: 'A lighting circuit leaving a consumer unit to supply luminaires is a final circuit.', explainAloud: 'Distinguish a final circuit from a feeder that supplies another distribution board.',
  }),
  newTerm('riser-diagram', 'Riser diagram', ['riser', 'riser diagram'], 'A riser diagram represents how electrical distribution or services pass vertically through floors or zones of a building.', 'It is the building-height view: useful for seeing how boards and feeders connect between levels.', 'Documentation', {
    sourceIds: ['course-c2-architecture'], lessonIds: ['p07-l14'], relatedTermIds: ['glossary-single-line-diagram-sld', 'block-diagram'],
    practicalExample: 'A two-storey building riser can show the origin, ground-floor board, upper-floor board and the feeder between them.', explainAloud: 'When is a riser diagram more useful than a single-line diagram?',
  }),
  newTerm('block-diagram', 'Block diagram', ['block diagram'], 'A block diagram shows functional relationships between major parts of a system while intentionally omitting detailed wiring or conductor-level information.', 'It explains what connects functionally without pretending to be an installation wiring diagram.', 'Documentation', {
    sourceIds: ['course-c2-architecture'], lessonIds: ['p07-l14'], relatedTermIds: ['glossary-single-line-diagram-sld', 'riser-diagram'],
    practicalExample: 'A block diagram may show supply, control, load and monitoring blocks to explain system function before detailed wiring is considered.', explainAloud: 'What useful information does a block diagram omit on purpose?',
  }),
  newTerm('functional-switching', 'Functional switching', ['functional switching', 'normal switching'], 'Functional switching is switching intended for the normal operation or control of electrical equipment or a process.', 'It turns equipment on or off for normal use. It does not by itself establish a safe condition for electrical work.', 'Safety', {
    sourceIds: ['course-c2-architecture', 'osg-isolation-switching'], lessonIds: ['p11-v2-l02', 'p03-l14'], relatedTermIds: ['glossary-isolation', 'emergency-switching', 'switching-for-mechanical-maintenance'],
    notTheSameAs: [{ termId: 'glossary-isolation', distinction: 'Functional switching controls operation; isolation separates from electrical energy for safety.' }],
    practicalExample: 'A wall light switch is a functional control. Its OFF position must not be treated as proof of safe isolation.', explainAloud: 'Give one example of functional switching and explain why it is not proof of deadness.',
  }),
  newTerm('emergency-switching', 'Emergency switching', ['emergency switching', 'emergency stop'], 'Emergency switching is intended to remove or control electrical energy rapidly where an unexpected danger needs to be stopped or reduced.', 'It is the rapid-danger function. Its purpose is different from routine control and from planned isolation for maintenance.', 'Safety', {
    sourceIds: ['course-c2-architecture', 'osg-isolation-switching'], lessonIds: ['p11-v2-l02'], relatedTermIds: ['glossary-isolation', 'functional-switching', 'switching-for-mechanical-maintenance'],
    practicalExample: 'An emergency stop may remove hazardous machine motion, but the equipment still requires the proper isolation procedure before maintenance.', explainAloud: 'Why can an emergency stop be effective for danger reduction yet still be insufficient for maintenance isolation?',
  }),
  newTerm('switching-for-mechanical-maintenance', 'Switching for mechanical maintenance', ['maintenance switching', 'mechanical maintenance switching'], 'Switching for mechanical maintenance is intended to prevent or stop electrically powered mechanical movement while non-electrical maintenance is carried out on the equipment.', 'It prevents unexpected movement during mechanical work. It is a distinct switching purpose and should not be confused automatically with electrical isolation.', 'Safety', {
    sourceIds: ['course-c2-architecture', 'osg-isolation-switching'], lessonIds: ['p11-v2-l02'], relatedTermIds: ['glossary-isolation', 'functional-switching', 'emergency-switching'],
    practicalExample: 'A fan may need a maintenance switching arrangement to prevent unexpected rotation while mechanical work is performed.', explainAloud: 'How does switching for mechanical maintenance differ in purpose from electrical isolation?',
  }),
  newTerm('lock-off', 'Lock-off / securing against reconnection', ['lock off', 'lockout', 'lock-off'], 'Lock-off is the securing of an isolating device against inadvertent or unauthorized reconnection as part of a controlled safe-isolation process.', 'After identifying and isolating the correct device, it is physically secured so another person cannot simply restore the supply.', 'Safety', {
    sourceIds: ['course-c2-architecture', 'osg-safe-working'], lessonIds: ['p03-l14'], relatedTermIds: ['safe-isolation', 'voltage-indicator'],
    practicalExample: 'A personal lock and warning tag can secure the identified isolating device while work proceeds under the site procedure.', explainAloud: 'Why does locking the device not remove the need to prove absence of voltage?',
  }),
  newTerm('voltage-indicator', 'Two-pole voltage indicator', ['voltage indicator', 'two pole tester', 'two-pole tester'], 'A suitable two-pole voltage indicator is used to establish the presence or absence of voltage between selected conductors as part of the approved safe-isolation method, with proving checks before and after use.', 'It is the instrument used to answer “is hazardous voltage present between these points?” during isolation verification. It must itself be proven to work.', 'Testing', {
    sourceIds: ['course-c2-architecture', 'osg-safe-working'], lessonIds: ['p03-l14'], relatedTermIds: ['safe-isolation', 'lock-off'],
    practicalExample: 'The indicator is proved on a known source/proving unit, used on all relevant conductor combinations, then re-proved to confirm it remained functional.', explainAloud: 'Why is the voltage indicator proved both before and after the dead test?',
  }),
  newTerm('cpr', 'Cardiopulmonary resuscitation (CPR)', ['cpr', 'cardiopulmonary resuscitation'], 'CPR is the emergency combination of chest compressions and, where appropriate, rescue breaths used for a person who is unresponsive and not breathing normally after the scene is safe.', 'After electrical danger is controlled, an unresponsive person who is not breathing normally needs emergency help and immediate resuscitation according to current first-aid guidance.', 'Safety', {
    sourceIds: ['course-c2-architecture', 'st-john-cpr'], lessonIds: ['course-TsJ49Np3HS0'], relatedTermIds: ['aed'],
    practicalExample: 'Current St John guidance for adults teaches compressions about 5–6 cm deep at 100–120 per minute, with 30:2 if trained and able to give breaths.', explainAloud: 'State the sequence from an electrically unsafe scene to starting adult CPR without skipping the scene-safety step.',
  }),
  newTerm('aed', 'Automated external defibrillator (AED)', ['aed', 'defibrillator'], 'An AED analyses the casualty’s heart rhythm and gives prompts; it advises or delivers a shock only when the detected rhythm meets its shock criteria.', 'The AED guides the rescuer. It does not shock every collapsed person, and a no-shock instruction does not mean the emergency is over.', 'Safety', {
    sourceIds: ['course-c2-architecture', 'st-john-aed'], lessonIds: ['course-UFvL7wTFzl0'], relatedTermIds: ['cpr'],
    practicalExample: 'CPR continues while another rescuer prepares the AED until the device asks everyone to stand clear for analysis or shock.', explainAloud: 'Why should CPR normally resume after a “no shock advised” instruction when the casualty remains unresponsive and is not breathing normally?',
  }),
  newTerm('cable-detector', 'Pipe and cable detector', ['pipe and cable detector', 'wall scanner', 'cable detector'], 'A pipe and cable detector is an aid for locating concealed materials/services, but its response depends on mode, depth, material, loading, calibration and construction conditions.', 'It reduces uncertainty before drilling or chasing; it cannot certify that a clear-looking area contains no service.', 'Installation', {
    sourceIds: ['course-c2-architecture'], lessonIds: ['p16-l04'], relatedTermIds: ['concealed-services', 'cat-and-genny'],
    practicalExample: 'A wall is scanned from multiple directions after reviewing expected service zones and drawings, and conflicting indications trigger further investigation.', explainAloud: 'Name three reasons a detector can miss a real cable and state what you do when the result is uncertain.',
  }),
  newTerm('cat-and-genny', 'Cable avoidance tool and signal generator (CAT & Genny)', ['cat and genny', 'cable avoidance tool', 'signal generator'], 'A cable avoidance tool can detect certain buried services; applying a known signal with a compatible generator can improve tracing, subject to coupling, return-path, depth and service-material limitations.', 'Passive scanning is only the first sweep. Applying and tracing a controlled signal can improve confidence, but it still does not prove every underground service has been found.', 'Installation', {
    sourceIds: ['course-c2-architecture'], lessonIds: ['p16-l05'], relatedTermIds: ['concealed-services', 'cable-detector'],
    practicalExample: 'Before excavation or driving an earth electrode, the area is swept systematically, known signals are traced where possible, routes are marked and uncertain crossings are escalated.', explainAloud: 'Why can induction place a tracing signal onto the wrong buried service?',
  }),
];

export const c202Formulas: OverviewFormula[] = [];

export const c202Sections: OverviewSection[] = [{
  id: sectionId,
  stageId,
  moduleId,
  learningSectionIds: groups.map(section => section.id),
  title: 'Installation Architecture, Drawings and Safety',
  status: 'reviewed',
  lessonIds,
  termIds: [
    'service-cut-out', 'electricity-meter', 'main-switch', 'consumer-unit', 'final-circuit',
    'glossary-single-line-diagram-sld', 'riser-diagram', 'block-diagram', 'glossary-circuit-schedule',
    'glossary-isolation', 'functional-switching', 'emergency-switching', 'switching-for-mechanical-maintenance',
    'safe-isolation', 'lock-off', 'voltage-indicator', 'cpr', 'aed', 'concealed-services', 'cable-detector', 'cat-and-genny',
  ],
  sourceIds: ['epra-c2-competencies', 'course-c2-architecture', 'osg-electrical-supply', 'osg-isolation-switching', 'osg-safe-working', 'st-john-cpr', 'st-john-aed'],
  relatedSectionIds: ['c2-01-electrical-foundations'],
  prerequisiteSectionIds: ['c2-01-electrical-foundations'],
  coverage: [
    { competency: 'C2 low-voltage single-phase installation competence: recognise the installation path and distribution equipment before working on circuits.', referenceIds: ['epra-c2-competencies'], teachingPage: 'system-model' },
    { competency: 'Electrical safety including safe isolation and first aid.', referenceIds: ['epra-c2-competencies', 'st-john-cpr', 'st-john-aed'], teachingPage: 'verification' },
    { competency: 'Use installation drawings and schedules to trace circuits, protection and loads.', referenceIds: ['course-c2-architecture'], teachingPage: 'relationships' },
  ],
  pages: {
    'system-model': [
      { kind: 'flow', title: 'Typical single-phase supply-to-load path', steps: ['Distributor / supply network', 'Service protective device / cut-out', 'Electricity meter', 'Installation isolation / main switching point', 'Consumer unit / distribution assembly', 'Final-circuit protective device', 'Final circuit', 'Load or outlet'], sourceIds: ['course-c2-architecture', 'osg-electrical-supply'] },
      { kind: 'prose', title: 'Read the installation as boundaries and functions', paragraphs: [
        'The supply path is not just a list of boxes. Each boundary has a different job: supply entry, metering, switching/isolation, distribution, protection and final use. Ownership can also change along the path, so distributor-owned equipment must not be opened or altered merely because it is physically accessible.',
        'The protective conductor/earthing arrangement runs alongside the power path rather than appearing as a final afterthought. Later protection and testing stages rely on understanding where the main earthing terminal, circuit protective conductors and supply earthing arrangement fit into this architecture.',
      ], sourceIds: ['course-c2-architecture', 'osg-electrical-supply'] },
    ],
    definitions: [
      { kind: 'table', title: 'Choose the drawing or switching function by the question', columns: ['Need', 'Use'], rows: [
        ['Trace the electrical power/protection path', 'Single-line diagram'],
        ['Trace distribution vertically through floors/zones', 'Riser diagram'],
        ['Explain functional relationships without wiring detail', 'Block diagram'],
        ['Identify individual outgoing board ways and loads', 'Circuit / panel schedule'],
        ['Normal operation', 'Functional switching'],
        ['Planned electrical safety separation', 'Isolation / safe-isolation procedure'],
        ['Rapid danger reduction', 'Emergency switching'],
        ['Prevent unexpected powered movement during mechanical work', 'Switching for mechanical maintenance'],
      ], sourceIds: ['course-c2-architecture', 'osg-isolation-switching'] },
    ],
    relationships: [
      { kind: 'flow', title: 'Drawing-to-equipment relationship', steps: ['Single-line diagram gives the system path', 'Riser gives floor/vertical distribution', 'Board schedule identifies individual outgoing ways', 'Physical labels must match the drawings', 'Isolation plan uses those identifiers to select the correct source/device'], sourceIds: ['course-c2-architecture'] },
      { kind: 'table', title: 'Switching functions are not interchangeable', columns: ['Function', 'Question it answers', 'What it does not prove'], rows: [
        ['Functional switching', 'How is the equipment normally controlled?', 'That the circuit is dead for work'],
        ['Emergency switching', 'How is danger stopped quickly?', 'That every source is isolated'],
        ['Mechanical-maintenance switching', 'How is unexpected movement prevented?', 'That electrical conductors are safe to touch'],
        ['Isolation', 'How is electrical energy separated for safety?', 'Absence of voltage until it is verified'],
      ], sourceIds: ['course-c2-architecture', 'osg-isolation-switching'] },
    ],
    'engineering-rules': [
      { kind: 'flow', title: 'Safe-isolation decision chain', steps: ['Identify the correct circuit and every source', 'Select the correct isolating device', 'Operate it and secure against reconnection', 'Prove the voltage indicator', 'Test all relevant conductor combinations', 'Re-prove the indicator', 'Stop and investigate if identity or result is uncertain'], sourceIds: ['course-c2-architecture', 'osg-safe-working'] },
      { kind: 'prose', title: 'Hidden-service rule', paragraphs: [
        'A detector is supporting evidence, not permission to drill. Use drawings, expected service routes, more than one scan direction or mode, and further investigation when results conflict.',
        'For buried services, a passive scan can miss services that are not carrying a detectable signal. Controlled signal application and route tracing can improve confidence, but parallel services, poor return paths and non-conductive utilities still limit certainty.',
      ], sourceIds: ['course-c2-architecture'] },
    ],
    application: [
      { kind: 'flow', title: 'Before touching an unfamiliar installation', steps: ['Obtain drawings, schedules and site information', 'Trace supply-to-load path on the drawing', 'Match identifiers to actual equipment', 'Identify all possible normal and alternative sources', 'Identify the intended switching/isolation function', 'Inspect the work area for concealed or buried services', 'Only then select the controlled work procedure'], sourceIds: ['course-c2-architecture'] },
      { kind: 'prose', title: 'Emergency response at an electrical incident', paragraphs: [
        'Do not touch a casualty who may still be in contact with electrical energy. Control the electrical danger first using the site emergency/isolation arrangements and summon emergency help.',
        'Once it is safe to approach, assess responsiveness and normal breathing. Current St John guidance teaches immediate CPR for an adult who is unresponsive and not breathing normally, with an AED brought and used as soon as practical while interruptions to compressions are minimized.',
      ], sourceIds: ['course-c2-architecture', 'st-john-cpr', 'st-john-aed'] },
    ],
    verification: [
      { kind: 'verification', title: 'Verify safe isolation before work', purpose: 'Establish evidence that the identified conductors are not at a hazardous voltage before they are approached as de-energized.', safeState: 'The correct source/circuit has been identified, the intended isolating device has been operated and secured, and all known alternative/backfeed sources are controlled.', instrument: 'Suitable two-pole voltage indicator with a proving source/unit as required by the approved procedure.', method: ['Prove the indicator before use.', 'Test every relevant conductor combination at the point of work.', 'Treat an unexpected indication as evidence that isolation is incomplete or the circuit identity is wrong.', 'Re-prove the indicator after the dead test.', 'Maintain the secured isolation while work continues.'], expected: 'No hazardous voltage is indicated on the relevant conductor combinations, and the indicator proves correctly before and after.', abnormal: 'Any voltage indication, uncertain circuit identity, failed proving check or uncontrolled alternative source means the work does not proceed.', nextAction: 'Stop, re-establish the source/circuit identity and isolation boundary, then repeat the approved verification sequence.', sourceIds: ['course-c2-architecture', 'osg-safe-working'] },
      { kind: 'prose', title: 'First-aid verification is a response check, not an electrical test', paragraphs: ['After the scene is electrically safe, assess whether the casualty responds and is breathing normally. Occasional gasps are not normal breathing. Follow current emergency-dispatch and first-aid guidance; practical CPR/AED competence requires hands-on training.'], sourceIds: ['st-john-cpr', 'st-john-aed'] },
    ],
    'common-confusions': [
      { kind: 'table', title: 'Common mistakes', columns: ['Mistake', 'Correction'], rows: [
        ['“The wall switch is OFF, so it is isolated.”', 'Functional OFF is not proof of isolation or absence of voltage.'],
        ['“The detector shows clear, so drilling is safe.”', 'Detection has depth, material, calibration and signal limitations; use independent evidence.'],
        ['“The front of the accessory tells me what it does.”', 'Read ratings, poles, terminal markings and manufacturer data; similar-looking accessories can perform different functions.'],
        ['“A block diagram is enough to wire the circuit.”', 'A block diagram deliberately omits wiring detail. Use the correct drawing level and project information.'],
        ['“No shock advised means the casualty is fine.”', 'An AED shock decision concerns rhythm suitability, not recovery. Continue CPR/assessment as directed.'],
        ['“A main switch guarantees every source is dead.”', 'Alternative supplies, generators, storage and backfeeds must be identified separately.'],
      ], sourceIds: ['course-c2-architecture', 'st-john-aed'] },
    ],
    sources: [
      { kind: 'prose', title: 'Source hierarchy for this stage', paragraphs: [
        'EPRA defines the C2 competency expectation, including electrical safety and first aid. The course lessons provide the installation/drawing workflow. The current IET On-Site Guide is used as the technical baseline for supply, isolation and safe-working concepts where consistent with Kenyan requirements. St John Ambulance is used for current CPR/AED first-aid guidance.',
        'The On-Site Guide references here are bibliographic until their exact reader pages are individually verified. The interface must not generate a guessed PDF jump from printed-page numbers.',
      ], sourceIds: ['epra-c2-competencies', 'course-c2-architecture', 'osg-electrical-supply', 'osg-isolation-switching', 'osg-safe-working', 'st-john-cpr', 'st-john-aed'] },
    ],
  },
}];
