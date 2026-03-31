import { describe, it, expect } from 'vitest';
import { generateHash } from '../src/lib/hash-utils';

describe('generateHash', () => {
  it('generates SHA-256 hash', async () => {
    const result = await generateHash('hello', 'SHA-256');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('generates SHA-1 hash', async () => {
    const result = await generateHash('hello', 'SHA-1');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
  });

  it('generates SHA-512 hash', async () => {
    const result = await generateHash('hello', 'SHA-512');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043');
  });

  it('generates MD5 hash', async () => {
    const result = await generateHash('hello', 'MD5');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('MD5 handles emoji/unicode correctly', async () => {
    const result = await generateHash('👋🌍', 'MD5');
    expect(result.error).toBeUndefined();
    expect(result.result).toHaveLength(32);
  });

  it('SHA-256 handles unicode correctly', async () => {
    const result = await generateHash('안녕하세요', 'SHA-256');
    expect(result.error).toBeUndefined();
    expect(result.result).toHaveLength(64);
  });

  it('returns empty for empty input', async () => {
    const result = await generateHash('', 'SHA-256');
    expect(result.result).toBe('');
  });

  it('returns empty for empty input with MD5', async () => {
    const result = await generateHash('', 'MD5');
    expect(result.result).toBe('');
  });

  it('rejects input larger than 1MB', async () => {
    const result = await generateHash('a'.repeat(1_100_000), 'SHA-256');
    expect(result.error).toContain('Input too large');
  });

  it('same input produces same hash across all algorithms', async () => {
    for (const algo of ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'] as const) {
      const a = await generateHash('consistency-test', algo);
      const b = await generateHash('consistency-test', algo);
      expect(a.result).toBe(b.result);
    }
  });

  it('different inputs produce different hashes', async () => {
    const a = await generateHash('hello', 'SHA-256');
    const b = await generateHash('world', 'SHA-256');
    expect(a.result).not.toBe(b.result);
  });

  it('hash output is always lowercase hex', async () => {
    const result = await generateHash('test', 'SHA-256');
    expect(result.result).toMatch(/^[0-9a-f]+$/);
  });
});
