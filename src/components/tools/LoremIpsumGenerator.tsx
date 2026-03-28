import React, { useState, useEffect } from 'react';
import { generateLoremIpsum } from '../../lib/hash-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function LoremIpsumInner() {
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  useEffect(() => {
    setOutput(generateLoremIpsum(count));
  }, []);

  const handleGenerate = () => {
    setOutput(generateLoremIpsum(count));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label htmlFor="para-count" className="text-[13px] font-medium text-[var(--color-muted-foreground)]">
            Paragraphs:
          </label>
          <select
            id="para-count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-1.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:opacity-90"
          >
            Generate
          </button>
        </div>
        <CopyButton text={output} />
      </div>

      {/* Output */}
      <CodeEditor value={output} language="text" readOnly placeholder="Click Generate to create lorem ipsum text" />
    </div>
  );
}

export default function LoremIpsumGenerator() {
  return (
    <ToolErrorBoundary>
      <LoremIpsumInner />
    </ToolErrorBoundary>
  );
}
