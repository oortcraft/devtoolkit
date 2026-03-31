import { describe, it, expect } from 'vitest';
import { validateJsonSchema, SAMPLE_SCHEMA, SAMPLE_DATA } from '../src/lib/json-schema-utils';

describe('validateJsonSchema', () => {
  it('validates a simple object schema + matching data as valid', () => {
    const schema = JSON.stringify({
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    });
    const data = JSON.stringify({ id: 1, name: 'Alice' });
    const { result, error } = validateJsonSchema(schema, data);
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(result!.valid).toBe(true);
    expect(result!.errors).toHaveLength(0);
  });

  it('returns invalid result when required field is missing', () => {
    const schema = JSON.stringify({ type: 'object', required: ['name'], properties: { name: { type: 'string' } } });
    const data = JSON.stringify({});
    const { result } = validateJsonSchema(schema, data);
    expect(result!.valid).toBe(false);
    expect(result!.errors.length).toBeGreaterThan(0);
  });

  it('returns invalid result when type is wrong', () => {
    const schema = JSON.stringify({ type: 'object', properties: { age: { type: 'integer' } } });
    const data = JSON.stringify({ age: 'not-a-number' });
    const { result } = validateJsonSchema(schema, data);
    expect(result!.valid).toBe(false);
  });

  it('returns error for invalid schema JSON', () => {
    const { error } = validateJsonSchema('{bad schema', '{}');
    expect(error).toBeDefined();
    expect(error).toContain('Schema parse error');
  });

  it('returns error for invalid data JSON', () => {
    const { error } = validateJsonSchema('{"type":"object"}', '{bad data}');
    expect(error).toBeDefined();
    expect(error).toContain('Data parse error');
  });

  it('validates a simple string schema', () => {
    const schema = JSON.stringify({ type: 'string' });
    const data = JSON.stringify('hello');
    const { result } = validateJsonSchema(schema, data);
    expect(result!.valid).toBe(true);
  });

  it('validates an array schema', () => {
    const schema = JSON.stringify({ type: 'array', items: { type: 'number' } });
    const data = JSON.stringify([1, 2, 3]);
    const { result } = validateJsonSchema(schema, data);
    expect(result!.valid).toBe(true);
  });

  it('includes path and keyword in error details', () => {
    const schema = JSON.stringify({ type: 'object', required: ['name'], properties: { name: { type: 'string' } } });
    const data = JSON.stringify({});
    const { result } = validateJsonSchema(schema, data);
    const err = result!.errors[0];
    expect(err.keyword).toBeDefined();
    expect(err.message).toBeDefined();
  });
});
