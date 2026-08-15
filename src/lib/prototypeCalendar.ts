/** Kita opening day (Mon 3 Aug 2026) — first day of operational fill. */
export const OPENING_DAY = "2026-08-03";

/**
 * Prototype “today” — Fri 14 Aug 2026 (last weekday with seeded day logs).
 * Calendar Saturday 15.8 snaps here via snapToWeekday.
 */
export const PROTOTYPE_TODAY = "2026-08-14";

/** Inclusive first weekday of earlier July history (kept for browsing). */
export const PRE_OPENING_HISTORY_START = "2026-07-20";

/** Inclusive last weekday of earlier July history. */
export const PRE_OPENING_HISTORY_END = "2026-07-31";

/** Inclusive first weekday of post-opening filled logs (= opening day). */
export const FILLED_START = OPENING_DAY;

/** Inclusive last weekday of filled logs (through “today”). */
export const FILLED_END = PROTOTYPE_TODAY;

/** @deprecated Use PRE_OPENING_HISTORY_START */
export const HISTORY_START = PRE_OPENING_HISTORY_START;
/** @deprecated Use PRE_OPENING_HISTORY_END */
export const HISTORY_END = PRE_OPENING_HISTORY_END;

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
  return dateKey === OPENING_DAY;
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

/** July history kept from the earlier seed (before opening). */
export function getPreOpeningHistoryWeekdays(): string[] {
  return listWeekdaysInRange(PRE_OPENING_HISTORY_START, PRE_OPENING_HISTORY_END);
}

/** Opening through today: 3.8.–14.8.2026 Mon–Fri — full day logs. */
export function getPostOpeningFilledWeekdays(): string[] {
  return listWeekdaysInRange(FILLED_START, FILLED_END);
}

/**
 * Every weekday that has full seeded day data (July history + 3.8.–14.8.).
 */
export function getFilledWeekdays(): string[] {
  const set = new Set<string>([
    ...getPreOpeningHistoryWeekdays(),
    ...getPostOpeningFilledWeekdays(),
  ]);
  return [...set].sort();
}

/** @deprecated Prefer getFilledWeekdays / getPreOpeningHistoryWeekdays */
export function getHistoryWeekdays(): string[] {
  return getPreOpeningHistoryWeekdays();
}

/** @deprecated Post-opening fill replaced meal-plan-only next week */
export function getNextWeekWeekdays(): string[] {
  return getPostOpeningFilledWeekdays();
}

/**
 * Seeded operational window for prefilling mock state.
 * Navigation is not limited to this range.
 */
export function getSeededDateKeys(): string[] {
  return getFilledWeekdays();
}

/** @deprecated Prefer getSeededDateKeys — kept as alias for lead shift init. */
export function getCalendarWindow(_centerDate = PROTOTYPE_TODAY): string[] {
  return getSeededDateKeys();
}

/**
 * Resolve a date query param: default to prototype today, snap weekends to Mon–Fri.
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
