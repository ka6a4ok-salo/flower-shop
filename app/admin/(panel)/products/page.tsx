import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-ink">Товары</h1>
          <p className="mt-1 text-ink-soft">Всего: {products.length}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-green px-5 font-medium text-cream transition-transform hover:scale-[1.03]"
        >
          <span className="text-lg leading-none">+</span> Добавить товар
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
              <Image src={p.image} alt={p.name} fill sizes="64px" className="object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{p.name}</p>
              <p className="text-sm text-ink-soft">{p.category.name}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {!p.inStock && (
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-ink-soft">
                    Под заказ
                  </span>
                )}
                {p.featured && (
                  <span className="rounded-full bg-blush-soft px-2 py-0.5 text-xs text-blush">
                    Популярное
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span className="font-medium text-ink tabular-nums">
                {formatPrice(p.price)}
              </span>
              <div className="mt-1 flex items-center justify-end gap-1">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="rounded-lg px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  Изменить
                </Link>
                <DeleteProductButton id={p.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
