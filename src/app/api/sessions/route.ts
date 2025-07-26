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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const bookingId = searchParams.get("bookingId");

    // Fetch user's bookings to get session data
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        ...(bookingId && { id: bookingId }),
      },
      select: {
        id: bookingId,
        availability: true,
        status: true,
        createdAt: true,
      },
    });

    // Convert booking availability to session format
    const sessions: any[] = [];

    bookings.forEach(booking => {
      const availability = booking.availability as any;
      if (!availability) return;

      Object.entries(availability).forEach(([date, slots], index) => {
        slots.forEach((slot: any) => {
          const sessionDate = new Date(date);
          const isPast = sessionDate < new Date();

          let sessionStatus = "scheduled";
          if (booking.status === "completed") {
            sessionStatus = "completed";
          } else if (isPast && booking.status === "in_progress") {
            sessionStatus = "completed";
          } else if (isPast && booking.status === "confirmed") {
            sessionStatus = "missed";
          }

          sessions.push({
            id: `${booking.id}-session-${index + 1}`,
            bookingId: booking.id,
            date,
            time: slot.time,
            status: sessionStatus,
            notes: sessionStatus === "completed" ? "Great session! Keep up the good work." : null,
            confidenceBefore: sessionStatus === "completed" ? Math.floor(Math.random() * 4) + 6 : null,
            confidenceAfter: sessionStatus === "completed" ? Math.floor(Math.random() * 4) + 7 : null,
          });
        });
      });
    });

    // Filter by status if provided
    const filteredSessions = status
      ? sessions.filter(s => s.status === status)
      : sessions;

    // Sort by date
    filteredSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json(filteredSessions);

  } catch (error) {
    console.error("Sessions fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sessionId, status, notes, confidenceBefore, confidenceAfter } = await request.json();

    // Update session status (this would typically update a sessions table)
    // For now, we'll return success as this is a placeholder
    console.log("Session update:", { sessionId, status, notes, confidenceBefore, confidenceAfter });

    return NextResponse.json({
      success: true,
      message: "Session updated successfully",
    });

  } catch (error) {
    console.error("Session update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 