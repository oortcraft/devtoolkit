import Papa from 'papaparse';

const SIZE_LIMIT = 1024 * 1024; // 1MB

export function csvToJson(
  input: string,
  options: { header: boolean; typeInference: boolean }
): { result?: string; error?: string; rows?: number } {
  if (input.length > SIZE_LIMIT) {
    return { error: 'Input exceeds 1MB limit.' };
  }

  const parsed = Papa.parse(input, {
    header: options.header,
    dynamicTyping: options.typeInference,
    skipEmptyLines: true,
  });

  if (parsed.errors && parsed.errors.length > 0) {
    const fatal = parsed.errors.find((e) => e.type === 'Delimiter' || e.type === 'Quotes');
    if (fatal) {
      return { error: `Parse error: ${fatal.message}` };
    }
  }

  const data = parsed.data;
  if (!data || (data as unknown[]).length === 0) {
    return { error: 'No data found in input.' };
  }

  const rows = (data as unknown[]).length;
  const result = JSON.stringify(data, null, 2);
  return { result, rows };
}
