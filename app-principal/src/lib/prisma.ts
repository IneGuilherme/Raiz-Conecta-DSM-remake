import { PrismaClient } from '@prisma/client';

// Essa verificação impede que o Next.js abra milhares de conexões 
// com o banco de dados toda vez que você salva um arquivo
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Mostra as ações no terminal para a gente debugar
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;