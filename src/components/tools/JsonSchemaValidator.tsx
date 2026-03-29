import React, { useState } from 'react';
import { validateJsonSchema, SAMPLE_SCHEMA, SAMPLE_DATA } from '../../lib/json-schema-utils';
import type { ValidationResult } from '../../lib/json-schema-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function JsonSchemaValidatorInner() {
  const [schemaInput, setSchemaInput] = useState('');
  const [dataInput, setDataInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | undefined>();

  const handleValidate = () => {
    setError(undefined);
    setResult(null);
    const { result: r, error: err } = validateJsonSchema(schemaInput, dataInput);
    if (err) {
      setError(err);
    } else if (r) {
      setResult(r);
    }
  };

  const handleLoadSample = () => {
    setSchemaInput(SAMPLE_SCHEMA);
    setDataInput(SAMPLE_DATA);
    setResult(null);
    setError(undefined);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleValidate}
          className="rounded-md bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:opacity-90"
        >
          Validate
        </button>
        <button
          type="button"
          onClick={handleLoadSample}
          className="rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-5 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
        >
          Load Sample
        </button>
      </div>

      {/* Editors side by side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">JSON Schema</p>
          </div>
          <CodeEditor
            value={schemaInput}
            onChange={(v) => { setSchemaInput(v); setResult(null); setError(undefined); }}
            language="json"
            placeholder={'{\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "type": "object"\n}'}
          />
        </div>
        <div>
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">JSON Data</p>
          </div>
          <CodeEditor
            value={dataInput}
            onChange={(v) => { setDataInput(v); setResult(null); setError(undefined); }}
            language="json"
            placeholder='{"key": "value"}'
          />
        </div>
      </div>

      {/* Results panel */}
      <div className="rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)]">
        <div className="flex h-10 items-center justify-between border-b border-[var(--color-input)] px-4">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Validation Results</p>
          {result && result.valid && (
            <CopyButton text="Valid" />
          )}
        </div>

        <div className="p-4">
          {error && (
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-destructive)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div>
                <span className="font-semibold text-[var(--color-destructive)]">Error</span>
                <p className="mt-0.5 text-sm text-[var(--color-destructive)]/80">{error}</p>
              </div>
            </div>
          )}

          {!error && result === null && (
            <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm">Click Validate to check your JSON data against the schema.</p>
            </div>
          )}

          {result && result.valid && (
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="font-semibold text-[#16a34a]">JSON is valid against the schema</span>
            </div>
          )}

          {result && !result.valid && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 shrink-0 text-[var(--color-destructive)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-semibold text-[var(--color-destructive)]">
                  {result.errors.length} validation error{result.errors.length !== 1 ? 's' : ''} found
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {result.errors.map((err, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-[var(--color-destructive)]/20 bg-[var(--color-destructive)]/5 px-3 py-2"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="rounded bg-[var(--color-destructive)]/10 px-1.5 py-0.5 font-mono text-xs text-[var(--color-destructive)]">
                        {err.path}
                      </code>
                      <span className="rounded border border-[var(--color-destructive)]/20 px-1.5 py-0.5 text-xs text-[var(--color-destructive)]/70">
                        {err.keyword}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-destructive)]/80">{err.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JsonSchemaValidator() {
  return (
    <ToolErrorBoundary>
      <JsonSchemaValidatorInner />
    </ToolErrorBoundary>
  );
}
