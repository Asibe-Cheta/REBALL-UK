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

    // Fetch bookings with optional status filter
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status }),
      },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response with additional data
    const formattedBookings = bookings.map(booking => {
      const availability = booking.availability as any;
      const sessionCount = availability ? Object.keys(availability).length : 0;

      // Calculate progress
      let completedSessions = 0;
      let totalSessions = sessionCount;

      if (availability) {
        // This would typically come from a separate sessions table
        // For now, we'll estimate based on booking status
        if (booking.status === "completed") {
          completedSessions = totalSessions;
        } else if (booking.status === "in_progress") {
          completedSessions = Math.floor(totalSessions * 0.5); // Estimate
        }
      }

      return {
        id: booking.id,
        courseName: booking.course.name,
        trainingType: booking.trainingType,
        packageType: booking.packageType,
        totalPrice: booking.totalPrice.toNumber(),
        status: booking.status,
        availability: booking.availability,
        consultation: booking.consultationAvailability ? true : false,
        createdAt: booking.createdAt,
        nextSession: getNextSession(availability),
        progress: {
          completedSessions,
          totalSessions,
          confidenceImprovement: 0, // Would come from progress tracking
        },
      };
    });

    return NextResponse.json(formattedBookings);

  } catch (error) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function getNextSession(availability: any) {
  if (!availability) return null;

  const now = new Date();
  const upcomingSessions = Object.entries(availability)
    .filter(([date]) => new Date(date) > now)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());

  if (upcomingSessions.length === 0) return null;

  const [date, slots] = upcomingSessions[0];
  return {
    date,
    time: slots[0]?.time || "TBD",
  };
} 