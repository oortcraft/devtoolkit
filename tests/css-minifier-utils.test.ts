import { describe, it, expect } from 'vitest';
import { minifyCss, getCssStats } from '../src/lib/css-minifier-utils';

describe('minifyCss', () => {
  it('returns empty for empty input', () => {
    const result = minifyCss('');
    expect(result.result).toBe('');
  });

  it('removes whitespace around selectors', () => {
    const result = minifyCss('body { color: red; }');
    expect(result.result).not.toContain('  ');
  });

  it('removes CSS comments', () => {
    const result = minifyCss('/* comment */ body { color: red; }');
    expect(result.result).not.toContain('comment');
    expect(result.result).not.toContain('/*');
  });

  it('collapses multiple spaces', () => {
    const result = minifyCss('body  {   color:   red;  }');
    expect(result.result).not.toContain('   ');
  });

  it('removes trailing semicolons before closing braces', () => {
    const result = minifyCss('body { color: red; }');
    expect(result.result).not.toContain(';}');
  });

  it('handles multiple rules', () => {
    const result = minifyCss('h1 { font-size: 24px; } p { color: gray; }');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('h1');
    expect(result.result).toContain('p');
  });

  it('rejects input larger than 1MB', () => {
    const result = minifyCss('a'.repeat(1_100_000));
    expect(result.error).toContain('too large');
  });

  it('handles media queries', () => {
    const css = '@media (max-width: 768px) { .container { width: 100%; } }';
    const result = minifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('@media');
    expect(result.result).toContain('.container');
  });

  it('handles @keyframes', () => {
    const css = '@keyframes fade { from { opacity: 0; } to { opacity: 1; } }';
    const result = minifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('@keyframes');
  });

  it('handles @import', () => {
    const css = "@import url('reset.css');\nbody { margin: 0; }";
    const result = minifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('@import');
  });

  it('handles pseudo-selectors', () => {
    const css = 'a:hover { color: blue; } a::before { content: ""; }';
    const result = minifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain(':hover');
    expect(result.result).toContain('::before');
  });

  it('handles CSS variables', () => {
    const css = ':root { --primary: #3b82f6; } .btn { color: var(--primary); }';
    const result = minifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('--primary');
    expect(result.result).toContain('var(--primary)');
  });

  it('produces output shorter than input', () => {
    const css = 'body {\n  color: red;\n  background: white;\n  margin: 0;\n}';
    const result = minifyCss(css);
    expect(result.result!.length).toBeLessThan(css.length);
  });
});

describe('getCssStats', () => {
  it('returns size comparison stats', () => {
    const original = 'body { color: red; }';
    const minified = 'body{color:red}';
    const stats = getCssStats(original, minified);
    expect(stats.originalSize).toBeGreaterThan(stats.minifiedSize);
    expect(stats.savedPercent).toBeGreaterThan(0);
  });

  it('returns 0 saved for identical strings', () => {
    const stats = getCssStats('body{color:red}', 'body{color:red}');
    expect(stats.savedPercent).toBe(0);
  });

  it('calculates byte sizes correctly', () => {
    const stats = getCssStats('abc', 'ab');
    expect(stats.originalSize).toBe(3);
    expect(stats.minifiedSize).toBe(2);
  });
});
