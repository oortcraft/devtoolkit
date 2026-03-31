import React, { useState, useEffect, useRef } from 'react';
import { queryJsonPath, QUICK_EXPRESSIONS } from '../../lib/jsonpath-utils';
import CodeEditor from './CodeEditor';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

function JsonPathFinderInner() {
  const [json, setJson] = useState('');
  const [path, setPath] = useState('$');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [matchCount, setMatchCount] = useState<number | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!json.trim()) { setOutput(''); setError(undefined); setMatchCount(undefined); return; }
      const { result, error: err, matchCount: mc } = queryJsonPath(json, path);
      if (err) { setError(err); setOutput(''); setMatchCount(undefined); }
      else { setError(undefined); setOutput(result ?? ''); setMatchCount(mc); }
    }, 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [json, path]);

  return (
    <div className="flex flex-col gap-6">
      {/* Path Expression Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2">
          <span className="text-[13px] font-medium text-[var(--color-muted-foreground)] shrink-0">Path:</span>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="$.store.books[*].title"
            aria-label="JSONPath expression"
            className="flex-1 rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-1.5 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
          />
        </div>
        <div className="flex items-center gap-1">
          {QUICK_EXPRESSIONS.map((expr) => (
            <button key={expr.label} type="button" onClick={() => setPath(expr.label)}
              title={expr.description}
              className="rounded-md border border-[var(--color-input)] px-2.5 py-1.5 font-mono text-xs text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
            >{expr.label}</button>
          ))}
          <button type="button" onClick={() => { setJson(''); setPath('$'); setOutput(''); setError(undefined); setMatchCount(undefined); }}
            className="ml-2 text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">Clear</button>
        </div>
      </div>

      {/* Editors */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">JSON Input</p>
          </div>
          <CodeEditor value={json} onChange={setJson} language="json" placeholder='{"store":{"books":[...]}}' error={error} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Results</p>
              {matchCount !== undefined && matchCount > 0 && (
                <span className="rounded-full bg-[var(--color-secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-muted-foreground)]">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>
              )}
            </div>
            <CopyButton text={output} />
          </div>
          <CodeEditor value={output} language="json" readOnly placeholder="Query results will appear here" />
        </div>
      </div>
    </div>
  );
}

export default function JsonPathFinder() {
  return (<ToolErrorBoundary><JsonPathFinderInner /></ToolErrorBoundary>);
}
