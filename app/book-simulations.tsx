'use client';

import { useState } from 'react';
import { ArrowUpRight, BookOpen, Check, FlaskConical } from 'lucide-react';
import { getBook, readingTopics, type Reading } from './books-data';
import LearningExperiment from './learning-experiment';

const activities = [
  { id: 'rcd', label: 'Current balance', task: 'Add an earth fault, then change its current. Watch the line, neutral and protective paths.', question: 'Where does the current missing from neutral return?', choices: ['Outside the RCD sensor', 'It disappears inside the load'], answer: 0, explanation: 'The protective path bypasses the sensor. Current is conserved: line current equals the two return currents together.' },
  { id: 'cable', label: 'Cable capacity', task: 'Keep the load at 27 A. Compare reference, grouped and thermally restricted routes.', question: 'With the 0.60 route factor, is a 32 A device below the cable’s 30 A capacity?', choices: ['Yes, because the load is only 27 A', 'No, the device rating exceeds the cable capacity'], answer: 1, explanation: 'The example requires design current ≤ device rating ≤ cable capacity. Here 32 A exceeds 30 A, even though the load is 27 A.' },
  { id: 'voltage-drop', label: 'Voltage drop', task: 'Keep the same load and route condition. Move the length from 30 m to 60 m.', question: 'What happens to the voltage drop when the length doubles?', choices: ['It stays the same', 'It doubles'], answer: 1, explanation: 'With current and the coefficient unchanged, voltage drop is proportional to route length. This coefficient already accounts for the circuit conductors.' },
  { id: 'motor', label: 'Motor starter', task: 'Hold and release Start. Remove the supply, then restore it. Try again with a failed holding contact.', question: 'Does restoring the supply restart this three-wire control model?', choices: ['Yes, automatically', 'No, Start must be pressed again'], answer: 1, explanation: 'Supply loss drops out the contactor and opens its holding contact. Restoring the supply alone does not complete the coil circuit.' },
] as const;

function SimulationActivity({ id, onRead }: { id: string; onRead: (reading: Reading) => void }) {
  const activity = activities.find(item => item.id === id) ?? activities[0];
  const topic = readingTopics.find(item => item.id === activity.id)!;
  const [answer, setAnswer] = useState<number | null>(null);
  return <section className="simulation-activity" aria-label={activity.label}>
    <h3>{activity.label}</h3>
    <p className="simulation-task"><strong>Try this</strong>{activity.task}</p>
    <LearningExperiment kind={topic.experiment!} />
    <fieldset className="simulation-check"><legend>{activity.question}</legend><div>{activity.choices.map((choice, index) => <button type="button" key={choice} aria-pressed={answer === index} onClick={() => setAnswer(index)}>{choice}</button>)}</div>
      {answer !== null && <p role="status" className={answer === activity.answer ? 'answer-correct' : 'answer-rethink'}><Check size={18} /><span><strong>{answer === activity.answer ? 'That’s right. ' : 'Look again. '}</strong>{activity.explanation}</span></p>}
    </fieldset>
    <div className="simulation-sources"><h4><BookOpen size={18} /> Read the book example</h4>{topic.readings.map(reading => <button type="button" className="reading-link" key={`${reading.bookId}-${reading.pdf}`} onClick={() => onRead(reading)}><span><strong>{reading.title}</strong><small>{getBook(reading.bookId)?.shortTitle} · pp. {reading.printed}</small></span><ArrowUpRight size={18} /></button>)}</div>
    <details className="simulation-context"><summary>Example assumptions & current requirements</summary><p>{topic.rule}</p></details>
  </section>;
}

export default function BookSimulations({ initialTopicId, onTopicChange, onRead }: { initialTopicId?: string; onTopicChange?: (id: string) => void; onRead: (reading: Reading) => void }) {
  const [selectedId, setSelectedId] = useState(() => activities.find(item => item.id === initialTopicId)?.id ?? 'rcd');
  return <div className="book-simulations"><div className="simulation-intro"><FlaskConical size={21} /><div><h2>Explore the book concepts</h2><p>Change a condition, see what happens, then check your reasoning.</p></div></div>
    <div className="simulation-picker" role="group" aria-label="Choose a simulation">{activities.map(activity => <button type="button" key={activity.id} aria-pressed={selectedId === activity.id} onClick={() => { setSelectedId(activity.id); onTopicChange?.(activity.id); }}>{activity.label}</button>)}</div>
    <SimulationActivity key={selectedId} id={selectedId} onRead={onRead} />
  </div>;
}
