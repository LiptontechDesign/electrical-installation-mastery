import type { ReactNode } from 'react';
import Formula from './formula';
import { engineeringToTex } from './engineering-notation';

function Inline({ children }: { children: string }) {
  const parts = children.split(/(`[^`]+`|\*\*[^*]+\*\*|\$[^$]+\$)/g).filter(Boolean);
  return <>{parts.map((part, index) => {
    if (part.startsWith('`')) return <Formula key={index} tex={engineeringToTex(part.slice(1, -1))}/>;
    if (part.startsWith('$')) return <Formula key={index} tex={part.slice(1, -1)}/>;
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return <span key={index}>{part}</span>;
  })}</>;
}

function Table({ lines }: { lines: string[] }) {
  const cells = (line: string) => line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
  const [header, , ...rows] = lines.map(cells);
  return <div className="assessment-table-wrap"><table><thead><tr>{header.map((cell, index) => <th key={index}><Inline>{cell}</Inline></th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => <td key={index}><Inline>{cell}</Inline></td>)}</tr>)}</tbody></table></div>;
}

export default function AssessmentMarkdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, '').split('\n');
  const blocks: ReactNode[] = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line || /^---$/.test(line)) { index += 1; continue; }
    if (line.startsWith('|') && lines[index + 1]?.includes('---')) {
      const table = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) table.push(lines[index++].trim());
      blocks.push(<Table key={`table-${index}`} lines={table}/>); continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^[-*]\s+/, ''));
      blocks.push(<ul key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}><Inline>{item}</Inline></li>)}</ul>); continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^\d+\.\s+/, ''));
      blocks.push(<ol key={`ordered-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}><Inline>{item}</Inline></li>)}</ol>); continue;
    }
    const paragraph = [line]; index += 1;
    while (index < lines.length && lines[index].trim() && !/^[-*]\s+|^\d+\.\s+|^\|/.test(lines[index].trim())) paragraph.push(lines[index++].trim());
    blocks.push(<p key={`paragraph-${index}`}><Inline>{paragraph.join(' ')}</Inline></p>);
  }
  return <>{blocks}</>;
}
