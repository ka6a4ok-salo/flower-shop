import Link from "next/link";
import { getCategories } from "@/lib/data";
import { createProduct } from "@/lib/admin-actions";
import { ProductForm } from "@/components/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/products" className="text-sm text-ink-soft hover:text-blush">
        ← К списку товаров
      </Link>
      <h1 className="mt-2 font-display text-4xl text-ink">Новый товар</h1>

      <ProductForm
        categories={categories}
        action={createProduct}
        submitLabel="Создать товар"
      />
    </div>
  );
}
