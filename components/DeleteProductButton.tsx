"use client";

import { deleteProduct } from "@/lib/admin-actions";

export function DeleteProductButton({ id }: { id: number }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm("Удалить этот товар? Действие необратимо.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-blush-soft hover:text-blush"
      >
        Удалить
      </button>
    </form>
  );
}
