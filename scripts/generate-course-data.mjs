import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, '..', 'MASTER_CURRICULUM_PROPOSAL.md'), 'utf8');

const moduleDescriptions = {
  '01': 'Build the electrical science foundation behind every safe installation.',
  '02': 'Read a building as a complete electrical system, from supply to final circuits.',
  '03': 'Develop confident hands-on wiring, termination and containment technique.',
  '04': 'Scale practical skills to commercial and industrial installation methods.',
  '05': 'Understand protective devices, earthing arrangements and disconnection paths.',
  '06': 'Turn requirements into defensible cable, load and protection calculations.',
  '07': 'Connect design decisions into a complete multi-board building distribution system.',
  '08': 'Follow a disciplined inspection, testing and commissioning sequence.',
  '09': 'Diagnose faults methodically from symptoms, measurements and circuit behaviour.',
  '10': 'Bring the full workflow together through project-level electrical thinking.',
};

const clean = (value) => value
  .replace(/\\\|/g, '|')
  .replace(/\*\*/g, '')
  .replace(/\*/g, '')
  .replace(/&amp;/g, '&')
  .trim();

const durationToSeconds = (duration) => {
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
};

const modules = [];
const headingPattern = /^## Playlist (\d{2}) — (.+)$/gm;
const headings = [...source.matchAll(headingPattern)];

for (let index = 0; index < headings.length; index += 1) {
  const match = headings[index];
  const number = match[1];
  const title = match[2].trim();
  const start = match.index;
  const end = headings[index + 1]?.index ?? source.length;
  const section = source.slice(start, end);
  const totalMatch = section.match(/\*\*(\d+) videos · ([^*]+)\*\*/);
  const checkpointMatch = section.match(/\*\*Checkpoint \(not a YouTube lesson\):\*\* ([^\n]+)/);
  const lessons = [];

  for (const line of section.split(/\r?\n/)) {
    if (!/^\|\s*\d{2}\s*\|/.test(line)) continue;
    const row = line.match(/^\|\s*(\d{2})\s*\|\s*\[(.+)\]\(https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]+)\)\s*\|\s*(.*?)\s*\|\s*([0-9:]+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*$/);
    if (!row) throw new Error(`Could not parse curriculum row: ${line}`);

    const [, lessonNumber, rawTitle, videoId, instructor, duration, rawTopicLayer, rawWhy, rawRegulation] = row;
    const topicLayer = clean(rawTopicLayer).split(' · ');
    const why = clean(rawWhy);
    const prerequisiteMatch = why.match(/Prerequisite:\s*(.+)$/);
    const rationale = why.replace(/\s*Prerequisite:\s*.+$/, '').trim();

    lessons.push({
      id: `p${number}-l${lessonNumber}`,
      number: Number(lessonNumber),
      title: clean(rawTitle),
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      instructor: clean(instructor),
      duration,
      durationSeconds: durationToSeconds(duration),
      topic: topicLayer[0] || 'Electrical installation practice',
      layer: topicLayer[1] || 'WHY',
      rationale,
      prerequisite: prerequisiteMatch?.[1]?.trim() || null,
      regulationStatus: clean(rawRegulation),
      regulationSensitive: /VERIFY AGAINST CURRENT/i.test(rawRegulation),
    });
  }

  modules.push({
    id: `module-${number}`,
    number: Number(number),
    title,
    description: moduleDescriptions[number],
    duration: totalMatch?.[2]?.trim() || '',
    durationSeconds: lessons.reduce((total, lesson) => total + lesson.durationSeconds, 0),
    checkpoint: checkpointMatch?.[1]?.trim() || '',
    lessons,
  });
}

const lessonCount = modules.reduce((total, module) => total + module.lessons.length, 0);
const ids = modules.flatMap((module) => module.lessons.map((lesson) => lesson.videoId));
if (modules.length !== 10 || lessonCount !== 161 || new Set(ids).size !== 161) {
  throw new Error(`Curriculum validation failed: ${modules.length} modules, ${lessonCount} lessons, ${new Set(ids).size} unique video IDs.`);
}

const course = {
  schemaVersion: 1,
  id: 'electrical-installation-mastery',
  title: 'Electrical Installation Mastery',
  shortTitle: 'Electrical Mastery',
  subtitle: 'A complete, dependency-ordered practical learning path',
  description: '161 carefully sequenced lessons covering electrical foundations, building systems, practical wiring, design, testing, fault finding and complete-project thinking.',
  lessonCount,
  duration: '29 h 23 min',
  safetyNotice: 'Electrical work can cause serious injury, fire or death. Practise only on safe training equipment, isolate supplies correctly, and use qualified supervision for live or regulated work.',
  jurisdictionNotice: 'Where a lesson is regulation-sensitive, verify the details against current KS 662, EPRA requirements and the rules that apply to your installation.',
  modules,
};

await writeFile(resolve(root, 'app', 'course-data.json'), `${JSON.stringify(course, null, 2)}\n`);
console.log(`Generated ${lessonCount} lessons across ${modules.length} modules.`);
