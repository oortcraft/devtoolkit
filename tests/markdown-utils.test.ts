import { describe, it, expect } from 'vitest';

// markdown-utils depends on DOMPurify which requires a DOM environment.
// These tests are intentionally skipped; run them in a jsdom environment if needed.

describe('markdown-utils', () => {
  it.todo('renders a heading to <h1>');
  it.todo('renders bold text to <strong>');
  it.todo('renders a link to <a>');
  it.todo('returns empty string for empty input');
  it.todo('sanitizes XSS script tags via DOMPurify');
  it.todo('returns error for input larger than 1MB');
});
