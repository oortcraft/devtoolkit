import { describe, it, expect } from 'vitest';
import { generateQrSvg, generateQrDataUrl } from '../src/lib/qr-code-utils';

describe('generateQrSvg', () => {
  it('returns empty for empty input', async () => {
    const { result } = await generateQrSvg('', { errorCorrectionLevel: 'M', margin: 4 });
    expect(result).toBe('');
  });

  it('generates SVG string for short text', async () => {
    const { result, error } = await generateQrSvg('https://oortcraft.dev', { errorCorrectionLevel: 'M', margin: 4 });
    expect(error).toBeUndefined();
    expect(result).toContain('<svg');
  });

  it('generates SVG string with whitespace-only content treated as empty', async () => {
    const { result } = await generateQrSvg('   ', { errorCorrectionLevel: 'M', margin: 4 });
    expect(result).toBe('');
  });

  it('returns error for input exceeding 4296 characters', async () => {
    const { error } = await generateQrSvg('a'.repeat(4297), { errorCorrectionLevel: 'M', margin: 4 });
    expect(error).toBeDefined();
    expect(error).toContain('too long');
  });

  it('works with error correction level L', async () => {
    const { result, error } = await generateQrSvg('hello', { errorCorrectionLevel: 'L', margin: 0 });
    expect(error).toBeUndefined();
    expect(result).toContain('<svg');
  });

  it('works with error correction level H', async () => {
    const { result, error } = await generateQrSvg('hello', { errorCorrectionLevel: 'H', margin: 2 });
    expect(error).toBeUndefined();
    expect(result).toContain('<svg');
  });

  it('generates SVG for unicode text', async () => {
    const { result, error } = await generateQrSvg('안녕하세요', { errorCorrectionLevel: 'M', margin: 4 });
    expect(error).toBeUndefined();
    expect(result).toContain('<svg');
  });
});

describe('generateQrDataUrl', () => {
  it('returns a data URL string for valid input', async () => {
    const dataUrl = await generateQrDataUrl('hello', { errorCorrectionLevel: 'M', margin: 4, width: 256 });
    expect(typeof dataUrl).toBe('string');
    expect(dataUrl).toMatch(/^data:image\//);
  });
});
