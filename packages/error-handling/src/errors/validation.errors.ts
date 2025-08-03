import { BaseError } from './base.errors'

/**
 * Validation errors
 */

export type ValidationErrorDetail = {
  field: string
  message: string
  value?: unknown
}

export class ValidationError extends BaseError {
  public readonly errors: ValidationErrorDetail[]

  constructor(errors: ValidationErrorDetail[] | string) {
    const errorDetails = typeof errors === 'string' 
      ? [{ field: 'general', message: errors }] 
      : errors
      
    const message = errorDetails
      .map(e => `${e.field}: ${e.message}`)
      .join(', ')
      
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
    this.errors = errorDetails
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    }
  }
}

export class RequiredFieldError extends ValidationError {
  constructor(fieldName: string) {
    super([{
      field: fieldName,
      message: `${fieldName} is required`,
    }])
    this.name = 'RequiredFieldError'
  }
}

export class InvalidFormatError extends ValidationError {
  constructor(fieldName: string, expectedFormat: string, value?: unknown) {
    super([{
      field: fieldName,
      message: `Invalid format. Expected: ${expectedFormat}`,
      value,
    }])
    this.name = 'InvalidFormatError'
  }
}

export class InvalidEmailError extends ValidationError {
  constructor(email: string) {
    super([{
      field: 'email',
      message: 'Invalid email address',
      value: email,
    }])
    this.name = 'InvalidEmailError'
  }
}

export class InvalidDateError extends ValidationError {
  constructor(fieldName: string, value?: unknown) {
    super([{
      field: fieldName,
      message: 'Invalid date format',
      value,
    }])
    this.name = 'InvalidDateError'
  }
}

export class OutOfRangeError extends ValidationError {
  constructor(
    fieldName: string, 
    min?: number, 
    max?: number, 
    value?: unknown
  ) {
    const message = min !== undefined && max !== undefined
      ? `Value must be between ${min} and ${max}`
      : min !== undefined
      ? `Value must be at least ${min}`
      : `Value must be at most ${max}`
      
    super([{
      field: fieldName,
      message,
      value,
    }])
    this.name = 'OutOfRangeError'
  }
}