"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function isUniqueSlugError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray((error.meta as { target?: unknown })?.target) &&
    (error.meta as { target: string[] }).target.includes("slug")
  );
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function dollarsToCents(value: FormDataEntryValue | null): number {
  const n = Number.parseFloat(String(value ?? "0"));
  return Math.round(n * 100);
}

const productSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().trim().min(1),
  categoryName: z.string().trim().min(1),
  basePrice: z.number().int().min(0),
  images: z.array(z.string().trim().url()).min(1),
  published: z.boolean(),
});

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    description: formData.get("description"),
    categoryName: formData.get("categoryName"),
    basePrice: dollarsToCents(formData.get("basePrice")),
    images,
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid product data.");
  }

  const { categoryName, ...data } = parsed.data;
  const categorySlug = slugify(categoryName);

  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: {},
    create: { name: categoryName, slug: categorySlug },
  });

  let product;
  try {
    product = await prisma.product.create({
      data: { ...data, categoryId: category.id },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect(
        `/admin/products/new?error=${encodeURIComponent(`A product with the slug "${data.slug}" already exists.`)}`,
      );
    }
    throw error;
  }

  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || "")),
    description: formData.get("description"),
    categoryName: formData.get("categoryName"),
    basePrice: dollarsToCents(formData.get("basePrice")),
    images,
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid product data.");
  }

  const { categoryName, ...data } = parsed.data;
  const categorySlug = slugify(categoryName);

  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: {},
    create: { name: categoryName, slug: categorySlug },
  });

  try {
    await prisma.product.update({
      where: { id },
      data: { ...data, categoryId: category.id },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect(
        `/admin/products/${id}/edit?error=${encodeURIComponent(`A product with the slug "${data.slug}" already exists.`)}`,
      );
    }
    throw error;
  }

  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/admin/products");
}

const variantSchema = z.object({
  productId: z.string().min(1),
  size: z.string().trim().min(1),
  color: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  price: z.number().int().min(0),
  stock: z.number().int().min(0),
});

export async function addVariant(formData: FormData) {
  await requireAdmin();

  const productId = String(formData.get("productId"));
  const parsed = variantSchema.safeParse({
    productId,
    size: formData.get("size"),
    color: formData.get("color"),
    sku: formData.get("sku"),
    price: dollarsToCents(formData.get("price")),
    stock: Number.parseInt(String(formData.get("stock") ?? "0"), 10),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid variant data.");
  }

  try {
    await prisma.variant.create({ data: parsed.data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      redirect(
        `/admin/products/${productId}/edit?error=${encodeURIComponent(`SKU "${parsed.data.sku}" is already in use.`)}`,
      );
    }
    throw error;
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function updateVariant(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const productId = String(formData.get("productId"));
  const price = dollarsToCents(formData.get("price"));
  const stock = Number.parseInt(String(formData.get("stock") ?? "0"), 10);

  await prisma.variant.update({
    where: { id },
    data: { price, stock },
  });

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function deleteVariant(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const productId = String(formData.get("productId"));

  await prisma.variant.delete({ where: { id } });
  revalidatePath(`/admin/products/${productId}/edit`);
}
