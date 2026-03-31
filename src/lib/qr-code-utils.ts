import QRCode from 'qrcode';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: 'L', label: 'Low (7%)' },
  { value: 'M', label: 'Medium (15%)' },
  { value: 'Q', label: 'Quartile (25%)' },
  { value: 'H', label: 'High (30%)' },
];

export async function generateQrSvg(
  data: string,
  options: { errorCorrectionLevel: ErrorCorrectionLevel; margin: number }
): Promise<{ result?: string; error?: string }> {
  if (!data.trim()) return { result: '' };
  if (data.length > 4296) return { error: 'Input too long. Maximum 4,296 characters for QR codes.' };

  try {
    const svg = await QRCode.toString(data, {
      type: 'svg',
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      width: 256,
    });
    return { result: svg };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to generate QR code.' };
  }
}

export async function generateQrDataUrl(
  data: string,
  options: { errorCorrectionLevel: ErrorCorrectionLevel; margin: number; width: number }
): Promise<string> {
  return QRCode.toDataURL(data, {
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin: options.margin,
    width: options.width,
  });
}
