import { Suspense } from "react";
import { ShiftPlannerMock } from "@/components/prototype/lead/ShiftPlannerMock";

export default function LeadShiftsPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-2xl px-4 pb-8 pt-4 md:max-w-4xl lg:max-w-6xl">Lade Dienstplanung...</main>}>
      <ShiftPlannerMock />
    </Suspense>
  );
}
