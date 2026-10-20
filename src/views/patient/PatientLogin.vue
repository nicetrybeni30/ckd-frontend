<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white rounded shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">Patient Login</h1>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="patient-login-username" class="block mb-1 text-sm font-medium text-gray-700">Username</label>
          <input id="patient-login-username" autocomplete="username" v-model="username" type="text" class="w-full p-2 border rounded" placeholder="Enter your username" required />
        </div>

        <div class="mb-6">
          <label for="patient-login-password" class="block mb-1 text-sm font-medium text-gray-700">Password</label>
          <input id="patient-login-password" autocomplete="current-password" v-model="password" type="password" class="w-full p-2 border rounded" placeholder="Enter your password" required />
        </div>

        <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </button>
      </form>

      <!-- Create Account Link -->
      <!-- <div class="mt-6 text-center text-sm text-gray-600">
        <p>Don't have an account?
          <router-link to="/patient/signup" class="text-blue-600 hover:underline">Create Account</router-link>
        </p>
      </div> -->
    </div>

    <!--  Error Modal -->
    <div v-if="showError" role="alertdialog" aria-modal="true" aria-live="assertive" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded shadow text-center">
        <h2 class="text-xl font-bold text-red-600 mb-4">Login Failed</h2>
        <p class="text-gray-700 mb-4">{{ errorMessage }}</p>
        <button @click="showError = false" class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          OK
        </button>
      </div>
    </div>

    <!--  Success Toast -->
    <div v-if="showToast" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-md z-50">
       Login successful! Redirecting...
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_BASE_URL } from '@/config'
import { logApiError } from '@/utils/apiError'
import { setSession, clearSession } from '@/auth'

export default {
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
        const res = await axios.post(`${API_BASE_URL}/api/token/`, {
          username: this.username,
          password: this.password
        })

        const token = res.data.access

        // Block admin logins silently
        const me = await axios.get(`${API_BASE_URL}/api/patient/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (me.data.role !== 'patient') {
          clearSession()
          throw new Error('unauthorized_role')
        }
        setSession(token, 'patient')

        // Valid patient login
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
          this.$router.push('/patient/dashboard')
        }, 2000)

      } catch (err) {
        logApiError('Login failed:', err)
        this.showError = true
        if (err.message === 'unauthorized_role') {
          this.errorMessage = 'Invalid username or password.'
        } else if (err.response?.status === 401) {
          this.errorMessage = 'Invalid username or password.'
        } else if (err.response?.status === 429) {
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
