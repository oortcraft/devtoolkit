import React, { useState, useEffect, useRef } from 'react';
import { convertCase, CASE_OPTIONS, type CaseType } from '../../lib/case-converter-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function CaseConverterInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [selectedCase, setSelectedCase] = useState<CaseType>('camelCase');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        setError(undefined);
        return;
      }
      const { result, error: err } = convertCase(input, selectedCase);
      if (err) {
        setError(err);
        setOutput('');
      } else {
        setError(undefined);
        setOutput(result ?? '');
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, selectedCase]);

  return (
    <div className="flex flex-col gap-6">
      {/* Case Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-md bg-[var(--color-secondary)] p-1">
          {CASE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selectedCase === opt.value}
              aria-label={opt.label + ' case'}
              onClick={() => setSelectedCase(opt.value)}
              className={[
                'rounded px-3 py-1.5 text-sm transition-all',
                selectedCase === opt.value
                  ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => { setInput(''); setOutput(''); setError(undefined); }}
            className="text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Editors */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Input</p>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="text"
            placeholder="Type or paste text to convert..."
            error={error}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Output</p>
            <CopyButton text={output} />
          </div>
          <CodeEditor value={output} language="text" readOnly placeholder="Converted output will appear here" />
        </div>
      </div>
    </div>
  );
}

export default function CaseConverter() {
  return (
    <ToolErrorBoundary>
      <CaseConverterInner />
    </ToolErrorBoundary>
  );
}
