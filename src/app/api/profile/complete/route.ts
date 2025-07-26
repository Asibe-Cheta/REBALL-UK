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

    const formData = await request.formData();
    
    // Extract form data
    const playerName = formData.get("playerName") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const parentGuardianName = formData.get("parentGuardianName") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const postcode = formData.get("postcode") as string;
    const position = formData.get("position") as string;
    const playingLevel = formData.get("playingLevel") as string;
    const currentTeam = formData.get("currentTeam") as string;
    const medicalConditions = formData.get("medicalConditions") as string;
    const trainingReason = formData.get("trainingReason") as string;
    const hearAbout = formData.get("hearAbout") as string;
    const referralName = formData.get("referralName") as string;
    const otherSource = formData.get("otherSource") as string;
    const postTrainingSnacks = formData.get("postTrainingSnacks") as string;
    const postTrainingDrinks = formData.get("postTrainingDrinks") as string;
    const socialMediaConsent = formData.get("socialMediaConsent") === "true";
    const marketingConsent = formData.get("marketingConsent") === "true";

    // Validate required fields
    if (!playerName || !dateOfBirth || !contactEmail || !contactNumber || !postcode || !position || !playingLevel || !trainingReason || !hearAbout) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Handle file uploads for professional players
    let evidenceFiles: string[] = [];
    if (playingLevel === "professional-club") {
      const files = formData.getAll("evidenceFiles") as File[];
      // TODO: Upload files to Supabase Storage and get URLs
      // For now, we'll store file names
      evidenceFiles = files.map(file => file.name);
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    const profileData = {
      playerName,
      dateOfBirth: new Date(dateOfBirth),
      parentGuardianName: parentGuardianName || null,
      contactEmail,
      contactNumber,
      postcode,
      position,
      playingLevel,
      currentTeam: currentTeam || null,
      medicalConditions: medicalConditions || null,
      trainingReason,
      hearAbout,
      referralName: referralName || null,
      otherSource: otherSource || null,
      postTrainingSnacks: postTrainingSnacks || null,
      postTrainingDrinks: postTrainingDrinks || null,
      evidenceFiles,
      socialMediaConsent,
      marketingConsent,
      welcomeCompleted: true,
      welcomeCompletedDate: new Date(),
    };

    if (existingProfile) {
      // Update existing profile
      await prisma.profile.update({
        where: { userId: session.user.id },
        data: profileData,
      });
    } else {
      // Create new profile
      await prisma.profile.create({
        data: {
          userId: session.user.id,
          ...profileData,
        },
      });
    }

    return NextResponse.json(
      { message: "Profile completed successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile completion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 