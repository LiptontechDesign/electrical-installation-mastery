import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Map(process.argv.slice(2).map((value, index, values) => value.startsWith('--') ? [value.slice(2), values[index + 1]] : null).filter(Boolean));
const c2Path = args.get('c2');
const c1Path = args.get('c1');
if (!c2Path || !c1Path) {
  throw new Error('Usage: node scripts/import-assessment-bank.mjs --c2 <expanded-c2.md> --c1 <c1.md>');
}

const sectionTitles = {
  'C2-01': 'Electrical Foundations',
  'C2-02': 'Installation Architecture, Drawings and Safety',
  'C2-03': 'Single-Phase Wiring and Accessories',
  'C2-04': 'Cable Systems, Containment and Installation Methods',
  'C2-05': 'Faults, Protective Devices, Earthing and ADS',
  'C2-06': 'Single-Phase Circuit Design',
  'C2-07': 'Consumer Units and Complete Single-Phase Installation',
  'C2-08': 'Inspection, Testing and Commissioning',
  'C2-09': 'Fault Finding',
  'C2-K': 'Kenya, EPRA and Supply Connection',
  'C2-DC': 'DC Fundamentals',
  'C2-LUM': 'Luminaire Selection',
  'C2-ID': 'Conductor Identification',
  'C2-REG': 'Kenyan Energy-Sector Bodies and Regulation',
  'C2-CAB': 'Installation-Wide Cable Selection',
  'C2-DIAGRAM': 'Diagram and Drawing Practice',
  'C2-RAPID': 'Rapid EPRA-Style Answers',
  'C2-ORAL': 'C2 Oral and Viva Practice',
  'C2-MOCK-A': 'C2 Mock Examination A',
  'C2-MOCK-B': 'C2 Mock Examination B',
  'C2-MOCK-C': 'C2 Mock Examination C',
  'C1-01': 'Three-Phase Fundamentals',
  'C1-02': 'Three-Phase Power Calculations',
  'C1-03': 'Three-Phase Distribution',
  'C1-04': 'Three-Phase Design and Protective-Device Selection',
  'C1-05': 'Small-Commercial Earthing and Protection',
  'C1-06': 'Power Factor Correction',
  'C1-07': 'Three-Phase Motor Principles and Nameplates',
  'C1-08': 'Motor Starting, Control and Protection',
  'C1-09': 'Three-Phase Testing and Periodic Inspection',
  'C1-10': 'Three-Phase Distribution Fault Diagnosis',
  'C1-R': 'Inherited C2 Core Review',
  'C1-ORAL': 'C1 Oral and Viva Practice',
  'C1-MOCK-A': 'C1 Mock Examination A',
  'C1-MOCK-B': 'C1 Mock Examination B',
};

const moduleBySection = {
  'C2-01': 'module-01', 'C2-02': 'module-02', 'C2-03': 'module-03', 'C2-04': 'module-04',
  'C2-05': 'module-05', 'C2-06': 'module-06', 'C2-07': 'c2-boards', 'C2-08': 'module-08',
  'C2-09': 'module-09', 'C2-K': 'module-02', 'C2-DC': 'module-01', 'C2-LUM': 'module-03',
  'C2-ID': 'module-03', 'C2-REG': 'module-02', 'C2-CAB': 'module-06', 'C2-DIAGRAM': 'module-02',
  'C2-RAPID': 'module-05', 'C2-ORAL': 'module-01',
  'C1-01': 'c1-fundamentals', 'C1-02': 'c1-power', 'C1-03': 'c1-distribution',
  'C1-04': 'c1-design', 'C1-05': 'c1-earthing', 'C1-06': 'c1-pfc', 'C1-07': 'c1-motors',
  'C1-08': 'module-07', 'C1-09': 'c1-testing', 'C1-10': 'c1-faults', 'C1-R': 'module-05',
  'C1-ORAL': 'c1-fundamentals',
};

