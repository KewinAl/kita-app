/**
 * Mock “backend” seed shaped like Prisma AttendanceRecord / DayLogEntry / meal plans.
 *
 * - Keeps July history (20.–31.7.2026 Mon–Fri)
 * - Fills opening through today (3.8.–14.8.2026 Mon–Fri) with sleep / activities / food / Ablauf
 * - Days after the seeded fill end (14.8.) stay empty until entered in the UI
 * - Live “Heute” is the real local date (next Monday on weekends)
 */

import { mockChildren, type Child } from "./children";
import { mockDailyTasks } from "./dailyTasks";
import { mockStaff, mockStaffBreakTemplates, type StaffBreak } from "./staff";
import type { AblaufMeal, DailyTaskAssignment } from "./ablauf";
import type { AttendanceRecord } from "./attendance";
import type {
  ActivityData,
  DayLogEntry,
  MealData,
  NapData,
} from "./dayLogEntries";
import {
  OPENING_DAY,
  PROTOTYPE_TODAY,
  getFilledWeekdays,
  getSeededDateKeys,
} from "@/lib/prototypeCalendar";

export type LunchItemState = "default" | "exclude" | "only";

export interface KidDayDataSeed {
  znüni?: string;
  lunchPortions?: number;
  lunchItemStates?: LunchItemState[];
  schlaf?: string;
  activityMorning?: string;
  activityAfternoon?: string;
  zvieri?: string;
  infosForParents?: string;
}

export interface MealPlanSeed {
  znüni: string;
  lunchItems: string[];
  lunchDescription: string;
  zvieri: string;
}

const FILLED_DAYS = getFilledWeekdays();

const LUNCH_MENUS: { items: string[]; description: string; znüni: string; zvieri: string }[] = [
  {
    items: ["Spaghetti", "Tomatensauce", "Salat", "Gemüse"],
    description: "Spaghetti mit Tomatensauce, Salat und Gemüse",
    znüni: "Obstteller, Vollkornbrot",
    zvieri: "Naturjoghurt, Apfelstücke",
  },
  {
    items: ["Reis", "Poulet", "Karotten", "Sauce"],
    description: "Poulet mit Reis, Karotten und leichter Sauce",
    znüni: "Birne, Reiswaffeln",
    zvieri: "Hüttenkäse, Trauben",
  },
  {
    items: ["Kartoffelstock", "Gemüse", "Fischstäbchen"],
    description: "Kartoffelstock mit Gemüse und Fischstäbchen",
    znüni: "Banane, Knäckebrot",
    zvieri: "Milch, Butterkeks",
  },
  {
    items: ["Lasagne", "Salat", "Brot"],
    description: "Gemüselasagne mit Salat und Brot",
    znüni: "Beerenmix, Zwieback",
    zvieri: "Fruchtquark, Kekse",
  },
  {
    items: ["Risotto", "Zucchini", "Parmesan"],
    description: "Gemüserisotto mit Zucchini",
    znüni: "Apfel, Brot mit Butter",
    zvieri: "Joghurt, Banane",
  },
];

const MORNING_ACTIVITIES = [
  "Freispiel im Gruppenraum",
  "Kreisgespräch und Lieder",
  "Basteln mit Papier",
  "Bewegungsspiele im Garten",
  "Bilderbuch vorlesen",
  "Malen an der Staffelei",
];

const AFTERNOON_ACTIVITIES = [
  "Bauen mit Holzblöcken",
  "Spaziergang im Quartier",
  "Musik und Tanz",
  "Rollenspiel in der Puppenecke",
  "Sandspielplatz",
  "Ruheecke mit Büchern",
];

const SLEEP_NOTES = [
  "Guter Mittagsschlaf, ca. 12:30–14:00",
  "Kurzer Schlaf, etwas unruhig",
  "Durchgeschlafen bis 14:15",
  "Einschlafen verzögert, danach ruhig",
  "Kein richtiger Schlaf — nur Ruhephase",
];

const MEAL_OPTIONS: MealData["option"][] = ["ate_well", "ate_some", "ate_little", "didnt_eat"];
const NAP_QUALITY: NapData["quality"][] = ["good", "restless", "short"];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(list: T[], seed: string): T {
  return list[hashString(seed) % list.length]!;
}

function menuForDate(date: string) {
  const idx = FILLED_DAYS.indexOf(date);
  if (idx >= 0) return LUNCH_MENUS[idx % LUNCH_MENUS.length]!;
  return LUNCH_MENUS[0]!;
}

