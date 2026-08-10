"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = schema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return {
      status: "error",
      message: "That doesn't look like an email address.",
    };
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email },
  });

  return { status: "success", message: "You're on the list." };
}
