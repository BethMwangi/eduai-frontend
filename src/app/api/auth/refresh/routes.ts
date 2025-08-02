// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const refresh = req.cookies.get("refresh")?.value;
    if (!refresh) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const refreshRes = await fetch(`${BACKEND}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!refreshRes.ok) {
      // clear cookie on failure
      const bad = NextResponse.json({ error: "Refresh failed" }, { status: refreshRes.status });
      bad.cookies.set("refresh", "", { maxAge: 0, path: "/api/auth/refresh" });
      return bad;
    }

    const data = await refreshRes.json();
    const { access, refresh: newRefresh } = data;

    const res = NextResponse.json({ access });

    if (newRefresh) {
      res.cookies.set("refresh", newRefresh, {
        httpOnly: true,
        path: "/api/auth/refresh",
        maxAge: 14 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return res;
  } catch (e) {
    console.error("Refresh proxy error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
