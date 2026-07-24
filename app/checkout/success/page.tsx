import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderId = order ? parseInt(order, 10) : NaN;
  const record = Number.isNaN(orderId)
    ? null
    : await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blush-soft text-blush">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-6 font-display text-4xl text-ink">Заказ оформлен!</h1>
      {record ? (
        <p className="mt-3 text-ink-soft">
          Спасибо, {record.customerName}! Ваш заказ{" "}
          <span className="font-semibold text-ink">№ {record.id}</span> принят.
          {record.payment === "card"
            ? " Оплата картой прошла успешно (демо)."
            : " Оплата — при получении."}
        </p>
      ) : (
        <p className="mt-3 text-ink-soft">
          Спасибо! Мы приняли ваш заказ и скоро свяжемся с вами.
        </p>
      )}

      {record && (
        <div className="mt-8 rounded-2xl border border-line bg-surface-2 p-6 text-left">
          <h2 className="text-sm font-semibold text-ink">Состав заказа</h2>
          <div className="mt-3 space-y-2">
            {record.items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-ink-soft">
                  {i.name} × {i.quantity}
                </span>
                <span className="text-ink tabular-nums">
                  {formatPrice(i.price * i.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-line pt-3">
            <span className="font-medium text-ink">Итого</span>
            <span className="font-semibold text-ink tabular-nums">
              {formatPrice(record.total)}
            </span>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm text-ink-soft">
        Наш флорист свяжется с вами по телефону для подтверждения деталей и
        стоимости доставки.
      </p>

      <Link
        href="/catalog"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-green px-8 font-medium text-cream transition-transform hover:scale-[1.03]"
      >
        Вернуться в каталог
      </Link>
    </div>
  );
}
