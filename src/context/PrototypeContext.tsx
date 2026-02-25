"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  mockAttendance,
  mockChildren,
  mockStaffBreaks,
  mockTaskAssignments,
} from "@/lib/mock";
import {
  PROTOTYPE_TODAY,
  getCalendarWindow,
  isFutureDate,
  isPastDate,
} from "@/lib/prototypeCalendar";

export type LunchItemState = "default" | "exclude" | "only";
export type DailyPresenceStatus =
  | "expected"
  | "present"
  | "absent_today"
  | "planned_absence";

const TODAY = PROTOTYPE_TODAY;

export interface KidDayData {
  znüni?: string;
  lunchPortions?: number; // 0, 1, 2, 3
  lunchItemStates?: LunchItemState[];
  schlaf?: string;
  activityMorning?: string;
  activityAfternoon?: string;
  zvieri?: string;
  infosForParents?: string;
}

export interface DailyTaskAssignmentState {
  taskId: string;
  taskName: string;
  staffId: string;
  staffName: string;
  done: boolean;
}

export interface DailyBreakState {
  staffId: string;
  startTime: string;
  endTime: string;
}

interface PrototypeState {
  plannedLunchItems: string[];
  plannedZnüni: string;
  plannedZvieri: string;
  kidDayData: Record<string, KidDayData>;
  dailyPresence: Record<string, DailyPresenceStatus>;
}

interface PrototypeContextValue extends PrototypeState {
  getPlannedZnüni: (date?: string) => string;
  getPlannedZvieri: (date?: string) => string;
  getPlannedLunchItems: (date?: string) => string[];
  setPlannedLunchItems: (items: string[]) => void;
  addLunchItem: (date?: string) => void;
  removeLunchItem: (index: number, date?: string) => void;
  updateLunchItem: (index: number, value: string, date?: string) => void;
  setPlannedZnüni: (v: string, date?: string) => void;
  setPlannedZvieri: (v: string, date?: string) => void;
  copyPlanToAllKids: (date?: string) => void;
  setKidData: (childId: string, data: Partial<KidDayData>, date?: string) => void;
  getKidData: (childId: string, date?: string) => KidDayData;
  cycleLunchPortions: (childId: string, date?: string) => number;
  cycleLunchItemState: (childId: string, itemIndex: number, date?: string) => LunchItemState;
  getDailyPresenceStatus: (childId: string, date?: string) => DailyPresenceStatus;
  setDailyPresenceStatus: (
    childId: string,
    status: DailyPresenceStatus,
    date?: string
  ) => void;
  isCountedForToday: (childId: string, date?: string) => boolean;
  getTaskAssignments: (date?: string) => DailyTaskAssignmentState[];
  getBreaks: (date?: string) => DailyBreakState[];
}

const defaultKidData = (): KidDayData => ({
  znüni: "",
  lunchPortions: 0,
  lunchItemStates: [],
  schlaf: "",
  activityMorning: "",
  activityAfternoon: "",
  zvieri: "",
  infosForParents: "",
});

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

const INITIAL_LUNCH = ["Spaghetti", "Sauce", "Salat", "Gemüse"];

function dateKey(date?: string) {
  return date ?? TODAY;
}

function isMorning(schedule?: string) {
  return schedule === "full" || schedule === "morning" || schedule === "morning_lunch";
}

function initialPresenceForDate(date: string): Record<string, DailyPresenceStatus> {
  const plannedAbsenceIds = new Set(
    mockAttendance
      .filter((a) => a.date === TODAY && a.status === "absent")
      .map((a) => a.childId)
  );
  return Object.fromEntries(
    mockChildren.map((child) => {
      if (plannedAbsenceIds.has(child.id)) return [child.id, "planned_absence"];
      if (isFutureDate(date)) return [child.id, "expected"];
      if (isPastDate(date)) return [child.id, "present"];
      return [child.id, isMorning(child.daySchedule) ? "present" : "expected"];
    })
  );
}

