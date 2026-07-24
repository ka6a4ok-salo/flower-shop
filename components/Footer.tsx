import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-green">Флёр</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Цветочная мастерская. Собираем авторские букеты вручную и доставляем
            свежими в день заказа.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Навигация</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/catalog" className="hover:text-blush">Каталог</Link></li>
            <li><Link href="/about" className="hover:text-blush">О нас</Link></li>
            <li><Link href="/contacts" className="hover:text-blush">Контакты</Link></li>
            <li><Link href="/cart" className="hover:text-blush">Корзина</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Контакты</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><a href="tel:+74951234567" className="hover:text-blush">+7 (495) 123-45-67</a></li>
            <li><a href="mailto:hello@fleur.ru" className="hover:text-blush">hello@fleur.ru</a></li>
            <li>Москва, ул. Цветочная, 12</li>
            <li>Ежедневно 8:00–22:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-soft sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Флёр. Все права защищены.</span>
          <span>Демо-проект. Оплата и данные не являются реальными.</span>
        </div>
      </div>
    </footer>
  );
}
