"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { mockGroups } from "@/lib/mock";
import {
  emergencyComplete,
  emptyChildCareProfile,
  healthComplete,
  sleepComplete,
  stammdatenComplete,
} from "@/lib/mock/childProfile";
import { usePrototypeAuth } from "@/context/PrototypeAuthContext";
import { usePrototypeLead } from "@/context/PrototypeLeadContext";
import { isLeadAdminRole } from "@/lib/permissions/prototypeAccess";

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={
        ok
          ? "inline-block size-2.5 rounded-full bg-emerald-600"
          : "inline-block size-2.5 rounded-full bg-amber-500"
      }
      title={ok ? "Vollständig" : "Lücke"}
      aria-label={ok ? "Vollständig" : "Unvollständig"}
    />
  );
}

export function ChildDataCheckMock() {
  const { role } = usePrototypeAuth();
  const { children, childProfilesById, updateChildProfile, updateChild } =
    usePrototypeLead();
  const [filterGroupId, setFilterGroupId] = useState<string>("all");
  const [onlyGaps, setOnlyGaps] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredChildren = useMemo(
    () =>
      children.filter((c) => filterGroupId === "all" || c.groupId === filterGroupId),
    [children, filterGroupId]
  );

  const rows = useMemo(() => {
    const list = filteredChildren
      .map((child) => {
        const profile = childProfilesById[child.id] ?? emptyChildCareProfile();
        const s = stammdatenComplete(child);
        const h = healthComplete(profile);
        const e = emergencyComplete(profile);
        const sl = sleepComplete(profile);
        const allOk = s && h && e && sl;
        return { child, profile, s, h, e, sl, allOk };
      })
      .sort((a, b) =>
        `${a.child.lastName} ${a.child.firstName}`.localeCompare(
          `${b.child.lastName} ${b.child.firstName}`
        )
      );
    return onlyGaps ? list.filter((r) => !r.allOk) : list;
  }, [filteredChildren, childProfilesById, onlyGaps]);

  const total = filteredChildren.length;
  const completeCount = useMemo(() => {
    return filteredChildren.filter((child) => {
      const profile = childProfilesById[child.id] ?? emptyChildCareProfile();
      return (
        stammdatenComplete(child) &&
        healthComplete(profile) &&
        emergencyComplete(profile) &&
        sleepComplete(profile)
      );
    }).length;
  }, [filteredChildren, childProfilesById]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Kinderdaten-Check</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Überblick über Stammdaten, Gesundheit &amp; Allergien, Notfallkontakte und
            Schlaf/Rhythmus. Ergänze fehlende Angaben direkt hier oder in der
            Kinderverwaltung.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/prototype/kids"
            className="rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Kinder-Übersicht
          </Link>
          {isLeadAdminRole(role) && (
            <Link
              href="/prototype/lead/kids"
              className="rounded-md border bg-amber-500/15 px-3 py-2 text-sm font-medium hover:bg-amber-500/25 dark:bg-amber-400/10 dark:hover:bg-amber-400/20"
            >
              Kinderverwaltung
            </Link>
          )}
        </div>
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
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyGaps}
            onChange={(e) => setOnlyGaps(e.target.checked)}
          />
          Nur Kinder mit Lücken
        </label>
        <p className="text-sm text-muted-foreground">
          {completeCount}/{total} in der Auswahl vollständig
        </p>
      </div>

      <div className="mt-2 overflow-x-auto rounded-lg border bg-background">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Kind</th>
              <th className="p-3">Stammdaten</th>
              <th className="p-3">Allergien / Medizin</th>
              <th className="p-3">Notfall</th>
              <th className="p-3">Schlaf</th>
              <th className="p-3 w-28"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  Keine Einträge für diese Filter.
                </td>
              </tr>
            ) : (
              rows.map(({ child, profile, s, h, e, sl, allOk }) => {
                const isOpen = openId === child.id;
                const groupName =
                  mockGroups.find((g) => g.id === child.groupId)?.name ?? child.groupId;
                return (
                  <Fragment key={child.id}>
                    <tr className={allOk ? "" : "bg-amber-500/5"}>
                      <td className="p-3">
                        <div className="font-medium">
                          {child.firstName} {child.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">{groupName}</div>
                      </td>
                      <td className="p-3">
                        <StatusDot ok={s} />
                      </td>
                      <td className="p-3">
                        <StatusDot ok={h} />
                      </td>
                      <td className="p-3">
                        <StatusDot ok={e} />
                      </td>
                      <td className="p-3">
                        <StatusDot ok={sl} />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          className="rounded border px-2 py-1 text-xs hover:bg-muted"
                          onClick={() => setOpenId(isOpen ? null : child.id)}
                        >
                          {isOpen ? "Schliessen" : "Bearbeiten"}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-t bg-muted/20">
                        <td colSpan={6} className="p-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <fieldset className="rounded border bg-background p-3">
                              <legend className="px-1 text-xs font-medium text-muted-foreground">
                                Stammdaten
                              </legend>
                              <div className="mt-2 grid gap-2">
                                <input
                                  value={child.firstName}
                                  onChange={(ev) =>
                                    updateChild(child.id, { firstName: ev.target.value })
                                  }
                                  className="rounded border px-2 py-1.5 text-sm"
                                  placeholder="Vorname"
                                />
                                <input
                                  value={child.lastName}
                                  onChange={(ev) =>
                                    updateChild(child.id, { lastName: ev.target.value })
                                  }
                                  className="rounded border px-2 py-1.5 text-sm"
                                  placeholder="Nachname"
                                />
                                <input
                                  type="date"
                                  value={child.dateOfBirth}
                                  onChange={(ev) =>
                                    updateChild(child.id, { dateOfBirth: ev.target.value })
                                  }
                                  className="rounded border px-2 py-1.5 text-sm"
                                />
                              </div>
                            </fieldset>
                            <fieldset className="rounded border bg-background p-3">
                              <legend className="px-1 text-xs font-medium text-muted-foreground">
                                Gesundheit
                              </legend>
                              <div className="mt-2 grid gap-2">
                                <textarea
                                  value={profile.allergies}
                                  onChange={(ev) =>
                                    updateChildProfile(child.id, {
                                      allergies: ev.target.value,
                                    })
                                  }
                                  className="min-h-[4rem] rounded border px-2 py-1.5 text-sm"
                                  placeholder="Allergien (auch «keine» dokumentieren)"
                                />
                                <textarea
                                  value={profile.medicalInfo}
                                  onChange={(ev) =>
                                    updateChildProfile(child.id, {
                                      medicalInfo: ev.target.value,
                                    })
                                  }
                                  className="min-h-[4rem] rounded border px-2 py-1.5 text-sm"
                                  placeholder="Medizinische Hinweise, Medikamente, Arzt"
                                />
                              </div>
                            </fieldset>
                            <fieldset className="rounded border bg-background p-3">
                              <legend className="px-1 text-xs font-medium text-muted-foreground">
                                Notfall &amp; Sorgeberechtigte
                              </legend>
                              <div className="mt-2 grid gap-2">
                                <input
                                  value={profile.parentName}
                                  onChange={(ev) =>
                                    updateChildProfile(child.id, {
                                      parentName: ev.target.value,
                                    })
                                  }
                                  className="rounded border px-2 py-1.5 text-sm"
                                  placeholder="Name Hauptansprechperson"
                                />
                                <input
                                  value={profile.emergencyNumber}
                                  onChange={(ev) =>
                                    updateChildProfile(child.id, {
                                      emergencyNumber: ev.target.value,
                                    })
                                  }
                                  className="rounded border px-2 py-1.5 text-sm"
                                  placeholder="Erreichbarkeit Notfall"
                                />
                                <input
                                  value={profile.backupContactName}
                                  onChange={(ev) =>
                                    updateChildProfile(child.id, {
                                      backupContactName: ev.target.value,
                                    })
                                  }
                                  className="rounded border px-2 py-1.5 text-sm"
                                  placeholder="Zweitkontakt Name (optional)"
                                />
                                <input
                                  value={profile.backupContactPhone}
                                  onChange={(ev) =>
                                    updateChildProfile(child.id, {
                                      backupContactPhone: ev.target.value,
                                    })
                                  }
                                  className="rounded border px-2 py-1.5 text-sm"
                                  placeholder="Zweitkontakt Telefon (optional)"
                                />
                              </div>
                            </fieldset>
                            <fieldset className="rounded border bg-background p-3">
                              <legend className="px-1 text-xs font-medium text-muted-foreground">
                                Schlaf / Rhythmus
                              </legend>
                              <textarea
                                value={profile.sleepRoutine}
                                onChange={(ev) =>
                                  updateChildProfile(child.id, {
                                    sleepRoutine: ev.target.value,
                                  })
                                }
                                className="mt-2 min-h-[7rem] w-full rounded border px-2 py-1.5 text-sm"
                                placeholder="Mittagsschlaf, Einschlafrituale, Besonderheiten …"
                              />
                            </fieldset>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
