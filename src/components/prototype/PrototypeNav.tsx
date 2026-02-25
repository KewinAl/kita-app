"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { mockGroups } from "@/lib/mock";
import { usePrototypeAuth } from "@/context/PrototypeAuthContext";
import { usePrototypeTheme } from "@/context/PrototypeThemeContext";
import {
  ROLE_LABELS,
  canAccessRoute,
  isStaffRole,
  type PrototypeRole,
} from "@/lib/permissions/prototypeAccess";
import { ACTIVE_SOLID_INDICATOR_CLASS } from "./activeIndicatorClasses";

const NAV_ITEMS = [
  { href: "/prototype/group", label: "Gruppe" },
  { href: "/prototype/check-in", label: "Entgegennehmen" },
  { href: "/prototype/check-out", label: "Abgeben" },
  { href: "/prototype/ablauf", label: "Ablauf" },
  { href: "/prototype/lead/shifts", label: "Leitung · Dienste" },
  { href: "/prototype/lead/appointments", label: "Leitung · Termine" },
  { href: "/prototype/lead/documents", label: "Leitung · Dokumente" },
  { href: "/prototype/lead/kids", label: "Leitung · Kinder" },
  { href: "/prototype/lead/settings", label: "Leitung · Einstellungen" },
  { href: "/prototype/parent", label: "Elternansicht" },
] as const;

export function PrototypeNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group") ?? mockGroups[0]?.id ?? "g1";
  const date = searchParams.get("date");
  const { role, setRole } = usePrototypeAuth();
  const { orgThemes, selectedOrgId, setSelectedOrgId } = usePrototypeTheme();

  return (
    <nav className="flex items-center gap-1 border-b bg-background px-2 py-1">
      <Link
        href="/prototype"
        className="rounded px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        Kita
      </Link>
      <select
        value={selectedOrgId}
        onChange={(e) => setSelectedOrgId(e.target.value)}
        className="h-8 rounded border bg-background px-2 text-xs text-foreground"
        aria-label="Organisation auswählen"
      >
        {orgThemes.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as PrototypeRole)}
        className="h-8 rounded border bg-background px-2 text-xs text-foreground"
        aria-label="Rolle auswählen"
      >
        {(Object.keys(ROLE_LABELS) as PrototypeRole[]).map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      <span className="text-muted-foreground/50">|</span>
      {NAV_ITEMS.filter(({ href }) => canAccessRoute(role, href)).map(({ href, label }) => {
        const isGroupPage =
          isStaffRole(role) &&
          (href.includes("group") ||
            href.includes("check-in") ||
            href.includes("check-out") ||
            href.includes("ablauf"));
        const keepDate = href.includes("/lead/") || isGroupPage;
        const p = new URLSearchParams();
        if (isGroupPage) p.set("group", groupId);
        if (date && keepDate) p.set("date", date);
        const url = p.toString() ? `${href}?${p.toString()}` : href;
        const isActive =
          pathname === href ||
          (href === "/prototype/ablauf" && pathname?.startsWith("/prototype/ablauf")) ||
          (href === "/prototype/group" &&
            pathname?.startsWith("/prototype/child-log")) ||
          (href === "/prototype/group" &&
            pathname?.startsWith("/prototype/incident")) ||
          (href === "/prototype/group" && pathname?.startsWith("/prototype/photo")) ||
          (href === "/prototype/lead/shifts" &&
            pathname?.startsWith("/prototype/lead/shifts")) ||
          (href === "/prototype/lead/appointments" &&
            pathname?.startsWith("/prototype/lead/appointments")) ||
          (href === "/prototype/lead/documents" &&
            pathname?.startsWith("/prototype/lead/documents")) ||
          (href === "/prototype/lead/kids" &&
            pathname?.startsWith("/prototype/lead/kids")) ||
          (href === "/prototype/lead/settings" &&
            pathname?.startsWith("/prototype/lead/settings"));

        return (
          <Link
            key={href}
            href={url}
            className={cn(
              "rounded px-2 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? ACTIVE_SOLID_INDICATOR_CLASS
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
      <span className="ml-auto text-xs text-muted-foreground">Mock</span>
    </nav>
  );
}
