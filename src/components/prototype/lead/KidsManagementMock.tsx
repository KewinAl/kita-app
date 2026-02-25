"use client";

import { useMemo, useState } from "react";
import { mockGroups } from "@/lib/mock";
import { DaySchedule } from "@/lib/mock/children";
import { usePrototypeLead } from "@/context/PrototypeLeadContext";

const DAY_SCHEDULE_OPTIONS: { value: DaySchedule; label: string }[] = [
  { value: "full", label: "Ganztag" },
  { value: "morning", label: "Vormittag" },
  { value: "morning_lunch", label: "Vormittag + Mittag" },
  { value: "afternoon", label: "Nachmittag" },
  { value: "lunch_afternoon", label: "Mittag + Nachmittag" },
];

export function KidsManagementMock() {
  const { children, archivedChildren, addChild, updateChild, setChildArchived } =
    usePrototypeLead();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "2022-01-01",
    groupId: mockGroups[0]?.id ?? "g1",
    daySchedule: "full" as DaySchedule,
  });

  const sortedChildren = useMemo(
    () =>
      children
        .slice()
        .sort((a, b) =>
          `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
        ),
    [children]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-semibold">Kinderverwaltung</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Personendaten anpassen, neue Kinder erfassen und bestehende archivieren.
      </p>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Neues Kind erfassen</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-5">
          <input
            value={form.firstName}
            onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            placeholder="Vorname"
            className="rounded border bg-background px-3 py-2 text-sm"
          />
          <input
            value={form.lastName}
            onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            placeholder="Nachname"
            className="rounded border bg-background px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
            className="rounded border bg-background px-3 py-2 text-sm"
          />
          <select
            value={form.groupId}
            onChange={(e) => setForm((prev) => ({ ...prev, groupId: e.target.value }))}
            className="rounded border bg-background px-3 py-2 text-sm"
          >
            {mockGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <select
            value={form.daySchedule}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, daySchedule: e.target.value as DaySchedule }))
            }
            className="rounded border bg-background px-3 py-2 text-sm"
          >
            {DAY_SCHEDULE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground md:col-span-2"
            onClick={() => {
              if (!form.firstName.trim() || !form.lastName.trim()) return;
              addChild({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                dateOfBirth: form.dateOfBirth,
                groupId: form.groupId,
                daySchedule: form.daySchedule,
              });
              setForm((prev) => ({ ...prev, firstName: "", lastName: "" }));
            }}
          >
            Kind hinzufügen
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Aktive Kinder</h2>
        <div className="mt-2 space-y-2">
          {sortedChildren.map((child) => (
            <article key={child.id} className="rounded border bg-muted/20 p-2">
              <div className="grid gap-2 md:grid-cols-6">
                <input
                  value={child.firstName}
                  onChange={(e) => updateChild(child.id, { firstName: e.target.value })}
                  className="rounded border bg-background px-2 py-1 text-sm"
                />
                <input
                  value={child.lastName}
                  onChange={(e) => updateChild(child.id, { lastName: e.target.value })}
                  className="rounded border bg-background px-2 py-1 text-sm"
                />
                <input
                  type="date"
                  value={child.dateOfBirth}
                  onChange={(e) => updateChild(child.id, { dateOfBirth: e.target.value })}
                  className="rounded border bg-background px-2 py-1 text-sm"
                />
                <select
                  value={child.groupId}
                  onChange={(e) => updateChild(child.id, { groupId: e.target.value })}
                  className="rounded border bg-background px-2 py-1 text-sm"
                >
                  {mockGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <select
                  value={child.daySchedule ?? "full"}
                  onChange={(e) =>
                    updateChild(child.id, { daySchedule: e.target.value as DaySchedule })
                  }
                  className="rounded border bg-background px-2 py-1 text-sm"
                >
                  {DAY_SCHEDULE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="rounded border px-2 py-1 text-sm hover:bg-muted"
                  onClick={() => setChildArchived(child.id, true)}
                >
                  Archivieren
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Archivierte Kinder</h2>
        <div className="mt-2 space-y-1">
          {archivedChildren.length === 0 ? (
            <p className="text-xs text-muted-foreground">Keine archivierten Einträge.</p>
          ) : (
            archivedChildren.map((child) => (
              <div key={child.id} className="flex items-center justify-between rounded border p-2">
                <span className="text-sm">
                  {child.firstName} {child.lastName}
                </span>
                <button
                  type="button"
                  className="rounded border px-2 py-1 text-xs hover:bg-muted"
                  onClick={() => setChildArchived(child.id, false)}
                >
                  Reaktivieren
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
