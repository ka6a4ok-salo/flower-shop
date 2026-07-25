"use client";

import { useState } from "react";
import {
  updateCategory,
  deleteCategory,
  moveCategory,
} from "@/lib/admin-actions";

type Category = {
  id: number;
  name: string;
  slug: string;
  productCount: number;
};

export function CategoryRow({
  category,
  isFirst,
  isLast,
}: {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const hasProducts = category.productCount > 0;

  if (editing) {
    return (
      <form
        action={updateCategory}
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-blush bg-surface p-3"
      >
        <input type="hidden" name="id" value={category.id} />
        <input
          name="name"
          required
          autoFocus
          defaultValue={category.name}
          className="admin-input min-w-0 flex-1"
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-full bg-green px-5 text-sm font-medium text-cream transition-transform hover:scale-[1.03]"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="h-10 shrink-0 rounded-full px-4 text-sm text-ink-soft hover:text-ink"
        >
          Отмена
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
      {/* Порядок — стрелки вверх/вниз */}
      <div className="flex shrink-0 flex-col">
        <MoveButton id={category.id} dir="up" disabled={isFirst} label="Выше" />
        <MoveButton id={category.id} dir="down" disabled={isLast} label="Ниже" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{category.name}</p>
        <p className="text-sm text-ink-soft">
          {category.productCount === 0
            ? "нет товаров"
            : `${category.productCount} ${plural(category.productCount)}`}
          {" · "}
          <span className="text-ink-soft/70">/{category.slug}</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
        >
          Изменить
        </button>
        <form
          action={deleteCategory}
          onSubmit={(e) => {
            if (hasProducts) {
              e.preventDefault();
              alert(
                "Нельзя удалить категорию, пока в ней есть товары. Сначала перенесите или удалите товары этой категории."
              );
              return;
            }
            if (!confirm(`Удалить категорию «${category.name}»?`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={category.id} />
          <button
            type="submit"
            title={
              hasProducts
                ? "Сначала уберите товары из этой категории"
                : "Удалить категорию"
            }
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              hasProducts
                ? "cursor-not-allowed text-ink-soft/40"
                : "text-ink-soft hover:bg-blush-soft hover:text-blush"
            }`}
          >
            Удалить
          </button>
        </form>
      </div>
    </div>
  );
}

function MoveButton({
  id,
  dir,
  disabled,
  label,
}: {
  id: number;
  dir: "up" | "down";
  disabled: boolean;
  label: string;
}) {
  return (
    <form action={moveCategory}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={label}
        title={label}
        className="flex h-5 w-6 items-center justify-center rounded text-ink-soft transition-colors enabled:hover:bg-surface-2 enabled:hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
      >
        {dir === "up" ? "▲" : "▼"}
      </button>
    </form>
  );
}

function plural(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "товара";
  return "товаров";
}
