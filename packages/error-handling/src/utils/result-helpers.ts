import { Result, ok, err, ResultAsync } from 'neverthrow'
import { BaseError } from '../errors/base.errors'
import { toBaseError } from './error-helpers'

/**
 * Result type utilities and helpers
 */

/**
 * Convert a Promise to ResultAsync
 */
export const fromPromise = <T, E extends BaseError = BaseError>(
  promise: Promise<T>,
  errorTransform?: (error: unknown) => E,
): ResultAsync<T, E> => {
  return ResultAsync.fromPromise(
    promise,
    (error) => (errorTransform ? errorTransform(error) : toBaseError(error) as E),
  )
}

/**
 * Execute a function that might throw and return a Result
 */
export const tryCatch = <T, E extends BaseError = BaseError>(
  fn: () => T,
  errorTransform?: (error: unknown) => E,
): Result<T, E> => {
  try {
    return ok(fn())
  } catch (error) {
    return err(errorTransform ? errorTransform(error) : toBaseError(error) as E)
  }
}

/**
 * Execute an async function that might throw and return a ResultAsync
 */
export const tryCatchAsync = <T, E extends BaseError = BaseError>(
  fn: () => Promise<T>,
  errorTransform?: (error: unknown) => E,
): ResultAsync<T, E> => {
  return fromPromise(fn(), errorTransform)
}

/**
 * Combine multiple Results into a single Result
 */
export const combine = <T, E>(
  results: Result<T, E>[],
): Result<T[], E> => {
  const values: T[] = []
  
  for (const result of results) {
    if (result.isErr()) {
      return err(result.error)
    }
    values.push(result.value)
  }
  
  return ok(values)
}

/**
 * Combine multiple ResultAsync into a single ResultAsync
 */
export const combineAsync = <T, E>(
  results: ResultAsync<T, E>[],
): ResultAsync<T[], E> => {
  return ResultAsync.combine(results)
}

/**
 * Map over an array with a function that returns a Result
 */
export const traverse = <T, U, E>(
  items: T[],
  fn: (item: T) => Result<U, E>,
): Result<U[], E> => {
  const results = items.map(fn)
  return combine(results)
}

/**
 * Map over an array with a function that returns a ResultAsync
 */
export const traverseAsync = <T, U, E>(
  items: T[],
  fn: (item: T) => ResultAsync<U, E>,
): ResultAsync<U[], E> => {
  const results = items.map(fn)
  return combineAsync(results)
}

/**
 * Sequence Results - useful for validation chains
 */
export const sequence = <T, E>(
  ...operations: Array<() => Result<T, E>>
): Result<T[], E> => {
  const results: T[] = []
  
  for (const operation of operations) {
    const result = operation()
    if (result.isErr()) {
      return err(result.error)
    }
    results.push(result.value)
  }
  
  return ok(results)
}

/**
 * Type guard for Result
 */
export const isResult = <T, E>(
  value: unknown,
): value is Result<T, E> => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'isOk' in value &&
    'isErr' in value &&
    typeof (value as any).isOk === 'function' &&
    typeof (value as any).isErr === 'function'
  )
}