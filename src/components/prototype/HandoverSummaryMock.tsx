"use client";

import { Button } from "@/components/ui/button";
import {
  mockDayLogEntries,
  type ActivityData,
  type IncidentData,
  type MealData,
  type NapData,
} from "@/lib/mock";

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
  const options = { ate_well: "Gut", ate_some: "Etwas", ate_little: "Wenig", didnt_eat: "Nicht" };
  return options[data.option] ?? "—";
}

function napSummary(data: NapData) {
  return `${data.startTime}–${data.endTime} (${data.quality === "good" ? "Gut" : data.quality === "short" ? "Kurz" : "Unruhig"})`;
}

interface HandoverSummaryMockProps {
  childId: string;
  dateKey: string;
  infosForParents?: string;
  showQuickAction?: boolean;
}

export function HandoverSummaryMock({
  childId,
  dateKey,
  infosForParents,
  showQuickAction = true,
}: HandoverSummaryMockProps) {
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
        <HandoverRow
          icon="🎨"
          label="Aktivität Morgen"
          value={morningActivity ? (morningActivity.data as ActivityData)?.category : "—"}
        />
        <HandoverRow
          icon="🍽"
          label="Mittagessen"
          value={lunch ? mealSummary(lunch.data as MealData) : "—"}
        />
        <HandoverRow
          icon="😴"
          label="Schlaf/Pause"
          value={naps[0] ? napSummary(naps[0].data as NapData) : "—"}
        />
        <HandoverRow
          icon="🎨"
          label="Aktivität Nachmittag"
          value={afternoonActivity ? (afternoonActivity.data as ActivityData)?.category : "—"}
        />
        <HandoverRow
          icon="🍽"
          label="Zvieri"
          value={snack ? mealSummary(snack.data as MealData) : "—"}
        />
        <HandoverRow icon="📝" label="Infos für Eltern" value={infosForParents || "—"} />
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
            <div
              key={p.id}
              className="h-12 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground"
            >
              📸
            </div>
          ))}
        </div>
      )}
      {showQuickAction && (
        <Button type="button" size="sm" variant="ghost" className="mt-2 h-7 text-xs text-muted-foreground">
          Windeln nachfüllen
        </Button>
      )}
    </div>
  );
}
