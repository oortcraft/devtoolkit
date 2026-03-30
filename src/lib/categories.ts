export interface Category {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  relatedBlogSlugs: string[];
}

export const categories: Category[] = [
  {
    slug: 'json',
    name: 'JSON Tools',
    description: 'Format, validate, convert, and inspect JSON data — all in the browser.',
    longDescription:
      'JSON (JavaScript Object Notation) is the most widely used data format in modern web development. Whether you\'re debugging API responses, validating configuration files, or converting between data formats, these tools handle it all client-side with zero data leaving your browser. Our JSON toolkit covers formatting and beautification, syntax validation with detailed error messages, JSON-to-YAML conversion, and schema-based validation using the Ajv library (Draft-07 compliant).',
    relatedBlogSlugs: ['what-is-json', 'json-vs-xml', 'json-schema-tutorial'],
  },
  {
    slug: 'encoding',
    name: 'Encoding Tools',
    description: 'Encode and decode Base64, URLs, and HTML entities instantly.',
    longDescription:
      'Encoding transforms data into a specific format for safe transmission, storage, or display. Developers constantly need to encode binary data as Base64 for APIs, percent-encode special characters in URLs, or convert HTML special characters to entities to prevent XSS. These tools provide instant, bidirectional encoding and decoding — type or paste your input and get the result in real time. All processing uses standard Web APIs (btoa/atob, encodeURIComponent, DOMParser) and runs entirely in the browser.',
    relatedBlogSlugs: ['what-is-base64', 'base64-encoding-examples', 'url-encoding-explained', 'html-entities-guide'],
  },
  {
    slug: 'generator',
    name: 'Generator Tools',
    description: 'Generate UUIDs, passwords, and placeholder text on demand.',
    longDescription:
      'Generators create unique identifiers, secure credentials, and placeholder content that developers need daily. Our UUID generator supports both v4 (random) and v1 (time-based) formats using crypto.getRandomValues() for true randomness. The password generator creates cryptographically secure passwords with customizable length and character sets. And the Lorem Ipsum generator produces classic placeholder text for mockups and wireframes. Every generator runs client-side — nothing is logged, stored, or transmitted.',
    relatedBlogSlugs: ['what-is-uuid', 'uuid-versions-compared', 'strong-password-guide', 'what-is-lorem-ipsum'],
  },
  {
    slug: 'security',
    name: 'Security Tools',
    description: 'Hash data and decode JWTs with cryptographic precision.',
    longDescription:
      'Security tools help developers work with cryptographic primitives and authentication tokens. The Hash Generator computes MD5, SHA-1, SHA-256, and SHA-512 digests using the Web Crypto API — ideal for verifying file integrity, comparing checksums, or understanding how different algorithms behave. The JWT Decoder parses JSON Web Tokens into their header, payload, and signature components, displays registered claims (iss, exp, iat), and checks expiration — all without sending the token to any server.',
    relatedBlogSlugs: ['what-is-hashing', 'sha256-vs-sha512', 'what-is-jwt'],
  },
  {
    slug: 'text',
    name: 'Text Tools',
    description: 'Test regex, compare diffs, preview Markdown, and convert case formats.',
    longDescription:
      'Text processing is at the heart of software development. These tools cover the most common text operations: regex pattern testing with real-time match highlighting and capture group display, side-by-side text comparison using the LCS diff algorithm, live Markdown preview with GitHub Flavored Markdown support (tables, task lists, fenced code blocks), and string case conversion between 8 formats (camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, Title Case, UPPERCASE, lowercase). All tools process text locally and never transmit your data.',
    relatedBlogSlugs: ['regex-cheat-sheet', 'text-diff-explained', 'markdown-syntax-guide', 'naming-conventions-guide'],
  },
  {
    slug: 'css',
    name: 'CSS Tools',
    description: 'Convert colors and minify stylesheets for production.',
    longDescription:
      'CSS tools help front-end developers optimize stylesheets and work with color values. The Color Converter instantly translates between HEX (3/6/8-digit), RGB, and HSL formats with a live preview swatch — essential for design-to-code workflows and accessibility checks. The CSS Minifier strips comments, whitespace, and redundant characters to produce production-ready CSS, typically reducing file size by 15-40% and improving page load times. Both tools run entirely in the browser with no server processing.',
    relatedBlogSlugs: ['color-formats-guide', 'css-minification-explained'],
  },
  {
    slug: 'devops',
    name: 'DevOps Tools',
    description: 'Build and understand cron expressions with a visual editor.',
    longDescription:
      'DevOps tools simplify the configuration and scheduling tasks that developers encounter in CI/CD pipelines, server administration, and container orchestration. The Cron Expression Builder provides a visual editor for creating, testing, and understanding cron schedules. Enter any 5-field cron expression to see a human-readable description and the next 5 scheduled run times. Use preset buttons for common patterns (every minute, hourly, daily, weekly) or build custom schedules. Supports standard cron syntax and special strings (@hourly, @daily, @weekly, @monthly, @yearly).',
    relatedBlogSlugs: ['cron-expression-guide'],
  },
  {
    slug: 'date',
    name: 'Date & Time Tools',
    description: 'Convert Unix timestamps to human-readable dates and back.',
    longDescription:
      'Date and time tools help developers work with the temporal data formats used across APIs, databases, and log files. The Timestamp Converter translates between Unix timestamps (seconds and milliseconds since the epoch) and human-readable formats including ISO 8601, UTC, and local time. It also shows relative time ("3 hours ago") and supports both directions — paste a timestamp to see the date, or enter a date to get the timestamp. Essential for debugging server logs, API responses, and database records. All conversions happen client-side using the JavaScript Date API.',
    relatedBlogSlugs: ['unix-timestamp-guide'],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
