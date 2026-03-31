import { describe, it, expect } from 'vitest';
import { testRegex } from '../src/lib/regex-utils';

describe('testRegex', () => {
  it('returns empty result for empty pattern', () => {
    const result = testRegex('', '', 'hello world');
    expect(result.matches).toHaveLength(0);
    expect(result.count).toBe(0);
    expect(result.error).toBeUndefined();
  });

  it('finds a simple match without global flag', () => {
    const result = testRegex('hello', '', 'hello world');
    expect(result.count).toBe(1);
    expect(result.matches[0].match).toBe('hello');
    expect(result.matches[0].index).toBe(0);
  });

  it('finds all matches with global flag', () => {
    // 'foo bar boo' contains 'o' at indices 1,2,8,9 → 4 matches
    const result = testRegex('o', 'g', 'foo bar boo');
    expect(result.count).toBe(4);
  });

  it('returns error for invalid regex', () => {
    const result = testRegex('[invalid', '', 'test');
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Invalid regex');
    expect(result.count).toBe(0);
  });

  it('returns no matches when pattern does not match', () => {
    const result = testRegex('xyz', '', 'hello world');
    expect(result.count).toBe(0);
    expect(result.matches).toHaveLength(0);
  });

  it('captures named groups', () => {
    const result = testRegex('(?<year>\\d{4})-(?<month>\\d{2})', '', '2024-01');
    expect(result.count).toBe(1);
    expect(result.matches[0].groups).toMatchObject({ year: '2024', month: '01' });
  });

  it('captures subgroups', () => {
    const result = testRegex('(\\d+)-(\\d+)', '', '2024-01');
    expect(result.matches[0].subgroups).toEqual(['2024', '01']);
  });

  it('is case-insensitive with i flag', () => {
    const result = testRegex('hello', 'i', 'HELLO world');
    expect(result.count).toBe(1);
    expect(result.matches[0].match).toBe('HELLO');
  });

  it('handles zero-width matches without infinite loop', () => {
    // Zero-width match: empty string matches every position
    const result = testRegex('(?=o)', 'g', 'foo');
    expect(result.count).toBeGreaterThan(0);
  });

  it('handles unicode characters in test string', () => {
    const result = testRegex('안녕', 'g', '안녕하세요 안녕');
    expect(result.count).toBe(2);
  });
});
