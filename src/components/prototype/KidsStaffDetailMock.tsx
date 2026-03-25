"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  dayScheduleLabel,
  emptyChildCareProfile,
  mockGroups,
} from "@/lib/mock";
import { usePrototypeLead } from "@/context/PrototypeLeadContext";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border bg-muted/20 px-3 py-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{children || "—"}</p>
    </div>
  );
}

export function KidsStaffDetailMock({ childId }: { childId: string }) {
  const { children, childProfilesById } = usePrototypeLead();
  const child = useMemo(() => children.find((c) => c.id === childId), [children, childId]);
  const profile = childProfilesById[childId] ?? emptyChildCareProfile();
  const group = child ? mockGroups.find((g) => g.id === child.groupId) : undefined;

  if (!child) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-muted-foreground">Kind nicht gefunden.</p>
        <Link href="/prototype/kids" className="mt-3 inline-block text-sm font-medium text-primary">
          Zurück zur Übersicht
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/prototype/kids"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← Alle Kinder
          </Link>
          <h1 className="mt-2 text-xl font-semibold">
            {child.firstName} {child.lastName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {group?.name ?? child.groupId} · Geb.{" "}
            {new Date(child.dateOfBirth).toLocaleDateString("de-CH")} ·{" "}
            {dayScheduleLabel(child.daySchedule)}
          </p>
        </div>
      </div>

      <section className="mt-6 space-y-3">
        <h2 className="text-sm font-medium text-foreground">Gesundheit &amp; Sicherheit</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Allergien">{profile.allergies}</Field>
          <Field label="Medizinisches / Besonderheiten">{profile.medicalInfo}</Field>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-sm font-medium text-foreground">Kontakte</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Erziehungsberechtigt / Bezugsperson">{profile.parentName}</Field>
          <Field label="Erreichbarkeit Notfall">{profile.emergencyNumber}</Field>
          <Field label="Ersatzkontakt Name">{profile.backupContactName}</Field>
          <Field label="Ersatzkontakt Telefon">{profile.backupContactPhone}</Field>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-sm font-medium text-foreground">Rhythmus &amp; Ruhe</h2>
        <Field label="Schlaf / Gewohnheiten">{profile.sleepRoutine}</Field>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        Änderungen an Stammdaten und Zuweisungen nur in der Kinderverwaltung.
      </p>
    </main>
  );
}
