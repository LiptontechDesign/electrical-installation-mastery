import baseCourse from './course-data.json';
import courseExtension from './course-extension-data';
import { gapLessons } from './course-gap-data';
import { formatStudyDuration, formatVideoDuration, type SourceKind } from './course-extension/builders';

type BaseLesson = (typeof baseCourse.modules)[number]['lessons'][number];
export type CurriculumLesson = Omit<BaseLesson, 'prerequisite'> & { prerequisite: string; sourceKind?: SourceKind };
const originalModules = [...baseCourse.modules, ...courseExtension.modules];
const catalogue = new Map<string, CurriculumLesson>(originalModules.flatMap(module => module.lessons.map(lesson => [lesson.id, { ...lesson, prerequisite: lesson.prerequisite ?? '' }] as const)));
for (const { guide, ...lesson } of gapLessons) {
  if (catalogue.has(lesson.id)) throw new Error(`Duplicate lesson: ${lesson.id}`);
  catalogue.set(lesson.id, { ...lesson, number: 0, url: `https://www.youtube.com/watch?v=${lesson.videoId}`, duration: formatVideoDuration(lesson.durationSeconds), rationale: guide.summary, prerequisite: '', regulationSensitive: lesson.regulationSensitive ?? true, regulationStatus: lesson.regulationStatus ?? '' });
}
const range = (prefix: string, first: number, last: number) => Array.from({ length: last - first + 1 }, (_, i) => `${prefix}${String(first + i).padStart(2, '0')}`);

// Stable lesson IDs preserve notes, bookmarks, completed lessons and flashcard IDs.
// This is the single ordering used by the website, assessments and source audits.
const order: Record<string, string[]> = {
  'module-01': [...range('p01-l', 1, 23), 'p01-transformers', 'p01-l24', 'p01-l25', 'p01-pf-visual', 'p01-l26', 'p01-l27', 'p06-l14', 'p03-l14', ...range('p01-l', 28, 31)],
  'module-02': [...range('p02-l', 1, 8), ...range('p07-l', 13, 15), 'p02-l10', 'p02-l11'],
  'module-03': ['p16-l01', 'p03-l01', 'p03-l02', 'p16-l02', ...range('p03-l', 3, 11), 'p03-l13', 'p03-l12'],
  'module-04': ['p04-l02', 'p04-l03', 'p04-l01', ...range('p04-l', 4, 12), 'p16-l03', ...range('p04-l', 13, 18)],
  'module-05': ['p05-l01', 'p05-l08', 'p05-l10', ...range('p05-l', 2, 7), ...range('p05-l', 11, 15), 'p05-spd'],
  'module-06': [...range('p07-l', 1, 5), 'p06-l13', 'p06-l01', 'p06-l11', 'p06-l12', 'p06-l02', 'p06-l03', 'p06-l06', 'p06-l04', 'p06-l10', 'p06-l05', 'p06-l07', 'p06-l08', 'p06-l09', 'p06-l15'],
  'module-07': ['p08-l01', 'p07-induction', 'p04-l21', 'p04-l19', 'p04-l20', 'p07-star-delta', 'p07-vfd', ...range('p07-l', 6, 9), 'p07-l16'],
  'module-08': ['p08-l02', 'p08-l03', 'p05-l09', 'p08-l04', 'p08-l05', 'p08-l16', 'p08-l06', 'p08-l07', 'p02-l09', 'p08-l08', 'p08-l09', 'p08-l17', ...range('p08-l', 10, 15), 'p08-periodic', 'p16-l09'],
  'module-10': ['p10-l09', 'p10-l10', 'p16-l04', 'p10-l03', 'p10-l04', 'p16-l05', 'p10-l01', 'p10-l02', ...range('p10-l', 5, 8)],
  'module-12': ['p12-v2-l02', 'p12-v2-l01', ...range('p07-l', 10, 12), ...originalModules[11].lessons.slice(2).map(lesson => lesson.id)],
  'module-14': ['p14-l01', 'p14-v2-l02', 'p14-v2-l03', 'p14-v2-l09', 'p14-v2-l04', 'p14-v2-l05', 'p14-v2-l06', 'p14-v2-l07', 'p14-l02', 'p14-v2-l10', 'p14-v2-l11', 'p14-l07', 'p14-v2-l13', 'p14-v2-l14', 'p14-l08', 'p14-v2-l16'],
  'module-16': ['p16-l06', 'p16-l07', 'p16-l08'],
};

