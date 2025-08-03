import type { BaseEntity, SoftDeletableEntity } from '../core/base.types'
import type { UserId, SessionId } from '../utils/brand.types'
import { AuthProvider } from '../enums'

/**
 * User domain types
 */

export type User = BaseEntity & {
  id: UserId
  email: string
  displayName: string
  profileImage?: string | null
  isEmailVerified: boolean
  isActive: boolean
  lastLoginAt?: Date | null
  providers: AuthProvider[]
}

export type UserProfile = Pick<
  User,
  'id' | 'email' | 'displayName' | 'profileImage' | 'isEmailVerified'
>

export type UserWithPassword = User & {
  passwordHash: string
}

export type Session = BaseEntity & {
  id: SessionId
  userId: UserId
  token: string
  refreshToken: string
  expiresAt: Date
  refreshExpiresAt: Date
  ipAddress?: string
  userAgent?: string
}

export type CreateUserInput = {
  email: string
  displayName: string
  password?: string
  provider: AuthProvider
  profileImage?: string
}

export type UpdateUserInput = {
  displayName?: string
  profileImage?: string | null
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
  displayName: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type AuthResponse = {
  user: UserProfile
  tokens: AuthTokens
}

export type PasswordResetToken = SoftDeletableEntity & {
  id: string
  userId: UserId
  token: string
  expiresAt: Date
  usedAt?: Date | null
}

export type EmailVerificationToken = {
  id: string
  userId: UserId
  token: string
  expiresAt: Date
  verifiedAt?: Date | null
}