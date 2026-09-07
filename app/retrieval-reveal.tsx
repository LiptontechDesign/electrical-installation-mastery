'use client';

import { useState } from 'react';
import type { Retrieval } from './learning-design';
import Formula from './formula';
import LearningText from './learning-text';

export default function RetrievalReveal({ item, label = 'Check yourself', onRate }: {
  item: Retrieval; label?: string; onRate?: (recalled: boolean) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState<boolean | null>(null);
  return <section className="retrieval-step" aria-label={label}>
    <span className="lesson-focus-label">{label}</span>
    <h3><LearningText text={item.prompt} /></h3>
    {!revealed && <p className="retrieval-cue">Form your answer, then compare.</p>}
    <button type="button" className="secondary-button" aria-expanded={revealed} onClick={() => setRevealed(value => !value)}>{revealed ? 'Hide answer' : 'Reveal answer'}</button>
    {revealed && <div className="retrieval-answer">
      <p className="retrieval-result"><LearningText text={item.answer} /></p>
      {item.workingTex && <Formula tex={item.workingTex} block />}
      <p><strong>Why:</strong> <LearningText text={item.why} /></p>
      {item.distinction && <p><strong>Keep separate:</strong> <LearningText text={item.distinction} /></p>}
      {onRate && <div className="button-row">{[false, true].map(value => <button key={String(value)} type="button" className="secondary-button" disabled={rated !== null} onClick={() => { setRated(value); onRate(value); }}>{value ? 'Got it' : 'Need another look'}</button>)}</div>}
      {rated !== null && <p role="status" className="retrieval-cue">{rated ? 'Recall recorded. The quiz checks your understanding.' : 'Added to your review.'}</p>}
    </div>}
  </section>;
}
