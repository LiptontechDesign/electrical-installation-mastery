export const diagrams: Record<string, { height: number; alt: string; caption: string }> = {
  "domestic-supply": {
    "height": 580,
    "alt": "Supply service protection feeds meter, main isolator and consumer unit. Separate lighting, socket and appliance RCBOs supply final circuits. CPCs and bonding connect to the main earthing terminal and assessed means of earthing.",
    "caption": "Single-phase distribution with separate final-circuit protection."
  },
  "four-storey": {
    "height": 585,
    "alt": "Three-phase intake feeds a main switchboard with separately protected submains to ground, first, second and third floor distribution boards. Each board supplies lighting, socket and dedicated equipment circuits with neutral and CPC provisions.",
    "caption": "Protected floor submains and separate final circuits."
  },
  "cold-store": {
    "height": 800,
    "alt": "Stated 120 A TPN incomer feeds protected ground, first and second floor boards. Ground has 400 W lighting; first has 12 kW three-phase cold store, lighting and ring; second has lighting, ring, three separate 4 kW autoclaves and separate AC1 and AC2 circuits.",
    "caption": "One-line distribution structure for the stated building loads."
  },
  "earthing-systems": {
    "height": 790,
    "alt": "TN-S has separate neutral and PE throughout. TN-C-S uses a supply PEN split into separate N and PE at the designated point. TT has a consumer electrode independent of the source electrode. TN-C combines neutral and protective functions in a PEN throughout the relevant portion.",
    "caption": "Identify the earthing arrangement before assessing fault protection."
  },
  "electrode-test": {
    "height": 570,
    "alt": "Tester E lead connects to electrode under test, P to a potential probe between E and remote current electrode C. Reposition P and compare results to establish a stable region. Safe isolation is required before disconnecting a protective earthing connection.",
    "caption": "Three-terminal test arrangement; probe spacing must suit the site."
  },
  "dol": {
    "height": 550,
    "alt": "Power flows through short-circuit protection, K1 contactor and overload to the motor. Control flows through NC Stop and overload contacts, then parallel NO Start and K1 auxiliary contacts, then K1 coil. The holding contact cannot bypass Stop or overload.",
    "caption": "Functional control schematic with a protected holding circuit."
  },
  "star-delta": {
    "height": 560,
    "alt": "Star supplies U1 V1 W1 and links U2 V2 W2. Delta joins U1/W2 to L1, V1/U2 to L2 and W1/V2 to L3, so each winding lies between two lines. Balanced star and delta line/phase relationships are stated.",
    "caption": "Terminal connections and balanced line/phase relationships."
  },
  "star-delta-control": {
    "height": 725,
    "alt": "NC Stop and overload enable every rung. Start with KM auxiliary holding energises main contactor and timer. Star KY needs KM NO, timer NC and delta KD NC; delta KD needs KM NO, timer NO and star KY NC. Transition must break star before making delta, with mechanical and electrical interlocks.",
    "caption": "Main, star and delta conditions with a deliberate transition interval."
  },
  "power-triangle": {
    "height": 740,
    "alt": "Before correction the power triangle has active P and reactive Q1. After correction P is unchanged and Q2 equals Q1 minus capacitor Qc, reducing apparent S. The capacitor bank is in a separately protected parallel branch, not in series with the motor.",
    "caption": "Keep P constant, subtract capacitor kVAr from Q and recalculate S."
  },
  "switching": {
    "height": 595,
    "alt": "Line connects to the common of the first two-way switch. Its two travellers pass through a four-terminal intermediate switch to the travellers of the second two-way switch. The second common feeds the lamp, which returns to neutral. The intermediate crossing has no electrical junction. CPC continuity is required.",
    "caption": "Two changeover switches with an intermediate switch between them."
  },
  "wattmeter": {
    "height": 605,
    "alt": "Wattmeter current input is in series with the selected phase load and voltage input is across that phase and neutral. Repeat with an appropriately rated selector for each phase of a sufficiently steady four-wire load and sum the three readings. Multiply by three only for a balanced steady load.",
    "caption": "The two inputs measure corresponding phase voltage and current."
  },
  "lightning": {
    "height": 750,
    "alt": "Roof air terminations connect through down conductors and test joints to the earth-termination system. Designed bonding or separation controls dangerous sparking; internal SPDs are coordinated with the overall protection. The drawing is a component overview, not a dimensioned design.",
    "caption": "Air termination, down conductors, earth termination and bonding/separation."
  }
};
