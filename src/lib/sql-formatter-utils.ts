import { format } from 'sql-formatter';

export type SqlDialect = 'sql' | 'postgresql' | 'mysql' | 'sqlite' | 'tsql' | 'plsql';

export const DIALECT_OPTIONS: { value: SqlDialect; label: string }[] = [
  { value: 'sql', label: 'Standard' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'tsql', label: 'T-SQL' },
  { value: 'plsql', label: 'PL/SQL' },
];

const SIZE_LIMIT = 1024 * 1024; // 1MB

export function formatSql(
  input: string,
  dialect: SqlDialect,
  mode: 'format' | 'minify',
): { result?: string; error?: string } {
  if (input.length > SIZE_LIMIT) {
    return { error: 'Input exceeds 1MB size limit.' };
  }

  try {
    if (mode === 'minify') {
      const result = input.replace(/\s+/g, ' ').trim();
      return { result };
    }

    const result = format(input, {
      language: dialect,
      tabWidth: 2,
      keywordCase: 'upper',
    });
    return { result };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to format SQL.' };
  }
}
