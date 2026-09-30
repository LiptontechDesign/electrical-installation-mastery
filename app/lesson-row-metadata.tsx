import { Bookmark } from 'lucide-react';

export default function LessonRowMetadata({ kind, duration, watched, current = false, completions = 0, saved = false }: {
  kind: string; duration?: string; watched?: boolean; current?: boolean; completions?: number; saved?: boolean;
}) {
  const record = watched === undefined ? '' : watched ? 'Watched' : 'Not watched';
  const repeat = completions > 1 ? completions + ' recorded completions' : '';
  const description = [kind, duration, current ? 'Watching now' : '', record, repeat, saved ? 'Saved for later' : ''].filter(Boolean).join(' · ');
  return <small className="lesson-row-meta" title={description}>
    <span className="lesson-row-kind" title={kind}>{kind}</span>
    {duration && <span className="lesson-row-duration">· {duration}</span>}
    {current ? <span className="lesson-row-status"><b className="lesson-row-current"><span className="lesson-row-current-full">Watching now</span><span className="lesson-row-current-short" aria-hidden="true">Now</span></b><span className="editor-sr-only">{record}</span></span>
      : record && <span className="lesson-row-status">· {record}</span>}
    {repeat && <><span className="lesson-row-repeat" aria-hidden="true">×{completions}</span><span className="editor-sr-only">{repeat}</span></>}
    {saved && <Bookmark className="lesson-row-saved" size={13} fill="currentColor" role="img" aria-label="Saved for later"/>}
  </small>;
}
