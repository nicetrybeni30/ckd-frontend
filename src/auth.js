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
