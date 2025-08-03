// Re-export neverthrow types for convenience
export { Result, Ok, Err, ok, err, ResultAsync, okAsync, errAsync } from 'neverthrow'

// Export custom error types
export * from './errors/base.errors'
export * from './errors/auth.errors'
export * from './errors/validation.errors'
export * from './errors/domain.errors'
export * from './errors/infrastructure.errors'

// Export error utilities
export * from './utils/error-helpers'
export * from './utils/result-helpers'