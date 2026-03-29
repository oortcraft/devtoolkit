export interface CronValidationResult {
  valid: boolean;
  error?: string;
}

export interface CronParseResult {
  description: string;
}

const SPECIAL_STRINGS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

function expandSpecial(expr: string): string {
  const trimmed = expr.trim().toLowerCase();
  return SPECIAL_STRINGS[trimmed] ?? expr;
}

function parseField(
  value: string,
  min: number,
  max: number,
  name: string,
): string | null {
  if (value === '*') return null;

  const parts = value.split(',');
  for (const part of parts) {
    if (part.includes('/')) {
      const [rangeOrStar, step] = part.split('/');
      const stepNum = parseInt(step, 10);
      if (isNaN(stepNum) || stepNum <= 0)
        return `Invalid step in ${name} field: "${part}"`;
      if (rangeOrStar !== '*') {
        const [lo, hi] = rangeOrStar.split('-').map(Number);
        if (isNaN(lo) || lo < min || lo > max)
          return `Value ${lo} out of range [${min}-${max}] in ${name} field`;
        if (hi !== undefined) {
          if (isNaN(hi) || hi < min || hi > max)
            return `Value ${hi} out of range [${min}-${max}] in ${name} field`;
          if (lo > hi)
            return `Invalid range ${lo}-${hi} in ${name} field`;
        }
      }
    } else if (part.includes('-')) {
      const [lo, hi] = part.split('-').map(Number);
      if (isNaN(lo) || lo < min || lo > max)
        return `Value ${lo} out of range [${min}-${max}] in ${name} field`;
      if (isNaN(hi) || hi < min || hi > max)
        return `Value ${hi} out of range [${min}-${max}] in ${name} field`;
      if (lo > hi)
        return `Invalid range ${lo}-${hi} in ${name} field`;
    } else {
      const n = parseInt(part, 10);
      if (isNaN(n) || n < min || n > max)
        return `Value "${part}" out of range [${min}-${max}] in ${name} field`;
    }
  }
  return null;
}

export function validateCron(expr: string): CronValidationResult {
  const expanded = expandSpecial(expr);
  const fields = expanded.trim().split(/\s+/);

  if (fields.length !== 5) {
    return {
      valid: false,
      error: `Expected 5 fields (minute hour day month weekday), got ${fields.length}`,
    };
  }

  const [minute, hour, day, month, weekday] = fields;

  const checks: Array<[string, number, number, string]> = [
    [minute, 0, 59, 'minute'],
    [hour, 0, 23, 'hour'],
    [day, 1, 31, 'day'],
    [month, 1, 12, 'month'],
    [weekday, 0, 7, 'weekday'],
  ];

  for (const [val, min, max, name] of checks) {
    const err = parseField(val, min, max, name);
    if (err) return { valid: false, error: err };
  }

  return { valid: true };
}

// ─── Human-readable description ────────────────────────────────────────────

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function describeMinute(val: string): string {
  if (val === '*') return 'every minute';
  if (val === '0') return 'at minute 0';
  if (val.startsWith('*/')) return `every ${val.slice(2)} minutes`;
  if (val.includes('-') && val.includes('/')) {
    const [range, step] = val.split('/');
    return `every ${step} minutes from minute ${range}`;
  }
  if (val.includes(',')) return `at minutes ${val}`;
  if (val.includes('-')) return `every minute from minute ${val.replace('-', ' through ')}`;
  return `at minute ${val}`;
}

function describeHour(val: string): string {
  if (val === '*') return '';
  if (val.startsWith('*/')) return `every ${val.slice(2)} hours`;
  if (val.includes(',')) {
    const hours = val.split(',').map((h) => `${parseInt(h, 10)}:00`);
    return `at ${hours.join(', ')}`;
  }
  if (val.includes('-') && val.includes('/')) {
    const [range, step] = val.split('/');
    return `every ${step} hours from ${range.split('-')[0]}:00`;
  }
  if (val.includes('-')) {
    const [lo, hi] = val.split('-');
    return `between ${parseInt(lo, 10)}:00 and ${parseInt(hi, 10)}:59`;
  }
  return `at ${parseInt(val, 10)}:00`;
}

