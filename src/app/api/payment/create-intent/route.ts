import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { amount, bookingData } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    // Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure amount is in cents
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        trainingType: bookingData.trainingType,
        packageType: bookingData.selectedPackage,
        courseName: bookingData.selectedCourse?.name || "",
        sessionCount: Object.keys(bookingData.availability || {}).length.toString(),
        consultation: bookingData.consultation ? "true" : "false",
      },
      description: `REBALL Training - ${bookingData.selectedCourse?.name} (${bookingData.trainingType})`,
      receipt_email: session.user.email || undefined,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { message: "Failed to create payment intent" },
      { status: 500 }
    );
  }
} 