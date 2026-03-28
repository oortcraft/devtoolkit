export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
}

export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Beautifier',
    description: 'Format, beautify, and minify JSON data with customizable indentation.',
    category: 'JSON',
    keywords: ['json formatter', 'json beautifier', 'json prettifier', 'format json online'],
  },
  {
    slug: 'json-validator',
    name: 'JSON Validator',
    description: 'Validate JSON syntax and get detailed error messages with line numbers.',
    category: 'JSON',
    keywords: ['json validator', 'json syntax checker', 'validate json online'],
  },
  {
    slug: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    description: 'Convert JSON data to YAML format instantly.',
    category: 'JSON',
    keywords: ['json to yaml', 'json yaml converter', 'convert json to yaml online'],
  },
  {
    slug: 'base64',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text to Base64 or decode Base64 back to plain text.',
    category: 'Encoding',
    keywords: ['base64 encode', 'base64 decode', 'base64 encoder online', 'base64 converter'],
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder / Decoder',
    description: 'Encode or decode URL components for safe transmission.',
    category: 'Encoding',
    keywords: ['url encode', 'url decode', 'percent encoding', 'url encoder online', 'urlencode'],
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs (v4) or time-based UUIDs (v1).',
    category: 'Generator',
    keywords: ['uuid generator', 'uuid v4', 'uuid v1', 'generate uuid online', 'guid generator'],
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text.',
    category: 'Security',
    keywords: ['hash generator', 'md5 hash', 'sha256 hash', 'sha512 online', 'hash calculator'],
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for designs and mockups.',
    category: 'Generator',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'lorem ipsum online'],
  },
];
