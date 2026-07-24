import { prisma } from "./prisma";

export type SortOption = "popular" | "price-asc" | "price-desc";

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { featured: true, inStock: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProducts(opts: {
  category?: string;
  sort?: SortOption;
} = {}) {
  const orderBy =
    opts.sort === "price-asc"
      ? { price: "asc" as const }
      : opts.sort === "price-desc"
        ? { price: "desc" as const }
        : { featured: "desc" as const };

  return prisma.product.findMany({
    where: opts.category
      ? { category: { slug: opts.category } }
      : undefined,
    orderBy,
    include: { category: true },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getRelatedProducts(
  categoryId: number,
  excludeId: number,
  limit = 3
) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, inStock: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}
