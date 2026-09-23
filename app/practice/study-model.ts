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
  const pool = [...questions];
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
