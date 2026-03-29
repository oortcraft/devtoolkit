import React, { useState, useMemo } from 'react';
import { parseColor } from '../../lib/color-utils';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function ColorConverterInner() {
  const [input, setInput] = useState('#3b82f6');

  const result = useMemo(() => parseColor(input), [input]);

  const previewColor = result.error ? 'transparent' : result.hex;

  return (
    <div className="flex flex-col gap-6">
      {/* Input */}
      <div>
        <div className="mb-2 flex h-8 items-center">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Color Input</p>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#3b82f6, rgb(59,130,246), hsl(217,91%,60%)"
          className={[
            'w-full rounded-md border bg-[var(--color-background)] px-3 py-2 font-mono text-sm text-[var(--color-foreground)] outline-none transition-colors',
            result.error && input
              ? 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]'
              : 'border-[var(--color-input)] focus:border-[var(--color-ring)]',
          ].join(' ')}
          spellCheck={false}
          autoComplete="off"
        />
        {result.error && input && (
          <p className="mt-1.5 text-xs text-[var(--color-destructive)]">{result.error}</p>
        )}
      </div>

      {/* Color Preview */}
      <div>
        <div className="mb-2 flex h-8 items-center">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Preview</p>
        </div>
        <div
          className="h-20 w-full rounded-md border border-[var(--color-input)]"
          style={{ backgroundColor: previewColor || '#ffffff' }}
        />
      </div>

      {/* Outputs */}
      {!result.error && result.hex && (
        <div className="flex flex-col gap-3">
          {/* HEX */}
          <div className="rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-input)]">
              <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">HEX</p>
              <CopyButton text={result.hex} />
            </div>
            <div className="px-4 py-3">
              <p className="font-mono text-sm text-[var(--color-foreground)]">{result.hex}</p>
            </div>
          </div>

          {/* RGB */}
          <div className="rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-input)]">
              <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">RGB</p>
              <CopyButton text={result.rgb} />
            </div>
            <div className="px-4 py-3">
              <p className="font-mono text-sm text-[var(--color-foreground)]">{result.rgb}</p>
            </div>
          </div>

          {/* HSL */}
          <div className="rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-input)]">
              <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">HSL</p>
              <CopyButton text={result.hsl} />
            </div>
            <div className="px-4 py-3">
              <p className="font-mono text-sm text-[var(--color-foreground)]">{result.hsl}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ColorConverter() {
  return (
    <ToolErrorBoundary>
      <ColorConverterInner />
    </ToolErrorBoundary>
  );
}
