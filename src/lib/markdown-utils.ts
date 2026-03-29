import { marked } from 'marked';
import DOMPurify from 'dompurify';

const MAX_INPUT_SIZE = 1_000_000;

function checkSize(input: string): string | null {
  if (input.length > MAX_INPUT_SIZE) {
    return `Input too large (${(input.length / 1_000_000).toFixed(1)}MB). Maximum size is 1MB.`;
  }
  return null;
}

export function renderMarkdown(input: string): { result?: string; error?: string } {
  if (!input) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };
  try {
    const html = marked.parse(input) as string;
    const clean = DOMPurify.sanitize(html);
    return { result: clean };
  } catch (e) {
    return { error: `Rendering failed: ${(e as Error).message}` };
  }
}
