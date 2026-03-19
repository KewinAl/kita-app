import { Suspense } from "react";
import { ParentOverviewMock } from "@/components/prototype/ParentOverviewMock";

export default function PrototypeParentPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-semibold">Elternbereich</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Verknüpftes Elternkonto sieht nur Tagesdaten des eigenen Kindes.
      </p>
      <Suspense fallback={<p className="mt-4 text-sm text-muted-foreground">Lade Elternübersicht...</p>}>
        <ParentOverviewMock />
      </Suspense>
    </main>
  );
}
