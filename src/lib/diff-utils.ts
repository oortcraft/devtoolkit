export type DiffLineType = 'added' | 'removed' | 'unchanged';

export interface DiffLine {
  type: DiffLineType;
  lineNumberA: number | null;
  lineNumberB: number | null;
  content: string;
}

export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
}

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

export function computeDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA === '' ? [] : textA.split('\n');
  const linesB = textB === '' ? [] : textB.split('\n');

  const dp = lcs(linesA, linesB);

  const result: DiffLine[] = [];
  let i = linesA.length;
  let j = linesB.length;

  const steps: Array<{ type: DiffLineType; a: number | null; b: number | null; content: string }> = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      steps.push({ type: 'unchanged', a: i, b: j, content: linesA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      steps.push({ type: 'added', a: null, b: j, content: linesB[j - 1] });
      j--;
    } else {
      steps.push({ type: 'removed', a: i, b: null, content: linesA[i - 1] });
      i--;
    }
  }

  steps.reverse();
  for (const step of steps) {
    result.push({
      type: step.type,
      lineNumberA: step.a,
      lineNumberB: step.b,
      content: step.content,
    });
  }

  return result;
}

export function computeStats(lines: DiffLine[]): DiffStats {
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  for (const line of lines) {
    if (line.type === 'added') added++;
    else if (line.type === 'removed') removed++;
    else unchanged++;
  }
  return { added, removed, unchanged };
}
