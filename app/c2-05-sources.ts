import type { SourceReference } from './overview-models';

export const c205SourceReferences: SourceReference[] = [
  {
    id: 'course-c2-protection', sourceType: 'course', title: 'Electrical Installation Mastery — C2 Faults, Protective Devices, Earthing and ADS',
    section: 'Module 05: overcurrent protection; earth fault, earthing, ADS and residual-current protection; special protection; selection and coordination', authority: 'supporting-explanation',
    status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Four Module 05 learning sections align with canonical lessons, including AFDD course-lIit5k8QVj8 and selective coordination course-V6WR_TBf1AU. Device functions remain distinct; testing procedures remain in C2-08.', verifiedAt: '2026-09-20' },
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
