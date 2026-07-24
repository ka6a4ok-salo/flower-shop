"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { login, logout, requireAuth } from "./auth";
import { slugify } from "./slug";

// ---------- Авторизация ----------

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const ok = await login(password);
  if (!ok) return { error: "Неверный пароль" };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

// ---------- Товары ----------

async function ensureUniqueSlug(base: string, excludeId?: number) {
  let slug = base;
  let n = 1;
  // Подбираем свободный slug, добавляя -2, -3 при совпадении
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function parseProductForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    price: Math.max(0, parseInt(String(formData.get("price") ?? "0"), 10) || 0),
    categoryId: parseInt(String(formData.get("categoryId") ?? "0"), 10) || 0,
    image: String(formData.get("image") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    inStock: formData.get("inStock") === "on",
    featured: formData.get("featured") === "on",
  };
}

export async function createProduct(formData: FormData) {
  await requireAuth();
  const data = parseProductForm(formData);
  if (!data.name || !data.categoryId) {
    redirect("/admin/products/new?error=1");
  }
  const slug = await ensureUniqueSlug(slugify(data.name));
  await prisma.product.create({ data: { ...data, slug } });

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await requireAuth();
  const id = parseInt(String(formData.get("id") ?? "0"), 10);
  const data = parseProductForm(formData);
  if (!id || !data.name || !data.categoryId) {
    redirect(`/admin/products/${id}/edit?error=1`);
  }
  const slug = await ensureUniqueSlug(slugify(data.name), id);
  await prisma.product.update({ where: { id }, data: { ...data, slug } });

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = parseInt(String(formData.get("id") ?? "0"), 10);
  if (id) {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");
  }
}

// ---------- Заказы ----------

export async function updateOrderStatus(formData: FormData) {
  await requireAuth();
  const id = parseInt(String(formData.get("orderId") ?? "0"), 10);
  const status = String(formData.get("status") ?? "new");
  const allowed = ["new", "processing", "done"];
  if (id && allowed.includes(status)) {
    await prisma.order.update({ where: { id }, data: { status } });
    revalidatePath("/admin/orders");
  }
}
