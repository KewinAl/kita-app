import { KidsStaffDetailMock } from "@/components/prototype/KidsStaffDetailMock";

export default async function PrototypeKidDetailPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  return <KidsStaffDetailMock childId={childId} />;
}
