import type {QuizRecord} from './tutor-model';

export default function LessonProgress({watched,completions,quiz,passed,earlierScore}:{watched:boolean;completions:number;quiz?:QuizRecord;passed:boolean;earlierScore:number}){
  return <section className="lesson-progress" aria-label="Your record for this lesson">
    <dl>
      <div><dt>Video</dt><dd>{watched?'Watched':'Not marked watched'}</dd><small>{completions?completions+' recorded '+(completions===1?'completion':'completions'):'No new completion events recorded'}</small></div>
      <div><dt>Lesson quiz</dt><dd>{quiz?'Latest '+quiz.latestScore+'/'+quiz.latestTotal:passed?'Earlier pass saved':earlierScore?'Earlier result saved':'Not attempted'}</dd><small>{quiz?'Best '+quiz.bestScore+'/'+quiz.bestTotal+(passed?' · Passed at least once':' · Not yet passed'):passed?'Your previous pass is preserved':'Take it whenever you feel ready'}</small></div>
      <div><dt>Quiz attempts</dt><dd>{quiz?.attempts??'—'}</dd><small>{quiz?'Completed submissions':'No detailed attempt history'}</small></div>
    </dl>
    <details><summary>How these records work</summary><p>Opening a lesson does not complete it. Finishing playback or choosing “Mark video watched” records a completion; replaying can add another. Counts start with this update—older watched marks are preserved without guessing how many times you watched. These are recorded events, not proof that every second was watched. Undo changes the watched status, not the event history.</p><p>Quizzes and checkpoints are separate: an attempt records your latest and best scores. Reaching 80% records a pass without marking any unwatched videos complete. Repeats do not inflate the percentage of unique course items completed. Records stay in this browser and are included in your progress backup.</p></details>
  </section>;
}
