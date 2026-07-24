"use client";

import { useState } from "react";
import { useCart, type CartItem } from "./CartProvider";

export function AddToCartButton({
  product,
  className = "",
  large = false,
}: {
  product: Omit<CartItem, "quantity">;
  className?: string;
  large?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handle() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      onClick={handle}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all ${
        large ? "h-12 px-7 text-base" : "h-10 px-5 text-sm"
      } ${
        added
          ? "bg-green text-cream"
          : "bg-blush text-white hover:brightness-105 active:scale-[0.98]"
      } ${className}`}
    >
      {added ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          В корзине
        </>
      ) : (
        "В корзину"
      )}
    </button>
  );
}
