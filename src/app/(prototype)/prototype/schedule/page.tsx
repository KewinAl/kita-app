"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { mockSchedule, mockChildren } from "@/lib/mock";
import { DaySwitcherMock } from "@/components/prototype/DaySwitcherMock";
import { PROTOTYPE_TODAY, clampToCalendarWindow, formatDateShort } from "@/lib/prototypeCalendar";
import { usePrototype } from "@/context/PrototypeContext";

const TODAY = PROTOTYPE_TODAY;

export default function PrototypeSchedulePage() {
  const searchParams = useSearchParams();
  const { getDailyPresenceStatus } = usePrototype();
  const selectedDate = clampToCalendarWindow(searchParams.get("date") ?? TODAY);
  const group = searchParams.get("group");
  const absentChildren = mockChildren.filter((c) => {
    const status = getDailyPresenceStatus(c.id, selectedDate);
    return status === "planned_absence" || status === "absent_today";
  });

  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4 md:max-w-4xl lg:max-w-6xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href={`/prototype/group?group=${group ?? "g1"}&date=${selectedDate}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Zurück
          </Link>
          <DaySwitcherMock basePath="/prototype/schedule" />
        </div>

        <header>
          <h1 className="text-xl font-semibold">Heutiger Ablauf</h1>
          <p className="text-sm text-muted-foreground">{formatDateShort(selectedDate)}</p>
        </header>

        {absentChildren.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardContent className="p-3">
              <h3 className="text-sm font-medium">Abwesend heute</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {absentChildren
                  .map((c) => `${c.firstName} ${c.lastName}`)
                  .join(", ")}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {mockSchedule.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-3 p-3">
                <span className="font-mono text-sm text-muted-foreground">
                  {item.time}
                </span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="ml-auto text-lg">
                  {item.type === "meal" && "🍽"}
                  {item.type === "nap" && "😴"}
                  {item.type === "activity" && "🎨"}
                  {item.type === "transition" && "↔"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
