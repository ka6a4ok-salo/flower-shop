import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
  ]);

  return (
    <>
      {/* ---------- Герой ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 md:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">Цветочная мастерская · Москва</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
              Букеты, которые
              <span className="text-blush"> говорят за вас</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-soft">
              Собираем авторские композиции вручную из свежих цветов и доставляем
              в день заказа — бережно и вовремя.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="inline-flex h-12 items-center rounded-full bg-green px-8 text-base font-medium text-cream transition-transform hover:scale-[1.03]"
              >
                Выбрать букет
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center rounded-full border border-line px-8 text-base font-medium text-ink transition-colors hover:bg-surface-2"
              >
                О мастерской
              </Link>
            </div>
            <dl className="mt-10 flex gap-8">
              {[
                ["2 часа", "средняя доставка"],
                ["7 дней", "свежесть букета"],
                ["4.9 ★", "рейтинг клиентов"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-green">{v}</dt>
                  <dd className="mt-1 text-xs text-ink-soft">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-line bg-surface-2">
              <Image
                src="/products/buket-nezhnost.jpg"
                alt="Букет «Нежность»"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 400px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-2 hidden aspect-square w-40 overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-lg sm:block">
              <Image
                src="/products/kompoziciya-provans.jpg"
                alt="Композиция «Прованс»"
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-3 -top-5 hidden aspect-square w-28 overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-lg md:block">
              <Image
                src="/products/podsolnuhi.jpg"
                alt="Подсолнухи"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Категории ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalog?category=${c.slug}`}
              className="flex items-center justify-center rounded-2xl border border-line bg-surface px-4 py-6 text-center transition-colors hover:border-blush hover:bg-surface-2"
            >
              <span className="font-display text-2xl text-ink">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Популярное ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Выбор покупателей</p>
            <h2 className="mt-2 font-display text-4xl text-ink">Популярные букеты</h2>
          </div>
          <Link href="/catalog" className="shrink-0 text-sm font-medium text-blush hover:underline">
            Весь каталог →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- Преимущества ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 rounded-[2rem] border border-line bg-surface-2 p-8 sm:grid-cols-2 md:grid-cols-4 md:p-12">
          {[
            ["Свежие цветы", "Закупаем ежедневно, собираем букет в день доставки."],
            ["Авторская сборка", "Каждую композицию флорист собирает вручную."],
            ["Быстрая доставка", "Привезём за 2 часа по городу, бережно и вовремя."],
            ["Фото перед отправкой", "Пришлём фотографию готового букета на согласование."],
          ].map(([title, text]) => (
            <div key={title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-soft text-blush">
                <Petal />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-green px-8 py-14 text-center md:py-20">
          <h2 className="font-display text-4xl text-cream md:text-5xl">
            Не знаете, что выбрать?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream/80">
            Позвоните — флорист поможет подобрать букет под повод, настроение и
            бюджет.
          </p>
          <a
            href="tel:+74951234567"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-cream px-8 text-base font-medium text-green transition-transform hover:scale-[1.03]"
          >
            +7 (495) 123-45-67
          </a>
        </div>
      </section>
    </>
  );
}

function Petal() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2c3 4 6 6 6 10a6 6 0 1 1-12 0c0-4 3-6 6-10Z"
        fill="currentColor"
      />
    </svg>
  );
}
