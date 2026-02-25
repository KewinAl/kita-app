"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  PROTOTYPE_TODAY,
  addDays,
  clampToCalendarWindow,
  formatDateShort,
} from "@/lib/prototypeCalendar";

interface DaySwitcherMockProps {
  basePath: string;
}

export function DaySwitcherMock({ basePath }: DaySwitcherMockProps) {
  const searchParams = useSearchParams();
  const group = searchParams.get("group");
  const date = clampToCalendarWindow(searchParams.get("date") ?? PROTOTYPE_TODAY);

  const prevDate = addDays(date, -1);
  const nextDate = addDays(date, 1);

  const hrefFor = (targetDate: string) => {
    const p = new URLSearchParams();
    p.set("date", targetDate);
    if (group) p.set("group", group);
    return `${basePath}?${p.toString()}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={hrefFor(prevDate)}>
        <Button size="sm" variant="outline" type="button">←</Button>
      </Link>
      <span className="min-w-[130px] text-center text-sm font-medium">
        {formatDateShort(date)}
      </span>
      <Link href={hrefFor(nextDate)}>
        <Button size="sm" variant="outline" type="button">→</Button>
      </Link>
      <Link href={hrefFor(PROTOTYPE_TODAY)}>
        <Button size="sm" variant="ghost" type="button">Heute</Button>
      </Link>
    </div>
  );
}
