import { learningSections } from './learning-sections';
import type { CanonicalTerm, OverviewFormula, OverviewSection } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

const stageId = 'C2-08';
const sectionId = 'c2-08-inspection-testing-commissioning';
const moduleId = 'module-08';
const groups = learningSections.filter(section => section.moduleId === moduleId);
const lessonIds = [...new Set(groups.flatMap(section => section.lessonIds))];

const reviewed = (lessons: string[], relatedTermIds: string[] = []): Partial<CanonicalTerm> => ({
  editorialStatus: 'reviewed', stageIds: [stageId], sectionIds: [sectionId], lessonIds: lessons, relatedTermIds,
});

export const c208TermPatches: Record<string, Partial<CanonicalTerm>> = {
  continuity: {
    ...reviewed(['p08-l02','p08-l03','p05-l09','p08-l04'], ['low-resistance-ohmmeter','cpc','r1-r2','ring-integrity']),
    sourceIds: ['course-vocabulary','course-c2-testing','osg-initial-verification'],
    standardsMeaning: 'Continuity verification establishes that an intended conductive path is electrically continuous and, where required, that its measured resistance is consistent with the conductor/path being assessed.',
    plainMeaning: 'A buzzer is not enough. You need the correct isolated path, suitable low-resistance measurement and an interpretation of whether the result makes sense.',
    practicalExample: 'A very low reading caused by parallel metalwork can hide a disconnected bonding conductor unless the test method accounts for parallel paths.',
    explainAloud: 'Why can a low resistance reading still be misleading during protective-conductor testing?',
  },
  'insulation-resistance': {
    ...reviewed(['p08-l05','p08-l16'], ['insulation-resistance-tester','safe-isolation','continuity']),
    sourceIds: ['course-vocabulary','course-c2-testing','osg-initial-verification'],
    practicalExample: 'Before applying an insulation test, connected electronic equipment and surge devices may need treatment according to the current procedure so the test does not damage equipment or produce a meaningless result.',
    explainAloud: 'Why must the circuit be isolated and the connected equipment understood before insulation-resistance testing?',
  },
  polarity: {
    ...reviewed(['p08-l06'], ['safe-isolation','functional-testing','one-way-switching']),
    sourceIds: ['course-vocabulary','course-c2-testing','osg-initial-verification'],
    practicalExample: 'A lamp may operate even if a single-pole switch interrupts neutral instead of line, so operation alone does not prove correct polarity.',
    explainAloud: 'Give one reason an accessory can work while polarity is still wrong.',
  },
  ze: {
    ...reviewed(['p02-l09','p08-l08'], ['zs','prospective-fault-current-test','loop-impedance-test']),
    sourceIds: ['course-vocabulary','course-c2-protection','course-c2-testing','osg-initial-verification','osg-zs-appendix'],
    practicalExample: 'Ze is an external-loop quantity associated with the installation origin; establishing it may involve live testing or verified supply information and therefore requires controlled competent procedure.',
  },
  zs: {
    ...reviewed(['p08-l08'], ['ze','r1-r2','ads','loop-impedance-test']),
    sourceIds: ['course-vocabulary','course-c2-protection','course-c2-testing','osg-initial-verification','osg-zs-appendix'],
    practicalExample: 'Measured Zs at a final point should be interpreted against the exact protective device and relevant conditions; a number without the circuit/device context is incomplete evidence.',
  },
  rcd: {
    ...reviewed(['p08-l13','p08-l14'], ['rcd-test','functional-testing','rcd-types']),
    sourceIds: ['course-vocabulary','course-c2-protection','course-c2-testing','osg-rcd-operation','osg-initial-verification'],
    practicalExample: 'The built-in test button checks an internal device test path; prescribed instrument testing and installation verification answer different questions.',
    explainAloud: 'Why does pressing the RCD test button not replace formal RCD testing?',
  },
  'safe-isolation': {
    ...reviewed(['p08-l02','p08-l03','p08-l04','p08-l05','p08-l06'], ['test-sequence','voltage-indicator','lock-off']),
    sourceIds: ['course-vocabulary','course-c2-architecture','course-c2-testing','osg-safe-working','osg-safe-testing'],
    practicalExample: 'Dead tests are performed only after the correct source is identified, isolated, secured and absence of voltage is proven by the approved method.',
  },
};

