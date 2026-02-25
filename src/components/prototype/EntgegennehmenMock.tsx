"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockChildren, mockAttendance } from "@/lib/mock";

const TODAY = "2025-02-19";

const ABMELDEN_REASONS = [
  "Krank",
  "Urlaub",
  "Kommt später",
  "Andere",
] as const;

interface EntgegennehmenMockProps {
  groupId: string;
}

export function EntgegennehmenMock({ groupId }: EntgegennehmenMockProps) {
  const children = mockChildren.filter((c) => c.groupId === groupId);
  const notCheckedIn = children.filter((child) => {
    const att = mockAttendance.find(
      (a) => a.childId === child.id && a.date === TODAY
    );
    return !att || att.status !== "present";
  });

  const backHref = `/prototype/group?group=${groupId}`;

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

      <header>
        <h1 className="text-xl font-semibold">Entgegennehmen</h1>
        <p className="text-sm text-muted-foreground">
          Kinder einchecken · {notCheckedIn.length} noch nicht anwesend
        </p>
      </header>

      <div className="space-y-3">
        {children.map((child) => {
          const att = mockAttendance.find(
            (a) => a.childId === child.id && a.date === TODAY
          );
          const isPresent = att?.status === "present";
          const isAbsent = att?.status === "absent";

          return (
            <Card key={child.id}>
              <CardContent className="space-y-2 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {child.firstName} {child.lastName}
                  </p>
                  <div className="flex gap-1">
                    {!isPresent && !isAbsent && (
                      <>
                        <Button type="button" size="sm">Check-in</Button>
                        <Button type="button" size="sm" variant="outline">
                          Abmelden
                        </Button>
                      </>
                    )}
                    {isPresent && (
                      <span className="text-xs text-green-600">
                        ✓ {att?.checkInTime}
                      </span>
                    )}
                    {isAbsent && (
                      <span className="text-xs text-muted-foreground">
                        Abwesend
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Info von Eltern
                  </label>
                  <textarea
                    placeholder="Alles in Ordnung"
                    className="mt-0.5 w-full rounded border bg-background px-2 py-1.5 text-sm"
                    rows={1}
                    readOnly
                  />
                </div>
                {!isPresent && !isAbsent && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-muted-foreground"
                  >
                    Alles in Ordnung
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
