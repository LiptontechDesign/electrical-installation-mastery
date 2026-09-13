'use client';

import { useState } from 'react';
import { ArrowUpRight, BookOpen, FlaskConical } from 'lucide-react';
import { getBook, readingTopics, type Reading } from './books-data';
import LearningExperiment from './learning-experiment';
import { simulationActivities as activities } from './simulation-activities';

function SimulationActivity({ id, onRead }: { id: string; onRead: (reading: Reading) => void }) {
  const activity = activities.find(item => item.id === id) ?? activities[0];
  const topic = readingTopics.find(item => item.id === activity.id)!;

  return <section className="simulation-activity" aria-label={activity.label}>
    <h3>{activity.label}</h3>
    <p className="simulation-task"><strong>Try this</strong>{activity.task}</p>
    <LearningExperiment kind={topic.experiment!} />
    <details className="simulation-context"><summary>Explain the model</summary><p>{activity.explanation}</p></details>
    <div className="simulation-sources"><h4><BookOpen size={18} /> Read the book example</h4>{topic.readings.map(reading => <button type="button" className="reading-link" key={`${reading.bookId}-${reading.pdf}`} onClick={() => onRead(reading)}><span><strong>{reading.title}</strong><small>{getBook(reading.bookId)?.shortTitle} · pp. {reading.printed}</small></span><ArrowUpRight size={18} /></button>)}</div>
    <details className="simulation-context"><summary>Example assumptions & current requirements</summary><p>{topic.rule}</p></details>
  </section>;
}

export default function BookSimulations({ initialTopicId, onTopicChange, onRead }: { initialTopicId?: string; onTopicChange?: (id: string) => void; onRead: (reading: Reading) => void }) {
  const [selectedId, setSelectedId] = useState(() => activities.find(item => item.id === initialTopicId)?.id ?? 'rcd');
  return <div className="book-simulations"><div className="simulation-intro"><FlaskConical size={21} /><div><h2>Explore the book concepts</h2><p>Change a condition, see what happens, read how the model explains the change.</p></div></div>
    <div className="simulation-picker" role="group" aria-label="Choose a simulation">{activities.map(activity => <button type="button" key={activity.id} aria-pressed={selectedId === activity.id} onClick={() => { setSelectedId(activity.id); onTopicChange?.(activity.id); }}>{activity.label}</button>)}</div>
    <SimulationActivity key={selectedId} id={selectedId} onRead={onRead} />
  </div>;
}
