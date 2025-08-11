// Utility to safely handle database connections during static generation
export const isDatabaseAvailable = (): boolean => {
  const dbUri = process.env.DATABASE_URI
  
  // Skip if no database URI or if it's a localhost connection (development)
  if (!dbUri || dbUri.includes('localhost') || dbUri.includes('127.0.0.1')) {
    return false
  }

  return true
}

export const withDatabaseCheck = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  operationName = 'database operation'
): Promise<T> => {
  if (!isDatabaseAvailable()) {
    console.warn(`Skipping ${operationName} - database not available for static generation`)
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.warn(`Failed ${operationName}, falling back:`, error)
    return fallback
  }
}