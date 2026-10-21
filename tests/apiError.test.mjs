// Run with: npm test   (uses Node's built-in test runner, no extra dependencies)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { apiErrorMessage, describeApiError, logApiError } from '../src/utils/apiError.js'

// Shaped like a real axios error: axios keeps the request body and headers in error.config.
function fakeAxiosError({ status = 401, data = { detail: 'No active account' } } = {}) {
  return {
    message: `Request failed with status code ${status}`,
    config: {
      method: 'post',
      url: 'http://localhost:8000/api/token/?next=/x',
      data: JSON.stringify({ username: 'alice', password: 'SYNTHETIC-Secret-123', hemo: 9.1 }),
      headers: { Authorization: 'Bearer SYNTHETIC.JWT.TOKEN' },
    },
    request: {},
    response: { status, data },
  }
}

test('describeApiError keeps only method, path, status and message', () => {
  const summary = describeApiError(fakeAxiosError())
  assert.deepEqual(summary, {
    status: 401,
    request: 'POST /api/token/',
    message: 'Request failed with status code 401',
  })
})

test('describeApiError never contains password, token or lab values', () => {
  const dumped = JSON.stringify(describeApiError(fakeAxiosError()))
  for (const secret of ['SYNTHETIC-Secret-123', 'SYNTHETIC.JWT.TOKEN', 'hemo', '9.1', 'alice']) {
    assert.ok(!dumped.includes(secret), `leaked ${secret}`)
  }
})

test('logApiError logs the safe summary, not the raw error', () => {
  const original = console.error
  const calls = []
  console.error = (...args) => calls.push(args)
  try {
    logApiError('Login failed:', fakeAxiosError())
  } finally {
    console.error = original
  }
  assert.equal(calls.length, 1)
  assert.equal(calls[0][0], 'Login failed:')
  assert.ok(!JSON.stringify(calls[0]).includes('SYNTHETIC'))
})

test('describeApiError handles network errors and plain Errors', () => {
  assert.deepEqual(describeApiError({ message: 'Network Error', request: {}, config: { method: 'get', url: '/api/users/' } }), {
    status: 'no response', request: 'GET /api/users/', message: 'Network Error',
  })
  assert.deepEqual(describeApiError(new Error('unauthorized_role')), {
    status: undefined, request: undefined, message: 'unauthorized_role',
  })
})

test('apiErrorMessage prefers backend error, then detail, then fallback', () => {
  assert.equal(apiErrorMessage({ response: { data: { error: 'Username already exists.' } } }), 'Username already exists.')
  assert.equal(apiErrorMessage(fakeAxiosError()), 'No active account')
  assert.equal(apiErrorMessage({ response: { data: '<html>' } }, 'Fallback'), 'Fallback')
  assert.equal(apiErrorMessage(undefined, 'Fallback'), 'Fallback')
})
