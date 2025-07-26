import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      trainingType,
      selectedCourse,
      selectedPackage,
      answers,
      availability,
      consultation,
      paymentIntentId,
      totalPrice
    } = await request.json();

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        courseId: selectedCourse.id,
        trainingType,
        packageType: selectedPackage,
        totalPrice: totalPrice,
        status: "confirmed",
        availability: availability,
        consultationAvailability: consultation ? { requested: true } : null,
        courseQuestions: answers,
        googleCalendarConnected: false, // Will be updated when calendar events are created
      },
      include: {
        course: true,
        user: true,
      },
    });

    // Create individual session bookings for each selected time slot
    const sessionBookings = [];
    for (const [date, slots] of Object.entries(availability)) {
      for (const slot of slots) {
        sessionBookings.push({
          date: new Date(date),
          time: slot.time,
          status: "confirmed",
          bookingId: booking.id,
        });
      }
    }

    // TODO: Create session bookings in database
    // This would require a separate Session model in the schema

    // Send confirmation email
    try {
      await fetch("/api/email/booking-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          userEmail: session.user.email,
          bookingData: {
            courseName: selectedCourse.name,
            trainingType,
            packageType: selectedPackage,
            totalPrice,
            availability,
            consultation,
          },
        }),
      });
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
    }

    // Create Google Calendar events
    try {
      for (const [date, slots] of Object.entries(availability)) {
        for (const slot of slots) {
          await fetch("/api/calendar/events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingId: booking.id,
              sessionDate: date,
              sessionTime: slot.time,
              courseName: selectedCourse.name,
              trainingType,
            }),
          });
        }
      }
    } catch (error) {
      console.error("Failed to create calendar events:", error);
    }

    return NextResponse.json({
      id: booking.id,
      message: "Booking created successfully",
    });

  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
} 