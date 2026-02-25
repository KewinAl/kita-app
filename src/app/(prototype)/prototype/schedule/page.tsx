import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { mockSchedule, mockAttendance, mockChildren } from "@/lib/mock";

const TODAY = "2025-02-19";

export default function PrototypeSchedulePage() {
  const absent = mockAttendance.filter(
    (a) => a.date === TODAY && a.status === "absent"
  );
  const absentChildren = absent.map((a) =>
    mockChildren.find((c) => c.id === a.childId)
  );

  return (
    <main className="mx-auto max-w-2xl px-4 pb-8 pt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/prototype/group"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Zurück
          </Link>
        </div>

        <header>
          <h1 className="text-xl font-semibold">Heutiger Ablauf</h1>
          <p className="text-sm text-muted-foreground">Mi 19. Feb 2025</p>
        </header>

        {absentChildren.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardContent className="p-3">
              <h3 className="text-sm font-medium">Abwesend heute</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {absentChildren
                  .filter(Boolean)
                  .map((c) => `${c!.firstName} ${c!.lastName}`)
                  .join(", ")}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {mockSchedule.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-3 p-3">
                <span className="font-mono text-sm text-muted-foreground">
                  {item.time}
                </span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="ml-auto text-lg">
                  {item.type === "meal" && "🍽"}
                  {item.type === "nap" && "😴"}
                  {item.type === "activity" && "🎨"}
                  {item.type === "transition" && "↔"}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