const sourceLessonBySection = {
  'C2-01': ['p01-l01'], 'C2-02': ['p02-l02'], 'C2-03': ['p03-l01'], 'C2-04': ['p02-l01'],
  'C2-05': ['p05-l01'], 'C2-06': ['p06-l01'], 'C2-07': ['p03-l13'], 'C2-08': ['p08-l02'],
  'C2-09': ['p09-l01'], 'C2-K': ['p16-l04'], 'C2-DC': ['p01-l01'], 'C2-LUM': ['p03-l11'],
  'C2-ID': ['p03-l01'], 'C2-REG': ['p16-l04'], 'C2-CAB': ['p06-l01'], 'C2-DIAGRAM': ['p02-l02'],
  'C2-RAPID': ['p05-l01'], 'C2-ORAL': ['p01-l01'],
  'C1-01': ['p02-l03'], 'C1-02': ['p06-l13'], 'C1-03': ['p08-l01'], 'C1-04': ['p10-l10'],
  'C1-05': ['p05-l12'], 'C1-06': ['p06-l14'], 'C1-07': ['p07-induction'], 'C1-08': ['p04-l21'],
  'C1-09': ['p08-l07'], 'C1-10': ['p10-l08'], 'C1-R': ['p05-l01'], 'C1-ORAL': ['p02-l03'],
};

const conceptPatterns = [
  ['voltage-current', /voltage|current|ohm|resistance/i], ['power-energy', /power|energy|kwh|power factor|kvar/i],
  ['circuit-arrangements', /series|parallel|radial|ring|spur/i], ['wiring-accessories', /switch|socket|luminaire|accessor/i],
  ['cable-design', /cable|conductor|voltage drop|correction factor|\bIz\b|\bIb\b|\bIn\b/i],
  ['protection', /protect|mcb|mccb|rccb|rcbo|rcd|fuse|breaking capacity|selectivity/i],
  ['earthing-ads', /earth|bonding|cpc|\bZs\b|\bZe\b|ADS/i], ['inspection-testing', /inspect|test|instrument|polarity|insulation/i],
  ['fault-diagnosis', /fault|diagnos|repair|tripping|fails/i], ['three-phase', /three-phase|3φ|star|delta|phase sequence/i],
  ['motors-control', /motor|contactor|starter|overload|vfd|synchronous|slip/i], ['kenya-regulation', /Kenya|EPRA|licen[cs]e|regulat|connection/i],
];

