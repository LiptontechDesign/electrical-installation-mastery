import definitions from './definitions.json';
import installation from './definition-enrichment-installation.json';
import conductors from './definition-enrichment-conductors.json';
import earthing from './definition-enrichment-earthing.json';
import protection from './definition-enrichment-protection.json';
import voltage from './definition-enrichment-voltage.json';
import inspection from './definition-enrichment-inspection.json';

type CurrentGuide = {
  printedPages: string;
  pdfPages: string;
  note: string;
};

type Enrichment = {
  id: string;
  meaning: string;
  studyNote: string;
  distinction?: string;
  currentGuide?: CurrentGuide;
};

const enrichment = [
  ...installation,
  ...conductors,
  ...earthing,
  ...protection,
  ...voltage,
  ...inspection,
] as Enrichment[];

const byId = new Map(enrichment.map(item => [item.id, item]));

export const enrichedDefinitions = definitions.map(entry => {
  const extra = byId.get(entry.id);
  if (!extra) throw new Error(`Missing definition enrichment: ${entry.id}`);
  return { ...entry, ...extra };
});

export type EnrichedDefinition = (typeof enrichedDefinitions)[number];

export function definitionSearchText(entry: EnrichedDefinition) {
  return [
    entry.term,
    ...entry.aliases,
    entry.category,
    entry.definition,
    entry.meaning,
    entry.studyNote,
    entry.distinction ?? '',
    entry.currentGuide?.note ?? '',
  ].join(' ');
}
