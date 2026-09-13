import { learningSections } from './learning-sections';
import type { CanonicalTerm, OverviewFormula, OverviewSection } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

const stageId = 'C2-06';
const sectionId = 'c2-06-single-phase-circuit-design';
const moduleId = 'module-06';
const groups = learningSections.filter(section => section.moduleId === moduleId);
const lessonIds = [...new Set(groups.flatMap(section => section.lessonIds))];

const reviewed = (lessons: string[], relatedTermIds: string[] = [], formulaIds: string[] = []): Partial<CanonicalTerm> => ({
  editorialStatus: 'reviewed', stageIds: [stageId], sectionIds: [sectionId], lessonIds: lessons, relatedTermIds, formulaIds,
});

export const c206TermPatches: Record<string, Partial<CanonicalTerm>> = {
  ib: {
    ...reviewed(['p06-l01','p06-l02','p06-l03'], ['in','iz','connected-load','glossary-maximum-demand','power-factor'], ['single-phase-design-current','overload-coordination']),
    sourceIds: ['course-vocabulary','course-c2-design','eca-c4-design-current'],
    standardsMeaning: 'Ib is the circuit design current: the current expected to be carried under the stated intended load and operating assumptions used for the design.',
    plainMeaning: 'Ib is the load current the circuit is being designed around. It comes from the load model, not from choosing a breaker first.',
    practicalExample: 'For a stated 4.8 kW single-phase load at 240 V and PF 1.0, Ib = 4800/240 = 20 A before any other circuit checks.',
    explainAloud: 'Why must Ib be justified from the load before In and the cable are selected?',
  },
  in: {
    ...reviewed(['p06-l04','p06-l10'], ['ib','iz','mcb','fuse','glossary-breaking-capacity'], ['overload-coordination']),
    sourceIds: ['course-vocabulary','course-c2-design','osg-protection'],
    standardsMeaning: 'In is the protective-device rated current or selected current setting relevant to the overload-coordination check.',
    plainMeaning: 'In belongs to the protective device. It must carry the design load while still coordinating with the cable and the rest of the protection requirements.',
    practicalExample: 'Selecting a larger breaker merely to stop nuisance operation can violate cable protection even when the load still works.',
    explainAloud: 'What three separate questions must be answered before increasing a protective-device current rating?',
  },
  iz: {
    ...reviewed(['p06-l04','p06-l10'], ['ib','in','tabulated-current-capacity','correction-factor','installation-method'], ['overload-coordination','required-tabulated-capacity']),
    sourceIds: ['course-vocabulary','course-c2-cables','course-c2-design','osg-current-capacity-voltage-drop'],
    standardsMeaning: 'Iz is the current-carrying capacity of the selected conductor for the actual installation conditions after applicable corrections are considered.',
    plainMeaning: 'Iz is the usable cable capacity in the real route, not a memorized number attached to conductor size.',
    practicalExample: 'A cable with adequate tabulated capacity can have insufficient Iz after grouping or thermal-insulation effects are applied.',
    explainAloud: 'Distinguish It from Iz and explain why the route affects the second value.',
  },
  'voltage-drop': {
    ...reviewed(['p06-l07','p06-l08'], ['ib','tabulated-current-capacity','installation-method'], ['single-phase-voltage-drop','voltage-drop-percent']),
    sourceIds: ['course-vocabulary','course-c2-cables','course-c2-design','osg-current-capacity-voltage-drop'],
    practicalExample: 'At the same current and conductor type, increasing circuit length increases voltage drop; a cable that passes the thermal check may still need a larger section for voltage-drop performance.',
    explainAloud: 'Why can a circuit pass Ib/In/Iz and still require a different cable?',
  },
  'glossary-maximum-demand': {
    ...reviewed(['p06-l11','p06-l12','p10-l09'], ['connected-load','glossary-diversity','ib','design-assumptions']),
    sourceIds: ['course-vocabulary','course-c2-foundations','course-c2-design','schneider-demand-factors','osg-demand-diversity'],
    practicalExample: 'Maximum demand is assessed from credible simultaneous use; it is not obtained by automatically summing every nameplate and it must not be reduced twice by overlapping diversity assumptions.',
  },
  'glossary-diversity': {
    ...reviewed(['p06-l11','p06-l12','p11-v2-l07'], ['glossary-maximum-demand','connected-load','design-assumptions']),
    sourceIds: ['course-vocabulary','course-c2-foundations','course-c2-design','schneider-demand-factors','osg-demand-diversity'],
    practicalExample: 'A documented cooking-load diversity assumption changes assessed demand; it does not reduce the appliance rating or remove cable/protection checks.',
  },
};

