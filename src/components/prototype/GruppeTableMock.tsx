"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GroupSwitcherMock } from "./GroupSwitcherMock";
import { DaySwitcherMock } from "./DaySwitcherMock";
import { usePrototype } from "@/context/PrototypeContext";
import {
  mockDailyTasks,
  mockChildren,
  mockGroups,
  mockStaff,
} from "@/lib/mock";
import { cn } from "@/lib/utils";
import {
  PROTOTYPE_TODAY,
  clampToCalendarWindow,
  formatDateShort,
  isPastDate,
  isFutureDate,
} from "@/lib/prototypeCalendar";

const TODAY = PROTOTYPE_TODAY;

function spotsForChild(dateOfBirth: string, refDate: string): number {
  const birth = new Date(dateOfBirth);
  const ref = new Date(refDate);
  const months = (ref.getFullYear() - birth.getFullYear()) * 12 + (ref.getMonth() - birth.getMonth());
  return months <= 18 ? 1.5 : 1;
}

function isMorning(schedule?: string) {
  return schedule === "full" || schedule === "morning" || schedule === "morning_lunch";
}
function isLunch(schedule?: string) {
  return schedule === "full" || schedule === "morning_lunch" || schedule === "lunch_afternoon";
}
function isAfternoon(schedule?: string) {
  return schedule === "full" || schedule === "afternoon" || schedule === "lunch_afternoon";
}

const PORTION_LABELS = ["0", "1", "2", "3"];
const ITEM_STATE_LABELS = { default: "✓", exclude: "✗", only: "○" };
const SHARED_TASK_NAMES = new Set(["zvieri vorbereiten", "zvieri küche"]);

function isSharedTask(taskName: string) {
  return SHARED_TASK_NAMES.has(taskName.trim().toLowerCase());
}

