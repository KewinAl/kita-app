export interface DailyTaskTemplate {
  id: string;
  name: string;
  order: number;
  locationId: string;
}

export const mockDailyTasks: DailyTaskTemplate[] = [
  { id: "t1", name: "Lunchtable", order: 1, locationId: "loc1" },
  { id: "t2", name: "Bathroom", order: 2, locationId: "loc1" },
  { id: "t3", name: "Sleeping", order: 3, locationId: "loc1" },
  { id: "t4", name: "Garderobe", order: 4, locationId: "loc1" },
  { id: "t5", name: "Teethbrushing", order: 5, locationId: "loc1" },
  { id: "t6", name: "Diaper change #1", order: 6, locationId: "loc1" },
  { id: "t7", name: "Diaper change #2", order: 7, locationId: "loc1" },
  { id: "t8", name: "Diaper change #3", order: 8, locationId: "loc1" },
  { id: "t9", name: "Zvieri vorbereiten", order: 9, locationId: "loc1" },
  { id: "t10", name: "Zvieri Küche", order: 10, locationId: "loc1" },
];
