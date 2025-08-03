import { BaseError } from './base.errors'

/**
 * Authentication and authorization errors
 */

export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Access forbidden') {
    super(message, 'FORBIDDEN', 403)
    this.name = 'ForbiddenError'
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

export class TokenExpiredError extends AuthenticationError {
  constructor(tokenType = 'Token') {
    super(`${tokenType} has expired`)
    this.name = 'TokenExpiredError'
  }
}

export class InvalidTokenError extends AuthenticationError {
  constructor(tokenType = 'Token') {
    super(`Invalid ${tokenType.toLowerCase()}`)
    this.name = 'InvalidTokenError'
  }
}

export class InsufficientPermissionsError extends ForbiddenError {
  constructor(resource?: string, action?: string) {
    const message = resource && action
      ? `Insufficient permissions to ${action} ${resource}`
      : 'Insufficient permissions to perform this action'
    super(message)
    this.name = 'InsufficientPermissionsError'
  }
}

export class AccountNotActiveError extends AuthenticationError {
  constructor() {
    super('Account is not active')
    this.name = 'AccountNotActiveError'
  }
}

export class EmailNotVerifiedError extends AuthenticationError {
  constructor() {
    super('Email address is not verified')
    this.name = 'EmailNotVerifiedError'
  }
}