const newTerm = (id: string, term: string, aliases: string[], standardsMeaning: string, plainMeaning: string, category: string, options: Partial<PreservedCanonicalTerm> = {}): PreservedCanonicalTerm => ({
  id, term, aliases, definition: standardsMeaning, category, authority: 'explanatory-definition', editorialStatus: 'reviewed', standardsMeaning, plainMeaning,
  practicalExample: options.practicalExample, notTheSameAs: options.notTheSameAs ?? [], relatedTermIds: options.relatedTermIds ?? [], sourceIds: options.sourceIds ?? ['course-c2-design'],
  formulaIds: options.formulaIds ?? [], stageIds: [stageId], sectionIds: [sectionId], lessonIds: options.lessonIds ?? [], kenyaStatus: options.kenyaStatus ?? 'check-kenyan-requirement',
  explainAloud: options.explainAloud, contrast: options.contrast, unit: options.unit, formula: options.formula, formulaTex: options.formulaTex, formulaNote: options.formulaNote,
});

export const c206AdditionalTerms: PreservedCanonicalTerm[] = [
  newTerm('tabulated-current-capacity', 'Tabulated current-carrying capacity (It)', ['It','tabulated current capacity','tabulated cable capacity'], 'It is the current-carrying capacity taken from the applicable cable data for the stated reference installation conditions before the relevant correction factors for the actual route are applied.', 'It is the starting table value. The design then checks whether that reference capacity is large enough once the real installation conditions are accounted for.', 'Design', {
    sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop'], formulaIds: ['required-tabulated-capacity'], relatedTermIds: ['iz','correction-factor','installation-method'],
    practicalExample: 'If applicable factors reduce usable capacity, the required It can be higher than the protective-device current.', explainAloud: 'Why is a table value not automatically the final Iz of the installed cable?',
  }),
  newTerm('design-assumptions', 'Design assumptions register', ['design assumptions','assumptions register'], 'A design assumptions register records uncertain or provisional inputs that materially affect calculations, selection or verification so they can be confirmed, revised and handed over explicitly.', 'Write down what the design is relying on instead of allowing guessed inputs to become invisible facts.', 'Design', {
    lessonIds: ['p06-l01','p10-l09'], relatedTermIds: ['glossary-maximum-demand','installation-method','design-evidence'],
    practicalExample: 'Supply earthing arrangement, route length, installation method, future load and diversity method can all be recorded as assumptions pending confirmation.', explainAloud: 'Why is an undocumented assumption more dangerous than a clearly stated provisional value?',
  }),
  newTerm('fault-thermal-withstand', 'Conductor fault thermal withstand', ['fault withstand','adiabatic check','thermal fault withstand'], 'Fault thermal withstand is the check that a conductor can withstand the thermal energy let through by a fault until the protective device disconnects, using the applicable material/insulation constant and fault duration/current model.', 'The conductor must survive the fault long enough for the protection to clear it; normal current capacity alone does not prove this.', 'Design', {
    sourceIds: ['course-c2-design','osg-protection'], formulaIds: ['adiabatic-cpc'], relatedTermIds: ['cpc','ads','zs','glossary-breaking-capacity'],
    practicalExample: 'A CPC can be smaller than the line conductor only when the complete sizing method still proves mechanical and thermal suitability for the fault duty.', explainAloud: 'Why is normal load current the wrong input for a CPC fault-withstand check?',
  }),
  newTerm('design-evidence', 'Circuit design evidence', ['design record','design evidence'], 'Circuit design evidence is the traceable record of supply data, load assumptions, calculations, selected devices/cables, manufacturer information and verification criteria that supports the final circuit design.', 'Another competent person should be able to see why each major design choice was made and which source/assumption supports it.', 'Documentation', {
    lessonIds: ['p06-l15'], relatedTermIds: ['design-assumptions','ib','in','iz','voltage-drop','pfc'],
    practicalExample: 'A complete worksheet records Ib, In, installation method, factors, selected cable data, voltage drop, Zs/fault duty, device breaking capacity and unresolved assumptions.', explainAloud: 'What evidence should remain after the arithmetic so another electrician can audit the design?',
  }),
];

