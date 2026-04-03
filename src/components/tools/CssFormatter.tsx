import React, { useState, useEffect, useRef } from 'react';
import { beautifyCss, getCssFormatterStats } from '../../lib/css-formatter-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

type IndentOption = 2 | 4 | 'tab';
type Stats = { originalSize: number; formattedSize: number; linesAdded: number };

const INDENT_OPTIONS: { label: string; value: IndentOption }[] = [
  { label: '2 Spaces', value: 2 },
  { label: '4 Spaces', value: 4 },
  { label: 'Tab', value: 'tab' },
];

function CssFormatterInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [indent, setIndent] = useState<IndentOption>(2);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input) {
        setOutput('');
        setError(undefined);
        setStats(null);
        return;
      }
      const { result, error: err } = beautifyCss(input, indent);
      if (err) {
        setError(err);
        setOutput('');
        setStats(null);
      } else {
        setError(undefined);
        const formatted = result ?? '';
        setOutput(formatted);
        setStats(getCssFormatterStats(input, formatted));
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, indent]);

  function handleClear() {
    setInput('');
    setOutput('');
    setError(undefined);
    setStats(null);
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            const { result, error: err } = beautifyCss(input, indent);
            if (err) {
              setError(err);
              setOutput('');
              setStats(null);
            } else {
              setError(undefined);
              const formatted = result ?? '';
              setOutput(formatted);
              setStats(getCssFormatterStats(input, formatted));
            }
          }}
          className="rounded-md bg-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Format
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] px-4 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background)]"
        >
          Clear
        </button>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-[13px] text-[var(--color-muted-foreground)]">Indent:</span>
          <select
            value={String(indent)}
            onChange={(e) => {
              const val = e.target.value;
              setIndent(val === 'tab' ? 'tab' : (Number(val) as 2 | 4));
            }}
            className="rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-2 py-1.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            {INDENT_OPTIONS.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input */}
        <div>
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Input CSS</p>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="css"
            placeholder="Paste your CSS here..."
            error={error}
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 flex h-8 items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Formatted CSS</p>
            <CopyButton text={output} />
          </div>
          <CodeEditor
            value={output}
            onChange={() => {}}
            language="css"
            placeholder="Formatted output will appear here..."
            readOnly
          />
        </div>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="flex items-center gap-4 rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] px-4 py-2 text-[13px] text-[var(--color-muted-foreground)]">
          <span>Original: <strong className="text-[var(--color-foreground)]">{formatBytes(stats.originalSize)}</strong></span>
          <span className="text-[var(--color-input)]">|</span>
          <span>Formatted: <strong className="text-[var(--color-foreground)]">{formatBytes(stats.formattedSize)}</strong></span>
          <span className="text-[var(--color-input)]">|</span>
          <span>Lines added: <strong className="text-[var(--color-foreground)]">{stats.linesAdded}</strong></span>
        </div>
      )}
    </div>
  );
}

export default function CssFormatter() {
  return (
    <ToolErrorBoundary>
      <CssFormatterInner />
    </ToolErrorBoundary>
  );
}
