import { describe, it, expect } from 'vitest';
import { generateLoremIpsum } from '../src/lib/lorem-ipsum-utils';

describe('generateLoremIpsum', () => {
  it('generates the requested number of paragraphs', () => {
    for (const n of [1, 3, 5, 10]) {
      const paragraphs = generateLoremIpsum(n).split('\n\n');
      expect(paragraphs).toHaveLength(n);
    }
  });

  it('first paragraph always starts with "Lorem ipsum"', () => {
    const result = generateLoremIpsum(1);
    expect(result).toMatch(/^Lorem ipsum dolor sit amet/);
  });

  it('second paragraph does not necessarily start with Lorem ipsum', () => {
    // Run multiple times to verify randomness
    const results = new Set<boolean>();
    for (let i = 0; i < 20; i++) {
      const paras = generateLoremIpsum(2).split('\n\n');
      results.add(paras[1].startsWith('Lorem ipsum'));
    }
    // At least sometimes should NOT start with Lorem ipsum
    expect(results.has(false)).toBe(true);
  });

  it('clamps minimum to 1 paragraph', () => {
    expect(generateLoremIpsum(0).split('\n\n')).toHaveLength(1);
    expect(generateLoremIpsum(-5).split('\n\n')).toHaveLength(1);
    expect(generateLoremIpsum(-100).split('\n\n')).toHaveLength(1);
  });

  it('clamps maximum to 10 paragraphs', () => {
    expect(generateLoremIpsum(20).split('\n\n')).toHaveLength(10);
    expect(generateLoremIpsum(100).split('\n\n')).toHaveLength(10);
  });

  it('each paragraph has 4-8 sentences', () => {
    const result = generateLoremIpsum(10);
    const paragraphs = result.split('\n\n');
    for (const para of paragraphs) {
      // Sentences end with period followed by space or end of string
      const sentenceCount = para.split(/\.\s/).filter(Boolean).length;
      expect(sentenceCount).toBeGreaterThanOrEqual(4);
      expect(sentenceCount).toBeLessThanOrEqual(8);
    }
  });

  it('generates non-empty output', () => {
    expect(generateLoremIpsum(1).length).toBeGreaterThan(0);
  });

  it('produces different output on repeated calls (randomness)', () => {
    const results = new Set<string>();
    for (let i = 0; i < 10; i++) {
      results.add(generateLoremIpsum(2));
    }
    expect(results.size).toBeGreaterThan(1);
  });

  it('all sentences end with a period', () => {
    const result = generateLoremIpsum(3);
    // Each paragraph should end with a period (last sentence)
    const paragraphs = result.split('\n\n');
    for (const para of paragraphs) {
      expect(para.trim()).toMatch(/\.$/);
    }
  });

  it('boundary: exactly 1 paragraph', () => {
    const result = generateLoremIpsum(1);
    expect(result).not.toContain('\n\n');
  });

  it('boundary: exactly 10 paragraphs', () => {
    const paragraphs = generateLoremIpsum(10).split('\n\n');
    expect(paragraphs).toHaveLength(10);
  });
});
