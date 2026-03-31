import { describe, it, expect } from 'vitest';
import { fromUnix, toUnix, getCurrentTimestamp, getRelativeTime } from '../src/lib/timestamp-utils';

describe('fromUnix', () => {
  it('converts a known Unix timestamp (seconds) to ISO 8601', () => {
    const result = fromUnix(0, false);
    expect(result.iso).toBe('1970-01-01T00:00:00.000Z');
  });

  it('converts a known Unix timestamp in milliseconds', () => {
    const result = fromUnix(0, true);
    expect(result.iso).toBe('1970-01-01T00:00:00.000Z');
  });

  it('returns iso, utc, local, relative fields', () => {
    const result = fromUnix(1700000000, false);
    expect(result.iso).toBeDefined();
    expect(result.utc).toBeDefined();
    expect(result.local).toBeDefined();
    expect(result.relative).toBeDefined();
  });

  it('throws for NaN timestamp', () => {
    expect(() => fromUnix(NaN, false)).toThrow('Invalid timestamp');
  });
});

describe('toUnix', () => {
  it('converts a known ISO date string to Unix timestamp', () => {
    const ts = toUnix('1970-01-01T00:00:00Z');
    expect(ts).toBe(0);
  });

  it('converts a recent date correctly', () => {
    const ts = toUnix('2024-01-01T00:00:00Z');
    expect(ts).toBe(1704067200);
  });

  it('throws for invalid date string', () => {
    expect(() => toUnix('not-a-date')).toThrow('Invalid date string');
  });
});

describe('getCurrentTimestamp', () => {
  it('returns a number close to Date.now()/1000', () => {
    const ts = getCurrentTimestamp();
    const approx = Math.floor(Date.now() / 1000);
    expect(Math.abs(ts - approx)).toBeLessThanOrEqual(1);
  });
});

describe('getRelativeTime', () => {
  it('returns "just now" for a date within 5 seconds', () => {
    const result = getRelativeTime(new Date());
    expect(result).toBe('just now');
  });

  it('returns seconds ago for a recent past date', () => {
    const past = new Date(Date.now() - 30_000);
    const result = getRelativeTime(past);
    expect(result).toContain('seconds ago');
  });

  it('returns minutes ago for a date ~2 min ago', () => {
    const past = new Date(Date.now() - 2 * 60_000);
    const result = getRelativeTime(past);
    expect(result).toContain('minutes ago');
  });

  it('returns hours ago for a date ~3 hours ago', () => {
    const past = new Date(Date.now() - 3 * 60 * 60_000);
    const result = getRelativeTime(past);
    expect(result).toContain('hours ago');
  });

  it('returns future text for a future date', () => {
    const future = new Date(Date.now() + 2 * 60_000);
    const result = getRelativeTime(future);
    expect(result).toContain('in');
  });
});
