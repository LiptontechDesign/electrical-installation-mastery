import { pathwayLabel, type VideoProgress } from './course-progress-model';
import { ChevronDown } from 'lucide-react';

export function OverallProgress({ progress }: { progress: VideoProgress }) {
  return <div className="overall-progress" aria-label="Overall progress across all pathways">
    <span>All pathways</span><span><strong>{progress.watched}/{progress.total}</strong> watched <b>{progress.percent}%</b></span>
  </div>;
}

export default function PathwayProgress({ path, progress, overall }: { path: string; progress: VideoProgress; overall: VideoProgress }) {
  const label = pathwayLabel(path);
  return <section className="course-summary" data-pathway={path} aria-label={label + ' pathway progress'}>
    <details className="course-progress-details" key={path}>
      <summary aria-label={`${label} progress: ${progress.watched} of ${progress.total} videos watched, ${progress.percent}%. Show overall progress`}>
        <span className="pathway-progress-count">{progress.watched}/{progress.total} videos watched</span>
        <span className="pathway-progress-heading"><strong className="sr-only">{label} progress</strong><b>{progress.percent}%</b></span><ChevronDown size={14} aria-hidden="true"/>
        <span className="progress-line" role="progressbar" aria-label={label + ' pathway progress'} aria-valuemin={0} aria-valuemax={Math.max(1, progress.total)} aria-valuenow={progress.watched} aria-valuetext={progress.total ? `${progress.watched} of ${progress.total} videos watched` : 'No active videos'}><span style={{ width: `${progress.percent}%` }}/></span>
      </summary>
      <OverallProgress progress={overall}/>
    </details>
  </section>;
}
