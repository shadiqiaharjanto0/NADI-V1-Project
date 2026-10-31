import React from 'react';

export interface InlineFormatOptions {
  boldClassName?: string;
  isDark?: boolean;
}

/**
 * Parses inline text containing markdown symbols:
 * - **bold** or __bold__ -> <strong>
 * - *italic* or _italic_ -> <em>
 * - `code` -> <code>
 * - Automatically strips any stray or unclosed ** or __ to prevent raw asterisks from showing
 */
export function renderInlineFormatted(
  text: string,
  options?: InlineFormatOptions
): React.ReactNode {
  if (!text) return null;

  const boldClass =
    options?.boldClassName ||
    (options?.isDark ? 'font-semibold text-white' : 'font-semibold text-zinc-900');

  // Tokenize without nested capturing groups
  const tokenRegex = /(\*\*[^*]+?\*\*|__[^_]+?__|\*[^*]+?\*|_[^_]+?_|`[^`]+?`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold (**text**)
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const content = part.slice(2, -2).trim();
      return (
        <strong key={index} className={boldClass}>
          {content}
        </strong>
      );
    }

    // Bold (__text__)
    if (part.startsWith('__') && part.endsWith('__') && part.length >= 4) {
      const content = part.slice(2, -2).trim();
      return (
        <strong key={index} className={boldClass}>
          {content}
        </strong>
      );
    }

    // Italic (*text*)
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const content = part.slice(1, -1).trim();
      return (
        <em key={index} className="italic">
          {content}
        </em>
      );
    }

    // Italic (_text_)
    if (part.startsWith('_') && part.endsWith('_') && part.length >= 2) {
      const content = part.slice(1, -1).trim();
      return (
        <em key={index} className="italic">
          {content}
        </em>
      );
    }

    // Code (`text`)
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const content = part.slice(1, -1);
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 font-mono text-xs"
        >
          {content}
        </code>
      );
    }

    // Regular text: strip any stray unclosed ** or __ so raw asterisks are never shown
    const sanitized = part.replace(/\*\*/g, '').replace(/__/g, '');
    return <span key={index}>{sanitized}</span>;
  });
}

/**
 * Strips all markdown markers and returns clean plain text
 * (Useful for exports, slips, or raw text inputs)
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .trim();
}

export interface FormattedTextProps {
  text: string;
  className?: string;
  boldClassName?: string;
  isDark?: boolean;
}

export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  className = '',
  boldClassName,
  isDark = false,
}) => {
  return (
    <span className={className}>
      {renderInlineFormatted(text, { boldClassName, isDark })}
    </span>
  );
};

export interface MarkdownMessageProps {
  content: string;
  className?: string;
  isDark?: boolean;
}

interface ListBlock {
  type: 'ol' | 'ul';
  items: Array<{ num?: number; text: string }>;
}

/**
 * Comprehensive Markdown Renderer for chat messages and medical guidance.
 * Handles headings, numbered lists, bullet points, and paragraphs with Apple-minimalist styling.
 */
export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  className = '',
  isDark = false,
}) => {
  if (!content) return null;

  // Split content into lines
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];

  let currentList: ListBlock | null = null;
  let blockKey = 0;

  const flushList = () => {
    if (!currentList) return;
    const isOrdered = currentList.type === 'ol';
    const listKey = `list-${blockKey++}`;

    if (isOrdered) {
      blocks.push(
        <ol key={listKey} className="space-y-2 my-2.5 pl-0 list-none">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-mono font-semibold shrink-0 mt-0.5 ${
                  isDark
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}
              >
                {item.num ?? idx + 1}
              </span>
              <div className="flex-1">
                {renderInlineFormatted(item.text, { isDark })}
              </div>
            </li>
          ))}
        </ol>
      );
    } else {
      blocks.push(
        <ul key={listKey} className="space-y-1.5 my-2.5 pl-1 list-none">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                  isDark ? 'bg-zinc-400' : 'bg-zinc-500'
                }`}
              />
              <div className="flex-1">
                {renderInlineFormatted(item.text, { isDark })}
              </div>
            </li>
          ))}
        </ul>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Empty line separates blocks
    if (!trimmed) {
      flushList();
      continue;
    }

    // Numbered list item (e.g. "1. **Lanjutkan Hidrasi:** ..." or "2. Makan Bertahap...")
    const olMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
    if (olMatch) {
      const parsedNum = parseInt(olMatch[1], 10);
      if (currentList && currentList.type !== 'ol') {
        flushList();
      }
      if (!currentList) {
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push({ num: parsedNum, text: olMatch[2] });
      continue;
    }

    // Bullet list item (e.g. "- item", "* item", "• item")
    const ulMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (ulMatch) {
      if (currentList && currentList.type !== 'ul') {
        flushList();
      }
      if (!currentList) {
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push({ text: ulMatch[1] });
      continue;
    }

    // If regular line, flush any active list
    flushList();

    // Headings (### or ## or #)
    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h5
          key={`h5-${blockKey++}`}
          className={`font-semibold text-xs uppercase tracking-wider mt-3 mb-1.5 ${
            isDark ? 'text-zinc-200' : 'text-zinc-900'
          }`}
        >
          {renderInlineFormatted(trimmed.slice(4), { isDark })}
        </h5>
      );
      continue;
    }

    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      blocks.push(
        <h4
          key={`h4-${blockKey++}`}
          className={`font-semibold text-sm mt-3.5 mb-1.5 ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}
        >
          {renderInlineFormatted(headingText, { isDark })}
        </h4>
      );
      continue;
    }

    // Standalone bold line (e.g. "**NADI Health Check**" or "**Keluhan utama:**")
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
      const headingText = trimmed.slice(2, -2).trim();
      blocks.push(
        <div
          key={`lead-bold-${blockKey++}`}
          className={`font-semibold text-xs sm:text-sm tracking-tight mt-2.5 mb-1 ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}
        >
          {headingText}
        </div>
      );
      continue;
    }

    // Regular paragraph
    blocks.push(
      <p
        key={`p-${blockKey++}`}
        className={`leading-relaxed my-1.5 ${
          isDark ? 'text-zinc-200' : 'text-zinc-800'
        }`}
      >
        {renderInlineFormatted(trimmed, { isDark })}
      </p>
    );
  }

  flushList();

  return <div className={`text-xs sm:text-sm space-y-1 ${className}`}>{blocks}</div>;
};
