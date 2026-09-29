'use client';

import { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, Lightbulb, Search } from 'lucide-react';
import definitions from './definitions.json';
import StudyMarkdown from './study-markdown';
import { definitionLearningNotes, guideReferences } from './definition-learning-notes';

type Definition = (typeof definitions)[number];

const categories = [...new Set(definitions.map(entry => entry.category))];
const definitionsByTerm = new Map(definitions.map(entry => [entry.term, entry]));

function searchable(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[–—]/g, '-');
}

function rank(entry: Definition, query: string) {
  const term = searchable(entry.term);
  const aliases = entry.aliases.map(searchable);
  if (term === query) return 0;
  if (aliases.some(alias => alias === query)) return 1;
  if (term.startsWith(query)) return 2;
  if (aliases.some(alias => alias.startsWith(query))) return 3;
  if (term.includes(query)) return 4;
  if (aliases.some(alias => alias.includes(query))) return 5;
  return 6;
}

function displayDefinition(value: string) {
  return value
    .replace(/([A-Za-z])<sub>([^<]+)<\/sub>/g, (_, base: string, letters: string) => `$${base}_{\\mathrm{${letters}}}$`)
    .replace(/(\d+)<sup>([^<]+)<\/sup>/g, (_, number: string, letters: string) => `$${number}^{\\mathrm{${letters}}}$`)
    .replace(/^\((i|ii|iii|iv|v)\) /gm, '- ($1) ');
}

function DefinitionRow({
  entry,
  open,
  onToggle,
  showCategory,
  onRequestTerm,
}: {
  entry: Definition;
  open: boolean;
  onToggle: () => void;
  showCategory: boolean;
  onRequestTerm?: (term: string, id: string) => void;
}) {
  const panelId = `${entry.id}-answer`;
  const learning = definitionLearningNotes[entry.id];
  const guide = learning?.guide ? guideReferences[learning.guide] : null;

  return <article className={`epra-definition-row ${open ? 'is-open' : ''}`} id={entry.id}>
    <button type="button" className="epra-definition-trigger" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
      <span><strong>{entry.term}</strong>{showCategory && <small>{entry.category}</small>}</span>
      <span className="epra-definition-page">p. {entry.printedPage}</span><ChevronDown size={16} aria-hidden="true"/>
    </button>
    {open && <div className="epra-definition-detail" id={panelId} role="region" aria-label={`${entry.term} definition`}>
      <section className="epra-definition-official" aria-label="Official historical definition">
        <div className="epra-definition-kicker"><BookOpen size={15}/><strong>Official definition · BS 7671 17th Edition (2015)</strong></div>
        <div className="epra-definition-copy"><StudyMarkdown prefix={entry.id}>{displayDefinition(entry.definition)}</StudyMarkdown></div>
        <p className="epra-definition-source">BS 7671:2008+A3:2015 · Part 2 · printed p. {entry.printedPage} (PDF p. {entry.pdfPage})</p>
      </section>

      {learning && <section className="epra-definition-learning" aria-label="Expanded learning explanation">
        <div className="epra-definition-kicker"><Lightbulb size={15}/><strong>What this means</strong></div>
        <div className="epra-definition-explanation"><StudyMarkdown prefix={`${entry.id}-meaning`}>{learning.meaning}</StudyMarkdown></div>
        {learning.remember && <aside className="epra-definition-remember"><strong>Key distinction</strong><StudyMarkdown prefix={`${entry.id}-remember`}>{learning.remember}</StudyMarkdown></aside>}
        {guide && <aside className="epra-definition-guide">
          <span>2026 ON-SITE GUIDE CONTEXT · PRINTED PP. {guide.pages}</span>
          <strong>{guide.label}</strong>
          <p>{learning.guideDetail ?? guide.summary}</p>
          {learning.guideDetail && <small>{guide.summary}</small>}
        </aside>}
        {!!learning.related?.length && <div className="epra-definition-related"><strong>Related definitions</strong><div>{learning.related.map(term => {
          const target = definitionsByTerm.get(term);
          return target && onRequestTerm
            ? <button type="button" key={term} onClick={() => onRequestTerm(term, target.id)}>{term}</button>
            : <span key={term}>{term}</span>;
        })}</div></div>}
      </section>}
    </div>}
  </article>;
}

