import { load, loadAll, dump } from 'js-yaml';

export type ValidatorMode = 'validate' | 'yaml-to-json';

function countKeys(obj: unknown): number {
  if (obj === null || typeof obj !== 'object') return 0;
  if (Array.isArray(obj)) {
    return obj.reduce((acc, item) => acc + countKeys(item), 0);
  }
  const record = obj as Record<string, unknown>;
  const ownKeys = Object.keys(record).length;
  return ownKeys + Object.values(record).reduce((acc, val) => acc + countKeys(val), 0);
}

function maxDepth(obj: unknown): number {
  if (obj === null || typeof obj !== 'object') return 0;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return 1;
    return 1 + Math.max(...obj.map(maxDepth));
  }
  const values = Object.values(obj as Record<string, unknown>);
  if (values.length === 0) return 1;
  return 1 + Math.max(...values.map(maxDepth));
}

export function validateYaml(
  input: string,
  mode: ValidatorMode,
): { result?: string; error?: string } {
  if (input.length > 1_000_000) {
    return { error: 'Input too large (max 1 MB).' };
  }

  try {
    if (mode === 'validate') {
      const docs: unknown[] = [];
      loadAll(input, (doc) => docs.push(doc));
      const totalKeys = docs.reduce((acc, doc) => acc + countKeys(doc), 0);
      const depth = docs.reduce((acc, doc) => Math.max(acc, maxDepth(doc)), 0);
      const result = `✓ Valid YAML\n\nKeys: ${totalKeys} | Depth: ${depth} | Documents: ${docs.length}`;
      return { result };
    } else {
      const docs: unknown[] = [];
      loadAll(input, (doc) => docs.push(doc));
      const value = docs.length === 1 ? docs[0] : docs;
      const result = JSON.stringify(value, null, 2);
      return { result };
    }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'message' in err) {
      return { error: (err as { message: string }).message };
    }
    return { error: 'Invalid YAML.' };
  }
}

export const MODE_OPTIONS: { value: ValidatorMode; label: string }[] = [
  { value: 'validate', label: 'Validate' },
  { value: 'yaml-to-json', label: 'YAML → JSON' },
];
