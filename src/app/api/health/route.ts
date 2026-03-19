import { NextResponse } from "next/server";
import { isDatabaseConfigured, prisma } from "@/lib/db/prisma";

export async function GET() {
  const dbConfigured = isDatabaseConfigured();
  let dbOk = false;
  if (dbConfigured) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {
      dbOk = false;
    }
  }

  return NextResponse.json({
    ok: true,
    database: dbConfigured ? (dbOk ? "connected" : "error") : "not_configured",
    supabase: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  });
}