export default function DefinitionsBrowser({
  query,
  initialOpenId,
  onRequestTerm,
}: {
  query: string;
  initialOpenId?: string | null;
  onRequestTerm?: (term: string, id: string) => void;
}) {
  const [category, setCategory] = useState('all');
  const [openId, setOpenId] = useState<string | null>(initialOpenId ?? null);

  useEffect(() => {
    if (!initialOpenId || !definitions.some(entry => entry.id === initialOpenId)) return;
    setCategory('all');
    setOpenId(initialOpenId);
    window.requestAnimationFrame(() => document.getElementById(initialOpenId)?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  }, [initialOpenId]);

  const words = searchable(query.trim()).split(/\s+/).filter(Boolean);
  const matches = definitions.filter(entry => {
    if (category !== 'all' && entry.category !== category) return false;
    if (!words.length) return true;
    const learning = definitionLearningNotes[entry.id];
    const guide = learning?.guide ? guideReferences[learning.guide] : null;
    const haystack = searchable([
      entry.term,
      entry.aliases.join(' '),
      entry.definition,
      entry.category,
      learning?.meaning ?? '',
      learning?.remember ?? '',
      learning?.related?.join(' ') ?? '',
      learning?.guideDetail ?? '',
      guide?.label ?? '',
      guide?.summary ?? '',
    ].join(' '));
    return words.every(word => haystack.includes(word));
  });
  const ordered = words.length ? [...matches].sort((a, b) => rank(a, searchable(query.trim())) - rank(b, searchable(query.trim())) || a.term.localeCompare(b.term)) : matches;

  const row = (entry: Definition, showCategory: boolean) => <DefinitionRow key={entry.id} entry={entry} open={openId === entry.id} onToggle={() => setOpenId(openId === entry.id ? null : entry.id)} showCategory={showCategory} onRequestTerm={onRequestTerm}/>;

  return <section className="epra-definitions" aria-label="Definitions">
    <div className="epra-definitions-intro"><div><strong>BS 7671 definitions · expanded for learning</strong><p>Each entry keeps the supplied 2015 Part 2 definition intact, then adds a plain-language explanation, important distinctions, related terms and clearly separated 2026 On-Site Guide context where the guide adds useful practical detail.</p></div><span>138 terms · C2 + C1</span></div>
    <div className="epra-definitions-filter"><label className="epra-field">Learning area<select value={category} onChange={event => { setCategory(event.target.value); setOpenId(null); }}><option value="all">All learning areas</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label><p role="status">{matches.length} {matches.length === 1 ? 'definition' : 'definitions'}{words.length ? ' found' : ''}</p></div>
    {matches.length === 0 ? <div className="epra-empty"><Search size={26}/><h3>No definitions found</h3><p>Try a shorter term such as “earth”, “CPC” or “RCD”, or choose all learning areas.</p></div> : words.length ? <div className="epra-definition-list">{ordered.map(entry => row(entry, true))}</div> : categories.filter(item => category === 'all' || item === category).map(item => {
      const group = matches.filter(entry => entry.category === item);
      return <section className="epra-definition-group" key={item} aria-label={item}><h3>{item}<span>{group.length}</span></h3><div className="epra-definition-list">{group.map(entry => row(entry, false))}</div></section>;
    })}
    <p className="epra-definitions-caveat"><strong>Source boundary:</strong> the quoted definition is from the supplied historical BS 7671:2008+A3:2015. “What this means” is study explanation written for this course. Any On-Site Guide context is separately labelled and comes from the supplied 2026 guide aligned to BS 7671:2018+A4:2026. Check current Kenyan requirements and the current standards before applying a rule in practice.</p>
  </section>;
}
