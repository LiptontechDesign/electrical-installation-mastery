import type { SourceReference } from './overview-models';

export const c204SourceReferences: SourceReference[] = [
  {
    id: 'course-c2-cables', sourceType: 'course', title: 'Electrical Installation Mastery — C2 Cable Systems, Containment and Installation Methods',
    section: 'Module 04 learning sections and lesson guides', authority: 'supporting-explanation',
    status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current Module 04 learning sections and the linked cable-construction, conduit, tray, trunking and SWA lessons were audited for the C2-04 Overview implementation.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'osg-cable-types', sourceType: 'on-site-guide', title: 'IET On-Site Guide', organisation: 'IET',
    edition: 'Ninth edition, BS 7671:2018+A4:2026', section: 'Appendix C — Cable types and external influences',
    authority: 'current-technical', status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline',
    bookId: 'on-site-guide', printedPage: '163–168',
  },
  {
    id: 'osg-cable-supports', sourceType: 'on-site-guide', title: 'IET On-Site Guide', organisation: 'IET',
    edition: 'Ninth edition, BS 7671:2018+A4:2026', section: 'Appendix D — Supports for cables and wiring systems',
    authority: 'current-technical', status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline',
    bookId: 'on-site-guide', printedPage: '169–176',
  },
  {
    id: 'osg-conduit-trunking', sourceType: 'on-site-guide', title: 'IET On-Site Guide', organisation: 'IET',
    edition: 'Ninth edition, BS 7671:2018+A4:2026', section: 'Appendix E — Conduit and trunking capacities',
    authority: 'current-technical', status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline',
    bookId: 'on-site-guide', printedPage: '177–182',
  },
  {
    id: 'osg-current-capacity-voltage-drop', sourceType: 'on-site-guide', title: 'IET On-Site Guide', organisation: 'IET',
    edition: 'Ninth edition, BS 7671:2018+A4:2026', section: 'Appendix F — Current-carrying capacity and voltage drop',
    authority: 'current-technical', status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline',
    bookId: 'on-site-guide', printedPage: '183–194',
  },
];
