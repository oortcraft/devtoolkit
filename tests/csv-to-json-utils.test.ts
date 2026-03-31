import { describe, it, expect } from 'vitest';
import { csvToJson } from '../src/lib/csv-to-json-utils';

describe('csvToJson - with header', () => {
  it('converts basic CSV with header row', () => {
    const result = csvToJson('name,age\nAlice,30\nBob,25', { header: true, typeInference: true });
    expect(result.error).toBeUndefined();
    const data = JSON.parse(result.result!);
    expect(data).toHaveLength(2);
    expect(data[0].name).toBe('Alice');
  });

  it('handles quoted fields with commas', () => {
    const result = csvToJson('name,address\nAlice,"123 Main St, Suite 4"', { header: true, typeInference: false });
    expect(result.error).toBeUndefined();
    const data = JSON.parse(result.result!);
    expect(data[0].address).toBe('123 Main St, Suite 4');
  });

  it('handles multiple rows', () => {
    const csv = 'a,b\n1,2\n3,4\n5,6';
    const result = csvToJson(csv, { header: true, typeInference: true });
    expect(result.rows).toBe(3);
  });

  it('handles empty cells', () => {
    const result = csvToJson('name,age\nAlice,\n,25', { header: true, typeInference: false });
    expect(result.error).toBeUndefined();
    const data = JSON.parse(result.result!);
    expect(data[0].age).toBe('');
    expect(data[1].name).toBe('');
  });

  it('infers numeric types correctly', () => {
    const result = csvToJson('name,age,score\nAlice,30,95.5', { header: true, typeInference: true });
    const data = JSON.parse(result.result!);
    expect(data[0].age).toBe(30);
    expect(data[0].score).toBe(95.5);
  });

  it('infers boolean types correctly', () => {
    const result = csvToJson('name,active\nAlice,true\nBob,false', { header: true, typeInference: true });
    const data = JSON.parse(result.result!);
    expect(data[0].active).toBe(true);
    expect(data[1].active).toBe(false);
  });
});

describe('csvToJson - without header', () => {
  it('converts CSV without header row', () => {
    const result = csvToJson('Alice,30\nBob,25', { header: false, typeInference: false });
    expect(result.error).toBeUndefined();
    const data = JSON.parse(result.result!);
    expect(Array.isArray(data[0])).toBe(true);
  });

  it('returns row count', () => {
    const result = csvToJson('a,b\nc,d\ne,f', { header: false, typeInference: false });
    expect(result.rows).toBe(3);
  });
});

describe('csvToJson - edge cases', () => {
  it('rejects input larger than 1MB', () => {
    const largeInput = 'a,b\n' + 'x,y\n'.repeat(300_000);
    const result = csvToJson(largeInput, { header: true, typeInference: false });
    expect(result.error).toContain('1MB');
  });

  it('returns error for empty input', () => {
    const result = csvToJson('', { header: true, typeInference: false });
    expect(result.error).toBeDefined();
  });

  it('handles tab-separated values', () => {
    const result = csvToJson('name\tage\nAlice\t30', { header: true, typeInference: true });
    expect(result.error).toBeUndefined();
    const data = JSON.parse(result.result!);
    expect(data[0].name).toBe('Alice');
  });

  it('handles single column CSV with explicit delimiter', () => {
    const result = csvToJson('name,\nAlice,\nBob,', { header: true, typeInference: false });
    expect(result.error).toBeUndefined();
    const data = JSON.parse(result.result!);
    expect(data).toHaveLength(2);
  });

  it('handles quoted fields with newlines', () => {
    const result = csvToJson('name,bio\nAlice,"line1\nline2"', { header: true, typeInference: false });
    expect(result.error).toBeUndefined();
    const data = JSON.parse(result.result!);
    expect(data[0].bio).toContain('line1');
  });
});
