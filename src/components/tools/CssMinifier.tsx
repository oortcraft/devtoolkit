import React, { useState, useEffect, useRef } from 'react';
import { minifyCss, getCssStats } from '../../lib/css-minifier-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

type Stats = { originalSize: number; minifiedSize: number; savedPercent: number };

function CssMinifierInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [stats, setStats] = useState<Stats | null>(null);
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
      const { result, error: err } = minifyCss(input);
      if (err) {
        setError(err);
        setOutput('');
        setStats(null);
      } else {
        setError(undefined);
        const minified = result ?? '';
        setOutput(minified);
        setStats(getCssStats(input, minified));
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

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
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            const { result, error: err } = minifyCss(input);
            if (err) {
              setError(err);
              setOutput('');
              setStats(null);
            } else {
              setError(undefined);
              const minified = result ?? '';
              setOutput(minified);
              setStats(getCssStats(input, minified));
            }
          }}
          className="rounded-md bg-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Minify
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] px-4 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background)]"
        >
          Clear
        </button>
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
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Minified CSS</p>
            <CopyButton text={output} />
          </div>
          <CodeEditor
            value={output}
            onChange={() => {}}
            language="css"
            placeholder="Minified output will appear here..."
            readOnly
          />
        </div>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="flex items-center gap-4 rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] px-4 py-2 text-[13px] text-[var(--color-muted-foreground)]">
          <span>Original: <strong className="text-[var(--color-foreground)]">{formatBytes(stats.originalSize)}</strong></span>
          <span className="text-[var(--color-input)]">|</span>
          <span>Minified: <strong className="text-[var(--color-foreground)]">{formatBytes(stats.minifiedSize)}</strong></span>
          <span className="text-[var(--color-input)]">|</span>
          <span>Saved: <strong className="text-[var(--color-foreground)]">{stats.savedPercent}%</strong></span>
        </div>
      )}
    </div>
  );
}

export default function CssMinifier() {
  return (
    <ToolErrorBoundary>
      <CssMinifierInner />
    </ToolErrorBoundary>
  );
}
