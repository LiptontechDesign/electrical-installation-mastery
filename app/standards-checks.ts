export type StandardsCheck = { prompt: string; options: string[]; answer: number; feedback: string[] };

// Fictional evidence-selection tasks. Acceptance values must come from the
// actual applicable documents; no numerical regulation is inferred here.
export const standardsChecks: Record<string, StandardsCheck> = {
  'bathroom-sockets': {
    prompt: 'Which statement correctly applies to an ordinary 230 V 13 A socket-outlet in a bathroom?',
    options: ['It may be anywhere if it has a cover.', 'It may be in zone 2 when protected by an RCD.', 'It must be at least 3 m horizontally from the boundary of zone 1.', 'It is treated the same as a compliant shaver supply.'],
    answer: 2,
    feedback: ['A cover does not remove the Section 701 location limit.', 'RCD protection does not remove the socket location limit.', 'Correct. Measure horizontally from the boundary of zone 1.', 'A shaver supply is a different, limited-purpose accessory.'],
  },
  'kitchen-placement': {
    prompt: 'Which statement correctly describes a socket position near a kitchen sink?',
    options: ['BS 7671 sets a universal 300 mm legal distance.', 'BS 7671 gives no fixed distance; IET guidance recommends at least 300 mm from the sink edge.', 'Measure 300 mm from the sink centreline.', 'Any position is acceptable when an RCD is fitted.'],
    answer: 1,
    feedback: ['The 300 mm figure is guidance, not a fixed BS 7671 distance.', 'Correct. Measure from the sink edge and still assess splash, heat and leads.', 'The relevant guidance measures from the sink edge.', 'RCD protection does not make every position suitable.'],
  },
  'accessory-height': {
    prompt: 'Which statement correctly describes general switch and socket mounting height?',
    options: ['BS 7671 sets 450–1200 mm for every installation.', 'All sockets must be exactly 450 mm above the floor.', 'Height is chosen only from the electrician’s preference.', 'BS 7671 has no single general height; Approved Document M gives 450–1200 mm for relevant new dwellings in England.'],
    answer: 3,
    feedback: ['The 450–1200 mm band comes from accessibility guidance with a defined scope.', 'The guidance is a band, not one exact socket height.', 'Project requirements, accessibility and intended use must be considered.', 'Correct. Keep the source and its scope attached to the number.'],
  },
  'fault-protection': {
    prompt: 'A calculated Zs is lower than a value copied from an old worksheet. What is still needed before accepting the comparison?',
    options: ['Only the worksheet author’s signature.', 'The actual protective device, applicable edition and limit, disconnection requirement and temperature basis.', 'Only confirmation that Ze was included.', 'Only a functional test of the connected load.'],
    answer: 1,
    feedback: ['A signature does not establish which limit or conditions were used.', 'Correct. A numerical comparison is meaningful only when its source and conditions match the circuit.', 'Including Ze is necessary for the model but does not validate the acceptance criterion.', 'Operation of the load does not validate the protective-device comparison.'],
  },
  residual: {
    prompt: 'An RCCB test button operates correctly. Which conclusion is supported by this observation alone?',
    options: ['The complete installation has passed verification.', 'The circuit’s overload protection has been tested.', 'The device responded to its built-in test; installation tests and protection checks remain separate.', 'The circuit protective conductor has been proved continuous.'],
    answer: 2,
    feedback: ['One device check cannot establish all circuit connections, insulation or protective conditions.', 'An RCCB has no integral overcurrent protection. The button does not test a separate overload device.', 'Correct. Keep the observed function separate from the wider verification evidence.', 'The button does not measure protective-conductor continuity.'],
  },
  'cable-design': {
    prompt: 'A designer has established Ib ≤ In ≤ Iz for the revised cable route. What has been established?',
    options: ['One overload coordination condition; voltage drop, fault protection and other design checks remain.', 'Every cable-design requirement has been satisfied.', 'Any protective device with that current rating will be suitable.', 'The cable size is suitable regardless of installation method.'],
    answer: 0,
    feedback: ['Correct. A necessary design relationship is not a complete circuit verification.', 'The inequality does not contain route voltage drop, breaking capacity or disconnection behaviour.', 'Time-current behaviour, breaking capacity and the actual application also matter.', 'Installation method changes heat dissipation and therefore cable capacity.'],
  },
  'safe-testing': {
    prompt: 'A proposed live measurement and a planned dead-test method could answer the same question. What should guide the method selection?',
    options: ['Use the live method because it produces a reading faster.', 'Prefer the least hazardous effective method, with suitable equipment and the required safe conditions.', 'Use whichever method the last video demonstrated.', 'Use an ordinary multimeter without checking its category rating.'],
    answer: 1,
    feedback: ['Speed alone does not justify exposing someone to live conductors.', 'Correct. Establish what evidence is needed and avoid unnecessary live testing.', 'The actual circuit and investigation conditions determine whether a demonstrated method is suitable.', 'Test equipment must suit the system and foreseeable transient conditions.'],
  },
  verification: {
    prompt: 'A circuit works and the recorded tests pass, but a relevant inspection defect remains unresolved. What can be concluded?',
    options: ['The passing tests automatically override the inspection defect.', 'The circuit may be described as fully verified if the defect is mentioned verbally.', 'The inspection finding must be evaluated and resolved or formally handled under the applicable procedure before claiming the relevant verification is complete.', 'The defect may be ignored when the connected load operates.'],
    answer: 2,
    feedback: ['Inspection and tests provide complementary evidence; one cannot erase the other.', 'Verbal mention does not replace the required decision, corrective action and documentation.', 'Correct. Records must connect the defect, decision, corrective action and any required repeat verification.', 'Operation does not prove protective measures or workmanship are satisfactory.'],
  },
  'multiple-sources': {
    prompt: 'Grid-mode fault protection has been checked. The inverter can also supply the building in island mode. What follows?',
    options: ['Check the earthing, fault-current capability and protective response in island mode using the actual design and product data.', 'Reuse the grid-mode conclusion because the socket voltage is nominally the same.', 'Check only that the lights remain on after changeover.', 'Assume the inverter always produces the same fault current as the grid.'],
    answer: 0,
    feedback: ['Correct. Each operating mode can change the conditions on which protection depends.', 'Similar voltage does not imply the same available fault current or earthing arrangement.', 'Functional continuity does not establish fault protection.', 'Inverter fault-current behaviour depends on the actual equipment and system design.'],
  },
};
