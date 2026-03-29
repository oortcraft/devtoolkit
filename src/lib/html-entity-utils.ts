const MAX_INPUT_SIZE = 1_000_000;

function checkSize(input: string): string | null {
  if (input.length > MAX_INPUT_SIZE) {
    return `Input too large (${(input.length / 1_000_000).toFixed(1)}MB). Maximum size is 1MB.`;
  }
  return null;
}

export function encodeHtmlEntities(input: string): { result?: string; error?: string } {
  if (!input) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const result = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    return { result };
  } catch (e) {
    return { error: `Encoding failed: ${(e as Error).message}` };
  }
}

export function decodeHtmlEntities(input: string): { result?: string; error?: string } {
  if (!input) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    const result = doc.documentElement.textContent ?? '';
    return { result };
  } catch (e) {
    return { error: `Decoding failed: ${(e as Error).message}` };
  }
}
