// A small mixed course using genuine catalogue lessons and personal edits.
export function progressFixture(model) {
  const coreIds = ['course-9xNy5ne2YPI', 'p02-l04', 'course-l7df_UZxT0E'];
  const sectionId = 'module-05-section-3';
  let state = structuredClone(model.publishedPersonalCourse);
  state.archivedLessonIds = model.personalCourseSnapshot(state).allRows.filter(row => row.kind === 'core' && !coreIds.includes(row.id)).map(row => row.id);
  state.videos = state.videos.map(video => ({ ...video, archived: true }));
  const added = [];
  for (const [videoId, title] of [['progTest001', 'Supplementary electrode demonstration'], ['progTest002', 'Supplementary earth resistance demonstration']]) {
    const urlId = videoId.padEnd(11, 'x');
    state = model.applyCourseEdit(state, { operationId: crypto.randomUUID(), revision: state.revision, edit: { type: 'add', url: 'https://youtu.be/' + urlId, title, instructor: 'Progress test instructor', sectionId, beforeId: null } });
    added.push(state.videos.find(video => video.videoId === urlId));
  }
  return { state, coreIds, sectionId, added, destination: 'c1-fundamentals-section-1' };
}
