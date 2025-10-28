// src/app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Replace this with your real auth check (e.g., JWT cookie/session)
function isLoggedIn(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  return Boolean(token);
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isPrivate = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/student");

  if (isPrivate && !isLoggedIn(req)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/student/:path*"],
};
