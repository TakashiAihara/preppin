/**
 * Base types used across the application
 */

export type Timestamp = {
  createdAt: Date
  updatedAt: Date
}

export type SoftDelete = {
  deletedAt: Date | null
}

export type AuditFields = {
  createdBy: string
  updatedBy: string
} & Timestamp

export type BaseEntity = {
  id: string
} & Timestamp

export type SoftDeletableEntity = BaseEntity & SoftDelete

export type AuditableEntity = BaseEntity & AuditFields

/**
 * Pagination types
 */
export type PageRequest = {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type PageResponse<T> = {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Common value objects
 */
export type Money = {
  amount: number
  currency: Currency
}

export type Currency = 'JPY' | 'USD' | 'EUR'

export type DateRange = {
  start: Date
  end: Date
}

export type GeoLocation = {
  latitude: number
  longitude: number
}

export type Address = {
  street: string
  city: string
  prefecture: string
  postalCode: string
  country: string
}