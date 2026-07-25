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

// ---------- Категории ----------

// Подбираем свободный slug для категории (аналогично товарам).
async function ensureUniqueCategorySlug(base: string, excludeId?: number) {
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function revalidateCatalog() {
  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  revalidatePath("/");
}

export async function createCategory(formData: FormData) {
  await requireAuth();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/admin/categories?error=empty");
  const slug = await ensureUniqueCategorySlug(slugify(name));
  const agg = await prisma.category.aggregate({ _max: { order: true } });
  const order = (agg._max.order ?? 0) + 1;
  await prisma.category.create({ data: { name, slug, order } });
  revalidateCatalog();
  redirect("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  await requireAuth();
  const id = parseInt(String(formData.get("id") ?? "0"), 10);
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) redirect("/admin/categories?error=empty");
  const slug = await ensureUniqueCategorySlug(slugify(name), id);
  await prisma.category.update({ where: { id }, data: { name, slug } });
  revalidateCatalog();
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAuth();
  const id = parseInt(String(formData.get("id") ?? "0"), 10);
  if (!id) return;
  // Защита: у товара categoryId с onDelete: Cascade — удаление категории
  // молча снесло бы все её товары. Поэтому блокируем, пока в ней есть товары.
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) redirect("/admin/categories?error=has-products");
  await prisma.category.delete({ where: { id } });
  revalidateCatalog();
  redirect("/admin/categories");
}

// Перемещение категории вверх/вниз — меняем местами значение order с соседом.
export async function moveCategory(formData: FormData) {
  await requireAuth();
  const id = parseInt(String(formData.get("id") ?? "0"), 10);
  const dir = String(formData.get("dir") ?? "");
  if (!id || (dir !== "up" && dir !== "down")) return;
  const all = await prisma.category.findMany({ orderBy: { order: "asc" } });
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return;
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return;
  const a = all[idx];
  const b = all[swapIdx];
  await prisma.$transaction([
    prisma.category.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.category.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidateCatalog();
  redirect("/admin/categories");
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
