"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mockGroups, mockStaff, type Staff } from "@/lib/mock";
import {
  usePrototypeLead,
  type LeadShiftCode,
  type ShiftDisplayFormat,
} from "@/context/PrototypeLeadContext";
import { usePrototypeAuth } from "@/context/PrototypeAuthContext";
import { PROTOTYPE_TODAY } from "@/lib/prototypeCalendar";
import { cn } from "@/lib/utils";

type ShiftCode = "1" | "2" | "3" | "4" | "5" | "6" | "SCHULE" | "FREI" | "EMPTY";
type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

type ShiftDefinition = {
  code: "1" | "2" | "3" | "4" | "5" | "6";
  time: string;
  break: string;
  roles: string;
  phase: "early" | "late";
};

const SHIFT_DEFINITIONS: ShiftDefinition[] = [
  { code: "1", time: "07:00 - 16:00", break: "30min", roles: "nur EFZ", phase: "early" },
  {
    code: "2",
    time: "08:00 - 17:00",
    break: "30min",
    roles: "nur Lernende/Praktikant",
    phase: "early",
  },
  {
    code: "3",
    time: "08:30 - 17:30",
    break: "30min",
    roles: "nur Lernende/Praktikant",
    phase: "early",
  },
  { code: "4", time: "09:00 - 18:30", break: "60min", roles: "nur EFZ", phase: "late" },
  { code: "5", time: "08:30 - 18:00", break: "60min", roles: "alle", phase: "late" },
  {
    code: "6",
    time: "08:45 - 18:15",
    break: "60min",
    roles: "nur Lernende/Praktikant",
    phase: "late",
  },
];

const SHIFT_BY_CODE = Object.fromEntries(
  SHIFT_DEFINITIONS.map((definition) => [definition.code, definition])
) as Record<ShiftDefinition["code"], ShiftDefinition>;

const WEEK_DAYS: { key: WeekdayKey; label: string; isWeekend: boolean }[] = [
  { key: "mon", label: "Mo", isWeekend: false },
  { key: "tue", label: "Di", isWeekend: false },
  { key: "wed", label: "Mi", isWeekend: false },
  { key: "thu", label: "Do", isWeekend: false },
  { key: "fri", label: "Fr", isWeekend: false },
  { key: "sat", label: "Sa", isWeekend: true },
  { key: "sun", label: "So", isWeekend: true },
];

const LEARNER_SCHOOL_DAYS: Record<string, WeekdayKey[]> = {
  s5: ["tue", "thu"],
  s8: ["mon", "wed"],
  s11: ["wed", "fri"],
};

const SUPPORT_ROTATION: Record<string, string[]> = {
  s0: ["g1", "g3", "g2", "g1", "g3"],
  s4: ["g2", "g1", "g3", "g2", "g1"],
  s6: ["g3", "g2", "g1", "g3", "g2"],
};

function isLearnerOrIntern(role: Staff["role"]) {
  return role === "Lernende" || role === "Praktikant";
}

function isEfz(role: Staff["role"]) {
  return role === "KL" || role === "GL" || role === "Miterzieher";
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1, 12, 0, 0));
}

function toDateKey(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function weekdayFromDate(date: Date): WeekdayKey {
  const day = date.getUTCDay();
  if (day === 1) return "mon";
  if (day === 2) return "tue";
  if (day === 3) return "wed";
  if (day === 4) return "thu";
  if (day === 5) return "fri";
  if (day === 6) return "sat";
  return "sun";
}

function shiftCodeForStaff(staff: Staff, weekday: WeekdayKey): ShiftCode {
  if (weekday === "sat" || weekday === "sun") return "FREI";

  if (isLearnerOrIntern(staff.role) && LEARNER_SCHOOL_DAYS[staff.id]?.includes(weekday)) {
    return "SCHULE";
  }

  if (staff.role === "GL") {
    return weekday === "mon" || weekday === "wed" || weekday === "fri" ? "1" : "4";
  }
  if (staff.role === "KL") return "5";
  if (staff.role === "Miterzieher") return "4";
  if (staff.role === "Praktikant") return weekday === "tue" || weekday === "thu" ? "6" : "3";
  // Lernende
  return weekday === "mon" || weekday === "thu" ? "6" : "2";
}

function addMonths(dateKey: string, offset: number) {
  const d = parseDateKey(dateKey);
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + offset);
  return toDateKey(d);
}

function getMonthDays(dateKey: string) {
  const base = parseDateKey(dateKey);
  const monthEnd = new Date(
    Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0, 12, 0, 0)
  );
  const days: { dateKey: string; weekday: WeekdayKey; dayLabel: string }[] = [];
  for (let day = 1; day <= monthEnd.getUTCDate(); day += 1) {
    const d = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), day, 12, 0, 0));
    days.push({
      dateKey: toDateKey(d),
      weekday: weekdayFromDate(d),
      dayLabel: `${day}`,
    });
  }
  return days;
}

