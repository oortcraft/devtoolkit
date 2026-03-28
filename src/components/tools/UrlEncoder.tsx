import React, { useState, useEffect, useRef } from 'react';
import { urlEncode, urlDecode } from '../../lib/encoding-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

type Mode = 'encode' | 'decode';

function UrlEncoderInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [mode, setMode] = useState<Mode>('encode');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        setError(undefined);
        return;
      }
      const fn = mode === 'encode' ? urlEncode : urlDecode;
      const { result, error: err } = fn(input);
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
  }, [input, mode]);

  const inputLabel = mode === 'encode' ? 'Plain Text' : 'URL Encoded Input';
  const outputLabel = mode === 'encode' ? 'URL Encoded Output' : 'Plain Text Output';

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-md bg-[var(--color-secondary)] p-1">
          <button
            type="button"
            onClick={() => { setMode('encode'); setInput(''); }}
            className={[
              'flex-1 rounded px-4 py-1.5 text-sm transition-all sm:flex-none',
              mode === 'encode'
                ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
            ].join(' ')}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => { setMode('decode'); setInput(''); }}
            className={[
              'flex-1 rounded px-4 py-1.5 text-sm transition-all sm:flex-none',
              mode === 'decode'
                ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
            ].join(' ')}
          >
            Decode
          </button>
        </div>
      </div>

      {/* Editors */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">{inputLabel}</p>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="text"
            placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Paste URL-encoded string to decode...'}
            error={error}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">{outputLabel}</p>
            <CopyButton text={output} />
          </div>
          <CodeEditor value={output} language="text" readOnly placeholder="Output will appear here as you type" />
        </div>
      </div>
    </div>
  );
}

export default function UrlEncoder() {
  return (
    <ToolErrorBoundary>
      <UrlEncoderInner />
    </ToolErrorBoundary>
  );
}
