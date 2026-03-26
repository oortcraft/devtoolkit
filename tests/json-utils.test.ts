import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson, validateJson, jsonToYaml } from '../src/lib/json-utils';

describe('formatJson', () => {
  it('formats valid JSON with 2-space indentation', () => {
    const result = formatJson('{"a":1,"b":[2,3]}', 2);
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}');
  });

  it('formats valid JSON with 4-space indentation', () => {
    const result = formatJson('{"a":1}', 4);
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('{\n    "a": 1\n}');
  });

  it('returns error for invalid JSON', () => {
    const result = formatJson('{invalid}');
    expect(result.result).toBeUndefined();
    expect(result.error).toContain('Invalid JSON');
  });

  it('rejects input larger than 1MB', () => {
    const largeInput = 'a'.repeat(1_100_000);
    const result = formatJson(largeInput);
    expect(result.error).toContain('Input too large');
  });
});

describe('minifyJson', () => {
  it('minifies formatted JSON to single line', () => {
    const result = minifyJson('{\n  "a": 1,\n  "b": [2, 3]\n}');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('{"a":1,"b":[2,3]}');
  });
});

describe('validateJson', () => {
  it('returns valid=true for valid object', () => {
    const result = validateJson('{"name":"test","value":42}');
    expect(result.valid).toBe(true);
    expect(result.stats?.keys).toBe(2);
  });

  it('returns valid=true for valid array', () => {
    const result = validateJson('[1, 2, 3]');
    expect(result.valid).toBe(true);
    expect(result.stats?.arrayLength).toBe(3);
  });

  it('returns valid=true for primitive values', () => {
    expect(validateJson('"hello"').valid).toBe(true);
    expect(validateJson('42').valid).toBe(true);
    expect(validateJson('true').valid).toBe(true);
    expect(validateJson('null').valid).toBe(true);
  });

  it('returns valid=false with error for invalid JSON', () => {
    const result = validateJson('{invalid}');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid JSON');
  });

  it('returns correct depth stat', () => {
    const result = validateJson('{"a":{"b":{"c":1}}}');
    expect(result.valid).toBe(true);
    expect(result.stats?.depth).toBe(3);
  });
});

describe('jsonToYaml', () => {
  it('converts simple object correctly', () => {
    const result = jsonToYaml('{"name":"test","value":42}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('name: test');
    expect(result.result).toContain('value: 42');
  });

  it('converts nested object with arrays', () => {
    const result = jsonToYaml('{"items":[1,2,3],"nested":{"key":"val"}}');
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('items:');
    expect(result.result).toContain('- 1');
    expect(result.result).toContain('key: val');
  });

  it('returns error for invalid JSON input', () => {
    const result = jsonToYaml('{bad json}');
    expect(result.error).toContain('Invalid JSON');
  });

  it('rejects input larger than 1MB', () => {
    const largeInput = 'a'.repeat(1_100_000);
    const result = jsonToYaml(largeInput);
    expect(result.error).toContain('Input too large');
  });
});
