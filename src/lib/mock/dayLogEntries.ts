export type DayLogType = "meal" | "nap" | "activity" | "incident" | "photo";

export interface MealData {
  mealType: "breakfast" | "lunch" | "snack";
  option: "ate_well" | "ate_some" | "ate_little" | "didnt_eat";
}

export interface NapData {
  startTime: string;
  endTime: string;
  quality: "good" | "restless" | "short";
}

export interface ActivityData {
  category: string;
  note?: string;
}

export interface IncidentData {
  type: "injury" | "illness" | "conflict";
  description: string;
  actionsTaken?: string;
}

export interface DayLogEntry {
  id: string;
  childId: string;
  date: string;
  type: DayLogType;
  data?: MealData | NapData | ActivityData | IncidentData;
  createdAt?: string;
}

export const mockDayLogEntries: DayLogEntry[] = [
  {
    id: "l1",
    childId: "c1",
    date: "2025-02-19",
    type: "meal",
    data: { mealType: "breakfast", option: "ate_well" },
    createdAt: "08:30",
  },
  {
    id: "l2",
    childId: "c1",
    date: "2025-02-19",
    type: "nap",
    data: { startTime: "12:15", endTime: "13:45", quality: "good" },
    createdAt: "13:45",
  },
  {
    id: "l3",
    childId: "c1",
    date: "2025-02-19",
    type: "photo",
    createdAt: "10:20",
  },
  {
    id: "l4",
    childId: "c2",
    date: "2025-02-19",
    type: "meal",
    data: { mealType: "lunch", option: "ate_some" },
    createdAt: "12:00",
  },
  {
    id: "l5",
    childId: "c2",
    date: "2025-02-19",
    type: "photo",
    createdAt: "11:00",
  },
  {
    id: "l6",
    childId: "c4",
    date: "2025-02-19",
    type: "meal",
    data: { mealType: "breakfast", option: "ate_little" },
    createdAt: "08:45",
  },
  {
    id: "l7",
    childId: "c4",
    date: "2025-02-19",
    type: "nap",
    data: { startTime: "12:30", endTime: "13:00", quality: "short" },
    createdAt: "13:00",
  },
  {
    id: "l8",
    childId: "c4",
    date: "2025-02-19",
    type: "incident",
    data: {
      type: "injury",
      description: "Small scrape on knee during outdoor play",
      actionsTaken: "Cleaned and bandaged. Parent notified.",
    },
    createdAt: "14:15",
  },
  {
    id: "l9",
    childId: "c5",
    date: "2025-02-19",
    type: "meal",
    data: { mealType: "snack", option: "ate_well" },
    createdAt: "10:00",
  },
  {
    id: "l10",
    childId: "c10",
    date: "2025-02-19",
    type: "meal",
    data: { mealType: "lunch", option: "ate_well" },
    createdAt: "12:15",
  },
  {
    id: "l11",
    childId: "c10",
    date: "2025-02-19",
    type: "activity",
    data: { category: "Painting", note: "Made a butterfly picture" },
    createdAt: "09:30",
  },
  {
    id: "l12",
    childId: "c1",
    date: "2025-02-19",
    type: "meal",
    data: { mealType: "lunch", option: "ate_well" },
    createdAt: "12:00",
  },
  {
    id: "l13",
    childId: "c1",
    date: "2025-02-19",
    type: "activity",
    data: { category: "Outdoor play", note: "Playground time" },
    createdAt: "10:45",
  },
  // Bären
  { id: "l14", childId: "c6", date: "2025-02-19", type: "meal", data: { mealType: "breakfast", option: "ate_well" }, createdAt: "08:30" },
  { id: "l15", childId: "c6", date: "2025-02-19", type: "nap", data: { startTime: "12:00", endTime: "13:30", quality: "good" }, createdAt: "13:30" },
  { id: "l16", childId: "c7", date: "2025-02-19", type: "meal", data: { mealType: "lunch", option: "ate_some" }, createdAt: "12:15" },
  // Igel
  { id: "l17", childId: "c11", date: "2025-02-19", type: "meal", data: { mealType: "breakfast", option: "ate_well" }, createdAt: "08:45" },
  { id: "l18", childId: "c11", date: "2025-02-19", type: "activity", data: { category: "Basteln", note: "Schmetterling gebastelt" }, createdAt: "10:00" },
  { id: "l19", childId: "c13", date: "2025-02-19", type: "meal", data: { mealType: "snack", option: "ate_well" }, createdAt: "10:30" },
];
