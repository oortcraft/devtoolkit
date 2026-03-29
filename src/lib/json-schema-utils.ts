import Ajv from 'ajv';

const MAX_INPUT_SIZE = 1_000_000;

function checkSize(input: string): string | null {
  if (input.length > MAX_INPUT_SIZE) {
    return `Input too large (${(input.length / 1_000_000).toFixed(1)}MB). Maximum size is 1MB.`;
  }
  return null;
}

export interface ValidationError {
  path: string;
  message: string;
  keyword: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validateJsonSchema(
  schemaStr: string,
  dataStr: string
): { result?: ValidationResult; error?: string } {
  const sizeError = checkSize(schemaStr) ?? checkSize(dataStr);
  if (sizeError) return { error: sizeError };

  let schema: unknown;
  try {
    schema = JSON.parse(schemaStr);
  } catch (e) {
    return { error: `Schema parse error: ${(e as Error).message}` };
  }

  let data: unknown;
  try {
    data = JSON.parse(dataStr);
  } catch (e) {
    return { error: `Data parse error: ${(e as Error).message}` };
  }

  try {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema as object);
    const valid = validate(data) as boolean;

    const errors: ValidationError[] = valid
      ? []
      : (validate.errors ?? []).map((err) => ({
          path: err.instancePath || '(root)',
          message: err.message ?? 'Validation failed',
          keyword: err.keyword,
        }));

    return { result: { valid, errors } };
  } catch (e) {
    return { error: `Schema compilation error: ${(e as Error).message}` };
  }
}

export const SAMPLE_SCHEMA = JSON.stringify(
  {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['id', 'name', 'email', 'age'],
    properties: {
      id: { type: 'integer', description: 'Unique user ID' },
      name: { type: 'string', minLength: 1, maxLength: 100 },
      email: { type: 'string', format: 'email' },
      age: { type: 'integer', minimum: 0, maximum: 120 },
      role: { type: 'string', enum: ['admin', 'user', 'guest'] },
      tags: { type: 'array', items: { type: 'string' } },
    },
    additionalProperties: false,
  },
  null,
  2
);

export const SAMPLE_DATA = JSON.stringify(
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
    role: 'admin',
    tags: ['developer', 'maintainer'],
  },
  null,
  2
);
