import { PrismaClient } from "@prisma/client";

// جلوگیری از باز شدن چند connection در dev با hot-reload Next.js
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
