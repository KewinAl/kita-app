"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mockGroups } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { ACTIVE_SOLID_INDICATOR_CLASS } from "./activeIndicatorClasses";

interface GroupSwitcherMockProps {
  basePath?: string;
  includeAllOption?: boolean;
}

export function GroupSwitcherMock({
  basePath = "/prototype/group",
  includeAllOption = false,
}: GroupSwitcherMockProps) {
  const searchParams = useSearchParams();
  const currentGroupId = searchParams.get("group") ?? mockGroups[0]?.id ?? "g1";
  const date = searchParams.get("date");
  const options = includeAllOption
    ? [{ id: "all", name: "Alle" }, ...mockGroups]
    : mockGroups;

  return (
    <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
      {options.map((group) => {
        const isActive = group.id === currentGroupId;
        const p = new URLSearchParams();
        p.set("group", group.id);
        if (date) p.set("date", date);
        const href = `${basePath}?${p.toString()}`;
        return (
          <Link
            key={group.id}
            href={href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? ACTIVE_SOLID_INDICATOR_CLASS
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {group.name}
          </Link>
        );
      })}
    </div>
  );
}
