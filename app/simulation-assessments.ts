// These checks assess the explicit book models, not live-work authorisation.
export const simulationActivities = [
  {
    id: 'rcd', label: 'Current balance',
    task: 'Add an earth fault and set the protective-path current to 40 mA. Compare all three paths before protective operation.',
    question: 'In the model of an appliance circuit, 2.040 A passes through line and 2.000 A returns through neutral. What does the 40 mA difference tell the apprentice checking the current paths?',
    choices: [
      'The appliance consumes 40 mA, so less current needs to return to the source.',
      'A 40 mA return path bypasses the sensor; these readings alone do not establish trip time.',
      'The neutral carries 40 mA too much, so the difference is an overload measurement.',
      'The RCD has passed its operating test because a 40 mA difference is displayed.',
    ], answer: 1,
    feedback: [
      'A load transfers energy; it does not consume electric charge. Account for the current returning outside neutral.',
      'Yes. The line–neutral difference identifies residual current in this model, not a completed operating test.',
      'Neutral carries less than line here. Residual-current balance and overload current are different checks.',
      'The display represents current paths before protective operation. It supplies no measured disconnection time.',
    ],
    explanation: 'The two return paths total 2.040 A: 2.000 A in neutral and 0.040 A in the protective path. The protective path is outside the sensor. Current balance explains what the RCD senses; operating performance requires its own assessment.',
  },
  {
    id: 'cable', label: 'Cable capacity',
    task: 'Keep the design current at 27 A. Compare the reference route with the thermally restricted route; retain the model’s 32 A device.',
    question: 'A route change reduces the model cable’s capacity from 50 A to 30 A. The load remains 27 A and the device is rated 32 A. What should the designer conclude about this proposed arrangement?',
    choices: [
      'Accept it because the 27 A load remains below the 30 A cable capacity.',
      'Accept it because the original 50 A table value exceeds the 32 A device rating.',
      'Reassess it because the 32 A device exceeds the cable’s capacity in the revised route.',
      'Accept it if the route is short enough to keep the voltage drop small.',
    ], answer: 2,
    feedback: [
      'That checks the load against the cable but leaves out the protective-device rating.',
      'The original table value does not describe the thermally restricted installation condition.',
      'Yes. The changed route invalidates the capacity relationship even though the expected load has not increased.',
      'A satisfactory voltage drop does not correct an inadequate current-carrying capacity.',
    ],
    explanation: 'This model checks design current ≤ device rating ≤ installed cable capacity. Here 27 ≤ 32, but 32 exceeds 30 A. Reconsider the route, conductor selection and protection together; passing this relationship alone would still not complete a real circuit design.',
  },
  {
    id: 'voltage-drop', label: 'Voltage drop',
    task: 'Set 27 A and compare route lengths of 30 m and 60 m without changing the route condition.',
    question: 'A proposed cable route to a workshop load increases from 30 m to 60 m. Using the model’s unchanged 27 A and 4.4 mV/A/m coefficient, which revision belongs in the voltage-drop calculation?',
    choices: [
      'Increase the calculated drop from about 3.56 V to 7.13 V, then assess the revised design.',
      'Keep the drop at about 3.56 V because the load current has not changed.',
      'Increase the drop to about 14.26 V by doubling both route length and the coefficient.',
      'Reduce the drop to about 1.78 V because the same current is spread over more cable.',
    ], answer: 0,
    feedback: [
      'Yes. With current and coefficient fixed, doubling route length doubles the calculated voltage drop.',
      'Current is only one factor; the greater route length also increases the drop.',
      'This coefficient already accounts for the circuit conductors. Doubling it counts the return path again.',
      'Current is not divided by route length. A longer path produces more drop under the stated assumptions.',
    ],
    explanation: 'Use coefficient × current × route length / 1,000 to obtain volts. At 60 m, 4.4 × 27 × 60 / 1,000 = 7.128 V. This predicts the changed drop; it does not by itself prove that the installation meets every design requirement.',
  },
  {
    id: 'motor', label: 'Motor starter',
    task: 'Run the starter model, remove the supply, then restore it with Start released. Compare this with the failed-holding-contact case.',
    question: 'During a simulated conveyor commissioning check, a running three-wire starter loses supply. Supply is restored with Start released and no overload trip. Why does this model remain stopped?',
    choices: [
      'The overload must have tripped, so its reset is the missing restart command.',
      'The holding contact remembers the earlier run command but delays the restart.',
      'The open contactor proves that the entire conveyor installation is safely isolated.',
      'Supply loss opened the holding path; with Start released, the coil circuit is not completed.',
    ], answer: 3,
    feedback: [
      'The scenario specifies no overload trip. Resetting an overload is not the cause of this stopped state.',
      'The holding contact follows the contactor state; it does not store a run command after the coil drops out.',
      'A stopped contactor is not proof of safe isolation. This question concerns control logic, not permission to work.',
      'Yes. Restoring supply makes power available but does not recreate the missing Start or holding path.',
    ],
    explanation: 'The energized contactor closes its auxiliary holding contact during normal running. Loss of supply drops the contactor out and opens that contact. The model therefore needs a new Start command; actual machinery restart prevention must be assessed against its own control and safety design.',
  },
] as const;
