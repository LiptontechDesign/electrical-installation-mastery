import type { OverviewSection, SourceReference } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

export const licensingAuthoritySources: SourceReference[] = [
  {
    id: 'kenya-energy-act-2019',
    sourceType: 'kenya-law',
    title: 'Energy Act, 2019',
    organisation: 'Republic of Kenya / Kenya Law',
    edition: 'Current consolidated text used by the course',
    section: 'Sections 149–151 — electrical workers, contractors and installation work',
    authority: 'primary-current',
    status: 'verified',
    kenyaStatus: 'kenya-verified',
    url: 'https://new.kenyalaw.org/akn/ke/act/2019/1/eng%402022-07-11/source',
    verification: {
      evidence: 'Kenya Law text rechecked 2026-09-13. Sections 149–151 cover electrical-worker certification, contractor licensing, work by persons duly authorised by the Authority, installation certificates before initial connection, periodic inspection/testing and defect remediation.',
      verifiedAt: '2026-09-13',
    },
  },
  {
    id: 'kenya-building-code-2024-electrical',
    sourceType: 'kenya-law',
    title: 'National Building Code, 2024',
    organisation: 'Republic of Kenya / Kenya Law',
    edition: 'Legal Notice No. 47 of 2024',
    section: 'Part XV — Electrical Installations, especially paragraph 312',
    authority: 'primary-current',
    status: 'verified',
    kenyaStatus: 'kenya-verified',
    url: 'https://new.kenyalaw.org/akn/ke/act/ln/2024/47/eng%402024-03-01/source',
    verification: {
      evidence: 'Official National Building Code 2024 electrical-installation provisions rechecked for the course audit. Paragraph 312 references the Energy Act 2019, KS 662, KS 1587, specified KS IEC 60947 and KS IEC 61439 families, KS IEC 62208 and BS 7671 as applicable building-electrical references.',
      verifiedAt: '2026-09-13',
    },
  },
  {
    id: 'iet-conductor-identification-baseline',
    sourceType: 'bs7671',
    title: 'BS 7671:2018 conductor-identification Table 51 corrigendum',
    organisation: 'IET / BSI',
    edition: 'BS 7671:2018 corrigendum, December 2018',
    section: 'Table 51 — identification of conductors',
    authority: 'historical-context',
    status: 'historical',
    kenyaStatus: 'check-kenyan-requirement',
    url: 'https://electrical.theiet.org/media/2065/bs-7671-2018-corrigendum-dec-2018.pdf',
  },
];

const canonicalTerm = (
  id: string,
  term: string,
  standardsMeaning: string,
  plainMeaning: string,
  category: string,
  stageIds: string[],
  sectionIds: string[],
  sourceIds: string[],
  kenyaStatus: PreservedCanonicalTerm['kenyaStatus'],
  options: Partial<PreservedCanonicalTerm> = {},
): PreservedCanonicalTerm => ({
  id,
  term,
  aliases: options.aliases ?? [],
  definition: standardsMeaning,
  category,
  authority: options.authority ?? 'current-standards-meaning',
  editorialStatus: 'reviewed',
  standardsMeaning,
  plainMeaning,
  practicalExample: options.practicalExample,
  notTheSameAs: options.notTheSameAs ?? [],
  relatedTermIds: options.relatedTermIds ?? [],
  sourceIds,
  formulaIds: [],
  stageIds,
  sectionIds,
  lessonIds: [],
  kenyaStatus,
  explainAloud: options.explainAloud,
});