export const c206Formulas: OverviewFormula[] = [
  {
    id: 'overload-coordination', expression: 'Ib ≤ In ≤ Iz',
    assumptions: ['Applies as a core overload-coordination relationship where the selected protective device is intended to provide overload protection for the conductor.', 'It is not the complete design: voltage drop, fault protection, breaking capacity, thermal withstand and other applicable requirements remain separate checks.'],
    variables: [
      { symbol: 'Ib', meaning: 'design current', unit: 'A', termId: 'ib' },
      { symbol: 'In', meaning: 'protective-device rated current or selected setting', unit: 'A', termId: 'in' },
      { symbol: 'Iz', meaning: 'current-carrying capacity under actual installation conditions', unit: 'A', termId: 'iz' },
    ], sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop'],
  },
  {
    id: 'required-tabulated-capacity', expression: 'It(required) ≥ In / (C1 × C2 × … × Cn)',
    assumptions: ['Use only correction factors that apply to the actual cable, installation method and protective arrangement.', 'The exact factor symbols and combination method must follow the current applicable cable data/standard; do not copy factors from an unrelated example.', 'Special cases can alter the sizing method, so this relationship is a general design model rather than a substitute for the governing table notes.'],
    variables: [
      { symbol: 'It(required)', meaning: 'minimum required tabulated current-carrying capacity', unit: 'A', termId: 'tabulated-current-capacity' },
      { symbol: 'In', meaning: 'protective-device current used in the stated sizing method', unit: 'A', termId: 'in' },
      { symbol: 'C1…Cn', meaning: 'applicable correction factors for the stated installation conditions', unit: 'dimensionless', termId: 'correction-factor' },
    ], sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop'],
  },
  {
    id: 'single-phase-voltage-drop', expression: 'ΔV = (mV/A/m × Ib × L) / 1000',
    assumptions: ['Use a verified tabulated mV/A/m value suitable for the conductor, circuit and stated operating condition.', 'L is the circuit length used by the applicable tabulated method; do not add an extra return length when the selected table value already incorporates the circuit arrangement.', 'For loads or cable arrangements where reactance/phase angle materially matters, use the appropriate method/data rather than this simplified form.'],
    variables: [
      { symbol: 'ΔV', meaning: 'calculated voltage drop', unit: 'V', termId: 'voltage-drop' },
      { symbol: 'mV/A/m', meaning: 'verified tabulated voltage-drop value', unit: 'mV/A/m' },
      { symbol: 'Ib', meaning: 'design current used for the voltage-drop calculation', unit: 'A', termId: 'ib' },
      { symbol: 'L', meaning: 'circuit length according to the stated method', unit: 'm' },
    ], sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop'],
  },
  {
    id: 'voltage-drop-percent', expression: 'ΔV% = 100 × ΔV / Vn',
    assumptions: ['Compare the result with the limit applicable to the circuit and installation; this Overview does not invent a universal percentage limit.', 'Use the same nominal voltage basis stated for the design.'],
    variables: [
      { symbol: 'ΔV%', meaning: 'voltage drop expressed as a percentage', unit: '%' },
      { symbol: 'ΔV', meaning: 'calculated voltage drop', unit: 'V', termId: 'voltage-drop' },
      { symbol: 'Vn', meaning: 'nominal circuit voltage used for comparison', unit: 'V' },
    ], sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop'],
  },
  {
    id: 'adiabatic-cpc', expression: 'S ≥ √(I²t) / k',
    assumptions: ['Use the fault current, disconnection time and k value applicable to the stated conductor material/insulation/temperature conditions.', 'The method is a thermal check; mechanical minimum sizes and other conductor requirements still apply.', 'Protective-device let-through data may be required where the simple constant-current/time model is not appropriate.'],
    variables: [
      { symbol: 'S', meaning: 'minimum conductor cross-sectional area from the stated thermal check', unit: 'mm²' },
      { symbol: 'I', meaning: 'fault current used in the stated check', unit: 'A' },
      { symbol: 't', meaning: 'fault disconnection duration', unit: 's' },
      { symbol: 'k', meaning: 'material/insulation constant for the stated conditions', unit: 'A·√s/mm²' },
    ], sourceIds: ['course-c2-design','osg-protection'],
  },
];

