import { NextRequest, NextResponse } from "next/server";

const ALLOWED_EMAIL = "chuckgptx@gmail.com";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", req.url));
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(new URL("/auth/error", req.url));
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const user = await userRes.json();

    if (user.email !== ALLOWED_EMAIL) {
      return NextResponse.redirect(new URL("/auth/error", req.url));
    }

    const res = NextResponse.redirect(new URL("/?pro=1", req.url));
    res.cookies.set("pro_auth", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.redirect(new URL("/auth/error", req.url));
  }
}
