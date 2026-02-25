"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockChildren,
  mockDayLogEntries,
  mockAttendance,
} from "@/lib/mock";
import type { DayLogEntry, MealData, NapData, ActivityData, IncidentData } from "@/lib/mock";

const TODAY = "2025-02-19";

function MealEntry({ data }: { data: MealData }) {
  const labels = {
    breakfast: "Frühstück",
    lunch: "Mittagessen",
    snack: "Znüni/Zvieri",
  };
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
      <span className="font-medium">
        {data.startTime}–{data.endTime}
      </span>
      <span className="text-muted-foreground">({qualityLabels[data.quality]})</span>
    </div>
  );
}

function ActivityEntry({ data }: { data: ActivityData }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>🎨</span>
      <span className="font-medium">{data.category}</span>
      {data.note && (
        <span className="text-muted-foreground">— {data.note}</span>
      )}
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
        <p className="pl-6 text-xs text-muted-foreground">
          Massnahmen: {data.actionsTaken}
        </p>
      )}
    </div>
  );
}

function LogEntry({ entry }: { entry: DayLogEntry }) {
  return (
    <div className="border-b py-2 last:border-0">
      <div className="mb-1 text-xs text-muted-foreground">
        {entry.createdAt ?? "—"}
      </div>
      {entry.type === "meal" && entry.data && (
        <MealEntry data={entry.data as MealData} />
      )}
      {entry.type === "nap" && entry.data && (
        <NapEntry data={entry.data as NapData} />
      )}
      {entry.type === "activity" && entry.data && (
        <ActivityEntry data={entry.data as ActivityData} />
      )}
      {entry.type === "incident" && entry.data && (
        <IncidentEntry data={entry.data as IncidentData} />
      )}
      {entry.type === "photo" && (
        <div className="flex items-center gap-2 text-sm">
          <span>📸</span>
          <span className="text-muted-foreground">Foto hinzugefügt</span>
          <div className="h-16 w-20 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
            [Bild]
          </div>
        </div>
      )}
    </div>
  );
}

export function ChildDayLogMock({ childId }: { childId: string }) {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group");
  const child = mockChildren.find((c) => c.id === childId);
  const backHref = groupId ? `/prototype/group?group=${groupId}` : "/prototype/group";
  const attendance = mockAttendance.find(
    (a) => a.childId === childId && a.date === TODAY
  );
  const entries = mockDayLogEntries
    .filter((e) => e.childId === childId && e.date === TODAY)
    .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));

  if (!child) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href={backHref} className="text-sm text-muted-foreground hover:underline">
          ← Zurück zur Gruppe
        </Link>
      </div>

      <header>
        <h1 className="text-xl font-semibold">
          {child.firstName} {child.lastName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {attendance?.status === "present" && attendance.checkInTime
            ? `✓ Eingecheckt ${attendance.checkInTime}`
            : "Tageslog — 19. Feb 2025"}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline">
          🍽 Mahlzeit
        </Button>
        <Button size="sm" variant="outline">
          😴 Schlaf
        </Button>
        <Button size="sm" variant="outline">
          🎨 Aktivität
        </Button>
        <Link href={`/prototype/photo/${childId}`}>
          <Button size="sm" variant="outline">
            📸 Foto
          </Button>
        </Link>
        <Link href={`/prototype/incident/${childId}`}>
          <Button size="sm" variant="outline">
            ⚠️ Zwischenfall
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Heutige Einträge</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            entries.map((entry) => <LogEntry key={entry.id} entry={entry} />)
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Noch keine Einträge für heute.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
