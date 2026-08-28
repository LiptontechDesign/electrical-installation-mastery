export type ReadingGuide = {
  id: string;
  number: number;
  title: string;
  pages: string;
  summary: string;
  keyConcepts: string[];
  activity: string;
  knowledgeCheck: string;
  linkedModules: number[];
  regulationSensitive: boolean;
};

export type BookCompanion = {
  id: string;
  shortTitle: string;
  title: string;
  authors: string;
  edition: string;
  year: number;
  accent: 'copper' | 'cyan';
  description: string;
  notice: string;
  guides: ReadingGuide[];
};

export const bookCompanions: BookCompanion[] = [
  {
    id: 'basic-level-2',
    shortTitle: 'Level 2 Foundations',
    title: 'Basic Electrical Installation Work',
    authors: 'Trevor Linsley',
    edition: 'Eighth Edition / Level 2',
    year: 2015,
    accent: 'cyan',
    description: 'A five-unit foundation companion covering safe work, electrical science, installation technology, wiring systems and professional communication.',
    notice: 'The source reflects UK City & Guilds and 17th Edition-era material. Treat legal and numerical requirements as historical learning context and verify current Kenyan requirements.',
    guides: [
      {
        id: 'level2-01', number: 1, title: 'Health and safety in building services engineering', pages: '1-60',
        summary: 'Build a disciplined safety mindset: identify hazards, assess risk, select controls, isolate correctly and communicate responsibility before any practical task begins.',
        keyConcepts: ['Hazard versus risk', 'Hierarchy of controls', 'Safe isolation', 'PPE and access equipment', 'Emergency response', 'Environmental responsibility'],
        activity: 'Create a de-energized job briefing for replacing a damaged socket: list hazards, controls, PPE, isolation steps and the stop-work condition.',
        knowledgeCheck: 'What evidence would convince another competent person that the circuit is isolated and safe to approach?',
        linkedModules: [1, 3, 8], regulationSensitive: true,
      },
      {
        id: 'level2-02', number: 2, title: 'Principles of electrical science', pages: '61-130',
        summary: 'Connect quantities, units and circuit behaviour so formulas describe what is physically happening rather than becoming rules to memorize.',
        keyConcepts: ['SI quantities and prefixes', 'Ohm’s law', 'Series and parallel circuits', 'Magnetism and induction', 'AC waveforms', 'Power and power factor'],
        activity: 'Use the formula lab to solve one series circuit and one parallel circuit, then explain how current and voltage behave differently in each.',
        knowledgeCheck: 'Why does adding a parallel branch reduce total circuit resistance even though another resistor has been added?',
        linkedModules: [1, 6], regulationSensitive: false,
      },
      {
        id: 'level2-03', number: 3, title: 'Electrical installations technology', pages: '131-276',
        summary: 'See how supply systems, conductors, protection, earthing, wiring methods and equipment selection combine into a complete installation.',
        keyConcepts: ['Generation and distribution', 'Single- and three-phase systems', 'Cable construction', 'Basic and fault protection', 'Earthing and bonding', 'Protective devices'],
        activity: 'Draw a one-line path from utility supply to one final load, labelling every switching, protection, earthing and conductor function.',
        knowledgeCheck: 'How do earthing, bonding and automatic disconnection work together during an earth fault?',
        linkedModules: [2, 4, 5, 7, 11, 14, 15], regulationSensitive: true,
      },
      {
        id: 'level2-04', number: 4, title: 'Installation of wiring systems and enclosures', pages: '277-318',
        summary: 'Translate a design into safe, inspectable workmanship by selecting tools, installing containment, preparing and terminating conductors, bonding services, inspecting the result and following a controlled verification sequence.',
        keyConcepts: ['Tool and PPE selection', 'Containment and cable support', 'Conductor preparation and termination', 'Main service bonding', 'Visual inspection', 'Test sequencing'],
        activity: 'On a de-energized training board, plan a containment route, prepare a termination checklist, label the circuit, complete a visual inspection and record fictional results supplied by the app.',
        knowledgeCheck: 'Which visible defects must be corrected before testing, and why should the test sequence not begin with live measurements?',
        linkedModules: [3, 5, 8, 9, 11, 12, 15, 16], regulationSensitive: true,
      },
      {
        id: 'level2-05', number: 5, title: 'Communicating with others in building services engineering', pages: '319-354',
        summary: 'Turn technical work into reliable team communication through clear drawings, schedules, handovers, reporting and respectful coordination.',
        keyConcepts: ['Technical information sources', 'Drawings and symbols', 'Job instructions', 'Customer communication', 'Handover records', 'Team coordination'],
        activity: 'Write a one-page handover note for a small distribution-board change, including scope, labels, tests, outstanding risks and client actions.',
        knowledgeCheck: 'What information must survive after the installer leaves so another electrician can safely understand the work?',
        linkedModules: [7, 8, 10, 11, 13, 14, 16], regulationSensitive: true,
      },
    ],
  },
  {
    id: 'installation-designs',
    shortTitle: 'Design Casebook',
    title: 'Electrical Installation Designs',
    authors: 'Bill Atkinson, Roger Lovegrove and Gary Gundry',
    edition: 'Fourth Edition',
    year: 2013,
    accent: 'copper',
    description: 'Nineteen design-led case studies that show how building type, users, environment, supply, loads, protection and documentation influence a complete installation.',
    notice: 'All case studies predate current standards and are UK-oriented. Use them to learn the design process, never as current Kenyan compliance instructions.',
    guides: [
      { id: 'design-01', number: 1, title: 'Introduction', pages: '1-7', summary: 'Frame electrical design as a controlled process from client need and site information through installation, inspection, certification and handover.', keyConcepts: ['Design responsibility', 'Terminology', 'Project procedure', 'Inspection and test', 'Completion records'], activity: 'Create a five-stage workflow for a new installation and name the evidence produced at every stage.', knowledgeCheck: 'Where does design responsibility begin and end when several people change the work?', linkedModules: [6, 8, 10, 11, 12, 13, 14, 15, 16], regulationSensitive: true },
      { id: 'design-02', number: 2, title: 'Three Bedroom House', pages: '8-20', summary: 'Balance minimum provision, occupant needs, circuit arrangement, load, protection and future flexibility in a familiar domestic brief.', keyConcepts: ['Client requirements', 'Domestic load assessment', 'Lighting and socket circuits', 'Consumer-unit arrangement', 'Earthing and bonding'], activity: 'Sketch a room-by-room requirement schedule for a three-bedroom house before deciding circuit quantities.', knowledgeCheck: 'Which client decisions change the design before cable sizes are considered?', linkedModules: [2, 3, 5, 6, 7, 11, 12, 13, 14, 15], regulationSensitive: true },
      { id: 'design-03', number: 3, title: 'A Block of Retirement Flatlets', pages: '21-34', summary: 'Separate private dwellings from landlord services while considering metering, distribution, diversity, access and emergency systems.', keyConcepts: ['Multi-occupancy distribution', 'Landlord supplies', 'Diversity', 'Metering', 'Emergency systems'], activity: 'Draw a riser concept separating flat supplies, landlord loads and shared emergency services.', knowledgeCheck: 'Why should landlord services be calculated and documented separately from individual dwellings?', linkedModules: [2, 6, 7], regulationSensitive: true },
      { id: 'design-04', number: 4, title: 'Overcurrent Protection', pages: '35-43', summary: 'Relate overload and fault current to device selection, breaking capacity, disconnection and the circuit conditions that protection must survive.', keyConcepts: ['Overload versus short circuit', 'Protective-device characteristics', 'Breaking capacity', 'Disconnection', 'Earth fault loop path'], activity: 'Compare three fault scenarios and state which device property controls the outcome in each.', knowledgeCheck: 'Why can a device with the correct current rating still be unsuitable for the available fault current?', linkedModules: [5, 6], regulationSensitive: true },
      { id: 'design-05', number: 5, title: 'An Architect’s Office', pages: '44-61', summary: 'Coordinate lighting, small power, heating, data-sensitive loads, distribution and building finishes in a changing office environment.', keyConcepts: ['Stakeholder coordination', 'Office diversity', 'Flexible wiring systems', 'Distribution boards', 'Sensitive electronic loads'], activity: 'Produce a zoning plan that keeps normal power, lighting and equipment-sensitive circuits maintainable as layouts change.', knowledgeCheck: 'What makes an office installation difficult to future-proof?', linkedModules: [2, 4, 6, 7, 11, 12, 13], regulationSensitive: true },
      { id: 'design-06', number: 6, title: 'A High Street Shop', pages: '62-74', summary: 'Combine a customer-facing shop with a hotter bakery area, allowing load pattern, phase balance, ambient conditions, wiring method and local isolation to shape one coordinated design.', keyConcepts: ['Mixed-use load profile', 'Lighting and appliance loads', 'Phase balance', 'Temperature effects', 'Wiring-system selection', 'Isolation and switching'], activity: 'Build an environment and load matrix for the sales floor, bakery, storage and back office, then propose a phase allocation.', knowledgeCheck: 'Why might a cable suitable for the sales area need a different rating or wiring method in the bakery?', linkedModules: [4, 5, 6, 7, 11, 12, 15], regulationSensitive: true },
      { id: 'design-07', number: 7, title: 'Earthing and Bonding', pages: '75-89', summary: 'Trace fault-current paths and distinguish protective earthing, equipotential bonding, CPC continuity and special conductor considerations.', keyConcepts: ['Earth fault path', 'Main bonding', 'Supplementary bonding', 'CPCs', 'Metal containment continuity'], activity: 'Draw the complete earth-fault loop for one Class I load and label every conductor and connection.', knowledgeCheck: 'Why is bonding not a substitute for a reliable circuit protective conductor?', linkedModules: [5, 8], regulationSensitive: true },
      { id: 'design-08', number: 8, title: 'Car Service Workshop', pages: '90-110', summary: 'Respond to a tougher environment containing vehicle work, motors, compressors, portable tools, special equipment and exposed conductive structures.', keyConcepts: ['Environmental assessment', 'Motor loads', 'Workshop sockets', 'Mechanical protection', 'Special equipment'], activity: 'Make a hazard-to-design matrix for water, impact, oils, moving vehicles and portable equipment.', knowledgeCheck: 'How should environmental risks change equipment and wiring-system selection?', linkedModules: [4, 5, 6, 7, 11, 15], regulationSensitive: true },
      { id: 'design-09', number: 9, title: 'Circuits', pages: '111-122', summary: 'Compare lighting and socket circuit arrangements, including radial, ring, tree and composite approaches, and select between them using load distribution, flexibility, testing and fault impact.', keyConcepts: ['Lighting circuits', 'Socket-outlet circuits', 'Radial and ring topology', 'Tree arrangements', 'Switching and control', 'System trade-offs'], activity: 'Compare ring, radial and tree arrangements for a home, an office and a small workshop using flexibility, cable use, testing and fault impact as criteria.', knowledgeCheck: 'Which arrangement best supports frequently rearranged office workstations, and what assumptions must be checked before choosing it?', linkedModules: [2, 3, 7, 9, 11, 12], regulationSensitive: true },
      { id: 'design-10', number: 10, title: 'Farming and Horticulture', pages: '123-137', summary: 'Adapt design for damp, corrosive and mechanically demanding agricultural locations where livestock sensitivity, dispersed structures, earthing limits and critical ventilation loads increase risk.', keyConcepts: ['External influences', 'Livestock sensitivity', 'Equipotential zones', 'TT and PME considerations', 'Earthing and bonding', 'Critical life-support loads'], activity: 'Annotate a fictional farm with wet areas, livestock zones, machinery risks, critical loads and proposed electrical separation boundaries.', knowledgeCheck: 'Why can an earthing arrangement acceptable in an ordinary building become unsuitable around livestock and separated farm structures?', linkedModules: [4, 5, 6, 7, 10], regulationSensitive: true },
      { id: 'design-11', number: 11, title: 'Isolation and Switching', pages: '138-144', summary: 'Separate the purposes of isolation, emergency switching, functional switching and maintenance control, then place devices where people can use them safely.', keyConcepts: ['Isolation', 'Emergency switching', 'Functional switching', 'Mechanical maintenance', 'Device accessibility'], activity: 'For four pieces of equipment, identify every required switching function and who must control it.', knowledgeCheck: 'Why can one switch be suitable for normal control but unsuitable for safe isolation?', linkedModules: [4, 5, 8, 11, 14, 15], regulationSensitive: true },
      { id: 'design-12', number: 12, title: 'A Village Sports Centre', pages: '145-159', summary: 'Coordinate public spaces, changing areas, high-power showers, heating, kitchen equipment, lighting and plant while separating tariff-dependent loads and applying diversity, grouping and shock-protection checks.', keyConcepts: ['Mixed load profiles', 'Normal and controlled-tariff supplies', 'Diversity', 'Cable grouping', 'Distribution zoning', 'Shock protection'], activity: 'Create separate load schedules for ordinary and time-controlled supplies, then divide the centre into electrical zones with clear maintenance boundaries.', knowledgeCheck: 'How do simultaneous shower, heating, cooking and lighting loads affect maximum-demand reasoning?', linkedModules: [4, 5, 6, 7, 10, 11, 12, 15], regulationSensitive: true },
      { id: 'design-13', number: 13, title: 'An Indoor Swimming Pool', pages: '160-173', summary: 'Use pool zones to connect wet-environment risk with permitted voltage, ingress protection, equipment placement, wiring routes, isolation and local bonding.', keyConcepts: ['Pool zones', 'Extra-low-voltage protection', 'Ingress protection', 'Equipment placement', 'Isolation', 'Local bonding and floor grids'], activity: 'Mark zones on a fictional pool section and place example equipment only after stating the safety constraint used for each decision.', knowledgeCheck: 'How does moving from an ordinary room into a pool zone change acceptable voltage, equipment and accessory placement?', linkedModules: [2, 4, 5, 6, 7], regulationSensitive: true },
      { id: 'design-14', number: 14, title: 'Cables and Wiring Systems', pages: '174-185', summary: 'Compare cable types and containment against installation method, temperature, grouping, mechanical stress, environment and maintainability.', keyConcepts: ['Cable construction', 'Installation methods', 'Correction factors', 'Containment', 'Mechanical protection'], activity: 'Build a cable-selection scorecard for five environments without choosing final conductor sizes.', knowledgeCheck: 'Which environmental factor can change both the cable type and its usable current capacity?', linkedModules: [3, 4, 6, 11, 12, 15], regulationSensitive: true },
      { id: 'design-15', number: 15, title: 'Inspection, Testing and Certification', pages: '186-207', summary: 'Treat verification as a planned sequence that proves construction, conductor continuity, insulation, polarity, protection and documentation.', keyConcepts: ['Initial verification', 'Visual inspection', 'Dead tests', 'Live tests', 'Certification'], activity: 'Arrange a set of inspection and test cards into a safe sequence and justify every dependency.', knowledgeCheck: 'Why must visual inspection and dead testing precede energization?', linkedModules: [8, 14, 15, 16], regulationSensitive: true },
      { id: 'design-16', number: 16, title: 'A Caravan Park', pages: '208-212', summary: 'Consider shock protection, earthing restrictions, outdoor distribution, route length, environmental exposure and individually protected pitch connections in a dispersed leisure installation.', keyConcepts: ['Outdoor distribution', 'Caravan earthing', 'PME restrictions', 'Buried and overhead routes', 'Pitch connection equipment', 'Individual circuit protection'], activity: 'Sketch a one-pitch supply and label the environmental, earthing, protection, distance, access and mechanical-risk decisions.', knowledgeCheck: 'Why should each pitch connection be considered individually rather than treated as an ordinary outdoor socket?', linkedModules: [4, 5, 6, 7, 8], regulationSensitive: true },
      { id: 'design-17', number: 17, title: 'Residual Current Devices', pages: '213-223', summary: 'Understand what residual-current protection detects, what it cannot replace, how selectivity matters and why nuisance operation must be investigated.', keyConcepts: ['Residual current', 'Additional protection', 'Device types', 'Selectivity', 'Testing and unwanted tripping'], activity: 'Draw currents entering and leaving a healthy circuit, then add a leakage path and explain the imbalance.', knowledgeCheck: 'Why does an RCD not provide complete protection against every overload or short circuit?', linkedModules: [5, 8, 9], regulationSensitive: true },
      { id: 'design-18', number: 18, title: 'Flood Lighting Project', pages: '224-230', summary: 'Develop a long outdoor lighting circuit by coordinating the lighting arrangement, environmental protection, load and inrush, protective device, cable route, voltage drop and switching.', keyConcepts: ['Lighting arrangement', 'External wiring environment', 'Load and inrush current', 'Protective-device choice', 'Long-run voltage drop', 'Switching and maintenance'], activity: 'Compare fictional cable options using supplied current-capacity and voltage-drop data, then explain why the smallest current-capable cable may still fail.', knowledgeCheck: 'Why does route length often become the controlling constraint in an outdoor lighting circuit?', linkedModules: [4, 5, 6, 7, 12], regulationSensitive: true },
      { id: 'design-19', number: 19, title: 'Circuit Design Calculations', pages: '231-238', summary: 'Use a defensible design sequence: establish supply and load, coordinate cable and protection, then check voltage drop, shock protection and fault withstand.', keyConcepts: ['Design current', 'Protective-device coordination', 'Cable selection', 'Voltage drop', 'Fault and shock checks'], activity: 'Audit a worked circuit using a five-gate checklist and identify exactly where an unsuitable result forces redesign.', knowledgeCheck: 'Why is current-carrying capacity only one of several gates a cable must pass?', linkedModules: [5, 6, 10, 14, 15], regulationSensitive: true },
    ],
  },
];

