import { prisma } from "@/lib/prisma";
import { createCategory } from "@/lib/admin-actions";
import { CategoryRow } from "@/components/CategoryRow";

const errors: Record<string, string> = {
  empty: "Введите название категории.",
  "has-products": "Нельзя удалить категорию, пока в ней есть товары.",
};

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-4xl text-ink">Категории</h1>
      <p className="mt-1 text-ink-soft">
        Разделы каталога. Порядок задаёт отображение фильтров на витрине.
      </p>

      {error && errors[error] && (
        <p className="mt-4 rounded-xl border border-blush bg-blush-soft px-4 py-3 text-sm text-blush">
          {errors[error]}
        </p>
      )}

      {/* Добавление категории */}
      <form
        action={createCategory}
        className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-3"
      >
        <input
          name="name"
          required
          placeholder="Новая категория, например «Свадебные»"
          className="admin-input min-w-0 flex-1"
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-green px-5 font-medium text-cream transition-transform hover:scale-[1.03]"
        >
          <span className="text-lg leading-none">+</span> Добавить
        </button>
      </form>

      {/* Список категорий */}
      <div className="mt-4 space-y-2">
        {categories.map((c, i) => (
          <CategoryRow
            key={c.id}
            category={{
              id: c.id,
              name: c.name,
              slug: c.slug,
              productCount: c._count.products,
            }}
            isFirst={i === 0}
            isLast={i === categories.length - 1}
          />
        ))}
        {categories.length === 0 && (
          <p className="rounded-2xl border border-line bg-surface p-6 text-center text-ink-soft">
            Категорий пока нет. Добавьте первую выше.
          </p>
        )}
      </div>
    </div>
  );
}
