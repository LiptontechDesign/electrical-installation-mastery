import { learningSections } from './learning-sections';
import type { CanonicalTerm, OverviewFormula, OverviewSection } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

const stageId = 'C2-09';
const sectionId = 'c2-09-fault-finding';
const moduleId = 'module-09';
const groups = learningSections.filter(section => section.moduleId === moduleId);
const lessonIds = [...new Set([...groups.flatMap(section => section.lessonIds), 'p16-l06'])];

const reviewed = (lessons: string[], relatedTermIds: string[] = []): Partial<CanonicalTerm> => ({
  editorialStatus: 'reviewed', stageIds: [stageId], sectionIds: [sectionId], lessonIds: lessons, relatedTermIds,
});

export const c209TermPatches: Record<string, Partial<CanonicalTerm>> = {
  'ring-integrity': {
    ...reviewed(['p09-l01','p09-l02'], ['fault-finding','open-circuit-fault','sectionalizing','continuity']),
    sourceIds: ['course-c2-wiring','course-c2-testing','course-c2-fault-finding','osg-initial-verification'],
    practicalExample: 'A ring can still energize all outlets with one conductor leg open. End-to-end and cross-connected resistance patterns are used to prove the intended ring and narrow the defect rather than relying on operation.',
    explainAloud: 'How can every socket work while the ring is still electrically defective?',
  },
  'insulation-resistance': {
    ...reviewed(['p09-l02','p09-l03'], ['insulation-fault','sectionalizing','insulation-resistance-tester']),
    sourceIds: ['course-vocabulary','course-c2-testing','course-c2-fault-finding','osg-initial-verification'],
    practicalExample: 'A low insulation reading can come from damaged cable, moisture, contamination, connected equipment or a protective component; divide the circuit and control those influences before condemning fixed wiring.',
    explainAloud: 'Why must a low insulation-resistance result be localized before deciding what to replace?',
  },
  polarity: {
    ...reviewed(['p09-l04','p09-l05'], ['polarity-fault','fault-finding','continuity']),
    sourceIds: ['course-vocabulary','course-c2-testing','course-c2-fault-finding'],
    practicalExample: 'Reverse polarity can leave internal parts connected to line when a single-pole control appears OFF, so normal load operation does not prove a safe conductor arrangement.',
    explainAloud: 'Why can a reverse-polarity circuit appear to work normally?',
  },
  continuity: {
    ...reviewed(['p09-l01','p09-l04','p09-l05','p09-l08'], ['open-circuit-fault','high-resistance-joint','sectionalizing']),
    sourceIds: ['course-vocabulary','course-c2-testing','course-c2-fault-finding','osg-initial-verification'],
    practicalExample: 'Comparative resistance readings can distinguish an open path from an abnormally resistive connection when the test points and expected route are known.',
  },
  rcd: {
    ...reviewed(['p09-l06','p09-l09'], ['borrowed-neutral','earth-leakage','nuisance-tripping','leakage-clamp-measurement']),
    sourceIds: ['course-vocabulary','course-c2-protection','course-c2-testing','course-c2-fault-finding','osg-rcd-operation'],
    practicalExample: 'Repeated RCD operation can be caused by a real insulation fault, cumulative equipment leakage, a neutral-to-earth path or a borrowed/mixed neutral; replacing the RCD without evidence may leave the real fault untouched.',
    explainAloud: 'List four installation/load conditions that can cause repeated RCD operation without assuming the RCD itself is defective.',
  },
  zs: {
    ...reviewed(['p09-l04','p09-l08'], ['high-resistance-joint','fault-finding','ze','r1-r2','ads']),
    sourceIds: ['course-vocabulary','course-c2-protection','course-c2-testing','course-c2-fault-finding','osg-zs-appendix'],
    practicalExample: 'An unexpectedly high Zs can be investigated by separating the external contribution from the circuit contribution and inspecting/testing CPCs, joints, glands and terminations rather than changing the breaker first.',
  },
};

const newTerm = (id: string, term: string, aliases: string[], standardsMeaning: string, plainMeaning: string, category: string, options: Partial<PreservedCanonicalTerm> = {}): PreservedCanonicalTerm => ({
  id, term, aliases, definition: standardsMeaning, category, authority: 'explanatory-definition', editorialStatus: 'reviewed', standardsMeaning, plainMeaning,
  practicalExample: options.practicalExample, notTheSameAs: options.notTheSameAs ?? [], relatedTermIds: options.relatedTermIds ?? [], sourceIds: options.sourceIds ?? ['course-c2-fault-finding'],
  formulaIds: options.formulaIds ?? [], stageIds: [stageId], sectionIds: [sectionId], lessonIds: options.lessonIds ?? [], kenyaStatus: options.kenyaStatus ?? 'check-kenyan-requirement',
  explainAloud: options.explainAloud, contrast: options.contrast, unit: options.unit, formula: options.formula, formulaTex: options.formulaTex, formulaNote: options.formulaNote,
});

