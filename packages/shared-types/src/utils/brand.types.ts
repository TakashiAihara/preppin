import type { Opaque } from 'type-fest'

/**
 * Brand types for type-safe identifiers
 * Using Opaque types to create distinct types for each entity ID
 */

// User-related IDs
export type UserId = Opaque<string, 'UserId'>
export type SessionId = Opaque<string, 'SessionId'>

// Organization-related IDs
export type OrganizationId = Opaque<string, 'OrganizationId'>
export type InvitationId = Opaque<string, 'InvitationId'>
export type MemberId = Opaque<string, 'MemberId'>

// Inventory-related IDs
export type InventoryItemId = Opaque<string, 'InventoryItemId'>
export type ConsumptionLogId = Opaque<string, 'ConsumptionLogId'>
export type CategoryId = Opaque<string, 'CategoryId'>

// Activity-related IDs
export type ActivityLogId = Opaque<string, 'ActivityLogId'>

// File-related IDs
export type FileId = Opaque<string, 'FileId'>
export type ImageId = Opaque<string, 'ImageId'>

// Product-related IDs
export type ProductId = Opaque<string, 'ProductId'>
export type BarcodeId = Opaque<string, 'BarcodeId'>
export type AsinId = Opaque<string, 'AsinId'>

/**
 * Helper functions to create branded types
 */
export const createUserId = (id: string): UserId => id as UserId
export const createOrganizationId = (id: string): OrganizationId => id as OrganizationId
export const createInventoryItemId = (id: string): InventoryItemId => id as InventoryItemId
export const createConsumptionLogId = (id: string): ConsumptionLogId => id as ConsumptionLogId
export const createActivityLogId = (id: string): ActivityLogId => id as ActivityLogId
export const createFileId = (id: string): FileId => id as FileId
export const createProductId = (id: string): ProductId => id as ProductId