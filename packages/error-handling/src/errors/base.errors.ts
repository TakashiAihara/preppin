/**
 * Base error classes and types
 */

export abstract class BaseError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    code: string,
    statusCode = 500,
    isOperational = true,
  ) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)

    // Set the prototype explicitly
    Object.setPrototypeOf(this, new.target.prototype)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    }
  }
}

export class ApplicationError extends BaseError {
  constructor(message: string, code = 'APPLICATION_ERROR', statusCode = 500) {
    super(message, code, statusCode)
    this.name = 'ApplicationError'
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
    this.name = 'ConflictError'
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, 'BAD_REQUEST', 400)
    this.name = 'BadRequestError'
  }
}

export class InternalServerError extends BaseError {
  constructor(message = 'Internal server error occurred') {
    super(message, 'INTERNAL_SERVER_ERROR', 500)
    this.name = 'InternalServerError'
  }
}