function coverageStatusLabel(
  earlyEfz: number,
  earlyLearner: number,
  lateEfz: number,
  lateLearner: number
) {
  const missing: string[] = [];
  if (earlyEfz < 1) missing.push("früh EFZ");
  if (earlyLearner < 1) missing.push("früh Lern.");
  if (lateEfz < 1) missing.push("spät EFZ");
  if (lateLearner < 1) missing.push("spät Lern.");
  return missing;
}

function shiftBadgeClass(code: ShiftCode) {
  switch (code) {
    case "1":
      return "bg-rose-100 text-rose-900";
    case "2":
      return "bg-amber-100 text-amber-900";
    case "3":
      return "bg-lime-100 text-lime-900";
    case "4":
      return "bg-sky-100 text-sky-900";
    case "5":
      return "bg-violet-100 text-violet-900";
    case "6":
      return "bg-fuchsia-100 text-fuchsia-900";
    case "SCHULE":
      return "bg-orange-200 text-orange-950";
    case "FREI":
      return "bg-muted text-muted-foreground";
    case "EMPTY":
      return "bg-transparent text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatShiftCode(code: ShiftCode, format: ShiftDisplayFormat) {
  if (code === "FREI") return "Fr";
  if (code === "SCHULE") return "Sch";
  if (code === "EMPTY") return "";
  if (format === "number") return code;
  if (format === "prefixed") return `S${code}`;
  const letterMap: Record<string, string> = {
    "1": "A",
    "2": "B",
    "3": "C",
    "4": "D",
    "5": "E",
    "6": "F",
  };
  return letterMap[code] ?? code;
}

export function ShiftPlannerMock() {
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date") ?? PROTOTYPE_TODAY;
  const { role } = usePrototypeAuth();
  const { children, shiftDisplayFormat, getShiftOverride, setShiftOverride } =
    usePrototypeLead();
  const [isEditMode, setIsEditMode] = useState(false);
  const canManagePlan = role === "kita_lead" || role === "org_admin";

  const monthInfo = useMemo(() => {
    const base = parseDateKey(selectedDate);
    const monthStart = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), 1, 12, 0, 0));
    const days = getMonthDays(selectedDate);
    return {
      monthLabel: monthStart.toLocaleDateString("de-CH", {
        month: "long",
        year: "numeric",
      }),
      days,
      prevMonthDateKey: addMonths(toDateKey(monthStart), -1),
      nextMonthDateKey: addMonths(toDateKey(monthStart), 1),
    };
  }, [selectedDate]);

  const supportGroupFor = (staffId: string, weekday: WeekdayKey): string | null => {
    const weekdayIndexMap: Record<WeekdayKey, number> = {
      mon: 0,
      tue: 1,
      wed: 2,
      thu: 3,
      fri: 4,
      sat: -1,
      sun: -1,
    };
    const dayIndex = weekdayIndexMap[weekday];
    if (dayIndex < 0 || dayIndex > 4) return null;
    const rotation = SUPPORT_ROTATION[staffId];
    return rotation?.[dayIndex] ?? null;
  };

  const hrefForMonth = (targetDateKey: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("date", targetDateKey);
    return `/prototype/lead/shifts?${p.toString()}`;
  };

  const getEffectiveShiftCode = (staff: Staff, day: { dateKey: string; weekday: WeekdayKey }) => {
    const override = getShiftOverride(day.dateKey, staff.id);
    if (override) return override;
    if (day.dateKey > PROTOTYPE_TODAY) return "EMPTY";
    return shiftCodeForStaff(staff, day.weekday);
  };

  return (
    <main className="mx-auto w-full max-w-none px-2 py-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Dienstplanung</h1>
          <p className="text-sm text-muted-foreground">
            Monatsansicht im Tabellenformat mit Schichtcodes, Schultagen und Abdeckungswarnungen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canManagePlan ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditMode((prev) => !prev)}
                className="rounded border px-2 py-1 text-sm"
              >
                {isEditMode ? "Bearbeitung beenden" : "Plan bearbeiten"}
              </button>
            </>
          ) : null}
          <Link href={hrefForMonth(monthInfo.prevMonthDateKey)} className="rounded border px-2 py-1 text-sm">
            ←
          </Link>
          <span className="min-w-[150px] text-center text-sm font-medium">{monthInfo.monthLabel}</span>
          <Link href={hrefForMonth(monthInfo.nextMonthDateKey)} className="rounded border px-2 py-1 text-sm">
            →
          </Link>
        </div>
      </div>

      <section className="rounded-lg border bg-background">
        <table className="w-full table-fixed border-collapse text-xs">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="sticky left-0 z-10 w-28 bg-muted/40 px-1 py-1 text-left font-medium">
                Mitarbeitende
              </th>
              {monthInfo.days.map((day) => (
                <th key={day.dateKey} className="px-0 py-0.5 text-center font-medium">
                  <div className="leading-tight">
                    <div>{day.dayLabel}</div>
                    <div className="text-[9px] text-muted-foreground">
                      {WEEK_DAYS.find((d) => d.key === day.weekday)?.label}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockStaff.map((staff) => (
              <tr key={staff.id} className="border-b last:border-0">
                <td className="sticky left-0 z-10 bg-background px-1.5 py-0.5">
                  <p className="truncate text-xs font-medium">{staff.name}</p>
                  <p className="truncate text-[9px] text-muted-foreground">
                    {staff.role} · {staff.primaryGroupId ?? "kitaweit"}
                  </p>
                </td>
                {monthInfo.days.map((day) => {
                  const code = getEffectiveShiftCode(staff, day);
                  const supportGroup =
                    !staff.primaryGroupId &&
                    (code !== "FREI" && code !== "SCHULE" && code !== "EMPTY")
                      ? supportGroupFor(staff.id, day.weekday)
                      : null;
                  return (
                    <td key={`${staff.id}-${day.dateKey}`} className="px-0 py-0.5 text-center align-top">
                      {canManagePlan && isEditMode ? (
                        <select
                          value={code === "EMPTY" ? "" : code}
                          onChange={(e) =>
                            setShiftOverride(
                              day.dateKey,
                              staff.id,
                              e.target.value ? (e.target.value as LeadShiftCode) : undefined
                            )
                          }
                          className={cn(
                            "h-5 w-full rounded border px-0 text-[9px] font-semibold",
                            shiftBadgeClass(code)
                          )}
                        >
                          <option value="">-</option>
                          <option value="1">S1</option>
                          <option value="2">S2</option>
                          <option value="3">S3</option>
                          <option value="4">S4</option>
                          <option value="5">S5</option>
                          <option value="6">S6</option>
                          <option value="SCHULE">Sch</option>
                          <option value="FREI">Fr</option>
                        </select>
                      ) : (
                        <span
                          className={cn(
                            "inline-flex h-5 w-full items-center justify-center rounded text-[9px] font-semibold",
                            shiftBadgeClass(code)
                          )}
                        >
                          {formatShiftCode(code, shiftDisplayFormat)}
                        </span>
                      )}
                      {supportGroup ? (
                        <p className="truncate text-[8px] text-muted-foreground">{supportGroup}</p>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {canManagePlan ? (
        <section className="mt-4 space-y-2">
          <h2 className="text-sm font-medium">Monatswarnungen (nur Werktage)</h2>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {monthInfo.days
              .filter((day) => day.weekday !== "sat" && day.weekday !== "sun")
              .map((day) => (
            <article key={day.dateKey} className="rounded-lg border bg-background p-2">
              <p className="text-xs font-semibold text-muted-foreground">
                {day.dateKey} ({WEEK_DAYS.find((d) => d.key === day.weekday)?.label})
              </p>
              <div className="mt-1 space-y-1.5">
                {mockGroups.map((group) => {
                  const groupChildren = children.filter((child) => child.groupId === group.id);
                  const groupStaff = mockStaff.filter((staff) => {
                    if (staff.primaryGroupId === group.id) return true;
                    return supportGroupFor(staff.id, day.weekday) === group.id;
                  });

                  let earlyEfz = 0;
                  let earlyLearner = 0;
                  let lateEfz = 0;
                  let lateLearner = 0;

                  groupStaff.forEach((staff) => {
                    const code = getEffectiveShiftCode(staff, day);
                    if (code === "FREI" || code === "SCHULE" || code === "EMPTY") return;
                    const phase = SHIFT_BY_CODE[code as keyof typeof SHIFT_BY_CODE]?.phase;
                    if (phase === "early") {
                      if (isEfz(staff.role)) earlyEfz += 1;
                      if (isLearnerOrIntern(staff.role)) earlyLearner += 1;
                    } else if (phase === "late") {
                      if (isEfz(staff.role)) lateEfz += 1;
                      if (isLearnerOrIntern(staff.role)) lateLearner += 1;
                    }
                  });

                  const missing = coverageStatusLabel(
                    earlyEfz,
                    earlyLearner,
                    lateEfz,
                    lateLearner
                  );

                  return (
                    <div key={`${day.dateKey}-${group.id}`} className="rounded border p-1.5 text-xs">
                      <p className="font-medium">
                        {group.name} ({groupChildren.length} Kinder)
                      </p>
                      <p className="text-muted-foreground">
                        Früh: EFZ {earlyEfz} / Lern. {earlyLearner}
                      </p>
                      <p className="text-muted-foreground">
                        Spät: EFZ {lateEfz} / Lern. {lateLearner}
                      </p>
                      {missing.length > 0 ? (
                        <p className="mt-1 text-amber-700">Fehlt: {missing.join(", ")}</p>
                      ) : (
                        <p className="mt-1 text-emerald-700">Abdeckung ok</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-4 rounded-lg border bg-background p-3">
        <h2 className="text-sm font-medium">Schichtdefinitionen</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {SHIFT_DEFINITIONS.map((shift) => (
            <div key={shift.code} className="rounded border bg-muted/20 p-2 text-xs">
              <p className="font-semibold">Schicht {shift.code}</p>
              <p>{shift.time}</p>
              <p>Pause: {shift.break}</p>
              <p>Rolle: {shift.roles}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
