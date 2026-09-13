export default function LessonProgress({ watched, completions }: { watched: boolean; completions: number }) {
  return <section className="lesson-progress" aria-label="Your record for this lesson">
    <dl><div><dt>Video</dt><dd>{watched ? 'Watched' : 'Not marked watched'}</dd><small>{completions ? completions + ' recorded ' + (completions === 1 ? 'completion' : 'completions') : 'No new completion events recorded'}</small></div></dl>
    <details><summary>How this record works</summary><p>Opening a lesson does not complete it. Finishing playback or choosing “Mark video watched” records a completion; replaying can add another. Older watched marks are preserved without guessing how many times you watched. Undo changes the watched status, not the event history. Required course progress counts each watched required video once. These records stay in this browser and are included in your progress backup.</p></details>
  </section>;
}
