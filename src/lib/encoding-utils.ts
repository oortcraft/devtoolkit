const MAX_INPUT_SIZE = 1_000_000; // 1MB

function checkSize(input: string): string | null {
  if (input.length > MAX_INPUT_SIZE) {
    return `Input too large (${(input.length / 1_000_000).toFixed(1)}MB). Maximum size is 1MB.`;
  }
  return null;
}

export function base64Encode(input: string): { result?: string; error?: string } {
  if (!input.trim()) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const result = btoa(unescape(encodeURIComponent(input)));
    return { result };
  } catch (e) {
    return { error: `Encoding failed: ${(e as Error).message}` };
  }
}

export function base64Decode(input: string): { result?: string; error?: string } {
  if (!input.trim()) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const result = decodeURIComponent(escape(atob(input.trim())));
    return { result };
  } catch (e) {
    return { error: `Invalid Base64: ${(e as Error).message}` };
  }
}

export function urlEncode(input: string): { result?: string; error?: string } {
  if (!input.trim()) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const result = encodeURIComponent(input);
    return { result };
  } catch (e) {
    return { error: `Encoding failed: ${(e as Error).message}` };
  }
}

export function urlDecode(input: string): { result?: string; error?: string } {
  if (!input.trim()) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const result = decodeURIComponent(input.trim());
    return { result };
  } catch (e) {
    return { error: `Invalid URL encoding: ${(e as Error).message}` };
  }
}

export function generateUuid(version: 'v4' | 'v1'): string {
  if (version === 'v4') {
    return crypto.randomUUID();
  }
  // v1: time-based UUID
  const now = Date.now();
  const timeHigh = Math.floor(now / 0x100000000);
  const timeLow = now & 0xffffffff;
  const timeMid = (timeHigh & 0xffff).toString(16).padStart(4, '0');
  const timeHighAndVersion = ((timeHigh >>> 16) & 0x0fff | 0x1000).toString(16).padStart(4, '0');
  const timeLowHex = timeLow.toString(16).padStart(8, '0');
  const clockSeq = (Math.floor(Math.random() * 0x3fff) | 0x8000).toString(16).padStart(4, '0');
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
  return `${timeLowHex}-${timeMid}-${timeHighAndVersion}-${clockSeq}-${node}`;
}
