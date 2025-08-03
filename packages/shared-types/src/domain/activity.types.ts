import type { BaseEntity } from '../core/base.types'
import type { 
  ActivityLogId,
  OrganizationId,
  UserId 
} from '../utils/brand.types'
import { ActivityAction } from '../enums'

/**
 * Activity and audit log types
 */

export type ActivityLog = BaseEntity & {
  id: ActivityLogId
  organizationId: OrganizationId
  userId: UserId
  action: ActivityAction
  entityType: string
  entityId: string
  metadata?: Record<string, unknown>
  ipAddress?: string | null
  userAgent?: string | null
}

export type ActivityFeed = {
  activities: ActivityLogWithUser[]
  hasMore: boolean
  lastId?: ActivityLogId
}

export type ActivityLogWithUser = ActivityLog & {
  user: {
    id: UserId
    displayName: string
    profileImage?: string | null
  }
}

export type CreateActivityLogInput = {
  organizationId: OrganizationId
  userId: UserId
  action: ActivityAction
  entityType: string
  entityId: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export type ActivitySearchParams = {
  organizationId: OrganizationId
  userId?: UserId
  action?: ActivityAction | ActivityAction[]
  entityType?: string
  entityId?: string
  fromDate?: Date
  toDate?: Date
  limit?: number
  lastId?: ActivityLogId
}

export type ActivitySummary = {
  totalActivities: number
  activitiesByAction: Record<ActivityAction, number>
  activitiesByUser: Array<{
    userId: UserId
    displayName: string
    count: number
  }>
  recentActivities: ActivityLogWithUser[]
}