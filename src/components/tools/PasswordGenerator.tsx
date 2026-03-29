import React, { useState, useEffect, useCallback } from 'react';
import { generatePassword, calculateStrength } from '../../lib/password-utils';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function PasswordGeneratorInner() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleGenerate = useCallback(() => {
    const { result, error: err } = generatePassword({ length, uppercase, lowercase, numbers, symbols });
    if (err) {
      setError(err);
      setPassword('');
    } else {
      setError(undefined);
      setPassword(result ?? '');
    }
  }, [length, uppercase, lowercase, numbers, symbols]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleClear = () => {
    setPassword('');
    setError(undefined);
  };

  const strength = password ? calculateStrength(password) : null;

  const strengthColor = strength
    ? strength.label === 'Strong'
      ? 'var(--color-success, #22c55e)'
      : strength.label === 'Medium'
        ? '#f59e0b'
        : '#ef4444'
    : 'var(--color-border)';

  const strengthWidth = strength
    ? strength.label === 'Strong'
      ? '100%'
      : strength.label === 'Medium'
        ? '60%'
        : '30%'
    : '0%';

  return (
    <div className="flex flex-col gap-6">
      {/* Options */}
      <div className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        {/* Length slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="pw-length" className="text-[13px] font-medium text-[var(--color-muted-foreground)]">
              Length
            </label>
            <span className="min-w-[2.5rem] text-right font-mono text-sm font-semibold text-[var(--color-foreground)]">
              {length}
            </span>
          </div>
          <input
            id="pw-length"
            type="range"
            min={1}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>

        {/* Character type toggles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Uppercase', value: uppercase, setter: setUppercase, example: 'A–Z' },
            { label: 'Lowercase', value: lowercase, setter: setLowercase, example: 'a–z' },
            { label: 'Numbers', value: numbers, setter: setNumbers, example: '0–9' },
            { label: 'Symbols', value: symbols, setter: setSymbols, example: '!@#$' },
          ].map(({ label, value, setter, example }) => (
            <label
              key={label}
              className={[
                'flex cursor-pointer flex-col gap-1 rounded-md border p-3 transition-colors',
                value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-secondary)]',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-foreground)]">{label}</span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setter(e.target.checked)}
                  className="h-4 w-4 accent-[var(--color-primary)]"
                />
              </div>
              <span className="font-mono text-[11px] text-[var(--color-muted-foreground)]">{example}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Generated Password</p>
          <CopyButton text={password} />
        </div>

        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        ) : (
          <p className={[
            'break-all font-mono text-lg font-semibold tracking-wide',
            password ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)]',
          ].join(' ')}>
            {password || 'Select at least one character type'}
          </p>
        )}

        {/* Strength indicator */}
        {password && strength && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[var(--color-muted-foreground)]">Strength</span>
              <span
                className="text-[12px] font-semibold"
                style={{ color: strengthColor }}
              >
                {strength.label}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-secondary)]">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: strengthWidth, backgroundColor: strengthColor }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          className="rounded-md bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:opacity-90"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] shadow-sm transition-colors hover:bg-[var(--color-secondary)]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default function PasswordGenerator() {
  return (
    <ToolErrorBoundary>
      <PasswordGeneratorInner />
    </ToolErrorBoundary>
  );
}
