"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePrototype } from "@/context/PrototypeContext";
import { cn } from "@/lib/utils";
import { DaySwitcherMock } from "./DaySwitcherMock";
import {
  ACTIVE_SOFT_INDICATOR_CLASS,
  ACTIVE_SOLID_INDICATOR_CLASS,
} from "./activeIndicatorClasses";
import {
  mockDailyTasks,
  mockGroups,
  mockStaff,
} from "@/lib/mock";
import { isFutureDate, isPastDate } from "@/lib/prototypeCalendar";

const MEAL_LABELS = {
  znueni: "Znüni",
  lunch: "Mittagessen",
  zvieri: "Zvieri",
} as const;

// TODO(settings): Move these planning rules to a settings page (shared tasks + staff/group mapping).
const SHARED_TASK_NAMES = new Set([
  "zvieri vorbereiten",
  "zvieri küche",
]);
// TODO(break-rules): Add shift-based break duration options (30/45/60) and enforce
// at least one staff member per group remains available during overlapping breaks.

type PlanTask = {
  taskId: string;
  taskName: string;
  staffId: string;
  done: boolean;
};

function isSharedTask(taskName: string) {
  return SHARED_TASK_NAMES.has(taskName.trim().toLowerCase());
}

export function AblaufDisplayMock({ selectedDate }: { selectedDate: string }) {
  const searchParams = useSearchParams();
  const queryGroupId = searchParams.get("group") ?? "";
  const {
    getPlannedLunchItems,
    getPlannedZnüni,
    getPlannedZvieri,
    setPlannedZnüni,
    setPlannedZvieri,
    addLunchItem,
    removeLunchItem,
    updateLunchItem,
    copyPlanToAllKids,
    getTaskAssignments,
    getBreaks,
  } = usePrototype();

  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    queryGroupId || "all"
  );
  const staffById = useMemo(
    () => Object.fromEntries(mockStaff.map((s) => [s.id, s])),
    []
  );
  const staffByGroup = useMemo(
    () =>
      Object.fromEntries(
        mockGroups.map((group) => [
          group.id,
          mockStaff.filter((staff) => staff.primaryGroupId === group.id),
        ])
      ),
    []
  );
  const kitaWideStaff = useMemo(
    () => mockStaff.filter((staff) => !staff.primaryGroupId),
    []
  );
  const isFuture = isFutureDate(selectedDate);
  const isPast = isPastDate(selectedDate);

  const initialTaskTemplate = useMemo(() => {
    const dayAssignments = getTaskAssignments(selectedDate);
    return mockDailyTasks
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((task) => {
      const assigned = dayAssignments.find((a) => a.taskId === task.id);
      return {
        taskId: task.id,
        taskName: task.name,
        staffId: assigned?.staffId ?? "",
        done: isPast ? true : (assigned?.done ?? false),
      };
      });
  }, [getTaskAssignments, isPast, selectedDate]);
  const initialGroupTasks = useMemo(
    () =>
      Object.fromEntries(
        mockGroups.map((group) => [
          group.id,
          initialTaskTemplate
            .filter((task) => !isSharedTask(task.taskName))
            .map((task) => ({ ...task })),
        ])
      ),
    [initialTaskTemplate]
  );
  const initialSharedTasks = useMemo(
    () =>
      initialTaskTemplate
        .filter((task) => isSharedTask(task.taskName))
        .map((task) => ({ ...task })),
    [initialTaskTemplate]
  );
  const initialBreaks = useMemo(
    () =>
      Object.fromEntries(
        mockStaff.map((staff) => {
          const b = getBreaks(selectedDate).find((entry) => entry.staffId === staff.id);
          return [staff.id, { startTime: b?.startTime ?? "", endTime: b?.endTime ?? "" }];
        })
      ),
    [getBreaks, selectedDate]
  );
  const initialDayGroupByStaff = useMemo(
    () =>
      Object.fromEntries(
        mockStaff.map((staff) => [staff.id, staff.primaryGroupId ?? "kita"])
      ),
    []
  );

  const [selectedStaffId, setSelectedStaffId] = useState<string>(mockStaff[0]?.id ?? "");
  const [draggedStaffId, setDraggedStaffId] = useState<string | null>(null);
  const [dayGroupByStaff, setDayGroupByStaff] =
    useState<Record<string, string>>(initialDayGroupByStaff);
  const [groupTaskAssignments, setGroupTaskAssignments] =
    useState<Record<string, PlanTask[]>>(initialGroupTasks);
  const [sharedTaskAssignments, setSharedTaskAssignments] =
    useState<PlanTask[]>(initialSharedTasks);
  const [staffBreaks, setStaffBreaks] = useState(initialBreaks);
  const [saveState, setSaveState] = useState<{ visible: boolean; label: string }>({
    visible: false,
    label: "",
  });

  const showSavedFeedback = (label: string) => {
    setSaveState({ visible: true, label });
    window.setTimeout(() => {
      setSaveState((prev) => ({ ...prev, visible: false }));
    }, 2200);
  };

  const visibleGroups =
    selectedGroupId === "all"
      ? mockGroups
      : mockGroups.filter((group) => group.id === selectedGroupId);
  const staffByGroupToday = useMemo(
    () =>
      Object.fromEntries(
        mockGroups.map((group) => [
          group.id,
          mockStaff.filter((staff) => dayGroupByStaff[staff.id] === group.id),
        ])
      ),
    [dayGroupByStaff]
  );
  const kitaWideStaffToday = useMemo(
    () => mockStaff.filter((staff) => dayGroupByStaff[staff.id] === "kita"),
    [dayGroupByStaff]
  );
  const selectableStaff = useMemo(() => {
    const raw =
      selectedGroupId === "all"
        ? mockStaff
        : [
            ...(staffByGroupToday[selectedGroupId] ?? []),
            ...kitaWideStaffToday,
          ];

    const seen = new Set<string>();
    return raw.filter((staff) => {
      if (seen.has(staff.id)) return false;
      seen.add(staff.id);
      return true;
    });
  }, [kitaWideStaffToday, selectedGroupId, staffByGroupToday]);

  const assignStaffToDayGroup = (staffId: string, groupId: string | "kita") => {
    setDayGroupByStaff((prev) => ({ ...prev, [staffId]: groupId }));
  };

  const assignTaskToStaff = (
    taskId: string,
    staffId: string,
    scope: "group" | "shared",
    groupId?: string
  ) => {
    if (scope === "shared") {
      setSharedTaskAssignments((prev) =>
        prev.map((task) => (task.taskId === taskId ? { ...task, staffId } : task))
      );
      return;
    }
    if (!groupId) return;
    setGroupTaskAssignments((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] ?? []).map((task) =>
        task.taskId === taskId ? { ...task, staffId } : task
      ),
    }));
  };

  const handleSave = () => {
    copyPlanToAllKids(selectedDate);
    showSavedFeedback("Planung gespeichert.");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Link
          href={`/prototype/group?group=${selectedGroupId === "all" ? "g1" : selectedGroupId}&date=${selectedDate}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Zurück
        </Link>
        <DaySwitcherMock basePath="/prototype/ablauf" />
      </div>

      <header>
        <h1 className="text-xl font-semibold">Ablauf Planung</h1>
        <p className="text-sm text-muted-foreground">Mi 19. Feb 2025</p>
        <p className="text-xs text-muted-foreground">
          Gruppen und geteilte Aufgaben sind vorbereitet; Details werden spaeter in Einstellungen steuerbar.
        </p>
      </header>

      <section className="sticky top-2 z-20 rounded-lg border bg-background/95 p-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="space-y-2">
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Gruppenfilter</p>
            <div className="flex flex-wrap gap-1.5">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className={cn(
                  "border px-3",
                  selectedGroupId === "all"
                    ? ACTIVE_SOLID_INDICATOR_CLASS
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setSelectedGroupId("all")}
              >
                Alle Gruppen
              </Button>
              {mockGroups.map((group) => (
                <Button
                  key={group.id}
                  type="button"
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "border px-3",
                    selectedGroupId === group.id
                      ? ACTIVE_SOLID_INDICATOR_CLASS
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  {group.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Mitarbeitende (drag auf Gruppe fuer Tageseinsatz)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectableStaff.map((staff) => (
                <button
                  key={staff.id}
                  type="button"
                  draggable
                  onDragStart={() => setDraggedStaffId(staff.id)}
                  onDragEnd={() => setDraggedStaffId(null)}
                  onClick={() => setSelectedStaffId(staff.id)}
                  className={cn("rounded border px-2 py-1 text-xs transition-colors", 
                    selectedStaffId === staff.id
                      ? ACTIVE_SOFT_INDICATOR_CLASS
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {staff.name} ({staff.role}){" "}
                  <span className="text-[10px] text-muted-foreground">
                    [{dayGroupByStaff[staff.id] === "kita"
                      ? "kitaweit"
                      : mockGroups.find((g) => g.id === dayGroupByStaff[staff.id])?.name ?? "?"}]
                  </span>
                </button>
              ))}
              {selectableStaff.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  Kein Personal in diesem Gruppenfilter.
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Pausen
        </h2>
        {isFuture && (
          <Card>
            <CardContent className="p-3 text-sm text-muted-foreground">
              Für diesen zukünftigen Tag ist noch keine Pausenplanung vorhanden.
            </CardContent>
          </Card>
        )}
        <div className="grid gap-2 lg:grid-cols-2">
          {visibleGroups.map((group) => {
            const groupStaff = staffByGroupToday[group.id] ?? [];
            return (
              <Card
                key={`breaks-${group.id}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const staffId = draggedStaffId ?? e.dataTransfer.getData("text/plain");
                  if (staffId) assignStaffToDayGroup(staffId, group.id);
                  setDraggedStaffId(null);
                }}
              >
                <CardContent className="space-y-1.5 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{group.name}</p>
                    <span className="text-[11px] text-muted-foreground">
                      Staff hier ablegen
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[360px] text-sm">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="p-1.5 text-left font-medium">Mitarbeitende</th>
                          <th className="p-1.5 text-left font-medium">Von</th>
                          <th className="p-1.5 text-left font-medium">Bis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupStaff.map((staff) => (
                          <tr key={staff.id} className="border-b last:border-b-0">
                            <td className="p-1.5 font-medium">
                              {staff.name} <span className="text-xs text-muted-foreground">({staff.role})</span>
                            </td>
                            <td className="p-1.5">
                              <input
                                type="time"
                                value={staffBreaks[staff.id]?.startTime ?? ""}
                                onChange={(e) =>
                                  setStaffBreaks((prev) => ({
                                    ...prev,
                                    [staff.id]: {
                                      ...prev[staff.id],
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                                disabled={isFuture}
                                className="w-24 rounded border bg-background px-2 py-1 text-sm"
                              />
                            </td>
                            <td className="p-1.5">
                              <input
                                type="time"
                                value={staffBreaks[staff.id]?.endTime ?? ""}
                                onChange={(e) =>
                                  setStaffBreaks((prev) => ({
                                    ...prev,
                                    [staff.id]: {
                                      ...prev[staff.id],
                                      endTime: e.target.value,
                                    },
                                  }))
                                }
                                disabled={isFuture}
                                className="w-24 rounded border bg-background px-2 py-1 text-sm"
                              />
                            </td>
                          </tr>
                        ))}
                        {groupStaff.length === 0 && (
                          <tr>
                            <td className="p-1.5 text-muted-foreground" colSpan={3}>
                              Kein Personal dieser Gruppe zugeteilt.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {kitaWideStaffToday.length > 0 && (
            <Card
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const staffId = draggedStaffId ?? e.dataTransfer.getData("text/plain");
                if (staffId) assignStaffToDayGroup(staffId, "kita");
                setDraggedStaffId(null);
              }}
            >
              <CardContent className="space-y-1.5 p-2.5">
                <p className="text-sm font-medium">Kitaweit (KL / Springer)</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[360px] text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="p-1.5 text-left font-medium">Mitarbeitende</th>
                        <th className="p-1.5 text-left font-medium">Von</th>
                        <th className="p-1.5 text-left font-medium">Bis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kitaWideStaffToday.map((staff) => (
                        <tr key={staff.id} className="border-b last:border-b-0">
                          <td className="p-1.5 font-medium">
                            {staff.name} <span className="text-xs text-muted-foreground">({staff.role})</span>
                          </td>
                          <td className="p-1.5">
                            <input
                              type="time"
                              value={staffBreaks[staff.id]?.startTime ?? ""}
                              onChange={(e) =>
                                setStaffBreaks((prev) => ({
                                  ...prev,
                                  [staff.id]: {
                                    ...prev[staff.id],
                                    startTime: e.target.value,
                                  },
                                }))
                              }
                              disabled={isFuture}
                              className="w-24 rounded border bg-background px-2 py-1 text-sm"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="time"
                              value={staffBreaks[staff.id]?.endTime ?? ""}
                              onChange={(e) =>
                                setStaffBreaks((prev) => ({
                                  ...prev,
                                  [staff.id]: {
                                    ...prev[staff.id],
                                    endTime: e.target.value,
                                  },
                                }))
                              }
                              disabled={isFuture}
                              className="w-24 rounded border bg-background px-2 py-1 text-sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Tagesaufgaben verteilen
        </h2>
        {isFuture && (
          <Card>
            <CardContent className="p-3 text-sm text-muted-foreground">
              Für diesen zukünftigen Tag sind noch keine Aufgaben geplant.
            </CardContent>
          </Card>
        )}
        <p className="mb-2 text-xs text-muted-foreground">
          Einfach: Namen auf Aufgabe ziehen. Oder Namen antippen und dann auf Aufgabe tippen.
        </p>
        <div className="grid gap-2 lg:grid-cols-2">
          {visibleGroups.map((group) => (
            <Card key={`tasks-${group.id}`}>
              <CardContent className="space-y-1.5 p-2.5">
                <p className="text-sm font-medium">{group.name}</p>
                {(groupTaskAssignments[group.id] ?? []).map((task) => (
                  <div
                    key={`${group.id}-${task.taskId}`}
                    className="rounded-md border bg-background p-2"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const staffId =
                        draggedStaffId ?? e.dataTransfer.getData("text/plain");
                      if (staffId) assignTaskToStaff(task.taskId, staffId, "group", group.id);
                      setDraggedStaffId(null);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{task.taskName}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.staffId ? staffById[task.staffId]?.name : "Nicht zugeteilt"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={task.done ? "text-green-600" : "text-muted-foreground"}>
                          {task.done ? "✓" : "○"}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isFuture || isPast}
                          onClick={() => {
                            if (selectedStaffId) {
                              assignTaskToStaff(task.taskId, selectedStaffId, "group", group.id);
                            }
                          }}
                        >
                          {selectedStaffId
                            ? `Zuteilen: ${staffById[selectedStaffId]?.name ?? ""}`
                            : "Zuteilen"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={isFuture || isPast}
                          onClick={() =>
                            assignTaskToStaff(task.taskId, "", "group", group.id)
                          }
                        >
                          Leeren
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
          {sharedTaskAssignments.length > 0 && (
            <Card className="lg:col-span-2">
              <CardContent className="space-y-1.5 p-2.5">
                <p className="text-sm font-medium">Geteilte Aufgaben (alle Gruppen)</p>
                {sharedTaskAssignments.map((task) => (
                  <div
                    key={`shared-${task.taskId}`}
                    className="rounded-md border bg-background p-2"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const staffId =
                        draggedStaffId ?? e.dataTransfer.getData("text/plain");
                      if (staffId) assignTaskToStaff(task.taskId, staffId, "shared");
                      setDraggedStaffId(null);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{task.taskName}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.staffId ? staffById[task.staffId]?.name : "Nicht zugeteilt"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={task.done ? "text-green-600" : "text-muted-foreground"}>
                          {task.done ? "✓" : "○"}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isFuture || isPast}
                          onClick={() => {
                            if (selectedStaffId) {
                              assignTaskToStaff(task.taskId, selectedStaffId, "shared");
                            }
                          }}
                        >
                          {selectedStaffId
                            ? `Zuteilen: ${staffById[selectedStaffId]?.name ?? ""}`
                            : "Zuteilen"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={isFuture || isPast}
                          onClick={() => assignTaskToStaff(task.taskId, "", "shared")}
                        >
                          Leeren
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Mahlzeiten
        </h2>
        <div className="grid gap-2 lg:grid-cols-3">
          <Card>
            <CardContent className="space-y-1 p-2.5">
              <label className="text-sm font-medium">{MEAL_LABELS.znueni}</label>
              <input
                type="text"
                value={getPlannedZnüni(selectedDate)}
                onChange={(e) => setPlannedZnüni(e.target.value, selectedDate)}
                placeholder="z.B. Obst, Brot"
                className="w-full rounded border bg-background px-3 py-2 text-sm"
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="space-y-1.5 p-2.5">
              <label className="text-sm font-medium">{MEAL_LABELS.lunch}</label>
              {isFuture ? (
                <p className="text-sm text-muted-foreground">—</p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    Einzelne Items (z.B. Spaghetti, Sauce, Salat)
                  </p>
                  {getPlannedLunchItems(selectedDate).map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateLunchItem(i, e.target.value, selectedDate)}
                        placeholder={`Item ${i + 1}`}
                        className="flex-1 rounded border bg-background px-3 py-2 text-sm"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLunchItem(i, selectedDate)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addLunchItem(selectedDate)}
                  >
                    + Item
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-1 p-2.5">
              <label className="text-sm font-medium">{MEAL_LABELS.zvieri}</label>
              <input
                type="text"
                value={getPlannedZvieri(selectedDate)}
                onChange={(e) => setPlannedZvieri(e.target.value, selectedDate)}
                placeholder="z.B. Joghurt, Kekse"
                className="w-full rounded border bg-background px-3 py-2 text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {isFuture && (
        <p className="text-xs text-muted-foreground">
          Für zukünftige Tage ist die Planung noch leer.
        </p>
      )}
      {isPast && (
        <p className="text-xs text-muted-foreground">
          Vergangener Tag: Aufgaben gelten als abgeschlossen.
        </p>
      )}

      {saveState.visible && (
        <Card className="border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
          <CardContent className="p-3 text-sm text-green-800 dark:text-green-300">
            ✓ {saveState.label}
          </CardContent>
        </Card>
      )}

      <section className="space-y-2">
        <Button type="button" className="w-full" onClick={handleSave}>
          Speichern
        </Button>
        <p className="text-xs text-muted-foreground">
          Speichern uebernimmt Mahlzeiten in die Gruppenansicht und zeigt eine Rueckmeldung.
        </p>
      </section>
    </div>
  );
}
