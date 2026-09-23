'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { memo } from 'react';
import type { Root, RootContent } from 'hast';
import { mathMarkdown } from './study-model';

// Assign IDs in the AST, not during React render (which may run more than once).
function headingIds({ prefix }: { prefix: string }) {
  return (tree: Root) => {
    let index = 0;
    function walk(node: Root | RootContent) {
      if ('tagName' in node && /^h[1-6]$/.test(node.tagName)) node.properties.id = `${prefix}-${index++}`;
      if ('children' in node) node.children.forEach(walk);
    }
    walk(tree);
  };
}

export const InlineMarkdown = memo(function InlineMarkdown({ children }: { children: string }) {
  return <span className="epra-inline"><Markdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, trust: false }]]} components={{ p: ({ children }) => <>{children}</> }}>{mathMarkdown(children)}</Markdown></span>;
});

function StudyMarkdown({ children, outline = false, prefix = 'answer' }: { children: string; outline?: boolean; prefix?: string }) {
  const headings = [...children.matchAll(/^(#{1,6}) (.+)$/gm)];
  const heading = ({ children: content, id }: { children?: React.ReactNode; id?: string }) => <h3 id={id}>{content}</h3>;
  const subheading = ({ children: content, id }: { children?: React.ReactNode; id?: string }) => <h4 id={id}>{content}</h4>;
  return <div className="epra-prose">
    {outline && headings.length > 2 && <details className="epra-outline"><summary>In this answer <span>{headings.length} sections</span></summary><nav aria-label="Answer sections">{headings.map((h, i) => <a key={i} href={`#${prefix}-${i}`}><Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{mathMarkdown(h[2])}</Markdown></a>)}</nav></details>}
    <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[headingIds, { prefix }], [rehypeKatex, { strict: false, trust: false }]]} components={{ h1: heading, h2: heading, h3: subheading, h4: subheading, h5: subheading, h6: subheading, table: ({ children }) => <div className="epra-table-scroll" tabIndex={0}><table>{children}</table></div> }}>{mathMarkdown(children)}</Markdown>
  </div>;
}

export default memo(StudyMarkdown);
