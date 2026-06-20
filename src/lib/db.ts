// Triggering production Vercel rebuild to apply dashboard environment variables.
import { PrismaClient } from '@prisma/client';


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use a fallback URL if DATABASE_URL is not set (e.g. during Vercel builds)
// to prevent Prisma Client from failing initialization.
let databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

// Automatically append ?pgbouncer=true if using a pooled connection (Supabase pooler on port 6543)
// and it's not already specified in the query parameters.
if (databaseUrl.includes('pooler.supabase.com') || databaseUrl.includes(':6543')) {
  if (!databaseUrl.includes('pgbouncer=')) {
    const separator = databaseUrl.includes('?') ? '&' : '?';
    databaseUrl = `${databaseUrl}${separator}pgbouncer=true`;
  }
}

export const db = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

