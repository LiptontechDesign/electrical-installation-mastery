import { pathwayLabel, type VideoProgress } from './course-progress-model';

export function OverallProgress({ progress }: { progress: VideoProgress }) {
  return <div className="overall-progress" aria-label="Overall progress across all pathways">
    <span>All pathways</span><span><strong>{progress.watched}/{progress.total}</strong> watched <b>{progress.percent}%</b></span>
  </div>;
}

export default function PathwayProgress({ path, progress, overall }: { path: string; progress: VideoProgress; overall: VideoProgress }) {
  const label = pathwayLabel(path);
  return <section className="course-summary" data-pathway={path} aria-label={label + ' pathway progress'}>
    <div className="pathway-progress-heading"><strong>{label} progress</strong><b>{progress.percent}%</b></div>
    <span className="pathway-progress-count">{progress.watched}/{progress.total} videos watched</span>
    <div className="progress-line" role="progressbar" aria-label={label + ' pathway progress'} aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.watched}><span style={{ width: `${progress.percent}%` }}/></div>
    <OverallProgress progress={overall}/>
  </section>;
}
