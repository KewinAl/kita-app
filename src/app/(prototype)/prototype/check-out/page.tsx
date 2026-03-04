import { Suspense } from "react";
import { CheckOutHandoverMock } from "@/components/prototype/CheckOutHandoverMock";

export default async function PrototypeCheckOutPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4 md:max-w-4xl lg:max-w-6xl">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Lade Check-out...</div>}>
        <CheckOutHandoverMock groupId={group} />
      </Suspense>
    </main>
  );
}
