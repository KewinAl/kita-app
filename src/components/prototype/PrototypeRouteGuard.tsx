"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrototypeAuth } from "@/context/PrototypeAuthContext";
import {
  ROLE_LABELS,
  canAccessRoute,
  getDefaultPrototypePath,
} from "@/lib/permissions/prototypeAccess";

export function PrototypeRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/prototype";
  const { role } = usePrototypeAuth();

  if (canAccessRoute(role, pathname)) {
    return <>{children}</>;
  }

  const fallbackPath = getDefaultPrototypePath(role);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-lg border bg-background p-6">
        <h1 className="text-lg font-semibold">Kein Zugriff auf diese Ansicht</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Aktive Rolle: {ROLE_LABELS[role]}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Diese Seite ist für diese Rolle nicht freigeschaltet.
        </p>
        <div className="mt-4">
          <Link
            href={fallbackPath}
            className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            Zur erlaubten Ansicht
          </Link>
        </div>
      </section>
    </main>
  );
}
