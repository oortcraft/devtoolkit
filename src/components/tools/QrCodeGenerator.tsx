import React, { useState, useEffect, useRef } from 'react';
import { generateQrSvg, generateQrDataUrl, ERROR_LEVELS, type ErrorCorrectionLevel } from '../../lib/qr-code-utils';
import ToolErrorBoundary from './ToolErrorBoundary';

function QrCodeGeneratorInner() {
  const [input, setInput] = useState('');
  const [svgHtml, setSvgHtml] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('M');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!input.trim()) { setSvgHtml(''); setError(undefined); return; }
      const { result, error: err } = await generateQrSvg(input, { errorCorrectionLevel: errorLevel, margin: 2 });
      if (err) { setError(err); setSvgHtml(''); }
      else { setError(undefined); setSvgHtml(result ?? ''); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, errorLevel]);

  const handleDownloadSvg = () => {
    if (!svgHtml) return;
    const blob = new Blob([svgHtml], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'qrcode.svg'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = async () => {
    if (!input.trim()) return;
    try {
      const dataUrl = await generateQrDataUrl(input, { errorCorrectionLevel: errorLevel, margin: 2, width: 512 });
      const a = document.createElement('a');
      a.href = dataUrl; a.download = 'qrcode.png'; a.click();
    } catch {}
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[var(--color-muted-foreground)]">Error Correction:</span>
          <div className="flex flex-wrap gap-1 rounded-md bg-[var(--color-secondary)] p-1">
            {ERROR_LEVELS.map((opt) => (
              <button key={opt.value} type="button" aria-pressed={errorLevel === opt.value}
                aria-label={opt.label}
                onClick={() => setErrorLevel(opt.value)}
                className={['rounded px-3 py-1.5 text-sm transition-all',
                  errorLevel === opt.value
                    ? 'bg-[var(--color-background)] font-medium text-[var(--color-foreground)] shadow-sm'
                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
                ].join(' ')}>{opt.value}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleDownloadSvg} disabled={!svgHtml}
            className="rounded-md border border-[var(--color-input)] px-4 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)] disabled:opacity-40">SVG</button>
          <button type="button" onClick={handleDownloadPng} disabled={!svgHtml}
            className="rounded-md border border-[var(--color-input)] px-4 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)] disabled:opacity-40">PNG</button>
          <button type="button" onClick={() => { setInput(''); setSvgHtml(''); setError(undefined); }}
            className="text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">Clear</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Input */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">Data Input</p>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text, URL, or data to encode..."
            aria-label="QR code data input"
            className="h-[360px] w-full resize-none rounded-md border border-[var(--color-input)] bg-[var(--color-background)] p-3 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        {/* QR Preview */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex h-8 items-center">
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">QR Preview</p>
          </div>
          <div className="flex h-[360px] items-center justify-center rounded-md border border-[var(--color-input)] bg-[var(--color-background)]">
            {svgHtml ? (
              <div className="flex items-center justify-center p-4" dangerouslySetInnerHTML={{ __html: svgHtml }} />
            ) : (
              <p className="text-sm text-[var(--color-muted-foreground)]">QR code will appear here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QrCodeGenerator() {
  return (<ToolErrorBoundary><QrCodeGeneratorInner /></ToolErrorBoundary>);
}
