import type { BaseEntity, AuditableEntity } from '../core/base.types'
import type { 
  OrganizationId, 
  UserId, 
  MemberId, 
  InvitationId 
} from '../utils/brand.types'
import { 
  OrganizationPrivacy, 
  UserRole, 
  InvitationStatus 
} from '../enums'

/**
 * Organization domain types
 */

export type Organization = AuditableEntity & {
  id: OrganizationId
  name: string
  description?: string | null
  privacy: OrganizationPrivacy
  inviteCode?: string | null
  inviteCodeExpiresAt?: Date | null
  settings: OrganizationSettings
  memberCount: number
}

export type OrganizationSettings = {
  defaultExpiryWarningDays: number
  lowStockAlertEnabled: boolean
  expiryAlertEnabled: boolean
  timezone: string
  locale: string
}

export type OrganizationMember = BaseEntity & {
  id: MemberId
  organizationId: OrganizationId
  userId: UserId
  role: UserRole
  joinedAt: Date
  invitedBy?: UserId | null
}

export type OrganizationInvitation = BaseEntity & {
  id: InvitationId
  organizationId: OrganizationId
  email: string
  role: UserRole
  status: InvitationStatus
  invitedBy: UserId
  expiresAt: Date
  acceptedAt?: Date | null
  rejectedAt?: Date | null
}

export type CreateOrganizationInput = {
  name: string
  description?: string
  privacy: OrganizationPrivacy
  settings?: Partial<OrganizationSettings>
}

export type UpdateOrganizationInput = {
  name?: string
  description?: string | null
  privacy?: OrganizationPrivacy
  settings?: Partial<OrganizationSettings>
}

export type InviteMemberInput = {
  organizationId: OrganizationId
  email: string
  role: UserRole
}

export type JoinOrganizationInput = {
  inviteCode: string
}

export type UpdateMemberRoleInput = {
  organizationId: OrganizationId
  memberId: MemberId
  role: UserRole
}

export type OrganizationWithRole = Organization & {
  memberRole: UserRole
}

export type MemberWithUser = OrganizationMember & {
  user: {
    id: UserId
    email: string
    displayName: string
    profileImage?: string | null
  }
}