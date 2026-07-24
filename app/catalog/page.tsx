import Link from "next/link";
import type { Metadata } from "next";
import { getProducts, getCategories, type SortOption } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Каталог букетов и цветов",
  description:
    "Каталог свежих букетов, композиций и растений с доставкой. Фильтр по категориям и цене.",
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Популярные" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const activeCategory = sp.category;
  const activeSort = (sp.sort as SortOption) ?? "popular";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category: activeCategory, sort: activeSort }),
  ]);

  const buildHref = (params: { category?: string; sort?: string }) => {
    const q = new URLSearchParams();
    const cat = params.category ?? activeCategory;
    const sort = params.sort ?? activeSort;
    if (cat) q.set("category", cat);
    if (sort && sort !== "popular") q.set("sort", sort);
    const s = q.toString();
    return s ? `/catalog?${s}` : "/catalog";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="eyebrow">Каталог</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Свежие цветы</h1>
      <p className="mt-3 max-w-lg text-ink-soft">
        Выберите готовый букет — соберём и доставим в день заказа.
      </p>

      {/* Фильтр по категориям */}
      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip href={buildHref({ category: "" })} active={!activeCategory}>
          Все
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            href={buildHref({ category: c.slug })}
            active={activeCategory === c.slug}
          >
            {c.name}
          </FilterChip>
        ))}
      </div>

      {/* Сортировка */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="mr-1 text-sm text-ink-soft">Сортировка:</span>
        {sortOptions.map((o) => (
          <Link
            key={o.value}
            href={buildHref({ sort: o.value })}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              activeSort === o.value
                ? "bg-ink text-cream"
                : "text-ink-soft hover:bg-surface-2"
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>

      {/* Сетка товаров */}
      {products.length === 0 ? (
        <p className="mt-16 text-center text-ink-soft">
          В этой категории пока нет товаров.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-blush bg-blush text-white"
          : "border-line bg-surface text-ink hover:border-blush"
      }`}
    >
      {children}
    </Link>
  );
}