const moduleCopy: Record<string, { title?: string; description: string; checkpoint: string; entry: string }> = {
  'module-01': { description: 'Connect circuits, AC, transformers and power, then establish safe isolation before measurements.', checkpoint: 'Explain a circuit, calculate AC power and describe how a measurement is made safely.', entry: 'Start here. No retained electrical knowledge is assumed; practical demonstrations require appropriate training and supervision.' },
  'module-02': { description: 'Recognise installation components and read the drawings that connect them.', checkpoint: 'Trace a circuit from its single-line diagram to its protective device and load.', entry: 'Use the circuit and safety foundations from Module 1 to identify real equipment and its drawings.' },
  'module-03': { description: 'Choose tools, prepare conductors and follow diagrams through to sound terminations.', checkpoint: 'Explain each connection and the inspection needed before energising it.', entry: 'Use the components and drawings from Module 2. Complete the safe-isolation lesson before practical work.' },
  'module-04': { title: 'Containment and Cable Systems', description: 'Progress from conduit and capacity to cable construction, glanding and installation methods.', checkpoint: 'Justify a wiring route, containment system and termination method for its environment.', entry: 'Build on conductor preparation and termination in Module 3.' },
  'module-05': { description: 'Connect fault types, earthing, disconnection, device selection and surge protection.', checkpoint: 'Explain which protective function responds to each fault and what evidence confirms suitability.', entry: 'Use the conductor and wiring-system knowledge from Modules 3–4 to follow complete fault paths.' },
  'module-06': { title: 'Three-Phase Theory, Design and Calculations', description: 'Learn phase relationships before calculating demand, cable capacity, voltage drop and fault ratings.', checkpoint: 'Produce a justified load calculation and explain every cable and protection check.', entry: 'Recall AC power from Module 1 and protective measures from Module 5; three-phase foundations come first here.' },
  'module-07': { title: 'Motors and Building Distribution', description: 'Connect motor behaviour to starters and drives, then scale the design to building distribution.', checkpoint: 'Read a motor nameplate, distinguish starting methods and justify a distribution arrangement.', entry: 'Use Module 6’s star/delta relationships and design calculations before studying motors and distribution.' },
  'module-08': { description: 'Connect dead tests, live verification, periodic inspection and certification.', checkpoint: 'Explain the purpose, limitations and record of each test before interpreting an installation report.', entry: 'Complete protection, design and three-phase isolation in Modules 5–7. Apply safe isolation before dead tests; live testing requires competence and suitable controls.' },
  'module-09': { description: 'Use inspection and test evidence to narrow faults and verify repairs.', checkpoint: 'Build a fault hypothesis from evidence, investigate it and specify the necessary retests.', entry: 'Use Module 8’s inspection and test methods to distinguish a real fault from a misleading reading.' },
  'module-10': { description: 'Follow a project from load estimation through first fix, second fix and final verification.', checkpoint: 'Explain the complete job sequence and the decisions that need checking on site.', entry: 'Apply Modules 1–9 as a connected design, installation and verification workflow.' },
  'module-11': { description: 'Survey hidden services before coordinating routes, finishes and residential first-fix decisions.', checkpoint: 'Produce a coordinated first-fix brief with access, services and client decisions resolved.', entry: 'Build on the complete projects in Module 10; survey hidden services before drilling or chasing.' },
  'module-12': { description: 'Start with the visual task, calculate light levels, then specify fittings, controls and maintainable details.', checkpoint: 'Explain a lighting scheme using both calculations and the way people use the space.', entry: 'Use the room brief and coordinated service routes from Module 11.' },
  'module-13': { description: 'Connect controls, data networks, security and life-safety interfaces to a documented commissioning plan.', checkpoint: 'Describe the power, communication and safety boundaries of a connected building system.', entry: 'Build on the control groups and client requirements developed in Module 12.' },
  'module-14': { description: 'Survey the supply and identify every energy source before PV, storage, backup and EV installation cases.', checkpoint: 'Map every source, isolation point and protection boundary in a proposed energy system.', entry: 'Apply the protection, distribution and commissioning principles from Modules 5–8 to multiple-source installations.' },
  'module-15': { description: 'Apply motor controls and protection to pumps, ventilation and sensitive lighting systems.', checkpoint: 'Explain operating modes, failure responses and maintenance access for a building service.', entry: 'Apply Module 7’s motor principles and Module 12’s lighting design to complete building services.' },
  'module-16': { title: 'Professional Review and Estimating', description: 'Use diagnostic evidence and a defined scope to plan, price and explain professional work.', checkpoint: 'Prepare an evidence-based scope and estimate, including verification and handover responsibilities.', entry: 'Bring together the installation and commissioning decisions from the course. Certification is taught with testing in Module 8.' },
};

const used = new Set<string>();
const modules = originalModules.map(module => {
  const copy = moduleCopy[module.id];
  const lessonIds = order[module.id] ?? module.lessons.map(lesson => lesson.id);
  const lessons = lessonIds.map((id, index) => {
    const lesson = catalogue.get(id);
    if (!lesson || used.has(id)) throw new Error(`Missing or repeated curriculum lesson: ${id}`);
    used.add(id);
    const previous = catalogue.get(lessonIds[index - 1]);
    return { ...lesson, number: index + 1, prerequisite: index === 0 ? copy.entry : `Build on “${previous?.title}”.` };
  });
  const durationSeconds = lessons.reduce((total, lesson) => total + lesson.durationSeconds, 0);
  return { ...module, title: copy.title ?? module.title, description: copy.description, checkpoint: copy.checkpoint, lessons, durationSeconds, duration: formatStudyDuration(durationSeconds) };
});
if (used.size !== catalogue.size) throw new Error(`Curriculum omits ${catalogue.size - used.size} lessons.`);
const durationSeconds = modules.reduce((total, module) => total + module.durationSeconds, 0);
const course = { ...baseCourse, description: 'A connected path through electrical theory, design, installation, motors, verification and building systems.', modules, lessonCount: used.size, durationSeconds, duration: formatStudyDuration(durationSeconds) };
export default course;
