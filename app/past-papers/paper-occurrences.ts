// Related question identifiers in the public copies, not official answer keys.
// Repeated concepts share one independently written study question and solution.
export const paperOccurrences: Record<string, Record<string, string>> = {
  'c1-2012-08': {
    'emergency-switching': 'Q3(c)(ii)',
    'periodic-inspection': 'Q1(a)(i)', 'licence-scope': 'Q1(a)(ii)', 'regulatory-roles': 'Q1(b)', 'office-demand': 'Q2',
    'power-energy': 'Q3(a)', 'wattmeter': 'Q3(b)', 'pfc-placement': 'Q3(c)(i), Q5(c)', 'bathrooms': 'Q3(c)(iii)', 'ppe-tools': 'Q3(c)(iv)', 'power-factor-quality': 'Q3(d)(i)', 'tariff-reasoning': 'Q3(d)(ii–iii)',
    'starter-selection': 'Q4(a)', 'star-delta-starter': 'Q4(b)', 'star-delta-relations': 'Q4(c)', 'reverse-motors': 'Q4(d)', 'slip-torque': 'Q4(e)', 'pfc-methods': 'Q5(a)', 'single-phase-capacitors': 'Q5(b)',
  },
  'c1-2012-11': {
    'electrodes': 'Q1(a)(i), Q4(b–c)', 'protective-devices': 'Q1(a)(ii)', 'ring-radial-spur': 'Q1(a)(iii)', 'earthing-bonding': 'Q1(b), Q4(a)', 'wiring-system': 'Q1(c)', 'four-storey-design': 'Q2',
    'power-factor-quality': 'Q3(a–b)', 'pfc-methods': 'Q3(c)', 'single-phase-capacitors': 'Q3(d)', 'insulation-test': 'Q4(d)', 'three-phase-advantages': 'Q5(a)', 'lighting-effects': 'Q5(b)', 'standby-generator': 'Q5(c)', 'motor-current': 'Q5(d)',
  },
  'c1-2013-03': {
    'periodic-inspection': 'Q1(a–b)', 'electrode-test': 'Q1(c)', 'starter-selection': 'Q2(a–b)', 'star-delta-starter': 'Q2(c)', 'protective-devices': 'Q3(a)(i)', 'ring-radial-spur': 'Q3(a)(ii)', 'single-phase-capacitors': 'Q3(b)', 'standby-generator': 'Q3(c), Q5(a)',
    'transformer-principle': 'Q4(a–b)', 'transformer-example': 'Q4(c) · clarified training data', 'dc-commutator': 'Q5(b)', 'motor-faults': 'Q5(c)', 'surges-lightning': 'Q5(d)',
  },
  'c1-2016-04': {
    'series-parallel': 'Q1(i)', 'absolute-resistance': 'Q1(ii)', 'protective-devices': 'Q1(iii)', 'series-lamps': 'Q1(iv)', 'conductor-resistance': 'Q1(v, xiii)', 'electrodes': 'Q1(vi)', 'supply-characteristics': 'Q1(vii, xv–xvi)', 'motor-faults': 'Q1(viii), Q5(c)', 'lighting-effects': 'Q1(ix), Q4(a)',
    'insulation-test': 'Q1(x)', 'periodic-inspection': 'Q1(xi)', 'bathrooms': 'Q1(xii, xx)', 'cable-selection': 'Q1(xiv)', 'basic-fault-protection': 'Q1(xvii–xviii)', 'initial-verification': 'Q1(xix)',
    'starter-selection': 'Q2(a)', 'dol-starter': 'Q2(b)', 'three-phase-advantages': 'Q2(c)', 'wiring-system': 'Q2(d)', 'four-storey-design': 'Q3(a)', 'three-phase-energy': 'Q3(b)', 'office-demand': 'Q3(c)', 'power-factor-quality': 'Q4(b)', 'single-phase-capacitors': 'Q4(c)', 'standby-generator': 'Q5(a)', 'dc-commutator': 'Q5(b)', 'surges-lightning': 'Q5(d)',
  },
  'c1-2022-05': {
    'voltage-regulation': 'Q3(f)',
    'supply-characteristics': 'Q1.1', 'protective-devices': 'Q1.2, Q1.6, Q3(a)(iv), Q3(b)', 'earthing-bonding': 'Q1.3, Q1.16', 'star-delta-relations': 'Q1.4, Q3(d)', 'ppe-tools': 'Q1.5', 'cable-materials': 'Q1.7, Q2(d)', 'motor-speed': 'Q1.8, Q1.20, Q5(f)',
    'voltage-drop': 'Q1.9, Q1.12', 'pfc-methods': 'Q1.10, Q3(b) · correction alternatives, Q4(c)', 'pfc-placement': 'Q1.11, Q3(d–e) · PFC diagram/steps', 'phase-sequence': 'Q1.17', 'surges-lightning': 'Q1.18', 'elcb-terminology': 'Q1.19', 'licence-scope': 'Q2(a)', 'certificates': 'Q2(b)', 'test-results-review': 'Q2(c)', 'generator-cable': 'Q2 · generator cable scenario',
    'power-energy': 'Q3(a)(i)', 'resistance-impedance': 'Q3(a)(ii)', 'safe-isolation': 'Q3(a)(iii)', 'ct-power': 'Q3(c)', 'power-factor-quality': 'Q3 · demerits, Q4(a–b)', 'three-phase-compensation': 'Q3 · 100 kW PFC case', 'ahu-compensation': 'Q4(d)', 'tariff-reasoning': 'Q4(e)', 'starter-selection': 'Q5(a–b)', 'motor-relays': 'Q5(c)', 'motor-faults': 'Q5(d)', 'motor-types': 'Q5(e)',
  },
  'c1-2023-09': {
    'licence-progression': 'Q1.6',
    'motor-commissioning': 'Q1.14',
    'regulatory-roles': 'Q1.1', 'licence-scope': 'Q1.2, Q1.6', 'ppe-tools': 'Q1.3, Q1.11', 'safe-isolation': 'Q1.4, Q5(e)', 'power-factor-quality': 'Q1.5, Q1.7', 'star-delta-relations': 'Q1.8–10', 'glands-armour': 'Q1.12', 'tariff-reasoning': 'Q1.13, Q2 · bill scenario', 'motor-faults': 'Q1.14', 'pme-neutral': 'Q1.15', 'pfc-placement': 'Q1.16, Q1.19', 'voltage-drop': 'Q1.17', 'pfc-methods': 'Q1.18', 'protective-devices': 'Q1.20, Q4(e–f), Q5(g)',
    'cable-materials': 'Q2(b–c)', 'insulation-test': 'Q2(d)', 'cable-selection': 'Q2 · chiller table scenario', 'transformer-demand': 'Q3(a)', 'vfd': 'Q3(b)', 'motor-types': 'Q3(c)', 'starter-selection': 'Q3 · booster-pump starting', 'motor-speed': 'Q3 · booster-pump speed', 'slip-torque': 'Q3 · slip', 'enclosures': 'Q4(a,c)', 'earthing-bonding': 'Q4(b)', 'loop-acceptance': 'Q4(d)', 'earthing-systems': 'Q4 · TN-C-S/TT', 'protective-conductor-sizing': 'Q4(g)', 'electrodes': 'Q4(h)', 'power-energy': 'Q5(a)', 'four-storey-design': 'Q5(b)', 'certificates': 'Q5(c)', 'periodic-inspection': 'Q5(d)', 'surges-lightning': 'Q5(f)', 'cold-store-diagram': 'Q5(h)',
  },
  'c1-2025-05': {
    'generator-response': 'Q1.3', 'equipment-ratings': 'Q2(c)', 'motor-commissioning': 'Q1.15',
    'power-energy': 'Q1.1', 'protective-conductor-sizing': 'Q1.2, Q3(d)', 'transformer-principle': 'Q1.4', 'power-factor-quality': 'Q1.5, Q1.18, Q4(a–b)', 'surges-lightning': 'Q1.6', 'protective-devices': 'Q1.7, Q1.13', 'motor-speed': 'Q1.8, Q1.10, Q5(h)', 'motor-types': 'Q1.9, Q5(d)', 'star-delta-relations': 'Q1.11', 'pfc-methods': 'Q1.12, Q4(c)', 'earthing-bonding': 'Q1.14, Q3(a–c)', 'motor-faults': 'Q1.15, Q5(i)', 'elcb-terminology': 'Q1.16', 'cable-selection': 'Q1.17', 'glands-armour': 'Q1.19, Q4(i)', 'incident-fire': 'Q1.20',
    'licence-scope': 'Q2(a–b)', 'safe-isolation': 'Q2(d)', 'enclosures': 'Q2(e)', 'cable-materials': 'Q2(f), Q4(f)', 'phase-sequence': 'Q2(g–i)', 'periodic-inspection': 'Q2(j)', 'earthing-systems': 'Q3(e)', 'pme-neutral': 'Q3(f–g), Q3(j–k)', 'loop-acceptance': 'Q3(h)', 'electrodes': 'Q3(i)', 'three-phase-compensation': 'Q4(d)', 'pfc-placement': 'Q4(e)', 'insulation-test': 'Q4(g–h)', 'starter-selection': 'Q5(a–b)', 'motor-relays': 'Q5(c)', 'slip-torque': 'Q5(e–g)',
  },
  'c1-2025-06': {
    'motor-commissioning': 'Q1.19',
    'licence-scope': 'Q1.1', 'power-factor-quality': 'Q1.2, Q4(a–b)', 'star-delta-relations': 'Q1.3, Q1.12–13, Q3(f)', 'phase-sequence': 'Q1.4', 'motor-speed': 'Q1.5, Q1.15, Q2(e)', 'protective-devices': 'Q1.6, Q3(b)', 'cable-selection': 'Q1.7, Q2(g)', 'vfd': 'Q1.8', 'elcb-terminology': 'Q1.9', 'loop-acceptance': 'Q1.10, Q5(a)', 'cable-materials': 'Q1.11, Q2(f)', 'pfc-placement': 'Q1.14', 'motor-faults': 'Q1.16, Q1.19', 'insulation-test': 'Q1.17, Q2(h–i)', 'slip-torque': 'Q1.18', 'tariff-reasoning': 'Q1.20',
    'dc-commutator': 'Q2(a–b)', 'starter-selection': 'Q2(c)', 'motor-types': 'Q2(d)', 'power-factors': 'Q3(a)', 'safe-isolation': 'Q3(c)', 'lighting-effects': 'Q3(d)', 'motor-relays': 'Q3(e)(i–ii)', 'pme-neutral': 'Q3(e)(iv)', 'single-phase-angle': 'Q3(g)', 'pfc-methods': 'Q4(c)', 'transformer-demand': 'Q4(d)', 'earthing-systems': 'Q5(b)', 'surges-lightning': 'Q5(c)', 'cold-store-diagram': 'Q5(d)',
  },
  'c2-2012-11': {
    'tender-notice': 'Q1(a)', 'street-equipment': 'Q1(b–c)', 'voltage-classes': 'Q1(e)', 'lighting-layout': 'Q2(a) · plan unavailable', 'earthing-bonding': 'Q3(a), Q4(b)', 'insulation-test': 'Q3(b)', 'loop-acceptance': 'Q3(b)', 'continuity-polarity': 'Q3(b)', 'electrode-test': 'Q3(c)', 'electrodes': 'Q3(d)', 'shock-first-aid': 'Q4(a)(i)', 'incident-fire': 'Q4(a)(ii–iii)', 'ring-radial-spur': 'Q5(a)', 'wiring-system': 'Q1(d), Q2(b), Q5(b) · containment capacity', 'regulatory-roles': 'Q5(c)',
  },
  'c2-2015-01': {
    'licence-scope': 'Q1(a)', 'series-parallel': 'Q1(b), Q1(c)(iv)', 'regulatory-roles': 'Q1(c), Q4(b)', 'protective-devices': 'Q1(d)', 'domestic-supply': 'Q2(a)', 'initial-verification': 'Q2(b)', 'continuity-polarity': 'Q2(b)', 'insulation-test': 'Q2(b)', 'electrodes': 'Q2(b)', 'electrode-test': 'Q2(c)', 'wiring-system': 'Q3(a)', 'switching-circuits': 'Q3(b)', 'cable-selection': 'Q3(c–d)', 'shock-first-aid': 'Q4(a)', 'certificates': 'Q5(a–b)', 'new-connection': 'Q5(c)',
  },
};
