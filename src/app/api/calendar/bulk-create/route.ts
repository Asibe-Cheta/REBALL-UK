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

    const { bookingData, coachInfo } = await request.json();

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

    const createdEvents = [];
    const availability = bookingData.availability;

    // Create calendar events for each session
    for (const [date, slots] of Object.entries(availability)) {
      for (const slot of slots) {
        const eventStart = new Date(`${date}T${slot.time}:00`);
        const eventEnd = new Date(eventStart.getTime() + (60 * 60 * 1000)); // 1 hour duration

        const eventData = {
          summary: `REBALL Training - ${bookingData.selectedCourse.name}`,
          description: `${bookingData.trainingType} training session with REBALL.\n\nCourse: ${bookingData.selectedCourse.name}\nPackage: ${bookingData.selectedPackage}\n${coachInfo ? `Coach: ${coachInfo.name}` : ''}\n\nLocation: REBALL Training Ground\nAddress: 123 Football Lane, London, SW1A 1AA\n\nWhat to bring:\n- Football boots\n- Comfortable clothing\n- Water bottle\n\nPlease arrive 15 minutes before your session.`,
          start: {
            dateTime: eventStart.toISOString(),
            timeZone: "Europe/London",
          },
          end: {
            dateTime: eventEnd.toISOString(),
            timeZone: "Europe/London",
          },
          location: "REBALL Training Ground, 123 Football Lane, London, SW1A 1AA",
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 }, // 1 day before
              { method: "popup", minutes: 30 }, // 30 minutes before
            ],
          },
          attendees: coachInfo ? [
            { email: coachInfo.email, displayName: coachInfo.name }
          ] : undefined,
        };

        const calendarResponse = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });

        if (calendarResponse.ok) {
          const calendarEvent = await calendarResponse.json();
          createdEvents.push({
            date,
            time: slot.time,
            eventId: calendarEvent.id,
          });
        } else {
          console.error("Failed to create calendar event:", await calendarResponse.text());
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${createdEvents.length} sessions added to calendar`,
      events: createdEvents,
    });

  } catch (error) {
    console.error("Bulk calendar creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 