function checkInTimeFor(child: Child, date: string): string {
  const base = 7 * 60 + 30 + (hashString(`${child.id}-${date}`) % 60);
  const h = Math.floor(base / 60);
  const m = base % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function buildMealPlans(): Record<string, MealPlanSeed> {
  const plans: Record<string, MealPlanSeed> = {};
  for (const date of FILLED_DAYS) {
    const menu = menuForDate(date);
    plans[date] = {
      znüni: menu.znüni,
      lunchItems: [...menu.items],
      lunchDescription: menu.description,
      zvieri: menu.zvieri,
    };
  }
  return plans;
}

function buildAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  let n = 0;
  for (const date of FILLED_DAYS) {
    for (const child of mockChildren) {
      n += 1;
      const absent = hashString(`abs-${child.id}-${date}`) % 12 === 0;
      if (absent) {
        records.push({
          id: `att-${n}`,
          childId: child.id,
          date,
          status: "absent",
        });
      } else {
        records.push({
          id: `att-${n}`,
          childId: child.id,
          date,
          status: "present",
          checkInTime: checkInTimeFor(child, date),
        });
      }
    }
  }
  return records;
}

function buildKidDayData(
  attendance: AttendanceRecord[],
  mealPlans: Record<string, MealPlanSeed>
): Record<string, Record<string, KidDayDataSeed>> {
  const byDate: Record<string, Record<string, KidDayDataSeed>> = {};
  const present = new Set(
    attendance.filter((a) => a.status === "present").map((a) => `${a.date}:${a.childId}`)
  );

  for (const date of FILLED_DAYS) {
    const plan = mealPlans[date]!;
    const dayMap: Record<string, KidDayDataSeed> = {};
    for (const child of mockChildren) {
      if (!present.has(`${date}:${child.id}`)) continue;
      const seed = `${child.id}-${date}`;
      const portions = 1 + (hashString(`p-${seed}`) % 3);
      dayMap[child.id] = {
        znüni: plan.znüni,
        lunchPortions: portions,
        lunchItemStates: plan.lunchItems.map(() => "default" as LunchItemState),
        schlaf: pick(SLEEP_NOTES, `sleep-${seed}`),
        activityMorning: pick(MORNING_ACTIVITIES, `am-${seed}`),
        activityAfternoon: pick(AFTERNOON_ACTIVITIES, `pm-${seed}`),
        zvieri: plan.zvieri,
        infosForParents:
          hashString(`info-${seed}`) % 5 === 0 ? "Bitte Extra-Wechselkleider mitbringen." : "",
      };
    }
    byDate[date] = dayMap;
  }
  return byDate;
}

function buildDayLogEntries(
  attendance: AttendanceRecord[],
  kidDayData: Record<string, Record<string, KidDayDataSeed>>
): DayLogEntry[] {
  const entries: DayLogEntry[] = [];
  let n = 0;
  for (const date of FILLED_DAYS) {
    const presentIds = new Set(
      attendance.filter((a) => a.date === date && a.status === "present").map((a) => a.childId)
    );
    for (const child of mockChildren) {
      if (!presentIds.has(child.id)) continue;
      const data = kidDayData[date]?.[child.id];
      if (!data) continue;
      const seed = `${child.id}-${date}`;

      n += 1;
      entries.push({
        id: `log-${n}`,
        childId: child.id,
        date,
        type: "meal",
        data: {
          mealType: "breakfast",
          option: pick(MEAL_OPTIONS, `bf-${seed}`),
        } satisfies MealData,
        createdAt: "09:00",
      });

      n += 1;
      entries.push({
        id: `log-${n}`,
        childId: child.id,
        date,
        type: "meal",
        data: {
          mealType: "lunch",
          option: pick(MEAL_OPTIONS, `lu-${seed}`),
        } satisfies MealData,
        createdAt: "12:20",
      });

      n += 1;
      const napStart = 12 + (hashString(`nap-${seed}`) % 2);
      entries.push({
        id: `log-${n}`,
        childId: child.id,
        date,
        type: "nap",
        data: {
          startTime: `${napStart}:30`,
          endTime: `${napStart + 1}:45`,
          quality: pick(NAP_QUALITY, `nq-${seed}`),
        } satisfies NapData,
        createdAt: `${napStart + 1}:45`,
      });

      n += 1;
      entries.push({
        id: `log-${n}`,
        childId: child.id,
        date,
        type: "activity",
        data: {
          category: data.activityMorning ?? "Freispiel",
          note: data.activityAfternoon,
        } satisfies ActivityData,
        createdAt: "10:30",
      });

      n += 1;
      entries.push({
        id: `log-${n}`,
        childId: child.id,
        date,
        type: "meal",
        data: {
          mealType: "snack",
          option: pick(MEAL_OPTIONS, `sn-${seed}`),
        } satisfies MealData,
        createdAt: "15:30",
      });
    }
  }
  return entries;
}

