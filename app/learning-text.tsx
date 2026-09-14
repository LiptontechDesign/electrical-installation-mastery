import Formula from './formula';
import { engineeringToTex } from './engineering-notation';

/** TeX uses $...$; constrained legacy engineering notation uses `...`. No HTML is accepted. */
export default function LearningText({ text }: { text: string }) {
  return <>{text.split(/(`[^`]+`|\$[^$]+\$)/g).map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) return <Formula key={index} tex={part.slice(1, -1)} />;
    if (part.startsWith('`') && part.endsWith('`')) return <Formula key={index} tex={engineeringToTex(part.slice(1, -1))} />;
    return <span key={index}>{part}</span>;
  })}</>;
}
