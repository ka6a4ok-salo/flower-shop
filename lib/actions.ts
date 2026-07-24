"use server";

import { prisma } from "./prisma";

export type OrderInput = {
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  comment: string;
  payment: "cash" | "card";
  items: { productId: number; quantity: number }[];
};

export type OrderResult =
  | { ok: true; orderId: number; total: number }
  | { ok: false; error: string };

export async function createOrder(input: OrderInput): Promise<OrderResult> {
  // --- Валидация ---
  if (!input.customerName?.trim()) return { ok: false, error: "Укажите имя" };
  if (!input.phone?.trim()) return { ok: false, error: "Укажите телефон" };
  if (!input.address?.trim())
    return { ok: false, error: "Укажите адрес доставки" };
  if (!input.items?.length) return { ok: false, error: "Корзина пуста" };

  // --- Цены берём из базы, а не с клиента (защита от подмены) ---
  const ids = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
  });
  const priceMap = new Map(products.map((p) => [p.id, p]));

  const orderItems = input.items
    .map((i) => {
      const p = priceMap.get(i.productId);
      if (!p) return null;
      const quantity = Math.max(1, Math.min(99, Math.round(i.quantity)));
      return {
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (orderItems.length === 0)
    return { ok: false, error: "Товары не найдены" };

  const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerName: input.customerName.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
      deliveryDate: input.deliveryDate?.trim() ?? "",
      deliveryTime: input.deliveryTime?.trim() ?? "",
      comment: input.comment?.trim() ?? "",
      payment: input.payment === "card" ? "card" : "cash",
      status: "new",
      total,
      items: { create: orderItems },
    },
  });

  return { ok: true, orderId: order.id, total };
}
