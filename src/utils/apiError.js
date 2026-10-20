// Pull a human-readable message out of a failed API call.
// The backend returns errors as {"error": "..."} (custom views) or
// {"detail": "..."} (DRF/JWT built-ins).
export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (data && typeof data === 'object') {
    if (typeof data.error === 'string') return data.error
    if (typeof data.detail === 'string') return data.detail
  }
  return fallback
}

// Safe summary of a failed request for console logging. Never includes the
// request body (passwords, lab values) or headers (the JWT), which a raw axios
// error object carries in error.config.
export function describeApiError(error) {
  const method = error?.config?.method ? error.config.method.toUpperCase() : undefined
  let path = error?.config?.url
  if (path) {
    try {
      path = new URL(path, 'http://localhost').pathname
    } catch {
      path = undefined
    }
  }
  return {
    status: error?.response?.status ?? (error?.request ? 'no response' : undefined),
    request: method && path ? `${method} ${path}` : undefined,
    message: error?.message,
  }
}

export function logApiError(context, error) {
  console.error(context, describeApiError(error))
}
