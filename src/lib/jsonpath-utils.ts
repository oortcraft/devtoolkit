import { JSONPath } from 'jsonpath-plus';

export function queryJsonPath(
  json: string,
  path: string
): { result?: string; error?: string; matchCount?: number } {
  if (!json.trim()) return { result: '' };
  if (!path.trim()) return { result: '', error: undefined, matchCount: 0 };

  if (json.length > 1_000_000) return { error: 'Input too large. Maximum 1MB.' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { error: e instanceof Error ? `Invalid JSON: ${e.message}` : 'Invalid JSON.' };
  }

  try {
    const results = JSONPath({ path, json: parsed, resultType: 'value' });
    if (!Array.isArray(results) || results.length === 0) {
      return { result: 'No matches found.', matchCount: 0 };
    }
    return {
      result: JSON.stringify(results.length === 1 ? results[0] : results, null, 2),
      matchCount: results.length,
    };
  } catch (e) {
    return { error: e instanceof Error ? `JSONPath error: ${e.message}` : 'Invalid JSONPath expression.' };
  }
}

export const QUICK_EXPRESSIONS = [
  { label: '$', description: 'Root' },
  { label: '$..*', description: 'All values' },
  { label: '$[0]', description: 'First element' },
  { label: '$[*]', description: 'All elements' },
];
