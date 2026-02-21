import { NextRequest, NextResponse } from "next/server";

// Google calls this URL after the user signs in.
// It checks the email is allowed, then sets a secure cookie.
// No NextAuth needed — this is plain Next.js.

const ALLOWED_EMAIL = "chuckgptx@gmail.com";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const appUrl = process.env.APP_URL;

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", req.url));
  }

  try {
    // Step 1: Exchange the code Google gave us for an access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${appUrl}/api/auth/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      console.error("Token exchange failed:", tokens);
      return NextResponse.redirect(new URL("/auth/error", req.url));
    }

    // Step 2: Use the access token to get the user's email from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const user = await userRes.json();

    // Step 3: Only allow the one approved email
    if (user.email !== ALLOWED_EMAIL) {
      return NextResponse.redirect(new URL("/auth/error", req.url));
    }

    // Step 4: Set a secure cookie and send them to the pro dashboard
    const res = NextResponse.redirect(new URL("/?pro=1", req.url));
    res.cookies.set("pro_auth", "true", {
      httpOnly: true,   // JS can't read this cookie (prevents XSS)
      secure: true,     // HTTPS only
      sameSite: "lax",
      maxAge: 86400,    // 24 hours
      path: "/",
    });
    return res;

  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(new URL("/auth/error", req.url));
  }
}
