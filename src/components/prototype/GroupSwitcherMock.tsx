"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mockGroups } from "@/lib/mock";
import { cn } from "@/lib/utils";

interface GroupSwitcherMockProps {
  basePath?: string;
}

export function GroupSwitcherMock({ basePath = "/prototype/group" }: GroupSwitcherMockProps) {
  const searchParams = useSearchParams();
  const currentGroupId = searchParams.get("group") ?? mockGroups[0]?.id ?? "g1";

  return (
    <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
      {mockGroups.map((group) => {
        const isActive = group.id === currentGroupId;
        const href = `${basePath}?group=${group.id}`;
        return (
          <Link
            key={group.id}
            href={href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
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
