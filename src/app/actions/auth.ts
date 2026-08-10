"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { AuthActionState } from "@/lib/auth-state";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Tell us what to call you.").max(100),
  email: z.string().trim().toLowerCase().email("That doesn't look like an email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      status: "error",
      message: "An account already exists for that email.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  return { status: "success", message: "" };
}
