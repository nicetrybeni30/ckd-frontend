// Small helper for the logged-in session stored in localStorage.
// The role here is for UI routing only; the backend still checks
// permissions on every request.
const TOKEN_KEY = 'token'
const ROLE_KEY = 'role'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY)
}

export function setSession(token, role) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ROLE_KEY, role)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export function loginPathFor(role) {
  return role === 'admin' ? '/admin/login' : '/patient/login'
}

export function homePathFor(role) {
  return role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'
}

const KNOWN_ROLES = ['admin', 'patient']

// Route-guard decision, kept free of Vue so it can be unit-tested.
// Returns true to allow navigation, or a path to redirect to.
export function guardRedirect(requiredRole, token, role) {
  if (!requiredRole) return true
  // Unknown/tampered roles would otherwise bounce between dashboards forever.
  if (!token || !KNOWN_ROLES.includes(role)) return loginPathFor(requiredRole)
  if (role !== requiredRole) return homePathFor(role)
  return true
}

// True when an API error means the stored session is no longer valid.
// Failed login attempts (wrong password) are not treated as expiry.
export function isExpiredSessionError(error, hasToken) {
  const isLoginRequest = Boolean(error?.config?.url?.includes('/api/token/'))
  return error?.response?.status === 401 && !isLoginRequest && Boolean(hasToken)
}
