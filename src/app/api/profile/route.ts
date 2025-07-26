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

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      playerName: profile.playerName,
      position: profile.position,
      playingLevel: profile.playingLevel,
      currentTeam: profile.currentTeam,
      contactEmail: profile.contactEmail,
      contactNumber: profile.contactNumber,
      postcode: profile.postcode,
      medicalConditions: profile.medicalConditions,
      trainingReason: profile.trainingReason,
      hearAbout: profile.hearAbout,
      referralName: profile.referralName,
      otherSource: profile.otherSource,
      welcomeCompleted: profile.welcomeCompleted,
      welcomeCompletedDate: profile.welcomeCompletedDate,
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 