export const c209AdditionalTerms: PreservedCanonicalTerm[] = [
  newTerm('fault-finding', 'Fault finding', ['fault finding','fault diagnosis','troubleshooting'], 'Fault finding is the controlled process of defining a symptom, establishing a safe state, forming and testing evidence-based hypotheses, localizing the defect, repairing it and verifying the affected installation before return to service.', 'Diagnose from evidence instead of swapping parts. Make safe, confirm what is actually wrong, narrow the possible causes, test the best hypothesis, repair and fully retest.', 'Fault finding', {
    lessonIds, relatedTermIds: ['fault-symptom','fault-hypothesis','sectionalizing','safe-isolation'], practicalExample: 'A dead socket is traced from supply/protection through conductors and connections instead of immediately replacing the socket.', explainAloud: 'State a disciplined fault-finding sequence from first symptom to final handover.',
  }),
  newTerm('fault-symptom', 'Fault symptom', ['symptom','fault symptom'], 'A fault symptom is an observed abnormal condition or measured behaviour that defines what requires investigation without yet asserting the root cause.', 'Describe what happened before deciding why it happened.', 'Fault finding', {
    lessonIds: ['p09-l05','p09-l09','p09-l10'], relatedTermIds: ['fault-finding','fault-hypothesis'], practicalExample: '“RCD trips when two specific appliances are connected” is a stronger symptom statement than “the board is faulty.”', explainAloud: 'Why should a symptom statement avoid naming an unproven cause?',
  }),
  newTerm('fault-hypothesis', 'Fault hypothesis', ['fault hypothesis','diagnostic hypothesis'], 'A fault hypothesis is a proposed cause that explains the observed symptom and can be confirmed or rejected by a safe discriminating test or inspection.', 'A good hypothesis predicts what you should measure next if it is true.', 'Fault finding', {
    relatedTermIds: ['fault-finding','fault-symptom','sectionalizing'], practicalExample: 'For a dead socket, “open line upstream of this point” predicts a different pattern from “open neutral,” so the next checks can distinguish them.', explainAloud: 'What makes a fault hypothesis testable rather than a guess?',
  }),
  newTerm('sectionalizing', 'Sectionalizing / divide-and-test diagnosis', ['sectionalizing','divide and test','split circuit'], 'Sectionalizing is the deliberate division of a circuit or system into smaller testable portions so measurements progressively reduce the region in which a fault can exist.', 'Split the problem into halves or logical sections until the defect has nowhere left to hide.', 'Fault finding', {
    lessonIds: ['p09-l02','p09-l03'], relatedTermIds: ['fault-finding','fault-hypothesis','insulation-fault','open-circuit-fault'], practicalExample: 'A low insulation reading can be localized by disconnecting at a suitable midpoint and retesting each isolated section under the correct procedure.', explainAloud: 'Why is repeated circuit subdivision usually stronger than opening accessories at random?',
  }),
  newTerm('open-circuit-fault', 'Open-circuit fault', ['open circuit','open conductor','broken conductor'], 'An open-circuit fault is a loss of intended electrical continuity in a conductor, connection or device path, preventing or altering the intended current flow.', 'The path that should be continuous has been broken or disconnected.', 'Fault finding', {
    lessonIds: ['p09-l01','p09-l02','p09-l05','p09-l08'], relatedTermIds: ['continuity','ring-integrity','fault-finding','phantom-voltage'], practicalExample: 'An open neutral can leave line present at an outlet while the connected load cannot complete its normal circuit.', explainAloud: 'How can an open neutral produce a different symptom from an open line?',
  }),
  newTerm('high-resistance-joint', 'High-resistance joint', ['high resistance joint','loose connection','resistive connection'], 'A high-resistance joint is an unintended excessive resistance at a connection or conductor interface that can cause voltage drop and localized I²R heating while still allowing current to flow.', 'The circuit may still work, but a weak connection wastes power as heat and can become dangerous.', 'Fault finding', {
    lessonIds: ['p09-l04'], relatedTermIds: ['continuity','fault-finding','thermal-anomaly'], practicalExample: 'A loose socket terminal can power a small load yet overheat badly under higher current because the connection resistance is concentrated at one point.', explainAloud: 'Why can a high-resistance connection be more deceptive than a completely open conductor?',
  }),
  newTerm('insulation-fault', 'Insulation fault / leakage path', ['insulation fault','low insulation','leakage path'], 'An insulation fault is an unintended conductive path through or across insulation caused by damage, moisture, contamination, deterioration or another connected path, producing leakage between conductors or to earth.', 'Current is finding a path where the insulation should be keeping conductors separated.', 'Fault finding', {
    lessonIds: ['p09-l02','p09-l03'], relatedTermIds: ['insulation-resistance','earth-leakage','sectionalizing'], practicalExample: 'Moisture in an accessory can lower measured insulation resistance intermittently and may worsen with environmental conditions.', explainAloud: 'Name several causes of low insulation resistance besides damaged fixed cable.',
  }),
  newTerm('polarity-fault', 'Polarity fault', ['reverse polarity','polarity fault'], 'A polarity fault is an incorrect conductor connection that places line, neutral or switched functions on unintended terminals or conductors so switching/protection and accessible parts do not behave as designed.', 'The circuit may operate, but the wrong conductor is being controlled or connected.', 'Fault finding', {
    lessonIds: ['p09-l04'], relatedTermIds: ['polarity','fault-finding'], practicalExample: 'A single-pole switch connected in neutral can extinguish a lamp while leaving line potential present at the lampholder.', explainAloud: 'Why is correct switching action not proof of correct polarity?',
  }),
  newTerm('borrowed-neutral', 'Borrowed / mixed neutral', ['borrowed neutral','mixed neutral','shared neutral fault'], 'A borrowed or mixed neutral occurs when current from one circuit returns through the neutral path of another circuit or outside the intended protective-device sensing boundary.', 'The line and neutral no longer belong to the same intended circuit path, creating isolation and RCD hazards.', 'Fault finding', {
    lessonIds: ['p09-l06'], relatedTermIds: ['rcd','nuisance-tripping','earth-leakage','safe-isolation'], practicalExample: 'A circuit can appear isolated at its line device while its borrowed neutral remains connected to another energized circuit.', explainAloud: 'Why can a borrowed neutral defeat both safe isolation assumptions and residual-current protection?',
  }),
  newTerm('earth-leakage', 'Earth leakage / residual current', ['earth leakage','leakage current','residual current'], 'Earth leakage is current flowing from live conductors through protective conductors, earth-referenced paths or equipment capacitance/filters rather than returning entirely through the intended live conductors.', 'Some equipment has normal small leakage; excessive or fault leakage can contribute to RCD operation and requires context-sensitive diagnosis.', 'Fault finding', {
    lessonIds: ['p09-l09'], relatedTermIds: ['rcd','insulation-fault','leakage-clamp-measurement','nuisance-tripping'], practicalExample: 'Several electronic loads can contribute individually small protective-conductor currents that add together on one RCD group.', explainAloud: 'How can cumulative normal equipment leakage differ from one damaged-insulation fault?',
  }),
  newTerm('nuisance-tripping', 'Unwanted / nuisance tripping', ['nuisance tripping','unwanted tripping','repeated rcd trips'], 'Unwanted tripping is protective-device operation that interrupts service when the cause is not yet established; diagnosis must determine whether the operation is correct response to a real condition, cumulative leakage, wiring error, inrush or a defective/misapplied device.', 'Do not assume the protection is “too sensitive.” First establish what condition made it operate.', 'Fault finding', {
    lessonIds: ['p09-l06','p09-l09'], relatedTermIds: ['rcd','earth-leakage','borrowed-neutral','fault-finding'], practicalExample: 'Repeated RCD operation after adding electronic loads may reflect cumulative leakage or a mixed neutral rather than a defective RCD.', explainAloud: 'Why is replacing or upsizing protection a poor first response to repeated tripping?',
  }),
  newTerm('phantom-voltage', 'Phantom / capacitively coupled voltage', ['phantom voltage','ghost voltage','capacitive coupling voltage'], 'A phantom voltage is a measured potential produced by capacitive or other high-impedance coupling that can appear on a disconnected/floating conductor when measured with a high-input-impedance instrument, without representing a firm low-impedance supply capable of normal load current.', 'A sensitive meter can show voltage on a floating wire because of coupling from nearby live conductors; the reading must be interpreted with an appropriate verification method.', 'Fault finding', {
    lessonIds: ['p09-l08'], relatedTermIds: ['open-circuit-fault','fault-finding'], practicalExample: 'An open SWA core can float to an intermediate voltage on a digital multimeter but collapse when checked with an appropriate two-pole/low-impedance method under the approved procedure.', explainAloud: 'How would you distinguish a firm supply from a capacitively coupled phantom reading?',
  }),
  newTerm('leakage-clamp-measurement', 'Leakage clamp measurement', ['leakage clamp','residual clamp measurement'], 'A leakage-clamp measurement encloses all intended live conductors of a circuit so their normal load currents largely cancel magnetically and the instrument indicates the uncancelled residual current within its stated capability.', 'Clamp line and neutral together for residual leakage; clamp one conductor when you want ordinary load current.', 'Testing', {
    lessonIds: ['p09-l09'], relatedTermIds: ['earth-leakage','load-current-diagnosis','rcd'], practicalExample: 'Circuit-by-circuit residual measurements can help identify which group of loads contributes most to repeated RCD operation.', explainAloud: 'Why must both line and neutral pass through the clamp for a single-phase residual-current measurement?',
  }),
  newTerm('load-current-diagnosis', 'Load-current diagnosis', ['load current diagnosis','current clamp diagnosis'], 'Load-current diagnosis compares measured operating current with the equipment state, expected load and circuit design to determine whether the supply/load is operating, overloaded, intermittent or missing a load section.', 'Measure the current path that should be carrying the load and compare it with what the equipment is supposed to be doing.', 'Fault finding', {
    lessonIds: ['p09-l10','p09-l11'], relatedTermIds: ['leakage-clamp-measurement','fault-symptom','fault-hypothesis'], practicalExample: 'A heater drawing zero current during its scheduled energized period suggests a different fault set from one drawing its expected current but remaining cold.', explainAloud: 'What additional context must accompany a clamp-current reading before it proves a fault?',
  }),
  newTerm('thermal-anomaly', 'Thermal anomaly', ['thermal anomaly','hot connection','abnormal heating'], 'A thermal anomaly is an abnormal temperature pattern relative to comparable components or expected operating conditions; it is evidence of a symptom, not by itself proof of the electrical root cause.', 'Heat can point you toward a problem, but you still need load, connection, resistance and environmental evidence to explain why it is hot.', 'Fault finding', {
    lessonIds: ['p16-l06'], relatedTermIds: ['high-resistance-joint','load-current-diagnosis','fault-hypothesis'], practicalExample: 'A hot terminal may result from high contact resistance, higher current, poor cooling or reflected/emissivity effects; electrical checks are needed before repair conclusions.', explainAloud: 'Why is the hottest-looking point in a thermal image not automatically proof of a loose terminal?',
  }),
  newTerm('cable-deterioration', 'Cable deterioration / contamination', ['cable deterioration','green goo','green exudate','cable contamination'], 'Cable deterioration or contamination is evidence that cable materials or environmental conditions have changed and may affect insulation, terminations or accessories; its significance is established by inspection, material condition and electrical testing rather than appearance alone.', 'Visible contamination is a reason to investigate the cable system, not merely wipe the accessory clean.', 'Fault finding', {
    lessonIds: ['p09-l07'], relatedTermIds: ['insulation-fault','fault-finding','insulation-resistance'], practicalExample: 'Green exudate from older PVC cable can migrate into accessories; affected wiring is assessed, cleaned/repaired/replaced as justified and then fully retested.', explainAloud: 'What evidence would you gather before deciding whether contaminated cable can remain in service?',
  }),
];

