import { describe, it, expect } from 'vitest';
import { decodeJwt, formatTimestamp, isExpired } from '../src/lib/jwt-utils';

// A well-known test JWT (header.payload.signature, all base64url-encoded)
// Header: {"alg":"HS256","typ":"JWT"}
// Payload: {"sub":"1234567890","name":"John Doe","iat":1516239022}
const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('decodeJwt', () => {
  it('decodes a valid JWT into header, payload, and signature', () => {
    const { parts, error } = decodeJwt(SAMPLE_JWT);
    expect(error).toBeUndefined();
    expect(parts).toBeDefined();
    expect(parts!.header).toMatchObject({ alg: 'HS256', typ: 'JWT' });
    expect(parts!.payload).toMatchObject({ sub: '1234567890', name: 'John Doe' });
    expect(parts!.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  });

  it('returns error for empty input', () => {
    const { error } = decodeJwt('');
    expect(error).toBeDefined();
    expect(error).toContain('Please enter a JWT token');
  });

  it('returns error for whitespace-only input', () => {
    const { error } = decodeJwt('   ');
    expect(error).toBeDefined();
  });

  it('returns error when token has wrong number of parts', () => {
    const { error } = decodeJwt('only.two');
    expect(error).toBeDefined();
    expect(error).toContain('Invalid JWT');
  });

  it('returns error for malformed base64 segment', () => {
    const { error } = decodeJwt('!!!.!!!.!!!');
    expect(error).toBeDefined();
  });

  it('handles tokens with padding-free base64url', () => {
    // No trailing = padding in the original JWT segments
    const { parts } = decodeJwt(SAMPLE_JWT);
    expect(parts).toBeDefined();
  });
});

describe('formatTimestamp', () => {
  it('converts a Unix timestamp to a locale string', () => {
    const result = formatTimestamp(1516239022);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles timestamp 0 (epoch)', () => {
    const result = formatTimestamp(0);
    expect(typeof result).toBe('string');
  });
});

describe('isExpired', () => {
  it('returns true for a past expiry timestamp', () => {
    const payload = { exp: Math.floor(Date.now() / 1000) - 3600 };
    expect(isExpired(payload)).toBe(true);
  });

  it('returns false for a future expiry timestamp', () => {
    const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    expect(isExpired(payload)).toBe(false);
  });

  it('returns null when exp field is missing', () => {
    expect(isExpired({})).toBeNull();
  });

  it('returns null when exp is not a number', () => {
    expect(isExpired({ exp: 'not-a-number' })).toBeNull();
  });
});
