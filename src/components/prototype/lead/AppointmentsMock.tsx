"use client";

import { useMemo, useState } from "react";
import { mockGroups, mockStaff } from "@/lib/mock";
import {
  AppointmentStatus,
  AppointmentType,
  usePrototypeLead,
} from "@/context/PrototypeLeadContext";

const TYPE_LABELS: Record<AppointmentType, string> = {
  elterngespraech: "Elterngespräch",
  aufnahme: "Aufnahmegespräch",
  follow_up: "Follow-up",
  beobachtung: "Besuch / Beobachtung",
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  planned: "Geplant",
  completed: "Abgeschlossen",
  cancelled: "Abgesagt",
};

export function AppointmentsMock() {
  const {
    children,
    appointments,
    addAppointment,
    setAppointmentStatus,
    documents,
    linkDocumentToAppointment,
  } = usePrototypeLead();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2025-02-19");
  const [time, setTime] = useState("16:00");
  const [type, setType] = useState<AppointmentType>("elterngespraech");
  const [groupId, setGroupId] = useState<string>("");
  const [childId, setChildId] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");

  const sortedAppointments = useMemo(
    () =>
      appointments
        .slice()
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
    [appointments]
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-xl font-semibold">Termine</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Elterngespräche, Besichtigungen und Folgetermine planen.
      </p>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Neuen Termin erstellen</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel"
            className="rounded border bg-background px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded border bg-background px-3 py-2 text-sm"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded border bg-background px-3 py-2 text-sm"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AppointmentType)}
            className="rounded border bg-background px-3 py-2 text-sm"
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="rounded border bg-background px-3 py-2 text-sm"
          >
            <option value="">Gruppe (optional)</option>
            {mockGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="rounded border bg-background px-3 py-2 text-sm"
          >
            <option value="">Kind (optional)</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
          <select
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="rounded border bg-background px-3 py-2 text-sm"
          >
            <option value="">Mitarbeitende (optional)</option>
            {mockStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => {
              if (!title.trim()) return;
              addAppointment({
                title: title.trim(),
                date,
                time,
                type,
                groupId: groupId || undefined,
                childId: childId || undefined,
                staffId: staffId || undefined,
                status: "planned",
              });
              setTitle("");
            }}
          >
            Termin anlegen
          </button>
        </div>
      </section>

      <section className="mt-4 space-y-2">
        {sortedAppointments.map((appointment) => (
          <article key={appointment.id} className="rounded-lg border bg-background p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium">{appointment.title}</p>
                <p className="text-xs text-muted-foreground">
                  {appointment.date} · {appointment.time} · {TYPE_LABELS[appointment.type]}
                </p>
              </div>
              <select
                value={appointment.status}
                onChange={(e) =>
                  setAppointmentStatus(appointment.id, e.target.value as AppointmentStatus)
                }
                className="rounded border bg-background px-2 py-1 text-xs"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Gruppe: {mockGroups.find((g) => g.id === appointment.groupId)?.name ?? "—"} · Kind:{" "}
              {appointment.childId
                ? `${children.find((c) => c.id === appointment.childId)?.firstName ?? ""} ${
                    children.find((c) => c.id === appointment.childId)?.lastName ?? ""
                  }`
                : "—"}{" "}
              · Zuständig: {mockStaff.find((s) => s.id === appointment.staffId)?.name ?? "—"}
            </div>
            <div className="mt-2">
              <label className="text-xs text-muted-foreground">Verknüpfte Notiz / Dokument</label>
              <select
                value={appointment.notesDocumentId ?? ""}
                onChange={(e) =>
                  linkDocumentToAppointment(appointment.id, e.target.value || undefined)
                }
                className="mt-1 w-full rounded border bg-background px-2 py-1 text-xs"
              >
                <option value="">Kein Dokument</option>
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
