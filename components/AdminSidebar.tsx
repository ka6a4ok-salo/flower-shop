"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/admin-actions";

const links = [
  { href: "/admin", label: "Обзор", exact: true },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/orders", label: "Заказы" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col gap-1 border-line bg-surface md:h-screen md:w-60 md:border-r">
      <div className="flex items-center justify-between border-b border-line px-5 py-4 md:block">
        <Link href="/admin" className="font-display text-2xl text-green">
          Флёр
        </Link>
        <p className="hidden text-xs text-ink-soft md:block">Панель управления</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 py-3 md:flex-col md:py-4">
        {links.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname?.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-green text-cream"
                  : "text-ink-soft hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line p-3 md:p-4">
        <Link
          href="/"
          className="block rounded-xl px-4 py-2 text-sm text-ink-soft hover:text-ink"
        >
          ← На сайт
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-1 w-full rounded-xl px-4 py-2 text-left text-sm text-ink-soft hover:text-blush"
          >
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
