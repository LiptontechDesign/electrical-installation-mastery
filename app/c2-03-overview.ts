import { learningSections } from './learning-sections';
import type { CanonicalTerm, OverviewFormula, OverviewSection } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

const stageId = 'C2-03';
const sectionId = 'c2-03-single-phase-wiring-accessories';
const moduleId = 'module-03';
const groups = learningSections.filter(section => section.moduleId === moduleId);
const lessonIds = [...new Set(groups.flatMap(section => section.lessonIds))];

const reviewed = (lessonIds: string[], relatedTermIds: string[] = []): Partial<CanonicalTerm> => ({
  editorialStatus: 'reviewed',
  stageIds: [stageId],
  sectionIds: [sectionId],
  lessonIds,
  relatedTermIds,
});

export const c203TermPatches: Record<string, Partial<CanonicalTerm>> = {
  termination: {
    ...reviewed(['p03-l01', 'p03-l02', 'p16-l02'], ['conductor-preparation', 'socket-outlet', 'fused-connection-unit']),
    sourceIds: ['course-vocabulary', 'course-c2-wiring'],
    practicalExample: 'A sound termination uses the correct strip length, captures all intended copper/strands, keeps insulation close to the terminal, avoids conductor damage and follows the terminal manufacturer’s method and torque where specified.',
    explainAloud: 'Why can a conductor be electrically connected today yet still be a poor termination likely to fail later?',
  },
  'ring-final-circuit': {
    ...reviewed(['course-hZN6hiGLtrE', 'p03-l10'], ['radial-circuit', 'spur', 'ring-integrity', 'socket-outlet']),
    sourceIds: ['course-vocabulary', 'course-c2-wiring', 'osg-final-circuits'],
    standardsMeaning: 'A ring final circuit has its line, neutral and protective conductors arranged to leave the origin, serve points around the circuit and return to the same origin, subject to the applicable design and verification requirements.',
    plainMeaning: 'A healthy ring provides two intended paths back to the origin. The two paths do not necessarily share every load equally, and working sockets do not prove that the ring is complete.',
    practicalExample: 'If one line leg opens, outlets may still work through the remaining path even though the assumptions supporting the ring design have been lost.',
    notTheSameAs: [{ termId: 'radial-circuit', distinction: 'A radial has one principal route away from the origin; a ring returns its intended conductors to the same origin.' }],
    explainAloud: 'Why can a broken ring remain energized and why is that not acceptable evidence of integrity?',
  },
  'two-way-switching': {
    ...reviewed(['p03-l08'], ['one-way-switching', 'intermediate-switching', 'switched-line']),
    sourceIds: ['course-vocabulary', 'course-c2-wiring', 'osg-final-circuits'],
    standardsMeaning: 'Two-way switching uses two changeover switching points so either location can alter the available path controlling the same load.',
    plainMeaning: 'Each end switch chooses one of two traveller/strapper paths. Either end can change whether the lamp circuit is complete.',
    practicalExample: 'A staircase light can be controlled from the bottom and the top using two two-way switches.',
    explainAloud: 'Name the common and traveller functions in a two-way arrangement and explain how either switch changes lamp state.',
  },
  'ceiling-rose': {
    ...reviewed(['p03-l05', 'p03-l06'], ['one-way-switching', 'switched-line', 'cpc']),
    sourceIds: ['course-vocabulary', 'course-c2-wiring', 'osg-final-circuits'],
    practicalExample: 'In a three-plate lighting arrangement, the ceiling point can maintain permanent line looping, neutral continuity, the switched-line return and protective-conductor continuity as separate functions.',
    explainAloud: 'In a three-plate lighting point, distinguish permanent line, neutral and switched line without relying on terminal position by memory.',
  },
  cpc: {
    ...reviewed(['p03-l01', 'p03-l03', 'p03-l05'], ['polarity', 'termination', 'ring-integrity']),
    sourceIds: ['course-vocabulary', 'course-c2-wiring'],
    practicalExample: 'A metal accessory or Class I load may still operate if its CPC is open, so normal operation cannot be used as evidence that protective continuity exists.',
    explainAloud: 'Why can a load work normally even when the protective-conductor path is defective?',
  },
  polarity: {
    ...reviewed(['p03-l05', 'p03-l07'], ['switched-line', 'one-way-switching', 'cpc']),
    sourceIds: ['course-vocabulary', 'course-c2-wiring'],
    practicalExample: 'A one-way switch should control the intended line path so the lamp holder/accessory is not intentionally left connected to line merely because the switch opened the neutral.',
    explainAloud: 'Why does a lamp switching on and off fail to prove correct polarity?',
  },
  led: {
    ...reviewed(['p12-v2-l01', 'p12-v2-l07', 'p03-l11'], ['luminaire', 'ip-and-ik-ratings']),
    sourceIds: ['course-vocabulary', 'course-c2-wiring'],
    practicalExample: 'An LED downlight must be selected for light output/beam, driver/control compatibility, recess depth, thermal conditions and the ceiling construction, not wattage alone.',
    explainAloud: 'Why can two LED fittings with the same wattage be unsuitable substitutes for each other?',
  },
  'ip-and-ik-ratings': {
    ...reviewed(['p11-v2-l10'], ['socket-outlet', 'luminaire']),
    sourceIds: ['course-vocabulary', 'course-c2-wiring'],
    practicalExample: 'An outdoor socket can lose the enclosure protection claimed by its IP rating if the wrong cable entry, gland, seal, mounting surface or lid condition defeats the tested construction.',
    explainAloud: 'Why does a high IP number on the enclosure not prove the complete installed outdoor socket is suitable?',
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
  sourceIds: options.sourceIds ?? ['course-c2-wiring'],
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

export const c203AdditionalTerms: PreservedCanonicalTerm[] = [
  newTerm('conductor-preparation', 'Conductor preparation', ['strip cable', 'strip conductor', 'conductor preparation'], 'Conductor preparation is the controlled removal of sheath/insulation and formation of the conductor end so the intended conductor remains undamaged and is suitable for the specified terminal.', 'Prepare the conductor so the terminal receives sound copper/strands, the insulation remains intact up to the intended point and the cable is not weakened before connection.', 'Installation', {
    lessonIds: ['p03-l01', 'p03-l02', 'p16-l02'], relatedTermIds: ['termination'],
    practicalExample: 'A nicked solid conductor or missing flexible strands can weaken a connection even if the accessory initially works.', explainAloud: 'Which defects can be created during stripping before the conductor even reaches a terminal?',
  }),
  newTerm('one-way-switching', 'One-way switching', ['one way switch', 'one-way switching'], 'One-way switching uses one switching point to make or break the intended line path supplying a load.', 'One switch controls the load from one location. In the usual lighting arrangement the switch controls the line conductor, not the neutral.', 'Installation', {
    sourceIds: ['course-c2-wiring', 'osg-final-circuits'], lessonIds: ['p03-l05', 'p03-l07'], relatedTermIds: ['two-way-switching', 'intermediate-switching', 'switched-line', 'polarity'],
    practicalExample: 'A room light controlled from one doorway is the basic one-way case.', explainAloud: 'Trace the line path from supply through a one-way switch to the lamp and explain where neutral goes.',
  }),
  newTerm('intermediate-switching', 'Intermediate switching', ['intermediate switch', 'three point lighting control'], 'Intermediate switching extends a two-way arrangement by inserting one or more four-terminal changeover/crossover devices between the two end switches so the same load can be controlled from three or more locations.', 'The two-way switches stay at the ends. Intermediate switches sit in the traveller path and swap or pass the pair of travellers.', 'Installation', {
    sourceIds: ['course-c2-wiring', 'osg-final-circuits'], lessonIds: ['p03-l09'], relatedTermIds: ['two-way-switching', 'one-way-switching'],
    practicalExample: 'A corridor light controlled from both ends and a middle landing can use two two-way switches with an intermediate switch between them.', explainAloud: 'Why does the intermediate switch not normally have a single common terminal like the two end switches?',
  }),
  newTerm('switched-line', 'Switched line', ['switched live', 'switched line'], 'A switched line conductor carries line potential to the load only when the associated switching path is in the conducting state.', 'It is the controlled line return from the switch to the load. It must not be confused with neutral merely because it may share a multicore cable with other conductors.', 'Installation', {
    sourceIds: ['course-c2-wiring'], lessonIds: ['p03-l05', 'p03-l06', 'p03-l07'], relatedTermIds: ['one-way-switching', 'two-way-switching', 'polarity', 'ceiling-rose'],
    practicalExample: 'In a three-plate lighting circuit, the switched-line return leaves the switch and feeds the lamp line terminal.', explainAloud: 'What is the difference between a permanent line and a switched line at a lighting point?',
  }),
  newTerm('radial-circuit', 'Radial circuit', ['radial', 'radial final circuit'], 'A radial circuit begins at its origin and extends to one or more points without the intended conductors returning to the same origin as a ring; branches may be present subject to the design.', 'It is a one-way topology away from the board, even though the connected outlets/loads are electrically in parallel.', 'Installation', {
    sourceIds: ['course-c2-wiring', 'osg-final-circuits'], lessonIds: ['course-At7AnMV7Xd0'], relatedTermIds: ['ring-final-circuit', 'spur', 'socket-outlet'],
    notTheSameAs: [{ termId: 'ring-final-circuit', distinction: 'A radial does not intentionally return its circuit conductors to the same origin to form a ring.' }],
    practicalExample: 'A socket radial can leave the board, serve several outlets and end at the last point; a branch can be present without making it a ring.', explainAloud: 'Why does “radial” describe cable topology rather than appliances being connected in series?',
  }),
  newTerm('spur', 'Spur', ['spur circuit', 'ring spur'], 'A spur is a branch taken from a ring-final arrangement that does not itself continue around to complete the ring, and its loading/protection must satisfy the applicable design rules.', 'It is a branch off the ring, not another half of the ring.', 'Installation', {
    sourceIds: ['course-c2-wiring', 'osg-final-circuits'], lessonIds: ['p03-l10', 'course-hZN6hiGLtrE'], relatedTermIds: ['ring-final-circuit', 'radial-circuit', 'ring-integrity'],
    practicalExample: 'Adding one outlet on a spur does not prove the parent ring remains healthy; ring integrity still has to be established.', explainAloud: 'Why must the parent ring be verified before and after a spur alteration?',
  }),
  newTerm('ring-integrity', 'Ring integrity', ['ring continuity', 'ring integrity'], 'Ring integrity is the verified continuity and correct interconnection of the intended line, neutral and protective conductor loops forming a ring final circuit.', 'The ring must actually be a ring electrically, not merely be drawn as one or have sockets that happen to work.', 'Testing', {
    sourceIds: ['course-c2-wiring', 'osg-final-circuits'], lessonIds: ['course-hZN6hiGLtrE', 'p03-l10'], relatedTermIds: ['ring-final-circuit', 'spur', 'cpc', 'polarity'],
    practicalExample: 'An open line leg can leave outlets energized through the other leg while the ring no longer meets its intended topology.', explainAloud: 'What evidence would distinguish an intact ring from a broken ring that still powers every socket?',
  }),
  newTerm('socket-outlet', 'Socket-outlet', ['socket', 'socket outlet', 'receptacle'], 'A socket-outlet is an accessory containing contacts intended to accept the corresponding plug and connect portable/current-using equipment to the circuit within its specified ratings and installation conditions.', 'It is the user connection point. Its rating, terminals, earthing, enclosure and environment all have to suit the circuit and use.', 'Installation', {
    sourceIds: ['course-c2-wiring', 'osg-final-circuits'], lessonIds: ['p03-l03', 'p03-l04', 'p11-v2-l03', 'p11-v2-l10'], relatedTermIds: ['radial-circuit', 'ring-final-circuit', 'termination', 'ip-and-ik-ratings'],
    practicalExample: 'A socket can power a load even with wrong polarity or a defective CPC, so operation is not a complete post-work verification.', explainAloud: 'List the checks that remain necessary even when a newly terminated socket appears to work.',
  }),
  newTerm('fused-connection-unit', 'Fused connection unit (FCU)', ['fcu', 'fused spur', 'fused connection unit'], 'A fused connection unit is an accessory that provides a fuse and connection arrangement for supplying a load/flex; versions may also provide switching, but the exact functions and ratings come from the product.', 'It can provide a locally fused connection to fixed equipment. The fuse in the FCU does not automatically replace the protective device for the upstream fixed circuit.', 'Installation', {
    sourceIds: ['course-c2-wiring'], lessonIds: ['p11-v2-l04'], relatedTermIds: ['socket-outlet', 'glossary-isolation', 'termination'],
    practicalExample: 'A fixed appliance may be supplied through an FCU with a fuse selected for the appliance flex while the fixed circuit retains its own upstream protection.', explainAloud: 'Why can the FCU fuse protect an appliance flex without being the only protective device for the whole circuit?',
  }),
  newTerm('first-fix', 'First fix', ['first fix', 'first-fix'], 'First fix is the installation stage in which routes, containment, boxes and concealed wiring infrastructure are set out and installed before final surfaces/accessories are completed.', 'It is the “put the hidden infrastructure in the right place” stage. Coordination errors here become expensive after plaster, tile or ceilings close the work.', 'Installation', {
    sourceIds: ['course-c2-wiring'], lessonIds: ['p11-v2-l06', 'p11-l01', 'p10-l03'], relatedTermIds: ['second-fix', 'concealed-services'],
    practicalExample: 'Kitchen socket and cooker-control positions should be coordinated with cabinets, sinks, hobs and finished levels before chasing and box installation.', explainAloud: 'Which decisions must be frozen before first fix so accessories do not end up behind appliances or finishes?',
  }),
  newTerm('second-fix', 'Second fix', ['second fix', 'second-fix'], 'Second fix is the stage in which accessories, equipment and final terminations are installed onto the prepared wiring/containment after the relevant building finishes and first-fix work are ready.', 'It is where cables are terminated into the actual switches, sockets, connection units and luminaires, followed by inspection and verification before service.', 'Installation', {
    sourceIds: ['course-c2-wiring'], lessonIds: ['p10-l04', 'p11-v2-l03'], relatedTermIds: ['first-fix', 'termination', 'socket-outlet', 'luminaire'],
    practicalExample: 'A second-fix socket installation includes conductor inspection/preparation, correct terminals, controlled tightening, faceplate fit and the required post-work verification.', explainAloud: 'Why should second fix not be treated as “fit the faceplates and energize”?',
  }),
  newTerm('luminaire', 'Luminaire', ['light fitting', 'lighting fixture', 'luminaire'], 'A luminaire is equipment that distributes, filters or transforms light from one or more light sources and includes the components needed to support, fix, protect and connect those sources, excluding the light sources themselves where separable.', 'It is the complete light fitting/system around the lamp or LED source, not simply “a bulb.” Selection includes electrical, visual, environmental, thermal and mounting requirements.', 'Lighting', {
    sourceIds: ['course-c2-wiring'], lessonIds: ['p12-v2-l01', 'p12-v2-l07', 'p03-l11'], relatedTermIds: ['led', 'ip-and-ik-ratings', 'termination'],
    practicalExample: 'A recessed LED downlight has to suit the visual task, driver/dimming arrangement, cut-out/recess depth, insulation conditions and ceiling/fire/acoustic construction.', explainAloud: 'What must be checked beyond wattage before selecting a replacement or new luminaire?',
  }),
];

export const c203Formulas: OverviewFormula[] = [];

export const c203Sections: OverviewSection[] = [{
  id: sectionId,
  stageId,
  moduleId,
  learningSectionIds: groups.map(section => section.id),
  title: 'Single-Phase Wiring and Accessories',
  status: 'reviewed',
  lessonIds,
  termIds: [
    'conductor-preparation', 'termination', 'cpc', 'polarity',
    'one-way-switching', 'two-way-switching', 'intermediate-switching', 'switched-line', 'ceiling-rose',
    'radial-circuit', 'ring-final-circuit', 'spur', 'ring-integrity', 'socket-outlet', 'fused-connection-unit',
    'first-fix', 'second-fix', 'glossary-isolation', 'luminaire', 'led', 'ip-and-ik-ratings',
  ],
  sourceIds: ['epra-c2-competencies', 'course-c2-wiring', 'osg-identification-notices', 'osg-final-circuits', 'osg-bath-shower'],
  relatedSectionIds: ['c2-02-installation-architecture-drawings-safety'],
  prerequisiteSectionIds: ['c2-02-installation-architecture-drawings-safety'],
  coverage: [
    { competency: 'One-way, two-way and intermediate switching arrangements.', referenceIds: ['epra-c2-competencies', 'osg-final-circuits'], teachingPage: 'relationships' },
    { competency: 'Radial and ring socket-outlet circuits, including the meaning of a spur and the need to preserve/verify ring integrity.', referenceIds: ['epra-c2-competencies', 'osg-final-circuits'], teachingPage: 'engineering-rules' },
    { competency: 'Selection and installation of luminaires and common single-phase accessories with sound conductor preparation, polarity and protective-conductor continuity.', referenceIds: ['epra-c2-competencies', 'course-c2-wiring'], teachingPage: 'application' },
  ],
  pages: {
    'system-model': [
      { kind: 'flow', title: 'From protective device to usable point', steps: ['Final-circuit protective device', 'Line + neutral + CPC routed as the circuit requires', 'Junction/switching/connection point', 'Accessory or luminaire', 'Load/useful effect', 'Protective path remains continuous independently of normal load current'], sourceIds: ['course-c2-wiring', 'osg-final-circuits'] },
      { kind: 'prose', title: 'Function first, conductor second', paragraphs: [
        'Every conductor and terminal has a function. Permanent line, switched line, neutral and CPC must be traced by function rather than guessed from physical position. The circuit can appear to work while polarity or protective continuity is wrong.',
        'Circuit topology is a separate idea from how loads are connected. A radial socket circuit is radial in its cable route, yet its outlets are connected electrically in parallel so each receives the supply voltage.',
      ], sourceIds: ['course-c2-wiring'] },
    ],
    definitions: [
      { kind: 'table', title: 'Core wiring arrangements', columns: ['Arrangement', 'Defining feature', 'Key risk if misunderstood'], rows: [
        ['One-way lighting', 'One control point interrupts the intended line path', 'Neutral switching or wrong conductor function can leave hazardous line potential present'],
        ['Two-way lighting', 'Two changeover end switches linked by travellers', 'Copying terminal positions between different switch products'],
        ['Intermediate lighting', 'Intermediate crossover device(s) between two-way ends', 'Treating the intermediate as if it had an ordinary common terminal'],
        ['Radial final circuit', 'Does not return to the same origin as a ring', 'Confusing radial topology with loads connected in series'],
        ['Ring final circuit', 'Intended line, neutral and CPC return to the same origin', 'Assuming working sockets prove ring continuity'],
        ['Spur', 'Branch from the ring rather than continuation of the ring', 'Ignoring parent-ring integrity and branch loading/protection'],
      ], sourceIds: ['course-c2-wiring', 'osg-final-circuits'] },
    ],
    relationships: [
      { kind: 'flow', title: 'One-way lighting relationship', steps: ['Permanent line reaches switch feed', 'Switch opens/closes intended line path', 'Switched line returns to the luminaire', 'Neutral connects to the luminaire independently of ordinary switching', 'CPC remains continuous through relevant points'], sourceIds: ['course-c2-wiring', 'osg-final-circuits'] },
      { kind: 'flow', title: 'Control from three or more positions', steps: ['Two-way switch at first end', 'Traveller pair', 'Intermediate switch passes or crosses travellers', 'Traveller pair', 'Two-way switch at final end', 'Switched line to load'], sourceIds: ['course-c2-wiring'] },
      { kind: 'table', title: 'Radial, ring and spur relationship', columns: ['Feature', 'Radial', 'Ring', 'Spur'], rows: [
        ['Origin/route', 'Leaves origin and ends/branches', 'Leaves and returns to same origin', 'Branches from a ring point'],
        ['Parallel loads?', 'Yes', 'Yes', 'Yes'],
        ['Two intended paths around main circuit?', 'No', 'Yes when intact', 'No'],
        ['Integrity concern', 'Continuity of intended conductors', 'Continuity/correct interconnection of every ring conductor', 'Parent ring plus branch design/termination'],
      ], sourceIds: ['course-c2-wiring', 'osg-final-circuits'] },
    ],
    'engineering-rules': [
      { kind: 'flow', title: 'Termination quality chain', steps: ['Identify conductor function', 'Select terminal/accessory compatible with conductor type and quantity', 'Strip without nicking copper or losing strands', 'Use ferrule only where the terminal/conductor instructions support it', 'Insert full intended copper with no trapped insulation or exposed excess', 'Tighten/secure by the specified method', 'Provide strain relief and conductor space where needed', 'Inspect before closing the accessory'], sourceIds: ['course-c2-wiring'] },
      { kind: 'prose', title: 'Ring circuits require evidence, not assumption', paragraphs: [
        'A ring final circuit can continue to energize outlets through the remaining leg after one conductor opens. That is why functionality is not a substitute for continuity testing and correct ring verification.',
        'Current sharing around a ring is not automatically 50/50. It depends on path resistance and where loads are connected. The design and verification rules rely on the actual intended topology remaining intact.',
      ], sourceIds: ['course-c2-wiring', 'osg-final-circuits'] },
      { kind: 'prose', title: 'Accessory selection follows use and environment', paragraphs: [
        'Select socket-outlets, FCUs, isolators and luminaires from actual duty, ratings, terminal capacity, mounting/box space, environment and manufacturer instructions. Similar front plates or advertised current ratings do not make accessories interchangeable.',
        'For wet, outdoor or harsh locations, enclosure/IP/impact performance belongs to the complete installed arrangement including cable entries, seals, lids and mounting—not merely the number printed on the product.',
      ], sourceIds: ['course-c2-wiring', 'osg-bath-shower'] },
    ],
    application: [
      { kind: 'flow', title: 'Residential point from plan to second fix', steps: ['Confirm client/load/location requirement', 'Coordinate finished levels, cabinets, wet/heat zones and other services', 'Set out route and back box during first fix', 'Install/support wiring system', 'Inspect conductors before second fix', 'Prepare and terminate accessory/luminaire', 'Restore labels/covers/mechanical security', 'Complete the required inspection and electrical verification before service'], sourceIds: ['course-c2-wiring'] },
      { kind: 'prose', title: 'Lighting example: recessed LED downlights', paragraphs: [
        'Do not choose a downlight only because it fits the cut-out. Check lumen output/beam/glare, driver and dimming compatibility, recess depth, insulation contact/clearance, maintenance access and the actual ceiling/fire/acoustic construction.',
        'The lighting circuit connection still follows the basic conductor functions: intended line switching, neutral continuity and protective-conductor requirements where applicable.',
      ], sourceIds: ['course-c2-wiring'] },
    ],
    verification: [
      { kind: 'verification', title: 'Connection verification before energization', purpose: 'Show that the installed wiring corresponds to the intended circuit topology and conductor functions before relying on normal operation.', safeState: 'Circuit isolated and proven dead under the approved safe-isolation process; connected equipment managed for the selected dead tests.', instrument: 'Visual inspection plus suitable low-resistance continuity/polarity test equipment under the approved verification method.', method: ['Inspect every disturbed termination for conductor damage, copper capture, insulation position, CPC continuity and mechanical security.', 'Verify the intended protective-conductor path is continuous.', 'Verify polarity so relevant single-pole switching/control is in the intended line conductor.', 'For a ring final circuit, verify the intended line, neutral and CPC ring continuity/interconnection rather than checking only that sockets operate.', 'Correct defects and repeat the affected checks before controlled energization.'], expected: 'The wiring matches the diagram/topology, protective paths are continuous, polarity is correct and any ring is verified as an intact ring.', abnormal: 'Open ring legs, high/unexpected continuity readings, wrong polarity, missing CPC continuity, damaged conductors or uncertain terminal capacity require investigation and repair.', nextAction: 'Do not energize on appearance alone. Rectify, repeat the relevant dead tests and continue with the full initial-verification sequence taught in C2-08.', sourceIds: ['course-c2-wiring', 'osg-final-circuits'] },
    ],
    'common-confusions': [
      { kind: 'table', title: 'Common wiring mistakes', columns: ['Mistake', 'Correction'], rows: [
        ['“Radial means the appliances are in series.”', 'Radial describes cable topology; socket loads are normally connected in parallel.'],
        ['“All sockets work, so the ring is intact.”', 'A broken ring can still supply sockets through the remaining path. Verify ring continuity.'],
        ['“The switch is off, so the fitting is isolated.”', 'Functional switching is not safe isolation.'],
        ['“A ferrule is always better.”', 'Use a ferrule only when the conductor, ferrule, crimp system and receiving terminal are compatible.'],
        ['“The terminal is tight by feel.”', 'Use the manufacturer’s stated method/torque where specified and inspect conductor capture.'],
        ['“A high IP rating makes any outdoor installation weatherproof.”', 'Entries, seals, mounting, lid/gasket condition and cable route must preserve the rating.'],
        ['“Same wattage means same LED result.”', 'Light output, beam, colour, driver/control and thermal/ceiling suitability can differ.'],
      ], sourceIds: ['course-c2-wiring'] },
    ],
    sources: [
      { kind: 'prose', title: 'Source hierarchy for C2-03', paragraphs: [
        'EPRA provides the competency target: one-way, two-way and intermediate switching; radial and ring socket circuits; cable/accessory/protective competence and luminaire selection. Current course lessons and the supplied radial/ring teaching provide the practical explanatory layer.',
        'The current IET On-Site Guide is the technical baseline for identification, final-circuit arrangements and bath/shower context where consistent with Kenyan requirements. These page references remain bibliography-only until exact reader-page mappings are individually verified.',
      ], sourceIds: ['epra-c2-competencies', 'course-c2-wiring', 'osg-identification-notices', 'osg-final-circuits', 'osg-bath-shower'] },
    ],
  },
}];
