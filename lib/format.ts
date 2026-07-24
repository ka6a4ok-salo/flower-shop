// Форматирование цены в рублях: 3500 → «3 500 ₽»
export function formatPrice(rubles: number): string {
  return new Intl.NumberFormat("ru-RU").format(rubles) + " ₽";
}
