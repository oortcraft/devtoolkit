import { describe, it, expect } from 'vitest';
import { queryJsonPath } from '../src/lib/jsonpath-utils';

const SAMPLE_JSON = JSON.stringify({
  store: {
    name: 'My Store',
    books: [
      { title: 'Book A', price: 10 },
      { title: 'Book B', price: 20 },
    ],
  },
});

describe('queryJsonPath', () => {
  it('returns empty for empty JSON input', () => {
    const { result } = queryJsonPath('', '$.store');
    expect(result).toBe('');
  });

  it('returns empty for empty path', () => {
    const { result, matchCount } = queryJsonPath(SAMPLE_JSON, '');
    expect(result).toBe('');
    expect(matchCount).toBe(0);
  });

  it('queries root object with $', () => {
    const { result, error, matchCount } = queryJsonPath(SAMPLE_JSON, '$');
    expect(error).toBeUndefined();
    expect(matchCount).toBeGreaterThan(0);
    const parsed = JSON.parse(result!);
    expect(parsed).toHaveProperty('store');
  });

  it('queries a nested property', () => {
    const { result, error } = queryJsonPath(SAMPLE_JSON, '$.store.name');
    expect(error).toBeUndefined();
    const parsed = JSON.parse(result!);
    expect(parsed).toBe('My Store');
  });

  it('queries array elements', () => {
    const { result, matchCount } = queryJsonPath(SAMPLE_JSON, '$.store.books[*].title');
    expect(matchCount).toBe(2);
    const parsed = JSON.parse(result!);
    expect(parsed).toContain('Book A');
    expect(parsed).toContain('Book B');
  });

  it('queries first array element with [0]', () => {
    const { result } = queryJsonPath(SAMPLE_JSON, '$.store.books[0]');
    const parsed = JSON.parse(result!);
    expect(parsed).toMatchObject({ title: 'Book A', price: 10 });
  });

  it('returns no-matches message when path has no results', () => {
    const { result, matchCount } = queryJsonPath(SAMPLE_JSON, '$.nonexistent');
    expect(result).toContain('No matches found');
    expect(matchCount).toBe(0);
  });

  it('returns error for invalid JSON', () => {
    const { error } = queryJsonPath('{bad json}', '$.foo');
    expect(error).toBeDefined();
    expect(error).toContain('Invalid JSON');
  });

  it('returns error for input exceeding 1MB', () => {
    const { error } = queryJsonPath('"' + 'a'.repeat(1_100_000) + '"', '$.foo');
    expect(error).toContain('too large');
  });

  it('queries all values with $..*', () => {
    const { matchCount } = queryJsonPath(SAMPLE_JSON, '$..*');
    expect(matchCount).toBeGreaterThan(0);
  });

  it('filters by price with filter expression', () => {
    const { result, matchCount } = queryJsonPath(SAMPLE_JSON, '$.store.books[?(@.price > 15)]');
    expect(matchCount).toBe(1);
    const parsed = JSON.parse(result!);
    expect(parsed).toMatchObject({ title: 'Book B' });
  });
});
