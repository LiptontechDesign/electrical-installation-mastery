export const abbreviationHelp = [
  { pattern: '\\bBS\\b', label: 'BS — British Standard', meaning: 'A published British standard. BS 7671 sets requirements for electrical installations.' },
  { pattern: '\\bEN\\b', label: 'EN — European Standard', meaning: 'A European standard; BS EN identifies its adoption as a British Standard.' },
  { pattern: '\\bcpc\\b', label: 'CPC — circuit protective conductor', meaning: 'Connects equipment’s exposed conductive parts to the main earthing terminal.' },
  { pattern: '\\bSELV\\b', label: 'SELV — separated extra-low voltage', meaning: 'An extra-low-voltage system separated from Earth and other systems so that a single fault does not create an electric-shock risk.' },
  { pattern: '\\bPELV\\b', label: 'PELV — protective extra-low voltage', meaning: 'An extra-low-voltage system meeting the SELV protective requirements except that it may be connected to Earth.' },
  { pattern: '\\bFELV\\b', label: 'FELV — functional extra-low voltage', meaning: 'Extra-low voltage used for a functional purpose without all the protective measures required for SELV or PELV. Low voltage alone does not establish equivalent shock protection.' },
  { pattern: '\\bPE\\b', label: 'PE — protective conductor', meaning: 'A conductor used in measures that protect against electric shock.' },
  { pattern: '\\bPEN\\b', label: 'PEN — combined protective and neutral conductor', meaning: 'One conductor performs both the protective-conductor function and the neutral-conductor function.' },
  { pattern: '\\bPME\\b', label: 'PME — protective multiple earthing', meaning: 'An earthing arrangement in which the supply neutral has multiple connections to Earth and provides the installation’s means of earthing.' },
  { pattern: '\\bRCD\\b', label: 'RCD — residual current device', meaning: 'Disconnects when the residual current reaches its operating value under specified conditions. Residual current is the imbalance between currents in the circuit’s live conductors.' },
  { pattern: '\\bRCBO\\b', label: 'RCBO — residual current operated circuit-breaker with integral overcurrent protection', meaning: 'Combines residual-current protection with protection against overload and/or short-circuit.' },
  { pattern: '\\bRCCB\\b', label: 'RCCB — residual current operated circuit-breaker without integral overcurrent protection', meaning: 'Provides residual-current protection; overload and short-circuit protection must be provided separately.' },
  { pattern: '\\bSPD\\b', label: 'SPD — surge protective device', meaning: 'Limits transient overvoltages and diverts surge currents. A transient is a short-lived voltage or current disturbance.' },
  { pattern: '\\ba\\.c\\.', label: 'a.c. — alternating current', meaning: 'Current that periodically changes direction.' },
  { pattern: '\\bd\\.c\\.', label: 'd.c. — direct current', meaning: 'Current that flows in one direction; its magnitude may still vary.' },
  { pattern: '\\brms\\b', label: 'rms — root mean square', meaning: 'The effective value of an alternating voltage or current: the direct-current value producing the same average heating effect in the same resistance.' },
  { pattern: '\\bV\\b', label: 'V — volt', meaning: 'The unit of electrical potential difference, also called voltage.' },
  { pattern: '\\bkg\\b', label: 'kg — kilogram', meaning: 'The unit of mass.' },
  { pattern: '\\bIpf\\b', label: 'Ipf — prospective fault current', meaning: 'The current that would flow at the point under consideration if a fault of negligible impedance occurred.' },
  { pattern: 'Z<sub>s</sub>', label: 'Zs — earth fault loop impedance', meaning: 'The total opposition to alternating fault current around the complete earth-fault loop, including the outgoing and return paths.' },
  { pattern: '\\b(?:TN(?:-C-S|-C|-S)?|TT|IT)\\b', label: 'Earthing-system letters', meaning: 'The first letter describes the source: T means a direct connection to Earth; I means isolation from Earth or connection through an impedance. The second letter describes the exposed conductive parts: T means their own connection to Earth; N means connection to the earthed point of the source. S means separate neutral and protective conductors; C means their functions are combined. TN-C-S combines them in one part and separates them in another.' },
];

export function termsInDefinition(term: string, definition: string) {
  const visible = definition.replace(/\s*\(see (?:BS EN [\d-]+|Figure [\d.]+|Appendix \d+ Figure \w+)\)/gi, '');
  return abbreviationHelp.filter(item => new RegExp(item.pattern, item.pattern.includes('cpc') ? 'i' : '').test(`${term} ${visible}`));
}

export const learningNotes: Record<string, string> = {
  'Circuit protective conductor (cpc)': 'Follow the connection: equipment → circuit protective conductor → main earthing terminal. The earthing conductor continues from that terminal to the earth electrode or other means of earthing.',
  'Earthing conductor': 'Follow the connection: main earthing terminal → earthing conductor → earth electrode or other means of earthing. The circuit protective conductor connects the equipment to the main earthing terminal.',
  'Exposed-conductive-part': 'For example, the accessible metal case of electrical equipment may become live if its insulation fails. “Exposed” here describes a conductive equipment part, not an intentionally live bare wire.',
  'Extraneous-conductive-part': 'For example, a metal service pipe entering a building may introduce Earth potential. A metal object is not automatically extraneous: its ability to introduce a potential is what matters.',
  'Overcurrent': 'This is the broader term. An overload occurs in an electrically sound circuit; a short-circuit current results from a fault between live conductors.',
};