function describeDay(val: string): string {
  if (val === '*') return '';
  if (val.startsWith('*/')) return `every ${val.slice(2)} days`;
  if (val.includes(',')) return `on the ${val.split(',').map((d) => ordinal(parseInt(d, 10))).join(', ')}`;
  if (val.includes('-')) return `from the ${val.replace('-', 'th through the ')}th`;
  return `on the ${ordinal(parseInt(val, 10))}`;
}

function describeMonth(val: string): string {
  if (val === '*') return '';
  if (val.startsWith('*/')) return `every ${val.slice(2)} months`;
  if (val.includes(',')) return `in ${val.split(',').map((m) => MONTH_NAMES[parseInt(m, 10)]).join(', ')}`;
  if (val.includes('-')) {
    const [lo, hi] = val.split('-').map(Number);
    return `from ${MONTH_NAMES[lo]} to ${MONTH_NAMES[hi]}`;
  }
  return `in ${MONTH_NAMES[parseInt(val, 10)]}`;
}

function describeWeekday(val: string): string {
  if (val === '*') return '';
  const normalize = (n: number) => (n === 7 ? 0 : n);
  if (val.startsWith('*/')) return `every ${val.slice(2)} days of the week`;
  if (val.includes(',')) {
    return `on ${val.split(',').map((d) => DAY_NAMES[normalize(parseInt(d, 10))]).join(', ')}`;
  }
  if (val.includes('-')) {
    const [lo, hi] = val.split('-').map(Number);
    return `${DAY_NAMES[normalize(lo)]} through ${DAY_NAMES[normalize(hi)]}`;
  }
  return `on ${DAY_NAMES[normalize(parseInt(val, 10))]}`;
}

export function parseCron(expr: string): string {
  // Check special strings first for clean descriptions
  const trimmedLower = expr.trim().toLowerCase();
  if (trimmedLower === '@yearly' || trimmedLower === '@annually') return 'Every year on January 1st at midnight';
  if (trimmedLower === '@monthly') return 'Every month on the 1st at midnight';
  if (trimmedLower === '@weekly') return 'Every week on Sunday at midnight';
  if (trimmedLower === '@daily' || trimmedLower === '@midnight') return 'Every day at midnight';
  if (trimmedLower === '@hourly') return 'Every hour';

  const expanded = expandSpecial(expr);
  const validation = validateCron(expanded);
  if (!validation.valid) return 'Invalid cron expression';

  const [minute, hour, day, month, weekday] = expanded.trim().split(/\s+/);

  // Common shortcut patterns
  if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    return 'Every minute';
  }
  if (minute.startsWith('*/') && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    const n = minute.slice(2);
    return n === '1' ? 'Every minute' : `Every ${n} minutes`;
  }
  if (minute === '0' && hour.startsWith('*/') && day === '*' && month === '*' && weekday === '*') {
    const n = hour.slice(2);
    return `Every ${n} hours`;
  }
  if (minute === '0' && hour === '0' && day === '*' && month === '*' && weekday === '*') {
    return 'Every day at midnight';
  }
  if (minute === '0' && hour === '12' && day === '*' && month === '*' && weekday === '*') {
    return 'Every day at noon';
  }
  if (minute === '0' && hour !== '*' && day === '*' && month === '*' && weekday === '*') {
    return `Every day at ${parseInt(hour, 10)}:00`;
  }

  // Build composite description
  const parts: string[] = [];

  const minDesc = describeMinute(minute);
  const hourDesc = describeHour(hour);
  const dayDesc = describeDay(day);
  const monthDesc = describeMonth(month);
  const wdDesc = describeWeekday(weekday);

  if (hour === '*') {
    parts.push(minDesc.charAt(0).toUpperCase() + minDesc.slice(1));
  } else {
    const timeStr = hourDesc || describeMinute(minute);
    if (minute === '0') {
      parts.push(`${hourDesc.charAt(0).toUpperCase() + hourDesc.slice(1)}`);
    } else {
      parts.push(`${minDesc.charAt(0).toUpperCase() + minDesc.slice(1)} past ${hourDesc}`);
    }
  }

  if (wdDesc) parts.push(wdDesc);
  if (dayDesc) parts.push(dayDesc);
  if (monthDesc) parts.push(monthDesc);

  return parts.join(', ');
}

