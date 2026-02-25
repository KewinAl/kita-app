import { Suspense } from "react";
import { GruppeTableMock } from "@/components/prototype/GruppeTableMock";

export default function PrototypeGroupPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4">
      <Suspense fallback={<div className="animate-pulse p-4">Laden…</div>}>
        <GruppeTableMock />
      </Suspense>
    </main>
  );
}
