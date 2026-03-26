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
];
