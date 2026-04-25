import React, { useState, useEffect, useRef } from 'react';
import { generateHash } from '../../lib/hash-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

type Algorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';
const algorithms: Algorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

interface HashGeneratorProps {
  initialValue?: string;
  initialAlgorithm?: Algorithm;
}

function HashGeneratorInner({ initialValue, initialAlgorithm }: HashGeneratorProps) {
  const [input, setInput] = useState(initialValue ?? '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [algorithm, setAlgorithm] = useState<Algorithm>(initialAlgorithm ?? 'SHA-256');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!input) {
        setOutput('');
        setError(undefined);
        return;
      }
      const { result, error: err } = await generateHash(input, algorithm);
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
  }, [input, algorithm]);

  return (
    <div className="flex flex-col gap-6">
      {/* Algorithm Tabs */}
      <div className="flex rounded-md bg-[var(--color-secondary)] p-1">
        {algorithms.map((alg) => (
          <button
            key={alg}
            type="button"
            onClick={() => setAlgorithm(alg)}
            className={[
              'flex-1 rounded px-3 py-1.5 text-sm transition-all',
              algorithm === alg
                ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
            ].join(' ')}
          >
            {alg}
          </button>
        ))}
      </div>

      {/* Input */}
      <div>
        <div className="mb-2 flex h-8 items-center">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Input Text</p>
        </div>
        <CodeEditor
          value={input}
          onChange={setInput}
          language="text"
          placeholder="Type or paste text to hash..."
          error={error}
        />
      </div>

      {/* Output */}
      <div>
        <div className="mb-2 flex h-8 items-center justify-between">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">{algorithm} Hash</p>
          <CopyButton text={output} />
        </div>
        <div className="rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] p-4">
          <p className="break-all font-mono text-sm text-[var(--color-foreground)]">
            {output || <span className="text-[var(--color-muted-foreground)]">Hash will appear here...</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HashGenerator({ initialValue, initialAlgorithm }: HashGeneratorProps = {}) {
  return (
    <ToolErrorBoundary>
      <HashGeneratorInner initialValue={initialValue} initialAlgorithm={initialAlgorithm} />
    </ToolErrorBoundary>
  );
}
