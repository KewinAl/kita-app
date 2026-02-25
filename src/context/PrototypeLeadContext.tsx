"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { mockChildren, mockGroups, mockStaff } from "@/lib/mock";
import { Child } from "@/lib/mock/children";
import { DEFAULT_SPOTS_PER_STAFF } from "@/lib/staffingRules";
import { getCalendarWindow } from "@/lib/prototypeCalendar";

export type ShiftBlock = "morning" | "midday" | "afternoon";
const SHIFT_BLOCKS: ShiftBlock[] = ["morning", "midday", "afternoon"];
export type LeadShiftCode = "1" | "2" | "3" | "4" | "5" | "6" | "SCHULE" | "FREI";
export type ShiftDisplayFormat = "number" | "prefixed" | "letter";

type GroupAssignments = Record<string, string[]>;
type DateShiftAssignments = Record<ShiftBlock, GroupAssignments>;

export type AppointmentStatus = "planned" | "completed" | "cancelled";
export type AppointmentType =
  | "elterngespraech"
  | "aufnahme"
  | "follow_up"
  | "beobachtung";

export interface LeadAppointment {
  id: string;
  date: string;
  time: string;
  type: AppointmentType;
  title: string;
  groupId?: string;
  childId?: string;
  staffId?: string;
  status: AppointmentStatus;
  notesDocumentId?: string;
}

export type LeadDocumentCategory =
  | "kita_allgemein"
  | "eltern"
  | "termin_notiz"
  | "vertragliches";

export interface LeadDocument {
  id: string;
  title: string;
  category: LeadDocumentCategory;
  createdAt: string;
  linkedAppointmentId?: string;
  linkedChildId?: string;
  notes?: string;
}

interface StaffingRuleSwitches {
  enforceEfzRequirement: boolean;
  requireAdditionalStaffOverRatio: boolean;
}

interface FeatureFlags {
  shiftPlanner: boolean;
  appointments: boolean;
  documents: boolean;
  kidsManagement: boolean;
  parentPortal: boolean;
}

interface PrototypeLeadContextValue {
  children: Child[];
  archivedChildren: Child[];
  addChild: (input: Omit<Child, "id">) => void;
  updateChild: (childId: string, data: Partial<Omit<Child, "id">>) => void;
  setChildArchived: (childId: string, archived: boolean) => void;
  spotsPerStaff: number;
  setSpotsPerStaff: (value: number) => void;
  staffingRuleSwitches: StaffingRuleSwitches;
  setStaffingRuleSwitch: (
    key: keyof StaffingRuleSwitches,
    value: boolean
  ) => void;
  calendarWindowDays: number;
  setCalendarWindowDays: (value: number) => void;
  featureFlags: FeatureFlags;
  setFeatureFlag: (key: keyof FeatureFlags, value: boolean) => void;
  shiftDisplayFormat: ShiftDisplayFormat;
  setShiftDisplayFormat: (value: ShiftDisplayFormat) => void;
  getShiftOverride: (date: string, staffId: string) => LeadShiftCode | undefined;
  setShiftOverride: (date: string, staffId: string, code?: LeadShiftCode) => void;
  getAssignedStaffIds: (date: string, block: ShiftBlock, groupId: string) => string[];
  toggleShiftAssignment: (
    date: string,
    block: ShiftBlock,
    groupId: string,
    staffId: string
  ) => void;
  appointments: LeadAppointment[];
  addAppointment: (input: Omit<LeadAppointment, "id">) => void;
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  linkDocumentToAppointment: (appointmentId: string, documentId?: string) => void;
  documents: LeadDocument[];
  addDocument: (input: Omit<LeadDocument, "id" | "createdAt">) => void;
}

const PrototypeLeadContext = createContext<PrototypeLeadContextValue | null>(null);

