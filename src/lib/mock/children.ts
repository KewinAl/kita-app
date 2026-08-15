export type DaySchedule =
  | "full"
  | "morning"
  | "morning_lunch"
  | "afternoon"
  | "lunch_afternoon";

export const DAY_SCHEDULE_LABELS: Record<DaySchedule, string> = {
  full: "Ganztag",
  morning: "Vormittag",
  morning_lunch: "Vormittag + Mittag",
  afternoon: "Nachmittag",
  lunch_afternoon: "Mittag + Nachmittag",
};

export function dayScheduleLabel(schedule?: DaySchedule) {
  return schedule ? DAY_SCHEDULE_LABELS[schedule] : "—";
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  groupId: string;
  daySchedule?: DaySchedule;
}

/**
 * Ages evaluated as of opening day 2026-08-03.
 *
 * g1 Schmetterlinge — only ≥18 months (11 kids → 11 spots)
 * g2 Bären — mixed (7 ≥18mo + 3 infants → 11.5 spots)
 * g3 Igel — only <18 months (9 infants → 13.5 spots)
 *
 * Existing children c1–c14 kept; c11–c14 moved from Igel into Schmetterlinge.
 */
export const mockChildren: Child[] = [
  // —— Schmetterlinge (g1) — 18+ months only ——
  { id: "c1", firstName: "Anna", lastName: "Müller", dateOfBirth: "2021-03-15", groupId: "g1", daySchedule: "full" },
  { id: "c2", firstName: "Ben", lastName: "Keller", dateOfBirth: "2021-07-22", groupId: "g1", daySchedule: "morning_lunch" },
  { id: "c3", firstName: "Clara", lastName: "Schmidt", dateOfBirth: "2022-01-08", groupId: "g1", daySchedule: "morning" },
  { id: "c4", firstName: "David", lastName: "Roth", dateOfBirth: "2021-11-30", groupId: "g1", daySchedule: "full" },
  { id: "c5", firstName: "Emma", lastName: "Fischer", dateOfBirth: "2024-01-15", groupId: "g1", daySchedule: "lunch_afternoon" },
  { id: "c11", firstName: "Lina", lastName: "Hoffmann", dateOfBirth: "2022-03-01", groupId: "g1", daySchedule: "full" },
  { id: "c12", firstName: "Max", lastName: "Koch", dateOfBirth: "2021-08-17", groupId: "g1", daySchedule: "lunch_afternoon" },
  { id: "c13", firstName: "Nora", lastName: "Richter", dateOfBirth: "2021-06-25", groupId: "g1", daySchedule: "morning_lunch" },
  { id: "c14", firstName: "Oscar", lastName: "Klein", dateOfBirth: "2022-01-12", groupId: "g1", daySchedule: "full" },
  { id: "c15", firstName: "Pia", lastName: "Steiner", dateOfBirth: "2022-06-10", groupId: "g1", daySchedule: "full" },
  { id: "c16", firstName: "Quinn", lastName: "Baumann", dateOfBirth: "2021-10-08", groupId: "g1", daySchedule: "morning_lunch" },

  // —— Bären (g2) — mixed ages ——
  { id: "c6", firstName: "Finn", lastName: "Weber", dateOfBirth: "2021-05-12", groupId: "g2", daySchedule: "full" },
  { id: "c7", firstName: "Greta", lastName: "Meyer", dateOfBirth: "2022-02-14", groupId: "g2", daySchedule: "morning_lunch" },
  { id: "c8", firstName: "Hugo", lastName: "Wagner", dateOfBirth: "2021-09-03", groupId: "g2", daySchedule: "afternoon" },
  { id: "c9", firstName: "Ida", lastName: "Becker", dateOfBirth: "2021-12-20", groupId: "g2", daySchedule: "full" },
  { id: "c10", firstName: "Jonas", lastName: "Schulz", dateOfBirth: "2021-04-05", groupId: "g2", daySchedule: "morning" },
  { id: "c17", firstName: "Ruben", lastName: "Graf", dateOfBirth: "2022-04-20", groupId: "g2", daySchedule: "full" },
  { id: "c18", firstName: "Sofia", lastName: "Brunner", dateOfBirth: "2021-02-28", groupId: "g2", daySchedule: "morning_lunch" },
  { id: "c19", firstName: "Theo", lastName: "Knecht", dateOfBirth: "2025-06-15", groupId: "g2", daySchedule: "full" },
  { id: "c20", firstName: "Uma", lastName: "Vogel", dateOfBirth: "2025-04-01", groupId: "g2", daySchedule: "morning_lunch" },
  { id: "c21", firstName: "Viktor", lastName: "Ammann", dateOfBirth: "2025-08-20", groupId: "g2", daySchedule: "full" },

  // —— Igel (g3) — only <18 months ——
  { id: "c22", firstName: "Willow", lastName: "Meier", dateOfBirth: "2025-03-12", groupId: "g3", daySchedule: "full" },
  { id: "c23", firstName: "Xaver", lastName: "Suter", dateOfBirth: "2025-05-05", groupId: "g3", daySchedule: "full" },
  { id: "c24", firstName: "Yara", lastName: "Frei", dateOfBirth: "2025-07-18", groupId: "g3", daySchedule: "morning_lunch" },
  { id: "c25", firstName: "Zoe", lastName: "Brun", dateOfBirth: "2025-09-02", groupId: "g3", daySchedule: "full" },
  { id: "c26", firstName: "Arthur", lastName: "Gross", dateOfBirth: "2025-10-22", groupId: "g3", daySchedule: "full" },
  { id: "c27", firstName: "Bianca", lastName: "Hofstetter", dateOfBirth: "2025-11-30", groupId: "g3", daySchedule: "morning_lunch" },
  { id: "c28", firstName: "Cedric", lastName: "Jenni", dateOfBirth: "2025-12-15", groupId: "g3", daySchedule: "full" },
  { id: "c29", firstName: "Daria", lastName: "Kaufmann", dateOfBirth: "2026-01-20", groupId: "g3", daySchedule: "full" },
  { id: "c30", firstName: "Elio", lastName: "Lang", dateOfBirth: "2026-02-10", groupId: "g3", daySchedule: "morning_lunch" },
];
