"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  dayScheduleLabel,
  emptyChildCareProfile,
  mockGroups,
} from "@/lib/mock";
import { usePrototypeLead } from "@/context/PrototypeLeadContext";

export function KidsStaffOverviewMock() {
  const { children, childProfilesById } = usePrototypeLead();
  const [filterGroupId, setFilterGroupId] = useState<string>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return children
      .filter((c) => filterGroupId === "all" || c.groupId === filterGroupId)
      .filter((c) => {
        if (!q) return true;
        const hay = `${c.firstName} ${c.lastName}`.toLowerCase();
        return hay.includes(q);
      })
      .slice()
      .sort((a, b) =>
        `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
      );
  }, [children, filterGroupId, query]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Kinder</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Stammdaten und wichtige Betreuungsinfos pro Kind — für das Team im Alltag.
          </p>
        </div>
        <Link
          href="/prototype/lead/kids/check"
          className="rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Daten-Check
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border bg-background p-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Gruppe</span>
          <select
            value={filterGroupId}
            onChange={(e) => setFilterGroupId(e.target.value)}
            className="rounded border bg-background px-2 py-1.5 text-sm"
          >
            <option value="all">Alle</option>
            {mockGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[12rem] flex-1 items-center gap-2 text-sm">
          <span className="shrink-0 text-muted-foreground">Suche</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name…"
            className="w-full rounded border bg-background px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <ul className="mt-4 divide-y rounded-lg border bg-background">
        {rows.map((child) => {
          const group = mockGroups.find((g) => g.id === child.groupId);
          const profile = childProfilesById[child.id] ?? emptyChildCareProfile();
          const allergyShort =
            profile.allergies.trim() || profile.medicalInfo.trim()
              ? [profile.allergies.trim(), profile.medicalInfo.trim()].filter(Boolean).join(" · ")
              : "Keine Angaben";
          return (
            <li key={child.id} className="flex flex-wrap items-center gap-3 p-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">
                  {child.firstName} {child.lastName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {group?.name ?? child.groupId} · Geb.{" "}
                  {new Date(child.dateOfBirth).toLocaleDateString("de-CH")} ·{" "}
                  {dayScheduleLabel(child.daySchedule)}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-amber-900/90 dark:text-amber-200/90">
                  {allergyShort}
                </p>
              </div>
              <Link
                href={`/prototype/kids/${child.id}`}
                className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Öffnen
              </Link>
            </li>
          );
        })}
      </ul>

      {rows.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Keine Treffer für die aktuelle Filterung.
        </p>
      )}
    </main>
  );
}
