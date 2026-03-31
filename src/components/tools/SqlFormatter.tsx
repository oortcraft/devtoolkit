import React, { useState } from 'react';
import { formatSql, DIALECT_OPTIONS, type SqlDialect } from '../../lib/sql-formatter-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function SqlFormatterInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [dialect, setDialect] = useState<SqlDialect>('sql');

  const handleAction = (mode: 'format' | 'minify') => {
    if (!input.trim()) {
      setOutput('');
      setError(undefined);
      return;
    }
    const { result, error: err } = formatSql(input, dialect, mode);
    if (err) {
      setError(err);
      setOutput('');
    } else {
      setError(undefined);
      setOutput(result ?? '');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[var(--color-muted-foreground)]">Dialect:</span>
          <div className="flex flex-wrap gap-1 rounded-md bg-[var(--color-secondary)] p-1">
            {DIALECT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={dialect === opt.value}
                aria-label={opt.label + ' dialect'}
                onClick={() => setDialect(opt.value)}
                className={[
                  'rounded px-3 py-1.5 text-sm transition-all',
                  dialect === opt.value
                    ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAction('format')}
            className="rounded-md bg-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:opacity-90"
          >
            Format
          </button>
          <button
            type="button"
            onClick={() => handleAction('minify')}
            className="rounded-md border border-[var(--color-input)] px-4 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
          >
            Minify
          </button>
          <button
            type="button"
            onClick={() => { setInput(''); setOutput(''); setError(undefined); }}
            className="text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">SQL Input</p>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="sql"
            placeholder="Paste SQL to format..."
            error={error}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Formatted SQL</p>
            <CopyButton text={output} />
          </div>
          <CodeEditor
            value={output}
            language="sql"
            readOnly
            placeholder="Formatted output will appear here"
          />
        </div>
      </div>
    </div>
  );
}

export default function SqlFormatter() {
  return (
    <ToolErrorBoundary>
      <SqlFormatterInner />
    </ToolErrorBoundary>
  );
}
