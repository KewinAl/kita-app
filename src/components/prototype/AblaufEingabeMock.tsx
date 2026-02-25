"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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

export function AblaufEingabeMock() {
  const {
    plannedLunchItems,
    plannedZnüni,
    plannedZvieri,
    setPlannedZnüni,
    setPlannedZvieri,
    addLunchItem,
    removeLunchItem,
    updateLunchItem,
    copyPlanToAllKids,
  } = usePrototype();

  const tasks = mockTaskAssignments.filter((t) => t.date === TODAY);
  const breaks = mockStaffBreaks.filter((b) => b.date === TODAY);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/prototype/ablauf"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Ablauf
        </Link>
      </div>

      <header>
        <h1 className="text-xl font-semibold">Ablauf — Eingabe</h1>
        <p className="text-sm text-muted-foreground">Mi 19. Feb 2025</p>
      </header>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Mahlzeiten
        </h2>
        <div className="space-y-2">
          <Card>
            <CardContent className="space-y-1 p-3">
              <label className="text-sm font-medium">{MEAL_LABELS.znueni}</label>
              <input
                type="text"
                value={plannedZnüni}
                onChange={(e) => setPlannedZnüni(e.target.value)}
                placeholder="z.B. Obst, Brot"
                className="w-full rounded border bg-background px-3 py-2 text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 p-3">
              <label className="text-sm font-medium">{MEAL_LABELS.lunch}</label>
              <p className="text-xs text-muted-foreground">
                Einzelne Items (z.B. Spaghetti, Sauce, Salat)
              </p>
              {plannedLunchItems.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateLunchItem(i, e.target.value)}
                    placeholder={`Item ${i + 1}`}
                    className="flex-1 rounded border bg-background px-3 py-2 text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeLunchItem(i)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button type="button" size="sm" variant="outline" onClick={() => addLunchItem()}>
                + Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-1 p-3">
              <label className="text-sm font-medium">{MEAL_LABELS.zvieri}</label>
              <input
                type="text"
                value={plannedZvieri}
                onChange={(e) => setPlannedZvieri(e.target.value)}
                placeholder="z.B. Joghurt, Kekse"
                className="w-full rounded border bg-background px-3 py-2 text-sm"
              />
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
                <Button type="button" size="sm" variant={t.done ? "default" : "outline"}>
                  {t.done ? "✓" : "Erledigt"}
                </Button>
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
          <CardContent className="space-y-2 p-3">
            {mockStaff.map((staff) => {
              const staffBreak = breaks.find((b) => b.staffId === staff.id);
              return (
                <div key={staff.id} className="flex items-center gap-2">
                  <span className="w-24 text-sm">{staff.name}</span>
                  <input
                    type="text"
                    defaultValue={staffBreak?.startTime ?? ""}
                    placeholder="Von"
                    className="w-16 rounded border bg-background px-2 py-1 text-sm"
                  />
                  <span className="text-muted-foreground">–</span>
                  <input
                    type="text"
                    defaultValue={staffBreak?.endTime ?? ""}
                    placeholder="Bis"
                    className="w-16 rounded border bg-background px-2 py-1 text-sm"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <Button type="button" className="w-full" onClick={() => copyPlanToAllKids()}>
        Speichern & an Gruppe kopieren
      </Button>
    </div>
  );
}