export type PracticeLab = {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: 'Foundation' | 'Intermediate' | 'Advanced';
  description: string;
  steps: string[];
  evidence: string;
  linkedModules: number[];
  safety: string;
};

export const practiceLabs: PracticeLab[] = [
  { id: 'lab-safe-isolation', title: 'Safe-isolation briefing', category: 'Safety', duration: '25 min', level: 'Foundation', description: 'Plan and speak through a complete isolation workflow without approaching an energized circuit.', steps: ['Define the circuit and every possible source', 'Select isolation, lock-off and proving equipment', 'Explain prove-test-prove and the stop-work conditions'], evidence: 'One-page method statement plus a verbal walk-through.', linkedModules: [1, 8], safety: 'Simulation or approved de-energized training board only.' },
  { id: 'lab-circuit-map', title: 'Trace the energy path', category: 'Science', duration: '20 min', level: 'Foundation', description: 'Turn a simple circuit into a labelled explanation of source, path, control, protection and load.', steps: ['Draw the complete current path', 'Label voltage, current and resistance', 'Predict one open-circuit and one short-circuit symptom'], evidence: 'Annotated circuit sketch with two fault predictions.', linkedModules: [1, 9], safety: 'Use paper, simulation or extra-low-voltage training equipment.' },
  { id: 'lab-room-schedule', title: 'Room requirement schedule', category: 'Design', duration: '35 min', level: 'Foundation', description: 'Interview a fictional client and convert daily activities into electrical requirements before drawing circuits.', steps: ['List room activities and equipment', 'Separate essential, convenience and future needs', 'Record assumptions and questions for the client'], evidence: 'Room-by-room requirements schedule.', linkedModules: [2, 10, 11, 12], safety: 'Planning exercise only.' },
  { id: 'lab-domestic-concept', title: 'Three-bedroom house concept', category: 'Projects', duration: '60 min', level: 'Intermediate', description: 'Develop a domestic concept from requirements through circuit grouping and distribution-board logic.', steps: ['Zone lighting, socket and fixed loads', 'Estimate load categories and diversity assumptions', 'Sketch a consumer-unit schedule and earthing path'], evidence: 'Concept plan, load schedule and assumptions register.', linkedModules: [2, 5, 6, 7, 11, 12, 13, 14], safety: 'No construction values are approved by this exercise; verify current local rules.' },
  { id: 'lab-containment', title: 'Containment route study', category: 'Installation', duration: '35 min', level: 'Intermediate', description: 'Choose and defend containment for a route with bends, other services, access and environmental constraints.', steps: ['Mark the route and external influences', 'Select a system and support strategy', 'Plan bends, draw-in points, segregation and inspection'], evidence: 'Route sketch with a concise selection rationale.', linkedModules: [3, 4, 11, 12, 15], safety: 'Survey visually; do not drill, cut or disturb unknown services.' },
  { id: 'lab-fault-path', title: 'Earth-fault path trace', category: 'Protection', duration: '30 min', level: 'Intermediate', description: 'Explain how an earth fault produces automatic disconnection and which broken connections defeat the protective path.', steps: ['Draw source to fault and return path', 'Label exposed and extraneous parts', 'Predict effects of three continuity failures'], evidence: 'Colour-coded fault-loop diagram and failure notes.', linkedModules: [5, 8, 9], safety: 'Paper or simulation exercise only.' },
  { id: 'lab-cable-audit', title: 'Five-gate circuit audit', category: 'Calculations', duration: '45 min', level: 'Advanced', description: 'Review a provisional circuit against load, protection, capacity, voltage drop and fault/shock requirements.', steps: ['Record supply and load assumptions', 'Check every gate in a fixed sequence', 'Identify the first failed gate and redesign trigger'], evidence: 'Completed calculation audit with an assumptions column.', linkedModules: [5, 6], safety: 'Educational calculation only; not a compliant design certificate.' },
  { id: 'lab-phase-balance', title: 'Three-phase balancing board', category: 'Distribution', duration: '40 min', level: 'Advanced', description: 'Arrange single-phase loads across a three-phase board and explain neutral-current consequences.', steps: ['Classify fixed and variable loads', 'Allocate loads across phases', 'Compare phase totals and explain the remaining imbalance'], evidence: 'Balanced panel schedule with before/after totals.', linkedModules: [6, 7], safety: 'Use a paper schedule or software model only.' },
  { id: 'lab-test-sequence', title: 'Commissioning sequence cards', category: 'Testing', duration: '35 min', level: 'Intermediate', description: 'Build a verification sequence that respects safe dependencies from inspection through live testing.', steps: ['Sort inspection, dead-test and live-test cards', 'State the purpose and expected result for each', 'Define what stops progression to the next test'], evidence: 'Ordered test plan with hold points.', linkedModules: [8, 14, 15, 16], safety: 'Do not perform live tests without competence, authorization and supervision.' },
  { id: 'lab-fault-tree', title: 'Fault-finding decision tree', category: 'Diagnosis', duration: '35 min', level: 'Advanced', description: 'Move from symptom to safe, discriminating checks without guessing or changing several variables at once.', steps: ['Define the symptom precisely', 'List hypotheses from most likely to most hazardous', 'Choose the safest test that separates two hypotheses'], evidence: 'Decision tree with expected readings and next actions.', linkedModules: [9], safety: 'Use provided scenarios or safe training equipment only.' },
  { id: 'lab-handover', title: 'Professional handover pack', category: 'Communication', duration: '45 min', level: 'Intermediate', description: 'Assemble the information another electrician and the client need after a small project is complete.', steps: ['Summarize scope and departures', 'Prepare labels, schedules and test references', 'List operating guidance, limitations and future actions'], evidence: 'One-page handover plus a sample circuit schedule.', linkedModules: [7, 8, 10, 16], safety: 'Do not state that simulated work has been certified.' },
  { id: 'lab-capstone', title: 'Complete building design portfolio', category: 'Capstone', duration: '3-5 h', level: 'Advanced', description: 'Integrate client need, architecture, loads, distribution, circuits, protection, testing and handover into one defensible concept.', steps: ['Write the brief and assumptions register', 'Produce load, distribution and circuit documentation', 'Complete a design review, risk register and verification plan'], evidence: 'Portfolio containing brief, SLD, schedules, calculations, review and handover plan.', linkedModules: [2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16], safety: 'Concept-learning project only; qualified review is required before real-world use.' },
];

