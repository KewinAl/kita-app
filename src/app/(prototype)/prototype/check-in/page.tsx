import { EntgegennehmenMock } from "@/components/prototype/EntgegennehmenMock";

export default async function PrototypeCheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  const groupId = group ?? "all";

  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4 md:max-w-4xl lg:max-w-6xl">
      <EntgegennehmenMock groupId={groupId} />
    </main>
  );
}
