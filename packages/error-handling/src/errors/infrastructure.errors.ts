import { BaseError } from './base.errors'

/**
 * Infrastructure and external service errors
 */

export class DatabaseError extends BaseError {
  constructor(message: string, originalError?: unknown) {
    super(
      `Database error: ${message}`,
      'DATABASE_ERROR',
      500,
      false, // Not operational - indicates system issue
    )
    this.name = 'DatabaseError'
    if (originalError instanceof Error) {
      this.stack = originalError.stack
    }
  }
}

export class ConnectionError extends BaseError {
  constructor(service: string, originalError?: unknown) {
    super(
      `Failed to connect to ${service}`,
      'CONNECTION_ERROR',
      503,
      false,
    )
    this.name = 'ConnectionError'
    if (originalError instanceof Error) {
      this.stack = originalError.stack
    }
  }
}

export class ExternalServiceError extends BaseError {
  constructor(service: string, message: string, statusCode = 502) {
    super(
      `External service error (${service}): ${message}`,
      'EXTERNAL_SERVICE_ERROR',
      statusCode,
      false,
    )
    this.name = 'ExternalServiceError'
  }
}

export class FileUploadError extends BaseError {
  constructor(reason: string) {
    super(
      `File upload failed: ${reason}`,
      'FILE_UPLOAD_ERROR',
      400,
    )
    this.name = 'FileUploadError'
  }
}

export class FileSizeExceededError extends FileUploadError {
  constructor(maxSize: number, actualSize: number) {
    super(`File size ${actualSize} bytes exceeds maximum of ${maxSize} bytes`)
    this.name = 'FileSizeExceededError'
  }
}

export class InvalidFileTypeError extends FileUploadError {
  constructor(allowedTypes: string[], actualType: string) {
    super(`File type ${actualType} not allowed. Allowed types: ${allowedTypes.join(', ')}`)
    this.name = 'InvalidFileTypeError'
  }
}

export class RateLimitExceededError extends BaseError {
  constructor(retryAfter?: number) {
    const message = retryAfter
      ? `Rate limit exceeded. Try again after ${retryAfter} seconds`
      : 'Rate limit exceeded'
    super(message, 'RATE_LIMIT_EXCEEDED', 429)
    this.name = 'RateLimitExceededError'
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(service?: string) {
    const message = service
      ? `${service} is currently unavailable`
      : 'Service is currently unavailable'
    super(message, 'SERVICE_UNAVAILABLE', 503, false)
    this.name = 'ServiceUnavailableError'
  }
}

export class TimeoutError extends BaseError {
  constructor(operation: string, timeoutMs: number) {
    super(
      `Operation ${operation} timed out after ${timeoutMs}ms`,
      'TIMEOUT_ERROR',
      504,
      false,
    )
    this.name = 'TimeoutError'
  }
}