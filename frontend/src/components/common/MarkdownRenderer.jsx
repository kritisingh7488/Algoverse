import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';

/**
 * Custom Secure Markdown Renderer for AlgoVerse
 * Supports headings, code blocks with syntax styling & copy button, inline code,
 * bold/italic/strikethrough, lists, blockquotes, links, and tables.
 */
export const MarkdownRenderer = ({ content = '', className = '' }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!content || typeof content !== 'string') return null;

  // Sanitize against dangerous raw script tags
  const sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to parse inline styles (bold, italic, code, links)
  const renderInline = (text) => {
    if (!text) return null;

    // Tokenize for inline patterns
    const tokens = [];
    let remaining = text;
    let keyCounter = 0;

    while (remaining.length > 0) {
      // 1. Inline code: `code`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        tokens.push(
          <code
            key={`inline-code-${keyCounter++}`}
            className="px-1.5 py-0.5 rounded bg-surface border border-borderTheme text-primary font-mono text-[12px] font-semibold"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // 2. Bold + Italic: ***text***
      const boldItalicMatch = remaining.match(/^\*\*\*([^*]+)\*\*\*/);
      if (boldItalicMatch) {
        tokens.push(
          <strong key={`bi-${keyCounter++}`} className="font-bold italic text-textPrimary">
            {boldItalicMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldItalicMatch[0].length);
        continue;
      }

      // 3. Bold: **text** or __text__
      const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
      if (boldMatch) {
        tokens.push(
          <strong key={`b-${keyCounter++}`} className="font-bold text-textPrimary">
            {boldMatch[2]}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // 4. Italic: *text* or _text_
      const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
      if (italicMatch) {
        tokens.push(
          <em key={`i-${keyCounter++}`} className="italic text-textPrimary">
            {italicMatch[2]}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // 5. Strikethrough: ~~text~~
      const strikeMatch = remaining.match(/^~~(.*?)~~/);
      if (strikeMatch) {
        tokens.push(
          <del key={`s-${keyCounter++}`} className="line-through text-textSecondary opacity-80">
            {strikeMatch[1]}
          </del>
        );
        remaining = remaining.slice(strikeMatch[0].length);
        continue;
      }

      // 6. Links: [label](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const isExternal = linkMatch[2].startsWith('http');
        tokens.push(
          <a
            key={`link-${keyCounter++}`}
            href={linkMatch[2]}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : ''}
            className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
          >
            <span>{linkMatch[1]}</span>
            {isExternal && <ExternalLink className="w-3 h-3 inline opacity-70" />}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Regular text character chunk until next markdown symbol
      const nextSpecial = remaining.search(/[`*_~\[]/);
      if (nextSpecial === -1) {
        tokens.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        tokens.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        tokens.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return tokens;
  };

  // Block Level Parsing
  const lines = sanitized.split('\n');
  const blocks = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = '';
  let inList = false;
  let listItems = [];
  let isOrderedList = false;
  let inTable = false;
  let tableRows = [];
  let codeBlockIndex = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      if (isOrderedList) {
        blocks.push(
          <ol key={`ol-${blocks.length}`} className="list-decimal list-inside space-y-1 my-2 pl-2 text-xs sm:text-sm text-textSecondary font-body leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="pl-1">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        blocks.push(
          <ul key={`ul-${blocks.length}`} className="list-disc list-inside space-y-1 my-2 pl-2 text-xs sm:text-sm text-textSecondary font-body leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="pl-1">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(2); // Skip separator row (e.g. |---|---|)

      blocks.push(
        <div key={`table-wrapper-${blocks.length}`} className="overflow-x-auto my-3 rounded-lg border border-borderTheme shadow-xs">
          <table className="min-w-full text-xs font-body text-left">
            <thead className="bg-surface border-b border-borderTheme text-textPrimary font-heading font-bold">
              <tr>
                {headerRow.map((cell, cIdx) => (
                  <th key={cIdx} className="px-3 py-2 border-r border-borderTheme last:border-r-0">
                    {renderInline(cell.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-borderTheme bg-card">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-surface/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 border-r border-borderTheme last:border-r-0 text-textSecondary">
                      {renderInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check Code Block Start/End: ```language
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        flushList();
        flushTable();
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim() || 'code';
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        const fullCode = codeBuffer.join('\n');
        const currentIdx = codeBlockIndex++;
        blocks.push(
          <div key={`codeblock-${blocks.length}`} className="my-3 rounded-xl overflow-hidden border border-borderTheme bg-dark/95 shadow-soft">
            <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-white/10 text-[11px] font-mono text-textSecondary">
              <span className="flex items-center gap-1.5 text-textPrimary font-semibold">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>{codeLang}</span>
              </span>
              <button
                onClick={() => copyToClipboard(fullCode, currentIdx)}
                className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 text-textSecondary hover:text-textPrimary transition-colors text-[10px]"
              >
                {copiedIndex === currentIdx ? (
                  <>
                    <Check className="w-3 h-3 text-success" />
                    <span className="text-success font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 text-xs sm:text-[13px] font-mono leading-relaxed text-emerald-300 overflow-x-auto selection:bg-primary/30">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Check Tables: | col1 | col2 |
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      inTable = true;
      const cells = line.split('|').slice(1, -1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Check Lists: - item or 1. item
    const unorderMatch = line.match(/^(\s*)[*-]\s+(.+)/);
    const orderMatch = line.match(/^(\s*)\d+\.\s+(.+)/);
    if (unorderMatch || orderMatch) {
      if (!inList) {
        inList = true;
        isOrderedList = !!orderMatch;
        listItems = [];
      }
      listItems.push((unorderMatch ? unorderMatch[2] : orderMatch[2]).trim());
      continue;
    } else if (inList) {
      flushList();
    }

    // Check Headings: #, ##, ###, ####
    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={`h1-${blocks.length}`} className="text-lg sm:text-xl font-heading font-bold text-textPrimary my-3 pb-1 border-b border-borderTheme">
          {renderInline(line.slice(2).trim())}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="text-base sm:text-lg font-heading font-bold text-textPrimary my-2.5">
          {renderInline(line.slice(3).trim())}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="text-sm sm:text-base font-heading font-bold text-textPrimary my-2">
          {renderInline(line.slice(4).trim())}
        </h3>
      );
      continue;
    }
    if (line.startsWith('#### ')) {
      blocks.push(
        <h4 key={`h4-${blocks.length}`} className="text-xs sm:text-sm font-heading font-bold text-textPrimary my-1.5">
          {renderInline(line.slice(5).trim())}
        </h4>
      );
      continue;
    }

    // Check Blockquote: > text
    if (line.startsWith('> ')) {
      blocks.push(
        <blockquote key={`quote-${blocks.length}`} className="my-2.5 pl-3.5 py-1.5 border-l-4 border-primary/60 bg-primary/5 rounded-r-lg text-xs sm:text-sm text-textSecondary font-body italic">
          {renderInline(line.slice(2).trim())}
        </blockquote>
      );
      continue;
    }

    // Empty lines / Paragraph breaks
    if (!line.trim()) {
      blocks.push(<div key={`spacer-${blocks.length}`} className="h-1.5" />);
      continue;
    }

    // Standard Paragraph
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-xs sm:text-sm text-textSecondary font-body leading-relaxed my-1">
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className={`prose-sm max-w-none font-body ${className}`}>{blocks}</div>;
};

export default MarkdownRenderer;
