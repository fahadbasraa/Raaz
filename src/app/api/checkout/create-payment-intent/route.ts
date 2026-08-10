import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const shippingAddressSchema = z.object({
  name: z.string().trim().min(1),
  line1: z.string().trim().min(1),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  country: z.string().trim().min(1),
});

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
  shippingAddress: shippingAddressSchema,
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "Sign in to check out." },
      { status: 401 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "That order doesn't look right — please try again." },
      { status: 400 },
    );
  }

  const { items, shippingAddress } = parsed.data;

  const variants = await prisma.variant.findMany({
    where: { id: { in: items.map((i) => i.variantId) } },
    include: { product: true },
  });

  const variantById = new Map(variants.map((v) => [v.id, v]));

  for (const item of items) {
    const variant = variantById.get(item.variantId);
    if (!variant) {
      return NextResponse.json(
        { message: "One of these pieces is no longer available." },
        { status: 400 },
      );
    }
    if (variant.stock < item.quantity) {
      return NextResponse.json(
        {
          message: `Only ${variant.stock} left of ${variant.product.name} (${variant.color} — ${variant.size}).`,
        },
        { status: 400 },
      );
    }
  }

  if (!stripe) {
    return NextResponse.json(
      {
        message:
          "Payment isn't connected yet. The atelier is finishing this part — please check back shortly.",
      },
      { status: 503 },
    );
  }

  const total = items.reduce((sum, item) => {
    const variant = variantById.get(item.variantId)!;
    return sum + variant.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      email: session.user.email ?? "",
      status: "pending",
      total,
      shippingAddress,
      items: {
        create: items.map((item) => {
          const variant = variantById.get(item.variantId)!;
          return {
            variantId: variant.id,
            nameSnapshot: `${variant.product.name} — ${variant.color} / ${variant.size}`,
            priceSnapshot: variant.price,
            quantity: item.quantity,
          };
        }),
      },
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
    total,
  });
}
