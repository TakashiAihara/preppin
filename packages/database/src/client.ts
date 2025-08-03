import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

/**
 * Singleton Prisma client instance
 * Prevents multiple instances in development with hot reload
 */
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

/**
 * Gracefully disconnect Prisma on application shutdown
 */
export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect()
}

// Handle shutdown gracefully
process.on('beforeExit', async () => {
  await disconnectPrisma()
})