// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      first_name,
      last_name,
    } = await req.json();

    const payload = {
      email,
      password,
      role,
      first_name: firstName ?? first_name,
      last_name: lastName ?? last_name,
    };

    const registerRes = await fetch(`${BACKEND}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await registerRes.json().catch(() => ({}));

    if (!registerRes.ok) {
      return NextResponse.json(
        { error: data.detail || data.error || data },
        { status: registerRes.status }
      );
    }

    // Successful registration (no login)
    return NextResponse.json(data);
  } catch (e) {
    console.error("Register proxy error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
