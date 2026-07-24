import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { updateOrderStatus } from "@/lib/admin-actions";
import { ORDER_STATUSES, statusLabel, statusClasses } from "@/lib/orderStatus";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-4xl text-ink">Заказы</h1>
      <p className="mt-1 text-ink-soft">Всего: {orders.length}</p>

      {orders.length === 0 ? (
        <p className="mt-8 text-ink-soft">Заказов пока нет.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl text-ink">Заказ №{o.id}</h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(o.status)}`}
                    >
                      {statusLabel(o.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">
                    {new Date(o.createdAt).toLocaleString("ru-RU")} ·{" "}
                    {o.payment === "card" ? "Оплата картой (демо)" : "Оплата при получении"}
                  </p>
                </div>
                <span className="font-display text-2xl text-ink tabular-nums">
                  {formatPrice(o.total)}
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {/* Клиент */}
                <div className="rounded-xl bg-surface-2 p-4 text-sm">
                  <p className="text-ink">
                    <span className="text-ink-soft">Клиент: </span>
                    {o.customerName}
                  </p>
                  <p className="mt-1 text-ink">
                    <span className="text-ink-soft">Телефон: </span>
                    <a href={`tel:${o.phone}`} className="hover:text-blush">
                      {o.phone}
                    </a>
                  </p>
                  <p className="mt-1 text-ink">
                    <span className="text-ink-soft">Адрес: </span>
                    {o.address}
                  </p>
                  {(o.deliveryDate || o.deliveryTime) && (
                    <p className="mt-1 text-ink">
                      <span className="text-ink-soft">Доставка: </span>
                      {o.deliveryDate} {o.deliveryTime}
                    </p>
                  )}
                  {o.comment && (
                    <p className="mt-1 text-ink">
                      <span className="text-ink-soft">Комментарий: </span>
                      {o.comment}
                    </p>
                  )}
                </div>

                {/* Состав */}
                <div className="rounded-xl bg-surface-2 p-4 text-sm">
                  <p className="mb-2 text-ink-soft">Состав заказа:</p>
                  {o.items.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span className="text-ink">
                        {i.name} × {i.quantity}
                      </span>
                      <span className="text-ink tabular-nums">
                        {formatPrice(i.price * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Управление статусом */}
              <form action={updateOrderStatus} className="mt-4 flex flex-wrap items-center gap-2">
                <input type="hidden" name="orderId" value={o.id} />
                <span className="text-sm text-ink-soft">Статус:</span>
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="submit"
                    name="status"
                    value={s.value}
                    className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                      o.status === s.value
                        ? "bg-green text-cream"
                        : "border border-line text-ink-soft hover:border-green hover:text-ink"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
