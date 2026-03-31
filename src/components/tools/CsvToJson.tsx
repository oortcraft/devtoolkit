import React, { useState, useEffect, useRef } from 'react';
import { csvToJson } from '../../lib/csv-to-json-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function CsvToJsonInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [hasHeader, setHasHeader] = useState(true);
  const [typeInference, setTypeInference] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        setError(undefined);
        setRowCount(0);
        return;
      }
      const { result, error: err, rows } = csvToJson(input, { header: hasHeader, typeInference });
      if (err) {
        setError(err);
        setOutput('');
        setRowCount(0);
      } else {
        setError(undefined);
        setOutput(result ?? '');
        setRowCount(rows ?? 0);
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, hasHeader, typeInference]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-pressed={hasHeader}
            onClick={() => setHasHeader(!hasHeader)}
            className={[
              'rounded-md px-3 py-1.5 text-sm transition-all border',
              hasHeader
                ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-transparent font-medium'
                : 'border-[var(--color-input)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
            ].join(' ')}
          >
            Header Row
          </button>
          <button
            type="button"
            aria-pressed={typeInference}
            onClick={() => setTypeInference(!typeInference)}
            className={[
              'rounded-md px-3 py-1.5 text-sm transition-all border',
              typeInference
                ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-transparent font-medium'
                : 'border-[var(--color-input)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
            ].join(' ')}
          >
            Type Inference
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => { setInput(''); setOutput(''); setError(undefined); setRowCount(0); }}
            className="text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">CSV Input</p>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="text"
            placeholder="Paste CSV data here..."
            error={error}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">JSON Output</p>
              {rowCount > 0 && (
                <span className="rounded-full bg-[var(--color-secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-muted-foreground)]">
                  {rowCount} rows
                </span>
              )}
            </div>
            <CopyButton text={output} />
          </div>
          <CodeEditor value={output} language="json" readOnly placeholder="JSON output will appear here" />
        </div>
      </div>
    </div>
  );
}

export default function CsvToJson() {
  return (
    <ToolErrorBoundary>
      <CsvToJsonInner />
    </ToolErrorBoundary>
  );
}
