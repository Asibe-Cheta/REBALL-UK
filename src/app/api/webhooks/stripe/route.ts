import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { message: "No signature provided" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.canceled":
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.succeeded":
        await handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;

      case "charge.failed":
        await handleChargeFailed(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Webhook error" },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment succeeded:", paymentIntent.id);

    // Find booking by payment intent ID (you might need to store this mapping)
    const booking = await prisma.booking.findFirst({
      where: {
        // You'll need to add a paymentIntentId field to the Booking model
        // paymentIntentId: paymentIntent.id,
      },
    });

    if (booking) {
      // Update booking status
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "confirmed",
          // Add payment details
          // paymentIntentId: paymentIntent.id,
          // paymentAmount: paymentIntent.amount,
          // paymentCurrency: paymentIntent.currency,
        },
      });

      // Send confirmation email
      try {
        await fetch("/api/email/booking-confirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.id,
            paymentIntentId: paymentIntent.id,
          }),
        });
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
      }

      // Create Google Calendar events
      try {
        const availability = booking.availability as any;
        if (availability) {
          for (const [date, slots] of Object.entries(availability)) {
            for (const slot of slots as any[]) {
              await fetch("/api/calendar/events", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  bookingId: booking.id,
                  sessionDate: date,
                  sessionTime: slot.time,
                  courseName: booking.course?.name || "REBALL Training",
                  trainingType: booking.trainingType,
                }),
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to create calendar events:", error);
      }
    }
  } catch (error) {
    console.error("Error handling payment succeeded:", error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment failed:", paymentIntent.id);

    // Find booking by payment intent ID
    const booking = await prisma.booking.findFirst({
      where: {
        // paymentIntentId: paymentIntent.id,
      },
    });

    if (booking) {
      // Update booking status
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "payment_failed",
        },
      });

      // Send failure notification email
      try {
        await fetch("/api/email/payment-failed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.id,
            paymentIntentId: paymentIntent.id,
            failureReason: paymentIntent.last_payment_error?.message || "Payment failed",
          }),
        });
      } catch (error) {
        console.error("Failed to send failure email:", error);
      }
    }
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment canceled:", paymentIntent.id);

    // Find booking by payment intent ID
    const booking = await prisma.booking.findFirst({
      where: {
        // paymentIntentId: paymentIntent.id,
      },
    });

    if (booking) {
      // Update booking status
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "canceled",
        },
      });

      // Send cancellation email
      try {
        await fetch("/api/email/booking-canceled", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking.id,
            paymentIntentId: paymentIntent.id,
          }),
        });
      } catch (error) {
        console.error("Failed to send cancellation email:", error);
      }
    }
  } catch (error) {
    console.error("Error handling payment canceled:", error);
  }
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  try {
    console.log("Charge succeeded:", charge.id);
    // Additional charge-specific logic if needed
  } catch (error) {
    console.error("Error handling charge succeeded:", error);
  }
}

async function handleChargeFailed(charge: Stripe.Charge) {
  try {
    console.log("Charge failed:", charge.id);
    // Additional charge-specific logic if needed
  } catch (error) {
    console.error("Error handling charge failed:", error);
  }
} 