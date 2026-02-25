"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChildCardMock } from "./ChildCardMock";
import { GroupSwitcherMock } from "./GroupSwitcherMock";
import { usePrototype } from "@/context/PrototypeContext";
import {
  mockChildren,
  mockAttendance,
  mockDayLogEntries,
  mockGroups,
} from "@/lib/mock";
import {
  PROTOTYPE_TODAY,
  clampToCalendarWindow,
  formatDateShort,
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

export function GroupOverviewMock() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group") ?? mockGroups[0]?.id ?? "g1";
  const selectedDate = clampToCalendarWindow(searchParams.get("date") ?? TODAY);
  const { isCountedForToday } = usePrototype();

  const group = mockGroups.find((g) => g.id === groupId);
  const children = mockChildren.filter((c) => c.groupId === groupId);
  const presentChildren = children.filter((c) => isCountedForToday(c.id, selectedDate));
  const presentCount = presentChildren.length;

  const morningCount = presentChildren.filter((c) => isMorning(c.daySchedule)).length;
  const lunchCount = presentChildren.filter((c) => isLunch(c.daySchedule)).length;
  const afternoonCount = presentChildren.filter((c) => isAfternoon(c.daySchedule)).length;
  const spotsOccupied = presentChildren.reduce(
    (sum, c) => sum + spotsForChild(c.dateOfBirth, TODAY),
    0
  );

  const getAttendance = (childId: string) =>
    mockAttendance.find((a) => a.childId === childId && a.date === selectedDate);

  const getLogTypesForChild = (childId: string) => {
    const entries = mockDayLogEntries.filter(
      (e) => e.childId === childId && e.date === selectedDate
    );
    return [...new Set(entries.map((e) => e.type))];
  };

  const checkInHref = `/prototype/check-in?group=${groupId}&date=${selectedDate}`;
  const checkOutHref = `/prototype/check-out?group=${groupId}&date=${selectedDate}`;

  return (
    <div className="space-y-4">
      <GroupSwitcherMock />

      <header>
        <h1 className="text-xl font-semibold">{group?.name ?? "Group"}</h1>
        <p className="text-sm text-muted-foreground">
          {formatDateShort(selectedDate)} · {presentCount}/{children.length} Kinder (
          <span className={isFutureDate(selectedDate) ? "italic" : ""}>{spotsOccupied} Plätze</span>)
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
          <Button size="sm">+ Entgegennehmen</Button>
        </Link>
        <Link href="/prototype/ablauf">
          <Button size="sm" variant="outline">
            Ablauf
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {children.map((child) => (
          <ChildCardMock
            key={child.id}
            child={child}
            attendance={getAttendance(child.id)}
            logTypes={getLogTypesForChild(child.id)}
            groupId={groupId}
            date={selectedDate}
          />
        ))}
      </div>

      <div className="pt-4">
        <Link href={checkOutHref}>
          <Button variant="outline" className="w-full">
            Abgeben / Check Out All
          </Button>
        </Link>
      </div>
    </div>
  );
}
