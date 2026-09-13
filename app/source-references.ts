import type { SourceReference } from './overview-models';
import { getBook, type Reading } from './books-data';

export const sourceReferences: SourceReference[] = [
  {
    id: 'course-vocabulary', sourceType: 'course', title: 'Electrical Installation Mastery — preserved course vocabulary',
    section: 'Existing knowledge graph and glossary', authority: 'supporting-explanation',
    status: 'needs-verification', kenyaStatus: 'check-kenyan-requirement',
  },
  {
    id: 'course-c2-foundations', sourceType: 'course', title: 'Electrical Installation Mastery — C2 Electrical Foundations',
    section: 'Module 01 lessons, authored recaps and course bridges', authority: 'supporting-explanation',
    status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current Module 01 learning sections, lesson ordering and authored bridge material were audited for the C2-01 Overview implementation.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'epra-c2-competencies', sourceType: 'epra', title: 'Assessment Areas for Electrical Worker Written & Oral Interviews',
    organisation: 'Energy and Petroleum Regulatory Authority (EPRA)', section: 'Class C2 areas of competency',
    authority: 'primary-current', status: 'verified', kenyaStatus: 'kenya-verified',
    url: 'https://www.epra.go.ke/sites/default/files/2025-06/Written%20%26%20Oral%20Interviews%20Areas%20of%20Competency.pdf',
    verification: { evidence: 'Current official EPRA competency PDF rechecked on 2026-09-13; C2 explicitly includes AC/DC, voltage, current, resistance, power, energy, power triangle, basic circuits, diversity/utilization/PF and single-phase calculations.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'eca-c3-load-assessment', sourceType: 'eca-guide', title: 'Guide to the IET Wiring Regulations',
    organisation: 'Electrical Contractors’ Association', edition: '17th Edition regulations · Amendment 1:2011',
    section: 'C3 Load Assessment', authority: 'historical-context', status: 'historical',
    kenyaStatus: 'check-kenyan-requirement', bookId: 'iet-wiring-guide', printedPage: '23–25',
  },
  {
    id: 'eca-c4-design-current', sourceType: 'eca-guide', title: 'Guide to the IET Wiring Regulations',
    organisation: 'Electrical Contractors’ Association', edition: '17th Edition regulations · Amendment 1:2011',
    section: 'C4.3.2 Design Current', authority: 'historical-context', status: 'historical',
    kenyaStatus: 'check-kenyan-requirement', bookId: 'iet-wiring-guide', printedPage: '30',
  },
  {
    id: 'schneider-demand-factors', sourceType: 'specialist', title: 'Estimation of actual maximum kVA demand',
    organisation: 'Schneider Electric — Electrical Installation Guide',
    section: 'Maximum utilization, coincidence and diversity factors', authority: 'supporting-explanation',
    status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    url: 'https://www.electrical-installation.org/enwiki/Diversity_factor',
    verification: { evidence: 'Current Schneider Electrical Installation Guide page rechecked on 2026-09-13; it defines ku and ks and explicitly distinguishes coincidence factor from reciprocal diversity factor.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'osg-demand-diversity', sourceType: 'on-site-guide', title: 'IET On-Site Guide',
    organisation: 'IET', edition: 'Ninth edition, BS 7671:2018+A4:2026',
    section: 'Appendix A — Maximum demand and diversity', authority: 'current-technical',
    status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline', bookId: 'on-site-guide', printedPage: '149–152',
  },
  {
    id: 'osg-safe-testing', sourceType: 'on-site-guide', title: 'IET On-Site Guide',
    organisation: 'IET', edition: 'Ninth edition, BS 7671:2018+A4:2026',
    section: 'Initial testing — safety', authority: 'current-technical', status: 'verified',
    kenyaStatus: 'bs7671-technical-baseline', bookId: 'on-site-guide', printedPage: '123', pdfPage: 125,
    mapping: { status: 'exact', evidence: 'Supplied reader page 125 visually verified as printed page 123 during book integration (osg-verified.png).', verifiedAt: '2026-09-13' },
    verification: { evidence: 'Supplied ninth-edition title/copyright and safety page inspected during book integration.', verifiedAt: '2026-09-13' },
  },
];

export type ResolvedSourceLink =
  | { kind: 'reader'; reading: Reading }
  | { kind: 'external'; url: string }
  | { kind: 'unavailable'; reason: string };

export function safeSourceUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? parsed.href : undefined; }
  catch { return undefined; }
}

/** Bibliography may remain visible when an exact reader jump is unavailable. */
export function resolveSourceLink(source: SourceReference): ResolvedSourceLink {
  const book = source.bookId && getBook(source.bookId);
  if (book && source.mapping?.status === 'exact' && source.mapping.evidence.trim() && source.mapping.verifiedAt &&
      Number.isInteger(source.pdfPage) && source.pdfPage! >= 1 && source.pdfPage! <= book.pages) {
    return { kind: 'reader', reading: { bookId: book.id, title: source.title,
      printed: source.printedPage ?? 'Printed page not identified', pdf: source.pdfPage!, end: source.pdfPage!, purpose: source.section ?? source.title } };
  }
  const url = safeSourceUrl(source.url);
  if (url) return { kind: 'external', url };
  return { kind: 'unavailable', reason: 'An exact reader-page mapping has not been verified.' };
}
