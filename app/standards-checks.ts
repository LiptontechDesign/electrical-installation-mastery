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
  'termination-quality': {
    prompt: 'Which observation best supports an acceptable accessory termination? ',
    options: ['The connected load operates.', 'The conductors are fully engaged, free from undue strain and enclosed without exposed copper.', 'The faceplate hides the cable entry.', 'The terminal screws were tightened without inspecting conductor position.'],
    answer: 1,
    feedback: ['Operation alone does not reveal loose, strained or exposed conductors.', 'Correct. The connection and enclosure must be assessed together.', 'A faceplate can hide a poor termination; it does not correct one.', 'Tightening without checking engagement can clamp insulation or miss strands.'],
  },
  'ring-final-alteration': {
    prompt: 'What must be established before adding a socket or spur to an existing ring final circuit?',
    options: ['Only that two cables enter the nearest socket.', 'Only that the new socket operates.', 'That the existing circuit and protective arrangements are adequate, followed by inspection and testing of the alteration.', 'That the circuit is labelled as a ring on the consumer unit.'],
    answer: 2,
    feedback: ['Two cables do not prove ring continuity or circuit identity.', 'Operation does not establish continuity or protective conditions.', 'Correct. Existing adequacy and completed-work verification are separate required decisions.', 'A label is useful but is not electrical evidence of the circuit condition.'],
  },
  'outdoor-sockets': {
    prompt: 'Which design statement is correct for a 230 V, 13 A socket intended for outdoor equipment?',
    options: ['A weatherproof lid replaces the need to assess additional protection.', 'A 30 mA RCD within the scope of Regulation 411.3.3 is one requirement; the route, equipment and fault protection still need separate checks.', 'Any indoor socket is suitable when mounted inside a shed.', 'A functional test proves the outdoor circuit is safe.'],
    answer: 1,
    feedback: ['Ingress protection and additional protection address different hazards.', 'Correct. Apply the RCD requirement without losing the other design and verification checks.', 'A shed location does not remove environmental and use considerations.', 'Operation does not establish the protective path, RCD performance or environmental suitability.'],
  },
  'bath-shower-equipment': {
    prompt: 'What should guide the position and selection of equipment for an electric shower?',
    options: ['The nearest convenient wall position alone.', 'RCD protection alone.', 'The bathroom zone, equipment suitability and IP rating, product instructions, circuit protection and isolation arrangement together.', 'Whether the equipment colour matches the room.'],
    answer: 2,
    feedback: ['Convenience cannot replace the Section 701 assessment.', 'RCD protection does not remove zoning and equipment requirements.', 'Correct. Treat the zone and the complete protective arrangement as one coordinated decision.', 'Appearance does not establish electrical suitability.'],
  },
  'swa-support': {
    prompt: 'How should a clipping distance for an SWA cable route be selected?',
    options: ['Use one familiar distance for every SWA size and route.', 'Use the actual cable, route, environment and manufacturer support data so the cable is not damaged or left straining its entries.', 'Clip only at each end when the cable is armoured.', 'Choose the widest spacing that looks straight from a distance.'],
    answer: 1,
    feedback: ['BS 7671 does not give one universal SWA clipping interval.', 'Correct. Support spacing follows the actual mechanical and environmental conditions.', 'Armour does not remove the need for adequate support.', 'Appearance alone does not assess sag, load or strain at glands.'],
  },
};
