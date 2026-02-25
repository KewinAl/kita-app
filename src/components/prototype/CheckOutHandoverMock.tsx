"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  mockChildren,
  mockDayLogEntries,
  mockGroups,
} from "@/lib/mock";
import type { DayLogEntry, MealData, NapData, ActivityData, IncidentData } from "@/lib/mock";
import { usePrototype } from "@/context/PrototypeContext";
import { GroupSwitcherMock } from "./GroupSwitcherMock";

import { PROTOTYPE_TODAY, clampToCalendarWindow } from "@/lib/prototypeCalendar";

const TODAY = PROTOTYPE_TODAY;

function MealEntry({ data }: { data: MealData }) {
  const labels = { breakfast: "Frühstück", lunch: "Mittagessen", snack: "Znüni/Zvieri" };
  const options = {
    ate_well: "Hat gut gegessen",
    ate_some: "Hat etwas gegessen",
    ate_little: "Hat wenig gegessen",
    didnt_eat: "Hat nicht gegessen",
  };
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>🍽</span>
      <span className="font-medium">{labels[data.mealType]}:</span>
      <span className="text-muted-foreground">{options[data.option]}</span>
    </div>
  );
}

function NapEntry({ data }: { data: NapData }) {
  const qualityLabels = { good: "Gut", restless: "Unruhig", short: "Kurz" };
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>😴</span>
      <span className="font-medium">{data.startTime}–{data.endTime}</span>
      <span className="text-muted-foreground">({qualityLabels[data.quality]})</span>
    </div>
  );
}

function ActivityEntry({ data }: { data: ActivityData }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>🎨</span>
      <span className="font-medium">{data.category}</span>
      {data.note && <span className="text-muted-foreground">— {data.note}</span>}
    </div>
  );
}

function IncidentEntry({ data }: { data: IncidentData }) {
  const typeLabels = { injury: "Verletzung", illness: "Krankheit", conflict: "Konflikt" };
  return (
    <div className="space-y-1 text-sm">
      <div className="flex items-center gap-2">
        <span>⚠️</span>
        <span className="font-medium">{typeLabels[data.type]}</span>
      </div>
      <p className="pl-6 text-muted-foreground">{data.description}</p>
      {data.actionsTaken && (
        <p className="pl-6 text-xs text-muted-foreground">Massnahmen: {data.actionsTaken}</p>
      )}
    </div>
  );
}

function DayLogPreview({ childId, dateKey }: { childId: string; dateKey: string }) {
  const entries = mockDayLogEntries
    .filter((e) => e.childId === childId && e.date === dateKey)
    .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));

  const meals = entries.filter((e) => e.type === "meal");
  const naps = entries.filter((e) => e.type === "nap");
  const activities = entries.filter((e) => e.type === "activity");
  const incidents = entries.filter((e) => e.type === "incident");
  const photos = entries.filter((e) => e.type === "photo");

  const lunch = meals.find((m) => (m.data as MealData)?.mealType === "lunch");
  const snack = meals.find((m) => (m.data as MealData)?.mealType === "snack");
  const morningActivity = activities[0];
  const afternoonActivity = activities[1] ?? activities[0];

  return (
    <div className="space-y-2 pt-2">
      <div className="grid gap-1.5 text-sm">
        <HandoverRow icon="🎨" label="Aktivität Morgen" value={morningActivity ? (morningActivity.data as ActivityData)?.category : "—"} />
        <HandoverRow icon="🍽" label="Mittagessen" value={lunch ? mealSummary(lunch.data as MealData) : "—"} />
        <HandoverRow icon="😴" label="Schlaf/Pause" value={naps[0] ? napSummary(naps[0].data as NapData) : "—"} />
        <HandoverRow icon="🎨" label="Aktivität Nachmittag" value={afternoonActivity ? (afternoonActivity.data as ActivityData)?.category : "—"} />
        <HandoverRow icon="🍽" label="Zvieri" value={snack ? mealSummary(snack.data as MealData) : "—"} />
        <HandoverRow icon="📝" label="Infos für Eltern" value="—" />
      </div>
      {incidents.length > 0 && (
        <div className="mt-2 border-t pt-2">
          {incidents.map((e) => (
            <IncidentEntry key={e.id} data={e.data as IncidentData} />
          ))}
        </div>
      )}
      {photos.length > 0 && (
        <div className="mt-2 flex gap-1">
          {photos.map((p) => (
            <div key={p.id} className="h-12 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
              📸
            </div>
          ))}
        </div>
      )}
      <Button type="button" size="sm" variant="ghost" className="mt-2 h-7 text-xs text-muted-foreground">
        Windeln nachfüllen
      </Button>
    </div>
  );
}

function HandoverRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span>{icon}</span>
      <span className="min-w-[140px] text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function mealSummary(data: MealData) {
  const o = { ate_well: "Gut", ate_some: "Etwas", ate_little: "Wenig", didnt_eat: "Nicht" };
  return o[data.option] ?? "—";
}

function napSummary(data: NapData) {
  return `${data.startTime}–${data.endTime} (${data.quality === "good" ? "Gut" : data.quality === "short" ? "Kurz" : "Unruhig"})`;
}

interface CheckOutHandoverMockProps {
  groupId?: string;
}

export function CheckOutHandoverMock({ groupId }: CheckOutHandoverMockProps) {
  const searchParams = useSearchParams();
  const selectedDate = clampToCalendarWindow(searchParams.get("date") ?? TODAY);
  const { getDailyPresenceStatus } = usePrototype();
  const effectiveGroupId = groupId ?? mockGroups[0]?.id ?? "g1";
  const children =
    effectiveGroupId === "all"
      ? mockChildren
      : mockChildren.filter((c) => c.groupId === effectiveGroupId);
  const presentChildren = children.filter((child) => {
    return getDailyPresenceStatus(child.id, selectedDate) === "present";
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href={
            effectiveGroupId
              ? `/prototype/group?group=${effectiveGroupId}&date=${selectedDate}`
              : `/prototype/group?date=${selectedDate}`
          }
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Zurück
        </Link>
      </div>
      <GroupSwitcherMock basePath="/prototype/check-out" includeAllOption />

      <header>
        <h1 className="text-xl font-semibold">Abgeben</h1>
        <p className="text-sm text-muted-foreground">
          Übergabe an Eltern · {presentChildren.length} Kinder anwesend
        </p>
      </header>

      <Button type="button" variant="outline" className="w-full">
        Alle abgeholt
      </Button>

      <div className="space-y-2">
        {presentChildren.map((child) => {
          const isExpanded = expandedId === child.id;
          return (
            <Card key={child.id}>
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-2 p-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : child.id);
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="font-medium">
                      {child.firstName} {child.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isExpanded ? "▼ Tageslog ausblenden" : "▶ Tageslog für Übergabe anzeigen"}
                    </p>
                  </button>
                  <Button type="button" size="sm" className="shrink-0">
                    Abholen
                  </Button>
                </div>
                {isExpanded && (
                  <div className="border-t bg-muted/30 px-3 pb-3">
                    <DayLogPreview childId={child.id} dateKey={selectedDate} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
