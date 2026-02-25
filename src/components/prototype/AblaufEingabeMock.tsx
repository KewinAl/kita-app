"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePrototype } from "@/context/PrototypeContext";
import {
  mockStaff,
} from "@/lib/mock";
import { PROTOTYPE_TODAY, clampToCalendarWindow, formatDateShort } from "@/lib/prototypeCalendar";

const TODAY = PROTOTYPE_TODAY;

const MEAL_LABELS = {
  znueni: "Znüni",
  lunch: "Mittagessen",
  zvieri: "Zvieri",
} as const;

export function AblaufEingabeMock() {
  const searchParams = useSearchParams();
  const selectedDate = clampToCalendarWindow(searchParams.get("date") ?? TODAY);
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

  const tasks = getTaskAssignments(selectedDate);
  const breaks = getBreaks(selectedDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/prototype/ablauf?date=${selectedDate}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Ablauf
        </Link>
      </div>

      <header>
        <h1 className="text-xl font-semibold">Ablauf — Eingabe</h1>
        <p className="text-sm text-muted-foreground">{formatDateShort(selectedDate)}</p>
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
                value={getPlannedZnüni(selectedDate)}
                onChange={(e) => setPlannedZnüni(e.target.value, selectedDate)}
                placeholder="z.B. Obst, Brot"
                className="w-full rounded border bg-background px-3 py-2 text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 p-3">
              <label className="text-sm font-medium">{MEAL_LABELS.lunch}</label>
              {selectedDate > TODAY ? (
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
            <CardContent className="space-y-1 p-3">
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

      <Button
        type="button"
        className="w-full"
        onClick={() => copyPlanToAllKids(selectedDate)}
      >
        Speichern & an Gruppe kopieren
      </Button>
    </div>
  );
}
