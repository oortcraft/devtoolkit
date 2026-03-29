import React, { useMemo } from 'react';
import { computeDiff, computeStats } from '../../lib/diff-utils';
import ToolErrorBoundary from './ToolErrorBoundary';

const textareaClass = [
  'w-full resize-none rounded-md border p-3 font-mono text-[13px] leading-relaxed outline-none transition-colors',
  'bg-[var(--color-background)] text-[var(--color-foreground)]',
  'placeholder:text-[var(--color-muted-foreground)]',
  'border-[var(--color-input)] focus:border-[var(--color-primary)]',
  'focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-0',
].join(' ');

function DiffCheckerInner() {
  const [textA, setTextA] = React.useState('');
  const [textB, setTextB] = React.useState('');

  const diffLines = useMemo(() => computeDiff(textA, textB), [textA, textB]);
  const stats = useMemo(() => computeStats(diffLines), [diffLines]);

  const hasInput = textA !== '' || textB !== '';
  const hasDiff = diffLines.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Original</p>
          </div>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            rows={10}
            placeholder="Paste original text here..."
            spellCheck={false}
            className={textareaClass}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <div>
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Modified</p>
          </div>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            rows={10}
            placeholder="Paste modified text here..."
            spellCheck={false}
            className={textareaClass}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
      </div>

      {/* Stats */}
      {hasInput && hasDiff && (
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[12px] font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            +{stats.added} addition{stats.added !== 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-[12px] font-semibold text-red-700">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            -{stats.removed} deletion{stats.removed !== 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-secondary)] px-3 py-1 text-[12px] font-semibold text-[var(--color-muted-foreground)]">
            {stats.unchanged} unchanged
          </span>
        </div>
      )}

      {/* Diff Output */}
      {hasInput && hasDiff && (
        <div className="overflow-hidden rounded-md border border-[var(--color-input)]">
          <div className="flex items-center justify-between border-b border-[var(--color-input)] bg-[var(--color-secondary)] px-4 py-2">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Diff</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[13px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <tbody>
                {diffLines.map((line, idx) => {
                  const isAdded = line.type === 'added';
                  const isRemoved = line.type === 'removed';
                  const rowBg = isAdded
                    ? 'bg-green-50'
                    : isRemoved
                    ? 'bg-red-50'
                    : 'bg-[var(--color-background)]';
                  const textColor = isAdded
                    ? 'text-green-800'
                    : isRemoved
                    ? 'text-red-800'
                    : 'text-[var(--color-foreground)]';
                  const lineNumColor = isAdded
                    ? 'text-green-400 bg-green-50'
                    : isRemoved
                    ? 'text-red-400 bg-red-50'
                    : 'text-[var(--color-muted-foreground)] bg-[var(--color-secondary)]';
                  const prefix = isAdded ? '+' : isRemoved ? '-' : ' ';

                  return (
                    <tr key={idx} className={rowBg}>
                      <td className={`select-none border-r border-[var(--color-input)] px-3 py-0.5 text-right text-[11px] ${lineNumColor} w-10 min-w-[2.5rem]`}>
                        {line.lineNumberA ?? ''}
                      </td>
                      <td className={`select-none border-r border-[var(--color-input)] px-3 py-0.5 text-right text-[11px] ${lineNumColor} w-10 min-w-[2.5rem]`}>
                        {line.lineNumberB ?? ''}
                      </td>
                      <td className={`select-none border-r border-[var(--color-input)] px-3 py-0.5 text-center text-[11px] font-bold ${lineNumColor} w-6`}>
                        {prefix}
                      </td>
                      <td className={`px-4 py-0.5 ${textColor} whitespace-pre`}>
                        {line.content}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasInput && !hasDiff && (
        <div className="flex items-center justify-center rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] px-4 py-8">
          <p className="text-sm text-[var(--color-muted-foreground)]">No differences found — the texts are identical.</p>
        </div>
      )}

      {!hasInput && (
        <div className="flex items-center justify-center rounded-md border border-dashed border-[var(--color-input)] px-4 py-8">
          <p className="text-sm text-[var(--color-muted-foreground)]">Paste text into both fields above to see the diff.</p>
        </div>
      )}
    </div>
  );
}

export default function DiffChecker() {
  return (
    <ToolErrorBoundary>
      <DiffCheckerInner />
    </ToolErrorBoundary>
  );
}