// ─── Next run times ─────────────────────────────────────────────────────────

function expandValues(field: string, min: number, max: number): number[] {
  const result = new Set<number>();

  const parts = field.split(',');
  for (const part of parts) {
    if (part === '*') {
      for (let i = min; i <= max; i++) result.add(i);
    } else if (part.includes('/')) {
      const [rangeOrStar, stepStr] = part.split('/');
      const step = parseInt(stepStr, 10);
      let lo = min;
      let hi = max;
      if (rangeOrStar !== '*') {
        if (rangeOrStar.includes('-')) {
          [lo, hi] = rangeOrStar.split('-').map(Number);
        } else {
          lo = parseInt(rangeOrStar, 10);
        }
      }
      for (let i = lo; i <= hi; i += step) result.add(i);
    } else if (part.includes('-')) {
      const [lo, hi] = part.split('-').map(Number);
      for (let i = lo; i <= hi; i++) result.add(i);
    } else {
      result.add(parseInt(part, 10));
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

export function getNextRuns(expr: string, count: number): Date[] {
  const expanded = expandSpecial(expr);
  const validation = validateCron(expanded);
  if (!validation.valid) return [];

  const [minuteF, hourF, dayF, monthF, weekdayF] = expanded.trim().split(/\s+/);

  const minutes = expandValues(minuteF, 0, 59);
  const hours = expandValues(hourF, 0, 23);
  const days = expandValues(dayF, 1, 31);
  const months = expandValues(monthF, 1, 12);
  const weekdays = expandValues(weekdayF, 0, 7).map((d) => (d === 7 ? 0 : d));
  const anyWeekday = weekdayF === '*';
  const anyDay = dayF === '*';

  const results: Date[] = [];
  const now = new Date();

  // Start search from next minute
  const start = new Date(now);
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  const MAX_ITERATIONS = 500000;
  let iterations = 0;

  const current = new Date(start);

  while (results.length < count && iterations < MAX_ITERATIONS) {
    iterations++;

    const m = current.getMonth() + 1; // 1-based
    if (!months.includes(m)) {
      // Jump to next matching month
      current.setDate(1);
      current.setHours(0, 0, 0, 0);
      current.setMonth(current.getMonth() + 1);
      continue;
    }

    const d = current.getDate();
    const wd = current.getDay();

    const dayMatch = anyDay ? true : days.includes(d);
    const wdMatch = anyWeekday ? true : weekdays.includes(wd);

    // If both day-of-month and day-of-week are restricted, either can satisfy (OR semantics)
    const timeMatch = (!anyDay && !anyWeekday) ? (dayMatch || wdMatch) : (dayMatch && wdMatch);

    if (!timeMatch) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    const h = current.getHours();
    if (!hours.includes(h)) {
      const nextHour = hours.find((hh) => hh > h);
      if (nextHour !== undefined) {
        current.setHours(nextHour, 0, 0, 0);
      } else {
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
      }
      continue;
    }

    const min = current.getMinutes();
    const nextMin = minutes.find((mm) => mm >= min);
    if (nextMin === undefined) {
      // No valid minute this hour, advance to next valid hour
      const nextHour = hours.find((hh) => hh > h);
      if (nextHour !== undefined) {
        current.setHours(nextHour, 0, 0, 0);
      } else {
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
      }
      continue;
    }

    if (nextMin === min) {
      results.push(new Date(current));
      // Advance to next minute
      const afterMin = minutes.find((mm) => mm > min);
      if (afterMin !== undefined) {
        current.setMinutes(afterMin, 0, 0);
      } else {
        const nextHour = hours.find((hh) => hh > h);
        if (nextHour !== undefined) {
          current.setHours(nextHour, 0, 0, 0);
        } else {
          current.setDate(current.getDate() + 1);
          current.setHours(0, 0, 0, 0);
        }
      }
    } else {
      current.setMinutes(nextMin, 0, 0);
    }
  }

  return results;
}
