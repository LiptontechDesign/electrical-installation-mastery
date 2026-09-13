import type { OverviewDataset } from './overview-models';
import { overviewPages } from './overview-models';
import { resolveSourceLink, safeSourceUrl } from './source-references';
import { getBook } from './books-data';

export type IntegrityContext = {
  modules: { id: string; lessonIds: string[] }[];
  learningSections: { id: string; moduleId: string }[];
  stageIds: string[];
};

/** Returns all editorial errors instead of hiding defects behind first-match lookup. */
export function validateOverview(data: OverviewDataset, context: IntegrityContext): string[] {
  const errors: string[] = [];
  const fail = (owner: string, message: string) => errors.push(`${owner}: ${message}`);
  const ids = (name: string, records: { id: string }[]) => {
    const found = new Set<string>();
    for (const item of records) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) fail(name, `invalid ID ${item.id}`);
      if (found.has(item.id)) fail(name, `duplicate ID ${item.id}`);
      found.add(item.id);
    }
    return found;
  };
  const sources = ids('sources', data.sources), terms = ids('terms', data.terms);
  const formulas = ids('formulas', data.formulas), sections = ids('sections', data.sections);
  const lessons = new Set(context.modules.flatMap(item => item.lessonIds));
  const stages = new Set(context.stageIds), groups = new Set(context.learningSections.map(item => item.id));
  const refs = (owner: string, kind: string, values: string[], allowed: Set<string>) => {
    for (const value of values) if (!allowed.has(value)) fail(owner, `unknown ${kind} ${value}`);
    if (new Set(values).size !== values.length) fail(owner, `duplicate ${kind} reference`);
  };
  for (const source of data.sources) {
    if (!source.title.trim()) fail(source.id, 'missing title');
    if (source.bookId && !getBook(source.bookId)) fail(source.id, 'unknown book');
    if (source.url && !safeSourceUrl(source.url)) fail(source.id, 'unsafe source URL');
    if (source.pdfPage !== undefined || source.mapping) {
      if (resolveSourceLink(source).kind !== 'reader') fail(source.id, 'invalid or unverified PDF mapping');
    }
    if (source.status === 'verified' && (!source.verification?.evidence.trim() || !source.verification.verifiedAt)) fail(source.id, 'missing verification evidence');
    if ((source.status === 'historical' || source.status === 'draft') && source.authority === 'primary-current') fail(source.id, 'non-current source claims primary authority');
    if (source.kenyaStatus === 'kenya-verified' && (!['kenya-law','epra','kebs'].includes(source.sourceType) || source.status !== 'verified')) fail(source.id, 'unsupported Kenyan authority');
  }
  const names = new Set<string>();
  for (const term of data.terms) {
    const name = term.term.trim().toLowerCase();
    if (!name || names.has(name)) fail(term.id, 'duplicate or empty canonical term');
    names.add(name);
    if (!term.standardsMeaning.trim() || !term.plainMeaning.trim()) fail(term.id, 'missing meaning');
    if (!term.sourceIds.length) fail(term.id, 'missing source provenance');
    refs(term.id, 'source', term.sourceIds, sources);
    refs(term.id, 'term', term.relatedTermIds, terms);
    refs(term.id, 'distinction', term.notTheSameAs.map(item => item.termId), terms);
    if (term.relatedTermIds.includes(term.id) || term.notTheSameAs.some(item => item.termId === term.id || !item.distinction.trim())) fail(term.id, 'invalid self relationship or empty distinction');
    refs(term.id, 'formula', term.formulaIds, formulas);
    refs(term.id, 'stage', term.stageIds, stages);
    refs(term.id, 'section', term.sectionIds, sections);
    refs(term.id, 'lesson', term.lessonIds, lessons);
    if (term.authority === 'formal-definition-verified') {
      const evidence = term.formalDefinitionEvidence;
      const source = data.sources.find(item => item.id === evidence?.sourceId);
      if (!evidence?.section.trim() || !evidence.verifiedAt || !source || source.status !== 'verified' || !term.sourceIds.includes(source.id) || !['primary-current','current-technical'].includes(source.authority)) fail(term.id, 'unsupported formal definition');
    }
    if (term.kenyaStatus === 'kenya-verified' && !data.sources.some(source => term.sourceIds.includes(source.id) && source.kenyaStatus === 'kenya-verified' && source.status === 'verified')) fail(term.id, 'missing Kenyan authority evidence');
  }
  for (const formula of data.formulas) {
    refs(formula.id, 'source', formula.sourceIds, sources);
    if (!formula.expression.trim() || !formula.assumptions.length || !formula.variables.length) fail(formula.id, 'incomplete formula');
    const symbols = new Set<string>();
    for (const variable of formula.variables) {
      if (!variable.symbol.trim() || !variable.meaning.trim() || !variable.unit.trim() || symbols.has(variable.symbol)) fail(formula.id, 'invalid variable definition');
      symbols.add(variable.symbol);
      if (variable.termId) refs(formula.id, 'term', [variable.termId], terms);
    }
  }
  for (const section of data.sections) {
    const courseModule = context.modules.find(item => item.id === section.moduleId);
    if (!courseModule) fail(section.id, `unknown module ${section.moduleId}`);
    refs(section.id, 'stage', [section.stageId], stages);
    refs(section.id, 'learning section', section.learningSectionIds, groups);
    for (const id of section.learningSectionIds) if (context.learningSections.find(item => item.id === id)?.moduleId !== section.moduleId) fail(section.id, `wrong module for ${id}`);
    refs(section.id, 'lesson', section.lessonIds, new Set(courseModule?.lessonIds ?? []));
    refs(section.id, 'term', section.termIds, terms);
    refs(section.id, 'source', section.sourceIds, sources);
    refs(section.id, 'section', section.relatedSectionIds, sections);
    refs(section.id, 'prerequisite', section.prerequisiteSectionIds, sections);
    if ([...section.relatedSectionIds, ...section.prerequisiteSectionIds].includes(section.id)) fail(section.id, 'self section relationship');
    for (const page of overviewPages) {
      const blocks = section.pages[page];
      if (!Array.isArray(blocks)) { fail(section.id, `missing page ${page}`); continue; }
      for (const block of blocks) {
        if (block.kind === 'formula') refs(section.id, 'formula', [block.formulaId], formulas);
        else {
          refs(section.id, 'source', block.sourceIds, sources);
          if (block.kind === 'table' && block.rows.some(row => row.length !== block.columns.length)) fail(section.id, 'ragged table');
        }
      }
    }
    for (const coverage of section.coverage) if (!overviewPages.includes(coverage.teachingPage) || !coverage.competency.trim()) fail(section.id, 'invalid coverage target');
  }
  // Prerequisites must form a DAG; related links may legitimately be reciprocal.
  const active = new Set<string>(), visited = new Set<string>();
  const visit = (id: string) => {
    if (active.has(id)) { fail(id, 'cyclic prerequisite'); return; }
    if (visited.has(id)) return;
    active.add(id);
    data.sections.find(item => item.id === id)?.prerequisiteSectionIds.forEach(visit);
    active.delete(id); visited.add(id);
  };
  data.sections.forEach(item => visit(item.id));
  return errors;
}

