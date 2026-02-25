export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  type: "activity" | "meal" | "nap" | "transition";
}

export const mockSchedule: ScheduleItem[] = [
  { id: "s1", time: "07:30", title: "Arrival & Free play", type: "activity" },
  { id: "s2", time: "08:30", title: "Breakfast", type: "meal" },
  { id: "s3", time: "09:15", title: "Circle time", type: "activity" },
  { id: "s4", time: "09:45", title: "Activity / Crafts", type: "activity" },
  { id: "s5", time: "10:30", title: "Snack", type: "meal" },
  { id: "s6", time: "11:00", title: "Outdoor play", type: "activity" },
  { id: "s7", time: "12:00", title: "Lunch", type: "meal" },
  { id: "s8", time: "12:30", title: "Quiet time / Nap", type: "nap" },
  { id: "s9", time: "14:30", title: "Snack", type: "meal" },
  { id: "s10", time: "15:00", title: "Free play / Pickup", type: "transition" },
];
