export type BaseType = 2 | 8 | 10 | 16;

export const BASE_OPTIONS: { value: BaseType; label: string; prefix: string }[] = [
  { value: 2, label: 'BIN', prefix: '0b' },
  { value: 8, label: 'OCT', prefix: '0o' },
  { value: 10, label: 'DEC', prefix: '' },
  { value: 16, label: 'HEX', prefix: '0x' },
];

const VALID_CHARS: Record<BaseType, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
};

export function convertBase(
  input: string,
  fromBase: BaseType
): { result?: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { result: '' };

  if (trimmed.length > 1_000_000) {
    return { error: 'Input is too large (max 1MB).' };
  }

  // Strip common prefixes
  let cleaned = trimmed;
  if (fromBase === 16) cleaned = cleaned.replace(/^0x/i, '');
  else if (fromBase === 2) cleaned = cleaned.replace(/^0b/i, '');
  else if (fromBase === 8) cleaned = cleaned.replace(/^0o/i, '');

  if (!VALID_CHARS[fromBase].test(cleaned)) {
    return { error: `Invalid character for base ${fromBase}.` };
  }

  try {
    let decimal: bigint;
    if (fromBase === 10) decimal = BigInt(cleaned);
    else if (fromBase === 16) decimal = BigInt('0x' + cleaned);
    else if (fromBase === 8) decimal = BigInt('0o' + cleaned);
    else decimal = BigInt('0b' + cleaned);

    const result = BASE_OPTIONS.map(({ value: base, label, prefix }) => {
      const converted = decimal.toString(base).toUpperCase();
      return `${label.padEnd(5)} ${prefix}${converted}`;
    }).join('\n');

    return { result };
  } catch {
    return { error: 'Failed to convert. Number may be too large.' };
  }
}
