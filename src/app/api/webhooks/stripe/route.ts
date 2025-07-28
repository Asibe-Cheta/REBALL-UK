import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
// import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

// Temporarily comment out Stripe for deployment
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-10-16",
// });

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Return temporary response for deployment
    return NextResponse.json({
      message: "Stripe webhook temporarily disabled for deployment",
      received: true
    });

    // Comment out all Stripe webhook logic temporarily
    // const body = await request.text();
    // const headersList = await headers();
    // const signature = headersList.get("stripe-signature");

    // if (!signature) {
    //   return NextResponse.json(
    //     { message: "No signature provided" },
    //     { status: 400 }
    //   );
    // }

    // let event: Stripe.Event;

    // try {
    //   event = stripe.webhooks.constructEvent(
    //     body,
    //     signature,
    //     process.env.STRIPE_WEBHOOK_SECRET!
    //   );
    // } catch (err: any) {
    //   console.error("Webhook signature verification failed:", err.message);
    //   return NextResponse.json(
    //     { message: "Invalid signature" },
    //     { status: 400 }
    //   );
    // }

    // // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
    //     break;

    //   case "payment_intent.payment_failed":
    //     await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
    //     break;

    //   case "payment_intent.canceled":
    //     await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
    //     break;

    //   case "charge.succeeded":
    //     await handleChargeSucceeded(event.data.object as Stripe.Charge);
    //     break;

    //   case "charge.failed":
    //     await handleChargeFailed(event.data.object as Stripe.Charge);
    //     break;

    //   default:
    //     console.log(`Unhandled event type: ${event.type}`);
    // }

    // return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Webhook error" },
      { status: 500 }
    );
  }
}

// Comment out all handler functions temporarily
// async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
//   try {
//     console.log("Payment succeeded:", paymentIntent.id);
//     // ... rest of function commented out
//   } catch (error) {
//     console.error("Error handling payment succeeded:", error);
//   }
// }

// async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
//   try {
//     console.log("Payment failed:", paymentIntent.id);
//     // ... rest of function commented out
//   } catch (error) {
//     console.error("Error handling payment failed:", error);
//   }
// }

// async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
//   try {
//     console.log("Payment canceled:", paymentIntent.id);
//     // ... rest of function commented out
//   } catch (error) {
//     console.error("Error handling payment canceled:", error);
//   }
// }

// async function handleChargeSucceeded(charge: Stripe.Charge) {
//   try {
//     console.log("Charge succeeded:", charge.id);
//     // ... rest of function commented out
//   } catch (error) {
//     console.error("Error handling charge succeeded:", error);
//   }
// }

// async function handleChargeFailed(charge: Stripe.Charge) {
//   try {
//     console.log("Charge failed:", charge.id);
//     // ... rest of function commented out
//   } catch (error) {
//     console.error("Error handling charge failed:", error);
//   }
// }