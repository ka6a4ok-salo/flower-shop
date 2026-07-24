import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Единственный экземпляр Prisma на всё приложение.
// В dev-режиме Next.js перезагружает модули — без этого singleton
// плодились бы новые подключения к базе при каждом hot-reload.
//
// Prisma 7 работает через «драйвер-адаптеры». Локально используется libSQL
// поверх файла SQLite (dev.db). Для продакшена достаточно сменить DATABASE_URL
// на строку подключения к облачной базе (Turso / Postgres — см. README).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma() {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
