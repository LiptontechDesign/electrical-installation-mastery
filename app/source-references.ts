import type { SourceReference } from './overview-models';
import { getBook, type Reading } from './books-data';

export const sourceReferences: SourceReference[] = [
  {
    id: 'course-vocabulary', sourceType: 'course', title: 'Electrical Installation Mastery — preserved course vocabulary',
    section: 'Existing knowledge graph and glossary', authority: 'supporting-explanation',
    status: 'needs-verification', kenyaStatus: 'check-kenyan-requirement',
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
