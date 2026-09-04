import bookAssets from './book-assets.json';
export type BookId = 'installation-designs' | 'modern-wiring';
export type BookChapter = { title: string; printed: string; pdf: number };
export type CourseBook = { id: BookId; title: string; shortTitle: string; authors: string; edition: string; year: number; pages: number; description: string; chapters: BookChapter[] };
export type Reading = { bookId: BookId; title: string; printed: string; pdf: number; end: number; purpose: string };
export type ReadingTopic = { id: string; title: string; lessonIds: string[]; readings: Reading[]; principle: string; question: string; explanation: string; experiment?: 'rcd' | 'cable' | 'motor'; rule: string };

const chapter = (title: string, printed: string, pdf: number): BookChapter => ({ title, printed, pdf });
export const courseBooks: CourseBook[] = [
  { id: 'installation-designs', title: 'Electrical Installation Designs', shortTitle: 'Installation Designs', authors: 'Bill Atkinson · Roger Lovegrove · Gary Gundry', edition: 'Fourth edition', year: 2013, pages: 264, description: 'Design decisions, worked examples and complete building projects.', chapters: [
    chapter('Introduction', '1', 23), chapter('Three Bedroom House', '8', 30), chapter('Retirement Flatlets', '21', 43), chapter('Overcurrent Protection', '35', 57), chapter('An Architect’s Office', '44', 66), chapter('A High Street Shop', '62', 84), chapter('Earthing and Bonding', '75', 97), chapter('Car Service Workshop', '90', 112), chapter('Circuits', '111', 133), chapter('Farming and Horticulture', '123', 145), chapter('Isolation and Switching', '138', 160), chapter('A Village Sports Centre', '145', 167), chapter('An Indoor Swimming Pool', '160', 182), chapter('Cables and Wiring Systems', '174', 196), chapter('Inspection, Testing and Certification', '186', 208), chapter('A Caravan Park', '208', 230), chapter('Residual Current Devices', '213', 235), chapter('Flood Lighting Project', '224', 246), chapter('Circuit Design Calculations', '231', 253), chapter('Index', '239', 260),
  ] },
  { id: 'modern-wiring', title: 'Modern Wiring Practice', shortTitle: 'Wiring Practice', authors: 'W. E. Steward · R. A. Beck · edited by T. A. Stubbs', edition: 'Fourteenth edition', year: 2010, pages: 352, description: 'Installation methods, design fundamentals and practical photographs.', chapters: [
    chapter('Regulations Governing Installations', '3', 18), chapter('Fundamental Principles', '25', 40), chapter('The Design Process', '47', 62), chapter('Installation Design', '57', 72), chapter('Distribution of Supplies in Buildings', '101', 116), chapter('Worked Example', '139', 154), chapter('Special Types of Installation', '181', 196), chapter('A Survey of Installation Methods', '197', 212), chapter('Conduit Systems', '215', 230), chapter('Trunking Systems', '241', 256), chapter('Busbar and Modular Wiring Systems', '255', 270), chapter('Power Cable Systems', '261', 276), chapter('Insulated and Sheathed Cable Systems', '273', 288), chapter('Mineral Insulated Cables', '281', 296), chapter('Luminaires, Switches, Socket Outlets and Data', '291', 306), chapter('Inspection and Testing', '301', 316), chapter('Appendix A: Historical IEE Tables', '319', 334), chapter('Glossary', '327', 342), chapter('Index', '329', 344),
  ] },
];
export const getBook = (id: string) => courseBooks.find(book => book.id === id);
export const bookByteLengths: Record<BookId, number> = { 'installation-designs': bookAssets['installation-designs'].reader.size, 'modern-wiring': bookAssets['modern-wiring'].reader.size };
const read = (bookId: BookId, title: string, printed: string, pdf: number, end: number, purpose: string): Reading => ({ bookId, title, printed, pdf, end, purpose });
export const readingTopics: ReadingTopic[] = [
  { id: 'rcd', title: 'Follow the return current', lessonIds: ['p02-l07','p02-l08','p05-l04','p05-l15','p09-l06'], experiment: 'rcd',
    readings: [read('installation-designs','Healthy circuit and earth fault','214–216',236,238,'Compare the paths in figures 17.1–17.3.')],
    principle: 'An RCD compares the currents passing through its sensor. A return path outside that sensor creates a residual current. Detection of this imbalance is different from overload protection.',
    question: 'When less current returns through neutral, has current disappeared? Explain the other path.', explanation: 'Current still returns to the supply. In this earth-fault example, some returns through the protective path outside the sensing point. An RCCB needs coordinated overcurrent protection; an RCBO combines residual-current and overcurrent functions.',
    rule: 'The book uses historical UK requirements. Select the RCD type, sensitivity and disconnection requirements using the applicable current standard and equipment instructions.',
  },
  { id: 'cable', title: 'Match the cable to its route', lessonIds: ['p06-l04','p06-l05','p06-l10'], experiment: 'cable',
    readings: [read('modern-wiring','Capacity and installation conditions','63–69',78,84,'Separate tabulated capacity from capacity under actual conditions.'),read('installation-designs','The circuit design sequence','231–233',253,255,'Connect load, protection, cable selection and voltage drop.')],
    principle: 'A cable’s usable current capacity depends on its installation conditions. Start with the load and protective device, then consider the route, thermal conditions, voltage drop and fault protection.',
    question: 'Why can the same cable size suit one route but be unsuitable for another?', explanation: 'Heat dissipation changes with grouping, ambient temperature and thermal insulation. Length changes voltage drop and fault-loop impedance. A current-capacity check alone does not establish the suitability of a complete circuit.',
    rule: 'The model uses illustrative coefficients, not a cable-selection table. Use verified cable data and applicable correction factors before making a real design decision. The scanned example on Wiring Practice p. 65 mixes 60 °C with a factor for 55 °C; its numbers need checking.',
  },
  { id: 'voltage-drop', title: 'Explain the voltage lost along a route', lessonIds: ['p06-l07','p06-l08'], experiment: 'cable',
    readings: [read('installation-designs','Voltage drop and design checks','233',255,255,'Follow equation 19.2 and identify every unit.')],
    principle: 'A circuit’s conductors have impedance. Current through that impedance causes voltage drop, so a longer route can require a different design even when the load has not changed.',
    question: 'With current and the table coefficient unchanged, what happens to voltage drop when the route length doubles?', explanation: 'In the simplified table-coefficient calculation, voltage drop doubles. The coefficient must match the cable and circuit arrangement. Do not double the length again if that coefficient already includes the circuit conductors.',
    rule: 'Permitted voltage drop depends on the applicable standard and circuit. This model shows the calculation without declaring a universal compliance limit.',
  },
  { id: 'motor', title: 'See why the starter stays on', lessonIds: ['p04-l19','p04-l20','p15-v2-l01'], experiment: 'motor',
    readings: [read('modern-wiring','Motor starters and stop controls','131–135',146,150,'Find the maintaining contact in figure 5.24 on p. 134.')],
    principle: 'The start button energizes the contactor coil. An auxiliary holding contact maintains the circuit after Start is released. Stop, overload trip or loss of supply opens the control circuit.',
    question: 'Why does restoring the supply not restart this three-wire control model?', explanation: 'Loss of supply drops out the coil and its holding contact. The start button is open, so restoring supply alone does not complete the coil circuit. An intentional new Start action is needed.',
    rule: 'This is a control-logic model. Real motor protection, overload settings and machinery safety functions require the motor data, product instructions and applicable standards.',
  },
  { id: 'earthing', title: 'Separate earthing from bonding', lessonIds: ['p02-l04','p02-l05','p05-l07','p05-l08','p05-l09','p05-l10'],
    readings: [read('installation-designs','Earthing and bonding','75–82',97,104,'Compare protective conductor functions and the fault path.')],
    principle: 'Protective earthing provides the intended connection for exposed conductive parts as part of a protective measure. Protective bonding connects relevant conductive parts to reduce dangerous potential differences.',
    question: 'Why does connecting two metal parts together not by itself prove that fault protection will operate?', explanation: 'Bonding and disconnection perform different jobs. The complete fault path, protective device and required operating conditions still need to be verified.',
    rule: 'Confirm the actual supply earthing arrangement, which parts need bonding, conductor selection and disconnection requirements. Historical UK assumptions are not evidence of the supply at a Kenyan property.',
  },
  { id: 'containment', title: 'Read the installation around the cables', lessonIds: ['p04-l08','p04-l09','p04-l10','p04-l11','p04-l12','p04-l13','p04-l14'],
    readings: [read('modern-wiring','Power cable systems','261–266',276,281,'Look for access, support and the route above a suspended ceiling in figure 12.2.')],
    principle: 'A route needs mechanical protection, support, access and suitable environmental protection as well as enough space. Good installation choices make later inspection and maintenance possible.',
    question: 'What can you identify from the photograph, and what would still require measurements or design information?', explanation: 'You can identify visible containment and routing. A photograph alone cannot establish loading, hidden connections, material ratings, separation requirements or complete compliance.',
    rule: 'Check current support, segregation, fire-stopping and product requirements for the actual installation. Keep the manufacturer’s bend radius and loading limits tied to the selected system.',
  },
  { id: 'testing', title: 'Use a result as evidence', lessonIds: ['p08-l02','p08-l03','p08-l04','p08-l05','p09-l01'],
    readings: [read('modern-wiring','Connect inspection with the design','302–303',317,318,'Read why verification is compared with the design.'),read('installation-designs','Continuity of protective conductors','199',221,221,'Interpret figure 15.6 as a historical test illustration.')],
    principle: 'A test result only becomes useful when you know what the test checks, what you expect and what could explain a different result. Inspection and testing support each other.',
    question: 'What would you investigate if a virtual continuity result were much higher than the expected value?', explanation: 'Consider the test setup, lead resistance, conductor length and size, connections and possible discontinuities. Interpret the evidence before deciding on the next test.',
    rule: 'Follow current safe-isolation and verification procedures, instrument instructions and competent supervision for practical work. The book’s test sequences and clause numbers are historical.',
  },
  { id: 'house', title: 'Turn the plan into a design brief', lessonIds: ['p10-l03','p10-l04','p11-l01','p16-l07'],
    readings: [read('installation-designs','Three-bedroom house','8–13',30,35,'Use figure 2.1 on p. 10 to identify loads and missing client decisions.'),read('modern-wiring','The design process','47–50',62,65,'Connect the brief to later design decisions.')],
    principle: 'A floor plan is the beginning of a design. You also need the client’s uses, loads, supply information, environmental conditions and requirements for future changes.',
    question: 'Which five questions would you ask before choosing the circuits for this house?', explanation: 'Ask about appliances and loads, room uses, supply and earthing, special environmental conditions and future needs. Record the answers as design assumptions that can be checked.',
    rule: 'Treat the layout as a historical UK case study. A project in Kenya needs its own brief, applicable building and electrical requirements, and supply information.',
  },
  { id: 'workshop', title: 'Connect the building to its loads', lessonIds: ['p07-l06','p07-l07','p10-l06','p10-l08'],
    readings: [read('installation-designs','Workshop plans and requirements','90–96',112,118,'Use the lighting and power plans to start a load schedule.')],
    principle: 'The equipment, its operating pattern and its location influence distribution, isolation, protection and the wiring route. A drawing alone cannot give the complete maximum demand.',
    question: 'What extra information would you need about the compressor and welder before completing the load schedule?', explanation: 'Use equipment ratings, supply and starting characteristics, expected use, controls and manufacturer requirements. Make any diversity assumptions explicit.',
    rule: 'Workshop hazards and machine requirements are project-specific. Verify current electrical, machinery and workplace requirements before converting a teaching case into a real design.',
  },
];
export const readingForLesson = (lessonId: string) => readingTopics.find(topic => topic.lessonIds.includes(lessonId));
export function simulationForPage(bookId: BookId, page: number) {
  return readingTopics.flatMap(topic => topic.experiment ? topic.readings.filter(reading => reading.bookId === bookId && page >= reading.pdf && page <= reading.end).map(reading => ({ topic, span: reading.end - reading.pdf })) : []).sort((a, b) => a.span - b.span)[0]?.topic;
}
export function printedPage(book: CourseBook, pdf: number) {
  if (book.id === 'installation-designs') return pdf >= 260 ? `p. ${pdf - 21}` : pdf >= 23 ? `p. ${pdf - 22}` : 'Front matter';
  return pdf >= 16 ? `p. ${pdf - 15}` : 'Front matter';
}
