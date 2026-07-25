import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Букеты", slug: "bukety", order: 1 },
  { name: "Композиции", slug: "kompozicii", order: 2 },
  { name: "Горшечные растения", slug: "gorshechnye", order: 3 },
  { name: "Подарки", slug: "podarki", order: 4 },
];

const products = [
  {
    name: "Букет «Нежность»",
    slug: "buket-nezhnost",
    category: "bukety",
    price: 3900,
    image: "/products/buket-nezhnost.jpg",
    featured: true,
    description:
      "Воздушный букет из пионовидных роз и садовых цветов в пастельно-розовой гамме. Символ тепла и заботы — идеален для мамы, любимой или просто без повода.",
  },
  {
    name: "Букет «Алое сердце»",
    slug: "buket-aloe-serdce",
    category: "bukety",
    price: 5400,
    image: "/products/buket-aloe-serdce.jpg",
    featured: true,
    description:
      "Классические красные розы — самый понятный способ сказать о своих чувствах. Плотный, насыщенный букет для по-настоящему важных моментов.",
  },
  {
    name: "Букет «Весенний»",
    slug: "buket-vesenniy",
    category: "bukety",
    price: 2900,
    image: "/products/buket-vesenniy.jpg",
    description:
      "Тюльпаны, ранункулюсы и герберы — солнечное настроение в одном букете. Свежесть весны в любое время года.",
  },
  {
    name: "Букет «Лавандовое поле»",
    slug: "buket-lavanda",
    category: "bukety",
    price: 3400,
    image: "/products/buket-lavanda.jpg",
    description:
      "Сиренево-фиолетовая гамма с лёгким ароматом лаванды. Утончённый выбор для тех, кто ценит спокойные оттенки.",
  },
  {
    name: "Композиция «Прованс»",
    slug: "kompoziciya-provans",
    category: "kompozicii",
    price: 4600,
    image: "/products/kompoziciya-provans.jpg",
    featured: true,
    description:
      "Цветы в стильной шляпной коробке — не нужно искать вазу. Композиция долго стоит и станет украшением интерьера.",
  },
  {
    name: "Композиция «Рассвет»",
    slug: "kompoziciya-rassvet",
    category: "kompozicii",
    price: 4200,
    image: "/products/kompoziciya-rassvet.jpg",
    description:
      "Тёплые персиковые и оранжевые тона в коробке — как первые лучи солнца. Дарит уют и хорошее настроение.",
  },
  {
    name: "Орхидея фаленопсис",
    slug: "orhideya",
    category: "gorshechnye",
    price: 3200,
    image: "/products/orhideya.jpg",
    description:
      "Живое растение в горшке, которое будет радовать месяцами. Неприхотлива в уходе, цветёт несколько раз в год.",
  },
  {
    name: "Суккулент в кашпо",
    slug: "sukkulent",
    category: "gorshechnye",
    price: 1500,
    image: "/products/sukkulent.jpg",
    description:
      "Маленький зелёный характер для рабочего стола или подоконника. Почти не требует полива — идеальный подарок занятым людям.",
  },
  {
    name: "Роза кустовая в горшке",
    slug: "roza-kustovaya",
    category: "gorshechnye",
    price: 2600,
    image: "/products/roza-kustovaya.jpg",
    description:
      "Цветущая роза в горшке — букет, который не завянет через неделю. При правильном уходе будет цвести всё лето.",
  },
  {
    name: "Букет с макарунами",
    slug: "buket-makaruny",
    category: "podarki",
    price: 4800,
    image: "/products/buket-makaruny.jpg",
    featured: true,
    description:
      "Нежные цветы и коробочка французских макарун — двойное удовольствие в одном подарке. Красиво и вкусно.",
  },
  {
    name: "Гортензия «Облако»",
    slug: "gortenziya-oblako",
    category: "podarki",
    price: 3700,
    image: "/products/gortenziya-oblako.jpg",
    description:
      "Пышные голубые соцветия гортензии, похожие на облако. Крупный, эффектный букет, который невозможно не заметить.",
  },
  {
    name: "Подсолнухи «Солнечный день»",
    slug: "podsolnuhi",
    category: "podarki",
    price: 2400,
    image: "/products/podsolnuhi.jpg",
    description:
      "Яркие подсолнухи заряжают энергией и улыбкой. Отличный выбор, чтобы поднять настроение близкому человеку.",
  },
];

async function main() {
  console.log("Очищаю старые данные...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("Создаю категории...");
  const catMap: Record<string, number> = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    catMap[c.slug] = created.id;
  }

  console.log("Создаю товары...");
  for (const p of products) {
    const { category, ...rest } = p;
    await prisma.product.create({
      data: { ...rest, categoryId: catMap[category] },
    });
  }

  console.log(
    `Готово: ${categories.length} категорий, ${products.length} товаров.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