function initialLunchItemsForDate(date: string): string[] {
  return isFutureDate(date) ? [] : [...INITIAL_LUNCH];
}

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const dates = getCalendarWindow();
  const [plannedLunchItemsByDate, setPlannedLunchItemsByDate] = useState<Record<string, string[]>>(
    () => Object.fromEntries(dates.map((d) => [d, initialLunchItemsForDate(d)]))
  );
  const [plannedZnüniByDate, setPlannedZnüniByDate] = useState<Record<string, string>>(() =>
    Object.fromEntries(dates.map((d) => [d, isFutureDate(d) ? "" : "Obst, Brot"]))
  );
  const [plannedZvieriByDate, setPlannedZvieriByDate] = useState<Record<string, string>>(() =>
    Object.fromEntries(dates.map((d) => [d, isFutureDate(d) ? "" : "Joghurt, Kekse"]))
  );
  const [kidDayDataByDate, setKidDayDataByDate] = useState<
    Record<string, Record<string, KidDayData>>
  >(() => Object.fromEntries(dates.map((d) => [d, {}])));
  const [dailyPresenceByDate, setDailyPresenceByDate] = useState<
    Record<string, Record<string, DailyPresenceStatus>>
  >(() => Object.fromEntries(dates.map((d) => [d, initialPresenceForDate(d)])));

  const plannedLunchItems = plannedLunchItemsByDate[TODAY] ?? INITIAL_LUNCH;
  const plannedZnüni = plannedZnüniByDate[TODAY] ?? "Obst, Brot";
  const plannedZvieri = plannedZvieriByDate[TODAY] ?? "Joghurt, Kekse";
  const kidDayData = kidDayDataByDate[TODAY] ?? {};
  const dailyPresence = dailyPresenceByDate[TODAY] ?? {};

  const getPlannedZnüni = useCallback(
    (date?: string) => plannedZnüniByDate[dateKey(date)] ?? "",
    [plannedZnüniByDate]
  );
  const getPlannedZvieri = useCallback(
    (date?: string) => plannedZvieriByDate[dateKey(date)] ?? "",
    [plannedZvieriByDate]
  );
  const getPlannedLunchItems = useCallback(
    (date?: string) => plannedLunchItemsByDate[dateKey(date)] ?? [],
    [plannedLunchItemsByDate]
  );

  const setPlannedLunchItems = useCallback((items: string[]) => {
    setPlannedLunchItemsByDate((prev) => ({ ...prev, [TODAY]: items }));
  }, []);

  const addLunchItem = useCallback((date?: string) => {
    const d = dateKey(date);
    setPlannedLunchItemsByDate((prev) => ({
      ...prev,
      [d]: [...(prev[d] ?? []), ""],
    }));
  }, []);

  const removeLunchItem = useCallback((index: number, date?: string) => {
    const d = dateKey(date);
    setPlannedLunchItemsByDate((prev) => ({
      ...prev,
      [d]: (prev[d] ?? []).filter((_, i) => i !== index),
    }));
  }, []);

  const updateLunchItem = useCallback((index: number, value: string, date?: string) => {
    const d = dateKey(date);
    setPlannedLunchItemsByDate((prev) => {
      const next = [...(prev[d] ?? [])];
      next[index] = value;
      return { ...prev, [d]: next };
    });
  }, []);

  const setPlannedZnüni = useCallback((v: string, date?: string) => {
    const d = dateKey(date);
    setPlannedZnüniByDate((prev) => ({ ...prev, [d]: v }));
  }, []);

  const setPlannedZvieri = useCallback((v: string, date?: string) => {
    const d = dateKey(date);
    setPlannedZvieriByDate((prev) => ({ ...prev, [d]: v }));
  }, []);

  const copyPlanToAllKids = useCallback((date?: string) => {
    const d = dateKey(date);
    setKidDayDataByDate((prevByDate) => {
      const prev = prevByDate[d] ?? {};
      const next = { ...prev };
      mockChildren.forEach((child) => {
        const current = next[child.id] ?? defaultKidData();
        next[child.id] = {
          ...current,
          znüni: (plannedZnüniByDate[d] ?? "") || current.znüni,
          lunchPortions: current.lunchPortions ?? 0,
          lunchItemStates: (plannedLunchItemsByDate[d] ?? []).map(
            () => "default" as LunchItemState
          ),
          zvieri: (plannedZvieriByDate[d] ?? "") || current.zvieri,
        };
      });
      return { ...prevByDate, [d]: next };
    });
  }, [plannedLunchItemsByDate, plannedZnüniByDate, plannedZvieriByDate]);

  const setKidData = useCallback((childId: string, data: Partial<KidDayData>, date?: string) => {
    const d = dateKey(date);
    setKidDayDataByDate((prevByDate) => {
      const prev = prevByDate[d] ?? {};
      return {
        ...prevByDate,
        [d]: {
          ...prev,
          [childId]: { ...defaultKidData(), ...prev[childId], ...data },
        },
      };
    });
  }, []);

  const getKidData = useCallback(
    (childId: string, date?: string): KidDayData => {
      const d = dateKey(date);
      const base = kidDayDataByDate[d]?.[childId] ?? defaultKidData();
      const lunchItems = plannedLunchItemsByDate[d] ?? [];
      const states = base.lunchItemStates ?? lunchItems.map(() => "default" as LunchItemState);
      return {
        ...base,
        lunchItemStates: lunchItems.map((_, i) => states[i] ?? "default"),
      };
    },
    [kidDayDataByDate, plannedLunchItemsByDate]
  );

  const cycleLunchPortions = useCallback((childId: string, date?: string): number => {
    const d = dateKey(date);
    let nextVal = 0;
    setKidDayDataByDate((prevByDate) => {
      const prev = prevByDate[d] ?? {};
      const current = prev[childId] ?? defaultKidData();
      const v = (current.lunchPortions ?? 0);
      nextVal = (v + 1) % 4;
      return {
        ...prevByDate,
        [d]: { ...prev, [childId]: { ...current, lunchPortions: nextVal } },
      };
    });
    return nextVal;
  }, []);

  const cycleLunchItemState = useCallback(
    (childId: string, itemIndex: number, date?: string): LunchItemState => {
      const d = dateKey(date);
      const order: LunchItemState[] = ["default", "exclude", "only"];
      let nextVal: LunchItemState = "default";
      setKidDayDataByDate((prevByDate) => {
        const prev = prevByDate[d] ?? {};
        const lunchItems = plannedLunchItemsByDate[d] ?? [];
        const current = prev[childId] ?? defaultKidData();
        const states = [...(current.lunchItemStates ?? lunchItems.map(() => "default"))];
        const idx = order.indexOf(states[itemIndex] ?? "default");
        nextVal = order[(idx + 1) % 3];
        if (nextVal === "only") {
          // "Only" means this is the single eaten item.
          for (let i = 0; i < lunchItems.length; i += 1) {
            states[i] = i === itemIndex ? "only" : "exclude";
          }
        } else if ((states[itemIndex] ?? "default") === "only" && nextVal === "default") {
          // Leaving "only" resets all item filters.
          for (let i = 0; i < lunchItems.length; i += 1) {
            states[i] = "default";
          }
        } else {
          states[itemIndex] = nextVal;
        }
        return {
          ...prevByDate,
          [d]: { ...prev, [childId]: { ...current, lunchItemStates: states } },
        };
      });
      return nextVal;
    },
    [plannedLunchItemsByDate]
  );

  const getDailyPresenceStatus = useCallback(
    (childId: string, date?: string): DailyPresenceStatus =>
      (dailyPresenceByDate[dateKey(date)] ?? {})[childId] ?? "expected",
    [dailyPresenceByDate]
  );

  const setDailyPresenceStatus = useCallback(
    (childId: string, status: DailyPresenceStatus, date?: string) => {
      const d = dateKey(date);
      setDailyPresenceByDate((prevByDate) => ({
        ...prevByDate,
        [d]: { ...(prevByDate[d] ?? {}), [childId]: status },
      }));
    },
    []
  );

  const isCountedForToday = useCallback(
    (childId: string, date?: string) => {
      const status = (dailyPresenceByDate[dateKey(date)] ?? {})[childId] ?? "expected";
      return status === "expected" || status === "present";
    },
    [dailyPresenceByDate]
  );

  const getTaskAssignments = useCallback((date?: string): DailyTaskAssignmentState[] => {
    const d = dateKey(date);
    if (isFutureDate(d)) return [];
    const source = mockTaskAssignments.filter((t) => t.date === TODAY);
    return source.map((t) => ({
      taskId: t.taskId,
      taskName: t.taskName,
      staffId: t.staffId,
      staffName: t.staffName,
      done: isPastDate(d) ? true : t.done,
    }));
  }, []);

  const getBreaks = useCallback((date?: string): DailyBreakState[] => {
    const d = dateKey(date);
    if (isFutureDate(d)) return [];
    return mockStaffBreaks
      .filter((b) => b.date === TODAY)
      .map((b) => ({ staffId: b.staffId, startTime: b.startTime, endTime: b.endTime }));
  }, []);

  const value: PrototypeContextValue = {
    plannedLunchItems,
    plannedZnüni,
    plannedZvieri,
    kidDayData,
    dailyPresence,
    getPlannedZnüni,
    getPlannedZvieri,
    getPlannedLunchItems,
    setPlannedLunchItems,
    addLunchItem,
    removeLunchItem,
    updateLunchItem,
    setPlannedZnüni,
    setPlannedZvieri,
    copyPlanToAllKids,
    setKidData,
    getKidData,
    cycleLunchPortions,
    cycleLunchItemState,
    getDailyPresenceStatus,
    setDailyPresenceStatus,
    isCountedForToday,
    getTaskAssignments,
    getBreaks,
  };

  return (
    <PrototypeContext.Provider value={value}>
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototype() {
  const ctx = useContext(PrototypeContext);
  if (!ctx) throw new Error("usePrototype must be used within PrototypeProvider");
  return ctx;
}
