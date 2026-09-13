import { learningSections } from './learning-sections';
import type { CanonicalTerm, OverviewFormula, OverviewSection } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

const stageId = 'C2-04';
const sectionId = 'c2-04-cable-systems-containment-installation-methods';
const moduleId = 'module-04';
const groups = learningSections.filter(section => section.moduleId === moduleId);
const lessonIds = [...new Set(groups.flatMap(section => section.lessonIds))];

const reviewed = (lessonIds: string[], relatedTermIds: string[] = [], formulaIds: string[] = []): Partial<CanonicalTerm> => ({
  editorialStatus: 'reviewed', stageIds: [stageId], sectionIds: [sectionId], lessonIds, relatedTermIds, formulaIds,
});

export const c204TermPatches: Record<string, Partial<CanonicalTerm>> = {
  swa: {
    ...reviewed(['p04-l11','p04-l12','p04-l13','p04-l14'], ['armour','swa-gland','cable-support','bend-radius','cpc']),
    sourceIds: ['course-vocabulary','course-c2-cables','osg-cable-types','osg-cable-supports'],
    standardsMeaning: 'Steel-wire-armoured (SWA) cable is a multi-layer cable system with insulated cores and steel wire armour providing mechanical protection; the armour and termination arrangement may also form part of the designed protective-conductor path when verified as suitable.',
    plainMeaning: 'SWA is not “ordinary cable with metal around it.” The cores, bedding, armour, sheath, glands, supports and earthing arrangement all have separate jobs.',
    practicalExample: 'A correctly selected SWA route to an outbuilding needs suitable cable rating, bend radius, cleats/supports, a gland for the cable and environment, and a verified protective path.',
    explainAloud: 'Name the main SWA layers and explain why armour continuity, mechanical support and conductor insulation are different requirements.',
  },
  conduit: {
    ...reviewed(['p04-l01','p04-l02','p04-l03','p04-l04','p04-l05','p04-l06','p04-l18'], ['trunking','cable-tray','installation-method','bend-radius','cable-support']),
    sourceIds: ['course-vocabulary','course-c2-cables','osg-conduit-trunking'],
    standardsMeaning: 'Conduit is a closed wiring-system enclosure intended to route and protect insulated conductors or cables, with fittings, bends, supports and entries forming part of the complete system.',
    plainMeaning: 'The tube alone is not the installation. Size, bends, pulling access, fittings, support, environment and conductor protection all matter.',
    practicalExample: 'A PVC conduit run can pass a capacity calculation yet still be impractical if it has too many tight bends or no allowance for thermal expansion.',
    explainAloud: 'Why can a conduit be large enough by a fill calculation but still be a poor installation choice?',
  },
  trunking: {
    ...reviewed(['p04-l07','p04-l10'], ['conduit','cable-tray','installation-method','segregation','grouping-factor']),
    sourceIds: ['course-vocabulary','course-c2-cables','osg-conduit-trunking'],
    standardsMeaning: 'Trunking is an enclosure wiring system that routes and protects conductors/cables and normally provides removable access along part of its route.',
    plainMeaning: 'Trunking gives shared enclosed space, but usable space, grouping, segregation, bends, joints and future access are separate checks.',
    practicalExample: 'A trunking run may have spare physical space while still requiring a thermal grouping assessment for several loaded circuits.',
    explainAloud: 'Why is “the cables fit inside” not enough evidence that a trunking design is satisfactory?',
  },
  'cable-tray': {
    ...reviewed(['p04-l08'], ['trunking','conduit','cable-support','bend-radius']),
    sourceIds: ['course-vocabulary','course-c2-cables','osg-cable-supports'],
    standardsMeaning: 'Cable tray is an open support system used to carry cables along a planned route; supports, fabricated changes of direction, edge condition, corrosion protection and cable restraint are part of the installation.',
    plainMeaning: 'Tray supports the cable rather than enclosing it. It must guide the route without creating sharp edges, poor bends or unsupported spans.',
    practicalExample: 'After fabricating a tray bend, inspect alignment, joint strength, burrs, coating damage and whether the cable can maintain its required bend radius.',
    explainAloud: 'What should be inspected on a fabricated metallic tray bend before any cable is installed?',
  },
  iz: {
    ...reviewed([], ['installation-method','correction-factor','ambient-temperature-factor','grouping-factor','thermal-insulation-factor'], ['corrected-current-capacity']),
    sourceIds: ['course-vocabulary','course-c2-cables','osg-current-capacity-voltage-drop'],
    standardsMeaning: 'Iz is the current-carrying capacity of a conductor for the actual installation conditions being considered.',
    plainMeaning: 'Iz is not a number that belongs to cable size alone. The same conductor can have different usable capacity when its installation conditions change.',
    practicalExample: 'Grouping several loaded circuits or surrounding a cable with thermal insulation can reduce the usable current capacity compared with a reference installation condition.',
    explainAloud: 'Why can two identical cables have different Iz values when installed by different methods?',
  },
  'voltage-drop': {
    ...reviewed([], ['installation-method','glossary-current','glossary-resistance']),
    sourceIds: ['course-vocabulary','course-c2-cables','osg-current-capacity-voltage-drop'],
    practicalExample: 'Longer routes and higher current increase voltage drop for the same conductor arrangement; a cable that passes a thermal capacity check can still require a larger conductor for voltage-drop reasons.',
    explainAloud: 'Why is cable current capacity only one part of deciding whether a conductor is suitable for a long route?',
  },
  'concealed-services': {
    ...reviewed(['p04-l18'], ['conduit','trunking','installation-method']),
    sourceIds: ['course-vocabulary','course-c2-architecture','course-c2-cables'],
    practicalExample: 'A concealed conduit route should be planned so future work can understand where services are likely to run; the route still requires safe detection before drilling or chasing.',
  },
};

