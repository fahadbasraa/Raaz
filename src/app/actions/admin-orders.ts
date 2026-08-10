"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const statusSchema = z.enum(["pending", "paid", "fulfilled", "cancelled"]);

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) throw new Error("Invalid order status.");

  await prisma.order.update({
    where: { id },
    data: { status: parsed.data },
  });

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}
