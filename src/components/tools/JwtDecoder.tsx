import React, { useState, useMemo } from 'react';
import { decodeJwt, formatTimestamp, isExpired } from '../../lib/jwt-utils';
import CopyButton from './CopyButton';
import ToolErrorBoundary from './ToolErrorBoundary';

const SAMPLE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function Badge({ label, color }: { label: string; color: 'blue' | 'green' | 'amber' }) {
  const styles = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${styles[color]}`}>
      {label}
    </span>
  );
}

function Section({
  label,
  color,
  meta,
  json,
}: {
  label: string;
  color: 'blue' | 'green' | 'amber';
  meta?: string;
  json: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge label={label} color={color} />
        {meta && (
          <span className="text-xs text-[var(--color-muted-foreground)]">{meta}</span>
        )}
      </div>
      <div className="relative rounded-md border border-[var(--color-input)] bg-[var(--color-secondary)] p-3">
        <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-[var(--color-foreground)]">
          {json}
        </pre>
        <div className="absolute right-1 top-1">
          <CopyButton text={json} />
        </div>
      </div>
    </div>
  );
}

function JwtDecoderInner() {
  const [input, setInput] = useState(SAMPLE_TOKEN);

  const result = useMemo(() => decodeJwt(input), [input]);

  const headerJson = result.parts
    ? JSON.stringify(result.parts.header, null, 2)
    : '';
  const payloadJson = result.parts
    ? JSON.stringify(result.parts.payload, null, 2)
    : '';

  const alg = result.parts?.header?.alg;
  const headerMeta = alg ? `Algorithm: ${alg}` : undefined;

  const payload = result.parts?.payload;
  let payloadMeta: string | undefined;
  if (payload) {
    const parts: string[] = [];
    if (typeof payload.iat === 'number') parts.push(`Issued: ${formatTimestamp(payload.iat)}`);
    const expired = isExpired(payload as Record<string, unknown>);
    if (expired === true) parts.push('Expired');
    else if (expired === false && typeof payload.exp === 'number')
      parts.push(`Expires: ${formatTimestamp(payload.exp)}`);
    payloadMeta = parts.join(' · ');
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Input */}
      <div>
        <div className="mb-2 flex h-8 items-center">
          <p className="text-[13px] font-medium text-[var(--color-muted-foreground)]">
            Encoded Token
          </p>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="Paste your JWT token here..."
          spellCheck={false}
          className={[
            'w-full resize-none rounded-md border p-3 font-mono text-[13px] leading-relaxed outline-none transition-colors',
            'bg-[var(--color-background)] text-[var(--color-foreground)]',
            'placeholder:text-[var(--color-muted-foreground)]',
            'focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-0',
            result.error
              ? 'border-[var(--color-destructive)] focus:border-[var(--color-destructive)]'
              : 'border-[var(--color-input)] focus:border-[var(--color-primary)]',
          ].join(' ')}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        />
        {result.error && (
          <p className="mt-1 flex items-start gap-1 text-sm text-[var(--color-destructive)]">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {result.error}
          </p>
        )}
      </div>

      {/* Decoded Sections */}
      {result.parts && (
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
          <Section label="HEADER" color="blue" meta={headerMeta} json={headerJson} />
          <Section label="PAYLOAD" color="green" meta={payloadMeta} json={payloadJson} />
          <Section
            label="SIGNATURE"
            color="amber"
            json={`HMACSHA256(\n  base64UrlEncode(header) + "." +\n  base64UrlEncode(payload),\n  secret\n)`}
            meta={result.parts.signature ? 'Present' : undefined}
          />
        </div>
      )}
    </div>
  );
}

export default function JwtDecoder() {
  return (
    <ToolErrorBoundary>
      <JwtDecoderInner />
    </ToolErrorBoundary>
  );
}
