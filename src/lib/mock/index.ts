export {
  mockChildren,
  DAY_SCHEDULE_LABELS,
  dayScheduleLabel,
  type Child,
  type DaySchedule,
} from "./children";
export {
  emptyChildCareProfile,
  initialChildProfilesMap,
  stammdatenComplete,
  healthComplete,
  emergencyComplete,
  sleepComplete,
  type ChildCareProfile,
} from "./childProfile";
export {
  type AttendanceRecord,
  type AttendanceStatus,
} from "./attendance";
export {
  type DayLogEntry,
  type DayLogType,
  type MealData,
  type NapData,
  type ActivityData,
  type IncidentData,
} from "./dayLogEntries";
export { mockGroups, type KitaGroup } from "./groups";
export { mockLocations, type KitaLocation } from "./locations";
export { mockSchedule, type ScheduleItem } from "./schedule";
export { mockDailyTasks, type DailyTaskTemplate } from "./dailyTasks";
export { mockParentAccounts, type ParentAccount } from "./parents";
export {
  mockStaff,
  mockStaffBreakTemplates,
  type Staff,
  type StaffRole,
  type StaffBreak,
} from "./staff";
export {
  type AblaufMeal,
  type DailyTaskAssignment,
  type MealType,
} from "./ablauf";
export {
  prototypeHistorySeed,
  mealPlansByDate,
  kidDayDataByDate,
  presenceByDate,
  attendanceRecords as mockAttendance,
  dayLogEntries as mockDayLogEntries,
  ablaufMeals as mockAblaufMeals,
  taskAssignments as mockTaskAssignments,
  staffBreaks as mockStaffBreaks,
  type KidDayDataSeed,
  type MealPlanSeed,
  type LunchItemState,
} from "./historySeed";
