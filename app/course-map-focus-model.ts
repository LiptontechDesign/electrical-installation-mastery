type ModuleProgress = { total: number; watched: number };

export type CourseMapGroup<T> =
  | { kind: 'module'; module: T }
  | { kind: 'completed' | 'following'; id: string; modules: T[]; watched: number };

// Compact finished runs in place. A skipped or empty module keeps its position,
// and the playing module stays visible even after its final video is watched.
export function buildCourseMapGroups<T extends { id: string }>(
  modules: readonly T[],
  options: { enabled: boolean; currentModuleId: string; progressByModule: ReadonlyMap<string, ModuleProgress>; compactFollowing?: boolean },
): CourseMapGroup<T>[] {
  const groups: CourseMapGroup<T>[] = [];
  const currentIndex = modules.findIndex(item => item.id === options.currentModuleId);
  for (const courseModule of modules) {
    const progress = options.progressByModule.get(courseModule.id);
    if (options.enabled && options.compactFollowing && currentIndex >= 0 && modules.indexOf(courseModule) > currentIndex) {
      const previous = groups.at(-1);
      if (previous?.kind === 'following') {
        previous.modules.push(courseModule);
        previous.watched += progress?.watched ?? 0;
      } else groups.push({ kind: 'following', id: `following-${options.currentModuleId}`, modules: [courseModule], watched: progress?.watched ?? 0 });
      continue;
    }
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
