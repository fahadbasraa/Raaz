import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM } from "@/lib/email";
import OrderConfirmationEmail from "@/emails/order-confirmation";

export async function sendOrderConfirmationEmail(orderId: string) {
  if (!resend) {
    console.log(
      `Resend not configured — skipping confirmation email for order ${orderId}.`,
    );
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || !order.email) return;

  const shippingAddress = order.shippingAddress as {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  if (!shippingAddress) return;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: order.email,
    subject: `Your RAAZ order — #${order.id.slice(-8).toUpperCase()}`,
    react: OrderConfirmationEmail({
      orderNumber: order.id.slice(-8).toUpperCase(),
      items: order.items.map((item) => ({
        name: item.nameSnapshot,
        quantity: item.quantity,
        price: item.priceSnapshot,
      })),
      total: order.total,
      shippingAddress,
    }),
  });
}
