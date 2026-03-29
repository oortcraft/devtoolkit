export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  const base64 = pad ? padded + '='.repeat(4 - pad) : padded;
  return atob(base64);
}

export function decodeJwt(token: string): { parts?: JwtParts; error?: string } {
  const trimmed = token.trim();
  if (!trimmed) return { error: 'Please enter a JWT token.' };

  const segments = trimmed.split('.');
  if (segments.length !== 3) {
    return { error: `Invalid JWT: expected 3 parts separated by dots, got ${segments.length}.` };
  }

  try {
    const headerJson = base64UrlDecode(segments[0]);
    const header = JSON.parse(headerJson);

    const payloadJson = base64UrlDecode(segments[1]);
    const payload = JSON.parse(payloadJson);

    return {
      parts: {
        header,
        payload,
        signature: segments[2],
      },
    };
  } catch (e) {
    return { error: `Failed to decode JWT: ${e instanceof Error ? e.message : String(e)}` };
  }
}

export function formatTimestamp(ts: number): string {
  try {
    return new Date(ts * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return String(ts);
  }
}

export function isExpired(payload: Record<string, unknown>): boolean | null {
  const exp = payload.exp;
  if (typeof exp !== 'number') return null;
  return Date.now() / 1000 > exp;
}
