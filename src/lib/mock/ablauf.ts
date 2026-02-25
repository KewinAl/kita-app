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
  { taskId: "t2", taskName: "Bathroom", staffId: "s4", staffName: "Noah B.", date: TODAY, done: true },
  { taskId: "t3", taskName: "Sleeping", staffId: "s2", staffName: "Thomas K.", date: TODAY, done: true },
  { taskId: "t4", taskName: "Garderobe", staffId: "s3", staffName: "Lisa M.", date: TODAY, done: false },
  { taskId: "t5", taskName: "Teethbrushing", staffId: "s1", staffName: "Maria S.", date: TODAY, done: false },
  { taskId: "t6", taskName: "Diaper change #1", staffId: "s5", staffName: "Lea P.", date: TODAY, done: false },
  { taskId: "t7", taskName: "Diaper change #2", staffId: "s8", staffName: "Milo A.", date: TODAY, done: false },
  { taskId: "t8", taskName: "Diaper change #3", staffId: "s11", staffName: "Nino C.", date: TODAY, done: false },
  { taskId: "t9", taskName: "Zvieri vorbereiten", staffId: "s6", staffName: "Tim R.", date: TODAY, done: false },
  { taskId: "t10", taskName: "Zvieri Küche", staffId: "s4", staffName: "Noah B.", date: TODAY, done: false },
];
