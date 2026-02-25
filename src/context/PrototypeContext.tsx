"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { mockChildren } from "@/lib/mock";

export type LunchItemState = "default" | "exclude" | "only";

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

interface PrototypeState {
  plannedLunchItems: string[];
  plannedZnüni: string;
  plannedZvieri: string;
  kidDayData: Record<string, KidDayData>;
}

interface PrototypeContextValue extends PrototypeState {
  setPlannedLunchItems: (items: string[]) => void;
  addLunchItem: () => void;
  removeLunchItem: (index: number) => void;
  updateLunchItem: (index: number, value: string) => void;
  setPlannedZnüni: (v: string) => void;
  setPlannedZvieri: (v: string) => void;
  copyPlanToAllKids: () => void;
  setKidData: (childId: string, data: Partial<KidDayData>) => void;
  getKidData: (childId: string) => KidDayData;
  cycleLunchPortions: (childId: string) => number;
  cycleLunchItemState: (childId: string, itemIndex: number) => LunchItemState;
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

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [plannedLunchItems, setPlannedLunchItemsState] = useState<string[]>(INITIAL_LUNCH);
  const [plannedZnüni, setPlannedZnüni] = useState("Obst, Brot");
  const [plannedZvieri, setPlannedZvieri] = useState("Joghurt, Kekse");
  const [kidDayData, setKidDayData] = useState<Record<string, KidDayData>>({});

  const setPlannedLunchItems = useCallback((items: string[]) => {
    setPlannedLunchItemsState(items);
  }, []);

  const addLunchItem = useCallback(() => {
    setPlannedLunchItemsState((prev) => [...prev, ""]);
  }, []);

  const removeLunchItem = useCallback((index: number) => {
    setPlannedLunchItemsState((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateLunchItem = useCallback((index: number, value: string) => {
    setPlannedLunchItemsState((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const copyPlanToAllKids = useCallback(() => {
    setKidDayData((prev) => {
      const next = { ...prev };
      mockChildren.forEach((child) => {
        const current = next[child.id] ?? defaultKidData();
        next[child.id] = {
          ...current,
          znüni: plannedZnüni || current.znüni,
          lunchPortions: current.lunchPortions ?? 0,
          lunchItemStates: plannedLunchItems.map(() => "default" as LunchItemState),
          zvieri: plannedZvieri || current.zvieri,
        };
      });
      return next;
    });
  }, [plannedZnüni, plannedZvieri, plannedLunchItems]);

  const setKidData = useCallback((childId: string, data: Partial<KidDayData>) => {
    setKidDayData((prev) => ({
      ...prev,
      [childId]: { ...defaultKidData(), ...prev[childId], ...data },
    }));
  }, []);

  const getKidData = useCallback(
    (childId: string): KidDayData => {
      const base = kidDayData[childId] ?? defaultKidData();
      const states = base.lunchItemStates ?? plannedLunchItems.map(() => "default" as LunchItemState);
      return {
        ...base,
        lunchItemStates: plannedLunchItems.map((_, i) => states[i] ?? "default"),
      };
    },
    [kidDayData, plannedLunchItems]
  );

  const cycleLunchPortions = useCallback((childId: string): number => {
    let nextVal = 0;
    setKidDayData((prev) => {
      const current = prev[childId] ?? defaultKidData();
      const v = (current.lunchPortions ?? 0);
      nextVal = (v + 1) % 4;
      return {
        ...prev,
        [childId]: { ...current, lunchPortions: nextVal },
      };
    });
    return nextVal;
  }, []);

  const cycleLunchItemState = useCallback(
    (childId: string, itemIndex: number): LunchItemState => {
      const order: LunchItemState[] = ["default", "exclude", "only"];
      let nextVal: LunchItemState = "default";
      setKidDayData((prev) => {
        const current = prev[childId] ?? defaultKidData();
        const states = [...(current.lunchItemStates ?? plannedLunchItems.map(() => "default"))];
        const idx = order.indexOf(states[itemIndex] ?? "default");
        nextVal = order[(idx + 1) % 3];
        states[itemIndex] = nextVal;
        return {
          ...prev,
          [childId]: { ...current, lunchItemStates: states },
        };
      });
      return nextVal;
    },
    [plannedLunchItems]
  );

  const value: PrototypeContextValue = {
    plannedLunchItems,
    plannedZnüni,
    plannedZvieri,
    kidDayData,
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
