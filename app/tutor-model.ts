export type EvidenceDimension = 'recognition' | 'recall' | 'application' | 'standards' | 'diagnosis';
export type LearningEvidence = {
  id: string; lessonId: string; conceptId: string; activityId: string;
  dimension: EvidenceDimension; correct: boolean; assisted: boolean;
  at: string; misconception?: string;
};
export type EvidenceInput = Omit<LearningEvidence, 'id' | 'at'>;
export const dimensionLabels: Record<EvidenceDimension, string> = {
  recognition: 'Recognition', recall: 'Self-reported recall', application: 'Calculation reasoning', standards: 'Standards reasoning', diagnosis: 'Fault diagnosis',
};
export function validEvidence(value: unknown, lessonIds: Set<string>): LearningEvidence[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((item): item is LearningEvidence => {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || seen.has(item.id)
      || !lessonIds.has(item.lessonId) || typeof item.conceptId !== 'string' || !item.conceptId
      || typeof item.activityId !== 'string' || !Object.hasOwn(dimensionLabels, item.dimension)
      || typeof item.correct !== 'boolean' || typeof item.assisted !== 'boolean'
      || typeof item.at !== 'string' || !Number.isFinite(Date.parse(item.at))
      || Date.parse(item.at) > Date.now() + 86400000) return false;
    seen.add(item.id); return true;
  }).slice(-4000).map(item => ({ ...item, misconception: typeof item.misconception === 'string' ? item.misconception.slice(0, 300) : undefined }));
}
export function appendEvidence(events: LearningEvidence[], input: EvidenceInput, at = new Date().toISOString()): LearningEvidence[] {
  const repeatedToday = events.some(event => event.lessonId === input.lessonId && event.activityId === input.activityId && calendarDay(new Date(event.at)) === calendarDay(new Date(at)));
  return [...events, { ...input, assisted: input.assisted || repeatedToday, at, id: `${at}-${events.length}-${input.activityId}` }].slice(-4000);
}
export function latestEvidence(events: LearningEvidence[]): LearningEvidence[] {
  const latest = new Map<string, LearningEvidence>();
  for (const event of [...events].sort((a, b) => Date.parse(a.at) - Date.parse(b.at))) {
    // A fresh calculation variant can resolve the same underlying difficulty.
    const activity = /^calc(?:-choice)?:/.test(event.activityId) ? event.activityId.replace(/:\d+$/, '') : event.activityId;
    latest.set(`${event.lessonId}:${event.conceptId}:${event.dimension}:${activity}`, event);
  }
  return [...latest.values()];
}
export function learningSnapshot(events: LearningEvidence[], lessonId?: string, now = Date.now()) {
  const selected = events.filter(event => !lessonId || event.lessonId === lessonId);
  const latest = latestEvidence(selected);
  const weaknesses = latest.filter(event => !event.correct || event.assisted).sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  const dimensions = (Object.keys(dimensionLabels) as EvidenceDimension[]).map(dimension => {
    const items = latest.filter(event => event.dimension === dimension);
    return { dimension, label: dimensionLabels[dimension], attempted: items.length, successful: items.filter(event => event.correct && !event.assisted).length };
  });
  const retained = new Set<string>();
  for (const event of latest.filter(event => event.correct && !event.assisted && event.dimension === 'recall')) {
    if (selected.some(prior => prior.conceptId === event.conceptId && prior.lessonId === event.lessonId && prior.correct && !prior.assisted && prior.dimension === 'recall' && Date.parse(event.at) - Date.parse(prior.at) >= 7 * 86400000)) retained.add(`${event.lessonId}:${event.conceptId}`);
  }
  const stale = latest.filter(event => event.correct && now - Date.parse(event.at) >= 14 * 86400000);
  return { dimensions, weaknesses, retained: retained.size, stale, total: selected.length };
}
export function nextLearningAction(events: LearningEvidence[], due: number, currentLessonId: string) {
  const { weaknesses, stale } = learningSnapshot(events);
  const difficulty = weaknesses[0];
  if (difficulty) return { kind: 'repair' as const, lessonId: difficulty.lessonId, title: 'Work through a recent difficulty', reason: difficulty.correct ? 'Your supported attempt is a useful step. Try a fresh example without help; revisit the same question on a later day.' : `Your latest ${dimensionLabels[difficulty.dimension].toLowerCase()} attempt needs another look.`, activityId: difficulty.activityId, dimension: difficulty.dimension };
  if (due) return { kind: 'review' as const, lessonId: currentLessonId, title: `Retrieve ${Math.min(due, 5)} due ideas`, reason: 'A short recall session brings earlier learning back before you continue.' };
  if (stale[0]) return { kind: 'repair' as const, lessonId: stale[0].lessonId, title: 'Check an earlier idea', reason: 'This evidence is at least two weeks old. Try it again without help.', activityId: stale[0].activityId, dimension: stale[0].dimension };
  return { kind: 'continue' as const, lessonId: currentLessonId, title: 'Continue your learning', reason: 'Orient yourself, retrieve a key idea, then take the next useful step.' };
}
export function calendarDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function isProgressBackup(value: unknown, lessonIds: Set<string>): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const input = value as Record<string, unknown>;
  return Array.isArray(input.completedLessonIds) && typeof input.activeLessonId === 'string'
    && lessonIds.has(input.activeLessonId) && (input.schemaVersion === undefined || (typeof input.schemaVersion === 'number' && Number.isInteger(input.schemaVersion) && input.schemaVersion >= 1 && input.schemaVersion <= 6));
}
export type QuizRecord = {
  bestScore: number;
  bestTotal: number;
  latestScore: number;
  latestTotal: number;
  attempts: number;
  lastAttemptAt: string;
};
export function recordQuizAttempt(previous: QuizRecord | undefined, score: number, total: number, at = new Date().toISOString()): QuizRecord {
  if (!Number.isInteger(score) || !Number.isInteger(total) || total < 1 || score < 0 || score > total || !Number.isFinite(Date.parse(at))) throw new RangeError('Quiz scores require valid whole-number marks, a positive total and a valid date.');
  const isNewBest = !previous || score / total > previous.bestScore / previous.bestTotal;
  return {
    bestScore: isNewBest ? score : previous.bestScore,
    bestTotal: isNewBest ? total : previous.bestTotal,
    latestScore: score,
    latestTotal: total,
    attempts: Math.min(10000,(previous?.attempts ?? 0)+1),
    lastAttemptAt: at,
  };
}
export function validQuizRecords(value: unknown, validIds: Set<string>): Record<string, QuizRecord> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id,item]) => {
    if (!validIds.has(id) || !item || typeof item !== 'object' || Array.isArray(item)) return false;
    const record=item as Partial<QuizRecord>;
    return Number.isInteger(record.bestScore) && Number.isInteger(record.bestTotal) && Number.isInteger(record.latestScore) && Number.isInteger(record.latestTotal)
      && Number.isInteger(record.attempts) && (record.attempts??0)>=1 && (record.attempts??0)<=10000
      && (record.bestTotal??0)>=1 && (record.latestTotal??0)>=1
      && (record.bestScore??-1)>=0 && (record.bestScore??0)<=(record.bestTotal??0)
      && (record.latestScore??-1)>=0 && (record.latestScore??0)<=(record.latestTotal??0)
      && typeof record.lastAttemptAt==='string' && Number.isFinite(Date.parse(record.lastAttemptAt));
  })) as Record<string,QuizRecord>;
}
export type RecallRecord = { streak: number; dueAt: string; lastReviewedAt?: string };
export function scheduleRecall(previous: RecallRecord | undefined, knew: boolean, now = new Date()): RecallRecord {
  const today = calendarDay(now);
  // Repeated successes on one day are practice, not evidence of a longer retention interval.
  if (knew && previous?.lastReviewedAt === today) return previous;
  const streak = knew ? Math.min(5, (previous?.streak ?? 0) + 1) : 0;
  const next = new Date(now); next.setDate(next.getDate() + (knew ? [1, 3, 7, 14, 30][streak - 1] : 0));
  return { streak, dueAt: calendarDay(next), lastReviewedAt: today };
}
