import { describe, it, expect } from 'vitest';
import { convertBase } from '../src/lib/base-converter-utils';

describe('convertBase', () => {
  it('returns empty for empty input', () => {
    expect(convertBase('', 10)).toEqual({ result: '' });
  });

  it('converts decimal 255 and includes hex FF', () => {
    const { result, error } = convertBase('255', 10);
    expect(error).toBeUndefined();
    expect(result).toContain('FF');
  });

  it('converts decimal 255 and includes binary 11111111', () => {
    const { result } = convertBase('255', 10);
    expect(result).toContain('11111111');
  });

  it('converts decimal 255 and includes octal 377', () => {
    const { result } = convertBase('255', 10);
    expect(result).toContain('377');
  });

  it('converts decimal 0', () => {
    const { result } = convertBase('0', 10);
    expect(result).toContain('0');
  });

  it('converts hex FF to other bases', () => {
    const { result } = convertBase('FF', 16);
    expect(result).toContain('255'); // decimal
    expect(result).toContain('11111111'); // binary
  });

  it('strips 0x prefix from hex input', () => {
    const { result } = convertBase('0xFF', 16);
    expect(result).toBeDefined();
    expect(result).toContain('255');
  });

  it('strips 0b prefix from binary input', () => {
    const { result } = convertBase('0b11111111', 2);
    expect(result).toContain('255');
  });

  it('strips 0o prefix from octal input', () => {
    const { result } = convertBase('0o377', 8);
    expect(result).toContain('255');
  });

  it('converts binary 1010 to decimal 10', () => {
    const { result } = convertBase('1010', 2);
    expect(result).toContain('10'); // decimal row
  });

  it('returns error for invalid hex character', () => {
    const { error } = convertBase('ZZZZ', 16);
    expect(error).toBeDefined();
    expect(error).toContain('Invalid character');
  });

  it('returns error for invalid binary character', () => {
    const { error } = convertBase('2', 2);
    expect(error).toBeDefined();
  });

  it('returns error for invalid octal character', () => {
    const { error } = convertBase('9', 8);
    expect(error).toBeDefined();
  });

  it('handles large numbers', () => {
    const { result, error } = convertBase('999999999999', 10);
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
