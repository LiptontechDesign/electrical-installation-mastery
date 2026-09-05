// These options target specific confusions. Other questions keep their existing
// choices until an equally specific alternative has been authored.
export const conceptDistractors: Record<string, string[]> = {
  'What charge does each subatomic particle carry?': [
    'Protons are negative, neutrons are neutral and electrons are positive',
    'Protons are positive, neutrons are negative and electrons are neutral',
    'Protons and electrons are positive; only neutrons are neutral',
  ],
  'Where are protons, neutrons and electrons found in an atom?': [
    'Electrons and neutrons are in the nucleus; protons occupy the surrounding region',
    'Protons and electrons are in the nucleus; neutrons occupy the surrounding region',
    'All three types of particle are found only in the nucleus',
  ],
  'Which particles are most directly involved in ordinary electrical conduction?': ['Protons', 'Neutrons', 'Whole metal nuclei'],
  'Why is copper a good electrical conductor?': [
    'Its protons move from one end of the conductor to the other',
    'Its neutrons transfer electrical charge between atoms',
    'Its outer electrons remain fixed to individual atoms',
  ],
  'Do individual electrons move through a cable as quickly as the electrical effect?': [
    'Yes. An individual electron must reach the appliance before it can respond',
    'Yes. Electron drift and signal propagation are the same process and speed',
    'No. Electrons do not move at all when a steady current flows',
  ],
  'How does conventional current direction compare with electron movement?': [
    'It is always the same as the average electron drift direction',
    'It is at right angles to the average electron drift direction',
    'It has no defined relationship to charge movement',
  ],
  'What should you start with?': [
    'One detector reading directly over the proposed drilling point',
    'The live-cable mode only, with no review of drawings or visible clues',
    'A single scan, treating a clear indication as proof that no service is present',
  ],
};
