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

import { urlEncode, urlDecode, generateUuid } from '../src/lib/encoding-utils';

describe('urlEncode', () => {
  it('encodes special characters', () => {
    const result = urlEncode('Hello World! @#$');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('Hello%20World!%20%40%23%24');
  });

  it('returns empty string for empty input', () => {
    const result = urlEncode('');
    expect(result.result).toBe('');
  });

  it('rejects input larger than 1MB', () => {
    const largeInput = 'a'.repeat(1_100_000);
    const result = urlEncode(largeInput);
    expect(result.error).toContain('Input too large');
  });
});

describe('urlDecode', () => {
  it('decodes percent-encoded string', () => {
    const result = urlDecode('Hello%20World!%20%40%23%24');
    expect(result.error).toBeUndefined();
    expect(result.result).toBe('Hello World! @#$');
  });

  it('roundtrips encode then decode', () => {
    const original = 'foo bar & baz=qux';
    const encoded = urlEncode(original);
    const decoded = urlDecode(encoded.result!);
    expect(decoded.result).toBe(original);
  });

  it('returns error for malformed URI', () => {
    const result = urlDecode('%zz');
    expect(result.error).toContain('Invalid URL encoding');
  });

  it('returns empty string for empty input', () => {
    const result = urlDecode('');
    expect(result.result).toBe('');
  });

  it('rejects input larger than 1MB', () => {
    const largeInput = 'a'.repeat(1_100_000);
    const result = urlDecode(largeInput);
    expect(result.error).toContain('Input too large');
  });
});

describe('generateUuid', () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  it('generates a valid v4 UUID', () => {
    const uuid = generateUuid('v4');
    expect(uuid).toMatch(uuidRegex);
    expect(uuid[14]).toBe('4');
  });

  it('generates a valid v1 UUID', () => {
    const uuid = generateUuid('v1');
    expect(uuid).toMatch(uuidRegex);
    expect(uuid[14]).toBe('1');
  });

  it('generates unique UUIDs each call', () => {
    const a = generateUuid('v4');
    const b = generateUuid('v4');
    expect(a).not.toBe(b);
  });
});
