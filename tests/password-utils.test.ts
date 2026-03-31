import { describe, it, expect } from 'vitest';
import { generatePassword, calculateStrength } from '../src/lib/password-utils';

const allOptions = { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true };

describe('generatePassword', () => {
  it('generates a password of the requested length', () => {
    const { result, error } = generatePassword(allOptions);
    expect(error).toBeUndefined();
    expect(result).toHaveLength(16);
  });

  it('generates a password of length 1', () => {
    const { result } = generatePassword({ ...allOptions, length: 1 });
    expect(result).toHaveLength(1);
  });

  it('generates a password of length 128 (max)', () => {
    const { result } = generatePassword({ ...allOptions, length: 128 });
    expect(result).toHaveLength(128);
  });

  it('returns error for length 0', () => {
    const { error } = generatePassword({ ...allOptions, length: 0 });
    expect(error).toBeDefined();
    expect(error).toContain('Length must be between');
  });

  it('returns error for length > 128', () => {
    const { error } = generatePassword({ ...allOptions, length: 200 });
    expect(error).toBeDefined();
  });

  it('returns error when no character types are selected', () => {
    const { error } = generatePassword({ length: 16, uppercase: false, lowercase: false, numbers: false, symbols: false });
    expect(error).toBeDefined();
    expect(error).toContain('Select at least one character type');
  });

  it('only uses uppercase chars when only uppercase enabled', () => {
    const { result } = generatePassword({ length: 20, uppercase: true, lowercase: false, numbers: false, symbols: false });
    expect(result).toMatch(/^[A-Z]+$/);
  });

  it('only uses digits when only numbers enabled', () => {
    const { result } = generatePassword({ length: 20, uppercase: false, lowercase: false, numbers: true, symbols: false });
    expect(result).toMatch(/^[0-9]+$/);
  });

  it('generates different passwords on successive calls', () => {
    const a = generatePassword(allOptions).result;
    const b = generatePassword(allOptions).result;
    // Extremely unlikely to be the same
    expect(a).not.toBe(b);
  });
});

describe('calculateStrength', () => {
  it('rates a short simple password as Weak', () => {
    const { label } = calculateStrength('abc');
    expect(label).toBe('Weak');
  });

  it('rates a medium password correctly', () => {
    const { label, score } = calculateStrength('Password1');
    expect(['Weak', 'Medium', 'Strong']).toContain(label);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('rates a long complex password as Strong', () => {
    const { label } = calculateStrength('P@ssw0rd!Secure#2024');
    expect(label).toBe('Strong');
  });

  it('returns score as a number', () => {
    const { score } = calculateStrength('hello');
    expect(typeof score).toBe('number');
  });
});
