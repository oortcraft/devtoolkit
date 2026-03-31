import { describe, it, expect } from 'vitest';
import { csvToJson } from '../src/lib/csv-to-json-utils';

describe('csvToJson - with header', () => {
  it('converts basic CSV with header row', () => {
    const csv = 'name,age\nAlice,30\nBob,25';
    const { result, error, rows } = csvToJson(csv, { header: true, typeInference: false });
    expect(error).toBeUndefined();
    expect(rows).toBe(2);
    const data = JSON.parse(result!);
    expect(data[0]).toMatchObject({ name: 'Alice', age: '30' });
    expect(data[1]).toMatchObject({ name: 'Bob', age: '25' });
  });

  it('applies type inference when enabled', () => {
    const csv = 'name,age\nAlice,30';
    const { result } = csvToJson(csv, { header: true, typeInference: true });
    const data = JSON.parse(result!);
    expect(typeof data[0].age).toBe('number');
    expect(data[0].age).toBe(30);
  });

  it('handles CSV with commas inside quoted fields', () => {
    const csv = 'name,city\n"Smith, John","New York"';
    const { result, error } = csvToJson(csv, { header: true, typeInference: false });
    expect(error).toBeUndefined();
    const data = JSON.parse(result!);
    expect(data[0].name).toBe('Smith, John');
  });
});

describe('csvToJson - without header', () => {
  it('converts CSV without header to array of arrays', () => {
    const csv = 'Alice,30\nBob,25';
    const { result, error, rows } = csvToJson(csv, { header: false, typeInference: false });
    expect(error).toBeUndefined();
    expect(rows).toBe(2);
    const data = JSON.parse(result!);
    expect(data[0]).toEqual(['Alice', '30']);
  });
});

describe('csvToJson - edge cases', () => {
  it('returns error for empty string', () => {
    const { error } = csvToJson('', { header: true, typeInference: false });
    expect(error).toBeDefined();
  });

  it('returns error for input exceeding 1MB', () => {
    const { error } = csvToJson('a'.repeat(1_100_000), { header: true, typeInference: false });
    expect(error).toContain('exceeds 1MB');
  });

  it('handles multi-row CSV correctly', () => {
    const csv = 'id,value\n1,a\n2,b\n3,c';
    const { result, rows, error } = csvToJson(csv, { header: true, typeInference: false });
    expect(error).toBeUndefined();
    expect(rows).toBe(3);
    const data = JSON.parse(result!);
    expect(data).toHaveLength(3);
  });
});
