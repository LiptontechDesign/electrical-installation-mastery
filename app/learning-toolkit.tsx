'use client';

import { useId, useState } from 'react';
import { BookOpen, ChevronDown, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { glossary } from './learning-data';
import Formula from './formula';
import ToolkitVisual from './toolkit-visual';
import { calculate, formulas, formatNumber, ohmExpressions, type FormulaMode, type OhmTarget } from './toolkit-math';

const categories = ['All', ...new Set(glossary.map((term) => term.category))];

export default function LearningToolkit({ query, onQueryChange }: { query: string; onQueryChange: (query: string) => void }) {
  const id = useId();
  const [mode, setMode] = useState<FormulaMode>('ohm');
  const [target, setTarget] = useState<OhmTarget>('current');
  const [examples, setExamples] = useState(() => Object.fromEntries(formulas.map((spec) => [spec.id, spec.defaults])));
  const [category, setCategory] = useState('All');
  const spec = formulas.find((item) => item.id === mode)!;
  const values = examples[mode];
  const { result, error } = calculate(spec, values, target);
  const fields = spec.fields.filter((field) => mode !== 'ohm' || field.key !== target);
  const filteredTerms = glossary.filter((entry) => (query.trim() || category === 'All' || category === entry.category)
    && `${entry.term} ${entry.definition} ${entry.category}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  const update = (key: string, value: string) => setExamples((current) => ({ ...current, [mode]: { ...current[mode], [key]: value } }));

  return <div className="page toolkit-page interactive-toolkit">
    <header className="toolkit-heading"><div><span className="eyebrow neutral"><SlidersHorizontal size={17} /> Toolkit</span><h1>See how the numbers connect.</h1><p>Change a value. Follow the formula.</p></div></header>
    <div className="formula-picker" aria-label="Choose a formula">
      {formulas.map((item) => <button type="button" key={item.id} aria-pressed={item.id === mode} onClick={() => setMode(item.id)}><span>{item.title}</span><Formula tex={item.tex} /></button>)}
    </div>
    <section className="formula-studio" aria-label={spec.title}>
      <div className="formula-controls">
        <div className="formula-control-heading"><h2>{spec.title}</h2><button className="example-reset" type="button" onClick={() => { setExamples((current) => ({ ...current, [mode]: spec.defaults })); setTarget('current'); }}><RotateCcw size={15} /> Reset example</button></div>
        {mode === 'ohm' && <fieldset className="solve-for"><legend>Find</legend>{(['current', 'voltage', 'resistance'] as const).map((key) => <label key={key}><input type="radio" name={`${id}-target`} value={key} checked={target === key} onChange={() => setTarget(key)} /><span>{key[0].toUpperCase() + key.slice(1)}</span></label>)}</fieldset>}
        <div className="editable-values">{fields.map((field) => {
          const sliderValue = Number(values[field.key]);
          const sliderMax = Number.isFinite(sliderValue) ? Math.max(field.max, sliderValue) : field.max;
          return <div className="quantity-control" key={field.key}>
            <label htmlFor={`${id}-${field.key}`}><span><Formula tex={field.symbol} /> {field.label}</span><span className="quantity-unit">{field.unit}</span></label>
            <input id={`${id}-${field.key}`} type="number" inputMode="decimal" min="0" max={field.key === 'pf' ? 1 : 1e9} step="any" value={values[field.key]} onChange={(event) => update(field.key, event.target.value)} aria-describedby={`${id}-calculation-status`} />
            <input type="range" min="0" max={sliderMax} step={field.step} value={Number.isFinite(sliderValue) ? Math.max(0, sliderValue) : 0} onChange={(event) => update(field.key, event.target.value)} aria-label={`Adjust ${field.label.toLowerCase()}`} />
          </div>;
        })}</div>
        <p className="formula-assumption">{spec.note}</p>
      </div>
      <div className="formula-live">
        <div className="formula-equation"><Formula tex={mode === 'ohm' ? ohmExpressions[target] : spec.tex} block /></div>
        <div id={`${id}-calculation-status`} className={`formula-answer${error ? ' invalid' : ''}`} role="status" aria-live="polite">
          {result ? <><span>{result.label}</span><strong>{formatNumber(result.value)} <small>{result.unit}</small></strong></> : <p>{error}</p>}
        </div>
        {result ? <><div className="worked-equation"><Formula tex={result.tex} block /></div><ToolkitVisual mode={mode} result={result} /></> : <div className="formula-empty">The diagram returns when the inputs are valid.</div>}
      </div>
    </section>
    <p className="toolkit-scope">Learning models only. Installation design requires verified supply data, current standards and qualified review.</p>
    <section className="term-reference" aria-labelledby={`${id}-glossary`}>
      <div className="term-heading"><h2 id={`${id}-glossary`}><BookOpen size={22} /> Electrical glossary</h2><label className="glossary-search"><Search size={18} /><input value={query} onChange={(event) => { onQueryChange(event.target.value); setCategory('All'); }} placeholder="Find a term" aria-label="Search electrical glossary" /></label></div>
      <div className="term-categories" aria-label="Glossary categories">{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => { setCategory(item); onQueryChange(''); }}>{item}</button>)}</div>
      <div className="term-grid">{filteredTerms.map((entry) => <details key={entry.term}><summary><span><small>{entry.category}</small><strong>{entry.term}</strong></span><ChevronDown size={17} /></summary><p>{entry.definition}</p></details>)}</div>
      {!filteredTerms.length && <p className="term-empty" role="status">No matching terms. Try a shorter search.</p>}
    </section>
  </div>;
}
