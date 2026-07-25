import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Единственный экземпляр Prisma на всё приложение.
// В dev-режиме Next.js перезагружает модули — без этого singleton
// плодились бы новые подключения к базе при каждом hot-reload.
//
// Prisma 7 работает через «драйвер-адаптеры». Используется PostgreSQL (Neon);
// строка подключения берётся из переменной окружения DATABASE_URL (см. README).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
