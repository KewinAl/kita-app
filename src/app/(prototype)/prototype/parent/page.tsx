export default function PrototypeParentPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-semibold">Elternbereich</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Prototype: Eltern sehen nur Daten ihres eigenen Kindes.
      </p>

      <section className="mt-6 rounded-lg border bg-background p-4">
        <h2 className="text-sm font-medium">Kind: Emma Beispiel</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Abgabe-Info heute: Emma hatte einen guten Tag, hat gegessen und war draußen.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Fotozugriff: Nur freigegebene Bilder des verknüpften Kindes.
        </p>
      </section>
    </main>
  );
}
