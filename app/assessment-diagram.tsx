import { ArrowDown, ArrowRight, CornerDownLeft, GitBranch, RotateCw } from 'lucide-react';
import type { AssessmentQuestion } from './assessment-types';

type Lane = { label?: string; nodes: string[]; returnPath?: string; note?: string };
type Diagram = { title: string; lanes: Lane[]; caption: string };

const supplyLane = ['Supply', 'Service cut-out', 'Energy meter', 'Main isolation', 'Consumer unit', 'Final-circuit device', 'Final circuit', 'Load'];

function diagramFor(question: AssessmentQuestion): Diagram | null {
  const text = `${question.id} ${question.title} ${question.prompt}`;
  if (/TN-S \/ TN-C-S \/ TT/i.test(text)) return {
    title: 'Protective-earth relationships',
    lanes: [
      { label: 'TN-S', nodes: ['Source neutral point', 'Separate supply earth', 'Installation MET', 'CPC', 'Exposed part'], returnPath: 'Fault current returns through the separate metallic earth path.' },
      { label: 'TN-C-S', nodes: ['Source neutral point', 'Combined PEN supply', 'Service separation', 'Installation MET', 'CPC → exposed part'], returnPath: 'Neutral and protective functions are combined upstream, then separated at the service.' },
      { label: 'TT', nodes: ['Source neutral → source electrode', 'General mass of Earth', 'Installation electrode', 'MET', 'CPC → exposed part'], returnPath: 'The installation relies on its own electrode and appropriately coordinated residual-current protection.' },
    ],
    caption: 'The normal load-current path is not the protective path. Each lane shows the conceptual fault-return relationship only.',
  };
  if (/earth-electrode|three-point earth/i.test(text)) return {
    title: 'Three-point electrode-resistance test',
    lanes: [{ nodes: ['Electrode E under test', 'Potential stake P', 'Current stake C'], note: 'Earth tester: E lead → E, P lead → P, C lead → C. Place the auxiliary stakes in line at suitable spacing and confirm a stable reading by repositioning P.' }],
    caption: 'Isolate the electrode from parallel paths where the approved test method requires it, and follow the instrument manufacturer’s procedure.',
  };
  if (/two-way plus intermediate|three positions|intermediate switching/i.test(text)) return {
    title: 'Two-way and intermediate lamp control',
    lanes: [
      { label: 'Switched line', nodes: ['Line', 'S1 COM', 'S1 L1/L2', 'Intermediate: straight/cross', 'S2 L1/L2', 'S2 COM', 'Lamp line terminal'] },
      { label: 'Return conductors', nodes: ['Neutral bar', 'Lamp neutral'], note: 'Neutral runs directly to the luminaire; it is not the normal single-pole switched conductor.' },
      { label: 'Protection', nodes: ['Earth bar / MET', 'CPC at S1', 'CPC at intermediate', 'CPC at S2', 'Luminaire earth terminal'] },
    ],
    caption: 'Operating either two-way switch selects a traveller; operating the intermediate switch swaps between straight-through and crossed traveller paths.',
  };
  if (/two-way lighting|two positions/i.test(text)) return {
    title: 'Two-way lamp control',
    lanes: [
      { label: 'Line path', nodes: ['Line', 'S1 common', 'Two travellers: L1 and L2', 'S2 common', 'Switched line', 'Lamp'] },
      { label: 'Neutral', nodes: ['Neutral bar', 'Lamp neutral'] },
      { label: 'Protection', nodes: ['Earth bar', 'Continuous CPC', 'Both switch boxes and luminaire'] },
    ],
    caption: 'The lamp is energized only when the two switch positions form one continuous traveller path from line to the switched line.',
  };
  if (/one-way lighting/i.test(text)) return {
    title: 'One-way lighting circuit',
    lanes: [
      { label: 'Line path', nodes: ['Protective device', 'Line conductor', 'Switch COM', 'Switch L1', 'Switched line', 'Lamp line'] },
      { label: 'Neutral', nodes: ['Neutral bar', 'Lamp neutral'] },
      { label: 'Protection', nodes: ['Earth bar', 'CPC', 'Switch and luminaire earth terminals'] },
    ],
    caption: 'The switch interrupts the line conductor. Neutral remains directly connected to the luminaire and the CPC remains continuous.',
  };
  if (/ring-final/i.test(text)) return {
    title: 'Ring-final topology',
    lanes: [{ label: 'L, N and CPC together', nodes: ['Protective point', 'Socket 1', 'Socket 2', 'Socket 3', 'Return to the same protective point'], returnPath: 'Both ends of every ring conductor return to the same origin. A spur is a branch, not part of the return loop.' }],
    caption: 'Seeing two cables at one socket does not prove this topology; the ring conductor sets require the appropriate continuity tests.',
  };
  if (/radial socket/i.test(text)) return {
    title: 'Radial final circuit',
    lanes: [{ label: 'L, N and CPC together', nodes: ['Protective device', 'Socket 1', 'Socket 2', 'Final socket'], note: 'One principal path extends from the origin to the final point; conductor functions and CPC continuity are maintained throughout.' }],
    caption: 'The circuit does not return to the protective device as a ring.',
  };
  if (/earth-fault current path|fault-loop|ADS/i.test(text)) return {
    title: 'Earth-fault loop and automatic disconnection',
    lanes: [{ nodes: ['Source line winding', 'Line conductor', 'Fault to exposed metal', 'CPC', 'MET / earthing path', 'Source neutral point'], returnPath: 'Fault current completes the loop to the source, allowing the protective measure to disconnect within the required conditions.' }],
    caption: 'The CPC is a fault-current path, not a normal load-current conductor. Verify the complete loop and the protective-device operating condition.',
  };
  if (/consumer-unit|distribution board|consumer unit and final/i.test(text)) return {
    title: 'Consumer-unit functional arrangement',
    lanes: [
      { label: 'Line', nodes: ['Incoming line', 'Main switch', 'SPD connection where designed', 'RCCB / RCBO / MCB arrangement', 'Final-circuit lines'] },
      { label: 'Neutral', nodes: ['Incoming neutral', 'Main switch where applicable', 'Correct neutral bar / RCBO neutrals', 'Final-circuit neutrals'] },
      { label: 'Protection', nodes: ['Earthing conductor', 'MET / earth bar', 'Final-circuit CPCs'] },
    ],
    caption: 'Device arrangement, neutral association, ratings and SPD inclusion must follow the actual design and manufacturer’s instructions.',
  };
  if (/initial-verification flow|verification activities|verification sequence|order and purpose.*tests/i.test(text)) return {
    title: 'Initial-verification sequence',
    lanes: [{ nodes: ['Visual inspection', 'Safe isolation', 'Continuity tests', 'Insulation resistance', 'Polarity', 'Controlled energization', 'Live verification and RCD tests', 'Functional tests', 'Results and documentation'] }],
    caption: 'Complete the applicable dead-test evidence before controlled live testing; record results and resolve defects before certification.',
  };
  if (/circuit-design decision|select the smallest conductor|cable satisfying/i.test(text)) return {
    title: 'Circuit-design decision chain',
    lanes: [{ nodes: ['Load and supply data', 'Design current Ib', 'Protective rating In', 'Installation method', 'Correction factors', 'Cable capacity Iz', 'Voltage drop', 'Fault / ADS checks', 'Breaking capacity', 'Document selection'] }],
    caption: 'A conductor is accepted only after every applicable step passes; current-carrying capacity alone is not a complete design.',
  };
  if (/DOL power\/control|DOL.*circuit|contactor.*overload/i.test(text)) return {
    title: 'DOL starter: power and control functions',
    lanes: [
      { label: 'Power circuit', nodes: ['Three-phase supply', 'Short-circuit protective device', 'Contactor main poles', 'Overload elements', 'Motor U–V–W'] },
      { label: 'Control circuit', nodes: ['Control supply', 'STOP NC', 'Overload NC auxiliary', 'START NO', 'Contactor coil', 'Auxiliary hold-in contact'] },
    ],
    caption: 'START energizes the coil and the auxiliary contact maintains it. STOP, overload operation or loss of control supply de-energizes the contactor.',
  };
  if (/APFC|capacitor current|power factor correction/i.test(text)) return {
    title: 'Automatic power-factor-correction architecture',
    lanes: [{ nodes: ['Supply and load bus', 'CT / voltage sensing', 'APFC controller', 'Step contactors or switching devices', 'Fused capacitor steps'], note: 'The controller stages reactive compensation to meet the target without overcorrection; harmonic conditions may require detuning or specialist study.' }],
    caption: 'Capacitor-step conductors and protection are selected for their actual current, switching duty, discharge and harmonic environment.',
  };
  if (/phase allocation|building distribution|unbalance|sequence and application/i.test(text)) return {
    title: 'Three-phase distribution and phase allocation',
    lanes: [
      { label: 'L1', nodes: ['Main switchboard', 'L1 protective way', 'Allocated single-phase loads'] },
      { label: 'L2', nodes: ['Main switchboard', 'L2 protective way', 'Allocated single-phase loads'] },
      { label: 'L3', nodes: ['Main switchboard', 'L3 protective way', 'Allocated single-phase loads'] },
      { label: 'Shared functions', nodes: ['Neutral sized for the assessed load/harmonics', 'Protective conductor and bonding', 'Phase sequence verified for rotating loads'] },
    ],
    caption: 'Distribute single-phase demand deliberately, assess neutral current and preserve phase sequence where equipment operation depends on it.',
  };
  if (/verification record|inspection record/i.test(text)) return {
    title: 'Three-phase verification evidence flow',
    lanes: [{ nodes: ['Circuit identification and inspection', 'Protective continuity', 'Insulation resistance', 'Polarity', 'Phase sequence', 'Loop / fault-duty evidence', 'RCD and functional results', 'Compare limits', 'Record defects and outcome'] }],
    caption: 'A recorded number becomes evidence only when the circuit, test method, instrument, units, limits and resulting decision are all identifiable.',
  };
  if (/domestic installation|single-line diagram|incoming service|supply entry/i.test(text)) return {
    title: 'Single-phase installation: supply to load',
    lanes: [
      { label: 'Energy path', nodes: supplyLane },
      { label: 'Protective path', nodes: ['Supply earthing arrangement', 'Earthing conductor', 'MET / earth bar', 'Final-circuit CPC', 'Exposed conductive part'] },
    ],
    caption: 'The protective path is shown separately because it does not carry normal load current. Device type and arrangement must follow the actual supply and design.',
  };
  return null;
}

