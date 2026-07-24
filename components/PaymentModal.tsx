"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

export function PaymentModal({
  total,
  onSuccess,
  onClose,
}: {
  total: number;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);

  function fillTestCard() {
    setNumber("4111 1111 1111 1111");
    setExpiry("12/28");
    setCvc("123");
  }

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    // Имитация обращения к платёжному сервису
    setTimeout(() => {
      onSuccess();
    }, 1600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Оплата картой</h2>
          {!processing && (
            <button
              onClick={onClose}
              className="text-ink-soft hover:text-ink"
              aria-label="Закрыть"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="mt-3 rounded-xl bg-blush-soft px-4 py-3 text-sm text-blush">
          Демо-режим: реальная оплата не производится. Можно нажать «Заполнить
          тестовую карту».
        </div>

        {processing ? (
          <div className="flex flex-col items-center py-12">
            <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-blush" />
            <p className="mt-4 text-ink-soft">Обработка платежа…</p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="mt-5 space-y-4">
            <div>
              <label className="text-sm text-ink-soft">Номер карты</label>
              <input
                inputMode="numeric"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="0000 0000 0000 0000"
                required
                className="mt-1 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-blush"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-ink-soft">Срок</label>
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="ММ/ГГ"
                  required
                  className="mt-1 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-blush"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-ink-soft">CVC</label>
                <input
                  inputMode="numeric"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="000"
                  required
                  className="mt-1 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-blush"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={fillTestCard}
              className="text-sm text-blush hover:underline"
            >
              Заполнить тестовую карту
            </button>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-full bg-blush font-medium text-white transition-all hover:brightness-105"
            >
              Оплатить {formatPrice(total)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
