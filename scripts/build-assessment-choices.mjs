import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const pathway = process.argv[process.argv.indexOf('--pathway') + 1];
if (!['C2', 'C1'].includes(pathway)) throw new Error('Use --pathway C2 or --pathway C1');

const bank = JSON.parse(await readFile(new URL('../app/assessment-bank.json', import.meta.url), 'utf8'));
const outputUrl = new URL('../app/assessment-choice-bank.json', import.meta.url);
let current = { schemaVersion: 1, questions: [] };
try { current = JSON.parse(await readFile(outputUrl, 'utf8')); } catch { /* First pathway creates the file. */ }

const plain = (value = '') => value
  .replace(/\*\*/g, '')
  .replace(/`/g, '')
  .replace(/^#{1,4}\s+/gm, '')
  .replace(/^[-*]\s+/gm, '')
  .replace(/^\d+\.\s+/gm, '')
  .replace(/\s+/g, ' ')
  .trim();
const sentence = (value, limit = 190) => {
  const clean = plain(value).replace(/\s+-\s*\d+\s*$/, '').replace(/\s+-\s*$/, '').replace(/\s*\(\d+\)$/, '');
  if (clean.length <= limit) return clean.replace(/[.;:,]+$/, '');
  return `${clean.slice(0, limit).replace(/\s+\S*$/, '')}…`;
};
const stableIndex = (id) => createHash('sha256').update(id).digest()[0] % 4;
const rotate = (values, correctIndex) => values.map((_, index) => values[(index - correctIndex + 4) % 4]);

const misconceptions = [
  [/safe isolation|isolat|dead test/i, 'treating an OFF control as proof of isolation and beginning work without proving the indicator before and after the absence-of-voltage test'],
  [/ring|spur/i, 'assuming that two cables at an outlet prove a complete, correctly connected ring without the required end-to-end and cross-connection tests'],
  [/earthing|bonding|CPC|Zs|Ze|ADS/i, 'treating earthing, protective bonding and the CPC as interchangeable, instead of identifying each protective path and verifying automatic disconnection'],
  [/RCD|RCBO|RCCB|MCB|fuse|protective device|breaking capacity/i, 'assuming one protective-device rating proves overload, short-circuit, residual-current and fault-duty protection in every condition'],
  [/cable|voltage drop|correction factor|feeder/i, 'selecting a conductor from nominal load current alone, without installation method, correction factors, voltage drop, fault protection and breaking-capacity checks'],
  [/power factor|kVAr|kVA|reactive/i, 'treating kW, kVA and kVAr as equivalent and assuming correction creates additional real power at the load'],
  [/three-phase|3φ|star|delta|phase sequence/i, 'using a single-phase relationship without checking line/phase quantities, connection, sequence, balance and the √3 factor'],
  [/motor|contactor|starter|overload|VFD|slip|synchronous/i, 'treating the contactor, overload relay and short-circuit device as one protection function and ignoring the motor connection and control sequence'],
  [/inspect|test|polarity|insulation|continuity|verification/i, 'energizing first and relying on functional operation, instead of completing inspection and applicable dead tests before controlled live verification'],
  [/fault|diagnos|tripping|repair|fails/i, 'replacing or resetting a device from the symptom alone without isolation, evidence-led tests, root-cause confirmation and post-repair verification'],
  [/Kenya|EPRA|licen[cs]e|regulat|connection/i, 'treating guidance or historical exam wording as legal authority instead of confirming current Kenyan law, EPRA scope and adopted requirements'],
  [/voltage|current|resistance|ohm/i, 'treating voltage as stored current and interchanging current, resistance and potential difference'],
  [/power|energy|kWh|watt/i, 'interchanging power and energy or omitting the operating time and unit conversion'],
  [/draw|diagram|single-line|switch/i, 'showing only load conductors while omitting conductor function, protective paths, device sequence or the labels needed to make the topology unambiguous'],
];

function misconceptionFor(question) {
  const searchable = `${question.title} ${question.prompt} ${question.answer}`;
  return misconceptions.find(([pattern]) => pattern.test(searchable))?.[1]
    ?? 'accepting a final statement without showing the governing principle, required evidence, units, limitations and safety conditions';
}

function representativePoints(question) {
  const unique = [...new Set(question.markingPoints.map(point => sentence(point.criterion, 165)).filter(value => value.length > 8))];
  if (unique.length <= 6) return unique;
  const indexes = [0, 1, Math.floor(unique.length / 3), Math.floor(unique.length * 2 / 3), unique.length - 2, unique.length - 1];
  return [...new Set(indexes.map(index => unique[index]))];
}

function generatedChoices(question) {
  const points = representativePoints(question);
  const first = points[0] ?? sentence(question.answer, 165);
  const second = points[1] ?? sentence(question.prompt, 165);
  const middle = points[Math.floor(points.length / 2)] ?? second;
  const penultimate = points.at(-2) ?? middle;
  const last = points.at(-1) ?? middle;
  const misconception = misconceptionFor(question);
  const correct = points.join('; then ');
  const incomplete = [first, second, middle].filter(Boolean).join('; then ');
  const mixed = [first, middle, `but proceed on the assumption that ${misconception}`].join('; ');
  const unsupported = [second, penultimate, last, 'accept the result without the remaining stated checks or evidence'].filter(Boolean).join('; then ');
  const base = [
    { text: correct, feedback: `This is the complete answer plan. It covers ${first.toLocaleLowerCase()} and carries the reasoning through to ${last.toLocaleLowerCase()}. The worked solution below supplies every intermediate step and condition.` },
    { text: incomplete, feedback: `This begins correctly with ${first.toLocaleLowerCase()}, but it stops before ${penultimate.toLocaleLowerCase()} and ${last.toLocaleLowerCase()}. Those omissions prevent a full-credit answer.` },
    { text: mixed, feedback: `The opening point is useful, but the response then introduces a recognised misconception: ${misconception}. That changes the method or safety conclusion and makes the answer unreliable.` },
    { text: unsupported, feedback: `This includes isolated valid points, but it does not connect them into a complete justified method. In particular, it does not fully establish ${first.toLocaleLowerCase()} before accepting the conclusion.` },
  ];
  const correctIndex = stableIndex(question.id);
  return rotate(base, correctIndex).map((choice, index) => ({ id: String.fromCharCode(65 + index), ...choice, isCorrect: index === correctIndex }));
}

const unitMeanings = new Map([
  ['ampere', 'electric current'], ['volt', 'potential difference'], ['ohm', 'resistance or impedance'], ['watt', 'real power'],
  ['joule', 'energy'], ['hertz', 'frequency'], ['coulomb', 'electric charge'], ['siemens', 'conductance'],
  ['lux', 'illuminance on a surface'], ['lumen', 'luminous flux'], ['kva', 'apparent power'], ['kvar', 'reactive power'], ['kw', 'real power'],
]);

function originalChoiceFeedback(question, option, correct) {
  if (option.id === question.correctOption) {
    const detail = !/^Correct option:/i.test(question.answer) && plain(question.answer).length > 4 ? ` ${sentence(question.answer, 260)}.` : '';
    return `This choice matches the governing definition or result for the stated conditions.${detail}`;
  }
  const lower = plain(option.text).toLocaleLowerCase();
  const meaning = [...unitMeanings].find(([term]) => lower === term || lower.includes(` ${term}`))?.[1];
  if (meaning) return `${sentence(option.text)} identifies ${meaning}, but that is not the quantity or condition asked for here. The required choice is ${sentence(correct.text)}.`;
  if (/^-?\d+(?:\.\d+)?(?:\s|$)/.test(lower)) return `${sentence(option.text)} is a plausible numerical distractor, but it does not follow the required relationship and unit handling for the stated data. The worked substitution below leads to ${sentence(correct.text)}.`;
  if (/\b(always|never|only|all)\b/.test(lower)) return `The absolute wording in “${sentence(option.text)}” ignores the conditions and limitations in the question. ${sentence(correct.text)} is the technically defensible statement.`;
  return `“${sentence(option.text)}” describes a different quantity, device function, sequence or condition. For this question, ${sentence(correct.text)} is correct; the solution below shows the controlling reasoning.`;
}

function enrich(question) {
  const choices = question.options?.length === 4
    ? question.options.map(option => ({ ...option, isCorrect: option.id === question.correctOption }))
    : generatedChoices(question);
  const correct = choices.find(choice => choice.isCorrect);
  if (!correct) throw new Error(`No correct choice for ${question.id}`);
  return {
    questionId: question.id,
    correctOption: correct.id,
    objective: `Choose the response that completely and safely answers “${sentence(question.title, 150)}”.`,
    options: choices.map(choice => ({
      ...choice,
      feedback: choice.feedback ?? originalChoiceFeedback(question, choice, correct),
    })),
  };
}

const retained = current.questions.filter(question => !question.questionId.startsWith(`${pathway}-`));
const added = bank.questions.filter(question => question.pathway === pathway).map(enrich);
const questions = [...retained, ...added].sort((left, right) => left.questionId.localeCompare(right.questionId, undefined, { numeric: true }));
await writeFile(outputUrl, `${JSON.stringify({ schemaVersion: 1, questions }, null, 2)}\n`);
console.log(`Wrote ${added.length} individually resolved ${pathway} choice sets; total ${questions.length}.`);
