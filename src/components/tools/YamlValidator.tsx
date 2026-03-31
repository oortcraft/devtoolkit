import React, { useState, useEffect, useRef } from 'react';
import { validateYaml, MODE_OPTIONS, type ValidatorMode } from '../../lib/yaml-validator-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function YamlValidatorInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [mode, setMode] = useState<ValidatorMode>('validate');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        setError(undefined);
        return;
      }
      const { result, error: err } = validateYaml(input, mode);
      if (err) {
        setError(err);
        setOutput('');
      } else {
        setError(undefined);
        setOutput(result ?? '');
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, mode]);

  const outputLabel = mode === 'yaml-to-json' ? 'JSON Output' : 'Result';
  const outputLanguage = mode === 'yaml-to-json' ? 'json' : 'text';
  const outputPlaceholder =
    mode === 'yaml-to-json'
      ? 'Converted JSON will appear here'
      : 'Validation result will appear here';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-md bg-[var(--color-secondary)] p-1">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={mode === opt.value}
              aria-label={opt.label}
              onClick={() => setMode(opt.value)}
              className={[
                'rounded px-3 py-1.5 text-sm transition-all',
                mode === opt.value
                  ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => { setInput(''); setOutput(''); setError(undefined); }}
            className="text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">YAML Input</p>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="yaml"
            placeholder="Paste YAML to validate..."
            error={error}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center justify-between">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">{outputLabel}</p>
            <CopyButton text={output} />
          </div>
          <CodeEditor
            value={output}
            language={outputLanguage}
            readOnly
            placeholder={outputPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}

export default function YamlValidator() {
  return (
    <ToolErrorBoundary>
      <YamlValidatorInner />
    </ToolErrorBoundary>
  );
}
