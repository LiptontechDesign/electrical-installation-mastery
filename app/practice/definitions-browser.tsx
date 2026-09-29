'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import definitions from './definitions.json';
import StudyMarkdown from './study-markdown';

type Definition = (typeof definitions)[number];

const categories = [...new Set(definitions.map(entry => entry.category))];

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

function DefinitionRow({ entry, open, onToggle, showCategory }: { entry: Definition; open: boolean; onToggle: () => void; showCategory: boolean }) {
  const panelId = `${entry.id}-answer`;
  return <article className={`epra-definition-row ${open ? 'is-open' : ''}`}>
    <button type="button" className="epra-definition-trigger" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
      <span><strong>{entry.term}</strong>{showCategory && <small>{entry.category}</small>}</span>
      <span className="epra-definition-page">p. {entry.printedPage}</span><ChevronDown size={16} aria-hidden="true"/>
    </button>
    {open && <div className="epra-definition-detail" id={panelId} role="region" aria-label={`${entry.term} definition`}>
      <div className="epra-definition-copy"><StudyMarkdown prefix={entry.id}>{displayDefinition(entry.definition)}</StudyMarkdown></div>
      <p className="epra-definition-source">BS 7671:2008+A3:2015 · Part 2 · printed p. {entry.printedPage} (PDF p. {entry.pdfPage})</p>
    </div>}
  </article>;
}

export default function DefinitionsBrowser({ query }: { query: string }) {
  const [category, setCategory] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const words = searchable(query.trim()).split(/\s+/).filter(Boolean);
  const matches = definitions.filter(entry => {
    if (category !== 'all' && entry.category !== category) return false;
    if (!words.length) return true;
    const haystack = searchable(`${entry.term} ${entry.aliases.join(' ')} ${entry.definition} ${entry.category}`);
    return words.every(word => haystack.includes(word));
  });
  const ordered = words.length ? [...matches].sort((a, b) => rank(a, searchable(query.trim())) - rank(b, searchable(query.trim())) || a.term.localeCompare(b.term)) : matches;

  const row = (entry: Definition, showCategory: boolean) => <DefinitionRow key={entry.id} entry={entry} open={openId === entry.id} onToggle={() => setOpenId(openId === entry.id ? null : entry.id)} showCategory={showCategory}/>;

  return <section className="epra-definitions" aria-label="Definitions">
    <div className="epra-definitions-intro"><div><strong>BS 7671 definitions</strong><p>Browse by learning area or search a term, abbreviation or wording. Select a result to read its full definition.</p></div><span>138 terms · C2 + C1</span></div>
    <div className="epra-definitions-filter"><label className="epra-field">Learning area<select value={category} onChange={event => { setCategory(event.target.value); setOpenId(null); }}><option value="all">All learning areas</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label><p role="status">{matches.length} {matches.length === 1 ? 'definition' : 'definitions'}{words.length ? ' found' : ''}</p></div>
    {matches.length === 0 ? <div className="epra-empty"><Search size={26}/><h3>No definitions found</h3><p>Try a shorter term such as “earth”, “CPC” or “RCD”, or choose all learning areas.</p></div> : words.length ? <div className="epra-definition-list">{ordered.map(entry => row(entry, true))}</div> : categories.filter(item => category === 'all' || item === category).map(item => {
      const group = matches.filter(entry => entry.category === item);
      return <section className="epra-definition-group" key={item} aria-label={item}><h3>{item}<span>{group.length}</span></h3><div className="epra-definition-list">{group.map(entry => row(entry, false))}</div></section>;
    })}
    <p className="epra-definitions-caveat">Definitions are quoted from the supplied 17th edition (2015) for study. Check current Kenyan requirements and the current edition before applying a rule in practice.</p>
  </section>;
}
