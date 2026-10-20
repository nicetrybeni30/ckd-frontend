<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white rounded shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="admin-login-username" class="block mb-1">Username</label>
          <input id="admin-login-username" autocomplete="username"
            v-model="username"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="mb-6">
          <label for="admin-login-password" class="block mb-1">Password</label>
          <input id="admin-login-password" autocomplete="current-password"
            v-model="password"
            type="password"
            class="w-full p-2 border rounded"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>

    <!--  Error Modal -->
    <div v-if="showError" role="alertdialog" aria-modal="true" aria-live="assertive" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow text-center">
        <h2 class="text-xl font-bold text-red-600 mb-4"> Login Failed</h2>
        <p class="text-gray-700 mb-4">{{ errorMessage }}</p>
        <button @click="showError = false" class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          OK
        </button>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showToast" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-md z-50">
      🎉 Login successful! Redirecting...
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_BASE_URL } from '@/config'
import { logApiError } from '@/utils/apiError'
import { setSession, clearSession } from '@/auth'

export default {
  name: "AdminLogin",
  data() {
    return {
      username: '',
      password: '',
      showError: false,
      showToast: false,
      errorMessage: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/token/`, {
          username: this.username,
          password: this.password
        })

        const token = response.data.access

        // Only admin accounts may sign in here
        const me = await axios.get(`${API_BASE_URL}/api/patient/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (me.data.role !== 'admin') {
          clearSession()
          throw new Error('unauthorized_role')
        }
        setSession(token, 'admin')

        this.showToast = true

        setTimeout(() => {
          this.showToast = false
          this.$router.push('/admin/dashboard')
        }, 2000)
      } catch (err) {
        logApiError(' Login failed:', err)
        this.showError = true
        if (err.message === 'unauthorized_role' || (err.response && err.response.status === 401)) {
          this.errorMessage = 'Invalid username or password.'
        } else if (err.response && err.response.status === 429) {
          this.errorMessage = 'Too many login attempts. Please wait a minute and try again.'
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.'
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