export const licensingAuthorityTerms: PreservedCanonicalTerm[] = [
  canonicalTerm(
    'c2-licence-scope',
    'EPRA Class C2 competency scope',
    'Class C2 covers low-voltage single-phase electrical installation in buildings up to two storeys in height, excluding factories and places designated for public entertainment.',
    'C2 is the complete low-voltage single-phase building-installation competence at the stated EPRA building boundary. The scope statement is a licensing boundary, not a design shortcut.',
    'Licensing',
    ['C2-02'],
    ['c2-02-installation-architecture-drawings-safety'],
    ['epra-c2-competencies'],
    'kenya-verified',
    {
      aliases: ['C2 scope', 'Class C2 scope', 'C2 licence scope'],
      practicalExample: 'A two-storey residential or otherwise permitted building can fall within the stated C2 building scope; a factory does not merely because its circuits are single phase.',
      explainAloud: 'State the C2 supply type, building-height limit and the two explicit EPRA exclusions without adding your own exceptions.',
    },
  ),
  canonicalTerm(
    'c1-licence-scope',
    'EPRA Class C1 competency scope',
    'Class C1 includes every Class C2 competency and adds low-voltage three-phase electrical installation in buildings up to four storeys in height, excluding factories and places designated for public entertainment, together with the additional C1 competency areas stated by EPRA.',
    'C1 is cumulative: retain the whole C2 foundation, then extend it into three-phase distribution, design, small-commercial earthing, power-factor correction, motors and initial/periodic inspection and testing.',
    'Licensing',
    ['C1-01'],
    ['c1-01-three-phase-fundamentals'],
    ['epra-c1-competencies'],
    'kenya-verified',
    {
      aliases: ['C1 scope', 'Class C1 scope', 'C1 licence scope'],
      practicalExample: 'Passing from C2 to C1 does not retire single-phase competence: a C1 candidate can still be examined on every C2 competency before the added three-phase topics.',
      explainAloud: 'Explain “C1 = all C2 plus added C1 competencies” and state the C1 building-height and exclusion boundary.',
    },
  ),
  canonicalTerm(
    'kenya-electrical-installation-framework',
    'Kenyan electrical-installation authority framework',
    'Electrical installation work in Kenya is governed by Kenyan law and regulatory requirements first. The Energy Act 2019 requires duly authorised electrical workers/contractors and installation certification/periodic inspection duties, while the National Building Code 2024 Part XV identifies the principal electrical standards families used for building work, including KS 662, KS 1587, relevant KS IEC 60947/61439/62208 standards and BS 7671.',
    'Start with Kenyan law and EPRA. Use the current Kenyan/adopted standards layer next. BS 7671 and the IET On-Site Guide are a technical baseline where consistent with those Kenyan requirements; they do not override them.',
    'Regulation',
    ['C2-02', 'C1-01'],
    ['c2-02-installation-architecture-drawings-safety', 'c1-01-three-phase-fundamentals'],
    ['kenya-energy-act-2019', 'kenya-building-code-2024-electrical'],
    'kenya-verified',
    {
      aliases: ['Kenyan electrical law', 'Kenya installation standards hierarchy', 'regulations codes standards'],
      practicalExample: 'When a UK technical guide and a Kenyan statutory/adopted requirement differ, the Kenyan requirement governs the Kenyan installation.',
      explainAloud: 'Put Kenyan law/EPRA, adopted Kenyan standards, current BS 7671/IET guidance, manufacturer data and course explanation into the correct authority order.',
    },
  ),
  canonicalTerm(
    'conductor-identification',
    'Conductor identification / colour coding',
    'For the course BS 7671 technical baseline, AC conductor identification uses brown for single-phase line, blue for neutral and green-and-yellow for the protective conductor. For three-phase AC the baseline is L1 brown, L2 black, L3 grey, neutral blue and protective conductor green-and-yellow. Identification is evidence of intended function; it is never proof that a conductor is dead or correctly connected. The exact current adopted Kenyan KS 662 identification requirement must be verified for real work.',
    'Use colour to communicate intended conductor function, then prove the actual circuit by drawings, tracing, safe isolation and testing. Mixed-era or altered installations can contain legacy or incorrect identification.',
    'Installation',
    ['C2-03', 'C1-01'],
    ['c2-03-single-phase-wiring-accessories', 'c1-01-three-phase-fundamentals'],
    ['osg-identification-notices', 'iet-conductor-identification-baseline', 'kenya-building-code-2024-electrical'],
    'bs7671-technical-baseline',
    {
      aliases: ['colour coding', 'color coding', 'conductor colours', 'conductor colors', 'line neutral earth colours'],
      authority: 'explanatory-definition',
      practicalExample: 'A brown conductor at a point is expected to be line under the baseline convention, but a competent worker still proves the circuit condition before touching it and investigates any mismatch between colour, drawings and measured function.',
      explainAloud: 'State the course single-phase colours, then explain why colour cannot prove deadness or correct polarity.',
    },
  ),
];

