import React, { useState, useCallback } from 'react';
import { fromUnix, toUnix, getCurrentTimestamp, type TimestampResult } from '../../lib/timestamp-utils';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function OutputRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
      <span className="w-24 shrink-0 text-[12px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
        {label}
      </span>
      <div className="flex flex-1 items-center justify-between gap-2 rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] px-3 py-2">
        <span className="font-mono text-[13px] text-[var(--color-foreground)]">{value}</span>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

function TimestampConverterInner() {
  const [tsInput, setTsInput] = useState(() => String(getCurrentTimestamp()));
  const [isMillis, setIsMillis] = useState(false);
  const [tsError, setTsError] = useState<string | null>(null);
  const [tsResult, setTsResult] = useState<TimestampResult | null>(() => {
    try {
      return fromUnix(getCurrentTimestamp(), false);
    } catch {
      return null;
    }
  });

  const [dateInput, setDateInput] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const [unixResult, setUnixResult] = useState<number | null>(null);

  const handleTsChange = useCallback(
    (value: string, millis: boolean) => {
      setTsInput(value);
      setTsError(null);
      setTsResult(null);
      if (!value.trim()) return;
      const num = Number(value);
      if (isNaN(num)) {
        setTsError('Please enter a valid number.');
        return;
      }
      try {
        setTsResult(fromUnix(num, millis));
      } catch (e) {
        setTsError(e instanceof Error ? e.message : 'Invalid timestamp');
      }
    },
    []
  );

  const handleMillisToggle = (millis: boolean) => {
    setIsMillis(millis);
    handleTsChange(tsInput, millis);
  };

  const handleNow = () => {
    const now = getCurrentTimestamp();
    const val = isMillis ? String(now * 1000) : String(now);
    handleTsChange(val, isMillis);
    setTsInput(val);
  };

  const handleDateChange = (value: string) => {
    setDateInput(value);
    setDateError(null);
    setUnixResult(null);
    if (!value.trim()) return;
    try {
      setUnixResult(toUnix(value));
    } catch (e) {
      setDateError(e instanceof Error ? e.message : 'Invalid date');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Unix → Date */}
      <section className="flex flex-col gap-4">
        <h2 className="text-[15px] font-semibold text-[var(--color-foreground)]">
          Unix Timestamp → Human-Readable Date
        </h2>

        {/* Input row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="text"
              inputMode="numeric"
              value={tsInput}
              onChange={(e) => handleTsChange(e.target.value, isMillis)}
              placeholder="e.g. 1711699200"
              spellCheck={false}
              className={[
                'w-full rounded-md border px-3 py-2 font-mono text-[14px] outline-none transition-colors',
                'bg-[var(--color-background)] text-[var(--color-foreground)]',
                'placeholder:text-[var(--color-muted-foreground)]',
                'focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-0',
                tsError
                  ? 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]'
                  : 'border-[var(--color-input)] focus:border-[var(--color-primary)]',
              ].join(' ')}
            />
            {tsError && (
              <p className="text-[12px] text-[var(--color-destructive)]">{tsError}</p>
            )}
          </div>

          {/* Now button */}
          <button
            type="button"
            onClick={handleNow}
            className="shrink-0 rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] px-4 py-2 text-[13px] font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-accent)]"
          >
            Now
          </button>

          {/* Seconds / Milliseconds toggle */}
          <div className="flex shrink-0 overflow-hidden rounded-md border border-[var(--color-input)]">
            {(['s', 'ms'] as const).map((unit) => {
              const active = unit === 'ms' ? isMillis : !isMillis;
              return (
                <button
                  key={unit}
                  type="button"
                  onClick={() => handleMillisToggle(unit === 'ms')}
                  className={[
                    'px-3 py-2 text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-secondary)] text-[var(--color-foreground)] hover:bg-[var(--color-accent)]',
                  ].join(' ')}
                >
                  {unit}
                </button>
              );
            })}
          </div>
        </div>

        {/* Outputs */}
        {tsResult && (
          <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-input)] bg-[var(--color-card)] p-4">
            <OutputRow label="ISO 8601" value={tsResult.iso} />
            <OutputRow label="UTC" value={tsResult.utc} />
            <OutputRow label="Local" value={tsResult.local} />
            <OutputRow label="Relative" value={tsResult.relative} />
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-[var(--color-input)]" />

      {/* Date → Unix */}
      <section className="flex flex-col gap-4">
        <h2 className="text-[15px] font-semibold text-[var(--color-foreground)]">
          Date / Time → Unix Timestamp
        </h2>

        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={dateInput}
            onChange={(e) => handleDateChange(e.target.value)}
            placeholder="e.g. 2024-03-29T00:00:00Z or March 29 2024"
            spellCheck={false}
            className={[
              'w-full rounded-md border px-3 py-2 font-mono text-[14px] outline-none transition-colors',
              'bg-[var(--color-background)] text-[var(--color-foreground)]',
              'placeholder:text-[var(--color-muted-foreground)]',
              'focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-0',
              dateError
                ? 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]'
                : 'border-[var(--color-input)] focus:border-[var(--color-primary)]',
            ].join(' ')}
          />
          {dateError && (
            <p className="text-[12px] text-[var(--color-destructive)]">{dateError}</p>
          )}
        </div>

        {unixResult !== null && (
          <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-input)] bg-[var(--color-card)] p-4">
            <OutputRow label="Seconds" value={String(unixResult)} />
            <OutputRow label="Milliseconds" value={String(unixResult * 1000)} />
          </div>
        )}
      </section>
    </div>
  );
}

export default function TimestampConverter() {
  return (
    <ToolErrorBoundary>
      <TimestampConverterInner />
    </ToolErrorBoundary>
  );
}
