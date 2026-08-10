import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: "Webhook not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      await handlePaymentSucceeded(event.data.object);
      break;
    }
    case "payment_intent.payment_failed": {
      await handlePaymentFailed(event.data.object);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  if (!orderId) {
    console.error("payment_intent.succeeded with no orderId in metadata:", paymentIntent.id);
    return;
  }

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    // Idempotent: Stripe may deliver this event more than once.
    if (!order || order.status !== "pending") return;

    for (const item of order.items) {
      const result = await tx.variant.updateMany({
        where: { id: item.variantId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });

      if (result.count === 0) {
        // Sold out between checkout and payment confirmation (e.g. two
        // buyers racing the last unit). The charge already succeeded, so
        // the order still gets marked paid — this is flagged for manual
        // fulfillment/refund review rather than silently oversold.
        console.error(
          `OVERSOLD: order ${orderId}, variant ${item.variantId} — insufficient stock at payment time`,
        );
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status: "paid" },
    });
  });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  if (!orderId) return;

  await prisma.order.updateMany({
    where: { id: orderId, status: "pending" },
    data: { status: "cancelled" },
  });
}
