import type { Flashcard } from './assessment-data';

type CardRevision = { front: string; back: string; why: string; practice: string };
export const professionalFlashcardRevisions: Record<string, CardRevision> = {
  'p16-l06-concept-1': { front: 'A repaired connection looks cooler under a lower load. Why is that not enough to confirm a successful repair?', back: 'The reduced load itself can reduce heating; compare the operating conditions and the evidence of repair.', why: 'A before-and-after temperature change has to be interpreted in context.', practice: 'Record the load with repeat images so a later reviewer can make a meaningful comparison.' },
  'p16-l06-concept-2': { front: 'Why can a shiny metal connector give a misleading apparent temperature?', back: 'It can reflect infrared energy and has different emissivity from nearby insulation.', why: 'The imager converts received radiation into a display using measurement assumptions.', practice: 'Identify the surface and settings rather than judging unlike surfaces by colour alone.' },
  'p16-l06-concept-3': { front: 'Heating extends along a motor feeder. What electrical causes does the instructor say to investigate?', back: 'Loading or overload, phase imbalance and harmonic content, using complementary measurements.', why: 'Several electrical conditions can produce distributed heating, so the image alone does not identify the cause.', practice: 'Connect the thermal observation to the relevant authorised electrical investigation.' },
  'p16-l06-concept-4': { front: 'What makes a thermal finding usable by someone planning a repair?', back: 'An identifiable location, visual and thermal evidence, operating context, the interpreted finding and follow-up action.', why: 'A cropped hot spot without context is hard to locate or compare later.', practice: 'Preserve a record another competent person can follow without the surveyor being present.' },
  'p16-l06-term-1': { front: 'At unchanged resistance, doubling current changes resistive power by what factor?', back: 'Four: P = I²R. This does not imply four times the Celsius temperature.', why: 'Current is squared in the power relationship; actual temperature also depends on heat loss and ambient conditions.', practice: 'Distinguish a calculated power ratio from the camera’s temperature reading.' },
  'p16-l06-standard': { front: 'Why can a shared neutral be heavily loaded even when phase RMS currents look balanced?', back: 'Triplen harmonic components from nonlinear loads can add in the neutral.', why: 'Matching RMS magnitudes do not describe the frequency components or their phase relationships.', practice: 'Investigate the neutral and harmonics rather than assuming balanced phase readings settle the issue.' },
  'p16-l06-overview-retrieval': { front: 'How should a thermal anomaly become a supported maintenance finding?', back: 'Identify the component; assess load and measurement limitations; investigate the likely cause with complementary evidence; document the finding and compare conditions after repair.', why: 'A thermal pattern is a starting point for diagnosis and follow-up, not a complete explanation by itself.', practice: 'Keep the observations, interpretation and recommended action distinct in the report.' },
  'p16-l08-concept-1': { front: 'What should a room-by-room rewire plan establish before detailed pricing?', back: 'The required points, exact positions, accessory finishes and additional systems or future provision.', why: 'A room count leaves too much of the actual installation undefined.', practice: 'Resolve the customer’s choices before they become first-fix changes.' },
  'p16-l08-concept-2': { front: 'Why did the one-week absence of the residents complicate the instructor’s rewire?', back: 'It restricted the working programme and the usual sequence around plastering, second fix and testing.', why: 'Occupancy affects how the stages fit together, not just the number of points.', practice: 'Plan access and the necessary completion stages before agreeing a programme.' },
  'p16-l08-concept-3': { front: 'Why might retaining one room’s wiring add labour instead of simply saving it?', back: 'Its condition and integration into the new circuits must be worked out.', why: 'The instructor identifies this request as one reason the case took longer than expected.', practice: 'Investigate reuse before deducting the room’s allowance.' },
  'p16-l08-concept-4': { front: 'Which supporting costs did the rewire review highlight beyond cable and accessories?', back: 'Tool hire, site lighting and waste disposal.', why: 'Resources used to deliver the job still cost money even when they are not part of the finished installation.', practice: 'Walk through the job for supporting resources and clarify who handles the waste.' },
  'p16-l08-term-1': { front: 'How can a building-material survey change an electrical quotation?', back: 'Its findings can change the planned route, method, specialist input and time allowance.', why: 'The instructor’s survey identified hazardous material in areas that could otherwise have been disturbed.', practice: 'Resolve survey constraints during planning; the lesson does not authorise hazardous-material work.' },
  'p16-l08-term-2': { front: 'Two people work five eight-hour days. How much labour is that?', back: 'Ten person-days, or 80 person-hours.', why: 'Calendar duration and total labour are different: count each person’s time once.', practice: 'Use explicit crew and day-length assumptions when building the labour estimate.' },
  'p16-l08-standard': { front: 'Why must a rewire quotation allow time for testing as well as installing the agreed points?', back: 'The point schedule states the intended work but does not verify the completed installation.', why: 'The instructor includes testing in the completion sequence; the relevant technical checks need their own time.', practice: 'Include completion checks in the planned labour, not only if time remains.' },
  'p16-l08-overview-retrieval': { front: 'What did the rewire overrun teach about making the next quotation more realistic?', back: 'Define the customer’s requirements; investigate site and retained-work constraints; allow realistic team time and sequencing; include hire, lighting and waste; compare the estimate with the actual job afterwards.', why: 'The case links the overrun to identifiable planning and resource assumptions rather than only to a low headline price.', practice: 'Use completed-job records to improve the next estimate without copying one property’s quantities or rates into every rewire.' },
  'p16-l07-concept-1': {
    front: 'What is the instructor’s “mental method statement” when pricing a job?',
    back: 'A step-by-step walk-through of how the actual job will be done, used to identify time and materials.',
    why: 'Small tasks are easy to overlook when estimating only the final visible result.',
    practice: 'For the bakery socket, include the awkward route and distribution-board work rather than estimating from cable length alone.',
  },
  'p16-l07-concept-2': {
    front: 'A required fitting has a two-week lead time. What must be checked before promising a start date?',
    back: 'Both the fitting’s availability and the electrician’s availability.',
    why: 'An empty diary slot cannot compensate for a required item that has not arrived.',
    practice: 'Communicate the lead-time constraint in the quotation so the customer can plan around a realistic date.',
  },
  'p16-l07-concept-3': {
    front: 'Why does the instructor allow more time than his fastest estimate for work on existing accessories?',
    back: 'Unseen conditions and small additional tasks may take time; a realistic allowance reduces pressure to rush.',
    why: 'He describes unexpected problems inside accessories as a reason that apparently simple work can overrun.',
    practice: 'Allow for plausible uncertainty while keeping genuine changes of scope open to a separate agreement.',
  },
  'p16-l07-concept-4': {
    front: 'A customer requests work outside the written quotation. What should be settled before doing that extra?',
    back: 'The additional scope and its price, agreed with the customer.',
    why: 'Discussing an extra as it arises prevents an unexpected final charge.',
    practice: 'Keep the agreed variation with the original job record rather than relying on memory at invoicing.',
  },
  'p16-l07-term-1': {
    front: 'How does the instructor use “fixed-price quotation” rather than an indicative estimate?',
    back: 'He gives a defined result and agreed price, with changes discussed separately rather than automatically billing more hours.',
    why: 'A defined scope lets the customer understand what the fixed price covers and which later requests would be extras.',
    practice: 'Keep the detailed labour and materials calculation even when presenting the customer with one total.',
  },
  'p16-l07-overview-retrieval': {
    front: 'How does the instructor turn a site visit into a quotation the customer can rely on?',
    back: 'Record the site details; walk through the work; list and price materials with lead times; allow realistic labour; send a clear written quotation promptly and agree extras as they arise.',
    why: 'The sequence links observations to resources, timing and a shared understanding of the work.',
    practice: 'Use the visit photographs to check details while preparing the quote, then communicate known constraints before work starts.',
  },
};

export function applyProfessionalCardRevision(card: Flashcard): Flashcard {
  const revision = professionalFlashcardRevisions[card.id];
  if (!revision) return card;
  return { ...card, front: revision.front, back: revision.back, design: {
    objective: revision.front, principle: revision.back, why: revision.why,
    keyIdea: revision.back, practice: revision.practice, diagnostics: [],
    authorNote: 'Independent retrieval authored against the supplied lesson transcript; not an MCQ with its options removed.',
  } };
}