const newTerm = (id: string, term: string, aliases: string[], standardsMeaning: string, plainMeaning: string, category: string, options: Partial<PreservedCanonicalTerm> = {}): PreservedCanonicalTerm => ({
  id, term, aliases, definition: standardsMeaning, category,
  authority: 'explanatory-definition', editorialStatus: 'reviewed', standardsMeaning, plainMeaning,
  practicalExample: options.practicalExample, notTheSameAs: options.notTheSameAs ?? [], relatedTermIds: options.relatedTermIds ?? [],
  sourceIds: options.sourceIds ?? ['course-c2-cables'], formulaIds: options.formulaIds ?? [], stageIds: [stageId], sectionIds: [sectionId],
  lessonIds: options.lessonIds ?? [], kenyaStatus: options.kenyaStatus ?? 'check-kenyan-requirement', explainAloud: options.explainAloud,
  contrast: options.contrast, unit: options.unit, formula: options.formula, formulaTex: options.formulaTex, formulaNote: options.formulaNote,
});

export const c204AdditionalTerms: PreservedCanonicalTerm[] = [
  newTerm('cable-system', 'Cable / wiring system', ['cable system','wiring system'], 'A wiring system is the coordinated set of conductors/cables together with their containment, supports, joints, terminations and associated installation method used to carry electrical energy or signals.', 'Choose the whole route and construction, not just a conductor cross-section.', 'Installation', {
    lessonIds: ['p02-l01'], relatedTermIds: ['installation-method','conduit','trunking','cable-tray','swa'],
    practicalExample: 'The same electrical load might use insulated singles in conduit, a sheathed multicore cable or SWA depending on route, environment, mechanical risk and maintenance needs.',
    explainAloud: 'Why is choosing a cable size before choosing the wiring system and installation method incomplete?',
  }),
  newTerm('insulation', 'Conductor insulation', ['insulation','cable insulation'], 'Electrical insulation is material arranged to limit current flow between conductive parts that should remain electrically separated under the specified operating conditions.', 'Insulation keeps intended conductors electrically separated. Damage, excessive temperature or unsuitable material can turn an electrical separation into a fault path.', 'Installation', {
    lessonIds: ['p02-l01'], relatedTermIds: ['outer-sheath','armour'], practicalExample: 'A sharp conduit burr can damage conductor insulation even when the metal conduit itself looks mechanically sound.', explainAloud: 'Distinguish conductor insulation from the outer sheath of a cable.',
  }),
  newTerm('outer-sheath', 'Outer sheath', ['sheath','outer sheath'], 'The outer sheath is the external covering of a cable intended to provide specified mechanical/environmental protection to the cable construction; it is not normally the primary insulation between live conductors.', 'The sheath protects the cable as an assembly. The core insulation performs the main electrical separation between conductors.', 'Installation', {
    lessonIds: ['p02-l01','p04-l11'], relatedTermIds: ['insulation','armour'], practicalExample: 'A CW-type SWA gland arrangement is selected where the outer sheath requires environmental sealing at an exposed entry, subject to the actual product system.', explainAloud: 'Why does an intact outer sheath not prove that the core insulation is undamaged?',
  }),
  newTerm('armour', 'Cable armour', ['armour','armor','steel wire armour'], 'Cable armour is a metallic layer provided primarily for mechanical protection and, where the designed arrangement permits, may also contribute to the protective conductor/fault-current path.', 'Armour protects the cable mechanically; using it electrically requires deliberate design and sound terminations, not assumption.', 'Installation', {
    lessonIds: ['p04-l11','p04-l12','p04-l13'], relatedTermIds: ['swa','swa-gland','cpc'], notTheSameAs: [{ termId: 'insulation', distinction: 'Armour is a mechanical/protective metallic layer; insulation electrically separates conductive parts.' }],
    practicalExample: 'Poorly seated armour wires at a gland can weaken both mechanical retention and any intended protective continuity.', explainAloud: 'Why must the armour function be checked separately from the core insulation function?',
  }),
  newTerm('installation-method', 'Installation method', ['reference method','installation method'], 'Installation method describes how and where a cable is installed because heat dissipation, mechanical/environmental exposure and accessibility depend on that arrangement.', 'A cable clipped in free air, enclosed in conduit, grouped with other circuits or surrounded by insulation does not cool in the same way.', 'Design', {
    sourceIds: ['course-c2-cables','osg-cable-types','osg-current-capacity-voltage-drop'], lessonIds: ['p04-l09','p04-l10'], relatedTermIds: ['iz','correction-factor','cable-system'],
    practicalExample: 'The selected cable table/reference condition must correspond to the actual route rather than to a convenient but different installation method.', explainAloud: 'Why does installation method affect cable current-carrying capacity?',
  }),
  newTerm('correction-factor', 'Correction factor', ['derating factor','correction factor'], 'A correction factor adjusts a reference/tabulated cable capacity for a stated departure from the reference conditions; only factors applicable to the actual design are used.', 'Start with data for a reference condition, then account for conditions such as ambient temperature, grouping or thermal insulation where applicable.', 'Design', {
    sourceIds: ['course-c2-cables','osg-current-capacity-voltage-drop'], formulaIds: ['corrected-current-capacity'], relatedTermIds: ['ambient-temperature-factor','grouping-factor','thermal-insulation-factor','iz','installation-method'],
    practicalExample: 'A grouped route in a warmer environment can require a cable with a higher tabulated capacity than the protective-device rating alone suggests.', explainAloud: 'Why must every factor have a stated physical reason instead of being copied from another circuit calculation?',
  }),
  newTerm('ambient-temperature-factor', 'Ambient-temperature correction', ['ambient factor','temperature factor'], 'Ambient-temperature correction accounts for the effect of the surrounding temperature on a cable’s ability to dissipate heat relative to the table reference conditions.', 'A hotter environment leaves less thermal margin before the conductor reaches its permitted temperature.', 'Design', {
    sourceIds: ['course-c2-cables','osg-current-capacity-voltage-drop'], relatedTermIds: ['correction-factor','iz'], practicalExample: 'A cable routed through a hot roof space may require a different correction than the same cable in a cooler location.', explainAloud: 'What physical change makes a high ambient temperature reduce usable cable current capacity?',
  }),
  newTerm('grouping-factor', 'Grouping correction', ['grouping factor','grouping'], 'Grouping correction accounts for the additional heating interaction when multiple loaded circuits/cables are installed close enough that they cannot dissipate heat as independently as the reference condition assumes.', 'Cables warming each other may need reduced allowable loading or a different arrangement.', 'Design', {
    sourceIds: ['course-c2-cables','osg-current-capacity-voltage-drop'], relatedTermIds: ['correction-factor','iz','trunking'], practicalExample: 'Several heavily loaded circuits bundled tightly in trunking can run hotter than one isolated circuit.', explainAloud: 'Why can neat tight bundling be thermally worse than a more separated arrangement?',
  }),
  newTerm('thermal-insulation-factor', 'Thermal-insulation correction', ['thermal insulation factor','insulation derating'], 'Thermal-insulation correction accounts for restricted heat dissipation when a cable is in contact with or surrounded by building thermal insulation under the stated installation condition.', 'Building insulation can trap cable heat, so a cable hidden in insulation may carry less current safely than the same cable in open air.', 'Design', {
    sourceIds: ['course-c2-cables','osg-current-capacity-voltage-drop'], relatedTermIds: ['correction-factor','iz'], practicalExample: 'A cable crossing an insulated ceiling zone must be assessed for the actual extent and manner of contact with insulation.', explainAloud: 'Why is “it is only a short section through insulation” still a design input that must be checked rather than ignored?',
  }),
  newTerm('bend-radius', 'Minimum bend radius', ['bend radius','minimum bend radius'], 'Minimum bend radius is the smallest permitted bend for the specified cable or wiring system under its installation conditions, as set by the applicable product/manufacturer data or standard.', 'Bending too tightly can distort armour, insulation, sheath or conductor geometry and make pulling/termination more difficult.', 'Installation', {
    lessonIds: ['p04-l03','p04-l06','p04-l08','p04-l14'], relatedTermIds: ['swa','conduit','cable-tray'], practicalExample: 'A heavy SWA route needs supports positioned so the cable changes direction without forcing the gland or violating the cable’s specified bend radius.', explainAloud: 'What damage can a too-tight bend cause even when the cable does not visibly break?',
  }),
  newTerm('cable-support', 'Cable support', ['cable support','cleat','saddle'], 'Cable support is the mechanical arrangement that carries the cable/wiring-system weight and expected forces at suitable intervals without damaging the cable or transferring unacceptable strain to terminations.', 'Supports carry the route so glands and terminals do not become structural supports.', 'Installation', {
    sourceIds: ['course-c2-cables','osg-cable-supports'], lessonIds: ['p04-l02','p04-l08','p04-l14'], relatedTermIds: ['bend-radius','swa','cable-tray'], practicalExample: 'A long vertical SWA run needs properly selected cleats/supports; the bottom gland must not be expected to carry the cable weight.', explainAloud: 'Why is termination strain a sign that the support system may be wrong?',
  }),
  newTerm('segregation', 'Segregation', ['circuit segregation','segregation'], 'Segregation is the deliberate separation or partitioning of circuits/services where needed to control electrical, thermal, interference, safety or functional risks under the applicable requirements.', 'Shared containment does not mean every circuit/service may be mixed together without thought.', 'Installation', {
    lessonIds: ['p04-l10'], relatedTermIds: ['trunking','cable-system'], practicalExample: 'A trunking design may need separate compartments or spacing for circuits/services whose voltage, function or interference risk requires separation.', explainAloud: 'Why is a trunking fill calculation unable to tell you whether two services are permitted to share the same space?',
  }),
  newTerm('fire-stopping', 'Fire stopping around wiring systems', ['fire stopping','firestop'], 'Fire stopping is the restoration or preservation of the required fire-resisting performance where wiring systems penetrate or disturb fire-separating building elements.', 'A cable route can create a path for fire or smoke through a wall/floor; the penetration needs a suitable tested/approved treatment for the actual construction.', 'Installation', {
    sourceIds: ['course-c2-cables'], relatedTermIds: ['cable-system','cable-support'], practicalExample: 'Passing trunking through a fire-separating wall creates a building-safety detail that must be coordinated and sealed with the specified system, not simply filled with any sealant.', explainAloud: 'Why is fire stopping a building-performance requirement as well as an electrical-installation coordination issue?',
  }),
  newTerm('swa-gland', 'SWA gland', ['swa gland','bw gland','cw gland'], 'An SWA gland is the termination system that secures the cable entry and clamps the armour; the selected gland/accessories must suit the cable size, enclosure and environmental/protective requirements.', 'The gland provides mechanical retention and armour termination, and some gland systems also provide the required outer-sheath sealing for the environment.', 'Installation', {
    lessonIds: ['p04-l12','p04-l13'], relatedTermIds: ['swa','armour','outer-sheath','cpc'], practicalExample: 'A gland with several armour wires outside the clamping cone is not accepted merely because the nut tightens.', explainAloud: 'What must a completed SWA gland prove mechanically, environmentally and electrically?',
  }),
];

