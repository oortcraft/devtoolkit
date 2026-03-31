import { describe, it, expect } from 'vitest';
import { validateCron, parseCron, getNextRuns } from '../src/lib/cron-utils';

describe('validateCron', () => {
  it('validates the "every minute" expression', () => {
    expect(validateCron('* * * * *').valid).toBe(true);
  });

  it('validates a specific time expression', () => {
    expect(validateCron('30 8 * * 1').valid).toBe(true);
  });

  it('validates step expressions', () => {
    expect(validateCron('*/15 * * * *').valid).toBe(true);
  });

  it('validates range expressions', () => {
    expect(validateCron('0 9-17 * * 1-5').valid).toBe(true);
  });

  it('validates list expressions', () => {
    expect(validateCron('0 8,12,18 * * *').valid).toBe(true);
  });

  it('validates special @hourly string', () => {
    expect(validateCron('@hourly').valid).toBe(true);
  });

  it('validates special @daily string', () => {
    expect(validateCron('@daily').valid).toBe(true);
  });

  it('returns invalid for wrong field count', () => {
    const result = validateCron('* * *');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Expected 5 fields');
  });

  it('returns invalid for out-of-range minute', () => {
    const result = validateCron('60 * * * *');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for out-of-range hour', () => {
    const result = validateCron('0 24 * * *');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for out-of-range month', () => {
    const result = validateCron('0 0 * 13 *');
    expect(result.valid).toBe(false);
  });
});

describe('parseCron', () => {
  it('describes "* * * * *" as "Every minute"', () => {
    expect(parseCron('* * * * *')).toBe('Every minute');
  });

  it('describes "0 0 * * *" as "Every day at midnight"', () => {
    expect(parseCron('0 0 * * *')).toBe('Every day at midnight');
  });

  it('describes "0 12 * * *" as "Every day at noon"', () => {
    expect(parseCron('0 12 * * *')).toBe('Every day at noon');
  });

  it('describes "@hourly"', () => {
    expect(parseCron('@hourly')).toBe('Every hour');
  });

  it('describes "@daily"', () => {
    expect(parseCron('@daily')).toBe('Every day at midnight');
  });

  it('describes "@yearly"', () => {
    expect(parseCron('@yearly')).toBe('Every year on January 1st at midnight');
  });

  it('describes "@monthly"', () => {
    expect(parseCron('@monthly')).toBe('Every month on the 1st at midnight');
  });

  it('returns "Invalid cron expression" for invalid input', () => {
    expect(parseCron('invalid')).toBe('Invalid cron expression');
  });

  it('describes every-N-minutes step', () => {
    expect(parseCron('*/5 * * * *')).toBe('Every 5 minutes');
  });
});

describe('getNextRuns', () => {
  it('returns the requested number of future dates', () => {
    const runs = getNextRuns('* * * * *', 5);
    expect(runs).toHaveLength(5);
    runs.forEach(d => expect(d).toBeInstanceOf(Date));
  });

  it('returns empty array for invalid expression', () => {
    const runs = getNextRuns('invalid', 5);
    expect(runs).toHaveLength(0);
  });

  it('returns dates in ascending order', () => {
    const runs = getNextRuns('* * * * *', 3);
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i].getTime()).toBeGreaterThan(runs[i - 1].getTime());
    }
  });

  it('returns future dates only', () => {
    const now = Date.now();
    const runs = getNextRuns('* * * * *', 3);
    runs.forEach(d => expect(d.getTime()).toBeGreaterThan(now));
  });
});
