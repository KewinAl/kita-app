export const PROTOTYPE_TODAY = "2025-02-19";
export const CALENDAR_DAY_RANGE = 14;

function toDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  // Use UTC noon to avoid timezone/day-boundary drift on roundtrips.
  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, 12, 0, 0));
}

export function addDays(dateKey: string, offset: number): string {
  const d = parseDateKey(dateKey);
  d.setUTCDate(d.getUTCDate() + offset);
  return toDateKey(d);
}

export function isFutureDate(dateKey: string): boolean {
  return dateKey > PROTOTYPE_TODAY;
}

export function isPastDate(dateKey: string): boolean {
  return dateKey < PROTOTYPE_TODAY;
}

export function getCalendarWindow(centerDate = PROTOTYPE_TODAY): string[] {
  const days: string[] = [];
  for (let i = -CALENDAR_DAY_RANGE; i <= CALENDAR_DAY_RANGE; i += 1) {
    days.push(addDays(centerDate, i));
  }
  return days;
}

export function clampToCalendarWindow(dateKey?: string, centerDate = PROTOTYPE_TODAY): string {
  if (!dateKey) return centerDate;
  const min = addDays(centerDate, -CALENDAR_DAY_RANGE);
  const max = addDays(centerDate, CALENDAR_DAY_RANGE);
  if (dateKey < min) return min;
  if (dateKey > max) return max;
  return dateKey;
}

export function formatDateShort(dateKey: string): string {
  const d = parseDateKey(dateKey);
  return d.toLocaleDateString("de-CH", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}
