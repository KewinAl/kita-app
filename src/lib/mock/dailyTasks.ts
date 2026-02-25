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
  { id: "t5", name: "Kitchen", order: 5, locationId: "loc1" },
  { id: "t6", name: "Diaper changes (3×)", order: 6, locationId: "loc1" },
];
