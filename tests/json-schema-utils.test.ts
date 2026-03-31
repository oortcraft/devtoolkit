import { describe, it, expect } from 'vitest';
import { validateJsonSchema, SAMPLE_SCHEMA, SAMPLE_DATA } from '../src/lib/json-schema-utils';

describe('validateJsonSchema', () => {
  it('validates a simple object schema + matching data as valid', () => {
    const schema = '{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}';
    const data = '{"name":"Alice"}';
    const result = validateJsonSchema(schema, data);
    expect(result.result?.valid).toBe(true);
    expect(result.result?.errors).toHaveLength(0);
  });

  it('detects missing required field', () => {
    const schema = '{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}';
    const data = '{}';
    const result = validateJsonSchema(schema, data);
    expect(result.result?.valid).toBe(false);
    expect(result.result?.errors.length).toBeGreaterThan(0);
  });

  it('detects type mismatch', () => {
    const schema = '{"type":"object","properties":{"age":{"type":"number"}},"required":["age"]}';
    const data = '{"age":"not-a-number"}';
    const result = validateJsonSchema(schema, data);
    expect(result.result?.valid).toBe(false);
  });

  it('returns error for invalid schema JSON', () => {
    const result = validateJsonSchema('{invalid', '{}');
    expect(result.error).toBeDefined();
  });

  it('returns error for invalid data JSON', () => {
    const result = validateJsonSchema('{"type":"object"}', '{invalid');
    expect(result.error).toBeDefined();
  });

  it('validates a simple string schema', () => {
    const result = validateJsonSchema('{"type":"string"}', '"hello"');
    expect(result.result?.valid).toBe(true);
  });

  it('validates an array schema', () => {
    const schema = '{"type":"array","items":{"type":"number"}}';
    const data = '[1, 2, 3]';
    const result = validateJsonSchema(schema, data);
    expect(result.result?.valid).toBe(true);
  });

  it('provides error details with path and message', () => {
    const schema = '{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}';
    const data = '{"name": 123}';
    const result = validateJsonSchema(schema, data);
    expect(result.result?.valid).toBe(false);
    const err = result.result?.errors[0];
    expect(err?.message).toBeDefined();
    expect(err?.keyword).toBeDefined();
  });

  it('validates nested object schema', () => {
    const schema = '{"type":"object","properties":{"user":{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}}}';
    const data = '{"user":{"name":"Alice"}}';
    const result = validateJsonSchema(schema, data);
    expect(result.result?.valid).toBe(true);
  });

  it('detects invalid nested data', () => {
    const schema = '{"type":"object","properties":{"user":{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}}}';
    const data = '{"user":{}}';
    const result = validateJsonSchema(schema, data);
    expect(result.result?.valid).toBe(false);
  });

  it('validates with anyOf schema', () => {
    const schema = '{"anyOf":[{"type":"string"},{"type":"number"}]}';
    expect(validateJsonSchema(schema, '"hello"').result?.valid).toBe(true);
    expect(validateJsonSchema(schema, '42').result?.valid).toBe(true);
    expect(validateJsonSchema(schema, 'true').result?.valid).toBe(false);
  });

  it('validates with enum constraint', () => {
    const schema = '{"type":"string","enum":["red","green","blue"]}';
    expect(validateJsonSchema(schema, '"red"').result?.valid).toBe(true);
    expect(validateJsonSchema(schema, '"yellow"').result?.valid).toBe(false);
  });

  it('SAMPLE_SCHEMA compilation fails on unknown format (email requires ajv-formats)', () => {
    const result = validateJsonSchema(SAMPLE_SCHEMA, SAMPLE_DATA);
    expect(result.error).toContain('format');
  });

  it('rejects schema larger than 1MB', () => {
    const bigSchema = '{"type":"string","description":"' + 'a'.repeat(1_100_000) + '"}';
    const result = validateJsonSchema(bigSchema, '"test"');
    expect(result.error).toContain('too large');
  });
});
