import { describe, it, expect } from 'vitest';
import { generateHash, generateLoremIpsum } from '../src/lib/hash-utils';

describe('generateHash', () => {
  it('generates SHA-256 hash', async () => {
    const result = await generateHash('hello', 'SHA-256');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('generates MD5 hash', async () => {
    const result = await generateHash('hello', 'MD5');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('returns empty for empty input', async () => {
    const result = await generateHash('', 'SHA-256');
    expect(result.result).toBe('');
  });

  it('rejects input larger than 1MB', async () => {
    const result = await generateHash('a'.repeat(1_100_000), 'SHA-256');
    expect(result.error).toContain('Input too large');
  });

  it('same input produces same hash', async () => {
    const a = await generateHash('test', 'SHA-256');
    const b = await generateHash('test', 'SHA-256');
    expect(a.result).toBe(b.result);
  });
});

describe('generateLoremIpsum', () => {
  it('generates requested number of paragraphs', () => {
    const result = generateLoremIpsum(3);
    const paragraphs = result.split('\n\n');
    expect(paragraphs.length).toBe(3);
  });

  it('first paragraph starts with Lorem ipsum', () => {
    const result = generateLoremIpsum(1);
    expect(result).toMatch(/^Lorem ipsum/);
  });

  it('clamps to minimum 1 paragraph', () => {
    const result = generateLoremIpsum(0);
    expect(result.split('\n\n').length).toBe(1);
  });

  it('clamps to maximum 10 paragraphs', () => {
    const result = generateLoremIpsum(20);
    expect(result.split('\n\n').length).toBe(10);
  });
});
