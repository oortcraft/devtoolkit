import React, { useState } from 'react';
import { validateJson } from '../../lib/json-utils';
import CodeEditor from './CodeEditor';
import ToolErrorBoundary from './ToolErrorBoundary';

type ValidationResult =
  | { state: 'idle' }
  | { state: 'valid'; stats: { keys: number; depth: number; arrayLength: number } }
  | { state: 'invalid'; error: string };

function JsonValidatorInner() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult>({ state: 'idle' });

  const handleValidate = () => {
    const { valid, error, stats } = validateJson(input);
    if (valid && stats) {
      setResult({ state: 'valid', stats });
    } else {
      setResult({ state: 'invalid', error: error ?? 'Unknown error' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          type="button"
          onClick={handleValidate}
          className="rounded-md bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:opacity-90"
        >
          Validate
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={(v) => {
          setInput(v);
          setResult({ state: 'idle' });
        }}
        language="json"
        placeholder='Paste your JSON here, e.g. {"key": "value"}'
        error={result.state === 'invalid' ? result.error : undefined}
      />

      {result.state !== 'idle' && (
        <div
          className={[
            'rounded-md border px-4 py-3',
            result.state === 'valid'
              ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/5'
              : 'border-[var(--color-destructive)]/30 bg-[var(--color-destructive)]/5',
          ].join(' ')}
        >
          {result.state === 'valid' ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="font-semibold text-[var(--color-success)]">Valid JSON</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--color-success)]">
                <span><span className="font-medium">{result.stats.keys}</span> key{result.stats.keys !== 1 ? 's' : ''}</span>
                <span><span className="font-medium">{result.stats.depth}</span> depth</span>
                {result.stats.arrayLength > 0 && (
                  <span><span className="font-medium">{result.stats.arrayLength}</span> item{result.stats.arrayLength !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-destructive)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div>
                <span className="font-semibold text-[var(--color-destructive)]">Invalid JSON</span>
                <p className="mt-0.5 text-sm text-[var(--color-destructive)]/80">{result.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function JsonValidator() {
  return (
    <ToolErrorBoundary>
      <JsonValidatorInner />
    </ToolErrorBoundary>
  );
}
