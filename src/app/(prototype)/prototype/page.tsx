"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePrototypeAuth } from "@/context/PrototypeAuthContext";
import { canAccessRoute } from "@/lib/permissions/prototypeAccess";
import { PROTOTYPE_TODAY } from "@/lib/prototypeCalendar";

export default function PrototypeIndexPage() {
  const { role } = usePrototypeAuth();
  const links = [
    {
      href: `/prototype/group?group=all&date=${PROTOTYPE_TODAY}`,
      label: "Gruppe · Staff Group Overview",
      routeCheck: "/prototype/group",
    },
    {
      href: `/prototype/check-in?group=all&date=${PROTOTYPE_TODAY}`,
      label: "Entgegennehmen (Check-in)",
      routeCheck: "/prototype/check-in",
    },
    {
      href: `/prototype/check-out?group=g1&date=${PROTOTYPE_TODAY}`,
      label: "Check-out",
      routeCheck: "/prototype/check-out",
    },
    {
      href: `/prototype/ablauf?group=all&date=${PROTOTYPE_TODAY}`,
      label: "Ablauf (Anzeige + Eingabe)",
      routeCheck: "/prototype/ablauf",
    },
    {
      href: "/prototype/parent",
      label: "Elternansicht",
      routeCheck: "/prototype/parent",
    },
    {
      href: `/prototype/lead/shifts?date=${PROTOTYPE_TODAY}`,
      label: "Leitung · Dienste",
      routeCheck: "/prototype/lead/shifts",
    },
    {
      href: "/prototype/lead/appointments",
      label: "Leitung · Termine",
      routeCheck: "/prototype/lead/appointments",
    },
    {
      href: "/prototype/lead/documents",
      label: "Leitung · Dokumente",
      routeCheck: "/prototype/lead/documents",
    },
    {
      href: "/prototype/lead/kids",
      label: "Leitung · Kinder",
      routeCheck: "/prototype/lead/kids",
    },
    {
      href: "/prototype/lead/settings",
      label: "Leitung · Einstellungen",
      routeCheck: "/prototype/lead/settings",
    },
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:max-w-4xl lg:max-w-6xl">
      <h1 className="text-xl font-semibold">Prototype</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Visual mockups with fake data
      </p>
      <div className="mt-6 grid gap-2">
        {links
          .filter((item) => canAccessRoute(role, item.routeCheck))
          .map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="outline" className="w-full justify-start">
                {item.label}
              </Button>
            </Link>
          ))}
        <p className="mt-4 text-xs text-muted-foreground">
          Gruppenwechsel oben. Klicke auf ein Kind für Tageslog, Foto & Zwischenfall.
          Abgeben zeigt Übergabe-Ansicht (Tageslog einblendbar).
        </p>
      </div>
    </main>
  );
}
