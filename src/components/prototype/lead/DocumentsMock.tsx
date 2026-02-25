"use client";

import { useMemo, useState } from "react";
import {
  LeadDocumentCategory,
  usePrototypeLead,
} from "@/context/PrototypeLeadContext";

const CATEGORY_LABELS: Record<LeadDocumentCategory, string> = {
  kita_allgemein: "Kita allgemein",
  eltern: "Elternbezogen",
  termin_notiz: "Terminnotiz",
  vertragliches: "Verträge / Rechtliches",
};

export function DocumentsMock() {
  const { children, documents, appointments, addDocument } = usePrototypeLead();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<LeadDocumentCategory>("kita_allgemein");
  const [linkedAppointmentId, setLinkedAppointmentId] = useState("");
  const [linkedChildId, setLinkedChildId] = useState("");
  const [notes, setNotes] = useState("");

  const grouped = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(CATEGORY_LABELS) as LeadDocumentCategory[]).map((key) => [
          key,
          documents.filter((doc) => doc.category === key),
        ])
      ),
    [documents]
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-xl font-semibold">Dokumente</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Zentrale Ablage für Kita-Dokumente, Elterndokumente und Terminnotizen.
      </p>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Dokument hinzufügen</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel"
            className="rounded border bg-background px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as LeadDocumentCategory)}
            className="rounded border bg-background px-3 py-2 text-sm"
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={linkedAppointmentId}
            onChange={(e) => setLinkedAppointmentId(e.target.value)}
            className="rounded border bg-background px-3 py-2 text-sm"
          >
            <option value="">Termin verknüpfen (optional)</option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                {appointment.date} {appointment.time} · {appointment.title}
              </option>
            ))}
          </select>
          <select
            value={linkedChildId}
            onChange={(e) => setLinkedChildId(e.target.value)}
            className="rounded border bg-background px-3 py-2 text-sm"
          >
            <option value="">Kind verknüpfen (optional)</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Kurznotiz"
            className="rounded border bg-background px-3 py-2 text-sm md:col-span-2"
          />
          <button
            type="button"
            className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => {
              if (!title.trim()) return;
              addDocument({
                title: title.trim(),
                category,
                linkedAppointmentId: linkedAppointmentId || undefined,
                linkedChildId: linkedChildId || undefined,
                notes: notes || undefined,
              });
              setTitle("");
              setLinkedAppointmentId("");
              setLinkedChildId("");
              setNotes("");
            }}
          >
            Dokument speichern
          </button>
        </div>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-2">
        {(Object.keys(CATEGORY_LABELS) as LeadDocumentCategory[]).map((categoryKey) => (
          <article key={categoryKey} className="rounded-lg border bg-background p-3">
            <h3 className="text-sm font-medium">{CATEGORY_LABELS[categoryKey]}</h3>
            <div className="mt-2 space-y-2">
              {(grouped[categoryKey] ?? []).map((doc) => (
                <div key={doc.id} className="rounded border bg-muted/30 p-2">
                  <p className="text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.createdAt} ·
                    {doc.linkedAppointmentId
                      ? ` Termin: ${
                          appointments.find((a) => a.id === doc.linkedAppointmentId)?.title ?? "?"
                        }`
                      : " Kein Termin"}{" "}
                    ·
                    {doc.linkedChildId
                      ? ` Kind: ${
                          children.find((c) => c.id === doc.linkedChildId)?.firstName ?? "?"
                        }`
                      : " Kein Kind"}
                  </p>
                  {doc.notes ? (
                    <p className="mt-1 text-xs text-muted-foreground">{doc.notes}</p>
                  ) : null}
                </div>
              ))}
              {(grouped[categoryKey] ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground">Noch keine Einträge.</p>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