export const c206Sections: OverviewSection[] = [{
  id: sectionId, stageId, moduleId, learningSectionIds: groups.map(section => section.id), title: 'Single-Phase Circuit Design', status: 'reviewed', lessonIds,
  termIds: ['connected-load','glossary-maximum-demand','glossary-diversity','power-factor','design-assumptions','ib','in','iz','tabulated-current-capacity','installation-method','correction-factor','ambient-temperature-factor','grouping-factor','thermal-insulation-factor','voltage-drop','fault-thermal-withstand','cpc','ads','zs','pfc','pscc','pefc','glossary-breaking-capacity','selectivity','design-evidence'],
  sourceIds: ['epra-c2-competencies','course-c2-design','course-c2-cables','course-c2-protection','osg-demand-diversity','osg-current-capacity-voltage-drop','osg-protection','osg-zs-appendix'],
  relatedSectionIds: ['c2-05-faults-protective-devices-earthing-ads'], prerequisiteSectionIds: ['c2-05-faults-protective-devices-earthing-ads'],
  coverage: [
    { competency: 'Calculate and justify single-phase design current from power, voltage and power factor using the stated load assumptions.', referenceIds: ['epra-c2-competencies','course-c2-design'], teachingPage: 'engineering-rules' },
    { competency: 'Apply maximum demand, diversity/utilization reasoning without double-counting reductions or confusing connected load with demand.', referenceIds: ['epra-c2-competencies','osg-demand-diversity'], teachingPage: 'relationships' },
    { competency: 'Coordinate protective-device current and cable current-carrying capacity using installation method and applicable correction factors.', referenceIds: ['epra-c2-competencies','osg-current-capacity-voltage-drop'], teachingPage: 'engineering-rules' },
    { competency: 'Complete voltage-drop, fault-protection, thermal-withstand and breaking-capacity checks before documenting the final circuit selection.', referenceIds: ['course-c2-design','osg-protection','osg-zs-appendix'], teachingPage: 'verification' },
  ],
  pages: {
    'system-model': [
      { kind: 'flow', title: 'The complete C2 design chain', steps: ['Define supply, load, environment and route', 'Assess connected load and credible maximum demand', 'Calculate design current Ib', 'Choose candidate protective device In', 'Choose installation method', 'Apply relevant correction factors / required It', 'Select conductor and confirm Iz', 'Check voltage drop', 'Check fault thermal withstand / CPC', 'Check ADS and Zs/fault current', 'Check breaking capacity and coordination', 'Record design evidence and assumptions'], sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop','osg-protection'] },
    ],
    definitions: [
      { kind: 'table', title: 'Do not mix the current symbols', columns: ['Symbol/concept','Meaning in the design','Common error'], rows: [
        ['Ib','Current the circuit is designed to carry for the stated load','Choosing it from a breaker catalogue'],
        ['In','Protective-device rated current or selected setting','Treating it as cable capacity'],
        ['It','Reference/tabulated cable capacity before applicable corrections','Treating it as final installed capacity'],
        ['Iz','Usable conductor capacity for the actual installation conditions','Assuming conductor size alone fixes it'],
        ['PFC','Prospective fault current at the selected point','Confusing it with normal load current'],
      ], sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop','course-c2-protection'] },
    ],
    relationships: [
      { kind: 'flow', title: 'Load assessment feeds cable design once', steps: ['Connected equipment ratings', 'Usage/duty evidence', 'Maximum demand / diversity method', 'Design current Ib', 'Protective-device and cable design'], sourceIds: ['course-c2-design','osg-demand-diversity'] },
      { kind: 'prose', title: 'One physical reason per correction factor', paragraphs: [
        'Every correction factor must correspond to an actual condition such as ambient temperature, grouping or thermal insulation. A factor copied from another installation has no engineering meaning.',
        'Do not apply the same reduction twice. If a verified table/method already incorporates a condition, follow its notes rather than multiplying an extra factor by habit.',
      ], sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop'] },
    ],
    'engineering-rules': [
      { kind: 'formula', formulaId: 'single-phase-design-current' },
      { kind: 'formula', formulaId: 'overload-coordination' },
      { kind: 'formula', formulaId: 'required-tabulated-capacity' },
      { kind: 'formula', formulaId: 'single-phase-voltage-drop' },
      { kind: 'formula', formulaId: 'voltage-drop-percent' },
      { kind: 'formula', formulaId: 'adiabatic-cpc' },
      { kind: 'prose', title: 'The 240 V study convention', paragraphs: ['Worked single-phase course examples use 240 V where the exercise specifies the Kenyan study convention. The actual supply characteristics for a real project must still be established and documented before final design.'], sourceIds: ['course-c2-design'] },
    ],
    application: [
      { kind: 'flow', title: 'Worked design skeleton — 4.8 kW single-phase load', steps: ['Given: 4.8 kW, 240 V, PF 1.0 → Ib = 20 A', 'Select a candidate In that satisfies the load and applicable protective requirements', 'Identify route/reference method before opening cable tables', 'Apply only the correction factors that actually apply', 'Select a conductor whose verified It/Iz satisfies the overload check', 'Calculate voltage drop using the verified mV/A/m value and actual route length', 'Check CPC/fault thermal withstand where required', 'Use Zs/fault evidence to verify ADS', 'Compare prospective fault current with device breaking duty', 'Record the source of every table value and any unresolved assumption'], sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop','osg-protection'] },
      { kind: 'prose', title: 'Why this Overview does not give a memorized cable-size answer', paragraphs: ['Without the actual installation method, grouping, ambient/insulation conditions, route length, protective device, fault level and current cable-table data, a single cable size would be false precision. EPRA-style competence is the justified sequence, not a memorized “kW equals mm²” rule.'], sourceIds: ['course-c2-design'] },
    ],
    verification: [
      { kind: 'verification', title: 'Audit a finished circuit design', purpose: 'Prove that every selection can be traced to a load assumption, source value and protective requirement.', safeState: 'This is a design-document review; site measurements used as inputs must have been obtained under the appropriate safe procedure.', instrument: 'Design worksheet, current applicable cable/protective-device data, drawings, manufacturer information and verified supply/test evidence.', method: ['Check supply voltage/phase/earthing/fault data source.', 'Check connected load, maximum-demand/diversity assumptions and PF.', 'Recalculate Ib.', 'Verify In and its complete protective characteristics.', 'Verify installation method and each correction factor.', 'Confirm It/Iz and the selected conductor data.', 'Recalculate voltage drop.', 'Review CPC/thermal and ADS/Zs checks.', 'Compare PFC with breaking capacity/verified combination.', 'Check selectivity where claimed.', 'Confirm assumptions, labels and documentation are complete.'], expected: 'Every step is reproducible and all applicable thermal, voltage and fault-protection checks are satisfactory.', abnormal: 'Missing table source, guessed installation method, double diversity, unverified PFC, failed voltage drop or contradictory Ib/In/Iz means the design is incomplete.', nextAction: 'Correct the governing assumption/selection and repeat all downstream checks affected by the change.', sourceIds: ['course-c2-design','osg-current-capacity-voltage-drop','osg-protection','osg-zs-appendix'] },
    ],
    'common-confusions': [
      { kind: 'table', title: 'Design errors to eliminate', columns: ['Mistake','Correction'], rows: [
        ['“Choose cable from kW.”','Calculate Ib, choose protection, determine method/factors, then select and verify the conductor.'],
        ['“It equals Iz.”','It is reference/tabulated capacity; Iz is capacity for the actual installation conditions.'],
        ['“Ib ≤ In ≤ Iz completes the design.”','It is one overload check; voltage drop, ADS, fault withstand and breaking capacity still remain.'],
        ['“Diversity reduces the appliance rating.”','Diversity estimates demand under a stated use model; equipment ratings and other checks remain.'],
        ['“Voltage-drop limit is always one remembered percentage.”','Use the limit applicable to the circuit/standard/project; document the source.'],
        ['“Higher breaker fixes tripping.”','Changing In can invalidate cable protection, ADS and selectivity; diagnose before changing protection.'],
      ], sourceIds: ['course-c2-design'] },
    ],
    sources: [
      { kind: 'prose', title: 'Source discipline for C2-06', paragraphs: [
        'EPRA establishes the C2 design-calculation competency. The current IET On-Site Guide is the technical baseline for cable current capacity, voltage drop and protection where consistent with Kenyan requirements. Course bridge material supplies the explicit demand/diversity terminology and reasoning chain.',
        'The available current OSG PDF does not contain the appendix table pages needed for exact current-carrying-capacity and voltage-drop lookups. Therefore this Overview teaches the method and variables but does not invent or copy numerical cable tables. Exact table values must come from the complete current source used for the real design.',
      ], sourceIds: ['epra-c2-competencies','course-c2-design','osg-demand-diversity','osg-current-capacity-voltage-drop','osg-protection'] },
    ],
  },
}];
