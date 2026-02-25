"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Child } from "@/lib/mock/children";
import type { AttendanceRecord } from "@/lib/mock/attendance";
import type { DayLogType } from "@/lib/mock/dayLogEntries";

interface ChildCardMockProps {
  child: Child;
  attendance?: AttendanceRecord;
  logTypes: DayLogType[];
  groupId?: string;
}

const LOG_ICONS: Record<DayLogType, { icon: string; label: string }> = {
  meal: { icon: "🍽", label: "Meal" },
  nap: { icon: "😴", label: "Nap" },
  activity: { icon: "🎨", label: "Activity" },
  photo: { icon: "📸", label: "Photo" },
  incident: { icon: "⚠️", label: "Incident" },
};

export function ChildCardMock({
  child,
  attendance,
  logTypes,
  groupId,
}: ChildCardMockProps) {
  const isPresent = attendance?.status === "present";
  const isAbsent = attendance?.status === "absent";
  const childLogHref = groupId
    ? `/prototype/child-log/${child.id}?group=${groupId}`
    : `/prototype/child-log/${child.id}`;

  return (
    <Link href={childLogHref}>
      <Card
        className={cn(
          "cursor-pointer transition-colors hover:bg-muted/50",
          isAbsent && "opacity-60"
        )}
      >
      <CardContent className="flex items-center justify-between gap-3 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {child.firstName} {child.lastName[0]}.
          </p>
          <p
            className={cn(
              "text-xs",
              isPresent && "text-green-600 dark:text-green-400",
              isAbsent && "text-muted-foreground",
              !attendance && "text-amber-600 dark:text-amber-400"
            )}
          >
            {isPresent && attendance?.checkInTime
              ? `✓ In ${attendance.checkInTime}`
              : isAbsent
                ? "✗ Absent"
                : "— Not checked in"}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {logTypes.map((type) => (
            <span
              key={type}
              className="text-base"
              title={LOG_ICONS[type].label}
            >
              {LOG_ICONS[type].icon}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