function defaultAssignmentsByDate() {
  const dates = getCalendarWindow();
  const initialGroupAssignments: GroupAssignments = Object.fromEntries(
    mockGroups.map((group) => [
      group.id,
      mockStaff
        .filter((staff) => staff.primaryGroupId === group.id)
        .map((staff) => staff.id),
    ])
  );
  const dateTemplate: DateShiftAssignments = {
    morning: JSON.parse(JSON.stringify(initialGroupAssignments)),
    midday: JSON.parse(JSON.stringify(initialGroupAssignments)),
    afternoon: JSON.parse(JSON.stringify(initialGroupAssignments)),
  };
  return Object.fromEntries(
    dates.map((d) => [d, JSON.parse(JSON.stringify(dateTemplate)) as DateShiftAssignments])
  ) as Record<string, DateShiftAssignments>;
}

const INITIAL_APPOINTMENTS: LeadAppointment[] = [
  {
    id: "appt-1",
    date: "2025-02-19",
    time: "16:00",
    type: "elterngespraech",
    title: "Standortgespräch Emma",
    groupId: "g1",
    childId: "c5",
    staffId: "s1",
    status: "planned",
  },
];

const INITIAL_DOCUMENTS: LeadDocument[] = [
  {
    id: "doc-1",
    title: "Hausordnung 2025",
    category: "kita_allgemein",
    createdAt: "2025-02-10",
    notes: "Aktuelle Version für Team und Eltern.",
  },
];

const INITIAL_STAFFING_SWITCHES: StaffingRuleSwitches = {
  enforceEfzRequirement: true,
  requireAdditionalStaffOverRatio: true,
};

const INITIAL_FEATURE_FLAGS: FeatureFlags = {
  shiftPlanner: true,
  appointments: true,
  documents: true,
  kidsManagement: true,
  parentPortal: false,
};

