import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookingId = params.id;

    // Fetch the booking to verify ownership
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
      },
      include: {
        course: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if booking can be cancelled
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { message: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    if (booking.status === "completed") {
      return NextResponse.json(
        { message: "Cannot cancel completed booking" },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "cancelled",
      },
    });

    // Remove Google Calendar events
    try {
      const availability = booking.availability as any;
      if (availability && booking.googleCalendarEventId) {
        await fetch("/api/calendar/events", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.id,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to remove calendar events:", error);
    }

    // Send cancellation email
    try {
      await fetch("/api/email/booking-cancelled", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          userEmail: session.user.email,
          bookingData: {
            courseName: booking.course.name,
            trainingType: booking.trainingType,
            packageType: booking.packageType,
            totalPrice: booking.totalPrice.toNumber(),
          },
        }),
      });
    } catch (error) {
      console.error("Failed to send cancellation email:", error);
    }

    // Process refund if payment was made
    if (booking.paymentIntentId) {
      try {
        const response = await fetch("/api/payment/refund", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: booking.paymentIntentId,
            bookingId: booking.id,
          }),
        });
        
        if (!response.ok) {
          console.error("Failed to process refund");
        }
      } catch (error) {
        console.error("Refund processing error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    });

  } catch (error) {
    console.error("Booking cancellation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 