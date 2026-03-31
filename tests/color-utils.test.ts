import { describe, it, expect } from 'vitest';
import { parseColor } from '../src/lib/color-utils';

describe('parseColor - hex input', () => {
  it('converts full 6-digit hex to rgb and hsl', () => {
    const result = parseColor('#ff0000');
    expect(result.error).toBeUndefined();
    expect(result.hex).toBe('#FF0000');
    expect(result.rgb).toBe('rgb(255, 0, 0)');
    expect(result.hsl).toBe('hsl(0, 100%, 50%)');
  });

  it('converts 3-digit shorthand hex', () => {
    const result = parseColor('#fff');
    expect(result.error).toBeUndefined();
    expect(result.hex).toBe('#FFFFFF');
    expect(result.rgb).toBe('rgb(255, 255, 255)');
  });

  it('converts black hex', () => {
    const result = parseColor('#000000');
    expect(result.error).toBeUndefined();
    expect(result.hex).toBe('#000000');
    expect(result.rgb).toBe('rgb(0, 0, 0)');
  });

  it('handles hex without # prefix', () => {
    const result = parseColor('0000ff');
    expect(result.error).toBeUndefined();
    expect(result.hex).toBe('#0000FF');
  });
});

describe('parseColor - rgb input', () => {
  it('parses rgb() notation', () => {
    const result = parseColor('rgb(59, 130, 246)');
    expect(result.error).toBeUndefined();
    expect(result.rgb).toBe('rgb(59, 130, 246)');
  });

  it('clamps out-of-range rgb values', () => {
    const result = parseColor('rgb(300, 0, 0)');
    expect(result.error).toBeUndefined();
    expect(result.rgb).toBe('rgb(255, 0, 0)');
  });
});

describe('parseColor - hsl input', () => {
  it('parses hsl() notation', () => {
    const result = parseColor('hsl(120, 100%, 50%)');
    expect(result.error).toBeUndefined();
    expect(result.hsl).toBe('hsl(120, 100%, 50%)');
    expect(result.rgb).toBe('rgb(0, 255, 0)');
  });
});

describe('parseColor - named colors', () => {
  it('resolves CSS named color "red"', () => {
    const result = parseColor('red');
    expect(result.error).toBeUndefined();
    expect(result.hex).toBe('#FF0000');
  });

  it('resolves CSS named color "blue"', () => {
    const result = parseColor('blue');
    expect(result.error).toBeUndefined();
    expect(result.hex).toBe('#0000FF');
  });
});

describe('parseColor - hsl clamping warning', () => {
  it('warns when hue exceeds 360', () => {
    const result = parseColor('hsl(400, 50%, 50%)');
    expect(result.error).toBeUndefined();
    expect(result.warning).toContain('H: 400→360');
  });

  it('warns when saturation exceeds 100', () => {
    const result = parseColor('hsl(120, 150%, 50%)');
    expect(result.error).toBeUndefined();
    expect(result.warning).toContain('S: 150→100');
  });

  it('warns when lightness exceeds 100', () => {
    const result = parseColor('hsl(120, 50%, 200%)');
    expect(result.error).toBeUndefined();
    expect(result.warning).toContain('L: 200→100');
  });

  it('warns for multiple out-of-range values', () => {
    const result = parseColor('hsl(400, 150%, 200%)');
    expect(result.warning).toContain('H: 400→360');
    expect(result.warning).toContain('S: 150→100');
    expect(result.warning).toContain('L: 200→100');
  });

  it('no warning for valid HSL values', () => {
    const result = parseColor('hsl(120, 50%, 50%)');
    expect(result.warning).toBeUndefined();
  });
});

describe('parseColor - invalid input', () => {
  it('returns error for empty input', () => {
    const result = parseColor('');
    expect(result.error).toBeDefined();
    expect(result.hex).toBe('');
  });

  it('returns error for completely invalid input', () => {
    const result = parseColor('notacolor');
    expect(result.error).toBeDefined();
  });

  it('returns error for invalid hex length', () => {
    const result = parseColor('#12');
    expect(result.error).toBeDefined();
  });
});
