import { Suspense } from "react";
import { AblaufEingabeMock } from "@/components/prototype/AblaufEingabeMock";

export default function PrototypeAblaufEingabePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4 md:max-w-4xl lg:max-w-6xl">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Lade Eingabe...</div>}>
        <AblaufEingabeMock />
      </Suspense>
    </main>
  );
}
