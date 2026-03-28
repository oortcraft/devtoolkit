import React, { useState } from 'react';
import { formatJson, minifyJson } from '../../lib/json-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

type IndentOption = '2' | '4' | 'tab';

function JsonFormatterInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [indent, setIndent] = useState<IndentOption>('2');

  const getIndentValue = (): number | string => {
    if (indent === 'tab') return '\t';
    return parseInt(indent, 10);
  };

  const handleFormat = () => {
    const { result, error: err } = formatJson(input, getIndentValue());
    if (err) {
      setError(err);
      setOutput('');
    } else {
      setError(undefined);
      setOutput(result ?? '');
    }
  };

  const handleMinify = () => {
    const { result, error: err } = minifyJson(input);
    if (err) {
      setError(err);
      setOutput('');
    } else {
      setError(undefined);
      setOutput(result ?? '');
    }
  };

  const indentOptions: { value: IndentOption; label: string }[] = [
    { value: '2', label: '2 spaces' },
    { value: '4', label: '4 spaces' },
    { value: 'tab', label: 'Tab' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="hidden text-[13px] text-[var(--color-muted-foreground)] sm:inline">Indent:</span>
          <div className="flex flex-1 rounded-md bg-[var(--color-secondary)] p-1 sm:flex-none">
            {indentOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIndent(opt.value)}
                className={[
                  'rounded px-3 py-1.5 text-sm transition-all',
                  indent === opt.value
                    ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleFormat}
            className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:opacity-90"
          >
            Format
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] shadow-sm transition-colors hover:bg-[var(--color-secondary)]"
          >
            Minify
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
            language="json"
            placeholder='Paste your JSON here, e.g. {"key": "value"}'
            error={error}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Output</p>
            <CopyButton text={output} />
          </div>
          <CodeEditor value={output} language="json" readOnly placeholder="Formatted output will appear here" />
        </div>
      </div>
    </div>
  );
}

export default function JsonFormatter() {
  return (
    <ToolErrorBoundary>
      <JsonFormatterInner />
    </ToolErrorBoundary>
  );
}