const addUnique = (current: string[], additions: string[]) => [...new Set([...current, ...additions])];

export function applyLicensingAuthorityCoverage(sections: OverviewSection[]): OverviewSection[] {
  return sections.map(section => {
    if (section.id === 'c2-02-installation-architecture-drawings-safety') {
      return {
        ...section,
        termIds: addUnique(section.termIds, ['c2-licence-scope', 'kenya-electrical-installation-framework']),
        sourceIds: addUnique(section.sourceIds, ['kenya-energy-act-2019', 'kenya-building-code-2024-electrical']),
        coverage: [
          ...section.coverage,
          { competency: 'Knowledge of national regulations, codes and standards governing electrical installation work.', referenceIds: ['epra-c2-competencies', 'kenya-energy-act-2019', 'kenya-building-code-2024-electrical'], teachingPage: 'engineering-rules' },
          { competency: 'C2 scope: low-voltage single-phase installations in buildings up to two storeys, excluding factories and places designated for public entertainment.', referenceIds: ['epra-c2-competencies'], teachingPage: 'system-model' },
        ],
        pages: {
          ...section.pages,
          'system-model': [...section.pages['system-model'], {
            kind: 'prose',
            title: 'Know the C2 licensing boundary before the wiring diagram',
            paragraphs: ['EPRA defines C2 as low-voltage single-phase building installation up to two storeys, excluding factories and places designated for public entertainment. The technical lessons below teach competence inside that boundary; they do not enlarge the licence scope.'],
            sourceIds: ['epra-c2-competencies'],
          }],
          'engineering-rules': [...section.pages['engineering-rules'], {
            kind: 'table',
            title: 'Authority order for Kenyan installation decisions',
            columns: ['Layer', 'Use'],
            rows: [
              ['Kenyan law / EPRA', 'Legal authorization, licensing, certification and regulatory duties.'],
              ['Adopted Kenyan Standards / Building Code references', 'Kenyan installation/product requirements and standards framework.'],
              ['Current BS 7671 / IET guidance', 'Technical baseline where consistent with applicable Kenyan requirements.'],
              ['Manufacturer data', 'Exact product ratings, settings, assembly combinations and installation instructions.'],
              ['Course explanation', 'Teaching and worked examples; never overrides the layers above.'],
            ],
            sourceIds: ['kenya-energy-act-2019', 'kenya-building-code-2024-electrical'],
          }],
          sources: [...section.pages.sources, {
            kind: 'prose',
            title: 'Kenyan legal and standards anchor',
            paragraphs: ['The Energy Act 2019 anchors authorization, certification and periodic-inspection duties. The National Building Code 2024 Part XV anchors the building-electrical standards framework. The EPRA competency document defines what C2 candidates must know. Draft regulations are not promoted to current authority unless they enter into force.'],
            sourceIds: ['epra-c2-competencies', 'kenya-energy-act-2019', 'kenya-building-code-2024-electrical'],
          }],
        },
      };
    }

    if (section.id === 'c2-03-single-phase-wiring-accessories') {
      return {
        ...section,
        termIds: addUnique(section.termIds, ['conductor-identification']),
        sourceIds: addUnique(section.sourceIds, ['kenya-building-code-2024-electrical', 'iet-conductor-identification-baseline']),
        coverage: [...section.coverage, {
          competency: 'Selection of cables/current-carrying capacity and colour coding: identify conductor functions using the current course technical baseline while verifying the applicable Kenyan adopted requirement for real work.',
          referenceIds: ['epra-c2-competencies', 'osg-identification-notices', 'kenya-building-code-2024-electrical', 'iet-conductor-identification-baseline'],
          teachingPage: 'definitions',
        }],
        pages: {
          ...section.pages,
          definitions: [...section.pages.definitions, {
            kind: 'table',
            title: 'Conductor colour identification — course technical baseline',
            columns: ['Function', 'Baseline identification', 'Important limitation'],
            rows: [
              ['Single-phase line', 'Brown', 'Colour identifies intended function; prove actual condition/function before work.'],
              ['Neutral', 'Blue', 'Never assume blue is dead or correctly connected.'],
              ['Protective conductor / CPC / PE', 'Green-and-yellow', 'Reserved protective identification; verify continuity and protective function separately.'],
            ],
            sourceIds: ['osg-identification-notices', 'iet-conductor-identification-baseline'],
          }],
          'engineering-rules': [...section.pages['engineering-rules'], {
            kind: 'prose',
            title: 'Identification is not electrical proof',
            paragraphs: ['EPRA explicitly examines colour coding. The course uses the BS 7671 conductor-identification convention as its technical baseline, while the National Building Code points Kenyan installations to KS 662 and the applicable standards framework. Because the exact current adopted KS 662 conductor-identification table is not yet integrated here, do not label these colours as a verbatim KENYA VERIFIED table. On site, safe isolation, tracing, drawings and electrical tests establish the actual conductor condition and function.'],
            sourceIds: ['epra-c2-competencies', 'kenya-building-code-2024-electrical', 'osg-identification-notices', 'iet-conductor-identification-baseline'],
          }],
          sources: [...section.pages.sources, {
            kind: 'prose',
            title: 'Colour-coding source status',
            paragraphs: ['The colour table shown here is a BS 7671 technical-baseline teaching aid. The National Building Code 2024 references KS 662 for Kenyan electrical installations, but the exact current adopted KS 662 conductor-identification table has not yet been integrated into the course source pack. Verify that source before treating an exact colour table as Kenyan normative wording.'],
            sourceIds: ['kenya-building-code-2024-electrical', 'osg-identification-notices', 'iet-conductor-identification-baseline'],
          }],
        },
      };
    }

    if (section.id === 'c2-07-consumer-units-complete-installation') {
      return {
        ...section,
        sourceIds: addUnique(section.sourceIds, ['kenya-building-code-2024-electrical']),
        pages: {
          ...section.pages,
          'engineering-rules': [...section.pages['engineering-rules'], {
            kind: 'prose',
            title: 'Kenyan product/assembly standards bridge',
            paragraphs: ['The National Building Code 2024 Part XV points building electrical work to the applicable KS IEC 60947 low-voltage switchgear/controlgear families and KS IEC 61439 low-voltage assembly families. This reinforces the course rule that breakers, busbars, enclosures and consumer/distribution-board components must be treated as a verified assembly/product system, not mixed solely because they physically fit.'],
            sourceIds: ['kenya-building-code-2024-electrical'],
          }],
          sources: [...section.pages.sources, {
            kind: 'prose',
            title: 'Kenyan assembly-source anchor',
            paragraphs: ['For Kenyan building work, the National Building Code 2024 provides the legal standards bridge to the KS IEC 60947 and KS IEC 61439 families. Exact product ratings and permitted combinations still come from the applicable standard and manufacturer/assembly data.'],
            sourceIds: ['kenya-building-code-2024-electrical'],
          }],
        },
      };
    }

    if (section.id === 'c2-08-inspection-testing-commissioning') {
      return {
        ...section,
        sourceIds: addUnique(section.sourceIds, ['kenya-energy-act-2019']),
        pages: {
          ...section.pages,
          sources: [...section.pages.sources, {
            kind: 'prose',
            title: 'Kenyan certification and periodic-duty anchor',
            paragraphs: ['Energy Act 2019 section 151 links authorized installation work to appropriate installation certificates before initial connection and requires installations to be inspected and tested periodically with defects remedied. The technical test sequence still comes from the applicable current standards/guidance and competent practice.'],
            sourceIds: ['kenya-energy-act-2019'],
          }],
        },
      };
    }

    if (section.id === 'c1-01-three-phase-fundamentals') {
      return {
        ...section,
        termIds: addUnique(section.termIds, ['c1-licence-scope', 'kenya-electrical-installation-framework', 'conductor-identification']),
        sourceIds: addUnique(section.sourceIds, ['kenya-energy-act-2019', 'kenya-building-code-2024-electrical', 'iet-conductor-identification-baseline']),
        coverage: [
          ...section.coverage,
          { competency: 'Class C1 includes every C2 competency and adds low-voltage three-phase installation in buildings up to four storeys, excluding factories and places designated for public entertainment.', referenceIds: ['epra-c1-competencies'], teachingPage: 'system-model' },
          { competency: 'Carry the C2 national-regulations/codes/standards and conductor-identification competence forward into C1 three-phase work.', referenceIds: ['epra-c1-competencies', 'kenya-energy-act-2019', 'kenya-building-code-2024-electrical'], teachingPage: 'engineering-rules' },
        ],
        pages: {
          ...section.pages,
          'system-model': [...section.pages['system-model'], {
            kind: 'prose',
            title: 'C1 is cumulative, not a replacement for C2',
            paragraphs: ['EPRA states that C1 includes the areas of competency covered under C2, then adds low-voltage three-phase installations in buildings up to four storeys, excluding factories and places designated for public entertainment, plus the other listed C1 topics. Every C2 protection, cable, testing, safety and regulatory foundation therefore remains examinable.'],
            sourceIds: ['epra-c1-competencies'],
          }],
          'engineering-rules': [...section.pages['engineering-rules'], {
            kind: 'table',
            title: 'Three-phase conductor identification — course technical baseline',
            columns: ['Function', 'Baseline identification'],
            rows: [['L1', 'Brown'], ['L2', 'Black'], ['L3', 'Grey'], ['Neutral', 'Blue'], ['PE / protective conductor', 'Green-and-yellow']],
            sourceIds: ['osg-identification-notices', 'iet-conductor-identification-baseline'],
          }],
          sources: [...section.pages.sources, {
            kind: 'prose',
            title: 'C1 licensing and authority anchor',
            paragraphs: ['EPRA defines the C1 competence and explicitly carries C2 forward. Kenyan law and the National Building Code govern the authorization/standards framework. The displayed phase colours are the course BS 7671 technical baseline; verify the exact current adopted KS 662 identification requirement before real work.'],
            sourceIds: ['epra-c1-competencies', 'kenya-energy-act-2019', 'kenya-building-code-2024-electrical', 'iet-conductor-identification-baseline'],
          }],
        },
      };
    }

    if (section.id === 'c1-08-motor-starting-control-protection') {
      return {
        ...section,
        sourceIds: addUnique(section.sourceIds, ['kenya-building-code-2024-electrical']),
        pages: {
          ...section.pages,
          'engineering-rules': [...section.pages['engineering-rules'], {
            kind: 'prose',
            title: 'Kenyan low-voltage controlgear standards bridge',
            paragraphs: ['The National Building Code 2024 points building electrical work to the applicable KS IEC 60947 product families, including contactor/motor-starter/controlgear categories. This supports the course separation of switching, short-circuit, overload and control functions; exact starter/MPCB/VFD settings remain product- and manufacturer-specific.'],
            sourceIds: ['kenya-building-code-2024-electrical'],
          }],
          sources: [...section.pages.sources, {
            kind: 'prose',
            title: 'Motor-control source status',
            paragraphs: ['EPRA defines the competency target. Kenyan Building Code references provide the product-standards bridge, while actual motor starter, MPCB and drive settings must come from current product data and the installation design. Historical ECA material remains explanatory only.'],
            sourceIds: ['epra-c1-competencies', 'kenya-building-code-2024-electrical', 'course-c1-motors'],
          }],
        },
      };
    }

    if (section.id === 'c1-09-three-phase-testing-periodic') {
      return {
        ...section,
        sourceIds: addUnique(section.sourceIds, ['kenya-energy-act-2019']),
        pages: {
          ...section.pages,
          'engineering-rules': [...section.pages['engineering-rules'], {
            kind: 'prose',
            title: 'Periodic inspection has a Kenyan legal anchor, but the technical detail remains source-sensitive',
            paragraphs: ['Energy Act 2019 section 151 requires installations to be inspected and tested periodically, defects remedied and appropriate certificates issued/displayed. That legal duty does not supply the detailed inspection coding, frequencies or test procedures; those must come from the applicable current Kenyan requirements and current inspection/testing guidance.'],
            sourceIds: ['kenya-energy-act-2019', 'iet-gn3-periodic'],
          }],
          sources: [...section.pages.sources, {
            kind: 'prose',
            title: 'Periodic-inspection source status',
            paragraphs: ['The Kenyan legal requirement for periodic inspection/testing is verified. Detailed current Guidance Note 3 content has not yet been integrated as a verified local reader source, so this course continues to avoid inventing observation codes, intervals or numerical limits.'],
            sourceIds: ['kenya-energy-act-2019', 'iet-gn3-periodic'],
          }],
        },
      };
    }

    return section;
  });
}
