<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
      <h2 class="text-3xl font-semibold text-center mb-6 text-gray-900 tracking-wide">Login</h2>
      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div class="border rounded-md px-3 py-2">
            <input v-model="email" type="text" placeholder="Enter your username" class="w-full outline-none text-sm" required />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="border rounded-md px-3 py-2">
            <input v-model="password" type="password" placeholder="Enter your password" class="w-full outline-none text-sm" required />
          </div>
        </div>
        <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150">Login</button>
        <p v-if="error" class="text-red-500 text-sm text-center mt-3">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8000/api/token/', {
          username: this.email,
          password: this.password
        })

        const token = response.data.access
        localStorage.setItem('token', token)

        // Simple redirect logic based on email
        if (this.email === 'admin@example.com') {
          this.$router.push('/admin/dashboard')
        } else {
          this.$router.push('/patient/dashboard')
        }

      } catch (err) {
        this.error = 'Invalid username or password.'
      }
    }
  }
}
</script>
