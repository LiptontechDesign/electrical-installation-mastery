import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';

export function CourseProgressSummary({ total, watched, optionalRemaining, optionalTotal, label, optionalOnly = false }: {
  total: number; watched: number; optionalRemaining: number; optionalTotal: number; label: string; optionalOnly?: boolean;
}) {
  const complete = total > 0 && watched === total;
  const state = complete ? 'complete' : watched > 0 ? 'started' : 'new';
  const Icon = complete ? CheckCircle2 : watched > 0 ? PlayCircle : Circle;
  return <span className="course-progress-summary" data-state={state}>
    <span className="course-status"><Icon size={14} aria-hidden="true"/>{complete ? optionalOnly ? 'Optional complete' : 'Core complete' : watched > 0 ? 'Continue learning' : total ? 'Ready to start' : 'No videos'}</span>
    <span className="course-progress-count" aria-label={String(watched) + " of " + total + (optionalOnly ? " optional" : " core") + " videos watched"}><strong>{watched}</strong><span> / {total} {optionalOnly ? 'optional' : 'core'}</span></span>
    {total > 0 && <span className="course-progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={total} aria-valuenow={watched}><span style={{ width: String(watched / total * 100) + '%' }}/></span>}
    {optionalTotal > 0 && <span className="course-optional-status">{optionalRemaining > 0 ? String(optionalRemaining) + ' optional video' + (optionalRemaining === 1 ? '' : 's') + ' remaining' : 'Optional complete'}</span>}
  </span>;
}
