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
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    // Fetch existing bookings for conflict detection
    const existingBookings = await prisma.booking.findMany({
      where: {
        status: { in: ["confirmed", "pending"] },
      },
      select: {
        availability: true,
        trainingType: true,
        packageType: true,
      },
    });

    // Generate availability data for the requested month
    const availabilityData = generateAvailabilityForMonth(
      parseInt(year || new Date().getFullYear().toString()),
      parseInt(month || new Date().getMonth().toString()),
      existingBookings
    );

    return NextResponse.json(availabilityData);

  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateAvailabilityForMonth(year: number, month: number, existingBookings: any[]) {
  const availability: Record<string, any[]> = {};
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Time slots available for booking
  const timeSlots = ["09:00", "11:00", "14:00", "16:00", "18:00"];

  // Generate availability for each day in the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split("T")[0];

    // Skip past dates
    if (date < new Date()) continue;

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dayAvailability = timeSlots.map(time => {
      // Check if this time slot is already booked
      const conflictingBookings = existingBookings.filter(booking => {
        if (!booking.availability) return false;

        const bookingDates = Object.keys(booking.availability);
        return bookingDates.includes(dateString) &&
          booking.availability[dateString]?.some((slot: any) => slot.time === time);
      });

      const totalBookings = conflictingBookings.length;
      const maxSpots = 4; // Maximum participants per session
      const availableSpots = Math.max(0, maxSpots - totalBookings);

      return {
        id: `${dateString}-${time}`,
        time,
        available: availableSpots > 0,
        spots: availableSpots,
        maxSpots,
        conflictingBookings: conflictingBookings.length,
      };
    });

    availability[dateString] = dayAvailability;
  }

  return availability;
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

    const { date, timeSlot, action } = await request.json();

    if (action === "hold") {
      // Create a temporary hold on the time slot
      // This would typically involve creating a temporary booking record
      // or using a cache/Redis to hold the slot for 15 minutes

      return NextResponse.json({
        success: true,
        message: "Time slot held temporarily"
      });
    }

    if (action === "release") {
      // Release the temporary hold

      return NextResponse.json({
        success: true,
        message: "Time slot released"
      });
    }

    return NextResponse.json(
      { message: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Availability action error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 