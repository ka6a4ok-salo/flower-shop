import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { statusLabel, statusClasses } from "@/lib/orderStatus";

export default async function AdminDashboard() {
  const [productCount, orderCount, newOrders, orders, revenueAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "new" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

  const revenue = revenueAgg._sum.total ?? 0;

  const stats = [
    { label: "Товаров в каталоге", value: productCount, href: "/admin/products" },
    { label: "Всего заказов", value: orderCount, href: "/admin/orders" },
    { label: "Новых заказов", value: newOrders, href: "/admin/orders" },
    { label: "Сумма заказов", value: formatPrice(revenue), href: "/admin/orders" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-4xl text-ink">Обзор</h1>
      <p className="mt-1 text-ink-soft">Сводка по магазину.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-blush"
          >
            <div className="font-display text-3xl text-ink tabular-nums">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-ink-soft">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Последние заказы</h2>
          <Link href="/admin/orders" className="text-sm text-blush hover:underline">
            Все заказы →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 text-ink-soft">Заказов пока нет.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {orders.map((o) => (
              <Link
                key={o.id}
                href="/admin/orders"
                className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 hover:bg-surface-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">
                    №{o.id} · {o.customerName}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {o.items.length} поз. ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-medium text-ink tabular-nums">
                    {formatPrice(o.total)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(o.status)}`}
                  >
                    {statusLabel(o.status)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
