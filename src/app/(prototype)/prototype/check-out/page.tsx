import { CheckOutHandoverMock } from "@/components/prototype/CheckOutHandoverMock";

export default async function PrototypeCheckOutPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4">
      <CheckOutHandoverMock groupId={group} />
    </main>
  );
}
