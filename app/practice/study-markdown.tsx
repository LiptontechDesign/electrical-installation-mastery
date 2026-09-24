'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { memo } from 'react';
import type { Root, RootContent } from 'hast';
import { mathMarkdown } from './study-model';

// Assign IDs in the AST, not during React render (which may run more than once).
function headingIds({ prefix, firstLevel = 1 }: { prefix: string; firstLevel?: number }) {
  return (tree: Root) => {
    let index = 0;
    function walk(node: Root | RootContent) {
      if ('tagName' in node && /^h[1-6]$/.test(node.tagName)) { node.properties.id = `${prefix}-${index++}`; node.tagName = `h${Math.min(6, 3 + Number(node.tagName[1]) - firstLevel)}`; }
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
  const firstLevel = Math.min(...headings.map(h => h[1].length), 6);
  type Entry = { index: number; label: string; depth: number; children: Entry[] };
  const roots: Entry[] = [];
  const stack: Entry[] = [];
  headings.forEach((heading, index) => {
    const entry: Entry = { index, label: heading[2], depth: heading[1].length, children: [] };
    while (stack.length && stack[stack.length - 1].depth >= entry.depth) stack.pop();
    (stack.length ? stack[stack.length - 1].children : roots).push(entry);
    stack.push(entry);
  });
  const outlineList = (entries: Entry[]): React.ReactNode => <ol>{entries.map(entry => <li key={entry.index}><a href={`#${prefix}-${entry.index}`}><InlineMarkdown>{entry.label}</InlineMarkdown></a>{entry.children.length > 0 && outlineList(entry.children)}</li>)}</ol>;
  return <div className="epra-prose">
    {outline && headings.length > 2 && <details className="epra-outline"><summary>In this answer <span>{headings.length} sections</span></summary><nav aria-label="Answer sections">{outlineList(roots)}</nav></details>}
    <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[headingIds, { prefix, firstLevel }], [rehypeKatex, { strict: false, trust: false }]]} components={{ table: ({ children }) => <div className="epra-table-scroll" tabIndex={0}><table>{children}</table></div> }}>{mathMarkdown(children)}</Markdown>
  </div>;
}

export default memo(StudyMarkdown);
