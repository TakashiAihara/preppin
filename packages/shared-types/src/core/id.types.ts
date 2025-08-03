/**
 * ID generation and validation utilities
 */

// ID format: prefix_randomString
// Example: usr_1234567890abcdef

export const ID_PREFIXES = {
  user: 'usr',
  organization: 'org',
  member: 'mbr',
  invitation: 'inv',
  inventoryItem: 'itm',
  consumptionLog: 'csl',
  activityLog: 'act',
  file: 'fil',
  product: 'prd',
  session: 'ses',
} as const

export type IdPrefix = (typeof ID_PREFIXES)[keyof typeof ID_PREFIXES]

export const generateId = (prefix: IdPrefix): string => {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}${randomPart}`
}

export const validateId = (id: string, expectedPrefix?: IdPrefix): boolean => {
  const pattern = expectedPrefix
    ? new RegExp(`^${expectedPrefix}_[a-z0-9]{12,}$`)
    : /^[a-z]{3}_[a-z0-9]{12,}$/
  return pattern.test(id)
}

export const extractPrefix = (id: string): IdPrefix | null => {
  const match = id.match(/^([a-z]{3})_/)
  if (!match) return null
  
  const prefix = match[1]
  const validPrefixes = Object.values(ID_PREFIXES)
  
  if (validPrefixes.includes(prefix as IdPrefix)) {
    return prefix as IdPrefix
  }
  
  return null
}