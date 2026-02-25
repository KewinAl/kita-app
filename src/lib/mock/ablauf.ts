export type MealType = "znueni" | "lunch" | "zvieri";

export interface AblaufMeal {
  id: string;
  date: string;
  mealType: MealType;
  description: string;
}

export interface DailyTaskAssignment {
  taskId: string;
  taskName: string;
  staffId: string;
  staffName: string;
  date: string;
  done: boolean;
}

const TODAY = "2025-02-19";

export const mockAblaufMeals: AblaufMeal[] = [
  { id: "m1", date: TODAY, mealType: "znueni", description: "Obst, Brot" },
  { id: "m2", date: TODAY, mealType: "lunch", description: "Pasta mit Tomatensauce" },
  { id: "m3", date: TODAY, mealType: "zvieri", description: "Joghurt, Kekse" },
];

export const mockTaskAssignments: DailyTaskAssignment[] = [
  { taskId: "t1", taskName: "Lunchtable", staffId: "s1", staffName: "Maria S.", date: TODAY, done: true },
  { taskId: "t2", taskName: "Bathroom", staffId: "s2", staffName: "Thomas K.", date: TODAY, done: true },
  { taskId: "t3", taskName: "Sleeping", staffId: "s1", staffName: "Maria S.", date: TODAY, done: true },
  { taskId: "t4", taskName: "Garderobe", staffId: "s3", staffName: "Lisa M.", date: TODAY, done: false },
  { taskId: "t5", taskName: "Kitchen", staffId: "s2", staffName: "Thomas K.", date: TODAY, done: false },
  { taskId: "t6", taskName: "Diaper changes (3×)", staffId: "s3", staffName: "Lisa M.", date: TODAY, done: false },
];
