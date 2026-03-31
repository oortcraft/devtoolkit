import { describe, it, expect } from 'vitest';
import { testRegex } from '../src/lib/regex-utils';

describe('testRegex', () => {
  it('returns empty result for empty pattern', () => {
    const result = testRegex('', '', 'hello');
    expect(result.matches).toHaveLength(0);
    expect(result.count).toBe(0);
  });

  it('returns no match when pattern does not match', () => {
    const result = testRegex('xyz', 'g', 'hello world');
    expect(result.count).toBe(0);
  });

  it('returns error for invalid regex', () => {
    const result = testRegex('[invalid', '', 'test');
    expect(result.error).toBeDefined();
    expect(result.matches).toHaveLength(0);
  });

  it('finds all matches with global flag', () => {
    const result = testRegex('\\d+', 'g', 'abc 123 def 456');
    expect(result.count).toBe(2);
    expect(result.matches[0].match).toBe('123');
    expect(result.matches[1].match).toBe('456');
  });

  it('finds only first match without global flag', () => {
    const result = testRegex('\\d+', '', 'abc 123 def 456');
    expect(result.count).toBe(1);
    expect(result.matches[0].match).toBe('123');
  });

  it('extracts named groups', () => {
    const result = testRegex('(?<year>\\d{4})-(?<month>\\d{2})', '', '2024-03');
    expect(result.matches[0].groups?.year).toBe('2024');
    expect(result.matches[0].groups?.month).toBe('03');
  });

  it('extracts subgroups', () => {
    const result = testRegex('(\\w+)@(\\w+)', '', 'user@host');
    expect(result.matches[0].subgroups).toContain('user');
    expect(result.matches[0].subgroups).toContain('host');
  });

  it('handles case-insensitive flag', () => {
    const result = testRegex('hello', 'gi', 'Hello HELLO hello');
    expect(result.count).toBe(3);
  });

  it('handles zero-width matches without infinite loop', () => {
    const result = testRegex('(?=\\d)', 'g', 'a1b2c3');
    expect(result.count).toBeGreaterThanOrEqual(3);
  });

  it('handles unicode characters', () => {
    const result = testRegex('안녕', 'g', '안녕하세요 안녕');
    expect(result.count).toBe(2);
  });

  it('provides match index', () => {
    const result = testRegex('world', '', 'hello world');
    expect(result.matches[0].index).toBe(6);
  });

  it('handles multiline flag', () => {
    const result = testRegex('^hello', 'gm', 'hello\nworld\nhello');
    expect(result.count).toBe(2);
  });

  it('handles dot-all-like matching with [\\s\\S]', () => {
    const result = testRegex('[\\s\\S]+', '', 'line1\nline2');
    expect(result.count).toBe(1);
    expect(result.matches[0].match).toContain('line1');
    expect(result.matches[0].match).toContain('line2');
  });

  it('handles complex patterns with alternation', () => {
    const result = testRegex('cat|dog', 'g', 'I have a cat and a dog');
    expect(result.count).toBe(2);
  });

  it('handles quantifiers correctly', () => {
    const result = testRegex('a{2,4}', 'g', 'a aa aaa aaaa aaaaa');
    expect(result.count).toBeGreaterThanOrEqual(3);
  });

  it('returns null groups when no named groups', () => {
    const result = testRegex('hello', '', 'hello');
    expect(result.matches[0].groups).toBeNull();
  });
});
