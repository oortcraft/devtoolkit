import { describe, it, expect } from 'vitest';
import { computeDiff, computeStats } from '../src/lib/diff-utils';

describe('computeDiff', () => {
  it('returns empty array for two empty strings', () => {
    const result = computeDiff('', '');
    expect(result).toHaveLength(0);
  });

  it('marks all lines unchanged for identical texts', () => {
    const text = 'line one\nline two\nline three';
    const result = computeDiff(text, text);
    expect(result.every(l => l.type === 'unchanged')).toBe(true);
  });

  it('marks added lines correctly', () => {
    const result = computeDiff('', 'new line');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('added');
    expect(result[0].content).toBe('new line');
    expect(result[0].lineNumberA).toBeNull();
    expect(result[0].lineNumberB).toBe(1);
  });

  it('marks removed lines correctly', () => {
    const result = computeDiff('old line', '');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('removed');
    expect(result[0].content).toBe('old line');
    expect(result[0].lineNumberA).toBe(1);
    expect(result[0].lineNumberB).toBeNull();
  });

  it('detects a single changed line', () => {
    const result = computeDiff('hello\nworld', 'hello\nearth');
    const added = result.filter(l => l.type === 'added');
    const removed = result.filter(l => l.type === 'removed');
    expect(added.some(l => l.content === 'earth')).toBe(true);
    expect(removed.some(l => l.content === 'world')).toBe(true);
  });

  it('handles multiline texts', () => {
    const a = 'a\nb\nc';
    const b = 'a\nx\nc';
    const result = computeDiff(a, b);
    expect(result.some(l => l.type === 'unchanged' && l.content === 'a')).toBe(true);
    expect(result.some(l => l.type === 'unchanged' && l.content === 'c')).toBe(true);
  });

  it('handles unicode content', () => {
    const result = computeDiff('안녕\n세계', '안녕\n지구');
    expect(result.some(l => l.type === 'unchanged' && l.content === '안녕')).toBe(true);
  });
});

describe('computeStats', () => {
  it('counts added, removed, and unchanged lines', () => {
    const lines = computeDiff('a\nb\nc', 'a\nx\nc');
    const stats = computeStats(lines);
    expect(stats.unchanged).toBe(2); // 'a' and 'c'
    expect(stats.added).toBe(1);    // 'x'
    expect(stats.removed).toBe(1);  // 'b'
  });

  it('returns zero stats for empty diff', () => {
    const stats = computeStats([]);
    expect(stats).toEqual({ added: 0, removed: 0, unchanged: 0 });
  });

  it('returns all unchanged for identical texts', () => {
    const lines = computeDiff('same\ntext', 'same\ntext');
    const stats = computeStats(lines);
    expect(stats.added).toBe(0);
    expect(stats.removed).toBe(0);
    expect(stats.unchanged).toBe(2);
  });
});
