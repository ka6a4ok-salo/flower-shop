"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { PaymentModal } from "@/components/PaymentModal";
import { createOrder } from "@/lib/actions";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, total, clear, ready } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    comment: "",
  });
  const [payment, setPayment] = useState<"cash" | "card">("card");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submitOrder() {
    setSubmitting(true);
    setError(null);
    const result = await createOrder({
      ...form,
      payment,
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    });
    if (result.ok) {
      clear();
      router.push(`/checkout/success?order=${result.orderId}`);
    } else {
      setError(result.error);
      setSubmitting(false);
      setShowPayment(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.customerName.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Заполните имя, телефон и адрес доставки.");
      return;
    }
    if (payment === "card") {
      setShowPayment(true);
    } else {
      submitOrder();
    }
  }

  if (ready && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-4xl text-ink">Корзина пуста</h1>
        <p className="mt-3 text-ink-soft">Добавьте букеты, чтобы оформить заказ.</p>
        <Link
          href="/catalog"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-green px-8 font-medium text-cream"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-5xl text-ink">Оформление заказа</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Ваше имя" required>
            <input
              value={form.customerName}
              onChange={(e) => update("customerName", e.target.value)}
              className="input"
              placeholder="Как к вам обращаться"
            />
          </Field>
          <Field label="Телефон" required>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="input"
              placeholder="+7 (___) ___-__-__"
            />
          </Field>
          <Field label="Адрес доставки" required>
            <input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="input"
              placeholder="Улица, дом, квартира"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Дата">
              <input
                type="date"
                value={form.deliveryDate}
                onChange={(e) => update("deliveryDate", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Время">
              <input
                type="time"
                value={form.deliveryTime}
                onChange={(e) => update("deliveryTime", e.target.value)}
                className="input"
              />
            </Field>
          </div>
          <Field label="Комментарий к заказу">
            <textarea
              value={form.comment}
              onChange={(e) => update("comment", e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="Текст открытки, пожелания по букету…"
            />
          </Field>

          {/* Способ оплаты */}
          <div>
            <span className="text-sm font-medium text-ink">Способ оплаты</span>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <PayOption
                active={payment === "card"}
                onClick={() => setPayment("card")}
                title="Картой онлайн"
                subtitle="Демо-оплата на сайте"
              />
              <PayOption
                active={payment === "cash"}
                onClick={() => setPayment("cash")}
                title="При получении"
                subtitle="Наличными или картой"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-blush-soft px-4 py-3 text-sm text-blush">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-13 w-full items-center justify-center rounded-full bg-blush px-8 py-3.5 text-base font-medium text-white transition-all hover:brightness-105 disabled:opacity-60 lg:w-auto"
          >
            {submitting
              ? "Оформляем…"
              : payment === "card"
                ? `Перейти к оплате · ${formatPrice(total)}`
                : `Оформить заказ · ${formatPrice(total)}`}
          </button>
        </form>

        {/* Сводка заказа */}
        <aside className="h-fit rounded-2xl border border-line bg-surface-2 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl text-ink">Ваш заказ</h2>
          <div className="mt-4 space-y-3">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                  <Image src={i.image} alt={i.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{i.name}</p>
                  <p className="text-xs text-ink-soft tabular-nums">
                    {i.quantity} × {formatPrice(i.price)}
                  </p>
                </div>
                <span className="text-sm font-medium text-ink tabular-nums">
                  {formatPrice(i.price * i.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="text-ink-soft">Итого</span>
            <span className="font-display text-2xl text-ink tabular-nums">
              {formatPrice(total)}
            </span>
          </div>
        </aside>
      </div>

      {showPayment && (
        <PaymentModal
          total={total}
          onSuccess={submitOrder}
          onClose={() => setShowPayment(false)}
        />
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--line);
          background: var(--surface);
          padding: 0.7rem 1rem;
          color: var(--ink);
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--blush);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-blush"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function PayOption({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-colors ${
        active
          ? "border-blush bg-blush-soft"
          : "border-line bg-surface hover:border-blush"
      }`}
    >
      <span className="block text-sm font-semibold text-ink">{title}</span>
      <span className="mt-0.5 block text-xs text-ink-soft">{subtitle}</span>
    </button>
  );
}