export default function AssessmentDiagram({ question }: { question: AssessmentQuestion }) {
  const diagram = diagramFor(question);
  if (!diagram) return null;
  return <figure className="assessment-diagram" aria-labelledby={`${question.id}-diagram-title`}>
    <div className="assessment-diagram-heading"><GitBranch size={18}/><strong id={`${question.id}-diagram-title`}>{diagram.title}</strong><span>Completed answer diagram</span></div>
    <div className="assessment-diagram-board">{diagram.lanes.map((lane, laneIndex) => <div className="diagram-lane" key={`${lane.label ?? 'lane'}-${laneIndex}`}>
      {lane.label ? <b>{lane.label}</b> : null}
      <div className="diagram-flow">{lane.nodes.map((node, nodeIndex) => <div className="diagram-node-wrap" key={`${node}-${nodeIndex}`}>
        <span className="diagram-node">{node}</span>
        {nodeIndex < lane.nodes.length - 1 ? <ArrowRight className="diagram-arrow" aria-hidden="true"/> : null}
      </div>)}</div>
      {lane.returnPath ? <div className="diagram-return"><CornerDownLeft size={17}/><span>{lane.returnPath}</span><RotateCw size={16}/></div> : null}
      {lane.note ? <div className="diagram-note"><ArrowDown size={16}/><span>{lane.note}</span></div> : null}
    </div>)}</div>
    <figcaption>{diagram.caption}</figcaption>
  </figure>;
}
