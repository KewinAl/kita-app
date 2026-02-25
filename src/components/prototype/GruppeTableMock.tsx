"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GroupSwitcherMock } from "./GroupSwitcherMock";
import { usePrototype } from "@/context/PrototypeContext";
import {
  mockChildren,
  mockAttendance,
  mockGroups,
} from "@/lib/mock";
import { cn } from "@/lib/utils";

const TODAY = "2025-02-19";

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

export function GruppeTableMock() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group") ?? mockGroups[0]?.id ?? "g1";
  const {
    plannedLunchItems,
    getKidData,
    setKidData,
    cycleLunchPortions,
    cycleLunchItemState,
  } = usePrototype();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const group = mockGroups.find((g) => g.id === groupId);
  const children = mockChildren.filter((c) => c.groupId === groupId);
  const presentChildren = children.filter((c) => {
    const att = mockAttendance.find((a) => a.childId === c.id && a.date === TODAY);
    return att?.status === "present";
  });
  const presentCount = presentChildren.length;
  const morningCount = presentChildren.filter((c) => isMorning(c.daySchedule)).length;
  const lunchCount = presentChildren.filter((c) => isLunch(c.daySchedule)).length;
  const afternoonCount = presentChildren.filter((c) => isAfternoon(c.daySchedule)).length;
  const spotsOccupied = presentChildren.reduce(
    (sum, c) => sum + spotsForChild(c.dateOfBirth, TODAY),
    0
  );

  const getAttendance = (childId: string) =>
    mockAttendance.find((a) => a.childId === childId && a.date === TODAY);

  const checkInHref = `/prototype/check-in?group=${groupId}`;
  const checkOutHref = `/prototype/check-out?group=${groupId}`;

  return (
    <div className="space-y-4">
      <GroupSwitcherMock />

      <header>
        <h1 className="text-xl font-semibold">{group?.name ?? "Group"}</h1>
        <p className="text-sm text-muted-foreground">
          Mi 19 Feb · {presentCount}/{children.length} Kinder ({spotsOccupied} Plätze)
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
        <Link href="/prototype/ablauf">
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
              <th className="p-2 text-left font-medium">Znüni</th>
              <th className="p-2 text-left font-medium">Mittag</th>
              <th className="p-2 text-left font-medium">Schlaf</th>
              <th className="p-2 text-left font-medium">Akt. Morgen</th>
              <th className="p-2 text-left font-medium">Akt. Nachm.</th>
              <th className="p-2 text-left font-medium">Zvieri</th>
              <th className="p-2 text-left font-medium">Infos Eltern</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => {
              const att = getAttendance(child.id);
              const isPresent = att?.status === "present";
              const isAbsent = att?.status === "absent";
              const data = getKidData(child.id);
              const isExpanded = expandedId === child.id;

              return (
                <React.Fragment key={child.id}>
                  <tr
                    className={cn(
                      "border-b cursor-pointer hover:bg-muted/30",
                      !isPresent && "opacity-60"
                    )}
                    onClick={() => setExpandedId(isExpanded ? null : child.id)}
                  >
                    <td className="p-2">
                      <div>
                        <p className="font-medium">
                          {child.firstName} {child.lastName[0]}.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isPresent ? `✓ ${att?.checkInTime}` : isAbsent ? "Abwesend" : "—"}
                        </p>
                      </div>
                    </td>
                    <td className="p-2 max-w-[80px] truncate" title={data.znüni}>
                      {data.znüni || "—"}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          type="button"
                          className="rounded border px-1.5 py-0.5 text-xs font-medium hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation();
                            cycleLunchPortions(child.id);
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
                                cycleLunchItemState(child.id, i);
                              }}
                              title={`${item}: 1×ausschliessen, 2×nur dies, 3×zurück`}
                            >
                              {ITEM_STATE_LABELS[state]} {item.slice(0, 6)}
                            </button>
                          );
                        })}
                        {plannedLunchItems.length === 0 && <span className="text-muted-foreground">—</span>}
                      </div>
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
                    <td className="p-2 max-w-[80px] truncate" title={data.infosForParents}>
                      {data.infosForParents || "—"}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-muted/20">
                      <td colSpan={8} className="p-3">
                        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                          <EditableField
                            label="Znüni"
                            value={data.znüni}
                            onChange={(v) => setKidData(child.id, { znüni: v })}
                          />
                          <EditableField
                            label="Schlaf/Pause"
                            value={data.schlaf}
                            onChange={(v) => setKidData(child.id, { schlaf: v })}
                          />
                          <EditableField
                            label="Aktivität Morgen"
                            value={data.activityMorning}
                            onChange={(v) => setKidData(child.id, { activityMorning: v })}
                          />
                          <EditableField
                            label="Aktivität Nachmittag"
                            value={data.activityAfternoon}
                            onChange={(v) => setKidData(child.id, { activityAfternoon: v })}
                          />
                          <EditableField
                            label="Zvieri"
                            value={data.zvieri}
                            onChange={(v) => setKidData(child.id, { zvieri: v })}
                          />
                          <EditableField
                            label="Infos für Eltern"
                            value={data.infosForParents}
                            onChange={(v) => setKidData(child.id, { infosForParents: v })}
                            className="col-span-2"
                          />
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Link href={`/prototype/child-log/${child.id}?group=${groupId}`}>
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