export function PrototypeLeadProvider({ children }: { children: React.ReactNode }) {
  const [allChildren, setAllChildren] = useState<Child[]>(mockChildren);
  const [archivedChildIds, setArchivedChildIds] = useState<string[]>([]);
  const [spotsPerStaff, setSpotsPerStaffState] = useState<number>(DEFAULT_SPOTS_PER_STAFF);
  const [staffingRuleSwitches, setStaffingRuleSwitches] = useState<StaffingRuleSwitches>(
    INITIAL_STAFFING_SWITCHES
  );
  const [calendarWindowDays, setCalendarWindowDaysState] = useState<number>(14);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(INITIAL_FEATURE_FLAGS);
  const [shiftDisplayFormat, setShiftDisplayFormat] =
    useState<ShiftDisplayFormat>("number");
  const [shiftOverridesByDate, setShiftOverridesByDate] = useState<
    Record<string, Record<string, LeadShiftCode>>
  >({});
  const [assignmentsByDate, setAssignmentsByDate] = useState<
    Record<string, DateShiftAssignments>
  >(() => defaultAssignmentsByDate());
  const [appointments, setAppointments] =
    useState<LeadAppointment[]>(INITIAL_APPOINTMENTS);
  const [documents, setDocuments] = useState<LeadDocument[]>(INITIAL_DOCUMENTS);

  const setSpotsPerStaff = (value: number) => {
    const normalized = Number.isFinite(value) ? Math.max(1, Math.round(value)) : 1;
    setSpotsPerStaffState(normalized);
  };

  const setStaffingRuleSwitch = (key: keyof StaffingRuleSwitches, value: boolean) => {
    setStaffingRuleSwitches((prev) => ({ ...prev, [key]: value }));
  };

  const setCalendarWindowDays = (value: number) => {
    const normalized = Number.isFinite(value) ? Math.max(1, Math.round(value)) : 1;
    setCalendarWindowDaysState(normalized);
  };

  const setFeatureFlag = (key: keyof FeatureFlags, value: boolean) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: value }));
  };

  const getShiftOverride = (date: string, staffId: string) =>
    shiftOverridesByDate[date]?.[staffId];

  const setShiftOverride = (date: string, staffId: string, code?: LeadShiftCode) => {
    setShiftOverridesByDate((prev) => {
      const currentDate = { ...(prev[date] ?? {}) };
      if (!code) {
        delete currentDate[staffId];
      } else {
        currentDate[staffId] = code;
      }
      if (Object.keys(currentDate).length === 0) {
        const next = { ...prev };
        delete next[date];
        return next;
      }
      return { ...prev, [date]: currentDate };
    });
  };

  const addChild = (input: Omit<Child, "id">) => {
    setAllChildren((prev) => [...prev, { id: crypto.randomUUID(), ...input }]);
  };

  const updateChild = (childId: string, data: Partial<Omit<Child, "id">>) => {
    setAllChildren((prev) =>
      prev.map((child) => (child.id === childId ? { ...child, ...data } : child))
    );
  };

  const setChildArchived = (childId: string, archived: boolean) => {
    setArchivedChildIds((prev) => {
      const hasId = prev.includes(childId);
      if (archived && !hasId) return [...prev, childId];
      if (!archived && hasId) return prev.filter((id) => id !== childId);
      return prev;
    });
  };

  const getAssignedStaffIds = (date: string, block: ShiftBlock, groupId: string) =>
    assignmentsByDate[date]?.[block]?.[groupId] ?? [];

  const toggleShiftAssignment = (
    date: string,
    block: ShiftBlock,
    groupId: string,
    staffId: string
  ) => {
    setAssignmentsByDate((prev) => {
      const dateEntry = prev[date] ?? defaultAssignmentsByDate()[date];
      const nextBlock = { ...(dateEntry?.[block] ?? {}) };
      const current = new Set(nextBlock[groupId] ?? []);
      const isAlreadyAssigned = current.has(staffId);

      mockGroups.forEach((group) => {
        nextBlock[group.id] = (nextBlock[group.id] ?? []).filter((id) => id !== staffId);
      });

      if (!isAlreadyAssigned) {
        nextBlock[groupId] = [...(nextBlock[groupId] ?? []), staffId];
      }

      return {
        ...prev,
        [date]: {
          ...(dateEntry ?? ({} as DateShiftAssignments)),
          [block]: nextBlock,
        },
      };
    });
  };

  const addAppointment = (input: Omit<LeadAppointment, "id">) => {
    setAppointments((prev) => [{ ...input, id: crypto.randomUUID() }, ...prev]);
  };

  const setAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );
  };

  const linkDocumentToAppointment = (appointmentId: string, documentId?: string) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, notesDocumentId: documentId || undefined }
          : appointment
      )
    );
  };

  const addDocument = (input: Omit<LeadDocument, "id" | "createdAt">) => {
    setDocuments((prev) => [
      {
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const value = useMemo(
    () => ({
      children: allChildren.filter((child) => !archivedChildIds.includes(child.id)),
      archivedChildren: allChildren.filter((child) => archivedChildIds.includes(child.id)),
      addChild,
      updateChild,
      setChildArchived,
      spotsPerStaff,
      setSpotsPerStaff,
      staffingRuleSwitches,
      setStaffingRuleSwitch,
      calendarWindowDays,
      setCalendarWindowDays,
      featureFlags,
      setFeatureFlag,
      shiftDisplayFormat,
      setShiftDisplayFormat,
      getShiftOverride,
      setShiftOverride,
      getAssignedStaffIds,
      toggleShiftAssignment,
      appointments,
      addAppointment,
      setAppointmentStatus,
      linkDocumentToAppointment,
      documents,
      addDocument,
    }),
    [
      allChildren,
      archivedChildIds,
      appointments,
      assignmentsByDate,
      calendarWindowDays,
      documents,
      featureFlags,
      shiftDisplayFormat,
      shiftOverridesByDate,
      spotsPerStaff,
      staffingRuleSwitches,
    ]
  );

  return (
    <PrototypeLeadContext.Provider value={value}>
      {children}
    </PrototypeLeadContext.Provider>
  );
}

export function usePrototypeLead() {
  const ctx = useContext(PrototypeLeadContext);
  if (!ctx) {
    throw new Error("usePrototypeLead must be used within PrototypeLeadProvider");
  }
  return ctx;
}

export { SHIFT_BLOCKS };
