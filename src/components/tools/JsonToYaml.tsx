import React, { useState, useEffect, useRef } from 'react';
import { jsonToYaml } from '../../lib/json-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function JsonToYamlInner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        setError(undefined);
        return;
      }
      const { result, error: err } = jsonToYaml(input);
      if (err) {
        setError(err);
        setOutput('');
      } else {
        setError(undefined);
        setOutput(result ?? '');
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex h-8 items-center">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">JSON Input</p>
        </div>
        <CodeEditor
          value={input}
          onChange={setInput}
          language="json"
          placeholder='Paste your JSON here, e.g. {"key": "value"}'
          error={error}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex h-8 items-center justify-between">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">YAML Output</p>
          <CopyButton text={output} />
        </div>
        <CodeEditor value={output} language="yaml" readOnly placeholder="YAML output will appear here as you type" />
      </div>
    </div>
  );
}

export default function JsonToYaml() {
  return (
    <ToolErrorBoundary>
      <JsonToYamlInner />
    </ToolErrorBoundary>
  );
}
