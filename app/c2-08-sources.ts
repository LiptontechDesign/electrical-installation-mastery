import type { SourceReference } from './overview-models';

export const c208SourceReferences: SourceReference[] = [
  {
    id: 'course-c2-testing', sourceType: 'course', title: 'Electrical Installation Mastery — C2 Inspection, Testing and Commissioning',
    section: 'Module 08 learning sections, instrument map, inspection/testing lessons and certification lesson', authority: 'supporting-explanation',
    status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current Module 08 neutral learning sections and the linked continuity, insulation, polarity, earthing, loop/PFC, RCD, functional and certification lessons were audited for the C2-08 Overview implementation.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'osg-initial-verification', sourceType: 'on-site-guide', title: 'IET On-Site Guide', organisation: 'IET',
    edition: 'Ninth edition, BS 7671:2018+A4:2026', section: 'Initial verification and initial testing', authority: 'current-technical',
    status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline', bookId: 'on-site-guide', printedPage: '121–140',
  },
];
