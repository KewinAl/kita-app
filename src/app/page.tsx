import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold">Kita App</h1>
      <p className="mt-2 text-muted-foreground">
        Staff-first daily workflow for Swiss Kitas
      </p>
      <Link
        href="/prototype/group?group=g1"
        className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        View Prototype
      </Link>
    </main>
  );
}
