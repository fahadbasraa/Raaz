"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const codeSchema = z.object({
  code: z.string().trim().toUpperCase().min(3).max(20),
  percentOff: z.number().int().min(1).max(90),
  expiresAt: z.string().optional(),
});

export async function createDiscountCode(formData: FormData) {
  await requireAdmin();

  const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();
  const parsed = codeSchema.safeParse({
    code: formData.get("code"),
    percentOff: Number.parseInt(String(formData.get("percentOff") ?? "0"), 10),
    expiresAt: expiresAtRaw || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid discount code.");
  }

  await prisma.discountCode.create({
    data: {
      code: parsed.data.code,
      percentOff: parsed.data.percentOff,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  revalidatePath("/admin/discounts");
}

export async function toggleDiscountCode(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";

  await prisma.discountCode.update({
    where: { id },
    data: { active: !active },
  });

  revalidatePath("/admin/discounts");
}
