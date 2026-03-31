import { describe, it, expect } from 'vitest';
import { validateYaml, MODE_OPTIONS } from '../src/lib/yaml-validator-utils';

describe('validateYaml - validate mode', () => {
  it('returns valid result for simple YAML', () => {
    const result = validateYaml('name: test\nage: 30', 'validate');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('Valid YAML');
  });

  it('reports key count', () => {
    const result = validateYaml('a: 1\nb: 2\nc: 3', 'validate');
    expect(result.result).toContain('Keys: 3');
  });

  it('reports depth', () => {
    const result = validateYaml('a:\n  b:\n    c: 1', 'validate');
    expect(result.result).toMatch(/Depth: [3-9]/);
  });

  it('reports document count for multi-document YAML', () => {
    const result = validateYaml('---\na: 1\n---\nb: 2', 'validate');
    expect(result.result).toContain('Documents: 2');
  });

  it('returns error for invalid YAML', () => {
    const result = validateYaml('{ invalid: yaml:', 'validate');
    expect(result.error).toBeDefined();
  });

  it('returns error for input larger than 1MB', () => {
    const result = validateYaml('a: ' + 'x'.repeat(1_100_000), 'validate');
    expect(result.error).toContain('too large');
  });

  it('handles boolean values correctly', () => {
    const result = validateYaml('active: true\ndeleted: false', 'validate');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('Valid YAML');
  });

  it('handles null values', () => {
    const result = validateYaml('value: null\nother: ~', 'validate');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('Valid YAML');
  });

  it('handles numeric values', () => {
    const result = validateYaml('int: 42\nfloat: 3.14\nneg: -1', 'validate');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('Valid YAML');
  });

  it('handles arrays', () => {
    const result = validateYaml('items:\n  - a\n  - b\n  - c', 'validate');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('Valid YAML');
  });

  it('handles deeply nested structures', () => {
    const yaml = 'l1:\n  l2:\n    l3:\n      l4:\n        l5: deep';
    const result = validateYaml(yaml, 'validate');
    expect(result.result).toMatch(/Depth: [5-9]/);
  });
});

describe('validateYaml - yaml-to-json mode', () => {
  it('converts simple YAML to JSON', () => {
    const result = validateYaml('name: test\nage: 30', 'yaml-to-json');
    expect(result.error).toBeUndefined();
    const json = JSON.parse(result.result!);
    expect(json.name).toBe('test');
    expect(json.age).toBe(30);
  });

  it('converts YAML array to JSON array', () => {
    const result = validateYaml('- apple\n- banana\n- cherry', 'yaml-to-json');
    const json = JSON.parse(result.result!);
    expect(Array.isArray(json)).toBe(true);
    expect(json).toHaveLength(3);
  });

  it('converts nested YAML', () => {
    const result = validateYaml('user:\n  name: test\n  age: 25', 'yaml-to-json');
    const json = JSON.parse(result.result!);
    expect(json.user.name).toBe('test');
  });

  it('returns error for invalid YAML in yaml-to-json mode', () => {
    const result = validateYaml('{ invalid: yaml:', 'yaml-to-json');
    expect(result.error).toBeDefined();
  });

  it('converts multiline string (literal block)', () => {
    const yaml = 'text: |\n  line one\n  line two';
    const result = validateYaml(yaml, 'yaml-to-json');
    expect(result.error).toBeUndefined();
    const json = JSON.parse(result.result!);
    expect(json.text).toContain('line one');
    expect(json.text).toContain('line two');
  });

  it('converts special values (null, booleans)', () => {
    const yaml = 'a: null\nb: true\nc: false';
    const result = validateYaml(yaml, 'yaml-to-json');
    const json = JSON.parse(result.result!);
    expect(json.a).toBeNull();
    expect(json.b).toBe(true);
    expect(json.c).toBe(false);
  });
});

describe('MODE_OPTIONS', () => {
  it('has validate and yaml-to-json modes', () => {
    expect(MODE_OPTIONS).toHaveLength(2);
    const values = MODE_OPTIONS.map(m => m.value);
    expect(values).toContain('validate');
    expect(values).toContain('yaml-to-json');
  });
});
