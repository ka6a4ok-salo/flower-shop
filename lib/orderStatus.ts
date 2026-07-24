export const ORDER_STATUSES = [
  { value: "new", label: "Новый" },
  { value: "processing", label: "В работе" },
  { value: "done", label: "Выполнен" },
] as const;

export function statusLabel(status: string): string {
  return ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

// Классы для цветного бейджа статуса
export function statusClasses(status: string): string {
  switch (status) {
    case "new":
      return "bg-blush-soft text-blush";
    case "processing":
      return "bg-amber-100 text-amber-700";
    case "done":
      return "bg-green/15 text-green";
    default:
      return "bg-surface-2 text-ink-soft";
  }
}