export const knowledgeChecks = [
  { id: 'q1', prompt: 'In a parallel circuit, which quantity is the same across every branch?', options: ['Current', 'Voltage', 'Resistance', 'Power'], answer: 1, explanation: 'Each branch is connected across the same two points, so it has the same potential difference.' },
  { id: 'q2', prompt: 'Which expression calculates electrical power from voltage and current?', options: ['P = V × I', 'P = V ÷ I', 'P = I ÷ R', 'P = R × V'], answer: 0, explanation: 'Power is the rate of energy transfer; for this relationship it is voltage multiplied by current.' },
  { id: 'q3', prompt: 'What is the first purpose of safe isolation?', options: ['Improve test accuracy', 'Prevent dangerous energy reaching the work', 'Reduce cable resistance', 'Balance three-phase loads'], answer: 1, explanation: 'Isolation controls hazardous energy before conductors or equipment are approached.' },
  { id: 'q4', prompt: 'Why is a protective device’s breaking capacity important?', options: ['It sets the cable colour', 'It limits normal load current', 'It must safely interrupt the prospective fault current', 'It determines the supply frequency'], answer: 2, explanation: 'A device must be able to interrupt the fault energy available at its point of installation.' },
  { id: 'q5', prompt: 'Which document best communicates how final circuits are arranged in a distribution board?', options: ['Risk matrix', 'Circuit schedule', 'Purchase receipt', 'Timesheet'], answer: 1, explanation: 'A circuit schedule identifies circuits, protective devices, loads and labels in a structured form.' },
  { id: 'q6', prompt: 'What distinguishes bonding from circuit protective earthing?', options: ['Bonding links conductive parts to reduce dangerous potential differences', 'Bonding carries normal load current', 'Earthing is only used outdoors', 'There is no difference'], answer: 0, explanation: 'Bonding manages potential differences between conductive parts; a CPC forms the fault path for its circuit.' },
  { id: 'q7', prompt: 'Which design check considers acceptable reduction of voltage along a circuit?', options: ['Diversity', 'Voltage drop', 'Power factor', 'Breaking capacity'], answer: 1, explanation: 'Voltage-drop assessment checks that the load receives suitable voltage under design conditions.' },
  { id: 'q8', prompt: 'Why should visual inspection happen before electrical testing?', options: ['It replaces every test', 'Visible defects can make testing unsafe or invalidate assumptions', 'It increases supply voltage', 'It proves maximum demand'], answer: 1, explanation: 'Inspection can reveal wrong connections, damage and missing protection before instruments are connected or energization is considered.' },
  { id: 'q9', prompt: 'What is the strongest first step in fault finding?', options: ['Replace the protective device', 'Define the symptom precisely and work safely', 'Disconnect every conductor', 'Increase the device rating'], answer: 1, explanation: 'A precise symptom and controlled safe method prevent guesswork and narrow the possible causes.' },
  { id: 'q10', prompt: 'Why is an assumptions register valuable in design?', options: ['It hides unknown information', 'It makes uncertain inputs visible for review and later correction', 'It replaces calculations', 'It fixes prices'], answer: 1, explanation: 'Design depends on inputs; recording assumptions makes review, coordination and revision traceable.' },
];

