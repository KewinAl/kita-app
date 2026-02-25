"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { mockGroups } from "@/lib/mock";

const NAV_ITEMS = [
  { href: "/prototype/group", label: "Gruppe" },
  { href: "/prototype/check-in", label: "Entgegennehmen" },
  { href: "/prototype/check-out", label: "Abgeben" },
  { href: "/prototype/ablauf", label: "Ablauf" },
] as const;

export function PrototypeNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("group") ?? mockGroups[0]?.id ?? "g1";

  return (
    <nav className="flex items-center gap-1 border-b bg-background px-2 py-1">
      <Link
        href="/prototype"
        className="rounded px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        Kita
      </Link>
      <span className="text-muted-foreground/50">|</span>
      {NAV_ITEMS.map(({ href, label }) => {
        const isGroupPage = href.includes("group") || href.includes("check-in") || href.includes("check-out") || href.includes("ablauf");
        const url = isGroupPage ? `${href}?group=${groupId}` : href;
        const isActive =
          pathname === href ||
          (href === "/prototype/ablauf" && pathname?.startsWith("/prototype/ablauf")) ||
          (href === "/prototype/group" &&
            pathname?.startsWith("/prototype/child-log")) ||
          (href === "/prototype/group" &&
            pathname?.startsWith("/prototype/incident")) ||
          (href === "/prototype/group" && pathname?.startsWith("/prototype/photo"));

        return (
          <Link
            key={href}
            href={url}
            className={cn(
              "rounded px-2 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
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
