import type { SourceReference } from './overview-models';

export const c205SourceReferences: SourceReference[] = [
  {
    id: 'course-c2-protection', sourceType: 'course', title: 'Electrical Installation Mastery — C2 Faults, Protective Devices, Earthing and ADS',
    section: 'Module 05 learning sections, lesson guides, integrated protective-device videos and authored protection bridges', authority: 'supporting-explanation',
    status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current Module 05 neutral learning sections plus fault, fuse, MCB, RCD, MCCB, earthing, ADS, Zs, selectivity and SPD teaching were audited for the C2-05 Overview implementation.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'osg-protection', sourceType: 'on-site-guide', title: 'IET On-Site Guide', organisation: 'IET',
    edition: 'Ninth edition, BS 7671:2018+A4:2026', section: 'Protection', authority: 'current-technical',
    status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline', bookId: 'on-site-guide', printedPage: '33–60',
  },
  {
    id: 'osg-earthing-bonding', sourceType: 'on-site-guide', title: 'IET On-Site Guide', organisation: 'IET',
    edition: 'Ninth edition, BS 7671:2018+A4:2026', section: 'Earthing and Bonding', authority: 'current-technical',
    status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline', bookId: 'on-site-guide', printedPage: '61–68',
  },
  {
    id: 'osg-rcd-operation', sourceType: 'on-site-guide', title: 'IET On-Site Guide', organisation: 'IET',
    edition: 'Ninth edition, BS 7671:2018+A4:2026', section: 'Operation of RCDs', authority: 'current-technical',
    status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline', bookId: 'on-site-guide', printedPage: '141–144',
  },
  {
    id: 'osg-zs-appendix', sourceType: 'on-site-guide', title: 'IET On-Site Guide', organisation: 'IET',
    edition: 'Ninth edition, BS 7671:2018+A4:2026', section: 'Appendix B — Measured earth fault loop impedance', authority: 'current-technical',
    status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline', bookId: 'on-site-guide', printedPage: '153–162',
  },
];
