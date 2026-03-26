import yaml from 'js-yaml';

const MAX_INPUT_SIZE = 1_000_000; // 1MB

function checkSize(input: string): string | null {
  if (input.length > MAX_INPUT_SIZE) {
    return `Input too large (${(input.length / 1_000_000).toFixed(1)}MB). Maximum size is 1MB.`;
  }
  return null;
}

function getErrorPosition(error: unknown): string {
  if (error instanceof SyntaxError) {
    const match = error.message.match(/position\s+(\d+)/i);
    if (match) {
      return ` at position ${match[1]}`;
    }
  }
  return '';
}

export function formatJson(
  input: string,
  indent: number | string = 2
): { result?: string; error?: string } {
  if (!input.trim()) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { error: `Invalid JSON${getErrorPosition(e)}: ${(e as Error).message}` };
  }
}

export function minifyJson(input: string): { result?: string; error?: string } {
  if (!input.trim()) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed) };
  } catch (e) {
    return { error: `Invalid JSON${getErrorPosition(e)}: ${(e as Error).message}` };
  }
}

const MAX_DEPTH = 100;

function measureDepth(obj: unknown, current: number = 0): number {
  if (current >= MAX_DEPTH) return current;
  if (typeof obj !== 'object' || obj === null) return current;
  let max = current;
  const values = Array.isArray(obj) ? obj : Object.values(obj);
  for (const v of values) {
    const d = measureDepth(v, current + 1);
    if (d > max) max = d;
  }
  return max;
}

export function validateJson(
  input: string
): { valid: boolean; error?: string; stats?: { keys: number; depth: number; arrayLength: number } } {
  if (!input.trim()) return { valid: false, error: 'Input is empty' };
  const sizeError = checkSize(input);
  if (sizeError) return { valid: false, error: sizeError };
  try {
    const parsed = JSON.parse(input);
    const stats = {
      keys: typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
        ? Object.keys(parsed).length
        : 0,
      depth: measureDepth(parsed),
      arrayLength: Array.isArray(parsed) ? parsed.length : 0,
    };
    return { valid: true, stats };
  } catch (e) {
    return { valid: false, error: `Invalid JSON${getErrorPosition(e)}: ${(e as Error).message}` };
  }
}

export function jsonToYaml(input: string): { result?: string; error?: string } {
  if (!input.trim()) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const parsed = JSON.parse(input);
    return { result: yaml.dump(parsed, { indent: 2, lineWidth: -1 }) };
  } catch (e) {
    return { error: `Invalid JSON${getErrorPosition(e)}: ${(e as Error).message}` };
  }
}
