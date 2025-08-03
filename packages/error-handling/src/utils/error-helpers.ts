import { BaseError } from '../errors/base.errors'

/**
 * Error utility functions
 */

/**
 * Check if an error is an operational error (expected error)
 */
export const isOperationalError = (error: unknown): boolean => {
  if (error instanceof BaseError) {
    return error.isOperational
  }
  return false
}

/**
 * Convert unknown error to BaseError
 */
export const toBaseError = (error: unknown): BaseError => {
  if (error instanceof BaseError) {
    return error
  }

  if (error instanceof Error) {
    return new BaseError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      false,
    )
  }

  return new BaseError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    500,
    false,
  )
}

/**
 * Extract error message from unknown error
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return 'An unknown error occurred'
}

/**
 * Create a standardized error response
 */
export type ErrorResponse = {
  error: {
    code: string
    message: string
    statusCode: number
    details?: unknown
  }
}

export const createErrorResponse = (
  error: BaseError,
  includeDetails = false,
): ErrorResponse => {
  const response: ErrorResponse = {
    error: {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    },
  }

  if (includeDetails && 'errors' in error) {
    response.error.details = (error as any).errors
  }

  return response
}

/**
 * Log error with appropriate level
 */
export const logError = (error: unknown, context?: Record<string, unknown>): void => {
  const baseError = toBaseError(error)
  const logLevel = baseError.isOperational ? 'warn' : 'error'
  
  console[logLevel]({
    message: baseError.message,
    code: baseError.code,
    statusCode: baseError.statusCode,
    isOperational: baseError.isOperational,
    stack: baseError.stack,
    context,
  })
}

/**
 * Retry operation with exponential backoff
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
): Promise<T> => {
  let lastError: unknown
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}