import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  // Split content by code blocks: ```lang ... ```
  const parts: React.ReactNode[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  let blockIdx = 0;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push(
        <div key={`text-${blockIdx}`} className="space-y-2">
          {renderFormattedText(textBefore)}
        </div>
      );
    }

    const language = match[1] || 'code';
    const code = match[2];
    parts.push(
      <CodeBlock key={`code-${blockIdx}`} code={code} language={language} />
    );

    lastIndex = match.index + match[0].length;
    blockIdx++;
  }

  const remainingText = content.substring(lastIndex);
  if (remainingText) {
    parts.push(
      <div key={`text-end`} className="space-y-2">
        {renderFormattedText(remainingText)}
      </div>
    );
  }

  return <div className="space-y-3 leading-relaxed text-[15px]">{parts}</div>;
};

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-[#14161A]/12 bg-[#1e2025] text-[#F2F0EA] dark:border-[#F2F0EA]/14 text-xs font-mono">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#14161A]/40 border-b border-white/10 text-white/60">
        <span className="uppercase tracking-wider font-semibold text-[11px]">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[13px] leading-relaxed selection:bg-white/20">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

function renderFormattedText(rawText: string): React.ReactNode[] {
  const lines = rawText.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={key} className="list-disc pl-5 space-y-1 my-1.5">
          {currentList.items.map((it, idx) => (
            <li key={idx}>{renderInlineFormatting(it)}</li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={key} className="list-decimal pl-5 space-y-1 my-1.5">
          {currentList.items.map((it, idx) => (
            <li key={idx}>{renderInlineFormatting(it)}</li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList(`flush-${idx}`);
      elements.push(
        <h4 key={idx} className="font-serif-editorial text-[17px] font-semibold mt-3 mb-1 text-[#14161A] dark:text-[#F2F0EA]">
          {renderInlineFormatting(trimmed.substring(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList(`flush-${idx}`);
      elements.push(
        <h3 key={idx} className="font-serif-editorial text-[19px] font-semibold mt-4 mb-1 text-[#14161A] dark:text-[#F2F0EA]">
          {renderInlineFormatting(trimmed.substring(3))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      flushList(`flush-${idx}`);
      elements.push(
        <h2 key={idx} className="font-serif-editorial text-[21px] font-semibold mt-4 mb-1 text-[#14161A] dark:text-[#F2F0EA]">
          {renderInlineFormatting(trimmed.substring(2))}
        </h2>
      );
      return;
    }

    // Unordered bullet list
    const ulMatch = trimmed.match(/^[-*•]\s+(.+)/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList(`flush-${idx}`);
        currentList = { type: 'ul', items: [ulMatch[1]] };
      } else {
        currentList.items.push(ulMatch[1]);
      }
      return;
    }

    // Ordered numbered list
    const olMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList(`flush-${idx}`);
        currentList = { type: 'ol', items: [olMatch[2]] };
      } else {
        currentList.items.push(olMatch[2]);
      }
      return;
    }

    // Normal paragraph line
    flushList(`flush-${idx}`);
    if (trimmed.length > 0) {
      elements.push(
        <p key={idx} className="my-1 text-[#14161A]/90 dark:text-[#F2F0EA]/90 leading-[1.65]">
          {renderInlineFormatting(line)}
        </p>
      );
    }
  });

  flushList(`flush-end`);
  return elements;
}

function renderInlineFormatting(text: string): React.ReactNode {
  // Handle inline code: `code`
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-[#14161A]/8 dark:bg-[#F2F0EA]/12 font-mono text-[13px] text-[#C8102E] dark:text-[#f87171]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-[#14161A] dark:text-[#F2F0EA]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
