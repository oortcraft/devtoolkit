export interface Tool {
  slug: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  keywords: string[];
}

export const tools: Tool[] = [
  // JSON (6)
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Beautifier',
    icon: '{ }',
    description: 'Format, beautify, and minify JSON data with customizable indentation.',
    category: 'JSON',
    keywords: ['json formatter', 'json beautifier', 'json prettifier', 'format json online'],
  },
  {
    slug: 'json-validator',
    name: 'JSON Validator',
    icon: '✓',
    description: 'Validate JSON syntax and get detailed error messages with line numbers.',
    category: 'JSON',
    keywords: ['json validator', 'json syntax checker', 'validate json online'],
  },
  {
    slug: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    icon: '⇄',
    description: 'Convert JSON data to YAML format instantly.',
    category: 'JSON',
    keywords: ['json to yaml', 'json yaml converter', 'convert json to yaml online'],
  },
  {
    slug: 'json-schema-validator',
    name: 'JSON Schema Validator',
    icon: '✓s',
    description: 'Validate JSON data against JSON Schema with detailed error reporting.',
    category: 'JSON',
    keywords: ['json schema validator', 'json schema', 'validate json schema', 'json validation', 'ajv validator'],
  },
  {
    slug: 'yaml-validator',
    name: 'YAML Validator',
    icon: 'Y✓',
    description: 'Validate YAML syntax and convert between YAML and JSON formats.',
    category: 'JSON',
    keywords: ['yaml validator', 'yaml syntax checker', 'yaml to json', 'validate yaml online'],
  },
  {
    slug: 'csv-to-json',
    name: 'CSV to JSON Converter',
    icon: '⇄',
    description: 'Convert CSV data to JSON format with automatic delimiter detection.',
    category: 'JSON',
    keywords: ['csv to json', 'csv converter', 'csv parser', 'convert csv online'],
  },
  {
    slug: 'jsonpath-finder',
    name: 'JSON Path Finder',
    icon: '$.',
    description: 'Query JSON data using JSONPath expressions with real-time results.',
    category: 'JSON',
    keywords: ['jsonpath', 'json path finder', 'json query', 'jsonpath online', 'json path tester'],
  },
  // Encoding (4)
  {
    slug: 'base64',
    name: 'Base64 Encoder / Decoder',
    icon: 'B64',
    description: 'Encode text to Base64 or decode Base64 back to plain text.',
    category: 'Encoding',
    keywords: ['base64 encode', 'base64 decode', 'base64 encoder online', 'base64 converter'],
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder / Decoder',
    icon: '%20',
    description: 'Encode or decode URL components for safe transmission.',
    category: 'Encoding',
    keywords: ['url encode', 'url decode', 'percent encoding', 'url encoder online', 'urlencode'],
  },
  {
    slug: 'html-entity-encoder',
    name: 'HTML Entity Encoder & Decoder',
    icon: '&lt;',
    description: 'Encode and decode HTML entities for safe web content.',
    category: 'Encoding',
    keywords: ['html entity encoder', 'html entities', 'html decode', 'html encode', 'entity converter'],
  },
  {
    slug: 'base-converter',
    name: 'Base Converter',
    icon: '0x',
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal bases.',
    category: 'Encoding',
    keywords: ['base converter', 'binary converter', 'hex converter', 'octal', 'number base', 'radix'],
  },
  // Generator (4)
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    icon: '#',
    description: 'Generate random UUIDs (v4) or time-based UUIDs (v1).',
    category: 'Generator',
    keywords: ['uuid generator', 'uuid v4', 'uuid v1', 'generate uuid online', 'guid generator'],
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    icon: 'Aa',
    description: 'Generate placeholder text for designs and mockups.',
    category: 'Generator',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'lorem ipsum online'],
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    icon: '🔑',
    description: 'Generate strong, random passwords with customizable length and character options',
    category: 'Generator',
    keywords: ['password generator', 'random password', 'secure password', 'password creator'],
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    icon: '▣',
    description: 'Generate QR codes from text, URLs, or any data. Download as SVG or PNG.',
    category: 'Generator',
    keywords: ['qr code generator', 'qr code maker', 'generate qr code', 'qr code online'],
  },
  // Security (2)
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    icon: '#!',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text.',
    category: 'Security',
    keywords: ['hash generator', 'md5 hash', 'sha256 hash', 'sha512 online', 'hash calculator'],
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder & Validator',
    icon: 'JWT',
    description: 'Decode, inspect, and validate JSON Web Tokens instantly.',
    category: 'Security',
    keywords: ['jwt decoder', 'jwt decode', 'json web token', 'jwt validator', 'jwt debugger'],
  },
  // Text (5)
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    icon: '.*',
    description: 'Test regular expressions with real-time matching and highlighting.',
    category: 'Text',
    keywords: ['regex tester', 'regular expression', 'regex online', 'regex match', 'regex validator'],
  },
  {
    slug: 'diff-checker',
    name: 'Diff Checker',
    icon: '±',
    description: 'Compare two texts and see differences highlighted line by line.',
    category: 'Text',
    keywords: ['diff checker', 'text compare', 'diff tool online', 'compare text', 'text diff'],
  },
  {
    slug: 'markdown-preview',
    name: 'Markdown Preview',
    icon: 'M↓',
    description: 'Write Markdown and see real-time rendered preview side by side.',
    category: 'Text',
    keywords: ['markdown preview', 'markdown editor', 'markdown to html', 'markdown viewer', 'md preview'],
  },
  {
    slug: 'case-converter',
    name: 'String Case Converter',
    icon: 'Aa',
    description: 'Convert text between camelCase, PascalCase, snake_case, kebab-case, and more.',
    category: 'Text',
    keywords: ['case converter', 'camelcase', 'snake case', 'pascal case', 'kebab case', 'text transform'],
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    icon: 'SQL',
    description: 'Format and beautify SQL queries with dialect-specific formatting.',
    category: 'Text',
    keywords: ['sql formatter', 'sql beautifier', 'format sql', 'sql pretty print', 'sql minifier'],
  },
  // CSS (2)
  {
    slug: 'color-converter',
    name: 'Color Converter',
    icon: '🎨',
    description: 'Convert colors between HEX, RGB, and HSL formats instantly.',
    category: 'CSS',
    keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'color picker', 'css color'],
  },
  {
    slug: 'css-minifier',
    name: 'CSS Minifier',
    icon: '{ }',
    description: 'Minify CSS code to reduce file size and improve load times.',
    category: 'CSS',
    keywords: ['css minifier', 'minify css', 'css compressor', 'compress css online', 'css optimizer'],
  },
  // DevOps (1)
  {
    slug: 'cron-builder',
    name: 'Cron Expression Builder',
    icon: '⏰',
    description: 'Build, test, and understand cron expressions with a visual editor.',
    category: 'DevOps',
    keywords: ['cron expression', 'cron builder', 'crontab', 'cron schedule', 'cron generator'],
  },
  // Date (1)
  {
    slug: 'timestamp-converter',
    name: 'Timestamp Converter',
    icon: '⏱',
    description: 'Convert Unix timestamps to human-readable dates and vice versa.',
    category: 'Date',
    keywords: ['unix timestamp', 'epoch converter', 'timestamp to date', 'unix time converter'],
  },
];
