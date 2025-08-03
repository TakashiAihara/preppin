import type { AuditableEntity, Money } from '../core/base.types'
import type { ExpiryDates, ExpiryStatus } from '../core/date.types'
import type { 
  InventoryItemId, 
  OrganizationId, 
  UserId,
  ConsumptionLogId,
  ProductId 
} from '../utils/brand.types'
import { 
  InventoryCategory, 
  ConsumptionReason 
} from '../enums'

/**
 * Inventory domain types
 */

export type InventoryItem = AuditableEntity & ExpiryDates & {
  id: InventoryItemId
  organizationId: OrganizationId
  name: string
  brand?: string | null
  category: InventoryCategory
  quantity: number
  unit: string
  minQuantity?: number | null
  storageLocation?: string | null
  price?: Money | null
  barcode?: string | null
  asin?: string | null
  productId?: ProductId | null
  tags: string[]
  images: string[]
  notes?: string | null
  isLowStock: boolean
  expiryStatus: ExpiryStatus
}

export type ConsumptionLog = AuditableEntity & {
  id: ConsumptionLogId
  inventoryItemId: InventoryItemId
  organizationId: OrganizationId
  quantity: number
  reason: ConsumptionReason
  notes?: string | null
  consumedAt: Date
  consumedBy: UserId
}

export type CreateInventoryItemInput = {
  organizationId: OrganizationId
  name: string
  brand?: string
  category: InventoryCategory
  quantity: number
  unit: string
  minQuantity?: number
  expiryDate?: Date
  bestBeforeDate?: Date
  expiryType: ExpiryDates['expiryType']
  storageLocation?: string
  price?: Money
  barcode?: string
  asin?: string
  tags?: string[]
  notes?: string
}

export type UpdateInventoryItemInput = Partial<
  Omit<CreateInventoryItemInput, 'organizationId'>
> & {
  id: InventoryItemId
}

export type ConsumeInventoryItemInput = {
  itemId: InventoryItemId
  quantity: number
  reason: ConsumptionReason
  notes?: string
}

export type InventorySearchParams = {
  organizationId: OrganizationId
  query?: string
  category?: InventoryCategory
  storageLocation?: string
  tags?: string[]
  expiryDateFrom?: Date
  expiryDateTo?: Date
  isLowStock?: boolean
  expiryStatus?: ExpiryStatus
}

export type InventoryStats = {
  totalItems: number
  totalValue: Money
  lowStockItems: number
  expiringItems: number
  expiredItems: number
  categoryCounts: Record<InventoryCategory, number>
}

export type ConsumptionStats = {
  totalConsumed: number
  consumptionByReason: Record<ConsumptionReason, number>
  consumptionByCategory: Record<InventoryCategory, number>
  consumptionTrend: Array<{
    date: Date
    count: number
    quantity: number
  }>
}