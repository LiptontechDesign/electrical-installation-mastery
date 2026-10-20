type ModuleProgress = { total: number; watched: number };

export type CourseMapGroup<T> =
  | { kind: 'module'; module: T }
  | { kind: 'completed'; id: string; modules: T[]; watched: number };

// Compact finished runs in place. A skipped or empty module keeps its position,
// and the playing module stays visible even after its final video is watched.
export function buildCourseMapGroups<T extends { id: string }>(
  modules: readonly T[],
  options: { enabled: boolean; currentModuleId: string; progressByModule: ReadonlyMap<string, ModuleProgress> },
): CourseMapGroup<T>[] {
  const groups: CourseMapGroup<T>[] = [];
  for (const courseModule of modules) {
    const progress = options.progressByModule.get(courseModule.id);
    const finished = options.enabled && courseModule.id !== options.currentModuleId
      && progress && progress.total > 0 && progress.watched === progress.total;
    if (!finished) {
      groups.push({ kind: 'module', module: courseModule });
      continue;
    }
    const previous = groups.at(-1);
    if (previous?.kind === 'completed') {
      previous.modules.push(courseModule);
      previous.watched += progress.watched;
    } else {
      groups.push({ kind: 'completed', id: `completed-${courseModule.id}`, modules: [courseModule], watched: progress.watched });
    }
  }
  return groups;
}
