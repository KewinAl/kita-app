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
