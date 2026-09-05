'use client';
import { useState } from 'react';
export function loopModel(ze:number,circuit:number,open:boolean){
  if(![ze,circuit].every(Number.isFinite)||ze<=0||circuit<0)throw new RangeError('Use finite non-negative circuit resistance and positive external impedance.');
  return {zs:ze+circuit,current:open?0:230/(ze+circuit)};
}
export default function LoopVisual(){
  const [circuit,setCircuit]=useState(.5),[open,setOpen]=useState(false),[motion,setMotion]=useState(false);
  const result=loopModel(.3,circuit,open);
  return <details className="loop-explorer"><summary>See the fault-current path</summary><p>Predict first: if the circuit resistance increases at the same source voltage, will the prospective fault current rise or fall?</p><label>Circuit R1 + R2: <strong>{circuit.toFixed(2)} Ω</strong><input type="range" aria-label="Circuit line and protective conductor resistance" min=".1" max="2" step=".1" value={circuit} onChange={event=>setCircuit(Number(event.target.value))}/></label><div className="button-row"><button type="button" className="secondary-button" aria-pressed={open} onClick={()=>setOpen(value=>!value)}>{open?'Restore the virtual CPC':'Open the virtual CPC'}</button><button type="button" className="secondary-button" aria-pressed={motion} onClick={()=>setMotion(value=>!value)}>{motion?'Pause flow':'Animate flow'}</button></div>
    <svg className={`loop-diagram ${motion&&!open?'flowing':''}`} viewBox="0 0 640 290" role="img" aria-label={open?'Open protective path: no current in the idealised intended loop; accessible metal may remain hazardous.':`Complete fault path from source along line to the enclosure and back through CPC. Approximate prospective current ${result.current.toFixed(0)} amperes.`}>
      <path d="M95 70 H540 V220 H95 Z" fill="none" stroke="#cbd6df" strokeWidth="6"/>
      <path className="loop-current" d={open?'M95 70 H540 V220 H370':'M95 70 H540 V220 H95 V70'} fill="none" stroke="#19748a" strokeWidth="4"/>
      <rect x="50" y="100" width="90" height="85" rx="8" fill="#172c40"/><text x="95" y="132" textAnchor="middle" fill="white">Source</text><text x="95" y="160" textAnchor="middle" fill="white">230 V</text>
      <rect x="235" y="43" width="135" height="55" rx="8" fill="#e8eef3" stroke="#8298aa"/><text x="302" y="76" textAnchor="middle" fill="#17212b">Protection</text>
      <rect x="480" y="110" width="125" height="65" rx="8" fill="#fff1e3" stroke="#af682b"/><text x="542" y="136" textAnchor="middle" fill="#17212b">Line-to-case</text><text x="542" y="158" textAnchor="middle" fill="#17212b">fault</text>
      {open&&<><path d="M270 220 H355" stroke="white" strokeWidth="12"/><path d="M270 220 L350 188" stroke="#b05029" strokeWidth="5"/><text x="310" y="270" textAnchor="middle" fill="#8c431e">CPC open</text></>}
      <text x="420" y="52" textAnchor="middle" fill="#17212b">Line →</text><text x="300" y="205" textAnchor="middle" fill="#17212b">← CPC return</text><text x="100" y="260" textAnchor="middle" fill="#17212b">Ze = 0.30 Ω</text>
    </svg>
    <div className="loop-readout" role="status">{open?<><strong>The intended protective loop is open.</strong><p>In this idealised model its current is zero. Accessible metal can still become hazardous; other return paths may exist in a real installation. This is not a safe state.</p></>:<><strong>Zs ≈ {result.zs.toFixed(2)} Ω · If ≈ {result.current.toFixed(0)} A</strong><p>If ≈ U0 / Zs in this simplified resistive model. Increasing impedance reduces prospective fault current. The device response and disconnection time are not simulated.</p></>}</div>
  </details>;
}
