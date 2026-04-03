import { describe, it, expect } from 'vitest';
import { beautifyCss, getCssFormatterStats } from '../src/lib/css-formatter-utils';

describe('beautifyCss', () => {
  it('returns empty for empty input', () => {
    const result = beautifyCss('');
    expect(result.result).toBe('');
  });

  it('formats a simple rule with default 2-space indent', () => {
    const result = beautifyCss('body{color:red;margin:0;}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('body {');
    expect(result.result).toContain('  color: red;');
    expect(result.result).toContain('  margin: 0;');
    expect(result.result).toContain('}');
  });

  it('formats with 4-space indent', () => {
    const result = beautifyCss('body{color:red;}', 4);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('    color: red;');
  });

  it('formats with tab indent', () => {
    const result = beautifyCss('body{color:red;}', 'tab');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('\tcolor: red;');
  });

  it('already-formatted CSS stays clean', () => {
    const css = 'body {\n  color: red;\n  margin: 0;\n}';
    const result = beautifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('color: red;');
    expect(result.result).toContain('margin: 0;');
  });

  it('adds space before opening brace', () => {
    const result = beautifyCss('.btn{display:block;}');
    expect(result.result).toContain('.btn {');
  });

  it('adds space after colon in declarations', () => {
    const result = beautifyCss('p{font-size:16px;line-height:1.5;}');
    expect(result.result).toContain('font-size: 16px;');
    expect(result.result).toContain('line-height: 1.5;');
  });

  it('handles multiple rules', () => {
    const result = beautifyCss('h1{font-size:24px;}p{color:gray;}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('h1 {');
    expect(result.result).toContain('p {');
  });

  it('handles nested @media rules', () => {
    const css = '@media(max-width:768px){.container{width:100%;}}';
    const result = beautifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('@media');
    expect(result.result).toContain('.container {');
    expect(result.result).toContain('width: 100%;');
  });

  it('handles @keyframes', () => {
    const css = '@keyframes fade{from{opacity:0;}to{opacity:1;}}';
    const result = beautifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('@keyframes fade {');
    expect(result.result).toContain('from {');
    expect(result.result).toContain('opacity: 0;');
  });

  it('preserves comments', () => {
    const css = '/* header styles */body{color:red;}';
    const result = beautifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('/* header styles */');
  });

  it('handles empty rules', () => {
    const result = beautifyCss('.empty{}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('.empty {');
    expect(result.result).toContain('}');
  });

  it('handles multiple selectors', () => {
    const result = beautifyCss('h1,h2,h3{font-weight:bold;}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('h1,h2,h3 {');
    expect(result.result).toContain('font-weight: bold;');
  });

  it('rejects input larger than 1MB', () => {
    const result = beautifyCss('a'.repeat(1_100_000));
    expect(result.error).toContain('too large');
  });

  it('handles CSS variables', () => {
    const css = ':root{--primary:#3b82f6;}.btn{color:var(--primary);}';
    const result = beautifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('--primary: #3b82f6;');
    expect(result.result).toContain('color: var(--primary);');
  });

  it('handles pseudo-selectors without mangling colons', () => {
    const css = 'a:hover{color:blue;}';
    const result = beautifyCss(css);
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('a:hover {');
    expect(result.result).toContain('color: blue;');
  });

  it('produces output with more lines than minified input', () => {
    const minified = 'body{color:red;background:white;margin:0;}';
    const result = beautifyCss(minified);
    const inputLines = minified.split('\n').length;
    const outputLines = result.result!.split('\n').length;
    expect(outputLines).toBeGreaterThan(inputLines);
  });
});

describe('getCssFormatterStats', () => {
  it('returns size info', () => {
    const original = 'body{color:red;}';
    const formatted = 'body {\n  color: red;\n}';
    const stats = getCssFormatterStats(original, formatted);
    expect(stats.originalSize).toBeGreaterThan(0);
    expect(stats.formattedSize).toBeGreaterThan(0);
  });

  it('calculates linesAdded for expanded CSS', () => {
    const original = 'body{color:red;margin:0;}';
    const formatted = 'body {\n  color: red;\n  margin: 0;\n}';
    const stats = getCssFormatterStats(original, formatted);
    expect(stats.linesAdded).toBeGreaterThan(0);
  });

  it('returns 0 linesAdded when line count does not increase', () => {
    const stats = getCssFormatterStats('body{color:red;}', 'body{color:red;}');
    expect(stats.linesAdded).toBe(0);
  });

  it('calculates byte sizes correctly', () => {
    const stats = getCssFormatterStats('abc', 'ab');
    expect(stats.originalSize).toBe(3);
    expect(stats.formattedSize).toBe(2);
  });
});
