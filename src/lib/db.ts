import { PrismaClient } from '@prisma/client';

// Singleton Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Dummy helpers for backward compatibility (if any static checks/bundlers look for them)
export const canWriteToMockDb = (): boolean => false;
export const USE_LOCAL_MOCK = false;
export const mockPrismaProxy = {};