const newTerm = (id: string, term: string, aliases: string[], standardsMeaning: string, plainMeaning: string, category: string, options: Partial<PreservedCanonicalTerm> = {}): PreservedCanonicalTerm => ({
  id, term, aliases, definition: standardsMeaning, category, authority: 'explanatory-definition', editorialStatus: 'reviewed', standardsMeaning, plainMeaning,
  practicalExample: options.practicalExample, notTheSameAs: options.notTheSameAs ?? [], relatedTermIds: options.relatedTermIds ?? [], sourceIds: options.sourceIds ?? ['course-c2-testing'],
  formulaIds: options.formulaIds ?? [], stageIds: [stageId], sectionIds: [sectionId], lessonIds: options.lessonIds ?? [], kenyaStatus: options.kenyaStatus ?? 'check-kenyan-requirement',
  explainAloud: options.explainAloud, contrast: options.contrast, unit: options.unit, formula: options.formula, formulaTex: options.formulaTex, formulaNote: options.formulaNote,
});

export const c208AdditionalTerms: PreservedCanonicalTerm[] = [
  newTerm('initial-verification', 'Initial verification', ['initial verification','verification'], 'Initial verification is the inspection and testing process used to establish, before an installation/new work is put into service, that the work has been constructed and performs in accordance with the applicable design and safety requirements.', 'Inspect first, carry out the appropriate dead and controlled live tests, interpret the results, correct defects and record the evidence before handover.', 'Testing', {
    sourceIds: ['course-c2-testing','osg-initial-verification'], relatedTermIds: ['visual-inspection','test-sequence','commissioning-record'], practicalExample: 'A newly completed circuit is not accepted merely because the load operates; construction, protective paths, insulation, polarity and protective-device performance must be verified.', explainAloud: 'Why is “it works” weaker evidence than initial verification?',
  }),
  newTerm('visual-inspection', 'Visual inspection', ['visual inspection','inspection'], 'Visual inspection is the systematic examination of the installation to identify defects, omissions, damage, incorrect selection or construction issues that can be established without relying on electrical test readings.', 'Look before testing. Some defects make later testing unsafe or invalidate the assumptions behind the readings.', 'Testing', {
    sourceIds: ['course-c2-testing','osg-initial-verification'], lessonIds: ['p08-l02'], relatedTermIds: ['initial-verification','test-sequence'], practicalExample: 'Missing covers, wrong conductor identification, damaged insulation or absent CPC connections should be found before energization.', explainAloud: 'Name three defects that should be caught before an instrument is connected.',
  }),
  newTerm('low-resistance-ohmmeter', 'Low-resistance ohmmeter', ['continuity tester','low resistance ohmmeter'], 'A low-resistance ohmmeter is an instrument/function intended to measure small resistances in continuity and protective-conductor paths under the specified isolated test conditions.', 'It measures the resistance of the intended metal path. Lead resistance and parallel paths must be understood.', 'Testing', {
    lessonIds: ['p08-l02','p08-l03','p08-l04'], relatedTermIds: ['continuity','r1-r2','ring-integrity'], practicalExample: 'Nulling/compensating test leads prevents their resistance from being mistaken for the circuit resistance where the method requires it.', explainAloud: 'Why should lead resistance be considered when measuring a very small conductor resistance?',
  }),
  newTerm('insulation-resistance-tester', 'Insulation-resistance tester', ['insulation tester','megger'], 'An insulation-resistance tester applies a specified DC test voltage and measures the resistance of the insulation path under the applicable test configuration and safety conditions.', 'It deliberately stresses the insulation more than an ordinary ohmmeter, so the circuit must be isolated and connected equipment managed correctly.', 'Testing', {
    lessonIds: ['p08-l05','p08-l16'], relatedTermIds: ['insulation-resistance','safe-isolation'], practicalExample: 'Testing line-to-neutral with sensitive electronics still connected can be inappropriate depending on the circuit/equipment and current procedure.', explainAloud: 'What makes an insulation-resistance test different from an ordinary continuity check?',
  }),
  newTerm('loop-impedance-test', 'Earth-fault-loop impedance test', ['loop test','earth fault loop test','zs test'], 'An earth-fault-loop impedance test establishes loop impedance at the stated point using a suitable approved method so the result can be related to the protective-device disconnection conditions.', 'It is a controlled fault-loop measurement/verification, not a generic resistance test and often involves energized conditions.', 'Testing', {
    lessonIds: ['p02-l09','p08-l08'], relatedTermIds: ['zs','ze','ads','prospective-fault-current-test'], practicalExample: 'A measured final-point Zs is interpreted together with the actual protective device and circuit temperature/test conditions.', explainAloud: 'Why is loop testing not interchangeable with a dead R1+R2 continuity test?',
  }),
  newTerm('prospective-fault-current-test', 'Prospective fault current verification', ['pfc test','prospective fault current test','pscc test','pefc test'], 'Prospective fault current verification establishes the current that could flow for the relevant fault condition at a stated point so equipment breaking capacity and fault duty can be checked.', 'It tells you how severe a fault the protective equipment may have to interrupt at that location.', 'Testing', {
    lessonIds: ['p08-l09'], relatedTermIds: ['pfc','pscc','pefc','glossary-breaking-capacity'], practicalExample: 'A low load current does not imply a low short-circuit current; PFC depends primarily on the supply/fault loop.', explainAloud: 'Why can a 10 A load circuit still need equipment capable of interrupting several kiloamperes?',
  }),
  newTerm('rcd-test', 'RCD instrument test', ['rcd test','residual current test'], 'An RCD instrument test applies the specified test condition/waveform using suitable equipment to verify the device response required by the current procedure and records the measured outcome.', 'It checks how the installed RCD responds under the stated test, using the correct device type and instrument settings.', 'Testing', {
    sourceIds: ['course-c2-testing','osg-rcd-operation'], lessonIds: ['p08-l13','p08-l14'], relatedTermIds: ['rcd','rcd-types','functional-testing'], practicalExample: 'Select the test mode appropriate to the installed RCD type rather than assuming every device is tested identically.', explainAloud: 'What device information must be known before selecting an RCD tester mode?',
  }),
  newTerm('functional-testing', 'Functional testing', ['functional test','functional testing'], 'Functional testing verifies that switching, controls, interlocks and protective/control functions operate as intended after the relevant electrical safety tests are satisfactory.', 'After proving the wiring/protection, operate the actual controls and functions to confirm the installation behaves correctly.', 'Testing', {
    lessonIds: ['p08-l15'], relatedTermIds: ['initial-verification','rcd-test','polarity'], practicalExample: 'Operate a local isolator, switching arrangement or protective test facility only after the installation is in the safe state required for that functional check.', explainAloud: 'Why should functional testing come after the prerequisite safety checks rather than first?',
  }),
  newTerm('test-sequence', 'Inspection and test sequence', ['test sequence','testing sequence'], 'The inspection and test sequence orders work so defects are found with the least risk and earlier results support the safety and validity of later tests.', 'Inspect first; carry out appropriate dead tests before energization; then perform only the controlled live tests that require supply; finish with functional checks and records.', 'Testing', {
    sourceIds: ['course-c2-testing','osg-initial-verification','osg-safe-testing'], relatedTermIds: ['visual-inspection','safe-isolation','initial-verification','functional-testing'], practicalExample: 'Finding wrong polarity or an open CPC before energization prevents a live fault condition from being created for the sake of testing.', explainAloud: 'Why is the order of tests a safety control rather than just an examiner preference?',
  }),
  newTerm('commissioning-record', 'Verification / commissioning record', ['test certificate','commissioning record','installation certificate'], 'A verification/commissioning record documents the extent of work, supply characteristics, inspection outcomes, circuit details, measured results, responsible persons and any declared limitations according to the applicable documentation system.', 'Record what was actually inspected and measured so the installation can be understood and maintained later; never invent or copy results.', 'Documentation', {
    lessonIds: ['p16-l09'], relatedTermIds: ['initial-verification','glossary-circuit-schedule','design-evidence'], practicalExample: 'A certificate entry should trace back to the actual circuit label and measurement rather than being copied from another job.', explainAloud: 'Why is a certificate without traceable measured evidence unsafe even if every box is filled?',
  }),
  newTerm('earth-electrode-resistance-test', 'Earth-electrode resistance verification', ['earth electrode test','earth resistance test'], 'Earth-electrode resistance verification measures or establishes the resistance/performance of the electrode system using a method suitable for the installation and known parallel paths.', 'The method must suit the electrode arrangement; connected parallel earth paths can change what the instrument is actually measuring.', 'Testing', {
    lessonIds: ['p08-l12'], relatedTermIds: ['earth-electrode','tt','earthing-conductor'], practicalExample: 'A clamp or stake method is not selected merely by convenience; the installation topology must support the chosen method.', explainAloud: 'Why can parallel metallic paths make an electrode resistance result difficult to interpret?',
  }),
];

