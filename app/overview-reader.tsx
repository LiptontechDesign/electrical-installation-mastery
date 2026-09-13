'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { Reading } from './books-data';
import type { CanonicalTerm, OverviewBlock, OverviewFormula, OverviewPageId, OverviewSection, SourceReference } from './overview-models';
import { authorityLabels, kenyaStatusLabels, moveSelection, overviewPageLabels, overviewPages } from './overview-navigation';
import { resolveSourceLink } from './source-references';
import styles from './overview-reader.module.css';

type Props = {
  section: OverviewSection;
  terms: CanonicalTerm[];
  sources: SourceReference[];
  formulas: OverviewFormula[];
  onLesson: (id: string) => void;
  onRead: (reading: Reading) => void;
};

function sourceDescription(source: SourceReference) {
  return [source.organisation, source.edition, source.section, source.printedPage ? `printed p. ${source.printedPage}` : undefined]
    .filter(Boolean).join(' · ');
}

function SourceCard({ source, onRead }: { source: SourceReference; onRead: (reading: Reading) => void }) {
  const link = resolveSourceLink(source);
  return <div className={styles.sourceCard}>
    <div className={styles.sourceMeta}>
      <strong>{source.title}</strong>
      <p>{sourceDescription(source) || source.sourceType}</p>
      {source.mapping?.status === 'exact' && source.pdfPage && <small>Verified reader page {source.pdfPage}</small>}
    </div>
    {link.kind === 'reader' ? (
      <button type="button" className={styles.sourceAction} onClick={() => onRead(link.reading)}><BookOpen size={15}/>Open source page</button>
    ) : link.kind === 'external' ? (
      <a className={styles.sourceAction} href={link.url} target="_blank" rel="noreferrer"><ExternalLink size={15}/>Open source website</a>
    ) : (
      <span className={styles.unavailable}>Source reference only — exact reader page not mapped.</span>
    )}
  </div>;
}

