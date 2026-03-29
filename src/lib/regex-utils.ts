export interface RegexMatch {
  index: number;
  match: string;
  groups: Record<string, string> | null;
  subgroups: string[];
}

export interface RegexResult {
  matches: RegexMatch[];
  count: number;
  error?: string;
}

export function testRegex(pattern: string, flags: string, testString: string): RegexResult {
  if (!pattern) {
    return { matches: [], count: 0 };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (e) {
    return {
      matches: [],
      count: 0,
      error: `Invalid regex: ${e instanceof Error ? e.message : String(e)}`,
    };
  }

  const matches: RegexMatch[] = [];

  if (flags.includes('g')) {
    let m: RegExpExecArray | null;
    // Guard against infinite loops from zero-width matches
    let lastIndex = -1;
    while ((m = regex.exec(testString)) !== null) {
      if (regex.lastIndex === lastIndex) {
        regex.lastIndex++;
        continue;
      }
      lastIndex = regex.lastIndex;
      matches.push({
        index: m.index,
        match: m[0],
        groups: m.groups ?? null,
        subgroups: m.slice(1),
      });
    }
  } else {
    const m = regex.exec(testString);
    if (m !== null) {
      matches.push({
        index: m.index,
        match: m[0],
        groups: m.groups ?? null,
        subgroups: m.slice(1),
      });
    }
  }

  return { matches, count: matches.length };
}
