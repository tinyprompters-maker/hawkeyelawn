import { NextRequest, NextResponse } from "next/server";

// This runs on every request to /pro
// If the user doesn't have the pro_auth cookie, send them to login

export function middleware(req: NextRequest) {
  const isAuthed = req.cookies.get("pro_auth")?.value === "true";

  if (!isAuthed) {
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pro/:path*"],
};
