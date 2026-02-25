export type DaySchedule =
  | "full"
  | "morning"
  | "morning_lunch"
  | "afternoon"
  | "lunch_afternoon";

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  groupId: string;
  daySchedule?: DaySchedule;
}

export const mockChildren: Child[] = [
  // Schmetterlinge (g1) - 5 children
  { id: "c1", firstName: "Anna", lastName: "Müller", dateOfBirth: "2021-03-15", groupId: "g1", daySchedule: "full" },
  { id: "c2", firstName: "Ben", lastName: "Keller", dateOfBirth: "2021-07-22", groupId: "g1", daySchedule: "morning_lunch" },
  { id: "c3", firstName: "Clara", lastName: "Schmidt", dateOfBirth: "2022-01-08", groupId: "g1", daySchedule: "morning" },
  { id: "c4", firstName: "David", lastName: "Roth", dateOfBirth: "2021-11-30", groupId: "g1", daySchedule: "full" },
  { id: "c5", firstName: "Emma", lastName: "Fischer", dateOfBirth: "2024-01-15", groupId: "g1", daySchedule: "lunch_afternoon" },
  // Bären (g2) - 5 children
  { id: "c6", firstName: "Finn", lastName: "Weber", dateOfBirth: "2021-05-12", groupId: "g2", daySchedule: "full" },
  { id: "c7", firstName: "Greta", lastName: "Meyer", dateOfBirth: "2022-02-14", groupId: "g2", daySchedule: "morning_lunch" },
  { id: "c8", firstName: "Hugo", lastName: "Wagner", dateOfBirth: "2021-09-03", groupId: "g2", daySchedule: "afternoon" },
  { id: "c9", firstName: "Ida", lastName: "Becker", dateOfBirth: "2021-12-20", groupId: "g2", daySchedule: "full" },
  { id: "c10", firstName: "Jonas", lastName: "Schulz", dateOfBirth: "2021-04-05", groupId: "g2", daySchedule: "morning" },
  // Igel (g3) - 4 children
  { id: "c11", firstName: "Lina", lastName: "Hoffmann", dateOfBirth: "2022-03-01", groupId: "g3", daySchedule: "full" },
  { id: "c12", firstName: "Max", lastName: "Koch", dateOfBirth: "2021-08-17", groupId: "g3", daySchedule: "lunch_afternoon" },
  { id: "c13", firstName: "Nora", lastName: "Richter", dateOfBirth: "2021-06-25", groupId: "g3", daySchedule: "morning_lunch" },
  { id: "c14", firstName: "Oscar", lastName: "Klein", dateOfBirth: "2022-01-12", groupId: "g3", daySchedule: "full" },
];
