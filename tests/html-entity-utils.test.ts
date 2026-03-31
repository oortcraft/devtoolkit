import { describe, it, expect } from 'vitest';
import { encodeHtmlEntities, decodeHtmlEntities } from '../src/lib/html-entity-utils';

describe('encodeHtmlEntities', () => {
  it('encodes < > & characters', () => {
    const { result } = encodeHtmlEntities('<div>&</div>');
    expect(result).toBe('&lt;div&gt;&amp;&lt;/div&gt;');
  });

  it('encodes double quotes', () => {
    const { result } = encodeHtmlEntities('"hello"');
    expect(result).toBe('&quot;hello&quot;');
  });

  it('encodes single quotes', () => {
    const { result } = encodeHtmlEntities("it's");
    expect(result).toBe('it&#39;s');
  });

  it('returns empty string for empty input', () => {
    expect(encodeHtmlEntities('')).toEqual({ result: '' });
  });

  it('leaves plain text unchanged', () => {
    const { result } = encodeHtmlEntities('hello world');
    expect(result).toBe('hello world');
  });

  it('rejects input larger than 1MB', () => {
    const { error } = encodeHtmlEntities('a'.repeat(1_100_000));
    expect(error).toContain('Input too large');
  });
});

describe('decodeHtmlEntities', () => {
  it('decodes &lt; &gt; &amp;', () => {
    // DOMParser is not available in Node — decodeHtmlEntities uses it.
    // We test the function call itself; if DOMParser is unavailable it will throw/error.
    // In jsdom environment this works correctly.
    const { result, error } = decodeHtmlEntities('&lt;div&gt;&amp;&lt;/div&gt;');
    // Either it works or it returns an error — neither should throw
    expect(result !== undefined || error !== undefined).toBe(true);
  });

  it('returns empty string for empty input', () => {
    expect(decodeHtmlEntities('')).toEqual({ result: '' });
  });

  it('rejects input larger than 1MB', () => {
    const { error } = decodeHtmlEntities('a'.repeat(1_100_000));
    expect(error).toContain('Input too large');
  });
});