export function GruppeTableMock() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group") ?? mockGroups[0]?.id ?? "g1";
  const selectedDate = clampToCalendarWindow(searchParams.get("date") ?? TODAY);
  const {
    plannedLunchItems,
    getKidData,
    setKidData,
    cycleLunchPortions,
    cycleLunchItemState,
    getDailyPresenceStatus,
    isCountedForToday,
    getTaskAssignments,
    getBreaks,
  } = usePrototype();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [taskDoneOverrides, setTaskDoneOverrides] = useState<Record<string, boolean>>({});

  const isAllGroups = groupId === "all";
  const group = mockGroups.find((g) => g.id === groupId);
  const children = isAllGroups
    ? mockChildren
    : mockChildren.filter((c) => c.groupId === groupId);
  const countedChildren = children.filter((c) => isCountedForToday(c.id, selectedDate));
  const visibleChildren = children.filter(
    (c) => getDailyPresenceStatus(c.id, selectedDate) !== "planned_absence"
  );
  const hasSingleGroupSelected = !isAllGroups;
  const groupStaff = mockStaff.filter((s) => s.primaryGroupId === groupId);
  const groupStaffIdSet = new Set(groupStaff.map((s) => s.id));
  const dailyTaskAssignments = getTaskAssignments(selectedDate);
  const dailyBreaks = getBreaks(selectedDate);
  const taskDoneById = Object.fromEntries(
    dailyTaskAssignments.map((t) => [t.taskId, t.done])
  ) as Record<string, boolean>;
  const groupLeads = groupStaff.filter((s) => s.role === "GL");
  const groupLearners = groupStaff.filter((s) => s.role === "Lernende");
  const supportStaff = mockStaff.filter(
    (s) => s.role === "KL" || s.role === "Miterzieher"
  );
  const pickName = (staffList: typeof mockStaff, fallback = "Nicht zugeteilt") =>
    staffList[0]?.name ?? fallback;
  const groupTaskStaffById: Record<string, string> = {
    t1: pickName(groupLeads),
    t2: pickName(groupLearners, pickName(groupLeads)),
    t3: pickName([supportStaff.find((s) => s.role === "Miterzieher")].filter(Boolean) as typeof mockStaff, pickName(groupLeads)),
    t4: pickName(groupLeads),
    t5: pickName(groupLearners, pickName(groupLeads)),
    t6: pickName(groupLearners, pickName(groupLeads)),
    t7: pickName(groupLeads),
    t8: pickName([supportStaff.find((s) => s.role === "KL")].filter(Boolean) as typeof mockStaff, pickName(groupLeads)),
  };
  const groupBreaks = groupStaff
    .map((staff) => {
      const b = dailyBreaks.find((entry) => entry.staffId === staff.id);
      return {
        staffName: staff.name,
        role: staff.role,
        startTime: b?.startTime ?? "",
        endTime: b?.endTime ?? "",
      };
    })
    .filter((entry) => entry.startTime && entry.endTime);
  const baseGroupTasks = mockDailyTasks
    .filter((task) => !isSharedTask(task.name))
    .sort((a, b) => a.order - b.order)
    .map((task) => {
      return {
        taskKey: `base-${groupId}-${task.id}`,
        name: task.name,
        staffName: groupTaskStaffById[task.id] ?? "Nicht zugeteilt",
        done: taskDoneById[task.id] ?? isPastDate(selectedDate),
      };
    });
  const sharedForGroup = dailyTaskAssignments
    .filter(
      (assignment) =>
        !isFutureDate(selectedDate) &&
        isSharedTask(assignment.taskName) &&
        groupStaffIdSet.has(assignment.staffId)
    )
    .map((assignment) => ({
      taskKey: `shared-${groupId}-${assignment.taskId}-${assignment.staffId}`,
      name: assignment.taskName,
      staffName: assignment.staffName,
      done: isPastDate(selectedDate) ? true : assignment.done,
    }));
  const groupTasks = [...baseGroupTasks, ...sharedForGroup];
  const presentCount = countedChildren.length;
  const morningCount = countedChildren.filter((c) => isMorning(c.daySchedule)).length;
  const lunchCount = countedChildren.filter((c) => isLunch(c.daySchedule)).length;
  const afternoonCount = countedChildren.filter((c) => isAfternoon(c.daySchedule)).length;
  const spotsOccupied = countedChildren.reduce(
    (sum, c) => sum + spotsForChild(c.dateOfBirth, TODAY),
    0
  );

  const checkInHref = `/prototype/check-in?group=${groupId}&date=${selectedDate}`;
  const checkOutHref = `/prototype/check-out?group=${groupId}&date=${selectedDate}`;

  return (
    <div className="space-y-4">
      <GroupSwitcherMock includeAllOption />
      <DaySwitcherMock basePath="/prototype/group" />

      <header>
        <h1 className="text-xl font-semibold">
          {isAllGroups ? "Alle Gruppen" : (group?.name ?? "Group")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatDateShort(selectedDate)} · {presentCount}/{children.length} Kinder (
          <span className={cn(isFutureDate(selectedDate) && "italic")}>
            {spotsOccupied} Plätze
          </span>
          )
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/50 p-3">
        <div className="text-center">
          <p className="text-2xl font-bold">{morningCount}</p>
          <p className="text-xs text-muted-foreground">Morgen</p>
        </div>
        <div className="border-x text-center">
          <p className="text-2xl font-bold">{lunchCount}</p>
          <p className="text-xs text-muted-foreground">Mittag</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{afternoonCount}</p>
          <p className="text-xs text-muted-foreground">Nachmittag</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={checkInHref}>
          <Button type="button" size="sm">+ Entgegennehmen</Button>
        </Link>
        <Link href={`/prototype/ablauf?group=${groupId}&date=${selectedDate}`}>
          <Button type="button" size="sm" variant="outline">
            Ablauf
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left font-medium">Kind</th>
              <th className="p-2 text-left font-medium">Infos Eltern</th>
              <th className="p-2 text-left font-medium">Znüni</th>
              <th className="p-2 text-left font-medium">Mittag</th>
              <th className="p-2 text-left font-medium">Schlaf</th>
              <th className="p-2 text-left font-medium">Akt. Morgen</th>
              <th className="p-2 text-left font-medium">Akt. Nachm.</th>
              <th className="p-2 text-left font-medium">Zvieri</th>
            </tr>
          </thead>
          <tbody>
            {visibleChildren.map((child) => {
              const presence = getDailyPresenceStatus(child.id, selectedDate);
              const isCounted = presence === "expected" || presence === "present";
              const data = getKidData(child.id, selectedDate);
              const isExpanded = expandedId === child.id;

              return (
                <React.Fragment key={child.id}>
                  <tr
                    className={cn(
                      "border-b cursor-pointer hover:bg-muted/30",
                      !isCounted && "opacity-60"
                    )}
                    onClick={() => setExpandedId(isExpanded ? null : child.id)}
                  >
                    <td className="p-2">
                      <div>
                        <p className="font-medium">
                          {child.firstName} {child.lastName[0]}.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {presence === "present"
                            ? "✓ Anwesend"
                            : presence === "planned_absence"
                              ? "Geplant abwesend"
                              : presence === "absent_today"
                                ? "Heute abwesend"
                                : "Erwartet"}
                        </p>
                      </div>
                    </td>
                    <td
                      className="p-2 max-w-[140px] truncate"
                      title={
                        data.infosForParents ||
                        (isFutureDate(selectedDate) ? "—" : "Alles in Ordnung")
                      }
                    >
                      {data.infosForParents ||
                        (isFutureDate(selectedDate) ? "—" : "Alles in Ordnung")}
                    </td>
                    <td className="p-2 max-w-[80px] truncate" title={data.znüni}>
                      {data.znüni || "—"}
                    </td>
                    <td className="p-2">
                      {isFutureDate(selectedDate) ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            type="button"
                            className="rounded border px-1.5 py-0.5 text-xs font-medium hover:bg-muted"
                            onClick={(e) => {
                              e.stopPropagation();
                              cycleLunchPortions(child.id, selectedDate);
                            }}
                          >
                            {PORTION_LABELS[data.lunchPortions ?? 0]}×
                          </button>
                          {plannedLunchItems.map((item, i) => {
                            const state = data.lunchItemStates?.[i] ?? "default";
                            return (
                              <button
                                key={i}
                                type="button"
                                className={cn(
                                  "rounded px-1 text-xs",
                                  state === "default" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                  state === "exclude" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                                  state === "only" && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cycleLunchItemState(child.id, i, selectedDate);
                                }}
                                title={`${item}: 1×ausschliessen, 2×nur dies, 3×zurück`}
                              >
                                {ITEM_STATE_LABELS[state]} {item.slice(0, 6)}
                              </button>
                            );
                          })}
                          {plannedLunchItems.length === 0 && <span className="text-muted-foreground">—</span>}
                        </div>
                      )}
                    </td>
                    <td className="p-2 max-w-[60px] truncate" title={data.schlaf}>
                      {data.schlaf || "—"}
                    </td>
                    <td className="p-2 max-w-[80px] truncate" title={data.activityMorning}>
                      {data.activityMorning || "—"}
                    </td>
                    <td className="p-2 max-w-[80px] truncate" title={data.activityAfternoon}>
                      {data.activityAfternoon || "—"}
                    </td>
                    <td className="p-2 max-w-[80px] truncate" title={data.zvieri}>
                      {data.zvieri || "—"}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-muted/20">
                      <td colSpan={8} className="p-3">
                        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                          <EditableField
                            label="Znüni"
                            value={data.znüni}
                            onChange={(v) => setKidData(child.id, { znüni: v }, selectedDate)}
                          />
                          <EditableField
                            label="Schlaf/Pause"
                            value={data.schlaf}
                            onChange={(v) => setKidData(child.id, { schlaf: v }, selectedDate)}
                          />
                          <EditableField
                            label="Aktivität Morgen"
                            value={data.activityMorning}
                            onChange={(v) =>
                              setKidData(child.id, { activityMorning: v }, selectedDate)
                            }
                          />
                          <EditableField
                            label="Aktivität Nachmittag"
                            value={data.activityAfternoon}
                            onChange={(v) =>
                              setKidData(child.id, { activityAfternoon: v }, selectedDate)
                            }
                          />
                          <EditableField
                            label="Zvieri"
                            value={data.zvieri}
                            onChange={(v) => setKidData(child.id, { zvieri: v }, selectedDate)}
                          />
                          <EditableField
                            label="Infos für Eltern"
                            value={data.infosForParents}
                            onChange={(v) =>
                              setKidData(child.id, { infosForParents: v }, selectedDate)
                            }
                            className="col-span-2"
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Link
                            href={`/prototype/child-log/${child.id}?group=${groupId}&date=${selectedDate}`}
                          >
                            <Button type="button" size="sm" variant="outline">
                              Tageslog
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-4">
        <Link href={checkOutHref}>
          <Button type="button" variant="outline" className="w-full">
            Abgeben / Check Out All
          </Button>
        </Link>
      </div>

      {hasSingleGroupSelected && (
        <section className="space-y-1.5">
          <h2 className="text-sm font-medium text-muted-foreground">
            Gruppeninfo heute
          </h2>
          <div className="space-y-1.5">
            <div className="rounded-lg border bg-muted/20 p-2">
              <p className="mb-1 text-xs font-semibold text-foreground">Pausen</p>
              <div className="flex flex-wrap gap-1">
                {groupBreaks.map((entry) => (
                  <div
                    key={`${entry.staffName}-${entry.startTime}`}
                    className="inline-flex items-center gap-1 rounded border bg-background px-2 py-1"
                  >
                    <span className="text-sm font-semibold text-foreground">{entry.staffName}</span>
                    <span className="text-[11px] text-muted-foreground">({entry.role})</span>
                    <span className="text-[11px] font-medium text-foreground">
                      {entry.startTime}-{entry.endTime}
                    </span>
                  </div>
                ))}
                {groupBreaks.length === 0 && (
                  <p className="text-xs text-muted-foreground">Keine Pausen erfasst.</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-muted/20 p-2">
              <p className="mb-1 text-xs font-semibold text-foreground">Aufgaben</p>
              <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {groupTasks.map((task) => (
                  <button
                    key={`${task.name}-${task.staffName}`}
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded border bg-background px-2 py-1.5 text-left hover:bg-muted/40"
                    onClick={() =>
                      setTaskDoneOverrides((prev) => ({
                        ...prev,
                        [task.taskKey]: !(prev[task.taskKey] ?? task.done),
                      }))
                    }
                  >
                    <div className="min-w-0 flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-foreground">{task.name}</p>
                      <span className="text-[11px] text-muted-foreground">-</span>
                      <p className="truncate text-sm text-muted-foreground">{task.staffName}</p>
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        (taskDoneOverrides[task.taskKey] ?? task.done)
                          ? "text-green-600"
                          : "text-foreground"
                      )}
                    >
                      {(taskDoneOverrides[task.taskKey] ?? task.done) ? "✓" : "○"}
                    </span>
                  </button>
                ))}
                {groupTasks.length === 0 && (
                  <p className="text-xs text-muted-foreground">Keine Aufgaben verfügbar.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full rounded border bg-background px-2 py-1.5 text-sm"
      />
    </div>
  );
}
