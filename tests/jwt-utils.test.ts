import { describe, it, expect } from 'vitest';
import { decodeJwt, formatTimestamp, isExpired } from '../src/lib/jwt-utils';

// A well-known test JWT (header.payload.signature, all base64url-encoded)
// Header: {"alg":"HS256","typ":"JWT"}
// Payload: {"sub":"1234567890","name":"John Doe","iat":1516239022}
const TEST_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJwt', () => {
  it('decodes a valid JWT and extracts header', () => {
    const result = decodeJwt(TEST_JWT);
    expect(result.error).toBeUndefined();
    expect(result.parts?.header.alg).toBe('HS256');
    expect(result.parts?.header.typ).toBe('JWT');
  });

  it('extracts payload correctly', () => {
    const result = decodeJwt(TEST_JWT);
    expect(result.parts?.payload.sub).toBe('1234567890');
    expect(result.parts?.payload.name).toBe('John Doe');
    expect(result.parts?.payload.iat).toBe(1516239022);
  });

  it('extracts signature string', () => {
    const result = decodeJwt(TEST_JWT);
    expect(result.parts?.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  });

  it('returns error for empty input', () => {
    expect(decodeJwt('').error).toBeDefined();
  });

  it('returns error for whitespace-only input', () => {
    expect(decodeJwt('   ').error).toBeDefined();
  });

  it('returns error for wrong segment count (2 parts)', () => {
    expect(decodeJwt('part1.part2').error).toBeDefined();
  });

  it('returns error for wrong segment count (4 parts)', () => {
    expect(decodeJwt('a.b.c.d').error).toBeDefined();
  });

  it('returns error for malformed base64 in header', () => {
    expect(decodeJwt('!!!.payload.sig').error).toBeDefined();
  });

  it('handles base64url without padding', () => {
    const result = decodeJwt(TEST_JWT);
    expect(result.error).toBeUndefined();
  });

  it('returns error when header decodes but is not valid JSON', () => {
    // base64url of "not json" = "bm90IGpzb24"
    const result = decodeJwt('bm90IGpzb24.eyJ0ZXN0IjoxfQ.sig');
    expect(result.error).toBeDefined();
  });
});

describe('formatTimestamp', () => {
  it('formats Unix epoch (0) correctly', () => {
    const result = formatTimestamp(0);
    expect(result).toContain('1970');
  });

  it('formats a known timestamp', () => {
    const result = formatTimestamp(1516239022);
    expect(result).toContain('2018');
  });

  it('returns string representation for invalid timestamp', () => {
    const result = formatTimestamp(NaN);
    expect(typeof result).toBe('string');
  });

  it('handles negative timestamp (before epoch)', () => {
    const result = formatTimestamp(-86400);
    expect(result).toContain('1969');
  });

  it('handles very large future timestamp', () => {
    const result = formatTimestamp(4102444800); // 2100-01-01
    expect(result).toContain('2100');
  });
});

describe('isExpired', () => {
  it('returns true for expired token (past exp)', () => {
    const result = isExpired({ exp: Math.floor(Date.now() / 1000) - 3600 });
    expect(result).toBe(true);
  });

  it('returns false for valid token (future exp)', () => {
    const result = isExpired({ exp: Math.floor(Date.now() / 1000) + 3600 });
    expect(result).toBe(false);
  });

  it('returns null when exp field is missing', () => {
    expect(isExpired({})).toBeNull();
  });

  it('returns null when exp is not a number', () => {
    expect(isExpired({ exp: 'not-a-number' })).toBeNull();
  });

  it('returns true when exp is 0 (epoch)', () => {
    expect(isExpired({ exp: 0 })).toBe(true);
  });

  it('handles payload with custom claims alongside exp', () => {
    const payload = { sub: '123', name: 'Test', exp: Math.floor(Date.now() / 1000) + 3600, role: 'admin' };
    expect(isExpired(payload)).toBe(false);
  });
});
