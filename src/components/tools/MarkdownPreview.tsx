import React, { useState, useEffect, useRef } from 'react';
import { renderMarkdown } from '../../lib/markdown-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

const PLACEHOLDER = `# Hello, Markdown!

Type or paste **Markdown** here to see a live preview.

- Item one
- Item two

> Blockquote example

\`\`\`js
console.log('code block');
\`\`\`
`;

function MarkdownPreviewInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input) {
        setOutput('');
        setError(undefined);
        return;
      }
      const { result, error: err } = renderMarkdown(input);
      if (err) {
        setError(err);
        setOutput('');
      } else {
        setError(undefined);
        setOutput(result ?? '');
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile tab bar */}
      <div className="flex rounded-md bg-[var(--color-secondary)] p-1 sm:hidden">
        {(['edit', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMobileTab(tab)}
            className={[
              'flex-1 rounded px-3 py-1.5 text-sm capitalize transition-all',
              mobileTab === tab
                ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Split view */}
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        {/* Left: Editor */}
        <div className={['flex-1', mobileTab === 'preview' ? 'hidden sm:flex sm:flex-col' : 'flex flex-col'].join(' ')}>
          <div className="mb-2 flex h-8 items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Markdown Input</p>
            <button
              type="button"
              onClick={() => setInput('')}
              className="text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Clear
            </button>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="markdown"
            placeholder={PLACEHOLDER}
            error={error}
          />
        </div>

        {/* Right: Preview */}
        <div className={['flex-1', mobileTab === 'edit' ? 'hidden sm:flex sm:flex-col' : 'flex flex-col'].join(' ')}>
          <div className="mb-2 flex h-8 items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Preview</p>
            <CopyButton text={output} />
          </div>
          <div className="min-h-[200px] rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] p-4 overflow-auto">
            {output ? (
              <div
                className="prose-markdown text-[var(--color-foreground)] text-sm"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <p className="text-[var(--color-muted-foreground)] text-sm">Preview will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarkdownPreview() {
  return (
    <ToolErrorBoundary>
      <MarkdownPreviewInner />
    </ToolErrorBoundary>
  );
}
