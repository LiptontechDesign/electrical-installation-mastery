import { memo } from 'react';
import { renderToString } from 'katex';

/** All expressions are authored formulas or validated numeric substitutions. */
export default memo(function Formula({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = renderToString(tex, {
    displayMode: block, output: 'htmlAndMathml', throwOnError: true, trust: false, strict: 'error',
  });
  return <span className={`math-formula${block ? ' math-block' : ''}`} dangerouslySetInnerHTML={{ __html: html }} />;
});
