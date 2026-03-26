import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange?: (v: string) => void;
  language: string;
  readOnly?: boolean;
  error?: string;
  placeholder?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  error,
  placeholder,
}: CodeEditorProps) {
  const lineCount = value ? value.split('\n').length : 1;
  const rows = Math.min(30, Math.max(10, lineCount + 1));

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative">
        <textarea
          data-language={language}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          rows={rows}
          placeholder={placeholder}
          spellCheck={false}
          className={[
            'w-full resize-none rounded-md border p-3 font-mono text-[13px] leading-relaxed outline-none transition-colors',
            readOnly
              ? 'cursor-default bg-[var(--color-secondary)] text-[var(--color-foreground)]'
              : 'bg-[var(--color-background)] text-[var(--color-foreground)]',
            'placeholder:text-[var(--color-muted-foreground)]',
            'focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-0',
            error
              ? 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]'
              : 'border-[var(--color-input)] focus:border-[var(--color-primary)]',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        />
        <div className="pointer-events-none absolute bottom-2 right-3 select-none text-xs text-[var(--color-muted-foreground)]">
          {value.length.toLocaleString()} chars
        </div>
      </div>
      {error && (
        <p className="flex items-start gap-1 text-sm text-[var(--color-destructive)]">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
