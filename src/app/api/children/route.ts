import { NextResponse } from "next/server";
import { isDatabaseConfigured, prisma } from "@/lib/db/prisma";

/**
 * Returns children from Postgres when `DATABASE_URL` is set (after `db:push` + `db:seed`).
 * Prototype UI still uses `src/lib/mock` until components are wired to this API.
 */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      children: [] as unknown[],
      message: "DATABASE_URL not set — using in-app mock data.",
    });
  }

  try {
    const children = await prisma.child.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      include: { group: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ configured: true, children });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return NextResponse.json(
      { configured: true, error: message, children: [] },
      { status: 503 }
    );
  }
}
