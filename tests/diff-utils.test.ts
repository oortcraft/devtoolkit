import { describe, it, expect } from 'vitest';
import { computeDiff, computeStats } from '../src/lib/diff-utils';

describe('computeDiff', () => {
  it('returns empty array for two empty strings', () => {
    expect(computeDiff('', '')).toEqual([]);
  });

  it('marks all lines unchanged for identical texts', () => {
    const lines = computeDiff('hello\nworld', 'hello\nworld');
    expect(lines.every(l => l.type === 'unchanged')).toBe(true);
    expect(lines).toHaveLength(2);
  });

  it('marks added lines correctly', () => {
    const lines = computeDiff('', 'new line');
    expect(lines.some(l => l.type === 'added')).toBe(true);
  });

  it('marks removed lines correctly', () => {
    const lines = computeDiff('old line', '');
    expect(lines.some(l => l.type === 'removed')).toBe(true);
  });

  it('detects a single changed line', () => {
    const lines = computeDiff('hello', 'world');
    expect(lines.some(l => l.type === 'removed' && l.content === 'hello')).toBe(true);
    expect(lines.some(l => l.type === 'added' && l.content === 'world')).toBe(true);
  });

  it('handles multiline texts', () => {
    const lines = computeDiff('a\nb\nc', 'a\nx\nc');
    expect(lines.some(l => l.type === 'removed' && l.content === 'b')).toBe(true);
    expect(lines.some(l => l.type === 'added' && l.content === 'x')).toBe(true);
    expect(lines.filter(l => l.type === 'unchanged')).toHaveLength(2);
  });

  it('handles unicode content', () => {
    const lines = computeDiff('안녕', '안녕하세요');
    expect(lines.some(l => l.type === 'added')).toBe(true);
  });

  it('handles blank lines within text', () => {
    const lines = computeDiff('a\n\nb', 'a\n\nc');
    expect(lines.filter(l => l.type === 'unchanged')).toHaveLength(2);
    expect(lines.some(l => l.type === 'removed' && l.content === 'b')).toBe(true);
    expect(lines.some(l => l.type === 'added' && l.content === 'c')).toBe(true);
  });

  it('handles consecutive additions', () => {
    const lines = computeDiff('a', 'a\nb\nc\nd');
    const added = lines.filter(l => l.type === 'added');
    expect(added).toHaveLength(3);
  });

  it('handles consecutive removals', () => {
    const lines = computeDiff('a\nb\nc\nd', 'a');
    const removed = lines.filter(l => l.type === 'removed');
    expect(removed).toHaveLength(3);
  });

  it('handles whitespace-only changes', () => {
    const lines = computeDiff('hello world', 'hello  world');
    expect(lines.some(l => l.type === 'removed')).toBe(true);
    expect(lines.some(l => l.type === 'added')).toBe(true);
  });

  it('assigns correct line numbers', () => {
    const lines = computeDiff('a\nb', 'a\nc');
    const unchanged = lines.find(l => l.type === 'unchanged');
    expect(unchanged?.lineNumberA).toBe(1);
    expect(unchanged?.lineNumberB).toBe(1);
  });

  it('handles one side empty and other has multiple lines', () => {
    const lines = computeDiff('', 'a\nb\nc');
    expect(lines.filter(l => l.type === 'added')).toHaveLength(3);
  });

  it('handles completely replaced text', () => {
    const lines = computeDiff('a\nb\nc', 'x\ny\nz');
    expect(lines.filter(l => l.type === 'removed')).toHaveLength(3);
    expect(lines.filter(l => l.type === 'added')).toHaveLength(3);
  });
});

describe('computeStats', () => {
  it('counts added, removed, and unchanged lines', () => {
    const diff = computeDiff('a\nb', 'a\nc');
    const stats = computeStats(diff);
    expect(stats.unchanged).toBe(1);
    expect(stats.removed).toBe(1);
    expect(stats.added).toBe(1);
  });

  it('returns zero stats for empty diff', () => {
    const stats = computeStats([]);
    expect(stats.added).toBe(0);
    expect(stats.removed).toBe(0);
    expect(stats.unchanged).toBe(0);
  });

  it('returns all unchanged for identical texts', () => {
    const diff = computeDiff('same\ntext', 'same\ntext');
    const stats = computeStats(diff);
    expect(stats.unchanged).toBe(2);
    expect(stats.added).toBe(0);
    expect(stats.removed).toBe(0);
  });

  it('counts all added when B is entirely new', () => {
    const diff = computeDiff('', 'a\nb\nc');
    const stats = computeStats(diff);
    expect(stats.added).toBe(3);
    expect(stats.removed).toBe(0);
  });
});
