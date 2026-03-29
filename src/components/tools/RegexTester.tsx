import React, { useState, useMemo } from 'react';
import { testRegex } from '../../lib/regex-utils';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

const FLAG_OPTIONS = [
  { flag: 'g', label: 'g', title: 'Global — find all matches' },
  { flag: 'i', label: 'i', title: 'Case insensitive' },
  { flag: 'm', label: 'm', title: 'Multiline — ^ and $ match line boundaries' },
  { flag: 's', label: 's', title: 'Dot all — . matches newlines' },
];

function RegexTesterInner() {
  const [pattern, setPattern] = useState('');
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set(['g']));
  const [testString, setTestString] = useState('');

  const flags = Array.from(activeFlags).join('');

  const result = useMemo(
    () => testRegex(pattern, flags, testString),
    [pattern, flags, testString],
  );

  function toggleFlag(flag: string) {
    setActiveFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) {
        next.delete(flag);
      } else {
        next.add(flag);
      }
      return next;
    });
  }

  const hasInput = pattern.length > 0 && testString.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Pattern Input */}
      <div>
        <div className="mb-2 flex h-8 items-center justify-between">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">
            Regular Expression
          </p>
          <div className="flex items-center gap-1">
            {FLAG_OPTIONS.map(({ flag, label, title }) => (
              <button
                key={flag}
                type="button"
                title={title}
                onClick={() => toggleFlag(flag)}
                className={[
                  'rounded px-2 py-0.5 font-mono text-xs transition-colors',
                  activeFlags.has(flag)
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center rounded-md border border-[var(--color-input)] bg-[var(--color-background)] focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20"
          style={result.error ? { borderColor: 'var(--color-destructive)' } : undefined}
        >
          <span className="select-none px-3 font-mono text-sm text-[var(--color-muted-foreground)]">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="pattern"
            spellCheck={false}
            className="flex-1 bg-transparent py-2.5 font-mono text-[13px] text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted-foreground)]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
          <span className="select-none px-3 font-mono text-sm text-[var(--color-muted-foreground)]">
            /{flags}
          </span>
        </div>
        {result.error && (
          <p className="mt-1 flex items-start gap-1 text-sm text-[var(--color-destructive)]">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {result.error}
          </p>
        )}
      </div>

      {/* Test String */}
      <div>
        <div className="mb-2 flex h-8 items-center">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Test String</p>
        </div>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={5}
          placeholder="Enter text to test against the regex..."
          spellCheck={false}
          className={[
            'w-full resize-none rounded-md border p-3 font-mono text-[13px] leading-relaxed outline-none transition-colors',
            'bg-[var(--color-background)] text-[var(--color-foreground)]',
            'placeholder:text-[var(--color-muted-foreground)]',
            'border-[var(--color-input)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-0',
          ].join(' ')}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        />
      </div>

      {/* Results */}
      {hasInput && !result.error && (
        <div>
          <div className="mb-2 flex h-8 items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">
              {result.count === 0
                ? 'No matches found'
                : `${result.count} match${result.count !== 1 ? 'es' : ''} found`}
            </p>
          </div>

          {result.count > 0 ? (
            <div className="flex flex-col gap-2">
              {result.matches.map((m, i) => (
                <div
                  key={i}
                  className="rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="shrink-0 rounded bg-[var(--color-primary)]/10 px-1.5 py-0.5 font-mono text-[11px] text-[var(--color-primary)]">
                          Match {i + 1}
                        </span>
                        <span className="text-[11px] text-[var(--color-muted-foreground)]">
                          index {m.index}–{m.index + m.match.length}
                        </span>
                      </div>
                      <pre className="overflow-x-auto font-mono text-[13px] text-[var(--color-foreground)] whitespace-pre-wrap break-all">
                        {m.match || <span className="text-[var(--color-muted-foreground)]">(empty match)</span>}
                      </pre>
                      {m.subgroups.length > 0 && (
                        <div className="flex flex-col gap-0.5 pt-1">
                          {m.subgroups.map((g, gi) => (
                            <p key={gi} className="font-mono text-[12px] text-[var(--color-muted-foreground)]">
                              Group {gi + 1}:{' '}
                              <span className="text-[var(--color-foreground)]">
                                {g === undefined ? <em>undefined</em> : g}
                              </span>
                            </p>
                          ))}
                        </div>
                      )}
                      {m.groups && Object.keys(m.groups).length > 0 && (
                        <div className="flex flex-col gap-0.5 pt-1">
                          {Object.entries(m.groups).map(([name, val]) => (
                            <p key={name} className="font-mono text-[12px] text-[var(--color-muted-foreground)]">
                              Named group <span className="text-[var(--color-foreground)]">{name}</span>:{' '}
                              <span className="text-[var(--color-foreground)]">{val}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      <CopyButton text={m.match} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] p-4">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                The pattern did not match any part of the test string.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RegexTester() {
  return (
    <ToolErrorBoundary>
      <RegexTesterInner />
    </ToolErrorBoundary>
  );
}
