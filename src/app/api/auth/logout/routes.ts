// src/app/api/auth/logout/route.ts
import {  NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear the refresh cookie
  res.cookies.set("refresh", "", { httpOnly: true, path: "/api/auth/refresh", maxAge: 0 });
  return res;
}
