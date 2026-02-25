"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockChildren } from "@/lib/mock";
import { usePrototype } from "@/context/PrototypeContext";
import { GroupSwitcherMock } from "./GroupSwitcherMock";
import { PROTOTYPE_TODAY, clampToCalendarWindow } from "@/lib/prototypeCalendar";

const ABMELDEN_REASONS = [
  "Krank",
  "Urlaub",
  "Kommt später",
  "Andere",
] as const;

interface EntgegennehmenMockProps {
  groupId: string;
}

interface CheckInItemState {
  parentInfo: string;
  checkInTime: string;
  absentReason: (typeof ABMELDEN_REASONS)[number];
}

function nowTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function EntgegennehmenMock({ groupId }: EntgegennehmenMockProps) {
  const searchParams = useSearchParams();
  const selectedDate = clampToCalendarWindow(
    searchParams.get("date") ?? PROTOTYPE_TODAY
  );
  const { getDailyPresenceStatus, setDailyPresenceStatus, setKidData } = usePrototype();
  const isAllGroups = groupId === "all";
  const children = isAllGroups
    ? mockChildren
    : mockChildren.filter((c) => c.groupId === groupId);

  const [checkInState, setCheckInState] = useState<Record<string, CheckInItemState>>(
    () =>
      Object.fromEntries(
        children.map((child) => [
          child.id,
          {
            parentInfo: "",
            checkInTime: nowTime(),
            absentReason: "Krank",
          },
        ])
      )
  );

  const expectedChildren = children.filter(
    (child) => getDailyPresenceStatus(child.id, selectedDate) === "expected"
  );
  const checkedInChildren = children.filter(
    (child) => getDailyPresenceStatus(child.id, selectedDate) === "present"
  );
  const absentTodayChildren = children.filter(
    (child) => getDailyPresenceStatus(child.id, selectedDate) === "absent_today"
  );
  const plannedAbsenceChildren = children.filter(
    (child) => getDailyPresenceStatus(child.id, selectedDate) === "planned_absence"
  );

  const backHref = `/prototype/group?group=${groupId}&date=${selectedDate}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href={backHref}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Zurück
        </Link>
      </div>

      <GroupSwitcherMock basePath="/prototype/check-in" includeAllOption />

      <header>
        <h1 className="text-xl font-semibold">Entgegennehmen</h1>
        <p className="text-sm text-muted-foreground">
          Kinder einchecken · {expectedChildren.length} erwartet
        </p>
      </header>

      <div className="space-y-3">
        {expectedChildren.length === 0 && (
          <Card>
            <CardContent className="p-3 text-sm text-muted-foreground">
              Alle erwarteten Kinder wurden bearbeitet.
            </CardContent>
          </Card>
        )}

        {expectedChildren.map((child) => {
          const state = checkInState[child.id];

          return (
            <Card key={child.id}>
              <CardContent className="space-y-2 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {child.firstName} {child.lastName}
                  </p>
                  <span className="text-xs text-muted-foreground">Erwartet</span>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Info von Eltern
                  </label>
                  <textarea
                    placeholder="Alles in Ordnung"
                    className="mt-0.5 w-full rounded border bg-background px-2 py-1.5 text-sm"
                    rows={1}
                    value={state?.parentInfo ?? ""}
                    onChange={(e) =>
                      setCheckInState((prev) => ({
                        ...prev,
                        [child.id]: { ...prev[child.id], parentInfo: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Ankunft
                    </label>
                    <input
                      type="time"
                      value={state?.checkInTime ?? nowTime()}
                      onChange={(e) =>
                        setCheckInState((prev) => ({
                          ...prev,
                          [child.id]: { ...prev[child.id], checkInTime: e.target.value },
                        }))
                      }
                      className="mt-0.5 block rounded border bg-background px-2 py-1.5 text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setKidData(child.id, {
                        infosForParents: state?.parentInfo?.trim() || "Alles in Ordnung",
                      }, selectedDate);
                      setDailyPresenceStatus(child.id, "present", selectedDate);
                    }}
                  >
                    Check-in bestätigen
                  </Button>
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Abwesenheitsgrund
                    </label>
                    <select
                      value={state?.absentReason ?? "Krank"}
                      onChange={(e) =>
                        setCheckInState((prev) => ({
                          ...prev,
                          [child.id]: {
                            ...prev[child.id],
                            absentReason: e.target.value as (typeof ABMELDEN_REASONS)[number],
                          },
                        }))
                      }
                      className="mt-0.5 block rounded border bg-background px-2 py-1.5 text-sm"
                    >
                      {ABMELDEN_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setKidData(child.id, {
                        infosForParents: state?.parentInfo?.trim() || "Alles in Ordnung",
                      }, selectedDate);
                      setDailyPresenceStatus(child.id, "absent_today", selectedDate);
                    }}
                  >
                    Heute abwesend markieren
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {checkedInChildren.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Heute eingecheckt</p>
          {checkedInChildren.map((child) => {
            const state = checkInState[child.id];
            return (
              <Card key={`present-${child.id}`}>
                <CardContent className="flex items-center justify-between gap-2 p-3">
                  <div>
                    <p className="font-medium">
                      {child.firstName} {child.lastName}
                    </p>
                    <p className="text-xs text-green-600">
                      ✓ {state?.checkInTime || "—"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setDailyPresenceStatus(child.id, "expected", selectedDate)}
                  >
                    Rückgängig
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {absentTodayChildren.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Heute abwesend</p>
          {absentTodayChildren.map((child) => {
            const state = checkInState[child.id];
            return (
              <Card key={`absent-${child.id}`}>
                <CardContent className="flex items-center justify-between gap-2 p-3">
                  <div>
                    <p className="font-medium">
                      {child.firstName} {child.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {state?.absentReason || "Abwesend"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setDailyPresenceStatus(child.id, "expected", selectedDate)}
                  >
                    Rückgängig
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {plannedAbsenceChildren.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Geplante Abwesenheiten</p>
          {plannedAbsenceChildren.map((child) => (
            <Card key={`planned-${child.id}`}>
              <CardContent className="flex items-center justify-between gap-2 p-3">
                <p className="font-medium">
                  {child.firstName} {child.lastName}
                </p>
                <span className="text-xs text-muted-foreground">Geplant abwesend</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
