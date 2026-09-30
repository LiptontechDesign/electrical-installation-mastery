export default function LessonProgress({ watched, completions, optional = false }: { watched: boolean; completions: number; optional?: boolean }) {
  return <section className="lesson-progress" aria-label="Your record for this lesson">
    <dl><div><dt>Video</dt><dd>{watched ? 'Watched' : 'Not marked watched'}<small>{optional ? 'Optional lesson' : completions ? completions + ' recorded ' + (completions === 1 ? 'completion' : 'completions') : 'No new completion events recorded'}</small></dd></div></dl>
    <details><summary>How this record works</summary><p>Opening a lesson does not complete it. Finishing playback or choosing “Mark video watched” saves the watched status to your account. {optional ? 'Undo removes the watched mark.' : 'Replaying can record another completion. Undo changes the watched status, not the event history.'} Course progress counts every active video once, including optional and supplementary videos. Archived or deleted videos are excluded from the totals; restoring an archived video restores its saved watched status. These records sync across your devices and are included in your progress backup.</p></details>
  </section>;
}
