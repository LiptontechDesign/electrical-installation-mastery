'use client';

import { useId, useState } from 'react';
import Formula from './formula';
import { motorSpeedExample, powerFactorExample } from './connection-models';
import type { LessonConnection as Connection } from './lesson-connections-data';

const number = (value: number) => value.toLocaleString('en', { maximumFractionDigits: 2 });

function PowerFactorExercise() {
  const id = useId();
  const [target, setTarget] = useState(0.95);
  const result = powerFactorExample(5, 230, 0.75, target);
  const beforeY = 175 - result.beforeReactive * 35;
  const afterY = 175 - result.afterReactive * 35;
  return <div className="connection-exercise">
    <label htmlFor={id}>Target power factor <output>{target.toFixed(2)}</output></label>
    <input id={id} type="range" min="0.75" max="1" step="0.01" value={target} onChange={event => setTarget(Number(event.target.value))} />
    <svg viewBox="0 0 300 210" role="img" aria-label={`At 5 kW, reactive demand falls from ${number(result.beforeReactive)} to ${number(result.afterReactive)} kVAr. Real power stays fixed.`}>
      <path d={`M40 175 H215 V${beforeY} Z`} fill="none" stroke="#a8b6af" strokeWidth="3" strokeDasharray="6 5" />
      <path d={`M40 175 H215 V${afterY} Z`} fill="#dceadf" stroke="#476b52" strokeWidth="3" />
      <text x="94" y="199">P = 5 kW</text><text x="225" y="145">Q</text><text x="118" y={(175 + afterY) / 2 - 8}>S</text>
    </svg>
    <div className="connection-results" aria-live="polite"><span>Capacitor <strong>{number(result.compensation)} kVAr</strong></span><span>Supply current <strong>{number(result.beforeCurrent)} → {number(result.afterCurrent)} A</strong></span></div>
    <p>Single-phase, 230 V, sinusoidal load; initial PF 0.75 lagging. Dashed: before. Green: after. Real power stays at 5 kW.</p>
  </div>;
}

function MotorExercise() {
  const id = useId();
  const [frequency, setFrequency] = useState(50);
  const [poles, setPoles] = useState(4);
  const result = motorSpeedExample(frequency, poles, 3.333333333333333);
  return <div className="connection-exercise">
    <label htmlFor={`${id}-frequency`}>Supply frequency <output>{frequency} Hz</output></label>
    <input id={`${id}-frequency`} type="range" min="40" max="60" step="1" value={frequency} onChange={event => setFrequency(Number(event.target.value))} />
    <label htmlFor={`${id}-poles`}>Number of poles</label>
    <select id={`${id}-poles`} value={poles} onChange={event => setPoles(Number(event.target.value))}>{[2, 4, 6, 8].map(value => <option value={value} key={value}>{value} poles</option>)}</select>
    <div className="motor-speed-visual" aria-hidden="true"><small>Rotating field</small><span style={{ width: `${result.synchronous / 36}%` }} /><small>Rotor</small><span style={{ width: `${result.rotor / 36}%` }} /></div>
    <div className="connection-results" aria-live="polite"><span>Synchronous speed <strong>{number(result.synchronous)} rpm</strong></span><span>Illustrative rotor speed <strong>{number(result.rotor)} rpm</strong></span></div>
    <p>Slip is held at 3.33% to isolate frequency and pole-count effects. Actual slip depends on the motor and load; this is not a VFD operating limit.</p>
  </div>;
}

function SequenceExercise() {
  const [reversed, setReversed] = useState(false);
  return <div className="connection-exercise">
    <div className="phase-order" aria-label="Illustrative phase order">{(reversed ? ['L1', 'L3', 'L2'] : ['L1', 'L2', 'L3']).map((phase, index) => <span key={phase}>{index > 0 && <i aria-hidden="true">→</i>}<b>{phase}</b></span>)}</div>
    <button type="button" aria-pressed={reversed} onClick={() => setReversed(value => !value)}>{reversed ? 'Restore original order' : 'Exchange two phases in the model'}</button>
    <p role="status">{reversed ? 'The relative phase sequence is reversed.' : 'The original phase sequence is shown.'} This model does not establish actual shaft direction.</p>
  </div>;
}

export default function LessonConnection({ connection }: { connection: Connection }) {
  return <details className="lesson-connection">
    <summary>{connection.title}</summary>
    <div className="connection-body">
      {connection.points.map(point => <p key={point}>{point}</p>)}
      {connection.equations?.map(tex => <Formula key={tex} tex={tex} block />)}
      {connection.exercise === 'power-factor' && <PowerFactorExercise />}
      {connection.exercise === 'motor' && <MotorExercise />}
      {connection.exercise === 'sequence' && <SequenceExercise />}
      <details className="connection-answer"><summary>{connection.question}</summary><p>{connection.answer}</p></details>
      <a href={connection.source.url} target="_blank" rel="noreferrer">{connection.source.title} ↗</a>
      {connection.title === 'Separate a principle from a current rule' && <p className="connection-authorities"><a href="https://epra.go.ke/electricity-1" target="_blank" rel="noreferrer">EPRA requirements ↗</a> <a href="https://www.kebs.org/" target="_blank" rel="noreferrer">KEBS standards ↗</a></p>}
    </div>
  </details>;
}
