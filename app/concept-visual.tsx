'use client';

import { useState } from 'react';

const particles = [
  { name: 'Proton', charge: '+', place: 'In the nucleus', note: 'Positive charge.', className: 'positive' },
  { name: 'Neutron', charge: '0', place: 'In the nucleus', note: 'No net electric charge.', className: 'neutral' },
  { name: 'Electron', charge: '−', place: 'Outside the nucleus', note: 'Negative charge. Mobile electrons carry current in metals.', className: 'negative' },
];

export default function ConceptVisual({ lessonId }: { lessonId: string }) {
  const [particleIndex, setParticleIndex] = useState(0);
  const [closed, setClosed] = useState(true);
  if (lessonId === 'p01-l01' || lessonId === 'p01-l02') {
    const particle = particles[particleIndex];
    return <details className="concept-visual"><summary>Explore the particles</summary><div className="particle-selector" aria-label="Choose a particle">{particles.map((item, i) => <button key={item.name} className={item.className} aria-pressed={i === particleIndex} type="button" onClick={() => setParticleIndex(i)}><b>{item.charge}</b><span>{item.name}</span></button>)}</div><div className="particle-explanation" role="status"><strong>{particle.place}</strong><p>{particle.note}</p></div></details>;
  }
  if (lessonId === 'p01-l05') return <details className="concept-visual"><summary>Try the circuit model</summary><button className="circuit-switch" type="button" role="switch" aria-checked={closed} onClick={() => setClosed((value) => !value)}>Switch: {closed ? 'closed' : 'open'}</button><div className={`circuit-model ${closed ? 'closed' : ''}`}><span>Source</span><i aria-hidden="true">→</i><span>{closed ? 'Closed path' : 'Open path'}</span><i aria-hidden="true">→</i><span>Load</span></div><p role="status">{closed ? 'Complete path: current can flow.' : 'Broken path: no sustained current flows.'}</p></details>;
  return null;
}
