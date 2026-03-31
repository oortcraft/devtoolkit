import { describe, it, expect, vi } from 'vitest';

vi.mock('dompurify', () => ({
  default: {
    sanitize: (html: string) => html.replace(/<script[\s\S]*?<\/script>/gi, ''),
  },
}));

import { renderMarkdown } from '../src/lib/markdown-utils';

describe('renderMarkdown', () => {
  it('renders a heading to <h1>', () => {
    const result = renderMarkdown('# Hello');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<h1>');
    expect(result.result).toContain('Hello');
  });

  it('renders h2 and h3 headings', () => {
    const r2 = renderMarkdown('## Subtitle');
    expect(r2.result).toContain('<h2>');
    const r3 = renderMarkdown('### Third');
    expect(r3.result).toContain('<h3>');
  });

  it('renders bold text to <strong>', () => {
    const result = renderMarkdown('**bold**');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<strong>');
  });

  it('renders italic text to <em>', () => {
    const result = renderMarkdown('*italic*');
    expect(result.result).toContain('<em>');
  });

  it('renders a link to <a>', () => {
    const result = renderMarkdown('[link](https://example.com)');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<a');
    expect(result.result).toContain('https://example.com');
  });

  it('renders inline code', () => {
    const result = renderMarkdown('Use `console.log`');
    expect(result.result).toContain('<code>');
    expect(result.result).toContain('console.log');
  });

  it('renders code blocks', () => {
    const result = renderMarkdown('```\nconst x = 1;\n```');
    expect(result.result).toContain('<code>');
    expect(result.result).toContain('const x = 1;');
  });

  it('renders unordered lists', () => {
    const result = renderMarkdown('- item 1\n- item 2');
    expect(result.result).toContain('<ul>');
    expect(result.result).toContain('<li>');
  });

  it('renders blockquotes', () => {
    const result = renderMarkdown('> quoted text');
    expect(result.result).toContain('<blockquote>');
  });

  it('renders nested markdown (bold inside heading)', () => {
    const result = renderMarkdown('# **Bold Title**');
    expect(result.result).toContain('<h1>');
    expect(result.result).toContain('<strong>');
  });

  it('returns empty string for empty input', () => {
    const result = renderMarkdown('');
    expect(result.result).toBe('');
    expect(result.error).toBeUndefined();
  });

  it('sanitizes XSS script tags', () => {
    const result = renderMarkdown('<script>alert("xss")</script>');
    expect(result.error).toBeUndefined();
    expect(result.result).not.toContain('<script>');
  });

  it('returns error for input larger than 1MB', () => {
    const largeInput = 'a'.repeat(1_100_000);
    const result = renderMarkdown(largeInput);
    expect(result.error).toContain('Input too large');
  });
});
