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
