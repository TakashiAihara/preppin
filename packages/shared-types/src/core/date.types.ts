/**
 * Date-related utility types and functions
 */

export type ExpiryType = 'EXPIRY' | 'BEST_BEFORE' | 'BOTH'

export type ExpiryDates = {
  expiryDate?: Date | null
  bestBeforeDate?: Date | null
  expiryType: ExpiryType
}

export type ExpiryStatus = 'EXPIRED' | 'EXPIRING_SOON' | 'FRESH' | 'NO_EXPIRY'

export type ExpiryWarning = {
  daysUntilExpiry: number
  status: ExpiryStatus
  warningLevel: 'danger' | 'warning' | 'info' | 'none'
}

/**
 * Calculate days between two dates
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.floor((date2.getTime() - date1.getTime()) / oneDay)
}

/**
 * Check if a date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  return date < new Date()
}

/**
 * Get expiry status based on dates
 */
export const getExpiryStatus = (
  expiryDate?: Date | null,
  bestBeforeDate?: Date | null,
  warningDays = 7,
): ExpiryStatus => {
  const now = new Date()
  const relevantDate = expiryDate || bestBeforeDate
  
  if (!relevantDate) return 'NO_EXPIRY'
  
  if (isPastDate(relevantDate)) return 'EXPIRED'
  
  const daysUntil = daysBetween(now, relevantDate)
  if (daysUntil <= warningDays) return 'EXPIRING_SOON'
  
  return 'FRESH'
}

/**
 * Get expiry warning details
 */
export const getExpiryWarning = (
  expiryDate?: Date | null,
  bestBeforeDate?: Date | null,
): ExpiryWarning => {
  const now = new Date()
  const relevantDate = expiryDate || bestBeforeDate
  
  if (!relevantDate) {
    return {
      daysUntilExpiry: Infinity,
      status: 'NO_EXPIRY',
      warningLevel: 'none',
    }
  }
  
  const daysUntil = daysBetween(now, relevantDate)
  const status = getExpiryStatus(expiryDate, bestBeforeDate)
  
  let warningLevel: ExpiryWarning['warningLevel'] = 'none'
  if (daysUntil < 0) warningLevel = 'danger'
  else if (daysUntil <= 3) warningLevel = 'danger'
  else if (daysUntil <= 7) warningLevel = 'warning'
  else if (daysUntil <= 30) warningLevel = 'info'
  
  return {
    daysUntilExpiry: daysUntil,
    status,
    warningLevel,
  }
}