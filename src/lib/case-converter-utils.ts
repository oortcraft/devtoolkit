export type CaseType = 'camelCase' | 'PascalCase' | 'snake_case' | 'SCREAMING_SNAKE' | 'kebab-case' | 'Title Case' | 'UPPERCASE' | 'lowercase';

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function convertCase(input: string, targetCase: CaseType): { result?: string; error?: string } {
  if (!input.trim()) return { result: '' };

  const words = splitWords(input);
  if (words.length === 0) return { result: '' };

  let result: string;
  switch (targetCase) {
    case 'camelCase':
      result = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      break;
    case 'PascalCase':
      result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      break;
    case 'snake_case':
      result = words.map(w => w.toLowerCase()).join('_');
      break;
    case 'SCREAMING_SNAKE':
      result = words.map(w => w.toUpperCase()).join('_');
      break;
    case 'kebab-case':
      result = words.map(w => w.toLowerCase()).join('-');
      break;
    case 'Title Case':
      result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      break;
    case 'UPPERCASE':
      result = input.toUpperCase();
      break;
    case 'lowercase':
      result = input.toLowerCase();
      break;
    default:
      return { error: 'Unknown case type.' };
  }
  return { result };
}

export const CASE_OPTIONS: { value: CaseType; label: string }[] = [
  { value: 'camelCase', label: 'camelCase' },
  { value: 'PascalCase', label: 'PascalCase' },
  { value: 'snake_case', label: 'snake_case' },
  { value: 'SCREAMING_SNAKE', label: 'SCREAMING_SNAKE' },
  { value: 'kebab-case', label: 'kebab-case' },
  { value: 'Title Case', label: 'Title Case' },
  { value: 'UPPERCASE', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
];