export const glossary = [
  { term: 'Bonding', definition: 'Connecting conductive parts so dangerous potential differences are limited during a fault.', category: 'Protection' },
  { term: 'Breaking capacity', definition: 'The fault current a protective device can interrupt safely under stated conditions.', category: 'Protection' },
  { term: 'Circuit protective conductor (CPC)', definition: 'The conductor that connects exposed conductive parts into the protective earthing path.', category: 'Protection' },
  { term: 'Circuit schedule', definition: 'A structured record of outgoing circuits, protective devices, loads and identifiers in a distribution board.', category: 'Documentation' },
  { term: 'Current', definition: 'The rate of flow of electric charge, measured in amperes.', category: 'Science' },
  { term: 'Design current', definition: 'The current a circuit is expected to carry under its intended load conditions.', category: 'Design' },
  { term: 'Discrimination / selectivity', definition: 'Coordination intended so the protective device nearest a fault operates while upstream supply remains available where possible.', category: 'Protection' },
  { term: 'Diversity', definition: 'An allowance recognizing that connected loads are unlikely to operate at full demand simultaneously.', category: 'Design' },
  { term: 'Earth fault loop impedance', definition: 'The total impedance of the path taken by earth-fault current from source to fault and back to source.', category: 'Testing' },
  { term: 'Earthing', definition: 'Connecting the installation’s protective system to the general mass of earth through the supply arrangement or an electrode.', category: 'Protection' },
  { term: 'Impedance', definition: 'Total opposition to alternating current, combining resistance and reactance.', category: 'Science' },
  { term: 'Isolation', definition: 'Disconnecting equipment or a circuit from every source of electrical energy for safety.', category: 'Safety' },
  { term: 'Maximum demand', definition: 'The greatest load expected at a point in an installation after justified operating assumptions.', category: 'Design' },
  { term: 'MCB', definition: 'A resettable circuit-breaker primarily used to protect a circuit against overcurrent.', category: 'Protection' },
  { term: 'Power', definition: 'The rate of electrical energy transfer, measured in watts.', category: 'Science' },
  { term: 'Power factor', definition: 'The ratio of useful real power to apparent power in an AC system.', category: 'Science' },
  { term: 'Prospective fault current', definition: 'The current expected to flow if a short circuit or earth fault occurs at a stated point.', category: 'Design' },
  { term: 'RCD', definition: 'A device that disconnects when it detects a residual-current imbalance above its operating threshold.', category: 'Protection' },
  { term: 'RCBO', definition: 'A device combining residual-current and overcurrent protection for a circuit.', category: 'Protection' },
  { term: 'Resistance', definition: 'Opposition to current flow that dissipates electrical energy, measured in ohms.', category: 'Science' },
  { term: 'Single-line diagram (SLD)', definition: 'A simplified diagram showing major equipment, circuits and distribution relationships with single lines.', category: 'Documentation' },
  { term: 'Voltage', definition: 'Electric potential difference that drives charge through a circuit, measured in volts.', category: 'Science' },
  { term: 'Voltage drop', definition: 'The reduction in voltage between source and load caused by current flowing through circuit impedance.', category: 'Design' },
  { term: 'Ze / Zs', definition: 'Common notation for external earth-fault loop impedance at the origin (Ze) and total loop impedance for a circuit (Zs).', category: 'Testing' },
];