export const c209Formulas: OverviewFormula[] = [];

export const c209Sections: OverviewSection[] = [{
  id: sectionId, stageId, moduleId, learningSectionIds: groups.map(section => section.id), title: 'C2 Fault Finding', status: 'reviewed', lessonIds,
  termIds: ['fault-finding','fault-symptom','fault-hypothesis','sectionalizing','safe-isolation','continuity','ring-integrity','open-circuit-fault','high-resistance-joint','insulation-resistance','insulation-fault','polarity','polarity-fault','borrowed-neutral','rcd','earth-leakage','nuisance-tripping','phantom-voltage','leakage-clamp-measurement','load-current-diagnosis','thermal-anomaly','cable-deterioration','zs','ze','r1-r2','cpc','swa','commissioning-record'],
  sourceIds: ['epra-c2-competencies','course-c2-fault-finding','course-c2-testing','course-c2-protection','osg-initial-verification','osg-protection','osg-rcd-operation','osg-zs-appendix'],
  relatedSectionIds: ['c2-08-inspection-testing-commissioning'], prerequisiteSectionIds: ['c2-08-inspection-testing-commissioning'],
  coverage: [
    { competency: 'Diagnose domestic single-phase faults by defining the symptom, making the work safe, forming hypotheses and selecting discriminating tests.', referenceIds: ['epra-c2-competencies','course-c2-fault-finding'], teachingPage: 'system-model' },
    { competency: 'Interpret ring-continuity, insulation-resistance, polarity, Zs and leakage-current evidence to localize open circuits, insulation faults, high-resistance joints and wiring errors.', referenceIds: ['course-c2-fault-finding','osg-initial-verification'], teachingPage: 'relationships' },
    { competency: 'Investigate unwanted RCD operation using leakage, neutral-routing and insulation evidence rather than bypassing or replacing protection by guesswork.', referenceIds: ['course-c2-fault-finding','osg-rcd-operation'], teachingPage: 'application' },
    { competency: 'Repair, retest every affected protective/functional requirement and document the final verified condition.', referenceIds: ['course-c2-fault-finding','course-c2-testing'], teachingPage: 'verification' },
  ],
  pages: {
    'system-model': [
      { kind: 'flow', title: 'Evidence-led fault-finding loop', steps: ['Define the symptom precisely', 'Identify hazards and establish the required safe state', 'Confirm the symptom without creating extra risk', 'Draw/trace the expected circuit path', 'List plausible causes ranked by evidence', 'Choose the safest test that best separates the hypotheses', 'Sectionalize and narrow the fault', 'Repair the proven cause', 'Repeat all tests affected by the repair', 'Functional check and document final condition'], sourceIds: ['course-c2-fault-finding','course-c2-testing'] },
    ],
    definitions: [
      { kind: 'table', title: 'Fault classes and the evidence that separates them', columns: ['Fault class','Typical evidence','Strong next question'], rows: [
        ['Open conductor','Loss of continuity / load path, possibly partial or phantom voltage','Which conductor/path is open and between which points?'],
        ['High-resistance joint','Abnormal resistance/voltage drop/heating under load','Where is the resistance concentrated and is the termination damaged?'],
        ['Insulation/leakage fault','Low IR or residual current between unintended paths','Which conductor pair/section/load creates the leakage?'],
        ['Polarity/wiring error','Unexpected conductor function or switching behaviour','Where was line/neutral/switched function interchanged?'],
        ['Borrowed/mixed neutral','RCD imbalance and unexpected energized return path','Which circuits share a neutral path outside the intended boundary?'],
        ['Phantom voltage','High-impedance voltage reading with weak source capability','Does an appropriate lower-impedance/two-pole verification confirm a firm source?'],
      ], sourceIds: ['course-c2-fault-finding'] },
    ],
    relationships: [
      { kind: 'table', title: 'Map the abnormal result to the next investigation', columns: ['Abnormal evidence','Do not conclude immediately','Investigate next'], rows: [
        ['Open ring end-to-end conductor','“All sockets are dead”','Cross-connected readings, ring sketch, branches/spurs and conductor identification'],
        ['Low insulation resistance','“The cable must be replaced”','Connected loads/SPDs, moisture, contamination and sectionalized IR tests'],
        ['High Zs','“Fit a different breaker”','Ze versus R1+R2 contribution, CPC joints, glands, terminations and route'],
        ['RCD trips','“The RCD is faulty”','Residual leakage, N-E faults, borrowed neutrals, equipment and RCD type/application'],
        ['Unexpected partial voltage','“There is a healthy supply”','Instrument input impedance, open conductor and firm-source verification'],
        ['Hot connection','“Loose screw”','Load current, contact resistance, torque/condition, cooling and thermal measurement context'],
      ], sourceIds: ['course-c2-fault-finding','course-c2-testing','course-c2-protection'] },
    ],
    'engineering-rules': [
      { kind: 'prose', title: 'Use the test that can disprove your leading hypothesis', paragraphs: ['A useful diagnostic test changes what you will do next. Repeating the same measurement at random points without a circuit model is activity, not fault finding.', 'Prefer dead tests whenever they can answer the question safely. Controlled live measurements are used only when the information genuinely depends on energized operation and the safe system of work permits them.'], sourceIds: ['course-c2-fault-finding','osg-initial-verification'] },
      { kind: 'flow', title: 'Ring and insulation diagnosis', steps: ['Safely isolate and identify circuit', 'Sketch origin, ring legs, spurs and known alterations', 'Measure end-to-end line, neutral and CPC paths', 'Use cross-connected readings to identify pattern/position', 'Treat insulation resistance as a separate question', 'Disconnect/manage connected loads and protective electronics as required', 'Sectionalize low-IR path', 'Repair proven defect', 'Repeat ring, IR, polarity and all affected verification'], sourceIds: ['course-c2-fault-finding'] },
    ],
    application: [
      { kind: 'flow', title: 'Repeated RCD trip — diagnostic path', steps: ['Record exactly when/how the trip occurs', 'Do not defeat or up-rate protection', 'Identify circuits and neutral paths behind the device', 'Inspect for obvious wiring/moisture/damage', 'Measure residual leakage where appropriate', 'Separate circuits/loads systematically', 'Check for borrowed/mixed neutrals and N-E faults', 'Use IR testing under the correct isolated configuration', 'Confirm RCD type/application and instrument test', 'Repair cause and repeat affected verification'], sourceIds: ['course-c2-fault-finding','osg-rcd-operation'] },
      { kind: 'flow', title: 'Dead socket — source-to-load diagnosis', steps: ['Confirm symptom and safe conditions', 'Check circuit identity and upstream protective/isolation state', 'Establish whether line, neutral or protective path is missing', 'Use continuity/polarity evidence under isolation to narrow the open path', 'Inspect the predicted connection/accessory/cable section', 'Repair and retest continuity, polarity, insulation and protection as affected'], sourceIds: ['course-c2-fault-finding'] },
    ],
    verification: [
      { kind: 'verification', title: 'Repair is not complete until the evidence closes the loop', purpose: 'Demonstrate that the diagnosed cause was corrected without introducing another defect and that all affected safety functions remain satisfactory.', safeState: 'Use the dead or controlled-live state required by each retest; a successful repair does not authorize skipping safe isolation.', instrument: 'Same appropriate installation-test instruments used to establish the fault, plus functional/load measurements where required.', method: ['Repeat the measurement that originally demonstrated the fault.', 'Repeat all upstream/downstream tests that the repair could have affected.', 'Confirm conductor identification and protective continuity after reconnection.', 'Repeat insulation/polarity/ring tests where disturbed.', 'Repeat Zs/PFC/RCD checks where the protective path/device was affected.', 'Carry out controlled functional/load check only after prerequisite safety tests pass.', 'Record final values, repair location and any remaining limitation.'], expected: 'Original abnormal evidence is removed, affected protective requirements remain valid and the repaired circuit behaves as intended.', abnormal: 'A changed symptom, inconsistent reading or new protective-device operation means the diagnosis/repair is incomplete.', nextAction: 'Return to the hypothesis/sectionalizing process rather than forcing operation or bypassing protection.', sourceIds: ['course-c2-fault-finding','course-c2-testing'] },
    ],
    'common-confusions': [
      { kind: 'table', title: 'Fault-finding habits to reject', columns: ['Bad habit','Better method'], rows: [
        ['Reset breaker/RCD repeatedly','Treat operation as evidence; identify the current path/cause before re-energizing.'],
        ['Replace the accessory first','Trace supply/path and prove which component or conductor is defective.'],
        ['One fault explains every abnormal reading','Keep continuity, insulation, polarity and load faults as separate hypotheses until evidence links them.'],
        ['High-impedance voltmeter reading proves supply','Confirm whether the source can support a firm voltage with an appropriate verification method.'],
        ['Thermal image proves loose connection','Use thermal pattern as a symptom and correlate with load/electrical/physical evidence.'],
        ['Bypass protection to keep equipment running','Never defeat a protective function; repair the cause and verify before service.'],
      ], sourceIds: ['course-c2-fault-finding'] },
    ],
    sources: [
      { kind: 'prose', title: 'Source discipline for C2-09', paragraphs: ['Fault finding reuses the same current standards and test methods taught in C2-05 and C2-08; there is no separate “fault-finding number table.” The course lessons provide symptom patterns and diagnostic examples, while current OSG protection/testing sources govern how the relevant measurements are safely made and interpreted.', 'Older equipment/material examples are diagnostic context, not automatic replacement rules. A repair decision must follow current installation requirements, product condition/manufacturer evidence and complete post-repair verification.'], sourceIds: ['epra-c2-competencies','course-c2-fault-finding','osg-initial-verification','osg-protection','osg-rcd-operation'] },
    ],
  },
}];