export const c204Formulas: OverviewFormula[] = [{
  id: 'corrected-current-capacity',
  expression: 'Iz = It × ΠCj',
  assumptions: [
    'It is taken from the correct current-capacity data for the cable construction and reference installation method.',
    'Only correction factors that actually apply to the route/conditions are included in the product ΠCj.',
    'This relationship is a capacity-adjustment model, not a complete cable design: voltage drop, fault protection, thermal short-circuit withstand, terminals and environmental suitability remain separate checks.',
  ],
  variables: [
    { symbol: 'Iz', meaning: 'usable current-carrying capacity under the actual conditions', unit: 'A', termId: 'iz' },
    { symbol: 'It', meaning: 'tabulated/reference current-carrying capacity', unit: 'A' },
    { symbol: 'Cj', meaning: 'each applicable correction factor', unit: 'dimensionless', termId: 'correction-factor' },
  ],
  sourceIds: ['course-c2-cables','osg-current-capacity-voltage-drop'],
}];

export const c204Sections: OverviewSection[] = [{
  id: sectionId, stageId, moduleId,
  learningSectionIds: groups.map(section => section.id),
  title: 'Cable Systems, Containment and Installation Methods', status: 'reviewed', lessonIds,
  termIds: [
    'cable-system','insulation','outer-sheath','armour','swa','swa-gland','conduit','trunking','cable-tray',
    'installation-method','iz','correction-factor','ambient-temperature-factor','grouping-factor','thermal-insulation-factor',
    'bend-radius','cable-support','segregation','fire-stopping','voltage-drop','concealed-services',
  ],
  sourceIds: ['epra-c2-competencies','course-c2-cables','osg-cable-types','osg-cable-supports','osg-conduit-trunking','osg-current-capacity-voltage-drop'],
  relatedSectionIds: ['c2-03-single-phase-wiring-accessories'], prerequisiteSectionIds: ['c2-03-single-phase-wiring-accessories'],
  coverage: [
    { competency: 'Selection of cables by construction, installation method, current-carrying conditions and external influences.', referenceIds: ['epra-c2-competencies','osg-cable-types','osg-current-capacity-voltage-drop'], teachingPage: 'engineering-rules' },
    { competency: 'Installation of conduit, trunking, cable tray and SWA with suitable support, bend, access and termination practice.', referenceIds: ['course-c2-cables','osg-cable-supports','osg-conduit-trunking'], teachingPage: 'application' },
    { competency: 'Understand that cable capacity, grouping, ambient temperature, thermal insulation and voltage drop are linked design checks rather than fixed cable-size rules.', referenceIds: ['epra-c2-competencies','osg-current-capacity-voltage-drop'], teachingPage: 'relationships' },
  ],
  pages: {
    'system-model': [
      { kind: 'flow', title: 'Choose the wiring system before judging the cable', steps: ['Load and circuit function', 'Route and environment', 'Cable construction', 'Containment/support method', 'Installation/reference method', 'Thermal correction conditions', 'Mechanical and environmental protection', 'Terminations/access', 'Later design checks: capacity, voltage drop and fault protection'], sourceIds: ['course-c2-cables','osg-cable-types'] },
      { kind: 'prose', title: 'Every layer and support has a job', paragraphs: [
        'Core conductor, insulation, bedding/fillers, armour and outer sheath are different parts of a cable construction. Do not assign one layer a function it was not designed to perform.',
        'Containment and supports are part of the wiring system. A route that is electrically adequate can still be mechanically poor if it damages insulation, violates bend limits, overloads a gland or makes inspection and pulling impractical.',
      ], sourceIds: ['course-c2-cables'] },
    ],
    definitions: [
      { kind: 'table', title: 'Compare common routing systems', columns: ['System', 'Main role', 'Design questions'], rows: [
        ['PVC conduit', 'Enclosed route/protection for singles or suitable cables', 'Fill, bends, thermal movement, support, pulling access, environment'],
        ['Steel conduit', 'Robust enclosed mechanical protection', 'Corrosion, threads/bends, continuity where relevant, fittings, support'],
        ['Trunking', 'Accessible shared enclosure', 'Capacity, grouping, segregation, bends, access, support'],
        ['Cable tray', 'Open cable support', 'Cable restraint, edges, corrosion, bend radius, support spans'],
        ['SWA', 'Armoured cable construction', 'Cable rating, armour/protective role, gland, bend radius, supports, environment'],
      ], sourceIds: ['course-c2-cables','osg-cable-types','osg-cable-supports','osg-conduit-trunking'] },
    ],
    relationships: [
      { kind: 'flow', title: 'Thermal relationship', steps: ['Reference cable data gives It', 'Actual installation differs from reference conditions', 'Applicable correction factors represent those differences', 'Corrected/usable capacity Iz is established', 'Protective-device and load coordination is checked later in the circuit-design stage'], sourceIds: ['course-c2-cables','osg-current-capacity-voltage-drop'] },
      { kind: 'formula', formulaId: 'corrected-current-capacity' },
      { kind: 'table', title: 'Physical reason behind common corrections', columns: ['Condition', 'Why it matters'], rows: [
        ['Higher ambient temperature', 'Less temperature margin is available for conductor heating'],
        ['Grouping loaded circuits', 'Nearby cables heat one another and cool less independently'],
        ['Thermal insulation', 'Building insulation restricts heat loss from the cable'],
        ['Long route', 'Does not normally derate thermal capacity by itself, but increases voltage drop and conductor impedance'],
      ], sourceIds: ['course-c2-cables','osg-current-capacity-voltage-drop'] },
    ],
    'engineering-rules': [
      { kind: 'flow', title: 'Cable-system selection chain', steps: ['Define load/current duty', 'Identify route and external influences', 'Choose cable construction', 'Choose installation/containment method', 'Identify applicable correction factors', 'Establish required current capacity', 'Check practical pulling/bending/support', 'Check environmental/mechanical/fire/segregation needs', 'Check voltage drop and fault/protection requirements', 'Document the actual route and assumptions'], sourceIds: ['course-c2-cables','osg-cable-types','osg-current-capacity-voltage-drop'] },
      { kind: 'prose', title: 'Do not turn table values into universal cable sizes', paragraphs: [
        'A conductor cross-section does not have one universal current rating. The table, cable construction, reference method and correction conditions must match the actual installation.',
        'Likewise, conduit/trunking capacity tables answer only the physical-space question they are designed to answer. They do not replace thermal grouping, segregation, bend/pulling, fire-stopping, voltage-drop or fault-protection checks.',
      ], sourceIds: ['course-c2-cables','osg-conduit-trunking','osg-current-capacity-voltage-drop'] },
    ],
    application: [
      { kind: 'flow', title: 'SWA route from board to outdoor load', steps: ['Confirm circuit duty and route', 'Select cable construction/size from the design', 'Plan support spacing and changes of direction', 'Maintain bend radius and protect exposed route', 'Select gland for cable/enclosure/environment', 'Prepare armour evenly and assemble gland', 'Provide/verify intended protective-conductor path', 'Seal entries and support cable so terminals carry no structural load', 'Inspect and test before energization'], sourceIds: ['course-c2-cables','osg-cable-supports'] },
      { kind: 'flow', title: 'Conduit/trunking route review', steps: ['Draw conductor journey before pulling', 'Check capacity', 'Count bends and pulling/access points', 'Check support and thermal movement', 'Check grouping and segregation', 'Deburr/finish every fabricated edge', 'Protect fire/acoustic/weather barriers at penetrations', 'Confirm conductor identification and maintainability'], sourceIds: ['course-c2-cables','osg-conduit-trunking'] },
    ],
    verification: [
      { kind: 'verification', title: 'Inspect a completed wiring-system route before conductors are energized', purpose: 'Confirm that mechanical installation conditions match the cable design assumptions and will not damage or overheat conductors.', safeState: 'Installation isolated/de-energized as required; no live access is needed for this visual/mechanical verification.', instrument: 'Visual inspection, suitable measuring tools and product data; continuity/installation test equipment is used later where protective continuity must be electrically verified.', method: ['Compare the actual route with the design/reference installation method.', 'Inspect supports, bends, entries, edges, joints and strain at terminations.', 'Check grouping, thermal-insulation contact and environmental exposure against the design assumptions.', 'Check containment fill/access and required segregation.', 'Inspect SWA armour/glands or metallic wiring-system continuity arrangements where applicable.', 'Record any route change because it can change capacity, voltage drop or fault-protection calculations.'], expected: 'The as-installed route matches the documented method and product limits, cables are supported without damaging strain, and no unassessed thermal/environmental condition has been introduced.', abnormal: 'Unplanned grouping, insulation contact, tight bends, unsupported weight, sharp edges, damaged seals/coatings or route changes invalidate the original assumption until assessed.', nextAction: 'Correct workmanship defects and send design-changing conditions back through the cable/circuit design checks before testing/energization.', sourceIds: ['course-c2-cables','osg-cable-supports','osg-current-capacity-voltage-drop'] },
    ],
    'common-confusions': [
      { kind: 'table', title: 'Common cable-system errors', columns: ['Mistake', 'Correction'], rows: [
        ['“Cable size determines its current rating.”', 'Current capacity depends on cable construction and actual installation conditions.'],
        ['“If it fits in the conduit, the conduit is fine.”', 'Fill is only one check; bends, pulling, grouping, support and access remain.'],
        ['“Neat tight bundling is always better.”', 'Loaded groups can run hotter; grouping must be assessed.'],
        ['“The SWA gland can support the cable.”', 'The support system must carry cable weight/forces without overloading the termination.'],
        ['“Armour is automatically an adequate CPC.”', 'Any protective-conductor use of armour must be deliberately designed and verified.'],
        ['“A sheath is the same as insulation.”', 'Core insulation provides electrical separation; the sheath protects the cable assembly.'],
        ['“Voltage drop is handled by the breaker.”', 'Voltage drop is a conductor/circuit performance check separate from overcurrent protection.'],
      ], sourceIds: ['course-c2-cables'] },
    ],
    sources: [
      { kind: 'prose', title: 'Source hierarchy for C2-04', paragraphs: [
        'The course lessons provide the workmanship and physical wiring-system explanations. EPRA defines cable selection/current-carrying competence. Current IET On-Site Guide appendices are the technical baseline for cable types, supports, conduit/trunking capacities and current-capacity/voltage-drop data where consistent with Kenyan requirements.',
        'No numerical cable table is reproduced here as a universal Kenya design table. Exact current table values must come from the applicable source and installation conditions. The current OSG appendix references remain bibliography-only until exact reader-page mappings are verified.',
      ], sourceIds: ['epra-c2-competencies','course-c2-cables','osg-cable-types','osg-cable-supports','osg-conduit-trunking','osg-current-capacity-voltage-drop'] },
    ],
  },
}];
