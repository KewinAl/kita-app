"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { mockChildren, mockParentAccounts } from "@/lib/mock";
import { usePrototypeAuth } from "@/context/PrototypeAuthContext";
import { usePrototype } from "@/context/PrototypeContext";
import { HandoverSummaryMock } from "./HandoverSummaryMock";
import { PROTOTYPE_TODAY, clampToCalendarWindow, formatDateShort } from "@/lib/prototypeCalendar";

export function ParentOverviewMock() {
  const searchParams = useSearchParams();
  const selectedDate = clampToCalendarWindow(searchParams.get("date") ?? PROTOTYPE_TODAY);
  const { parentAccountId } = usePrototypeAuth();
  const { getKidData, getDailyPresenceStatus } = usePrototype();

  const parentAccount = mockParentAccounts.find((account) => account.id === parentAccountId);
  const childId = parentAccount?.childIds[0];
  const child = childId ? mockChildren.find((entry) => entry.id === childId) : undefined;

  if (!parentAccount || !child) {
    return (
      <section className="mt-6 rounded-lg border bg-background p-4">
        <p className="text-sm text-muted-foreground">
          Kein verknüpftes Kind für dieses Elternkonto gefunden.
        </p>
      </section>
    );
  }

  const kidData = getKidData(child.id, selectedDate);
  const presence = getDailyPresenceStatus(child.id, selectedDate);
  const presenceLabel =
    presence === "present"
      ? "Heute anwesend"
      : presence === "planned_absence"
        ? "Geplant abwesend"
        : presence === "absent_today"
          ? "Heute abwesend"
          : "Erwartet";

  return (
    <section className="mt-6 space-y-3">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm font-medium">
            Kind: {child.firstName} {child.lastName}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Konto: {parentAccount.name} · {formatDateShort(selectedDate)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{presenceLabel}</p>
          <div className="mt-2 border-t pt-2">
            <HandoverSummaryMock
              childId={child.id}
              dateKey={selectedDate}
              infosForParents={kidData.infosForParents}
              showQuickAction={false}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