function buildAblaufMeals(mealPlans: Record<string, MealPlanSeed>): AblaufMeal[] {
  const meals: AblaufMeal[] = [];
  let n = 0;
  for (const date of FILLED_DAYS) {
    const plan = mealPlans[date];
    if (!plan || (!plan.znüni && plan.lunchItems.length === 0 && !plan.zvieri)) continue;
    n += 1;
    meals.push({ id: `meal-${n}`, date, mealType: "znueni", description: plan.znüni });
    n += 1;
    meals.push({
      id: `meal-${n}`,
      date,
      mealType: "lunch",
      description: plan.lunchDescription || plan.lunchItems.join(", "),
    });
    n += 1;
    meals.push({ id: `meal-${n}`, date, mealType: "zvieri", description: plan.zvieri });
  }
  return meals;
}

function taskStaffRotation(date: string, taskIndex: number) {
  const groupStaff = [
    mockStaff.filter((s) => s.primaryGroupId === "g1"),
    mockStaff.filter((s) => s.primaryGroupId === "g2"),
    mockStaff.filter((s) => s.primaryGroupId === "g3"),
    mockStaff.filter((s) => !s.primaryGroupId),
  ];
  const pool = groupStaff[taskIndex % groupStaff.length]!;
  const staff = pool[hashString(`${date}-t${taskIndex}`) % pool.length]!;
  return staff;
}

function buildTaskAssignments(): DailyTaskAssignment[] {
  const assignments: DailyTaskAssignment[] = [];
  for (const date of FILLED_DAYS) {
    mockDailyTasks.forEach((task, index) => {
      const staff = taskStaffRotation(date, index);
      assignments.push({
        taskId: task.id,
        taskName: task.name,
        staffId: staff.id,
        staffName: staff.name,
        date,
        done: true,
      });
    });
  }
  return assignments;
}

function buildStaffBreaks(): StaffBreak[] {
  const breaks: StaffBreak[] = [];
  for (const date of FILLED_DAYS) {
    for (const tmpl of mockStaffBreakTemplates) {
      breaks.push({ ...tmpl, date });
    }
  }
  return breaks;
}

function buildPresenceByDate(
  attendance: AttendanceRecord[]
): Record<string, Record<string, "expected" | "present" | "absent_today" | "planned_absence">> {
  const byDate: Record<
    string,
    Record<string, "expected" | "present" | "absent_today" | "planned_absence">
  > = {};
  const filled = new Set(FILLED_DAYS);

  for (const date of getSeededDateKeys()) {
    byDate[date] = {};
    for (const child of mockChildren) {
      if (!filled.has(date) || date > PROTOTYPE_TODAY) {
        byDate[date][child.id] = "expected";
        continue;
      }
      const rec = attendance.find((a) => a.date === date && a.childId === child.id);
      if (rec?.status === "absent") {
        byDate[date][child.id] = "planned_absence";
      } else {
        byDate[date][child.id] = "present";
      }
    }
  }
  return byDate;
}

const mealPlansByDate = buildMealPlans();
const attendanceRecords = buildAttendance();
const kidDayDataByDate = buildKidDayData(attendanceRecords, mealPlansByDate);
const dayLogEntries = buildDayLogEntries(attendanceRecords, kidDayDataByDate);
const ablaufMeals = buildAblaufMeals(mealPlansByDate);
const taskAssignments = buildTaskAssignments();
const staffBreaks = buildStaffBreaks();
const presenceByDate = buildPresenceByDate(attendanceRecords);

export const prototypeHistorySeed = {
  openingDay: OPENING_DAY,
  today: PROTOTYPE_TODAY,
  filledDays: FILLED_DAYS,
  mealPlansByDate,
  kidDayDataByDate,
  attendanceRecords,
  dayLogEntries,
  ablaufMeals,
  taskAssignments,
  staffBreaks,
  presenceByDate,
};

export {
  mealPlansByDate,
  kidDayDataByDate,
  attendanceRecords,
  dayLogEntries,
  ablaufMeals,
  taskAssignments,
  staffBreaks,
  presenceByDate,
};
