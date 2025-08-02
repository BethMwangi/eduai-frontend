// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  // Clear the refresh cookie
  res.cookies.set("refresh", "", { httpOnly: true, path: "/api/auth/refresh", maxAge: 0 });
  return res;
}
