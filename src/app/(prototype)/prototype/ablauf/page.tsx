import { Suspense } from "react";
import { AblaufDisplayMock } from "@/components/prototype/AblaufDisplayMock";
import { PROTOTYPE_TODAY, clampToCalendarWindow } from "@/lib/prototypeCalendar";

export default async function PrototypeAblaufPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const selectedDate = clampToCalendarWindow(date ?? PROTOTYPE_TODAY);
  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4 md:max-w-4xl lg:max-w-6xl">
      <Suspense fallback={<div className="animate-pulse p-4">Laden…</div>}>
        <AblaufDisplayMock key={selectedDate} selectedDate={selectedDate} />
      </Suspense>
    </main>
  );
}
