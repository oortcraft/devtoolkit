import React, { useState } from 'react';
import { generateUuid } from '../../lib/encoding-utils';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

type Version = 'v4' | 'v1';

function UuidGeneratorInner() {
  const [version, setVersion] = useState<Version>('v4');
  const [current, setCurrent] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  function handleGenerate() {
    const uuid = generateUuid(version);
    setCurrent(uuid);
    setHistory((prev) => [uuid, ...prev].slice(0, 5));
  }

  function handleClearHistory() {
    setHistory([]);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Version Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Version:</span>
        <div className="flex rounded-md bg-[var(--color-secondary)] p-1">
          {(['v4', 'v1'] as Version[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVersion(v)}
              className={[
                'rounded px-4 py-1.5 text-sm transition-all',
                version === v
                  ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
              ].join(' ')}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* UUID Display */}
      <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Generated UUID</p>
        <p className={[
          'break-all font-mono text-lg font-semibold tracking-wide',
          current ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)]',
        ].join(' ')}>
          {current || 'Click "Generate" to create a UUID'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-md bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary)]/90"
          >
            Generate
          </button>
          <CopyButton text={current} />
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Recent UUIDs</p>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-[13px] text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
            >
              Clear history
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {history.map((uuid, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5"
              >
                <span className="font-mono text-sm text-[var(--color-foreground)]">{uuid}</span>
                <CopyButton text={uuid} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function UuidGenerator() {
  return (
    <ToolErrorBoundary>
      <UuidGeneratorInner />
    </ToolErrorBoundary>
  );
}
