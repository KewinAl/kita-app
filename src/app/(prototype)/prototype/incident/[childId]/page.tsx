import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockChildren } from "@/lib/mock";

export default async function PrototypeIncidentPage({
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
          <h1 className="text-xl font-semibold">Zwischenfall melden</h1>
          <p className="text-sm text-muted-foreground">
            {child?.firstName} {child?.lastName}
          </p>
        </header>

        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Art</label>
              <div className="mt-1 flex gap-2">
                <Button size="sm" variant="outline">
                  Verletzung
                </Button>
                <Button size="sm" variant="outline">
                  Krankheit
                </Button>
                <Button size="sm" variant="outline">
                  Konflikt
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Beschreibung</label>
              <textarea
                placeholder="Was ist passiert?"
                className="mt-1 w-full rounded border bg-background px-3 py-2 text-sm"
                rows={3}
                readOnly
              />
            </div>

            <div>
              <label className="text-sm font-medium">Massnahmen</label>
              <textarea
                placeholder="Was wurde unternommen?"
                className="mt-1 w-full rounded border bg-background px-3 py-2 text-sm"
                rows={2}
                readOnly
              />
            </div>

            <div>
              <label className="text-sm font-medium">Eltern informiert?</label>
              <div className="mt-1 flex gap-2">
                <Button size="sm">Ja</Button>
                <Button size="sm" variant="outline">
                  Nein
                </Button>
              </div>
            </div>

            <Button className="w-full">Speichern</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