/** Backlinks are derived from forward references, never hand-maintained duplicates. */
export function buildOverviewBacklinks(data: OverviewDataset) {
  const term = Object.fromEntries(data.terms.map(item => [item.id, { termIds: [] as string[], sectionIds: [] as string[] }]));
  const source = Object.fromEntries(data.sources.map(item => [item.id, { termIds: [] as string[], sectionIds: [] as string[], formulaIds: [] as string[] }]));
  const section = Object.fromEntries(data.sections.map(item => [item.id, { relatedFromIds: [] as string[], prerequisiteForIds: [] as string[] }]));
  for (const item of data.terms) {
    for (const id of new Set([...item.relatedTermIds, ...item.notTheSameAs.map(other => other.termId)])) term[id]?.termIds.push(item.id);
    for (const id of item.sourceIds) source[id]?.termIds.push(item.id);
    for (const id of item.sectionIds) term[item.id].sectionIds.push(id);
  }
  for (const item of data.formulas) for (const id of item.sourceIds) source[id]?.formulaIds.push(item.id);
  for (const item of data.sections) {
    for (const id of item.relatedSectionIds) section[id]?.relatedFromIds.push(item.id);
    for (const id of item.prerequisiteSectionIds) section[id]?.prerequisiteForIds.push(item.id);
    for (const id of item.termIds) if (term[id] && !term[id].sectionIds.includes(item.id)) term[id].sectionIds.push(item.id);
    const usedSources = new Set([...item.sourceIds, ...Object.values(item.pages).flatMap(blocks => blocks.flatMap(block => block.kind === 'formula' ? data.formulas.find(formula => formula.id === block.formulaId)?.sourceIds ?? [] : block.sourceIds))]);
    for (const id of usedSources) source[id]?.sectionIds.push(item.id);
  }
  return { terms: term, sources: source, sections: section };
}
