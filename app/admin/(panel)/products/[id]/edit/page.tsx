import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/data";
import { updateProduct } from "@/lib/admin-actions";
import { ProductForm } from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  const [product, categories] = await Promise.all([
    Number.isNaN(productId)
      ? null
      : prisma.product.findUnique({ where: { id: productId } }),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/products" className="text-sm text-ink-soft hover:text-blush">
        ← К списку товаров
      </Link>
      <h1 className="mt-2 font-display text-4xl text-ink">Редактирование</h1>
      <p className="mt-1 text-ink-soft">{product.name}</p>

      <ProductForm
        categories={categories}
        action={updateProduct}
        submitLabel="Сохранить изменения"
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          categoryId: product.categoryId,
          image: product.image,
          description: product.description,
          inStock: product.inStock,
          featured: product.featured,
        }}
      />
    </div>
  );
}
