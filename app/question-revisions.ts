import type { AssessmentQuestion } from './assessment-data';
import type { QuestionDesign, Retrieval } from './learning-design';
import { foundationRevisions } from './foundation-revisions';

export type Revision = {
  prompt: string; correct: string;
  wrong: [string, string, string];
  errors: [string, string, string];
  why: string; distinction: string; practice?: string;
  followUp: Retrieval; workingTex?: string;
};
export const questionRevisions: Record<string, Revision> = {
  ...foundationRevisions,
  'p01-l01-q-concept-1': {
    prompt: 'A neutral atom gains one electron without changing its nucleus. What happens to its net charge?',
    correct: 'It becomes negative because it has more electrons than protons.',
    wrong: ['It becomes positive because gaining a particle adds positive charge.', 'It stays neutral because the number of protons has not changed.', 'It stays neutral because each proton changes charge to balance the new electron.'],
    errors: ['Adding a particle does not necessarily add positive charge; an electron is negative.', 'Net charge depends on both protons and electrons, not the nucleus alone.', 'A proton retains its positive charge; it does not adjust to cancel an added electron.'],
    why: 'Protons carry positive charge and electrons carry an equal magnitude of negative charge. A neutral atom has equal numbers of both. Adding an electron leaves an excess of negative charge.',
    distinction: 'Particle count and net charge are different: the sign of the added particle matters.',
    practice: 'Static charging transfers electrons between materials. A surface that gains electrons becomes negatively charged without requiring its nuclei to move.',
    followUp: { prompt: 'A neutral object loses electrons. What sign of charge is left?', answer: 'Positive.', why: 'Removing negative charge leaves more positive proton charge than negative electron charge.' },
  },
  'p01-l01-q-concept-2': {
    prompt: 'A metal wire carries current without moving along the cable route. Which description explains this?',
    correct: 'Mobile electrons drift through a structure whose positive ion cores stay in place.',
    wrong: ['Positive nuclei travel through a structure of stationary electrons.', 'Electrons and nuclei travel together at the same average speed.', 'Electrons remain attached to individual atoms while neutrons carry charge through the wire.'],
    errors: ['Metallic conduction does not require the positive nuclei to travel along the wire.', 'The metal structure does not flow with the conduction electrons.', 'Neutrons carry no net electric charge and are not the carriers of current in copper.'],
    why: 'A metal has electrons that can move through its structure. Its positive ion cores remain arranged in the solid, vibrating around their positions. A small average drift of mobile electrons produces current.',
    distinction: 'Charge movement through a solid does not mean the solid itself flows.',
    practice: 'A fixed copper conductor transfers charge while remaining mechanically secured in its terminals.',
    followUp: { prompt: 'Does a copper wire need to lose copper atoms to supply a steady current?', answer: 'No.', why: 'Current is charge transfer by mobile electrons; it does not consume the copper structure.' },
  },
  'p01-l01-q-concept-3': {
    prompt: 'Which particles carry current through a copper conductor during normal operation?',
    correct: 'Conduction electrons that can move through the metal.',
    wrong: ['Protons released from copper nuclei by the supply.', 'Copper ions travelling from one terminal to the other.', 'Neutrons passing between adjacent copper atoms.'],
    errors: ['The supply does not release protons from atomic nuclei during normal conduction.', 'Ion movement can carry current in electrolytes, but this is not the mechanism in solid copper.', 'Neutrons have no net electric charge, so their motion does not explain copper current.'],
    why: 'Some electrons in copper are mobile within the metallic structure. An electric field produces an average drift of these negatively charged carriers. The positive ion cores remain part of the solid.',
    distinction: 'The charge carrier depends on the material; metallic conduction is electron conduction.',
    practice: 'A copper cable and a battery electrolyte both carry current, but the moving charge carriers are different.',
    followUp: { prompt: 'Why can an electrolyte carry current even though it is not a metal?', answer: 'Mobile positive and negative ions can carry charge through it.', why: 'Current requires moving charge, not a particular material or only one type of carrier.' },
  },
  'p01-l02-q-concept-1': {
    prompt: 'Why can copper carry current without copper atoms travelling from the supply to an appliance?',
    correct: 'Some electrons are mobile throughout the metal while its ion cores remain in place.',
    wrong: ['The supply creates new conduction electrons inside every copper atom.', 'Current begins only after supply electrons have travelled the full cable length.', 'Copper nuclei move through the wire and carry its positive current.'],
    errors: ['The supply drives charge that is already present; it does not have to create a new population of electrons.', 'This confuses slow electron drift with the rapid establishment of an electrical response.', 'Conventional current direction does not mean copper nuclei move along the conductor.'],
    why: 'Copper has mobile conduction electrons distributed throughout its structure. An electric field gives their motion a small average drift. Copper therefore conducts without its solid structure travelling through the circuit.',
    distinction: 'The electrons are mobile; the copper structure stays in place.',
    practice: 'A copper cable can carry current continuously while remaining fixed inside a wall and at its terminals.',
    followUp: { prompt: 'Must a lamp receive a newly supplied batch of electrons before it can respond?', answer: 'No. Mobile charges are already present throughout the circuit.', why: 'The electrical field change propagates through the circuit much faster than individual electrons drift.' },
  },
  'p01-l02-q-concept-2': {
    prompt: 'A lamp responds quickly when a circuit closes, although electron drift is slow. What explains this?',
    correct: 'Charges already present throughout the circuit respond as the electric field change propagates.',
    wrong: ['The electrons leaving the switch quickly travel the full cable length to reach the lamp.', 'Electrons stay completely stationary because only energy moves through the circuit.', 'The lamp waits for source electrons, but their drift becomes almost the speed of light.'],
    errors: ['A fast electrical response does not mean one electron travels from switch to lamp in that time.', 'Slow drift is still movement: current in a metal involves charge carriers moving.', 'Electron drift remains much slower than the electrical signal; it does not become light-speed travel.'],
    why: 'Mobile charges are already distributed through the conductors. Closing the circuit changes the electric field, and that change propagates rapidly through the circuit. The charges respond locally, so the lamp need not wait for a particular electron from the source.',
    distinction: 'Electron drift is motion of individual charge carriers. Signal propagation is the spread of an electrical change.',
    practice: 'A long lighting circuit can respond promptly even though any one electron has moved only a small average distance.',
    followUp: { prompt: 'A distant relay responds promptly to a control signal. Does this prove that an electron travelled from the switch to the relay in that time?', answer: 'No.', why: 'Prompt response demonstrates propagation of the electrical change, not the end-to-end journey of an individual electron.' },
  },
  'p01-l02-q-concept-3': {
    prompt: 'Electrons drift from right to left in a copper wire. Which way is conventional current?',
    correct: 'Left to right, because conventional current follows positive-charge movement.',
    wrong: ['Right to left, because current direction follows whichever particles move.', 'Neither direction, because negative charges do not count as current.', 'Both directions equally, because electrons and copper nuclei counterflow.'],
    errors: ['Conventional direction uses a positive-charge reference, not the direction of every type of carrier.', 'Moving negative charge produces current, with the conventional direction opposite its movement.', 'Copper nuclei do not provide a second counterflow in normal metallic conduction.'],
    why: 'An electron has negative charge. Its movement therefore produces conventional current in the opposite direction. Circuit diagrams use this positive-charge convention consistently.',
    distinction: 'A current arrow is a reference for charge flow, not a picture of an electron’s path.',
    practice: 'Use conventional current arrows consistently when interpreting circuit diagrams and magnetic-field rules.',
    followUp: { prompt: 'If electron drift reverses, what happens to conventional current direction?', answer: 'It also reverses, remaining opposite to electron drift.', why: 'The sign convention stays the same when the physical motion reverses.' },
  },
  'p01-l03-q-concept-1': {
    prompt: 'In ordinary charging, an isolated object gains electrons. Which change in charge is possible?',
    correct: 'An increase in negative charge by a whole-number multiple of the elementary charge.',
    wrong: ['Any fraction of one electron’s charge can be added by transferring part of an electron.', 'The object gains positive charge because it gains matter.', 'The transferred electrons become neutral once they enter the object.'],
    errors: ['Ordinary electron transfer moves whole electrons, each with the elementary charge magnitude.', 'The transferred particle is negatively charged; gaining matter does not set the charge sign.', 'Electrons retain their negative charge after transfer.'],
    why: 'Each electron carries the same fixed magnitude of charge. Ordinary charging transfers electrons, so the net change comes in whole multiples of that magnitude. Very large numbers make charge appear continuous in installation calculations.',
    distinction: 'A practically smooth current can still be carried by discrete particles.',
    practice: 'An ammeter reports a macroscopic flow rate; it does not need to count each electron individually.',
    followUp: { prompt: 'Why can an ammeter show a smoothly changing current if electrons carry fixed amounts of charge?', answer: 'It measures the average transfer of an enormous number of electrons.', why: 'The individual charge steps are tiny compared with ordinary circuit measurements.' },
  },
  'p01-l03-q-concept-2': {
    prompt: 'A total charge of 1 C passes a point in a wire. What does this tell you?',
    correct: 'The amount of transferred charge; elapsed time is still needed to find average current.',
    wrong: ['The current is 1 A, regardless of how long the transfer takes.', 'Exactly one electron passed the point.', 'The circuit transferred 1 J of energy, regardless of voltage.'],
    errors: ['One ampere requires one coulomb per second, not merely one coulomb.', 'One coulomb is the combined charge magnitude of an enormous number of electrons.', 'Energy transfer depends on potential difference as well as charge.'],
    why: 'The coulomb measures charge amount. It does not include time or energy. Current needs charge divided by elapsed time; energy transferred per charge depends on voltage.',
    distinction: 'C measures charge; A measures charge per second; J measures energy.',
    practice: 'A charge figure alone cannot tell you whether a cable has carried a small current for a long time or a large current briefly.',
    followUp: { prompt: 'The same 1 C passes in 2 s instead of 1 s. How does average current change?', answer: 'It halves, from 1 A to 0.5 A.', why: 'The same charge spread over twice the time gives half the transfer rate.', workingTex: 'I=\\frac{Q}{t}=\\frac{1\\,\\mathrm{C}}{2\\,\\mathrm{s}}=0.5\\,\\mathrm{A}' },
  },
  'p01-l03-q-concept-3': {
    prompt: 'A current is recorded as 30 mA. Which value represents the same current in amperes?',
    correct: '0.030 A.',
    wrong: ['30,000 A.', '0.30 A.', '30 A.'],
    errors: ['Milli means one thousandth; converting mA to A requires division by 1,000.', 'Moving the decimal two places converts by 100, but milli requires a factor of 1,000.', 'Dropping the prefix without changing the number makes the value 1,000 times too large.'],
    why: 'The prefix milli means one thousandth of the base unit. Therefore 30 milliamperes is 30 divided by 1,000 amperes. The physical current stays the same when its unit notation changes.',
    distinction: 'A prefix changes the scale of the number, not the electrical quantity.',
    practice: 'Residual-current ratings often use mA while load-current ratings use A. Convert the units before comparing numerical values.',
    workingTex: '30\\,\\mathrm{mA}=30\\times10^{-3}\\,\\mathrm{A}=0.030\\,\\mathrm{A}',
    followUp: { prompt: 'Express 0.5 A in milliamperes.', answer: '500 mA.', why: 'Each ampere contains 1,000 milliamperes.', workingTex: '0.5\\,\\mathrm{A}=500\\,\\mathrm{mA}' },
  },
  'p01-l04-q-concept-1': {
    prompt: 'A steady current is 1 A. What does that mean at a point in the conductor?',
    correct: 'One coulomb of charge passes that point each second.',
    wrong: ['One coulomb passes that point, with no restriction on the time taken.', 'One joule of energy passes that point each second.', 'One coulomb of charge remains stored at that point.'],
    errors: ['This identifies charge amount but leaves out the time that defines current.', 'Joules per second measures power, not current.', 'Stored charge is an amount; current describes charge passing a point.'],
    why: 'Current is the rate of charge transfer. One ampere means one coulomb passes a point in each second. A current value therefore always includes an amount-per-time relationship.',
    distinction: 'Charge is how much; current is how much per second.',
    practice: 'A steady 2 A transfers 10 C past a point in 5 s. The conductor does not accumulate all that charge at the measuring point.',
    workingTex: 'I=\\frac{Q}{t},\\qquad 1\\,\\mathrm{A}=1\\,\\mathrm{C}/\\mathrm{s}',
    followUp: { prompt: 'A control circuit transfers 12 C in 4 s. What is its average current?', answer: '3 A.', why: 'Divide the transferred charge by the elapsed time.', workingTex: 'I=\\frac{12\\,\\mathrm{C}}{4\\,\\mathrm{s}}=3\\,\\mathrm{A}' },
  },
  'p01-l04-q-concept-2': {
    prompt: 'Two conductors each transfer 8 C. The first takes 2 s and the second 4 s. How do their average currents compare?',
    correct: 'The first carries twice the average current: 4 A compared with 2 A.',
    wrong: ['They carry equal current because the transferred charge is equal.', 'The second carries twice the current because charge flows for longer.', 'The first carries four times the current because its transfer takes 2 s.'],
    errors: ['Equal charge does not imply equal current when elapsed times differ.', 'For fixed charge, a longer transfer time means a smaller rate.', 'The time ratio is two, so the current ratio is two, not four.'],
    why: 'Average current is transferred charge divided by elapsed time. With the same charge, halving the time doubles the average current. Calculate each rate using the same units before comparing.',
    distinction: 'Total charge can be equal even when current differs.',
    practice: 'A brief high-current pulse and a longer low-current supply can transfer the same charge while imposing different heating conditions.',
    workingTex: 'I_1=\\frac{8}{2}=4\\,\\mathrm{A},\\qquad I_2=\\frac{8}{4}=2\\,\\mathrm{A}',
    followUp: { prompt: 'A steady current stays at 2 A while operating time doubles. What happens to transferred charge?', answer: 'It doubles.', why: 'At a fixed rate, twice the time transfers twice the amount.' },
  },
  'p01-l04-q-concept-3': {
    prompt: 'A steady 2 A flows for 5 s. How much charge passes a point?',
    correct: '10 C.',
    wrong: ['0.4 C.', '2.5 C.', '10 A.'],
    errors: ['Dividing current by time does not calculate charge; accumulate the rate over the duration.', 'Dividing time by current does not have the units of charge.', 'The number is the product, but the unit must change from amperes to coulombs.'],
    why: 'Two amperes means two coulombs each second. Five seconds therefore transfers five lots of two coulombs. Multiplying current by time gives charge when the current is steady.',
    distinction: 'The answer is an amount of charge, not another current.',
    practice: 'The same calculation gives transferred charge during a steady-current charging interval; it does not by itself give the energy stored.',
    workingTex: 'Q=It=(2\\,\\mathrm{A})(5\\,\\mathrm{s})=10\\,\\mathrm{C}',
    followUp: { prompt: 'A steady 3 A must transfer 12 C. How long must it flow?', answer: '4 s.', why: 'Time is the required charge divided by the charge transferred each second.', workingTex: 't=\\frac{Q}{I}=\\frac{12\\,\\mathrm{C}}{3\\,\\mathrm{A}}=4\\,\\mathrm{s}' },
  },
};

