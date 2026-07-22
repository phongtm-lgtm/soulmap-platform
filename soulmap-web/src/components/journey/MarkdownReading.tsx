import type { ReactNode } from 'react';

interface MarkdownReadingProps {
  content: string;
  accentColor?: string;
  scrollable?: boolean;
}

export interface MarkdownHeading {
  id: string;
  label: string;
}

export function markdownHeadingId(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function extractPrimaryHeadings(content: string): MarkdownHeading[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^#\s+/.test(line))
    .map((line) => line.replace(/^#\s+/, '').trim())
    .map((label) => ({ id: markdownHeadingId(label), label }));
}

function renderInline(value: string): ReactNode[] {
  return value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-extrabold text-[#2F342F]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="rounded bg-[#EFE8DA] px-1.5 py-0.5 font-mono text-[0.88em] text-[#76501E]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function isTableRow(line: string) {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.endsWith('|');
}

function parseTableRow(line: string) {
  return line.trim().slice(1, -1).split('|').map((cell) => cell.trim());
}

function isTableDivider(line: string) {
  return parseTableRow(line).every((cell) => /^:?-{3,}:?$/.test(cell));
}

export default function MarkdownReading({ content, accentColor = '#A66D24', scrollable = false }: MarkdownReadingProps) {
  const lines = content.split('\n');
  const blocks: ReactNode[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) {
      blocks.push(<div key={`space-${index}`} className="h-3" />);
      continue;
    }

    if (isTableRow(line) && index + 1 < lines.length && isTableRow(lines[index + 1]) && isTableDivider(lines[index + 1])) {
      const headers = parseTableRow(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      index -= 1;
      blocks.push(
        <div key={`table-${index}`} className="my-6 overflow-x-auto rounded-2xl border border-[#E8DFCF] bg-white shadow-sm">
          <table className="min-w-[720px] w-full border-collapse text-left font-sans text-[0.86rem]">
            <thead style={{ backgroundColor: `${accentColor}14` }}>
              <tr>{headers.map((header, cellIndex) => <th key={cellIndex} className="border-b border-[#E8DFCF] px-4 py-3 font-extrabold text-[#3A2A1E]">{renderInline(header)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[#EFE9DB] last:border-none odd:bg-[#FFFCF8]">
                  {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top leading-relaxed text-[#525953]">{renderInline(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const label = heading[2].trim();
      const id = markdownHeadingId(label);
      if (level === 1) {
        blocks.push(<h2 id={id} key={index} className="scroll-mt-28 border-t border-[#E8DFCF] pt-10 first:border-none first:pt-0 font-display text-[2rem] font-bold leading-tight text-[#2E3E33] md:text-[2.5rem]">{renderInline(label)}</h2>);
      } else if (level === 2) {
        blocks.push(<h3 id={id} key={index} className="scroll-mt-28 mt-7 font-display text-[1.55rem] font-bold leading-tight" style={{ color: accentColor }}>{renderInline(label)}</h3>);
      } else {
        blocks.push(<h4 id={id} key={index} className="scroll-mt-28 mt-5 font-sans text-[1.02rem] font-extrabold uppercase tracking-[0.04em] text-[#3A443D]">{renderInline(label)}</h4>);
      }
      continue;
    }

    if (line.startsWith('>')) {
      blocks.push(<blockquote key={index} className="my-5 rounded-r-2xl border-l-4 bg-[#FCF5EA] px-5 py-4 font-display text-[1.08rem] font-semibold italic leading-relaxed text-[#4A2D1F]" style={{ borderColor: accentColor }}>{renderInline(line.replace(/^>\s?/, ''))}</blockquote>);
      continue;
    }

    const numbered = line.match(/^(\d+)\.\s+(.+)$/);
    if (numbered) {
      blocks.push(
        <div key={index} className="my-2 flex items-start gap-3 font-reading text-[1rem] leading-[1.8] text-[#4c534d]">
          <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.72rem] font-extrabold text-white" style={{ backgroundColor: accentColor }}>{numbered[1]}</span>
          <p>{renderInline(numbered[2])}</p>
        </div>,
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      blocks.push(
        <div key={index} className="my-2 flex items-start gap-3 pl-1 font-reading text-[1rem] leading-[1.8] text-[#4c534d]">
          <span className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} />
          <p>{renderInline(line.replace(/^[-*]\s+/, ''))}</p>
        </div>,
      );
      continue;
    }

    if (/^---+$/.test(line)) {
      blocks.push(<hr key={index} className="my-8 border-[#E8DFCF]" />);
      continue;
    }

    blocks.push(<p key={index} className="font-reading text-[1rem] leading-[1.85] text-[#4c534d]">{renderInline(line)}</p>);
  }

  return (
    <div className={`${scrollable ? 'max-h-[520px] overflow-y-auto pr-2 custom-scrollbar' : ''} space-y-1`}>
      {blocks}
    </div>
  );
}
