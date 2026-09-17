export function validVideoCompletionCounts(value:unknown,lessonIds:Set<string>):Record<string,number>{
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  return Object.fromEntries(Object.entries(value).filter(([id,count])=>lessonIds.has(id)&&Number.isSafeInteger(count)&&count>=1&&count<=10000));
}
// Reaching the playback end or explicitly marking watched is a recorded event,
// not proof of having viewed every second or of practical competence.
export function recordVideoCompletion<T extends {completedLessonIds:string[];videoCompletionCounts:Record<string,number>}>(state:T,lessonId:string):T{
  return {...state,completedLessonIds:[...new Set([...state.completedLessonIds,lessonId])],
    videoCompletionCounts:{...state.videoCompletionCounts,[lessonId]:Math.min(10000,(state.videoCompletionCounts[lessonId]??0)+1)}};
}

// Bulk marking is intentionally idempotent: it records at least one completion
// for each lesson without inflating repeat-completion counts for lessons that
// were already watched before the section/module action was used.
export function markVideoGroupWatched<T extends {completedLessonIds:string[];videoCompletionCounts:Record<string,number>}>(state:T,lessonIds:string[]):T{
  const videoCompletionCounts={...state.videoCompletionCounts};
  for(const lessonId of lessonIds){
    if((videoCompletionCounts[lessonId]??0)<1)videoCompletionCounts[lessonId]=1;
  }
  return {...state,completedLessonIds:[...new Set([...state.completedLessonIds,...lessonIds])],videoCompletionCounts};
}
