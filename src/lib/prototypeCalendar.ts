/** Opening day for the prototype Kita (Mon 3 Aug 2026). */
export const PROTOTYPE_TODAY = "2026-08-03";

/** Inclusive first weekday of seeded history (Mon 20 Jul 2026). */
export const HISTORY_START = "2026-07-20";

/** Inclusive last weekday of seeded history (Fri 31 Jul 2026). */
export const HISTORY_END = "2026-07-31";

/** Inclusive first weekday of next-week meal plans (Mon 10 Aug 2026). */
export const NEXT_WEEK_START = "2026-08-10";

/** Inclusive last weekday of next-week meal plans (Fri 14 Aug 2026). */
export const NEXT_WEEK_END = "2026-08-14";

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

export function getWeekday(dateKey: string): number {
  return parseDateKey(dateKey).getUTCDay(); // 0=Sun … 6=Sat
}

export function isWeekday(dateKey: string): boolean {
  const day = getWeekday(dateKey);
  return day >= 1 && day <= 5;
}

/** If Sat → previous Fri; if Sun → following Mon; else unchanged. */
export function snapToWeekday(dateKey: string): string {
  const day = getWeekday(dateKey);
  if (day === 6) return addDays(dateKey, -1);
  if (day === 0) return addDays(dateKey, 1);
  return dateKey;
}

/** Move by N weekdays (skips Sat/Sun). */
export function addWeekdays(dateKey: string, offset: number): string {
  if (offset === 0) return snapToWeekday(dateKey);
  let current = snapToWeekday(dateKey);
  const step = offset > 0 ? 1 : -1;
  let remaining = Math.abs(offset);
  while (remaining > 0) {
    current = addDays(current, step);
    if (isWeekday(current)) remaining -= 1;
  }
  return current;
}

export function isFutureDate(dateKey: string): boolean {
  return dateKey > PROTOTYPE_TODAY;
}

export function isPastDate(dateKey: string): boolean {
  return dateKey < PROTOTYPE_TODAY;
}

export function isOpeningDay(dateKey: string): boolean {
  return dateKey === PROTOTYPE_TODAY;
}

/** All Mon–Fri keys from start through end (inclusive). */
export function listWeekdaysInRange(start: string, end: string): string[] {
  const days: string[] = [];
  let current = start;
  while (current <= end) {
    if (isWeekday(current)) days.push(current);
    current = addDays(current, 1);
  }
  return days;
}

export function getHistoryWeekdays(): string[] {
  return listWeekdaysInRange(HISTORY_START, HISTORY_END);
}

export function getNextWeekWeekdays(): string[] {
  return listWeekdaysInRange(NEXT_WEEK_START, NEXT_WEEK_END);
}

/**
 * Seeded operational window: past history + opening day + next-week meal plan days.
 * Used to prefill mock “backend” state; navigation is not limited to this range.
 */
export function getSeededDateKeys(): string[] {
  const set = new Set<string>([
    ...getHistoryWeekdays(),
    PROTOTYPE_TODAY,
    ...getNextWeekWeekdays(),
  ]);
  return [...set].sort();
}

/** @deprecated Prefer getSeededDateKeys — kept as alias for lead shift init. */
export function getCalendarWindow(_centerDate = PROTOTYPE_TODAY): string[] {
  return getSeededDateKeys();
}

/**
 * Resolve a date query param: default to opening day, snap weekends to Mon–Fri.
 * No ±14 day clamp — calendar navigation is open-ended.
 */
export function resolvePrototypeDate(dateKey?: string | null): string {
  if (!dateKey) return PROTOTYPE_TODAY;
  return snapToWeekday(dateKey);
}

/** @deprecated Use resolvePrototypeDate — no window clamp anymore. */
export function clampToCalendarWindow(
  dateKey?: string | null,
  _centerDate = PROTOTYPE_TODAY
): string {
  return resolvePrototypeDate(dateKey);
}

export function formatDateShort(dateKey: string): string {
  const d = parseDateKey(dateKey);
  return d.toLocaleDateString("de-CH", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
