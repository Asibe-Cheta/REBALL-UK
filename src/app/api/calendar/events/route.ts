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

    const { bookingId, sessionDate, sessionTime, courseName, trainingType } = await request.json();

    // Get user's Google Calendar tokens
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleCalendarToken: true,
        googleCalendarRefreshToken: true,
        googleCalendarTokenExpiry: true,
      },
    });

    if (!user?.googleCalendarToken) {
      return NextResponse.json(
        { message: "Google Calendar not connected" },
        { status: 400 }
      );
    }

    // Check if token is expired and refresh if needed
    let accessToken = user.googleCalendarToken;
    if (user.googleCalendarTokenExpiry && new Date() > user.googleCalendarTokenExpiry) {
      const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: user.googleCalendarRefreshToken!,
          grant_type: "refresh_token",
        }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.access_token;

        // Update tokens in database
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            googleCalendarToken: refreshData.access_token,
            googleCalendarTokenExpiry: new Date(Date.now() + (refreshData.expires_in * 1000)),
          },
        });
      }
    }

    // Create calendar event
    const eventStart = new Date(`${sessionDate}T${sessionTime}:00`);
    const eventEnd = new Date(eventStart.getTime() + (60 * 60 * 1000)); // 1 hour duration

    const eventData = {
      summary: `REBALL Training - ${courseName}`,
      description: `${trainingType} training session with REBALL. Course: ${courseName}`,
      start: {
        dateTime: eventStart.toISOString(),
        timeZone: "Europe/London",
      },
      end: {
        dateTime: eventEnd.toISOString(),
        timeZone: "Europe/London",
      },
      location: "REBALL Training Ground",
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 30 }, // 30 minutes before
        ],
      },
    };

    const calendarResponse = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!calendarResponse.ok) {
      console.error("Calendar event creation failed:", await calendarResponse.text());
      return NextResponse.json(
        { message: "Failed to create calendar event" },
        { status: 500 }
      );
    }

    const calendarEvent = await calendarResponse.json();

    // Update booking with calendar event ID
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        googleCalendarEventId: calendarEvent.id,
      },
    });

    return NextResponse.json({
      success: true,
      eventId: calendarEvent.id,
      message: "Calendar event created successfully"
    });

  } catch (error) {
    console.error("Calendar event creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId } = await request.json();

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        googleCalendarEventId: true,
        userId: true,
      },
    });

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    if (!booking.googleCalendarEventId) {
      return NextResponse.json(
        { message: "No calendar event to delete" },
        { status: 400 }
      );
    }

    // Get user's access token
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleCalendarToken: true,
      },
    });

    if (!user?.googleCalendarToken) {
      return NextResponse.json(
        { message: "Google Calendar not connected" },
        { status: 400 }
      );
    }

    // Delete calendar event
    const deleteResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.googleCalendarEventId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.googleCalendarToken}`,
        },
      }
    );

    if (!deleteResponse.ok) {
      console.error("Calendar event deletion failed:", await deleteResponse.text());
      return NextResponse.json(
        { message: "Failed to delete calendar event" },
        { status: 500 }
      );
    }

    // Remove calendar event ID from booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        googleCalendarEventId: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Calendar event deleted successfully"
    });

  } catch (error) {
    console.error("Calendar event deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 