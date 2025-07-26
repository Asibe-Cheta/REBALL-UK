import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has Google Calendar connected
    // This would typically check for stored OAuth tokens
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleCalendarToken: true,
        googleCalendarRefreshToken: true,
      },
    });

    const connected = !!(user?.googleCalendarToken && user?.googleCalendarRefreshToken);

    return NextResponse.json({
      connected,
      message: connected 
        ? "Google Calendar is connected" 
        : "Google Calendar is not connected"
    });

  } catch (error) {
    console.error("Calendar status check error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 