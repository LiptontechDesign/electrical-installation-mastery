// Guided exploration of the existing models; no scores or assessment state.
export const simulationActivities = [
  {
    "id": "rcd",
    "label": "Current balance",
    "task": "Add an earth fault and set the protective-path current to 40 mA. Compare all three paths before protective operation.",
    "explanation": "The two return paths total 2.040 A: 2.000 A in neutral and 0.040 A in the protective path. The protective path is outside the sensor. Current balance explains what the RCD senses; operating performance requires its own assessment."
  },
  {
    "id": "cable",
    "label": "Cable capacity",
    "task": "Keep the design current at 27 A. Compare the reference route with the thermally restricted route; retain the model’s 32 A device.",
    "explanation": "This model checks design current ≤ device rating ≤ installed cable capacity. Here 27 ≤ 32, but 32 exceeds 30 A. Reconsider the route, conductor selection and protection together; passing this relationship alone would still not complete a real circuit design."
  },
  {
    "id": "voltage-drop",
    "label": "Voltage drop",
    "task": "Set 27 A and compare route lengths of 30 m and 60 m without changing the route condition.",
    "explanation": "Use coefficient × current × route length / 1,000 to obtain volts. At 60 m, 4.4 × 27 × 60 / 1,000 = 7.128 V. This predicts the changed drop; it does not by itself prove that the installation meets every design requirement."
  },
  {
    "id": "motor",
    "label": "Motor starter",
    "task": "Run the starter model, remove the supply, then restore it with Start released. Compare this with the failed-holding-contact case.",
    "explanation": "The energized contactor closes its auxiliary holding contact during normal running. Loss of supply drops the contactor out and opens that contact. The model therefore needs a new Start command; actual machinery restart prevention must be assessed against its own control and safety design."
  }
];
