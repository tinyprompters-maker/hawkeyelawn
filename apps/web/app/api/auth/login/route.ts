import { NextRequest, NextResponse } from "next/server";

// This is the ONLY file that starts the Google login flow.
// It redirects the user to Google's OAuth consent screen.
// After Google login, Google calls /api/auth/callback with a code.

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.APP_URL;

  if (!clientId || !appUrl) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID and APP_URL must be set in Vercel environment variables." },
      { status: 500 }
    );
  }

  const redirectUri = `${appUrl}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
