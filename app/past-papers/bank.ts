import { fundamentals } from './fundamentals';
import { protectionTesting } from './protection-testing';
import { motorsPower } from './motors-power';
import { calculationsDesign } from './calculations-design';
import { additionalTopics } from './additional-topics';
import { paperOccurrences } from './paper-occurrences';
import { papers, type PaperPath } from './sources';
import type { PaperQuestion } from './types';

const topicOrder = ['Regulations and documents', 'Electrical principles', 'Three-phase principles', 'Load assessment', 'Cables and containment', 'Lighting and socket circuits', 'Earthing and protection', 'Safety and maintenance', 'Instruments and testing', 'Motors and controls', 'Power factor', 'Calculations', 'Building design'];
export const questions: PaperQuestion[] = [...fundamentals, ...protectionTesting, ...motorsPower, ...calculationsDesign, ...additionalTopics].sort((a, b) => topicOrder.indexOf(a.topic) - topicOrder.indexOf(b.topic)).map(item => ({ ...item,
  occurrences: Object.entries(paperOccurrences).flatMap(([paperId, map]) => map[item.id] ? [{ paperId, reference: map[item.id] }] : []),
}));
export function questionsFor(path: PaperPath) {
  const ids = new Set(papers.filter(paper => paper.path === path).map(paper => paper.id));
  return questions.filter(question => question.occurrences.some(occurrence => ids.has(occurrence.paperId)));
}
export function filterQuestions(path: PaperPath, query = '', topic = '', paperId = '') {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return questionsFor(path).filter(question => (!topic || question.topic === topic) && (!paperId || question.occurrences.some(item => item.paperId === paperId)) && words.every(word => [question.title, question.prompt, question.topic, question.answer, ...question.terms.map(term => `${term.term} ${term.meaning}`)].join(' ').toLocaleLowerCase().includes(word)));
}
export function compilationMarkdown(path: PaperPath, bank: PaperQuestion[], working: Record<string, string> = {}) {
  return `# ${path} past-paper study compilation\n\nQuestions with worked answers.\n\n` + bank.map((question, index) => {
    return `## ${index + 1}. ${question.title}\n\n${question.prompt}\n\n${working[question.id]?.trim() ? `### Your working\n\n${working[question.id]}\n\n` : ''}### Worked answer\n\n${question.answer}\n\n${question.diagram ? `Study diagram: https://electrical-installation-mastery.vercel.app/past-paper-diagrams/${question.diagram}.svg\n\n` : ''}### Check your answer\n\n${question.check.map(item => '- ' + item).join('\n')}\n\n`;
  }).join('---\n\n');
}
