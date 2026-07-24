"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, total, setQuantity, removeItem, ready } = useCart();

  if (!ready) {
    return <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-4xl text-ink">Корзина пуста</h1>
        <p className="mt-3 text-ink-soft">
          Загляните в каталог — там много свежих букетов.
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-green px-8 font-medium text-cream transition-transform hover:scale-[1.03]"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl text-ink">Корзина</h1>

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 sm:p-4"
          >
            <Link
              href={`/product/${item.slug}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:h-24 sm:w-24"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${item.slug}`}
                className="font-display text-lg leading-tight text-ink hover:text-blush"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-ink-soft tabular-nums">
                {formatPrice(item.price)} / шт
              </p>

              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded-full border border-line">
                  <button
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-ink"
                    aria-label="Уменьшить количество"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-ink"
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-ink-soft hover:text-blush"
                >
                  Удалить
                </button>
              </div>
            </div>

            <div className="shrink-0 self-start text-right font-semibold text-ink tabular-nums">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Итог */}
      <div className="mt-8 rounded-2xl border border-line bg-surface-2 p-6">
        <div className="flex items-center justify-between">
          <span className="text-ink-soft">Итого</span>
          <span className="font-display text-3xl text-ink tabular-nums">
            {formatPrice(total)}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          Стоимость доставки рассчитает менеджер при подтверждении заказа.
        </p>
        <Link
          href="/checkout"
          className="mt-5 flex h-13 w-full items-center justify-center rounded-full bg-blush px-8 py-3.5 text-base font-medium text-white transition-all hover:brightness-105"
        >
          Оформить заказ
        </Link>
        <Link
          href="/catalog"
          className="mt-3 block text-center text-sm text-ink-soft hover:text-blush"
        >
          Продолжить покупки
        </Link>
      </div>
    </div>
  );
}
