const MAX_INPUT_SIZE = 1_000_000;

function checkSize(input: string): string | null {
  if (input.length > MAX_INPUT_SIZE) {
    return `Input too large (${(input.length / 1_000_000).toFixed(1)}MB). Maximum size is 1MB.`;
  }
  return null;
}

type IndentOption = 2 | 4 | 'tab';

function getIndentString(indent: IndentOption): string {
  if (indent === 'tab') return '\t';
  return ' '.repeat(indent);
}

export function beautifyCss(
  input: string,
  indent: IndentOption = 2
): { result?: string; error?: string } {
  if (!input) return { result: '' };
  const sizeError = checkSize(input);
  if (sizeError) return { error: sizeError };

  try {
    const indentStr = getIndentString(indent);
    const lines: string[] = [];
    let depth = 0;
    let i = 0;
    const len = input.length;

    // Buffer for current token
    let token = '';

    function flushToken() {
      const t = token.trim();
      token = '';
      return t;
    }

    function pushLine(content: string) {
      const trimmed = content.trim();
      if (trimmed === '') return;
      const currentIndent = indentStr.repeat(Math.max(0, depth));
      lines.push(currentIndent + trimmed);
    }

    while (i < len) {
      // Handle comments - preserve them
      if (input[i] === '/' && input[i + 1] === '*') {
        // Flush pending token first
        const pending = flushToken();
        if (pending) pushLine(pending);

        let comment = '';
        while (i < len) {
          comment += input[i];
          if (input[i] === '/' && comment.length > 2 && comment.endsWith('*/')) {
            i++;
            break;
          }
          i++;
        }
        // Push comment with current indent
        const commentLines = comment.split('\n');
        if (commentLines.length === 1) {
          pushLine(comment.trim());
        } else {
          for (const cl of commentLines) {
            pushLine(cl);
          }
        }
        continue;
      }

      const ch = input[i];

      if (ch === '{') {
        // selector part is in token
        const selector = flushToken();
        if (selector) {
          pushLine(selector + ' {');
        } else {
          // empty selector (shouldn't happen in valid CSS but handle it)
          const prevLine = lines[lines.length - 1];
          if (prevLine !== undefined && !prevLine.trimEnd().endsWith('{')) {
            pushLine('{');
          } else if (lines.length > 0) {
            lines[lines.length - 1] = lines[lines.length - 1].trimEnd() + ' {';
          }
        }
        depth++;
        i++;
        continue;
      }

      if (ch === '}') {
        // Flush any pending declaration
        const pending = flushToken();
        if (pending) pushLine(pending + ';');
        depth = Math.max(0, depth - 1);
        pushLine('}');
        // Add blank line after top-level closing brace
        if (depth === 0) {
          lines.push('');
        }
        i++;
        continue;
      }

      if (ch === ';') {
        token += ch;
        const decl = flushToken();
        if (decl) pushLine(decl);
        i++;
        continue;
      }

      // Accumulate everything else
      token += ch;
      i++;
    }

    // Flush any remaining token
    const remaining = flushToken();
    if (remaining) pushLine(remaining);

    // Post-process: normalize spaces around ':' in declarations (not selectors)
    // and ensure space after ':' for property: value pairs
    const processedLines = lines.map((line) => {
      const trimmed = line.trimStart();
      const indentPart = line.slice(0, line.length - trimmed.length);

      // If this looks like a CSS declaration (contains ':' but not '::' pseudo-elements,
      // not inside @rules without value, not a selector)
      if (
        trimmed.includes(':') &&
        !trimmed.startsWith('@') &&
        !trimmed.endsWith('{') &&
        !trimmed.endsWith('}') &&
        !trimmed.startsWith('/*')
      ) {
        // Find the first ':' that is not '::'
        const colonIdx = findPropertyColon(trimmed);
        if (colonIdx !== -1) {
          const prop = trimmed.slice(0, colonIdx).trimEnd();
          const val = trimmed.slice(colonIdx + 1).trimStart();
          return indentPart + prop + ': ' + val;
        }
      }
      return line;
    });

    // Join and clean up multiple blank lines
    const result = processedLines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd();

    return { result };
  } catch (e) {
    return { error: `Formatting failed: ${(e as Error).message}` };
  }
}

/**
 * Find the index of the ':' that separates a CSS property from its value.
 * Skips '::' pseudo-elements and ':' inside url() or strings.
 */
function findPropertyColon(declaration: string): number {
  let inParen = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < declaration.length; i++) {
    const ch = declaration[i];

    if (inString) {
      if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === '(') { inParen++; continue; }
    if (ch === ')') { inParen--; continue; }

    if (ch === ':' && inParen === 0) {
      // Skip '::' pseudo-elements
      if (declaration[i + 1] === ':') {
        i++; // skip next ':'
        continue;
      }
      // Skip ':' that is part of a pseudo-class selector (after a non-space word at depth 0)
      // Heuristic: if there's no space before the colon and what follows is a letter,
      // it might be a pseudo-class — but in a declaration context the prop comes first.
      // Since we only call this on lines that look like declarations, return first ':'.
      return i;
    }
  }
  return -1;
}

export function getCssFormatterStats(
  original: string,
  formatted: string
): { originalSize: number; formattedSize: number; linesAdded: number } {
  const encoder = new TextEncoder();
  const originalSize = encoder.encode(original).length;
  const formattedSize = encoder.encode(formatted).length;
  const originalLines = original ? original.split('\n').length : 0;
  const formattedLines = formatted ? formatted.split('\n').length : 0;
  const linesAdded = Math.max(0, formattedLines - originalLines);
  return { originalSize, formattedSize, linesAdded };
}
