import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mockChildren } from "@/lib/mock";

export default async function PrototypePhotoPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = mockChildren.find((c) => c.id === childId);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href={`/prototype/child-log/${childId}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Zurück
          </Link>
        </div>

        <header>
          <h1 className="text-xl font-semibold">Foto aufnehmen</h1>
          <p className="text-sm text-muted-foreground">
            {child?.firstName} {child?.lastName}
          </p>
        </header>

        <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50 flex flex-col items-center justify-center gap-4">
          <span className="text-6xl">📷</span>
          <p className="text-sm text-muted-foreground">
            Kamera-Vorschau (Mockup)
          </p>
          <div className="flex gap-2">
            <Button size="lg">Aufnehmen</Button>
            <Link href={`/prototype/child-log/${childId}`}>
              <Button variant="outline">Abbrechen</Button>
            </Link>
          </div>
        </div>

        <div className="rounded border bg-muted/30 p-3">
          <label className="text-sm font-medium">Beschreibung (optional)</label>
          <input
            type="text"
            placeholder="z.B. Beim Malen"
            className="mt-1 w-full rounded border bg-background px-3 py-2 text-sm"
            readOnly
          />
        </div>
      </div>
    </main>
  );
}
