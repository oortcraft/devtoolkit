import { describe, it, expect } from 'vitest';
import { formatSql } from '../src/lib/sql-formatter-utils';

describe('formatSql - format mode', () => {
  it('formats a simple SELECT statement', () => {
    const { result, error } = formatSql('select id,name from users where id=1', 'sql', 'format');
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(result!.toLowerCase()).toContain('select');
    expect(result!.toLowerCase()).toContain('from');
  });

  it('uppercases SQL keywords', () => {
    const { result } = formatSql('select * from t', 'sql', 'format');
    expect(result).toContain('SELECT');
    expect(result).toContain('FROM');
  });

  it('formats with postgresql dialect', () => {
    const { result, error } = formatSql('SELECT id FROM users', 'postgresql', 'format');
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });

  it('formats with mysql dialect', () => {
    const { result, error } = formatSql('SELECT id FROM users', 'mysql', 'format');
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });

  it('formats INSERT statement', () => {
    const { result, error } = formatSql("insert into t (a,b) values (1,'x')", 'sql', 'format');
    expect(error).toBeUndefined();
    expect(result!.toUpperCase()).toContain('INSERT');
  });

  it('does not crash on empty-ish input', () => {
    const { result, error } = formatSql('   ', 'sql', 'format');
    // May return empty result or an error — should not throw
    expect(result !== undefined || error !== undefined).toBe(true);
  });

  it('returns error for input exceeding 1MB', () => {
    const { error } = formatSql('a'.repeat(1_100_000), 'sql', 'format');
    expect(error).toContain('exceeds 1MB');
  });
});

describe('formatSql - minify mode', () => {
  it('collapses whitespace to single spaces', () => {
    const { result } = formatSql('SELECT   id\n  FROM   users\n  WHERE  id = 1', 'sql', 'minify');
    expect(result).toBe('SELECT id FROM users WHERE id = 1');
  });

  it('trims leading and trailing whitespace', () => {
    const { result } = formatSql('  SELECT 1  ', 'sql', 'minify');
    expect(result).toBe('SELECT 1');
  });
});