const clean = (value) => value
  .replace(/\r/g, '')
  .replace(/[ \t]+$/gm, '')
  .replace(/^---\s*$/gm, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();
const plain = (value) => clean(value)
  .replace(/\*\*/g, '')
  .replace(/`/g, '')
  .replace(/\s{2,}/g, ' ');
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

function sectionFromId(id) {
  const mock = id.match(/^(C[12]-MOCK-[ABC])/);
  if (mock) return mock[1];
  const stage = id.match(/^(C[12]-\d{2})/);
  if (stage) return stage[1];
  const special = id.match(/^(C[12]-(?:K|DC|LUM|ID|REG|CAB|R))(?:-|$)/);
  if (special) return special[1];
  if (id.startsWith('C2-D')) return 'C2-DIAGRAM';
  if (id.startsWith('C2-RAPID')) return 'C2-RAPID';
  if (id.startsWith('C2-ORAL')) return 'C2-ORAL';
  if (id.startsWith('C1-ORAL')) return 'C1-ORAL';
  throw new Error(`Cannot derive section for ${id}`);
}

function collectionFor(sectionId) {
  if (sectionId.includes('MOCK')) return 'mock';
  if (sectionId.endsWith('ORAL')) return 'oral';
  if (sectionId.endsWith('DIAGRAM')) return 'diagram';
  if (sectionId.endsWith('RAPID')) return 'rapid';
  if (/^C[12]-\d{2}$/.test(sectionId)) return 'stage';
  if (sectionId === 'C1-R') return 'review';
  return 'specialist';
}

function inferFormat(title, prompt, fallback = 'structured') {
  const text = `${title} ${prompt}`.toLowerCase();
  if (/draw|diagram|single-line/.test(text)) return 'diagram';
  if (/fault|diagnos|fails|tripping|repair/.test(text)) return 'fault-scenario';
  if (/design|select.*cable|feeder/.test(text)) return 'design-scenario';
  if (/calculate|calculation|determine/.test(text)) return 'calculation';
  if (/procedure|sequence|safe isolation|verification/.test(text)) return 'procedure';
  if (/distinguish|difference| versus /.test(text)) return 'comparison';
  if (/define|what is/.test(text)) return 'definition';
  return fallback;
}

function commandVerb(prompt) {
  return prompt.match(/\b(define|state|name|list|distinguish|describe|explain|calculate|determine|draw|select|design|interpret|outline|identify|compare)\b/i)?.[1].toLowerCase() ?? 'answer';
}

function marksFrom(prompt, fallback = 1) {
  const direct = prompt.match(/\*\*(\d+)\s*marks?\*\*/i);
  if (direct) return Number(direct[1]);
  const subparts = [...prompt.matchAll(/\*\*\((\d+)\)\*\*/g)].map(match => Number(match[1]));
  return subparts.length ? subparts.reduce((sum, value) => sum + value, 0) : fallback;
}

function markingPoints(answer, totalMarks) {
  const points = [];
  for (const raw of answer.split('\n')) {
    const line = raw.trim();
    if (!line || /^\|/.test(line) || /^#{1,4}\s/.test(line)) continue;
    const mark = line.match(/(?:\*\*\()?(\d+)\s*(?:marks?)?(?:\)\*\*|\*\*)\.?\s*$/i);
    if (/^(?:[-*]|\d+\.)\s/.test(line) || mark) {
      const criterion = plain(line.replace(/^(?:[-*]|\d+\.)\s*/, '').replace(/(?:\*\*\()?(\d+)\s*(?:marks?)?(?:\)\*\*|\*\*)\.?\s*$/i, ''));
      if (criterion.length > 2) points.push({ marks: mark ? Number(mark[1]) : 1, criterion });
    }
  }
  if (!points.length) return [{ marks: totalMarks, criterion: plain(answer).slice(0, 600) }];
  return points.slice(0, 30);
}

function optionsFrom(prompt) {
  return [...prompt.matchAll(/(?:^|\n|\s{2,})([A-D])\.\s*(.*?)(?=(?:\n|\s{2,})[A-D]\.\s|$)/gs)]
    .map(match => ({ id: match[1], text: clean(match[2]) }));
}

function questionPrompt(prompt) {
  const firstOption = prompt.search(/(?:^|\n)A\.\s/m);
  if (firstOption >= 0) return clean(prompt.slice(0, firstOption));
  const inlineOption = prompt.search(/\s{2,}A\.\s/);
  return clean(inlineOption >= 0 ? prompt.slice(0, inlineOption) : prompt);
}

function linkedLessons(sectionId, text) {
  const direct = sourceLessonBySection[sectionId];
  if (direct && (/^C[12]-\d{2}$/.test(sectionId) || sectionId === 'C1-R')) return direct;
  const candidates = [];
  const add = (id) => { if (!candidates.includes(id)) candidates.push(id); };
  if (/motor|contactor|starter|overload|vfd|slip|synchronous/i.test(text)) add('p07-induction');
  if (/three-phase|3φ|star|delta|phase sequence/i.test(text)) add('p02-l03');
  if (/power factor|kvar|reactive/i.test(text)) add('p06-l14');
  if (/cable|voltage drop|\bIz\b|\bIb\b|\bIn\b|feeder/i.test(text)) add('p06-l01');
  if (/earth|bonding|cpc|\bZs\b|\bZe\b|rcd|protection/i.test(text)) add('p05-l01');
  if (/test|inspect|polarity|insulation|verification/i.test(text)) add('p08-l02');
  if (/fault|diagnos|repair|tripping/i.test(text)) add('p09-l01');
  if (/Kenya|EPRA|licen[cs]e|regulat|connection/i.test(text)) add('p16-l04');
  return candidates.length ? candidates.slice(0, 3) : direct ?? [sectionId.startsWith('C1') ? 'p02-l03' : 'p01-l01'];
}

function prerequisiteLessons(sectionId) {
  const match = sectionId.match(/^(C[12])-(\d{2})$/);
  if (!match || Number(match[2]) <= 1) return [];
  return sourceLessonBySection[`${match[1]}-${String(Number(match[2]) - 1).padStart(2, '0')}`] ?? [];
}

function makeQuestion({ id, pathway, title, prompt, answer, format, marks, correctOption, options, moduleIds, sourceFile }) {
  const sectionId = sectionFromId(id);
  const resolvedMarks = marks ?? marksFrom(prompt, format === 'mcq' ? 1 : 2);
  const searchable = `${title} ${prompt} ${answer}`;
  const sourceLessonIds = linkedLessons(sectionId, searchable);
  const conceptIds = conceptPatterns.filter(([, pattern]) => pattern.test(searchable)).map(([concept]) => concept);
  return {
    id, pathway, sectionId, sectionTitle: sectionTitles[sectionId] ?? sectionId,
    collection: collectionFor(sectionId), format: format ?? inferFormat(title, prompt),
    title: clean(title), commandVerb: commandVerb(prompt), marks: resolvedMarks,
    expectedMinutes: Math.max(1, Math.round(resolvedMarks * 1.2)), prompt: clean(prompt),
    options: options?.length ? options : undefined, correctOption: correctOption || undefined,
    answer: clean(answer), markingPoints: markingPoints(answer, resolvedMarks),
    competencyIds: [`${sectionId.toLowerCase()}:${(format ?? inferFormat(title, prompt)).replace(/\s+/g, '-')}`],
    conceptIds: conceptIds.length ? conceptIds : ['electrical-practice'],
    sourceLessonIds,
    prerequisiteIds: prerequisiteLessons(sectionId),
    moduleIds: moduleIds?.length ? moduleIds : [moduleBySection[sectionId]].filter(Boolean),
    standardsRefs: /OSG|On-Site Guide|BS 7671|Zs|RCD|cable|earthing|protection/i.test(searchable) ? ['IET-OSG-BS7671-A4-2026'] : [],
    kenyaStatus: /colour|color|KS 662/i.test(searchable) ? 'check-kenyan-requirement' : /Kenya|EPRA|licen[cs]e|connection|regulat/i.test(searchable) ? 'kenya-verified' : 'bs7671-technical-baseline',
    misconceptionTags: conceptIds.map(concept => `confusion:${concept}`),
    sourceFile,
  };
}

function splitAnswer(block) {
  const match = block.match(/^\*\*(?:Answer|Full-credit answer):\s*([A-D])?\s*(.*?)\*\*(.*)$/ims);
  if (!match) return null;
  const detail = clean(`${match[2]}${match[3]}`).replace(/^[.\s]+/, '');
  return { prompt: clean(block.slice(0, match.index)), correctOption: match[1], answer: detail || `Correct option: **${match[1]}**.` };
}

function headingMcqs(text, pathway, sourceFile) {
  const matches = [...text.matchAll(/^### (C[12](?:-[A-Z0-9]+)+-M\d+)\s*$/gm)];
  return matches.map((match, index) => {
    const end = matches[index + 1]?.index ?? text.length;
    const nextMajor = text.slice(match.index + match[0].length, end).search(/^#{1,2}\s/m);
    const bodyEnd = nextMajor >= 0 ? match.index + match[0].length + nextMajor : end;
    const body = clean(text.slice(match.index + match[0].length, bodyEnd));
    const split = splitAnswer(body);
    if (!split) throw new Error(`Missing answer for ${match[1]}`);
    const options = optionsFrom(split.prompt);
    const id = pathway === 'C1' && match[1].startsWith('C2-R-') ? match[1].replace('C2-R-', 'C1-R-') : match[1];
    return makeQuestion({ id, pathway, title: questionPrompt(split.prompt), prompt: split.prompt, answer: split.answer, format: 'mcq', marks: 1, correctOption: split.correctOption, options, sourceFile });
  });
}

function numberedBlocks(body, marker) {
  const matches = [...body.matchAll(marker)];
  return matches.map((match, index) => ({ number: Number(match[1]), body: clean(body.slice(match.index + match[0].length, matches[index + 1]?.index ?? body.length)) }));
}

function c1NumberedStageMcqs(text, sourceFile) {
  const questions = [];
  for (const match of text.matchAll(/^## (C1-(?:07|08|09|10)) MCQ pool[^\n]*$/gm)) {
    const next = text.slice(match.index + match[0].length).search(/^## /m);
    const body = text.slice(match.index + match[0].length, next < 0 ? text.length : match.index + match[0].length + next);
    for (const item of numberedBlocks(body, /^\*\*(\d+)\.\*\*\s*/gm)) {
      const split = splitAnswer(item.body);
      if (!split) throw new Error(`Missing answer for ${match[1]} item ${item.number}`);
      const id = `${match[1]}-M${String(item.number).padStart(2, '0')}`;
      questions.push(makeQuestion({ id, pathway: 'C1', title: questionPrompt(split.prompt), prompt: split.prompt, answer: split.answer, format: 'mcq', marks: 1, correctOption: split.correctOption, options: optionsFrom(split.prompt), sourceFile }));
    }
  }
  return questions;
}

function structuredQuestions(text, pathway, sourceFile) {
  const questions = [];
  const pattern = /^## (?:Structured Question )?(C[12](?:-[A-Z0-9]+)+-S\d+)\s*[—-]\s*(.+)$/gm;
  for (const match of text.matchAll(pattern)) {
    const afterHeading = match.index + match[0].length;
    const nextMajor = text.slice(afterHeading).search(/^## /m);
    const boundary = nextMajor < 0 ? text.length : afterHeading + nextMajor;
    const whole = text.slice(afterHeading, boundary);
    const answerHeading = whole.match(/^### (?:Full-credit model answer|Examiner solution)[^\n]*$/m);
    if (!answerHeading) throw new Error(`Missing model answer for ${match[1]}`);
    const prompt = clean(whole.slice(0, answerHeading.index));
    const answer = clean(whole.slice(answerHeading.index + answerHeading[0].length));
    const id = pathway === 'C1' && match[1].startsWith('C2-R-') ? match[1].replace('C2-R-', 'C1-R-') : match[1];
    questions.push(makeQuestion({ id, pathway, title: match[2], prompt, answer, sourceFile }));
  }
  return questions;
}

function mockQuestions(text, pathway, sourceFile) {
  const questions = [];
  const heading = /^## MOCK ([ABC])\s*[—-]\s*QUESTION (\d+)(?::\s*(.+))?$/gm;
  for (const match of text.matchAll(heading)) {
    const afterHeading = match.index + match[0].length;
    const next = text.slice(afterHeading).search(/^## /m);
    const boundary = next < 0 ? text.length : afterHeading + next;
    const whole = clean(text.slice(afterHeading, boundary));
    const paper = match[1], number = Number(match[2]), headingTitle = clean(match[3] ?? `Question ${number}`);
    if (/multiple choice/i.test(headingTitle)) {
      const answerHeading = whole.search(/^### .*answers\s*$/mi);
      const promptBody = answerHeading >= 0 ? whole.slice(0, answerHeading) : whole;
      const answerBody = answerHeading >= 0 ? whole.slice(answerHeading) : '';
      const key = new Map([...answerBody.matchAll(/(\d+)\s+([A-D])(?=,|\.|$)/g)].map(item => [Number(item[1]), item[2]]));
      for (const item of numberedBlocks(promptBody, /^(\d+)\.\s+/gm)) {
        const id = `${pathway}-MOCK-${paper}-M${String(item.number).padStart(2, '0')}`;
        const correctOption = key.get(item.number);
        if (!correctOption) throw new Error(`Missing mock answer key for ${id}`);
        questions.push(makeQuestion({ id, pathway, title: questionPrompt(item.body), prompt: item.body, answer: `Correct option: **${correctOption}**.`, format: 'mcq', marks: 1, correctOption, options: optionsFrom(item.body), sourceFile }));
      }
      continue;
    }
    const answerHeading = whole.match(/^### Full-credit solution[^\n]*$/m);
    if (!answerHeading) throw new Error(`Missing mock solution for ${pathway} Mock ${paper} Q${number}`);
    const prompt = clean(whole.slice(0, answerHeading.index));
    const answer = clean(whole.slice(answerHeading.index + answerHeading[0].length));
    questions.push(makeQuestion({ id: `${pathway}-MOCK-${paper}-Q${number}`, pathway, title: headingTitle, prompt, answer, marks: marksFrom(prompt, 20), moduleIds: [], sourceFile }));
  }
  return questions;
}

function diagrams(text, sourceFile) {
  const start = text.indexOf('# PART V - C2 DIAGRAM');
  const end = text.indexOf('# PART VI - C2 ORAL', start);
  const area = text.slice(start, end);
  const matches = [...area.matchAll(/^## D(\d+)\s*[—-]\s*(.+)$/gm)];
  return matches.map((match, index) => {
    const body = clean(area.slice(match.index + match[0].length, matches[index + 1]?.index ?? area.length));
    const markingAt = body.search(/^\*\*Marking:\*\*/m);
    const task = markingAt >= 0 ? body.slice(0, markingAt) : body;
    const rubric = markingAt >= 0 ? body.slice(markingAt).replace(/^\*\*Marking:\*\*/m, '') : body;
    return makeQuestion({ id: `C2-D${String(match[1]).padStart(2, '0')}`, pathway: 'C2', title: match[2], prompt: task, answer: `A full-credit drawing includes:\n\n${clean(rubric)}`, format: 'diagram', marks: marksFrom(task, Number(rubric.match(/(\d+) marks/i)?.[1] ?? 8)), sourceFile });
  });
}

function c2Oral(text, sourceFile) {
  const start = text.indexOf('# PART VI - C2 ORAL');
  const end = text.indexOf('# PART VII - QUESTION-TO-COURSE', start);
  const area = text.slice(start, end);
  const matches = [...area.matchAll(/^### (\d+)\.\s+(.+)$/gm)];
  return matches.map((match, index) => {
    const body = clean(area.slice(match.index + match[0].length, matches[index + 1]?.index ?? area.length));
    const answer = body.replace(/^Full-credit points:\s*/i, '');
    return makeQuestion({ id: `C2-ORAL-${String(match[1]).padStart(2, '0')}`, pathway: 'C2', title: match[2], prompt: match[2], answer, format: 'oral', marks: Math.max(1, answer.split(';').length), sourceFile });
  });
}

function c1Oral(text, sourceFile) {
  const start = text.indexOf('# PART V — C1 ORAL');
  const end = text.indexOf('# PART VI — FINAL COVERAGE', start);
  const area = text.slice(start, end);
  const matches = [...area.matchAll(/^(\d+)\.\s+\*\*(.+?)\*\*\s*$/gm)];
  return matches.map((match, index) => {
    const body = clean(area.slice(match.index + match[0].length, matches[index + 1]?.index ?? area.length));
    const answer = body.replace(/^Full-credit points:\s*/i, '');
    return makeQuestion({ id: `C1-ORAL-${String(match[1]).padStart(2, '0')}`, pathway: 'C1', title: match[2], prompt: match[2], answer, format: 'oral', marks: Math.max(1, answer.split(';').length), sourceFile });
  });
}

function rapidAnswers(text, sourceFile) {
  const start = text.indexOf('# IX-F — RAPID');
  const end = text.indexOf('# PART X — COMPLETE C2 MOCK', start);
  const area = text.slice(start, end);
  const matches = [...area.matchAll(/^## R(\d+)\s*$/gm)];
  return matches.map((match, index) => {
    const body = clean(area.slice(match.index + match[0].length, matches[index + 1]?.index ?? area.length));
    const answerAt = body.search(/^\*\*(?:Full-credit answer|Answer):\*\*/m);
    if (answerAt < 0) throw new Error(`Missing rapid answer R${match[1]}`);
    const prompt = clean(body.slice(0, answerAt));
    const answer = clean(body.slice(answerAt).replace(/^\*\*(?:Full-credit answer|Answer):\*\*/m, ''));
    return makeQuestion({ id: `C2-RAPID-${String(match[1]).padStart(2, '0')}`, pathway: 'C2', title: questionPrompt(prompt), prompt, answer, format: inferFormat('', prompt, 'short-answer'), marks: marksFrom(prompt, 2), sourceFile });
  });
}

async function load(file, pathway) {
  const text = (await readFile(file, 'utf8')).replace(/\r/g, '');
  return { pathway, fileName: path.basename(file), text, digest: sha256(text) };
}

const [c2, c1] = await Promise.all([load(c2Path, 'C2'), load(c1Path, 'C1')]);
const questions = [
  ...headingMcqs(c2.text, 'C2', c2.fileName),
  ...structuredQuestions(c2.text, 'C2', c2.fileName),
  ...mockQuestions(c2.text, 'C2', c2.fileName),
  ...diagrams(c2.text, c2.fileName),
  ...c2Oral(c2.text, c2.fileName),
  ...rapidAnswers(c2.text, c2.fileName),
  ...headingMcqs(c1.text, 'C1', c1.fileName),
  ...c1NumberedStageMcqs(c1.text, c1.fileName),
  ...structuredQuestions(c1.text, 'C1', c1.fileName),
  ...mockQuestions(c1.text, 'C1', c1.fileName),
  ...c1Oral(c1.text, c1.fileName),
];

const ids = new Set();
for (const question of questions) {
  if (ids.has(question.id)) throw new Error(`Duplicate assessment question ${question.id}`);
  ids.add(question.id);
  if (!question.prompt || !question.answer) throw new Error(`Incomplete assessment question ${question.id}`);
  if (question.format === 'mcq' && (question.options?.length !== 4 || !question.correctOption)) {
    throw new Error(`Invalid MCQ ${question.id}: ${question.options?.length ?? 0} options`);
  }
}

questions.sort((a, b) => a.pathway.localeCompare(b.pathway) || a.sectionId.localeCompare(b.sectionId) || a.id.localeCompare(b.id, undefined, { numeric: true }));
const counts = Object.fromEntries(['C2', 'C1'].map(pathway => [pathway, questions.filter(question => question.pathway === pathway).length]));
const output = {
  schemaVersion: 1,
  generatedAt: '2026-09-13',
  sources: [c2, c1].map(({ pathway, fileName, digest }) => ({ pathway, fileName, sha256: digest })),
  counts,
  questions,
};
await writeFile(path.join(root, 'app', 'assessment-bank.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Assessment bank imported: ${counts.C2} C2 + ${counts.C1} C1 = ${questions.length} questions.`);