function PageBlock({ block, formulas }: { block: OverviewBlock; formulas: OverviewFormula[] }) {
  if (block.kind === 'prose') return <article className={styles.block}><h4>{block.title}</h4>{block.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</article>;
  if (block.kind === 'table') return <article className={styles.block}><h4>{block.title}</h4><div className={styles.tableWrap}><table className={styles.table}><thead><tr>{block.columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div></article>;
  if (block.kind === 'flow') return <article className={styles.block}><h4>{block.title}</h4><ol className={styles.flow}>{block.steps.map((step, index) => <li key={index}>{step}</li>)}</ol></article>;
  if (block.kind === 'formula') {
    const formula = formulas.find(item => item.id === block.formulaId);
    if (!formula) return null;
    return <article className={`${styles.block} ${styles.formula}`}><h4>Formula</h4><div className={styles.expression}>{formula.expression}</div><ul className={styles.assumptions}>{formula.assumptions.map(item => <li key={item}>{item}</li>)}</ul><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Symbol</th><th>Meaning</th><th>Unit</th></tr></thead><tbody>{formula.variables.map(variable => <tr key={variable.symbol}><td>{variable.symbol}</td><td>{variable.meaning}</td><td>{variable.unit}</td></tr>)}</tbody></table></div></article>;
  }
  return <article className={styles.block}><h4>{block.title}</h4><div className={styles.verificationGrid}>
    <div><strong>Purpose</strong><p>{block.purpose}</p></div>
    <div><strong>Safe state</strong><p>{block.safeState}</p></div>
    <div><strong>Instrument</strong><p>{block.instrument}</p></div>
    <div><strong>Expected</strong><p>{block.expected}</p></div>
    <div><strong>If abnormal</strong><p>{block.abnormal}</p></div>
    <div><strong>Next action</strong><p>{block.nextAction}</p></div>
  </div><div><span className={styles.blockLabel}>Method</span><ol className={styles.methodList}>{block.method.map((step, index) => <li key={index}>{step}</li>)}</ol></div></article>;
}

function PageBlocks({ blocks, formulas }: { blocks: OverviewBlock[]; formulas: OverviewFormula[] }) {
  if (!blocks.length) return <div className={styles.empty}>This page is ready for the stage-specific content commit.</div>;
  return <div className={styles.blocks}>{blocks.map((block, index) => <PageBlock key={`${block.kind}-${index}`} block={block} formulas={formulas}/>)}</div>;
}

export default function OverviewReader({ section, terms, sources, formulas, onLesson, onRead }: Props) {
  const sectionTerms = useMemo(() => section.termIds.map(id => terms.find(term => term.id === id)).filter((term): term is CanonicalTerm => Boolean(term)), [section.termIds, terms]);
  const termById = useMemo(() => new Map(terms.map(term => [term.id, term])), [terms]);
  const sourceById = useMemo(() => new Map(sources.map(source => [source.id, source])), [sources]);
  const [activePage, setActivePage] = useState<OverviewPageId>('system-model');
  const [activeTermId, setActiveTermId] = useState(sectionTerms[0]?.id ?? '');
  const pageRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const termRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setActivePage('system-model');
    setActiveTermId(sectionTerms[0]?.id ?? '');
  }, [section.id, sectionTerms]);

  const activeTerm = sectionTerms.find(term => term.id === activeTermId) ?? sectionTerms[0];
  const activePageIndex = overviewPages.indexOf(activePage);
  const activeTermIndex = Math.max(0, sectionTerms.findIndex(term => term.id === activeTerm?.id));

  useEffect(() => { pageRefs.current[activePageIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activePageIndex]);
  useEffect(() => { if (activeTerm) termRefs.current[activeTermIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeTerm, activeTermIndex]);

  const selectPageIndex = (index: number, focus = false) => {
    const page = overviewPages[index];
    if (!page) return;
    setActivePage(page);
    if (focus) requestAnimationFrame(() => pageRefs.current[index]?.focus());
  };
  const selectTermIndex = (index: number, focus = false) => {
    const term = sectionTerms[index];
    if (!term) return;
    setActiveTermId(term.id);
    if (focus) requestAnimationFrame(() => termRefs.current[index]?.focus());
  };
  const onPageKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = event.key === 'ArrowLeft' ? 'previous' : event.key === 'ArrowRight' ? 'next' : event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : null;
    if (!direction) return;
    event.preventDefault();
    selectPageIndex(moveSelection(index, overviewPages.length, direction), true);
  };
  const onTermKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = event.key === 'ArrowLeft' ? 'previous' : event.key === 'ArrowRight' ? 'next' : event.key === 'Home' ? 'first' : event.key === 'End' ? 'last' : null;
    if (!direction) return;
    event.preventDefault();
    selectTermIndex(moveSelection(index, sectionTerms.length, direction), true);
  };
  const chooseRelatedTerm = (id: string) => {
    if (!sectionTerms.some(term => term.id === id)) return;
    setActivePage('definitions');
    setActiveTermId(id);
  };

  return <section className={styles.shell} aria-label={`${section.title} Overview and Standards Companion`}>
    <header className={styles.header}>
      <div className={styles.headerCopy}><span className={styles.stage}>{section.stageId} · Standards Companion</span><h2>{section.title}</h2><p>Move horizontally through one technical chapter at a time. Definitions use one focused canonical card rather than a long glossary dump.</p></div>
    </header>

    <div className={styles.navRow}>
      <button type="button" className={styles.navArrow} aria-label="Previous overview page" disabled={activePageIndex <= 0} onClick={() => selectPageIndex(activePageIndex - 1)}><ChevronLeft size={18}/></button>
      <div className={styles.strip} role="tablist" aria-label="Overview chapters">
        {overviewPages.map((page, index) => <button key={page} ref={node => { pageRefs.current[index] = node; }} type="button" role="tab" aria-selected={activePage === page} aria-controls={`overview-panel-${section.id}`} tabIndex={activePage === page ? 0 : -1} className={styles.tab} onClick={() => setActivePage(page)} onKeyDown={event => onPageKey(event, index)}>{overviewPageLabels[page]}</button>)}
      </div>
      <button type="button" className={styles.navArrow} aria-label="Next overview page" disabled={activePageIndex >= overviewPages.length - 1} onClick={() => selectPageIndex(activePageIndex + 1)}><ChevronRight size={18}/></button>
    </div>

    <div id={`overview-panel-${section.id}`} className={styles.panel} role="tabpanel">
      <div className={styles.panelHeading}><h3>{overviewPageLabels[activePage]}</h3>{activePage === 'definitions' && <p>Select a term. Only its focused definition card is shown.</p>}</div>
      {activePage === 'definitions' ? (
        sectionTerms.length ? <>
          <div className={styles.termNav}>
            <button type="button" className={styles.navArrow} aria-label="Previous definition" disabled={activeTermIndex <= 0} onClick={() => selectTermIndex(activeTermIndex - 1)}><ChevronLeft size={18}/></button>
            <div className={styles.termStrip} role="tablist" aria-label="Definitions">
              {sectionTerms.map((term, index) => <button key={term.id} ref={node => { termRefs.current[index] = node; }} type="button" role="tab" aria-selected={activeTerm?.id === term.id} aria-controls={`definition-${section.id}`} tabIndex={activeTerm?.id === term.id ? 0 : -1} className={styles.termTab} onClick={() => setActiveTermId(term.id)} onKeyDown={event => onTermKey(event, index)}>{term.term}</button>)}
            </div>
            <button type="button" className={styles.navArrow} aria-label="Next definition" disabled={activeTermIndex >= sectionTerms.length - 1} onClick={() => selectTermIndex(activeTermIndex + 1)}><ChevronRight size={18}/></button>
          </div>
          {activeTerm && <article id={`definition-${section.id}`} className={styles.definitionCard} role="tabpanel">
            <div className={styles.definitionHeader}><h3>{activeTerm.term}</h3><div className={styles.badges}><span className={`${styles.badge} ${styles.authority}`}>{authorityLabels[activeTerm.authority]}</span><span className={`${styles.badge} ${styles.kenya}`}>{kenyaStatusLabels[activeTerm.kenyaStatus]}</span></div></div>
            <div className={styles.meaningGrid}><div className={styles.meaning}><span>Standards meaning</span><p>{activeTerm.standardsMeaning}</p></div><div className={styles.meaning}><span>Plain meaning</span><p>{activeTerm.plainMeaning}</p></div></div>
            {activeTerm.practicalExample && <div className={styles.callout}><span>Practical example</span><p>{activeTerm.practicalExample}</p></div>}
            {activeTerm.notTheSameAs.length > 0 && <div className={styles.callout}><span>Do not confuse with</span><div className={styles.blocks}>{activeTerm.notTheSameAs.map(item => <div className={styles.distinction} key={item.termId}><button type="button" className={styles.relatedButton} onClick={() => chooseRelatedTerm(item.termId)}>{termById.get(item.termId)?.term ?? item.termId}</button><p>{item.distinction}</p></div>)}</div></div>}
            {activeTerm.relatedTermIds.length > 0 && <div className={styles.callout}><span>Related concepts</span><div className={styles.relatedList}>{activeTerm.relatedTermIds.map(id => <button key={id} type="button" className={styles.relatedButton} onClick={() => chooseRelatedTerm(id)}>{termById.get(id)?.term ?? id}</button>)}</div></div>}
            {activeTerm.formulaIds.length > 0 && <div className={styles.callout}><span>Related formula</span><div className={styles.blocks}>{activeTerm.formulaIds.map(id => { const formula = formulas.find(item => item.id === id); return formula ? <div className={styles.expression} key={id}>{formula.expression}</div> : null; })}</div></div>}
            <div className={styles.sources}><h4>Sources</h4><div className={styles.sourceList}>{activeTerm.sourceIds.map(id => sourceById.get(id)).filter((source): source is SourceReference => Boolean(source)).map(source => <SourceCard key={source.id} source={source} onRead={onRead}/>)}</div></div>
            <div className={styles.actions}>{activeTerm.lessonIds[0] && <button type="button" className={styles.linkButton} onClick={() => onLesson(activeTerm.lessonIds[0])}>Go to related lesson<ArrowRight size={15}/></button>}</div>
            {activeTerm.explainAloud && <div className={styles.explainAloud}><strong>Explain it aloud</strong><p>{activeTerm.explainAloud}</p></div>}
          </article>}
          <PageBlocks blocks={section.pages.definitions} formulas={formulas}/>
        </> : <div className={styles.empty}>Definitions will be added in the stage-specific content commit.</div>
      ) : <PageBlocks blocks={section.pages[activePage]} formulas={formulas}/>} 
    </div>
  </section>;
}
