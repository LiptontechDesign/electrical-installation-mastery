import type { SourceReference } from './overview-models';

export const c1SourceReferences: SourceReference[] = [
  {
    id: 'epra-c1-competencies', sourceType: 'epra', title: 'Assessment Areas for Electrical Worker Written & Oral Interviews',
    organisation: 'Energy and Petroleum Regulatory Authority (EPRA)', section: 'Class C1 areas of competency',
    authority: 'primary-current', status: 'verified', kenyaStatus: 'kenya-verified',
    url: 'https://www.epra.go.ke/sites/default/files/2025-06/Written%20%26%20Oral%20Interviews%20Areas%20of%20Competency.pdf',
    verification: { evidence: 'Official EPRA competency document used for the C1 knowledge-layer audit. C1 includes the C2 foundation plus three-phase systems, three-phase power/design, power-factor correction, three-phase machines/motors, protection and inspection/testing.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'course-kenya-240-415-50', sourceType: 'course', title: 'Electrical Installation Mastery — Kenya worked-example convention',
    section: 'C1 calculation convention: 240/415 V, 50 Hz unless a question states otherwise', authority: 'supporting-explanation',
    status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Course convention deliberately uses 240 V line-to-neutral, 415 V line-to-line and 50 Hz for C1 worked examples. Real installations still require actual supply verification.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'course-c1-three-phase', sourceType: 'course', title: 'Electrical Installation Mastery — C1 Three-Phase Fundamentals and Power',
    section: 'C1 fundamentals/power learning sections and lesson guides', authority: 'supporting-explanation', status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current C1 fundamentals and power lessons were audited for line/phase values, 120-degree phase displacement, star/delta, balanced/unbalanced loading, neutral current and three-phase calculations.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'course-c1-distribution', sourceType: 'course', title: 'Electrical Installation Mastery — C1 Three-Phase Distribution and Installation',
    section: 'Safe isolation, phase sequence, boards, feeders, phase allocation and installation projects', authority: 'supporting-explanation', status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current C1 distribution learning sections and associated board/submain/project lessons were audited for the Overview.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'course-c1-design', sourceType: 'course', title: 'Electrical Installation Mastery — C1 Three-Phase Design',
    section: 'Building demand, cable sizing, fault duty, neutral, voltage drop and protective-device selection', authority: 'supporting-explanation', status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current C1 design lessons plus the preserved C2 design bridge logic were audited so the three-phase workflow extends rather than replaces the C2 design method.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'course-c1-earthing', sourceType: 'course', title: 'Electrical Installation Mastery — C1 Small-Commercial Earthing and Protection',
    section: 'Earthing, submain fault paths, SWA/CPC application and protection calculations', authority: 'supporting-explanation', status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current C1 earthing lessons were audited together with the C2 ADS/Zs/CPC foundation and SWA teaching.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'course-c1-pfc', sourceType: 'course', title: 'Electrical Installation Mastery — C1 Power Factor Correction',
    section: 'Power triangle, correction sizing and APFC architecture', authority: 'supporting-explanation', status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current PF lesson/video and the preserved APFC bridge were audited for correction sizing, sensing, stepped banks and harmonics cautions.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'schneider-pfc', sourceType: 'specialist', title: 'Power Factor Correction', organisation: 'Schneider Electric — Electrical Installation Guide',
    section: 'Principles, capacitor sizing and compensation equipment', authority: 'supporting-explanation', status: 'needs-verification', kenyaStatus: 'check-kenyan-requirement',
    url: 'https://www.electrical-installation.org/enwiki/Power_Factor_Correction',
  },
  {
    id: 'course-c1-motors', sourceType: 'course', title: 'Electrical Installation Mastery — C1 Three-Phase Motors and Control',
    section: 'Induction-motor principles, nameplates, DOL, star-delta, soft starters, VFDs and protection-layer assignment', authority: 'supporting-explanation', status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current motor lessons, promoted motor/nameplate/DOL/MPCB/soft-starter videos and preserved motor-protection bridge were audited for C1-07/C1-08.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'eca-motors-historical', sourceType: 'eca-guide', title: 'Guide to the IET Wiring Regulations', organisation: 'Electrical Contractors’ Association',
    edition: '17th Edition regulations · Amendment 1:2011', section: 'Three-phase machine and motor-circuit explanatory material', authority: 'historical-context', status: 'historical', kenyaStatus: 'check-kenyan-requirement', bookId: 'iet-wiring-guide',
  },
  {
    id: 'course-c1-testing', sourceType: 'course', title: 'Electrical Installation Mastery — C1 Three-Phase Testing and Periodic Inspection',
    section: 'Phase sequence, three-phase measurement, inspection findings and periodic evidence', authority: 'supporting-explanation', status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current C1 testing sections were audited with the complete C2 initial-verification sequence; periodic detail is deliberately kept source-limited until a current Guidance Note 3 source is integrated.', verifiedAt: '2026-09-13' },
  },
  {
    id: 'iet-gn3-periodic', sourceType: 'specialist', title: 'IET Guidance Note 3 — Inspection & Testing', organisation: 'IET',
    section: 'Current periodic inspection/testing edition required for detailed coding and periodic procedure', authority: 'current-technical', status: 'needs-verification', kenyaStatus: 'bs7671-technical-baseline',
  },
  {
    id: 'course-c1-faults', sourceType: 'course', title: 'Electrical Installation Mastery — C1 Three-Phase Distribution Fault Diagnosis',
    section: 'Distribution faults, motor/control symptoms and thermal evidence', authority: 'supporting-explanation', status: 'verified', kenyaStatus: 'check-kenyan-requirement',
    verification: { evidence: 'Current C1 fault section and the retained C2 evidence-led fault workflow were audited for three-phase distribution and motor/control diagnosis.', verifiedAt: '2026-09-13' },
  },
];
