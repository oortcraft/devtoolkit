import { describe, it, expect } from 'vitest';
import { validateYaml } from '../src/lib/yaml-validator-utils';

describe('validateYaml - validate mode', () => {
  it('returns valid result for simple YAML', () => {
    const { result, error } = validateYaml('name: Alice\nage: 30', 'validate');
    expect(error).toBeUndefined();
    expect(result).toContain('Valid YAML');
  });

  it('reports key count', () => {
    const { result } = validateYaml('a: 1\nb: 2\nc: 3', 'validate');
    expect(result).toContain('Keys: 3');
  });

  it('reports depth', () => {
    const { result } = validateYaml('outer:\n  inner:\n    value: 1', 'validate');
    expect(result).toContain('Depth:');
  });

  it('reports document count for multi-document YAML', () => {
    const multiDoc = 'name: Alice\n---\nname: Bob';
    const { result } = validateYaml(multiDoc, 'validate');
    expect(result).toContain('Documents: 2');
  });

  it('returns error for invalid YAML', () => {
    const { error } = validateYaml('key: [unclosed bracket', 'validate');
    expect(error).toBeDefined();
  });

  it('returns error for input larger than 1MB', () => {
    const { error } = validateYaml('a'.repeat(1_100_000), 'validate');
    expect(error).toContain('Input too large');
  });
});

describe('validateYaml - yaml-to-json mode', () => {
  it('converts simple YAML to JSON', () => {
    const { result, error } = validateYaml('name: Alice\nage: 30', 'yaml-to-json');
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    const parsed = JSON.parse(result!);
    expect(parsed).toMatchObject({ name: 'Alice', age: 30 });
  });

  it('converts YAML array to JSON array', () => {
    const { result } = validateYaml('- 1\n- 2\n- 3', 'yaml-to-json');
    const parsed = JSON.parse(result!);
    expect(parsed).toEqual([1, 2, 3]);
  });

  it('converts nested YAML', () => {
    const { result } = validateYaml('person:\n  name: Bob\n  age: 25', 'yaml-to-json');
    const parsed = JSON.parse(result!);
    expect(parsed.person.name).toBe('Bob');
  });

  it('returns error for invalid YAML in yaml-to-json mode', () => {
    const { error } = validateYaml('key: [bad', 'yaml-to-json');
    expect(error).toBeDefined();
  });
});
