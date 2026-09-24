import data from './study-pack.json';
import omissions from './presentation-omissions.json';

export type Pathway = 'C2' | 'C1';
export type Question = { id: string; title: string; topic: string; question: string; answer: string; marks: number | null };
export type Collection = { id: string; title: string; sourceTitle?: string; kind: string; step?: number | null; paths: string[]; file: string; hash: string; notes: string; questions: Question[] };
export const collections: Collection[] = data;
export const guide = collections.find(c => c.id === 'guide')!;

// Explicit user-authorized editorial omissions only; never alter the source archive.
export function displayAnswer(question: Question) {
  const omitted = (omissions as Record<string, string[]>)[question.id] ?? [];
  return omitted.reduce((answer, passage) => answer.replace(passage, ''), question.answer);
}

export function sampleQuestions(questions: Question[], size = 10, random = Math.random) {
  const pool = questions.filter(q => prerequisiteIds(q).length === 0);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size);
}

// Delimiter conversion is presentation-only. Stored source slices remain verbatim.
export function mathMarkdown(source: string) {
  return source.replace(/\\\[([\s\S]*?)\\\]/g, (_, math: string) => `\n$$\n${math.trim()}\n$$\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, math: string) => `$${math}$`);
}

export function matchesQuestion(q: Question, query: string) {
  return `${q.title} ${q.topic} ${q.question}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}

// Linked exercises remain in guided study; independent quizzes never omit their givens.
export function prerequisiteIds(question: Question): string[] {
  const prefix = question.id.replace(/-q\d+$/, '');
  const explicit = [...question.question.matchAll(/Question\s+(\d+)/gi)].map(match => `${prefix}-q${match[1]}`);
  if (question.id === 'step-2-q32') explicit.push('step-2-q31');
  return [...new Set(explicit)];
}

export function prerequisiteQuestions(question: Question, bank: Question[]): Question[] {
  const seen = new Set<string>([question.id]);
  const result: Question[] = [];
  function visit(q: Question) {
    for (const id of prerequisiteIds(q)) {
      if (seen.has(id)) continue;
      seen.add(id);
      const earlier = bank.find(item => item.id === id);
      if (earlier) { visit(earlier); result.push(earlier); }
    }
  }
  visit(question);
  return result;
}

export type QuestionPart = { label: string; text: string; marks: number };
export function questionParts(question: Question): { intro: string; parts: QuestionPart[] } {
  if (!question.id.startsWith('mock-') || question.id === 'mock-c1-q1') return { intro: question.question, parts: [] };
  const headings = [...question.question.matchAll(/^### \(([a-z])\)\r?$/gm)];
  return {
    intro: question.question.slice(0, headings[0]?.index ?? question.question.length),
    parts: headings.map((heading, index) => {
      const text = question.question.slice(heading.index, headings[index + 1]?.index);
      return { label: heading[1], text, marks: [...text.matchAll(/\*\*\((\d+) marks?\)\*\*/g)].reduce((sum, match) => sum + Number(match[1]), 0) };
    }),
  };
}

export function multipleChoiceItems(question: Question) {
  if (question.id !== 'mock-c1-q1') return [];
  const headings = [...question.question.matchAll(/^### (\d+)\.\r?$/gm)];
  const answers = [...question.answer.matchAll(/^## (\d+)\. Correct answer: \*\*([A-D])/gm)];
  return headings.map((heading, index) => {
    const text = question.question.slice(heading.index! + heading[0].length, headings[index + 1]?.index);
    const choices = [...text.matchAll(/^([A-D])\. (.+)$/gm)];
    return { label: heading[1], prompt: text.slice(0, choices[0]?.index), choices: choices.map(choice => ({ value: choice[1], text: choice[2].trim() })), correct: answers.find(answer => answer[1] === heading[1])?.[2] };
  });
}

export function practiceTone(collection: Collection) {
  return ['blue', 'violet', 'teal', 'amber'][((collection.step ?? (collection.kind === 'mock' ? 2 : 3)) - 1) % 4];
}
