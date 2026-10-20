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
