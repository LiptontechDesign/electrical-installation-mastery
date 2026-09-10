import index from './integrated-video-index.json';

type WatchedState={completedLessonIds:string[];promotedVideoProgressImported?:boolean};
// Pure, idempotent migration. Never invent quiz passes or overwrite an undo.
export function importPromotedWatched<T extends WatchedState>(state:T, watched:unknown):T {
  if(state.promotedVideoProgressImported)return state;
  if(!Array.isArray(watched)||!watched.every(id=>typeof id==='string'))return state;
  const videoIds=new Set(watched);
  return {...state,promotedVideoProgressImported:true,completedLessonIds:[
    ...new Set([...state.completedLessonIds,...index.filter(v=>videoIds.has(v.videoId)).map(v=>v.id)]),
  ]};
}
export const licensingPracticeId=(path:'C2'|'C1')=>'licensing:'+path+'-transcripts-20260910';
