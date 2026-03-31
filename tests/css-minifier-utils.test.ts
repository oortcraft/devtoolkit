import { describe, it, expect } from 'vitest';
import { minifyCss, getCssStats } from '../src/lib/css-minifier-utils';

describe('minifyCss', () => {
  it('returns empty for empty input', () => {
    expect(minifyCss('')).toEqual({ result: '' });
  });

  it('removes whitespace and newlines', () => {
    const input = 'body {\n  margin: 0;\n  padding: 0;\n}';
    const { result, error } = minifyCss(input);
    expect(error).toBeUndefined();
    expect(result).toBe('body{margin:0;padding:0}');
  });

  it('removes CSS comments', () => {
    const input = '/* comment */ body { color: red; }';
    const { result } = minifyCss(input);
    expect(result).not.toContain('comment');
    expect(result).toContain('body{color:red}');
  });

  it('collapses multiple spaces into one (then removes around punctuation)', () => {
    const input = 'h1  ,  h2 { font-size : 2em ; }';
    const { result } = minifyCss(input);
    expect(result).not.toContain('  ');
  });

  it('removes trailing semicolons before closing brace', () => {
    const input = 'p { margin: 0; }';
    const { result } = minifyCss(input);
    // trailing semicolon before } should be removed
    expect(result).toBe('p{margin:0}');
  });

  it('handles multiple rules', () => {
    const input = 'a { color: blue; }\nb { font-weight: bold; }';
    const { result } = minifyCss(input);
    expect(result).toContain('a{color:blue}');
    expect(result).toContain('b{font-weight:bold}');
  });

  it('rejects input larger than 1MB', () => {
    const { error } = minifyCss('a'.repeat(1_100_000));
    expect(error).toContain('Input too large');
  });
});

describe('getCssStats', () => {
  it('returns correct sizes and saved percent', () => {
    const original = 'body {\n  margin: 0;\n}';
    const minified = 'body{margin:0}';
    const stats = getCssStats(original, minified);
    expect(stats.originalSize).toBeGreaterThan(stats.minifiedSize);
    expect(stats.savedPercent).toBeGreaterThan(0);
    expect(stats.savedPercent).toBeLessThanOrEqual(100);
  });

  it('returns 0% saved when original equals minified', () => {
    const css = 'a{color:red}';
    const stats = getCssStats(css, css);
    expect(stats.savedPercent).toBe(0);
  });

  it('handles empty original without division by zero', () => {
    const stats = getCssStats('', '');
    expect(stats.savedPercent).toBe(0);
  });
});