export const c208Formulas: OverviewFormula[] = [];

export const c208Sections: OverviewSection[] = [{
  id: sectionId, stageId, moduleId, learningSectionIds: groups.map(section => section.id), title: 'C2 Inspection, Testing and Commissioning', status: 'reviewed', lessonIds,
  termIds: ['initial-verification','visual-inspection','test-sequence','safe-isolation','voltage-indicator','continuity','low-resistance-ohmmeter','ring-integrity','r1-r2','cpc','glossary-bonding','insulation-resistance','insulation-resistance-tester','polarity','earth-electrode','earth-electrode-resistance-test','ze','zs','loop-impedance-test','pfc','pscc','pefc','prospective-fault-current-test','rcd','rcd-types','rcd-test','functional-testing','commissioning-record','glossary-circuit-schedule'],
  sourceIds: ['epra-c2-competencies','course-c2-testing','osg-initial-verification','osg-safe-testing','osg-zs-appendix','osg-rcd-operation','osg-earthing-bonding'],
  relatedSectionIds: ['c2-07-consumer-units-complete-installation'], prerequisiteSectionIds: ['c2-07-consumer-units-complete-installation'],
  coverage: [
    { competency: 'Inspect and test a domestic single-phase installation using a safe sequence from visual inspection through dead tests, controlled live verification and functional checks.', referenceIds: ['epra-c2-competencies','course-c2-testing','osg-initial-verification'], teachingPage: 'system-model' },
    { competency: 'Explain the purpose, safe state, instrument, procedure, expected result and interpretation for continuity, insulation resistance, polarity, earthing, loop/PFC and RCD tests.', referenceIds: ['epra-c2-competencies','course-c2-testing'], teachingPage: 'engineering-rules' },
    { competency: 'Record and interpret test results rather than treating instrument numbers as self-explanatory.', referenceIds: ['course-c2-testing','osg-initial-verification'], teachingPage: 'verification' },
    { competency: 'Complete commissioning/documentation with traceable circuit identification, measured evidence and declared limitations.', referenceIds: ['course-c2-testing'], teachingPage: 'application' },
  ],
  pages: {
    'system-model': [
      { kind: 'flow', title: 'C2 verification sequence', steps: ['Design/document review', 'Visual inspection', 'Safe isolation / prove dead', 'Protective conductor & bonding continuity', 'Ring-final integrity where applicable', 'Insulation resistance', 'Dead polarity checks as applicable', 'Controlled energization', 'Earthing / Ze / Zs verification as applicable', 'Prospective fault current', 'RCD tests', 'Functional checks', 'Record results / certification / handover'], sourceIds: ['course-c2-testing','osg-initial-verification','osg-safe-testing'] },
    ],
    definitions: [
      { kind: 'table', title: 'Instrument answers one defined question', columns: ['Instrument/function','Question it answers','Critical caution'], rows: [
        ['Two-pole voltage indicator','Is hazardous voltage present/absent between the selected points?','Prove before and after within the safe-isolation method'],
        ['Low-resistance ohmmeter','Is the intended conductor path continuous and what is its resistance?','Circuit isolated; account for lead and parallel paths'],
        ['Insulation-resistance tester','Is unwanted conduction through insulation acceptably high-resistance under the stated test?','Use correct test voltage/configuration and protect connected equipment'],
        ['Loop tester','What is the fault-loop impedance at the stated point?','Controlled live method where required; know circuit/device context'],
        ['PFC function','What fault current may be available at the stated point?','Compare with equipment fault duty'],
        ['RCD tester','How does the installed RCD respond to the specified test condition?','Correct type/mode/current and procedure required'],
        ['Earth-resistance tester','What is the electrode/system resistance under the selected method?','Method must suit parallel paths/topology'],
      ], sourceIds: ['course-c2-testing'] },
    ],
    relationships: [
      { kind: 'table', title: 'Purpose → safe state → instrument → result → decision', columns: ['Test','Purpose','Safe-state principle','Interpretation'], rows: [
        ['Continuity','Prove intended conductive paths','Dead/isolated','Compare resistance/path with construction and expected continuity'],
        ['Insulation resistance','Find unwanted leakage paths through insulation','Dead/isolated with equipment managed','Low result means investigate; exact acceptance uses current procedure'],
        ['Polarity','Confirm conductor functions and single-pole devices are in intended conductor','Often established by dead methods before live confirmation where required','Operation alone does not prove polarity'],
        ['Zs / loop','Support ADS verification','Controlled live method where applicable','Compare with exact device/conditions'],
        ['PFC','Check fault duty','Controlled live measurement/verified data','Must not exceed verified equipment/combination capability'],
        ['RCD','Verify residual protective response','Controlled energized test with correct mode','Interpret against current device/procedure requirements'],
      ], sourceIds: ['course-c2-testing','osg-initial-verification'] },
    ],
    'engineering-rules': [
      { kind: 'formula', formulaId: 'earth-fault-loop' },
      { kind: 'formula', formulaId: 'earth-fault-current' },
      { kind: 'prose', title: 'Do not memorize a number without the test condition', paragraphs: ['A result is meaningful only with the test points, instrument function, circuit state, conductor temperature/parallel paths where relevant, and the current acceptance criterion for the exact device/circuit.', 'This Overview deliberately avoids inventing insulation, Zs or RCD pass/fail numbers when the complete current table/procedure is not available in the supplied source pack.'], sourceIds: ['course-c2-testing','osg-initial-verification','osg-rcd-operation'] },
    ],
    application: [
      { kind: 'flow', title: 'EPRA-quality testing answer structure', steps: ['State the purpose of the test', 'State whether the circuit is dead or controlled live', 'Name the instrument/function', 'Describe connections/procedure in the correct order', 'State the expected/acceptable type of result', 'Explain what an abnormal result means', 'State corrective action / retest / documentation'], sourceIds: ['course-c2-testing'] },
      { kind: 'prose', title: 'Certification is evidence, not paperwork after the fact', paragraphs: ['Record circuit identifiers, protective devices and results as the work is verified. Do not populate certificates from memory, copy a previous installation or invent values to complete a form.', 'Where the work has limitations, identify the extent and limitation clearly rather than implying the entire installation was verified.'], sourceIds: ['course-c2-testing'] },
    ],
    verification: [
      { kind: 'verification', title: 'Quality check a completed test result', purpose: 'Ensure every recorded value can support a real engineering conclusion.', safeState: 'Use the safe state required by the specific test; live work is not justified merely because the instrument has a live-test mode.', instrument: 'The exact instrument/function appropriate to the question, with leads/accessories and calibration/condition suitable for the task.', method: ['Identify circuit and test purpose.', 'State safe state and isolation/energization controls.', 'Record instrument function/settings.', 'Record test points and relevant disconnections/parallel paths.', 'Record value and units.', 'Compare with the correct current criterion/device data.', 'Investigate inconsistencies rather than averaging them away.', 'Repair where required and repeat all affected tests.', 'Record final result and any limitation.'], expected: 'Result is traceable, repeatable and supports the stated conclusion.', abnormal: 'Missing units, unclear test points, wrong mode, parallel-path ambiguity, conflicting circuit labels or a result outside the justified criterion makes the conclusion unreliable.', nextAction: 'Stop, clarify the circuit/method, correct defects and repeat the test under the correct conditions.', sourceIds: ['course-c2-testing','osg-initial-verification'] },
    ],
    'common-confusions': [
      { kind: 'table', title: 'Testing mistakes', columns: ['Mistake','Correction'], rows: [
        ['“Continuity buzzer means CPC is satisfactory.”','Measure/interpret the intended path and resistance; a buzzer alone is weak evidence.'],
        ['“Insulation resistance is just another ohms test.”','It uses a specified test voltage/configuration and requires isolated, prepared circuits.'],
        ['“If the load works, polarity is correct.”','Many wrong connections still allow operation; verify conductor functions.'],
        ['“Ze and Zs are the same.”','Ze is external; Zs includes the circuit contribution at the point.'],
        ['“RCD test button proves compliance.”','It is a device functional check, not the complete prescribed instrument verification.'],
        ['“Live test comes first because it is faster.”','Inspection and appropriate dead testing reduce risk and validate the installation before controlled energization.'],
      ], sourceIds: ['course-c2-testing'] },
    ],
    sources: [
      { kind: 'prose', title: 'Source discipline for C2-08', paragraphs: ['EPRA explicitly requires domestic inspection, testing and commissioning competence. The current IET On-Site Guide initial-verification/testing sections are the technical baseline where consistent with Kenyan requirements; the verified OSG printed page 123 / PDF page 125 remains the only exact current reader deep link in this source pack.', 'The broader current OSG pages 121–140 are bibliographically identified but exact PDF page mappings are not guessed. Numeric pass/fail values must be taken from the complete current source and exact device/procedure, not from older guides or memory.'], sourceIds: ['epra-c2-competencies','course-c2-testing','osg-initial-verification','osg-safe-testing'] },
    ],
  },
}];
