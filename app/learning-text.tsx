import Formula from './formula';

/** Inline mathematical expressions are authored with $...$; no HTML is accepted. */
export default function LearningText({ text }: { text: string }) {
  return <>{text.split(/(\$[^$]+\$)/g).map((part, index) => part.startsWith('$') && part.endsWith('$')
    ? <Formula key={index} tex={part.slice(1, -1)} />
    : <span key={index}>{part}</span>)}</>;
}
