import React, { useState, useMemo } from 'react';
import { validateCron, parseCron, getNextRuns } from '../../lib/cron-utils';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 min', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily midnight', value: '0 0 * * *' },
  { label: 'Monday 9am', value: '0 9 * * 1' },
  { label: '1st of month', value: '0 0 1 * *' },
];

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function formatDate(d: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()} — ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function CronBuilderInner() {
  const [expr, setExpr] = useState('*/5 * * * *');

  const validation = useMemo(() => validateCron(expr), [expr]);
  const description = useMemo(() => (validation.valid ? parseCron(expr) : ''), [expr, validation.valid]);
  const nextRuns = useMemo(() => (validation.valid ? getNextRuns(expr, 5) : []), [expr, validation.valid]);

  const fields = expr.trim().split(/\s+/);
  const fieldLabels = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];

  return (
    <div className="flex flex-col gap-6">
      {/* Expression Input */}
      <div>
        <div className="mb-2 flex h-8 items-center justify-between">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">
            Cron Expression
          </p>
          <CopyButton text={expr} />
        </div>
        <div
          className={[
            'flex items-center rounded-md border bg-[var(--color-background)]',
            'focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20',
            validation.error
              ? 'border-[var(--color-destructive)] focus-within:border-[var(--color-destructive)]'
              : 'border-[var(--color-input)] focus-within:border-[var(--color-primary)]',
          ].join(' ')}
        >
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent px-3 py-2.5 font-mono text-[15px] font-medium text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted-foreground)]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            placeholder="*/5 * * * *"
          />
        </div>

        {/* Field labels */}
        {fields.length === 5 && (
          <div className="mt-1.5 grid grid-cols-5 gap-1">
            {fieldLabels.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span
                  className="w-full rounded px-1 py-0.5 text-center font-mono text-[11px] font-medium text-[var(--color-foreground)] bg-[var(--color-secondary)]"
                  title={label}
                >
                  {fields[i] || '*'}
                </span>
                <span className="text-[10px] text-[var(--color-muted-foreground)]">{label}</span>
              </div>
            ))}
          </div>
        )}

        {validation.error && (
          <p className="mt-2 flex items-start gap-1 text-sm text-[var(--color-destructive)]">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {validation.error}
          </p>
        )}
      </div>

      {/* Presets */}
      <div>
        <p className="mb-2 text-[13px] font-medium text-[var(--color-muted-foreground)]">Common Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setExpr(value)}
              className={[
                'rounded-full border px-3 py-1 text-[12px] font-medium transition-colors',
                expr === value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Human-readable description */}
      {validation.valid && description && (
        <div className="rounded-lg border border-[var(--color-input)] bg-[var(--color-secondary)] p-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Runs
          </p>
          <p className="text-[18px] font-semibold text-[var(--color-foreground)]">{description}</p>
        </div>
      )}

      {/* Next scheduled runs */}
      {nextRuns.length > 0 && (
        <div>
          <p className="mb-2 text-[13px] font-medium text-[var(--color-muted-foreground)]">
            Next 5 Scheduled Runs
          </p>
          <div className="flex flex-col gap-1.5">
            {nextRuns.map((date, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[10px] font-bold text-[var(--color-primary)]">
                  {i + 1}
                </span>
                <span className="font-mono text-[13px] text-[var(--color-foreground)]">
                  {formatDate(date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Syntax reference */}
      <div>
        <p className="mb-2 text-[13px] font-medium text-[var(--color-muted-foreground)]">
          Quick Syntax Reference
        </p>
        <div className="overflow-x-auto rounded-md border border-[var(--color-input)]">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[var(--color-input)] bg-[var(--color-secondary)]">
                <th className="px-3 py-2 text-left font-semibold text-[var(--color-muted-foreground)]">Symbol</th>
                <th className="px-3 py-2 text-left font-semibold text-[var(--color-muted-foreground)]">Meaning</th>
                <th className="px-3 py-2 text-left font-semibold text-[var(--color-muted-foreground)]">Example</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['*', 'Any value', '* means every'],
                ['*/n', 'Every n units', '*/15 = every 15'],
                ['n', 'Specific value', '5 = at 5'],
                ['n-m', 'Range', '9-17 = 9 to 17'],
                ['n,m', 'List', '1,15 = 1st and 15th'],
              ].map(([sym, meaning, example]) => (
                <tr key={sym} className="border-b border-[var(--color-input)] last:border-b-0">
                  <td className="px-3 py-2 font-mono font-medium text-[var(--color-foreground)]">{sym}</td>
                  <td className="px-3 py-2 text-[var(--color-muted-foreground)]">{meaning}</td>
                  <td className="px-3 py-2 font-mono text-[var(--color-muted-foreground)]">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CronBuilder() {
  return (
    <ToolErrorBoundary>
      <CronBuilderInner />
    </ToolErrorBoundary>
  );
}
