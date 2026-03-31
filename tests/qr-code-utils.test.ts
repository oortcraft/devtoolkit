import { describe, it, expect } from 'vitest';
import { generateQrSvg, generateQrDataUrl, ERROR_LEVELS } from '../src/lib/qr-code-utils';

describe('generateQrSvg', () => {
  it('returns empty for empty input', async () => {
    const result = await generateQrSvg('', { errorCorrectionLevel: 'M', margin: 2 });
    expect(result.result).toBe('');
  });

  it('returns empty for whitespace-only input', async () => {
    const result = await generateQrSvg('   ', { errorCorrectionLevel: 'M', margin: 2 });
    expect(result.result).toBe('');
  });

  it('generates valid SVG for text data', async () => {
    const result = await generateQrSvg('Hello World', { errorCorrectionLevel: 'M', margin: 2 });
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<svg');
    expect(result.result).toContain('</svg>');
  });

  it('generates SVG for URL data', async () => {
    const result = await generateQrSvg('https://example.com', { errorCorrectionLevel: 'M', margin: 2 });
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<svg');
  });

  it('generates SVG for email data', async () => {
    const result = await generateQrSvg('mailto:test@example.com', { errorCorrectionLevel: 'M', margin: 2 });
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<svg');
  });

  it('works with error correction level L', async () => {
    const result = await generateQrSvg('test', { errorCorrectionLevel: 'L', margin: 2 });
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<svg');
  });

  it('works with error correction level Q', async () => {
    const result = await generateQrSvg('test', { errorCorrectionLevel: 'Q', margin: 2 });
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<svg');
  });

  it('works with error correction level H', async () => {
    const result = await generateQrSvg('test', { errorCorrectionLevel: 'H', margin: 2 });
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<svg');
  });

  it('returns error for data exceeding 4296 characters', async () => {
    const result = await generateQrSvg('a'.repeat(4297), { errorCorrectionLevel: 'M', margin: 2 });
    expect(result.error).toContain('4,296');
  });

  it('handles unicode data', async () => {
    const result = await generateQrSvg('안녕하세요', { errorCorrectionLevel: 'M', margin: 2 });
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<svg');
  });

  it('works with margin 0', async () => {
    const result = await generateQrSvg('test', { errorCorrectionLevel: 'M', margin: 0 });
    expect(result.error).toBeUndefined();
    expect(result.result).toContain('<svg');
  });
});

describe('generateQrDataUrl', () => {
  it('returns a data URL', async () => {
    const result = await generateQrDataUrl('test', { errorCorrectionLevel: 'M', margin: 2, width: 200 });
    expect(result).toMatch(/^data:/);
  });

  it('returns data URL with different widths', async () => {
    const small = await generateQrDataUrl('test', { errorCorrectionLevel: 'M', margin: 2, width: 100 });
    const large = await generateQrDataUrl('test', { errorCorrectionLevel: 'M', margin: 2, width: 400 });
    expect(small).toMatch(/^data:/);
    expect(large).toMatch(/^data:/);
  });
});

describe('ERROR_LEVELS', () => {
  it('has 4 error correction levels', () => {
    expect(ERROR_LEVELS).toHaveLength(4);
  });

  it('contains L, M, Q, H levels', () => {
    const values = ERROR_LEVELS.map(l => l.value);
    expect(values).toContain('L');
    expect(values).toContain('M');
    expect(values).toContain('Q');
    expect(values).toContain('H');
  });
});
