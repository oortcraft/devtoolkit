import { describe, it, expect } from 'vitest';
import { base64Encode, base64Decode } from '../src/lib/encoding-utils';

describe('base64Encode', () => {
  it('encodes plain ASCII text', () => {
    const result = base64Encode('Hello, World!');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  it('encodes UTF-8 text with special characters', () => {
    const result = base64Encode('안녕하세요');
    expect(result.error).toBeUndefined();
    expect(result.result).toBeDefined();
  });

  it('returns empty string for empty input', () => {
    const result = base64Encode('');
    expect(result.result).toBe('');
  });

  it('rejects input larger than 1MB', () => {
    const largeInput = 'a'.repeat(1_100_000);
    const result = base64Encode(largeInput);
    expect(result.error).toContain('Input too large');
  });
});

describe('base64Decode', () => {
  it('decodes valid Base64 to text', () => {
    const result = base64Decode('SGVsbG8sIFdvcmxkIQ==');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('Hello, World!');
  });

  it('roundtrips encode then decode', () => {
    const original = 'DevToolkit is awesome!';
    const encoded = base64Encode(original);
    const decoded = base64Decode(encoded.result!);
    expect(decoded.result).toBe(original);
  });

  it('returns error for invalid Base64', () => {
    const result = base64Decode('not-valid-base64!!!');
    expect(result.error).toContain('Invalid Base64');
  });

  it('returns empty string for empty input', () => {
    const result = base64Decode('');
    expect(result.result).toBe('');
  });

  it('rejects input larger than 1MB', () => {
    const largeInput = 'a'.repeat(1_100_000);
    const result = base64Decode(largeInput);
    expect(result.error).toContain('Input too large');
  });
});
