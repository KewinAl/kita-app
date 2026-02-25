"use client";

import { usePrototypeLead } from "@/context/PrototypeLeadContext";

export function KitaSettingsMock() {
  const {
    spotsPerStaff,
    setSpotsPerStaff,
    staffingRuleSwitches,
    setStaffingRuleSwitch,
    calendarWindowDays,
    setCalendarWindowDays,
    featureFlags,
    setFeatureFlag,
    shiftDisplayFormat,
    setShiftDisplayFormat,
  } = usePrototypeLead();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-xl font-semibold">Kitaweite Einstellungen</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Prototypische Struktur für ratio/logik, Kalenderdefaults, Zugriffsrahmen und Feature-Flags.
      </p>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Betreuungsschlüssel</h2>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={spotsPerStaff}
            onChange={(e) => setSpotsPerStaff(Number(e.target.value))}
            className="h-9 w-24 rounded border bg-background px-2 text-sm"
          />
          <p className="text-xs text-muted-foreground">Spots pro Mitarbeitende (pro Kita anpassbar)</p>
        </div>
      </section>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Staffing-Regel Schalter (Simulation)</h2>
        <div className="mt-2 grid gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={staffingRuleSwitches.enforceEfzRequirement}
              onChange={(e) =>
                setStaffingRuleSwitch("enforceEfzRequirement", e.target.checked)
              }
            />
            EFZ-Mindestabdeckung aktiv
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={staffingRuleSwitches.requireAdditionalStaffOverRatio}
              onChange={(e) =>
                setStaffingRuleSwitch("requireAdditionalStaffOverRatio", e.target.checked)
              }
            />
            Zusatzperson bei Spots &gt; Ratio aktiv
          </label>
        </div>
      </section>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Darstellung Schichtcodes</h2>
        <div className="mt-2 flex items-center gap-2">
          <select
            value={shiftDisplayFormat}
            onChange={(e) => setShiftDisplayFormat(e.target.value as "number" | "prefixed" | "letter")}
            className="h-9 rounded border bg-background px-2 text-sm"
          >
            <option value="number">Nur Zahl (1-6)</option>
            <option value="prefixed">Mit Präfix (S1-S6)</option>
            <option value="letter">Buchstaben (A-F)</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Gilt für die Anzeige im Dienstplan.
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Kalender Defaults (Placeholder)</h2>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={calendarWindowDays}
            onChange={(e) => setCalendarWindowDays(Number(e.target.value))}
            className="h-9 w-24 rounded border bg-background px-2 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Tage-Fenster im Prototyp (für spätere zentrale Konfiguration vorbereitet)
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Feature Flags (Placeholder)</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(Object.keys(featureFlags) as Array<keyof typeof featureFlags>).map((key) => (
            <label key={key} className="flex items-center justify-between rounded border p-2 text-sm">
              <span>{key}</span>
              <input
                type="checkbox"
                checked={featureFlags[key]}
                onChange={(e) => setFeatureFlag(key, e.target.checked)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Role/Access Konfiguration (Read-only Placeholder)</h2>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li>`parent`: nur eigene Kinddaten und freigegebene Inhalte</li>
          <li>`general_staff`: operative Tagesabläufe</li>
          <li>`kita_lead`: operative + leitungsbezogene Module</li>
          <li>`org_admin`: vollständige Organisationsverwaltung</li>
          <li>`technical_support`: Supportzugriff mit späterem Audit/Policy-Flow</li>
        </ul>
      </section>
    </main>
  );
}
