// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const loginRes = await fetch(`${BACKEND}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      const err = await loginRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail || "Login failed" },
        { status: loginRes.status }
      );
    }

    const data = await loginRes.json();
    const { access, refresh, user } = data;

    if (!access || !refresh) {
      return NextResponse.json(
        { error: "Malformed token response" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ access, user });

    res.cookies.set("refresh", refresh, {
      httpOnly: true,
      path: "/api/auth/refresh",
      maxAge: 14 * 24 * 60 * 60, // e.g., 14 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (e) {
    console.error("Login proxy error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
