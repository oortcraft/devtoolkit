const MAX_INPUT_SIZE = 1_000_000;

function checkSize(input: string): string | null {
  if (input.length > MAX_INPUT_SIZE) {
    return `Input too large (${(input.length / 1_000_000).toFixed(1)}MB). Maximum size is 1MB.`;
  }
  return null;
}

export function minifyCss(input: string): { result?: string; error?: string } {
  if (!input) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    let result = input;
    // Remove CSS comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove newlines and tabs
    result = result.replace(/[\r\n\t]/g, ' ');
    // Collapse multiple spaces into one
    result = result.replace(/\s+/g, ' ');
    // Remove spaces around { } : ; , > ~ +
    result = result.replace(/\s*{\s*/g, '{');
    result = result.replace(/\s*}\s*/g, '}');
    result = result.replace(/\s*:\s*/g, ':');
    result = result.replace(/\s*;\s*/g, ';');
    result = result.replace(/\s*,\s*/g, ',');
    result = result.replace(/\s*>\s*/g, '>');
    result = result.replace(/\s*~\s*/g, '~');
    result = result.replace(/\s*\+\s*/g, '+');
    // Remove trailing semicolons before closing braces
    result = result.replace(/;}/g, '}');
    return { result: result.trim() };
  } catch (e) {
    return { error: `Minification failed: ${(e as Error).message}` };
  }
}

export function getCssStats(
  original: string,
  minified: string
): { originalSize: number; minifiedSize: number; savedPercent: number } {
  const encoder = new TextEncoder();
  const originalSize = encoder.encode(original).length;
  const minifiedSize = encoder.encode(minified).length;
  const savedPercent =
    originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;
  return { originalSize, minifiedSize, savedPercent };
}
