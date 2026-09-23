import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Slice source text; never rewrite authored questions, answers, or guidance.
export async function buildStudyPack() {
  const collections = [];
  const titles = ['Electrical foundations', 'Cable selection & design', 'Protection & earthing', 'Inspection & testing', 'Wiring & lighting', 'Three-phase systems & motors', 'Diversity, instruments & safety', 'Kenya & EPRA regulations'];
  for (const file of (await readdir('content/epra')).filter(f => f.endsWith('.md')).sort()) {
    const bytes = await readFile(`content/epra/${file}`);
    const source = bytes.toString('utf8');
    const hash = createHash('sha256').update(bytes).digest('hex');
    const step = Number(file.match(/Step_(\d)/)?.[1] ?? 0);
    const mock = file.includes('Full_Mock');
    const recall = file.includes('110_High');
    if (!step && !mock && !recall) { collections.push({ id: 'guide', title: 'How to use your study pack', kind: 'guide', paths: ['C2', 'C1'], file, hash, notes: source, questions: [] }); continue; }
    const path = file.includes('EPRA_C1_') ? 'C1' : 'C2';
    const id = mock ? `mock-${path.toLowerCase()}` : recall ? 'recall' : `step-${step}`;
    const questions = [];
    let notes = '';
    if (mock) {
      const heads = [...source.matchAll(/^# .+$/gm)];
      const chunks = heads.map((h, i) => ({ title: h[0].slice(2).trim(), start: h.index, end: heads[i + 1]?.index ?? source.length }));
      notes = source.slice(0, chunks.find(c => /^QUESTION 1/.test(c.title)).start);
      for (let number = 1; number <= 5; number++) {
        const pair = chunks.filter(c => c.title.startsWith(`QUESTION ${number} —`));
        if (pair.length !== 2) throw Error(`${file}: expected question/answer pair ${number}`);
        const [q, a] = pair;
        questions.push({ id: `${id}-q${number}`, title: q.title, topic: q.title.replace(/^QUESTION \d+ — /, '').replace(/ \(20 MARKS\)$/, ''), question: source.slice(q.start + source.slice(q.start).indexOf('\n') + 1, q.end), answer: source.slice(a.start, a.end), questionRange: [q.start + source.slice(q.start).indexOf('\n') + 1, q.end], answerRange: [a.start, a.end], marks: 20 });
      }
      // Preserve marking-scheme guidance and the end-of-paper study standard too.
      notes += chunks.filter(c => !/^QUESTION \d+ —/.test(c.title) && c.start >= questions[0].questionRange[0]).map(c => source.slice(c.start, c.end)).join('');
    } else {
      const boundaries = [...source.matchAll(/^(?:# .+|## Question .+)$/gm)];
      notes = source.slice(0, boundaries[0]?.index ?? source.length);
      let topic = 'General';
      for (let i = 0; i < boundaries.length; i++) {
        const h = boundaries[i];
        const end = boundaries[i + 1]?.index ?? source.length;
        const chunk = source.slice(h.index, end);
        if (/^# Section /i.test(h[0])) topic = h[0].replace(/^# Section \w+ — /i, '').trim();
        if (!h[0].startsWith('## Question ')) { notes += chunk; continue; }
        const marker = /^### Answer[^\n]*\n/m.exec(chunk);
        if (!marker) throw Error(`${file}: missing answer for ${h[0]}`);
        const start = h.index + chunk.indexOf('\n') + 1;
        const answerStart = h.index + marker.index + marker[0].length;
        const number = h[0].match(/^## Question (\w+)/)[1];
        questions.push({ id: `${id}-q${number}`, title: h[0].slice(3).trim(), topic, question: source.slice(start, h.index + marker.index), answer: source.slice(answerStart, end), questionRange: [start, h.index + marker.index], answerRange: [answerStart, end], marks: null });
      }
    }
    collections.push({ id, title: mock ? `${path} full mock exam` : recall ? 'High-priority recall' : titles[step - 1], sourceTitle: source.split('\n').find(l => l.startsWith('## '))?.slice(3).trim(), kind: mock ? 'mock' : recall ? 'recall' : 'topic', step: step || null, paths: mock ? [path] : step === 6 ? ['C1'] : ['C2', 'C1'], file, hash, notes, questions });
  }
  return collections.sort((a,b) => (a.step ?? 20) - (b.step ?? 20));
}

if (process.argv[1]?.endsWith('import-epra.mjs')) {
  const pack = await buildStudyPack();
  await mkdir('app/practice', { recursive: true });
  await writeFile('app/practice/study-pack.json', JSON.stringify(pack));
  console.log(pack.map(c => `${c.id}: ${c.questions.length} questions`).join('\n'));
}
