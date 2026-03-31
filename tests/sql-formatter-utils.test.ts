import { describe, it, expect } from 'vitest';
import { formatSql, DIALECT_OPTIONS } from '../src/lib/sql-formatter-utils';

describe('formatSql - format mode', () => {
  it('formats a simple SELECT statement', () => {
    const result = formatSql('select id, name from users', 'sql', 'format');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('SELECT');
    expect(result.result).toContain('FROM');
  });

  it('uppercases SQL keywords', () => {
    const result = formatSql('select * from users where id = 1', 'sql', 'format');
    expect(result.result).toContain('SELECT');
    expect(result.result).toContain('FROM');
    expect(result.result).toContain('WHERE');
  });

  it('formats with PostgreSQL dialect', () => {
    const result = formatSql('select * from users', 'postgresql', 'format');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('SELECT');
  });

  it('formats with MySQL dialect', () => {
    const result = formatSql('select * from users', 'mysql', 'format');
    expect(result.error).toBeUndefined();
  });

  it('formats with SQLite dialect', () => {
    const result = formatSql('select * from users', 'sqlite', 'format');
    expect(result.error).toBeUndefined();
  });

  it('formats INSERT statement', () => {
    const result = formatSql("insert into users (name, age) values ('Alice', 30)", 'sql', 'format');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('INSERT');
  });

  it('formats JOIN query', () => {
    const result = formatSql('select u.name, o.total from users u inner join orders o on u.id = o.user_id', 'sql', 'format');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('JOIN');
  });

  it('formats subquery', () => {
    const result = formatSql('select * from users where id in (select user_id from orders)', 'sql', 'format');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('SELECT');
  });

  it('formats CREATE TABLE', () => {
    const result = formatSql('create table users (id int primary key, name varchar(100))', 'sql', 'format');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('CREATE');
  });

  it('formats UPDATE statement', () => {
    const result = formatSql("update users set name = 'Bob' where id = 1", 'sql', 'format');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('UPDATE');
  });

  it('formats DELETE statement', () => {
    const result = formatSql('delete from users where id = 1', 'sql', 'format');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('DELETE');
  });

  it('formats GROUP BY with HAVING', () => {
    const result = formatSql('select department, count(*) as cnt from employees group by department having count(*) > 5', 'sql', 'format');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('GROUP BY');
  });

  it('handles empty/whitespace input', () => {
    const result = formatSql('   ', 'sql', 'format');
    expect(result.error).toBeUndefined();
  });

  it('rejects input exceeding 1MB', () => {
    const result = formatSql('SELECT '.repeat(200_000), 'sql', 'format');
    expect(result.error).toContain('1MB');
  });

  it('handles SQL with comments', () => {
    const result = formatSql('-- this is a comment\nselect * from users', 'sql', 'format');
    expect(result.error).toBeUndefined();
  });
});

describe('formatSql - minify mode', () => {
  it('collapses whitespace', () => {
    const result = formatSql('SELECT  *\n  FROM   users\n  WHERE id = 1', 'sql', 'minify');
    expect(result.result).not.toContain('\n');
    expect(result.result).not.toContain('  ');
  });

  it('trims leading/trailing whitespace', () => {
    const result = formatSql('  SELECT * FROM users  ', 'sql', 'minify');
    expect(result.result).not.toMatch(/^\s/);
    expect(result.result).not.toMatch(/\s$/);
  });

  it('minifies multi-line SQL', () => {
    const sql = 'SELECT\n  id,\n  name\nFROM\n  users';
    const result = formatSql(sql, 'sql', 'minify');
    expect(result.result?.split('\n')).toHaveLength(1);
  });
});

describe('DIALECT_OPTIONS', () => {
  it('has 6 dialect options', () => {
    expect(DIALECT_OPTIONS).toHaveLength(6);
  });

  it('contains all expected dialects', () => {
    const values = DIALECT_OPTIONS.map(d => d.value);
    expect(values).toContain('sql');
    expect(values).toContain('postgresql');
    expect(values).toContain('mysql');
    expect(values).toContain('sqlite');
    expect(values).toContain('tsql');
    expect(values).toContain('plsql');
  });
});
