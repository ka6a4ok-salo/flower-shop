import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:3000";
const SHOTS = "e2e-shots";
fs.mkdirSync(SHOTS, { recursive: true });

const log = (...a) => console.log("•", ...a);
let failures = 0;
function assert(cond, msg) {
  if (cond) log("PASS:", msg);
  else {
    failures++;
    console.log("✗ FAIL:", msg);
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
page.on("dialog", (d) => d.accept()); // авто-подтверждение confirm() при удалении

try {
  // ---------- АДМИНКА: защита ----------
  await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  assert(page.url().includes("/admin/login"), "неавторизованный редиректится на /admin/login");

  // ---------- Вход ----------
  await page.fill('input[name="password"]', "admin123");
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/admin`, { timeout: 10000 });
  assert((await page.textContent("h1"))?.includes("Обзор"), "вход выполнен, открыт Обзор");
  await page.screenshot({ path: `${SHOTS}/admin-dashboard.jpeg`, quality: 85, type: "jpeg" });

  // ---------- Создание товара ----------
  await page.goto(`${BASE}/admin/products/new`, { waitUntil: "networkidle" });
  await page.fill('input[name="name"]', "Пионы «Тест CRUD»");
  await page.fill('input[name="price"]', "4321");
  await page.selectOption('select[name="categoryId"]', { index: 1 });
  await page.fill('textarea[name="description"]', "Проверка создания товара через админку.");
  await page.screenshot({ path: `${SHOTS}/admin-new-product.jpeg`, quality: 85, type: "jpeg" });
  await page.click('button:has-text("Создать товар")');
  await page.waitForURL(`${BASE}/admin/products`, { timeout: 10000 });
  await page.waitForLoadState("networkidle");
  await page.getByText("Пионы «Тест CRUD»").first().waitFor({ timeout: 10000 });
  assert(true, "новый товар появился в списке");
  await page.screenshot({ path: `${SHOTS}/admin-products.jpeg`, quality: 85, type: "jpeg" });

  // Проверяем, что товар виден и на публичном каталоге
  await page.goto(`${BASE}/catalog`, { waitUntil: "networkidle" });
  assert((await page.textContent("body")).includes("Пионы «Тест CRUD»"), "товар виден в публичном каталоге");

  // ---------- Редактирование ----------
  await page.goto(`${BASE}/admin/products`, { waitUntil: "networkidle" });
  const row = page.locator("div.rounded-2xl", { hasText: "Пионы «Тест CRUD»" }).first();
  await row.getByRole("link", { name: "Изменить" }).first().click();
  await page.waitForURL(/\/admin\/products\/\d+\/edit/, { timeout: 10000 });
  await page.fill('input[name="price"]', "9999");
  await page.click('button:has-text("Сохранить изменения")');
  await page.waitForURL(`${BASE}/admin/products`, { timeout: 10000 });
  await page.waitForLoadState("networkidle");
  const bodyNorm = (await page.textContent("body")).replace(/[  ]/g, " ");
  assert(bodyNorm.includes("9 999"), "цена товара обновилась (9 999 ₽)");

  // ---------- Удаление ----------
  const row2 = page.locator("div.rounded-2xl", { hasText: "Пионы «Тест CRUD»" }).first();
  await row2.getByRole("button", { name: "Удалить" }).first().click();
  await page.waitForTimeout(1500);
  await page.goto(`${BASE}/admin/products`, { waitUntil: "networkidle" });
  assert(!(await page.textContent("body")).includes("Пионы «Тест CRUD»"), "товар удалён из списка");

  // ---------- Заказы: смена статуса ----------
  await page.goto(`${BASE}/admin/orders`, { waitUntil: "networkidle" });
  const hasOrder = (await page.textContent("body")).includes("Заказ №");
  assert(hasOrder, "есть хотя бы один заказ");
  if (hasOrder) {
    await page.locator('button:has-text("В работе")').first().click();
    await page.waitForTimeout(1200);
    await page.goto(`${BASE}/admin/orders`, { waitUntil: "networkidle" });
    // Проверяем, что статус "В работе" отображается
    assert((await page.textContent("body")).includes("В работе"), "статус заказа изменён на «В работе»");
    await page.screenshot({ path: `${SHOTS}/admin-orders.jpeg`, quality: 85, type: "jpeg", fullPage: true });
  }

  // ---------- МОБИЛЬНЫЕ СНИМКИ (для проверки адаптива) ----------
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mp = await mobile.newPage();
  for (const [path, name] of [
    ["/", "m-home"],
    ["/catalog", "m-catalog"],
    ["/product/buket-nezhnost", "m-product"],
  ]) {
    await mp.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await mp.screenshot({ path: `${SHOTS}/${name}.jpeg`, quality: 82, type: "jpeg", fullPage: true });
  }
  // Мобильное меню
  await mp.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await mp.click('button[aria-label="Меню"]');
  await mp.waitForTimeout(400);
  await mp.screenshot({ path: `${SHOTS}/m-menu.jpeg`, quality: 82, type: "jpeg" });
  await mobile.close();

  console.log("\n=== ИТОГ:", failures === 0 ? "ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ" : `ПРОВАЛЕНО ${failures}`, "===");
} catch (e) {
  console.error("ОШИБКА СЦЕНАРИЯ:", e.message);
  failures++;
} finally {
  await browser.close();
  process.exit(failures === 0 ? 0 : 1);
}