export function applyQuestionRevision(question: AssessmentQuestion): AssessmentQuestion {
  const revision = questionRevisions[question.id];
  if (!revision) return question;
  const followUp = {
    ...revision.followUp,
    prompt: revision.followUp.prompt.trim().endsWith('?') ? revision.followUp.prompt : `${revision.followUp.prompt.trim()}?`,
    why: revision.followUp.why.length >= 36 ? revision.followUp.why : `${revision.followUp.why} ${revision.distinction}`,
  };
  const options = [...revision.wrong];
  options.splice(question.answer, 0, revision.correct);
  const diagnostics: QuestionDesign['diagnostics'] = revision.errors.map(diagnosis => ({
    diagnosis: diagnosis.length >= 35 ? diagnosis : `${diagnosis} ${revision.distinction}`,
    repair: revision.why,
  }));
  diagnostics.splice(question.answer, 0, null);
  const practice = revision.practice ?? question.teaching!.application;
  return { ...question, prompt: revision.prompt, options, explanation: revision.correct,
    feedback: diagnostics.map(item => item?.diagnosis ?? revision.why),
    teaching: { reasoning: revision.why, application: practice },
    design: {
      objective: revision.prompt, principle: revision.correct, why: revision.why,
      distinction: revision.distinction, keyIdea: revision.distinction, practice,
      workingTex: revision.workingTex, followUp, diagnostics,
      authorNote: 'Replaces sentence recognition with a specified conceptual decision; each distractor represents a different error. Follow-up changes the context or direction of reasoning.',
    },
  };
}
