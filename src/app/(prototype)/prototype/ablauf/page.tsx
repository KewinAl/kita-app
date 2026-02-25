import { Suspense } from "react";
import { AblaufDisplayMock } from "@/components/prototype/AblaufDisplayMock";

export default function PrototypeAblaufPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4">
      <Suspense fallback={<div className="animate-pulse p-4">Laden…</div>}>
        <AblaufDisplayMock />
      </Suspense>
    </main>
  );
}
