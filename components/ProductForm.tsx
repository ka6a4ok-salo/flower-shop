"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Category = { id: number; name: string };

type ProductDefaults = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  image: string;
  description: string;
  inStock: boolean;
  featured: boolean;
};

// Доступные изображения (демо). В реальном проекте здесь была бы загрузка файлов
// в облачное хранилище; для портфолио используем готовый набор иллюстраций.
const availableImages = [
  "/products/buket-nezhnost.jpg",
  "/products/buket-aloe-serdce.jpg",
  "/products/buket-vesenniy.jpg",
  "/products/buket-lavanda.jpg",
  "/products/kompoziciya-provans.jpg",
  "/products/kompoziciya-rassvet.jpg",
  "/products/orhideya.jpg",
  "/products/sukkulent.jpg",
  "/products/roza-kustovaya.jpg",
  "/products/buket-makaruny.jpg",
  "/products/gortenziya-oblako.jpg",
  "/products/podsolnuhi.jpg",
];

export function ProductForm({
  categories,
  action,
  product,
  submitLabel,
}: {
  categories: Category[];
  action: (formData: FormData) => void | Promise<void>;
  product?: ProductDefaults;
  submitLabel: string;
}) {
  const [image, setImage] = useState(product?.image ?? availableImages[0]);

  return (
    <form action={action} className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Левая колонка — поля */}
      <div className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-ink">Название *</span>
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="admin-input"
            placeholder="Например: Букет «Весенний»"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">Цена, ₽ *</span>
            <input
              name="price"
              type="number"
              min={0}
              required
              defaultValue={product?.price}
              className="admin-input"
              placeholder="3900"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Категория *</span>
            <select
              name="categoryId"
              required
              defaultValue={product?.categoryId ?? ""}
              className="admin-input"
            >
              <option value="" disabled>
                Выберите…
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-ink">Описание</span>
          <textarea
            name="description"
            rows={5}
            defaultValue={product?.description}
            className="admin-input resize-none"
            placeholder="Расскажите о букете: состав, повод, настроение…"
          />
        </label>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              defaultChecked={product ? product.inStock : true}
              className="h-4 w-4 accent-[var(--green)]"
            />
            <span className="text-sm text-ink">В наличии</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="h-4 w-4 accent-[var(--green)]"
            />
            <span className="text-sm text-ink">Показывать в «Популярном»</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex h-12 items-center rounded-full bg-green px-7 font-medium text-cream transition-transform hover:scale-[1.03]"
          >
            {submitLabel}
          </button>
          <Link
            href="/admin/products"
            className="inline-flex h-12 items-center rounded-full px-5 text-ink-soft hover:text-ink"
          >
            Отмена
          </Link>
        </div>
      </div>

      {/* Правая колонка — изображение */}
      <div>
        <span className="text-sm font-medium text-ink">Изображение</span>
        <div className="relative mt-1.5 aspect-square overflow-hidden rounded-2xl border border-line bg-surface-2">
          <Image src={image} alt="Превью" fill sizes="320px" className="object-cover" />
        </div>
        <input type="hidden" name="image" value={image} />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {availableImages.map((img) => (
            <button
              key={img}
              type="button"
              onClick={() => setImage(img)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                image === img ? "border-blush" : "border-transparent"
              }`}
              aria-label="Выбрать изображение"
            >
              <Image src={img} alt="" fill sizes="70px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        :global(.admin-input) {
          margin-top: 0.375rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--line);
          background: var(--cream);
          padding: 0.65rem 0.9rem;
          color: var(--ink);
          outline: none;
        }
        :global(.admin-input:focus) {
          border-color: var(--blush);
        }
      `}</style>
    </form>
  );
}
