import type { PageRequest, PageResponse } from '@repo/shared-types'

/**
 * Pagination utilities for Prisma queries
 */

export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedQuery<T> {
  skip: number
  take: number
  orderBy?: Record<string, 'asc' | 'desc'>
}

/**
 * Convert pagination options to Prisma query parameters
 */
export const getPaginationParams = <T>(
  options: PaginationOptions,
): PaginatedQuery<T> => {
  const { page, limit, sortBy, sortOrder = 'asc' } = options
  
  const skip = (page - 1) * limit
  const take = limit
  
  const orderBy = sortBy
    ? { [sortBy]: sortOrder }
    : undefined
  
  return {
    skip,
    take,
    orderBy,
  }
}

/**
 * Create a paginated response
 */
export const createPageResponse = <T>(
  items: T[],
  total: number,
  options: PaginationOptions,
): PageResponse<T> => {
  const { page, limit } = options
  const totalPages = Math.ceil(total / limit)
  
  return {
    items,
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

/**
 * Helper to execute a paginated query
 */
export interface PaginatedQueryOptions<T> {
  where?: Record<string, unknown>
  include?: Record<string, unknown>
  select?: Record<string, unknown>
}

export const executePaginatedQuery = async <T>(
  model: {
    count: (args?: any) => Promise<number>
    findMany: (args?: any) => Promise<T[]>
  },
  pageRequest: PageRequest,
  queryOptions?: PaginatedQueryOptions<T>,
): Promise<PageResponse<T>> => {
  const paginationParams = getPaginationParams<T>({
    page: pageRequest.page,
    limit: pageRequest.limit,
    sortBy: pageRequest.sortBy,
    sortOrder: pageRequest.sortOrder,
  })
  
  const [items, total] = await Promise.all([
    model.findMany({
      ...paginationParams,
      ...queryOptions,
    }),
    model.count({
      where: queryOptions?.where,
    }),
  ])
  
  return createPageResponse(items, total, {
    page: pageRequest.page,
    limit: pageRequest.limit,
  })
}