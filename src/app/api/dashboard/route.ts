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

    // Fetch user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    // Fetch upcoming sessions
    const upcomingSessions = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        status: { in: ["confirmed", "pending"] },
      },
      include: {
        course: true,
      },
      orderBy: {
        bookingDate: "asc",
      },
      take: 5,
    });

    // Fetch progress data
    const progressData = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate progress percentage
    const totalSessions = upcomingSessions.length + (profile?.welcomeCompleted ? 1 : 0);
    const progressPercentage = totalSessions > 0 ? Math.round((totalSessions / 8) * 100) : 0;

    // Calculate confidence improvement
    const recentProgress = progressData.slice(0, 5);
    const avgBefore = recentProgress.length > 0
      ? Math.round(recentProgress.reduce((sum, p) => sum + (p.confidenceBefore || 0), 0) / recentProgress.length)
      : 0;
    const avgAfter = recentProgress.length > 0
      ? Math.round(recentProgress.reduce((sum, p) => sum + (p.confidenceAfter || 0), 0) / recentProgress.length)
      : 0;
    const improvement = Math.max(0, avgAfter - avgBefore);

    // Fetch available courses
    const availableCourses = await prisma.course.findMany({
      where: {
        available: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
    });

    // Add recommendations based on player position
    const recommendedCourses = availableCourses.map(course => ({
      ...course,
      recommended: course.position === profile?.position,
    }));

    // Mock video data (replace with actual video data)
    const recentVideos = [
      {
        id: "1",
        title: "1v1 Finishing Masterclass",
        thumbnail: "/videos/thumbnails/finishing.jpg",
        duration: 1800, // 30 minutes
        watched: 900, // 15 minutes
        category: "Striker Training",
      },
      {
        id: "2",
        title: "Crossing Techniques",
        thumbnail: "/videos/thumbnails/crossing.jpg",
        duration: 1200, // 20 minutes
        watched: 1200, // 20 minutes
        category: "Winger Training",
      },
      {
        id: "3",
        title: "Goalkeeper 1v1",
        thumbnail: "/videos/thumbnails/goalkeeper.jpg",
        duration: 1500, // 25 minutes
        watched: 750, // 12.5 minutes
        category: "Striker vs Keeper",
      },
    ];

    // Mock achievements data
    const achievements = [
      {
        id: "1",
        title: "First Session",
        description: "Completed your first training session",
        icon: "🎯",
        unlocked: true,
      },
      {
        id: "2",
        title: "Confidence Boost",
        description: "Improved confidence by 20%",
        icon: "📈",
        unlocked: improvement >= 20,
      },
      {
        id: "3",
        title: "Video Master",
        description: "Watched 10 training videos",
        icon: "🎬",
        unlocked: recentVideos.filter(v => v.watched >= v.duration).length >= 10,
      },
      {
        id: "4",
        title: "Consistent Player",
        description: "Attended 5 sessions",
        icon: "🏆",
        unlocked: upcomingSessions.length >= 5,
      },
    ];

    // Calculate next session countdown
    const nextSession = upcomingSessions.length > 0 ? {
      date: upcomingSessions[0].bookingDate.toLocaleDateString(),
      time: "10:00 AM", // Mock time
      courseName: upcomingSessions[0].course.name,
      location: "REBALL Training Ground", // Mock location
      type: upcomingSessions[0].trainingType as "1v1" | "group",
      countdown: Math.ceil((new Date(upcomingSessions[0].bookingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    } : null;

    const dashboardData = {
      playerName: profile?.playerName || session.user?.name || "Player",
      sessionsCompleted: upcomingSessions.filter(s => s.status === "confirmed").length,
      progressPercentage,
      nextSession,
      upcomingSessions: upcomingSessions.map(session => ({
        id: session.id,
        date: session.bookingDate.toLocaleDateString(),
        time: "10:00 AM", // Mock time
        courseName: session.course.name,
        status: session.status as "confirmed" | "pending" | "available",
      })),
      availableCourses: recommendedCourses.map(course => ({
        id: course.id,
        name: course.name,
        position: course.position,
        price121: course.price121?.toNumber() || 0,
        priceGroup: course.priceGroup?.toNumber() || 0,
        recommended: course.recommended,
      })),
      recentVideos,
      achievements,
      confidenceData: {
        before: avgBefore,
        after: avgAfter,
        improvement,
      },
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 