import { EntgegennehmenMock } from "@/components/prototype/EntgegennehmenMock";
import { mockGroups } from "@/lib/mock";

export default async function PrototypeCheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  const groupId = group ?? mockGroups[0]?.id ?? "g1";

  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4">
      <EntgegennehmenMock groupId={groupId} />
    </main>
  );
}
