import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Адрес, телефон и часы работы цветочной мастерской Флёр. Доставка по Москве ежедневно.",
};

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="eyebrow">Контакты</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Как нас найти</h1>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <ContactRow label="Телефон">
            <a href="tel:+74951234567" className="hover:text-blush">
              +7 (495) 123-45-67
            </a>
          </ContactRow>
          <ContactRow label="Почта">
            <a href="mailto:hello@fleur.ru" className="hover:text-blush">
              hello@fleur.ru
            </a>
          </ContactRow>
          <ContactRow label="Адрес">
            Москва, ул. Цветочная, 12
            <br />
            <span className="text-ink-soft">1 этаж, вход со двора</span>
          </ContactRow>
          <ContactRow label="Часы работы">
            Ежедневно с 8:00 до 22:00
          </ContactRow>
          <ContactRow label="Доставка">
            По Москве в пределах МКАД — от 2 часов.
            <br />
            <span className="text-ink-soft">
              За МКАД — по договорённости.
            </span>
          </ContactRow>
        </div>

        {/* Схематичная «карта» — плейсхолдер, заменяется на реальную карту */}
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface-2 min-h-72">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush text-white shadow-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                />
                <circle cx="12" cy="10" r="2.4" fill="currentColor" />
              </svg>
            </div>
            <p className="mt-3 font-medium text-ink">ул. Цветочная, 12</p>
            <p className="text-sm text-ink-soft">Здесь будет интерактивная карта</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line pb-4">
      <div className="eyebrow">{label}</div>
      <div className="mt-2 text-lg text-ink">{children}</div>
    </div>
  );
}
