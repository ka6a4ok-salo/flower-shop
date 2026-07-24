import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Товар не найден" };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      {/* Хлебные крошки */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
        <Link href="/" className="hover:text-blush">Главная</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-blush">Каталог</Link>
        <span>/</span>
        <Link
          href={`/catalog?category=${product.category.slug}`}
          className="hover:text-blush"
        >
          {product.category.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-surface-2">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="eyebrow">{product.category.name}</p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 text-3xl font-semibold text-ink tabular-nums">
            {formatPrice(product.price)}
          </p>

          <span
            className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm ${
              product.inStock
                ? "bg-blush-soft text-blush"
                : "bg-surface-2 text-ink-soft"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                product.inStock ? "bg-blush" : "bg-ink-soft"
              }`}
            />
            {product.inStock ? "В наличии" : "Под заказ"}
          </span>

          <p className="mt-6 text-ink-soft leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartButton
              large
              className="w-full sm:w-auto"
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
              }}
            />
          </div>

          <ul className="mt-8 space-y-2 border-t border-line pt-6 text-sm text-ink-soft">
            <li className="flex gap-2"><Check /> Свежие цветы, собранные в день доставки</li>
            <li className="flex gap-2"><Check /> Фото букета перед отправкой</li>
            <li className="flex gap-2"><Check /> Доставка по городу за 2 часа</li>
          </ul>
        </div>
      </div>

      {/* Похожие */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl text-ink">Похожие товары</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-blush" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
