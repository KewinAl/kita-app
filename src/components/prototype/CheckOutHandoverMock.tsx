"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockChildren, mockGroups } from "@/lib/mock";
import { usePrototype } from "@/context/PrototypeContext";
import { GroupSwitcherMock } from "./GroupSwitcherMock";
import { HandoverSummaryMock } from "./HandoverSummaryMock";

import { PROTOTYPE_TODAY, clampToCalendarWindow } from "@/lib/prototypeCalendar";

const TODAY = PROTOTYPE_TODAY;

interface CheckOutHandoverMockProps {
  groupId?: string;
}

export function CheckOutHandoverMock({ groupId }: CheckOutHandoverMockProps) {
  const searchParams = useSearchParams();
  const selectedDate = clampToCalendarWindow(searchParams.get("date") ?? TODAY);
  const { getDailyPresenceStatus, getKidData } = usePrototype();
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
                    <HandoverSummaryMock
                      childId={child.id}
                      dateKey={selectedDate}
                      infosForParents={getKidData(child.id, selectedDate).infosForParents}
                    />
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
