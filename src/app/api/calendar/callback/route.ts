import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // This contains the user ID
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/availability?error=calendar_connection_failed`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/availability?error=invalid_callback`);
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/calendar/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/availability?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Store tokens in database
    await prisma.user.update({
      where: { id: state },
      data: {
        googleCalendarToken: tokenData.access_token,
        googleCalendarRefreshToken: tokenData.refresh_token,
        googleCalendarTokenExpiry: new Date(Date.now() + (tokenData.expires_in * 1000)),
      },
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/availability?success=calendar_connected`);

  } catch (error) {
    console.error("Calendar callback error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/availability?error=callback_failed`);
  }
} 