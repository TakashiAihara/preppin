import { BaseError } from './base.errors'

/**
 * Domain-specific business logic errors
 */

// Inventory errors
export class InsufficientStockError extends BaseError {
  constructor(itemName: string, available: number, requested: number) {
    super(
      `Insufficient stock for ${itemName}. Available: ${available}, Requested: ${requested}`,
      'INSUFFICIENT_STOCK',
      400,
    )
    this.name = 'InsufficientStockError'
  }
}

export class ItemExpiredError extends BaseError {
  constructor(itemName: string, expiredDate: Date) {
    super(
      `Item ${itemName} has expired on ${expiredDate.toISOString()}`,
      'ITEM_EXPIRED',
      400,
    )
    this.name = 'ItemExpiredError'
  }
}

export class DuplicateBarcodeError extends BaseError {
  constructor(barcode: string) {
    super(
      `An item with barcode ${barcode} already exists`,
      'DUPLICATE_BARCODE',
      409,
    )
    this.name = 'DuplicateBarcodeError'
  }
}

// Organization errors
export class OrganizationLimitExceededError extends BaseError {
  constructor(limit: number) {
    super(
      `Organization member limit of ${limit} has been exceeded`,
      'ORGANIZATION_LIMIT_EXCEEDED',
      403,
    )
    this.name = 'OrganizationLimitExceededError'
  }
}

export class InvalidInviteCodeError extends BaseError {
  constructor() {
    super(
      'Invalid or expired invitation code',
      'INVALID_INVITE_CODE',
      400,
    )
    this.name = 'InvalidInviteCodeError'
  }
}

export class MemberAlreadyExistsError extends BaseError {
  constructor(email: string, organizationName: string) {
    super(
      `User with email ${email} is already a member of ${organizationName}`,
      'MEMBER_ALREADY_EXISTS',
      409,
    )
    this.name = 'MemberAlreadyExistsError'
  }
}

export class CannotRemoveLastAdminError extends BaseError {
  constructor() {
    super(
      'Cannot remove the last admin from the organization',
      'CANNOT_REMOVE_LAST_ADMIN',
      400,
    )
    this.name = 'CannotRemoveLastAdminError'
  }
}

// User errors
export class EmailAlreadyExistsError extends BaseError {
  constructor(email: string) {
    super(
      `User with email ${email} already exists`,
      'EMAIL_ALREADY_EXISTS',
      409,
    )
    this.name = 'EmailAlreadyExistsError'
  }
}

export class InvalidPasswordError extends BaseError {
  constructor(reason?: string) {
    const message = reason
      ? `Invalid password: ${reason}`
      : 'Password does not meet requirements'
    super(message, 'INVALID_PASSWORD', 400)
    this.name = 'InvalidPasswordError'
  }
}

// Business rule errors
export class BusinessRuleViolationError extends BaseError {
  constructor(rule: string, details?: string) {
    const message = details
      ? `Business rule violation: ${rule}. ${details}`
      : `Business rule violation: ${rule}`
    super(message, 'BUSINESS_RULE_VIOLATION', 400)
    this.name = 'BusinessRuleViolationError'
  }
}