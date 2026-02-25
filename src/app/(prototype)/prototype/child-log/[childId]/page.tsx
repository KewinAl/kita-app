import { Suspense } from "react";
import { ChildDayLogMock } from "@/components/prototype/ChildDayLogMock";

export default async function PrototypeChildLogPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4">
      <Suspense fallback={<div className="animate-pulse p-4">Laden…</div>}>
        <ChildDayLogMock childId={childId} />
      </Suspense>
    </main>
  );
}
