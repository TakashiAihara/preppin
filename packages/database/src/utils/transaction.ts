import { Prisma, PrismaClient } from '@prisma/client'
import { Result, ok, err } from 'neverthrow'

/**
 * Transaction utilities for Prisma
 */

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

/**
 * Execute a transaction with Result type
 */
export const executeTransaction = async <T>(
  prisma: PrismaClient,
  fn: (tx: TransactionClient) => Promise<T>,
  options?: {
    maxWait?: number
    timeout?: number
    isolationLevel?: Prisma.TransactionIsolationLevel
  },
): Promise<Result<T, Error>> => {
  try {
    const result = await prisma.$transaction(fn, options)
    return ok(result)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}

/**
 * Retry transaction on conflict
 */
export const retryTransaction = async <T>(
  prisma: PrismaClient,
  fn: (tx: TransactionClient) => Promise<T>,
  maxRetries = 3,
  options?: {
    maxWait?: number
    timeout?: number
    isolationLevel?: Prisma.TransactionIsolationLevel
  },
): Promise<Result<T, Error>> => {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    const result = await executeTransaction(prisma, fn, options)
    
    if (result.isOk()) {
      return result
    }

    lastError = result.error

    // Check if error is retryable
    if (isRetryableError(result.error)) {
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, i), 5000)
      await new Promise(resolve => setTimeout(resolve, delay))
      continue
    }

    // Non-retryable error, return immediately
    return result
  }

  return err(lastError || new Error('Transaction failed after max retries'))
}

/**
 * Check if an error is retryable
 */
const isRetryableError = (error: Error): boolean => {
  const message = error.message.toLowerCase()
  
  // Prisma specific error codes
  if ('code' in error) {
    const code = (error as any).code
    return [
      'P2034', // Transaction conflict
      'P2024', // Timed out
      'P2030', // Cannot find relation
    ].includes(code)
  }

  // Generic database errors
  return (
    message.includes('deadlock') ||
    message.includes('timeout') ||
    message.includes('conflict') ||
    message.includes('could not serialize')
  )
}