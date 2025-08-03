/**
 * Centralized enum definitions used across the application
 */

// User and Authentication
export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

// Organization
export enum OrganizationPrivacy {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

// Inventory
export enum InventoryCategory {
  FOOD = 'FOOD',
  DAILY_GOODS = 'DAILY_GOODS',
  MEDICINE = 'MEDICINE',
  OTHER = 'OTHER',
}

export enum ExpiryTypeEnum {
  EXPIRY = 'EXPIRY',
  BEST_BEFORE = 'BEST_BEFORE',
  BOTH = 'BOTH',
}

export enum ConsumptionReason {
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  DAMAGED = 'DAMAGED',
  DONATED = 'DONATED',
  OTHER = 'OTHER',
}

// Activity
export enum ActivityAction {
  // User actions
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT',
  USER_UPDATED_PROFILE = 'USER_UPDATED_PROFILE',
  
  // Organization actions
  ORG_CREATED = 'ORG_CREATED',
  ORG_UPDATED = 'ORG_UPDATED',
  ORG_DELETED = 'ORG_DELETED',
  
  // Member actions
  MEMBER_INVITED = 'MEMBER_INVITED',
  MEMBER_JOINED = 'MEMBER_JOINED',
  MEMBER_ROLE_CHANGED = 'MEMBER_ROLE_CHANGED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
  
  // Inventory actions
  ITEM_CREATED = 'ITEM_CREATED',
  ITEM_UPDATED = 'ITEM_UPDATED',
  ITEM_DELETED = 'ITEM_DELETED',
  ITEM_CONSUMED = 'ITEM_CONSUMED',
  ITEM_RESTOCKED = 'ITEM_RESTOCKED',
  
  // Alert actions
  EXPIRY_ALERT_SENT = 'EXPIRY_ALERT_SENT',
  LOW_STOCK_ALERT_SENT = 'LOW_STOCK_ALERT_SENT',
}

// File and Image
export enum FileType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  CSV = 'CSV',
}

export enum ImageSize {
  THUMBNAIL = 'THUMBNAIL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ORIGINAL = 'ORIGINAL',
}

// Notification
export enum NotificationType {
  EXPIRY_WARNING = 'EXPIRY_WARNING',
  LOW_STOCK = 'LOW_STOCK',
  INVITATION = 'INVITATION',
  SYSTEM = 'SYSTEM',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Sort and Filter
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum FilterOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUALS = 'GREATER_THAN_OR_EQUALS',
  LESS_THAN_OR_EQUALS = 'LESS_THAN_OR_EQUALS',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  BETWEEN = 'BETWEEN',
}