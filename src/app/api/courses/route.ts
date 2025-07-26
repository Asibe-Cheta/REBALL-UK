import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");

    // Fetch all available courses
    const courses = await prisma.course.findMany({
      where: {
        available: true,
        ...(position && { position }),
      },
      orderBy: {
        name: "asc",
      },
    });

    // Format the response
    const formattedCourses = courses.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description || "",
      position: course.position,
      durationWeeks: course.durationWeeks,
      price121: course.price121?.toNumber() || 0,
      priceGroup: course.priceGroup?.toNumber() || 0,
      available: course.available,
    }));

    return NextResponse.json(formattedCourses);

  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 