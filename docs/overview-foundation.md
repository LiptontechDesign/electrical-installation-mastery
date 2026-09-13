# Overview / Standards Companion — Section 1

Baseline: `4b92f3691781d7738ef48e415fb9b8efeb23539f`.

All three supplied Markdown guides were read before implementation: the master
implementation prompt, expanded C2 guide, and final C1 guide. Assessment schemas,
questions, marks and scoring instructions in those reference files are not part
of this implementation. No assessment engine is restored.

## Data ownership

- `overview-models.ts`: neutral, serializable source, canonical term, formula,
  learning-section and eight-page Overview schemas.
- `standards-terms.ts`: 74 preserved canonical vocabulary records. Existing
  `knowledge-graph.ts` exports refer to these records, maintaining labels,
  aliases, definitions, contrasts and formula explanations without UI changes.
- `source-references.ts`: bibliographic references and a safe source-link resolver.
- `overview-data.ts`: dataset composition; no premature C2/C1 content is published.
- `overview-integrity.ts`: explicit-reference validation and derived backlinks.

Canonical terms have stable editorial IDs. Do not rename an ID when improving a
label. Imported glossary IDs retain their existing label-derived key; freeze that
key before renaming an imported glossary entry. Legacy `definition` is a
compatibility projection of the same authored meaning, not a second authoring
location. Preserved records deliberately remain explanatory / awaiting editorial
review, not falsely verified current standard definitions. Enrich these records
in the individual content stages, rather than creating another definition bank.

Existing lesson terminology contains contextual comparisons, not just single-term
definitions. Those comparisons, course bridges, standards topics, guides,
explanations, book metadata and stable learning groups are retained unchanged.
Later integration should reference canonical IDs while keeping their useful
contextual explanations; do not silently discard them as duplicate prose.

## Source semantics

Printed labels and one-based reader pages are separate. A reader target requires
a valid book, in-bounds integer PDF page and explicit exact-mapping evidence.
Without that evidence the resolver returns a safe HTTPS source link, if available,
or an unavailable reason. It never applies a guessed offset. This is distinct from
source authority: an exactly mapped historical page is still historical.

The supplied master guide's claim that On-Site Guide appendices are unavailable
is stale. The previously verified supplied ninth-edition reader has 258 PDF pages,
including appendices. The foundation uses only the already visually verified
printed 123 / PDF 125 safety-page mapping as a representative source. It does not
certify every numerical extract in the exam guides. Exact Part 2 wording and
adopted Kenyan table requirements remain subject to source verification.

## Verification and subsequent stages

`npm run test:overview` checks the live dataset, compares every preserved vocabulary
field with the baseline, and runs positive/negative mapping and relationship
fixtures. The fixture is test-only. TypeScript, lint, existing curriculum,
architecture, tutor and book tests protect integration boundaries.

Section 2 is the horizontal shell, only after Section 1 is committed, pushed and
its remote SHA verified. Content follows the requested C2-01 through C2-09 and
C1-01 through C1-10 order, with each stage individually audited, committed and
pushed. Existing module IDs differ from stage codes: never infer module IDs by
stage numbering. C2-07 is `c2-boards`; several C1 stages also have named module IDs.
