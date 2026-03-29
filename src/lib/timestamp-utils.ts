export interface TimestampResult {
  iso: string;
  utc: string;
  local: string;
  relative: string;
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  if (Math.abs(diffSec) < 5) return 'just now';
  if (Math.abs(diffSec) < 60) return diffSec > 0 ? `${diffSec} seconds ago` : `in ${Math.abs(diffSec)} seconds`;
  if (Math.abs(diffMin) < 60) return diffMin > 0 ? `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago` : `in ${Math.abs(diffMin)} minute${Math.abs(diffMin) !== 1 ? 's' : ''}`;
  if (Math.abs(diffHour) < 24) return diffHour > 0 ? `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago` : `in ${Math.abs(diffHour)} hour${Math.abs(diffHour) !== 1 ? 's' : ''}`;
  if (Math.abs(diffDay) < 30) return diffDay > 0 ? `${diffDay} day${diffDay !== 1 ? 's' : ''} ago` : `in ${Math.abs(diffDay)} day${Math.abs(diffDay) !== 1 ? 's' : ''}`;
  if (Math.abs(diffMonth) < 12) return diffMonth > 0 ? `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago` : `in ${Math.abs(diffMonth)} month${Math.abs(diffMonth) !== 1 ? 's' : ''}`;
  return diffYear > 0 ? `${diffYear} year${diffYear !== 1 ? 's' : ''} ago` : `in ${Math.abs(diffYear)} year${Math.abs(diffYear) !== 1 ? 's' : ''}`;
}

export function fromUnix(ts: number, isMillis: boolean): TimestampResult {
  const ms = isMillis ? ts : ts * 1000;
  const date = new Date(ms);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    relative: getRelativeTime(date),
  };
}

export function toUnix(dateStr: string): number {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }
  return Math.floor(date.getTime() / 1000);
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}
