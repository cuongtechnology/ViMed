import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

const fallbackPrisma = new Proxy(
  {},
  {
    get() {
      throw new Error('Prisma client is unavailable. Run `pnpm db:generate` after fixing schema issues.');
    },
  },
) as PrismaClient;

let prismaInstance: PrismaClient;

try {
  prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
} catch {
  prismaInstance = fallbackPrisma;
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { PrismaClient };
