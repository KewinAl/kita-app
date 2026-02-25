import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrototypeIndexPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold">Prototype</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Visual mockups with fake data
      </p>
      <div className="mt-6 grid gap-2">
        <Link href="/prototype/group">
          <Button variant="outline" className="w-full justify-start">
            Gruppe · Staff Group Overview
          </Button>
        </Link>
        <Link href="/prototype/check-in">
          <Button variant="outline" className="w-full justify-start">
            Entgegennehmen (Check-in)
          </Button>
        </Link>
        <Link href="/prototype/check-out">
          <Button variant="outline" className="w-full justify-start">
            Check-out
          </Button>
        </Link>
        <Link href="/prototype/ablauf">
          <Button variant="outline" className="w-full justify-start">
            Ablauf (Anzeige + Eingabe)
          </Button>
        </Link>
        <p className="mt-4 text-xs text-muted-foreground">
          Gruppenwechsel oben. Klicke auf ein Kind für Tageslog, Foto & Zwischenfall.
          Abgeben zeigt Übergabe-Ansicht (Tageslog einblendbar).
        </p>
      </div>
    </main>
  );
}
