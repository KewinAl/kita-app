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
