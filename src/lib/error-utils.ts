/**
 * Shared error handling utilities for API responses
 */

/**
 * Extract error message from API response
 * Handles the standard API error format: { statusCode: number, errors: Array<{ message: string }> }
 * Also handles other common error formats
 */
export const extractErrorMessage = (error: unknown): string => {
  // Type guard to check if error has the expected structure
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object'
  ) {
    const data = error.response.data as Record<string, unknown>

    // Check for structured error response with errors array
    if (data.errors && Array.isArray(data.errors)) {
      const firstError = data.errors[0]
      if (
        firstError &&
        typeof firstError === 'object' &&
        'message' in firstError
      ) {
        return String(firstError.message)
      }
    }

    // Check for simple message field
    if (data.message && typeof data.message === 'string') {
      return data.message
    }
  }

  // Fallback to axios error message
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  // Final fallback
  return 'An unexpected error occurred'
}

/**
 * Extract all error messages from API response
 * Returns an array of error messages when multiple errors are present
 */
export const extractAllErrorMessages = (error: unknown): string[] => {
  // Type guard to check if error has the expected structure
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object'
  ) {
    const data = error.response.data as Record<string, unknown>

    // Check for structured error response with errors array
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors
        .map((err) => {
          if (
            err &&
            typeof err === 'object' &&
            'message' in err &&
            typeof err.message === 'string'
          ) {
            return err.message
          }
          return null
        })
        .filter((msg): msg is string => msg !== null)
    }

    // Check for simple message field
    if (data.message && typeof data.message === 'string') {
      return [data.message]
    }
  }

  // Fallback to axios error message
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return [error.message]
  }

  // Final fallback
  return ['An unexpected error occurred']
}