"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { usePrototype } from "@/context/PrototypeContext";
import {
  mockTaskAssignments,
  mockStaff,
  mockStaffBreaks,
} from "@/lib/mock";

const TODAY = "2025-02-19";

const MEAL_LABELS = {
  znueni: "Znüni",
  lunch: "Mittagessen",
  zvieri: "Zvieri",
} as const;

export function AblaufDisplayMock() {
  const { plannedLunchItems, plannedZnüni, plannedZvieri } = usePrototype();
  const tasks = mockTaskAssignments.filter((t) => t.date === TODAY);
  const breaks = mockStaffBreaks.filter((b) => b.date === TODAY);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/prototype/group"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Zurück
        </Link>
        <Link
          href="/prototype/ablauf/eingabe"
          className="text-sm font-medium text-primary hover:underline"
        >
          Eingabe
        </Link>
      </div>

      <header>
        <h1 className="text-xl font-semibold">Ablauf</h1>
        <p className="text-sm text-muted-foreground">Mi 19. Feb 2025</p>
      </header>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Mahlzeiten
        </h2>
        <div className="space-y-2">
          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <span className="text-lg">🍽</span>
              <div>
                <p className="font-medium">{MEAL_LABELS.znueni}</p>
                <p className="text-sm text-muted-foreground">
                  {plannedZnüni || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-3 p-3">
              <span className="text-lg">🍽</span>
              <div>
                <p className="font-medium">{MEAL_LABELS.lunch}</p>
                <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                  {plannedLunchItems.length > 0 ? (
                    plannedLunchItems.map((item, i) => (
                      <li key={i}>{item || `(Item ${i + 1})`}</li>
                    ))
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-3">
              <span className="text-lg">🍽</span>
              <div>
                <p className="font-medium">{MEAL_LABELS.zvieri}</p>
                <p className="text-sm text-muted-foreground">
                  {plannedZvieri || "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Tagesaufgaben
        </h2>
        <div className="space-y-2">
          {tasks.map((t) => (
            <Card key={`${t.taskId}-${t.staffId}`}>
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium">{t.taskName}</p>
                  <p className="text-xs text-muted-foreground">{t.staffName}</p>
                </div>
                <span
                  className={
                    t.done ? "text-green-600" : "text-muted-foreground"
                  }
                >
                  {t.done ? "✓" : "○"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Pausen
        </h2>
        <Card>
          <CardContent className="p-3">
            <div className="space-y-2">
              {mockStaff.map((staff) => {
                const staffBreak = breaks.find((b) => b.staffId === staff.id);
                return (
                  <div
                    key={staff.id}
                    className="flex justify-between text-sm"
                  >
                    <span>{staff.name}</span>
                    <span className="text-muted-foreground">
                      {staffBreak
                        ? `${staffBreak.startTime}–${staffBreak.endTime}`
                        : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
