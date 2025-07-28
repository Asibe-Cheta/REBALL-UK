import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import Stripe from "stripe";

// Temporarily comment out Stripe initialization for deployment
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-10-16",
// });

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

    // Temporarily return a mock response for deployment
    return NextResponse.json({
      clientSecret: "temp_client_secret_for_deployment",
      paymentIntentId: "temp_payment_intent_id",
      message: "Payment system temporarily disabled for deployment"
    });

    // Comment out Stripe payment intent creation temporarily
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount), // Ensure amount is in cents
    //   currency: "gbp",
    //   automatic_payment_methods: {
    //     enabled: true,
    //   },
    //   metadata: {
    //     userId: session.user.id,
    //     trainingType: bookingData.trainingType,
    //     packageType: bookingData.selectedPackage,
    //     courseName: bookingData.selectedCourse?.name || "",
    //     sessionCount: Object.keys(bookingData.availability || {}).length.toString(),
    //     consultation: bookingData.consultation ? "true" : "false",
    //   },
    //   description: `REBALL Training - ${bookingData.selectedCourse?.name} (${bookingData.trainingType})`,
    //   receipt_email: session.user.email || undefined,
    // });

    // return NextResponse.json({
    //   clientSecret: paymentIntent.client_secret,
    //   paymentIntentId: paymentIntent.id,
    // });

  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { message: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}