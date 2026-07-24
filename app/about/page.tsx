import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О мастерской",
  description:
    "Флёр — цветочная мастерская. Собираем авторские букеты вручную из свежих цветов с 2015 года.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow">О нас</p>
          <h1 className="mt-3 font-display text-5xl text-ink">
            Цветы как способ сказать важное
          </h1>
          <p className="mt-6 text-ink-soft leading-relaxed">
            «Флёр» — небольшая цветочная мастерская. С 2015 года мы собираем
            букеты вручную и относимся к каждому заказу как к подарку для
            близкого человека.
          </p>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Мы не держим цветы на витрине неделями. Закупаем свежие партии
            каждое утро, а букет собираем в день доставки — чтобы он простоял у
            вас как можно дольше.
          </p>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-surface-2">
          <Image
            src="/products/buket-makaruny.jpg"
            alt="Букет мастерской Флёр"
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-3">
        {[
          ["9 лет", "собираем букеты"],
          ["12 000+", "довольных клиентов"],
          ["4.9 из 5", "средняя оценка"],
        ].map(([v, l]) => (
          <div
            key={l}
            className="rounded-2xl border border-line bg-surface p-6 text-center"
          >
            <div className="font-display text-4xl text-green">{v}</div>
            <div className="mt-2 text-sm text-ink-soft">{l}</div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="font-display text-3xl text-ink">Как мы работаем</h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Заказ", "Вы выбираете букет на сайте или по телефону."],
            ["Сборка", "Флорист собирает композицию из свежих цветов."],
            ["Согласование", "Присылаем фото готового букета перед отправкой."],
            ["Доставка", "Курьер бережно привозит букет в удобное время."],
          ].map(([title, text], i) => (
            <li key={title} className="rounded-2xl border border-line bg-surface p-5">
              <span className="font-display text-3xl text-blush">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16 rounded-[2rem] bg-green px-8 py-12 text-center">
        <h2 className="font-display text-3xl text-cream">Готовы порадовать близких?</h2>
        <Link
          href="/catalog"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-cream px-8 font-medium text-green transition-transform hover:scale-[1.03]"
        >
          Перейти в каталог
        </Link>
      </div>
    </div>
  );
}
