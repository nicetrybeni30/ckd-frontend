import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

// Minimal in-memory localStorage for Node.
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
}
const auth = await import('../src/auth.js')

beforeEach(() => store.clear())

test('setSession / getToken / getRole / clearSession round-trip', () => {
  auth.setSession('tok', 'patient')
  assert.equal(auth.getToken(), 'tok')
  assert.equal(auth.getRole(), 'patient')
  auth.clearSession()
  assert.equal(auth.getToken(), null)
  assert.equal(auth.getRole(), null)
})

test('login and home paths per role', () => {
  assert.equal(auth.loginPathFor('admin'), '/admin/login')
  assert.equal(auth.loginPathFor('patient'), '/patient/login')
  assert.equal(auth.loginPathFor(null), '/patient/login')
  assert.equal(auth.homePathFor('admin'), '/admin/dashboard')
  assert.equal(auth.homePathFor('patient'), '/patient/dashboard')
})

test('guard: public routes are always allowed', () => {
  assert.equal(auth.guardRedirect(undefined, null, null), true)
})

test('guard: signed-out users go to the login page for the route role', () => {
  assert.equal(auth.guardRedirect('admin', null, null), '/admin/login')
  assert.equal(auth.guardRedirect('patient', null, null), '/patient/login')
  assert.equal(auth.guardRedirect('patient', 'tok', null), '/patient/login') // token but no role
})

test('guard: wrong role goes to own dashboard, right role is allowed', () => {
  assert.equal(auth.guardRedirect('admin', 'tok', 'patient'), '/patient/dashboard')
  assert.equal(auth.guardRedirect('patient', 'tok', 'admin'), '/admin/dashboard')
  assert.equal(auth.guardRedirect('admin', 'tok', 'admin'), true)
  assert.equal(auth.guardRedirect('patient', 'tok', 'patient'), true)
})

test('guard: tampered role cannot cause a redirect loop', () => {
  // Simulate the router following redirects; it must settle within a few hops.
  const routes = { '/patient/dashboard': 'patient', '/admin/dashboard': 'admin', '/patient/login': undefined, '/admin/login': undefined }
  for (const role of ['superadmin', '', 'Admin']) {
    let path = '/admin/dashboard'
    for (let hops = 0; hops < 5; hops++) {
      const result = auth.guardRedirect(routes[path], 'tok', role)
      if (result === true) break
      path = result
    }
    assert.ok(path.endsWith('/login'), `role ${JSON.stringify(role)} ended at ${path}`)
  }
})

test('session-expiry detection ignores failed logins', () => {
  const err = (status, url) => ({ response: { status }, config: { url } })
  assert.equal(auth.isExpiredSessionError(err(401, 'http://x/api/users/'), 'tok'), true)
  assert.equal(auth.isExpiredSessionError(err(401, 'http://x/api/token/'), 'tok'), false) // wrong password
  assert.equal(auth.isExpiredSessionError(err(401, 'http://x/api/users/'), null), false)  // already signed out
  assert.equal(auth.isExpiredSessionError(err(403, 'http://x/api/users/'), 'tok'), false)
  assert.equal(auth.isExpiredSessionError({ message: 'Network Error' }, 'tok'), false)
})
